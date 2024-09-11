const mongoose = require('mongoose');
const Config = require('./models/config'); // Adjust the path as needed

require('dotenv').config();
const connectDB = require('./config/db'); // Adjust the path as needed

const seedConfig = async () => {
    try {
        await connectDB(); // Ensure you connect to the database

        // Check if a configuration already exists
        const existingConfig = await Config.findOne();
        if (existingConfig) {
            console.log('Configuration already exists.');
            mongoose.connection.close();
            return;
        }

        // Seed new configuration data
        const config = new Config({
            directoryPath: './watched-directory',
            interval: 60000,
            magicString: 'YOUR_MAGIC_STRING'
        });

        await config.save();
        console.log('Configuration data seeded.');
    } catch (error) {
        console.error('Error seeding configuration data:', error);
    } finally {
        mongoose.connection.close(); // Ensure you close the connection
    }
};

seedConfig();
