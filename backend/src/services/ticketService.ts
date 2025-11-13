/**
 * Ticket Service
 * Handles ticket generation with PDF and QR code (UC10)
 */

import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { query } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { generateTicketPDF, TicketData } from '../utils/pdf';
import * as bookingService from './bookingService';

/**
 * UC10: Generate ticket for booking
 */
export const generateTicket = async (bookingId: string): Promise<{ ticketId: string; pdfBuffer: Buffer }> => {
  // Get booking details
  const booking = await bookingService.getBookingById(bookingId);

  if (booking.status !== 'CONFIRMED') {
    throw new AppError('Can only generate tickets for confirmed bookings', 400);
  }

  // Check if ticket already exists
  const existingTickets = await query<RowDataPacket[]>(
    'SELECT ticket_id, ticket_number FROM tickets WHERE booking_id = ?',
    [bookingId]
  );

  let ticketId: string;
  let ticketNumber: string;

  if (existingTickets.length > 0) {
    // Ticket already exists, use existing data
    ticketId = existingTickets[0].ticket_id;
    ticketNumber = existingTickets[0].ticket_number;
  } else {
    // Generate new ticket
    const timestamp = Date.now();
    ticketId = `ticket-${timestamp}-${Math.random().toString(36).substr(2, 9)}`;
    ticketNumber = `TKT${timestamp.toString().substring(timestamp.toString().length - 10)}`;

    // Generate QR code data
    const qrCodeData = JSON.stringify({
      ticketId,
      bookingId,
      bookingCode: booking.booking_code,
      screeningId: booking.screening_id,
      timestamp,
    });

    // Save ticket to database
    await query<ResultSetHeader>(
      `INSERT INTO tickets (ticket_id, booking_id, qr_code_data, ticket_number, is_used, created_at) 
       VALUES (?, ?, ?, ?, FALSE, NOW())`,
      [ticketId, bookingId, qrCodeData, ticketNumber]
    );
  }

  // Get customer details
  const customers = await query<RowDataPacket[]>(
    `SELECT u.name, u.email
     FROM bookings b
     JOIN customers c ON b.customer_id = c.customer_id
     JOIN users u ON c.user_id = u.user_id
     WHERE b.booking_id = ?`,
    [bookingId]
  );

  const customerName = customers[0]?.name || 'Customer';

  // Format seat labels
  const seatLabels = booking.seats.map((seat: any) => `${seat.row_label}${seat.seat_number}`);

  // Generate PDF
  const ticketData: TicketData = {
    ticketId,
    bookingCode: booking.booking_code,
    customerName,
    movieTitle: booking.movie_title,
    screeningTime: new Date(booking.start_time).toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'short',
    }),
    auditoriumName: booking.auditorium_name,
    seats: seatLabels,
    totalAmount: booking.total_amount,
    qrCodeData: JSON.stringify({ ticketId, bookingId }),
  };

  const pdfBuffer = await generateTicketPDF(ticketData);

  return { ticketId, pdfBuffer };
};

/**
 * Get ticket by ID
 */
export const getTicketById = async (ticketId: string): Promise<any> => {
  const tickets = await query<RowDataPacket[]>(
    'SELECT * FROM tickets WHERE ticket_id = ?',
    [ticketId]
  );

  if (tickets.length === 0) {
    throw new AppError('Ticket not found', 404);
  }

  return tickets[0];
};

/**
 * Verify and use ticket (for entry)
 */
export const verifyTicket = async (ticketId: string): Promise<boolean> => {
  const ticket = await getTicketById(ticketId);

  if (ticket.is_used) {
    throw new AppError('Ticket already used', 400);
  }

  // Mark ticket as used
  await query<ResultSetHeader>(
    'UPDATE tickets SET is_used = TRUE, used_at = NOW() WHERE ticket_id = ?',
    [ticketId]
  );

  return true;
};
