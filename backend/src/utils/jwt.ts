/**
 * JWT Utility Functions
 * Handles token generation and verification for authentication
 */

import jwt, { SignOptions } from 'jsonwebtoken';
import { UserRole } from '../types';

// --- START OF NEW, CORRECT FIX ---
// Environment variables are always strings, so we must parse them into numbers.
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = parseInt(process.env.JWT_EXPIRES_IN || '604800', 10); // Default to 7 days in seconds
const REFRESH_TOKEN_EXPIRES_IN = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN || '2592000', 10); // Default to 30 days in seconds
// --- END OF NEW, CORRECT FIX ---


export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // This will now always be a number
}

/**
 * Generate JWT access token
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'theatre-management-system',
    audience: 'tms-api',
  };
  return jwt.sign(payload, JWT_SECRET, options);
};

/**
 * Generate JWT refresh token
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    issuer: 'theatre-management-system',
    audience: 'tms-api',
  };
  return jwt.sign(payload, JWT_SECRET, options);
};

/**
 * Generate both access and refresh tokens
 */
export const generateTokenPair = (payload: TokenPayload): TokenResponse => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
    expiresIn: JWT_EXPIRES_IN,
  };
};

/**
 * Verify and decode JWT token
 */
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'theatre-management-system',
      audience: 'tms-api',
    }) as TokenPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.error('Token expired:', error.message);
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.error('Invalid token:', error.message);
    }
    return null;
  }
};

/**
 * Extract token from Authorization header
 */
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove 'Bearer ' prefix
};

/**
 * Decode token without verification (for debugging)
 */
export const decodeToken = (token: string): any => {
  return jwt.decode(token);
};