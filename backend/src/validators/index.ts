/**
 * Validation Middleware
 * Validates request body against Joi schemas
 */

import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

/**
 * Middleware factory to validate request body
 */
export const validate = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true, // Remove unknown fields
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors,
      });
      return;
    }

    // Replace request body with validated value
    req.body = value;
    next();
  };
};

/**
 * Validate request query parameters
 */
export const validateQuery = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      res.status(400).json({
        status: 'error',
        message: 'Invalid query parameters',
        errors,
      });
      return;
    }

    req.query = value;
    next();
  };
};
