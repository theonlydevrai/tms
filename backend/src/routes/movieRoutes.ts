/**
 * Movie Routes
 * Routes for UC6, UC11, UC12
 */

import { Router } from 'express';
import * as movieController from '../controllers/movieController';
import { authenticate, isAdmin } from '../middleware/auth';
import { validate } from '../validators';
import { createMovieSchema, updateMovieSchema } from '../validators/schemas';

const router = Router();

/**
 * Public routes (no authentication required)
 */

// UC6: Browse movies
router.get('/', movieController.getAllMovies);

// UC6: Search movies
router.get('/search', movieController.searchMovies);

// UC6: Get movies by genre
router.get('/genre/:genre', movieController.getMoviesByGenre);

// UC6: Get movie details
router.get('/:id', movieController.getMovieById);

/**
 * Admin routes (authentication + admin role required)
 */

// UC11: Add movie
router.post('/', authenticate, isAdmin, validate(createMovieSchema), movieController.createMovie);

// UC11: Update movie
router.put('/:id', authenticate, isAdmin, validate(updateMovieSchema), movieController.updateMovie);

// UC12: Delete movie
router.delete('/:id', authenticate, isAdmin, movieController.deleteMovie);

export default router;
