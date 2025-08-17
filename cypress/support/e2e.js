// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Mock API responses for testing
Cypress.Commands.add('mockApiResponse', (method, url, response, statusCode = 200) => {
  cy.intercept(method, url, {
    statusCode,
    body: response,
  }).as(`${method.toLowerCase()}_${url.replace(/[^a-zA-Z0-9]/g, '_')}`);
});

// Custom command to wait for loading to complete
Cypress.Commands.add('waitForLoading', () => {
  cy.get('[data-testid="loading-spinner"]', { timeout: 10000 }).should('not.exist');
});

// Custom command to check if element is visible
Cypress.Commands.add('shouldBeVisible', (selector) => {
  cy.get(selector).should('be.visible');
});

// Custom command to check if element is not visible
Cypress.Commands.add('shouldNotBeVisible', (selector) => {
  cy.get(selector).should('not.be.visible');
});
