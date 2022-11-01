import mysql, { ConnectionConfig } from 'mysql';
import serverDatabaseInfo from '../server-database-info.json';

const databaseConfig:ConnectionConfig = {
    host: serverDatabaseInfo.databaseInfo.host,
    port: serverDatabaseInfo.databaseInfo.port,
    user: serverDatabaseInfo.databaseInfo.user,
    password: serverDatabaseInfo.databaseInfo.password,
    database: serverDatabaseInfo.databaseInfo.database
};

const databaseConnection = mysql.createConnection(databaseConfig);

export default databaseConnection;