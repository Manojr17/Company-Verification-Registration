import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    neon: {
      blue: string;
      cyan: string;
      purple: string;
      pink: string;
    };
  }

  interface PaletteOptions {
    neon?: {
      blue?: string;
      cyan?: string;
      purple?: string;
      pink?: string;
    };
  }
}

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00f7ff',
      dark: '#00d4db',
      light: '#66f9ff',
    },
    secondary: {
      main: '#bb86fc',
      dark: '#985eff',
      light: '#d7b1ff',
    },
    background: {
      default: '#010a1f',
      paper: '#0a1525',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
    error: {
      main: '#cf6679',
    },
    warning: {
      main: '#ffb74d',
    },
    info: {
      main: '#81d4fa',
    },
    success: {
      main: '#81c784',
    },
    neon: {
      blue: '#00f7ff',
      cyan: '#00ffff',
      purple: '#bb86fc',
      pink: '#ff79c6',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.2,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 0 20px rgba(0, 247, 255, 0.4)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #00f7ff 0%, #0099ff 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #00d4db 0%, #0088ee 100%)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#00f7ff',
              boxShadow: '0 0 10px rgba(0, 247, 255, 0.3)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00f7ff',
              boxShadow: '0 0 15px rgba(0, 247, 255, 0.5)',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid rgba(0, 247, 255, 0.1)',
          background: 'rgba(10, 21, 37, 0.8)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
  },
});