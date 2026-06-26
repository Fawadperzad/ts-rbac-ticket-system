USE ticket_system;
-- 1. Vorhandene Tabellen löschen (falls das Skript neu gestartet wird)
DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS users;

-- 2. Tabelle für Benutzer (Users) erstellen
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('USER', 'AGENT', 'ADMIN') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabelle für Tickets erstellen
CREATE TABLE tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('OFFEN', 'IN_BEARBEITUNG', 'GELÖST', 'GESCHLOSSEN') DEFAULT 'OFFEN',
    created_by INT,
    assigned_to INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Fremdschlüssel-Beziehungen (Verknüpfung zu den Usern)
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);