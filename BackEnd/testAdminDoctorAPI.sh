#!/bin/bash

# Test script for admin doctor functionality

echo "Testing Admin Doctor Functionality"
echo "=================================="

# Start server in background
echo "Starting server..."
node server.js &
SERVER_PID=$!
sleep 5

# Register an admin user
echo "1. Registering admin user..."
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@test.com",
    "password": "admin123",
    "role": "admin"
  }'

echo -e "\n\n2. Logging in as admin..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123"
  }')

echo $LOGIN_RESPONSE

# Extract token from login response
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | grep -o '[^"]*$')

if [ -n "$TOKEN" ]; then
  echo -e "\n\n3. Adding a new doctor with admin token..."
  curl -X POST http://localhost:5000/api/users/doctor \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
      "name": "Dr. Smith",
      "email": "drsmith@test.com",
      "password": "doctor123"
    }'
  
  echo -e "\n\n4. Getting list of doctors..."
  curl -X GET http://localhost:5000/api/users/doctors \
    -H "Authorization: Bearer $TOKEN"
else
  echo "Failed to get token, skipping doctor creation"
fi

echo -e "\n\nStopping server..."
kill $SERVER_PID