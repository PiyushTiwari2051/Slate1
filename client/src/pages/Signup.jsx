import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { authService } from '../services/authService';
import { useToast } from '../hooks/useToast';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import PasswordStrength from '../components/auth/PasswordStrength';

export const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const tempErrors = {};
    if (!name.trim()) tempErrors.name = 'Full Name is required';
    else if (name.trim().length < 2) tempErrors.name = 'Name must be at least 2 characters';
    
    if (!email.trim()) tempErrors.email = 'Email Address is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) tempErrors.email = 'Please enter a valid email address';
    
    if (!password) tempErrors.password = 'Password is required';
    else if (password.length < 8) tempErrors.password = 'Password must be at least 8 characters';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await authService.register(name, email, password);
      toast.success(data.message || 'Verification OTP sent to your email!');
      
      // Auto-redirect to OTP verification screen after 2 seconds
      setTimeout(() => {
        navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
      setErrors({ api: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-bg-primary">
      {/* Left Decorative Section (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-bg-secondary border-r border-border-subtle items-center justify-center p-12 overflow-hidden select-none">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] bg-accent-amber/5 rounded-full blur-[80px]" />
          <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-accent-purple/5 rounded-full blur-[80px]" />
        </div>
        <div className="relative z-10 max-w-md flex flex-col text-left">
          <div className="w-12 h-12 rounded-xl bg-accent-amber/10 border border-accent-amber/20 text-accent-amber flex items-center justify-center mb-6">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-text-primary tracking-tight font-display mb-4">
            Security by Design.
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-6">
            We enforce strict email ownership checks via cryptographically signed OTP verification tokens to keep your lists isolated and safe.
          </p>
          <blockquote className="border-l-2 border-accent-amber pl-4 italic text-xs text-text-muted">
            "Simple things should be simple, complex things should be possible." — Alan Kay
          </blockquote>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md flex flex-col">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-text-primary tracking-tight font-display">
              Create an account
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Start organizing your workflow with Slate today.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Full Name"
              icon={User}
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors(prev => ({ ...prev, name: '' }));
              }}
              error={errors.name}
              disabled={loading}
              required
            />
            
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
              error={errors.email}
              disabled={loading}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                icon={Lock}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors(prev => ({ ...prev, password: '' }));
                }}
                error={errors.password}
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-text-muted hover:text-text-primary transition-colors focus:outline-none cursor-pointer"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <PasswordStrength password={password} />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="mt-2 w-full animate-glow-pulse"
            >
              Register Account
            </Button>
          </form>

          <p className="text-sm text-text-secondary text-center mt-6 select-none">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-accent-amber hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
