import databaseConnection from "../../../utilities/database/database-connection";
import mysql, { ConnectionConfig } from 'mysql';
import serverDatabaseInfo from '../../../utilities/server-database-info.json';

describe("MySql database should be able to connect.", () => {
    it("DBMS host, port, user, password in server-database-info.json are correct.", (done) => {
        const databaseInfo = serverDatabaseInfo.databaseInfo;

        const connectionConfig:ConnectionConfig = {
            host: databaseInfo.host,
            port: databaseInfo.port,
            user: databaseInfo.user,
            password: databaseInfo.password
        };

        const connection = mysql.createConnection(connectionConfig);

        let result:boolean = false;

        connection.connect((error) => {
            if (error) {
                result = false;
                return;
            }

            result = true;
        });

        // Error: setTimeout is not available
        setTimeout(
            () => {
                expect(result).toBeTrue();
                done();
            },
            200
        );
    });
    
    it("Database is exist in DBMS MySql.", (done) => {
        let isDatabaseConnected:boolean = false;

        databaseConnection.connect((error) => {
            if (error) {
                return;
            }

            isDatabaseConnected = true;
        });

        databaseConnection.end();

        setTimeout(
            () => {
                expect(isDatabaseConnected).toBeTrue();
                done();
            },
            200
        );
    });
});