@echo off
echo ================================================
echo   Updating Screening Times to Future Dates
echo ================================================
echo.

mysql -u root -p"Devrai@2911" < "database\update-screening-times.sql"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================
    echo   SUCCESS! All screenings updated to future dates
    echo ================================================
    echo.
    echo All movies should now show "Book Now" buttons!
    echo Please restart your backend server if it's running.
    echo.
) else (
    echo.
    echo ================================================
    echo   ERROR! Failed to update screenings
    echo ================================================
    echo Please check your MySQL credentials
)

pause
