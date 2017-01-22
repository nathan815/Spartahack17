<?php
require 'db_config.php';

try {
    $dbh = new PDO(
        'mysql:host=' . DATABASE_HOST . ';dbname=' . DATABASE_NAME, 
        DATABASE_USERNAME, 
        DATABASE_PASSWORD
    );
} catch (PDOException $e) { 
    die("Unable to connect to DB: " . $e->getMessage());
}