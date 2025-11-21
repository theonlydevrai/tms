/**
 * UNIT TESTING - EXPERIMENT 10
 * Unit 2: Booking Service - Create Booking
 * 
 * Student: Dev Rai (2024301022)
 * Subject: Software Engineering Lab
 */

describe('Booking Service - createBooking()', () => {

  // Reset mock database before each test
  beforeEach(() => {
    mockDatabase.bookedSeats = ['seat-A1', 'seat-A2'];
    mockDatabase.screenings['screening-001'].availableSeats = 50;
    mockDatabase.screenings['screening-002'].availableSeats = 100;
  });

  // Test Case 1: Successful booking with available seats
  test('TC1: Should successfully create booking when seats are available', () => {
    const bookingData = {
      customerId: 'customer-001',
      screeningId: 'screening-001',
      seatIds: ['seat-B1', 'seat-B2']
    };

    const result = createBooking(bookingData);

    expect(result.success).toBe(true);
    expect(result.booking).toBeDefined();
    expect(result.booking!.bookingId).toBeDefined();
    expect(result.booking!.numberOfSeats).toBe(2);
    expect(result.booking!.status).toBe('PENDING');
  });

  // Test Case 2: Reject booking when screening doesn't exist
  test('TC2: Should reject booking when screening is not found', () => {
    const bookingData = {
      customerId: 'customer-001',
      screeningId: 'invalid-screening',
      seatIds: ['seat-A1']
    };

    const result = createBooking(bookingData);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Screening not found or no longer available');
  });

  // Test Case 3: Reject booking when seats are already booked
  test('TC3: Should reject booking when selected seats are not available', () => {
    const bookingData = {
      customerId: 'customer-002',
      screeningId: 'screening-001',
      seatIds: ['seat-A1', 'seat-A2'] // Already booked in TC1
    };

    const result = createBooking(bookingData);

    expect(result.success).toBe(false);
    expect(result.error).toContain('not available');
  });

  // Test Case 4: Reject booking with no seats selected
  test('TC4: Should reject booking when no seats are selected', () => {
    const bookingData = {
      customerId: 'customer-001',
      screeningId: 'screening-001',
      seatIds: []
    };

    const result = createBooking(bookingData);

    expect(result.success).toBe(false);
    expect(result.error).toBe('At least one seat must be selected');
  });

  // Test Case 5: Calculate correct total amount based on seat prices
  test('TC5: Should calculate correct total amount for booking', () => {
    const bookingData = {
      customerId: 'customer-003',
      screeningId: 'screening-002',
      seatIds: ['seat-B1', 'seat-B2', 'seat-B3'] // 3 seats @ 200 each
    };

    const result = createBooking(bookingData);

    expect(result.success).toBe(true);
    expect(result.booking).toBeDefined();
    expect(result.booking!.totalAmount).toBe(600); // 3 * 200
  });

  // Test Case 6: Generate unique booking code
  test('TC6: Should generate unique booking code for each booking', () => {
    const booking1 = createBooking({
      customerId: 'customer-004',
      screeningId: 'screening-002',
      seatIds: ['seat-C1']
    });

    const booking2 = createBooking({
      customerId: 'customer-005',
      screeningId: 'screening-002',
      seatIds: ['seat-C2']
    });

    expect(booking1.success).toBe(true);
    expect(booking2.success).toBe(true);
    expect(booking1.booking).toBeDefined();
    expect(booking2.booking).toBeDefined();
    expect(booking1.booking!.bookingCode).not.toBe(booking2.booking!.bookingCode);
    expect(booking1.booking!.bookingCode).toMatch(/^BK\d+$/);
  });

  // Test Case 7: Reject booking when not enough seats available in screening
  test('TC7: Should reject booking when screening has insufficient available seats', () => {
    const bookingData = {
      customerId: 'customer-006',
      screeningId: 'screening-full', // Screening with 0 available seats
      seatIds: ['seat-D1']
    };

    const result = createBooking(bookingData);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Not enough seats available');
  });

});

// Mock Database
const mockDatabase = {
  screenings: {
    'screening-001': { screeningId: 'screening-001', availableSeats: 50, baseTicketPrice: 200, isActive: true },
    'screening-002': { screeningId: 'screening-002', availableSeats: 100, baseTicketPrice: 200, isActive: true },
    'screening-full': { screeningId: 'screening-full', availableSeats: 0, baseTicketPrice: 200, isActive: true }
  },
  bookedSeats: ['seat-A1', 'seat-A2'] as string[]
};

// Counter for unique booking codes
let bookingCounter = 0;

// Mock Implementation
function createBooking(data: any) {
  // Validate screening exists
  const screening = mockDatabase.screenings[data.screeningId as keyof typeof mockDatabase.screenings];
  if (!screening || !screening.isActive) {
    return { success: false, error: 'Screening not found or no longer available' };
  }

  // Validate seats selected
  if (!data.seatIds || data.seatIds.length === 0) {
    return { success: false, error: 'At least one seat must be selected' };
  }

  // Check if screening has enough available seats
  if (screening.availableSeats < data.seatIds.length) {
    return { success: false, error: 'Not enough seats available' };
  }

  // Check if seats are available
  for (const seatId of data.seatIds) {
    if (mockDatabase.bookedSeats.includes(seatId)) {
      return { success: false, error: `Seat ${seatId} is not available` };
    }
  }

  // Calculate total amount
  const totalAmount = data.seatIds.length * screening.baseTicketPrice;

  // Generate booking code
  bookingCounter++;
  const bookingCode = `BK${Date.now()}${bookingCounter}`;
  const bookingId = `booking-${generateUUID()}`;

  // Mark seats as booked
  mockDatabase.bookedSeats.push(...data.seatIds);

  // Update available seats
  screening.availableSeats -= data.seatIds.length;

  // Create booking
  const booking = {
    bookingId,
    bookingCode,
    customerId: data.customerId,
    screeningId: data.screeningId,
    numberOfSeats: data.seatIds.length,
    totalAmount,
    status: 'PENDING',
    createdAt: new Date().toISOString()
  };

  return {
    success: true,
    booking
  };
}

// function generateUUID(): string {
//   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
//     const r = Math.random() * 16 | 0;
//     return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
//   });
// }
