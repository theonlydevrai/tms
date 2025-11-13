// =====================================================
// Payment Class - FROM UML CLASS DIAGRAM
// Attributes: paymentId, amount, paymentDate, transactionId, status
// Methods: processPayment()
// Relationship: Payment is required by one Booking (1:1)
// =====================================================

import { DateTime, PaymentStatus, PaymentMethod } from '../types';

/**
 * Payment class (from UML Class Diagram)
 * Represents a payment transaction for a booking
 */
export class Payment {
  private paymentId: string;
  private amount: number;
  private paymentDate: DateTime;
  private transactionId: string;
  private status: PaymentStatus;
  private bookingId: string; // 1:1 relationship with Booking
  private paymentMethod: PaymentMethod;
  private paymentGateway: string;
  private razorpayOrderId?: string;
  private razorpayPaymentId?: string;
  private razorpaySignature?: string;
  private failureReason?: string;

  constructor(
    paymentId: string,
    bookingId: string,
    amount: number,
    paymentMethod: PaymentMethod,
    paymentDate: DateTime = new Date(),
    transactionId: string = '',
    status: PaymentStatus = PaymentStatus.PENDING,
    paymentGateway: string = 'RAZORPAY'
  ) {
    this.paymentId = paymentId;
    this.bookingId = bookingId;
    this.amount = amount;
    this.paymentMethod = paymentMethod;
    this.paymentDate = paymentDate;
    this.transactionId = transactionId;
    this.status = status;
    this.paymentGateway = paymentGateway;
  }

  /**
   * UC9 - Process Payment
   * Processes the payment through payment gateway
   * @returns true if payment successful, false otherwise
   */
  async processPayment(): Promise<boolean> {
    // Implementation in PaymentService
    // Integrates with Razorpay payment gateway
    // Updates status based on gateway response
    return false;
  }

  /**
   * Mark payment as successful
   */
  markAsSuccess(transactionId: string): void {
    this.status = PaymentStatus.SUCCESS;
    this.transactionId = transactionId;
    this.paymentDate = new Date();
  }

  /**
   * Mark payment as failed
   */
  markAsFailed(reason: string): void {
    this.status = PaymentStatus.FAILED;
    this.failureReason = reason;
  }

  /**
   * Mark payment as refunded
   */
  markAsRefunded(): void {
    this.status = PaymentStatus.REFUNDED;
  }

  // Getters
  getPaymentId(): string {
    return this.paymentId;
  }

  getBookingId(): string {
    return this.bookingId;
  }

  getAmount(): number {
    return this.amount;
  }

  getPaymentDate(): DateTime {
    return this.paymentDate;
  }

  getTransactionId(): string {
    return this.transactionId;
  }

  getStatus(): PaymentStatus {
    return this.status;
  }

  getPaymentMethod(): PaymentMethod {
    return this.paymentMethod;
  }

  getPaymentGateway(): string {
    return this.paymentGateway;
  }

  getFailureReason(): string | undefined {
    return this.failureReason;
  }

  // Razorpay specific getters/setters
  getRazorpayOrderId(): string | undefined {
    return this.razorpayOrderId;
  }

  setRazorpayOrderId(orderId: string): void {
    this.razorpayOrderId = orderId;
  }

  getRazorpayPaymentId(): string | undefined {
    return this.razorpayPaymentId;
  }

  setRazorpayPaymentId(paymentId: string): void {
    this.razorpayPaymentId = paymentId;
  }

  getRazorpaySignature(): string | undefined {
    return this.razorpaySignature;
  }

  setRazorpaySignature(signature: string): void {
    this.razorpaySignature = signature;
  }
}
