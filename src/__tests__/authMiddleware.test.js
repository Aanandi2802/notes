// Import necessary modules and dependencies
const jwt = require('jsonwebtoken');
const authenticateUser = require('../middlewares/auth');

// Mocking the jwt.verify function
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

/**
 * Test suite for the authenticateUser middleware.
 */
describe('authenticateUser Middleware', () => {

  /**
   * Test case: should return 401 if token is missing or has an invalid format.
   */
  it('should return 401 if token is missing or has invalid format', () => {
    const req = {
      header: jest.fn(() => undefined), // Missing token
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    authenticateUser(req, res, next);

    // Assertions for missing or invalid token
    expect(req.header).toHaveBeenCalledWith('Authorization');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized: Missing or invalid token format' });
    expect(next).not.toHaveBeenCalled();
  });

  /**
   * Test case: should return 401 if jwt.verify throws an error.
   */
  it('should return 401 if jwt.verify throws an error', () => {
    const req = {
      header: jest.fn(() => 'Bearer invalidToken'),
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('Token verification failed'));
    });

    authenticateUser(req, res, next);

    // Assertions for invalid token
    expect(req.header).toHaveBeenCalledWith('Authorization');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized: Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });

  /**
   * Test case: should return 403 if jwt.verify returns an error.
   */
  it('should return 403 if jwt.verify returns an error', () => {
    const req = {
      header: jest.fn(() => 'Bearer validToken'),
    };
    const res = {
      sendStatus: jest.fn(),
    };
    const next = jest.fn();
    
    // Simulate an error scenario when jwt.verify is called
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('Token verification failed'));
    });

    authenticateUser(req, res, next);

    // Assertions for token verification failure
    expect(req.header).toHaveBeenCalledWith('Authorization');
    expect(res.sendStatus).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  /**
   * Test case: should set req.user and call next() for a valid token.
   */
  it('should set req.user and call next() for a valid token', () => {
    const decodedUser = { userId: '123' };
    const req = {
      header: jest.fn(() => 'Bearer validToken'),
    };
    const res = {};
    const next = jest.fn();
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, decodedUser);
    });

    authenticateUser(req, res, next);

    // Assertions for a valid token
    expect(req.header).toHaveBeenCalledWith('Authorization');
    expect(req.user).toEqual(decodedUser);
    expect(next).toHaveBeenCalled();
  });
});
