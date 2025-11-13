// =====================================================
// User Interface - FROM UML CLASS DIAGRAM
// Attributes: userId, name, email, passwordHash
// Methods: login(), logout()
// =====================================================

import { UserType } from '../types';

/**
 * User interface (from UML Class Diagram)
 * This is an interface that Customer and Administrator implement
 */
export interface User {
  userId: string;
  name: string;
  email: string;
  passwordHash: string;

  /**
   * Authenticates user with email and password
   * @param email - User's email
   * @param password - User's plain text password
   * @returns true if authentication successful, false otherwise
   */
  login(email: string, password: string): Promise<boolean>;

  /**
   * Logs out the user
   */
  logout(): void;
}

/**
 * Abstract base class implementing User interface
 * Provides common functionality for Customer and Administrator
 */
export abstract class BaseUser implements User {
  userId: string;
  name: string;
  email: string;
  passwordHash: string;
  protected userType: UserType;

  constructor(userId: string, name: string, email: string, passwordHash: string, userType: UserType) {
    this.userId = userId;
    this.name = name;
    this.email = email;
    this.passwordHash = passwordHash;
    this.userType = userType;
  }

  /**
   * Implements login() from User interface
   */
  async login(_email: string, _password: string): Promise<boolean> {
    // Implementation will be in the service layer
    // This is a placeholder for the interface contract
    return false;
  }

  /**
   * Implements logout() from User interface
   */
  logout(): void {
    // Implementation will handle session cleanup
    // Placeholder for logout logic
  }

  /**
   * Get user type
   */
  getUserType(): UserType {
    return this.userType;
  }
}
