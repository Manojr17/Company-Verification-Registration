import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Person, Phone } from '@mui/icons-material';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useDispatch } from 'react-redux';
import { loginSuccess, setLoading } from '../../store/slices/authSlice';
import { apiClient } from '../../services/api';
import { toast } from 'react-toastify';
import NeonInput from '../common/NeonInput';
import NeonButton from '../common/NeonButton';
import LoadingSpinner from '../common/LoadingSpinner';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLocalLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm<RegisterFormData>();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      });
      return;
    }

    setIsLocalLoading(true);
    dispatch(setLoading(true));

    try {
      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Send email verification
      await sendEmailVerification(userCredential.user);

      // Get Firebase ID token
      const idToken = await userCredential.user.getIdToken();

      // Register user in backend
      const response = await apiClient.registerUser(idToken, {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber || null,
        emailVerified: false,
        phoneVerified: false,
      });

      // Store user data in Redux
      dispatch(loginSuccess({
        user: response.user,
        token: response.token,
      }));

      toast.success('Registration successful! Please verify your email.');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
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
          maxWidth: 600,
          width: '100%',
          background: 'rgba(10, 21, 37, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 247, 255, 0.2)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" align="center" sx={{ mb: 1, color: '#00f7ff' }}>
            Create Account
          </Typography>
          <Typography variant="body2" align="center" sx={{ mb: 4, opacity: 0.8 }}>
            Join our platform and register your company
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <NeonInput
                  label="First Name"
                  {...register('firstName', {
                    required: 'First name is required',
                    minLength: { value: 2, message: 'Minimum 2 characters' },
                  })}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: '#00f7ff' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <NeonInput
                  label="Last Name"
                  {...register('lastName', {
                    required: 'Last name is required',
                    minLength: { value: 2, message: 'Minimum 2 characters' },
                  })}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: '#00f7ff' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

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
                  label="Phone Number (Optional)"
                  type="tel"
                  {...register('phoneNumber')}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: '#00f7ff' }} />
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
                    minLength: { value: 6, message: 'Minimum 6 characters' },
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
                <NeonInput
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === password || 'Passwords do not match',
                  })}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          sx={{ color: '#00f7ff' }}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </NeonButton>
              </Grid>
            </Grid>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Already have an account?{' '}
              <Link 
                to="/login" 
                style={{ 
                  color: '#00f7ff', 
                  textDecoration: 'none',
                  fontWeight: 500 
                }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterForm;