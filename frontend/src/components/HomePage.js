import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './website/Header';
import Footer from './website/Footer';
import defaultVehicleImage from '../assets/default-vehicle.jpg';
import '../assets/home.css';  

function HomePage() {
  const [vehicles, setVehicles] = useState([]);

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

  const handleBooking = async (carId) => {
    try {
      await axios.post('http://localhost:5000/api/bookings', { carId });
      alert('Car booked successfully!');
    } catch (error) {
      console.error('Error booking car:', error);
      alert('Error booking car. Please try again.');
    }
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
                  <h3>{vehicle.make} {vehicle.model}</h3>
                  <p><strong>Year:</strong> {vehicle.year}</p>
                  <p><strong>Price Per Day:</strong> {vehicle.pricePerDay} USD</p>
                  <button className="book-now-btn" onClick={() => handleBooking(vehicle.id)}>
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
      <Footer />
    </>
  );
}

export default HomePage;