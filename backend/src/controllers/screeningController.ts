/**
 * Screening Controller
 * Handles HTTP requests for UC14: Manage Screenings and UC15: Cancel Screening
 * Author: Dev Rai (2024301022)
 */

import { Request, Response, NextFunction } from 'express';
import * as screeningService from '../services/screeningService';

/**
 * UC14: Create Screening (Admin only)
 * POST /api/screenings
 */
export const createScreening = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Handle both snake_case and camelCase
    const movieId = req.body.movieId || req.body.movie_id;
    const auditoriumId = req.body.auditoriumId || req.body.auditorium_id;
    const startTime = req.body.startTime || req.body.start_time;
    const baseTicketPrice = req.body.baseTicketPrice || req.body.base_ticket_price;
    const createdBy = req.user?.userId;

    if (!createdBy) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Calculate end time based on movie duration
    const movieDuration = await screeningService.getMovieDuration(movieId);
    const startDate = new Date(startTime);
    const endDate = new Date(startDate.getTime() + movieDuration * 60000); // Convert minutes to milliseconds

    const screening = await screeningService.createScreening(
      {
        movieId,
        auditoriumId,
        startTime: startDate,
        endTime: endDate,
        baseTicketPrice: parseFloat(baseTicketPrice)
      },
      createdBy
    );

    res.status(201).json({
      status: 'success',
      message: 'Screening created successfully',
      data: { screening }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all screenings with optional filters
 * GET /api/screenings
 */
export const getAllScreenings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { movieId, auditoriumId, startDate, endDate, isActive } = req.query;

    const filters: any = {};

    if (movieId) {
      filters.movieId = movieId as string;
    }

    if (auditoriumId) {
      filters.auditoriumId = auditoriumId as string;
    }

    if (startDate) {
      filters.startDate = new Date(startDate as string);
    }

    if (endDate) {
      filters.endDate = new Date(endDate as string);
    }

    if (isActive !== undefined) {
      filters.isActive = isActive === 'true';
    }

    const screenings = await screeningService.getAllScreenings(filters);

    res.status(200).json({
      count: screenings.length,
      screenings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get screening by ID
 * GET /api/screenings/:id
 */
export const getScreeningById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const screening = await screeningService.getScreeningById(id);

    res.status(200).json({ 
      status: 'success',
      data: { screening }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get upcoming screenings for a movie
 * GET /api/screenings/movie/:movieId
 */
export const getUpcomingScreeningsByMovie = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { movieId } = req.params;

    const screenings = await screeningService.getUpcomingScreeningsByMovie(
      movieId
    );

    res.status(200).json({
      count: screenings.length,
      screenings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * UC14: Update Screening (Admin only)
 * PUT /api/screenings/:id
 */
export const updateScreening = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Convert string values to appropriate types
    if (updates.startTime) updates.startTime = new Date(updates.startTime);
    if (updates.endTime) updates.endTime = new Date(updates.endTime);
    if (updates.baseTicketPrice) updates.baseTicketPrice = parseFloat(updates.baseTicketPrice);

    const screening = await screeningService.updateScreening(id, updates);

    res.status(200).json({
      message: 'Screening updated successfully',
      screening
    });
  } catch (error) {
    next(error);
  }
};

/**
 * UC15: Cancel Screening (Admin only)
 * DELETE /api/screenings/:id
 */
export const cancelScreening = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const cancelledBy = req.user?.userId;

    if (!cancelledBy) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    await screeningService.cancelScreening(id, cancelledBy);

    res.status(200).json({
      message: 'Screening cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Check seat availability for a screening
 * POST /api/screenings/:id/check-availability
 */
export const checkSeatAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { seatIds } = req.body;

    const isAvailable = await screeningService.checkSeatAvailability(
      id,
      seatIds
    );

    res.status(200).json({ available: isAvailable });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all seats for a screening with availability status
 * GET /api/screenings/:id/seats
 */
export const getScreeningSeats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const seats = await screeningService.getScreeningSeats(id);

    res.status(200).json({
      status: 'success',
      data: { seats }
    });
  } catch (error) {
    next(error);
  }
};
