<?php
// logger.php - Schreibt ins gleiche Verzeichnis
// WICHTIG: .htaccess Schutz für web_history.log nicht vergessen!

// Direkten Aufruf blockieren (nur POST erlaubt)
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { 
    http_response_code(405);
    die('Method Not Allowed'); 
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Sicherstellen, dass gültiges JSON übergeben wurde und Datentypen stimmen
if (is_array($data) && isset($data['cmd']) && is_string($data['cmd']) && trim($data['cmd']) !== '') {
    $cmd = trim($data['cmd']);
    $userType = (isset($data['user']) && is_string($data['user'])) ? trim($data['user']) : 'unknown';

    // Filter: Zu lange Eingaben ignorieren (Schutz vor Spam/Flooding)
    if (mb_strlen($cmd) > 255) {
        http_response_code(400);
        exit; 
    }

    // Filter: E-Mail-Adressen blockieren (Datenschutz)
    if (preg_match('/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/', $cmd)) {
        exit;
    }

    // Filter: Sensible Schlüsselwörter zensieren
    if (stripos($cmd, 'pass') !== false || stripos($cmd, 'key') !== false) {
        $cmd = '[REDACTED]';
    }

    $timestamp = date("Y-m-d H:i:s");
    
    // Vollständiger XSS-Schutz für die Logdatei
    $cleanCmd = htmlspecialchars($cmd, ENT_QUOTES, 'UTF-8');
    $cleanUser = htmlspecialchars($userType, ENT_QUOTES, 'UTF-8');
    
    $logEntry = "[$timestamp] [$cleanUser] $cleanCmd" . PHP_EOL;
    
    $logFile = __DIR__ . '/web_history.log';
    
    // Fehlerprüfung & LOCK_EX für sicheres Schreiben bei gleichzeitigem Zugriff
    if (file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX) === false) {
        error_log("GHCIF Logger Error: Kann nicht in $logFile schreiben.");
    }
}
?>
