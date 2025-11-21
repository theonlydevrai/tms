/**
 * UNIT TESTING - EXPERIMENT 10
 * Unit 1: Authentication Service - User Registration
 * 
 * Student: Dev Rai (2024301022)
 * Subject: Software Engineering Lab
 */

describe('Authentication Service - register()', () => {
  
  // Test Case 1: Successful user registration
  test('TC1: Should successfully register a new user with valid data', () => {
    const userData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'SecurePass@123',
      phoneNumber: '9876543210'
    };
    
    const result = registerUser(userData);
    
    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect(result.user!.email).toBe('john.doe@example.com');
    expect(result.user!.name).toBe('John Doe');
  });

  // Test Case 2: Reject registration with duplicate email
  test('TC2: Should reject registration when email already exists', () => {
    const userData = {
      name: 'Jane Smith',
      email: 'existing@example.com', // Duplicate email
      password: 'SecurePass@123',
      phoneNumber: '9876543211'
    };
    
    const result = registerUser(userData);
    
    expect(result.success).toBe(false);
    expect(result.error).toBe('Email already exists');
  });

  // Test Case 3: Reject registration with invalid email format
  test('TC3: Should reject registration with invalid email format', () => {
    const userData = {
      name: 'Invalid User',
      email: 'invalid-email', // Invalid format
      password: 'SecurePass@123',
      phoneNumber: '9876543212'
    };
    
    const result = registerUser(userData);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid email format');
  });

  // Test Case 4: Reject registration with weak password
  test('TC4: Should reject registration with weak password', () => {
    const userData = {
      name: 'Weak Pass User',
      email: 'weakpass@example.com',
      password: '123', // Too weak
      phoneNumber: '9876543213'
    };
    
    const result = registerUser(userData);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Password must be at least 8 characters');
  });

  // Test Case 5: Reject registration with missing required fields
  test('TC5: Should reject registration when name is missing', () => {
    const userData = {
      name: '',
      email: 'noname@example.com',
      password: 'SecurePass@123',
      phoneNumber: '9876543214'
    };
    
    const result = registerUser(userData);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Name is required');
  });

  // Test Case 6: Verify password is hashed before storage
  test('TC6: Should hash password before storing in database', () => {
    const userData = {
      name: 'Hash Test User',
      email: 'hashtest@example.com',
      password: 'PlainPassword@123',
      phoneNumber: '9876543215'
    };
    
    const result = registerUser(userData);
    
    expect(result.success).toBe(true);
    expect(result.user).toBeDefined();
    expect(result.user!.passwordHash).toBeDefined();
    expect(result.user!.passwordHash).not.toBe('PlainPassword@123');
    expect(result.user!.passwordHash.length).toBeGreaterThan(20);
  });

  // Test Case 7: Reject registration with invalid phone number
  test('TC7: Should reject registration with invalid phone number format', () => {
    const userData = {
      name: 'Phone Test User',
      email: 'phonetest@example.com',
      password: 'SecurePass@123',
      phoneNumber: '123' // Too short
    };
    
    const result = registerUser(userData);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid phone number');
  });

  // Test Case 8: Verify JWT token is generated on successful registration
  test('TC8: Should generate JWT tokens on successful registration', () => {
    const userData = {
      name: 'Token Test User',
      email: 'tokentest@example.com',
      password: 'SecurePass@123',
      phoneNumber: '9876543216'
    };
    
    const result = registerUser(userData);
    
    expect(result.success).toBe(true);
    expect(result.tokens).toBeDefined();
    expect(result.tokens!.accessToken).toBeDefined();
    expect(typeof result.tokens!.accessToken).toBe('string');
    expect(result.tokens!.accessToken.length).toBeGreaterThan(50);
  });

});

// Mock Implementation for Testing
function registerUser(userData: any) {
  // Validation checks
  if (!userData.name || userData.name.trim() === '') {
    return { success: false, error: 'Name is required' };
  }

  if (!isValidEmail(userData.email)) {
    return { success: false, error: 'Invalid email format' };
  }

  if (isEmailExists(userData.email)) {
    return { success: false, error: 'Email already exists' };
  }

  if (!isValidPassword(userData.password)) {
    return { success: false, error: 'Password must be at least 8 characters with uppercase, lowercase, and numbers' };
  }

  if (!isValidPhone(userData.phoneNumber)) {
    return { success: false, error: 'Invalid phone number format' };
  }

  // Hash password
  const passwordHash = hashPassword(userData.password);

  // Generate tokens
  const tokens = {
    accessToken: generateJWT({ email: userData.email, role: 'CUSTOMER' })
  };

  // Create user
  const user = {
    userId: generateUUID(),
    name: userData.name,
    email: userData.email,
    passwordHash,
    role: 'CUSTOMER'
  };

  return {
    success: true,
    user,
    tokens
  };
}

// Helper functions
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isEmailExists(email: string): boolean {
  const existingEmails = ['existing@example.com'];
  return existingEmails.includes(email);
}

function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

function isValidPhone(phone: string): boolean {
  return phone.length === 10 && /^\d+$/.test(phone);
}

function hashPassword(password: string): string {
  return '$2b$10$' + Buffer.from(password).toString('base64') + 'hashedsalt';
}

function generateJWT(payload: any): string {
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + Buffer.from(JSON.stringify(payload)).toString('base64');
}

// function generateUUID(): string {
//   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
//     const r = Math.random() * 16 | 0;
//     return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
//   });
// }
