import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // <-- Wichtig für Tabellen-Schleifen!
import { MOCK_TICKETS } from './mock-tickets';
import { Ticket } from './ticket.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule], // <-- Hier CommonModule hinzugefügt
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ticket-system-frontend');
  
  // Hier speichern wir die Fake-Tickets ab
  protected readonly tickets = signal<Ticket[]>(MOCK_TICKETS);
}