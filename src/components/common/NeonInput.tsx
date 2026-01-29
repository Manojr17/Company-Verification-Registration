import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderWidth: 1,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.neon.blue,
      borderWidth: 2,
      boxShadow: `0 0 10px rgba(0, 247, 255, 0.3)`,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.neon.blue,
      borderWidth: 2,
      boxShadow: `0 0 15px rgba(0, 247, 255, 0.5)`,
    },
    '&.Mui-error fieldset': {
      borderColor: theme.palette.error.main,
      boxShadow: `0 0 10px rgba(207, 102, 121, 0.3)`,
    },
    '&.Mui-error:hover fieldset': {
      borderColor: theme.palette.error.main,
      boxShadow: `0 0 10px rgba(207, 102, 121, 0.5)`,
    },
    '&.Mui-error.Mui-focused fieldset': {
      borderColor: theme.palette.error.main,
      boxShadow: `0 0 15px rgba(207, 102, 121, 0.6)`,
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-focused': {
      color: theme.palette.neon.blue,
    },
    '&.Mui-error': {
      color: theme.palette.error.main,
    },
  },
  '& .MuiOutlinedInput-input': {
    color: theme.palette.text.primary,
    padding: '14px 16px',
    '&::placeholder': {
      color: 'rgba(255, 255, 255, 0.5)',
      opacity: 1,
    },
  },
  '& .MuiFormHelperText-root': {
    marginLeft: 4,
    marginRight: 4,
    '&.Mui-error': {
      color: theme.palette.error.main,
    },
  },
}));

interface NeonInputProps extends Omit<TextFieldProps, 'variant'> {
  neonColor?: 'blue' | 'cyan' | 'purple' | 'pink';
}

const NeonInput: React.FC<NeonInputProps> = ({ 
  neonColor = 'blue', 
  ...props 
}) => {
  return (
    <StyledTextField
      {...props}
      variant="outlined"
      fullWidth
    />
  );
};

export default NeonInput;