import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { TicketFormComponent } from './ticket-form.component';
import { TicketService } from '../../services/ticket';
import { Ticket } from '../../models/ticket.model';

describe('TicketFormComponent', () => {
  let component: TicketFormComponent;
  let fixture: ComponentFixture<TicketFormComponent>;
  let mockTicketService: jasmine.SpyObj<TicketService>;

  beforeEach(async () => {
    // Create spy object for TicketService
    const spy = jasmine.createSpyObj('TicketService', ['createTicket']);

    await TestBed.configureTestingModule({
      imports: [TicketFormComponent, FormsModule],
      providers: [
        { provide: TicketService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TicketFormComponent);
    component = fixture.componentInstance;
    mockTicketService = TestBed.inject(TicketService) as jasmine.SpyObj<TicketService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form data', () => {
    expect(component.newTicket.title).toBe('');
    expect(component.newTicket.description).toBe('');
    expect(component.newTicket.status).toBe('OFFEN');
    expect(component.newTicket.created_by).toBe(1);
    expect(component.isSubmitting).toBeFalse();
    expect(component.errorMessage).toBe('');
  });

  describe('Form Validation', () => {
    it('should show error when title is empty', () => {
      component.newTicket.title = '';
      component.newTicket.description = 'Valid description';

      component.onSubmit();

      expect(component.errorMessage).toBe('Please fill in all fields.');
      expect(mockTicketService.createTicket).not.toHaveBeenCalled();
    });

    it('should show error when description is empty', () => {
      component.newTicket.title = 'Valid title';
      component.newTicket.description = '';

      component.onSubmit();

      expect(component.errorMessage).toBe('Please fill in all fields.');
      expect(mockTicketService.createTicket).not.toHaveBeenCalled();
    });

    it('should show error when both title and description are empty', () => {
      component.newTicket.title = '';
      component.newTicket.description = '';

      component.onSubmit();

      expect(component.errorMessage).toBe('Please fill in all fields.');
      expect(mockTicketService.createTicket).not.toHaveBeenCalled();
    });
  });

  describe('Successful Ticket Creation', () => {
    it('should create ticket when form is valid', () => {
      const mockTicket: Ticket = {
        id: 1,
        title: 'Test Ticket',
        description: 'Test Description',
        status: 'OFFEN',
        created_by: 1
      };

      component.newTicket.title = 'Test Ticket';
      component.newTicket.description = 'Test Description';
      
      mockTicketService.createTicket.and.returnValue(of(mockTicket));
      spyOn(component.ticketCreated, 'emit');

      component.onSubmit();

      expect(component.isSubmitting).toBeFalse();
      expect(mockTicketService.createTicket).toHaveBeenCalledWith(component.newTicket);
      expect(component.ticketCreated.emit).toHaveBeenCalled();
      expect(component.errorMessage).toBe('');
    });

    it('should reset form after successful creation', () => {
      const mockTicket: Ticket = {
        id: 1,
        title: 'Test Ticket',
        description: 'Test Description',
        status: 'OFFEN',
        created_by: 1
      };

      component.newTicket.title = 'Test Ticket';
      component.newTicket.description = 'Test Description';
      
      mockTicketService.createTicket.and.returnValue(of(mockTicket));

      component.onSubmit();

      expect(component.newTicket.title).toBe('');
      expect(component.newTicket.description).toBe('');
      expect(component.isSubmitting).toBeFalse();
    });

    it('should emit ticketCreated event after successful creation', () => {
      const mockTicket: Ticket = {
        id: 1,
        title: 'Test Ticket',
        description: 'Test Description',
        status: 'OFFEN',
        created_by: 1
      };

      component.newTicket.title = 'Test Ticket';
      component.newTicket.description = 'Test Description';
      
      mockTicketService.createTicket.and.returnValue(of(mockTicket));
      spyOn(component.ticketCreated, 'emit');

      component.onSubmit();

      expect(component.ticketCreated.emit).toHaveBeenCalledWith();
    });
  });

  describe('Error Handling', () => {
    it('should handle service errors gracefully', () => {
      component.newTicket.title = 'Test Ticket';
      component.newTicket.description = 'Test Description';
      
      const errorResponse = new Error('Service error');
      mockTicketService.createTicket.and.returnValue(throwError(() => errorResponse));

      component.onSubmit();

      expect(component.errorMessage).toBe('Failed to create ticket. Please check backend connection.');
      expect(component.isSubmitting).toBeFalse();
    });

    it('should clear error message on successful submission', () => {
      const mockTicket: Ticket = {
        id: 1,
        title: 'Test Ticket',
        description: 'Test Description',
        status: 'OFFEN',
        created_by: 1
      };

      // Set initial error
      component.errorMessage = 'Previous error';
      component.newTicket.title = 'Test Ticket';
      component.newTicket.description = 'Test Description';
      
      mockTicketService.createTicket.and.returnValue(of(mockTicket));

      component.onSubmit();

      expect(component.errorMessage).toBe('');
    });
  });

  describe('UI Behavior', () => {
    it('should set isSubmitting to true during form submission', () => {
      component.newTicket.title = 'Test Ticket';
      component.newTicket.description = 'Test Description';
      
      // Mock a delayed response
      mockTicketService.createTicket.and.returnValue(of({
        id: 1,
        title: 'Test Ticket',
        description: 'Test Description',
        status: 'OFFEN',
        created_by: 1
      }));

      expect(component.isSubmitting).toBeFalse();
      
      component.onSubmit();
      
      // After successful completion, isSubmitting should be false again
      expect(component.isSubmitting).toBeFalse();
    });
  });
});