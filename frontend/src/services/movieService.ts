/**
 * Movie Service
 * API calls for movies (UC6, UC11, UC12)
 */

import api from './api';

export const movieService = {
  // UC6: Get all movies
  getAllMovies: async (filters?: { genre?: string; language?: string }): Promise<any> => {
    return api.get('/movies', { params: filters });
  },

  // UC6: Get movie by ID
  getMovieById: async (movieId: string): Promise<any> => {
    return api.get(`/movies/${movieId}`);
  },

  // Search movies
  searchMovies: async (query: string): Promise<any> => {
    return api.get('/movies/search', { params: { q: query } });
  },

  // UC11: Create movie (Admin)
  createMovie: async (movieData: any): Promise<any> => {
    return api.post('/movies', movieData);
  },

  // UC11: Update movie (Admin)
  updateMovie: async (movieId: string, movieData: any): Promise<any> => {
    return api.put(`/movies/${movieId}`, movieData);
  },

  // UC12: Delete movie (Admin)
  deleteMovie: async (movieId: string): Promise<any> => {
    return api.delete(`/movies/${movieId}`);
  },
};
