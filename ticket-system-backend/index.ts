import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import db from './db.js';

// Interfaces für Typensicherheit deklarieren
interface User extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  role: 'USER' | 'AGENT' | 'ADMIN';
}

interface Ticket extends RowDataPacket {
  id?: number;
  title: string;
  description: string;
  status: 'OFFEN' | 'IN_BEARBEITUNG' | 'GESCHLOSSEN';
  created_by: number;
}

interface Comment extends RowDataPacket {
  id: number;
  ticket_id: number;
  comment_text: string;
  created_by: number;
  created_at: string;
  username?: string; // Für den JOIN beim Auslesen der Kommentare
}

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// 1. HOME ROUTE
app.get('/', (req: Request, res: Response) => {
  res.send('Das Backend des Ticket-Systems läuft stabil auf TypeScript! 🚀');
});

// ==========================================
// 2. USER ROUTES
// ==========================================

// A) Alle Benutzer abrufen
app.get('/api/users', async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query<User[]>('SELECT id, username, email, role FROM users');
    res.json(rows);
  } catch (error) {
    console.error('❌ Fehler beim Laden der Benutzer:', error);
    res.status(500).json({ error: 'Datenbank-Fehler' });
  }
});

// B) Mock Login
app.post('/api/login', async (req: Request, res: Response) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }
  try {
    const [rows] = await db.query<User[]>('SELECT id, username, role FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('❌ Login Fehler:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ==========================================
// 3. TICKET ROUTES
// ==========================================

// A) Alle Tickets holen
app.get('/api/tickets', async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query<Ticket[]>('SELECT * FROM tickets ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error('Fehler bei Tickets:', error);
    res.status(500).json({ error: 'Datenbank-Fehler' });
  }
});

// B) Ticket erstellen
app.post('/api/tickets', async (req: Request, res: Response) => {
  const { title, description, status, created_by } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }
  try {
    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO tickets (title, description, status, created_by) VALUES (?, ?, ?, ?)',
      [title, description, status || 'OFFEN', created_by || 1]
    );

    const [newTicket] = await db.query<Ticket[]>('SELECT * FROM tickets WHERE id = ?', [result.insertId]);
    res.status(201).json(newTicket[0]);
  } catch (error) {
    console.error('❌ Database error during ticket creation:', error);
    res.status(500).json({ error: 'Failed to create ticket in database' });
  }
});

// C) Ticket-Status aktualisieren (Für Agenten & Admins)
app.put('/api/tickets/:id', async (req: Request, res: Response) => {
  const ticketId = req.params.id;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status ist erforderlich' });
  }

  try {
    const [result] = await db.query<ResultSetHeader>(
      'UPDATE tickets SET status = ? WHERE id = ?',
      [status.toUpperCase(), ticketId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ticket nicht gefunden' });
    }

    res.json({ message: `Ticket-Status erfolgreich auf ${status} aktualisiert`, ticketId, status });
  } catch (err) {
    console.error('Datenbankfehler beim Status-Update:', err);
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Ticket-Status' });
  }
});

// ==========================================
// 4. COMMENT ROUTES
// ==========================================

// A) Kommentare für ein bestimmtes Ticket abrufen
app.get('/api/tickets/:id/comments', async (req: Request, res: Response) => {
  const ticketId = req.params.id;

  try {
    const [comments] = await db.query<Comment[]>(
      `SELECT c.*, u.username FROM comments c 
       JOIN users u ON c.created_by = u.id 
       WHERE c.ticket_id = ? 
       ORDER BY c.created_at ASC`,
      [ticketId]
    );

    res.json(comments);
  } catch (err) {
    console.error('Datenbankfehler beim Laden der Kommentare:', err);
    res.status(500).json({ error: 'Fehler beim Laden des Kommentarverlaufs' });
  }
});

// B) Neuen Kommentar zu einem Ticket hinzufügen
app.post('/api/tickets/:id/comments', async (req: Request, res: Response) => {
  const ticketId = req.params.id;
  const { comment_text, created_by } = req.body;

  if (!comment_text || !created_by) {
    return res.status(400).json({ error: 'Kommentartext und Absender-ID sind erforderlich' });
  }

  try {
    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO comments (ticket_id, comment_text, created_by) VALUES (?, ?, ?)',
      [ticketId, comment_text, created_by]
    );

    // Den frisch erstellten Kommentar inklusive Benutzernamen zurückgeben
    const [newComment] = await db.query<Comment[]>(
      `SELECT c.*, u.username FROM comments c 
       JOIN users u ON c.created_by = u.id 
       WHERE c.id = ?`,
      [result.insertId]
    );

    res.status(201).json(newComment[0]);
  } catch (err) {
    console.error('Datenbankfehler beim Erstellen des Kommentars:', err);
    res.status(500).json({ error: 'Fehler beim Speichern des Kommentars' });
  }
});

// D) Ticket löschen
app.delete('/api/tickets/:id', async (req: Request, res: Response) => {
  const ticketId = req.params.id;

  try {
    await db.query('DELETE FROM comments WHERE ticket_id = ?', [ticketId]);
    const [result] = await db.query<ResultSetHeader>('DELETE FROM tickets WHERE id = ?', [ticketId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ticket nicht gefunden' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('Datenbankfehler beim Löschen des Tickets:', err);
    res.status(500).json({ error: 'Fehler beim Löschen des Tickets' });
  }
});

// SERVER START
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
});