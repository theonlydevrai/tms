// =====================================================
// Booking Class - FROM UML CLASS DIAGRAM
// Attributes: bookingId, bookingTime, totalAmount, status
// Methods: confirmBooking(), generateTicket()
// Relationships:
//   - Made by one Customer (N:1)
//   - For one Screening (N:1)
//   - Reserves multiple Seats (N:M)
//   - Requires one Payment (1:1)
//   - Generates one Ticket (1:1)
// =====================================================

import { DateTime, BookingStatus } from '../types';
import { Seat } from './Seat';
import { Ticket } from './Ticket';
import { Payment } from './Payment';

/**
 * Booking class (from UML Class Diagram)
 * Represents a ticket booking made by a customer
 */
export class Booking {
  private bookingId: string;
  private bookingTime: DateTime;
  private totalAmount: number;
  private status: BookingStatus;
  private customerId: string; // N:1 relationship - made by one Customer
  private screeningId: string; // N:1 relationship - for one Screening
  private numberOfSeats: number;
  private bookingCode: string;

  // N:M relationship - reserves multiple Seats
  private seats: Seat[];

  // 1:1 relationship - requires one Payment
  private payment?: Payment;

  // 1:1 relationship - generates one Ticket
  private ticket?: Ticket;

  constructor(
    bookingId: string,
    customerId: string,
    screeningId: string,
    totalAmount: number,
    numberOfSeats: number,
    bookingCode: string,
    bookingTime: DateTime = new Date(),
    status: BookingStatus = BookingStatus.PENDING
  ) {
    this.bookingId = bookingId;
    this.customerId = customerId;
    this.screeningId = screeningId;
    this.totalAmount = totalAmount;
    this.numberOfSeats = numberOfSeats;
    this.bookingCode = bookingCode;
    this.bookingTime = bookingTime;
    this.status = status;
    this.seats = [];
  }

  /**
   * UC8 - Book Ticket
   * Confirms the booking after successful payment
   */
  confirmBooking(): void {
    this.status = BookingStatus.CONFIRMED;
  }

  /**
   * UC10 - Print E-Ticket
   * Generates an e-ticket for this booking
   * @returns Ticket object
   */
  generateTicket(): Ticket | null {
    // Implementation in TicketService
    // Creates Ticket object with QR code
    return null;
  }

  /**
   * Cancel the booking
   */
  cancelBooking(): void {
    this.status = BookingStatus.CANCELLED;
  }

  /**
   * Add seats to this booking (N:M relationship)
   */
  addSeat(seat: Seat): void {
    this.seats.push(seat);
  }

  /**
   * Set all seats for this booking
   */
  setSeats(seats: Seat[]): void {
    this.seats = seats;
  }

  // Getters
  getBookingId(): string {
    return this.bookingId;
  }

  getCustomerId(): string {
    return this.customerId;
  }

  getScreeningId(): string {
    return this.screeningId;
  }

  getBookingTime(): DateTime {
    return this.bookingTime;
  }

  getTotalAmount(): number {
    return this.totalAmount;
  }

  getNumberOfSeats(): number {
    return this.numberOfSeats;
  }

  getStatus(): BookingStatus {
    return this.status;
  }

  getBookingCode(): string {
    return this.bookingCode;
  }

  getSeats(): Seat[] {
    return this.seats;
  }

  getPayment(): Payment | undefined {
    return this.payment;
  }

  getTicket(): Ticket | undefined {
    return this.ticket;
  }

  // Setters
  setStatus(status: BookingStatus): void {
    this.status = status;
  }

  setPayment(payment: Payment): void {
    this.payment = payment;
  }

  setTicket(ticket: Ticket): void {
    this.ticket = ticket;
  }
}
