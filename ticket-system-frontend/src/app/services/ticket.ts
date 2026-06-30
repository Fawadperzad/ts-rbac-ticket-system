import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { runtimeConfig } from '../../environments/runtime-config';
import { Ticket, Comment } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = runtimeConfig.apiUrl || environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/tickets`);
  }

  createTicket(ticket: Ticket): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.apiUrl}/tickets`, ticket);
  }

  updateTicketStatus(ticketId: number, status: string): Observable<{ status: string }> {
    return this.http.put<{ status: string }>(`${this.apiUrl}/tickets/${ticketId}`, { status });
  }

  getComments(ticketId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/tickets/${ticketId}/comments`);
  }

  addComment(ticketId: number, commentText: string, userId: number): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/tickets/${ticketId}/comments`, {
      comment_text: commentText,
      created_by: userId
    });
  }

  deleteTicket(ticketId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tickets/${ticketId}`);
  }
}