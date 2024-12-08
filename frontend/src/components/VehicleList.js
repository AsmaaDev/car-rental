import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function VehicleList() {
  const [vehicleData, setVehicleData] = useState([]);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    pricePerDay: '',
    availability: true
  });

  // Fetch vehicles on mount
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/vehicles');
        setVehicleData(response.data.vehicles); // Corrected line to update state
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        toast.error('Error fetching vehicles.');
      }
    };

    fetchVehicles();
  }, []);

  // Handle form data change
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submit for creating or editing a vehicle
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingVehicle) {
        // Edit vehicle
        await axios.put(`http://localhost:5000/api/vehicles/${editingVehicle._id}`, formData);
        setVehicleData(vehicleData.map(vehicle => vehicle._id === editingVehicle._id ? { ...vehicle, ...formData } : vehicle));
        setEditingVehicle(null);
      } else {
        // Add new vehicle
        const response = await axios.post('http://localhost:5000/api/vehicles', formData);
        setVehicleData([...vehicleData, response.data.vehicle]);
      }
      setFormData({ make: '', model: '', year: '', pricePerDay: '', availability: true });
    } catch (error) {
      console.error('Error submitting vehicle data:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  // Handle Delete
  const handleDelete = async (vehicleId) => {
    try {
      await axios.delete(`http://localhost:5000/api/vehicles/${vehicleId}`);
      setVehicleData(vehicleData.filter(vehicle => vehicle._id !== vehicleId));
      toast.success('Vehicle deleted successfully!');
    } catch (error) {
      console.error('Error deleting vehicle', error);
      toast.error('Error deleting vehicle. Please try again.');
    }
  };

  // Handle Edit
  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      pricePerDay: vehicle.pricePerDay
    });
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <h2>Vehicles</h2>

        {/* Vehicle Form for Add/Edit */}
        <form onSubmit={handleFormSubmit} className="vehicle-form">
          <input
            type="text"
            name="make"
            placeholder="Make"
            value={formData.make}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="model"
            placeholder="Model"
            value={formData.model}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="year"
            placeholder="Year"
            value={formData.year}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="pricePerDay"
            placeholder="Rental Price"
            value={formData.pricePerDay}
            onChange={handleInputChange}
            required
          />
          <button type="submit">{editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}</button>
        </form>

        {/* Table for Vehicles */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Make</th>
                <th>Model</th>
                <th>Year</th>
                <th>Rental Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicleData.length > 0 ? (
                vehicleData.map((vehicle) => (
                  <tr key={vehicle._id}>
                    <td>{vehicle.make}</td>
                    <td>{vehicle.model}</td>
                    <td>{vehicle.year}</td>
                    <td>{vehicle.pricePerDay}</td>
                    <td>
                      <button onClick={() => handleEdit(vehicle)}>Edit</button>
                      <button onClick={() => handleDelete(vehicle._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No vehicles found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default VehicleList;
