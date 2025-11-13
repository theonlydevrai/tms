/**
 * Payment Routes
 */

import { Router } from 'express';
import * as paymentController from '../controllers/paymentController';
import { authenticate } from '../middleware/auth';
import { validate } from '../validators';
import { processPaymentSchema } from '../validators/schemas';

const router = Router();

// All payment routes require authentication
router.use(authenticate);

// UC9: Initiate payment
router.post('/initiate', paymentController.initiatePayment);

// UC9: Process payment
router.post('/process', validate(processPaymentSchema), paymentController.processPayment);

// Get payment details
router.get('/:id', paymentController.getPayment);

export default router;
