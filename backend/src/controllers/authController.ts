/**
 * Authentication Controller
 * Handles HTTP requests for authentication (UC1, UC2, UC4, UC5)
 */

import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import { AppError } from '../middleware/errorHandler';

/**
 * UC1: Register new customer
 * POST /api/auth/register
 */
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    const result = await authService.registerCustomer(name, email, password, phoneNumber);

    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: {
        user: {
          userId: result.user.userId,
          customerId: result.user.customerId,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
        },
        tokens: result.tokens,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * UC2: Login
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser(email, password);

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          userId: result.user.userId,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
          user_type: result.user.user_type, // Add user_type
        },
        tokens: result.tokens,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * UC4: Forgot password
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;

    await authService.forgotPassword(email);

    res.status(200).json({
      status: 'success',
      message: 'If the email exists, a password reset link has been sent',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * UC5: Reset password
 * POST /api/auth/reset-password
 */
export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    await authService.resetPassword(token, newPassword);

    res.status(200).json({
      status: 'success',
      message: 'Password reset successful. You can now login with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 * GET /api/auth/profile
 */
export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const profile = await authService.getUserProfile(req.user.userId);

    res.status(200).json({
      status: 'success',
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 * PUT /api/auth/profile
 */
export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const { name, phoneNumber } = req.body;

    await authService.updateUserProfile(req.user.userId, { name, phoneNumber });

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Change password
 * POST /api/auth/change-password
 */
export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const { currentPassword, newPassword } = req.body;

    await authService.changePassword(req.user.userId, currentPassword, newPassword);

    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout (client-side token removal)
 * POST /api/auth/logout
 */
export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    status: 'success',
    message: 'Logout successful. Please remove the token from client.',
  });
};
