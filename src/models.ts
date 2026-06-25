// Enums für Rollen und Ticket-Status
export type Role = 'USER' | 'AGENT' | 'ADMIN';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface User {
    id: string;
    username: string;
    role: Role;
}

export interface Comment {
    id: string;
    authorId: string;
    text: string;
    createdAt: Date;
}

export interface Ticket {
    id: string;
    title: string;
    description: string;
    status: TicketStatus;
    creatorId: string;
    assignedAgentId?: string;
    comments: Comment[];
    createdAt: Date;
}

export interface AuditLog {
    id: string;
    timestamp: Date;
    userId: string;
    action: string;
    details: string;
}