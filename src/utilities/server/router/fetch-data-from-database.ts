import databaseConnection from "../../database/database-connection";
import {Router} from 'express';

const fetchDatabaseRouter = Router();

// Login POST request handler
fetchDatabaseRouter.post("/send-login-info", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username === undefined || password === undefined) {
        return res.send({errorMessage: "Please include username and password in GET request"});
    }

    const sqlQuery = 'SELECT user_id, username, first_name, last_name FROM User_Account WHERE username = ? AND password = ?;';
    
    databaseConnection.query(sqlQuery, [username, password], (error, result, fields) => {
        if (error) {
            res.send(error.message);
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