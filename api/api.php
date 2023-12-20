<?php

include 'db.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Methods: *');

$method = $_SERVER['REQUEST_METHOD'];   
$data = json_decode(file_get_contents('php://input'),true);







?>