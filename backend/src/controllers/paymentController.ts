/**
 * Payment Controller
 */

import { Request, Response, NextFunction } from 'express';
import * as paymentService from '../services/paymentService';
import { PaymentMethod } from '../types';

export const initiatePayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { bookingId } = req.body;
    const order = await paymentService.initiatePayment(bookingId);

    res.status(200).json({
      status: 'success',
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

export const processPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { bookingId, paymentMethod, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const result = await paymentService.processPayment(bookingId, paymentMethod as PaymentMethod, {
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
    });

    res.status(200).json({
      status: 'success',
      message: 'Payment processed successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const payment = await paymentService.getPaymentById(id);

    res.status(200).json({
      status: 'success',
      data: { payment },
    });
  } catch (error) {
    next(error);
  }
};
