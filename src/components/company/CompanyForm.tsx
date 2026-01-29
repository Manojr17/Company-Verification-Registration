import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import {
  Business,
  LocationOn,
  Web,
  Description,
  Groups,
  CalendarToday,
  CloudUpload,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  setRegistrationStep,
  updateRegistrationData,
  clearRegistrationData,
  setLoading,
} from '../../store/slices/companySlice';
import { apiClient } from '../../services/api';
import { toast } from 'react-toastify';
import NeonInput from '../common/NeonInput';
import NeonButton from '../common/NeonButton';
import LoadingSpinner from '../common/LoadingSpinner';

interface CompanyFormData {
  companyName: string;
  companyType: string;
  industry: string;
  registrationNumber: string;
  taxId: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  website: string;
  description: string;
  employeeCount: number;
  foundedYear: number;
}

const steps = ['Basic Information', 'Address Details', 'Additional Information'];

const companyTypes = [
  'Corporation',
  'LLC',
  'Partnership',
  'Sole Proprietorship',
  'Non-Profit',
  'Other',
];

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Consulting',
  'Real Estate',
  'Transportation',
  'Other',
];

const CompanyForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { registrationStep, registrationData, isLoading } = useSelector(
    (state: RootState) => state.company
  );

  const [logoUrl, setLogoUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<CompanyFormData>({
    defaultValues: registrationData,
  });

  const handleNext = async () => {
    const fieldsToValidate = getFieldsForStep(registrationStep);
    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      const currentData = getValues();
      dispatch(updateRegistrationData(currentData));
      dispatch(setRegistrationStep(registrationStep + 1));
    }
  };

  const handleBack = () => {
    const currentData = getValues();
    dispatch(updateRegistrationData(currentData));
    dispatch(setRegistrationStep(registrationStep - 1));
  };

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 1:
        return ['companyName', 'companyType', 'industry'];
      case 2:
        return ['address', 'city', 'state', 'country', 'postalCode'];
      case 3:
        return [];
      default:
        return [];
    }
  };

  const onSubmit = async (data: CompanyFormData) => {
    dispatch(setLoading(true));

    try {
      const companyData = {
        ...data,
        logoUrl,
        bannerUrl,
      };

      await apiClient.registerCompany(companyData);
      dispatch(clearRegistrationData());
      toast.success('Company registered successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Company registration error:', error);
      toast.error(error.message || 'Failed to register company. Please try again.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const uploadToCloudinary = async (file: File, type: 'logo' | 'banner') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );

      const data = await response.json();
      if (type === 'logo') {
        setLogoUrl(data.secure_url);
      } else {
        setBannerUrl(data.secure_url);
      }
      toast.success(`${type} uploaded successfully!`);
    } catch (error) {
      toast.error(`Failed to upload ${type}. Please try again.`);
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
        py: 4,
        px: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 800,
          mx: 'auto',
          background: 'rgba(10, 21, 37, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 247, 255, 0.2)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" align="center" sx={{ mb: 1, color: '#00f7ff' }}>
            Company Registration
          </Typography>
          <Typography variant="body2" align="center" sx={{ mb: 4, opacity: 0.8 }}>
            Complete the form to register your company
          </Typography>

          <Stepper activeStep={registrationStep - 1} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel
                  sx={{
                    '& .MuiStepLabel-label': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiStepLabel-label.Mui-active': {
                      color: '#00f7ff',
                    },
                    '& .MuiStepIcon-root': {
                      color: 'rgba(255, 255, 255, 0.3)',
                    },
                    '& .MuiStepIcon-root.Mui-active': {
                      color: '#00f7ff',
                    },
                    '& .MuiStepIcon-root.Mui-completed': {
                      color: '#00f7ff',
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <form onSubmit={handleSubmit(onSubmit)}>
            {registrationStep === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <NeonInput
                    label="Company Name"
                    {...register('companyName', {
                      required: 'Company name is required',
                      minLength: { value: 2, message: 'Minimum 2 characters' },
                    })}
                    error={!!errors.companyName}
                    helperText={errors.companyName?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Business sx={{ color: '#00f7ff' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <NeonInput
                    select
                    label="Company Type"
                    {...register('companyType', { required: 'Company type is required' })}
                    error={!!errors.companyType}
                    helperText={errors.companyType?.message}
                  >
                    {companyTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </NeonInput>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <NeonInput
                    select
                    label="Industry"
                    {...register('industry', { required: 'Industry is required' })}
                    error={!!errors.industry}
                    helperText={errors.industry?.message}
                  >
                    {industries.map((industry) => (
                      <MenuItem key={industry} value={industry}>
                        {industry}
                      </MenuItem>
                    ))}
                  </NeonInput>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <NeonInput
                    label="Registration Number (Optional)"
                    {...register('registrationNumber')}
                    error={!!errors.registrationNumber}
                    helperText={errors.registrationNumber?.message}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <NeonInput
                    label="Tax ID (Optional)"
                    {...register('taxId')}
                    error={!!errors.taxId}
                    helperText={errors.taxId?.message}
                  />
                </Grid>
              </Grid>
            )}

            {registrationStep === 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <NeonInput
                    label="Address"
                    {...register('address', { required: 'Address is required' })}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn sx={{ color: '#00f7ff' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <NeonInput
                    label="City"
                    {...register('city', { required: 'City is required' })}
                    error={!!errors.city}
                    helperText={errors.city?.message}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <NeonInput
                    label="State/Province"
                    {...register('state', { required: 'State is required' })}
                    error={!!errors.state}
                    helperText={errors.state?.message}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <NeonInput
                    label="Country"
                    {...register('country', { required: 'Country is required' })}
                    error={!!errors.country}
                    helperText={errors.country?.message}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <NeonInput
                    label="Postal Code"
                    {...register('postalCode', { required: 'Postal code is required' })}
                    error={!!errors.postalCode}
                    helperText={errors.postalCode?.message}
                  />
                </Grid>
              </Grid>
            )}

            {registrationStep === 3 && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <NeonInput
                    label="Website (Optional)"
                    type="url"
                    {...register('website')}
                    error={!!errors.website}
                    helperText={errors.website?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Web sx={{ color: '#00f7ff' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <NeonInput
                    label="Company Description (Optional)"
                    multiline
                    rows={4}
                    {...register('description')}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                          <Description sx={{ color: '#00f7ff' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <NeonInput
                    label="Employee Count (Optional)"
                    type="number"
                    {...register('employeeCount', { 
                      min: { value: 1, message: 'Must be at least 1' } 
                    })}
                    error={!!errors.employeeCount}
                    helperText={errors.employeeCount?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Groups sx={{ color: '#00f7ff' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <NeonInput
                    label="Founded Year (Optional)"
                    type="number"
                    {...register('foundedYear', {
                      min: { value: 1800, message: 'Invalid year' },
                      max: { value: new Date().getFullYear(), message: 'Invalid year' },
                    })}
                    error={!!errors.foundedYear}
                    helperText={errors.foundedYear?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarToday sx={{ color: '#00f7ff' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2, color: '#00f7ff' }}>
                    Upload Images (Optional)
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <NeonButton
                      component="label"
                      startIcon={<CloudUpload />}
                    >
                      Upload Logo
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadToCloudinary(file, 'logo');
                        }}
                      />
                    </NeonButton>

                    <NeonButton
                      component="label"
                      startIcon={<CloudUpload />}
                    >
                      Upload Banner
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadToCloudinary(file, 'banner');
                        }}
                      />
                    </NeonButton>
                  </Box>
                </Grid>
              </Grid>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <NeonButton
                onClick={handleBack}
                disabled={registrationStep === 1}
                variant="outlined"
              >
                Back
              </NeonButton>

              {registrationStep < steps.length ? (
                <NeonButton onClick={handleNext} variant="contained">
                  Next
                </NeonButton>
              ) : (
                <NeonButton type="submit" variant="contained">
                  Register Company
                </NeonButton>
              )}
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CompanyForm;