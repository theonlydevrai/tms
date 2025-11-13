# 🚀 Quick Setup Guide

## Prerequisites
- Node.js v20+
- MySQL 8.0+
- Git

## Setup Steps

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd theatre-management-system
```

### 2. Database Setup
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE theatre_management_system;
exit;

# Import schema
mysql -u root -p theatre_management_system < database/migrations/001_create_tables.sql
mysql -u root -p theatre_management_system < database/migrations/002_create_indexes.sql
mysql -u root -p theatre_management_system < database/migrations/003_create_triggers.sql

# (Optional) Load sample data
mysql -u root -p theatre_management_system < database/seeds/sample_data.sql
```

### 3. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MySQL credentials
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=theatre_management_system
```

### 4. Frontend Setup
```bash
cd ../frontend
npm install

# Create .env file
cp .env.example .env
```

### 5. Run Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

## Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/health

## Default Login Credentials

**Admin:**
- Email: admin@theatremanagement.com
- Password: Admin@123

**Test User:**
- Email: john.doe@example.com
- Password: Customer@123

## Troubleshooting

### Backend won't start
```bash
cd backend
npm install
npm run dev
```

### Frontend shows errors
```bash
cd frontend
npm install
npm start
```

### Database connection failed
- Check MySQL is running
- Verify credentials in `backend/.env`
- Ensure database exists

---

For detailed documentation, see [README.md](README.md)
