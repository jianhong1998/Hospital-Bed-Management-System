import mysql, { ConnectionConfig } from 'mysql';

const databaseConfig:ConnectionConfig = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "HBM_System"
};

const databaseConnection = mysql.createConnection(databaseConfig);

export default databaseConnection;