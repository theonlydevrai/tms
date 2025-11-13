// =====================================================
// Screening Class - FROM UML CLASS DIAGRAM
// Attributes: screeningId, startTime
// Methods: getAvailableSeats()
// Relationships:
//   - Shows one Movie (N:1)
//   - Hosted by one Auditorium (N:1)
// =====================================================

import { DateTime } from '../types';
import { Seat } from './Seat';
import { Movie } from './Movie';
import { Auditorium } from './Auditorium';

/**
 * Screening class (from UML Class Diagram)
 * Represents a showtime for a movie in an auditorium
 */
export class Screening {
  private screeningId: string;
  private startTime: DateTime;
  private endTime: DateTime;
  private movieId: string; // Foreign key reference
  private auditoriumId: string; // Foreign key reference
  private baseTicketPrice: number;
  private availableSeats: number;
  private isActive: boolean;

  // Navigation properties (for relationships)
  private movie?: Movie; // N:1 relationship - Screening shows one Movie
  private auditorium?: Auditorium; // N:1 relationship - Screening in one Auditorium

  constructor(
    screeningId: string,
    movieId: string,
    auditoriumId: string,
    startTime: DateTime,
    endTime: DateTime,
    baseTicketPrice: number,
    availableSeats: number,
    isActive: boolean = true
  ) {
    this.screeningId = screeningId;
    this.movieId = movieId;
    this.auditoriumId = auditoriumId;
    this.startTime = startTime;
    this.endTime = endTime;
    this.baseTicketPrice = baseTicketPrice;
    this.availableSeats = availableSeats;
    this.isActive = isActive;
  }

  /**
   * UC8 - Book Ticket (Seat Selection)
   * Returns list of available seats for this screening
   * @returns List of available seats
   */
  async getAvailableSeats(): Promise<Seat[]> {
    // Implementation in ScreeningService
    // Queries database for seats with status = AVAILABLE for this screening
    return [];
  }

  /**
   * Decrease available seats count (called when booking is made)
   */
  decreaseAvailableSeats(count: number): void {
    this.availableSeats -= count;
  }

  /**
   * Increase available seats count (called when booking is cancelled)
   */
  increaseAvailableSeats(count: number): void {
    this.availableSeats += count;
  }

  // Getters
  getScreeningId(): string {
    return this.screeningId;
  }

  getMovieId(): string {
    return this.movieId;
  }

  getAuditoriumId(): string {
    return this.auditoriumId;
  }

  getStartTime(): DateTime {
    return this.startTime;
  }

  getEndTime(): DateTime {
    return this.endTime;
  }

  getBaseTicketPrice(): number {
    return this.baseTicketPrice;
  }

  getAvailableSeatsCount(): number {
    return this.availableSeats;
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  getMovie(): Movie | undefined {
    return this.movie;
  }

  getAuditorium(): Auditorium | undefined {
    return this.auditorium;
  }

  // Setters
  setMovie(movie: Movie): void {
    this.movie = movie;
  }

  setAuditorium(auditorium: Auditorium): void {
    this.auditorium = auditorium;
  }

  setIsActive(isActive: boolean): void {
    this.isActive = isActive;
  }
}
