/**
 * Ticket Routes
 */

import { Router } from 'express';
import * as ticketController from '../controllers/ticketController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All ticket routes require authentication
router.use(authenticate);

// UC10: Download ticket
router.get('/download/:bookingId', ticketController.generateTicket);

// Get ticket details
router.get('/:id', ticketController.getTicket);

export default router;
