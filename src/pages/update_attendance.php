<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Only POST requests allowed."]);
    exit;
}

// Get POST data
$input = json_decode(file_get_contents("php://input"), true);

if (!$input || !isset($input['id'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid user data."]);
    exit;
}

$userId = $input['id'];

// Paths to JSON files
$attendanceFile = __DIR__ . "/attendance.json";

// Read current attendance data
if (!file_exists($attendanceFile)) {
    file_put_contents($attendanceFile, json_encode([]));
}

$attendanceData = json_decode(file_get_contents($attendanceFile), true);

// Update attendance for user
$attendanceData[$userId] = "present";

// Save updated data
if (file_put_contents($attendanceFile, json_encode($attendanceData, JSON_PRETTY_PRINT))) {
    echo json_encode(["status" => "success", "message" => "Attendance recorded successfully."]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to save attendance."]);
}
