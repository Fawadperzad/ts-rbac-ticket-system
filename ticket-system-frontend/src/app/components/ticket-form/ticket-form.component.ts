import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket';
import { Ticket } from '../../models/ticket.model';

@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-form.component.html',
  styleUrl: './ticket-form.component.css'
})
export class TicketFormComponent {
  // Event to notify the parent (AppComponent) that a new ticket was successfully created
  @Output() ticketCreated = new EventEmitter<void>();

  // Temporary model for the form data
  newTicket: Ticket = {
    title: '',
    description: '',
    status: 'OFFEN',
    created_by: 3 // Hardcoded user ID for now until you have an auth system
  };

  isSubmitting = false;
  errorMessage = '';

  constructor(private ticketService: TicketService) {}

  onSubmit(): void {
    if (!this.newTicket.title || !this.newTicket.description) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.ticketService.createTicket(this.newTicket).subscribe({
      next: () => {
        this.isSubmitting = false;
        // Reset the form fields
        this.newTicket.title = '';
        this.newTicket.description = '';
        // Tell the parent component to refresh the list
        this.ticketCreated.emit();
      },
      error: (error: any) => {
        console.error('Error creating ticket:', error);
        this.errorMessage = 'Failed to create ticket. Please check backend connection.';
        this.isSubmitting = false;
      }
    });
  }
}