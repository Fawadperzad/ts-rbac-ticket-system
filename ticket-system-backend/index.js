import express from 'express';
import cors from 'cors';
import db from './db.js'; // 👈 This handles your MySQL configuration perfectly!

const app = express();
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

// ==========================================
// B-1) ROUTE: KOMMENTAR ERSTELLEN (Dein funktionierender Code)
// ==========================================
app.post('/api/tickets/:id/comments', async (req, res) => {
  const ticketId = parseInt(req.params.id, 10);
  const { comment_text, created_by } = req.body; 

  if (isNaN(ticketId) || !comment_text) {
    return res.status(400).json({ error: 'Comment text and a valid Ticket ID are required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO ticket_comments (ticket_id, comment_text, created_by) VALUES (?, ?, ?)',
      [ticketId, comment_text, created_by || 1]
    );
    
    const [newComment] = await db.query(
      'SELECT * FROM ticket_comments WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newComment[0]);
  } catch (err) {
    console.error('Database Error:', err);
    res.status(500).json({ error: 'Failed to insert comment into database' });
  }
});

// ==========================================
// B-2) NEUE ROUTE: TICKET ERSTELLEN (Hier haben wir auch die "?" eingebaut!)
// ==========================================
app.post('/api/tickets', async (req, res) => {
  const { title, description, status, created_by } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  try {
    // Hier nutzen wir auch die korrekten "?" Platzhalter für MySQL
    const [result] = await db.query(
      'INSERT INTO tickets (title, description, status, created_by) VALUES (?, ?, ?, ?)',
      [title, description, status || 'OFFEN', created_by || 1] 
    );

    const [newTicket] = await db.query(
      'SELECT * FROM tickets WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newTicket[0]);
  } catch (error) {
    console.error('❌ Database error during ticket creation:', error);
    res.status(500).json({ error: 'Failed to create ticket in database' });
  }
});

// C) UPDATE ticket status
app.put('/api/tickets/:id', async (req, res) => {
  const ticketId = parseInt(req.params.id, 10);
  let { status } = req.body; 

  if (isNaN(ticketId) || !status) {
    return res.status(400).json({ error: 'Invalid ID or missing status' });
  }

  try {
    const uppercaseStatus = status.toUpperCase();
    await db.query(
      'UPDATE tickets SET status = ? WHERE id = ?',
      [uppercaseStatus, ticketId]
    );
    return res.json({ message: 'Status updated successfully', id: ticketId, status: uppercaseStatus });
  } catch (error) {
    if (error.code === 'WARN_DATA_TRUNCATED' || error.errno === 1265) {
      try {
        const lowercaseStatus = status.toLowerCase();
        await db.query(
          'UPDATE tickets SET status = ? WHERE id = ?',
          [lowercaseStatus, ticketId]
        );
        return res.json({ message: 'Status updated successfully (fallback)', id: ticketId, status: lowercaseStatus });
      } catch (innerError) {
        console.error('Beide Formate sind fehlgeschlagen:', innerError);
        return res.status(500).json({ error: 'Datenbank akzeptiert den Status-Wert nicht.' });
      }
    }
    console.error('Anderer Datenbank-Fehler:', error);
    res.status(500).json({ error: 'Status konnte nicht aktualisiert werden' });
  }
});

// D) DELETE a ticket
app.delete('/api/tickets/:id', async (req, res) => {
  const ticketId = parseInt(req.params.id, 10);

  if (isNaN(ticketId)) {
    return res.status(400).json({ error: 'Invalid ticket ID provided' });
  }

  try {
    const [result] = await db.query('DELETE FROM tickets WHERE id = ?', [ticketId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    return res.json({ message: 'Ticket deleted successfully', id: ticketId });
  } catch (error) {
    console.error('❌ Database error during ticket deletion:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// SERVER START
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
});