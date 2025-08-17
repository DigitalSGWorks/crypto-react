import React from 'react';
import { Box, Typography, Button, Alert, AlertTitle } from '@mui/material';
import { ApiRateLimitInfo } from './ApiRateLimitInfo';

export const ErrorMessage = ({ 
  message = 'An error occurred', 
  onRetry, 
  variant = 'default',
  fullWidth = false,
  errorType = null // 'rate_limit', 'service_unavailable', 'network', etc.
}) => {
  const getContainerStyle = () => {
    const baseStyle = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
      padding: 2,
    };

    switch (variant) {
      case 'fullscreen':
        return {
          ...baseStyle,
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
        };
      case 'overlay':
        return {
          ...baseStyle,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 10,
        };
      default:
        return {
          ...baseStyle,
          width: fullWidth ? '100%' : 'auto',
        };
    }
  };

  const getErrorIcon = () => {
    switch (errorType) {
      case 'rate_limit':
        return '⏰';
      case 'service_unavailable':
        return '🔧';
      case 'network':
        return '🌐';
      case 'not_found':
        return '🔍';
      default:
        return '❌';
    }
  };

  const getErrorTitle = () => {
    switch (errorType) {
      case 'rate_limit':
        return 'Limite de requêtes dépassée';
      case 'service_unavailable':
        return 'Service temporairement indisponible';
      case 'network':
        return 'Erreur de connexion';
      case 'not_found':
        return 'Ressource non trouvée';
      default:
        return 'Une erreur est survenue';
    }
  };

  const getErrorDescription = () => {
    switch (errorType) {
      case 'rate_limit':
        return 'L\'API CoinGecko a des limitations de fréquence. Nous réessayons automatiquement.';
      case 'service_unavailable':
        return 'Le service CoinGecko est temporairement indisponible. Veuillez réessayer.';
      case 'network':
        return 'Vérifiez votre connexion internet et réessayez.';
      case 'not_found':
        return 'La cryptomonnaie demandée n\'existe pas ou n\'est pas disponible.';
      default:
        return message;
    }
  };

  const shouldShowRateLimitInfo = errorType === 'rate_limit' || 
                                 message.toLowerCase().includes('rate limit') ||
                                 message.toLowerCase().includes('429');

  return (
    <Box data-testid="error-message" style={getContainerStyle()}>
      <Alert 
        severity={errorType === 'rate_limit' ? 'warning' : 'error'}
        sx={{ 
          maxWidth: '500px',
          textAlign: 'left'
        }}
      >
        <AlertTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <span>{getErrorIcon()}</span>
          {getErrorTitle()}
        </AlertTitle>
        
        <Typography variant="body2" component="div" sx={{ marginTop: 1 }}>
          {getErrorDescription()}
        </Typography>
        
        {shouldShowRateLimitInfo && (
          <Box sx={{ marginTop: 2 }}>
            <ApiRateLimitInfo variant="warning" showDetails={true} />
          </Box>
        )}
        
        {onRetry && (
          <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}>
            <Button 
              data-testid="retry-button"
              variant="outlined" 
              onClick={onRetry}
              sx={{
                borderColor: errorType === 'rate_limit' ? 'warning.main' : 'error.main',
                color: errorType === 'rate_limit' ? 'warning.main' : 'error.main',
                '&:hover': {
                  backgroundColor: errorType === 'rate_limit' ? 'warning.light' : 'error.light',
                  borderColor: errorType === 'rate_limit' ? 'warning.dark' : 'error.dark',
                }
              }}
            >
              Réessayer
            </Button>
          </Box>
        )}
      </Alert>
    </Box>
  );
};
