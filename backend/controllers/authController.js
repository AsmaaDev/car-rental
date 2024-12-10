const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const app = express();

// User registration
app.post('/api/register', async (req, res) => {
  console.log(req.body); // Add this to debug
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      userId: newUser._id,
      role: newUser.role,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});


exports.register = async (req, res) => {
  console.log(req.body); // Add this to debug
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      userId: newUser._id,
      role: newUser.role,
    });
  } catch (error) {
    console.error(error.message);
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
    res.json({
      role: user.role,
      userId: user._id, 
    });
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
    res.json({
      role: user.role,
      userId: user._id, 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

