import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sun, Moon, LogOut, Menu, X } from 'lucide-react';
import Avatar from '../common/Avatar';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Apply theme class to document element on mount
  useEffect(() => {
    const root = window.document.documentElement;
    const initialTheme = localStorage.getItem('theme') || 'dark';
    if (initialTheme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
  }, []);

  // Listen to changes from other components (like SettingsTab)
  useEffect(() => {
    const handleThemeUpdate = () => {
      const storedTheme = localStorage.getItem('theme') || 'dark';
      setTheme(storedTheme);
      const root = window.document.documentElement;
      if (storedTheme === 'light') {
        root.classList.add('light');
      } else {
        root.classList.remove('light');
      }
    };
    window.addEventListener('theme:update', handleThemeUpdate);
    return () => window.removeEventListener('theme:update', handleThemeUpdate);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
    
    // Apply changes immediately
    const root = window.document.documentElement;
    if (newTheme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
    
    // Dispatch event to notify settings tab or other headers
    window.dispatchEvent(new Event('theme:update'));
  };

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) => `
    text-sm font-medium transition-colors hover:text-accent-amber
    ${isActive(path) ? 'text-accent-amber' : 'text-text-secondary'}
  `;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border-subtle bg-bg-primary/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-extrabold tracking-tight text-text-primary select-none">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-accent-amber to-[#D97706] text-[#0E0F11] font-bold shadow-glow-amber font-mono">
              S
            </span>
            Slate
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={linkClass('/')}>Home</Link>
            <Link to="/contact" className={linkClass('/contact')}>Contact</Link>
            {isAuthenticated && (
              <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="flex items-center gap-2">
                  <Avatar name={user.name} initials={user.initials} size="sm" />
                  <span className="text-sm font-medium text-text-primary hidden lg:inline-block max-w-[120px] truncate">
                    {user.name}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-md hover:bg-bg-tertiary text-accent-red hover:text-opacity-80 transition-colors focus:outline-none flex items-center gap-1.5 text-sm font-medium cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-text-primary hover:text-accent-amber transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-semibold bg-accent-amber text-[#0E0F11] rounded-md hover:bg-opacity-90 shadow-glow-amber transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors focus:outline-none cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-md hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors focus:outline-none cursor-pointer"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-b border-border-subtle bg-bg-secondary px-4 py-4 space-y-3 animate-slide-down">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/') ? 'bg-bg-tertiary text-accent-amber' : 'text-text-secondary'}`}
          >
            Home
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileOpen(false)}
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/contact') ? 'bg-bg-tertiary text-accent-amber' : 'text-text-secondary'}`}
          >
            Contact
          </Link>
          {isAuthenticated && (
            <Link
              to="/dashboard"
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/dashboard') ? 'bg-bg-tertiary text-accent-amber' : 'text-text-secondary'}`}
            >
              Dashboard
            </Link>
          )}

          <div className="border-t border-border-subtle pt-3">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-1.5">
                  <Avatar name={user.name} initials={user.initials} size="sm" />
                  <div className="truncate">
                    <p className="text-sm font-bold text-text-primary">{user.name}</p>
                    <p className="text-xs text-text-muted">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-accent-red hover:bg-bg-tertiary rounded-md text-base font-medium text-left cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 px-3 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center px-4 py-2 border border-border-subtle text-text-primary rounded-md text-base font-medium hover:bg-bg-tertiary"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center px-4 py-2 bg-accent-amber text-[#0E0F11] rounded-md text-base font-semibold shadow-glow-amber hover:bg-opacity-90"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
