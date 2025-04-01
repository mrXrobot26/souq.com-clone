const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const dbConnect = require('./config/database');
const categoryRouter = require('./Routers/categoryRouter');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to the database
dbConnect();

// Middleware
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    console.log(`Mode: ${process.env.NODE_ENV}`);
    app.use(morgan('dev'));
    console.log('======================================');
}

// Mount routes
app.use('/api/v1/categories', categoryRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App running on port: ${PORT}`);
});
