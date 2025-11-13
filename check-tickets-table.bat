@echo off
echo Checking tickets table structure...
echo.
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p -e "USE theatre_management_system; DESCRIBE tickets;"
echo.
echo.
echo Checking recent tickets...
echo.
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p -e "USE theatre_management_system; SELECT ticket_id, booking_id, ticket_number, LEFT(qr_code_url, 20) as qr_url_preview, created_at FROM tickets ORDER BY created_at DESC LIMIT 5;"
echo.
pause
