-- Fix: Drop the ticket_number auto-generation trigger
-- We'll generate it in the application code instead

USE theatre_management_system;

-- Drop the trigger that's causing the issue
DROP TRIGGER IF EXISTS trg_generate_ticket_number;

-- Done!
SELECT 'Trigger dropped successfully!' as Status;
