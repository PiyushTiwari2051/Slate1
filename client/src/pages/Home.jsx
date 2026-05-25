import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

const mockTasks = [
  { title: 'Design obsidian craft style system', priority: 'High', status: 'Completed', due: 'Today' },
  { title: 'Secure MERN auth controllers with SHA-256', priority: 'High', status: 'In-Progress', due: 'Tomorrow' },
  { title: 'Optimize aggregate queries in MongoDB', priority: 'Medium', status: 'Pending', due: 'In 3 days' }
];

export const Home = () => {
  const { isAuthenticated } = useAuth();
  const [activeMockIndex, setActiveMockIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMockIndex(prev => (prev + 1) % mockTasks.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden hero-bg min-h-screen flex flex-col">
      {/* Hero background decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-accent-amber/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-accent-blue/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="flex flex-col text-left max-w-2xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-amber/10 border border-accent-amber/20 text-accent-amber text-xs font-semibold font-mono uppercase tracking-wider mb-6 w-fit select-none">
              <Sparkles className="w-3.5 h-3.5" />
              Simple & Natural Workspace
            </div>
            
            <h1 className="hero-heading mb-6">
              The editorial notebook for <span className="highlight">focused minds.</span>
            </h1>
            
            <p className="text-lg text-text-secondary mb-8 leading-relaxed">
              Organize your tasks with surgical precision. Secure your workspace with one-time passcodes, manage your progress on a clean Kanban board, and focus on what matters.
            </p>
            
            <div className="flex flex-wrap gap-4 select-none">
              <Link to={isAuthenticated ? '/dashboard' : '/signup'}>
                <Button variant="primary" size="lg" className="animate-glow-pulse">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg">
                  Submit Feedback
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Simulated Mockup Column */}
          <div className="relative flex justify-center lg:justify-end animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <div className="relative w-full max-w-md p-6 rounded-2xl bg-bg-secondary/40 backdrop-blur-md border border-border-subtle shadow-card select-none">
              {/* Header inside mockup */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-border-subtle">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-accent-red" />
                  <div className="w-2.5 h-2.5 rounded-full bg-accent-amber" />
                  <div className="w-2.5 h-2.5 rounded-full bg-accent-green" />
                </div>
                <span className="text-xs font-mono text-text-muted">Slate Workspace</span>
              </div>
              
              {/* Cycling task card representation */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xs font-semibold font-mono uppercase tracking-wider text-text-muted">Active Tasks Mockup</h4>
                {mockTasks.map((t, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-500
                      ${idx === activeMockIndex 
                        ? 'bg-bg-tertiary border-accent-amber/30 translate-x-2 shadow-md' 
                        : 'bg-bg-glass border-transparent opacity-40 scale-[0.98]'}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary truncate">{t.title}</p>
                      <p className="text-xs text-text-muted font-mono mt-1">Due: {t.due}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge type="priority" value={t.priority} />
                      <Badge type="status" value={t.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
