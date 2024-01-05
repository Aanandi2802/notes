const mongoose = require('mongoose');

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Unique username, required field
  password: { type: String, required: true }, // Password for authentication, required field
});

// Export the User model based on the defined schema
module.exports = mongoose.model('User', userSchema);
