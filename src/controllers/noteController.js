// src/controllers/noteController.js
const { ObjectId } = require('mongoose').Types;
const Note = require('../models/Note');
const User = require('../models/User');
const mongoose = require('mongoose');

// Get all notes for the authenticated user
const getAllNotes = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Use $or operator to check if either userId or sharedWith array contains the authenticated user's ID
    const notes = await Note.find({
      $or: [
        { userId: userId },
        { sharedWith: { $in: [userId] } } // Check if userId is in the sharedWith array
      ]
    });

    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a note by its ID for the authenticated user
const getNoteById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const noteId = req.params.id;

    // Use $or operator to check if either userId or sharedWith array contains the authenticated user's ID
    const note = await Note.findOne({
      _id: noteId,
      $or: [
        { userId: userId },                 // Check if the note belongs to the authenticated user
        { sharedWith: { $in: [userId] } }   // Check if the authenticated user's ID is in the sharedWith array
      ]
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new note for the authenticated user
const createNote = async (req, res) => {
  try {
    const userId = req.user.userId; // Use req.user._id instead of req.user.userId
    const { title, content } = req.body;
    console.log('User ID:', req.user.userId);

    // Include userId when creating a new note
    const newNote = new Note({ title, content, userId });
    await newNote.save();

    res.status(201).json(newNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update an existing note by its ID for the authenticated user
const updateNote = async (req, res) => {
  try {
    const userId = req.user.userId;
    const noteId = req.params.id;
    const { title, content } = req.body;

    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, userId },
      { title, content },
      { new: true } // Return the updated note
    );

    if (!updatedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(updatedNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a note by its ID for the authenticated user
const deleteNote = async (req, res) => {
  try {
    const userId = req.user.userId;
    const noteId = req.params.id;

    const deletedNote = await Note.findOneAndDelete({ _id: noteId, userId });

    if (!deletedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(deletedNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Share a note with another user for the authenticated user
const shareNote = async (req, res) => {
  try {
    const userId = req.user.userId;
    const noteId = req.params.id;
    const { sharedUserId } = req.body;

    console.log('noteId:', noteId);
    console.log('userId:', userId);

    // Find the note by ID and user ID
    const note = await Note.findOne({ _id: noteId, userId: userId });

    console.log(note);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // Check if the user to share with exists
    const sharedUser = await User.findById(sharedUserId);

    // Check if the user is found
    if (!sharedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the note is already shared with the user
    if (note.sharedWith.includes(sharedUserId)) {
      return res.status(400).json({ error: 'Note is already shared with this user' });
    }

    // Add the user ID to the sharedWith array
    note.sharedWith.push(sharedUserId);

    // Save the updated note
    await note.save();

    res.json({ message: 'Note shared successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Search for notes based on keywords for the authenticated user
const searchNotes = async (req, res) => {
  try {
    const userId = req.user.userId;
    const query = req.query.q;

    const notes = await Note.find({
      $or: [
        { userId, title: { $regex: new RegExp(query, 'i') } },
        { userId, content: { $regex: new RegExp(query, 'i') } },
        { sharedWith: userId, title: { $regex: new RegExp(query, 'i') } },
        { sharedWith: userId, content: { $regex: new RegExp(query, 'i') } },
      ],
    });

    // Additional permissions check
    const authorizedNotes = notes.filter(note => {
      // Check if the user is the owner or the note is shared with the user
      return note.userId.equals(userId) || note.sharedWith.includes(userId);
    });

    res.json(authorizedNotes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  shareNote,
  searchNotes,
};
