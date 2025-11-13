@echo off
echo =====================================================
echo FIXING ADMIN LOGIN - FINAL SOLUTION
echo =====================================================
echo.
echo This will set admin password to: admin123
echo.
pause

"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < "fix-admin-login.sql"

echo.
echo =====================================================
echo ✅ DONE! Now try logging in:
echo =====================================================
echo.
echo Email: admin@theatre.com
echo Password: admin123
echo.
echo If this still doesn't work, run:
echo cd backend
echo node quick-hash.js
echo.
pause
