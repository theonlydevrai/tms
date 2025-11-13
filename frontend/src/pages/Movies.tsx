/**
 * Movies Page (UC6 - Browse Movies)
 */

import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { movieService } from '../services/movieService';

const Movies: React.FC = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await movieService.getAllMovies();
      setMovies(response.data.movies || []);
    } catch (error) {
      console.error('Failed to fetch movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      fetchMovies();
      return;
    }
    try {
      const response = await movieService.searchMovies(searchQuery);
      setMovies(response.data.movies || []);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        Now Showing
      </Typography>

      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          placeholder="Search movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Box>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Grid container spacing={3}>
          {movies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} key={movie.movie_id}>
              <Card>
                <CardMedia
                  component="img"
                  height="400"
                  image={movie.poster_url || '/placeholder-movie.jpg'}
                  alt={movie.title}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {movie.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {movie.genre} • {movie.duration_in_minutes} min
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {movie.synopsis?.substring(0, 100)}...
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate(`/movies/${movie.movie_id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Movies;
