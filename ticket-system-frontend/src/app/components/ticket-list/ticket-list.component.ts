import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { TicketService } from '../../services/ticket';
import { AuthService } from '../../services/auth.service'; // 1. SCHRITT: AuthService Importieren!
import { Ticket, TicketComment } from '../../models/ticket.model'; 

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.css'
})
export class TicketListComponent implements OnInit {
  tickets: Ticket[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  // 1. NEUE VARIABLEN HINZUFÜGEN:
  availableUsers: any[] = [];
  selectedUser: any = null;

  newComments: { [ticketId: number]: string } = {};
  ticketComments: { [ticketId: number]: TicketComment[] } = {};

  // 2. SCHRITT: Den AuthService im Constructor injizieren!
  constructor(
    private ticketService: TicketService,
    private authService: AuthService 
  ) {}

ngOnInit(): void {
    this.fetchTickets();
    
    // NEU: Lädt alle Benutzer beim Starten der Seite
    this.authService.getAvailableUsers().subscribe({
      next: (users) => this.availableUsers = users,
      error: (err) => console.error('Fehler beim Laden der User:', err)
    });

    // NEU: Hört darauf, welcher User aktuell ausgewählt ist
    this.authService.currentUser$.subscribe(user => {
      this.selectedUser = user;
    });
  }

  fetchTickets(): void {
    this.ticketService.getTickets().subscribe({
      next: (data: Ticket[]) => {
        this.tickets = data;
        this.isLoading = false;

        this.tickets.forEach(ticket => {
          if (ticket.id) {
            this.loadComments(ticket.id);
          }
        });
      },
      error: (error: any) => {
        console.error('Error fetching tickets:', error);
        this.errorMessage = 'Could not load tickets. Please check if the backend is running.';
        this.isLoading = false;
      }
    });
  }

  loadComments(ticketId: number): void {
    this.ticketService.getComments(ticketId).subscribe({
      next: (comments: TicketComment[]) => {
        this.ticketComments[ticketId] = comments;
      },
      error: (err: any) => console.error(`Failed to load comments...`)
    });
  }

  // 3. SCHRITT: Die ID des echten angemeldeten Benutzers nutzen!
  onSubmitComment(ticketId: number): void {
    const text = this.newComments[ticketId]?.trim();
    if (!text) return;

    // Hol dir den aktuellen User aus dem Service
    const currentUser = this.authService.getCurrentUserValue();

    // Sicherheitsprüfung: Nur kommentieren, wenn eingeloggt
    if (!currentUser) {
      alert('Bitte logge dich zuerst ein, um einen Kommentar zu schreiben!');
      return;
    }

    // Wir übergeben jetzt die echte ID (currentUser.id) statt der festen 1!
    this.ticketService.addComment(ticketId, text, currentUser.id).subscribe({
      next: (newComment: TicketComment) => {
        if (!this.ticketComments[ticketId]) {
          this.ticketComments[ticketId] = [];
        }
        this.ticketComments[ticketId].push(newComment);
        this.newComments[ticketId] = '';
      },
      error: (err) => {
        console.error('Error posting comment:', err);
        alert('Failed to post comment. Check your server logs.');
      }
    });
  }

  onStatusChange(ticket: Ticket, newStatus: 'OFFEN' | 'IN_BEARBEITUNG' | 'GESCHLOSSEN'): void {
    if (!ticket.id) return;

    this.ticketService.updateTicketStatus(ticket.id, newStatus).subscribe({
      next: (updatedTicket: Ticket) => {
        console.log('Ticket status updated successfully:', updatedTicket);
        ticket.status = newStatus;
      },
      error: (error: any) => {
        console.error('Error updating ticket status:', error);
        alert('Failed to update status. Please check your backend route.');
        this.fetchTickets(); 
      }
    });
  }

  onDeleteTicket(id: number): void {
    if (confirm('Are you sure you want to delete this ticket?')) {
      this.ticketService.deleteTicket(id).subscribe({
        next: () => {
          this.tickets = this.tickets.filter(ticket => ticket.id !== id);
        },
        error: (err: any) => { 
          console.error('Error deleting ticket:', err);
          alert('Failed to delete ticket.');
        }
      });
      
    }
    
  }
  // NEU: Wird aufgerufen, wenn du im Dropdown einen anderen User auswählst
  onUserChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const username = selectElement.value;
    
    if (username) {
      this.authService.login(username).subscribe({
        error: (err) => alert('Login fehlgeschlagen!')
      });
    } else {
      this.authService.logout();
    }
  }
}