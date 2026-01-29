import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Business,
  Email,
  Phone,
  LocationOn,
  Web,
  Groups,
  CalendarToday,
  Verified,
  Warning,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { RootState } from '../../store';
import { apiClient } from '../../services/api';
import NeonButton from '../common/NeonButton';
import LoadingSpinner from '../common/LoadingSpinner';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const {
    data: profileData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['company-profile'],
    queryFn: () => apiClient.getCompanyProfile(),
    retry: false,
  });

  const hasCompany = profileData?.company;

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error && !profileData) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #010a1f 0%, #0a1525 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Card sx={{ maxWidth: 500, width: '100%', textAlign: 'center' }}>
          <CardContent sx={{ p: 4 }}>
            <Business sx={{ fontSize: 64, color: '#00f7ff', mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2, color: '#00f7ff' }}>
              Welcome to Your Dashboard
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, opacity: 0.8 }}>
              It looks like you haven't registered your company yet. Let's get started!
            </Typography>
            <NeonButton
              variant="contained"
              size="large"
              onClick={() => navigate('/company/register')}
            >
              Register Your Company
            </NeonButton>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #010a1f 0%, #0a1525 100%)',
        p: 3,
      }}
    >
      <Typography variant="h4" sx={{ mb: 4, color: '#00f7ff' }}>
        Company Dashboard
      </Typography>

      <Grid container spacing={4}>
        {/* User Profile Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: '#00f7ff',
                    color: '#010a1f',
                    mr: 2,
                  }}
                >
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {user?.firstName} {user?.lastName}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    Account Owner
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Email sx={{ color: '#00f7ff' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={user?.email}
                    secondary="Email"
                  />
                  {user?.emailVerified && (
                    <Verified sx={{ color: '#4caf50', ml: 1 }} />
                  )}
                </ListItem>

                {user?.phoneNumber && (
                  <ListItem>
                    <ListItemIcon>
                      <Phone sx={{ color: '#00f7ff' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={user.phoneNumber}
                      secondary="Phone"
                    />
                    {user?.phoneVerified && (
                      <Verified sx={{ color: '#4caf50', ml: 1 }} />
                    )}
                  </ListItem>
                )}
              </List>

              <Box sx={{ mt: 3 }}>
                <NeonButton
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/profile')}
                >
                  Edit Profile
                </NeonButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Company Information */}
        <Grid item xs={12} md={8}>
          {hasCompany ? (
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {profileData.company.logoUrl ? (
                      <Avatar
                        src={profileData.company.logoUrl}
                        sx={{ width: 64, height: 64, mr: 2 }}
                      />
                    ) : (
                      <Avatar
                        sx={{
                          width: 64,
                          height: 64,
                          bgcolor: '#00f7ff',
                          color: '#010a1f',
                          mr: 2,
                        }}
                      >
                        {profileData.company.companyName?.[0]}
                      </Avatar>
                    )}
                    <Box>
                      <Typography variant="h5" sx={{ color: '#00f7ff' }}>
                        {profileData.company.companyName}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Chip
                          label={profileData.company.companyType}
                          size="small"
                          sx={{ bgcolor: 'rgba(0, 247, 255, 0.2)' }}
                        />
                        <Chip
                          label={profileData.company.industry}
                          size="small"
                          sx={{ bgcolor: 'rgba(187, 134, 252, 0.2)' }}
                        />
                        {profileData.company.isVerified ? (
                          <Chip
                            icon={<Verified />}
                            label="Verified"
                            size="small"
                            sx={{ bgcolor: 'rgba(76, 175, 80, 0.2)' }}
                          />
                        ) : (
                          <Chip
                            icon={<Warning />}
                            label="Pending Verification"
                            size="small"
                            sx={{ bgcolor: 'rgba(255, 183, 77, 0.2)' }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>

                  <NeonButton
                    variant="outlined"
                    onClick={() => navigate('/company/edit')}
                  >
                    Edit Company
                  </NeonButton>
                </Box>

                {profileData.company.description && (
                  <Typography variant="body1" sx={{ mb: 3, opacity: 0.8 }}>
                    {profileData.company.description}
                  </Typography>
                )}

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <List dense>
                      {profileData.company.address && (
                        <ListItem>
                          <ListItemIcon>
                            <LocationOn sx={{ color: '#00f7ff' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={`${profileData.company.address}, ${profileData.company.city}`}
                            secondary={`${profileData.company.state}, ${profileData.company.country} ${profileData.company.postalCode}`}
                          />
                        </ListItem>
                      )}

                      {profileData.company.website && (
                        <ListItem>
                          <ListItemIcon>
                            <Web sx={{ color: '#00f7ff' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={profileData.company.website}
                            secondary="Website"
                          />
                        </ListItem>
                      )}
                    </List>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <List dense>
                      {profileData.company.employeeCount && (
                        <ListItem>
                          <ListItemIcon>
                            <Groups sx={{ color: '#00f7ff' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={`${profileData.company.employeeCount} employees`}
                            secondary="Company Size"
                          />
                        </ListItem>
                      )}

                      {profileData.company.foundedYear && (
                        <ListItem>
                          <ListItemIcon>
                            <CalendarToday sx={{ color: '#00f7ff' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={profileData.company.foundedYear}
                            secondary="Founded"
                          />
                        </ListItem>
                      )}
                    </List>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Business sx={{ fontSize: 64, color: '#00f7ff', mb: 2 }} />
                <Typography variant="h5" sx={{ mb: 2, color: '#00f7ff' }}>
                  No Company Registered
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, opacity: 0.8 }}>
                  Complete your company registration to access all features and verify your business.
                </Typography>
                <NeonButton
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/company/register')}
                >
                  Register Your Company
                </NeonButton>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;