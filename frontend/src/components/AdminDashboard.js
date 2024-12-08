import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import VehicleList from './VehicleList';
import BookingList from './BookingList';
import { Routes, Route } from 'react-router-dom';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchUsersAndVehicles = async () => {
      try {
        // Fetch Users
        const usersResponse = await axios.get('http://localhost:5000/api/users');
        if (Array.isArray(usersResponse.data.users)) {
          setUsers(usersResponse.data.users);
        } else {
          console.error('The users data is not an array', usersResponse.data.users);
          setUsers([]);
        }

        // Fetch Vehicles
        const vehiclesResponse = await axios.get('http://localhost:5000/api/vehicles');
        if (Array.isArray(vehiclesResponse.data.vehicles)) {
          setVehicles(vehiclesResponse.data.vehicles);
        } else {
          console.error('The vehicles data is not an array', vehiclesResponse.data.vehicles);
          setVehicles([]);
        }

        // Fetch Bookings
        const bookingsResponse = await axios.get('http://localhost:5000/api/bookings');
        console.log('Bookings response:', bookingsResponse.data);  // Log the entire response

        if (Array.isArray(bookingsResponse.data)) { // If API returns array directly
          setBookings(bookingsResponse.data);
        } else if (Array.isArray(bookingsResponse.data.bookings)) { // If wrapped in an object
          setBookings(bookingsResponse.data.bookings);
        } else {
          console.error('The bookings data is not an array', bookingsResponse.data);
          setBookings([]);
        }

      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchUsersAndVehicles();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-content">
        <Routes>
          <Route path="/" element={<><h1>Website</h1><p>Welcome to the car rental</p></>} />
          <Route path="/admin/" element={<><h1>Home</h1><p>Welcome to the Admin Dashboard</p></>} />
          <Route path="/admin/vehicles" element={<><h2>Vehicles</h2><VehicleList vehicles={vehicles} /></>} />
          <Route path="/admin/users" element={
            <>
              <h2>Users</h2>
              {Array.isArray(users) && users.length > 0 ? (
                <ul>
                  {users.map((user) => (
                    <li key={user._id}>{user.name} - {user.email}</li>
                  ))}
                </ul>
              ) : (
                <p>No users found</p>
              )}
            </>
          } />
          <Route
            path="/admin/bookings"
            element={<BookingList bookings={bookings} onCancel={(id) => console.log('Cancel', id)} />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default AdminDashboard;
