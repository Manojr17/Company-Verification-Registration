import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: '12px 24px',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  border: `2px solid ${theme.palette.neon.blue}`,
  background: `linear-gradient(135deg, ${theme.palette.neon.blue}20, ${theme.palette.primary.main}20)`,
  color: theme.palette.neon.blue,
  '&:hover': {
    background: `linear-gradient(135deg, ${theme.palette.neon.blue}40, ${theme.palette.primary.main}40)`,
    boxShadow: `0 0 20px ${theme.palette.neon.blue}60`,
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  '&.MuiButton-contained': {
    background: `linear-gradient(135deg, ${theme.palette.neon.blue}, ${theme.palette.primary.main})`,
    color: theme.palette.background.default,
    border: 'none',
    '&:hover': {
      background: `linear-gradient(135deg, ${theme.palette.neon.cyan}, ${theme.palette.primary.light})`,
    },
  },
  '&:disabled': {
    opacity: 0.5,
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.3)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    boxShadow: 'none',
    transform: 'none',
  },
}));

interface NeonButtonProps extends ButtonProps {
  glow?: boolean;
}

const NeonButton: React.FC<NeonButtonProps> = ({ 
  glow = true, 
  children,
  ...props 
}) => {
  return (
    <StyledButton {...props}>
      {children}
    </StyledButton>
  );
};

export default NeonButton;