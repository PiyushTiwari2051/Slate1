import { useState, useEffect } from 'react';
import { useTasks } from '../../context/TaskContext';
import { useToast } from '../../hooks/useToast';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { Calendar, Type, AlignLeft, BarChart } from 'lucide-react';

export const TaskEditModal = ({ isOpen, onClose, task }) => {
  const { updateTask } = useTasks();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Pending');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task && isOpen) {
      const timer = setTimeout(() => {
        setTitle(task.title || '');
        setDescription(task.description || '');
        setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
        setPriority(task.priority || 'Medium');
        setStatus(task.status || 'Pending');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [task, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Task title is required.');
      return;
    }

    setLoading(true);
    const result = await updateTask(task._id, {
      title,
      description,
      dueDate: dueDate || null,
      priority,
      status
    });

    if (result.success) {
      toast.success('Task updated successfully!');
      onClose();
    } else {
      toast.error(result.message || 'Failed to update task.');
    }
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Task">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
        <Input
          label="Task Title"
          icon={Type}
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          required
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold font-mono uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <AlignLeft className="w-3.5 h-3.5" /> Description
          </label>
          <textarea
            placeholder="Add some details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-bg-tertiary border border-border-subtle text-text-primary text-sm rounded-md px-4 py-3 outline-none h-24 resize-none focus:border-accent-amber focus:ring-2 focus:ring-accent-amber-glow"
            disabled={loading}
          />
        </div>

        {/* Due Date Picker */}
        <div className="flex flex-col gap-1.5">
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
        <div className="flex flex-col gap-1.5">
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

        {/* Status Selector Pills */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold font-mono uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <BarChart className="w-3.5 h-3.5" /> Status
          </label>
          <div className="flex gap-2 w-full">
            {['Pending', 'In-Progress', 'Completed'].map((s) => {
              let activeClass = '';
              if (status === s) {
                if (s === 'Pending') activeClass = 'bg-bg-tertiary text-text-primary border-text-muted';
                if (s === 'In-Progress') activeClass = 'bg-accent-blue/20 text-accent-blue border-accent-blue';
                if (s === 'Completed') activeClass = 'bg-accent-green/20 text-accent-green border-accent-green';
              } else {
                activeClass = 'bg-bg-tertiary text-text-secondary border-border-subtle hover:text-text-primary hover:bg-bg-glass';
              }

              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`flex-1 py-3 text-sm font-semibold rounded-md border transition-all cursor-pointer focus:outline-none ${activeClass}`}
                  disabled={loading}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-border-subtle pt-5 mt-2">
          <Button
            variant="ghost"
            onClick={onClose}
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
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskEditModal;
