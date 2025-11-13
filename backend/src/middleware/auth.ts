/**
 * Authentication Middleware
 * Verifies JWT tokens and extracts user information
 */

import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader, TokenPayload } from '../utils/jwt';
import { UserRole } from '../types';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Middleware to verify JWT token and attach user to request
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required. Please provide a valid token.',
      });
      return;
    }

    // Verify token
    const payload = verifyToken(token);

    if (!payload) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid or expired token. Please login again.',
      });
      return;
    }

    // Attach user information to request
    req.user = payload;
    next();
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Authentication failed',
    });
  }
};

/**
 * Middleware to check if user has specific role
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Authentication required',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        status: 'error',
        message: 'You do not have permission to access this resource',
      });
      return;
    }

    next();
  };
};

/**
 * Middleware to check if user is a customer
 */
export const isCustomer = authorize(UserRole.CUSTOMER);

/**
 * Middleware to check if user is an admin
 */
export const isAdmin = authorize(UserRole.ADMIN);

/**
 * Optional authentication - attaches user if token is present, but doesn't require it
 */
export const optionalAuth = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        req.user = payload;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};
