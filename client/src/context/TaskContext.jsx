/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';
import { useAuth } from './AuthContext';
import { useDebounce } from '../hooks/useDebounce';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ Total: 0, Pending: 0, 'In-Progress': 0, Completed: 0 });
  const [loading, setLoading] = useState(false);
  
  const [filters, setFilters] = useState({
    status: 'All',
    priority: 'All',
    search: '',
    sortBy: 'createdAt',
    order: 'desc',
    page: 1,
    limit: 10
  });

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1
  });

  // Debounce search input by 300ms
  const debouncedSearch = useDebounce(filters.search, 300);

  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const queryParams = {
        status: filters.status,
        priority: filters.priority,
        search: debouncedSearch,
        sortBy: filters.sortBy,
        order: filters.order,
        page: filters.page,
        limit: filters.limit
      };
      
      const data = await taskService.getTasks(queryParams);
      if (data.success) {
        setTasks(data.tasks);
        setStats(data.stats);
        setPagination({
          total: data.total,
          page: data.page,
          pages: data.pages
        });
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, filters.status, filters.priority, debouncedSearch, filters.sortBy, filters.order, filters.page, filters.limit]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchTasks]);

  const createTask = async (taskData) => {
    try {
      const data = await taskService.createTask(taskData);
      if (data.success) {
        await fetchTasks();
        return { success: true, task: data.task };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create task';
      return { success: false, message };
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const data = await taskService.updateTask(id, taskData);
      if (data.success) {
        // Optimistically update local view first
        setTasks(prev => prev.map(t => t._id === id ? { ...t, ...data.task } : t));
        // Refresh full query context in the background for stats accuracy
        await fetchTasks();
        return { success: true, task: data.task };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update task';
      return { success: false, message };
    }
  };

  const deleteTask = async (id) => {
    try {
      const data = await taskService.deleteTask(id);
      if (data.success) {
        await fetchTasks();
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete task';
      return { success: false, message };
    }
  };

  const clearAllTasks = async () => {
    try {
      const data = await taskService.clearAllTasks();
      if (data.success) {
        await fetchTasks();
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear all tasks';
      return { success: false, message };
    }
  };

  const value = {
    tasks,
    stats,
    loading,
    filters,
    pagination,
    setFilters,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    clearAllTasks
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
