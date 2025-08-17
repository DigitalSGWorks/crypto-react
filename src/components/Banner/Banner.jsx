import { Container, Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import React from 'react'
import Carousel from './Carousel'

const BannerContainer = styled(Box)(({ theme }) => ({
  backgroundImage: 'url(./banner6.png)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
}))

const BannerContent = styled(Container)(({ theme }) => ({
  height: 400,
  display: 'flex',
  flexDirection: 'column',
  paddingTop: 25,
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
  return (
    <BannerContainer>
      <BannerContent>
        <TaglineContainer>
          <Typography
            variant="h2"
            style={{
              fontWeight: "700",
              marginBottom: 15,
              fontFamily: '"Orbitron", monospace',
              fontSize: '3.5rem',
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
            variant="subtitle2"
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '1.2rem',
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