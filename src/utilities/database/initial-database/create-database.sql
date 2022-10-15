DROP DATABASE IF EXISTS HBM_System;
CREATE DATABASE  IF NOT EXISTS HBM_System;
USE HBM_System;

DROP TABLE IF EXISTS User_Account;
DROP TABLE IF EXISTS Ward;

CREATE TABLE User_Account(
	user_id		INT			AUTO_INCREMENT,
    username	CHAR(50)	NOT NULL,
    first_name	CHAR(50),
    last_name	CHAR(50),
    password	CHAR(50)	NOT NULL,
    role		CHAR(50),
    CONSTRAINT User_PK PRIMARY KEY (user_id),
    CONSTRAINT User_AK_username UNIQUE(username)
);

CREATE TABLE Ward(
	ward_id			INT AUTO_INCREMENT,
    ward_type		ENUM("General Ward", "Infectious Disease Ward", "Intensive Care Ward"),
    current_status	ENUM("Occupied", "Discharged Pending Sanitizing", "Sanitizing", "Available"),
    patient_id		INT,
    CONSTRAINT Ward_PK PRIMARY KEY (ward_id)
);



-- User Account
INSERT INTO User_Account
VALUES(101, "admin", "Admin", "", "123", "Admin");

INSERT INTO User_Account
VALUES (NULL, "jianhong", "Jian Hong", "Lee", "QWE123", "Reception Crew");

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