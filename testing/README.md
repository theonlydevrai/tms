# Unit Testing - Theatre Management System

## Experiment 10: Software Engineering Lab

**Student Name:** Dev Rai  
**Roll Number:** 2024301022  
**Subject:** Software Engineering  
**Topic:** Unit Testing

---

## Objective

To understand and implement unit testing by preparing test cases and performing unit testing for the Theatre Management System.

---

## Units Selected for Testing

### 1. **Authentication Service** (`authService.ts`)
   - **Unit:** `register()` - User registration function
   - **Purpose:** Validates user registration logic, password hashing, and database operations
   - **Test Cases:** 8 test cases

### 2. **Booking Service** (`bookingService.ts`)
   - **Unit:** `createBooking()` - Ticket booking function
   - **Purpose:** Validates booking creation, seat availability, and transaction logic
   - **Test Cases:** 7 test cases

### 3. **Payment Service** (`paymentService.ts`)
   - **Unit:** `processPayment()` - Payment processing function
   - **Purpose:** Validates payment processing, booking confirmation, and transaction handling
   - **Test Cases:** 6 test cases

---

## Testing Framework

**Framework:** Jest + TypeScript  
**Language:** TypeScript/Node.js  
**Assertion Library:** Jest (built-in)

---

## Setup Instructions

### 1. Install Dependencies
```bash
cd testing
npm install
```

### 2. Run All Tests
```bash
npm test
```

### 3. Run Tests with Coverage
```bash
npm run test:coverage
```

### 4. Run Tests in Watch Mode
```bash
npm run test:watch
```

---

## Test Cases Summary

| Unit | Test Cases | Description |
|------|------------|-------------|
| Authentication | 8 | Registration validation, duplicate checks, password hashing |
| Booking | 7 | Seat availability, booking creation, validation |
| Payment | 6 | Payment processing, status updates, error handling |
| **Total** | **21** | **Comprehensive test coverage** |

---

## Test Results

Run `npm test` to see detailed results.

Expected output:
```
PASS  tests/authService.test.ts
PASS  tests/bookingService.test.ts
PASS  tests/paymentService.test.ts

Test Suites: 3 passed, 3 total
Tests:       21 passed, 21 total
```

---

## Files Structure

```
testing/
├── README.md                    # This file
├── package.json                 # Dependencies
├── tsconfig.json               # TypeScript config
├── jest.config.js              # Jest configuration
├── tests/
│   ├── authService.test.ts     # Authentication tests
│   ├── bookingService.test.ts  # Booking tests
│   └── paymentService.test.ts  # Payment tests
└── mocks/
    └── database.ts             # Database mock
```

---

## Conclusion

This experiment demonstrates:
- ✅ Understanding of unit testing concepts
- ✅ Implementation of test cases for critical business logic
- ✅ Use of professional testing framework (Jest)
- ✅ Automated testing for quality assurance
- ✅ 100% test pass rate with 21 test cases
