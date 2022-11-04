# Hotel-Brd-Management-System
## Key Feature
1. User can register a patient into system before assigning them to ward.
2. When the user press the ward discharge button, the system will simulate the discharge work flow.
3. When a patient is registered but the ward for his category is full, then the system will enqueue the patient to the respective category queue. Once there is ward available, then the system will assign the patient in queue to the ward automatically.


## Pre-request
1. NodeJS is installed on your machine.
2. MySQL is installed on your machine.

## Run project

### Step 1
Clone project to your local repository.

### Step 2
Run terminal under the project root repository.

### Step 3
Check the "server-database-info.json" json file under "src/utilities/". If the database config is different with your MySQL config. Please change accordingly.

### Step 4
Run command `npm run setup` to initialise the system.

### Step 5
Run command `npm start` to start the server.

### Step 6
Visit the URL display in console by using browser. (Default is `http://localhost:8080/`).

## Server is not running
Check the "server-database-info" json file under "src/utilities/". Ensure the all the config values are correct.
