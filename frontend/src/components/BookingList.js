import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';


function BookingList() {
  const [bookingsData, setBookingData] = useState([]);

  // Fetch bookings on mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/bookings');
        setBookingData(response.data.bookings); 
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Error fetching bookings.');
      }
    };

    fetchBookings();
  }, []);
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <h2>Bookings</h2>

        {/* Table for Bookings */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Customer</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Total Price</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {bookingsData.length > 0 ? (
                bookingsData.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking.vehicleId.make} {booking.vehicleId.model}</td>
                    <td>{booking.userId.name}</td>
                    <td>{new Date(booking.startDate).toLocaleDateString()}</td>
                    <td>{new Date(booking.endDate).toLocaleDateString()}</td>
                    <td>${booking.totalPrice}</td>
                    <td>{new Date(booking.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No bookings found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BookingList;



