-- =====================================================
-- Fix QR Code URL Column Size
-- Change from VARCHAR(500) to TEXT to accommodate base64 QR codes
-- =====================================================

USE theatre_management_system;

-- Modify qr_code_url column to TEXT to store base64 encoded QR codes
ALTER TABLE tickets MODIFY COLUMN qr_code_url TEXT;
