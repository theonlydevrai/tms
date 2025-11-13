/**
 * Book Ticket Page - Simplified (UC8)
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { bookingService, paymentService } from '../services/bookingService';
import api from '../services/api';

interface Seat {
  seat_id: string;
  row_label: string;
  seat_number: number;
  seat_type: string;
  base_price: number;
  is_available: boolean;
}

interface Screening {
  screeningId: string;
  movieTitle: string;
  startTime: string;
  baseTicketPrice: number;
  auditoriumName: string;
}

const BookTicket: React.FC = () => {
  const { screeningId } = useParams<{ screeningId: string }>();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [screening, setScreening] = useState<Screening | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchScreeningAndSeats();
  }, [screeningId]);

  const fetchScreeningAndSeats = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch screening details
      const screeningResponse = await api.get(`/screenings/${screeningId}`) as any;
      console.log('Screening response:', screeningResponse);
      
      if (screeningResponse && screeningResponse.data && screeningResponse.data.screening) {
        setScreening(screeningResponse.data.screening);
      } else {
        console.error('Invalid screening structure:', screeningResponse);
        throw new Error('Invalid screening response structure');
      }

      // Fetch available seats for this screening
      const seatsResponse = await api.get(`/screenings/${screeningId}/seats`) as any;
      console.log('Seats response:', seatsResponse);
      
      if (seatsResponse && seatsResponse.data && seatsResponse.data.seats) {
        setSeats(seatsResponse.data.seats);
      } else {
        console.error('Invalid seats structure:', seatsResponse);
        throw new Error('Invalid seats response structure');
      }
    } catch (err: any) {
      console.error('Error fetching screening data:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load screening details');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatToggle = (seatId: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat');
      return;
    }

    setBookingLoading(true);
    setError('');
    try {
      console.log('Creating booking with:', { screeningId, selectedSeats });
      
      const bookingResponse = await bookingService.createBooking(
        screeningId!,
        selectedSeats
      );
      
      console.log('Booking response:', bookingResponse);
      
      const bookingId = bookingResponse.data.bookingId;

      console.log('Processing payment for booking:', bookingId);
      
      // Proceed to payment
      await paymentService.processPayment({
        bookingId,
        paymentMethod: 'UPI',
      });

      alert('Booking and payment successful!');
      navigate('/my-bookings');
    } catch (err: any) {
      console.error('Booking error:', err);
      console.error('Error response:', err.response);
      setError(err.response?.data?.message || err.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading seats...</Typography>
      </Container>
    );
  }

  // Group seats by row
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row_label]) {
      acc[seat.row_label] = [];
    }
    acc[seat.row_label].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  // Sort rows alphabetically
  const sortedRows = Object.keys(seatsByRow).sort();

  const totalPrice = selectedSeats.reduce((sum, seatId) => {
    const seat = seats.find(s => s.seat_id === seatId);
    return sum + (seat?.base_price ? Number(seat.base_price) : 0);
  }, 0);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Book Tickets
      </Typography>

      {screening && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6">{screening.movieTitle}</Typography>
          <Typography variant="body2" color="text.secondary">
            {screening.auditoriumName} • {new Date(screening.startTime).toLocaleString()}
          </Typography>
        </Paper>
      )}

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom align="center">
          Select Your Seats
        </Typography>
        <Box sx={{ 
          textAlign: 'center', 
          border: '3px solid #333', 
          borderRadius: 2,
          p: 1, 
          mb: 4,
          background: 'linear-gradient(180deg, #666 0%, #999 100%)',
          color: 'white'
        }}>
          <Typography variant="h6">SCREEN</Typography>
        </Box>

        <Box sx={{ overflowX: 'auto' }}>
          {sortedRows.map((rowLabel) => {
            const rowSeats = seatsByRow[rowLabel].sort((a, b) => a.seat_number - b.seat_number);
            return (
              <Box key={rowLabel} sx={{ mb: 2 }}>
                <Grid container spacing={1} alignItems="center" justifyContent="center">
                  <Grid item>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        width: 30, 
                        fontWeight: 'bold',
                        textAlign: 'center' 
                      }}
                    >
                      {rowLabel}
                    </Typography>
                  </Grid>
                  {rowSeats.map((seat) => (
                    <Grid item key={seat.seat_id}>
                      <Button
                        variant={selectedSeats.includes(seat.seat_id) ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => handleSeatToggle(seat.seat_id)}
                        disabled={!seat.is_available}
                        sx={{
                          minWidth: 45,
                          height: 45,
                          fontSize: '0.75rem',
                          backgroundColor: selectedSeats.includes(seat.seat_id) 
                            ? 'primary.main' 
                            : !seat.is_available 
                            ? '#ccc' 
                            : 'white',
                          '&:hover': {
                            backgroundColor: selectedSeats.includes(seat.seat_id) 
                              ? 'primary.dark' 
                              : !seat.is_available 
                              ? '#ccc' 
                              : 'primary.light',
                          },
                        }}
                      >
                        {seat.seat_number}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            );
          })}
        </Box>

        <Box sx={{ mt: 3, display: 'flex', gap: 3, justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 20, height: 20, bgcolor: 'white', border: '1px solid gray' }} />
            <Typography variant="body2">Available</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 20, height: 20, bgcolor: 'primary.main' }} />
            <Typography variant="body2">Selected</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 20, height: 20, bgcolor: '#ccc' }} />
            <Typography variant="body2">Booked</Typography>
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6">
              Selected Seats: {selectedSeats.length}
            </Typography>
            <Typography variant="h5" color="primary">
              Total: ₹{totalPrice.toFixed(2)}
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            onClick={handleBooking}
            disabled={bookingLoading || selectedSeats.length === 0}
          >
            {bookingLoading ? 'Processing...' : 'Proceed to Payment'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default BookTicket;
