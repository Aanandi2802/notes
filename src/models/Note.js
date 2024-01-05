const mongoose = require('mongoose');

// Define the schema for the Note model
const noteSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Title of the note, required field
  content: { type: String, required: true }, // Content of the note, required field
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model, required field
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs with whom the note is shared
});

// Enable text indexing on title and content fields for search functionality
noteSchema.index({ title: 'text', content: 'text' });

// Export the Note model based on the defined schema
module.exports = mongoose.model('Note', noteSchema);
