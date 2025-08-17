import React from 'react';
import { Box, Typography, IconButton, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  borderTop: '1px solid rgba(139, 92, 246, 0.3)',
  padding: '20px 0',
  marginTop: 'auto',
  position: 'relative',
  bottom: 0,
  width: '100%'
}));

const FooterContent = styled(Container)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '20px',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    textAlign: 'center'
  }
}));

const CopyrightText = styled(Typography)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.8)',
  fontFamily: '"Orbitron", monospace',
  fontSize: '0.9rem',
  letterSpacing: '0.5px'
}));

const IconButtonStyled = styled(IconButton)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.7)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '8px',
  padding: '8px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
    color: 'white',
    transform: 'scale(1.05)',
    boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
  }
}));

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleWebsiteClick = () => {
    window.open('https://www.digitalsgworks.com', '_blank', 'noopener,noreferrer');
  };

  const handleGitHubClick = () => {
    window.open('https://github.com/DigitalSGWorks/crypto-react', '_blank', 'noopener,noreferrer');
  };

  return (
    <FooterContainer>
      <FooterContent maxWidth="lg">
        <CopyrightText>
          © {currentYear} DigitalSGWorks. Tous droits réservés.
        </CopyrightText>
        
        <Box sx={{ display: 'flex', gap: '10px' }}>
          <IconButtonStyled
            onClick={handleWebsiteClick}
            title="Visiter DigitalSGWorks"
            aria-label="Site web DigitalSGWorks"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </IconButtonStyled>
          
          <IconButtonStyled
            onClick={handleGitHubClick}
            title="Voir le projet sur GitHub"
            aria-label="Projet GitHub"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </IconButtonStyled>
        </Box>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
