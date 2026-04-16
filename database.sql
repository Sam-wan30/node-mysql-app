-- ============================================
-- Node.js MySQL User Management App Database Setup
-- ============================================

-- Create the database for the application
CREATE DATABASE IF NOT EXISTS node_app;

-- Switch to the created database
USE node_app;

-- Create the users table with required fields
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Show table structure (optional verification)
DESCRIBE users;

-- ============================================
-- Instructions:
-- 1. Open MySQL command line or MySQL Workbench
-- 2. Run this script to create the database and table
-- 3. Verify the database was created: SHOW DATABASES;
-- 4. Verify the table was created: USE node_app; SHOW TABLES;
-- ============================================
