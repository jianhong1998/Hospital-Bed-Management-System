DROP DATABASE IF EXISTS HBM_System;
CREATE DATABASE  IF NOT EXISTS HBM_System;
USE HBM_System;

DROP TABLE IF EXISTS Patient_Queue;
DROP TABLE IF EXISTS Patient;
DROP TABLE IF EXISTS User_Account;
DROP TABLE IF EXISTS Ward;

CREATE TABLE User_Account(
	user_id		INT			AUTO_INCREMENT,
    username	VARCHAR(50)	NOT NULL,
    first_name	VARCHAR(50),
    last_name	VARCHAR(50),
    password	VARCHAR(50)	NOT NULL,
    role		VARCHAR(50),
    CONSTRAINT User_PK PRIMARY KEY (user_id),
    CONSTRAINT User_AK_username UNIQUE(username)
);

CREATE TABLE Ward(
	ward_id								INT AUTO_INCREMENT,
    ward_type							ENUM("General Ward", "Infectious Disease Ward", "Intensive Care Ward"),
    current_status						ENUM("Occupied", "Discharged Pending Sanitizing", "Sanitizing", "Available"),
    patient_id							INT,
    discharge_finish_timestamp			DATETIME,
    sanitizing_finish_timestamp			DATETIME,
    CONSTRAINT Ward_PK PRIMARY KEY (ward_id)
);

CREATE TABLE Patient (
	patientId	INT AUTO_INCREMENT,
    firstName	VARCHAR(50)	NOT NULL,
    lastName	VARCHAR(50) NOT NULL,
    gender		ENUM("Male", "Female") NOT NULL,
    category	ENUM("Intensive Care", "Infectious Disease", "General Care") NOT NULL,
    contactNumber INT NOT NULL,
    dateOfBirth	DATE NOT NULL,
    nric		CHAR(9) NOT NULL,
    remarks		TEXT,
    CONSTRAINT Patient_PK PRIMARY KEY (patientId),
    CONSTRAINT Patient_AK UNIQUE (nric),
    CONSTRAINT Patient_Nric_Length CHECK (LENGTH(nric) = 9),
    CONSTRAINT Patient_ContactNumber_Length CHECK (contactNumber >= 60000000 AND contactNumber <= 99999999)
);

CREATE TABLE Patient_Queue (
	patientId		INT,
    patientCategory	ENUM("Intensive Care", "Infectious Disease", "General Care") NOT NULL,
    timeIn			DATETIME NOT NULL,
    timeOut			DATETIME,
    CONSTRAINT Patient_Queue_PK PRIMARY KEY (patientId, timeIn),
    CONSTRAINT Patient_Queue_FK FOREIGN KEY (patientId) REFERENCES Patient(patientId)
);


-- User Account
INSERT INTO User_Account
VALUES(101, "admin", "Admin", "", "123", "Admin");

INSERT INTO User_Account
VALUES (NULL, "robertlee", "Robert", "Lee", "QWE123", "Register Officer");

-- General Ward
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (1, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (1, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (1, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (1, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (1, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (1, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (1, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (1, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (1, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (1, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (1, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (1, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (1, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (1, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (1, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (1, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (1, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (1, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (1, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (1, "available", null);

-- Intensive Care Ward
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (3, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (3, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (3, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (3, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (3, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (3, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (3, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (3, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (3, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (3, "available", null);

-- Infectious Disease Ward
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (2, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (2, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (2, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (2, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (2, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (2, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (2, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (2, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (2, "available", null);
INSERT INTO Ward (ward_type, current_status, patient_id)
VALUES (2, "available", null);


-- Patient Sample
INSERT INTO Patient(firstName, lastName, gender, category, contactNumber, dateOfBirth, nric, remarks)
VALUES("JOSHUA", "LEE", 1, 1, 99998888, "1998-01-01", "S9988100A", "Remarks for Joshua");
INSERT INTO Patient(firstName, lastName, gender, category, contactNumber, dateOfBirth, nric, remarks)
VALUES("JASON", "YEO", 1, 1, 88887777, "2000-12-31", "S9988200A", "");
INSERT INTO Patient(firstName, lastName, gender, category, contactNumber, dateOfBirth, nric, remarks)
VALUES("CINDY", "Ho", 2, 1, 66665555, "1983-09-12", "G9988100A", "");
INSERT INTO Patient(firstName, lastName, gender, category, contactNumber, dateOfBirth, nric, remarks)
VALUES("ALAN", "CHUA", 1, 1, 99997777, "2000-05-22", "T0099100A", "");
