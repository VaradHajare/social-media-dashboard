// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs, max, message = 'Too many requests') => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      error: message
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting in test environment
      return process.env.NODE_ENV === 'test';
    }
  });
};

module.exports = {
  // General API rate limit: 100 requests per 15 minutes
  generalLimiter: createRateLimiter(
    15 * 60 * 1000, 
    100, 
    'Too many requests from this IP, please try again later'
  ),
  // Auth endpoints: 5 requests per 15 minutes
  authLimiter: createRateLimiter(
    15 * 60 * 1000, 
    5, 
    'Too many authentication attempts, please try again later'
  ),
  // Post creation: 10 requests per hour
  postLimiter: createRateLimiter(
    60 * 60 * 1000, 
    10, 
    'Too many posts created, please try again later'
  )
};