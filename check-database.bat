@echo off
echo =====================================================
echo Theatre Management System - Complete System Check
echo =====================================================
echo.

echo Step 1: Checking Database Connection...
echo.
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p -e "USE theatre_management_system; SELECT 'Database Connected!' as Status;"
echo.

echo Step 2: Checking tickets table structure...
echo.
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p -e "USE theatre_management_system; DESCRIBE tickets;"
echo.

echo Step 3: Checking if qr_code_url is TEXT type...
echo.
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p -e "USE theatre_management_system; SHOW COLUMNS FROM tickets LIKE 'qr_code_url';"
echo.

echo =====================================================
echo Check complete!
echo.
echo If qr_code_url shows as 'text' type, the fix is applied correctly.
echo If it shows as 'varchar(500)', please run fix-qr-column.bat
echo =====================================================
pause
