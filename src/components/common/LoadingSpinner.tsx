import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

const neonPulse = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 5px #00f7ff) drop-shadow(0 0 10px #00f7ff) drop-shadow(0 0 15px #00f7ff);
  }
  50% {
    filter: drop-shadow(0 0 10px #00f7ff) drop-shadow(0 0 20px #00f7ff) drop-shadow(0 0 30px #00f7ff);
  }
`;

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& .MuiCircularProgress-root': {
    color: theme.palette.neon.blue,
    animation: `${neonPulse} 2s ease-in-out infinite`,
  },
}));

interface LoadingSpinnerProps {
  size?: number;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 40, 
  fullScreen = false 
}) => {
  const containerProps = fullScreen 
    ? { 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        backgroundColor: 'rgba(1, 10, 31, 0.8)',
        zIndex: 9999 
      }
    : { minHeight: '200px' };

  return (
    <StyledBox {...containerProps}>
      <CircularProgress size={size} thickness={4} />
    </StyledBox>
  );
};

export default LoadingSpinner;