/**
 * Authentication Routes
 * Routes for UC1, UC2, UC4, UC5
 */

import { Router } from 'express';
import * as authController from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validate } from '../validators';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  changePasswordSchema,
} from '../validators/schemas';

const router = Router();

/**
 * Public routes (no authentication required)
 */

// UC1: Register
router.post('/register', validate(registerSchema), authController.register);

// UC2: Login
router.post('/login', validate(loginSchema), authController.login);

// UC4: Forgot password
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);

// UC5: Reset password
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

/**
 * Protected routes (authentication required)
 */

// Get current user profile
router.get('/profile', authenticate, authController.getProfile);

// UC3: Update profile
router.put('/profile', authenticate, validate(updateProfileSchema), authController.updateProfile);

// Change password
router.post('/change-password', authenticate, validate(changePasswordSchema), authController.changePassword);

// Logout
router.post('/logout', authenticate, authController.logout);

export default router;
