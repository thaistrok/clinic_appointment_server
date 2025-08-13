import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import NewAppointment from './pages/NewAppointment';
import EditAppointment from './pages/EditAppointment';
import Prescriptions from './pages/Prescriptions';
import CreatePrescription from './pages/CreatePrescription';
import DoctorDashboard from './pages/DoctorDashboard';
import Profile from './pages/Profile';
import PasswordUpdate from './pages/PasswordUpdate';
import ProtectedRoute from './components/ProtectedRoute';
import Nav from './components/Nav';
import Header from './components/Header';
import './App.css';

function App() {
  return (
    <>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/doctor-dashboard" 
            element={
              <ProtectedRoute requiredRole="doctor">
                <DoctorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/appointments" 
            element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/appointments/new" 
            element={
              <ProtectedRoute>
                <NewAppointment />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/appointments/:id/edit" 
            element={
              <ProtectedRoute>
                <EditAppointment />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/prescriptions" 
            element={
              <ProtectedRoute>
                <Prescriptions />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/prescriptions/create" 
            element={
              <ProtectedRoute>
                <CreatePrescription />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/prescriptions/create/:appointmentId" 
            element={
              <ProtectedRoute>
                <CreatePrescription />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/prescriptions/:id" 
            element={
              <ProtectedRoute>
                <Prescriptions />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/password-update" 
            element={
              <ProtectedRoute>
                <PasswordUpdate />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </>
  );
}

export default App;