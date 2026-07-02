USE ticket_system;
-- 1. Falls nötig, alte Daten entfernen (Sicherheits-Check für Fremdschlüssel kurz aus)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE comments;
TRUNCATE TABLE tickets;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- 2. Test-Benutzer einfügen
INSERT INTO users (username, email, password_hash, role) VALUES
('admin_max', 'admin@ticketsystem.de', '$2b$10$WF.szQJNx3Ta.caQYIPN0uOythkIHlSIU88vaYVBXtz5IDTfPKTcy', 'ADMIN'),
('agent_sarah', 'sarah.support@ticketsystem.de', '$2b$10$WF.szQJNx3Ta.caQYIPN0uOythkIHlSIU88vaYVBXtz5IDTfPKTcy', 'AGENT'),
('user_luca', 'luca.kunde@web.de', '$2b$10$WF.szQJNx3Ta.caQYIPN0uOythkIHlSIU88vaYVBXtz5IDTfPKTcy'),
('user_julia', 'julia.meier@gmx.de', '$2b$10$WF.szQJNx3Ta.caQYIPN0uOythkIHlSIU88vaYVBXtz5IDTfPKTcy');

-- 3. Test-Tickets einfügen (ID 1 = admin_max, ID 2 = agent_sarah, ID 3 = user_luca, ID 4 = user_julia)
INSERT INTO tickets (title, description, status, created_by, assigned_to) VALUES
('Login funktioniert nicht', 'Ich kticketsann mich seit dem letzten Update nicht mehr im Frontend anmelden.', 'OFFEN', 3, NULL),
('Fehler bei Rechte-Zuweisung', 'Der User Luca kann fälschlicherweise alle Tickets sehen.', 'IN_BEARBEITUNG', 1, 2),
('Drucker im 2. OG defekt', 'Der Netzwerkdrucker zieht kein Papier mehr ein.', 'GELÖST', 4, 2),
('Passwort zurücksetzen', 'Bitte mein Passwort zurücksetzen.', 'GESCHLOSSEN', 3, 2);