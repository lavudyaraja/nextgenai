#!/bin/bash

echo "Starting AI Assistant Application with Turbo..."
echo "=============================================="

# Install turbo if not already installed
if ! command -v turbo &> /dev/null; then
    echo "Installing turbo..."
    npm install turbo
fi

# Start the application using turbo
echo "Starting the application..."
echo "The application will be available at: http://localhost:3000"
echo "Press Ctrl+C to stop the server"
echo ""

# Run with turbo
npx turbo run dev