import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user-related data from localStorage
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    
    // Redirect to the login page
    navigate('/login');
  };

  // Check if user is logged in by looking for 'role' or 'userId' in localStorage
  const isLoggedIn = localStorage.getItem('role') && localStorage.getItem('userId');

  return (
    <header>
      <nav>
        <h1>Car Booking</h1>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/profile">Profile</a></li>
          <li>
            {isLoggedIn ? (
              <button onClick={handleLogout}>Logout</button>
            ) : (
              <a href="/login">Login</a>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
