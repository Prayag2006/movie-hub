@echo off
echo =========================================
echo       MOVIE HUB - STARTUP SCRIPT
echo =========================================

echo.
echo [1/2] Setting up Backend Server...
cd backend
call npm install
start cmd /k "echo Backend Server Started! & npm run dev"

echo.
echo [2/2] Setup Complete! 
echo Your Movie Cards should now appear on the website.
echo You can close this window.
pause
