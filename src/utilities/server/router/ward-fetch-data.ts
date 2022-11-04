import { Router } from "express";
import databaseConnection from "../../database/database-connection";
import { WardStatus } from "../../model/ward-interface";

const wardFetchDataRouter = Router();

// http:localhost:8080/fetch/ward

// get all ward data
wardFetchDataRouter.get("/all-ward", (req, res) => {
    const sqlQuery = "SELECT ward_id, ward_type, current_status, patient_id FROM Ward;";
    databaseConnection.query(sqlQuery, (error , result , fields ) => {
        if (error) {
            res.send(error.message);
            return;
        }

        setTimeout(
            () => res.send(result),
            1000
        );
    })
});

// get specified ward data
wardFetchDataRouter.get("/ward", (req, res) => {
    if (req.query.wardId === undefined) {
        res.status(200);
        res.send("Please include wardId in query");
        return;
    }
    
    const sqlQuery = "SELECT ward_id, ward_type, current_status, patient_id FROM Ward WHERE ward_id = ?;";
    databaseConnection.query(sqlQuery, [req.query.wardId], (error, results, fields) => {
        if (error) {
            res.send(error.message);
            return;
        }
        setTimeout(
            () => res.send(results),
            1000
        );
    });
});

// SET ward status
wardFetchDataRouter.post("/set-ward-status", (req, res) => {
    res.header("Content-Type", "text/plain");

    if (req.body.wardId === undefined || req.body.wardStatus === undefined) {
        res.send("Please include wardId and wardStatus in POST request");
        return;
    }

    const wardStatus:WardStatus = req.body.wardStatus;
    const wardId:string = req.body.wardId;
    let patientId:string|null = null;

    if (wardStatus === 1 && req.body.patientId === undefined) {
        res.send("Please include petientId in POST request");
        return;
    }

    // If setting ward to occupied, then have to set patientId at the same time
    if (wardStatus === 1) {
        patientId = req.body.patientId;
    }

    let sqlQuery:string = "UPDATE Ward SET current_status = ?, patient_id = ? WHERE ward_id = ?;";

    databaseConnection.query(sqlQuery, [wardStatus , patientId, wardId], (error, results, fields) => {
        if (error) {
            res.send(error.message);
            return;
        }

        setTimeout(
            () => res.send(<string>results),
            1000
        );
    });
});

wardFetchDataRouter.get("/total-occupied-ward", (req, res) => {
    const sqlQuery = "SELECT COUNT(*) AS 'totalOccupiedWard' FROM Ward WHERE current_status = 'Occupied';";
    databaseConnection.query(sqlQuery, (error , result , fields ) => {
        if (error) {
            res.send(error.message);
            return;
        }

        res.send(result[0]);
    });
});

export default wardFetchDataRouter;