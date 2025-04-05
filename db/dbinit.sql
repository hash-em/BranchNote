-- Create the database if it doesn't already exist
CREATE DATABASE IF NOT EXISTS branchnotes;

-- Use the created database
USE branchnotes;

-- Create the USERS table if it doesn't already exist
CREATE TABLE
    IF NOT EXISTS USERS (
        user_id INT (4) PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(20),
        hash VARCHAR(100)
    );
