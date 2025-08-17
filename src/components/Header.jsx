import { 
  AppBar, 
  Select, 
  Container, 
  Toolbar, 
  Typography, 
  MenuItem,
  Box,
  createTheme,
  ThemeProvider
} from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCryptoContext } from '../contexts/CryptoContext'

const darkTheme = createTheme({
  palette: {
    primary: {
      main: '#fff',
    },
    mode: 'dark',
  },
})

const Header = () => {
  const navigate = useNavigate()
  const { currency, symbol, updateCurrency, supportedCurrencies } = useCryptoContext()
  
  // Logs to track changes
  const log = (...args) => console.log('[Header]', ...args)
  
  const handleCurrencyChange = (newCurrency) => {
    log('Currency change requested:', { from: currency, to: newCurrency })
    updateCurrency(newCurrency)
  }
  
  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar data-testid="app-header" color='transparent' position='static'>
        <Container>
          <Toolbar>
            <Typography 
              data-testid="app-title"
              onClick={() => navigate('/')}
              sx={{
                flex: 1,
                color: '#8b5cf6',
                                 fontSize: { xs: '10px', sm: '14px', md: '24px' },
                fontWeight: '700',
                fontFamily: '"Orbitron", monospace',
                cursor: 'pointer',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                textShadow: '0 0 10px rgba(139, 92, 246, 0.5)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#a78bfa',
                  textShadow: '0 0 15px rgba(139, 92, 246, 0.8)',
                  transform: 'scale(1.05)'
                }
              }}
            >
              Crypto Tracker
            </Typography>
            <Select 
              data-testid="currency-select"
              variant='outlined' 
              sx={{
                                 width: { xs: 65, sm: 85, md: 120 }, 
                 height: { xs: 24, sm: 30, md: 40 }, 
                 marginRight: { xs: 5, sm: 7, md: 15 },
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#8b5cf6',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#8b5cf6',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#8b5cf6',
                },
              }}
              value={currency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
            >
              {supportedCurrencies.map(curr => (
                <MenuItem key={curr} value={curr}>
                  {curr} ({curr === 'USD' ? '$' : curr === 'EUR' ? '€' : curr === 'GBP' ? '£' : curr === 'JPY' ? '¥' : curr === 'CAD' ? 'C$' : curr === 'AUD' ? 'A$' : curr === 'CHF' ? 'CHF' : curr === 'CNY' ? '¥' : curr === 'INR' ? '₹' : curr === 'BRL' ? 'R$' : curr})
                </MenuItem>
              ))}
            </Select>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  )
}

export default Header