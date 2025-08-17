import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import AliceCarousel from 'react-alice-carousel'
import 'react-alice-carousel/lib/alice-carousel.css'
import React from 'react'
import { Link } from 'react-router-dom'
import { useCryptoContext } from "../../contexts/CryptoContext"
import { useTrendingData } from '../../hooks/useCryptoData'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { ErrorMessage } from '../common/ErrorMessage'
import { formatCurrency, formatPercentage } from '../../utils/formatters'

const CarouselContainer = styled(Box)(({ theme }) => ({
  height: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}))

const CarouselItem = styled(Link)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "150px",
  height: "140px",
  color: "white",
  cursor: "pointer",
  transition: "all 0.3s ease",
  margin: "10px 10px",
  textDecoration: "none",
  "&:hover": {
    transform: "scale(1.05)",
    textDecoration: "none",
    color: "white"
  }
}))

const Carousel = () => {
  const { currency, symbol } = useCryptoContext()
  const { trendingData, loading, error, refetch } = useTrendingData()

  // Readable logs
  const log = (...args) => console.log('[Carousel]', ...args)

  const responsive = {
    0: {
      items: 2,
    },
    512: {
      items: 4,
    },
  }

  // Ensure trendingData is an array and has the expected structure
  if (!trendingData || !Array.isArray(trendingData) || trendingData.length === 0) {
    return (
      <CarouselContainer data-testid="trending-carousel">
        <Typography variant="body1" color="text.secondary">
          No trending data available
        </Typography>
      </CarouselContainer>
    );
  }

  const items = trendingData.map((coin) => {
    // Handle different possible data structures from the API
    const coinData = coin.item || coin;
    const coinId = coinData?.id || coin.id
    const coinName = coinData?.name || coin.name
    const coinImage = coinData?.small || coinData?.image || coin.small || coin.image
    const coinSymbol = coinData?.symbol || coin.symbol
    
    // Extract price according to selected currency
    let priceChange = 0
    const priceData = coinData?.data?.price_change_percentage_24h || coin.item?.data?.price_change_percentage_24h
    if (priceData) {
      // API returns an object with all currencies
      priceChange = priceData[currency?.toLowerCase()] || priceData.usd || 0
    }
    
    const rawUsdPrice = typeof coinData?.data?.price === 'number' ? coinData.data.price : 
                       typeof coin.item?.data?.price === 'number' ? coin.item.data.price : 0

    // Detailed log for BTC to compare with CoinsTable
    if (coinSymbol?.toLowerCase() === 'btc') {
      log('BTC in Carousel:', {
        symbol: coinSymbol,
        price_change_24h: priceChange,
        price_data_structure: coin.item?.data?.price_change_percentage_24h,
        selected_currency: currency?.toLowerCase(),
        raw_usd_price: rawUsdPrice,
        timestamp: new Date().toISOString()
      });
    }

    const displayPrice = formatCurrency(rawUsdPrice, currency)
    const profit = priceChange > 0

    return (
             <CarouselItem 
         key={coinId} 
         to={`/coin/${coinId}`}
         data-testid={`trending-coin-${coinId}`}
       >
        <img 
          data-testid={`trending-coin-image-${coinId}`}
          src={coinImage} 
          alt={coinName} 
          height="80" 
          style={{ marginBottom: 10 }}
          loading="lazy"
        />
        <Typography 
          data-testid={`trending-coin-symbol-${coinId}`}
          variant="body2" 
          style={{ 
            fontWeight: "700",
            fontSize: "1.1rem",
            color: "#ffffff",
            textShadow: "0 0 8px rgba(255, 255, 255, 0.8)",
            letterSpacing: "0.5px",
            fontFamily: '"Orbitron", monospace',
            textTransform: "uppercase",
            background: "linear-gradient(45deg, #ffffff, #a78bfa)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 4px rgba(139, 92, 246, 0.4))"
          }}
        >
          {coinSymbol?.toUpperCase()}
        </Typography>
        <Typography 
          data-testid={`trending-coin-change-${coinId}`}
          variant="caption" 
          style={{ 
            color: profit ? "rgb(14, 203, 129)" : "#ff6b6b",
            fontWeight: "600",
            fontSize: "0.9rem",
            textShadow: profit ? "0 0 6px rgba(14, 203, 129, 0.6)" : "0 0 6px rgba(255, 107, 107, 0.6)",
            letterSpacing: "0.3px",
            fontFamily: '"Orbitron", monospace'
          }}
        >
          {formatPercentage(priceChange)}
        </Typography>
        <Typography 
          data-testid={`trending-coin-price-${coinId}`}
          variant="body1" 
          style={{ 
            fontSize: "1.4rem",
            fontWeight: "600",
            color: "#ffffff",
            textShadow: "0 0 10px rgba(255, 255, 255, 0.7)",
            letterSpacing: "0.5px",
            fontFamily: '"Orbitron", monospace',
            filter: "drop-shadow(0 0 3px rgba(255, 255, 255, 0.3))"
          }}
        >
          {displayPrice}
        </Typography>
      </CarouselItem>
    )
  })

  if (loading) {
    return (
      <CarouselContainer data-testid="trending-carousel">
        <LoadingSpinner 
          data-testid="trending-loading"
          message="Loading trending cryptocurrencies..."
        />
      </CarouselContainer>
    )
  }

  if (error) {
    return (
      <CarouselContainer data-testid="trending-carousel">
        <ErrorMessage 
          data-testid="trending-error"
          message={error}
          onRetry={refetch}
        />
      </CarouselContainer>
    )
  }

  return (
    <CarouselContainer data-testid="trending-carousel">
      <AliceCarousel
        mouseTracking
        infinite
        autoPlayInterval={1000}
        animationDuration={1500}
        disableDotsControls
        responsive={responsive}
        autoPlay
        items={items}
      />
    </CarouselContainer>
  )
}

export default Carousel