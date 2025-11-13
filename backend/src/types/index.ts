// =====================================================
// Enums and Types for Theatre Management System
// Matching UML Class Diagram specifications
// =====================================================

/**
 * SeatStatus enum from UML Class Diagram
 * Represents the current status of a seat
 */
export enum SeatStatus {
  AVAILABLE = 'AVAILABLE',
  BOOKED = 'BOOKED',
  LOCKED = 'LOCKED'
}

/**
 * BookingStatus enum from UML Class Diagram
 * Represents the current status of a booking
 */
export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED'
}

/**
 * PaymentStatus enum from UML Class Diagram
 * Represents the current status of a payment
 */
export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

/**
 * User types for role-based access control
 */
export enum UserType {
  CUSTOMER = 'CUSTOMER',
  ADMINISTRATOR = 'ADMINISTRATOR'
}

/**
 * User roles (alias for UserType for backward compatibility)
 */
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN'
}

/**
 * Seat types for pricing
 */
export enum SeatType {
  REGULAR = 'REGULAR',
  PREMIUM = 'PREMIUM',
  VIP = 'VIP'
}

/**
 * Payment methods
 */
export enum PaymentMethod {
  CARD = 'CARD',
  UPI = 'UPI',
  NET_BANKING = 'NET_BANKING',
  WALLET = 'WALLET'
}

/**
 * Report types for UC16, UC17
 */
export enum ReportType {
  REVENUE = 'REVENUE',
  OCCUPANCY = 'OCCUPANCY',
  BOOKINGS = 'BOOKINGS',
  MOVIE_PERFORMANCE = 'MOVIE_PERFORMANCE'
}

// =====================================================
// Database Row Interfaces (Raw data from database)
// =====================================================

export interface UserRow {
  user_id: string;
  name: string;
  email: string;
  password_hash: string;
  user_type: UserType;
  created_at: Date;
  updated_at: Date;
}

export interface CustomerRow {
  customer_id: string;
  user_id: string;
  phone_number: string;
  is_active: boolean;
}

export interface AdministratorRow {
  admin_id: string;
  user_id: string;
  employee_id: string;
  department: string;
}

export interface MovieRow {
  movie_id: string;
  title: string;
  synopsis: string;
  duration_in_minutes: number;
  genre: string;
  language: string;
  rating: string;
  poster_url: string;
  trailer_url: string;
  release_date: Date;
  is_active: boolean;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface ScreeningRow {
  screening_id: string;
  movie_id: string;
  auditorium_id: string;
  start_time: Date;
  end_time: Date;
  base_ticket_price: number;
  available_seats: number;
  is_active: boolean;
  created_by: string;
  created_at: Date;
}

export interface AuditoriumRow {
  auditorium_id: string;
  screen_number: number;
  name: string;
  capacity: number;
  total_rows: number;
  seats_per_row: number;
  created_at: Date;
}

export interface SeatRow {
  seat_id: string;
  auditorium_id: string;
  row_label: string;
  seat_number: number;
  seat_type: SeatType;
  base_price: number;
}

export interface BookingRow {
  booking_id: string;
  customer_id: string;
  screening_id: string;
  booking_time: Date;
  total_amount: number;
  number_of_seats: number;
  status: BookingStatus;
  booking_code: string;
  created_at: Date;
  updated_at: Date;
}

export interface BookingSeatRow {
  id: number;
  booking_id: string;
  seat_id: string;
  screening_id: string;
  price: number;
  status: SeatStatus;
  locked_at: Date | null;
  locked_until: Date | null;
}

export interface PaymentRow {
  payment_id: string;
  booking_id: string;
  amount: number;
  payment_date: Date;
  transaction_id: string;
  payment_method: PaymentMethod;
  payment_gateway: string;
  status: PaymentStatus;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  failure_reason: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface TicketRow {
  ticket_id: string;
  booking_id: string;
  qr_code_url: string | null;
  qr_code_data: string;
  ticket_number: string;
  is_used: boolean;
  used_at: Date | null;
  created_at: Date;
}

// =====================================================
// API Request/Response Types
// =====================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface CreateMovieRequest {
  title: string;
  synopsis: string;
  durationInMinutes: number;
  genre: string;
  language: string;
  rating: string;
  posterUrl?: string;
  trailerUrl?: string;
  releaseDate: string;
}

export interface CreateScreeningRequest {
  movieId: string;
  auditoriumId: string;
  startTime: string;
  baseTicketPrice: number;
}

export interface CreateBookingRequest {
  screeningId: string;
  seatIds: string[];
}

export interface PaymentInitiateRequest {
  bookingId: string;
  paymentMethod: PaymentMethod;
}

// =====================================================
// DateTime type (from UML diagram)
// =====================================================
export type DateTime = Date;
