// =====================================================
// Auditorium Class - FROM UML CLASS DIAGRAM
// Attributes: screenNumber, capacity
// Methods: getSeatingLayout()
// Composition: An Auditorium is composed of Seats
// =====================================================

import { Seat } from './Seat';

/**
 * Auditorium class (from UML Class Diagram)
 * Represents a theatre screen/hall
 * Composition relationship: Auditorium HAS Seats
 */
export class Auditorium {
  private screenNumber: number;
  private capacity: number;
  private auditoriumId: string;
  private name: string;
  private totalRows: number;
  private seatsPerRow: number;
  private seats: Seat[]; // Composition - Auditorium composed of Seats

  constructor(
    auditoriumId: string,
    screenNumber: number,
    capacity: number,
    name: string = '',
    totalRows: number = 0,
    seatsPerRow: number = 0
  ) {
    this.auditoriumId = auditoriumId;
    this.screenNumber = screenNumber;
    this.capacity = capacity;
    this.name = name;
    this.totalRows = totalRows;
    this.seatsPerRow = seatsPerRow;
    this.seats = [];
  }

  /**
   * UC14 - Manage Screenings (used when creating screenings)
   * UC8 - Book Ticket (Seat Selection)
   * Returns the complete seating layout for this auditorium
   * @returns List of all seats in this auditorium
   */
  getSeatingLayout(): Seat[] {
    return this.seats;
  }

  /**
   * Add a seat to this auditorium (composition)
   */
  addSeat(seat: Seat): void {
    this.seats.push(seat);
  }

  /**
   * Set all seats for this auditorium
   */
  setSeats(seats: Seat[]): void {
    this.seats = seats;
  }

  // Getters
  getAuditoriumId(): string {
    return this.auditoriumId;
  }

  getScreenNumber(): number {
    return this.screenNumber;
  }

  getCapacity(): number {
    return this.capacity;
  }

  getName(): string {
    return this.name;
  }

  getTotalRows(): number {
    return this.totalRows;
  }

  getSeatsPerRow(): number {
    return this.seatsPerRow;
  }

  getSeats(): Seat[] {
    return this.seats;
  }
}
