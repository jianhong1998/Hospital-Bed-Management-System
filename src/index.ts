import databaseConnection from "./utilities/database/database-connection";
import server from "./utilities/server/server";
import serverDatabaseInfo from './utilities/server-database-info.json';

let isDatabaseConneted:boolean = true;

databaseConnection.connect((error):void => {
    if (error) {
        if (error.message.includes("ECONNREFUSED")) {
            console.error("Please check the server and database info from the file server-database-info.json");
            isDatabaseConneted = false;
            databaseConnection.end();
            return;
        }

        console.error(error.message + "\nPlease run command 'npm run setup' to initialise system");
        isDatabaseConneted = false;
        databaseConnection.end();
        return;
    }

    console.log("Database is connected");
});

setTimeout(
    () => {
        if (isDatabaseConneted) {
            const port = serverDatabaseInfo.serverInfo.port;
            const hostAddress = serverDatabaseInfo.serverInfo.host;

            server.listen(port, hostAddress , () => {
                console.log(`Server is running on http://${hostAddress}:${port}`);
            });
        } else {
            console.log('Server is failed for running');
        }
    },
    500
);