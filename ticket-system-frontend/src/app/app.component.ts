import { Component } from '@angular/core';
import { TicketListComponent } from './components/ticket-list/ticket-list.component';
import { TicketFormComponent } from './components/ticket-form/ticket-form.component'; // Import it back

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TicketListComponent, TicketFormComponent], // Add it to imports
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ticket-system-frontend';

  // Your simulated logged-in profile
  selectedUser: any = {
    id: 1,
    username: 'admin_max',
    role: 'ADMIN' 
  };
}