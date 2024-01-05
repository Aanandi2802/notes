const express = require('express');
const authController = require('../controllers/authController');

// Create a new instance of an Express router
const router = express.Router();

// Define routes for user authentication
router.post('/signup', authController.signup); // Route for user signup
router.post('/login', authController.login);  // Route for user login

// Export the router to be used in other parts of the application
module.exports = router;
