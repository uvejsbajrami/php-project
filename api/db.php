<?php

$host = "localhost:3308";
$database = "api_s4"; // me ndrru emrin e databazes
$charset = "utf8mb4";
$username = "root";
$password = "";
$dsn = "mysql:host=$host;dbname=$database;charset=$charset";

$pdo = new PDO($dsn, $username, $password);