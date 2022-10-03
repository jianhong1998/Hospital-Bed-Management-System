import mysql, { ConnectionConfig } from 'mysql';

const databaseConfig:ConnectionConfig = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "HBM_System"
};

const databaseConnection = mysql.createConnection(databaseConfig);

databaseConnection.connect((error):void => {
    if (error) {
        console.error(error.message);
        return;
    }

    console.log("database is connected");
});

export default databaseConnection;