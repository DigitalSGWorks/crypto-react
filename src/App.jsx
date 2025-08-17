
import './App.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import Header from './components/Header'
import Footer from './components/Footer'
import Homepage from './pages/Homepage'
import Coinspage from './pages/Coinspage'
import { CryptoProvider } from './contexts/CryptoContext'

// Thème sombre avec teintes violettes
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8b5cf6', // Violet
      light: '#a78bfa',
      dark: '#7c3aed',
    },
    secondary: {
      main: '#a855f7', // Violet clair
      light: '#c084fc',
      dark: '#9333ea',
    },
    background: {
      default: 'linear-gradient(135deg, #1a1a1a 0%, #2a1a3a 20%, #3a1a4a 40%, #2a1a3a 60%, #1a1a2a 80%, #1a1a1a 100%)',
      paper: '#4a4a4a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
    divider: '#2a2a2a',
    success: {
      main: '#4caf50',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    },
    h2: {
      fontWeight: 600,
      fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
    },
    h3: {
      fontWeight: 600,
      fontSize: 'clamp(1.2rem, 3vw, 2rem)',
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'uppercase',
      fontWeight: 600,
      letterSpacing: '0.5px',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '12px 24px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
          color: '#0a0a0a',
          '&:hover': {
            background: 'linear-gradient(135deg, #a78bfa, #c084fc)',
          },
        },
        outlined: {
          borderColor: '#8b5cf6',
          color: '#8b5cf6',
          '&:hover': {
            borderColor: '#a78bfa',
            color: '#a78bfa',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#4a4a4a',
          border: '1px solid #5a5a5a',
          borderRadius: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#4a4a4a',
          border: '1px solid #5a5a5a',
          borderRadius: 12,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
            borderColor: '#8b5cf6',
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #2a2a2a',
          overflow: 'hidden',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#4a4a4a',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: '#8b5cf6',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        },
        body: {
          color: '#b0b0b0',
          borderBottom: '1px solid #5a5a5a',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#444444',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#4a4a4a',
            borderColor: '#5a5a5a',
            '&:hover': {
              borderColor: '#8b5cf6',
            },
            '&.Mui-focused': {
              borderColor: '#8b5cf6',
              boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#4a4a4a',
          borderColor: '#5a5a5a',
          '&:hover': {
            borderColor: '#8b5cf6',
          },
          '&.Mui-focused': {
            borderColor: '#8b5cf6',
          },
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#8b5cf6',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
        bar: {
          backgroundColor: '#8b5cf6',
        },
      },
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <CryptoProvider>
        <BrowserRouter>
          <div style={{ minWidth: '650px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/coin/:id" element={<Coinspage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </CryptoProvider>
    </ThemeProvider>
  )
}

export default App
