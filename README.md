#DirWatcher Application

##Project Description

###DirWatcher is a Node.js application designed to monitor a specified directory for changes and count occurrences of a configured magic string. It includes a REST API server and a long-running background task that performs directory monitoring and result logging.

##Components
##REST API Server:##  ###Handles API requests for configuration, task control, and status updates.###
##Long Running Background Task:## ###Monitors a directory at a scheduled interval, processes files, counts occurrences of a magic string, and tracks file changes.###


##Features
###Monitor a directory at a scheduled interval.
###Count occurrences of a magic string in files.
###Track new files added and deleted files.
###Update monitoring configuration via REST API.
###Start and stop the monitoring task via REST API.
###Fetch task run details and status via REST API.


##Prerequisites

###Node.js (v14 or later)
###MongoDB


##For Installation
###Clone the Repository




##API Endpoints

##Configuration Endpoints

###GET /config
####See config.js for details.

###PUT /config
####See config.js for details.

##Task Control Endpoints
###POST /task-control
####See taskRuns.js for details.

##Task Run Endpoints
###GET /task-runs
####See taskRuns.js for details.

##Status Endpoint
###GET /task-status
####See server.js for details.



##Error Handling and Logging
###Errors are logged to the console and handled with appropriate HTTP status codes.
###Task status and configuration updates are logged for auditing purposes.


##Improvements
###File Deletion Tracking: Added tracking for deleted files.
###Error Handling: Enhanced error handling and logging.
###API Documentation: Comprehensive documentation provided.

##Database Schema Diagram

###Schema diagram for MongoDB design is included as schema.pdf.

##Testing

###Unit and integration tests are recommended for validating the application functionality.

##Deployment

###Deploy to a production environment and test all functionalities.

##Contact
###For questions or issues, please contact yuvarani10101@gmail.com