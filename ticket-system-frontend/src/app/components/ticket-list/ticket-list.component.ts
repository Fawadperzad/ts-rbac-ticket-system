import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Kann entfernt werden, falls keine Pipes genutzt werden
import { FormsModule } from '@angular/forms'; 
import { TicketService } from '../../services/ticket';
import { Ticket, TicketComment } from '../../models/ticket.model'; // 👈 Beide aus derselben Datei importiert

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

  // Speichert aktuelle Texteingaben für Kommentare, indiziert nach Ticket-ID
  newComments: { [ticketId: number]: string } = {};

  // Speichert Arrays geladener Kommentare, indiziert nach Ticket-ID
  ticketComments: { [ticketId: number]: TicketComment[] } = {};

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.fetchTickets();
  }

  fetchTickets(): void {
    this.ticketService.getTickets().subscribe({
      next: (data: Ticket[]) => {
        this.tickets = data;
        this.isLoading = false;

        // Automatisch Kommentare für jedes geladene Ticket abrufen
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

  // Holt Kommentare für ein bestimmtes Ticket und speichert sie lokal
  loadComments(ticketId: number): void {
    this.ticketService.getComments(ticketId).subscribe({
      next: (comments: TicketComment[]) => {
        this.ticketComments[ticketId] = comments;
      },
      error: (err: any) => console.error(`Failed to load comments...`)
    });
  }

  // Übermittelt einen neuen Kommentar
  onSubmitComment(ticketId: number): void {
    const text = this.newComments[ticketId]?.trim();
    if (!text) return;

    // Statische Agenten-ID 1, bis ein Login-System implementiert ist
    const mockAgentId = 1; 

    this.ticketService.addComment(ticketId, text, mockAgentId).subscribe({
      next: (newComment: TicketComment) => {
        if (!this.ticketComments[ticketId]) {
          this.ticketComments[ticketId] = [];
        }
        // Den neuen Kommentar sofort in die Timeline pushen
        this.ticketComments[ticketId].push(newComment);
        
        // Das Eingabefeld leeren
        this.newComments[ticketId] = '';
        
      },
      error: (err) => {
        console.error('Error posting comment:', err);
        alert('Failed to post comment. Check your server logs.');
      }
    });
  }

  /**
   * KORREKTUR: Typen-Sicherheit für das Status-Update hergestellt
   */
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
        this.fetchTickets(); // Bei Fehler Zustand aus DB neu laden
      }
    });
  }

  onDeleteTicket(id: number): void {
    if (confirm('Are you sure you want to delete this ticket?')) {
      this.ticketService.deleteTicket(id).subscribe({
        next: () => {
          this.tickets = this.tickets.filter(ticket => ticket.id !== id);
        },
       error: (err: any) => { // 👈 ': any' hinzugefügt
  console.error('Error posting comment:', err);
  alert('Failed to post comment. Check your server logs.');
}
      });
    }
  }
}