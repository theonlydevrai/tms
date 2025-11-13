# 🎬 Theatre Management System

A comprehensive full-stack web application for managing theatre operations, movie bookings, and ticket reservations built with **React**, **Node.js**, **Express**, and **MySQL**.

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Demo Screenshots](#-demo-screenshots)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 👤 User Features
- ✅ **User Authentication** - Secure registration and login system with JWT tokens
- ✅ **Movie Browsing** - Browse available movies with detailed information
- ✅ **Movie Details** - View movie synopsis, duration, genre, ratings, and more
- ✅ **Trailer Playback** - Watch movie trailers directly in the application
- ✅ **Seat Selection** - Interactive seat map with real-time availability
- ✅ **Booking System** - Book tickets for multiple seats
- ✅ **Payment Processing** - Integrated payment gateway (UPI, Card, etc.)
- ✅ **Ticket Generation** - Automatic PDF ticket generation with QR codes
- ✅ **Booking Management** - View and manage your bookings
- ✅ **Booking Cancellation** - Cancel bookings with confirmation prompts
- ✅ **Profile Management** - Update personal information and preferences

### 🔐 Admin Features
- ✅ **Admin Dashboard** - Comprehensive analytics and statistics
- ✅ **Movie Management** - Add, edit, and delete movies
- ✅ **Screening Management** - Schedule and manage movie screenings
- ✅ **Reports & Analytics** - View total bookings, revenue, and occupancy
- ✅ **Booking Overview** - Monitor all customer bookings
- ✅ **Role-Based Access Control** - Separate admin and user permissions

---

## 📸 Demo Screenshots

### Home Page
Beautiful landing page with featured movies
![Home Page](screenshots/home.png)

### User Registration
Simple and intuitive registration process
![Register User](screenshots/register_new_user.png)

### User Login
Secure authentication system
![User Login](screenshots/user_login_screen.png)

### Movie Details - Dangal
View comprehensive movie information
![Movie Details](screenshots/dangal_page.png)

### Movie Details - Endgame
Rich movie details with trailer support
![Endgame Details](screenshots/endgame_screen.png)

### Watch Trailer
In-app YouTube trailer playback
![Trailer Playing](screenshots/endgame_trailer.png)

### Book Tickets - Seat Selection
Interactive seat selection interface
![Seat Selection](screenshots/endgame_bookoption.png)

### Seat Layout - Endgame (Selected Seats)
Visual representation of booked and available seats
![Endgame Seat Layout](screenshots/endgame_already_booked_seat_layout.png)

### Seat Selection in Progress
User selecting seats for "Endgame 2"
![Selecting Seats](screenshots/endage%202%20ss%20_selected.png)

### Booking Confirmation
Success message after booking
![Book Success](screenshots/book_success_msg.png)

### My Bookings
View all your current and past bookings
![My Bookings - Endgame](screenshots/engame_booked_my_bookings.png)

### Multiple Bookings
Manage multiple bookings easily
![My Bookings - Multiple](screenshots/2_bookings_in_my_bookings.png)

### Booking Cancellation
Cancel bookings with confirmation dialog
![Cancel Prompt](screenshots/cancel_prompt.png)

### Cancelled Booking - Dangal
Booking successfully cancelled
![Dangal Cancelled](screenshots/dangal_cancelled.png)

### PDF Ticket
Auto-generated PDF ticket with QR code
![PDF Ticket](screenshots/ticket.png)

### User Profile
Manage your profile information
![Profile Page](screenshots/profile_page.png)

### Admin Dashboard
Comprehensive admin control panel
![Admin Dashboard](screenshots/admin_screen.png)

### Admin - Add New Movie
Admin adding "Iron Man" to the system
![Admin Adding Movie](screenshots/admin_adding_new_movie_iron_man.png)

### Admin - Movie Added Successfully
Confirmation of successful movie addition
![Movie Added Success](screenshots/added_success_admin_movie.png)

---

## 🛠 Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Material-UI (MUI)** - Component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Toastify** - Toast notifications

### Backend
- **Node.js 20+** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe development
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Joi** - Data validation
- **Morgan** - HTTP request logger
- **Helmet** - Security headers

### Database
- **MySQL 8.0** - Relational database
- **mysql2** - MySQL client for Node.js

### Development Tools
- **Nodemon** - Auto-restart server
- **ts-node** - TypeScript execution
- **ESLint** - Code linting
- **Prettier** - Code formatting

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Pages   │  │Components│  │ Services │  │  Utils   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ▼ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                     BACKEND (Node.js/Express)                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Routes  │  │Controllers│ │ Services │  │Middleware│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ▼ SQL Queries
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE (MySQL)                        │
│  Users | Movies | Screenings | Bookings | Payments | Tickets│
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Installation

### Prerequisites
- **Node.js** (v20 or higher)
- **MySQL** (v8.0 or higher)
- **npm** or **yarn**
- **Git**

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/theatre-management-system.git
cd theatre-management-system
```

### Step 2: Database Setup
1. Create MySQL database:
```sql
CREATE DATABASE theatre_management_system;
```

2. Import database schema:
```bash
mysql -u root -p theatre_management_system < database/migrations/001_create_tables.sql
mysql -u root -p theatre_management_system < database/migrations/002_create_indexes.sql
mysql -u root -p theatre_management_system < database/migrations/003_create_triggers.sql
```

3. (Optional) Load sample data:
```bash
mysql -u root -p theatre_management_system < database/seeds/sample_data.sql
```

### Step 3: Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in backend directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=theatre_management_system

# JWT Configuration
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRES_IN=7d

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Step 4: Frontend Setup
```bash
cd ../frontend
npm install
```

Create `.env` file in frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## ⚙️ Configuration

### Database Configuration
Edit `backend/.env` to match your MySQL credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=theatre_management_system
```

### JWT Secret
Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Add it to `backend/.env`

---

## 💻 Usage

### Development Mode

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm start
```
Frontend runs on `http://localhost:3000`

### Production Mode

**Build Frontend:**
```bash
cd frontend
npm run build
```

**Start Backend:**
```bash
cd backend
npm run build
npm start
```

---

## 🔑 Default Credentials

### Admin Account
```
Email: admin@theatremanagement.com
Password: Admin@123
```

### Test User Accounts
```
Email: john.doe@example.com
Password: Customer@123

Email: jane.smith@example.com
Password: Customer@123
```

---

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password@123",
  "phoneNumber": "9876543210"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password@123"
}
```

### Movie Endpoints

#### Get All Movies
```http
GET /api/movies
```

#### Get Movie by ID
```http
GET /api/movies/:id
```

#### Create Movie (Admin Only)
```http
POST /api/movies
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Spider-Man: No Way Home",
  "synopsis": "Movie description...",
  "duration": 148,
  "genre": "Action, Adventure",
  "language": "English",
  "rating": "PG-13",
  "posterUrl": "https://example.com/poster.jpg",
  "trailerUrl": "https://youtube.com/watch?v=...",
  "releaseDate": "2024-12-17"
}
```

### Booking Endpoints

#### Create Booking
```http
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "screeningId": "screening-uuid",
  "seatIds": ["seat-uuid-1", "seat-uuid-2"]
}
```

#### Get My Bookings
```http
GET /api/bookings/my-bookings
Authorization: Bearer <token>
```

#### Cancel Booking
```http
DELETE /api/bookings/:id
Authorization: Bearer <token>
```

### Payment Endpoints

#### Process Payment
```http
POST /api/payments/process
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookingId": "booking-uuid",
  "paymentMethod": "UPI"
}
```

---

## 🗄 Database Schema

### Core Tables

#### Users
- `user_id` (VARCHAR 36, PK)
- `name` (VARCHAR 100)
- `email` (VARCHAR 100, UNIQUE)
- `password_hash` (VARCHAR 255)
- `role` (ENUM: CUSTOMER, ADMIN)
- `created_at`, `updated_at`

#### Movies
- `movie_id` (VARCHAR 36, PK)
- `title` (VARCHAR 200)
- `synopsis` (TEXT)
- `duration` (INT)
- `genre` (VARCHAR 100)
- `language` (VARCHAR 50)
- `rating` (VARCHAR 10)
- `poster_url` (VARCHAR 500)
- `trailer_url` (VARCHAR 500)
- `release_date` (DATE)
- `is_active` (BOOLEAN)

#### Screenings
- `screening_id` (VARCHAR 36, PK)
- `movie_id` (VARCHAR 36, FK)
- `auditorium_id` (VARCHAR 36, FK)
- `start_time` (DATETIME)
- `end_time` (DATETIME)
- `base_ticket_price` (DECIMAL)
- `available_seats` (INT)
- `is_active` (BOOLEAN)

#### Bookings
- `booking_id` (VARCHAR 36, PK)
- `customer_id` (VARCHAR 36, FK)
- `screening_id` (VARCHAR 36, FK)
- `booking_code` (VARCHAR 20, UNIQUE)
- `total_amount` (DECIMAL)
- `number_of_seats` (INT)
- `status` (ENUM: PENDING, CONFIRMED, CANCELLED)
- `created_at`, `updated_at`

#### Seats
- `seat_id` (VARCHAR 36, PK)
- `auditorium_id` (VARCHAR 36, FK)
- `row_label` (CHAR 1)
- `seat_number` (INT)
- `seat_type` (ENUM: REGULAR, PREMIUM, VIP)
- `base_price` (DECIMAL)

#### Payments
- `payment_id` (VARCHAR 36, PK)
- `booking_id` (VARCHAR 36, FK)
- `amount` (DECIMAL)
- `transaction_id` (VARCHAR 100, UNIQUE)
- `payment_method` (ENUM: CARD, UPI, WALLET, CASH)
- `status` (ENUM: PENDING, SUCCESS, FAILED)
- `payment_date` (TIMESTAMP)

#### Tickets
- `ticket_id` (VARCHAR 36, PK)
- `booking_id` (VARCHAR 36, FK)
- `ticket_number` (VARCHAR 50, UNIQUE)
- `qr_code_data` (TEXT)
- `generated_at` (TIMESTAMP)

---

## 📁 Project Structure

```
theatre-management-system/
│
├── backend/
│   ├── src/
│   │   ├── config/          # Database & app configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Helper functions
│   │   ├── validators/      # Input validation schemas
│   │   └── server.ts        # App entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   ├── utils/           # Utility functions
│   │   ├── App.tsx          # Main app component
│   │   └── index.tsx        # Entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── database/
│   ├── migrations/          # Database schema migrations
│   └── seeds/               # Sample data
│
├── screenshots/             # Application screenshots
└── README.md
```

---

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
npm test
```

### Run Frontend Tests
```bash
cd frontend
npm test
```

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Browse and search movies
- [ ] View movie details and watch trailer
- [ ] Select seats and book tickets
- [ ] Process payment
- [ ] View bookings
- [ ] Cancel booking
- [ ] Download PDF ticket
- [ ] Admin login
- [ ] Add/edit/delete movies
- [ ] Manage screenings
- [ ] View analytics

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

**Dev Rai** - *Full Stack Developer* - [@devrai](https://github.com/devrai)

---

## 🙏 Acknowledgments

- Material-UI for the beautiful component library
- React team for the amazing framework
- Express.js community
- All contributors and testers

---

## 📧 Contact

For questions or support, please contact:
- Email: dev.rai24@spit.ac.in
- GitHub: [@devrai](https://github.com/devrai)

---

## 🎯 Future Enhancements

- [ ] Real-time seat availability updates using WebSockets
- [ ] Email notifications for bookings
- [ ] SMS notifications
- [ ] Multiple payment gateways (Razorpay, Stripe)
- [ ] Food & beverage ordering
- [ ] Loyalty points system
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Automated refund processing
- [ ] Multi-language support

---

Made with ❤️ by Dev Rai
