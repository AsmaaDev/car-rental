import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for redirection
import Header from './website/Header';
import Footer from './website/Footer';
import defaultVehicleImage from '../assets/default-vehicle.webp';
import '../assets/home.css'; // You can still use some custom styles if necessary

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
      <main className="container py-5">
        <h2 className="main-title mb-4">Available Vehicles</h2>
        <div className="row">
          {vehicles.length > 0 ? (
            vehicles.map((vehicle) => (
              <div className="col-md-4 mb-4" key={vehicle._id}>
                <div className="card">
                  <img
                    src={vehicle.image || defaultVehicleImage}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{vehicle.make}/{vehicle.model}</h5>
                    <p><strong>Year:</strong> {vehicle.year}</p>
                    <p><strong>Price Per Day:</strong> {vehicle.pricePerDay} USD</p>
                    <button className="btn btn-primary" onClick={() => handleOpenModal(vehicle)}>
                      Book Now
                    </button>
                  </div>
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
        <div className={`modal fade show`} style={{ display: 'block' }} aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Book {selectedCar?.make} {selectedCar?.model}</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Start Date:</label>
                  <input
                    type="date"
                    className="form-control"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">End Date:</label>
                  <input
                    type="date"
                    className="form-control"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                <button className="btn btn-primary" onClick={handleBooking}>Confirm Booking</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default HomePage;
