#!/bin/bash

echo "===================================="
echo "HostelFlow - Complete Startup Script"
echo "===================================="
echo ""

echo "[1/4] Starting Backend Server..."
cd backend
echo "Installing/Updating backend dependencies..."
npm install > /dev/null 2>&1
echo "Backend starting on port 5000..."
npm run dev &
BACKEND_PID=$!

echo ""
echo "[2/4] Waiting for backend to start..."
sleep 3

echo ""
echo "[3/4] Navigating to frontend..."
cd ..

echo "[4/4] Starting Frontend Server..."
echo "Installing/Updating frontend dependencies..."
npm install > /dev/null 2>&1
echo "Frontend starting on port 5173..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "===================================="
echo "✅ HostelFlow is starting!"
echo "===================================="
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

wait
