/**
 * Home Page
 */

import React from 'react';
import { Container, Typography, Button, Box, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <LocalMoviesIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        <Typography variant="h2" component="h1" gutterBottom>
          Theatre Management System
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Book your favorite movies online with ease
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            sx={{ mr: 2 }}
            onClick={() => navigate('/movies')}
          >
            Browse Movies
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/register')}
          >
            Register Now
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4} sx={{ mt: 8 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Easy Booking
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Select your seats, choose your show time, and book tickets in just a few clicks.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Secure Payments
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Multiple payment options with secure gateway integration powered by Razorpay.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Digital Tickets
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Download your e-tickets with QR codes for quick and contactless entry.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
