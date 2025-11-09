<?php
header('Content-Type: application/json');

$host = "localhost";
$user = "root";
$password = "";
$dbname = "jru_navigator";

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed"]);
    exit();
}

$result = $conn->query("SELECT id, name, room, floor, role FROM users");
$users = [];

if ($result) {
    while ($row = $result->fetch_assoc()) $users[] = $row;
    echo json_encode(["status" => "success", "users" => $users]);
} else {
    echo json_encode(["status" => "error", "message" => "No users found"]);
}

$conn->close();
?>
