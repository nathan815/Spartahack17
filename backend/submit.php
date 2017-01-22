<?php

require 'bootstrap.php';

if($_SERVER['REQUEST_METHOD'] != 'POST') {
    output_json_error("Invalid request method");
}

$name = $_POST['name'];
$userId = $_POST['user_id'];
$category = $_POST['category_id'];
$location_desc = $_POST['location_desc'];
$person_desc = $_POST['person_desc'];
$long = $_POST['long'];
$lat = $_POST['lat'];

// Data validation

if(strlen($name) > NAME_LENGTH) {
    output_json_error('Name is too long.');
}

if(strlen($location_desc) > LOCATION_DESC_LENGTH) {
    output_json_error('Location description is too long.');
}

if(strlen($person_desc) > PERSON_DESC_LENGTH) {
    output_json_error('Person description is too long.');
}

if(!is_numeric($long) || !is_numeric($lat)) {
    output_json_error('Something is wrong.');
}

$query = "INSERT INTO needs ( `user_id`, `first_name`, `category_id`, 
                              `location_description`, `person_description`, 
                              `latitude`, `longitude` )
          VALUES ( :user_id, :first_name, :category_id, :location_desc,
                   :person_desc, :lat, :long )";
$q = $dbh->prepare($query);
$params = [
    'user_id' => $userId,
    'first_name' => $name,
    'category_id' => $category,
    'location_desc' => $location_desc,
    'person_desc' => $person_desc,
    'lat' => $lat,
    'long' => $long
];

$stmt = $q->execute($params);
if($stmt) {
    output_json();
}