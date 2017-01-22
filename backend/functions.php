<?php

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