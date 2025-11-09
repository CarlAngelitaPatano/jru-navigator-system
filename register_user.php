<?php
header("Content-Type: application/json");

// Get the raw POST data
$data = json_decode(file_get_contents("php://input"), true);

// Validate input
if (!isset($data['id'], $data['name'], $data['room'], $data['floor'], $data['password'])) {
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit;
}

$id = $data['id'];
$name = $data['name'];
$room = $data['room'];
$floor = $data['floor'];
$password = password_hash($data['password'], PASSWORD_DEFAULT); // hash password

$usersFile = "users.json";
$attendanceFile = "attendance.json";

// Read existing users
if (file_exists($usersFile)) {
    $users = json_decode(file_get_contents($usersFile), true);
} else {
    $users = [];
}

// Check if ID already exists
if (isset($users[$id])) {
    echo json_encode(["status" => "error", "message" => "Student ID already registered"]);
    exit;
}

// Add new user
$users[$id] = [
    "name" => $name,
    "room" => $room,
    "floor" => $floor,
    "role" => "student",
    "password" => $password
];

// Save users back to JSON
file_put_contents($usersFile, json_encode($users, JSON_PRETTY_PRINT));

// Add default attendance
if (file_exists($attendanceFile)) {
    $attendance = json_decode(file_get_contents($attendanceFile), true);
} else {
    $attendance = [];
}
$attendance[$id] = "absent";
file_put_contents($attendanceFile, json_encode($attendance, JSON_PRETTY_PRINT));

// Return success
echo json_encode(["status" => "success", "message" => "Registration successful"]);
exit;
?>
