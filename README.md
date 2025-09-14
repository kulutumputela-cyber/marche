# API de Suivi de Présence UCB

Cette API PHP permet de gérer le suivi de présence des étudiants de l'Université Catholique de Bukavu (UCB).

## Installation

### 1. Base de données
```bash
# Importer le script SQL
mysql -u root -p < database.sql
```

### 2. Configuration
Modifier les paramètres de connexion dans `api.php` ou `config.php` :
```php
private $host = 'localhost';
private $db_name = 'ucb_presence';
private $username = 'root';
private $password = '';
```

### 3. Permissions
Assurez-vous que le serveur web a les permissions d'écriture pour les logs :
```bash
mkdir logs
chmod 755 logs
```

## Endpoints disponibles

### 1. Récupérer un étudiant
```http
GET /api.php?action=getStudent&matricule=05/23.07433
```

**Réponse :**
```json
{
  "matricule": "05/23.07433",
  "fullname": "MUKOZI KAJABIKA BUGUGU",
  "birthday": "2004-04-11",
  "birthplace": "BUKAVU",
  "city": "BUKAVU",
  "civilStatus": "single",
  "avatar": "https://.../0523.07433.jpg",
  "active": 1,
  "promotionId": 11
}
```

### 2. Récupérer la structure académique
```http
GET /api.php?action=getStructure
```

**Réponse :**
```json
[
  {
    "id": 11,
    "title": "BAC1 SYSTEMES INFORMATIQUES",
    "label": "BAC1 INFO",
    "level": 1,
    "entityId": 2
  }
]
```

### 3. Enregistrer une présence
```http
POST /api.php?action=markPresence
Content-Type: application/json

{
  "matricule": "05/23.07433",
  "date": "2024-01-15",
  "time": "08:25:00"
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Présence enregistrée avec succès",
  "data": {
    "matricule": "05/23.07433",
    "date": "2024-01-15",
    "time": "08:25:00",
    "status": "on_time",
    "status_label": "À l'heure"
  }
}
```

### 4. Récupérer les présences d'un étudiant
```http
GET /api.php?action=getPresences&matricule=05/23.07433&startDate=2024-01-01&endDate=2024-01-31
```

### 5. Statistiques générales
```http
GET /api.php?action=stats
```

**Réponse :**
```json
{
  "total_presences": 150,
  "on_time_count": 120,
  "late_count": 30,
  "unique_students": 25,
  "unique_dates": 10,
  "on_time_percentage": 80.00,
  "late_percentage": 20.00
}
```

## Règles de gestion

### Détermination des retards
- **Heure de début des cours :** 08:30:00
- **À l'heure :** arrivée <= 08:30:00
- **En retard :** arrivée > 08:30:00

### Contraintes
- Un étudiant ne peut avoir qu'une seule présence par date
- Le matricule doit être unique
- Les formats de date (YYYY-MM-DD) et heure (HH:MM:SS) sont obligatoires

## Structure de la base de données

### Tables principales
- **students** : Informations des étudiants
- **promotions** : Classes/promotions
- **entities** : Facultés et départements
- **presences** : Enregistrements de présence
- **courses** : Cours (extension future)

### Vues utiles
- **student_presence_stats** : Statistiques par étudiant
- **promotion_presence_stats** : Statistiques par promotion
- **daily_presence_summary** : Résumé quotidien

## Sécurité

### Headers CORS
L'API gère automatiquement les headers CORS pour permettre les requêtes cross-origin.

### Validation des données
- Validation des formats de date et heure
- Échappement des données SQL avec PDO
- Gestion des erreurs avec try-catch

### Logs
Les erreurs et événements sont automatiquement loggés dans `logs/api.log`.

## Intégration avec l'API externe UCB

L'API récupère automatiquement les données depuis :
- **Étudiants :** `https://akhademie.ucbukavu.ac.cd/api/v1/school-students/read-by-matricule`
- **Structure :** `https://akhademie.ucbukavu.ac.cd/api/v1/school/entity-main-list`

Les données sont mises en cache localement pour améliorer les performances.

## Exemples d'utilisation

### JavaScript/Fetch
```javascript
// Récupérer un étudiant
const response = await fetch('/api.php?action=getStudent&matricule=05/23.07433');
const student = await response.json();

// Enregistrer une présence
const presence = await fetch('/api.php?action=markPresence', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    matricule: '05/23.07433',
    date: '2024-01-15',
    time: '08:25:00'
  })
});
```

### cURL
```bash
# Récupérer un étudiant
curl "http://localhost/api.php?action=getStudent&matricule=05/23.07433"

# Enregistrer une présence
curl -X POST "http://localhost/api.php?action=markPresence" \
  -H "Content-Type: application/json" \
  -d '{"matricule":"05/23.07433","date":"2024-01-15","time":"08:25:00"}'
```

## Maintenance

### Sauvegarde
```bash
mysqldump -u root -p ucb_presence > backup_$(date +%Y%m%d).sql
```

### Nettoyage des logs
```bash
# Garder seulement les 30 derniers jours
find logs/ -name "*.log" -mtime +30 -delete
```

## Support

Pour toute question ou problème, consultez les logs dans `logs/api.log` ou contactez l'équipe de développement.