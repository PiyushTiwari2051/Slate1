import User from '../models/User.js';
import { generateOTP } from '../utils/generateOTP.js';
import { generateToken } from '../utils/generateToken.js';
import { sendOTPEmail, sendWelcomeEmail, sendResetPasswordEmail } from '../services/emailService.js';
import asyncHandler from '../utils/asyncHandler.js';
import crypto from 'crypto';

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if email already registered
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    if (existingUser.isVerified) {
      return res.status(409).json({ success: false, message: 'Email already registered. Please login.' });
    }
    // Allow re-registration for unverified users — send new OTP
    const otp = generateOTP();
    existingUser.otp = {
      code: crypto.createHash('sha256').update(otp).digest('hex'),  // Hash OTP before storing
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),  // 10 minutes
      attempts: 0
    };
    existingUser.name = name;
    existingUser.password = password; // pre-save hook will hash it
    await existingUser.save();
    
    await sendOTPEmail(email, name, otp);
    let msg = 'New OTP sent to your email.';
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      msg += ` [DEMO OTP: ${otp}]`;
    }
    return res.status(200).json({ success: true, message: msg, email });
  }

  // Generate and hash OTP
  const otp = generateOTP();
  const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');

  const user = await User.create({
    name,
    email,
    password,
    otp: {
      code: hashedOTP,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      attempts: 0
    }
  });

  await sendOTPEmail(email, name, otp);

  let msg = 'Account created! Please check your email for the verification OTP.';
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    msg += ` [DEMO OTP: ${otp}]`;
  }

  res.status(201).json({
    success: true,
    message: msg,
    email
  });
});

// POST /api/auth/verify-otp
export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email }).select('+otp.code +otp.expiresAt +otp.attempts');
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
  if (user.isVerified) return res.status(400).json({ success: false, message: 'Account already verified.' });

  // Check OTP attempts (max 5)
  if (user.otp.attempts >= 5) {
    return res.status(429).json({ success: false, message: 'Too many attempts. Please request a new OTP.' });
  }

  // Check expiry
  if (user.otp.expiresAt < new Date()) {
    return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new OTP.' });
  }

  // Compare hashed OTP
  const hashedInput = crypto.createHash('sha256').update(otp).digest('hex');
  if (hashedInput !== user.otp.code) {
    user.otp.attempts += 1;
    await user.save();
    const remaining = 5 - user.otp.attempts;
    if (remaining <= 0) {
      return res.status(429).json({ success: false, message: 'Too many incorrect attempts. Please request a new OTP.' });
    }
    return res.status(400).json({ success: false, message: `Invalid OTP. ${remaining} attempt(s) remaining.` });
  }

  // Mark verified and clear OTP
  user.isVerified = true;
  user.otp = undefined; // Mongoose will clear this subdocument/object if undefined
  await user.save();

  await sendWelcomeEmail(user.email, user.name);

  res.status(200).json({ success: true, message: 'Email verified successfully! You can now login.' });
});

// POST /api/auth/resend-otp
export const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
  if (user.isVerified) return res.status(400).json({ success: false, message: 'Account already verified.' });

  const otp = generateOTP();
  user.otp = {
    code: crypto.createHash('sha256').update(otp).digest('hex'),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    attempts: 0
  };
  await user.save();

  await sendOTPEmail(user.email, user.name, otp);
  let msg = 'A new OTP has been sent to your email.';
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    msg += ` [DEMO OTP: ${otp}]`;
  }
  res.status(200).json({ success: true, message: msg });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials.' });

  if (!user.isVerified) {
    return res.status(403).json({ success: false, message: 'Please verify your email before logging in.', requiresVerification: true, email });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials.' });

  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Login successful!',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      initials: user.initials,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    }
  });
});

// GET /api/auth/me (Protected)
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, user });
});

// POST /api/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    // Return success to avoid email enumeration, but do nothing
    return res.status(200).json({ success: true, message: 'If the email exists, a password reset link has been sent.' });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  // Hash token and store in user model with 10 mins expiry
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  // Create reset URL
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

  try {
    await sendResetPasswordEmail(user.email, user.name, resetUrl);
    res.status(200).json({ success: true, message: 'Password reset link sent to your email.' });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return res.status(500).json({ success: false, message: 'Email could not be sent. Please try again.' });
  }
});

// PUT /api/auth/reset-password/:resetToken
export const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  
  // Hash token from param to match database
  const hashedToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ success: false, message: 'Invalid or expired reset token.' });
  }

  // Set new password
  user.password = password; // pre-save hook will hash this
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({ success: true, message: 'Password reset successful! You can now login.' });
});

// PUT /api/auth/profile (Protected)
export const updateProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name || name.trim().length < 2) {
    return res.status(400).json({ success: false, message: 'Name must be at least 2 characters.' });
  }

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

  user.name = name;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully!',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      initials: user.initials,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    }
  });
});

