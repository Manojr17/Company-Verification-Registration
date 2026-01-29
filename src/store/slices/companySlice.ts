import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Company {
  id: string;
  companyName: string;
  companyType?: string;
  industry?: string;
  registrationNumber?: string;
  taxId?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  website?: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  employeeCount?: number;
  foundedYear?: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface CompanyState {
  company: Company | null;
  isLoading: boolean;
  registrationStep: number;
  registrationData: Partial<Company>;
}

const initialState: CompanyState = {
  company: null,
  isLoading: false,
  registrationStep: 1,
  registrationData: {},
};

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCompany: (state, action: PayloadAction<Company>) => {
      state.company = action.payload;
      state.isLoading = false;
    },
    updateCompany: (state, action: PayloadAction<Partial<Company>>) => {
      if (state.company) {
        state.company = { ...state.company, ...action.payload };
      }
    },
    setRegistrationStep: (state, action: PayloadAction<number>) => {
      state.registrationStep = action.payload;
    },
    updateRegistrationData: (state, action: PayloadAction<Partial<Company>>) => {
      state.registrationData = { ...state.registrationData, ...action.payload };
    },
    clearRegistrationData: (state) => {
      state.registrationData = {};
      state.registrationStep = 1;
    },
  },
});

export const {
  setLoading,
  setCompany,
  updateCompany,
  setRegistrationStep,
  updateRegistrationData,
  clearRegistrationData,
} = companySlice.actions;

export default companySlice.reducer;