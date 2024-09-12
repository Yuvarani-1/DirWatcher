# DirWatcher Application

## Project Description
DirWatcher is a Node.js application designed to monitor a specified directory for changes and count occurrences of a configured magic string. It includes a REST API server and a long-running background task that performs directory monitoring and result logging.

### Components
**REST API Server:**
Handles API requests for configuration, task control, and status updates.
**Long Running Background Task:**
Monitors a directory at a scheduled interval, processes files, counts occurrences of a magic string, and tracks file changes.

---
## Features

-Monitor a directory at a scheduled interval.
 
-Count occurrences of a magic string in files.
 
-Track new files added and deleted files.
 
-Update monitoring configuration via REST API.
 
-Start and stop the monitoring task via REST API.

-Fetch task run details and status via REST API.

---

## Prerequisites

**Node.js (v14 or later)**

**MongoDB**

**Git**

---

## Installation

### Node.js and npm

Purpose: To run the server, handle REST API requests, and manage packages.
Source: [node.js](https://nodejs.org/en)


## Dependencies

1.**Express.js**

Purpose: Used for setting up the API server and handling routing.

Installation Command: 
```bash
 npm install express

```


2.**Mongoose**
Purpose: For MongoDB object modeling and connecting to the MongoDB database.

Installation Command: 
```bash 
npm install mongoose

```

3.**Chokidar**
Purpose: To monitor the directory and detect file changes.

Installation Command: 
```bash
npm install chokidar

```

4.**config Package**

Purpose: To manage configurations for the application, allowing environment-based configuration settings.

Installation Command: 
```bash

npm install config

```
5.**Body-Parser**

Purpose: To parse incoming request bodies in a middleware before handling them in the routes.

Installation Command: 
```bash
npm install body-parser

```

6.**Nodemon (Development Only)**

Purpose: For automatically restarting the server when changes are detected during development.
Installation Command: 
```bash

npm install --save-dev nodemon

```

7.**MongoDB and MongoDB Compass**

Purpose: MongoDB is the database used to store task run details and configurations. MongoDB Compass is a GUI for managing the database.

Source: 
MongoDB: [mongoDB](https://www.mongodb.com/)
MongoDB Compass: [mongoDB Compass](https://www.mongodb.com/products/tools/compass)



## Execution Instructions

Step 1: Clone the repository

Clone the repository to your local machine using the following command:

```bash
git clone https://github.com/Yuvarani-1/DirWatcher.git
cd DirWatcher

```

Step 2: Install dependencies

Install all necessary Node.js packages by running:

```bash
npm install

```

Step 3: 
Set up MongoDB

Ensure MongoDB is installed and running on your local machine. If MongoDB is hosted locally, you can use the default MongoDB connection string. Otherwise, configure the connection string in the config/default.json file or in an .env file:

```bash
MONGODB_URI=mongodb://localhost:27017/dirwatcher

```

Step 4: 
Run the application

In Development Mode
To run the application in development mode (with auto-restart using nodemon), execute:

```bash
npm run dev

```

In Production Mode
To run the application in production mode, use:

```bash
npm start

```

## Optional Setup (Nodemon)

Nodemon is a development tool that automatically restarts the server when file changes are detected. To run the application using Nodemon:

```bash
nodemon server.js

```
You can install Nodemon globally using npm if it's not already installed:

```bash
npm install -g nodemon

```

Then, run the application in development mode:

```bash
nodemon server.js

```
---

## API Endpoints
This application provides several REST API endpoints to manage task runs, configurations, and directory monitoring through the server. Below is the documentation of each API endpoint and its purpose.

Base URL: http://localhost:3000


## Task Run Endpoints
**1.Create a New Task Run**

**Endpoint:** POST /task-runs

**Description:** Starts a new task run and monitors the directory for changes.

**Response:**
200 OK: Returns the details of the created task run.

400 Bad Request: If the request body is missing required fields.



**2.Stop a Task Run**

**Endpoint:** POST /task-runs/:id/stop

**Description:** Stops the specified task run.

**Request Params:**
id: The ID of the task run to stop.

**Response:**

200 OK: Returns a success message.

404 Not Found: If the task run with the given ID does not exist.



**3.Get All Task Runs**

**Endpoint:** GET /task-runs

**Description:** Retrieves all task runs.

**Response:**

200 OK: Returns a list of all task runs.



**4.Get a Specific Task Run**

**Endpoint:** GET /task-runs/:id

**Description:** Retrieves the details of a specific task run.

**Request Params:**
id: The ID of the task run to retrieve.

**Response:**

200 OK: Returns the details of the specified task run.

404 Not Found: If the task run with the given ID does not exist.


## Configuration Endpoints

**1.Get Configurations**

Endpoint: GET /config.

Description:
Fetches the current configuration settings.

Response:
200 OK: Returns the current configuration settings.

**2.Update Configuration**

Endpoint: PUT /config

Description: Updates the configuration settings (e.g., directoryPath, magicString).

Response:

200 OK: Returns a success message if the update was successful.

400 Bad Request: If the request body is missing required fields.

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

## API Endpoints

This application provides several REST API endpoints to manage task runs, configurations, and directory monitoring. Below is the documentation of each API endpoint.

### Base URL
`http://localhost:3000`

### Task Run Endpoints

| Route                   | Method | Body | Description                                               | Sample Response |
|-------------------------|--------|------|-----------------------------------------------------------|-----------------|
| `/task-runs`            | POST   | `{ "directoryPath": "/path/to/dir", "magicString": "example" }` | Starts a new task run and monitors the directory for changes. | `{ "id": "12345", "status": "running", "directoryPath": "/path/to/dir", "magicString": "example" }` |
| `/task-runs/:id/stop`   | POST   | -    | Stops the specified task run.                            | `{ "message": "Task run stopped successfully" }` |
| `/task-runs`            | GET    | -    | Retrieves all task runs.                                 | `[ { "id": "12345", "status": "running", "directoryPath": "/path/to/dir", "magicString": "example" }, ... ]` |
| `/task-runs/:id`        | GET    | -    | Retrieves the details of a specific task run.            | `{ "id": "12345", "status": "running", "directoryPath": "/path/to/dir", "magicString": "example" }` |

### Configuration Endpoints

| Route          | Method | Body                                                | Description                                                | Sample Response                         |
|----------------|--------|-----------------------------------------------------|------------------------------------------------------------|-----------------------------------------|
| `/config`      | GET    | -                                                   | Fetches the current configuration settings.                | `{ "directoryPath": "/path/to/dir", "magicString": "example" }` |
| `/config`      | PUT    | `{ "directoryPath": "/new/path/to/dir", "magicString": "newString" }` | Updates the configuration settings (e.g., directoryPath, magicString). | `{ "message": "Configuration updated successfully" }` |

### Error Handling and Logging

- Errors are logged to the console and handled with appropriate HTTP status codes.
- Task status and configuration updates are logged for auditing purposes.

### Note
- Replace `/path/to/dir`, `example`, and other placeholders with actual values specific to your application setup.
- Ensure your server is running at `http://localhost:3000` or the appropriate base URL.



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
 
