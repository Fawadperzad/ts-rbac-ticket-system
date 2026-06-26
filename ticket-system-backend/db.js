import mysql from 'mysql2';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', 
  password: 'My$$Sql316', // ⚠️ Dein echtes Passwort eintragen!
  database: 'ticket_system',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool.promise();