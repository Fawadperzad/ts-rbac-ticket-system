import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
const PORT = 3000;

// MIDDLEWARES
app.use(cors()); // Erlaubt deinem Angular-Frontend den Zugriff
app.use(express.json()); // Erlaubt dem Server, JSON-Daten zu lesen

// 1. STARTSEITE
app.get('/', (req, res) => {
  res.send('<h1>Das Backend des Ticket-Systems läuft! 🎉</h1><p>Verwende /api/users oder /api/tickets, um Daten abzurufen.</p>');
});

// 2. USER-ROUTE (Alle Benutzer abrufen)
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, username, email, role FROM users');
    res.json(rows);
  } catch (error) {
    console.error('Fehler beim Abrufen der User:', error);
    res.status(500).json({ error: 'Datenbank-Fehler bei Usern' });
  }
});

// 3. TICKET-ROUTEN

// A) Alle Tickets abrufen
app.get('/api/tickets', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tickets');
    res.json(rows);
  } catch (error) {
    console.error('Fehler beim Abrufen der Tickets:', error);
    res.status(500).json({ error: 'Datenbank-Fehler bei Tickets' });
  }
});

// B) Ein neues Ticket erstellen (wichtig für das Frontend-Formular später)
app.post('/api/tickets', async (req, res) => {
  const { title, description, created_by } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO tickets (title, description, created_by) VALUES (?, ?, ?)',
      [title, description, created_by]
    );
    res.status(201).json({ message: 'Ticket erfolgreich erstellt!', ticketId: result.insertId });
  } catch (error) {
    console.error('Fehler beim Erstellen des Tickets:', error);
    res.status(500).json({ error: 'Ticket konnte nicht erstellt werden' });
  }
});

// SERVER STARTEN
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
});