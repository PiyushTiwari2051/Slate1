import { useTasks } from '../../context/TaskContext';
import TaskCard from './TaskCard';
import { ChevronLeft, ChevronRight, Inbox, SearchSlash, CornerRightUp } from 'lucide-react';

export const TaskList = ({ onEdit, onDelete }) => {
  const { tasks, loading, pagination, filters, setFilters } = useTasks();

  const handlePrevPage = () => {
    if (pagination.page > 1) {
      setFilters(prev => ({ ...prev, page: pagination.page - 1 }));
    }
  };

  const handleNextPage = () => {
    if (pagination.page < pagination.pages) {
      setFilters(prev => ({ ...prev, page: pagination.page + 1 }));
    }
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="flex flex-col gap-4 w-full select-none">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="h-24 rounded-xl skeleton border border-border-subtle" />
        ))}
      </div>
    );
  }

  // Handle Empty State
  if (tasks.length === 0) {
    const isFiltered = filters.search || filters.status !== 'All' || filters.priority !== 'All';

    return (
      <div className="flex flex-col items-center justify-center py-16 text-center select-none premium-card p-8 border border-border-subtle bg-bg-secondary/20">
        {isFiltered ? (
          <div className="flex flex-col items-center animate-fade-in-up">
            <div className="w-16 h-16 rounded-full bg-bg-tertiary border border-border-subtle flex items-center justify-center text-text-muted mb-4">
              <SearchSlash className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-1">No matching tasks</h3>
            <p className="text-sm text-text-secondary max-w-xs leading-relaxed">
              Try adjusting your search queries or filter selections to find what you are looking for.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center animate-fade-in-up">
            <div className="w-16 h-16 rounded-full bg-bg-tertiary border border-border-subtle flex items-center justify-center text-text-muted mb-4 relative">
              <Inbox className="w-8 h-8" />
              {/* Subtle bouncing arrow pointing up to task form */}
              <div className="absolute -top-6 -right-6 animate-bounce text-accent-amber hidden sm:flex items-center gap-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-accent-amber/10 border border-accent-amber/20 px-2 py-0.5 rounded-full">New</span>
                <CornerRightUp className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-1">Your slate is clean</h3>
            <p className="text-sm text-text-secondary max-w-xs leading-relaxed">
              You do not have any tasks right now. Start by adding your first task above.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Cards list */}
      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <div key={task._id} className="stagger-item">
            <TaskCard 
              task={task} 
              onEdit={onEdit} 
              onDelete={onDelete} 
            />
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between border-t border-border-subtle pt-4 mt-2 select-none">
          <button
            onClick={handlePrevPage}
            disabled={pagination.page <= 1}
            className="flex items-center gap-1 px-3 py-1.5 border border-border-subtle rounded-md bg-bg-secondary hover:bg-bg-tertiary text-xs font-semibold text-text-secondary hover:text-text-primary disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          
          <span className="text-xs font-mono font-bold text-text-muted">
            Page {pagination.page} of {pagination.pages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={pagination.page >= pagination.pages}
            className="flex items-center gap-1 px-3 py-1.5 border border-border-subtle rounded-md bg-bg-secondary hover:bg-bg-tertiary text-xs font-semibold text-text-secondary hover:text-text-primary disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskList;
