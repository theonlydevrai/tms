/**
 * Booking Service
 * Handles ticket booking logic (UC8)
 */

import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { query } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { BookingStatus, SeatStatus } from '../types';
// import { sendBookingConfirmationEmail } from '../utils/email'; // TODO: Implement email sending

/**
 * Get customer ID from user ID
 */
export const getCustomerIdFromUserId = async (userId: string): Promise<string> => {
  const customers = await query<RowDataPacket[]>(
    'SELECT customer_id FROM customers WHERE user_id = ?',
    [userId]
  );

  if (customers.length === 0) {
    throw new AppError('Customer not found', 404);
  }

  return customers[0].customer_id;
};

/**
 * UC8: Create booking
 */
export const createBooking = async (
  customerId: string,
  screeningId: string,
  seatIds: string[]
): Promise<{ bookingId: string; bookingCode: string; totalAmount: number }> => {
  // Validate screening exists and is active
  const screenings = await query<RowDataPacket[]>(
    `SELECT s.screening_id, s.available_seats, s.base_ticket_price, s.start_time,
            m.title AS movie_title, a.name AS auditorium_name
     FROM screenings s
     JOIN movies m ON s.movie_id = m.movie_id
     JOIN auditoriums a ON s.auditorium_id = a.auditorium_id
     WHERE s.screening_id = ? AND s.is_active = TRUE`,
    [screeningId]
  );

  if (screenings.length === 0) {
    throw new AppError('Screening not found or no longer available', 404);
  }

  const screening = screenings[0];

  // Check if enough seats available
  if (screening.available_seats < seatIds.length) {
    throw new AppError('Not enough seats available', 400);
  }

  // Validate all seats exist and are available
  for (const seatId of seatIds) {
    const seats = await query<RowDataPacket[]>(
      `SELECT bs.seat_id, bs.status 
       FROM booking_seats bs
       WHERE bs.seat_id = ? AND bs.screening_id = ?`,
      [seatId, screeningId]
    );

    if (seats.length > 0 && seats[0].status !== 'AVAILABLE') {
      throw new AppError(`Seat ${seatId} is not available`, 400);
    }
  }

  // Generate booking ID and code
  const bookingId = `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const bookingCode = `BK${Date.now().toString().slice(-8)}`;

  // Calculate total amount (can add seat type pricing later)
  const totalAmount = screening.base_ticket_price * seatIds.length;

  // Create booking
  await query<ResultSetHeader>(
    `INSERT INTO bookings (
      booking_id, customer_id, screening_id, booking_time, total_amount,
      number_of_seats, status, booking_code, created_at, updated_at
    ) VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, NOW(), NOW())`,
    [bookingId, customerId, screeningId, totalAmount, seatIds.length, BookingStatus.PENDING, bookingCode]
  );

  // Reserve seats
  for (const seatId of seatIds) {
    await query<ResultSetHeader>(
      `INSERT INTO booking_seats (booking_id, seat_id, screening_id, price, status, locked_at, locked_until)
       VALUES (?, ?, ?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 10 MINUTE))`,
      [bookingId, seatId, screeningId, screening.base_ticket_price, SeatStatus.BOOKED]
    );
  }

  // Update available seats
  await query<ResultSetHeader>(
    'UPDATE screenings SET available_seats = available_seats - ? WHERE screening_id = ?',
    [seatIds.length, screeningId]
  );

  return { bookingId, bookingCode, totalAmount };
};

/**
 * Get booking by ID
 */
export const getBookingById = async (bookingId: string): Promise<any> => {
  const bookings = await query<RowDataPacket[]>(
    `SELECT b.booking_id, b.booking_code, b.booking_time, b.total_amount, b.number_of_seats, b.status,
            s.screening_id, s.start_time, s.end_time,
            m.movie_id, m.title AS movie_title, m.poster_url,
            a.auditorium_id, a.name AS auditorium_name
     FROM bookings b
     JOIN screenings s ON b.screening_id = s.screening_id
     JOIN movies m ON s.movie_id = m.movie_id
     JOIN auditoriums a ON s.auditorium_id = a.auditorium_id
     WHERE b.booking_id = ?`,
    [bookingId]
  );

  if (bookings.length === 0) {
    throw new AppError('Booking not found', 404);
  }

  const booking = bookings[0];

  // Get booked seats
  const seats = await query<RowDataPacket[]>(
    `SELECT s.seat_id, s.row_label, s.seat_number, bs.price
     FROM booking_seats bs
     JOIN seats s ON bs.seat_id = s.seat_id
     WHERE bs.booking_id = ?`,
    [bookingId]
  );

  return {
    ...booking,
    seats,
  };
};

/**
 * Confirm booking after payment
 */
export const confirmBooking = async (bookingId: string): Promise<boolean> => {
  await query<ResultSetHeader>(
    'UPDATE bookings SET status = ?, updated_at = NOW() WHERE booking_id = ?',
    [BookingStatus.CONFIRMED, bookingId]
  );

  return true;
};

/**
 * Cancel booking
 */
export const cancelBooking = async (bookingId: string): Promise<boolean> => {
  const booking = await getBookingById(bookingId);

  // Release seats
  await query<ResultSetHeader>(
    'DELETE FROM booking_seats WHERE booking_id = ?',
    [bookingId]
  );

  // Update available seats
  await query<ResultSetHeader>(
    'UPDATE screenings SET available_seats = available_seats + ? WHERE screening_id = ?',
    [booking.number_of_seats, booking.screening_id]
  );

  // Update booking status
  await query<ResultSetHeader>(
    'UPDATE bookings SET status = ?, updated_at = NOW() WHERE booking_id = ?',
    [BookingStatus.CANCELLED, bookingId]
  );

  return true;
};

/**
 * Get customer bookings
 */
export const getCustomerBookings = async (customerId: string): Promise<any[]> => {
  const bookings = await query<RowDataPacket[]>(
    `SELECT b.booking_id, b.booking_code, b.booking_time, b.total_amount, b.number_of_seats, b.status,
            s.start_time, m.title AS movie_title, m.poster_url, a.name AS auditorium_name
     FROM bookings b
     JOIN screenings s ON b.screening_id = s.screening_id
     JOIN movies m ON s.movie_id = m.movie_id
     JOIN auditoriums a ON s.auditorium_id = a.auditorium_id
     WHERE b.customer_id = ?
     ORDER BY b.created_at DESC`,
    [customerId]
  );

  return bookings;
};

/**
 * Get all bookings (Admin only)
 */
export const getAllBookings = async (): Promise<any[]> => {
  const bookings = await query<RowDataPacket[]>(
    `SELECT b.*, u.name as customer_name, u.email as customer_email,
            m.title as movie_title, s.start_time as screening_time
     FROM bookings b
     JOIN customers c ON b.customer_id = c.customer_id
     JOIN users u ON c.user_id = u.user_id
     JOIN screenings s ON b.screening_id = s.screening_id
     JOIN movies m ON s.movie_id = m.movie_id
     ORDER BY b.booking_time DESC`
  );

  return bookings;
};
