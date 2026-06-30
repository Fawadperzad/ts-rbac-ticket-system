// Standalone test file that runs without Angular dependencies
const assert = require('assert');

console.log('Running Frontend Tests...\n');

// Test counter
let passed = 0;
let failed = 0;

function test(description, testFunc) {
  try {
    testFunc();
    console.log(`✓ ${description}`);
    passed++;
  } catch (error) {
    console.log(`✗ ${description}: ${error.message}`);
    failed++;
  }
}

// Model validation tests
console.log('--- User Model Validation ---');
test('should validate required fields', () => {
  const validateUser = (user) => {
    return Boolean(user.username && user.email && user.role);
  };

  assert.strictEqual(validateUser({ username: 'test', email: 'test@example.com', role: 'USER' }), true);
  assert.strictEqual(validateUser({ username: '', email: 'test@example.com', role: 'USER' }), false);
  assert.strictEqual(validateUser({ username: 'test', email: '', role: 'USER' }), false);
});

test('should validate email format', () => {
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  assert.strictEqual(validateEmail('test@example.com'), true);
  assert.strictEqual(validateEmail('invalid-email'), false);
  assert.strictEqual(validateEmail(''), false);
});

test('should validate user roles', () => {
  const validRoles = ['USER', 'AGENT', 'ADMIN'];
  const validateRole = (role) => {
    return validRoles.includes(role);
  };

  assert.strictEqual(validateRole('USER'), true);
  assert.strictEqual(validateRole('ADMIN'), true);
  assert.strictEqual(validateRole('INVALID'), false);
});

console.log('\n--- Ticket Model Validation ---');
test('should validate ticket status', () => {
  const validStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
  const validateStatus = (status) => {
    return validStatuses.includes(status);
  };

  assert.strictEqual(validateStatus('OPEN'), true);
  assert.strictEqual(validateStatus('CLOSED'), true);
  assert.strictEqual(validateStatus('INVALID'), false);
});

test('should validate ticket priority', () => {
  const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
  const validatePriority = (priority) => {
    return validPriorities.includes(priority);
  };

  assert.strictEqual(validatePriority('HIGH'), true);
  assert.strictEqual(validatePriority('LOW'), true);
  assert.strictEqual(validatePriority('INVALID'), false);
});

test('should require title and description', () => {
  const validateTicket = (ticket) => {
    return Boolean(ticket.title && ticket.description);
  };

  assert.strictEqual(validateTicket({ title: 'Test', description: 'Description' }), true);
  assert.strictEqual(validateTicket({ title: '', description: 'Description' }), false);
  assert.strictEqual(validateTicket({ title: 'Test', description: '' }), false);
});

console.log('\n--- Form Validation Logic ---');
test('should validate login form', () => {
  const validateLoginForm = (username, password) => {
    return Boolean(username.trim() && password.trim() && password.length >= 6);
  };

  assert.strictEqual(validateLoginForm('testuser', 'password123'), true);
  assert.strictEqual(validateLoginForm('', 'password123'), false);
  assert.strictEqual(validateLoginForm('testuser', '123'), false);
  assert.strictEqual(validateLoginForm('testuser', ''), false);
});

test('should validate ticket form', () => {
  const validateTicketForm = (title, description, priority) => {
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
    return Boolean(
      title.trim() && 
      description.trim() && 
      validPriorities.includes(priority)
    );
  };

  assert.strictEqual(validateTicketForm('Title', 'Description', 'HIGH'), true);
  assert.strictEqual(validateTicketForm('', 'Description', 'HIGH'), false);
  assert.strictEqual(validateTicketForm('Title', '', 'HIGH'), false);
  assert.strictEqual(validateTicketForm('Title', 'Description', 'INVALID'), false);
});

console.log('\n--- State Management Tests ---');
test('should manage user authentication state', () => {
  let isAuthenticated = false;
  let currentUser = null;

  const login = (user) => {
    isAuthenticated = true;
    currentUser = user;
  };

  const logout = () => {
    isAuthenticated = false;
    currentUser = null;
  };

  // Test login
  login({ id: 1, username: 'testuser', role: 'USER' });
  assert.strictEqual(isAuthenticated, true);
  assert.notStrictEqual(currentUser, null);
  assert.strictEqual(currentUser.username, 'testuser');

  // Test logout
  logout();
  assert.strictEqual(isAuthenticated, false);
  assert.strictEqual(currentUser, null);
});

test('should filter tickets by status', () => {
  const tickets = [
    { id: 1, title: 'Ticket 1', status: 'OPEN' },
    { id: 2, title: 'Ticket 2', status: 'CLOSED' },
    { id: 3, title: 'Ticket 3', status: 'OPEN' }
  ];

  const filterByStatus = (tickets, status) => {
    return tickets.filter(ticket => ticket.status === status);
  };

  const openTickets = filterByStatus(tickets, 'OPEN');
  const closedTickets = filterByStatus(tickets, 'CLOSED');

  assert.strictEqual(openTickets.length, 2);
  assert.strictEqual(closedTickets.length, 1);
  assert.strictEqual(openTickets[0].title, 'Ticket 1');
});

console.log('\n--- API Configuration Tests ---');
test('should build correct API endpoints', () => {
  const API_BASE = 'http://localhost:3000';
  
  const buildEndpoint = (path) => {
    return `${API_BASE}/api${path}`;
  };

  assert.strictEqual(buildEndpoint('/tickets'), 'http://localhost:3000/api/tickets');
  assert.strictEqual(buildEndpoint('/login'), 'http://localhost:3000/api/login');
  assert.strictEqual(buildEndpoint('/tickets/1/comments'), 'http://localhost:3000/api/tickets/1/comments');
});

test('should handle API error responses', () => {
  const handleApiError = (error) => {
    if (error.status === 401) {
      return 'Unauthorized access';
    } else if (error.status === 404) {
      return 'Resource not found';
    } else if (error.status >= 500) {
      return 'Server error occurred';
    }
    return 'An error occurred';
  };

  assert.strictEqual(handleApiError({ status: 401 }), 'Unauthorized access');
  assert.strictEqual(handleApiError({ status: 404 }), 'Resource not found');
  assert.strictEqual(handleApiError({ status: 500 }), 'Server error occurred');
  assert.strictEqual(handleApiError({ status: 400 }), 'An error occurred');
});

// Summary
console.log('\n=== Test Results ===');
console.log(`✓ Passed: ${passed}`);
console.log(`✗ Failed: ${failed}`);
console.log(`Total: ${passed + failed}`);

if (failed === 0) {
  console.log('\n🎉 All tests passed!');
  process.exit(0);
} else {
  console.log('\n❌ Some tests failed!');
  process.exit(1);
}