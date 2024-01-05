const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const limiter = require('./src/middlewares/rateLimit');
const db = require('./config/db');

const authRoutes = require('./src/routes/auth');
const noteRoutes = require('./src/routes/notes');

const app = express();

app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(morgan('combined')); // Log HTTP requests

app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/notes', limiter, noteRoutes); // Note-related routes with rate limiting

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = server; // Export the server instead of app
