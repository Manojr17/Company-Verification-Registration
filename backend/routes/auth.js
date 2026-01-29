import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { verifyFirebaseToken } from '../middleware/auth.js';
import { validateUserRegistration, sanitizeInput } from '../middleware/validation.js';

const router = express.Router();

// Register new user
router.post('/register', 
  verifyFirebaseToken,
  sanitizeInput('firstName'),
  sanitizeInput('lastName'),
  validateUserRegistration,
  registerUser
);

// Login user
router.post('/login', 
  verifyFirebaseToken,
  loginUser
);

export default router;