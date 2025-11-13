@echo off
echo =====================================================
echo CLEARING FRONTEND CACHE AND RESTARTING
echo =====================================================
echo.
echo This will:
echo 1. Stop frontend
echo 2. Clear cache
echo 3. Restart frontend
echo.
pause

cd frontend

echo Removing node_modules/.cache...
rd /s /q node_modules\.cache 2>nul

echo.
echo Starting frontend...
npm start

pause
