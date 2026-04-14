@echo off
echo ====================================
echo HostelFlow - Complete Startup Script
echo ====================================
echo.

echo [1/4] Starting Backend Server...
cd backend
echo Installing/Updating backend dependencies...
call npm install --silent
echo Backend starting on port 5000...
start cmd /k npm run dev

echo.
echo [2/4] Waiting for backend to start...
timeout /t 3 /nobreak

echo.
echo [3/4] Navigating to frontend...
cd ..

echo [4/4] Starting Frontend Server...
echo Installing/Updating frontend dependencies...
call npm install --silent
echo Frontend starting on port 5173...
start cmd /k npm run dev

echo.
echo ====================================
echo ✅ HostelFlow is starting!
echo ====================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo.
echo Press any key to close this window...
pause
