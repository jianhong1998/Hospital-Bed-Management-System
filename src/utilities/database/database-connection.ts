import mysql, { ConnectionConfig } from 'mysql';
import databaseInfo from './database-info.json';

const databaseConfig:ConnectionConfig = {
    host: databaseInfo.host,
    port: databaseInfo.port,
    user: databaseInfo.user,
    password: databaseInfo.password,
    database: databaseInfo.database
};

const databaseConnection = mysql.createConnection(databaseConfig);

export default databaseConnection;