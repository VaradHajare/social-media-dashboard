// middleware/validation.js
const { body, validationResult } = require('express-validator');

// Validation rules
const authValidation = {
  register: [
    body('username')
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage('Username must be between 3 and 50 characters')
      .isAlphanumeric()
      .withMessage('Username must contain only letters and numbers'),
    
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    
    body('firstName')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('First name must be between 1 and 50 characters'),
    
    body('lastName')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Last name must be between 1 and 50 characters')
  ],
  login: [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ]
};

const postValidation = {
  create: [
    body('content')
      .trim()
      .isLength({ min: 1, max: 5000 })
      .withMessage('Content must be between 1 and 5000 characters'),
    
    body('platforms')
      .isArray({ min: 1 })
      .withMessage('At least one platform must be selected')
      .custom((platforms) => {
        const validPlatforms = ['facebook', 'instagram', 'twitter', 'linkedin'];
        const invalidPlatforms = platforms.filter(p => !validPlatforms.includes(p));
        if (invalidPlatforms.length > 0) {
          throw new Error(`Invalid platforms: ${invalidPlatforms.join(', ')}`);
        }
        return true;
      }),
    
    body('postType')
      .optional()
      .isIn(['text', 'image', 'video', 'story'])
      .withMessage('Invalid post type'),
    
    body('scheduledAt')
      .optional()
      .isISO8601()
      .withMessage('Invalid scheduled date format')
      .custom((value) => {
        if (new Date(value) <= new Date()) {
          throw new Error('Scheduled date must be in the future');
        }
        return true;
      })
  ]
};

// Validation result checker
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

module.exports = {
  authValidation,
  postValidation,
  checkValidation
};