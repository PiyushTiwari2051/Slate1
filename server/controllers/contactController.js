import { sendContactConfirmation } from '../services/emailService.js';
import asyncHandler from '../utils/asyncHandler.js';

// POST /api/contact
export const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;
  
  // Triggers email confirmation and support receipt
  await sendContactConfirmation(email, name, message);
  
  res.status(200).json({
    success: true,
    message: 'Message sent! We have sent a confirmation email to your address.'
  });
});
