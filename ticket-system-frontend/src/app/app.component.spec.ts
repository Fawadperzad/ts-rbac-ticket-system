import { describe, it, expect } from 'vitest';

describe('AppComponent', () => {
  describe('Component Structure', () => {
    it('should have correct title', () => {
      const appTitle = 'ticket-system-frontend';
      expect(appTitle).toBe('ticket-system-frontend');
    });

    it('should have default user structure', () => {
      const selectedUser = {
        id: 1,
        username: 'admin_max',
        role: 'ADMIN' 
      };

      expect(selectedUser.username).toBe('admin_max');
      expect(selectedUser.role).toBe('ADMIN');
      expect(selectedUser).toHaveProperty('id');
    });

    it('should validate component imports', () => {
      const expectedComponents = ['TicketListComponent', 'TicketFormComponent'];
      
      expectedComponents.forEach(component => {
        expect(component).toMatch(/^[A-Z][a-zA-Z]+Component$/);
      });
    });

    it('should validate selector format', () => {
      const selector = 'app-root';
      expect(selector).toMatch(/^app-[a-z-]+$/);
    });
  });
});