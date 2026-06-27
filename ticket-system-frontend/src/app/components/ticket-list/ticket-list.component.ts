import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 👈 1. Import FormsModule here for template binding
import { TicketService } from '../../services/ticket'; 
import { Ticket } from '../../models/ticket.model'; 

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, FormsModule], // 👈 2. Add FormsModule to imports array
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.css'
})
export class TicketListComponent implements OnInit {
  tickets: Ticket[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.fetchTickets();
  }

  fetchTickets(): void {
    this.ticketService.getTickets().subscribe({
      next: (data: Ticket[]) => {
        this.tickets = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error fetching tickets:', error);
        this.errorMessage = 'Could not load tickets. Please check if the backend is running.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Triggers when the user changes the select dropdown value
   * @param ticket The ticket object being modified
   * @param newStatus The value from the select element
   */
  onStatusChange(ticket: Ticket, newStatus: any): void {
    if (!ticket.id) return;

    this.ticketService.updateTicketStatus(ticket.id, newStatus).subscribe({
      next: (updatedTicket) => {
        console.log('Ticket status updated successfully:', updatedTicket);
        // Refresh the local data to dynamically update the CSS classes/colors
        ticket.status = newStatus;
      },
      error: (error: any) => {
        console.error('Error updating ticket status:', error);
        alert('Failed to update status. Please check your backend route.');
        // Revert to database state if it fails
        this.fetchTickets();
      }
    });
  }

  // Handles the deletion of a ticket after user confirmation
onDeleteTicket(id: number): void {
  // Ask the user for confirmation before permanently deleting the ticket
  if (confirm('Are you sure you want to delete this ticket?')) {
    this.ticketService.deleteTicket(id).subscribe({
      next: () => {
        // Filter out the deleted ticket from the local array to update the UI instantly
        this.tickets = this.tickets.filter(ticket => ticket.id !== id);
      },
      error: (err) => {
        console.error('Failed to delete ticket:', err);
        alert('An error occurred while trying to delete the ticket.');
      }
    });
  }
}
}