CREATE DATABASE IF NOT EXISTS tasks_db;
USE tasks_db;

CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_name VARCHAR(255) NOT NULL,
    task_description TEXT,
    status VARCHAR(50),
    due_date DATE
);