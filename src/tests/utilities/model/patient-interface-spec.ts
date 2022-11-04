import serverDatabaseInfo from '../../../utilities/server-database-info.json';
import mysql, { ConnectionConfig } from 'mysql';
import { Patient, PatientFromDatabase, Gender, Category } from "../../../utilities/model/patient-interface";

let databaseConnection:mysql.Connection;

describe("Patient interface test.", () => {
    beforeEach((done) => {
        const databaseConfig:ConnectionConfig = {
            host: serverDatabaseInfo.databaseInfo.host,
            port: serverDatabaseInfo.databaseInfo.port,
            user: serverDatabaseInfo.databaseInfo.user,
            password: serverDatabaseInfo.databaseInfo.password,
            database: serverDatabaseInfo.databaseInfo.database
        };
        
        databaseConnection = mysql.createConnection(databaseConfig);

        done();
    })
    
    it("PatientFromData interface should contain all patient's data.", (done) => {
        const patient:Patient = {
            nric: "S0000000A",
            firstName: "test first name",
            lastName: "test last name",
            gender: Gender.MALE,
            category: Category.GENERAL_CARE,
            contactNumber: 99998888,
            dateOfBirth: 1,
            monthOfBirth: 1,
            yearOfBirth: 2000,
            remarks: "Test Remarks"
        };

        const insertSqlQuery = "INSERT INTO Patient(nric, firstName, lastName, gender, category, contactNumber, dateOfBirth, remarks) VALUE (?, ?, ?, ?, ?, ?, ?, ?)";
        let isInsertSuccessful:boolean = false;

        databaseConnection.query(
            insertSqlQuery,
            [
                patient.nric,
                patient.firstName,
                patient.lastName,
                patient.gender,
                patient.category,
                patient.contactNumber,
                `${patient.yearOfBirth}/${patient.monthOfBirth}/${patient.dateOfBirth}`,
                patient.remarks
            ],
            (error) => {
                if (error) {
                    isInsertSuccessful = false;
                    console.error(error.message);
                } else {
                    isInsertSuccessful = true;
                }
            }
        );

        const selectSql = "SELECT * FROM Patient WHERE nric = ?";
        let isSelectSuccessful:boolean = false;
        let selectResult:Array<any> = [];
        let patientFromDatabase:PatientFromDatabase;
        let isAllDataContained:boolean = false;

        databaseConnection.query(selectSql, [patient.nric], (error, results) => {
            if (error) {
                isSelectSuccessful = false;
                console.error(`Error from select query:\n${error.message}`);
                return;
            } else {
                isInsertSuccessful = true;
            }

            selectResult.push(...results);
        });

        isAllDataContained = compareObject(selectResult, patientFromDatabase);

        setTimeout(
            () => {
                expect(selectResult.length).toBeGreaterThan(0);
                expect(isAllDataContained).toBeTrue();
                
                let deleteSql = "DELETE FROM Patient WHERE nric = ?";

                databaseConnection.query(deleteSql, ["S0000000A"], (error) => {
                    console.error(`Delete query is not running successful in database with error below:\n${error.message}`);
                });
                
                done();
            },
            2000
        );
    });
});

const compareObject = (objectFromDatabase:Object, objectInSystem:Object):boolean => {
    for (let key of Object.keys(objectFromDatabase)) {
        if (!Object.keys(objectInSystem).includes(key)) {
            return false;
        }
    }

    return true;
};