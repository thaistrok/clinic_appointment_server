#!/bin/bash

# Test script for appointment functionality

echo "Testing Appointment Functionality"
echo "=================================="

# Login as patient to get token
echo "1. Logging in as patient..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@test.com",
    "password": "patient123"
  }')

echo $LOGIN_RESPONSE

# Extract token from login response
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | grep -o '[^"]*$')

if [ -n "$TOKEN" ]; then
  echo -e "\n\n2. Getting patient's appointments..."
  curl -X GET http://localhost:5000/api/appointments/my \
    -H "Authorization: Bearer $TOKEN"
else
  echo "Failed to get token"
fi

echo -e "\n\n3. Logging in as doctor..."
LOGIN_RESPONSE_DOCTOR=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@test.com",
    "password": "doctor123"
  }')

echo $LOGIN_RESPONSE_DOCTOR

# Extract token from doctor login response
TOKEN_DOCTOR=$(echo $LOGIN_RESPONSE_DOCTOR | grep -o '"token":"[^"]*' | grep -o '[^"]*$')

if [ -n "$TOKEN_DOCTOR" ]; then
  echo -e "\n\n4. Getting doctor's appointments..."
  curl -X GET http://localhost:5000/api/appointments/my \
    -H "Authorization: Bearer $TOKEN_DOCTOR"
else
  echo "Failed to get doctor token"
fi

echo -e "\n\nTest completed."