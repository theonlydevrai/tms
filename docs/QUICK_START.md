# 🚀 Quick Start Guide - Theatre Management System

**Version:** 1.0  
**Last Updated:** November 12, 2025  

---

## ✅ What's Already Built

### 🎯 Phase 1: Foundation (100% Complete)

1. ✅ **Complete Database Schema**
   - 14 tables matching UML class diagram
   - All relationships (1:1, 1:N, N:M)
   - Performance indexes
   - 8 automated triggers
   - Sample data (370 seats, 6 movies, 9 screenings)

2. ✅ **Backend Entity Classes** (100% UML Match)
   - User interface + BaseUser abstract class
   - Customer class (UC1, UC3, UC8, UC10)
   - Administrator class (UC11, UC12, UC14, UC15, UC16, UC17)
   - Movie, Screening, Auditorium, Seat classes
   - Booking, Payment, Ticket classes
   - All attributes and methods from UML diagram

3. ✅ **Project Structure**
   - Node.js + Express + TypeScript backend
   - MySQL database configuration
   - Environment setup
   - Dependencies installed

---

## 🏃 Running What's Built

### 1. Setup Database

```powershell
# Start MySQL
mysql -u root -p

# Create and populate database
CREATE DATABASE theatre_management_system;
USE theatre_management_system;

SOURCE D:/SPIT/5th Sem/Project/TMS/database/migrations/001_create_tables.sql;
SOURCE D:/SPIT/5th Sem/Project/TMS/database/migrations/002_create_indexes.sql;
SOURCE D:/SPIT/5th Sem/Project/TMS/database/migrations/003_create_triggers.sql;
SOURCE D:/SPIT/5th Sem/Project/TMS/database/seeds/sample_data.sql;
```

**Result:** Database with 14 tables, 370 seats, 6 movies, 9 screenings, test users

---

### 2. Configure Backend

```powershell
cd "D:\SPIT\5th Sem\Project\TMS\backend"

# Edit .env file
notepad .env
```

**Update these values in .env:**
```env
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=theatre_management_system
```

---

### 3. Start Backend Server

```powershell
cd "D:\SPIT\5th Sem\Project\TMS\backend"
npm run dev
```

**Expected Output:**
```
=====================================================
  Theatre Management System - Backend Server
=====================================================
✓ Database connected successfully
✓ Connected to: theatre_management_system
✓ Server running on port 5000
✓ Environment: development
✓ API URL: http://localhost:5000
✓ Health check: http://localhost:5000/health
=====================================================
```

---

### 4. Test What's Working

**Open browser:**
```
http://localhost:5000/health
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Theatre Management System API is running",
  "timestamp": "2025-11-12T..."
}
```

---

## 📊 Database Test Queries

### View Sample Movies

```sql
SELECT movie_id, title, genre, duration_in_minutes, rating 
FROM movies 
WHERE is_active = TRUE;
```

**Expected:** 6 movies (The Dark Knight, Inception, 3 Idiots, etc.)

---

### View Upcoming Screenings

```sql
SELECT 
    s.screening_id,
    m.title AS movie,
    a.name AS auditorium,
    s.start_time,
    s.base_ticket_price,
    s.available_seats
FROM screenings s
JOIN movies m ON s.movie_id = m.movie_id
JOIN auditoriums a ON s.auditorium_id = a.auditorium_id
WHERE s.start_time > NOW()
ORDER BY s.start_time;
```

**Expected:** 9 screenings for next 3 days

---

### View Seat Layout for Screen 1

```sql
SELECT 
    row_label AS row,
    COUNT(*) AS total_seats,
    seat_type,
    base_price
FROM seats
WHERE auditorium_id = 'aud-001'
GROUP BY row_label, seat_type, base_price
ORDER BY row_label;
```

**Expected:** Rows A-J, 10 seats each, 100 total (VIP/PREMIUM/REGULAR pricing)

---

### Check Demo Booking

```sql
SELECT 
    b.booking_code,
    b.status,
    b.total_amount,
    m.title AS movie,
    COUNT(bs.seat_id) AS seats_booked
FROM bookings b
JOIN screenings s ON b.screening_id = s.screening_id
JOIN movies m ON s.movie_id = m.movie_id
JOIN booking_seats bs ON b.booking_id = bs.booking_id
GROUP BY b.booking_id;
```

**Expected:** 1 confirmed booking (DEMO1234) for 2 seats, ₹600

---

### View Payment Logs (Trigger Test)

```sql
SELECT 
    pl.payment_id,
    pl.amount,
    pl.status,
    pl.event_type,
    pl.log_message,
    pl.logged_at
FROM payment_logs pl
ORDER BY pl.logged_at DESC;
```

**Expected:** Multiple log entries showing payment creation, success events (trigger working)

---

## 👤 Test Login Credentials

### Admin Login
```
Email: admin@theatre.com
Password: Admin@123
Role: Administrator
Access: Full system management
```

### Customer Logins
```
1. Email: dev.rai@example.com
   Password: Customer@123
   
2. Email: rahul.sharma@example.com
   Password: Customer@123
   
3. Email: priya.patel@example.com
   Password: Customer@123
   
4. Email: amit.kumar@example.com
   Password: Customer@123
```

**Note:** Authentication endpoints not yet implemented. These will work once Task 7 (Authentication System) is complete.

---

## 🔍 Verify Class Diagram Implementation

### Check All Entity Classes

```powershell
cd "D:\SPIT\5th Sem\Project\TMS\backend\src\models"
dir
```

**Expected Output:**
```
User.ts              (Interface + BaseUser)
Customer.ts          (implements User)
Administrator.ts     (implements User)
Movie.ts
Screening.ts
Auditorium.ts
Seat.ts
Booking.ts
Payment.ts
Ticket.ts
index.ts             (exports all)
```

---

### Verify TypeScript Compilation

```powershell
cd "D:\SPIT\5th Sem\Project\TMS\backend"
npm run build
```

**Expected:** `dist/` folder created with compiled JavaScript

---

## 📁 Project Structure

```
TMS/
├── backend/                    ✅ Backend (Node.js + TypeScript)
│   ├── src/
│   │   ├── models/            ✅ 10 entity classes (UML match)
│   │   ├── types/             ✅ TypeScript types & enums
│   │   ├── config/            ✅ Database connection
│   │   ├── server.ts          ✅ Express app
│   │   ├── controllers/       ⏳ Pending (Task 7-15)
│   │   ├── services/          ⏳ Pending (Task 7-15)
│   │   ├── routes/            ⏳ Pending (Task 7-15)
│   │   └── middleware/        ⏳ Pending (Task 7)
│   ├── package.json           ✅
│   ├── tsconfig.json          ✅
│   ├── .env                   ✅
│   └── .env.example           ✅
│
├── database/                   ✅ Database scripts
│   ├── migrations/
│   │   ├── 001_create_tables.sql    ✅ 14 tables
│   │   ├── 002_create_indexes.sql   ✅ Performance indexes
│   │   └── 003_create_triggers.sql  ✅ 8 triggers
│   └── seeds/
│       └── sample_data.sql          ✅ Test data
│
├── frontend/                   ⏳ Pending (Task 16-24)
│
├── docs/                       ✅ Documentation
│   ├── PROJECT_STATUS.md      ✅ Comprehensive status report
│   └── QUICK_START.md         ✅ This file
│
├── Documentations/             ✅ Original planning PDFs
│   ├── Dev_SRS.pdf
│   ├── Dev_ClassDiagram.pdf
│   ├── Dev_UseCaseExp_TheatreMS.pdf
│   ├── Dev_Activity_Dig.pdf
│   └── Dev_SeqAndCollab.pdf
│
├── .gitignore                  ✅
└── README.md                   ✅ Project documentation
```

---

## 🎯 Next Development Steps

### Priority 1: Authentication System (Task 7) 🔥

**What to Build:**
```
backend/src/
├── services/
│   └── AuthService.ts          - UC1, UC2, UC4, UC5 implementation
├── controllers/
│   └── AuthController.ts       - Request handlers
├── routes/
│   └── authRoutes.ts           - POST /auth/register, /login, etc.
└── middleware/
    ├── authMiddleware.ts       - JWT verification
    └── rbacMiddleware.ts       - isCustomer, isAdmin
```

**Use Cases to Implement:**
- UC1: Register (Customer.register())
- UC2: Login (User.login())
- UC4: Forgot Password
- UC5: Reset Password

**APIs to Create:**
```
POST /api/auth/register       - Customer registration
POST /api/auth/login          - User authentication
POST /api/auth/forgot-password - Send reset link
POST /api/auth/reset-password - Update password
POST /api/auth/logout         - Clear session
```

---

### Priority 2: Movie Management (Task 8)

**What to Build:**
```
backend/src/
├── services/MovieService.ts
├── controllers/MovieController.ts
└── routes/movieRoutes.ts
```

**Use Cases:**
- UC6: Browse Movies
- UC11: Add Movie (Administrator.addMovie())
- UC12: Delete Movie

**APIs:**
```
GET    /api/movies              - Browse movies (public)
GET    /api/movies/:id          - Movie details
POST   /api/admin/movies        - Add movie (admin only)
PUT    /api/admin/movies/:id    - Update movie (admin only)
DELETE /api/admin/movies/:id    - Delete movie (admin only)
```

---

### Priority 3: Screening & Seat Management (Tasks 9-10)

**Continue with remaining backend tasks...**

---

## 📚 Useful Commands

### Development

```powershell
# Start backend dev server
cd backend
npm run dev

# Build TypeScript
npm run build

# Run production build
npm start
```

### Database

```powershell
# Connect to MySQL
mysql -u root -p

# Use database
USE theatre_management_system;

# Show tables
SHOW TABLES;

# View table structure
DESCRIBE users;
```

### Git

```powershell
# Initialize (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "feat: Phase 1 complete - Database and Entity Classes"

# Push to GitHub (configure remote first)
git remote add origin <your-repo-url>
git push -u origin main
```

---

## 🐛 Troubleshooting

### Issue: npm install fails

**Solution:**
```powershell
# Clear cache
npm cache clean --force

# Delete node_modules
Remove-Item -Recurse -Force node_modules

# Reinstall
npm install
```

---

### Issue: Database connection error

**Solution:**
1. Check MySQL is running:
   ```powershell
   mysql -u root -p
   ```

2. Verify .env credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=<your-password>
   DB_NAME=theatre_management_system
   ```

3. Test connection:
   ```sql
   USE theatre_management_system;
   SELECT COUNT(*) FROM users;
   ```

---

### Issue: TypeScript compilation errors

**Solution:**
```powershell
# Install missing types
npm install --save-dev @types/node @types/express

# Check tsconfig.json
cat tsconfig.json
```

---

## 📊 Progress Tracking

**Total Tasks:** 36  
**Completed:** 6 ✅  
**In Progress:** 1 ⏳  
**Pending:** 29  

**Current Phase:** Backend Development  
**Next Milestone:** Complete Authentication System (Task 7)  
**ETA:** Task 7 → 2-3 days, Tasks 8-15 (Backend) → 2 weeks  

---

## 📞 Need Help?

**Developer:** Dev Rai  
**Email:** dev.rai24@spit.ac.in  
**UID:** 2024301022  

**Documentation:**
- Full Status: `docs/PROJECT_STATUS.md`
- Main README: `README.md`
- Database Schema: Check `database/migrations/001_create_tables.sql`
- Class Diagram: `Documentations/Dev_ClassDiagram.pdf`

---

## ✨ Key Achievement

**🎉 Successfully created a complete Theatre Management System foundation:**

✅ **100% UML Class Diagram Match**
- All 10 classes implemented in TypeScript
- Exact attributes and methods from diagram
- Proper inheritance (User → Customer, Administrator)
- All relationships preserved (1:1, 1:N, N:M, composition)

✅ **Production-Ready Database**
- 14 tables with complete schema
- Performance-optimized indexes
- 8 automated triggers
- Sample data for testing

✅ **Professional Setup**
- TypeScript with strict type checking
- Environment configuration
- Connection pooling
- Security headers (Helmet)
- CORS configured
- Logging setup (Morgan)

**Next:** Implement business logic and API endpoints for all 17 use cases! 🚀
