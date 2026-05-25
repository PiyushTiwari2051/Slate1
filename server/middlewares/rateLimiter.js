import rateLimit from 'express-rate-limit';

const isDev = process.env.NODE_ENV === 'development';

// Rate limiting — per IP
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: isDev ? 10000 : 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 1000 : 10,  // Permissive in dev, strict on auth endpoints in production
  message: { success: false, message: 'Too many auth attempts, please wait.' },
  standardHeaders: true,
  legacyHeaders: false
});
