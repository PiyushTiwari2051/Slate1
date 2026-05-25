import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let transporter;

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
} else {
  console.warn('⚠️ EMAIL_USER and EMAIL_PASS environment variables are not set.');
  console.warn('⚠️ SMTP Transporter is running in CONSOLE FALLBACK MODE. All sent emails (including OTPs) will be logged to the server terminal.');
  
  transporter = {
    sendMail: async (options) => {
      console.log('\n┌────────────────────────────────────────────────────────┐');
      console.log('│                    📧 OUTGOING EMAIL                   │');
      console.log('├────────────────────────────────────────────────────────┤');
      console.log(`│ FROM:    ${options.from || 'TaskFlow'}`);
      console.log(`│ TO:      ${options.to}`);
      console.log(`│ SUBJECT: ${options.subject}`);
      console.log('├────────────────────────────────────────────────────────┤');
      console.log('│ HTML BODY:');
      
      // Clean up tags a bit for nice console output
      const cleanBody = options.html 
        ? options.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
        : options.text;
      
      console.log(`│ ${cleanBody}`);
      
      // Specially extract and print the OTP if it exists in the HTML
      const otpMatch = options.html ? options.html.match(/class="otp-code">(\d+)<\/div>/) : null;
      if (otpMatch && otpMatch[1]) {
        console.log('├────────────────────────────────────────────────────────┤');
        console.log(`│ 🔑 EXTRACTED OTP:  ${otpMatch[1]}`);
      }
      
      console.log('└────────────────────────────────────────────────────────┘\n');
      return { messageId: `mock-email-id-${Date.now()}` };
    }
  };
}

export default transporter;
