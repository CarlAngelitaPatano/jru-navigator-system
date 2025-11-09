<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$input = json_decode(file_get_contents('php://input'), true);
$question = $input['question'] ?? '';

if (!$question) {
    echo json_encode(['error' => 'No question provided']);
    exit;
}

// Your OpenAI API Key
$apiKey = "YOUR_OPENAI_API_KEY";

$data = [
    "model" => "gpt-3.5-turbo",
    "messages" => [
        ["role" => "system", "content" => "You are an assistant for Jose Rizal University Admin Dashboard."],
        ["role" => "user", "content" => $question]
    ],
    "temperature" => 0.7
];

$ch = curl_init("https://api.openai.com/v1/chat/completions");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer $apiKey"
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>
