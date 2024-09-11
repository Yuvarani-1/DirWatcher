const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const TaskRun = require('./models/taskRun'); // Import the TaskRun model

// Initialize variables to track task run details
let taskRunId = null; // Stores the ID of the current task run

const monitorDirectory = (dirPath, magicString) => {
    console.log(`Monitoring directory: ${dirPath}`);

    const watcher = chokidar.watch(dirPath, {
        ignored: /(^|[\/\\])\../, // Ignore dotfiles
        persistent: true
    });

    watcher.on('add', (filePath) => {
        console.log(`File added: ${filePath}`);
        processFile(filePath, magicString);
    });

    watcher.on('change', (filePath) => {
        console.log(`File changed: ${filePath}`);
        processFile(filePath, magicString);
    });

    watcher.on('unlink', (filePath) => {
        console.log(`File removed: ${filePath}`);
        handleFileDeletion(filePath);
    });

    watcher.on('error', error => console.error(`Watcher error: ${error}`));

    // Start a new task run and create an initial document
    startNewTaskRun();
};

const startNewTaskRun = async () => {
    const startTime = new Date();
    try {
        const taskRun = new TaskRun({
            startTime,
            status: 'in-progress',
            filesAdded: [],
            filesDeleted: [],
            magicStringOccurrences: 0
        });

        const savedTaskRun = await taskRun.save();
        taskRunId = savedTaskRun._id;
        console.log(`Started new task run with ID: ${taskRunId}`);
    } catch (error) {
        console.error(`Error starting new task run:`, error);
    }
};

// Handle file deletion and update the task run document
const handleFileDeletion = async (filePath) => {
    console.log(`Handling file deletion: ${filePath}`);

    try {
        await TaskRun.findByIdAndUpdate(taskRunId, {
            $push: { filesDeleted: filePath }
        });
    } catch (dbErr) {
        console.error(`Error updating task run with file deletion:`, dbErr);
    }
};

// Mark the task as completed if necessary
const checkTaskCompletion = async () => {
    try {
        // For now, we're marking the task as complete immediately after processing
        // You can add more complex logic here based on your app requirements
        await TaskRun.findByIdAndUpdate(taskRunId, {
            $set: { status: 'completed' }
        });
        console.log(`Task run ${taskRunId} marked as completed.`);
    } catch (dbErr) {
        console.error(`Error marking task as completed:`, dbErr);
    }
};
