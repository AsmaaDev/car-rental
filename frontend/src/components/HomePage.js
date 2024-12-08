import React, { useEffect, useState } from 'react';
import axios from 'axios';
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

  useEffect(() => {
    // Fetch vehicles from API
    const fetchVehicles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/vehicles');
        setVehicles(response.data.vehicles);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    fetchVehicles();
  }, []);

  const handleBooking = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    try {
      // Send request to create a booking
      const response = await axios.post('http://localhost:5000/api/bookings', {
        vehicleId: selectedCar._id,  // Vehicle ID for the booking
        customerId: selectedCar.userId,  // Assuming selectedCar has a userId
        rentalDates: {
          startDate,
          endDate
        }
      });
      
      alert('Car booked successfully!');
      setIsModalOpen(false);  // Close modal after successful booking
    } catch (error) {
      // Check if the error has a response and display the backend message
      if (error.response && error.response.data) {
        alert(error.response.data.message || 'Error booking car. Please try again.');
      } else {
        alert('Error booking car. Please try again.');
      }
      console.error('Error booking car:', error);
    }
  };

  const handleOpenModal = (vehicle) => {
    setSelectedCar(vehicle);
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
              <div className="car-card" key={vehicle.id}>
                <img
                  src={vehicle.image || defaultVehicleImage}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="car-image"
                />
                <div className="car-details">
                  <h3></h3>
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
        <div className="modal">
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
