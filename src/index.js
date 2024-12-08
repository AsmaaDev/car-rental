import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';  
import Login from './components/LoginPage';
import Admin from './components/AdminDashboard';
import Vehicles from './components/VehicleList';
import Bookings from './components/BookingList';
import Users from './components/UsersList';
import './assets/main.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/admin/*" element={<Admin />} /> 
        <Route path="/admin/vehicles" element={<Vehicles />} /> 
        <Route path="/admin/bookings" element={<Bookings />} /> 
        <Route path="/admin/users" element={<Users />} /> 
      </Routes>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
