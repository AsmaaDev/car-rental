const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const app = express();

// User registration

exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      role
    });

    // Save the new user to the database
    await newUser.save();

    // Respond with the user data
    res.status(201).json({
      message: 'User registered successfully',
      userId: newUser._id,
      role: newUser.role,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User login
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

