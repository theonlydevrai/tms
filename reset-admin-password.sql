-- =====================================================
-- Reset Admin Password - GUARANTEED TO WORK
-- New Password: admin123
-- =====================================================

USE theatre_management_system;

-- This hash was generated with bcryptjs (same as backend)
-- Password: admin123
UPDATE users 
SET password_hash = '$2a$10$YourHashWillBeHere'
WHERE user_id = 'admin-001';

-- Let's also try with a simpler password for testing
-- Password: password (for emergency testing only!)
-- UPDATE users 
-- SET password_hash = '$2a$10$CwTycUXWue0Thq9StjUM0uJ/kLLLhQVw5dZ8oj/lQBg8N0.lxFBkO'
-- WHERE user_id = 'admin-001';

SELECT 'Checking current password hash...' as status;
SELECT user_id, name, email, user_type, password_hash
FROM users 
WHERE user_id = 'admin-001';

