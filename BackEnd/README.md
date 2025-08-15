# Clinic Appointment System - Backend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Node.js](https://img.shields.io/badge/Node.js-14.x%20or%20later-brightgreen)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-blue)

> Clinic Appointment Management System using MERN stack

A RESTful API for managing clinic appointments, users, prescriptions, and medications with JWT authentication and role-based access control.

## Table of Contents

- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Development Guidelines](#development-guidelines)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Contact](#contact)

## Technology Stack

- **Runtime Environment**: [Node.js](https://nodejs.org/) (v14.x or later)
- **Web Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose ODM](https://mongoosejs.com/)
- **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/)
- **Password Hashing**: [bcrypt](https://www.npmjs.com/package/bcrypt)
- **Validation**: [express-validator](https://express-validator.github.io/docs/)
- **CORS Handling**: [cors](https://www.npmjs.com/package/cors)
- **Request Logging**: [morgan](https://www.npmjs.com/package/morgan)
- **Environment Variables**: [dotenv](https://www.npmjs.com/package/dotenv)

## Prerequisites

- Node.js 
- npm 
- MongoDB Atlas account or local MongoDB instance
- Git (for version control)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Navigate to the backend directory:
```bash
cd BackEnd
```

3. Install dependencies:
```bash
npm install
```

4. Create a `.env` file based on the configuration section below

5. Start the development server:
```bash
npm run dev
```

Or start the production server:
```bash
npm start
```

## Configuration

Create a `.env` file in the `BackEnd` directory with the following environment variables:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true
JWT_SECRET=your_jwt_secret_key
PORT=5000
JWT_EXPIRE=1h
```

### Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key for JWT token signing | `my_jwt_secret_key` |
| `PORT` | Server port | `5000` |
| `JWT_EXPIRE` | JWT token expiration time | `1h`, `5d` |

## Database Setup

The application uses MongoDB with Mongoose ODM. The database schema includes:

### User Model
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, not selected by default)
- `role`: String (enum: 'patient', 'doctor', 'admin', default: 'patient')
- `specialty`: String (for doctors)
- `experience`: String (for doctors)

### Appointment Model
- `patient`: ObjectId (ref: 'User', required)
- `doctor`: ObjectId (ref: 'User', required)
- `date`: Date (required)
- `time`: String (required)
- `status`: String (enum: 'scheduled', 'confirmed', 'completed', 'cancelled', default: 'scheduled')
- `reason`: String (required)
- `notes`: String
- `duration`: Number (in minutes, default: 30)
- `isEmergency`: Boolean (default: false)

### Prescription Model
- `appointment`: ObjectId (ref: 'Appointment', required)
- `doctor`: ObjectId (ref: 'User', required)
- `patient`: ObjectId (ref: 'User', required)
- `medications`: Array of objects with name, dosage, and frequency
- `diagnosis`: String (required)

### Medication Model
- `name`: String (required, indexed)
- `dosage`: String (required)
- `frequency`: String (required)

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/auth/register` | Register a new user | None |
| POST | `/api/auth/login` | Login user | None |
| GET | `/api/auth/profile` | Get user profile | Bearer Token |
| PUT | `/api/auth/password` | Update user password | Bearer Token |

### User Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/api/users` | Get all users | Bearer Token |
| GET | `/api/users/doctors` | Get all doctors | Bearer Token |
| GET | `/api/users/:id` | Get user by ID | Bearer Token |
| PUT | `/api/users/:id` | Update user | Bearer Token |
| DELETE | `/api/users/:id` | Delete user | Bearer Token |

### Appointment Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/appointments` | Create new appointment | Bearer Token (Patient/Admin) |
| GET | `/api/appointments` | Get all appointments | Bearer Token (Admin) |
| GET | `/api/appointments/my` | Get current user's appointments | Bearer Token |
| GET | `/api/appointments/:id` | Get appointment by ID | Bearer Token |
| PUT | `/api/appointments/:id` | Update appointment | Bearer Token |
| DELETE | `/api/appointments/:id` | Delete appointment | Bearer Token |

### Prescription Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/prescriptions` | Create new prescription | Bearer Token (Doctor) |
| GET | `/api/prescriptions` | Get all prescriptions | Bearer Token (Admin) |
| GET | `/api/prescriptions/my` | Get current user's prescriptions | Bearer Token |
| GET | `/api/prescriptions/appointments/:appointmentId` | Get prescriptions by appointment | Bearer Token |
| GET | `/api/prescriptions/:id` | Get prescription by ID | Bearer Token |
| PUT | `/api/prescriptions/:id` | Update prescription | Bearer Token (Doctor) |
| DELETE | `/api/prescriptions/:id` | Delete prescription | Bearer Token (Doctor) |

### Medication Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/medications` | Create new medication | Bearer Token (Admin) |
| GET | `/api/medications` | Get all medications | None |
| GET | `/api/medications/:id` | Get medication by ID | None |
| PUT | `/api/medications/:id` | Update medication | Bearer Token (Admin) |
| DELETE | `/api/medications/:id` | Delete medication | Bearer Token (Admin) |

### Health Check Endpoint

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check server health |

## Usage Examples

### User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "patient"
  }'
```

### User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Appointment (Patient)
```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "patient": "PATIENT_ID",
    "doctor": "DOCTOR_ID",
    "date": "2023-12-01",
    "time": "10:00",
    "reason": "Regular checkup"
  }'
```

## Project Structure

```
BackEnd/
├── controllers/
│   ├── AuthController.js
│   ├── appointmentcontroller.js
│   ├── medicationController.js
│   ├── prescriptionController.js
│   └── userController.js
├── db/
│   └── index.js
├── middleware/
│   └── index.js
├── models/
│   ├── Medication.js
│   ├── appointment.js
│   ├── prescription.js
│   └── user.js
├── routes/
│   ├── AuthRouter.js
│   ├── appointmentRoutes.js
│   ├── medicationRoutes.js
│   ├── prescriptionRoutes.js
│   └── userRoutes.js
├── .env
├── package.json
└── server.js
```

### Key Files

- **server.js**: Entry point of the application
- **db/index.js**: Database connection setup
- **middleware/index.js**: Authentication and authorization middleware
- **models/**: Mongoose models for data structure
- **controllers/**: Request handlers for different routes
- **routes/**: API route definitions

## Development Guidelines

### Coding Standards

1. Use consistent naming conventions:
   - Camel case for variables and functions (`getUserById`)
   - Pascal case for classes and models (`User`, `Appointment`)
   - Constants in uppercase (`JWT_SECRET`)

2. Error Handling:
   - Always handle errors with try/catch blocks
   - Return appropriate HTTP status codes
   - Log errors for debugging purposes

3. Security Practices:
   - Never commit sensitive data (passwords, API keys)
   - Use environment variables for configuration
   - Implement proper authentication and authorization
   - Validate all user inputs

### Role-Based Access Control

The system implements three user roles:
- **Patient**: Can create and manage their own appointments
- **Doctor**: Can manage appointments assigned to them and create prescriptions
- **Admin**: Can manage all users, appointments, prescriptions, and medications

### Testing

1. Ensure all CRUD operations work correctly
2. Test authentication and authorization
3. Verify data validation
4. Test error handling scenarios

## Deployment

### Production Deployment Steps

1. Set up MongoDB Atlas or production MongoDB instance
2. Configure environment variables for production
3. Build and deploy the application:
   ```bash
   npm start
   ```
4. Set up reverse proxy (e.g., Nginx) if needed
5. Configure SSL certificate for HTTPS

### Hosting Options

- [Heroku](https://www.heroku.com/)
- [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)
- [AWS Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/)
- [Google Cloud Run](https://cloud.google.com/run)

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check if `MONGO_URI` is correctly set in `.env`
   - Ensure MongoDB Atlas IP whitelist includes your IP address
   - Verify network connectivity to MongoDB

2. **JWT Authentication Error**
   - Confirm `JWT_SECRET` is set in `.env`
   - Check if the token has expired
   - Verify the token format in the Authorization header

3. **CORS Error**
   - Check the `cors` configuration in `server.js`
   - Ensure frontend URL is included in the origin list

4. **Port Already in Use**
   - Change the `PORT` value in `.env`
   - Kill the process using the port:
     ```bash
     lsof -i :5000
     kill -9 <PID>
     ```

### Debugging Tips

1. Check server logs for error messages
2. Use tools like Postman to test API endpoints
3. Enable detailed logging by modifying the morgan configuration
4. Verify environment variables are loaded correctly with the health check endpoint


## Contact

For support or queries, please contact the development team.

---

*Clinic Appointment System API - Streamlining healthcare management through technology*