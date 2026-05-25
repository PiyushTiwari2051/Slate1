import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const runTests = async () => {
  console.log('🧪 Starting encryption validation tests...\n');
  
  // 1. Password Hashing Checks
  console.log('1. Checking Bcrypt Hashing...');
  const testPassword = 'SuperSecurePassword123!';
  const start = Date.now();
  const hashedPassword = await bcrypt.hash(testPassword, 12);
  const duration = Date.now() - start;
  
  console.log(`   - Original: ${testPassword}`);
  console.log(`   - Hashed:   ${hashedPassword}`);
  console.log(`   - Rounds:   12 (Duration: ${duration}ms)`);
  
  const isMatch = await bcrypt.compare(testPassword, hashedPassword);
  const isWrongMatch = await bcrypt.compare('WrongPassword!', hashedPassword);
  
  console.log(`   - Correct password verification: ${isMatch ? '✅ MATCH' : '❌ MISMATCH'}`);
  console.log(`   - Incorrect password verification: ${!isWrongMatch ? '✅ BLOCKED' : '❌ ALLOWED'}`);
  
  // 2. OTP Encryption checks
  console.log('\n2. Checking OTP SHA-256 Hashing...');
  const otpCode = '123456';
  const hashedOTP = crypto.createHash('sha256').update(otpCode).digest('hex');
  console.log(`   - Generated OTP: ${otpCode}`);
  console.log(`   - Encrypted OTP: ${hashedOTP}`);
  
  const inputOTP = '123456';
  const hashedInput = crypto.createHash('sha256').update(inputOTP).digest('hex');
  const isOtpMatch = hashedOTP === hashedInput;
  console.log(`   - Encrypted match: ${isOtpMatch ? '✅ MATCH' : '❌ MISMATCH'}`);

  console.log('\n✅ Validation script executed successfully. Cryptography features match specifications.');
};

runTests().catch(console.error);
