-- =====================================================
-- Database Indexes for Performance Optimization
-- As per SRS Performance Requirements (Section 4.1)
-- Target: Page load < 2s, Seat check < 1s, 100 concurrent users
-- =====================================================

USE theatre_management_system;

-- =====================================================
-- Additional Composite Indexes for Query Optimization
-- =====================================================

-- Optimize movie browsing (UC6)
CREATE INDEX idx_movies_active_genre ON movies(is_active, genre);
CREATE INDEX idx_movies_active_release ON movies(is_active, release_date);

-- Optimize screening queries (UC14, UC8)
CREATE INDEX idx_screenings_movie_time ON screenings(movie_id, start_time, is_active);
CREATE INDEX idx_screenings_auditorium_time ON screenings(auditorium_id, start_time, end_time);

-- Optimize booking queries (UC8, UC10)
CREATE INDEX idx_bookings_customer_status ON bookings(customer_id, status);
CREATE INDEX idx_bookings_screening_status ON bookings(screening_id, status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);

-- Optimize seat availability checks (critical for performance)
CREATE INDEX idx_booking_seats_screening_status ON booking_seats(screening_id, status);
CREATE INDEX idx_booking_seats_locked_until ON booking_seats(locked_until);

-- Optimize payment queries
CREATE INDEX idx_payments_created_at ON payments(created_at);
CREATE INDEX idx_payments_gateway_status ON payments(payment_gateway, status);

-- Optimize ticket queries
CREATE INDEX idx_tickets_created_at ON tickets(created_at);

-- Optimize admin queries
CREATE INDEX idx_users_created_at ON users(created_at);

-- =====================================================
-- Full-Text Search Indexes
-- =====================================================

-- Enable full-text search on movie titles and synopsis (UC6 - Browse Movies)
ALTER TABLE movies ADD FULLTEXT INDEX ft_movie_search (title, synopsis);

-- =====================================================
-- End of Index Creation
-- =====================================================
