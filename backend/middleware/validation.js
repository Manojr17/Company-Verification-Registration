import { body, validationResult } from 'express-validator';
import sanitizeHtml from 'sanitize-html';
import { parsePhoneNumber } from 'libphonenumber-js';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

export const sanitizeInput = (field) => {
  return (req, res, next) => {
    if (req.body[field]) {
      req.body[field] = sanitizeHtml(req.body[field], {
        allowedTags: [],
        allowedAttributes: {}
      });
    }
    next();
  };
};

export const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('firstName')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('phoneNumber')
    .optional()
    .custom((value) => {
      if (value) {
        try {
          const phoneNumber = parsePhoneNumber(value);
          return phoneNumber.isValid();
        } catch {
          return false;
        }
      }
      return true;
    })
    .withMessage('Please provide a valid phone number'),
  handleValidationErrors
];

export const validateCompanyRegistration = [
  body('companyName')
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),
  body('companyType')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Company type cannot exceed 50 characters'),
  body('industry')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Industry cannot exceed 50 characters'),
  body('website')
    .optional()
    .isURL()
    .withMessage('Please provide a valid website URL'),
  body('employeeCount')
    .optional()
    .isInt({ min: 1, max: 1000000 })
    .withMessage('Employee count must be a positive integer'),
  body('foundedYear')
    .optional()
    .isInt({ min: 1800, max: new Date().getFullYear() })
    .withMessage('Founded year must be valid'),
  handleValidationErrors
];