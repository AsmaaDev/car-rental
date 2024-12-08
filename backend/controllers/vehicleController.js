const Vehicle = require('../models/Vehicle');


// List Vehicles
exports.listVehicles = async (req, res) => {
    try {
      const vehicles = await Vehicle.find(); // Fetch all vehicles
      res.status(200).json({ message: 'Vehicles fetched successfully', vehicles });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch vehicles', error: error.message });
    }
};

// Add Vehicle
exports.addVehicle = async (req, res) => {
  try {
    const { make, model, year, pricePerDay, availability } = req.body;

    // Manually check for validation (if you don't want to rely on Mongoose)
    if (!make || !model || !year || !pricePerDay || availability === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate year (range check)
    if (year < 1900 || year > new Date().getFullYear()) {
      return res.status(400).json({ message: 'Year must be between 1900 and the current year' });
    }

    // Validate pricePerDay (check if greater than 0)
    if (pricePerDay <= 0) {
      return res.status(400).json({ message: 'Price per day must be greater than 0' });
    }

    // Create new vehicle
    const newVehicle = new Vehicle({ make, model, year, pricePerDay, availability });

    // Save the vehicle
    await newVehicle.save();

    res.status(201).json({ message: 'Vehicle added successfully', vehicle: newVehicle });
  } catch (error) {
    // Catch Mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation failed', error: error.message });
    }

    res.status(500).json({ message: 'Failed to add vehicle', error: error.message });
  }
};

// Update Vehicle
exports.updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedVehicle = await Vehicle.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json({ message: 'Vehicle updated successfully', vehicle: updatedVehicle });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update vehicle', error: error.message });
  }
};

// Remove Vehicle
exports.removeVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVehicle = await Vehicle.findByIdAndDelete(id);
    if (!deletedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json({ message: 'Vehicle removed successfully', vehicle: deletedVehicle });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove vehicle', error: error.message });
  }
};
