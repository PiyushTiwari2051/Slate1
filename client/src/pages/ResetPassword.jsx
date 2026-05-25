import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { authService } from '../services/authService';
import { useToast } from '../hooks/useToast';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import PasswordStrength from '../components/auth/PasswordStrength';

export const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const tempErrors = {};
    if (!password) tempErrors.password = 'Password is required';
    else if (password.length < 8) tempErrors.password = 'Password must be at least 8 characters';
    
    if (password !== confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await authService.resetPassword(token, password);
      toast.success(data.message || 'Password reset successful!');
      navigate('/login?verified=true');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to reset password. The link may have expired or is invalid.';
      toast.error(message);
      setErrors({ api: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-bg-primary">
      <div className="w-full max-w-md p-8 rounded-2xl bg-bg-secondary border border-border-subtle shadow-card select-none">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-accent-amber/10 border border-accent-amber/20 text-accent-amber flex items-center justify-center mb-4">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight font-display text-center">
            Reset Password
          </h2>
          <p className="text-sm text-text-secondary text-center mt-1">
            Choose a secure new password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="relative">
            <Input
              label="New Password"
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

          <Input
            label="Confirm Password"
            icon={Lock}
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors(prev => ({ ...prev, confirmPassword: '' }));
            }}
            error={errors.confirmPassword}
            disabled={loading}
            required
          />

          <PasswordStrength password={password} />

          {errors.api && (
            <div className="flex items-start gap-2 p-3 rounded-md bg-accent-red/10 border border-accent-red/20 text-accent-red text-xs font-medium animate-fade-in-up">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errors.api}</span>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full animate-glow-pulse"
          >
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
