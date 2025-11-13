/**
 * Booking Controller
 */

import { Request, Response, NextFunction } from 'express';
import * as bookingService from '../services/bookingService';
import { AppError } from '../middleware/errorHandler';

export const createBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Authentication required', 401);

    const { screeningId, seatIds } = req.body;

    // Get customer ID from user ID
    const customerId = await bookingService.getCustomerIdFromUserId(req.user.userId);

    const result = await bookingService.createBooking(customerId, screeningId, seatIds);

    res.status(201).json({
      status: 'success',
      message: 'Booking created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const booking = await bookingService.getBookingById(id);

    res.status(200).json({
      status: 'success',
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyBookings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) throw new AppError('Authentication required', 401);

    // Get customer ID from user ID
    const customerId = await bookingService.getCustomerIdFromUserId(req.user.userId);

    const bookings = await bookingService.getCustomerBookings(customerId);

    res.status(200).json({
      status: 'success',
      data: { bookings },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBookings = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const bookings = await bookingService.getAllBookings();

    res.status(200).json({
      status: 'success',
      data: { bookings },
    });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await bookingService.cancelBooking(id);

    res.status(200).json({
      status: 'success',
      message: 'Booking cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
};
