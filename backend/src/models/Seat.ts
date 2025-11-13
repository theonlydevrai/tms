// =====================================================
// Seat Class - FROM UML CLASS DIAGRAM
// Attributes: seatId, row, number, status
// Methods: isAvailable()
// =====================================================

import { SeatStatus, SeatType } from '../types';

/**
 * Seat class (from UML Class Diagram)
 * Represents an individual seat in an auditorium
 */
export class Seat {
  private seatId: string;
  private row: string; // char in Java, string in TypeScript
  private number: number;
  private status: SeatStatus;
  private auditoriumId: string;
  private seatType: SeatType;
  private basePrice: number;

  constructor(
    seatId: string,
    auditoriumId: string,
    row: string,
    number: number,
    status: SeatStatus = SeatStatus.AVAILABLE,
    seatType: SeatType = SeatType.REGULAR,
    basePrice: number = 0
  ) {
    this.seatId = seatId;
    this.auditoriumId = auditoriumId;
    this.row = row;
    this.number = number;
    this.status = status;
    this.seatType = seatType;
    this.basePrice = basePrice;
  }

  /**
   * UC8 - Book Ticket (Seat Selection)
   * Checks if the seat is available for booking
   * @returns true if seat is available, false otherwise
   */
  isAvailable(): boolean {
    return this.status === SeatStatus.AVAILABLE;
  }

  // Getters
  getSeatId(): string {
    return this.seatId;
  }

  getAuditoriumId(): string {
    return this.auditoriumId;
  }

  getRow(): string {
    return this.row;
  }

  getNumber(): number {
    return this.number;
  }

  getStatus(): SeatStatus {
    return this.status;
  }

  getSeatType(): SeatType {
    return this.seatType;
  }

  getBasePrice(): number {
    return this.basePrice;
  }

  // Setters
  setStatus(status: SeatStatus): void {
    this.status = status;
  }

  /**
   * Lock the seat temporarily during booking process
   */
  lock(): void {
    this.status = SeatStatus.LOCKED;
  }

  /**
   * Book the seat
   */
  book(): void {
    this.status = SeatStatus.BOOKED;
  }

  /**
   * Release the seat (make it available again)
   */
  release(): void {
    this.status = SeatStatus.AVAILABLE;
  }
}
