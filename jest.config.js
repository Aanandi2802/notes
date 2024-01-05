module.exports = {
  preset: '@shelf/jest-mongodb', // MongoDB integration
  testEnvironment: 'node',       // Set test environment to Node.js
  testMatch: ['**/__tests__/**/*.test.js'],  // Match test file patterns
  transform: {
    '^.+\\.jsx?$': 'babel-jest',  // Transform JavaScript and JSX files with Babel
    '^.+\\.tsx?$': 'ts-jest',     // Transform TypeScript files with TypeScript
  },
};
