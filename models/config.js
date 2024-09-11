const mongoose = require('mongoose');

// Define the schema for Configuration
const configSchema = new mongoose.Schema({
    directoryPath: { type: String, required: true },  // Path of the directory to monitor
    interval: { type: Number, default: 60000 },       // Time interval in milliseconds
    magicString: { type: String, required: true }     // Magic string to monitor in files
});

// Create the model from the schema
const Config = mongoose.model('Config', configSchema);

module.exports = Config;
