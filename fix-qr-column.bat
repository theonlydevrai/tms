@echo off
echo =====================================================
echo Fixing QR Code Column in Database
echo =====================================================
echo.
echo This will modify the tickets table to support larger QR codes
echo.
pause

"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < "database\migrations\004_fix_qr_code_column.sql"

echo.
echo Migration complete!
echo.
pause
