import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import { Visibility, VisibilityOff, Email } from '@mui/icons-material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useDispatch } from 'react-redux';
import { loginSuccess, setLoading } from '../../store/slices/authSlice';
import { apiClient } from '../../services/api';
import { toast } from 'react-toastify';
import NeonInput from '../common/NeonInput';
import NeonButton from '../common/NeonButton';
import LoadingSpinner from '../common/LoadingSpinner';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLocalLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLocalLoading(true);
    dispatch(setLoading(true));

    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Get Firebase ID token
      const idToken = await userCredential.user.getIdToken();

      // Login with backend
      const response = await apiClient.loginUser(idToken);

      // Store user data in Redux
      dispatch(loginSuccess({
        user: response.user,
        token: response.token,
      }));

      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No user found with this email address.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This user account has been disabled.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLocalLoading(false);
      dispatch(setLoading(false));
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #010a1f 0%, #0a1525 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 450,
          width: '100%',
          background: 'rgba(10, 21, 37, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 247, 255, 0.2)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" align="center" sx={{ mb: 1, color: '#00f7ff' }}>
            Welcome Back
          </Typography>
          <Typography variant="body2" align="center" sx={{ mb: 4, opacity: 0.8 }}>
            Sign in to access your company dashboard
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <NeonInput
                  label="Email Address"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: '#00f7ff' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <NeonInput
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                  })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: '#00f7ff' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <NeonButton
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </NeonButton>
              </Grid>
            </Grid>
          </form>

          <Box sx={{ mt: 3 }}>
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 3 }} />
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  style={{ 
                    color: '#00f7ff', 
                    textDecoration: 'none',
                    fontWeight: 500 
                  }}
                >
                  Create Account
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginForm;