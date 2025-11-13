@echo off
echo ========================================
echo Theatre Management System - Quick Start
echo ========================================
echo.
echo This script will help you start the system.
echo.
echo PREREQUISITES:
echo - MySQL Server running
echo - Node.js installed
echo - Dependencies installed (npm install in both backend and frontend)
echo.
pause

echo.
echo ========================================
echo Starting Backend Server...
echo ========================================
start "TMS Backend" cmd /k "cd /d backend && npm run dev"
timeout /t 5

echo.
echo ========================================
echo Starting Frontend Server...
echo ========================================
start "TMS Frontend" cmd /k "cd /d frontend && npm start"

echo.
echo ========================================
echo System Starting...
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Admin Login:
echo   Email: admin@theatre.com
echo   Password: password123
echo.
echo Customer Login:
echo   Email: dev.rai@example.com
echo   Password: password123
echo.
echo Press any key to open the application in browser...
pause >nul

start http://localhost:3000

echo.
echo Both servers are running!
echo Close their windows to stop the servers.
echo.
pause
