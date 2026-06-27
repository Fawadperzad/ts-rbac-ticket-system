import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket, TicketComment } from '../models/ticket.model';

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

  /**
   * Creates a new support ticket
   */
  createTicket(ticket: Ticket): Observable<Ticket> {
    return this.http.post<Ticket>(this.apiUrl, ticket);
  }

  /**
   * Updates the status of an existing ticket.
   * KORREKTUR: Typ an die Template-Werte angepasst ('GESCHLOSSEN' statt 'ERLEDIGT')
   */
  updateTicketStatus(id: number, status: 'OFFEN' | 'IN_BEARBEITUNG' | 'GESCHLOSSEN'): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiUrl}/${id}`, { status });
  }

  /**
   * Safely constructs the delete URL without accidental double slashes
   */
  deleteTicket(id: number): Observable<any> {
    const url = this.apiUrl.endsWith('/') ? `${this.apiUrl}${id}` : `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }

  /**
   * Fetches all comments for a specific ticket ID
   */
  getComments(ticketId: number): Observable<TicketComment[]> {
    return this.http.get<TicketComment[]>(`${this.apiUrl}/${ticketId}/comments`);
  }

  /**
   * Sends a new comment to the backend
   */
  addComment(ticketId: number, commentText: string, userId: number): Observable<TicketComment> {
    const body = {
      comment_text: commentText,
      created_by: userId
    };
    return this.http.post<TicketComment>(`${this.apiUrl}/${ticketId}/comments`, body);
  }
}