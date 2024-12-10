import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './website/Header';
import Footer from './website/Footer';
import '../assets/home.css';

function ProfilePage() {
  const [userBookings, setUserBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [selectedBooking, setSelectedBooking] = useState(null); // Selected booking for editing
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();

  // Fetch the user's bookings
  const fetchUserBookings = async () => {
    const userId = localStorage.getItem('userId');  // Get the logged-in user's ID from localStorage

    if (!userId) {
      navigate('/login');  // Redirect to login page if no userId is found
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/user-bookings', {
        userId: userId
      });

      setUserBookings(response.data.bookings);  // Set the bookings to state
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      alert('Failed to fetch your bookings');
    }
  };

  // Fetch bookings on component mount
  useEffect(() => {
    fetchUserBookings();
  }, [navigate]);

  // Open modal to edit booking
  const handleUpdate = (booking) => {
    setSelectedBooking(booking);
  
    // Format the date to yyyy-MM-dd format
    const formattedStartDate = new Date(booking.startDate).toISOString().split('T')[0];
    const formattedEndDate = new Date(booking.endDate).toISOString().split('T')[0];
  
    setStartDate(formattedStartDate);
    setEndDate(formattedEndDate);
  
    setIsModalOpen(true); // Show modal
  };

  // Handle update booking form submission
  const handleUpdateBooking = async () => {
    try {
      const updatedBooking = {
        startDate,
        endDate,
        vehicleId: selectedBooking.vehicleId  
      };

      const response = await axios.put(`http://localhost:5000/api/bookings/${selectedBooking._id}`, updatedBooking);

      alert(response.data.message);

      // Re-fetch user bookings after updating
      fetchUserBookings();

      setIsModalOpen(false); // Close modal after update
    } catch (error) {
      console.error('Error updating reservation:', error);
      alert('Failed to update reservation');
    }
  };

  // Function to handle reservation cancel
  const handleCancel = async (bookingId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/cancel-booking/${bookingId}`);
      alert(response.data.message);
      // Re-fetch user bookings after canceling
      fetchUserBookings();
    } catch (error) {
      console.error('Error canceling reservation:', error);
      alert('Failed to cancel reservation');
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Header />
      <div>
        <h2>Your Bookings</h2>
        {userBookings.length > 0 ? (
          <table className="booking-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Total Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userBookings.map((booking) => (
                <tr key={booking._id}>
                  <td>
                    {booking.vehicleId ? `${booking.vehicleId.make} ${booking.vehicleId.model}` : 'Vehicle info not available'}
                  </td>
                  <td>{new Date(booking.startDate).toLocaleDateString()}</td>
                  <td>{new Date(booking.endDate).toLocaleDateString()}</td>
                  <td>{booking.totalPrice} USD</td>
                  <td>
                    <button onClick={() => handleUpdate(booking)}>Edit</button>
                    <button onClick={() => handleCancel(booking._id)}>Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>You have no bookings yet.</p>
        )}
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className={`modal ${isModalOpen ? 'open' : ''}`}>
          <div className="modal-content">
            <h3>Edit Booking</h3>
            <label>
              Start Date:
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>
            <label>
              End Date:
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
            <button onClick={handleUpdateBooking}>Confirm Update</button>
            <button onClick={handleCloseModal}>Cancel</button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default ProfilePage;
