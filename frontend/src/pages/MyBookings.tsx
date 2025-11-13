/**
 * My Bookings Page - Enhanced Version
 * Features:
 * - Detailed booking information
 * - Seat details
 * - Empty state
 * - Loading state
 * - Cancel booking option
 * - Better UI
 */

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Box,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
} from '@mui/material';
import { bookingService, ticketService } from '../services/bookingService';
import MovieIcon from '@mui/icons-material/Movie';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await bookingService.getMyBookings();
      setBookings(response.data.bookings || []);
    } catch (error: any) {
      console.error('Failed to fetch bookings:', error);
      setError(error.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTicket = async (bookingId: string) => {
    try {
      const blob = await ticketService.downloadTicket(bookingId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ticket-${bookingId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Failed to download ticket:', error);
      alert(error.response?.data?.message || 'Failed to download ticket');
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    try {
      await bookingService.cancelBooking(selectedBooking);
      setCancelDialogOpen(false);
      setSelectedBooking(null);
      fetchBookings(); // Refresh bookings
      alert('Booking cancelled successfully');
    } catch (error: any) {
      console.error('Failed to cancel booking:', error);
      alert(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canCancelBooking = (booking: any) => {
    // Can cancel if not already cancelled and screening hasn't started
    if (booking.status === 'CANCELLED') return false;
    const screeningTime = new Date(booking.start_time);
    const now = new Date();
    return screeningTime > now;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading your bookings...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Bookings
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {bookings.length === 0 ? (
        // Empty State
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 2,
            bgcolor: 'background.paper',
            borderRadius: 2,
          }}
        >
          <ConfirmationNumberIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No Bookings Yet
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            You haven't made any bookings yet. Start by browsing movies and booking your first show!
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => window.location.href = '/movies'}
          >
            Browse Movies
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid item xs={12} key={booking.booking_id}>
              <Card elevation={3}>
                <CardContent>
                  <Grid container spacing={3}>
                    {/* Booking Info */}
                    <Grid item xs={12} md={8}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <MovieIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h5">{booking.movie_title}</Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarTodayIcon sx={{ mr: 1, fontSize: '1.2rem', color: 'text.secondary' }} />
                        <Typography variant="body1">
                          {formatDate(booking.start_time)}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOnIcon sx={{ mr: 1, fontSize: '1.2rem', color: 'text.secondary' }} />
                        <Typography variant="body1">
                          {booking.auditorium_name}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <EventSeatIcon sx={{ mr: 1, fontSize: '1.2rem', color: 'text.secondary' }} />
                        <Typography variant="body1">
                          {booking.number_of_seats} {booking.number_of_seats === 1 ? 'Seat' : 'Seats'}
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Booking Code: <strong>{booking.booking_code || booking.booking_id}</strong>
                        </Typography>
                        <Chip
                          label={booking.status}
                          color={getStatusColor(booking.status)}
                          size="small"
                        />
                      </Box>

                      <Typography variant="h6" sx={{ mt: 2 }}>
                        Total: ₹{Number(booking.total_amount).toFixed(2)}
                      </Typography>
                    </Grid>

                    {/* Actions */}
                    <Grid item xs={12} md={4}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2,
                          height: '100%',
                          justifyContent: 'center',
                        }}
                      >
                        {booking.status === 'CONFIRMED' && (
                          <Button
                            variant="contained"
                            fullWidth
                            onClick={() => handleDownloadTicket(booking.booking_id)}
                          >
                            Download Ticket
                          </Button>
                        )}

                        {canCancelBooking(booking) && (
                          <Button
                            variant="outlined"
                            color="error"
                            fullWidth
                            onClick={() => {
                              setSelectedBooking(booking.booking_id);
                              setCancelDialogOpen(true);
                            }}
                          >
                            Cancel Booking
                          </Button>
                        )}

                        {booking.status === 'PENDING' && (
                          <Alert severity="warning" sx={{ mt: 1 }}>
                            Payment pending
                          </Alert>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this booking? This action cannot be undone.
            You will receive a refund according to our cancellation policy.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>
            Keep Booking
          </Button>
          <Button onClick={handleCancelBooking} color="error" variant="contained">
            Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyBookings;
