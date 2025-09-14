-- Base de données pour le système de suivi de présence UCB
-- Création de la base de données
CREATE DATABASE IF NOT EXISTS ucb_presence CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ucb_presence;

-- Table des étudiants
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    matricule VARCHAR(50) UNIQUE NOT NULL,
    fullname VARCHAR(100),
    birthday DATE,
    birthplace VARCHAR(100),
    city VARCHAR(100),
    civilStatus VARCHAR(50),
    avatar VARCHAR(255),
    active TINYINT(1) DEFAULT 1,
    promotionId INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_matricule (matricule),
    INDEX idx_promotion (promotionId),
    INDEX idx_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des promotions
CREATE TABLE promotions (
    id INT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    label VARCHAR(50),
    level INT,
    entityId INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_entity (entityId),
    INDEX idx_level (level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des entités (facultés, départements)
CREATE TABLE entities (
    id INT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    label VARCHAR(50),
    level INT,
    parent_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_parent (parent_id),
    INDEX idx_level (level),
    FOREIGN KEY (parent_id) REFERENCES entities(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des présences
CREATE TABLE presences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    matricule VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status ENUM('on_time','late') NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_presence (matricule, date),
    INDEX idx_matricule (matricule),
    INDEX idx_date (date),
    INDEX idx_status (status),
    INDEX idx_date_time (date, time),
    FOREIGN KEY (matricule) REFERENCES students(matricule) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des cours (optionnelle pour extension future)
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    code VARCHAR(20),
    start_time TIME DEFAULT '08:30:00',
    end_time TIME DEFAULT '10:30:00',
    promotionId INT,
    professor VARCHAR(100),
    room VARCHAR(50),
    day_of_week TINYINT(1), -- 1=Lundi, 2=Mardi, etc.
    active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_promotion (promotionId),
    INDEX idx_day (day_of_week),
    INDEX idx_active (active),
    FOREIGN KEY (promotionId) REFERENCES promotions(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des sessions de présence (pour lier présences et cours)
CREATE TABLE presence_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT,
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    status ENUM('scheduled','ongoing','completed','cancelled') DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_course (course_id),
    INDEX idx_date (date),
    INDEX idx_status (status),
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ajout de contraintes de clés étrangères
ALTER TABLE students ADD CONSTRAINT fk_student_promotion 
    FOREIGN KEY (promotionId) REFERENCES promotions(id) ON DELETE SET NULL;

ALTER TABLE promotions ADD CONSTRAINT fk_promotion_entity 
    FOREIGN KEY (entityId) REFERENCES entities(id) ON DELETE SET NULL;

-- Données d'exemple pour les entités (facultés)
INSERT INTO entities (id, title, label, level) VALUES
(1, 'Faculté des Sciences et Technologies', 'FST', 1),
(2, 'Faculté des Sciences Économiques et de Gestion', 'FSEG', 1),
(3, 'Faculté de Droit et Sciences Politiques', 'FDSP', 1),
(4, 'Faculté de Médecine', 'FMED', 1),
(5, 'Faculté des Sciences Sociales', 'FSS', 1);

-- Données d'exemple pour les départements
INSERT INTO entities (id, title, label, level, parent_id) VALUES
(10, 'Département d\'Informatique', 'INFO', 2, 1),
(11, 'Département de Génie Civil', 'GC', 2, 1),
(20, 'Département d\'Économie', 'ECO', 2, 2),
(21, 'Département de Gestion', 'GEST', 2, 2),
(30, 'Département de Droit Privé', 'DP', 2, 3),
(31, 'Département de Droit Public', 'DPU', 2, 3);

-- Données d'exemple pour les promotions
INSERT INTO promotions (id, title, label, level, entityId) VALUES
(11, 'BAC1 SYSTEMES INFORMATIQUES', 'BAC1 INFO', 1, 10),
(12, 'BAC2 SYSTEMES INFORMATIQUES', 'BAC2 INFO', 2, 10),
(13, 'BAC3 SYSTEMES INFORMATIQUES', 'BAC3 INFO', 3, 10),
(21, 'BAC1 GENIE CIVIL', 'BAC1 GC', 1, 11),
(31, 'BAC1 ECONOMIE', 'BAC1 ECO', 1, 20),
(32, 'BAC2 ECONOMIE', 'BAC2 ECO', 2, 20),
(41, 'BAC1 GESTION', 'BAC1 GEST', 1, 21),
(51, 'BAC1 DROIT PRIVE', 'BAC1 DP', 1, 30);

-- Données d'exemple pour les étudiants
INSERT INTO students (matricule, fullname, birthday, birthplace, city, civilStatus, promotionId) VALUES
('05/23.07433', 'MUKOZI KAJABIKA BUGUGU', '2004-04-11', 'BUKAVU', 'BUKAVU', 'single', 11),
('05/23.07434', 'KAMANA SAFARI JEAN', '2003-08-15', 'GOMA', 'BUKAVU', 'single', 11),
('05/23.07435', 'NABINTU FURAHA MARIE', '2004-02-20', 'BUKAVU', 'BUKAVU', 'single', 11),
('05/23.07436', 'BASHIGE MWEMA PATRICK', '2003-12-05', 'UVIRA', 'BUKAVU', 'single', 12),
('05/23.07437', 'ZAWADI AMANI GRACE', '2004-06-30', 'BUKAVU', 'BUKAVU', 'single', 31);

-- Données d'exemple pour les cours
INSERT INTO courses (title, code, start_time, end_time, promotionId, professor, room, day_of_week) VALUES
('Programmation I', 'PROG1', '08:30:00', '10:30:00', 11, 'Prof. MUKAMBA', 'A101', 1),
('Mathématiques I', 'MATH1', '10:45:00', '12:45:00', 11, 'Prof. SAFARI', 'A102', 1),
('Base de Données', 'BD1', '08:30:00', '10:30:00', 12, 'Prof. NABINTU', 'B201', 2),
('Microéconomie', 'MICRO1', '08:30:00', '10:30:00', 31, 'Prof. BASHIGE', 'C301', 3);

-- Données d'exemple pour les présences
INSERT INTO presences (matricule, date, time, status) VALUES
('05/23.07433', '2024-01-15', '08:25:00', 'on_time'),
('05/23.07433', '2024-01-16', '08:45:00', 'late'),
('05/23.07434', '2024-01-15', '08:30:00', 'on_time'),
('05/23.07434', '2024-01-16', '08:35:00', 'late'),
('05/23.07435', '2024-01-15', '08:20:00', 'on_time'),
('05/23.07436', '2024-01-15', '08:50:00', 'late'),
('05/23.07437', '2024-01-15', '08:28:00', 'on_time');

-- Vues utiles pour les statistiques

-- Vue pour les statistiques de présence par étudiant
CREATE VIEW student_presence_stats AS
SELECT 
    s.matricule,
    s.fullname,
    p.title as promotion,
    COUNT(pr.id) as total_presences,
    COUNT(CASE WHEN pr.status = 'on_time' THEN 1 END) as on_time_count,
    COUNT(CASE WHEN pr.status = 'late' THEN 1 END) as late_count,
    ROUND(COUNT(CASE WHEN pr.status = 'on_time' THEN 1 END) * 100.0 / COUNT(pr.id), 2) as on_time_percentage,
    ROUND(COUNT(CASE WHEN pr.status = 'late' THEN 1 END) * 100.0 / COUNT(pr.id), 2) as late_percentage
FROM students s
LEFT JOIN promotions p ON s.promotionId = p.id
LEFT JOIN presences pr ON s.matricule = pr.matricule
GROUP BY s.matricule, s.fullname, p.title;

-- Vue pour les statistiques par promotion
CREATE VIEW promotion_presence_stats AS
SELECT 
    p.id as promotion_id,
    p.title as promotion_title,
    p.label as promotion_label,
    COUNT(DISTINCT s.matricule) as total_students,
    COUNT(pr.id) as total_presences,
    COUNT(CASE WHEN pr.status = 'on_time' THEN 1 END) as on_time_count,
    COUNT(CASE WHEN pr.status = 'late' THEN 1 END) as late_count,
    ROUND(COUNT(CASE WHEN pr.status = 'on_time' THEN 1 END) * 100.0 / NULLIF(COUNT(pr.id), 0), 2) as on_time_percentage
FROM promotions p
LEFT JOIN students s ON p.id = s.promotionId
LEFT JOIN presences pr ON s.matricule = pr.matricule
GROUP BY p.id, p.title, p.label;

-- Vue pour les présences quotidiennes
CREATE VIEW daily_presence_summary AS
SELECT 
    pr.date,
    COUNT(pr.id) as total_presences,
    COUNT(CASE WHEN pr.status = 'on_time' THEN 1 END) as on_time_count,
    COUNT(CASE WHEN pr.status = 'late' THEN 1 END) as late_count,
    COUNT(DISTINCT pr.matricule) as unique_students
FROM presences pr
GROUP BY pr.date
ORDER BY pr.date DESC;

-- Index pour optimiser les performances
CREATE INDEX idx_students_fullname ON students(fullname);
CREATE INDEX idx_presences_created_at ON presences(created_at);
CREATE INDEX idx_promotions_title ON promotions(title);

-- Procédure stockée pour calculer les statistiques d'un étudiant
DELIMITER //
CREATE PROCEDURE GetStudentStats(IN student_matricule VARCHAR(50))
BEGIN
    SELECT 
        s.matricule,
        s.fullname,
        p.title as promotion,
        COUNT(pr.id) as total_presences,
        COUNT(CASE WHEN pr.status = 'on_time' THEN 1 END) as on_time_count,
        COUNT(CASE WHEN pr.status = 'late' THEN 1 END) as late_count,
        ROUND(COUNT(CASE WHEN pr.status = 'on_time' THEN 1 END) * 100.0 / NULLIF(COUNT(pr.id), 0), 2) as on_time_percentage,
        MIN(pr.date) as first_presence,
        MAX(pr.date) as last_presence
    FROM students s
    LEFT JOIN promotions p ON s.promotionId = p.id
    LEFT JOIN presences pr ON s.matricule = pr.matricule
    WHERE s.matricule = student_matricule
    GROUP BY s.matricule, s.fullname, p.title;
END //
DELIMITER ;

-- Trigger pour mettre à jour automatiquement updated_at
DELIMITER //
CREATE TRIGGER update_students_timestamp 
    BEFORE UPDATE ON students 
    FOR EACH ROW 
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

CREATE TRIGGER update_presences_timestamp 
    BEFORE UPDATE ON presences 
    FOR EACH ROW 
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //
DELIMITER ;

-- Commentaires sur les tables
ALTER TABLE students COMMENT = 'Table des étudiants avec informations personnelles';
ALTER TABLE promotions COMMENT = 'Table des promotions/classes';
ALTER TABLE entities COMMENT = 'Table des entités académiques (facultés, départements)';
ALTER TABLE presences COMMENT = 'Table des enregistrements de présence';
ALTER TABLE courses COMMENT = 'Table des cours (extension future)';
ALTER TABLE presence_sessions COMMENT = 'Table des sessions de cours (extension future)';

-- Affichage des informations de création
SELECT 'Base de données UCB Presence créée avec succès!' as message;
SELECT COUNT(*) as total_students FROM students;
SELECT COUNT(*) as total_promotions FROM promotions;
SELECT COUNT(*) as total_entities FROM entities;
SELECT COUNT(*) as total_presences FROM presences;