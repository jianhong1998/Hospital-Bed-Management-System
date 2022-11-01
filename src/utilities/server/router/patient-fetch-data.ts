import { Router } from "express";
import databaseConnection from "../../database/database-connection";
import { Patient, PatientFromDatabase } from "../../model/patient-interface";

const patientFetchDataRouter = Router();

// GET an exist patient with nric
patientFetchDataRouter.get("/get-patient-with-nric", (req, res) => {
    const nric = req.query.nric;

    const sqlQuery = "SELECT patientId, firstName, lastName, category, contactNumber, gender, dateOfBirth, nric, remarks FROM Patient WHERE nric = ?;";

    databaseConnection.query(sqlQuery, [nric], (error, results, fields) => {
        if (error) {
            res.send({errorMessage: error.message});
            return;
        }
        setTimeout(
            () => res.send(results),
            1000
        );
    });
});

// GET an exist patient with patientId
patientFetchDataRouter.get("/get-patient-with-id", (req, res) => {
    const patientId = req.query.patientId;

    const sqlQuery = "SELECT patientId, firstName, lastName, category, contactNumber, gender, DAY(dateOfBirth) AS 'dateOfBirth', (MONTH(dateOfBirth)) AS 'monthOfBirth', YEAR(dateOfBirth) AS 'yearOfBirth', nric, remarks FROM Patient WHERE patientId = ?;";

    databaseConnection.query(sqlQuery, [patientId], (error, results, fields) => {
        if (error) {
            res.send({errorMessage: error.message});
            return;
        }
        setTimeout(
            () => res.send(results),
            1000
        );
    });
});

// POST a new patient
// Return the PatientFromDatabase
patientFetchDataRouter.post("/new-patient", (req, res) => {
    let data:Patient = req.body;
    let errorMessage:string = "";

    const isAnyDataMissing:boolean = data.category === undefined || data.dateOfBirth === undefined || data.yearOfBirth === undefined || data.monthOfBirth === undefined || data.firstName === undefined || data.gender === undefined || data.lastName === undefined || data.nric === undefined || data.remarks === undefined || data.contactNumber === undefined;

    if (isAnyDataMissing) {
        res.send({errorMessage: "Some data is missing.\nPlease send a Patient object while POST a new patient."});
        return;
    }

    let dateOfBirth = `${data.yearOfBirth}-${data.monthOfBirth}-${data.dateOfBirth}`;

    const sqlQuery = "INSERT INTO Patient (firstName, lastName, nric, dateOfBirth, category, contactNumber, gender, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    databaseConnection.query(sqlQuery, [data.firstName, data.lastName, data.nric, dateOfBirth, data.category, data.contactNumber, data.gender, data.remarks], (error, results, fields) => {
        if (error) {
            errorMessage += error.message + "\n";
            res.send({errorMessage});
            return;
        }
    });

    setTimeout(
        () => {
            if (errorMessage.length === 0) {
                const getPatientSqlQuery = "SELECT patientId, firstName, lastName, category, contactNumber, gender, year(dateOfBirth) AS 'yearOfBirth', (month(dateOfBirth)) AS 'monthOfBirth', day(dateOfBirth) AS 'dateOfBirth' , nric, remarks FROM Patient WHERE nric = ?;";
        
                databaseConnection.query(getPatientSqlQuery, [data.nric], (error, results, fields) => {
                    if (error) {
                        res.send({errorMessage: error.message});
                        return;
                    }
        
                    res.send(results[0]);
                });
            }
        },
        1000
    )
});

// Edit Patient Category
// Return the patient full data after change
patientFetchDataRouter.post("/edit-patient-category", async (req, res) => {
    let nric = req.body.nric;
    let category:number = parseInt(req.body.category);
    let patient:PatientFromDatabase;
    let errorMessage:string = "";
    let sqlQuery:string = "";
    
    if (category > 0) {
        sqlQuery = "UPDATE Patient SET category = ? WHERE nric = ?;";
        databaseConnection.query(sqlQuery, [category, nric], (error, results, fields) => {
            if (error) {
                errorMessage += error.message;
                return;
            }
        });

        if (errorMessage.length > 0) {
            res.send({errorMessage});
            return;
        }
    }
    
    sqlQuery = "SELECT patientId, firstName, lastName, gender, category, contactNumber, YEAR(dateOfBirth) AS 'yearOfBirth', (MONTH(dateOfBirth)) AS 'monthOfBirth', DAY(dateOfBirth) AS 'dateOfBirth', nric, remarks FROM Patient WHERE nric = ?";

    databaseConnection.query(sqlQuery, [nric], (error, results, fields) => {
        if(error) {
            res.send({errorMessage: error.message});
            return;
        }

        if (results.length === 0) {
            res.send({errorMessage: `Cannot find the patient with NRIC "${nric}"`});
            return;
        }

        res.send(results[0]);
    });
});


export default patientFetchDataRouter;