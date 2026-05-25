import { useState } from 'react';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { useToast } from '../hooks/useToast';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const data = await authService.forgotPassword(email);
      toast.success(data.message || 'Password reset link sent!');
      setSubmitted(true);
    } catch (err) {
      const message = err.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-bg-primary">
      <div className="w-full max-w-md p-8 rounded-2xl bg-bg-secondary border border-border-subtle shadow-card select-none">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-accent-amber/10 border border-accent-amber/20 text-accent-amber flex items-center justify-center mb-4">
            <Send className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight font-display text-center">
            Recover Password
          </h2>
          <p className="text-sm text-text-secondary text-center mt-1">
            Enter your email to receive a password reset link.
          </p>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center gap-6 animate-fade-in-up">
            <div className="p-4 rounded-lg bg-bg-tertiary border border-border-subtle text-center text-sm text-text-secondary leading-relaxed">
              If an account with <strong className="text-text-primary">{email}</strong> is registered, we have sent a link to choose a new password. Please check your inbox.
            </div>
            <Link to="/login" className="w-full">
              <Button variant="secondary" className="w-full">
                Back to Login
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Email Address"
              icon={Mail}
              type="email"
              placeholder="e.g. john@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              error={error}
              disabled={loading}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full animate-glow-pulse"
            >
              Send Reset Link
            </Button>

            <Link
              to="/login"
              className="flex items-center justify-center gap-1.5 text-sm font-semibold text-text-secondary hover:text-text-primary transition-colors mt-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
