# Crypto React - Cryptocurrency Tracking Application

A modern, responsive cryptocurrency tracking application built with React, Material-UI, and Chart.js. Track real-time cryptocurrency prices, view detailed charts, and explore market trends with a beautiful dark theme interface.

## 🌟 Features

### 📊 Real-time Data
- Live cryptocurrency prices from CoinGecko API
- Market cap rankings and 24h price changes
- Trending cryptocurrencies carousel
- Historical price charts with multiple timeframes

### 🎨 Modern UI/UX
- Dark theme with purple accents
- Responsive design for all devices
- Smooth animations and hover effects
- Custom Orbitron font for crypto aesthetics
- Interactive charts with Chart.js

### 🔍 Advanced Search
- Real-time search across all cryptocurrencies
- Secure input validation
- Pagination with customizable items per page
- Global search functionality

### 💱 Multi-Currency Support
- Support for 10+ currencies (USD, EUR, GBP, JPY, etc.)
- Dynamic currency switching
- Proper formatting for different price ranges
- 5 decimal precision for low-value cryptocurrencies

### 📱 Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interface
- Adaptive layouts

## 🚀 Technologies Used

- **Frontend**: React 18, Material-UI 7
- **Charts**: Chart.js with react-chartjs-2
- **API**: CoinGecko API v3
- **Styling**: Styled Components, CSS-in-JS
- **Build Tool**: Vite
- **Testing**: Cypress (E2E), Jest (Unit)
- **Fonts**: Google Fonts (Orbitron)

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup
```bash
# Clone the repository
git clone git@github.com:DigitalSGWorks/crypto-react.git

# Navigate to project directory
cd crypto-react

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm run test         # Run unit tests
npm run test:e2e     # Run Cypress E2E tests
npm run test:watch   # Run tests in watch mode

# Linting
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Banner/         # Carousel and banner components
│   ├── common/         # Shared components (Loading, Error, etc.)
│   ├── CoinsTable.jsx  # Main cryptocurrency table
│   ├── Footer.jsx      # Application footer
│   └── Header.jsx      # Navigation header
├── contexts/           # React contexts
│   └── CryptoContext.jsx
├── hooks/              # Custom React hooks
│   ├── useCryptoData.js
│   ├── usePagination.js
│   └── useSearch.js
├── pages/              # Page components
│   ├── Homepage.jsx    # Landing page
│   └── Coinspage.jsx   # Individual coin details
├── services/           # API services
│   └── cryptoApiService.js
├── utils/              # Utility functions
│   └── formatters.js
└── config/             # Configuration files
    └── apiEndpoints.js
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://api.coingecko.com/api/v3
VITE_APP_TITLE=Crypto React
```

### API Configuration
The application uses CoinGecko API with:
- Rate limiting protection
- Automatic retry logic
- CORS proxy fallback
- Error handling

## 🎯 Key Features Explained

### Security
- Input sanitization for search fields
- XSS protection
- CORS handling with multiple fallback options

### Performance
- Lazy loading for images
- Optimized re-renders with React hooks
- Efficient pagination
- Cached API responses

### Accessibility
- ARIA labels for screen readers
- Keyboard navigation support
- High contrast design
- Responsive text sizing

## 🧪 Testing

### Unit Tests
```bash
npm run test
```
Tests cover utility functions, API services, and component logic.

### E2E Tests
```bash
npm run test:e2e
```
Cypress tests cover user workflows and critical paths.

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
The application is optimized for deployment on modern platforms:
- Vercel: Automatic deployment from GitHub
- Netlify: Drag and drop deployment
- GitHub Pages: Static hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [CoinGecko API](https://www.coingecko.com/en/api) for cryptocurrency data
- [Material-UI](https://mui.com/) for UI components
- [Chart.js](https://www.chartjs.org/) for data visualization
- [React](https://reactjs.org/) for the framework

## 📞 Support

For support, email support@digitalsgworks.com or visit [DigitalSGWorks](https://www.digitalsgworks.com)

---

**Developed with ❤️ by [DigitalSGWorks](https://www.digitalsgworks.com)**
