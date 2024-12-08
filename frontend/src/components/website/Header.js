import React from 'react';

function Header() {
  return (
    <header>
      <nav>
        <h1>Car Booking</h1>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/profile">Profile</a></li>
          <li><a href="/logout">Logout</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
