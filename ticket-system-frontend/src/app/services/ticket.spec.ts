import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  // The URL to our Express Backend API
  private apiUrl = 'http://localhost:3000/api/tickets';

  // Injecting the Angular HttpClient to make HTTP requests
  constructor(private http: HttpClient) { }

  /**
   * Fetches all tickets from the backend database
   * @returns Observable array of tickets
   */
  getTickets(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /**
   * Sends a POST request to create a new ticket in the database
   * @param ticket Data of the new ticket (title, description, created_by)
   * @returns Observable of the server response
   */
  createTicket(ticket: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, ticket);
  }
}