<?php
require 'bootstrap.php';

$need_id = $_GET['id'];
//$user_id = $_POST['user_id'];

$query = "SELECT * FROM needs WHERE id = ?";
$q = $dbh->prepare($query);
$stmt = $q->execute([ $need_id ]);
$info = $q->fetch();

if(!$info) {
    output_json_error("Not found");
}

$dbh->beginTransaction();

$query = "INSERT INTO completed_needs ( `user_id`, `first_name`, `category_id`, 
                              `location_description`, `person_description`, 
                              `latitude`, `longitude` )
          VALUES ( :user_id, :first_name, :category_id, :location_desc,
                   :person_desc, :lat, :long )";
$q = $dbh->prepare($query);
$params = [
    'user_id' => $info['user_id'],
    'first_name' => $info['first_name'],
    'category_id' => $info['category_id'],
    'location_desc' => $info['location_description'],
    'person_desc' => $info['person_description'],
    'lat' => $info['latitude'],
    'long' => $info['longitude']
];

$stmt = $q->execute($params);

$rollback = false;
if($stmt) {
    $query = "DELETE FROM needs WHERE id = ?";
    $q = $dbh->prepare($query);
    $params = [ $need_id ];
    $deleted = $q->execute($params);
    if(!$deleted) $rollback = true;
}
else {
    $rollback = true;
}

if($rollback) {
    $dbh->rollBack();
    output_json_error("Sorry, could not complete request.");
}
else {
    $dbh->commit();
    output_json();
}