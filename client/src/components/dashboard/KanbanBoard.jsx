import { useState, useEffect, useCallback } from 'react';
import { useTasks } from '../../context/TaskContext';
import { taskService } from '../../services/taskService';
import { useToast } from '../../hooks/useToast';
import { Calendar, Edit2, Trash2, Layers, Sparkles, CheckCircle2, PlayCircle, HelpCircle } from 'lucide-react';
import Badge from '../common/Badge';
import Spinner from '../common/Spinner';
import confetti from 'canvas-confetti';

export const KanbanBoard = ({ onEdit, onDelete }) => {
  const { tasks, updateTask, filters } = useTasks();
  const { toast } = useToast();
  const [boardTasks, setBoardTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [draggedOverCol, setDraggedOverCol] = useState(null);

  // Fetch tasks matching priority and search filters, but displaying all statuses
  const fetchBoardTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await taskService.getTasks({
        status: 'All',
        priority: filters.priority,
        search: filters.search,
        sortBy: 'createdAt',
        order: 'desc',
        limit: 100 // large limit for board
      });
      if (data.success) {
        setBoardTasks(data.tasks);
      }
    } catch (error) {
      console.error('Failed to load board tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [filters.priority, filters.search]);

  // Sync board view whenever global CRUD tasks change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBoardTasks();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchBoardTasks, tasks]);

  // Due date formatter helper
  const getDueDateInfo = (dateStr) => {
    if (!dateStr) return { text: 'No due date', color: 'text-text-muted' };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(dateStr);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const options = { month: 'short', day: 'numeric' };
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

  // Drag and Drop handlers
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, colStatus) => {
    e.preventDefault();
    if (draggedOverCol !== colStatus) {
      setDraggedOverCol(colStatus);
    }
  };

  const handleDragLeave = () => {
    setDraggedOverCol(null);
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    setDraggedOverCol(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) return;

    const task = boardTasks.find(t => t._id === taskId);
    if (!task) return;

    if (task.status === targetStatus) return;

    // Optimistically update local UI state
    setBoardTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: targetStatus } : t));

    if (targetStatus === 'Completed') {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 }
      });
    }

    const result = await updateTask(taskId, { status: targetStatus });
    if (result.success) {
      if (targetStatus === 'Completed') {
        toast.success('Task completed! Keep up the good work! 🎉');
      } else {
        toast.info(`Task status updated to ${targetStatus}.`);
      }
    } else {
      toast.error(result.message || 'Failed to update task status.');
      // Re-fetch to sync if update failed
      fetchBoardTasks();
    }
  };

  // Split tasks by column
  const pendingTasks = boardTasks.filter(t => t.status === 'Pending');
  const inProgressTasks = boardTasks.filter(t => t.status === 'In-Progress');
  const completedTasks = boardTasks.filter(t => t.status === 'Completed');

  const columns = [
    {
      id: 'Pending',
      title: 'Pending',
      tasks: pendingTasks,
      color: 'border-t-accent-amber',
      accentColor: 'text-accent-amber',
      icon: <HelpCircle className="w-5 h-5 text-accent-amber" />,
      bgDrop: 'bg-accent-amber/5 border-accent-amber/20'
    },
    {
      id: 'In-Progress',
      title: 'In-Progress',
      tasks: inProgressTasks,
      color: 'border-t-accent-blue',
      accentColor: 'text-accent-blue',
      icon: <PlayCircle className="w-5 h-5 text-accent-blue" />,
      bgDrop: 'bg-accent-blue/5 border-accent-blue/20'
    },
    {
      id: 'Completed',
      title: 'Completed',
      tasks: completedTasks,
      color: 'border-t-accent-green',
      accentColor: 'text-accent-green',
      icon: <CheckCircle2 className="w-5 h-5 text-accent-green" />,
      bgDrop: 'bg-accent-green/5 border-accent-green/20'
    }
  ];

  if (loading && boardTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Spinner size="lg" />
        <p className="text-sm text-text-secondary mt-4 font-mono">Initializing workspace board...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Search/Filter Info Alert */}
      {(filters.search || filters.priority !== 'All') && (
        <div className="flex items-center gap-2 p-3.5 bg-bg-secondary border border-border-subtle rounded-md text-xs text-text-secondary text-left font-mono">
          <Sparkles className="w-4 h-4 text-accent-amber shrink-0 animate-pulse" />
          <span>
            Filters Active — Showing matching tasks (Search: {filters.search ? `"${filters.search}"` : 'None'}, Priority: {filters.priority}).
          </span>
        </div>
      )}

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full items-start">
        {columns.map(col => {
          const isCurrentDropTarget = draggedOverCol === col.id;
          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`flex flex-col h-[calc(100vh-280px)] min-h-[450px] rounded-lg border border-border-subtle bg-bg-secondary/40 backdrop-blur-sm transition-all duration-300 border-t-4 ${col.color}
                ${isCurrentDropTarget ? `${col.bgDrop} shadow-lg border-dashed scale-[1.01]` : ''}
              `}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between p-4 border-b border-border-subtle select-none">
                <div className="flex items-center gap-2">
                  {col.icon}
                  <h3 className="font-display font-extrabold text-sm text-text-primary tracking-wide">{col.title}</h3>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-bg-tertiary text-text-secondary border border-border-subtle">
                  {col.tasks.length}
                </span>
              </div>

              {/* Column Cards Container */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-thin">
                {col.tasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-border-subtle rounded-md h-full select-none text-center">
                    <Layers className="w-8 h-8 text-text-muted stroke-[1.25] mb-2" />
                    <p className="text-xs text-text-muted font-medium font-mono">Drag tasks here</p>
                  </div>
                ) : (
                  col.tasks.map(task => {
                    const due = getDueDateInfo(task.dueDate);
                    const isHigh = task.priority === 'High';
                    const isMedium = task.priority === 'Medium';
                    
                    return (
                      <div
                        key={task._id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task._id)}
                        className="premium-card p-4 text-left border-l-4 cursor-grab active:cursor-grabbing hover:border-border-accent hover:shadow-md transition-all group flex flex-col gap-2.5 bg-bg-secondary border-border-subtle
                          border-l-accent-amber
                          [&:hover]:scale-[1.01]
                          style-card-border"
                        style={{
                          borderLeftColor: isHigh 
                            ? 'var(--accent-red)' 
                            : isMedium 
                              ? 'var(--accent-amber)' 
                              : 'var(--accent-green)'
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-sm font-semibold text-text-primary line-clamp-2 leading-snug">
                            {task.title}
                          </span>
                          
                          {/* Quick Actions */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            <button
                              onClick={() => onEdit(task)}
                              className="p-1 rounded hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                              title="Edit Task"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDelete(task._id)}
                              className="p-1 rounded hover:bg-bg-tertiary text-accent-red hover:text-opacity-80 transition-colors cursor-pointer"
                              title="Delete Task"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {task.description && (
                          <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-1 text-[10px] text-text-muted border-t border-border-subtle pt-2">
                          <span className={`flex items-center gap-1 ${due.color}`}>
                            <Calendar className="w-3 h-3" />
                            {due.text}
                          </span>
                          <div className="flex gap-1.5">
                            <Badge type="priority" value={task.priority} size="sm" />
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanBoard;
