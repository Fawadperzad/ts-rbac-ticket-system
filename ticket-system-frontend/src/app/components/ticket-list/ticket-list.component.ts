import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { type Comment, type Ticket, type User } from '../../models/ticket.model';
import { TicketService } from '../../services/ticket';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit {
  tickets: Ticket[] = [];
  availableUsers: User[] = [
    { id: 1, username: 'admin_max', email: 'admin@example.com', role: 'ADMIN' },
    { id: 2, username: 'agent_julia', email: 'agent@example.com', role: 'AGENT' },
    { id: 3, username: 'user_oliver', email: 'user@example.com', role: 'USER' }
  ];
  selectedUser: User | null = null;
  isLoading = true;
  errorMessage = '';
  ticketComments: Record<number, Comment[]> = {};
  newComments: Record<number, string> = {};

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  onUserChange(event: Event): void {
    const selectedUsername = (event.target as HTMLSelectElement | null)?.value ?? '';
    this.selectedUser = this.availableUsers.find((user) => user.username === selectedUsername) || null;
  }

  loadTickets(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.ticketService.getTickets().subscribe({
      next: (data: Ticket[]) => {
        this.tickets = data;
        this.isLoading = false;

        this.tickets.forEach((ticket) => {
          if (ticket.id !== undefined) {
            this.loadComments(ticket.id);
          }
        });
      },
      error: (err: any) => {
        console.error('Fehler beim Laden:', err);
        this.errorMessage = 'Tickets konnten nicht geladen werden.';
        this.isLoading = false;
      }
    });
  }

  loadComments(ticketId: number): void {
    this.ticketService.getComments(ticketId).subscribe({
      next: (comments: Comment[]) => {
        this.ticketComments[ticketId] = comments;
      },
      error: (err: any) => {
        console.error('Fehler beim Laden der Kommentare:', err);
      }
    });
  }

  onStatusChange(ticket: Ticket, newStatus: string): void {
    if (!ticket.id) return;

    this.ticketService.updateTicketStatus(ticket.id, newStatus).subscribe({
      next: (updatedTicket: { status?: string }) => {
        if (updatedTicket.status) {
          ticket.status = updatedTicket.status as Ticket['status'];
        }
      },
      error: (err: any) => {
        console.error('Fehler beim Ändern des Status:', err);
        alert('Der Status konnte nicht aktualisiert werden.');
      }
    });
  }

  onDeleteTicket(ticketId: number | undefined): void {
    if (!ticketId) {
      console.error('Ticket ID fehlt.');
      return;
    }

    if (confirm('Möchtest du dieses Ticket wirklich dauerhaft löschen?')) {
      this.ticketService.deleteTicket(ticketId).subscribe({
        next: () => {
          this.tickets = this.tickets.filter((ticket) => ticket.id !== ticketId);
          delete this.ticketComments[ticketId];
        },
        error: (err: any) => {
          console.error('Fehler beim Löschen des Tickets:', err);
          alert('Das Ticket konnte nicht gelöscht werden.');
        }
      });
    }
  }

  onSubmitComment(ticketId: number): void {
    const commentText = (this.newComments[ticketId] || '').trim();

    if (!commentText || !this.selectedUser?.id) {
      return;
    }

    this.ticketService.addComment(ticketId, commentText, this.selectedUser.id).subscribe({
      next: (comment: Comment) => {
        this.ticketComments[ticketId] = [...(this.ticketComments[ticketId] || []), comment];
        this.newComments[ticketId] = '';
      },
      error: (err: any) => {
        console.error('Fehler beim Speichern des Kommentars:', err);
        alert('Der Kommentar konnte nicht gespeichert werden.');
      }
    });
  }
}