# Clinic Appointment System

## Description
Clinic Appointment Management System using MERN stack

## Prerequisites
- Node.js v14.x or higher
- MongoDB instance (local or cloud)
- npm package manager

## Installation
```bash
npm install
```

## Running the Application

### Production Mode
To run the server directly with Node.js:
```bash
node server.js
```

This command will:
- Load environment variables from the .env file
- Connect to MongoDB
- Start the Express server (default port 3000)

### Development Mode
To run the server in development mode with automatic restarts:
```bash
npm run dev
```

This command uses nodemon to automatically restart the server when file changes are detected, which is helpful during development.

Both commands have been tested and are working properly. The server successfully:
- Loads environment variables
- Connects to MongoDB
- Starts the Express application
- Handles requests properly

## Environment Variables
Create a `.env` file in the root directory with the following variables:
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_jwt_secret_key
- PORT=3000 (optional, defaults to 3000)

## API Endpoints
- Authentication: `/api/auth`
- Users: `/api/users`
- Appointments: `/api/appointments`

## Dependencies
- bcrypt: ^5.1.0
- cors: ^2.8.5
- dotenv: ^16.3.1
- express: ^4.18.2
- express-validator: ^7.0.1
- jsonwebtoken: ^9.0.2
- mongoose: ^7.5.0

## Dev Dependencies
- jest: ^29.7.0
- nodemon: ^3.0.1
- supertest: ^6.3.4

# Clinic Appointment Server

This is a backend server for a clinic appointment system, built with Node.js, Express, and MongoDB.

## Project Structure

The project follows a modular structure to ensure maintainability and scalability.

```
.
├── .env                 # Environment variables
├── package.json         # Project dependencies and scripts
├──  package-lock.json
├── README.md            # Project documentation
└── src/                 # Source code
    ├── controllers/     # Business logic for handling requests
    │   ├── AuthController.js
    │   ├── appointmentController.js
    │   └── userController.js
    ├── db/              # Database connection and configuration
    │   └── index.js
    ├── middleware/      # Express middleware functions
    │   ├── errorHandler.js
    │   ├── notFound.js
    |   ├── index.js
    │   └── auth.js      # Authentication middleware (to be created)
    ├── models/          # Mongoose schemas for data models
    │   ├── appointment.js
    │   ├── prescription.js
    │   └── user.js
    ├── routes/          # API routes
    │   ├── AuthRouter.js
    │   ├── appointmentroutes.js
    │   └── userroutes.js
    └── server.js        # Main application entry point
```

## API Endpoints

### Authentication (`/api/auth`)

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Log in a user and get access token.
- `POST /api/auth/logout`: Log out a user (clears refresh token cookie).
- `POST /api/auth/refresh-token`: Get a new access token using a refresh token.

### Users (`/api/users`)

- `GET /api/users/me`: Get the profile of the authenticated user.
- `PUT /api/users/me`: Update the profile of the authenticated user.

### Appointments (`/api/appointments`)

- `POST /api/appointments`: Create a new appointment.
- `GET /api/appointments`: Get all appointments for the authenticated user.
- `PUT /api/appointments/:id`: Update an appointment's status (doctor only).

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/clinic_appointment_server.git
    cd clinic_appointment_server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file** in the root directory and add the following environment variables:
    ```
    PORT=3000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    REFRESH_TOKEN_SECRET=your_refresh_token_secret_key
    ACCESS_TOKEN_EXPIRES_IN=15m
    REFRESH_TOKEN_EXPIRES_IN=7d
    ```

4.  **Run the server:**
    ```bash
    npm start
    ```

The server will run on `http://localhost:5000` (or the PORT you specified).
