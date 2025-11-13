/**
 * Booking Service
 * API calls for bookings (UC8)
 */

import api from './api';

export const bookingService = {
  // UC8: Create booking
  createBooking: async (screeningId: string, seatIds: string[]): Promise<any> => {
    return api.post('/bookings', { screeningId, seatIds });
  },

  // Get my bookings
  getMyBookings: async (): Promise<any> => {
    return api.get('/bookings/my-bookings');
  },

  // Get booking by ID
  getBookingById: async (bookingId: string): Promise<any> => {
    return api.get(`/bookings/${bookingId}`);
  },

  // Cancel booking
  cancelBooking: async (bookingId: string): Promise<any> => {
    return api.delete(`/bookings/${bookingId}`);
  },
};

export const paymentService = {
  // UC9: Initiate payment
  initiatePayment: async (bookingId: string): Promise<any> => {
    return api.post('/payments/initiate', { bookingId });
  },

  // UC9: Process payment
  processPayment: async (data: {
    bookingId: string;
    paymentMethod: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
  }): Promise<any> => {
    return api.post('/payments/process', data);
  },
};

export const ticketService = {
  // UC10: Download ticket
  downloadTicket: async (bookingId: string): Promise<Blob> => {
    const response = await api.get(`/tickets/download/${bookingId}`, {
      responseType: 'blob',
    });
    return response as unknown as Blob;
  },

  // Get ticket
  getTicket: async (ticketId: string): Promise<any> => {
    return api.get(`/tickets/${ticketId}`);
  },
};
