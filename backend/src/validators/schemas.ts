/**
 * Request Validation Schemas using Joi
 * Defines validation rules for all API endpoints
 */

import Joi from 'joi';

// ==================== Authentication Schemas ====================

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 100 characters',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'any.required': 'Password is required',
  }),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be 10 digits',
      'any.required': 'Phone number is required',
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});

// ==================== Movie Schemas ====================

export const createMovieSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  synopsis: Joi.string().max(1000).optional().allow(''),
  durationInMinutes: Joi.number().integer().min(1).max(500).required(),
  genre: Joi.string().max(50).required(),
  posterUrl: Joi.string().uri().allow('').optional(),
  trailerUrl: Joi.string().uri().allow('').optional(),
  rating: Joi.string().valid('U', 'UA', 'A', 'S', 'PG', 'PG-13', 'R', 'NC-17', 'G').optional(),
  language: Joi.string().max(50).required(),
  releaseDate: Joi.date().optional(),
  isActive: Joi.boolean().optional().default(true),
});

export const updateMovieSchema = Joi.object({
  title: Joi.string().min(1).max(200).optional(),
  synopsis: Joi.string().max(1000).optional().allow(''),
  durationInMinutes: Joi.number().integer().min(1).max(500).optional(),
  genre: Joi.string().max(50).optional(),
  posterUrl: Joi.string().uri().allow('').optional(),
  trailerUrl: Joi.string().uri().allow('').optional(),
  rating: Joi.string().valid('U', 'UA', 'A', 'S', 'PG', 'PG-13', 'R', 'NC-17', 'G').optional(),
  language: Joi.string().max(50).optional(),
  releaseDate: Joi.date().optional(),
  isActive: Joi.boolean().optional(),
});

// ==================== Screening Schemas ====================

export const createScreeningSchema = Joi.object({
  movieId: Joi.string().required(),
  auditoriumId: Joi.string().required(),
  startTime: Joi.alternatives().try(
    Joi.date().iso(),
    Joi.string()
  ).required(),
  endTime: Joi.alternatives().try(
    Joi.date().iso(),
    Joi.string()
  ).optional(),
  baseTicketPrice: Joi.alternatives().try(
    Joi.number().min(0),
    Joi.string().custom((value: string, helpers: any) => {
      const num = parseFloat(value);
      if (isNaN(num) || num < 0) {
        return helpers.error('any.invalid');
      }
      return num;
    })
  ).required(),
});

export const updateScreeningSchema = Joi.object({
  movieId: Joi.string().optional(),
  auditoriumId: Joi.string().optional(),
  startTime: Joi.date().iso().optional(),
  endTime: Joi.date().iso().optional(),
  baseTicketPrice: Joi.number().min(0).optional(),
  isActive: Joi.boolean().optional(),
});

// ==================== Booking Schemas ====================

export const createBookingSchema = Joi.object({
  screeningId: Joi.string().required(),
  seatIds: Joi.array().items(Joi.string()).min(1).max(10).required().messages({
    'array.min': 'At least one seat must be selected',
    'array.max': 'Maximum 10 seats can be booked at once',
  }),
});

// ==================== Payment Schemas ====================

export const processPaymentSchema = Joi.object({
  bookingId: Joi.string().required(),
  paymentMethod: Joi.string().valid('CREDIT_CARD', 'DEBIT_CARD', 'UPI', 'NET_BANKING', 'WALLET').required(),
  razorpayOrderId: Joi.string().optional(),
  razorpayPaymentId: Joi.string().optional(),
  razorpaySignature: Joi.string().optional(),
});

// ==================== User Profile Schemas ====================

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional(),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});

// ==================== Admin Schemas ====================

export const updateUserRoleSchema = Joi.object({
  role: Joi.string().valid('CUSTOMER', 'ADMIN').required(),
});

export const reportQuerySchema = Joi.object({
  reportType: Joi.string().valid('DAILY_SALES', 'MOVIE_REVENUE', 'OCCUPANCY', 'CUSTOMER_BOOKINGS').required(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  movieId: Joi.string().optional(),
});
