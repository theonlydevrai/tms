-- Update all screening times to be in the future (for demo purposes)
-- This makes all existing screenings bookable

USE theatre_management_system;

-- Update all screenings to start 2 days from now and spread them over the next 7 days
UPDATE screenings s
JOIN (
    SELECT screening_id, 
           ROW_NUMBER() OVER (ORDER BY start_time) as rn
    FROM screenings
) as numbered ON s.screening_id = numbered.screening_id
SET 
    s.start_time = DATE_ADD(NOW(), INTERVAL (2 + (numbered.rn % 7)) DAY),
    s.end_time = DATE_ADD(DATE_ADD(NOW(), INTERVAL (2 + (numbered.rn % 7)) DAY), INTERVAL 3 HOUR);

-- Verify the update
SELECT 
    s.screening_id,
    m.title as movie_name,
    a.name as auditorium,
    s.start_time,
    s.base_ticket_price,
    s.available_seats,
    s.is_active
FROM screenings s
JOIN movies m ON s.movie_id = m.movie_id
JOIN auditoriums a ON s.auditorium_id = a.auditorium_id
ORDER BY s.start_time
LIMIT 10;
