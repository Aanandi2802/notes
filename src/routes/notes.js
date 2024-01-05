const express = require('express');
const authMiddleware = require('../middlewares/auth');
const noteController = require('../controllers/noteController');

const router = express.Router();

router.use(authMiddleware); // Apply authentication middleware to protect routes

// Route to get all notes for the authenticated user
router.get('/', noteController.getAllNotes);

// Route to get a specific note by ID for the authenticated user
router.get('/:id', noteController.getNoteById);

// Route to create a new note for the authenticated user
router.post('/', noteController.createNote);

// Route to update an existing note by ID for the authenticated user
router.put('/:id', noteController.updateNote);

// Route to delete a note by ID for the authenticated user
router.delete('/:id', noteController.deleteNote);

// Route to share a note with another user for the authenticated user
router.post('/:id/share', noteController.shareNote);

// Route to search for notes based on keywords for the authenticated user
router.get('/api/search', noteController.searchNotes);

module.exports = router;
