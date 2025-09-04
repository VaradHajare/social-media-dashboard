// middleware/auth.js
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { User } = require('../models');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'Access denied. No token provided' 
      });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findByPk(decoded.userId);

    if (!user || !user.is_active) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid token or user not found' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ 
      success: false, 
      error: 'Invalid token' 
    });
  }
};

module.exports = auth;