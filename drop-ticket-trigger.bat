@echo off
echo =====================================================
echo Dropping Problematic Ticket Trigger
echo =====================================================
echo.
echo This will remove the auto-ticket-number trigger
echo that's causing the NULL error.
echo.
pause

"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < "database\migrations\005_drop_ticket_trigger.sql"

echo.
echo =====================================================
echo Trigger Removed Successfully!
echo =====================================================
echo.
echo Now restart your backend and try again!
echo.
pause
