import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './website/Header';
import Footer from './website/Footer';
import '../assets/home.css'; // Optional, depends on your custom styling

function ProfilePage() {
  const [userBookings, setUserBookings] = useState([]);
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
  }); // Store user profile data
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [selectedBooking, setSelectedBooking] = useState(null); // Selected booking for editing
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeTab, setActiveTab] = useState('bookings'); // Track active tab (bookings or profile)
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

  // Fetch user profile information
  const fetchUserProfile = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/user-profile/${userId}`);
      setUserProfile(response.data.profile);  // Set profile data
    } catch (error) {
      console.error('Error fetching user profile:', error);
      alert('Failed to fetch your profile');
    }
  };

  // Fetch bookings and profile on component mount
  useEffect(() => {
    fetchUserBookings();
    fetchUserProfile();
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

  // Handle profile update
  const handleUpdateProfile = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/update-profile/${userId}`, userProfile);
      alert(response.data.message);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <Header />
      <div className="container mt-5">
        <div className="d-flex justify-content-center mb-4">
          <button className="btn btn-primary me-2" onClick={() => handleTabChange('bookings')}>Bookings</button>
          <button className="btn btn-secondary" onClick={() => handleTabChange('profile')}>Edit Profile</button>
        </div>

        {activeTab === 'bookings' && (
          <div>
            <h2>Your Bookings</h2>
            {userBookings.length > 0 ? (
              <table className="table table-striped">
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
                        <button className="btn btn-warning me-2" onClick={() => handleUpdate(booking)}>Edit</button>
                        <button className="btn btn-danger" onClick={() => handleCancel(booking._id)}>Cancel</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>You have no bookings yet.</p>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div>
            <h2>Edit Profile</h2>
            <label className="form-label">Name:</label>
            <input
              type="text"
              className="form-control mb-3"
              value={userProfile.name}
              onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
            />
            <label className="form-label">Email:</label>
            <input
              type="email"
              className="form-control mb-3"
              value={userProfile.email}
              onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
            />
            <button className="btn btn-success" onClick={handleUpdateProfile}>Update Profile</button>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="modal fade show d-block" tabIndex="-1" aria-labelledby="exampleModalLabel" style={{ display: 'block' }} aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Edit Booking</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setIsModalOpen(false)}></button>
              </div>
              <div className="modal-body">
                <label>Start Date:</label>
                <input
                  type="date"
                  className="form-control mb-2"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <label>End Date:</label>
                <input
                  type="date"
                  className="form-control mb-2"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleUpdateBooking}>Confirm Update</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default ProfilePage;
