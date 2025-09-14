<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Configuration de la base de données
class Database {
    private $host = 'localhost';
    private $db_name = 'ucb_presence';
    private $username = 'root';
    private $password = '';
    private $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8",
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]
            );
        } catch(PDOException $exception) {
            error_log("Erreur de connexion: " . $exception->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Erreur de connexion à la base de données']);
            exit;
        }
        return $this->conn;
    }
}

// Classe pour gérer les étudiants
class StudentManager {
    private $conn;
    private $external_api_base = 'https://akhademie.ucbukavu.ac.cd/api/v1';

    public function __construct($db) {
        $this->conn = $db;
    }

    // Récupérer les données d'un étudiant depuis l'API externe
    private function fetchStudentFromExternalAPI($matricule) {
        $url = $this->external_api_base . "/school-students/read-by-matricule?matricule=" . urlencode($matricule);
        
        $context = stream_context_create([
            'http' => [
                'timeout' => 10,
                'method' => 'GET',
                'header' => 'User-Agent: UCB-Presence-System/1.0'
            ]
        ]);

        $response = @file_get_contents($url, false, $context);
        
        if ($response === false) {
            return null;
        }

        return json_decode($response, true);
    }

    // Sauvegarder ou mettre à jour un étudiant en base
    private function saveStudentToDatabase($studentData) {
        $query = "INSERT INTO students (matricule, fullname, birthday, birthplace, city, civilStatus, avatar, active, promotionId) 
                  VALUES (:matricule, :fullname, :birthday, :birthplace, :city, :civilStatus, :avatar, :active, :promotionId)
                  ON DUPLICATE KEY UPDATE 
                  fullname = VALUES(fullname),
                  birthday = VALUES(birthday),
                  birthplace = VALUES(birthplace),
                  city = VALUES(city),
                  civilStatus = VALUES(civilStatus),
                  avatar = VALUES(avatar),
                  active = VALUES(active),
                  promotionId = VALUES(promotionId)";

        $stmt = $this->conn->prepare($query);
        
        return $stmt->execute([
            ':matricule' => $studentData['matricule'],
            ':fullname' => $studentData['fullname'] ?? null,
            ':birthday' => $studentData['birthday'] ?? null,
            ':birthplace' => $studentData['birthplace'] ?? null,
            ':city' => $studentData['city'] ?? null,
            ':civilStatus' => $studentData['civilStatus'] ?? null,
            ':avatar' => $studentData['avatar'] ?? null,
            ':active' => $studentData['active'] ?? 1,
            ':promotionId' => $studentData['promotionId'] ?? null
        ]);
    }

    // Récupérer un étudiant (d'abord en base, puis API externe si nécessaire)
    public function getStudent($matricule) {
        if (empty($matricule)) {
            return ['error' => 'Matricule requis'];
        }

        // Vérifier d'abord en base de données
        $query = "SELECT * FROM students WHERE matricule = :matricule";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([':matricule' => $matricule]);
        $student = $stmt->fetch();

        if ($student) {
            // Convertir les types appropriés
            $student['active'] = (int)$student['active'];
            $student['promotionId'] = $student['promotionId'] ? (int)$student['promotionId'] : null;
            return $student;
        }

        // Si pas trouvé en base, chercher dans l'API externe
        $externalData = $this->fetchStudentFromExternalAPI($matricule);
        
        if ($externalData && isset($externalData['matricule'])) {
            // Sauvegarder en base pour les prochaines fois
            $this->saveStudentToDatabase($externalData);
            return $externalData;
        }

        return ['error' => 'Étudiant non trouvé'];
    }
}

// Classe pour gérer la structure académique
class StructureManager {
    private $conn;
    private $external_api_base = 'https://akhademie.ucbukavu.ac.cd/api/v1';

    public function __construct($db) {
        $this->conn = $db;
    }

    // Récupérer la structure depuis l'API externe
    private function fetchStructureFromExternalAPI() {
        $url = $this->external_api_base . "/school/entity-main-list?entity_id=undefined&promotion_id=1&traditional=undefined";
        
        $context = stream_context_create([
            'http' => [
                'timeout' => 10,
                'method' => 'GET',
                'header' => 'User-Agent: UCB-Presence-System/1.0'
            ]
        ]);

        $response = @file_get_contents($url, false, $context);
        
        if ($response === false) {
            return null;
        }

        return json_decode($response, true);
    }

    // Sauvegarder la structure en base
    private function saveStructureToDatabase($structureData) {
        if (!is_array($structureData)) {
            return false;
        }

        try {
            $this->conn->beginTransaction();

            foreach ($structureData as $item) {
                if (isset($item['id']) && isset($item['title'])) {
                    // Sauvegarder en tant que promotion
                    $query = "INSERT INTO promotions (id, title, label, level, entityId) 
                              VALUES (:id, :title, :label, :level, :entityId)
                              ON DUPLICATE KEY UPDATE 
                              title = VALUES(title),
                              label = VALUES(label),
                              level = VALUES(level),
                              entityId = VALUES(entityId)";

                    $stmt = $this->conn->prepare($query);
                    $stmt->execute([
                        ':id' => $item['id'],
                        ':title' => $item['title'],
                        ':label' => $item['label'] ?? null,
                        ':level' => $item['level'] ?? null,
                        ':entityId' => $item['entityId'] ?? null
                    ]);
                }
            }

            $this->conn->commit();
            return true;
        } catch (Exception $e) {
            $this->conn->rollback();
            error_log("Erreur sauvegarde structure: " . $e->getMessage());
            return false;
        }
    }

    // Récupérer la structure académique
    public function getStructure() {
        // Vérifier d'abord en base de données
        $query = "SELECT * FROM promotions ORDER BY level, title";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $structure = $stmt->fetchAll();

        if (!empty($structure)) {
            // Convertir les types appropriés
            foreach ($structure as &$item) {
                $item['id'] = (int)$item['id'];
                $item['level'] = $item['level'] ? (int)$item['level'] : null;
                $item['entityId'] = $item['entityId'] ? (int)$item['entityId'] : null;
            }
            return $structure;
        }

        // Si pas de données en base, récupérer depuis l'API externe
        $externalData = $this->fetchStructureFromExternalAPI();
        
        if ($externalData) {
            $this->saveStructureToDatabase($externalData);
            return $externalData;
        }

        return ['error' => 'Structure académique non disponible'];
    }
}

// Classe pour gérer les présences
class PresenceManager {
    private $conn;
    private $course_start_time = '08:30:00';

    public function __construct($db) {
        $this->conn = $db;
    }

    // Enregistrer une présence
    public function markPresence($matricule, $date, $time) {
        if (empty($matricule) || empty($date) || empty($time)) {
            return ['error' => 'Matricule, date et heure requis'];
        }

        // Valider le format de la date
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
            return ['error' => 'Format de date invalide (YYYY-MM-DD requis)'];
        }

        // Valider le format de l'heure
        if (!preg_match('/^\d{2}:\d{2}:\d{2}$/', $time)) {
            return ['error' => 'Format d\'heure invalide (HH:MM:SS requis)'];
        }

        // Déterminer le statut (à l'heure ou en retard)
        $status = ($time <= $this->course_start_time) ? 'on_time' : 'late';

        // Vérifier si une présence existe déjà pour ce matricule et cette date
        $checkQuery = "SELECT id FROM presences WHERE matricule = :matricule AND date = :date";
        $checkStmt = $this->conn->prepare($checkQuery);
        $checkStmt->execute([
            ':matricule' => $matricule,
            ':date' => $date
        ]);

        if ($checkStmt->fetch()) {
            return ['error' => 'Présence déjà enregistrée pour cette date'];
        }

        // Enregistrer la présence
        $query = "INSERT INTO presences (matricule, date, time, status) VALUES (:matricule, :date, :time, :status)";
        $stmt = $this->conn->prepare($query);
        
        try {
            $result = $stmt->execute([
                ':matricule' => $matricule,
                ':date' => $date,
                ':time' => $time,
                ':status' => $status
            ]);

            if ($result) {
                return [
                    'success' => true,
                    'message' => 'Présence enregistrée avec succès',
                    'data' => [
                        'matricule' => $matricule,
                        'date' => $date,
                        'time' => $time,
                        'status' => $status,
                        'status_label' => $status === 'on_time' ? 'À l\'heure' : 'En retard'
                    ]
                ];
            } else {
                return ['error' => 'Erreur lors de l\'enregistrement'];
            }
        } catch (PDOException $e) {
            error_log("Erreur enregistrement présence: " . $e->getMessage());
            return ['error' => 'Erreur lors de l\'enregistrement de la présence'];
        }
    }

    // Récupérer les présences d'un étudiant
    public function getStudentPresences($matricule, $startDate = null, $endDate = null) {
        $query = "SELECT * FROM presences WHERE matricule = :matricule";
        $params = [':matricule' => $matricule];

        if ($startDate) {
            $query .= " AND date >= :startDate";
            $params[':startDate'] = $startDate;
        }

        if ($endDate) {
            $query .= " AND date <= :endDate";
            $params[':endDate'] = $endDate;
        }

        $query .= " ORDER BY date DESC, time DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);
        
        return $stmt->fetchAll();
    }
}

// Fonction utilitaire pour valider les paramètres
function validateInput($data, $required_fields) {
    $errors = [];
    foreach ($required_fields as $field) {
        if (!isset($data[$field]) || empty(trim($data[$field]))) {
            $errors[] = "Le champ '$field' est requis";
        }
    }
    return $errors;
}

// Fonction pour obtenir les données POST (JSON ou form-data)
function getPostData() {
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    
    if (strpos($contentType, 'application/json') !== false) {
        $json = file_get_contents('php://input');
        return json_decode($json, true) ?? [];
    } else {
        return $_POST;
    }
}

// Gestion des requêtes OPTIONS pour CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Initialisation de la base de données
$database = new Database();
$db = $database->getConnection();

if (!$db) {
    exit;
}

// Récupération de l'action
$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'getStudent':
            $matricule = $_GET['matricule'] ?? '';
            $studentManager = new StudentManager($db);
            $result = $studentManager->getStudent($matricule);
            echo json_encode($result);
            break;

        case 'getStructure':
            $structureManager = new StructureManager($db);
            $result = $structureManager->getStructure();
            echo json_encode($result);
            break;

        case 'markPresence':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                http_response_code(405);
                echo json_encode(['error' => 'Méthode POST requise']);
                break;
            }

            $postData = getPostData();
            $errors = validateInput($postData, ['matricule', 'date', 'time']);
            
            if (!empty($errors)) {
                http_response_code(400);
                echo json_encode(['error' => implode(', ', $errors)]);
                break;
            }

            $presenceManager = new PresenceManager($db);
            $result = $presenceManager->markPresence(
                $postData['matricule'],
                $postData['date'],
                $postData['time']
            );

            if (isset($result['error'])) {
                http_response_code(400);
            }

            echo json_encode($result);
            break;

        case 'getPresences':
            $matricule = $_GET['matricule'] ?? '';
            if (empty($matricule)) {
                http_response_code(400);
                echo json_encode(['error' => 'Matricule requis']);
                break;
            }

            $startDate = $_GET['startDate'] ?? null;
            $endDate = $_GET['endDate'] ?? null;

            $presenceManager = new PresenceManager($db);
            $result = $presenceManager->getStudentPresences($matricule, $startDate, $endDate);
            echo json_encode($result);
            break;

        case 'stats':
            // Statistiques générales
            $query = "SELECT 
                        COUNT(*) as total_presences,
                        COUNT(CASE WHEN status = 'on_time' THEN 1 END) as on_time_count,
                        COUNT(CASE WHEN status = 'late' THEN 1 END) as late_count,
                        COUNT(DISTINCT matricule) as unique_students,
                        COUNT(DISTINCT date) as unique_dates
                      FROM presences";
            
            $stmt = $db->prepare($query);
            $stmt->execute();
            $stats = $stmt->fetch();

            // Calculer les pourcentages
            if ($stats['total_presences'] > 0) {
                $stats['on_time_percentage'] = round(($stats['on_time_count'] / $stats['total_presences']) * 100, 2);
                $stats['late_percentage'] = round(($stats['late_count'] / $stats['total_presences']) * 100, 2);
            } else {
                $stats['on_time_percentage'] = 0;
                $stats['late_percentage'] = 0;
            }

            echo json_encode($stats);
            break;

        default:
            http_response_code(400);
            echo json_encode([
                'error' => 'Action non reconnue',
                'available_actions' => [
                    'getStudent' => 'GET /api.php?action=getStudent&matricule=XXX',
                    'getStructure' => 'GET /api.php?action=getStructure',
                    'markPresence' => 'POST /api.php?action=markPresence',
                    'getPresences' => 'GET /api.php?action=getPresences&matricule=XXX',
                    'stats' => 'GET /api.php?action=stats'
                ]
            ]);
            break;
    }
} catch (Exception $e) {
    error_log("Erreur API: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Erreur interne du serveur']);
}
?>