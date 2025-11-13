// =====================================================
// Administrator Class - FROM UML CLASS DIAGRAM
// Implements: User interface
// Attributes: employeeId (additional to User attributes)
// Methods: addMovie(), updateMovie(), addScreening(), cancelScreening(), generateReport()
// =====================================================

import { BaseUser } from './User';
import { UserType, ReportType } from '../types';
import { Movie } from './Movie';
import { Screening } from './Screening';

/**
 * Report interface for UC16, UC17
 */
export interface Report {
  reportId: string;
  reportType: ReportType;
  reportData: any;
  dateFrom: Date;
  dateTo: Date;
  generatedAt: Date;
}

/**
 * Administrator class (implements User interface from UML Class Diagram)
 * Represents system administrators who manage the theatre
 */
export class Administrator extends BaseUser {
  private employeeId: string;
  adminId: string;
  private department?: string;

  constructor(
    userId: string,
    name: string,
    email: string,
    passwordHash: string,
    adminId: string,
    employeeId: string,
    department?: string
  ) {
    super(userId, name, email, passwordHash, UserType.ADMINISTRATOR);
    this.adminId = adminId;
    this.employeeId = employeeId;
    this.department = department;
  }

  /**
   * UC11 - Manage Movies
   * Adds a new movie to the system
   * @param movie - Movie object to add
   */
  async addMovie(_movie: Movie): Promise<void> {
    // Implementation in MovieService
    // Inserts movie into database
  }

  /**
   * UC11 - Manage Movies
   * Updates an existing movie
   * @param movie - Movie object with updated details
   */
  async updateMovie(_movie: Movie): Promise<void> {
    // Implementation in MovieService
    // Updates movie details in database
  }

  /**
   * UC14 - Manage Screenings
   * Adds a new screening (showtime) to the system
   * @param screening - Screening object to add
   */
  async addScreening(_screening: Screening): Promise<void> {
    // Implementation in ScreeningService
    // Validates no scheduling conflicts
    // Inserts screening into database
  }

  /**
   * UC15 - Cancel Screening
   * Cancels an upcoming screening
   * @param screeningId - ID of the screening to cancel
   */
  async cancelScreening(_screeningId: string): Promise<void> {
    // Implementation in ScreeningService
    // Marks screening as inactive
    // Notifies users with bookings (if any)
  }

  /**
   * UC16 - View Report
   * Generates a system report based on type
   * @param reportType - Type of report to generate
   * @returns Report object with data
   */
  async generateReport(_reportType: string): Promise<Report | null> {
    // Implementation in ReportService
    // Queries database based on report type
    // Returns aggregated data
    return null;
  }

  // Getters
  getEmployeeId(): string {
    return this.employeeId;
  }

  getAdminId(): string {
    return this.adminId;
  }

  getDepartment(): string | undefined {
    return this.department;
  }

  // Setters
  setDepartment(department: string): void {
    this.department = department;
  }
}
