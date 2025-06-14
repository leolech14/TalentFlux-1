#!/bin/bash

echo "Starting TalentFlux in Replit..."

# Kill any existing processes
pkill -f "node.*server/index.ts" || true
pkill -f "vite" || true

# Start backend server
echo "Starting backend server on port 5001..."
npm run dev &

# Wait for backend to start
sleep 3

# Start frontend server
echo "Starting frontend server on port 5173..."
npx vite &

# Wait for frontend to start
sleep 3

echo "TalentFlux is running!"
echo "Backend: http://localhost:5001"
echo "Frontend: http://localhost:5173"

# Keep the script running
wait 