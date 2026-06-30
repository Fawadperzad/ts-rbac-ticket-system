export interface User {
  id: number;
  username: string;
  email: string;
  role: 'USER' | 'AGENT' | 'ADMIN';
}

export interface Ticket {
  id?: number; // Optional beim Erstellen, da die DB die ID vergibt
  title: string;
  description: string;
  status: 'OFFEN' | 'IN_BEARBEITUNG' | 'GESCHLOSSEN';
  created_by: number;
  assigned_to?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface Comment {
  id?: number;
  ticket_id: number;
  comment_text: string;
  created_by: number;
  username?: string; // Wird vom Backend per JOIN für die Anzeige mitgegeben
  created_at?: string;
}