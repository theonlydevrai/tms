@echo off
echo =====================================================
echo Resetting Admin Password
echo =====================================================
echo.
echo This will reset admin password to: admin123
echo Email: admin@theatre.com
echo.
pause

"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < "reset-admin-password.sql"

echo.
echo =====================================================
echo Password Reset Complete!
echo =====================================================
echo.
echo Admin Login Credentials:
echo Email: admin@theatre.com
echo Password: admin123
echo.
echo Now try logging in!
echo.
pause
