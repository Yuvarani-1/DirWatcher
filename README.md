# DirWatcher Application

## Project Description
DirWatcher is a Node.js application designed to monitor a specified directory for changes and count occurrences of a configured magic string. It includes a REST API server and a long-running background task that performs directory monitoring and result logging.

### Components
#### REST API Server: 
Handles API requests for configuration, task control, and status updates.
#### Long Running Background Task:
Monitors a directory at a scheduled interval, processes files, counts occurrences of a magic string, and tracks file changes.###


## Features

 Monitor a directory at a scheduled interval.
 
 Count occurrences of a magic string in files.
 
 Track new files added and deleted files.
 
 Update monitoring configuration via REST API.
 
 Start and stop the monitoring task via REST API.
 
 Fetch task run details and status via REST API.


## Prerequisites

 Node.js (v14 or later)

 MongoDB

 Git


## For Installation

### Node.js and npm

Purpose: To run the server, handle REST API requests, and manage packages.
Source: https://nodejs.org/en 


## For Installation

### Express.js

Purpose: Used for setting up the API server and handling routing.

#### Installation Command: npm install express


### Mongoose
Purpose: For MongoDB object modeling and connecting to the MongoDB database.

#### Installation Command: npm install mongoose

### Chokidar
Purpose: To monitor the directory and detect file changes.

#### Installation Command: npm install chokidar


### config Package

Purpose: To manage configurations for the application, allowing environment-based configuration settings.

#### Installation Command: npm install config

### Body-Parser

Purpose: To parse incoming request bodies in a middleware before handling them in the routes.

#### Installation Command: npm install body-parser


### Nodemon (Development Only)

Purpose: For automatically restarting the server when changes are detected during development.
#### Installation Command: npm install --save-dev nodemon


### MongoDB and MongoDB Compass

Purpose: MongoDB is the database used to store task run details and configurations. MongoDB Compass is a GUI for managing the database.

Source: 
MongoDB: https://www.mongodb.com/
MongoDB Compass: https://www.mongodb.com/products/tools/compass


## API Endpoints

This application provides several REST API endpoints to manage task runs, configurations, and directory monitoring through the server. Below is the documentation of each API endpoint and its purpose.

Base URL: http://localhost:3000

## Task Run Endpoints
Create a New Task Run
Endpoint: POST /task-runs
Description: Starts a new task run and monitors the directory for changes.

Stop a Task Run
Endpoint: POST /task-runs/:id/stop
Description: Stops the specified task run.
Request Params:
id: The ID of the task run to stop.

Get All Task Runs
Endpoint: GET /task-runs
Description: Retrieves all task runs.

Get a Specific Task Run
Endpoint: GET /task-runs/:id
Description: Retrieves the details of a specific task run.
Request Params:
id: The ID of the task run to retrieve.


## Configuration Endpoints

Get Configurations
Endpoint: GET /config
Description: Fetches the current configuration settings.

Update Configuration
Endpoint: PUT /config
Description: Updates the configuration settings (e.g., directoryPath, magicString).


## Error Handling and Logging
Errors are logged to the console and handled with appropriate HTTP status codes.
Task status and configuration updates are logged for auditing purposes.


## Improvements
### File Deletion Tracking: 
Added tracking for deleted files.
### Error Handling:
Enhanced error handling and logging.
### API Documentation: 
Comprehensive documentation provided.

## Database Schema Diagram

Schema diagram for MongoDB design is included as Database Schema.jpef.

## Testing

### Task Runs API Tests

Verify if a new task run can be created.
Test if the task run can be stopped.
Check retrieval of all task runs.
Verify retrieval of a specific task run by ID.

### Configuration API Tests
Test the fetching of configuration settings.
Verify updating the configuration via the API.

## Deployment

Deploy to a production environment and test all functionalities.

## Contact
For questions or issues, please contact yuvarani10101@gmail.com
 
