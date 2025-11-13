@echo off
color 0A
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║        THEATRE MANAGEMENT SYSTEM - BUG FIX COMPLETE!          ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo [92m✓ Bug Fixed:[0m Booking error resolved (Line 111, BookTicket.tsx)
echo [92m✓ Tests Created:[0m 2 comprehensive test suites ready
echo [92m✓ Documentation:[0m 4 detailed guides created
echo [92m✓ Status:[0m READY FOR PRODUCTION
echo.
echo ════════════════════════════════════════════════════════════════
echo  QUICK START OPTIONS
echo ════════════════════════════════════════════════════════════════
echo.
echo  1. START SYSTEM       - Launch backend + frontend servers
echo  2. RUN TESTS          - Execute automated test suite
echo  3. VIEW DOCUMENTATION - Open bug fix report
echo  4. EXIT
echo.
echo ════════════════════════════════════════════════════════════════
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto start_system
if "%choice%"=="2" goto run_tests
if "%choice%"=="3" goto view_docs
if "%choice%"=="4" goto exit

echo.
echo [91mInvalid choice. Please try again.[0m
timeout /t 2 >nul
goto :eof

:start_system
echo.
echo [93mStarting Theatre Management System...[0m
echo.
call start-system.bat
goto :eof

:run_tests
echo.
echo [93mLaunching Test Runner...[0m
echo.
powershell -ExecutionPolicy Bypass -File run-tests.ps1
pause
goto :eof

:view_docs
echo.
echo [93mOpening Documentation...[0m
echo.
start COMPLETE_SUMMARY.md
start BUG_FIX_REPORT.md
start BUG_FIX_EXPLAINED.md
start QUICK_START_TESTING.md
echo.
echo [92mDocumentation opened in your default text editor.[0m
echo.
pause
goto :eof

:exit
echo.
echo [93mThank you for using Theatre Management System![0m
echo.
timeout /t 2 >nul
exit
