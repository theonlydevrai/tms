/**
 * Movie Service
 * Handles movie management logic (UC6, UC11, UC12)
 */

import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { query } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export interface MovieData {
  title: string;
  synopsis: string;
  durationInMinutes: number;
  genre: string;
  language: string;
  rating: string;
  posterUrl?: string;
  trailerUrl?: string;
  releaseDate: Date;
  isActive?: boolean;
}

/**
 * UC6: Browse movies (Get all active movies)
 */
export const getAllMovies = async (filters?: {
  genre?: string;
  language?: string;
  isActive?: boolean;
}): Promise<any[]> => {
  let sql = `
    SELECT movie_id, title, synopsis, duration_in_minutes, genre, language, rating,
           poster_url, trailer_url, release_date, is_active, created_at
    FROM movies
    WHERE 1=1
  `;

  const params: any[] = [];

  if (filters?.genre) {
    sql += ' AND genre = ?';
    params.push(filters.genre);
  }

  if (filters?.language) {
    sql += ' AND language = ?';
    params.push(filters.language);
  }

  if (filters?.isActive !== undefined) {
    sql += ' AND is_active = ?';
    params.push(filters.isActive);
  } else {
    // Default: only show active movies
    sql += ' AND is_active = TRUE';
  }

  sql += ' ORDER BY release_date DESC';

  const movies = await query<RowDataPacket[]>(sql, params);
  return movies;
};

/**
 * UC6: Get movie details
 */
export const getMovieById = async (movieId: string): Promise<any> => {
  const movies = await query<RowDataPacket[]>(
    `SELECT movie_id, title, synopsis, duration_in_minutes, genre, language, rating,
            poster_url, trailer_url, release_date, is_active, created_at
     FROM movies
     WHERE movie_id = ?`,
    [movieId]
  );

  if (movies.length === 0) {
    throw new AppError('Movie not found', 404);
  }

  return movies[0];
};

/**
 * Get movie with screenings
 */
export const getMovieWithScreenings = async (movieId: string): Promise<any> => {
  const movie = await getMovieById(movieId);

  // Get screenings for this movie (including past 7 days for demo purposes)
  const screenings = await query<RowDataPacket[]>(
    `SELECT s.screening_id, s.start_time, s.end_time, s.base_ticket_price, s.available_seats,
            a.auditorium_id, a.name AS auditorium_name, a.screen_number
     FROM screenings s
     JOIN auditoriums a ON s.auditorium_id = a.auditorium_id
     WHERE s.movie_id = ? AND s.is_active = TRUE
     ORDER BY s.start_time ASC`,
    [movieId]
  );

  return {
    ...movie,
    screenings,
  };
};

/**
 * UC11: Add movie (Administrator only)
 */
export const createMovie = async (movieData: MovieData, createdBy: string): Promise<string> => {
  const movieId = `movie-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  await query<ResultSetHeader>(
    `INSERT INTO movies (
      movie_id, title, synopsis, duration_in_minutes, genre, language, rating,
      poster_url, trailer_url, release_date, is_active, created_by, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, ?, NOW(), NOW())`,
    [
      movieId,
      movieData.title,
      movieData.synopsis,
      movieData.durationInMinutes,
      movieData.genre,
      movieData.language,
      movieData.rating,
      movieData.posterUrl || null,
      movieData.trailerUrl || null,
      movieData.releaseDate,
      createdBy,
    ]
  );

  return movieId;
};

/**
 * UC11: Update movie (Administrator only)
 */
export const updateMovie = async (movieId: string, updates: Partial<MovieData>): Promise<boolean> => {
  // Check if movie exists
  await getMovieById(movieId);

  const updateFields: string[] = [];
  const params: any[] = [];

  if (updates.title) {
    updateFields.push('title = ?');
    params.push(updates.title);
  }

  if (updates.synopsis) {
    updateFields.push('synopsis = ?');
    params.push(updates.synopsis);
  }

  if (updates.durationInMinutes) {
    updateFields.push('duration_in_minutes = ?');
    params.push(updates.durationInMinutes);
  }

  if (updates.genre) {
    updateFields.push('genre = ?');
    params.push(updates.genre);
  }

  if (updates.language) {
    updateFields.push('language = ?');
    params.push(updates.language);
  }

  if (updates.rating) {
    updateFields.push('rating = ?');
    params.push(updates.rating);
  }

  if (updates.posterUrl !== undefined) {
    updateFields.push('poster_url = ?');
    params.push(updates.posterUrl);
  }

  if (updates.trailerUrl !== undefined) {
    updateFields.push('trailer_url = ?');
    params.push(updates.trailerUrl);
  }

  if (updates.releaseDate) {
    updateFields.push('release_date = ?');
    params.push(updates.releaseDate);
  }

  if (updates.isActive !== undefined) {
    updateFields.push('is_active = ?');
    params.push(updates.isActive ? 1 : 0);
  }

  if (updateFields.length === 0) {
    throw new AppError('No valid fields to update', 400);
  }

  updateFields.push('updated_at = NOW()');
  params.push(movieId);

  await query<ResultSetHeader>(
    `UPDATE movies SET ${updateFields.join(', ')} WHERE movie_id = ?`,
    params
  );

  return true;
};

/**
 * UC12: Delete movie (soft delete - mark as inactive)
 */
export const deleteMovie = async (movieId: string): Promise<boolean> => {
  // Check if movie exists
  await getMovieById(movieId);

  // Soft delete - mark as inactive
  await query<ResultSetHeader>(
    'UPDATE movies SET is_active = FALSE, updated_at = NOW() WHERE movie_id = ?',
    [movieId]
  );

  // Also deactivate all future screenings for this movie
  await query<ResultSetHeader>(
    `UPDATE screenings 
     SET is_active = FALSE 
     WHERE movie_id = ? AND start_time > NOW()`,
    [movieId]
  );

  return true;
};

/**
 * Search movies by title
 */
export const searchMovies = async (searchTerm: string): Promise<any[]> => {
  const movies = await query<RowDataPacket[]>(
    `SELECT movie_id, title, synopsis, duration_in_minutes, genre, language, rating,
            poster_url, trailer_url, release_date
     FROM movies
     WHERE is_active = TRUE AND (title LIKE ? OR synopsis LIKE ?)
     ORDER BY release_date DESC
     LIMIT 20`,
    [`%${searchTerm}%`, `%${searchTerm}%`]
  );

  return movies;
};

/**
 * Get movies by genre
 */
export const getMoviesByGenre = async (genre: string): Promise<any[]> => {
  const movies = await query<RowDataPacket[]>(
    `SELECT movie_id, title, synopsis, duration_in_minutes, genre, language, rating,
            poster_url, trailer_url, release_date
     FROM movies
     WHERE is_active = TRUE AND genre = ?
     ORDER BY release_date DESC`,
    [genre]
  );

  return movies;
};
