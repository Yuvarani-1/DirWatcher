const mongoose = require('mongoose');

// Define the schema for TaskRun
const taskRunSchema = new mongoose.Schema({
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    runtime: { type: Number }, // Total runtime in milliseconds
    filesAdded: [String], // List of new files added
    filesDeleted: [String], // List of files deleted
    magicStringOccurrences: { type: Number, default: 0 }, // Count of magic string occurrences
    status: { type: String, enum: ['success', 'failed', 'in-progress','completed'], default: 'in-progress' } // Task status
});

// Create the model from the schema
const TaskRun = mongoose.model('TaskRun', taskRunSchema);

module.exports = TaskRun;
