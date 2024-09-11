// config/db.js
const mongoose = require('mongoose');
const config = require('config'); // Ensure config package is installed
require('dotenv').config(); // Load environment variables from .env file

const connectDB = async () => {
    try {
        // Fetch MongoDB URI from configuration or environment variable
        const mongoURI = config.get('mongoURI') || process.env.MONGO_URI;
        
        if (!mongoURI) {
            throw new Error('MongoDB URI not provided in configuration or environment variables.');
        }

        // Connect to MongoDB
        await mongoose.connect(mongoURI, {
            //useNewUrlParser: true,
            //useUnifiedTopology: true,
            //useCreateIndex: true, // Optional: ensures indexes are created correctly
            //useFindAndModify: false // Optional: avoids deprecation warning
        });

        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
