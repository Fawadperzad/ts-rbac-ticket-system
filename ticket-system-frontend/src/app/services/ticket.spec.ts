import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TicketService } from './ticket';
import { Ticket, Comment } from '../models/ticket.model';
import { environment } from '../../environments/environment';

describe('TicketService', () => {
  let service: TicketService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TicketService]
    });
    service = TestBed.inject(TicketService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTickets', () => {
    it('should fetch all tickets', () => {
      const mockTickets: Ticket[] = [
        {
          id: 1,
          title: 'Test Ticket 1',
          description: 'Description 1',
          status: 'OFFEN',
          created_by: 1
        },
        {
          id: 2,
          title: 'Test Ticket 2',
          description: 'Description 2',
          status: 'IN_BEARBEITUNG',
          created_by: 2
        }
      ];

      service.getTickets().subscribe(tickets => {
        expect(tickets).toEqual(mockTickets);
        expect(tickets).toHaveLength(2);
      });

      const req = httpMock.expectOne(`${apiUrl}/tickets`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTickets);
    });

    it('should handle empty tickets array', () => {
      service.getTickets().subscribe(tickets => {
        expect(tickets).toEqual([]);
        expect(tickets).toHaveLength(0);
      });

      const req = httpMock.expectOne(`${apiUrl}/tickets`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('createTicket', () => {
    it('should create a new ticket', () => {
      const newTicket: Ticket = {
        title: 'New Ticket',
        description: 'New Description',
        status: 'OFFEN',
        created_by: 1
      };

      const createdTicket: Ticket = {
        ...newTicket,
        id: 3
      };

      service.createTicket(newTicket).subscribe(ticket => {
        expect(ticket).toEqual(createdTicket);
        expect(ticket.id).toBeDefined();
      });

      const req = httpMock.expectOne(`${apiUrl}/tickets`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newTicket);
      req.flush(createdTicket);
    });
  });

  describe('updateTicketStatus', () => {
    it('should update ticket status', () => {
      const ticketId = 1;
      const newStatus = 'GESCHLOSSEN';
      const response = { status: newStatus };

      service.updateTicketStatus(ticketId, newStatus).subscribe(result => {
        expect(result).toEqual(response);
        expect(result.status).toBe(newStatus);
      });

      const req = httpMock.expectOne(`${apiUrl}/tickets/${ticketId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ status: newStatus });
      req.flush(response);
    });
  });

  describe('getComments', () => {
    it('should fetch comments for a ticket', () => {
      const ticketId = 1;
      const mockComments: Comment[] = [
        {
          id: 1,
          ticket_id: ticketId,
          comment_text: 'First comment',
          created_by: 1,
          created_at: '2024-01-01T10:00:00Z',
          username: 'user1'
        },
        {
          id: 2,
          ticket_id: ticketId,
          comment_text: 'Second comment',
          created_by: 2,
          created_at: '2024-01-01T11:00:00Z',
          username: 'user2'
        }
      ];

      service.getComments(ticketId).subscribe(comments => {
        expect(comments).toEqual(mockComments);
        expect(comments).toHaveLength(2);
      });

      const req = httpMock.expectOne(`${apiUrl}/tickets/${ticketId}/comments`);
      expect(req.request.method).toBe('GET');
      req.flush(mockComments);
    });
  });

  describe('addComment', () => {
    it('should add a comment to a ticket', () => {
      const ticketId = 1;
      const commentText = 'New comment';
      const userId = 1;
      const newComment: Comment = {
        id: 3,
        ticket_id: ticketId,
        comment_text: commentText,
        created_by: userId,
        created_at: '2024-01-01T12:00:00Z',
        username: 'user1'
      };

      service.addComment(ticketId, commentText, userId).subscribe(comment => {
        expect(comment).toEqual(newComment);
        expect(comment.comment_text).toBe(commentText);
      });

      const req = httpMock.expectOne(`${apiUrl}/tickets/${ticketId}/comments`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        comment_text: commentText,
        created_by: userId
      });
      req.flush(newComment);
    });
  });

  describe('deleteTicket', () => {
    it('should delete a ticket', () => {
      const ticketId = 1;

      service.deleteTicket(ticketId).subscribe(() => {
        // Expect no response body for DELETE
      });

      const req = httpMock.expectOne(`${apiUrl}/tickets/${ticketId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('Error Handling', () => {
    it('should handle HTTP errors gracefully', () => {
      const errorMessage = 'Server Error';

      service.getTickets().subscribe({
        next: () => fail('should have failed with server error'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/tickets`);
      req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
    });
  });
});