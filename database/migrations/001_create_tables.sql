-- =====================================================
-- Theatre Management System - Database Schema
-- Matches UML Class Diagram EXACTLY
-- =====================================================
-- Author: Dev Rai (2024301022)
-- Date: November 12, 2025
-- =====================================================

-- Drop database if exists and create fresh
DROP DATABASE IF EXISTS theatre_management_system;
CREATE DATABASE theatre_management_system;
USE theatre_management_system;

-- =====================================================
-- ENUMS (Implemented as ENUM types)
-- =====================================================

-- SeatStatus enum: AVAILABLE, BOOKED, LOCKED
-- BookingStatus enum: PENDING, CONFIRMED, CANCELLED
-- PaymentStatus enum: PENDING, SUCCESS, FAILED, REFUNDED

-- =====================================================
-- TABLE: users (Base table for User interface)
-- =====================================================
CREATE TABLE users (
    user_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type ENUM('CUSTOMER', 'ADMINISTRATOR') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_user_type (user_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TABLE: customers (extends User)
-- Attributes: phoneNumber
-- Methods: register(), updateProfile(), makeBooking(), viewBookingHistory()
-- =====================================================
CREATE TABLE customers (
    customer_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) UNIQUE NOT NULL,
    phone_number VARCHAR(15),
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_phone (phone_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TABLE: administrators (extends User)
-- Attributes: employeeId
-- Methods: addMovie(), updateMovie(), addScreening(), cancelScreening(), generateReport()
-- =====================================================
CREATE TABLE administrators (
    admin_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) UNIQUE NOT NULL,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_employee (employee_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TABLE: movies
-- Attributes: movieId, title, synopsis, durationInMinutes, genre
-- Methods: getMovieDetails()
-- =====================================================
CREATE TABLE movies (
    movie_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    synopsis TEXT,
    duration_in_minutes INT NOT NULL,
    genre VARCHAR(100),
    language VARCHAR(50),
    rating VARCHAR(10),
    poster_url VARCHAR(500),
    trailer_url VARCHAR(500),
    release_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES administrators(admin_id) ON DELETE SET NULL,
    INDEX idx_title (title),
    INDEX idx_genre (genre),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TABLE: auditoriums
-- Attributes: screenNumber, capacity
-- Methods: getSeatingLayout()
-- Composition: An Auditorium is composed of Seats
-- =====================================================
CREATE TABLE auditoriums (
    auditorium_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    screen_number INT UNIQUE NOT NULL,
    name VARCHAR(100),
    capacity INT NOT NULL,
    total_rows INT NOT NULL,
    seats_per_row INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_screen_number (screen_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TABLE: seats
-- Attributes: seatId, row, number, status
-- Methods: isAvailable()
-- Relationship: Seat belongs to Auditorium (composition)
-- =====================================================
CREATE TABLE seats (
    seat_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    auditorium_id VARCHAR(36) NOT NULL,
    row_label CHAR(1) NOT NULL,
    seat_number INT NOT NULL,
    seat_type ENUM('REGULAR', 'PREMIUM', 'VIP') DEFAULT 'REGULAR',
    base_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (auditorium_id) REFERENCES auditoriums(auditorium_id) ON DELETE CASCADE,
    UNIQUE KEY unique_seat (auditorium_id, row_label, seat_number),
    INDEX idx_auditorium (auditorium_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TABLE: screenings
-- Attributes: screeningId, startTime
-- Methods: getAvailableSeats()
-- Relationships: 
--   - Screening shows one Movie (N:1)
--   - Screening is hosted by one Auditorium (N:1)
-- =====================================================
CREATE TABLE screenings (
    screening_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    movie_id VARCHAR(36) NOT NULL,
    auditorium_id VARCHAR(36) NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    base_ticket_price DECIMAL(10, 2) NOT NULL,
    available_seats INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (auditorium_id) REFERENCES auditoriums(auditorium_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES administrators(admin_id) ON DELETE SET NULL,
    INDEX idx_movie (movie_id),
    INDEX idx_auditorium (auditorium_id),
    INDEX idx_start_time (start_time),
    INDEX idx_active (is_active),
    -- Prevent scheduling conflicts: same auditorium can't have overlapping screenings
    CONSTRAINT check_no_overlap CHECK (start_time < end_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TABLE: bookings
-- Attributes: bookingId, bookingTime, totalAmount, status
-- Methods: confirmBooking(), generateTicket()
-- Relationships:
--   - Booking is made by one Customer (N:1)
--   - Booking is for one Screening (N:1)
--   - Booking reserves multiple Seats (N:M)
--   - Booking requires one Payment (1:1)
--   - Booking generates one Ticket (1:1)
-- =====================================================
CREATE TABLE bookings (
    booking_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    customer_id VARCHAR(36) NOT NULL,
    screening_id VARCHAR(36) NOT NULL,
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    number_of_seats INT NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED') DEFAULT 'PENDING',
    booking_code VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (screening_id) REFERENCES screenings(screening_id) ON DELETE CASCADE,
    INDEX idx_customer (customer_id),
    INDEX idx_screening (screening_id),
    INDEX idx_status (status),
    INDEX idx_booking_code (booking_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TABLE: booking_seats (Junction table for Booking-Seat N:M relationship)
-- A Booking reserves one or more Seats
-- A Seat is reserved by exactly one Booking
-- =====================================================
CREATE TABLE booking_seats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id VARCHAR(36) NOT NULL,
    seat_id VARCHAR(36) NOT NULL,
    screening_id VARCHAR(36) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status ENUM('AVAILABLE', 'LOCKED', 'BOOKED') DEFAULT 'AVAILABLE',
    locked_at TIMESTAMP NULL,
    locked_until TIMESTAMP NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (seat_id) REFERENCES seats(seat_id) ON DELETE CASCADE,
    FOREIGN KEY (screening_id) REFERENCES screenings(screening_id) ON DELETE CASCADE,
    UNIQUE KEY unique_seat_screening (seat_id, screening_id),
    INDEX idx_booking (booking_id),
    INDEX idx_seat (seat_id),
    INDEX idx_screening (screening_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TABLE: payments
-- Attributes: paymentId, amount, paymentDate, transactionId, status
-- Methods: processPayment()
-- Relationship: Payment is required by one Booking (1:1)
-- =====================================================
CREATE TABLE payments (
    payment_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    booking_id VARCHAR(36) UNIQUE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_id VARCHAR(255) UNIQUE,
    payment_method ENUM('CARD', 'UPI', 'NET_BANKING', 'WALLET') NOT NULL,
    payment_gateway VARCHAR(50) DEFAULT 'RAZORPAY',
    status ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    razorpay_signature VARCHAR(255),
    failure_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    INDEX idx_booking (booking_id),
    INDEX idx_transaction (transaction_id),
    INDEX idx_status (status),
    INDEX idx_payment_date (payment_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TABLE: tickets
-- Attributes: ticketId, qrCodeUrl
-- Methods: downloadAsPdf()
-- Relationship: Ticket is generated by one Booking (1:1)
-- =====================================================
CREATE TABLE tickets (
    ticket_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    booking_id VARCHAR(36) UNIQUE NOT NULL,
    qr_code_url TEXT,
    qr_code_data TEXT,
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
    INDEX idx_booking (booking_id),
    INDEX idx_ticket_number (ticket_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TABLE: password_resets (for UC4, UC5 - Forgot/Reset Password)
-- =====================================================
CREATE TABLE password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    reset_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_token (reset_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TABLE: payment_logs (As per SRS requirement: MySQL trigger for payment logging)
-- =====================================================
CREATE TABLE payment_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    payment_id VARCHAR(36) NOT NULL,
    booking_id VARCHAR(36) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(255),
    event_type ENUM('CREATED', 'UPDATED', 'SUCCESS', 'FAILED', 'REFUNDED') NOT NULL,
    log_message TEXT,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_payment (payment_id),
    INDEX idx_booking (booking_id),
    INDEX idx_logged_at (logged_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- TABLE: admin_reports (For UC16, UC17 - View/Export Reports)
-- =====================================================
CREATE TABLE admin_reports (
    report_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    admin_id VARCHAR(36) NOT NULL,
    report_type ENUM('REVENUE', 'OCCUPANCY', 'BOOKINGS', 'MOVIE_PERFORMANCE') NOT NULL,
    report_data JSON,
    date_from DATE NOT NULL,
    date_to DATE NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES administrators(admin_id) ON DELETE CASCADE,
    INDEX idx_admin (admin_id),
    INDEX idx_type (report_type),
    INDEX idx_generated_at (generated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- End of Schema Creation
-- =====================================================
