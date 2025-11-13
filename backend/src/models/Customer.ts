// =====================================================
// Customer Class - FROM UML CLASS DIAGRAM
// Implements: User interface
// Attributes: phoneNumber (additional to User attributes)
// Methods: register(), updateProfile(), makeBooking(), viewBookingHistory()
// =====================================================

import { BaseUser } from './User';
import { UserType } from '../types';
import { Screening } from './Screening';
import { Seat } from './Seat';
import { Booking } from './Booking';

/**
 * Customer class (implements User interface from UML Class Diagram)
 * Represents end-users who book movie tickets
 */
export class Customer extends BaseUser {
  private phoneNumber: string;
  customerId: string;

  constructor(
    userId: string,
    name: string,
    email: string,
    passwordHash: string,
    customerId: string,
    phoneNumber: string = ''
  ) {
    super(userId, name, email, passwordHash, UserType.CUSTOMER);
    this.customerId = customerId;
    this.phoneNumber = phoneNumber;
  }

  /**
   * UC1 - Register
   * Creates a new customer account
   */
  async register(): Promise<void> {
    // Implementation in CustomerService
    // This method signature matches the UML diagram
  }

  /**
   * UC3 - Manage Profile
   * Updates customer profile information
   */
  async updateProfile(): Promise<void> {
    // Implementation in CustomerService
    // Updates name, email, phone number, etc.
  }

  /**
   * UC8 - Book Ticket
   * Customer makes a booking for a screening with selected seats
   * @param _screening - The screening to book
   * @param _seats - List of seats to book
   * @returns Booking object if successful
   */
  async makeBooking(_screening: Screening, _seats: Seat[]): Promise<Booking | null> {
    // Implementation in BookingService
    // Creates a booking with selected seats
    // Returns Booking object
    return null;
  }

  /**
   * UC10 - View Booking History (part of customer dashboard)
   * Retrieves all bookings made by this customer
   * @returns List of bookings
   */
  async viewBookingHistory(): Promise<Booking[]> {
    // Implementation in BookingService
    // Returns customer's past and upcoming bookings
    return [];
  }

  // Getters and Setters
  getPhoneNumber(): string {
    return this.phoneNumber;
  }

  setPhoneNumber(phoneNumber: string): void {
    this.phoneNumber = phoneNumber;
  }

  getCustomerId(): string {
    return this.customerId;
  }
}
