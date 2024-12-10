const express = require('express');
const cors = require('cors');
const app = express();
const User = require('../models/User');

// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:3000',  // Allow frontend to access the backend
  methods: ['GET', 'POST'],        // Allow specific methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers
}));

// Your login route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Directly compare the password (not recommended, but as per your request)
    if (password !== user.password) {
      return res.status(404).json({ message: 'Password is wrong' });
    }

    // Send userId along with the role
    res.json({
      role: user.role,
      userId: user._id, 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/logout', (req, res) => {
  // Assuming you are using express-session
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to log out' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Directly compare the password (not recommended, but as per your request)
    if (password !== user.password) {
      return res.status(404).json({ message: 'Password is wrong' });
    }

    // If credentials are correct, send role (you can also send token here if needed)
    res.json({ role: user.role, userId: user._id });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
