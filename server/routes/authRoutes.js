import express from 'express';
import { 
  register, 
  verifyOTP, 
  resendOTP, 
  login, 
  getMe, 
  forgotPassword, 
  resetPassword,
  updateProfile
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { 
  validateRegister, 
  validateVerifyOTP, 
  validateLogin, 
  validateForgotPassword, 
  validateResetPassword 
} from '../middlewares/validateRequest.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/verify-otp', validateVerifyOTP, verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.put('/reset-password/:resetToken', validateResetPassword, resetPassword);

export default router;
