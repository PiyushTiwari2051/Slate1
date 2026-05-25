import transporter from '../config/nodemailer.js';

const emailWrapper = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <style>
    body { margin: 0; padding: 0; background: #0E0F11; font-family: 'Helvetica Neue', Arial, sans-serif; }
    .container { max-width: 520px; margin: 40px auto; background: #141518; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.06); }
    .header { background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); padding: 32px; text-align: center; }
    .header h1 { color: #0E0F11; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
    .body { padding: 40px 32px; }
    .body p { color: #A1A1AA; line-height: 1.7; margin: 0 0 16px; font-size: 15px; }
    .otp-box { background: #1C1D21; border: 1px solid rgba(245,158,11,0.3); border-radius: 12px; padding: 24px; text-align: center; margin: 28px 0; }
    .otp-code { font-family: 'Courier New', monospace; font-size: 40px; font-weight: 700; color: #F59E0B; letter-spacing: 8px; }
    .footer { border-top: 1px solid rgba(255,255,255,0.06); padding: 24px 32px; text-align: center; }
    .footer p { color: #52525B; font-size: 12px; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>✓ TaskFlow</h1></div>
    <div class="body">${content}</div>
    <div class="footer"><p>© ${new Date().getFullYear()} TaskFlow. This is an automated email.</p></div>
  </div>
</body>
</html>`;

export const sendOTPEmail = async (email, name, otp) => {
  const content = `
    <p>Hi <strong style="color:#F4F4F5">${name}</strong>,</p>
    <p>Welcome to <strong style="color:#F59E0B">TaskFlow</strong>! Use the code below to verify your email address.</p>
    <div class="otp-box">
      <div class="otp-code">${otp}</div>
      <p style="color:#52525B; font-size:13px; margin-top:12px">Expires in 10 minutes</p>
    </div>
    <p style="color:#52525B; font-size:13px">If you did not create an account, please ignore this email.</p>`;
  
  await transporter.sendMail({
    from: `"TaskFlow" <${process.env.EMAIL_USER || 'no-reply@taskflow.com'}>`,
    to: email,
    subject: 'Your TaskFlow verification code',
    html: emailWrapper(content)
  });
};

export const sendWelcomeEmail = async (email, name) => {
  const content = `
    <p>Hi <strong style="color:#F4F4F5">${name}</strong>,</p>
    <p>Your email has been verified! 🎉 You can now login and start managing your tasks.</p>
    <p>TaskFlow helps you stay on top of everything — organize by priority, track progress, and never miss a deadline.</p>`;
  
  await transporter.sendMail({
    from: `"TaskFlow" <${process.env.EMAIL_USER || 'no-reply@taskflow.com'}>`,
    to: email,
    subject: 'Welcome to TaskFlow! 🚀',
    html: emailWrapper(content)
  });
};

export const sendContactConfirmation = async (email, name, message) => {
  const content = `
    <p>Hi <strong style="color:#F4F4F5">${name}</strong>,</p>
    <p>We received your message and will get back to you within 24 hours.</p>
    <div class="otp-box" style="text-align:left">
      <p style="color:#F4F4F5; font-size:14px; margin:0; font-style:italic">"${message}"</p>
    </div>`;
  
  await transporter.sendMail({
    from: `"TaskFlow" <${process.env.EMAIL_USER || 'no-reply@taskflow.com'}>`,
    to: email,
    subject: 'We got your message — TaskFlow Support',
    html: emailWrapper(content)
  });
};

export const sendResetPasswordEmail = async (email, name, resetUrl) => {
  const content = `
    <p>Hi <strong style="color:#F4F4F5">${name}</strong>,</p>
    <p>We received a request to reset your TaskFlow password.</p>
    <p>Click the link/button below to choose a new password. This link will expire in 10 minutes.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" style="background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); color: #0E0F11; padding: 14px 28px; font-weight: bold; text-decoration: none; border-radius: 8px; display: inline-block;">Reset Password</a>
    </div>
    <p style="color:#52525B; font-size:13px; text-align: center;">Or copy and paste this URL into your browser:<br/>
      <a href="${resetUrl}" style="color: #F59E0B; word-break: break-all;">${resetUrl}</a>
    </p>
    <p style="color:#52525B; font-size:13px">If you didn't request a password reset, you can safely ignore this email.</p>`;
  
  await transporter.sendMail({
    from: `"TaskFlow" <${process.env.EMAIL_USER || 'no-reply@taskflow.com'}>`,
    to: email,
    subject: 'Reset your TaskFlow password',
    html: emailWrapper(content)
  });
};
