DROP DATABASE IF EXISTS HBM_System;
CREATE DATABASE  IF NOT EXISTS HBM_System;
USE HBM_System;

DROP TABLE IF EXISTS User_Account;

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

-- Example Data Insert
INSERT INTO User_Account
VALUES(101, "admin", "Admin", "", "123", "Admin");

INSERT INTO User_Account
VALUES (NULL, "jianhong", "Jian Hong", "Lee", "Abc", "Developer");

INSERT INTO User_Account
VALUES (NULL, "andreiwong", "Andrei", "Wong", "QWE123", "Registration Crew");

INSERT INTO User_Account
VALUES (NULL, "andy", "Andy", "Lee", "QWERTY", "Admin");