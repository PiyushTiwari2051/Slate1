import crypto from 'crypto';

export const generateOTP = () => {
  // Use static OTP in development for ease of local signup testing
  if (process.env.NODE_ENV === 'development') {
    return '123456';
  }
  // Cryptographically secure 6-digit OTP
  return String(crypto.randomInt(100000, 999999));
};
