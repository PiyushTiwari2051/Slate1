import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import { authService } from '../services/authService';
import { useToast } from '../hooks/useToast';
import OTPInput from '../components/auth/OTPInput';

export const OTPVerify = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  
  // Circular ring calculations
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / 600) * circumference;

  useEffect(() => {
    if (!email) {
      toast.error('Invalid request. Email parameter is required.');
      navigate('/signup');
      return;
    }
  }, [email, navigate, toast]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Mask Email (e.g., john@gmail.com -> j***@gmail.com)
  const maskEmail = (mail) => {
    const parts = mail.split('@');
    if (parts.length !== 2) return mail;
    const name = parts[0];
    const domain = parts[1];
    if (name.length <= 2) return `${name[0]}***@${domain}`;
    return `${name[0]}${Array(name.length - 2).fill('*').join('')}${name[name.length - 1]}@${domain}`;
  };

  const handleVerify = useCallback(async (codeValue = otp) => {
    if (codeValue.length !== 6) return;
    setLoading(true);
    try {
      const data = await authService.verifyOTP(email, codeValue);
      toast.success(data.message || 'Verification successful!');
      navigate('/login?verified=true');
    } catch (error) {
      const message = error.response?.data?.message || 'Verification failed. Invalid OTP.';
      toast.error(message);
      setOtp(''); // Reset input box
    } finally {
      setLoading(false);
    }
  }, [email, navigate, toast, otp]);

  const handleResend = async () => {
    if (timeLeft > 0) return;
    setResending(true);
    try {
      const data = await authService.resendOTP(email);
      toast.success(data.message || 'A new verification OTP has been sent.');
      setTimeLeft(600); // Reset timer to 10 minutes
      setOtp('');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to resend OTP.';
      toast.error(message);
    } finally {
      setResending(false);
    }
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // Auto-submit OTP when 6 characters are filled
  useEffect(() => {
    if (otp.length === 6) {
      const timer = setTimeout(() => {
        handleVerify(otp);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [otp, handleVerify]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-bg-primary">
      {/* Background glow decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <div className="absolute top-[35%] left-[35%] w-[30%] h-[30%] bg-accent-amber/5 rounded-full blur-[90px]" />
      </div>

      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-bg-secondary border border-border-subtle shadow-card select-none flex flex-col items-center">
        <div className="w-12 h-12 rounded-xl bg-accent-amber/10 border border-accent-amber/20 text-accent-amber flex items-center justify-center mb-6">
          <ShieldCheck className="w-6 h-6" />
        </div>
        
        <h2 className="text-2xl font-bold text-text-primary tracking-tight font-display text-center mb-2">
          Verify your email
        </h2>
        <p className="text-sm text-text-secondary text-center mb-6 max-w-sm">
          We have sent a verification code to <span className="font-mono text-text-primary font-semibold">{maskEmail(email)}</span>.
        </p>

        {/* OTP Input Fields grid */}
        <div className="w-full mb-8">
          <OTPInput 
            value={otp} 
            onChange={setOtp} 
            disabled={loading} 
          />
        </div>

        {/* Countdown timer circle */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="relative flex items-center justify-center w-24 h-24">
            <svg className="w-full h-full transform -rotate-90 select-none">
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-border-subtle"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r={radius}
                className={`transition-all duration-1000 ${timeLeft < 60 ? 'stroke-accent-red animate-ring-pulse' : 'stroke-accent-amber'}`}
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <span className="absolute font-mono font-bold text-sm text-text-primary">
              {formatTime(timeLeft)}
            </span>
          </div>
          <span className="text-xs text-text-muted font-medium">Verification Code Expires</span>
        </div>

        {/* Verification action bottom bar */}
        <div className="w-full border-t border-border-subtle pt-6 flex justify-between items-center text-sm">
          <button
            onClick={() => navigate('/signup')}
            className="flex items-center gap-1.5 font-semibold text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            disabled={loading}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Signup
          </button>
          
          <button
            onClick={handleResend}
            disabled={timeLeft > 0 || resending || loading}
            className={`flex items-center gap-1.5 font-semibold transition-colors cursor-pointer
              ${timeLeft > 0 
                ? 'text-text-muted cursor-not-allowed' 
                : 'text-accent-amber hover:text-opacity-80'}`}
          >
            {resending ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerify;
