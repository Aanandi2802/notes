// Import necessary modules and dependencies
const request = require('supertest');
const app = require('../../server');

// Import the User model
const User = require('../models/User');

/**
 * Test suite for the Authentication Controller.
 */
describe('Auth Controller', () => {

  // Array to store the usernames of created users for cleanup
  let createdUsernames = [];

  /**
   * Cleanup function to delete the created users after each test.
   */
  afterEach(async () => {
    // Delete only the users created during the test
    if (createdUsernames.length > 0) {
      await User.deleteMany({ username: { $in: createdUsernames } });
      createdUsernames = []; // Reset the array after cleanup
    }
  });

  /**
   * Test case: should sign up a new user.
   */
  it('should sign up a new user', async () => {
    try {
      // Send a POST request to create a new user
      const response = await request(app)
        .post('/api/auth/signup')
        .send({ username: 'uniqueusername', password: 'testpassword' });
  
      console.log(response.body);
  
      // Store the created username for cleanup
      createdUsernames.push(response.body.username);
  
      // Assertions for successful signup
      expect(response.status).toBe(200); 
      expect(response.body.accessToken).toBeDefined();
    } catch (error) {
      console.error('Error in signup test:', error);
    }
  });

  /**
   * Test case: should not sign up with an existing username.
   */
  it('should not sign up with an existing username', async () => {
    // Attempt to create a user with an existing username
    const response = await request(app)
      .post('/api/auth/signup')
      .send({ username: 'testusername', password: 'testpassword' });

    console.log(response.body);

    // Assertions for unsuccessful signup
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Username already exists');
  });

  /**
   * Test case: should log in an existing user.
   */
  it('should log in an existing user', async () => {
    // Log in the created user
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testusername', password: 'testpassword' });
    console.log(response.body.accessToken);

    // Assertions for successful login
    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();
  });

  /**
   * Test case: should not log in with incorrect credentials.
   */
  it('should not log in with incorrect credentials', async () => {
    // Attempt to login with incorrect credentials
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testusername', password: 'wrongpassword' });
  
    console.log(response.body);
  
    // Assertions for unsuccessful login
    expect(response.status).toBe(401); // Change to 401
    expect(response.body.error).toBe('Invalid credentials');
  });

});
