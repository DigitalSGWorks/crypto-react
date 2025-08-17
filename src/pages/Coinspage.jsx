import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCryptoContext } from '../contexts/CryptoContext';
import { useHistoricalData } from '../hooks/useCryptoData';
import { fetchCoinDetails } from '../services/cryptoApiService';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { formatCurrency, formatMarketCap } from '../utils/formatters';
import { 
    Container, 
    Typography, 
    Box, 
    Grid, 
    Paper, 
    Button,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Coinspage = () => {
    const { id } = useParams();
    const [coin, setCoin] = useState(null);
    const [coinLoading, setCoinLoading] = useState(true);
    const [coinError, setCoinError] = useState(null);
    const [days, setDays] = useState(1);
    const { currency, symbol } = useCryptoContext();
    
    const theme = useTheme();
    const isMobile = useMediaQuery('(max-width: 1300px)');
    const isTablet = useMediaQuery('(max-width: 1600px)');

    // Custom hook for historical data
    const { historicalData, loading: chartLoading, error: chartError, refetch: refetchChart } = useHistoricalData(id, days, currency);

    // Function to load crypto data
    const fetchCoin = async () => {
        try {
            setCoinLoading(true);
            setCoinError(null);
            const data = await fetchCoinDetails(id);
            console.log('Data received from API:', data);
            console.log('Market data:', data.market_data);
            console.log('Current price USD:', data.market_data?.current_price?.usd);
            console.log('Market cap USD:', data.market_data?.market_cap?.usd);
            console.log('Current currency:', currency);
            setCoin(data);
        } catch (error) {
            console.error('Error loading crypto data:', error);
            
            // Determine error type based on error message
            let errorType = 'general';
            if (error.message.includes('Rate limit exceeded') || error.message.includes('429')) {
                errorType = 'rate_limit';
            } else if (error.message.includes('Service temporarily unavailable') || error.message.includes('503')) {
                errorType = 'service_unavailable';
            } else if (error.message.includes('Resource not found') || error.message.includes('404')) {
                errorType = 'not_found';
            } else if (error.message.includes('Network error') || error.message.includes('timeout')) {
                errorType = 'network';
            }
            
            setCoinError({
                message: error.message,
                type: errorType
            });
        } finally {
            setCoinLoading(false);
        }
    };

    // Load coin data on mount
    React.useEffect(() => {
        fetchCoin();
    }, [id]);

    // Chart configuration
    const chartData = historicalData ? {
        labels: historicalData.prices.map((price) => {
            const date = new Date(price[0]);
            return days === 1 
                ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                : date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' });
        }),
        datasets: [
            {
                label: `Price (${currency.toUpperCase()})`,
                data: historicalData.prices.map((price) => price[1]),
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 0,
            },
        ],
    } : null;

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#8b5cf6',
                borderWidth: 1,
            },
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: {
                    color: '#fff',
                },
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: {
                    color: '#fff',
                },
            },
        },
    };

    // Time period selection buttons
    const timeButtons = [
        { label: '24H', value: 1 },
        { label: '30J', value: 30 },
        { label: '3M', value: 90 },
        { label: '1Y', value: 365 },
    ];

    if (coinLoading) {
        return (
            <Container data-testid="coin-page" style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '80vh' 
            }}>
                <LoadingSpinner 
                    data-testid="coin-loading"
                    message="Loading cryptocurrency data..."
                />
            </Container>
        );
    }

    if (coinError) {
        return (
            <Container data-testid="coin-page">
                <ErrorMessage 
                    data-testid="error-message"
                    message={coinError.message || 'Unable to load cryptocurrency data'}
                    errorType={coinError.type}
                    onRetry={fetchCoin}
                />
            </Container>
        );
    }

    if (!coin) {
        return (
            <Container data-testid="coin-page">
                <ErrorMessage 
                    data-testid="error-message"
                    message="Crypto not found"
                    errorType="not_found"
                />
            </Container>
        );
    }

    return (
        <Container data-testid="coin-page" maxWidth={false} style={{ 
            marginTop: '2vh', 
            marginBottom: '2vh', 
            paddingLeft: isMobile ? '4vw' : (isTablet ? '2vw' : '3vw'), 
            paddingRight: isMobile ? '4vw' : (isTablet ? '2vw' : '3vw'),
            minHeight: '90vh'
        }}>
            {isMobile ? (
                // Mobile layout
                <Box>
                    {/* Logo, name and description */}
                    <Box style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        marginBottom: '3vh',
                        flexDirection: 'column',
                        textAlign: 'center'
                    }}>
                        <img 
                            data-testid="coin-logo"
                            src={coin.image?.large || coin.image?.small || ''} 
                            alt={coin.name || 'Crypto'}
                            style={{ 
                                width: '8vw', 
                                height: '8vw', 
                                maxWidth: '80px',
                                maxHeight: '80px',
                                marginBottom: '1.5vh' 
                            }}
                        />
                        <Typography 
                            data-testid="coin-name"
                            variant="h4" 
                            style={{ 
                                color: 'white', 
                                marginBottom: '1vh',
                                fontWeight: '700',
                                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                                fontFamily: '"Orbitron", monospace',
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
                            {coin.name || 'Unknown Crypto'}
                        </Typography>
                        <Typography 
                            data-testid="coin-description"
                            variant="body1" 
                            style={{ 
                                color: 'rgba(255,255,255,0.7)',
                                lineHeight: 1.6
                            }}
                        >
                            {coin.description?.en ? coin.description.en.split('. ')[0] + '.' : 'No description available.'}
                        </Typography>
                    </Box>

                    {/* Stats */}
                    <Paper style={{ 
                        padding: '2vh 2vw', 
                        marginBottom: '3vh',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <Grid container spacing={3} style={{ justifyContent: 'space-between' }}>
                            <Grid item xs={4}>
                                <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.7)' }}>
                                    Rank
                                </Typography>
                                <Typography data-testid="coin-rank" variant="h6" style={{ 
                                    color: 'white',
                                    fontFamily: '"Orbitron", monospace',
                                    fontWeight: '600',
                                    letterSpacing: '0.5px',
                                    textShadow: '0 0 8px rgba(255, 255, 255, 0.5)'
                                }}>
                                    #{coin.market_cap_rank || 'N/A'}
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.7)' }}>
                                    Current Price
                                </Typography>
                                <Typography data-testid="coin-price" variant="h6" style={{ 
                                    color: 'white',
                                    fontFamily: '"Orbitron", monospace',
                                    fontWeight: '600',
                                    letterSpacing: '0.5px',
                                    textShadow: '0 0 8px rgba(255, 255, 255, 0.5)'
                                }}>
                                    {formatCurrency(coin.market_data?.current_price?.[currency.toLowerCase()] || 0, currency)}
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.7)' }}>
                                    Market Cap
                                </Typography>
                                <Typography data-testid="coin-market-cap" variant="h6" style={{ 
                                    color: 'white',
                                    fontFamily: '"Orbitron", monospace',
                                    fontWeight: '600',
                                    letterSpacing: '0.5px',
                                    textShadow: '0 0 8px rgba(255, 255, 255, 0.5)'
                                }}>
                                    {formatMarketCap(coin.market_data?.market_cap?.[currency.toLowerCase()] || 0, currency)}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Chart */}
                    <Box style={{ marginBottom: '2vh' }}>
                        <Typography variant="h6" style={{ 
                            color: 'white', 
                            marginBottom: '1.5vh',
                            textAlign: 'center',
                            fontSize: 'clamp(1rem, 3vw, 1.5rem)'
                        }}>
                            Price Evolution
                        </Typography>
                        <Box style={{ 
                            height: '38vh', 
                            minHeight: '270px',
                            position: 'relative',
                            backgroundColor: 'rgba(255,255,255,0.02)',
                            borderRadius: '0.5vw',
                            padding: '2vw'
                        }}>
                            {chartLoading ? (
                                <LoadingSpinner 
                                    data-testid="chart-loading"
                                    message="Loading chart data..."
                                />
                            ) : chartError ? (
                                <ErrorMessage 
                                    data-testid="chart-error"
                                    message={chartError}
                                    onRetry={refetchChart}
                                />
                            ) : (
                                                                    chartData && (
                                        <Box data-testid="price-chart" style={{ height: '100%', width: '100%' }}>
                                            <Line data={chartData} options={chartOptions} />
                                        </Box>
                                    )
                            )}
                        </Box>
                    </Box>

                    {/* Time period buttons (2x2) */}
                    <Box style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr', 
                        gap: '1vw',
                        maxWidth: '30vw',
                        margin: '0 auto'
                    }}>
                        {timeButtons.map((button) => (
                            <Button
                                key={button.value}
                                data-testid={`time-period-${button.value}`}
                                variant={days === button.value ? "contained" : "outlined"}
                                onClick={() => setDays(button.value)}
                                style={{
                                    borderColor: '#8b5cf6',
                                    color: days === button.value ? '#000000' : '#ffffff',
                                    backgroundColor: days === button.value ? '#ffffff' : 'transparent',
                                    '&:hover': {
                                        backgroundColor: days === button.value ? '#ffffff' : 'rgba(255, 255, 255, 0.1)',
                                    }
                                }}
                            >
                                {button.label}
                            </Button>
                        ))}
                    </Box>
                </Box>
            ) : (
                // Desktop layout
                <Box style={{ 
                    display: 'flex', 
                    gap: isTablet ? '1vw' : '2vw', 
                    alignItems: 'stretch',
                    minHeight: '75vh',
                    flexDirection: isMobile ? 'column' : 'row'
                }}>
                    {/* Sidebar */}
                    <Box style={{ 
                        width: isMobile ? '100%' : (isTablet ? '20vw' : '16vw'),
                        minWidth: isMobile ? 'auto' : '160px',
                        maxWidth: isMobile ? 'none' : '250px',
                        flexShrink: 0,
                        marginBottom: isMobile ? '3vh' : '0'
                    }}>
                        <Paper style={{ 
                            padding: isMobile ? '3vh 2vw' : (isTablet ? '2vh 1.5vw' : '3vh 2vw'), 
                            height: isMobile ? 'auto' : '100%',
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: isMobile ? 'flex-start' : 'space-between'
                        }}>
                            <Box style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center',
                                textAlign: 'center',
                                flex: 1
                            }}>
                                <img 
                                    data-testid="coin-logo"
                                    src={coin.image?.large || coin.image?.small || ''} 
                                    alt={coin.name || 'Crypto'}
                                    style={{ 
                                        width: isMobile ? '12vw' : (isTablet ? '8vw' : '6vw'), 
                                        height: isMobile ? '12vw' : (isTablet ? '8vw' : '6vw'),
                                        maxWidth: isMobile ? '100px' : '120px',
                                        maxHeight: isMobile ? '100px' : '120px',
                                        marginBottom: '1.5vh' 
                                    }}
                                />
                                <Typography 
                                    data-testid="coin-name"
                                    variant="h5" 
                                    style={{ 
                                        color: 'white', 
                                        marginBottom: '1vh',
                                        fontWeight: '700',
                                        fontSize: isMobile ? 'clamp(1.5rem, 4vw, 2.5rem)' : (isTablet ? 'clamp(1.2rem, 3vw, 1.8rem)' : 'clamp(1.5rem, 2.5vw, 2rem)'),
                                        fontFamily: '"Orbitron", monospace',
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
                                    {coin.name || 'Unknown Crypto'}
                                </Typography>
                                <Typography 
                                    data-testid="coin-description"
                                    variant="body1" 
                                    style={{ 
                                        color: 'rgba(255,255,255,0.7)',
                                        lineHeight: 1.6
                                    }}
                                >
                                    {coin.description?.en ? coin.description.en.split('. ').slice(0, 3).join('. ') + '.' : 'No description available.'}
                                </Typography>
                            </Box>
                        </Paper>
                    </Box>

                    {/* Vertical separator */}
                    {!isMobile && (
                        <Box style={{ 
                            width: '1px', 
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            margin: isTablet ? '0 0.5vw' : '0 1vw'
                        }} />
                    )}

                    {/* Main content */}
                    <Box style={{ flex: isMobile ? 'none' : 1 }}>
                        {/* Stats */}
                        <Paper style={{ 
                            padding: isMobile ? '2vh 2vw' : (isTablet ? '1.5vh 1vw' : '3vh 2vw'), 
                            marginBottom: '3vh',
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <Grid container spacing={isMobile ? 2 : (isTablet ? 0.5 : 2)} style={{ justifyContent: 'space-between' }}>
                                <Grid item xs={4}>
                                    <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.7)' }}>
                                        Rank
                                    </Typography>
                                    <Typography data-testid="coin-rank" variant="h4" style={{ 
                                        color: 'white',
                                        fontSize: isMobile ? 'clamp(1.2rem, 3vw, 1.8rem)' : (isTablet ? 'clamp(1rem, 2vw, 1.5rem)' : 'clamp(1.5rem, 2vw, 2.2rem)'),
                                        fontFamily: '"Orbitron", monospace',
                                        fontWeight: '600',
                                        letterSpacing: '0.5px',
                                        textShadow: '0 0 8px rgba(255, 255, 255, 0.5)'
                                    }}>
                                        #{coin.market_cap_rank || 'N/A'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.7)' }}>
                                        Current Price
                                    </Typography>
                                    <Typography data-testid="coin-price" variant="h4" style={{ 
                                        color: 'white',
                                        fontSize: isTablet ? 'clamp(1rem, 2vw, 1.5rem)' : 'clamp(1.5rem, 2vw, 2.2rem)',
                                        fontFamily: '"Orbitron", monospace',
                                        fontWeight: '600',
                                        letterSpacing: '0.5px',
                                        textShadow: '0 0 8px rgba(255, 255, 255, 0.5)'
                                    }}>
                                        {formatCurrency(coin.market_data?.current_price?.[currency.toLowerCase()] || 0, currency)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.7)' }}>
                                        Market Cap
                                    </Typography>
                                    <Typography data-testid="coin-market-cap" variant="h4" style={{ 
                                        color: 'white',
                                        fontFamily: '"Orbitron", monospace',
                                        fontWeight: '600',
                                        letterSpacing: '0.5px',
                                        textShadow: '0 0 8px rgba(255, 255, 255, 0.5)'
                                    }}>
                                        {formatMarketCap(coin.market_data?.market_cap?.[currency.toLowerCase()] || 0, currency)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Chart */}
                        <Paper style={{ 
                            padding: isTablet ? '2vh 1.5vw' : '3vh 2vw',
                            backgroundColor: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <Typography variant="h5" style={{ 
                                color: 'white', 
                                marginBottom: '2vh',
                                fontSize: isTablet ? 'clamp(1.2rem, 2.5vw, 1.8rem)' : 'clamp(1.5rem, 2vw, 2.2rem)'
                            }}>
                                Price Evolution
                            </Typography>
                            <Box style={{ 
                                height: isTablet ? '38vh' : '48vh',
                                minHeight: '320px',
                                position: 'relative',
                                marginBottom: '2vh'
                            }}>
                                {chartLoading ? (
                                    <LoadingSpinner 
                                        data-testid="chart-loading"
                                        message="Loading chart data..."
                                    />
                                ) : chartError ? (
                                    <ErrorMessage 
                                        data-testid="chart-error"
                                        message={chartError}
                                        onRetry={refetchChart}
                                    />
                                ) : (
                                    chartData && (
                                        <Box data-testid="price-chart" style={{ height: '100%', width: '100%' }}>
                                            <Line data={chartData} options={chartOptions} />
                                        </Box>
                                    )
                                )}
                            </Box>

                            {/* Time period buttons (horizontally aligned) */}
                            <Box style={{ 
                                display: 'flex', 
                                gap: isTablet ? '1vw' : '1.5vw',
                                justifyContent: 'center',
                                flexWrap: 'wrap'
                            }}>
                                {timeButtons.map((button) => (
                                    <Button
                                        key={button.value}
                                        data-testid={`time-period-${button.value}`}
                                        variant={days === button.value ? "contained" : "outlined"}
                                        onClick={() => setDays(button.value)}
                                        style={{
                                            borderColor: '#8b5cf6',
                                            color: days === button.value ? '#000000' : '#ffffff',
                                            backgroundColor: days === button.value ? '#ffffff' : 'transparent',
                                            minWidth: isTablet ? '60px' : '80px',
                                            fontSize: isTablet ? '0.8rem' : '1rem',
                                            '&:hover': {
                                                backgroundColor: days === button.value ? '#ffffff' : 'rgba(255, 255, 255, 0.1)',
                                            }
                                        }}
                                    >
                                        {button.label}
                                    </Button>
                                ))}
                            </Box>
                        </Paper>
                    </Box>
                </Box>
            )}
        </Container>
    );
};

export default Coinspage;
