-- =====================================================
-- Database Triggers
-- As per SRS Design Constraint: "All payment transactions 
-- must be logged using a MySQL trigger for audit purposes"
-- =====================================================

USE theatre_management_system;

DELIMITER $$

-- =====================================================
-- TRIGGER: Log payment creation
-- =====================================================
CREATE TRIGGER trg_payment_insert
AFTER INSERT ON payments
FOR EACH ROW
BEGIN
    INSERT INTO payment_logs (
        payment_id,
        booking_id,
        amount,
        status,
        transaction_id,
        event_type,
        log_message
    ) VALUES (
        NEW.payment_id,
        NEW.booking_id,
        NEW.amount,
        NEW.status,
        NEW.transaction_id,
        'CREATED',
        CONCAT('Payment created with status: ', NEW.status)
    );
END$$

-- =====================================================
-- TRIGGER: Log payment updates
-- =====================================================
CREATE TRIGGER trg_payment_update
AFTER UPDATE ON payments
FOR EACH ROW
BEGIN
    DECLARE event_type_val ENUM('CREATED', 'UPDATED', 'SUCCESS', 'FAILED', 'REFUNDED');
    DECLARE log_msg TEXT;
    
    -- Determine event type based on status change
    IF NEW.status = 'SUCCESS' AND OLD.status != 'SUCCESS' THEN
        SET event_type_val = 'SUCCESS';
        SET log_msg = CONCAT('Payment successful. Transaction ID: ', NEW.transaction_id);
    ELSEIF NEW.status = 'FAILED' AND OLD.status != 'FAILED' THEN
        SET event_type_val = 'FAILED';
        SET log_msg = CONCAT('Payment failed. Reason: ', IFNULL(NEW.failure_reason, 'Unknown'));
    ELSEIF NEW.status = 'REFUNDED' AND OLD.status != 'REFUNDED' THEN
        SET event_type_val = 'REFUNDED';
        SET log_msg = 'Payment refunded';
    ELSE
        SET event_type_val = 'UPDATED';
        SET log_msg = CONCAT('Payment updated from ', OLD.status, ' to ', NEW.status);
    END IF;
    
    INSERT INTO payment_logs (
        payment_id,
        booking_id,
        amount,
        status,
        transaction_id,
        event_type,
        log_message
    ) VALUES (
        NEW.payment_id,
        NEW.booking_id,
        NEW.amount,
        NEW.status,
        NEW.transaction_id,
        event_type_val,
        log_msg
    );
END$$

-- =====================================================
-- TRIGGER: Update available seats count after booking
-- =====================================================
CREATE TRIGGER trg_update_available_seats_insert
AFTER INSERT ON booking_seats
FOR EACH ROW
BEGIN
    IF NEW.status = 'BOOKED' THEN
        UPDATE screenings
        SET available_seats = available_seats - 1
        WHERE screening_id = NEW.screening_id;
    END IF;
END$$

-- =====================================================
-- TRIGGER: Update available seats count after seat status update
-- =====================================================
CREATE TRIGGER trg_update_available_seats_update
AFTER UPDATE ON booking_seats
FOR EACH ROW
BEGIN
    IF NEW.status = 'BOOKED' AND OLD.status != 'BOOKED' THEN
        -- Seat became booked, decrease available seats
        UPDATE screenings
        SET available_seats = available_seats - 1
        WHERE screening_id = NEW.screening_id;
    ELSEIF OLD.status = 'BOOKED' AND NEW.status != 'BOOKED' THEN
        -- Seat is no longer booked, increase available seats
        UPDATE screenings
        SET available_seats = available_seats + 1
        WHERE screening_id = NEW.screening_id;
    END IF;
END$$

-- =====================================================
-- TRIGGER: Auto-confirm booking on successful payment
-- =====================================================
CREATE TRIGGER trg_confirm_booking_on_payment
AFTER UPDATE ON payments
FOR EACH ROW
BEGIN
    IF NEW.status = 'SUCCESS' AND OLD.status != 'SUCCESS' THEN
        -- Update booking status to CONFIRMED
        UPDATE bookings
        SET status = 'CONFIRMED'
        WHERE booking_id = NEW.booking_id;
        
        -- Update all associated seats to BOOKED
        UPDATE booking_seats
        SET status = 'BOOKED',
            locked_at = NULL,
            locked_until = NULL
        WHERE booking_id = NEW.booking_id;
    END IF;
END$$

-- =====================================================
-- TRIGGER: Cancel booking on payment failure
-- =====================================================
CREATE TRIGGER trg_cancel_booking_on_payment_failure
AFTER UPDATE ON payments
FOR EACH ROW
BEGIN
    IF NEW.status = 'FAILED' AND OLD.status != 'FAILED' THEN
        -- Update booking status to CANCELLED
        UPDATE bookings
        SET status = 'CANCELLED'
        WHERE booking_id = NEW.booking_id;
        
        -- Release all locked seats
        UPDATE booking_seats
        SET status = 'AVAILABLE',
            locked_at = NULL,
            locked_until = NULL
        WHERE booking_id = NEW.booking_id;
    END IF;
END$$

-- =====================================================
-- TRIGGER: Auto-generate ticket number on ticket creation
-- =====================================================
CREATE TRIGGER trg_generate_ticket_number
BEFORE INSERT ON tickets
FOR EACH ROW
BEGIN
    DECLARE ticket_num VARCHAR(50);
    DECLARE booking_code VARCHAR(20);
    
    -- Get booking code
    SELECT booking_code INTO booking_code
    FROM bookings
    WHERE booking_id = NEW.booking_id;
    
    -- Generate ticket number format: TKT-YYYYMMDD-BOOKINGCODE
    SET ticket_num = CONCAT('TKT-', DATE_FORMAT(NOW(), '%Y%m%d'), '-', booking_code);
    SET NEW.ticket_number = ticket_num;
END$$

-- =====================================================
-- TRIGGER: Generate booking code before insert
-- =====================================================
CREATE TRIGGER trg_generate_booking_code
BEFORE INSERT ON bookings
FOR EACH ROW
BEGIN
    DECLARE code VARCHAR(20);
    DECLARE code_exists INT;
    
    -- Generate unique 8-character alphanumeric code
    REPEAT
        SET code = UPPER(CONCAT(
            SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', FLOOR(1 + RAND() * 36), 1),
            SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', FLOOR(1 + RAND() * 36), 1),
            SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', FLOOR(1 + RAND() * 36), 1),
            SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', FLOOR(1 + RAND() * 36), 1),
            SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', FLOOR(1 + RAND() * 36), 1),
            SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', FLOOR(1 + RAND() * 36), 1),
            SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', FLOOR(1 + RAND() * 36), 1),
            SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', FLOOR(1 + RAND() * 36), 1)
        ));
        
        SELECT COUNT(*) INTO code_exists
        FROM bookings
        WHERE booking_code = code;
    UNTIL code_exists = 0 END REPEAT;
    
    SET NEW.booking_code = code;
END$$

DELIMITER ;

-- =====================================================
-- End of Trigger Creation
-- =====================================================
