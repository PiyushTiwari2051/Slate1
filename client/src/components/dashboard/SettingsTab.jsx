import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { authService } from '../../services/authService';
import { useToast } from '../../hooks/useToast';
import { User, Sun, Moon, AlertTriangle, ShieldCheck, Clock, BarChart2 } from 'lucide-react';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import ConfirmDialog from '../common/ConfirmDialog';

export const SettingsTab = () => {
  const { user, updateUser } = useAuth();
  const { stats, clearAllTasks } = useTasks();
  const { toast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [clearing, setClearing] = useState(false);

  // Sync state with user context if it changes
  useEffect(() => {
    if (user?.name) {
      const timer = setTimeout(() => {
        setName(user.name);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [user]);

  // Sync state with theme updates from other components
  useEffect(() => {
    const handleThemeUpdate = () => {
      setTheme(localStorage.getItem('theme') || 'dark');
    };
    window.addEventListener('theme:update', handleThemeUpdate);
    return () => window.removeEventListener('theme:update', handleThemeUpdate);
  }, []);

  // Handle name update profile form
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      return toast.error('Name cannot be empty.');
    }
    if (name.trim().length < 2) {
      return toast.error('Name must be at least 2 characters.');
    }
    if (name.trim() === user?.name) {
      return toast.info('No changes made to display name.');
    }

    setSaving(true);
    try {
      const response = await authService.updateProfile(name.trim());
      if (response.success) {
        updateUser(response.user);
        toast.success('Display name updated successfully! 🎉');
      } else {
        toast.error(response.message || 'Failed to update profile.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  // Change and sync theme
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    const root = window.document.documentElement;
    if (newTheme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
    localStorage.setItem('theme', newTheme);
    window.dispatchEvent(new Event('theme:update'));
    toast.success(`Theme updated to ${newTheme === 'dark' ? 'Midnight Indigo' : 'Sage Alabaster'}! 🎨`);
  };

  // Clear workspace handler
  const handleClearWorkspace = async () => {
    setClearing(true);
    const result = await clearAllTasks();
    if (result.success) {
      toast.success('Workspace cleared! All tasks have been soft-deleted. 🧹');
      setIsConfirmOpen(false);
    } else {
      toast.error(result.message || 'Failed to clear workspace.');
    }
    setClearing(false);
  };

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate statistics percentages
  const totalTasks = stats?.Total || 0;
  const completedTasks = stats?.Completed || 0;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl text-left">
      {/* Page Header */}
      <div className="border-b border-border-subtle pb-4 select-none">
        <h2 className="text-xl font-display font-extrabold text-text-primary tracking-wide">Workspace Settings</h2>
        <p className="text-xs text-text-secondary mt-1">Manage profile configurations, visual aesthetics, and task operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Column: Profile & Analytics */}
        <div className="flex flex-col gap-8">
          {/* Profile Edit Card */}
          <div className="premium-card p-6 flex flex-col gap-6">
            <div className="flex items-center gap-4 border-b border-border-subtle pb-4">
              <Avatar name={user?.name} initials={user?.initials} size="lg" />
              <div>
                <h3 className="text-sm font-bold text-text-primary">Profile Credentials</h3>
                <p className="text-xs text-text-secondary">{user?.email}</p>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-secondary font-mono uppercase tracking-wider">Display Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-bg-tertiary border border-border-subtle rounded-md pl-10 pr-4 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-amber font-medium transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-2">
                <Button
                  type="submit"
                  variant="primary"
                  loading={saving}
                  disabled={name.trim() === user?.name}
                >
                  Save Display Name
                </Button>
              </div>
            </form>
          </div>

          {/* Stats Analytics Card */}
          <div className="premium-card p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
              <BarChart2 className="w-5 h-5 text-accent-amber" />
              <h3 className="text-sm font-bold text-text-primary">Workspace Analytics</h3>
            </div>
            
            <div className="flex flex-col gap-4">
              {/* Progress Gauge */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs font-mono font-bold">
                  <span className="text-text-secondary">Completion Ratio</span>
                  <span className="text-accent-green">{completionPercentage}%</span>
                </div>
                <div className="w-full bg-bg-tertiary h-2.5 rounded-full overflow-hidden border border-border-subtle">
                  <div 
                    className="bg-accent-green h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>

              {/* Counts Grid */}
              <div className="grid grid-cols-2 gap-3.5 mt-2">
                <div className="bg-bg-tertiary border border-border-subtle p-3 rounded-md flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-text-secondary font-mono uppercase tracking-wider">Total Tasks</span>
                  <span className="text-lg font-extrabold text-text-primary">{totalTasks}</span>
                </div>
                <div className="bg-bg-tertiary border border-border-subtle p-3 rounded-md flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-accent-green font-mono uppercase tracking-wider">Completed</span>
                  <span className="text-lg font-extrabold text-accent-green">{completedTasks}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Theme & Danger Zone */}
        <div className="flex flex-col gap-8">
          {/* Theme Selector */}
          <div className="premium-card p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-border-subtle pb-3 select-none">
              <Sun className="w-5 h-5 text-accent-amber" />
              <h3 className="text-sm font-bold text-text-primary">Interface Theme</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Dark Mode Card */}
              <button
                onClick={() => handleThemeChange('dark')}
                className={`flex flex-col gap-3 p-4 rounded-md border text-left cursor-pointer transition-all duration-300
                  ${theme === 'dark'
                    ? 'bg-bg-tertiary border-accent-amber shadow-glow-amber scale-[1.02]'
                    : 'bg-bg-secondary/40 border-border-subtle hover:border-text-muted hover:bg-bg-tertiary/50'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-accent-indigo" style={{ color: '#6366F1' }} />
                  <span className="text-xs font-bold text-text-primary">Midnight Indigo</span>
                </div>
                <div className="flex flex-col gap-1.5 w-full bg-[#08090D] p-2.5 rounded border border-indigo-500/20 select-none">
                  <div className="h-2.5 w-2/3 bg-indigo-500/30 rounded" />
                  <div className="h-1.5 w-1/2 bg-indigo-500/10 rounded mt-1" />
                  <div className="flex gap-1 mt-1 select-none">
                    <span className="w-2 h-2 rounded-full bg-[#6366F1]" />
                    <span className="w-2 h-2 rounded-full bg-[#06B6D4]" />
                    <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  </div>
                </div>
              </button>

              {/* Light Mode Card */}
              <button
                onClick={() => handleThemeChange('light')}
                className={`flex flex-col gap-3 p-4 rounded-md border text-left cursor-pointer transition-all duration-300
                  ${theme === 'light'
                    ? 'bg-bg-tertiary border-accent-amber shadow-glow-amber scale-[1.02]'
                    : 'bg-bg-secondary/40 border-border-subtle hover:border-text-muted hover:bg-bg-tertiary/50'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-accent-teal" style={{ color: '#0F766E' }} />
                  <span className="text-xs font-bold text-text-primary">Sage Alabaster</span>
                </div>
                <div className="flex flex-col gap-1.5 w-full bg-[#F4F6F2] p-2.5 rounded border border-teal-800/10 select-none">
                  <div className="h-2.5 w-2/3 bg-teal-800/20 rounded" />
                  <div className="h-1.5 w-1/2 bg-teal-800/10 rounded mt-1" />
                  <div className="flex gap-1 mt-1 select-none">
                    <span className="w-2 h-2 rounded-full bg-[#0F766E]" />
                    <span className="w-2 h-2 rounded-full bg-[#1D4ED8]" />
                    <span className="w-2 h-2 rounded-full bg-[#15803D]" />
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Account Security Info Card */}
          <div className="premium-card p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-border-subtle pb-3 select-none">
              <ShieldCheck className="w-5 h-5 text-accent-green" />
              <h3 className="text-sm font-bold text-text-primary">Security Parameters</h3>
            </div>

            <div className="flex flex-col gap-3 text-xs font-mono">
              <div className="flex justify-between py-1.5 border-b border-border-subtle">
                <span className="text-text-secondary flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Joined Slate
                </span>
                <span className="text-text-primary">{formatDate(user?.createdAt)}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-text-secondary flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Last Verification Session
                </span>
                <span className="text-text-primary">{formatDate(user?.lastLogin)}</span>
              </div>
            </div>
          </div>

          {/* Danger Zone Card */}
          <div className="premium-card p-6 border-l-4 border-l-accent-red flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-border-subtle pb-3 select-none">
              <AlertTriangle className="w-5 h-5 text-accent-red" />
              <h3 className="text-sm font-bold text-accent-red">Danger Zone</h3>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-text-primary">Clear Workspace Tasks</span>
                <span className="text-[11px] text-text-secondary">Soft-deletes all of your registered tasks from the workspace database. This action is irreversible.</span>
              </div>
              <Button
                variant="danger"
                onClick={() => setIsConfirmOpen(true)}
                className="shrink-0"
              >
                Clear Workspace
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Workspace Confirm dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Clear Workspace"
        message="Are you absolutely sure you want to delete all tasks in your workspace? This action performs soft-deletion in MongoDB on all of your tasks."
        confirmText="Clear All"
        cancelText="Cancel"
        onConfirm={handleClearWorkspace}
        onCancel={() => setIsConfirmOpen(false)}
        loading={clearing}
      />
    </div>
  );
};

export default SettingsTab;
