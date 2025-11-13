/**
 * Screening Service
 * Handles business logic for UC14: Manage Screenings and UC15: Cancel Screening
 * Author: Dev Rai (2024301022)
 */

import { query } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface ScreeningData {
  movieId: string;
  auditoriumId: string;
  startTime: Date;
  endTime: Date;
  baseTicketPrice: number;
}

interface Screening {
  screeningId: string;
  movieId: string;
  auditoriumId: string;
  startTime: Date;
  endTime: Date;
  baseTicketPrice: number;
  availableSeats: number;
  isActive: boolean;
  movieTitle?: string;
  auditoriumName?: string;
}

/**
 * UC14: Create Screening (Admin)
 * Creates a new screening for a movie in an auditorium
 */
export const createScreening = async (
  screeningData: ScreeningData,
  createdBy: string
): Promise<Screening> => {
  try {
    // Validate movie exists
    const movieCheck = await query<RowDataPacket[]>(
      'SELECT movie_id FROM movies WHERE movie_id = ? AND is_active = TRUE',
      [screeningData.movieId]
    );

    if (movieCheck.length === 0) {
      throw new AppError('Movie not found or inactive', 404);
    }

    // Validate auditorium exists
    const auditoriumCheck = await query<RowDataPacket[]>(
      'SELECT auditorium_id, capacity FROM auditoriums WHERE auditorium_id = ?',
      [screeningData.auditoriumId]
    );

    if (auditoriumCheck.length === 0) {
      throw new AppError('Auditorium not found', 404);
    }

    const auditoriumCapacity = auditoriumCheck[0].capacity;

    // Check for overlapping screenings in the same auditorium
    const overlapCheck = await query<RowDataPacket[]>(
      `SELECT screening_id FROM screenings 
       WHERE auditorium_id = ? 
       AND is_active = TRUE
       AND (
         (start_time <= ? AND end_time >= ?) OR
         (start_time <= ? AND end_time >= ?) OR
         (start_time >= ? AND end_time <= ?)
       )`,
      [
        screeningData.auditoriumId,
        screeningData.startTime, screeningData.startTime,
        screeningData.endTime, screeningData.endTime,
        screeningData.startTime, screeningData.endTime
      ]
    );

    if (overlapCheck.length > 0) {
      throw new AppError(
        'Screening time overlaps with existing screening in this auditorium',
        400
      );
    }

    // Validate start time is in the future
    if (new Date(screeningData.startTime) <= new Date()) {
      throw new AppError('Screening start time must be in the future', 400);
    }

    // Validate end time is after start time
    if (new Date(screeningData.endTime) <= new Date(screeningData.startTime)) {
      throw new AppError('End time must be after start time', 400);
    }

    // Insert screening
    const result = await query<ResultSetHeader>(
      `INSERT INTO screenings 
       (movie_id, auditorium_id, start_time, end_time, base_ticket_price, available_seats, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        screeningData.movieId,
        screeningData.auditoriumId,
        screeningData.startTime,
        screeningData.endTime,
        screeningData.baseTicketPrice,
        auditoriumCapacity, // Initially all seats are available
        createdBy
      ]
    );

    // Get the created screening with movie and auditorium details
    const screening = await getScreeningById(result.insertId);

    return screening;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to create screening', 500);
  }
};

/**
 * Get screening by ID with movie and auditorium details
 */
export const getScreeningById = async (screeningId: string | number): Promise<Screening> => {
  try {
    const screenings = await query<RowDataPacket[]>(
      `SELECT 
        s.screening_id as screeningId,
        s.movie_id as movieId,
        s.auditorium_id as auditoriumId,
        s.start_time as startTime,
        s.end_time as endTime,
        s.base_ticket_price as baseTicketPrice,
        s.available_seats as availableSeats,
        s.is_active as isActive,
        m.title as movieTitle,
        a.name as auditoriumName
       FROM screenings s
       LEFT JOIN movies m ON s.movie_id = m.movie_id
       LEFT JOIN auditoriums a ON s.auditorium_id = a.auditorium_id
       WHERE s.screening_id = ?`,
      [screeningId]
    );

    if (screenings.length === 0) {
      throw new AppError('Screening not found', 404);
    }

    return screenings[0] as Screening;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to fetch screening', 500);
  }
};

/**
 * Get all screenings with optional filters
 */
export const getAllScreenings = async (filters?: {
  movieId?: string;
  auditoriumId?: string;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
}): Promise<Screening[]> => {
  try {
    let sql = `
      SELECT 
        s.screening_id as screeningId,
        s.movie_id as movieId,
        s.auditorium_id as auditoriumId,
        s.start_time as startTime,
        s.end_time as endTime,
        s.base_ticket_price as baseTicketPrice,
        s.available_seats as availableSeats,
        s.is_active as isActive,
        m.title as movieTitle,
        m.poster_url as posterUrl,
        a.name as auditoriumName
      FROM screenings s
      LEFT JOIN movies m ON s.movie_id = m.movie_id
      LEFT JOIN auditoriums a ON s.auditorium_id = a.auditorium_id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (filters?.movieId) {
      sql += ' AND s.movie_id = ?';
      params.push(filters.movieId);
    }

    if (filters?.auditoriumId) {
      sql += ' AND s.auditorium_id = ?';
      params.push(filters.auditoriumId);
    }

    if (filters?.startDate) {
      sql += ' AND s.start_time >= ?';
      params.push(filters.startDate);
    }

    if (filters?.endDate) {
      sql += ' AND s.start_time <= ?';
      params.push(filters.endDate);
    }

    if (filters?.isActive !== undefined) {
      sql += ' AND s.is_active = ?';
      params.push(filters.isActive);
    }

    sql += ' ORDER BY s.start_time ASC';

    const screenings = await query<RowDataPacket[]>(sql, params);

    return screenings as Screening[];
  } catch (error) {
    throw new AppError('Failed to fetch screenings', 500);
  }
};

/**
 * UC14: Update Screening (Admin)
 * Updates screening details
 */
export const updateScreening = async (
  screeningId: string,
  updates: Partial<ScreeningData>
): Promise<Screening> => {
  try {
    // Check if screening exists
    const screening = await getScreeningById(screeningId);

    if (!screening.isActive) {
      throw new AppError('Cannot update cancelled screening', 400);
    }

    // Check if screening has started
    if (new Date(screening.startTime) <= new Date()) {
      throw new AppError('Cannot update screening that has already started', 400);
    }

    // If time is being updated, check for overlaps
    if (updates.startTime || updates.endTime || updates.auditoriumId) {
      const startTime = updates.startTime || screening.startTime;
      const endTime = updates.endTime || screening.endTime;
      const auditoriumId = updates.auditoriumId || screening.auditoriumId;

      const overlapCheck = await query<RowDataPacket[]>(
        `SELECT screening_id FROM screenings 
         WHERE auditorium_id = ? 
         AND screening_id != ?
         AND is_active = TRUE
         AND (
           (start_time <= ? AND end_time >= ?) OR
           (start_time <= ? AND end_time >= ?) OR
           (start_time >= ? AND end_time <= ?)
         )`,
        [
          auditoriumId,
          screeningId,
          startTime, startTime,
          endTime, endTime,
          startTime, endTime
        ]
      );

      if (overlapCheck.length > 0) {
        throw new AppError('Updated time overlaps with existing screening', 400);
      }
    }

    // Build update query dynamically
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    if (updates.movieId !== undefined) {
      updateFields.push('movie_id = ?');
      updateValues.push(updates.movieId);
    }

    if (updates.auditoriumId !== undefined) {
      updateFields.push('auditorium_id = ?');
      updateValues.push(updates.auditoriumId);
    }

    if (updates.startTime !== undefined) {
      updateFields.push('start_time = ?');
      updateValues.push(updates.startTime);
    }

    if (updates.endTime !== undefined) {
      updateFields.push('end_time = ?');
      updateValues.push(updates.endTime);
    }

    if (updates.baseTicketPrice !== undefined) {
      updateFields.push('base_ticket_price = ?');
      updateValues.push(updates.baseTicketPrice);
    }

    if (updateFields.length === 0) {
      throw new AppError('No fields to update', 400);
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(screeningId);

    await query(
      `UPDATE screenings SET ${updateFields.join(', ')} WHERE screening_id = ?`,
      updateValues
    );

    // Return updated screening
    return await getScreeningById(screeningId);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to update screening', 500);
  }
};

/**
 * UC15: Cancel Screening (Admin)
 * Cancels a screening - soft delete
 */
export const cancelScreening = async (
  screeningId: string,
  _cancelledBy: string // Prefixed with _ to indicate intentionally unused
): Promise<void> => {
  try {
    // Check if screening exists
    const screening = await getScreeningById(screeningId);

    if (!screening.isActive) {
      throw new AppError('Screening is already cancelled', 400);
    }

    // Check if there are any confirmed bookings
    const bookingsCheck = await query<RowDataPacket[]>(
      `SELECT COUNT(*) as count FROM bookings 
       WHERE screening_id = ? AND status IN ('CONFIRMED', 'PENDING')`,
      [screeningId]
    );

    const bookingCount = bookingsCheck[0].count;

    if (bookingCount > 0) {
      throw new AppError(
        `Cannot cancel screening with ${bookingCount} active booking(s). Please cancel all bookings first.`,
        400
      );
    }

    // Soft delete - set is_active to FALSE
    await query(
      `UPDATE screenings 
       SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP 
       WHERE screening_id = ?`,
      [screeningId]
    );
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Failed to cancel screening', 500);
  }
};

/**
 * Get upcoming screenings for a movie
 */
export const getUpcomingScreeningsByMovie = async (
  movieId: string
): Promise<Screening[]> => {
  try {
    const now = new Date();

    const screenings = await query<RowDataPacket[]>(
      `SELECT 
        s.screening_id as screeningId,
        s.movie_id as movieId,
        s.auditorium_id as auditoriumId,
        s.start_time as startTime,
        s.end_time as endTime,
        s.base_ticket_price as baseTicketPrice,
        s.available_seats as availableSeats,
        s.is_active as isActive,
        a.name as auditoriumName
       FROM screenings s
       LEFT JOIN auditoriums a ON s.auditorium_id = a.auditorium_id
       WHERE s.movie_id = ? 
       AND s.is_active = TRUE 
       AND s.start_time > ?
       ORDER BY s.start_time ASC`,
      [movieId, now]
    );

    return screenings as Screening[];
  } catch (error) {
    throw new AppError('Failed to fetch upcoming screenings', 500);
  }
};

/**
 * Check seat availability for a screening
 */
export const checkSeatAvailability = async (
  screeningId: string,
  seatIds: string[]
): Promise<boolean> => {
  try {
    if (seatIds.length === 0) {
      return true;
    }

    // Check if all requested seats are available
    const unavailableSeats = await query<RowDataPacket[]>(
      `SELECT seat_id 
       FROM seat_reservations 
       WHERE screening_id = ? 
       AND seat_id IN (?)
       AND status = 'RESERVED'`,
      [screeningId, seatIds]
    );

    return unavailableSeats.length === 0;
  } catch (error) {
    throw new AppError('Failed to check seat availability', 500);
  }
};

/**
 * Get all seats for a screening with availability status
 */
export const getScreeningSeats = async (screeningId: string): Promise<any[]> => {
  try {
    // Get the auditorium for this screening
    const screenings = await query<RowDataPacket[]>(
      'SELECT auditorium_id FROM screenings WHERE screening_id = ?',
      [screeningId]
    );

    if (screenings.length === 0) {
      throw new AppError('Screening not found', 404);
    }

    const auditoriumId = screenings[0].auditorium_id;

    // Get all seats for the auditorium with availability status for this screening
    const seats = await query<RowDataPacket[]>(
      `SELECT 
        s.seat_id,
        s.row_label,
        s.seat_number,
        s.seat_type,
        s.base_price,
        CASE 
          WHEN bs.seat_id IS NOT NULL THEN FALSE
          ELSE TRUE
        END AS is_available
       FROM seats s
       LEFT JOIN booking_seats bs ON s.seat_id = bs.seat_id 
         AND bs.screening_id = ? 
         AND bs.status IN ('LOCKED', 'BOOKED')
       WHERE s.auditorium_id = ?
       ORDER BY s.row_label, s.seat_number`,
      [screeningId, auditoriumId]
    );

    return seats;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to fetch screening seats', 500);
  }
};

/**
 * Helper function to get movie duration
 */
export const getMovieDuration = async (movieId: string): Promise<number> => {
  const movies = await query<RowDataPacket[]>(
    'SELECT duration_in_minutes FROM movies WHERE movie_id = ?',
    [movieId]
  );

  if (movies.length === 0) {
    throw new AppError('Movie not found', 404);
  }

  return movies[0].duration_in_minutes;
};
