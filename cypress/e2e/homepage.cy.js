describe('Homepage', () => {
  beforeEach(() => {
    cy.setupApiMocks();
    cy.visitHomepage();
  });

  it('should display the homepage with trending carousel and crypto table', () => {
    // Check if trending carousel is visible
    cy.get('[data-testid="trending-carousel"]').should('be.visible');
    
    // Check if crypto table is visible and has data
    cy.checkTableHasData();
    
    // Check if pagination controls are visible
    cy.checkPagination();
  });

  it('should display header with currency selector', () => {
    cy.get('[data-testid="app-header"]').should('be.visible');
    cy.get('[data-testid="currency-select"]').should('be.visible');
    cy.get('[data-testid="app-title"]').should('contain', 'Crypto Tracker');
  });

  it('should allow searching for cryptocurrencies', () => {
    // Search for Bitcoin
    cy.searchCrypto('Bitcoin');
    
    // Check if search results are filtered
    cy.get('[data-testid="crypto-table"] tbody tr').should('have.length', 1);
    cy.get('[data-testid="crypto-table"] tbody tr').should('contain', 'Bitcoin');
    
    // Clear search
    cy.get('[data-testid="search-input"] input').clear();
    
    // Check if all data is shown again
    cy.get('[data-testid="crypto-table"] tbody tr').should('have.length.greaterThan', 1);
  });

  it('should allow changing currency', () => {
    // Change to EUR
    cy.changeCurrency('EUR');
    
    // Check if currency selector shows EUR
    cy.get('[data-testid="currency-select"]').should('contain', 'EUR');
    
    // Change back to USD
    cy.changeCurrency('USD');
    
    // Check if currency selector shows USD
    cy.get('[data-testid="currency-select"]').should('contain', 'USD');
  });

  it('should allow pagination navigation', () => {
    // Check initial state
    cy.get('[data-testid="current-page"]').should('contain', '1');
    
    // Check if pagination controls are visible
    cy.get('[data-testid="pagination-controls"]').should('be.visible');
    cy.get('[data-testid="next-page-button"]').should('be.visible');
    cy.get('[data-testid="previous-page-button"]').should('be.visible');
    
    // Only test pagination if there are multiple pages
    cy.get('[data-testid="crypto-table"] tbody tr').then(($rows) => {
      if ($rows.length >= 20) {
        // Go to next page
        cy.get('[data-testid="next-page-button"]').click();
        cy.waitForLoading();
        
        // Check if page changed
        cy.get('[data-testid="current-page"]').should('contain', '2');
        
        // Go back to previous page
        cy.get('[data-testid="previous-page-button"]').click();
        cy.waitForLoading();
        
        // Check if page changed back
        cy.get('[data-testid="current-page"]').should('contain', '1');
      } else {
        // If only one page, just verify the controls exist
        cy.get('[data-testid="next-page-button"]').should('be.disabled');
        cy.get('[data-testid="previous-page-button"]').should('be.disabled');
      }
    });
  });

  it('should allow changing items per page', () => {
    // Change to 50 items per page
    cy.changeItemsPerPage(50);
    cy.waitForLoading();
    
    // Check if table shows more items
    cy.get('[data-testid="crypto-table"] tbody tr').should('have.length', 2);
    
    // Change back to 20 items per page
    cy.changeItemsPerPage(20);
    cy.waitForLoading();
    
    // Check if table shows fewer items
    cy.get('[data-testid="crypto-table"] tbody tr').should('have.length', 2);
  });

  it('should navigate to coin details page when clicking on a row', () => {
    // Click on Bitcoin row
    cy.get('[data-testid="crypto-table"] tbody tr').first().click();
    
    // Check if navigated to coin details page
    cy.url().should('include', '/coin/bitcoin');
  });

  it('should display loading states correctly', () => {
    // Reload page to see loading state
    cy.reload();
    
    // Check if loading spinner is visible initially
    cy.get('[data-testid="loading-spinner"]').should('be.visible');
    
    // Wait for loading to complete
    cy.waitForLoading();
    
    // Check if content is visible after loading
    cy.get('[data-testid="crypto-table"]').should('be.visible');
  });

  it('should handle empty search results', () => {
    // Search for non-existent cryptocurrency
    cy.searchCrypto('NonExistentCrypto');
    
    // Check if table shows no results (excluding header row)
    cy.get('[data-testid="crypto-table"] tbody tr').should('have.length', 1);
    cy.get('[data-testid="no-results-message"]').should('be.visible');
  });

  it('should display error state when API fails', () => {
    // Mock API error for crypto data
    cy.intercept('GET', '**/coins/markets*', {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('cryptoApiError');
    
    // Mock API error for trending data
    cy.intercept('GET', '**/search/trending', {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('trendingApiError');
    
    // Reload page
    cy.reload();
    
    // Wait for API calls to fail
    cy.wait(['@cryptoApiError', '@trendingApiError']);
    
    // Check if error message is displayed (either in table or carousel)
    cy.get('[data-testid="error-message"], [data-testid="trending-error"]', { timeout: 15000 }).should('be.visible');
    cy.get('[data-testid="retry-button"]').should('be.visible');
  });

  it('should be responsive on different screen sizes', () => {
    // Test mobile viewport
    cy.viewport(375, 667);
    cy.get('[data-testid="app-header"]').should('be.visible');
    cy.get('[data-testid="crypto-table"]').should('be.visible');
    
    // Test tablet viewport
    cy.viewport(768, 1024);
    cy.get('[data-testid="app-header"]').should('be.visible');
    cy.get('[data-testid="crypto-table"]').should('be.visible');
    
    // Test desktop viewport
    cy.viewport(1280, 720);
    cy.get('[data-testid="app-header"]').should('be.visible');
    cy.get('[data-testid="crypto-table"]').should('be.visible');
  });
});
