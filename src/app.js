const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const documentRoutes = require('./routes/documentRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

app.use(cors())

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Routes
app.use('/api/documents', documentRoutes); // Routes for document ingestion
app.use('/api/chat', chatRoutes); // Routes for chat and questions

// Export app for server.js
module.exports = app;
