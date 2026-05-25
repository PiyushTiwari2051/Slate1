import { useState, useEffect } from 'react';
import { useTasks } from '../../context/TaskContext';
import { useToast } from '../../hooks/useToast';
import { Plus, Calendar, Type, AlignLeft } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';

export const TaskForm = () => {
  const { createTask } = useTasks();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [loading, setLoading] = useState(false);

  // Keyboard shortcut: 'N' to open form, 'Escape' to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      const isInputFocused = activeEl && (
        activeEl.tagName === 'INPUT' || 
        activeEl.tagName === 'TEXTAREA' || 
        activeEl.isContentEditable
      );
      if (isInputFocused) return;

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Task title is required.');
      return;
    }

    setLoading(true);
    const result = await createTask({
      title,
      description,
      dueDate: dueDate || null,
      priority,
      status: 'Pending'
    });

    if (result.success) {
      toast.success('Task created successfully!');
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('Medium');
      setIsOpen(false);
    } else {
      toast.error(result.message || 'Failed to create task.');
    }
    setLoading(false);
  };

  return (
    <div className="w-full flex flex-col premium-card border border-border-subtle rounded-xl overflow-hidden select-none bg-bg-secondary">
      {/* Accordion Trigger Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-6 py-4 w-full text-left font-bold text-sm uppercase tracking-wider font-mono text-text-primary hover:bg-bg-tertiary transition-colors focus:outline-none cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <Plus className={`w-4 h-4 text-accent-amber transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
          {isOpen ? 'Close Task Creator' : 'Create New Task'}
        </span>
        <span className="text-xs font-normal text-text-muted hidden sm:inline-block">
          {isOpen ? 'ESC to cancel' : 'Press N to open'}
        </span>
      </button>

      {/* Accordion Form Content */}
      {isOpen && (
        <form onSubmit={handleSubmit} className="border-t border-border-subtle p-6 flex flex-col gap-5 animate-slide-down">
          <Input
            label="Task Title"
            icon={Type}
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            required
          />

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold font-mono uppercase tracking-wider text-text-muted flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5" /> Description
            </label>
            <textarea
              placeholder="Add some details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-bg-tertiary border border-border-subtle text-text-primary text-sm rounded-md px-4 py-3 outline-none h-20 resize-none focus:border-accent-amber focus:ring-2 focus:ring-accent-amber-glow"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Due Date Picker */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-semibold font-mono uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-bg-tertiary border border-border-subtle text-text-primary text-sm rounded-md px-4 py-3 outline-none focus:border-accent-amber focus:ring-2 focus:ring-accent-amber-glow"
                disabled={loading}
              />
            </div>

            {/* Priority Selector Pills */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-semibold font-mono uppercase tracking-wider text-text-muted">
                Priority
              </label>
              <div className="flex gap-2 w-full">
                {['Low', 'Medium', 'High'].map((p) => {
                  let activeClass = '';
                  if (priority === p) {
                    if (p === 'Low') activeClass = 'bg-accent-green/20 text-accent-green border-accent-green';
                    if (p === 'Medium') activeClass = 'bg-accent-amber/20 text-accent-amber border-accent-amber';
                    if (p === 'High') activeClass = 'bg-accent-red/20 text-accent-red border-accent-red';
                  } else {
                    activeClass = 'bg-bg-tertiary text-text-secondary border-border-subtle hover:text-text-primary hover:bg-bg-glass';
                  }
                  
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`flex-1 py-3 text-sm font-semibold rounded-md border transition-all cursor-pointer focus:outline-none ${activeClass}`}
                      disabled={loading}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-border-subtle pt-5">
            <Button
              variant="ghost"
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="animate-glow-pulse"
            >
              Create Task
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TaskForm;
