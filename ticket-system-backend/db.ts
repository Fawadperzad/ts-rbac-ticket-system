import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

process.env.DOTENV_CONFIG_QUIET = 'true';
dotenv.config({ quiet: true });

// Erstelle den Verbindungspool zur MySQL-Datenbank
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ticket_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;