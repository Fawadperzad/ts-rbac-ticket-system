import { Component, signal } from '@angular/core';
import { MOCK_TICKETS } from './mock-tickets';
import { Ticket } from './ticket.model';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ticket-system-frontend');
  
  // Hier speichern wir die Fake-Tickets ab
  protected readonly tickets = signal<Ticket[]>(MOCK_TICKETS);
}