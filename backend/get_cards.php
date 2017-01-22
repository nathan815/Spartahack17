<?php

require 'bootstrap.php';

$lat = $_GET['lat'];
$long = $_GET['long'];
$radius = $_GET['radius'];

if(!is_numeric($lat) || !is_numeric($long) || !is_numeric($radius)) {
    die("Invalid values");
}

$query = "SELECT
    `id`, `user_id`, `first_name`, `category_id`, `location_description`, `person_description`, `latitude`, `longitude`,
    (
        6371 *
        acos(
            cos( radians( :lat ) ) *
            cos( radians( `latitude` ) ) *
            cos(
                radians( `longitude` ) - radians( :long )
            ) +
            sin(radians(:lat)) *
            sin(radians(`latitude`))
        )
    ) `distance`
FROM
    `needs`
HAVING
    `distance` < :distance
ORDER BY
    `distance`
LIMIT
    25";
$q = $dbh->prepare($query);
$params = [
    'lat' => $lat,
    'long' => $long,
    'distance' => $radius
];

$cards = [];

if($q->execute($params)) {
    while($row = $q->fetch(PDO::FETCH_ASSOC)) {
        $cards[] = $row;
    }
}


$data = [
    'cards' => $cards
];
echo json_encode($data);