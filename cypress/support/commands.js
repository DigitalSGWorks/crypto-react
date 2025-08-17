// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Mock data for testing
const mockCryptoData = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://example.com/bitcoin.png',
    current_price: 50000,
    market_cap: 1000000000000,
    market_cap_rank: 1,
    price_change_percentage_24h: 2.5,
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    image: 'https://example.com/ethereum.png',
    current_price: 3000,
    market_cap: 400000000000,
    market_cap_rank: 2,
    price_change_percentage_24h: -1.2,
  },
];

const mockTrendingData = {
  coins: [
    {
      item: {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'btc',
        market_cap_rank: 1,
        thumb: 'https://example.com/bitcoin-thumb.png',
        small: 'https://example.com/bitcoin-small.png',
        large: 'https://example.com/bitcoin-large.png',
        price_btc: 1,
        score: 0,
      },
    },
  ],
};

// Command to setup API mocks
Cypress.Commands.add('setupApiMocks', () => {
  // Only setup mocks if we're in Cypress environment
  if (typeof Cypress === 'undefined') {
    return;
  }

  // Mock crypto markets data
  cy.mockApiResponse(
    'GET',
    '**/coins/markets*',
    mockCryptoData
  );

  // Mock trending data
  cy.mockApiResponse(
    'GET',
    '**/search/trending',
    mockTrendingData
  );

  // Mock historical data according to CoinGecko API documentation
  cy.mockApiResponse(
    'GET',
    '**/coins/bitcoin/market_chart*',
    {
      prices: [
        [1640995200000, 50000],
        [1641081600000, 51000],
        [1641168000000, 49000],
        [1641254400000, 52000],
        [1641340800000, 48000],
      ],
      market_caps: [
        [1640995200000, 1000000000000],
        [1641081600000, 1020000000000],
        [1641168000000, 980000000000],
        [1641254400000, 1040000000000],
        [1641340800000, 960000000000],
      ],
      total_volumes: [
        [1640995200000, 50000000000],
        [1641081600000, 51000000000],
        [1641168000000, 49000000000],
        [1641254400000, 52000000000],
        [1641340800000, 48000000000],
      ]
    }
  );

  // Mock coin details according to CoinGecko API documentation
  cy.mockApiResponse(
    'GET',
    '**/coins/bitcoin',
    {
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
  );
});

// Command to navigate to homepage
Cypress.Commands.add('visitHomepage', () => {
  cy.visit('/');
  cy.waitForLoading();
});

// Command to wait for loading to complete
Cypress.Commands.add('waitForLoading', () => {
  cy.get('[data-testid="loading-spinner"]', { timeout: 10000 }).should('not.exist');
});

// Command to search for a cryptocurrency
Cypress.Commands.add('searchCrypto', (searchTerm) => {
  cy.get('[data-testid="search-input"] input').clear().type(searchTerm);
});

// Command to change currency
Cypress.Commands.add('changeCurrency', (currency) => {
  cy.get('[data-testid="currency-select"]').click();
  cy.get(`[data-value="${currency}"]`).click();
});

// Command to navigate to coin details page
Cypress.Commands.add('visitCoinPage', (coinId) => {
  cy.visit(`/coin/${coinId}`);
  cy.waitForLoading();
});

// Command to change time period for chart
Cypress.Commands.add('changeTimePeriod', (days) => {
  cy.get(`[data-testid="time-period-${days}"]`).click();
});

// Command to check if table has data
Cypress.Commands.add('checkTableHasData', () => {
  cy.get('[data-testid="crypto-table"]').should('be.visible');
  cy.get('[data-testid="crypto-table"] tbody tr').should('have.length.greaterThan', 0);
});

// Command to check pagination
Cypress.Commands.add('checkPagination', () => {
  cy.get('[data-testid="pagination-controls"]').should('be.visible');
  cy.get('[data-testid="next-page-button"]').should('be.visible');
  cy.get('[data-testid="previous-page-button"]').should('be.visible');
});

// Command to change items per page
Cypress.Commands.add('changeItemsPerPage', (itemsPerPage) => {
  cy.get('[data-testid="items-per-page-select"]').click();
  cy.get(`[data-value="${itemsPerPage}"]`).click();
});

// Command to mock API response
Cypress.Commands.add('mockApiResponse', (method, url, response, statusCode = 200) => {
  cy.intercept(method, url, {
    statusCode,
    body: response
  });
});
