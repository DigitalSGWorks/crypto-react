import '@testing-library/jest-dom';

// Mock pour Chart.js
jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn(),
  },
  CategoryScale: jest.fn(),
  LinearScale: jest.fn(),
  PointElement: jest.fn(),
  LineElement: jest.fn(),
  Title: jest.fn(),
  Tooltip: jest.fn(),
  Legend: jest.fn(),
}));

// Mock pour react-chartjs-2
jest.mock('react-chartjs-2', () => ({
  Line: () => 'Chart Line Mock',
}));

// Mock pour react-alice-carousel
jest.mock('react-alice-carousel', () => ({
  __esModule: true,
  default: ({ children }) => `Carousel Mock: ${children}`,
}));

// Mock pour Material-UI theme
jest.mock('@mui/material/styles', () => ({
  ...jest.requireActual('@mui/material/styles'),
  useTheme: () => ({
    palette: {
      mode: 'dark',
      primary: { main: '#8b5cf6' },
      background: { default: '#1a1a1a', paper: '#4a4a4a' },
    },
  }),
}));

// Mock pour window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock pour IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};
