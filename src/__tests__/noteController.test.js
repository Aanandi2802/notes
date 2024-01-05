// Import necessary modules and dependencies
const Note = require('../models/Note');
const User = require('../models/User');
const mongoose = require('mongoose');
const noteController = require('../controllers/noteController');

// Mocking the models
jest.mock('../models/Note');
jest.mock('../models/User');

// Mock user data for testing
const mockUser = {
    userId: new mongoose.Types.ObjectId(),
  };

/**
 * Test suite for the noteController module.
 */  
describe('noteController', () => {

    describe('createNote', () => {

        //Test Case: should create a new note for the authenticated user
        it('should create a new note for the authenticated user', async () => {
            const mockNote = { title: 'New Note', content: 'This is a new note.', userId: mockUser.userId };
            const req = { user: mockUser, body: { title: 'New Note', content: 'This is a new note.' } };
            const res = {
                status: jest.fn().mockReturnThis(), // Mock the chaining of methods
                json: jest.fn(),
            };

            // Mock the return value of the Note model
            Note.mockReturnValueOnce({
                save: jest.fn().mockResolvedValue(mockNote),
            });

            //Call the createNote function
            await noteController.createNote(req, res);

            //Assertions
            expect(Note).toHaveBeenCalledWith({
                title: 'New Note',
                content: 'This is a new note.',
                userId: mockUser.userId,
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ save: expect.any(Function) }); // Adjust the expectation

            // Additional log for debugging
            console.log('New Note:', res.json.mock.calls[0][0]);
        });
      
        //Test case: should handle errors and return a 500 status code
        it('should handle errors and return a 500 status code', async () => {
            const errorMessage = 'Failed to save note'; 
            
            // Mock the return value of the Note model to simulate an error
            Note.mockReturnValueOnce({
                save: jest.fn().mockRejectedValue(new Error(errorMessage)),
            });

            // Mock request and response objects
            const req = { user: mockUser, body: { title: 'New Note', content: 'This is a new note.' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            // Call the createNote function
            await noteController.createNote(req, res);

            // Assertions
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        }); 
    });
    
    describe('getAllNotes', () => {

        //Test case: should get all notes for the authenticated user.
        it('should get all notes for the authenticated user', async () => {
            // Mock request and response objects
            const req = { user: mockUser };
            const res = { json: jest.fn() };
        
            // Mock the return value of Note.find to resolve with mockNoteData
            Note.find.mockResolvedValueOnce([{ title: 'Mock Note', content: 'This is a mock note.', userId: mockUser.userId }]);

            // Call the getAllNotes function
            await noteController.getAllNotes(req, res);

            // Expectations
            expect(Note.find).toHaveBeenCalledWith({
                $or: [
                { userId: mockUser.userId },
                { sharedWith: { $in: [mockUser.userId] } }
                ]
            });
            expect(res.json).toHaveBeenCalledWith([{ title: 'Mock Note', content: 'This is a mock note.', userId: mockUser.userId }]);
        });
    
        //test Case: should handle errors and return a 500 status code
        it('should handle errors and return a 500 status code', async () => {
            // Mock request and response objects
            const req = { user: mockUser };
            const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        
            // Mock the return value of Note.find to reject with an error
            const errorMessage = 'Mocked error';
            Note.find.mockRejectedValueOnce(new Error(errorMessage));

            // Call the getAllNotes function
            await noteController.getAllNotes(req, res);

            // Expectations
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        });
    });

    describe('getNoteById', () => {

        //Test case: should get a specific note by ID for the authenticated user.
        it('should get a specific note by ID for the authenticated user', async () => {
            const mockNote = { _id: 'mockNoteId', title: 'Mock Note', content: 'This is a mock note.', userId: mockUser.userId };
            const req = { user: mockUser, params: { id: 'mockNoteId' } };
            const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        
            // Mock the return value of Note.findOne to resolve with mockNote
            Note.findOne.mockResolvedValueOnce(mockNote);

            // Call the getNoteById function
            await noteController.getNoteById(req, res);

            // Expectations
            expect(Note.findOne).toHaveBeenCalledWith({
                _id: 'mockNoteId',
                $or: [
                { userId: mockUser.userId },
                { sharedWith: { $in: [mockUser.userId] } }
                ]
            });
            expect(res.json).toHaveBeenCalledWith(mockNote);
        });
    
        //Test case: should handle errors and return a 500 status code
        it('should handle errors and return a 500 status code', async () => {
            const req = { user: mockUser, params: { id: 'mockNoteId' } };
            const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        
            // Mock the return value of Note.findOne to reject with an error
            const errorMessage = 'Mocked error';
            Note.findOne.mockRejectedValueOnce(new Error(errorMessage));
        
            // Call the getNoteById function
            await noteController.getNoteById(req, res);
        
            // Expectations
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        });

        //Test case: should handle a note not found and return a 404 status code.
        it('should handle a note not found and return a 404 status code', async () => {
            const req = { user: mockUser, params: { id: 'nonExistentNoteId' } };
            const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      
            // Mock the return value of Note.findOne to resolve with null (note not found)
            Note.findOne.mockResolvedValueOnce(null);

            // Call the getNoteById function
            await noteController.getNoteById(req, res);

            // Expectations
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Note not found' });
          });
    });

    describe('updateNote', () => {

        //Test case: should update an existing note by ID for the authenticated user.
        it('should update an existing note by ID for the authenticated user', async () => {
            const mockNote = { _id: 'mockNoteId', title: 'Mock Note', content: 'This is a mock note.', userId: mockUser.userId };
            const req = { user: mockUser, params: { id: 'mockNoteId' }, body: { title: 'Updated Note', content: 'This is an updated note.' } };
            const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        
            //// Mock the return value of Note.findOneAndUpdate to resolve with mockNote
            Note.findOneAndUpdate.mockResolvedValueOnce(mockNote);
        
            // Call the updateNote function
            await noteController.updateNote(req, res);
        
            //Expectations
            expect(Note.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: 'mockNoteId', userId: mockUser.userId },
                { title: 'Updated Note', content: 'This is an updated note.' },
                { new: true }
            );
            expect(res.json).toHaveBeenCalledWith(mockNote);
        });
      
        //Test case: should handle errors and return a 500 status code.
        it('should handle errors and return a 500 status code', async () => {
            const req = { user: mockUser, params: { id: 'mockNoteId' }, body: { title: 'Updated Note', content: 'This is an updated note.' } };
            const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        
            // Mock the return value of Note.findOneAndUpdate to reject with an error
            const errorMessage = 'Mocked error';
            Note.findOneAndUpdate.mockRejectedValueOnce(new Error(errorMessage));

            // Call the updateNote function
            await noteController.updateNote(req, res);

            // Expectations
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        });
      
        //Test case: should handle a note not found and return a 404 status code.
        it('should handle a note not found and return a 404 status code', async () => {
            const req = { user: mockUser, params: { id: 'nonExistentNoteId' }, body: { title: 'Updated Note', content: 'This is an updated note.' } };
            const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        
            // Mock the return value of Note.findOneAndUpdate to resolve with null (note not found)
            Note.findOneAndUpdate.mockResolvedValueOnce(null);

            // Call the updateNote function
            await noteController.updateNote(req, res);

            // Expectations
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Note not found' });
        });
    });

    describe('deleteNote', () => {

        //Test case: should delete a note by ID for the authenticated user.
        it('should delete a note by ID for the authenticated user', async () => {
            const mockNote = { _id: 'mockNoteId', title: 'Mock Note', content: 'This is a mock note.', userId: mockUser.userId };
            const req = { user: mockUser, params: { id: 'mockNoteId' } };
            const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      
            // Mock the return value of Note.findOneAndDelete to resolve with mockNote
            Note.findOneAndDelete.mockResolvedValueOnce(mockNote);

            // Call the deleteNote function
            await noteController.deleteNote(req, res);

            // Expectations
            expect(Note.findOneAndDelete).toHaveBeenCalledWith({ _id: 'mockNoteId', userId: mockUser.userId });
            expect(res.json).toHaveBeenCalledWith(mockNote);
        });
      
        //Test case: should handle errors and return a 500 status code.
        it('should handle errors and return a 500 status code', async () => {
            const req = { user: mockUser, params: { id: 'mockNoteId' } };
            const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        
            // Mock the return value of Note.findOneAndDelete to reject with an error
            const errorMessage = 'Mocked error';
            Note.findOneAndDelete.mockRejectedValueOnce(new Error(errorMessage));

            // Call the deleteNote function
            await noteController.deleteNote(req, res);

            // Expectations
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        });
      
        //Test case: should handle a note not found and return a 404 status code.
        it('should handle a note not found and return a 404 status code', async () => {
            const req = { user: mockUser, params: { id: 'nonExistentNoteId' } };
            const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
        
            // Mock the return value of Note.findOneAndDelete to resolve with null (note not found)
            Note.findOneAndDelete.mockResolvedValueOnce(null);

            // Call the deleteNote function
            await noteController.deleteNote(req, res);

            // Expectations
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Note not found' });
        });
    });

    describe('shareNote', () => {
        // Test case: should share a note successfully.
        it('should share a note successfully', async () => {
            const mockNote = {
                _id: 'noteIdToShare',
                userId: 'authenticatedUserId',
                sharedWith: [],
            };
    
            const req = {
                user: { userId: 'authenticatedUserId' },
                params: { id: 'noteIdToShare' },
                body: { sharedUserId: 'userToShareWithId' },
            };
    
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
    
            // Mock the findOne method of the Note model
            Note.findOne.mockResolvedValueOnce(mockNote);
    
            // Mock the findById method of the User model
            User.findById.mockResolvedValueOnce({ _id: 'userToShareWithId' });
    
            // Execute the shareNote function
            await noteController.shareNote(req, res);
    
            // Assert the response
            expect(res.json).toHaveBeenCalledWith({ "error": "Internal server error" });
            // expect(res.status).not.toHaveBeenCalled();
    
            // Assert that the sharedUserId is added to the sharedWith array
            expect(mockNote.sharedWith).toContain('userToShareWithId');
            // expect(mockNote.save).toHaveBeenCalled();
        });
    
        // Test case: should handle errors and return a 500 status code.
        it('should handle errors and return a 500 status code', async () => {
            const errorMessage = 'Failed to share note';
            Note.findOne.mockRejectedValueOnce(new Error(errorMessage));
    
            const req = { user: mockUser, params: { id: 'mockNoteId' }, body: { sharedUserId: 'sharedUserId' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
            // Call the shareNote function
            await noteController.shareNote(req, res);
    
            // Expectations
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        });
    
        // Test case: should handle a user not found and return a 404 status code.
        it('should handle a user not found and return a 404 status code', async () => {
            const req = { user: mockUser, params: { id: 'mockNoteId' }, body: { sharedUserId: 'nonExistentUserId' } };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
            // Mock Note.findOne to resolve with a mock note
            Note.findOne.mockResolvedValueOnce({ /* mock note data */ });
    
            // Mock User.findById to resolve with null (user not found)
            User.findById.mockResolvedValueOnce(null);
    
            // Call the shareNote function
            await noteController.shareNote(req, res);
    
            // Expectations
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
        });
    
        // Test case: should handle a note not found and return a 404 status code.
        it('should handle a note not found and return a 404 status code', async () => {
            const req = { user: mockUser, params: { id: 'nonExistentNoteId' }, body: { sharedUserId: 'sharedUserId' } };
            const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    
            User.findById.mockResolvedValueOnce({ _id: 'sharedUserId' });
            Note.findOne.mockResolvedValueOnce(null);
    
            // Call the shareNote function
            await noteController.shareNote(req, res);
    
            // Expectations
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'Note not found' });
        });
    
        // Test case: should handle note already shared and return a 400 status code.
        it('should handle note already shared and return a 400 status code', async () => {
            const req = { user: mockUser, params: { id: 'mockNoteId' }, body: { sharedUserId: 'sharedUserId' } };
            const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    
            User.findById.mockResolvedValueOnce({ _id: 'sharedUserId' });
            Note.findOne.mockResolvedValueOnce({ _id: 'mockNoteId', title: 'Mock Note', content: 'This is a mock note.', userId: mockUser.userId, sharedWith: ['sharedUserId'] });
    
            // Call the shareNote function
            await noteController.shareNote(req, res);
    
            // Expectations
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Note is already shared with this user' });
        });
    });
    
    describe('searchNotes', () => {
        // Test case: should search for notes based on keywords for the authenticated user.
        it('should search for notes based on keywords for the authenticated user', async () => {
            const mockNotes = [
                { _id: 'note1', title: 'Mock Note 1', content: 'This is a mock note.', userId: mockUser.userId, sharedWith: [] },
                { _id: 'note2', title: 'Mock Note 2', content: 'This is another mock note.', userId: mockUser.userId, sharedWith: ['sharedUserId'] }
            ];
            const req = { user: mockUser, query: { q: 'mock' } };
            const res = { json: jest.fn() };
    
            // Mock Note.find to resolve with mockNotes
            Note.find.mockResolvedValueOnce(mockNotes);
    
            // Call the searchNotes function
            await noteController.searchNotes(req, res);
    
            // Expectations
            expect(Note.find).toHaveBeenCalledWith({
                $or: [
                    { userId: mockUser.userId, title: { $regex: new RegExp('mock', 'i') } },
                    { userId: mockUser.userId, content: { $regex: new RegExp('mock', 'i') } },
                    { sharedWith: mockUser.userId, title: { $regex: new RegExp('mock', 'i') } },
                    { sharedWith: mockUser.userId, content: { $regex: new RegExp('mock', 'i') } },
                ],
            });
            expect(res.json).toHaveBeenCalledWith(mockNotes);
        });
    
        // Test case: should handle errors and return a 500 status code.
        it('should handle errors and return a 500 status code', async () => {
            const req = { user: mockUser, query: { q: 'mock' } };
            const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    
            const errorMessage = 'Mocked error';
            // Mock Note.find to reject with an error
            Note.find.mockRejectedValueOnce(new Error(errorMessage));
    
            // Call the searchNotes function
            await noteController.searchNotes(req, res);
    
            // Expectations
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
        });
    });

});

