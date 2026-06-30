import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { TicketListComponent } from './ticket-list.component';
import { TicketService } from '../../services/ticket';
import { Ticket, Comment } from '../../models/ticket.model';

describe('TicketListComponent', () => {
  let component: TicketListComponent;
  let fixture: ComponentFixture<TicketListComponent>;
  let mockTicketService: jasmine.SpyObj<TicketService>;

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

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TicketService', [
      'getTickets',
      'getComments',
      'updateTicketStatus', 
      'deleteTicket',
      'addComment'
    ]);

    await TestBed.configureTestingModule({
      imports: [TicketListComponent, FormsModule],
      providers: [
        { provide: TicketService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TicketListComponent);
    component = fixture.componentInstance;
    mockTicketService = TestBed.inject(TicketService) as jasmine.SpyObj<TicketService>;
    
    mockTicketService.getTickets.and.returnValue(of(mockTickets));
    mockTicketService.getComments.and.returnValue(of([]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tickets on init', () => {
    component.ngOnInit();
    expect(mockTicketService.getTickets).toHaveBeenCalled();
    expect(component.tickets).toEqual(mockTickets);
  });

  it('should handle ticket loading errors', () => {
    mockTicketService.getTickets.and.returnValue(throwError(() => new Error('Load error')));
    
    component.loadTickets();
    
    expect(component.errorMessage).toBe('Tickets konnten nicht geladen werden.');
    expect(component.isLoading).toBeFalse();
  });

  it('should update ticket status', () => {
    const ticket = mockTickets[0];
    const newStatus = 'GESCHLOSSEN';
    mockTicketService.updateTicketStatus.and.returnValue(of({ status: newStatus }));

    component.onStatusChange(ticket, newStatus);

    expect(mockTicketService.updateTicketStatus).toHaveBeenCalledWith(1, newStatus);
  });
});