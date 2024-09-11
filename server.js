require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const TaskRun = require('./models/taskRun');
const Config = require('./models/config');
const connectDB = require('./config/db');
const configRoute = require('./routes/config');
const taskRunsRoute = require('./routes/taskRuns');
const chokidar = require('chokidar');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

let currentTaskRunId = null;
let monitoringInterval = null;
let taskRunEnded = false; // Flag to track if task run has ended
let endTaskRunLocked = false; // Lock to prevent multiple endTaskRun calls
let config = {}; // Global config object
let taskRunning = false;
let taskInterval;


// Clear internal resources
const clearInternal = () => {
    if (monitoringInterval) {
        clearInterval(monitoringInterval);
        console.log('Monitoring interval cleared.');
        monitoringInterval = null;
    }
};

// Fetch configuration from the database
const fetchConfig = async () => {
  try {
      config = await Config.findOne();
      console.log('Fetched configuration:', config);
      if (!config) {
          throw new Error('Configuration not found');
      }
  } catch (error) {
      console.error('Error fetching configuration:', error);
      throw error;
  }
};

// Start a new task run
const startNewTaskRun = async () => {
    try {
        if (currentTaskRunId) {
            console.log('A task run is already in progress.');
            return; // Prevent starting a new task run if one is already active
        }
        const newTaskRun = new TaskRun({
            startTime: new Date(),
            status: 'in-progress'
        });
        await newTaskRun.save();
        currentTaskRunId = newTaskRun._id;
        console.log(`Started new task run with ID: ${currentTaskRunId}`);
        taskRunEnded = false; // Reset flag
        endTaskRunLocked = false; // Reset lock
    } catch (error) {
        console.error('Error starting new task run:', error);
    }
};

// End the current task run
const endTaskRun = async () => {
    try {
        if (!currentTaskRunId || taskRunEnded || endTaskRunLocked) {
            console.log('Task run has already ended or there is no task run to end.');
            return; // No task run to end or already ended
        }
        endTaskRunLocked = true; // Lock to prevent multiple calls
        console.log('Ending task run with ID:', currentTaskRunId);
        await TaskRun.findByIdAndUpdate(currentTaskRunId, {
            endTime: new Date(),
            status: 'completed'
        });
        console.log(`Task run with ID ${currentTaskRunId} marked as completed.`);
        currentTaskRunId = null;
        taskRunEnded = true; // Mark the task run as ended
        clearInternal(); // Clear the interval
    } catch (error) {
        console.error('Error updating task run completion:', error);
    }
};

// Process a file
const processFile = async (filePath, magicString) => {
    try {
        console.log(`Processing file: ${filePath}`);
        const fileContents = await fs.promises.readFile(filePath, 'utf8');
        const magicStringCount = (fileContents.match(new RegExp(magicString, 'g')) || []).length;

        console.log(`Magic string found ${magicStringCount} times in file: ${filePath}`);

    } catch (error) {
        console.error('Error processing file:', error);
    }
};

// Fetch configuration and start monitoring the directory
const monitorDirectory = async () => {
    try {
        const config = await Config.findOne();
        console.log('Fetched configuration:', config);  // Fetch the current configuration
        if (!config) {
            console.log('Configuration not found. Please set up the configuration.');
            return;
        }

        const { directoryPath, interval, magicString } = config;

        // Start a new task run
        await startNewTaskRun();

        console.log(`Monitoring directory: ${directoryPath} every ${interval}ms for magic string: ${magicString}`);

        // Start monitoring
        const watcher = chokidar.watch(directoryPath, { persistent: true });

        // Define event handlers for file changes
        watcher.on('add', async (filePath) => {
            console.log(`File added: ${filePath}`);
            await processFile(filePath, magicString);

            // End the task run only once
            if (!taskRunEnded && !endTaskRunLocked) {
                console.log('Ending task run from file add event.');
                await endTaskRun();
            }
        });

        watcher.on('change', async (filePath) => {
            console.log(`File changed: ${filePath}`);
            await processFile(filePath, magicString);

            // End the task run only once
            if (!taskRunEnded && !endTaskRunLocked) {
                console.log('Ending task run from file change event.');
                await endTaskRun();
            }
        });

        watcher.on('unlink', (filePath) => {
            console.log(`File removed: ${filePath}`);
        });

        // Error handling
        watcher.on('error', (error) => {
            console.error('Watcher error:', error);
        });

        // Handle server shutdown to end the current task run
        process.on('SIGINT', async () => {
            console.log('Server shutting down...');
            watcher.close(); // Stop watching
            clearInternal();
            if (currentTaskRunId) {
                await endTaskRun(); // End task run on shutdown
            }
            process.exit();
        });

        monitoringInterval = setInterval(async () => {
            const files = fs.readdirSync(directoryPath);

            if (files.length > 0) {
                for (const file of files) {
                    const filePath = path.join(directoryPath, file);
                    if (!taskRunEnded && !endTaskRunLocked) { // Check the flag and lock
                        console.log(`File added: ${filePath}`);
                        await processFile(filePath, magicString); // Process the file
                    }
                }
            }
        }, interval);

    } catch (error) {
        console.error('Error monitoring directory:', error);
    }
};

// Call the function initially to start monitoring
monitorDirectory();

app.use('/config', configRoute);  // Add the config route
app.use('/task-runs', taskRunsRoute);

app.get('/', (req, res) => {
    res.send('DirWatcher API Running');
});

app.get('/test-file-processing', async (req, res) => {
    const config = await Config.findOne(); // Fetch the current configuration
    if (config) {
        const testFilePath = path.join(config.directoryPath, 'example1.txt');
        await processFile(testFilePath, config.magicString);
        res.send('Test file processed');
    } else {
        res.status(500).send('Configuration not found');
    }
});

// Fetch Task Run Details
app.get('/task-runs', async (req, res) => {
    try {
        const taskRuns = await TaskRun.find();
        res.json(taskRuns);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT route to dynamically update configuration
app.put('/config', async (req, res) => {
  try {
      const { directoryPath, interval, magicString } = req.body; // Get config values from request body

      // Update configuration in database
      const updatedConfig = await Config.findOneAndUpdate(
          {},
          { directoryPath, interval, magicString },
          { new: true, upsert: true } // Upsert if not exists
      );

      // Restart monitoring with the new configuration
      config = updatedConfig; // Update global config
      await monitorDirectory();

      // Return the updated configuration as the response
      res.json({ message: 'Configuration updated', config });
  } catch (error) {
      console.error('Error updating configuration:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

const startTask = async () => {
  try {
      await fetchConfig(); // Fetch configuration
      if (!taskRunning) {
          taskRunning = true;
          taskInterval = setInterval(async () => {
              try {
                  console.log('Task running...');
                  await monitorDirectory(); // Start or restart the monitoring process
              } catch (error) {
                  console.error('Error running task:', error);
                  stopTask(); // Stop the task if an error occurs
              }
          }, config.interval);
      }
  } catch (error) {
      console.error('Error starting task:', error);
  }
};

const stopTask = () => {
  if (taskRunning) {
      clearInterval(taskInterval);
      taskRunning = false;
      console.log('Task stopped.');
  }else{
    console.log('No task is currently running');
  }
};

/// POST route to start or stop the task manually
app.post('/task-control', async (req, res) => {
  const { action } = req.body;

  // Basic validation
  if (!action || (action !== 'start' && action !== 'stop')) {
      return res.status(400).json({ message: 'Invalid action' });
  }

  try {
      if (action === 'start') {
          if (taskRunning) {
              return res.status(400).json({ message: 'Task is already running' });
          }
          await startTask();
          res.json({ message: 'Task started' });
      } else if (action === 'stop') {
          if (!taskRunning) {
              return res.status(400).json({ message: 'No task is currently running' });
          }
          stopTask();
          res.json({ message: 'Task stopped' });
      }
  } catch (error) {
      console.error('Error handling task control:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/task-status', (req, res) => {
  res.json({
      taskRunning,
      interval: config.interval,
      lastRun: new Date(),
      status: taskRunning ? 'running' : 'stopped'
  });
});

// Server listening
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
