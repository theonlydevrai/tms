/**
 * Screening Routes
 * API endpoints for UC14: Manage Screenings and UC15: Cancel Screening
 * Author: Dev Rai (2024301022)
 */

import express from 'express';
import * as screeningController from '../controllers/screeningController';
import { authenticate, isAdmin } from '../middleware/auth';
import { validate } from '../validators';
import {
  createScreeningSchema,
  updateScreeningSchema
} from '../validators/schemas';

const router = express.Router();

/**
 * Public Routes
 */

// Get all screenings (with optional filters)
// GET /api/screenings?movieId=1&auditoriumId=2&startDate=2024-01-01&isActive=true
router.get(
  '/',
  screeningController.getAllScreenings
);

// Get screening by ID
// GET /api/screenings/:id
router.get(
  '/:id',
  screeningController.getScreeningById
);

// Get all seats for a screening with availability
// GET /api/screenings/:id/seats
router.get(
  '/:id/seats',
  screeningController.getScreeningSeats
);

// Get upcoming screenings for a specific movie
// GET /api/screenings/movie/:movieId
router.get(
  '/movie/:movieId',
  screeningController.getUpcomingScreeningsByMovie
);

/**
 * Protected Routes (Admin only)
 */

// UC14: Create new screening (Admin only)
// POST /api/screenings
router.post(
  '/',
  authenticate,
  isAdmin,
  validate(createScreeningSchema),
  screeningController.createScreening
);

// UC14: Update screening (Admin only)
// PUT /api/screenings/:id
router.put(
  '/:id',
  authenticate,
  isAdmin,
  validate(updateScreeningSchema),
  screeningController.updateScreening
);

// UC15: Cancel screening (Admin only)
// DELETE /api/screenings/:id
router.delete(
  '/:id',
  authenticate,
  isAdmin,
  screeningController.cancelScreening
);

// Check seat availability for a screening
// POST /api/screenings/:id/check-availability
router.post(
  '/:id/check-availability',
  screeningController.checkSeatAvailability
);

export default router;
