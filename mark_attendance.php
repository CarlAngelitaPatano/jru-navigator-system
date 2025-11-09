<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$userId = $data['id'] ?? null;
$manual = $data['manual'] ?? false;
$file = 'attendance.json';

$attendance = [];
if (file_exists($file)) {
    $attendance = json_decode(file_get_contents($file), true);
}

if (!isset($attendance[$userId])) {
    $attendance[$userId] = [];
}

$today = date('Y-m-d');

// Manual marking overrides automatic
if ($manual) {
    if (!in_array($today, $attendance[$userId])) {
        $attendance[$userId][] = $today;
    }
} else {
    // Automatic marking at login (if user never marked today)
    if (!in_array($today, $attendance[$userId])) {
        $attendance[$userId][] = $today; // auto-present at login
    }
}

// Save back
file_put_contents($file, json_encode($attendance, JSON_PRETTY_PRINT));

echo json_encode($attendance);
?>
