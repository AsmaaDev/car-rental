const User = require('../models/User');


// List Users
exports.listUsers = async (req, res) => {
    try {
      const users = await User.find(); // Fetch all Users
      res.status(200).json({ message: 'Users fetched successfully', users });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch Users', error: error.message });
    }
};

