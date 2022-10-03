import databaseConnection from "./utilities/database/database-connection";
import server from "./utilities/server/server";

let isDatabaseConneted:boolean = true;

databaseConnection.connect((error):void => {
    if (error) {
        console.error(error.message + "\nPlease run command 'npm run setup' to initialise system");
        isDatabaseConneted = false;
        databaseConnection.end();
        return;
    }

    console.log("database is connected");
});

setTimeout(() => {
    if (isDatabaseConneted) {
        const port = 8080;
        const hostAddress = "localhost";

        server.listen(port, hostAddress, () => {
        console.log(`Server is running on http://${hostAddress}:${port}`);
    });
}}, 1000);
