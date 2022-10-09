import fs from "fs";
import path from "path";
import mysql from "mysql";

const filePath = "./src/utilities/database/initial-database/";
const sqlFileName = "create-database.sql";


const runSqlFile = (filePath:string, fileName: string) => {
    const databaseConfig: mysql.ConnectionConfig = {
        host: "localhost",
        port: 3306,
        user: "root",
        password: "root"
    };
    
    const databaseConnection = mysql.createConnection(databaseConfig);
    
    const sqlFileData = fs.readFileSync(path.join(filePath, fileName)).toString();

    const sqlScriptArray = sqlFileData.split(";").map((value) => {
        return value + ";";
    });
    
    let numberOfError = 0;

    for (let sqlScript of sqlScriptArray) {
        databaseConnection.query(sqlScript, (error) => {
            if (error?.message.includes("ER_EMPTY_QUERY: Query was empty")) {
                return;
            }
            if (error) {
                console.error(error.message);
                numberOfError++;
                return;
            }
        });
    }

    if (numberOfError == 0) {
        console.log("Database initialised successfully!");
    }

    databaseConnection.end();
};

const testQuery = ():void => {
    const databaseConfig: mysql.ConnectionConfig = {
        host: "localhost",
        port: 3306,
        user: "root",
        password: "root",
        database: "HBM_System"
    };
    
    const databaseConnection = mysql.createConnection(databaseConfig);

    // databaseConnection.query(`USE DATABASE ${databaseConfig.database}`);
    databaseConnection.query("SELECT username FROM User_Account WHERE username = ?",["admin"], (error, result, field) => {
        if (error) {
            console.log(error.message);
            return;
        }
        if (result[0].username === "admin") {
            console.log("Database connected successfully!\nYou may run command 'npm start' to start server"); 
        }
    });

    databaseConnection.end();
};

runSqlFile(filePath, sqlFileName);

// Send a test query to database, to test the database connection
setTimeout(() => {
    testQuery();
}, 2000);