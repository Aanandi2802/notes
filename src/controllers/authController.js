// Load environment variables from the .env file
require('dotenv').config();

// Import necessary modules and libraries
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Controller function for user signup
const signup = async (req, res) => {
  try {
    // Extract username and password from the request body
    const { username, password } = req.body;

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    // Generate and send the access token
    const accessToken = jwt.sign({ userId: newUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    res.json({ accessToken: accessToken });
  } catch (error) {
    // Handle errors and return a 500 status code
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller function for user login
const login = async (req, res) => {
  try {
    // Extract username and password from the request body
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate and send the access token
    const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    res.json({ accessToken: accessToken });
  } catch (error) {
    // Handle errors and return a 500 status code
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Export the controller functions for use in routes
module.exports = {
  signup,
  login,
};
