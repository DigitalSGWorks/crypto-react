describe('Coin Details Page', () => {
  beforeEach(() => {
    cy.setupApiMocks();
    cy.visitCoinPage('bitcoin');
  });

  it('should display time period buttons and allow changing chart period', () => {
    // Wait for page to load
    cy.waitForLoading();
    
    // Check if time period buttons are visible
    cy.get('[data-testid="time-period-1"]').should('be.visible');
    cy.get('[data-testid="time-period-30"]').should('be.visible');
    cy.get('[data-testid="time-period-90"]').should('be.visible');
    cy.get('[data-testid="time-period-365"]').should('be.visible');
    
    // Check if 24h button is selected by default
    cy.get('[data-testid="time-period-1"]').should('have.class', 'MuiButton-contained');
    
    // Change to 30 days
    cy.changeTimePeriod(30);
    
    // Check if 30 days button is selected
    cy.get('[data-testid="time-period-30"]').should('have.class', 'MuiButton-contained');
    cy.get('[data-testid="time-period-1"]').should('have.class', 'MuiButton-outlined');
  });

  it('should display error state when coin data fails to load', () => {
    // Mock API error for coin details
    cy.intercept('GET', '**/coins/bitcoin', {
      statusCode: 404,
      body: { error: 'Not Found' }
    }).as('coinError');
    
    // Reload page
    cy.reload();
    
    // Wait for API call to fail
    cy.wait('@coinError');
    
    // Check if error message is displayed
    cy.get('[data-testid="error-message"]').should('be.visible');
    cy.get('[data-testid="retry-button"]').should('be.visible');
    // Check if error type is correctly identified
    cy.get('[data-testid="error-message"]').should('contain', 'Ressource non trouvée');
  });

  it('should allow navigation back to homepage', () => {
    // Wait for page to load
    cy.waitForLoading();
    
    // Click on app title to go back to homepage
    cy.get('[data-testid="app-title"]').click();
    
    // Check if navigated to homepage
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('should display correct currency formatting', () => {
    // Wait for page to load
    cy.waitForLoading();
    
    // Change currency to EUR
    cy.changeCurrency('EUR');
    
    // Check if price is displayed in EUR
    cy.get('[data-testid="coin-price"]').should('contain', '€45,000.00');
    
    // Change back to USD
    cy.changeCurrency('USD');
    
    // Check if price is displayed in USD
    cy.get('[data-testid="coin-price"]').should('contain', '$50,000.00');
  });

  it('should handle rate limit errors gracefully', () => {
    // Mock rate limit error with retry mechanism
    let requestCount = 0;
    cy.intercept('GET', '**/coins/bitcoin', (req) => {
      requestCount++;
      if (requestCount <= 2) {
        // First two requests return rate limit error
        req.reply({
          statusCode: 429,
          body: { error: 'Rate limit exceeded' }
        });
      } else {
        // Third request succeeds
        req.reply({
          statusCode: 200,
          body: {
            id: 'bitcoin',
            name: 'Bitcoin',
            symbol: 'btc',
            image: { 
              thumb: 'https://example.com/bitcoin-thumb.png',
              small: 'https://example.com/bitcoin-small.png',
              large: 'https://example.com/bitcoin-large.png'
            },
            market_data: {
              current_price: { 
                usd: 50000, 
                eur: 45000,
                gbp: 40000,
                jpy: 7500000,
                cad: 65000,
                aud: 70000,
                chf: 45000,
                cny: 350000,
                inr: 4000000,
                brl: 250000
              },
              market_cap: { 
                usd: 1000000000000, 
                eur: 900000000000,
                gbp: 800000000000,
                jpy: 150000000000000,
                cad: 1300000000000,
                aud: 1400000000000,
                chf: 900000000000,
                cny: 7000000000000,
                inr: 80000000000000,
                brl: 5000000000000
              },
              market_cap_rank: 1,
              price_change_percentage_24h: 2.5,
              price_change_percentage_7d: 5.2,
              price_change_percentage_30d: -3.1,
              price_change_percentage_1y: 45.8,
              market_cap_change_24h: 25000000000,
              market_cap_change_percentage_24h: 2.5,
              total_volume: { usd: 50000000000 },
              high_24h: { usd: 52000 },
              low_24h: { usd: 48000 },
              circulating_supply: 19500000,
              total_supply: 21000000,
              max_supply: 21000000,
            },
            market_cap_rank: 1,
            description: { 
              en: 'Bitcoin is a decentralized cryptocurrency, without a central bank or single administrator, that can be sent from user to user on the peer-to-peer bitcoin network without intermediaries.'
            },
            links: {
              homepage: ['https://bitcoin.org'],
              blockchain_site: ['https://blockchain.info'],
              official_forum_url: ['https://bitcointalk.org'],
              chat_url: ['https://t.me/bitcoin'],
              announcement_url: [''],
              twitter_screen_name: 'bitcoin',
              telegram_channel_identifier: 'bitcoin',
              subreddit_url: 'https://reddit.com/r/bitcoin',
              repos_url: {
                github: ['https://github.com/bitcoin/bitcoin'],
                bitbucket: []
              }
            },
            genesis_date: '2009-01-03',
            sentiment_votes_up_percentage: 75.5,
            sentiment_votes_down_percentage: 24.5,
            watchlist_portfolio_users: 1000000,
            market_cap_rank: 1,
            coingecko_rank: 1,
            coingecko_score: 85.5,
            developer_score: 95.2,
            community_score: 78.9,
            liquidity_score: 92.1,
            public_interest_score: 88.3,
            status_updates: [],
            last_updated: '2024-01-01T00:00:00.000Z'
          }
        });
      }
    }).as('rateLimitWithRetry');
    
    // Reload page
    cy.reload();
    
    // Wait for API calls (should retry and eventually succeed)
    cy.wait('@rateLimitWithRetry');
    
    // Wait for loading to complete
    cy.waitForLoading();
    
    // Check if page loads successfully after retry
    cy.get('[data-testid="coin-name"]').should('contain', 'Bitcoin');
    cy.get('[data-testid="coin-price"]').should('contain', '$50,000.00');
  });

  it('should handle persistent rate limit errors', () => {
    // Mock persistent rate limit error (no retry success)
    cy.intercept('GET', '**/coins/bitcoin', {
      statusCode: 429,
      body: { error: 'Rate limit exceeded' }
    }).as('persistentRateLimit');
    
    // Reload page
    cy.reload();
    
    // Wait for API call to fail
    cy.wait('@persistentRateLimit');
    
    // Check if error message is displayed after all retries
    cy.get('[data-testid="error-message"]', { timeout: 30000 }).should('be.visible');
    cy.get('[data-testid="error-message"]').should('contain', 'Limite de requêtes dépassée');
    // Check if rate limit info is displayed
    cy.get('[data-testid="error-message"]').should('contain', 'Mise à jour toutes les 30 secondes');
  });

  it('should handle service unavailable errors with retry', () => {
    // Mock service unavailable error with retry mechanism
    let requestCount = 0;
    cy.intercept('GET', '**/coins/bitcoin', (req) => {
      requestCount++;
      if (requestCount <= 1) {
        // First request returns service unavailable
        req.reply({
          statusCode: 503,
          body: { error: 'Service temporarily unavailable' }
        });
      } else {
        // Second request succeeds
        req.reply({
          statusCode: 200,
          body: {
            id: 'bitcoin',
            name: 'Bitcoin',
            symbol: 'btc',
            image: { large: 'https://example.com/bitcoin-large.png' },
            market_data: {
              current_price: { usd: 50000, eur: 45000 },
              market_cap: { usd: 1000000000000, eur: 900000000000 },
            },
            market_cap_rank: 1,
            description: { en: 'Bitcoin is a decentralized cryptocurrency.' },
          }
        });
      }
    }).as('serviceUnavailableWithRetry');
    
    // Reload page
    cy.reload();
    
    // Wait for API calls (should retry and eventually succeed)
    cy.wait('@serviceUnavailableWithRetry');
    
    // Wait for loading to complete
    cy.waitForLoading();
    
    // Check if page loads successfully after retry
    cy.get('[data-testid="coin-name"]').should('contain', 'Bitcoin');
  });

  it('should handle bad request errors gracefully', () => {
    // Mock bad request error
    cy.intercept('GET', '**/coins/invalid-coin', {
      statusCode: 400,
      body: { error: 'Bad request' }
    }).as('badRequestError');
    
    // Visit invalid coin
    cy.visit('/coin/invalid-coin');
    
    // Wait for API call to fail
    cy.wait('@badRequestError');
    
    // Check if error message is displayed
    cy.get('[data-testid="error-message"]').should('be.visible');
    cy.get('[data-testid="error-message"]').should('contain', 'Une erreur est survenue');
  });
});
