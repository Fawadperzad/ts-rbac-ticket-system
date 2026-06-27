export interface Ticket {
  id?: number;
  title: string;
  description: string;
  status: 'OFFEN' | 'IN_BEARBEITUNG' | 'ERLEDIGT';
  created_by: number;
  assigned_to?: number;
  created_at?: string;
  updated_at?: string;
}