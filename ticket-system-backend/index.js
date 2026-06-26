import express from 'express';
import db from './db.js'; // ⚠️ Wichtig: Bei ESM muss das ".js" hier am Ende stehen!

const app = express();
const PORT = 3000;

app.use(express.json());

// Die Test-Route
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, username, email, role FROM users');
    res.json(rows);
  } catch (error) {
    console.error('Fehler beim Abrufen der User:', error);
    res.status(500).json({ error: 'Datenbank-Fehler' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
});