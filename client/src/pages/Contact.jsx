import { useState } from 'react';
import { Mail, User, BookOpen, MessageSquare, CheckCircle, Github, Linkedin } from 'lucide-react';
import { taskService } from '../services/taskService';
import { useToast } from '../hooks/useToast';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export const Contact = () => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const tempErrors = {};
    if (!name.trim()) tempErrors.name = 'Name is required';
    if (!email.trim()) tempErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) tempErrors.email = 'Please enter a valid email address';
    if (!message.trim()) tempErrors.message = 'Message cannot be empty';
    else if (message.length > 500) tempErrors.message = 'Message cannot exceed 500 characters';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await taskService.submitContact({ name, email, subject, message });
      toast.success('Your message has been sent successfully!');
      setSubmitted(true);
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to submit form. Please try again.';
      toast.error(msg);
      setErrors({ api: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 flex-1 flex flex-col justify-center bg-bg-primary">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start animate-fade-in-up">
        {/* Left Column - Details */}
        <div className="flex flex-col text-left max-w-lg select-none">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-xs font-semibold font-mono uppercase tracking-wider mb-6 w-fit">
            <MessageSquare className="w-3.5 h-3.5" />
            Support center
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-extrabold text-text-primary tracking-tight font-display mb-4">
            We'd love to hear from you.
          </h1>
          
          <p className="text-text-secondary leading-relaxed text-sm mb-8">
            Have questions about Slate? Found a bug? Send us a message and we'll get back to you within 24 hours.
          </p>
          
          <div className="flex flex-col gap-6 text-sm text-text-secondary border-t border-border-subtle pt-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-bg-tertiary flex items-center justify-center text-accent-amber border border-border-subtle">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-text-primary">Email Support</p>
                <p className="text-xs text-text-muted">support@slateapp.com</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-bg-tertiary flex items-center justify-center text-accent-purple border border-border-subtle">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-text-primary">Social Links</p>
                <div className="flex items-center gap-3 mt-1 text-text-muted">
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-accent-amber transition-colors flex items-center gap-1 text-xs">
                    <Github className="w-3.5 h-3.5" /> GitHub
                  </a>
                  <span className="text-border-subtle">•</span>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-accent-amber transition-colors flex items-center gap-1 text-xs">
                    <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Contact Form */}
        <div className="p-8 rounded-2xl bg-bg-secondary border border-border-subtle shadow-card relative">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in-up">
              <div className="w-16 h-16 rounded-full bg-accent-green/10 text-accent-green flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 animate-pop" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">Message sent!</h3>
              <p className="text-sm text-text-secondary leading-relaxed max-w-sm mb-6">
                Thank you, <strong className="text-text-primary">{name}</strong>. We received your message and sent a confirmation email to <strong className="text-text-primary">{email}</strong>.
              </p>
              <Button
                variant="secondary"
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setEmail('');
                  setMessage('');
                  setSubject('General');
                }}
              >
                Send another message
              </Button>
            </div>
          ) : (
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

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-semibold font-mono uppercase tracking-wider text-text-muted">
                  Subject Category
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-bg-tertiary border border-border-subtle text-text-primary text-sm rounded-md px-4 py-3 outline-none focus:border-accent-amber focus:ring-2 focus:ring-accent-amber-glow"
                  disabled={loading}
                >
                  <option value="General">General Inquiry</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 text-left relative">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold font-mono uppercase tracking-wider text-text-muted">
                    Message
                  </label>
                  <span className={`text-[10px] font-mono ${message.length > 500 ? 'text-accent-red' : 'text-text-muted'}`}>
                    {message.length}/500
                  </span>
                </div>
                <textarea
                  placeholder="Tell us what you need help with..."
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    setErrors(prev => ({ ...prev, message: '' }));
                  }}
                  maxLength={500}
                  className={`w-full bg-bg-tertiary border text-text-primary text-sm rounded-md px-4 py-3 outline-none h-32 resize-none transition-all duration-200
                    ${errors.message ? 'border-accent-red focus:ring-1 focus:ring-accent-red' : 'border-border-subtle focus:border-accent-amber focus:ring-2 focus:ring-accent-amber-glow'}`}
                  disabled={loading}
                  required
                />
                {errors.message && (
                  <span className="text-xs text-accent-red animate-fade-in-up font-medium mt-0.5">
                    {errors.message}
                  </span>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full animate-glow-pulse mt-2"
              >
                Send Message
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
