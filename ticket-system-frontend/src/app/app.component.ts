import { Component, ViewChild } from '@angular/core';
import { TicketListComponent } from './components/ticket-list/ticket-list.component';
import { TicketFormComponent } from './components/ticket-form/ticket-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TicketListComponent, TicketFormComponent], // Registered the form here
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ticket-system-frontend';

  // Gain access to the TicketListComponent to call its fetchTickets method
  @ViewChild(TicketListComponent) ticketList!: TicketListComponent;

  // Triggered when the form fires the 'ticketCreated' event
  onTicketCreated(): void {
    if (this.ticketList) {
      this.ticketList.fetchTickets(); // Refresh the grid automatically
    }
  }
}