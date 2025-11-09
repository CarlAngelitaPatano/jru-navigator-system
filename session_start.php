<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Paths to store users and attendance
$usersFile = __DIR__ . '/users.json';
$attendanceFile = __DIR__ . '/attendance.json';

// Load existing users
$users = file_exists($usersFile) ? json_decode(file_get_contents($usersFile), true) : [];

// Load existing attendance
$attendance = file_exists($attendanceFile) ? json_decode(file_get_contents($attendanceFile), true) : [];

// Read input
$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? 'login';
$id = $input['id'] ?? '';
$pw = $input['password'] ?? '';

// -------------------
// Registration
// -------------------
if ($action === 'register') {
    $name = $input['name'] ?? '';
    $room = $input['room'] ?? '';
    $floor = $input['floor'] ?? '';

    if (!$id || !$pw || !$name || !$room || !$floor) {
        echo json_encode(['status' => 'error', 'message' => 'All fields are required']);
        exit;
    }

    if (isset($users[$id])) {
        echo json_encode(['status' => 'error', 'message' => 'ID already exists']);
        exit;
    }

    $users[$id] = [
        'password' => $pw,
        'name' => $name,
        'room' => $room,
        'floor' => intval($floor),
        'coords' => ['x' => 0, 'y' => 0],
        'role' => 'user'
    ];

    file_put_contents($usersFile, json_encode($users, JSON_PRETTY_PRINT));
    echo json_encode(['status' => 'success', 'message' => 'Registration successful']);
    exit;
}

// -------------------
// Login
// -------------------
if (!isset($users[$id])) {
    echo json_encode(['status' => 'error', 'message' => 'ID not found']);
    exit;
}

// Plain text password check
if ($users[$id]['password'] !== $pw) {
    echo json_encode(['status' => 'error', 'message' => 'Incorrect password']);
    exit;
}

// Automatically mark attendance for non-admins
if (($users[$id]['role'] ?? 'user') !== 'admin') {
    $attendance[$id] = "present";
    file_put_contents($attendanceFile, json_encode($attendance, JSON_PRETTY_PRINT));
}

// Success: return full user object including role
echo json_encode(['status' => 'success', 'user' => $users[$id]]);
