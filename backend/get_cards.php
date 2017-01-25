<?php

require 'bootstrap.php';

$lat = isset($_GET['lat']) ? $_GET['lat'] : null;
$long = isset($_GET['long']) ? $_GET['long'] : null;
$radius = isset($_GET['radius']) ? $_GET['radius'] : null;

if(!is_numeric($lat) || !is_numeric($long) || !is_numeric($radius)) {
    output_json_error("Invalid values");
}

$query = "SELECT
    `id`, `user_id`, `first_name`, `category_id`, `item_description`, `location_description`, `person_description`, `latitude`, `longitude`, `created_at`,
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
    distance ASC, created_at DESC";
$q = $dbh->prepare($query);

$params = [
    'lat' => $lat,
    'long' => $long,
    'distance' => $radius
];
$cards = [];
if($q->execute($params)) {
    while($row = $q->fetch(PDO::FETCH_ASSOC)) {
        $id = (int)$row['id'];
        $row['time'] = time_since(strtotime($row['created_at']));
        $row['distance_with_label'] = distance_label($row['distance']);
        $cards[" " . $id] = $row;
    }
}

$data = [
    'cards' => $cards
];
echo 'cb(';
echo output_json($data);
echo ')';