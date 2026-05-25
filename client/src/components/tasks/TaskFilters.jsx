import { useRef, useEffect } from 'react';
import { useTasks } from '../../context/TaskContext';
import { Search, ArrowUpDown } from 'lucide-react';
import Input from '../common/Input';

export const TaskFilters = () => {
  const { filters, setFilters, stats } = useTasks();
  const searchInputRef = useRef(null);

  // Keyboard shortcut: '/' to focus search bar
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      const isInputFocused = activeEl && (
        activeEl.tagName === 'INPUT' || 
        activeEl.tagName === 'TEXTAREA' || 
        activeEl.isContentEditable
      );
      if (isInputFocused) return;

      if (e.key === '/') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTabChange = (status) => {
    setFilters(prev => ({ ...prev, status, page: 1 }));
  };

  const handleSortFieldChange = (e) => {
    setFilters(prev => ({ ...prev, sortBy: e.target.value, page: 1 }));
  };

  const toggleSortOrder = () => {
    setFilters(prev => ({ 
      ...prev, 
      order: prev.order === 'asc' ? 'desc' : 'asc', 
      page: 1 
    }));
  };

  const tabs = [
    { name: 'All', count: stats.Total },
    { name: 'Pending', count: stats.Pending },
    { name: 'In-Progress', count: stats['In-Progress'] || 0 },
    { name: 'Completed', count: stats.Completed }
  ];

  return (
    <div className="flex flex-col gap-4 w-full select-none">
      {/* Top row: search + sort */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="w-full md:w-72">
          <Input
            ref={searchInputRef}
            icon={Search}
            placeholder="Search tasks... (Press '/' to focus)"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
          />
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5 bg-bg-secondary border border-border-subtle rounded-md px-3 py-2 w-full md:w-auto">
            <span className="text-xs font-mono font-bold text-text-muted uppercase tracking-wider">Sort:</span>
            <select
              value={filters.sortBy}
              onChange={handleSortFieldChange}
              className="bg-transparent text-text-primary text-sm font-semibold outline-none cursor-pointer pr-4"
            >
              <option value="createdAt">Date Created</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>
          </div>

          <button
            onClick={toggleSortOrder}
            className="p-2 border border-border-subtle rounded-md bg-bg-secondary hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-all cursor-pointer focus:outline-none flex items-center justify-center h-10 w-10 shadow-sm"
            title={`Sort Order: ${filters.order === 'asc' ? 'Ascending' : 'Descending'}`}
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex border-b border-border-subtle overflow-x-auto scrollbar-none gap-4">
        {tabs.map((tab) => {
          const isActive = filters.status === tab.name;
          return (
            <button
              key={tab.name}
              onClick={() => handleTabChange(tab.name)}
              className={`flex items-center gap-2 pb-3 text-sm font-semibold transition-all border-b-2 cursor-pointer focus:outline-none whitespace-nowrap
                ${isActive 
                  ? 'border-accent-amber text-accent-amber font-bold' 
                  : 'border-transparent text-text-secondary hover:text-text-primary'}`}
            >
              {tab.name}
              <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full
                ${isActive 
                  ? 'bg-accent-amber/20 text-accent-amber' 
                  : 'bg-bg-tertiary text-text-muted border border-border-subtle'}`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TaskFilters;
