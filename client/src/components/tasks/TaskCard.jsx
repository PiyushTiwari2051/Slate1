import { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { useToast } from '../../hooks/useToast';
import { Edit2, Trash2, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import Badge from '../common/Badge';
import confetti from 'canvas-confetti';

export const TaskCard = ({ task, onEdit, onDelete }) => {
  const { updateTask } = useTasks();
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);

  const handleCheckboxChange = async (e) => {
    const isCompleted = e.target.checked;
    const newStatus = isCompleted ? 'Completed' : 'Pending';
    
    if (isCompleted) {
      // Trigger canvas-confetti burst on task completion
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 }
      });
    }

    const result = await updateTask(task._id, { status: newStatus });
    if (result.success) {
      if (isCompleted) {
        toast.success('Task completed! Keep up the good work! 🎉');
      } else {
        toast.info('Task marked as pending.');
      }
    } else {
      toast.error(result.message || 'Failed to update status.');
    }
  };

  // Due date helper
  const getDueDateInfo = (dateStr) => {
    if (!dateStr) return { text: 'No due date', color: 'text-text-muted' };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(dateStr);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = new Date(dateStr).toLocaleDateString('en-US', options);

    if (diffDays < 0) {
      return { text: `Overdue (${formattedDate})`, color: 'text-accent-red font-semibold' };
    }
    if (diffDays === 0) {
      return { text: 'Due Today', color: 'text-accent-amber font-semibold' };
    }
    if (diffDays === 1) {
      return { text: 'Due Tomorrow', color: 'text-accent-blue font-semibold' };
    }
    
    return { text: formattedDate, color: 'text-text-secondary' };
  };

  const dueInfo = getDueDateInfo(task.dueDate);
  const isCompleted = task.status === 'Completed';

  return (
    <div
      className={`premium-card p-5 group flex flex-col gap-3 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg border-l-4
        ${isCompleted 
          ? 'border-l-accent-green opacity-70 bg-bg-secondary/40' 
          : task.priority === 'High' 
            ? 'border-l-accent-red' 
            : task.priority === 'Medium' 
              ? 'border-l-accent-amber' 
              : 'border-l-accent-green'}`}
    >
      <div className="flex items-start gap-4 justify-between">
        {/* Left Side: Checkbox + Title */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={handleCheckboxChange}
            className="w-5 h-5 rounded border-border-subtle bg-bg-tertiary text-accent-green focus:ring-accent-green focus:ring-opacity-20 cursor-pointer mt-1 flex-shrink-0"
          />
          <div className="flex flex-col text-left min-w-0 flex-1">
            <span 
              onClick={() => setExpanded(!expanded)}
              className={`text-sm font-semibold text-text-primary truncate cursor-pointer hover:text-accent-amber transition-colors
                ${isCompleted ? 'line-through text-text-muted' : ''}`}
            >
              {task.title}
            </span>
            
            {/* Metadata (Due Date + priority) */}
            <div className="flex flex-wrap gap-x-3 gap-y-1 items-center text-xs mt-1.5 text-text-muted">
              <span className={`flex items-center gap-1 ${dueInfo.color}`}>
                <Calendar className="w-3.5 h-3.5" />
                {dueInfo.text}
              </span>
              <span className="text-border-subtle">•</span>
              <Badge type="priority" value={task.priority} size="sm" />
              <span className="text-border-subtle">•</span>
              <Badge type="status" value={task.status} size="sm" />
            </div>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-1.5 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-md hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors focus:outline-none cursor-pointer"
            title="Edit Task"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-1.5 rounded-md hover:bg-bg-tertiary text-accent-red hover:text-opacity-80 transition-colors focus:outline-none cursor-pointer"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expandable Description Area */}
      {task.description && (
        <div className="text-left">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-[11px] font-bold font-mono uppercase tracking-wider text-text-muted hover:text-text-primary transition-colors focus:outline-none cursor-pointer"
          >
            {expanded ? (
              <>Hide details <ChevronUp className="w-3 h-3" /></>
            ) : (
              <>Show details <ChevronDown className="w-3 h-3" /></>
            )}
          </button>

          {expanded && (
            <p className="text-xs text-text-secondary mt-2 bg-bg-tertiary border border-border-subtle p-3 rounded-md animate-fade-in-up leading-relaxed whitespace-pre-wrap">
              {task.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
