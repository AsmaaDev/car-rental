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
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">Car Booking</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="/">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/profile">Profile</a>
              </li>
              <li className="nav-item">
                {isLoggedIn ? (
                  <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
                ) : (
                  <>
                    <a className="btn btn-outline-primary" href="/login">Login</a>
                    <a className="btn btn-outline-secondary ms-2" href="/register">Register</a>
                  </>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
