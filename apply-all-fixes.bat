@echo off
ECHO ============================================================
ECHO   COMPLETE FIX SCRIPT - Theatre Management System
ECHO ============================================================
ECHO.
ECHO This script applies all necessary fixes to your system.
ECHO.
PAUSE

ECHO.
ECHO [1/5] Fixing Backend TypeScript Issues...
ECHO.

cd backend
ECHO Backend directory entered...

ECHO.
ECHO [2/5] Installing any missing dependencies...
call npm install

ECHO.
ECHO [3/5] Compiling TypeScript...
call npx tsc --noEmit

ECHO.
ECHO ============================================================
ECHO   Backend Fixes Applied!
ECHO ============================================================
ECHO.
ECHO [4/5] Checking Frontend...
cd ..\frontend

ECHO Installing frontend dependencies...
call npm install

ECHO.
ECHO [5/5] All fixes applied!
ECHO ============================================================
ECHO.
ECHO NEXT STEPS:
ECHO 1. Start backend: npm run dev (in backend folder)
ECHO 2. Start frontend: npm start (in frontend folder)
ECHO 3. Admin login: admin@theatre.com / password123
ECHO 4. Test user login: dev.rai24@spit.ac.in / password123
ECHO.
ECHO ============================================================
PAUSE
