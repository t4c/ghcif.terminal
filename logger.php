<?php
// logger.php - Schreibt ins gleiche Verzeichnis
// WICHTIG: .htaccess Schutz nicht vergessen!

if (basename($_SERVER['PHP_SELF']) == basename(__FILE__)) { 
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') { die('Access denied'); }
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if ($data && isset($data['cmd']) && !empty($data['cmd'])) {
    $cmd = trim($data['cmd']);
    $userType = isset($data['user']) ? $data['user'] : 'unknown';

    // Filter
    if (strlen($cmd) > 100) exit; 
    if (preg_match('/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/', $cmd)) exit;
    if (stripos($cmd, 'pass') !== false || stripos($cmd, 'key') !== false) {
        $cmd = '[REDACTED]';
    }

    $timestamp = date("Y-m-d H:i:s");
    $cleanCmd = htmlspecialchars($cmd);
    $cleanUser = htmlspecialchars($userType);
    $logEntry = "[$timestamp] [$cleanUser] $cleanCmd" . PHP_EOL;
    
    // PFAD GEÄNDERT: Schreibt jetzt direkt in den Web-Ordner
    $logFile = __DIR__ . '/web_history.log';
    
    // Fehlerprüfung
    if (file_put_contents($logFile, $logEntry, FILE_APPEND) === false) {
        // Falls das Schreiben fehlschlägt, Fehler ins PHP Error Log schreiben
        error_log("GHCIF Logger Error: Kann nicht in $logFile schreiben.");
    }
}
?>
