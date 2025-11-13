-- =====================================================
-- Sample Data for Theatre Management System (FIXED for MySQL 8+)
-- =====================================================

USE theatre_management_system;

-- =====================================================
-- Insert Admin User
-- Default Password: Admin@123 (hashed with bcrypt)
-- =====================================================
INSERT INTO users (user_id, name, email, password_hash, user_type) VALUES
('admin-001', 'System Administrator', 'admin@theatre.com', '$2b$10$rQ8YvM8z6h1Q9m0K3q4X5.FGKZqY7xH9X1jZ2vB3nC4mD5wE6fT7g', 'ADMINISTRATOR');

INSERT INTO administrators (admin_id, user_id, employee_id, department) VALUES
('admin-001', 'admin-001', 'EMP001', 'Management');

-- =====================================================
-- Insert Sample Customers
-- Default Password for all: Customer@123
-- =====================================================
INSERT INTO users (user_id, name, email, password_hash, user_type) VALUES
('user-001', 'Dev Rai', 'dev.rai@example.com', '$2b$10$rQ8YvM8z6h1Q9m0K3q4X5.FGKZqY7xH9X1jZ2vB3nC4mD5wE6fT7g', 'CUSTOMER'),
('user-002', 'Rahul Sharma', 'rahul.sharma@example.com', '$2b$10$rQ8YvM8z6h1Q9m0K3q4X5.FGKZqY7xH9X1jZ2vB3nC4mD5wE6fT7g', 'CUSTOMER'),
('user-003', 'Priya Patel', 'priya.patel@example.com', '$2b$10$rQ8YvM8z6h1Q9m0K3q4X5.FGKZqY7xH9X1jZ2vB3nC4mD5wE6fT7g', 'CUSTOMER'),
('user-004', 'Amit Kumar', 'amit.kumar@example.com', '$2b$10$rQ8YvM8z6h1Q9m0K3q4X5.FGKZqY7xH9X1jZ2vB3nC4mD5wE6fT7g', 'CUSTOMER');

INSERT INTO customers (customer_id, user_id, phone_number) VALUES
('cust-001', 'user-001', '+91-9876543210'),
('cust-002', 'user-002', '+91-9876543211'),
('cust-003', 'user-003', '+91-9876543212'),
('cust-004', 'user-004', '+91-9876543213');

-- =====================================================
-- Insert Auditoriums (3 screens)
-- =====================================================
INSERT INTO auditoriums (auditorium_id, screen_number, name, capacity, total_rows, seats_per_row) VALUES
('aud-001', 1, 'Screen 1 - Premium', 100, 10, 10),
('aud-002', 2, 'Screen 2 - Standard', 120, 12, 10),
('aud-003', 3, 'Screen 3 - IMAX', 150, 15, 10);

-- =====================================================
-- Insert Seats for Auditorium 1 (Screen 1 - 100 seats)
-- Rows: A-J, Seats: 1-10
-- =====================================================
INSERT INTO seats (auditorium_id, row_label, seat_number, seat_type, base_price)
SELECT 
    'aud-001',
    row_letter,
    seat_num,
    CASE 
        WHEN row_letter IN ('A', 'B') THEN 'VIP'
        WHEN row_letter IN ('C', 'D', 'E') THEN 'PREMIUM'
        ELSE 'REGULAR'
    END,
    CASE 
        WHEN row_letter IN ('A', 'B') THEN 300.00
        WHEN row_letter IN ('C', 'D', 'E') THEN 250.00
        ELSE 200.00
    END
FROM (
    SELECT 'A' AS row_letter UNION SELECT 'B' UNION SELECT 'C' UNION SELECT 'D' UNION SELECT 'E'
    UNION SELECT 'F' UNION SELECT 'G' UNION SELECT 'H' UNION SELECT 'I' UNION SELECT 'J'
) row_letters -- <-- FIXED: Changed from 'rows' to 'row_letters'
CROSS JOIN (
    SELECT 1 AS seat_num UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5
    UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
) seats;

-- =====================================================
-- Insert Seats for Auditorium 2 (Screen 2 - 120 seats)
-- Rows: A-L, Seats: 1-10
-- =====================================================
INSERT INTO seats (auditorium_id, row_label, seat_number, seat_type, base_price)
SELECT 
    'aud-002',
    row_letter,
    seat_num,
    CASE 
        WHEN row_letter IN ('A', 'B', 'C') THEN 'PREMIUM'
        ELSE 'REGULAR'
    END,
    CASE 
        WHEN row_letter IN ('A', 'B', 'C') THEN 220.00
        ELSE 180.00
    END
FROM (
    SELECT 'A' AS row_letter UNION SELECT 'B' UNION SELECT 'C' UNION SELECT 'D' UNION SELECT 'E'
    UNION SELECT 'F' UNION SELECT 'G' UNION SELECT 'H' UNION SELECT 'I' UNION SELECT 'J'
    UNION SELECT 'K' UNION SELECT 'L'
) row_letters -- <-- FIXED: Changed from 'rows' to 'row_letters'
CROSS JOIN (
    SELECT 1 AS seat_num UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5
    UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
) seats;

-- =====================================================
-- Insert Seats for Auditorium 3 (Screen 3 - IMAX - 150 seats)
-- Rows: A-O, Seats: 1-10
-- =====================================================
INSERT INTO seats (auditorium_id, row_label, seat_number, seat_type, base_price)
SELECT 
    'aud-003',
    row_letter,
    seat_num,
    CASE 
        WHEN row_letter IN ('A', 'B', 'C', 'D') THEN 'VIP'
        WHEN row_letter IN ('E', 'F', 'G', 'H') THEN 'PREMIUM'
        ELSE 'REGULAR'
    END,
    CASE 
        WHEN row_letter IN ('A', 'B', 'C', 'D') THEN 400.00
        WHEN row_letter IN ('E', 'F', 'G', 'H') THEN 350.00
        ELSE 280.00
    END
FROM (
    SELECT 'A' AS row_letter UNION SELECT 'B' UNION SELECT 'C' UNION SELECT 'D' UNION SELECT 'E'
    UNION SELECT 'F' UNION SELECT 'G' UNION SELECT 'H' UNION SELECT 'I' UNION SELECT 'J'
    UNION SELECT 'K' UNION SELECT 'L' UNION SELECT 'M' UNION SELECT 'N' UNION SELECT 'O'
) row_letters -- <-- FIXED: Changed from 'rows' to 'row_letters'
CROSS JOIN (
    SELECT 1 AS seat_num UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5
    UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
) seats;

-- =====================================================
-- Insert Sample Movies
-- =====================================================
INSERT INTO movies (movie_id, title, synopsis, duration_in_minutes, genre, language, rating, poster_url, trailer_url, release_date, created_by) VALUES
(
    'movie-001',
    'The Dark Knight',
    'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    152,
    'Action, Crime, Drama',
    'English',
    'PG-13',
    'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    '2008-07-18',
    'admin-001'
),
(
    'movie-002',
    'Inception',
    'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    148,
    'Action, Sci-Fi, Thriller',
    'English',
    'PG-13',
    'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    'https://www.youtube.com/watch?v=YoHD9XEInc0',
    '2010-07-16',
    'admin-001'
),
(
    'movie-003',
    '3 Idiots',
    'Two friends embark on a quest for a lost buddy. On this journey, they encounter a long-forgotten bet, a wedding they must crash, and a funeral that goes impossibly out of control.',
    170,
    'Comedy, Drama',
    'Hindi',
    'PG-13',
    'https://image.tmdb.org/t/p/w500/66A9MqXOyVFCssoloscw detailed.jpg',
    'https://www.youtube.com/watch?v=K0eDlFX9GMc',
    '2009-12-25',
    'admin-001'
),
(
    'movie-004',
    'Avengers: Endgame',
    'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos actions and restore balance.',
    181,
    'Action, Adventure, Sci-Fi',
    'English',
    'PG-13',
    'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    'https://www.youtube.com/watch?v=TcMBFSGVi1c',
    '2019-04-26',
    'admin-001'
),
(
    'movie-005',
    'Interstellar',
    'A team of explorers travel through a wormhole in space in an attempt to ensure humanitys survival.',
    169,
    'Adventure, Drama, Sci-Fi',
    'English',
    'PG-13',
    'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    '2014-11-07',
    'admin-001'
),
(
    'movie-006',
    'Dangal',
    'Former wrestler Mahavir Singh Phogat and his two wrestler daughters struggle towards glory at the Commonwealth Games in the face of societal oppression.',
    161,
    'Action, Biography, Drama',
    'Hindi',
    'PG',
    'https://image.tmdb.org/t/p/w500/3j8n0JgSNVOwVFCssoloscw3Pk.jpg',
    'https://www.youtube.com/watch?v=x_7YlGv9u1g',
    '2016-12-23',
    'admin-001'
);

-- =====================================================
-- Insert Sample Screenings (Next 7 days)
-- =====================================================

-- Screenings for Today
INSERT INTO screenings (movie_id, auditorium_id, start_time, end_time, base_ticket_price, available_seats, created_by) VALUES
('movie-001', 'aud-001', DATE_ADD(NOW(), INTERVAL 2 HOUR), DATE_ADD(NOW(), INTERVAL 4 HOUR), 250.00, 100, 'admin-001'),
('movie-002', 'aud-002', DATE_ADD(NOW(), INTERVAL 3 HOUR), DATE_ADD(NOW(), INTERVAL 5 HOUR), 220.00, 120, 'admin-001'),
('movie-003', 'aud-003', DATE_ADD(NOW(), INTERVAL 4 HOUR), DATE_ADD(NOW(), INTERVAL 7 HOUR), 350.00, 150, 'admin-001');

-- Screenings for Tomorrow
INSERT INTO screenings (movie_id, auditorium_id, start_time, end_time, base_ticket_price, available_seats, created_by) VALUES
('movie-004', 'aud-001', DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 10 HOUR, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 13 HOUR, 300.00, 100, 'admin-001'),
('movie-005', 'aud-002', DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 14 HOUR, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 17 HOUR, 250.00, 120, 'admin-001'),
('movie-006', 'aud-003', DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 18 HOUR, DATE_ADD(NOW(), INTERVAL 1 DAY) + INTERVAL 21 HOUR, 400.00, 150, 'admin-001');

-- Screenings for Day After Tomorrow
INSERT INTO screenings (movie_id, auditorium_id, start_time, end_time, base_ticket_price, available_seats, created_by) VALUES
('movie-001', 'aud-002', DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 11 HOUR, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 13 HOUR, 220.00, 120, 'admin-001'),
('movie-002', 'aud-003', DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 15 HOUR, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 18 HOUR, 350.00, 150, 'admin-001'),
('movie-003', 'aud-001', DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 19 HOUR, DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 22 HOUR, 250.00, 100, 'admin-001');

-- =====================================================
-- Sample Booking (for demonstration)
-- =====================================================
INSERT INTO bookings (booking_id, customer_id, screening_id, total_amount, number_of_seats, status, booking_code)
SELECT 
    'booking-001',
    'cust-001',
    screening_id,
    600.00,
    2,
    'CONFIRMED',
    'DEMO1234'
FROM screenings
WHERE movie_id = 'movie-001'
LIMIT 1;

-- =====================================================
-- Sample Booking Seats
-- =====================================================
INSERT INTO booking_seats (booking_id, seat_id, screening_id, price, status)
SELECT 
    'booking-001',
    s.seat_id,
    (SELECT screening_id FROM screenings WHERE movie_id = 'movie-001' LIMIT 1),
    300.00,
    'BOOKED'
FROM seats s
WHERE s.auditorium_id = 'aud-001'
  AND s.row_label = 'A'
  AND s.seat_number IN (5, 6)
LIMIT 2;

-- =====================================================
-- Sample Payment
-- =====================================================
INSERT INTO payments (payment_id, booking_id, amount, payment_method, status, transaction_id)
VALUES (
    'pay-001',
    'booking-001',
    600.00,
    'CARD',
    'SUCCESS',
    'txn_demo_12345'
);

-- =====================================================
-- Sample Ticket
-- =====================================================
INSERT INTO tickets (ticket_id, booking_id, ticket_number, qr_code_data)
VALUES (
    'ticket-001',
    'booking-001',
    CONCAT('TKT-', UPPER(SUBSTRING(UUID(), 1, 8))),
    'VERIFY:booking-001:DEMO1234'
);

-- =====================================================
-- Display Summary
-- =====================================================
SELECT 'Data seeding completed successfully!' AS Status;

SELECT 'Users Created:' AS Info, COUNT(*) AS Count FROM users;
SELECT 'Customers Created:' AS Info, COUNT(*) AS Count FROM customers;
SELECT 'Administrators Created:' AS Info, COUNT(*) AS Count FROM administrators;
SELECT 'Auditoriums Created:' AS Info, COUNT(*) AS Count FROM auditoriums;
SELECT 'Total Seats Created:' AS Info, COUNT(*) AS Count FROM seats;
SELECT 'Movies Added:' AS Info, COUNT(*) AS Count FROM movies;
SELECT 'Screenings Scheduled:' AS Info, COUNT(*) AS Count FROM screenings;
SELECT 'Sample Bookings:' AS Info, COUNT(*) AS Count FROM bookings;

-- =====================================================
-- Login Credentials for Testing
-- =====================================================
SELECT '
==============================================
LOGIN CREDENTIALS FOR TESTING
==============================================

ADMIN LOGIN:
Email: admin@theatre.com
Password: Admin@123

CUSTOMER LOGINS:
Email: dev.rai@example.com
Password: Customer@123

Email: rahul.sharma@example.com
Password: Customer@123

Email: priya.patel@example.com
Password: Customer@123

Email: amit.kumar@example.com
Password: Customer@123

==============================================
' AS 'Test Credentials';