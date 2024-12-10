const User = require('../models/User');
const Booking = require('../models/Booking');


// List Users
exports.listUsers = async (req, res) => {
    try {
      const users = await User.find(); // Fetch all Users
      res.status(200).json({ message: 'Users fetched successfully', users });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch Users', error: error.message });
    }
};


// List Bookings for a Logged-in User
exports.listUserBookings = async (req, res) => {
  try {
    // Extract userId from the request (e.g., from JWT token or session)
    const { userId } = req.body;  // Assuming userId is passed in the request body

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Find all bookings related to the user
    const bookings = await Booking.find({ userId })
      .populate('vehicleId', 'make model');

    // const bookings = await Booking.find({ userId: userId });

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this user' });
    }

    // Return the bookings for the logged-in user
    res.status(200).json({ message: 'Bookings fetched successfully', bookings });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
};
