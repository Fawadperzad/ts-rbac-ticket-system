import { TicketSystem } from './TicketSystem.js'; // .js Erweiterung hinzugefügt
import type { User } from './models.js';          /* 'type' hinzugefügt & .js Endung */

async function runSimulation() {
    console.log("=== 🚀 Initialisiere Ticketsystem ===");
    const system = new TicketSystem();

    // 1. Admin-Instanz holen
    const admin: User = { id: 'admin-1', username: 'SuperAdmin', role: 'ADMIN' };

    // 2. Admin legt neue Benutzer an
    console.log("\n[Admin] Erstelle Benutzer...");
    const kundenUser = system.createUser(admin, 'MaxMustermann', 'USER');
    const supportAgent = system.createUser(admin, 'Agent_Schmidt', 'AGENT');

    // 3. User erstellt ein Ticket
    console.log("\n[User] Erstelle ein technisches Ticket...");
    const ticket = system.createTicket(kundenUser, 'Login geht nicht', 'Fehlercode 403 beim Login-Versuch.');
    console.log(`Ticket erstellt: ID ${ticket.id} | Status: ${ticket.status}`);

    // 4. Sichtbarkeitsprüfung
    console.log(`\n[Prüfung] Tickets sichtbar für Max (User): ${system.getTickets(kundenUser).length}`);
    console.log(`[Prüfung] Tickets sichtbar für Agent Schmidt: ${system.getTickets(supportAgent).length}`);

    // 5. Rechte-Sicherheitscheck: User versucht Status zu ändern (Sollte fehlschlagen)
    try {
        console.log("\n[Sicherheitstest] User versucht Status illegal zu ändern...");
        system.changeTicketStatus(kundenUser, ticket.id, 'IN_PROGRESS');
    } catch (error: any) {
        console.log(`❌ Abgewiesen wie erwartet: ${error.message}`);
    }

    // 6. Agent bearbeitet das Ticket
    console.log("\n[Agent] Bearbeite Ticket und hinterlasse Kommentar...");
    system.changeTicketStatus(supportAgent, ticket.id, 'IN_PROGRESS');
    system.addComment(supportAgent, ticket.id, 'Ich schaue mir die Server-Logs an.');

    // 7. Admin ändert Rollen & prüft Logs
    console.log("\n[Admin] Ändere Systemeinstellungen und sichte Audit-Logs...");
    system.updateSystemSettings(admin, { maintenanceMode: true });

    const logs = system.viewAuditLogs(admin);
    console.log(`Generierte Audit-Logs (${logs.length}):`);
    logs.forEach(l => console.log(` - [${l.action}] ${l.details}`));
}

runSimulation();