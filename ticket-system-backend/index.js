import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express(); // 👈 Fixed: 'app' is properly initialized here!
const PORT = 3000;

// MIDDLEWARES
app.use(cors()); 
app.use(express.json()); 

// 1. HOME ROUTE
app.get('/', (req, res) => {
  res.send('<h1>Das Backend des Ticket-Systems läuft! 🎉</h1>');
});

// 2. USER ROUTE
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, username, email, role FROM users');
    res.json(rows);
  } catch (error) {
    console.error('Fehler bei Usern:', error);
    res.status(500).json({ error: 'Datenbank-Fehler' });
  }
});

// 3. TICKET ROUTES

// A) Get all tickets
app.get('/api/tickets', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tickets');
    res.json(rows);
  } catch (error) {
    console.error('Fehler bei Tickets:', error);
    res.status(500).json({ error: 'Datenbank-Fehler' });
  }
});

// B) Create a new ticket
app.post('/api/tickets', async (req, res) => {
  const { title, description, created_by } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO tickets (title, description, created_by) VALUES (?, ?, ?)',
      [title, description, created_by]
    );
    res.status(201).json({ message: 'Ticket erstellt!', ticketId: result.insertId });
  } catch (error) {
    console.error('Fehler beim Erstellen:', error);
    res.status(500).json({ error: 'Fehler beim Erstellen' });
  }
});

// C) UPDATE ticket status (With lowercase conversion for MySQL ENUM)
// C) UPDATE ticket status (The "No-More-MySQL-Errors" Version)
app.put('/api/tickets/:id', async (req, res) => {
  const ticketId = parseInt(req.params.id, 10);
  let { status } = req.body; 

  if (isNaN(ticketId) || !status) {
    return res.status(400).json({ error: 'Invalid ID or missing status' });
  }

  try {
    // Try forcing UPPERCASE first ('ERLEDIGT')
    const uppercaseStatus = status.toUpperCase();
    
    // We try to update with UPPERCASE first
    const [result] = await db.query(
      'UPDATE tickets SET status = ? WHERE id = ?',
      [uppercaseStatus, ticketId]
    );

    return res.json({ message: 'Status updated successfully', id: ticketId, status: uppercaseStatus });

  } catch (error) {
    // If UPPERCASE fails with a truncation error, try lowercase ('erledigt')
    if (error.code === 'WARN_DATA_TRUNCATED' || error.errno === 1265) {
      try {
        const lowercaseStatus = status.toLowerCase();
        await db.query(
          'UPDATE tickets SET status = ? WHERE id = ?',
          [lowercaseStatus, ticketId]
        );
        return res.json({ message: 'Status updated successfully (fallback)', id: ticketId, status: lowercaseStatus });
      } catch (innerError) {
        console.error('Beide Formate (Groß/Klein) sind in MySQL fehlgeschlagen:', innerError);
        return res.status(500).json({ error: 'Datenbank akzeptiert den Status-Wert nicht.' });
      }
    }
    
    console.error('Anderer Datenbank-Fehler:', error);
    res.status(500).json({ error: 'Status konnte nicht aktualisiert werden' });
  }
});

// SERVER START
// ... Dein restlicher Code (Routen A, B, C) bleibt genau so ...

// SERVER START
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
});

// 🔍 INSERT THIS TEST CODE HERE AT THE VERY BOTTOM:
// You can safely delete this block to stop the printout:
/*db.query("SHOW COLUMNS FROM tickets LIKE 'status'")
  .then(([rows]) => {
    if (rows && rows.length > 0) {
      console.log("👉 ALLOWED STATUS VALUES IN MYSQL:", rows[0].Type);
    }
  })
  .catch(err => {});*/