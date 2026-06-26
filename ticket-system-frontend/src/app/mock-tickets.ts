// src/app/mock-tickets.ts
import { Ticket } from './ticket.model';

export const MOCK_TICKETS: Ticket[] = [
  {
    id: 'ticket-1',
    title: 'Drucker im 2. OG streikt',
    description: 'Der Drucker zieht kein Papier mehr ein und zeigt Fehler-Code E04.',
    status: 'OPEN',
    createdBy: 'MaxMustermann',
    createdAt: new Date('2026-06-25T10:00:00')
  },
  {
    id: 'ticket-2',
    title: 'Passwort-Reset für CRM',
    description: 'Ich habe mein Passwort dreimal falsch eingegeben. Bitte entsperren.',
    status: 'IN_PROGRESS',
    createdBy: 'LisaMüller',
    assignedTo: 'Agent_Schmidt',
    createdAt: new Date('2026-06-25T11:30:00')
  },
  {
    id: 'ticket-3',
    title: 'Neuer Laptop für Onboarding',
    description: 'Für den neuen Kollegen im Marketing wird ein MacBook Pro benötigt.',
    status: 'RESOLVED',
    createdBy: 'Admin_Chef',
    assignedTo: 'Agent_Schmidt',
    createdAt: new Date('2026-06-24T09:00:00')
  }
];