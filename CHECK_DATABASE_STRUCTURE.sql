-- Run this SQL query in MySQL and send me the output

-- Check the tickets table structure
DESCRIBE tickets;

-- Also check if there are any existing tickets
SELECT ticket_id, booking_id, ticket_number, qr_code_url, created_at 
FROM tickets 
ORDER BY created_at DESC 
LIMIT 5;
