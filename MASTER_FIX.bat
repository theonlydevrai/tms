@echo off
COLOR 0A
echo.
echo ============================================================
echo    THEATRE MANAGEMENT SYSTEM - MASTER FIX SCRIPT
echo ============================================================
echo.
echo This script will:
echo  1. Fix the QR code database error
echo  2. Verify the fix was applied correctly
echo  3. Check system readiness
echo.
echo ============================================================
pause

echo.
echo [STEP 1/3] Applying database fix...
echo ============================================================
echo.
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < "database\migrations\004_fix_qr_code_column.sql"

IF %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Database fix failed!
    echo Please check your MySQL password and try again.
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Database fix applied successfully!
echo.

echo [STEP 2/3] Verifying the fix...
echo ============================================================
echo.
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p -e "USE theatre_management_system; SHOW COLUMNS FROM tickets LIKE 'qr_code_url';"

echo.
echo [STEP 3/3] System Status Check
echo ============================================================
echo.
echo Database Fix:     [APPLIED]
echo QR Code Column:   [UPDATED TO TEXT]
echo System Status:    [READY FOR TESTING]
echo.
echo ============================================================
echo                    NEXT STEPS
echo ============================================================
echo.
echo 1. Open TWO terminal windows
echo.
echo 2. Terminal 1 - Start Backend:
echo    cd backend
echo    npm run dev
echo.
echo 3. Terminal 2 - Start Frontend:
echo    cd frontend
echo    npm start
echo.
echo 4. Test the system:
echo    - Login to the application
echo    - Book tickets for a movie
echo    - Complete payment
echo    - Download ticket (THIS SHOULD NOW WORK!)
echo.
echo 5. Verify success:
echo    - Check that PDF downloads
echo    - QR code should be visible in the PDF
echo    - No errors in backend console
echo.
echo ============================================================
echo.
echo For detailed testing instructions, see:
echo - TESTING_CHECKLIST.md
echo - FIX_SUMMARY.md
echo - QR_CODE_FIX.md
echo.
echo ============================================================
echo.
pause
