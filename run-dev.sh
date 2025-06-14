#!/bin/bash

# Use port 5001 to avoid conflicts
export PORT=5001

echo "Starting TalentFlux on port 5001..."
echo "Access the app at: http://localhost:5001"
echo ""

# Run the development server
npm run dev 