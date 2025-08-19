# Clinic Appointment System - Frontend

A modern React-based frontend application for a clinic appointment management system. This application allows patients and doctors to manage appointments, prescriptions, and user profiles through an intuitive user interface.

A full-stack web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) for a Clinic Appointment System. It enables users to securely register, authenticate, and explore pets available for adoption. The app features a responsive, mobile-first design with smooth animations to enhance user engagement. Users can browse adoptable pets, submit and manage adoption requests, add or edit pet listings, and update their user profiles. JWT-based authentication protects user-specific features, while MongoDB efficiently manages all CRUD operations for users, pets, and adoption requests—ensuring scalable, real-time performance across devices.

## Technology Stack

- **Framework**: [React 19](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Styling**: CSS Modules
- **Development**: [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)

## Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js) or [yarn](https://yarnpkg.com/)

## Installation Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the frontend directory:
   ```bash
   cd FrontEnd
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

## Usage

### Development Server

To start the development server with hot module replacement:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173` by default.

### Production Build

To create a production build:

```bash
npm run build
# or
yarn build
```

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
# or
yarn preview
```

## Project Structure

```
FrontEnd/
    public/                 # Static assets
    src/
        assets/             # Images and other assets
        components/         # Reusable UI components
        hooks/              # Custom React hooks
        pages/              # Page components
        services/           # API services and utilities
        styles/             # CSS stylesheets
        App.jsx             # Main application component
        main.jsx            # Application entry point
    index.html              # HTML template
    package.json            # Project dependencies and scripts
    vite.config.js          # Vite configuration
```

### Key Directories

- **components/**: Contains reusable UI components like forms, lists, navigation, and authentication components
- **pages/**: Contains page-level components that correspond to routes in the application
- **services/**: Contains API service files for communicating with the backend and utility functions
- **hooks/**: Contains custom React hooks for shared logic
- **styles/**: Contains CSS files for styling components and pages

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Creates a production build
- `npm run preview` - Previews the production build locally

## Application Features

- **User Authentication**: Login and registration functionality with role-based access control
- **Appointment Management**: Create, view, edit, and delete appointments
- **Prescription Management**: Create and view prescriptions linked to appointments
- **User Profiles**: Manage user information and update passwords
- **Role-based Dashboards**: Separate dashboards for patients and doctors

## Contributing Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a pull request

