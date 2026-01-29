import express from 'express';
import { 
  registerCompany, 
  updateCompany, 
  getCompanyProfile 
} from '../controllers/companyController.js';
import { verifyJWT } from '../middleware/auth.js';
import { 
  validateCompanyRegistration, 
  sanitizeInput 
} from '../middleware/validation.js';

const router = express.Router();

// Register new company
router.post('/register',
  verifyJWT,
  sanitizeInput('companyName'),
  sanitizeInput('description'),
  sanitizeInput('address'),
  validateCompanyRegistration,
  registerCompany
);

// Update company profile
router.put('/update',
  verifyJWT,
  sanitizeInput('companyName'),
  sanitizeInput('description'),
  sanitizeInput('address'),
  validateCompanyRegistration,
  updateCompany
);

// Get company profile
router.get('/profile',
  verifyJWT,
  getCompanyProfile
);

export default router;