import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for redirection
import Header from './website/Header';
import Footer from './website/Footer';
import defaultVehicleImage from '../assets/default-vehicle.webp';
import '../assets/home.css';

function HomePage() {
  const [vehicles, setVehicles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();  // Initialize navigate for redirection

  useEffect(() => {
    // Fetch vehicles from API
    const fetchVehicles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/vehicles');
        console.log('Fetched vehicles:', response.data.vehicles);  // Log vehicles data
        setVehicles(response.data.vehicles);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    fetchVehicles();
  }, []);

  const handleBooking = async () => {
    console.log('Booking vehicle:', selectedCar);  // Log selected car details
  
    // Check if user is logged in by verifying localStorage data
    const userRole = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');
    console.log('User Role:', userRole, 'User ID:', userId);  // Log user data
  
    if (!userRole || !userId) {
      localStorage.setItem('from', window.location.pathname);  // Save the current route
      alert('You need to log in to make a booking.');
      console.log('User not logged in');
      navigate('/login');  // Redirect to the login page if the user is not logged in
      return;
    }
  
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }
  
    try {
      // Log the data before sending the request
      console.log('Sending booking request:', {
        vehicleId: selectedCar._id,
        customerId: userId,
        rentalDates: { startDate, endDate }
      });
  
      const response = await axios.post('http://localhost:5000/api/bookings', {
        vehicleId: selectedCar._id,  // Vehicle ID for the booking
        customerId: userId,  // Use logged in user's ID
        rentalDates: { startDate, endDate }
      });
  
      console.log('Booking response:', response);  // Log response from backend
      alert('Car booked successfully!');
      setIsModalOpen(false);  // Close modal after successful booking
    } catch (error) {
      console.error('Error booking car:', error);
      if (error.response && error.response.data) {
        alert(error.response.data.message || 'Error booking car. Please try again.');
      } else {
        alert('Error booking car. Please try again.');
      }
    }
  };

  const handleOpenModal = (vehicle) => {
    console.log('Opening modal for vehicle:', vehicle);  // Log vehicle data
    setSelectedCar(vehicle);  // Set the selected car
    setIsModalOpen(true);  // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);  // Close the modal
  };

  return (
    <>
      <Header />
      <main>
        <h2 className="main-title">Available Vehicles</h2>
        <div className="car-list">
          {vehicles.length > 0 ? (
            vehicles.map((vehicle) => (
              <div className="car-card" key={vehicle._id}>
                <img
                  src={vehicle.image || defaultVehicleImage}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="car-image"
                />
                <div className="car-details">
                  <h3>{vehicle.make}/{vehicle.model}</h3>
                  <p><strong>Year:</strong> {vehicle.year}</p>
                  <p><strong>Price Per Day:</strong> {vehicle.pricePerDay} USD</p>
                  <button className="book-now-btn" onClick={() => handleOpenModal(vehicle)}>
                    Book Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No vehicles available at the moment.</p>
          )}
        </div>
      </main>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className={`modal ${isModalOpen ? 'open' : ''}`}>
          <div className="modal-content">
            <h3>Book {selectedCar?.make} {selectedCar?.model}</h3>
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
            <button onClick={handleBooking}>Confirm Booking</button>
            <button onClick={handleCloseModal}>Cancel</button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default HomePage;
