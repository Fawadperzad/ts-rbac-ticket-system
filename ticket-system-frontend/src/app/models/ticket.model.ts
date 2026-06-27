// Bestehendes Interface (Beispiel)
export interface Ticket {
  id?: number;
  title: string;
  description: string;
  status: 'OFFEN' | 'IN_BEARBEITUNG' | 'GESCHLOSSEN';
  // ... restliche Felder
  created_by?: number; // 👈 Dieses Feld als optional (?) hinzufügen
  assigned_to?: number;
  created_at?: string;
}

// ERGÄNZUNG: Füge dieses Interface unten hinzu
export interface TicketComment {
  id?: number;
  ticket_id: number;
  comment_text: string;
  created_by: number;
  created_at?: string;
}