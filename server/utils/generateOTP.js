import crypto from 'crypto';

export const generateOTP = () => {
  // Cryptographically secure 6-digit OTP
  return String(crypto.randomInt(100000, 999999));
};
