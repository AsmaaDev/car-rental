import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/admin/">Home</Link></li>
        <li><Link to="/admin/bookings">Booking</Link></li>
        <li><Link to="/admin/vehicles">Vehicles</Link></li>
        <li><Link to="/admin/users">Users</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;
