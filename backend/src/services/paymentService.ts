/**
 * Payment Service
 * Handles payment processing logic (UC9)
 */

import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { query } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { PaymentStatus, PaymentMethod } from '../types';
import { sendPaymentSuccessEmail } from '../utils/email';
import * as bookingService from './bookingService';

/**
 * UC9: Process payment
 */
export const processPayment = async (
  bookingId: string,
  paymentMethod: PaymentMethod,
  razorpayData?: {
    orderId: string;
    paymentId: string;
    signature: string;
  }
): Promise<{ paymentId: string; transactionId: string }> => {
  // Get booking details
  const booking = await bookingService.getBookingById(bookingId);

  if (booking.status === 'CONFIRMED') {
    throw new AppError('Booking already paid', 400);
  }

  if (booking.status === 'CANCELLED') {
    throw new AppError('Cannot pay for cancelled booking', 400);
  }

  // Generate payment ID and transaction ID
  const paymentId = `payment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;

  // In production, verify Razorpay signature here
  // const isSignatureValid = verifyRazorpaySignature(razorpayData);

  // Create payment record
  await query<ResultSetHeader>(
    `INSERT INTO payments (
      payment_id, booking_id, amount, payment_date, transaction_id, payment_method,
      payment_gateway, status, razorpay_order_id, razorpay_payment_id, razorpay_signature,
      created_at, updated_at
    ) VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      paymentId,
      bookingId,
      booking.total_amount,
      transactionId,
      paymentMethod,
      'RAZORPAY',
      PaymentStatus.SUCCESS,
      razorpayData?.orderId || null,
      razorpayData?.paymentId || null,
      razorpayData?.signature || null,
    ]
  );

  // Confirm booking
  await bookingService.confirmBooking(bookingId);

  // Send payment success email (non-blocking)
  // Get customer email
  const customers = await query<RowDataPacket[]>(
    `SELECT u.email, u.name 
     FROM customers c
     JOIN users u ON c.user_id = u.user_id
     WHERE c.customer_id = ?`,
    [booking.customer_id || '']
  );

  if (customers.length > 0) {
    sendPaymentSuccessEmail(customers[0].email, customers[0].name, {
      transactionId,
      amount: booking.total_amount,
      paymentMethod: paymentMethod.toString(),
      bookingCode: booking.booking_code,
    }).catch((error) => {
      console.error('Failed to send payment email:', error);
    });
  }

  return { paymentId, transactionId };
};

/**
 * Get payment by ID
 */
export const getPaymentById = async (paymentId: string): Promise<any> => {
  const payments = await query<RowDataPacket[]>(
    `SELECT * FROM payments WHERE payment_id = ?`,
    [paymentId]
  );

  if (payments.length === 0) {
    throw new AppError('Payment not found', 404);
  }

  return payments[0];
};

/**
 * Get payment by booking ID
 */
export const getPaymentByBookingId = async (bookingId: string): Promise<any> => {
  const payments = await query<RowDataPacket[]>(
    `SELECT * FROM payments WHERE booking_id = ? ORDER BY created_at DESC LIMIT 1`,
    [bookingId]
  );

  if (payments.length === 0) {
    throw new AppError('Payment not found for this booking', 404);
  }

  return payments[0];
};

/**
 * Initiate Razorpay order
 */
export const initiatePayment = async (bookingId: string): Promise<any> => {
  const booking = await bookingService.getBookingById(bookingId);

  // In production, create Razorpay order here
  // const razorpayOrder = await razorpay.orders.create({
  //   amount: booking.total_amount * 100, // paise
  //   currency: 'INR',
  //   receipt: bookingId,
  // });

  const mockOrderId = `order_${Date.now()}`;

  return {
    orderId: mockOrderId,
    amount: booking.total_amount,
    currency: 'INR',
    bookingId,
  };
};
