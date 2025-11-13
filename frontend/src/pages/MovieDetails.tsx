/**
 * Movie Details Page (UC6, UC7)
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon, PlayCircle as PlayIcon } from '@mui/icons-material';
import { movieService } from '../services/movieService';

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<any>(null);
  const [screenings, setScreenings] = useState<any[]>([]);
  const [trailerOpen, setTrailerOpen] = useState(false);

  useEffect(() => {
    if (id) fetchMovieDetails(id);
  }, [id]);

  const fetchMovieDetails = async (movieId: string) => {
    try {
      const response = await movieService.getMovieById(movieId);
      setMovie(response.data.movie);
      setScreenings(response.data.movie.screenings || []);
    } catch (error) {
      console.error('Failed to fetch movie:', error);
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    // Convert YouTube URL to embed URL
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  };

  const handleOpenTrailer = () => {
    setTrailerOpen(true);
  };

  const handleCloseTrailer = () => {
    setTrailerOpen(false);
  };

  if (!movie) return <Container><Typography>Loading...</Typography></Container>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <img
            src={movie.poster_url || '/placeholder-movie.jpg'}
            alt={movie.title}
            style={{ width: '100%', borderRadius: 8 }}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h3" gutterBottom>
            {movie.title}
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Chip label={movie.genre} sx={{ mr: 1 }} />
            <Chip label={movie.rating} sx={{ mr: 1 }} />
            <Chip label={`${movie.duration_in_minutes} min`} />
          </Box>
          <Typography variant="body1" paragraph>
            {movie.synopsis}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Language: {movie.language}
          </Typography>

          {movie.trailer_url && (
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<PlayIcon />}
              sx={{ mt: 2 }}
              onClick={handleOpenTrailer}
            >
              Watch Trailer
            </Button>
          )}
        </Grid>
      </Grid>

      {/* Trailer Dialog */}
      <Dialog
        open={trailerOpen}
        onClose={handleCloseTrailer}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{movie.title} - Trailer</Typography>
            <IconButton onClick={handleCloseTrailer} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
            <iframe
              src={getYouTubeEmbedUrl(movie.trailer_url)}
              title={`${movie.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none',
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>

      <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
        Select Showtime
      </Typography>
      {screenings.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No showtimes available for this movie yet.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Please check back later or contact the theatre for more information.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {screenings.map((screening: any) => (
            <Grid item xs={12} sm={6} md={4} key={screening.screening_id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">
                    {screening.auditorium_name}
                  </Typography>
                  <Typography color="text.secondary">
                    {new Date(screening.start_time).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    ₹{screening.base_ticket_price} • {screening.available_seats} seats
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 1 }}
                    onClick={() => navigate(`/book/${screening.screening_id}`)}
                  >
                    Book Now
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

export default MovieDetails;
