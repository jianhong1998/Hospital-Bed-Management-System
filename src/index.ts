import databaseConnection from "./utilities/database/database-connection";
import server from "./utilities/server/server";
import serverDatabaseInfo from './utilities/server-database-info.json';

const startSerer = () => {
    let isDatabaseConnected:boolean = false;
    
    databaseConnection.connect((error):void => {
        if (error) {
            if (error.message.includes("ECONNREFUSED")) {
                console.error("Please check the server and database info from the file server-database-info.json");
                databaseConnection.end();
                return;
            }
    
            console.error(error.message + "\nPlease run command 'npm run setup' to initialise system");
            databaseConnection.end();
            return;
        }
    
        console.log("Database is connected");
        isDatabaseConnected = true;
    });
    
    setTimeout(
        () => {
            if (isDatabaseConnected) {
                const port = serverDatabaseInfo.serverInfo.port;
                const hostAddress = serverDatabaseInfo.serverInfo.host;
    
                server.listen(port, hostAddress , () => {
                    console.log(`Server is running on http://${hostAddress}:${port}`);
                });
            } else {
                console.log('Server is failed for running');
            }
        },
        200
    );
}

startSerer();

export default startSerer;