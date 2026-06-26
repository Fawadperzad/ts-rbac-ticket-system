import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket } from '../ticket.model'; // Dein Modell importieren

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'http://localhost:3000/api/tickets';

  constructor(private http: HttpClient) {}

  getTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl);
  }

  createTicket(ticket: Ticket): Observable<Ticket> {
    return this.http.post<Ticket>(this.apiUrl, ticket);
  }
}