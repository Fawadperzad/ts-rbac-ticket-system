import express from 'express';
import db from './db.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// 1. STARTSEITE
app.get('/', (req, res) => {
  res.send('<h1>Das Backend des Ticket-Systems läuft! 🎉</h1>');
});

// 2. USER-ROUTE (Kennst du schon)
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, username, email, role FROM users');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Datenbank-Fehler bei Usern' });
  }
});

// 3. NEU: ALLE TICKETS ABRUFEN
app.get('/api/tickets', async (req, res) => {
  try {
    // Wir holen alle Tickets aus der Datenbank
    const [rows] = await db.query('SELECT * FROM tickets');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Datenbank-Fehler bei Tickets' });
  }
});

// 4. NEU: EIN NEUES TICKET ERSTELLEN (POST-Methode)
app.post('/api/tickets', async (req, res) => {
  const { title, description, created_by } = req.body;
  
  try {
    const [result] = await db.query(
      'INSERT INTO tickets (title, description, created_by) VALUES (?, ?, ?)',
      [title, description, created_by]
    );
    res.status(201).json({ message: 'Ticket erfolgreich erstellt!', ticketId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ticket konnte nicht erstellt werden' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
});