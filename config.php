<?php
/**
 * Configuration de l'API UCB Presence
 */

// Configuration de la base de données
define('DB_HOST', 'localhost');
define('DB_NAME', 'ucb_presence');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Configuration de l'API externe UCB
define('UCB_API_BASE_URL', 'https://akhademie.ucbukavu.ac.cd/api/v1');
define('UCB_API_TIMEOUT', 10);

// Configuration des horaires
define('COURSE_START_TIME', '08:30:00');
define('LATE_THRESHOLD_MINUTES', 0); // Minutes de tolérance avant d'être considéré en retard

// Configuration de sécurité
define('API_KEY_REQUIRED', false); // Mettre à true pour activer l'authentification par clé API
define('VALID_API_KEYS', [
    'ucb_admin_2024',
    'presence_system_key'
]);

// Configuration des logs
define('ENABLE_LOGGING', true);
define('LOG_FILE', 'logs/api.log');

// Configuration CORS
define('CORS_ALLOWED_ORIGINS', [
    'http://localhost:3000',
    'http://localhost:9002',
    'https://your-frontend-domain.com'
]);

// Fuseau horaire
date_default_timezone_set('Africa/Lubumbashi');

// Configuration des erreurs
if (defined('ENVIRONMENT') && ENVIRONMENT === 'development') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

/**
 * Fonction pour logger les erreurs et événements
 */
function logMessage($message, $level = 'INFO') {
    if (!ENABLE_LOGGING) return;
    
    $logDir = dirname(LOG_FILE);
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }
    
    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "[$timestamp] [$level] $message" . PHP_EOL;
    file_put_contents(LOG_FILE, $logEntry, FILE_APPEND | LOCK_EX);
}

/**
 * Fonction pour valider la clé API
 */
function validateApiKey($apiKey) {
    if (!API_KEY_REQUIRED) return true;
    return in_array($apiKey, VALID_API_KEYS);
}

/**
 * Fonction pour configurer les headers CORS
 */
function setCorsHeaders() {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, CORS_ALLOWED_ORIGINS) || in_array('*', CORS_ALLOWED_ORIGINS)) {
        header("Access-Control-Allow-Origin: $origin");
    }
    
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-API-Key');
    header('Access-Control-Allow-Credentials: true');
}
?>