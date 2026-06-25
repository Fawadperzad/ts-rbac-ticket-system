import type { User, Ticket, Comment, AuditLog, Role, TicketStatus } from './models.js';export class TicketSystem {
    private users: Map<string, User> = new Map();
    private tickets: Map<string, Ticket> = new Map();
    private auditLogs: AuditLog[] = [];
    private systemSettings: Record<string, any> = { maintenanceMode: false };

    constructor() {
        // Standard-Admin initialisieren
        this.users.set('admin-1', { id: 'admin-1', username: 'SuperAdmin', role: 'ADMIN' });
    }

    // --- HILFSMETHODEN ---
    private logAction(userId: string, action: string, details: string): void {
        const log: AuditLog = {
            id: `log-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(),
            userId,
            action,
            details
        };
        this.auditLogs.push(log);
    }

    private checkPermission(user: User, allowedRoles: Role[]): void {
        if (!allowedRoles.includes(user.role)) {
            throw new Error(`Zugriff verweigert: Rolle ${user.role} hat keine Berechtigung für diese Aktion.`);
        }
    }

    // --- USER ACTIONS ---
    public createTicket(actor: User, title: string, description: string): Ticket {
        // Jeder darf Tickets erstellen (USER, AGENT, ADMIN)
        this.checkPermission(actor, ['USER', 'AGENT', 'ADMIN']);

        const newTicket: Ticket = {
            id: `ticket-${Math.random().toString(36).substr(2, 9)}`,
            title,
            description,
            status: 'OPEN',
            creatorId: actor.id,
            comments: [],
            createdAt: new Date()
        };

        this.tickets.set(newTicket.id, newTicket);
        return newTicket;
    }

    public getTickets(actor: User): Ticket[] {
        // USER sieht nur eigene, AGENT/ADMIN sehen alle
        if (actor.role === 'USER') {
            return Array.from(this.tickets.values()).filter(t => t.creatorId === actor.id);
        }
        return Array.from(this.tickets.values());
    }

    // --- AGENT & ADMIN ACTIONS ---
    public changeTicketStatus(actor: User, ticketId: string, newStatus: TicketStatus): Ticket {
        this.checkPermission(actor, ['AGENT', 'ADMIN']);
        
        const ticket = this.tickets.get(ticketId);
        if (!ticket) throw new Error('Ticket nicht gefunden');

        ticket.status = newStatus;
        if (actor.role === 'AGENT' && !ticket.assignedAgentId) {
            ticket.assignedAgentId = actor.id; // Automatisch dem Agenten zuweisen
        }

        return ticket;
    }

    public addComment(actor: User, ticketId: string, text: string): Comment {
        this.checkPermission(actor, ['AGENT', 'ADMIN']);

        const ticket = this.tickets.get(ticketId);
        if (!ticket) throw new Error('Ticket nicht gefunden');

        const newComment: Comment = {
            id: `comment-${Math.random().toString(36).substr(2, 9)}`,
            authorId: actor.id,
            text,
            createdAt: new Date()
        };

        ticket.comments.push(newComment);
        return newComment;
    }

    // --- ADMIN ONLY ACTIONS ---
    public createUser(actor: User, username: string, role: Role): User {
        this.checkPermission(actor, ['ADMIN']);

        const newUser: User = {
            id: `user-${Math.random().toString(36).substr(2, 9)}`,
            username,
            role
        };

        this.users.set(newUser.id, newUser);
        this.logAction(actor.id, 'USER_CREATE', `Benutzer ${username} mit Rolle ${role} erstellt.`);
        return newUser;
    }

    public updateUserRole(actor: User, targetUserId: string, newRole: Role): User {
        this.checkPermission(actor, ['ADMIN']);

        const targetUser = this.users.get(targetUserId);
        if (!targetUser) throw new Error('Zielbenutzer nicht gefunden');

        const oldRole = targetUser.role;
        targetUser.role = newRole;

        this.logAction(actor.id, 'ROLE_CHANGE', `Rolle von User ${targetUser.username} von ${oldRole} zu ${newRole} geändert.`);
        return targetUser;
    }

    public viewAuditLogs(actor: User): AuditLog[] {
        this.checkPermission(actor, ['ADMIN']);
        return [...this.auditLogs];
    }

    public updateSystemSettings(actor: User, settings: Record<string, any>): void {
        this.checkPermission(actor, ['ADMIN']);
        this.systemSettings = { ...this.systemSettings, ...settings };
        this.logAction(actor.id, 'SYSTEM_SETTING_CHANGE', `Einstellungen aktualisiert: ${JSON.stringify(settings)}`);
    }
}