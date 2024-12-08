const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  make: {
    type: String,
    required: [true, 'Make is required'],
  },
  model: {
    type: String,
    required: [true, 'Model is required'],
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1900, 'Year must be greater than or equal to 1900'],
    max: [new Date().getFullYear(), 'Year cannot be in the future'],
  },
  pricePerDay: {
    type: Number,
    required: [true, 'Price per day is required'],
    min: [1, 'Price must be greater than 0'],
  },
  availability: {
    type: Boolean,
    required: [true, 'Availability is required'],
  },
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
