<?php

define('FEET_IN_MILE', 5280);

function output_json_error($msg) {
    output_json(null, false, $msg);
    exit;
}

function output_json($data = [], $success = true, $error_msg = null) {
    $arr = [
        'success' => $success,
        'error' => $error_msg,
        'data' => $data
    ];
    $json = json_encode($arr);
    echo $json;
}

function time_since($time)
{
   $periods = array("second", "minute", "hour", "day", "week", "month", "year", "decade");
   $lengths = array("60","60","24","7","4.35","12","10");

   $now = time();

       $difference     = $now - $time;
       $tense         = "ago";

   for($j = 0; $difference >= $lengths[$j] && $j < count($lengths)-1; $j++) {
       $difference /= $lengths[$j];
   }

   $difference = round($difference);

   if($difference != 1) {
       $periods[$j].= "s";
   }

   return "$difference $periods[$j]";
}

function distance_label($distance) {
  $distanceRounded = round($distance, 2)+0;
  if($distance == 0) {
    return "right here";
  }
  if($distance < 1) {
    $distanceRounded = number_format($distanceRounded*FEET_IN_MILE,0);
    return "$distanceRounded feet";
  }
  return number_format($distanceRounded,2)+0 . " mile" . ($distanceRounded != 1 ? "s" : "");
}