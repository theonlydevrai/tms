/**
 * Email Utility Functions
 * Handles sending transactional emails using Nodemailer
 */

import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * Send generic email
 */
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"Theatre Management System" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.log(`Email sent to ${options.to}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

/**
 * Send welcome email after registration (UC1)
 */
export const sendWelcomeEmail = async (email: string, name: string): Promise<boolean> => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to Theatre Management System!</h2>
      <p>Hi ${name},</p>
      <p>Thank you for registering with us. You can now browse movies, book tickets, and enjoy a seamless movie experience.</p>
      <p>Get started by exploring our latest movies and screenings.</p>
      <p style="margin-top: 30px;">
        <a href="${process.env.FRONTEND_URL}/movies" 
           style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Browse Movies
        </a>
      </p>
      <p style="color: #666; margin-top: 30px;">
        Best regards,<br>
        Theatre Management System Team
      </p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Welcome to Theatre Management System',
    html,
  });
};

/**
 * Send password reset email (UC4)
 */
export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
  name: string
): Promise<boolean> => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>Hi ${name},</p>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      <p style="margin: 30px 0;">
        <a href="${resetUrl}" 
           style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
      </p>
      <p>This link will expire in 1 hour for security reasons.</p>
      <p style="color: #666;">
        If you didn't request a password reset, please ignore this email or contact support if you have concerns.
      </p>
      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        If the button doesn't work, copy and paste this link into your browser:<br>
        ${resetUrl}
      </p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Password Reset Request',
    html,
  });
};

/**
 * Send booking confirmation email (UC8)
 */
export const sendBookingConfirmationEmail = async (
  email: string,
  name: string,
  bookingDetails: {
    bookingCode: string;
    movieTitle: string;
    screeningTime: string;
    seats: string[];
    totalAmount: number;
    auditoriumName: string;
  }
): Promise<boolean> => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #28a745;">Booking Confirmed! 🎉</h2>
      <p>Hi ${name},</p>
      <p>Your ticket booking has been confirmed. Here are the details:</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Booking Code:</strong> ${bookingDetails.bookingCode}</p>
        <p style="margin: 5px 0;"><strong>Movie:</strong> ${bookingDetails.movieTitle}</p>
        <p style="margin: 5px 0;"><strong>Show Time:</strong> ${bookingDetails.screeningTime}</p>
        <p style="margin: 5px 0;"><strong>Auditorium:</strong> ${bookingDetails.auditoriumName}</p>
        <p style="margin: 5px 0;"><strong>Seats:</strong> ${bookingDetails.seats.join(', ')}</p>
        <p style="margin: 5px 0;"><strong>Total Amount:</strong> ₹${bookingDetails.totalAmount}</p>
      </div>

      <p>Your e-ticket is attached. You can also download it from your bookings page.</p>
      
      <p style="margin-top: 30px;">
        <a href="${process.env.FRONTEND_URL}/bookings" 
           style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          View My Bookings
        </a>
      </p>

      <p style="color: #666; margin-top: 30px;">
        Enjoy the movie!<br>
        Theatre Management System Team
      </p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `Booking Confirmed - ${bookingDetails.movieTitle}`,
    html,
  });
};

/**
 * Send payment success email (UC9)
 */
export const sendPaymentSuccessEmail = async (
  email: string,
  name: string,
  paymentDetails: {
    transactionId: string;
    amount: number;
    paymentMethod: string;
    bookingCode: string;
  }
): Promise<boolean> => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #28a745;">Payment Successful ✓</h2>
      <p>Hi ${name},</p>
      <p>Your payment has been processed successfully.</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Transaction ID:</strong> ${paymentDetails.transactionId}</p>
        <p style="margin: 5px 0;"><strong>Amount Paid:</strong> ₹${paymentDetails.amount}</p>
        <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${paymentDetails.paymentMethod}</p>
        <p style="margin: 5px 0;"><strong>Booking Code:</strong> ${paymentDetails.bookingCode}</p>
      </div>

      <p style="color: #666; margin-top: 30px;">
        Thank you for your payment!<br>
        Theatre Management System Team
      </p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Payment Confirmation',
    html,
  });
};
