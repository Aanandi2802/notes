const { setup: setupDevServer } = require('jest-dev-server');

module.exports = async () => {
  // Start your server before running tests
  await setupDevServer({
    command: 'node ./server.js',
    launchTimeout: 100000, // timeout as needed
    port: 3003, // Using a different port than main application
  });
};
