// index.js
const express = require('express');
const bodyParser = require('body-parser');
const calculatorRoutes = require('./routes/calculator');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from 'public' folder

// Routes
app.use('/api', calculatorRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
