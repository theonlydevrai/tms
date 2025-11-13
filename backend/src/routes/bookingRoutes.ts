/**
 * Booking Routes
 */

import { Router } from 'express';
import * as bookingController from '../controllers/bookingController';
import { authenticate, isAdmin } from '../middleware/auth';
import { validate } from '../validators';
import { createBookingSchema } from '../validators/schemas';

const router = Router();

// All booking routes require authentication
router.use(authenticate);

// UC8: Create booking
router.post('/', validate(createBookingSchema), bookingController.createBooking);

// Get my bookings
router.get('/my-bookings', bookingController.getMyBookings);

// Admin: Get all bookings
router.get('/admin/all', isAdmin, bookingController.getAllBookings);

// Get booking by ID
router.get('/:id', bookingController.getBooking);

// Cancel booking
router.delete('/:id', bookingController.cancelBooking);

export default router;
