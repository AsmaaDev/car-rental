import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './components/LoginPage';
import Register from './components/Register';
import Profile from './components/ProfilePage';
import Admin from './components/AdminDashboard';
import Vehicles from './components/VehicleList';
import Bookings from './components/BookingList';
import Users from './components/UsersList';
import Payments from './components/PaymentPage';  
import AdminPayments from './components/PaymentPage';  
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/main.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Admin routes */}
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/admin/vehicles" element={<Vehicles />} />
        <Route path="/admin/bookings" element={<Bookings />} />
        <Route path="/admin/users" element={<Users />} />
        
        {/*  payment routes */}
        <Route path="/payments" element={<Payments />} /> {/* User payment page */}
        <Route path="/admin/payments" element={<AdminPayments />} /> {/* Admin payment list */}
        {/* <Route path="/admin/payment/:id" element={<PaymentDetails />} /> Admin payment details */}
      </Routes>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
