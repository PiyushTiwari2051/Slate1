import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { useToast } from '../hooks/useToast';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check URL parameters for session expiry alerts
    const params = new URLSearchParams(location.search);
    if (params.get('expired') === 'true') {
      toast.warning('Session expired. Please log in again.');
      navigate('/login', { replace: true });
    }
    if (params.get('verified') === 'true') {
      toast.success('Email verified successfully! You can now login.');
      navigate('/login', { replace: true });
    }
  }, [location.search, toast, navigate]);

  useEffect(() => {
    // If user is already logged in, redirect them to dashboard
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const tempErrors = {};
    if (!email.trim()) tempErrors.email = 'Email Address is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) tempErrors.email = 'Please enter a valid email address';
    
    if (!password) tempErrors.password = 'Password is required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await authService.login(email, password);
      login(data.token, data.user);
      toast.success(data.message || 'Login successful!');
      
      // Navigate to destination or dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Invalid credentials.';
      const status = error.response?.status;
      
      toast.error(message);
      
      // If email verification is required, redirect to OTP verification page
      if (status === 403 && error.response?.data?.requiresVerification) {
        toast.info('Verification needed. Redirecting to verify your email.');
        setTimeout(() => {
          navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
        }, 1500);
      } else {
        setErrors({ api: message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-bg-primary">
      {/* Left Decorative Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-bg-secondary border-r border-border-subtle items-center justify-center p-12 overflow-hidden select-none">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] right-[20%] w-[35%] h-[35%] bg-accent-amber/5 rounded-full blur-[90px]" />
          <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] bg-accent-blue/5 rounded-full blur-[90px]" />
        </div>
        <div className="relative z-10 max-w-md flex flex-col text-left">
          <div className="w-12 h-12 rounded-xl bg-accent-blue/10 border border-accent-blue/20 text-accent-blue flex items-center justify-center mb-6">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-text-primary tracking-tight font-display mb-4">
            Obsidian Craft.
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-6">
            Log in to access your handcrafted board, manage items by priority, search instantly, and toggle light/dark modes seamlessly.
          </p>
          <blockquote className="border-l-2 border-accent-blue pl-4 italic text-xs text-text-muted">
            "Order and simplification are the first steps toward the mastery of a subject." — Thomas Mann
          </blockquote>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md flex flex-col">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-text-primary tracking-tight font-display">
              Welcome back
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Please enter your credentials to log in to your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Email Address"
              icon={Mail}
              type="email"
              placeholder="e.g. john@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors(prev => ({ ...prev, email: '' }));
              }}
              error={errors.email || (errors.api ? ' ' : '')}
              disabled={loading}
              required
            />

            <div className="relative">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold font-mono uppercase tracking-wider text-text-muted">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-accent-amber hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  icon={Lock}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors(prev => ({ ...prev, password: '' }));
                  }}
                  error={errors.password || (errors.api ? ' ' : '')}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[14px] text-text-muted hover:text-text-primary transition-colors focus:outline-none cursor-pointer"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between select-none">
              <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-accent-amber border-border-subtle bg-bg-tertiary rounded focus:ring-accent-amber focus:ring-opacity-20 cursor-pointer"
                  disabled={loading}
                />
                <span>Remember me</span>
              </label>
            </div>

            {errors.api && (
              <span className="text-xs text-accent-red text-center font-medium animate-fade-in-up">
                {errors.api}
              </span>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="mt-2 w-full animate-glow-pulse"
            >
              Sign In
            </Button>
          </form>

          <p className="text-sm text-text-secondary text-center mt-6 select-none">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-accent-amber hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
