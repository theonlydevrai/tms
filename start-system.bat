@echo off
REM Theatre Management System - Quick Start Script
REM This script will start both backend and frontend servers

echo ========================================
echo Theatre Management System - Quick Start
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed!
    pause
    exit /b 1
)

echo npm version:
npm --version
echo.

echo ========================================
echo Starting Backend Server...
echo ========================================
echo.

REM Open new terminal for backend
start "TMS Backend Server" cmd /k "cd /d "%~dp0backend" && npm run dev"

echo Waiting for backend to initialize (10 seconds)...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo Starting Frontend Server...
echo ========================================
echo.

REM Open new terminal for frontend
start "TMS Frontend Server" cmd /k "cd /d "%~dp0frontend" && npm start"

echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Two new terminal windows have been opened.
echo Please wait for both servers to fully start.
echo.
echo The browser should open automatically to http://localhost:3000
echo.
echo To stop the servers, close both terminal windows or press Ctrl+C in each.
echo.
pause
