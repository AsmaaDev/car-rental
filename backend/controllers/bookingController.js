const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');


// List bookings
exports.listReservations = async (req, res) => {
    try {
      const bookings = await Booking.find(); // Fetch all bookings
      res.status(200).json({ message: 'bookings fetched successfully', bookings });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
    }
};

//create
exports.createReservation = async (req, res) => {
  try {
    const { vehicleId, customerId, rentalDates } = req.body;

    // Validate the presence of rentalDates
    if (!rentalDates || !rentalDates.startDate || !rentalDates.endDate) {
      return res.status(400).json({ message: 'Both start date and end date are required' });
    }

    const startDate = new Date(rentalDates.startDate);
    const endDate = new Date(rentalDates.endDate);

    // Ensure the start and end dates are valid Date objects
    if (isNaN(startDate) || isNaN(endDate)) {
      return res.status(400).json({ message: 'Invalid start or end date format' });
    }

    // Ensure vehicle exists and is available
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(400).json({ message: 'Vehicle not found' });
    }

    console.log("Vehicle Data:", vehicle); // Debugging line to check the full vehicle data

    if (!vehicle.availability) {
      return res.status(400).json({ message: 'Vehicle not available for reservation' });
    }

    // Ensure vehicle rental price exists and is valid
    if (!vehicle.rental_price || isNaN(vehicle.rental_price)) {
      return res.status(400).json({ message: 'Invalid rental price for vehicle' });
    }

    console.log("Vehicle Rental Price:", vehicle.rental_price);  // Debugging line

    // Ensure the start date is before the end date
    if (startDate >= endDate) {
      return res.status(400).json({ message: 'Start date must be before end date' });
    }

    // Check for overlapping bookings with the same vehicle
    const overlappingBookings = await Booking.find({
      vehicleId: vehicleId,
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
      ]
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({ message: 'Vehicle is already booked for the selected dates' });
    }

    // Calculate the rental duration in days
    const rentalDuration = (endDate - startDate) / (1000 * 60 * 60 * 24); // in days

    if (rentalDuration <= 0) {
      return res.status(400).json({ message: 'Invalid rental dates' });
    }

    // Calculate total price
    const totalPrice = rentalDuration * vehicle.rental_price;

    // Debugging line: check if totalPrice is valid
    console.log("Total Price:", totalPrice);

    if (isNaN(totalPrice) || totalPrice <= 0) {
      return res.status(400).json({ message: 'Invalid total price calculation' });
    }

    // Create new booking
    const newBooking = new Booking({ 
      userId: customerId, 
      vehicleId, 
      startDate, 
      endDate, 
      totalPrice 
    });

    // Save the booking
    await newBooking.save();

    // Update vehicle availability
    vehicle.availability = false;
    await vehicle.save();

    res.status(201).json({ message: 'Reservation created successfully', booking: newBooking });
  } catch (error) {
    console.error(error);  // Log the full error for debugging
    res.status(500).json({ message: 'Failed to create reservation', error: error.message });
  }
};



// Update Reservation
exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedBooking = await Booking.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedBooking) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.status(200).json({ message: 'Reservation updated successfully', booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update reservation', error: error.message });
  }
};

// Cancel Reservation
exports.cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Free up the vehicle
    const vehicle = await Vehicle.findById(booking.vehicleId);
    if (vehicle) {
      vehicle.availability = true;
      await vehicle.save();
    }

    // Delete the booking
    await Booking.findByIdAndDelete(id);

    res.status(200).json({ message: 'Reservation canceled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel reservation', error: error.message });
  }
};
