// src/app/ticket.model.ts

export type Role = 'USER' | 'AGENT' | 'ADMIN';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface Ticket {
  id?: string;             // 1. Optional machen (wird oft von der DB generiert)
  title: string;
  description: string;
  status: TicketStatus;
  createdBy: string;
  assignedTo?: string;
  createdAt?: string | Date; // 2. string zulassen (da JSON keine echten Date-Objekte sendet)
}