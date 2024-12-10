import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { toast } from 'react-toastify';

function BookingList() {
  const [bookingsData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/bookings');
        console.log('Bookings data:', response.data);  // Log the response
        setBookingData(response.data.bookings || []);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Error fetching bookings.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <h2>Bookings</h2>

        {loading ? (
          <p>Loading bookings...</p>
        ) : (
          <div className="table-container">
            <table className="table table-striped">
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
                      <td>
                        {booking.vehicleId
                          ? `${booking.vehicleId.make} ${booking.vehicleId.model}`
                          : 'N/A'}
                      </td>
                      <td>{booking.userId ? booking.userId.name : 'N/A'}</td>
                      <td>
                        {booking.startDate
                          ? new Date(booking.startDate).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td>
                        {booking.endDate
                          ? new Date(booking.endDate).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td>{booking.totalPrice ? `$${booking.totalPrice}` : 'N/A'}</td>
                      <td>
                        {booking.createdAt
                          ? new Date(booking.createdAt).toLocaleString()
                          : 'N/A'}
                      </td>
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
        )}
      </div>
    </div>
  );
}

export default BookingList;
