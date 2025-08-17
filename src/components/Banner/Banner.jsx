import { Container, Box, Typography, useTheme, useMediaQuery } from '@mui/material'
import { styled } from '@mui/material/styles'
import React from 'react'
import Carousel from './Carousel'

const BannerContainer = styled(Box)(({ theme }) => ({
  backgroundImage: 'url(./banner6.png)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
}))

const BannerContent = styled(Container)(({ theme, isMobile }) => ({
  height: isMobile ? 300 : 400,
  display: 'flex',
  flexDirection: 'column',
  paddingTop: isMobile ? 15 : 25,
  justifyContent: 'space-around'
}))

const TaglineContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'center',
  height: '40%'
}))

const Banner = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Use mobile layout on screens below 600px (599px and below)
  
  return (
    <BannerContainer>
      <BannerContent isMobile={isMobile}>
        <TaglineContainer>
          <Typography
            variant={isMobile ? "h3" : "h2"}
            style={{
              fontWeight: "700",
              marginBottom: isMobile ? 10 : 15,
              fontFamily: '"Orbitron", monospace',
                             fontSize: isMobile ? '0.8rem' : '3.5rem',
              color: 'white',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              textShadow: '0 0 20px rgba(139, 92, 246, 0.6)',
              background: 'linear-gradient(45deg, #ffffff, #a78bfa)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.3))'
            }}
          >
            Crypto Tracker
          </Typography>
          <Typography
            variant={isMobile ? "body1" : "subtitle2"}
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
                             fontSize: isMobile ? '0.4rem' : '1.2rem',
              fontWeight: '400',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              fontFamily: '"Orbitron", monospace',
              textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
            }}
          >            
            Your favorite cryptos here and now
          </Typography>
        </TaglineContainer>
        <Carousel />
      </BannerContent>
    </BannerContainer>
  )
}

export default Banner