import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCryptoContext } from '../contexts/CryptoContext';
import { useCryptoData } from '../hooks/useCryptoData';
import { usePagination } from '../hooks/usePagination';
import { useSearch } from '../hooks/useSearch';
import { formatCurrency, formatPercentage, formatMarketCap } from '../utils/formatters';
import { LoadingSpinner } from './common/LoadingSpinner';
import { ErrorMessage } from './common/ErrorMessage';
import { 
  Container, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  Box, 
  Button,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Grid
} from '@mui/material';

const CoinsTable = () => {
  const navigate = useNavigate();
  const { currency, symbol } = useCryptoContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Use cards on screens below 600px (599px and below)
  
  // Custom hooks for data management
  const { cryptoData, loading, error, refetch } = useCryptoData(currency);
  
  const { 
    searchTerm, 
    filteredData, 
    updateSearchTerm, 
    clearSearch, 
    hasSearchTerm 
  } = useSearch(cryptoData, ['name', 'symbol']);
  
  const { 
    currentPage, 
    itemsPerPage, 
    totalPages, 
    startIndex, 
    endIndex, 
    goToPage, 
    goToNextPage, 
    goToPreviousPage, 
    changeItemsPerPage 
  } = usePagination(filteredData.length, 20);

  // Get current page data
  const currentPageData = filteredData.slice(startIndex, endIndex);

  // Security function to sanitize search input
  const sanitizeSearchInput = (input) => {
    // Remove potentially dangerous characters and patterns
    let sanitized = input;
    
    // Remove HTML tags
    sanitized = sanitized.replace(/<[^>]*>/g, '');
    
    // Remove script tags and content
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Remove common command line patterns
    sanitized = sanitized.replace(/[;&|`$(){}[\]]/g, '');
    
    // Remove SQL injection patterns
    sanitized = sanitized.replace(/['";\\]/g, '');
    
    // Remove additional dangerous characters (including ! > < .)
    sanitized = sanitized.replace(/[!><\.]/g, '');
    
    // Remove JavaScript patterns
    sanitized = sanitized.replace(/javascript:|data:|vbscript:|on\w+\s*=/gi, '');
    
    // Remove file path patterns
    sanitized = sanitized.replace(/\.\.\/|\.\.\\|\/etc\/|\/var\/|\/tmp\/|C:\\|D:\\/gi, '');
    
    // Remove common development patterns
    sanitized = sanitized.replace(/console\.|debugger|eval\(|Function\(/gi, '');
    
    // Remove XSS patterns
    sanitized = sanitized.replace(/on\w+\s*=|javascript:|vbscript:|data:|<iframe|<object|<embed/gi, '');
    
    // Remove command injection patterns
    sanitized = sanitized.replace(/[|&;`$(){}[\]]/g, '');
    
    // Remove directory traversal patterns
    sanitized = sanitized.replace(/\.\.\/|\.\.\\|\/etc\/|\/var\/|\/tmp\/|C:\\|D:\\/gi, '');
    
    // Remove special characters that could be used for injection
    sanitized = sanitized.replace(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g, '');
    
    // Allow only letters, numbers, spaces, hyphens, and underscores
    sanitized = sanitized.replace(/[^a-zA-Z0-9\s\-_]/g, '');
    
    // Limit length to prevent buffer overflow
    if (sanitized.length > 100) {
      sanitized = sanitized.substring(0, 100);
    }
    
    return sanitized;
  };

  // Handle search change with security
  const handleSearchChange = (event) => {
    const rawValue = event.target.value;
    const sanitizedValue = sanitizeSearchInput(rawValue);
    
    // Only update if the value is safe
    if (sanitizedValue === rawValue) {
      updateSearchTerm(sanitizedValue);
      // Reset to first page when search changes
      goToPage(0);
    } else {
      // If the input was modified by sanitization, update with clean value
      updateSearchTerm(sanitizedValue);
      goToPage(0);
    }
  };

  // Handle currency change
  const handleCurrencyChange = () => {
    refetch();
  };

  // Handle row click
  const handleRowClick = (coinId) => {
    navigate(`/coin/${coinId}`);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (event) => {
    changeItemsPerPage(parseInt(event.target.value, 10));
  };

  return (
    <Container 
      data-testid="crypto-table-container" 
      style={{ 
        marginTop: isMobile ? 20 : 50,
        padding: isMobile ? '0 5px' : '0 24px',
        maxWidth: '100%',
        width: '100%'
      }}
      maxWidth={false}
    >
      <Typography 
        variant={isMobile ? "h5" : "h4"}
        data-testid="crypto-table-title"
        style={{ 
          marginTop: isMobile ? 15 : 30,
          marginBottom: isMobile ? 15 : 30, 
          color: "white",
          textAlign: "center",
          fontFamily: '"Orbitron", monospace',
                                                 fontSize: isMobile ? '0.6rem' : '1.8rem',
          fontWeight: '700',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          textShadow: '0 0 15px rgba(139, 92, 246, 0.6)',
          background: 'linear-gradient(45deg, #ffffff, #a78bfa)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.4))'
        }}
      >
        Crypto Prices by Market Cap
      </Typography>

      {/* Search Input */}
      <TextField 
        data-testid="search-input"
        label="Search for desired crypto..."
        variant='outlined'
        value={searchTerm}
        onChange={handleSearchChange}
        maxLength={100}
        autoComplete="off"
        spellCheck="false"
        style={{
          marginBottom: isMobile ? 15 : 20,
          width: '100%',
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.1)',
          height: isMobile ? '32px' : 'auto'
        }}
        InputProps={{
          style: { 
            color: 'white',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: 8,
            height: isMobile ? '32px' : 'auto',
            fontSize: isMobile ? '10px' : 'inherit'
          },
          'data-testid': 'search-input-field',
          inputProps: {
            'data-testid': 'search-input-field',
            'maxLength': 100,
            'pattern': '[a-zA-Z0-9\\s\\-_]+',
            'title': 'Only letters, numbers, spaces, hyphens, and underscores are allowed'
          }
        }}
        InputLabelProps={{
          style: { color: 'rgba(255,255,255,0.7)' }
        }}
      />
      
      {/* Pagination controls - Mobile responsive */}
      <Box 
        data-testid="pagination-controls"
        style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: isMobile ? 'center' : 'space-between', 
          alignItems: isMobile ? 'center' : 'center', 
          marginBottom: isMobile ? 15 : 20,
          padding: isMobile ? '5px 0' : '10px 0',
          gap: isMobile ? 8 : 0
        }}
      >
        {/* Lines per page - Mobile: centered */}
        <Box style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: isMobile ? 5 : 10,
          justifyContent: isMobile ? 'center' : 'flex-start'
        }}>
          <Typography variant="body2" style={{ color: 'white' }}>
            Lines per page:
          </Typography>
          <FormControl size="small" style={{ minWidth: 80 }}>
            <Select
              data-testid="items-per-page-select"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              style={{ 
                color: 'white',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 4
              }}
            >
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Page info - Mobile: stacked vertically */}
        <Box style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center', 
          gap: isMobile ? 5 : 10,
          textAlign: isMobile ? 'center' : 'left'
        }}>
          <Typography 
            data-testid="current-page"
            variant="body2" 
            style={{ color: 'white' }}
          >
            Page {currentPage + 1} of {totalPages}
          </Typography>
          <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.7)' }}>
            ({startIndex + 1}-{endIndex} of {filteredData.length})
          </Typography>
        </Box>
        
        {/* Navigation buttons - Mobile: centered */}
        <Box style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: isMobile ? 5 : 10,
          justifyContent: isMobile ? 'center' : 'flex-end'
        }}>
          <Button 
            data-testid="previous-page-button"
            onClick={goToPreviousPage}
            disabled={currentPage === 0 || loading}
            variant="outlined"
            size="small"
            sx={{
              borderColor: '#8b5cf6',
              color: (currentPage === 0 || loading) ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)',
              backgroundColor: 'transparent',
              minWidth: '40px',
              padding: '8px',
              borderRadius: '8px',
              fontSize: '1.2rem',
              fontWeight: '500',
              '&:hover': {
                backgroundColor: (currentPage === 0 || loading) ? 'transparent' : 'rgba(139, 92, 246, 0.1)',
                borderColor: (currentPage === 0 || loading) ? 'rgba(255,255,255,0.3)' : '#a78bfa',
                color: (currentPage === 0 || loading) ? 'rgba(255,255,255,0.3)' : 'white'
              },
              '&:disabled': {
                borderColor: 'rgba(255,255,255,0.3)',
                color: 'rgba(255,255,255,0.3)'
              }
            }}
          >
            ←
          </Button>
          
          <Button 
            data-testid="next-page-button"
            onClick={goToNextPage}
            disabled={currentPage >= totalPages - 1 || loading}
            variant="outlined"
            size="small"
            sx={{
              borderColor: '#8b5cf6',
              color: (currentPage >= totalPages - 1 || loading) ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)',
              backgroundColor: 'transparent',
              minWidth: '40px',
              padding: '8px',
              borderRadius: '8px',
              fontSize: '1.2rem',
              fontWeight: '500',
              '&:hover': {
                backgroundColor: (currentPage >= totalPages - 1 || loading) ? 'transparent' : 'rgba(139, 92, 246, 0.1)',
                borderColor: (currentPage >= totalPages - 1 || loading) ? 'rgba(255,255,255,0.3)' : '#a78bfa',
                color: (currentPage >= totalPages - 1 || loading) ? 'rgba(255,255,255,0.3)' : 'white'
              },
              '&:disabled': {
                borderColor: 'rgba(255,255,255,0.3)',
                color: 'rgba(255,255,255,0.3)'
              }
            }}
          >
            →
          </Button>
        </Box>
      </Box>
      
      {/* Data area - Very small screens: Cards, Desktop/Medium: Table */}
      <Box 
        data-testid="table-area"
        style={{ 
          minHeight: '600px',
          position: 'relative'
        }}
      >
        {/* Loading overlay */}
        {loading && (
          <LoadingSpinner 
            data-testid="loading-spinner"
            message="Loading cryptocurrency data..."
            fullScreen={false}
            overlay={true}
          />
        )}
        
        {isMobile ? (
          // Very small screens: Card layout
          <Box>
            {error ? (
              <Box style={{ textAlign: 'center', color: 'white', padding: '40px' }}>
                <ErrorMessage 
                  data-testid="error-message"
                  message={error}
                  onRetry={refetch}
                />
              </Box>
            ) : currentPageData.length === 0 ? (
              <Box style={{ textAlign: 'center', color: 'white', padding: '40px' }}>
                <Typography 
                  data-testid="no-results-message"
                  variant="body1" 
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  {loading ? 'Loading...' : hasSearchTerm ? 'No crypto found for your search' : 'No crypto data available'}
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={1}>
                {currentPageData.map((row) => {
                  if (!row || !row.id || !row.name || !row.symbol) {
                    return null;
                  }
                  
                  const priceChange = row.price_change_percentage_24h || 0;
                  const isPositive = priceChange > 0;
                  const isNegative = priceChange < 0;

                  return (
                    <Grid item xs={6} key={row.id}>
                      <Card
                        data-testid={`crypto-card-${row.id}`}
                        onClick={() => handleRowClick(row.id)}
                        sx={{
                          cursor: 'pointer',
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '12px',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.08)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(139, 92, 246, 0.2)'
                          }
                        }}
                      >
                        <CardContent sx={{ padding: '8px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                          {/* Coin header */}
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1, 
                            marginBottom: 1,
                            flex: 1
                          }}>
                            <img
                              data-testid={`coin-logo-${row.id}`}
                              src={row?.image || ''}
                              alt={row.name || 'Crypto'}
                              style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                flexShrink: 0
                              }}
                            />
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                              <Typography
                                data-testid={`coin-symbol-${row.id}`}
                                variant="h6"
                                style={{
                                  textTransform: "uppercase",
                                  color: "white",
                                  fontWeight: 'bold',
                                  fontSize: '0.7rem',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {row.symbol || 'N/A'}
                              </Typography>
                              <Typography 
                                data-testid={`coin-name-${row.id}`}
                                variant="body2"
                                style={{ 
                                  color: "rgba(255,255,255,0.7)",
                                  fontSize: '0.6rem',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {row.name || 'Unknown name'}
                              </Typography>
                            </Box>
                          </Box>
                          
                          {/* Price and change */}
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: 1,
                            flex: 1
                          }}>
                            <Typography
                              data-testid={`coin-price-${row.id}`}
                              variant="h6"
                              style={{ 
                                color: "white", 
                                fontWeight: 'bold',
                                fontSize: '0.7rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {formatCurrency(row.current_price || 0, currency)}
                            </Typography>
                            <Typography
                              data-testid={`coin-change-${row.id}`}
                              variant="body1"
                              style={{
                                color: isPositive ? "rgb(14, 203, 129)" : isNegative ? "#ff6b6b" : "white",
                                fontWeight: 600,
                                fontSize: '0.6rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {formatPercentage(priceChange)}
                            </Typography>
                          </Box>
                          
                          {/* Market cap */}
                          <Typography
                            data-testid={`coin-market-cap-${row.id}`}
                            variant="body2"
                            style={{ 
                              color: "rgba(255,255,255,0.8)",
                              textAlign: 'center',
                              marginTop: 1,
                              fontSize: '0.5rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Market Cap: {formatMarketCap(row.market_cap || 0, currency)}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                }).filter(Boolean)}
              </Grid>
            )}
          </Box>
        ) : (
          // Desktop and medium screens: Table layout
          <TableContainer 
            data-testid="crypto-table"
            sx={{
              backgroundColor: 'rgba(255,255,255,0.02) !important',
              border: '1px solid rgba(255,255,255,0.1) !important',
              borderRadius: '8px !important',
              overflow: 'hidden !important',
              width: '100%',
              '& .MuiTable-root': {
                backgroundColor: 'rgba(255,255,255,0.02) !important',
                width: '100%'
              }
            }}
          >
            <Table sx={{
              backgroundColor: 'rgba(255,255,255,0.02) !important',
              '& .MuiTableCell-root': {
                borderColor: 'rgba(255,255,255,0.05) !important'
              }
            }}>
              <TableHead sx={{
                backgroundColor: 'rgba(139, 92, 246, 0.2) !important',
                borderBottom: '1px solid rgba(255,255,255,0.1) !important',
                borderTopLeftRadius: '8px !important',
                borderTopRightRadius: '8px !important',
                '& .MuiTableCell-root': {
                  backgroundColor: 'rgba(139, 92, 246, 0.2) !important',
                  color: 'white !important',
                  fontWeight: '600 !important',
                  fontSize: isMobile ? '0.4rem !important' : '0.9rem !important',
                  padding: isMobile ? '8px 2px !important' : '16px 8px !important',
                  borderBottom: 'none !important',
                  textAlign: 'center !important'
                },
                '& .MuiTableCell-root:first-of-type': {
                  borderTopLeftRadius: '8px !important'
                },
                '& .MuiTableCell-root:last-of-type': {
                  borderTopRightRadius: '8px !important'
                }
              }}>
                <TableRow>
                  {['Coin','Price','24h Change','Market Cap'].map((head) => (
                    <TableCell
                      key={head}
                      align="center"
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {error ? (
                  <TableRow>
                    <TableCell colSpan={4} style={{ textAlign: 'center', color: 'white', padding: '40px' }}>
                      <ErrorMessage 
                        data-testid="error-message"
                        message={error}
                        onRetry={refetch}
                      />
                    </TableCell>
                  </TableRow>
                ) : currentPageData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} style={{ textAlign: 'center', color: 'white', padding: '40px' }}>
                      <Typography 
                        data-testid="no-results-message"
                        variant="body1" 
                        style={{ color: "rgba(255,255,255,0.7)" }}
                      >
                        {loading ? 'Loading...' : hasSearchTerm ? 'No crypto found for your search' : 'No crypto data available'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentPageData.map((row) => {
                    if (!row || !row.id || !row.name || !row.symbol) {
                      return null;
                    }
                    
                    const priceChange = row.price_change_percentage_24h || 0;
                    const isPositive = priceChange > 0;
                    const isNegative = priceChange < 0;
                    const isZero = priceChange === 0;

                    return (
                      <TableRow
                        data-testid={`crypto-row-${row.id}`}
                        onClick={() => handleRowClick(row.id)}
                        key={row.id}
                        style={{ 
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.05)'
                          }
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                                              <TableCell
                        component="th"
                        scope='row'
                        sx={{
                          display: "flex",
                          gap: isMobile ? 8 : 15,
                          borderBottom: '1px solid rgba(255,255,255,0.05) !important',
                          padding: isMobile ? '8px 2px !important' : '16px 8px !important',
                          backgroundColor: 'transparent !important',
                                                      width: isMobile ? '35%' : '40%'
                        }}
                      >
                          <img
                            data-testid={`coin-logo-${row.id}`}
                            src={row?.image || ''}
                            alt={row.name || 'Crypto'}
                            height={isMobile ? "14" : "50"}
                            style={{
                              marginBottom: isMobile ? 3 : 10
                            }}
                          />
                          <div style={{
                            display:"flex",
                            flexDirection: "column"
                          }}>
                            <span
                              data-testid={`coin-symbol-${row.id}`}
                              style={{
                                textTransform: "uppercase",
                                                                  fontSize: isMobile ? 7 : 22,
                                color: "white"
                              }}
                            >
                              {row.symbol || 'N/A'}
                            </span>
                            <span 
                              data-testid={`coin-name-${row.id}`}
                              style={{color:"darkgrey"}}
                            >
                              {row.name || 'Unknown name'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell 
                          data-testid={`coin-price-${row.id}`}
                          align='right' 
                          sx={{
                            color: "white !important", 
                            fontFamily: "inherit !important",
                            borderBottom: '1px solid rgba(255,255,255,0.05) !important',
                            padding: isMobile ? '8px 2px !important' : '16px 8px !important',
                            backgroundColor: 'transparent !important',
                            width: isMobile ? '22%' : '20%',
                            fontSize: isMobile ? '0.4rem' : 'inherit'
                          }}
                        >
                          {formatCurrency(row.current_price || 0, currency)}
                        </TableCell>
                        <TableCell
                          data-testid={`coin-change-${row.id}`}
                          align='right'
                          sx={{
                            color: isPositive ? "rgb(14, 203, 129) !important" : isNegative ? "red !important" : "white !important",
                            fontWeight: 500,
                            fontFamily: "inherit !important",
                            borderBottom: '1px solid rgba(255,255,255,0.05) !important',
                            padding: isMobile ? '8px 2px !important' : '16px 8px !important',
                            backgroundColor: 'transparent !important',
                            width: isMobile ? '22%' : '20%',
                            fontSize: isMobile ? '0.4rem' : 'inherit'
                          }}
                        >
                          {formatPercentage(priceChange)}
                        </TableCell>
                        <TableCell 
                          data-testid={`coin-market-cap-${row.id}`}
                          align='right' 
                          sx={{
                            color: "white !important", 
                            fontFamily: "inherit !important",
                            borderBottom: '1px solid rgba(255,255,255,0.05) !important',
                            padding: isMobile ? '8px 2px !important' : '16px 8px !important',
                            backgroundColor: 'transparent !important',
                            width: isMobile ? '22%' : '20%',
                            fontSize: isMobile ? '0.4rem' : 'inherit'
                          }}
                        >
                          {formatMarketCap(row.market_cap || 0, currency)}
                        </TableCell>
                      </TableRow>
                    );
                  }).filter(Boolean)
                )}     
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
      
      {/* Search results indicator */}
      {hasSearchTerm && (
        <Box style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginTop: 30,
          marginBottom: 20
        }}>
          <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Search results: {filteredData.length} of {cryptoData.length} cryptocurrencies
          </Typography>
        </Box>
      )}
      
      {/* Bottom pagination controls - Desktop only */}
      {!isMobile && (
        <Box 
          data-testid="bottom-pagination"
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginTop: 20,
            padding: '10px 0'
          }}
        >
          <Box style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Typography variant="body2" style={{ color: 'white' }}>
              Lines per page:
            </Typography>
            <FormControl size="small" style={{ minWidth: 80 }}>
              <Select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                style={{ 
                  color: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }}
              >
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Typography variant="body2" style={{ color: 'white' }}>
              Page {currentPage + 1} of {totalPages}
            </Typography>
            <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.7)' }}>
              ({startIndex + 1}-{endIndex} of {filteredData.length})
            </Typography>
            
            <Button 
              onClick={goToPreviousPage}
              disabled={currentPage === 0 || loading}
              variant="outlined"
              size="small"
              style={{ 
                color: (currentPage === 0 || loading) ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)',
                borderColor: (currentPage === 0 || loading) ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)',
                minWidth: '40px',
                padding: '8px',
                fontSize: '1.2rem'
              }}
            >
              ←
            </Button>
            
            <Button 
              onClick={goToNextPage}
              disabled={currentPage >= totalPages - 1 || loading}
              variant="outlined"
              size="small"
              style={{ 
                color: (currentPage >= totalPages - 1 || loading) ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)',
                borderColor: (currentPage >= totalPages - 1 || loading) ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)',
                minWidth: '40px',
                padding: '8px',
                fontSize: '1.2rem'
              }}
            >
              →
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default CoinsTable;