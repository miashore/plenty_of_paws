<?php
define('API_KEY', '1db51d3f16936ba505cf7a0476dd8771');
$url = 'http://api.petfinder.com/pet.getRandom';
$format = 'json';
$animal = $_GET['animal'];
$output = $_GET['output'];
$response = [];

// query API

$ch = curl_init($url);
//curl_setopt($ch, CURLOPT_HEADER, 0);
$response['data'] = curl_exec($ch);
curl_close($ch);
print(json_encode($response));
?>