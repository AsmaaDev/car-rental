const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  vehicleId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Vehicle', 
    required: true 
  },
  startDate: { 
    type: Date, 
    required: [true, 'Start date is required'], 
    validate: {
      validator: function(value) {
        return value < this.endDate; // Ensure startDate is before endDate
      },
      message: 'Start date must be before end date.'
    }
  },
  endDate: { 
    type: Date, 
    required: [true, 'End date is required'], 
    validate: {
      validator: function(value) {
        return value > this.startDate; // Ensure endDate is after startDate
      },
      message: 'End date must be after start date.'
    }
  },
  totalPrice: { 
    type: Number, 
    required: [true, 'Total price is required'], 
    min: [0, 'Price cannot be negative']
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
