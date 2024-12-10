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

exports.fetchUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user profile (excluding password for security reasons)
    const userProfile = {
      name: user.name,
      email: user.email,
      // Add any other fields that you want to return as part of the user profile
    };

    res.json({ profile: userProfile });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
};

// Function to update the user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email } = req.body;  // Assuming these fields are being sent in the request body

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user profile
    user.name = name || user.name;  // Only update if a value is provided
    user.email = email || user.email;

    // Save the updated user
    await user.save();

    // Return success response
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};
