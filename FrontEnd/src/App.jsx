import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import AppointmentPage from './pages/AppointmentPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import RegistrationPage from './pages/RegistrationPage'
import './index.css'; 
import './App.css'; 

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/appointments" element={<AppointmentPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/doctors" element={<div>Doctors Page</div>} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/register" element={<RegistrationPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;