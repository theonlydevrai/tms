/**
 * Movie Controller
 * Handles HTTP requests for movie management (UC6, UC11, UC12)
 */

import { Request, Response, NextFunction } from 'express';
import * as movieService from '../services/movieService';
import { AppError } from '../middleware/errorHandler';

/**
 * UC6: Get all movies
 * GET /api/movies
 */
export const getAllMovies = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { genre, language } = req.query;

    const movies = await movieService.getAllMovies({
      genre: genre as string,
      language: language as string,
      isActive: true,
    });

    res.status(200).json({
      status: 'success',
      data: { movies },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * UC6: Get movie by ID
 * GET /api/movies/:id
 */
export const getMovieById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const movie = await movieService.getMovieWithScreenings(id);

    res.status(200).json({
      status: 'success',
      data: { movie },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search movies
 * GET /api/movies/search?q=term
 */
export const searchMovies = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      throw new AppError('Search query is required', 400);
    }

    const movies = await movieService.searchMovies(q);

    res.status(200).json({
      status: 'success',
      data: { movies },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get movies by genre
 * GET /api/movies/genre/:genre
 */
export const getMoviesByGenre = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { genre } = req.params;

    const movies = await movieService.getMoviesByGenre(genre);

    res.status(200).json({
      status: 'success',
      data: { movies },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * UC11: Create movie (Admin only)
 * POST /api/admin/movies
 */
export const createMovie = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const movieData = {
      title: req.body.title,
      synopsis: req.body.synopsis,
      durationInMinutes: req.body.durationInMinutes,
      genre: req.body.genre,
      language: req.body.language,
      rating: req.body.rating,
      posterUrl: req.body.posterUrl,
      trailerUrl: req.body.trailerUrl,
      releaseDate: new Date(req.body.releaseDate),
    };

    const movieId = await movieService.createMovie(movieData, req.user.userId);

    res.status(201).json({
      status: 'success',
      message: 'Movie created successfully',
      data: { movieId },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * UC11: Update movie (Admin only)
 * PUT /api/admin/movies/:id
 */
export const updateMovie = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const updates: any = {};

    if (req.body.title) updates.title = req.body.title;
    if (req.body.synopsis !== undefined) updates.synopsis = req.body.synopsis;
    if (req.body.durationInMinutes) updates.durationInMinutes = req.body.durationInMinutes;
    if (req.body.genre) updates.genre = req.body.genre;
    if (req.body.language) updates.language = req.body.language;
    if (req.body.rating) updates.rating = req.body.rating;
    if (req.body.posterUrl !== undefined) updates.posterUrl = req.body.posterUrl;
    if (req.body.trailerUrl !== undefined) updates.trailerUrl = req.body.trailerUrl;
    if (req.body.releaseDate) updates.releaseDate = new Date(req.body.releaseDate);
    if (req.body.isActive !== undefined) updates.isActive = req.body.isActive;

    await movieService.updateMovie(id, updates);

    res.status(200).json({
      status: 'success',
      message: 'Movie updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * UC12: Delete movie (Admin only)
 * DELETE /api/admin/movies/:id
 */
export const deleteMovie = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    await movieService.deleteMovie(id);

    res.status(200).json({
      status: 'success',
      message: 'Movie deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
