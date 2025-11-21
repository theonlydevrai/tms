/**
 * UNIT TESTING - EXPERIMENT 10
 * Unit 3: Payment Service - Process Payment
 * 
 * Student: Dev Rai (2024301022)
 * Subject: Software Engineering Lab
 */

describe('Payment Service - processPayment()', () => {

  // Test Case 1: Successfully process payment for valid booking
  test('TC1: Should successfully process payment for pending booking', () => {
    const paymentData = {
      bookingId: 'booking-001',
      paymentMethod: 'UPI',
      amount: 400
    };

    const result = processPayment(paymentData);

    expect(result.success).toBe(true);
    expect(result.payment).toBeDefined();
    expect(result.payment!.status).toBe('SUCCESS');
    expect(result.payment!.transactionId).toBeDefined();
    expect(result.bookingStatus).toBe('CONFIRMED');
  });

  // Test Case 2: Reject payment for non-existent booking
  test('TC2: Should reject payment when booking does not exist', () => {
    const paymentData = {
      bookingId: 'invalid-booking',
      paymentMethod: 'CARD',
      amount: 200
    };

    const result = processPayment(paymentData);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Booking not found');
  });

  // Test Case 3: Reject payment for already confirmed booking
  test('TC3: Should reject payment for already paid booking', () => {
    const paymentData = {
      bookingId: 'booking-confirmed',
      paymentMethod: 'UPI',
      amount: 600
    };

    const result = processPayment(paymentData);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Booking already paid');
  });

  // Test Case 4: Reject payment for cancelled booking
  test('TC4: Should reject payment for cancelled booking', () => {
    const paymentData = {
      bookingId: 'booking-cancelled',
      paymentMethod: 'WALLET',
      amount: 300
    };

    const result = processPayment(paymentData);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Cannot pay for cancelled booking');
  });

  // Test Case 5: Generate unique transaction ID for each payment
  test('TC5: Should generate unique transaction ID for each payment', () => {
    const payment1 = processPayment({
      bookingId: 'booking-002',
      paymentMethod: 'UPI',
      amount: 400
    });

    const payment2 = processPayment({
      bookingId: 'booking-003',
      paymentMethod: 'CARD',
      amount: 600
    });

    expect(payment1.success).toBe(true);
    expect(payment2.success).toBe(true);
    expect(payment1.payment).toBeDefined();
    expect(payment2.payment).toBeDefined();
    expect(payment1.payment!.transactionId).not.toBe(payment2.payment!.transactionId);
    expect(payment1.payment!.transactionId).toMatch(/^TXN\d+$/);
    expect(payment2.payment!.transactionId).toMatch(/^TXN\d+$/);
  });

  // Test Case 6: Support multiple payment methods
  test('TC6: Should support different payment methods (UPI, CARD, WALLET)', () => {
    const upiPayment = processPayment({
      bookingId: 'booking-004',
      paymentMethod: 'UPI',
      amount: 200
    });

    const cardPayment = processPayment({
      bookingId: 'booking-005',
      paymentMethod: 'CARD',
      amount: 400
    });

    const walletPayment = processPayment({
      bookingId: 'booking-006',
      paymentMethod: 'WALLET',
      amount: 300
    });

    expect(upiPayment.success).toBe(true);
    expect(cardPayment.success).toBe(true);
    expect(walletPayment.success).toBe(true);
    expect(upiPayment.payment).toBeDefined();
    expect(cardPayment.payment).toBeDefined();
    expect(walletPayment.payment).toBeDefined();
    expect(upiPayment.payment!.paymentMethod).toBe('UPI');
    expect(cardPayment.payment!.paymentMethod).toBe('CARD');
    expect(walletPayment.payment!.paymentMethod).toBe('WALLET');
  });

});

// Mock Database
const mockBookings = {
  'booking-001': { bookingId: 'booking-001', status: 'PENDING', totalAmount: 400 },
  'booking-002': { bookingId: 'booking-002', status: 'PENDING', totalAmount: 400 },
  'booking-003': { bookingId: 'booking-003', status: 'PENDING', totalAmount: 600 },
  'booking-004': { bookingId: 'booking-004', status: 'PENDING', totalAmount: 200 },
  'booking-005': { bookingId: 'booking-005', status: 'PENDING', totalAmount: 400 },
  'booking-006': { bookingId: 'booking-006', status: 'PENDING', totalAmount: 300 },
  'booking-confirmed': { bookingId: 'booking-confirmed', status: 'CONFIRMED', totalAmount: 600 },
  'booking-cancelled': { bookingId: 'booking-cancelled', status: 'CANCELLED', totalAmount: 300 }
};

// Mock Implementation
function processPayment(data: any) {
  // Get booking
  const booking = mockBookings[data.bookingId as keyof typeof mockBookings];

  if (!booking) {
    return { success: false, error: 'Booking not found' };
  }

  // Check booking status
  if (booking.status === 'CONFIRMED') {
    return { success: false, error: 'Booking already paid' };
  }

  if (booking.status === 'CANCELLED') {
    return { success: false, error: 'Cannot pay for cancelled booking' };
  }

  // Generate payment ID and transaction ID
  const paymentId = `payment-${generateUUID()}`;
  const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;

  // Create payment record
  const payment = {
    paymentId,
    bookingId: data.bookingId,
    amount: booking.totalAmount,
    transactionId,
    paymentMethod: data.paymentMethod,
    status: 'SUCCESS',
    paymentDate: new Date().toISOString()
  };

  // Update booking status to CONFIRMED
  booking.status = 'CONFIRMED';

  return {
    success: true,
    payment,
    bookingStatus: 'CONFIRMED'
  };
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}
