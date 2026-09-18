import rateLimit from 'express-rate-limit';

export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs for write/admin endpoints
  message: 'Too many requests from this IP to this endpoint, please try again after 15 minutes',
});
