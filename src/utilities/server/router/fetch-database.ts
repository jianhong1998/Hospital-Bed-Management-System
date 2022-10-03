import databaseConnection from "../../database/database-connection";
import {Router} from 'express';

const fetchDatabaseRouter = Router();

fetchDatabaseRouter.get("/send-login-info", (req, res) => {
    const username = req.query.username;
    const password = req.query.password;

    if (username === undefined || password === undefined) {
        return res.send({errorMessage: "Please include username and password in GET request"});
    }

    const sqlQuery = 'SELECT username, first_name, last_name FROM User_Account WHERE username = ? AND password = ?;';
    
    databaseConnection.query(sqlQuery, [username, password], (error, result, fields) => {
        if (error) {
            console.log(error.message);
            return;
        }

        setTimeout(
            () => {
                res.send(result);
            },
            1000
        );
    });
});

export default fetchDatabaseRouter;