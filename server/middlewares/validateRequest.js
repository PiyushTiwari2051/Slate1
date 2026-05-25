export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || name.trim().length < 2 || name.trim().length > 50) {
    return res.status(400).json({ success: false, message: 'Name must be between 2 and 50 characters' });
  }
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
  }
  if (!password || password.length < 8) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
  }
  next();
};

export const validateVerifyOTP = (req, res, next) => {
  const { email, otp } = req.body;
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Valid email is required' });
  }
  if (!otp || otp.length !== 6 || isNaN(otp)) {
    return res.status(400).json({ success: false, message: 'OTP must be a 6-digit number' });
  }
  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }
  next();
};

export const validateForgotPassword = (req, res, next) => {
  const { email } = req.body;
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Valid email is required' });
  }
  next();
};

export const validateResetPassword = (req, res, next) => {
  const { password } = req.body;
  if (!password || password.length < 8) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
  }
  next();
};

export const validateTask = (req, res, next) => {
  const { title, description, priority, status } = req.body;
  if (title !== undefined && (title.trim() === '' || title.length > 100)) {
    return res.status(400).json({ success: false, message: 'Task title must be between 1 and 100 characters' });
  }
  if (description !== undefined && description.length > 500) {
    return res.status(400).json({ success: false, message: 'Description cannot exceed 500 characters' });
  }
  if (priority !== undefined && !['Low', 'Medium', 'High'].includes(priority)) {
    return res.status(400).json({ success: false, message: 'Priority must be Low, Medium, or High' });
  }
  if (status !== undefined && !['Pending', 'In-Progress', 'Completed'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Status must be Pending, In-Progress, or Completed' });
  }
  next();
};

export const validateContact = (req, res, next) => {
  const { name, email, subject, message } = req.body;
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Name is required' });
  }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Valid email is required' });
  }
  if (!subject || !['General', 'Bug Report', 'Feature Request', 'Other'].includes(subject)) {
    return res.status(400).json({ success: false, message: 'Valid subject is required' });
  }
  if (!message || message.trim().length === 0 || message.length > 500) {
    return res.status(400).json({ success: false, message: 'Message must be between 1 and 500 characters' });
  }
  next();
};
