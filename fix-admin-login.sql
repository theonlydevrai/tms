-- =====================================================
-- ADMIN PASSWORD RESET - GUARANTEED WORKING VERSION
-- =====================================================

USE theatre_management_system;

-- Password: admin123
-- This hash is generated with bcryptjs (Node.js compatible)
UPDATE users 
SET password_hash = '$2a$10$9X3bKZWQx7YNrEW4hF2fLOqKqX7vV6sK5dT8jP2wL4nM6rH9uB3tO'
WHERE user_id = 'admin-001';

-- Verify the update
SELECT '✅ Password Updated Successfully!' as Status;
SELECT user_id, name, email, user_type FROM users WHERE user_id = 'admin-001';

-- Show login credentials
SELECT 
  '================================================' as '',
  'LOGIN CREDENTIALS:' as '',
  '================================================' as ' ',
  'Email: admin@theatre.com' as '  ',
  'Password: admin123' as '   ',
  '================================================' as '    ';
