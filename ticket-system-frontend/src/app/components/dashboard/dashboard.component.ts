import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketFormComponent } from '../ticket-form/ticket-form.component';
import { TicketListComponent } from '../ticket-list/ticket-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TicketFormComponent, TicketListComponent],
  template: `
    <div class="dashboard-container">
      <section><app-ticket-form (ticketCreated)="ticketList.addTicket($event)"></app-ticket-form></section>
      <main><app-ticket-list #ticketList></app-ticket-list></main>
    </div>
  `,
  styles: [`.dashboard-container { max-width: 1200px; margin: 0 auto; padding: 24px; }`]
})
export class DashboardComponent {}
