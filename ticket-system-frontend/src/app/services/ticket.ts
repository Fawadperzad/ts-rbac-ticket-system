import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'http://localhost:3000/api/tickets';

  constructor(private http: HttpClient) { }

  /**
   * Fetches all tickets from the backend API
   * @returns Observable array of tickets
   */
  getTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl);
  }

  createTicket(ticket: Ticket): Observable<Ticket> {
    return this.http.post<Ticket>(this.apiUrl, ticket);
  }

  updateTicketStatus(id: number, status: 'OFFEN' | 'IN_BEARBEITUNG' | 'ERLEDIGT'): Observable<Ticket> {
    // Sends a PUT or PATCH request to /api/tickets/:id
    return this.http.put<Ticket>(`${this.apiUrl}/${id}`, { status });
  }
}