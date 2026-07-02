import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { type Comment, type Ticket } from '../../models/ticket.model';
import { TicketService } from '../../services/ticket';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit {
  tickets: Ticket[] = [];
  isLoading = true;
  errorMessage = '';
  ticketComments: Record<number, Comment[]> = {};
  newComments: Record<number, string> = {};

  get currentUser() {
    return this.auth.getUser();
  }

  constructor(private ticketService: TicketService, private auth: AuthService) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.ticketService.getTickets().subscribe({
      next: (data: Ticket[]) => {
        this.tickets = data;
        this.isLoading = false;
        this.tickets.forEach(ticket => {
          if (ticket.id !== undefined) this.loadComments(ticket.id);
        });
      },
      error: () => {
        this.errorMessage = 'Tickets konnten nicht geladen werden.';
        this.isLoading = false;
      }
    });
  }

  loadComments(ticketId: number): void {
    this.ticketService.getComments(ticketId).subscribe({
      next: (comments: Comment[]) => { this.ticketComments[ticketId] = comments; },
      error: (err: any) => console.error('Fehler beim Laden der Kommentare:', err)
    });
  }

  onStatusChange(ticket: Ticket, newStatus: string): void {
    if (!ticket.id) return;
    this.ticketService.updateTicketStatus(ticket.id, newStatus).subscribe({
      next: (updated: { status?: string }) => {
        if (updated.status) ticket.status = updated.status as Ticket['status'];
      },
      error: () => alert('Der Status konnte nicht aktualisiert werden.')
    });
  }

  onDeleteTicket(ticketId: number | undefined): void {
    if (!ticketId || !confirm('Möchtest du dieses Ticket wirklich dauerhaft löschen?')) return;
    this.ticketService.deleteTicket(ticketId).subscribe({
      next: () => {
        this.tickets = this.tickets.filter(t => t.id !== ticketId);
        delete this.ticketComments[ticketId];
      },
      error: () => alert('Das Ticket konnte nicht gelöscht werden.')
    });
  }

  onSubmitComment(ticketId: number): void {
    const commentText = (this.newComments[ticketId] || '').trim();
    if (!commentText || !this.currentUser?.id) return;
    this.ticketService.addComment(ticketId, commentText, this.currentUser.id).subscribe({
      next: (comment: Comment) => {
        this.ticketComments[ticketId] = [...(this.ticketComments[ticketId] || []), comment];
        this.newComments[ticketId] = '';
      },
      error: () => alert('Der Kommentar konnte nicht gespeichert werden.')
    });
  }
}
