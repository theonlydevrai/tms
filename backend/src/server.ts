// =====================================================
// Theatre Management System - Backend Server
// Author: Dev Rai (2024301022)
// Implements all 17 use cases from UML diagrams
// =====================================================

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { testConnection } from './config/database';
import { authRoutes, movieRoutes, bookingRoutes, paymentRoutes, ticketRoutes } from './routes';
import screeningRoutes from './routes/screeningRoutes';
import { errorHandler, notFound } from './middleware';

// Load environment variables
dotenv.config();

// Initialize express app
const app: Application = express();
const PORT = process.env.PORT || 5000;
 
// =====================================================
// Middleware
// =====================================================

// Security headers (as per SRS Section 4.2)
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logger
app.use(morgan('dev'));

// =====================================================
// Routes
// =====================================================

// Welcome/Root endpoint
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to Theatre Management System API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: {
        auth: '/api/auth',
        movies: '/api/movies',
        screenings: '/api/screenings',
        bookings: '/api/bookings',
        payments: '/api/payments',
        tickets: '/api/tickets'
      }
    },
    documentation: 'See README.md for API documentation',
    frontend: 'http://localhost:3000'
  });
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Theatre Management System API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/screenings', screeningRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/tickets', ticketRoutes);

// =====================================================
// Error Handling Middleware
// =====================================================

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// =====================================================
// Start Server
// =====================================================

const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Start listening
    app.listen(PORT, () => {
      console.log('\n=====================================================');
      console.log('  Theatre Management System - Backend Server');
      console.log('=====================================================');
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✓ API URL: http://localhost:${PORT}`);
      console.log(`✓ Health check: http://localhost:${PORT}/health`);
      console.log('=====================================================\n');
    });
  } catch (error) {
    console.error('\n❌ FATAL ERROR - Failed to start server:');
    console.error(error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('\n❌ Unhandled Promise Rejection:');
  console.error(err);
  console.error('Stack:', err.stack);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('\n❌ Uncaught Exception:');
  console.error(err);
  console.error('Stack:', err.stack);
  process.exit(1);
});

// Start the server
startServer().catch((err) => {
  console.error('\n❌ Server startup error:');
  console.error(err);
  process.exit(1);
});

export default app;
