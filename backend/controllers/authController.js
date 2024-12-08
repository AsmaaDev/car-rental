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

    res.json({ role: user.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
    res.json({ role: user.role });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
