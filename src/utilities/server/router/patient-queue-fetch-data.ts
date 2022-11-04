import { Router } from "express";
import databaseConnection from "../../database/database-connection";

const patientQueueFetchDataRouter = Router();

// GET all queue info
patientQueueFetchDataRouter.get('/all-queue', async (req, res) => {
    const sqlQuery = "SELECT patientId, patientCategory FROM Patient_Queue WHERE ISNULL(timeOut) ORDER BY timeIn;";

    databaseConnection.query(sqlQuery, (error, results, fields) => {
        if (error) {
            res.send({errorMessage: error.message});
            return;
        }

        res.send(results);
    });

});

// Add patient to queue
// Return all queue info
patientQueueFetchDataRouter.post('/new-queue', async (req, res) => {
    const patientId = req.body.patientId;
    const category = req.body.patientCategory;
    
    let numberOfSamePatient:number = 0;
    let stopProcess:boolean = false;

    let sqlQuery = "SELECT COUNT(*) AS numberOfSamePatient FROM Patient_Queue WHERE ISNULL(timeOut) AND patientId = ?;";

    databaseConnection.query(sqlQuery, [patientId], (error, results, fields) => {
        if (error) {
            stopProcess = true;
            res.send({errorMessage: error.message});
            return;
        }

        numberOfSamePatient = results[0].numberOfSamePatient;
    });

    setTimeout(
        () => {
            if (stopProcess) {
                return;
            }
            
            if (numberOfSamePatient > 0) {
                stopProcess = true;
                res.send({errorMessage: "Patient is already in queue"});
                return;
            };
            
            sqlQuery = "INSERT INTO Patient_Queue(patientId, patientCategory, timeIn) VALUES(?, ?, NOW());";
        
            databaseConnection.query(sqlQuery, [patientId, category], (error, results, fields) => {
                if (error) {
                    stopProcess = true;
                    res.send({errorMessage: error.message});
                    return;
                }
            });
        },
        1000
    );

    setTimeout(
        () => {
            if (stopProcess) {
                return;
            }
            const sqlQuery = "SELECT patientId, patientCategory FROM Patient_Queue WHERE ISNULL(timeOut) ORDER BY timeIn;";

            databaseConnection.query(sqlQuery, (error, results, fields) => {
                if (error) {
                    res.send({errorMessage: error.message});
                    return;
                }
        
                res.send(results);
            });
        },
        2000
    );
});

// Dequeue patient from queue
// Return all queue info
patientQueueFetchDataRouter.post('/dequeue', async (req, res) => {
    const patientId = req.body.patientId;
    let stopProcess:boolean = false;

    const sqlQuery = "SELECT patientId, timeIn, timeOut FROM Patient_Queue WHERE patientId = ? AND ISNULL(timeOut)";

    databaseConnection.query(sqlQuery, [patientId], (error, results, fields) => {
        if (error) {
            stopProcess = true;
            res.send({errorMessage: error.message});
            return;
        }

        if (results.length > 1) {
            stopProcess = true;
            res.send({errorMessage: `Patient ${patientId} is duplicated in queue`});
            return;
        }

        if (results.length === 0) {
            stopProcess = true;
            res.send({errorMessage: `Patient ${patientId} is not in queue`});
            return;
        }
    });

    setTimeout(
        () => {
            if (stopProcess) return;

            const sqlQuery = "UPDATE Patient_Queue SET timeOut = NOW() WHERE patientId = ? AND ISNULL(timeOut);";

            databaseConnection.query(sqlQuery, [patientId], (error, results, fields) => {
                if (error) {
                    stopProcess = true;
                    res.send({errorMessage: error.message});
                    return;
                }
            });
        },
        500
    );

    

    // send all queue data
    setTimeout(
        () => {
            if (stopProcess) {
                return;
            }

            const sqlQuery = "SELECT patientId, patientCategory FROM Patient_Queue WHERE ISNULL(timeOut) ORDER BY timeIn;";

            databaseConnection.query(sqlQuery, (error, results, fields) => {
                if (error) {
                    res.send({errorMessage: error.message});
                    return;
                }

                res.send(results);
            });
        },
        1000
    );
});

// GET the patient admission number for today
patientQueueFetchDataRouter.get('/patient-admission-today', async (req, res) => {
    const sqlQuery = "SELECT COUNT(*) AS 'totalPatientAdmission' FROM Patient_Queue WHERE DATE(timeIn) = DATE(NOW());";

    databaseConnection.query(sqlQuery, (error, results, fields) => {
        if (error) {
            res.send({errorMessage: error.message});
            return;
        }

        res.send(results[0]);
    });
});

export default patientQueueFetchDataRouter;