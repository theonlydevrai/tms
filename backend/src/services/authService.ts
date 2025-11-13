/**
 * Authentication Service
 * Handles user authentication logic (UC1, UC2, UC4, UC5)
 */

import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { query } from '../config/database';
import { hashPassword, comparePassword, generateResetToken } from '../utils/password';
import { generateTokenPair, TokenPayload } from '../utils/jwt';
import { sendWelcomeEmail, sendPasswordResetEmail } from '../utils/email';
import { UserRole } from '../types';
import { AppError } from '../middleware/errorHandler';

export interface User {
  userId: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  user_type: string;
}

interface Customer extends User {
  customerId: string;
  phoneNumber: string;
}

/**
 * UC1: Register new customer
 */
export const registerCustomer = async (
  name: string,
  email: string,
  password: string,
  phoneNumber: string
): Promise<{ user: Customer; tokens: any }> => {
  // Check if email already exists
  const existingUsers = await query<RowDataPacket[]>(
    'SELECT user_id FROM users WHERE email = ?',
    [email]
  );

  if (existingUsers.length > 0) {
    throw new AppError('Email already registered', 400);
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Generate IDs
  const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const customerId = `cust-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Start transaction
  try {
    // Insert into users table
    await query<ResultSetHeader>(
      `INSERT INTO users (user_id, name, email, password_hash, user_type, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [userId, name, email, passwordHash, 'CUSTOMER']
    );

    // Insert into customers table
    await query<ResultSetHeader>(
      `INSERT INTO customers (customer_id, user_id, phone_number, is_active) 
       VALUES (?, ?, ?, TRUE)`,
      [customerId, userId, phoneNumber]
    );

    // Send welcome email (non-blocking)
    sendWelcomeEmail(email, name).catch((error) => {
      console.error('Failed to send welcome email:', error);
    });

    // Generate JWT tokens
    const tokenPayload: TokenPayload = {
      userId,
      email,
      role: UserRole.CUSTOMER,
    };

    const tokens = generateTokenPair(tokenPayload);

    return {
      user: {
        userId,
        customerId,
        name,
        email,
        passwordHash,
        role: UserRole.CUSTOMER,
        user_type: 'CUSTOMER',
        phoneNumber,
      },
      tokens,
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw new AppError('Failed to register user', 500);
  }
};

/**
 * UC2: Login user
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<{ user: User; tokens: any }> => {
  // Find user by email
  const users = await query<RowDataPacket[]>(
    'SELECT user_id, name, email, password_hash, user_type FROM users WHERE email = ?',
    [email]
  );

  if (users.length === 0) {
    throw new AppError('Invalid email or password', 401);
  }

  const user = users[0];

  // Verify password
  const isPasswordValid = await comparePassword(password, user.password_hash);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  // Map user_type to UserRole
  const role = user.user_type === 'ADMINISTRATOR' ? UserRole.ADMIN : UserRole.CUSTOMER;

  // Generate JWT tokens
  const tokenPayload: TokenPayload = {
    userId: user.user_id,
    email: user.email,
    role,
  };

  const tokens = generateTokenPair(tokenPayload);

  return {
    user: {
      userId: user.user_id,
      name: user.name,
      email: user.email,
      passwordHash: user.password_hash,
      role,
      user_type: user.user_type, // Add user_type for frontend
    },
    tokens,
  };
};

/**
 * UC4: Forgot password - Send reset token
 */
export const forgotPassword = async (email: string): Promise<boolean> => {
  // Find user by email
  const users = await query<RowDataPacket[]>(
    'SELECT user_id, name, email FROM users WHERE email = ?',
    [email]
  );

  if (users.length === 0) {
    // Don't reveal if email exists or not (security best practice)
    return true;
  }

  const user = users[0];

  // Generate reset token
  const resetToken = generateResetToken();
  const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

  // Save reset token to database
  await query<ResultSetHeader>(
    `UPDATE users 
     SET reset_token = ?, reset_token_expiry = ?, updated_at = NOW() 
     WHERE user_id = ?`,
    [resetToken, resetTokenExpiry, user.user_id]
  );

  // Send password reset email
  await sendPasswordResetEmail(user.email, resetToken, user.name);

  return true;
};

/**
 * UC5: Reset password
 */
export const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
  // Find user with valid reset token
  const users = await query<RowDataPacket[]>(
    `SELECT user_id FROM users 
     WHERE reset_token = ? AND reset_token_expiry > NOW()`,
    [token]
  );

  if (users.length === 0) {
    throw new AppError('Invalid or expired reset token', 400);
  }

  const user = users[0];

  // Hash new password
  const passwordHash = await hashPassword(newPassword);

  // Update password and clear reset token
  await query<ResultSetHeader>(
    `UPDATE users 
     SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL, updated_at = NOW() 
     WHERE user_id = ?`,
    [passwordHash, user.user_id]
  );

  return true;
};

/**
 * Get user profile
 */
export const getUserProfile = async (userId: string): Promise<any> => {
  const users = await query<RowDataPacket[]>(
    `SELECT u.user_id, u.name, u.email, u.user_type, u.created_at,
            c.customer_id, c.phone_number,
            a.admin_id, a.employee_id, a.department
     FROM users u
     LEFT JOIN customers c ON u.user_id = c.user_id
     LEFT JOIN administrators a ON u.user_id = a.user_id
     WHERE u.user_id = ?`,
    [userId]
  );

  if (users.length === 0) {
    throw new AppError('User not found', 404);
  }

  return users[0];
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  userId: string,
  updates: { name?: string; phoneNumber?: string }
): Promise<boolean> => {
  if (updates.name) {
    await query<ResultSetHeader>(
      'UPDATE users SET name = ?, updated_at = NOW() WHERE user_id = ?',
      [updates.name, userId]
    );
  }

  if (updates.phoneNumber) {
    await query<ResultSetHeader>(
      'UPDATE customers SET phone_number = ? WHERE user_id = ?',
      [updates.phoneNumber, userId]
    );
  }

  return true;
};

/**
 * Change password
 */
export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<boolean> => {
  // Get current password hash
  const users = await query<RowDataPacket[]>(
    'SELECT password_hash FROM users WHERE user_id = ?',
    [userId]
  );

  if (users.length === 0) {
    throw new AppError('User not found', 404);
  }

  // Verify current password
  const isValid = await comparePassword(currentPassword, users[0].password_hash);

  if (!isValid) {
    throw new AppError('Current password is incorrect', 400);
  }

  // Hash and update new password
  const newPasswordHash = await hashPassword(newPassword);
  await query<ResultSetHeader>(
    'UPDATE users SET password_hash = ?, updated_at = NOW() WHERE user_id = ?',
    [newPasswordHash, userId]
  );

  return true;
};
