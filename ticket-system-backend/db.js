import mysql from 'mysql2';
import dotenv from 'dotenv';

// Lädt die Variablen aus deiner unsichtbaren .env-Datei
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD, // 🔒 Jetzt absolut sicher geschützt!
  database: process.env.DB_NAME,
  port: process.env.PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool.promise();