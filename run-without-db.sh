#!/bin/bash

# Kill any existing processes on port 5000
lsof -ti:5000 | xargs kill -9 2>/dev/null || true

# Wait a moment for port to be freed
sleep 1

# Run without DATABASE_URL to avoid connection errors
echo "Starting TalentFlux without database..."
echo "The app will run in demo mode without data persistence."
echo ""
echo "To use with a real database:"
echo "1. Go to https://console.neon.tech"
echo "2. Create a project and get your connection string"
echo "3. Update DATABASE_URL in .env file"
echo ""
echo "Starting server on http://localhost:5000"
echo ""

# Temporarily unset DATABASE_URL to run without database
unset DATABASE_URL
NODE_ENV=development npx tsx server/index.ts 