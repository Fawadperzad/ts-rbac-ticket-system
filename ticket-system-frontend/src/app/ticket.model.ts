// src/app/ticket.model.ts

export type Role = 'USER' | 'AGENT' | 'ADMIN';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  createdBy: string;
  assignedTo?: string;
  createdAt: Date;
}