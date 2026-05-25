import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { TaskProvider, useTasks } from '../context/TaskContext';
import { useToast } from '../hooks/useToast';
import TaskStats from '../components/tasks/TaskStats';
import TaskForm from '../components/tasks/TaskForm';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskList from '../components/tasks/TaskList';
import TaskEditModal from '../components/tasks/TaskEditModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Avatar from '../components/common/Avatar';
import KanbanBoard from '../components/dashboard/KanbanBoard';
import SettingsTab from '../components/dashboard/SettingsTab';
import { LayoutDashboard, CheckSquare, Settings } from 'lucide-react';

const DashboardContent = () => {
  const { user } = useAuth();
  const { deleteTask } = useTasks();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('board'); // 'board', 'manager', 'settings'
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleEditClick = (task) => {
    setEditingTask(task);
  };

  const handleDeleteClick = (id) => {
    setDeletingTaskId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deletingTaskId) return;
    setDeleteLoading(true);
    const result = await deleteTask(deletingTaskId);
    if (result.success) {
      toast.success('Task deleted successfully!');
      setDeletingTaskId(null);
    } else {
      toast.error(result.message || 'Failed to delete task.');
    }
    setDeleteLoading(false);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-bg-primary">
      {/* 1. Sidebar - Desktop Only */}
      <aside className="hidden md:flex flex-col w-64 bg-bg-secondary border-r border-border-subtle p-6 select-none justify-between h-full flex-shrink-0">
        <div className="flex flex-col gap-8">
          {/* User Profile Info */}
          <div className="flex items-center gap-3 border-b border-border-subtle pb-6">
            <Avatar name={user?.name} initials={user?.initials} size="md" />
            <div className="min-w-0 text-left">
              <p className="text-sm font-bold text-text-primary truncate">{user?.name}</p>
              <p className="text-xs text-text-muted truncate">{user?.email}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('board')}
              className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-bold text-left focus:outline-none transition-all cursor-pointer border
                ${activeTab === 'board'
                  ? 'bg-accent-amber/10 text-accent-amber border-accent-amber/20 shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary border-transparent'
                }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Overview Board
            </button>
            <button
              onClick={() => setActiveTab('manager')}
              className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-bold text-left focus:outline-none transition-all cursor-pointer border
                ${activeTab === 'manager'
                  ? 'bg-accent-amber/10 text-accent-amber border-accent-amber/20 shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary border-transparent'
                }`}
            >
              <CheckSquare className="w-4 h-4" />
              Task Manager
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-bold text-left focus:outline-none transition-all cursor-pointer border
                ${activeTab === 'settings'
                  ? 'bg-accent-amber/10 text-accent-amber border-accent-amber/20 shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary border-transparent'
                }`}
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </nav>
        </div>
      </aside>

      {/* 2. Main Content Zone */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
        <div className="mx-auto max-w-5xl flex flex-col gap-8">
          {/* Tab View A: Overview Board */}
          {activeTab === 'board' && (
            <>
              {/* Header text */}
              <div className="flex flex-col text-left">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight font-display">
                  Workspace Overview
                </h1>
                <p className="text-sm text-text-secondary mt-1">
                  Analyze metrics, update status parameters, and perform full CRUD.
                </p>
              </div>

              {/* Zone A: Stats Row */}
              <TaskStats />

              {/* Zone B: Task Creator Accordion */}
              <TaskForm />

              {/* Zone C: Search, Filters, and Task Card Lists */}
              <div className="flex flex-col gap-6 premium-card p-6 border border-border-subtle bg-bg-secondary">
                <TaskFilters />
                <TaskList onEdit={handleEditClick} onDelete={handleDeleteClick} />
              </div>
            </>
          )}

          {/* Tab View B: Task Manager (Kanban Board) */}
          {activeTab === 'manager' && (
            <>
              {/* Header text */}
              <div className="flex flex-col text-left">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight font-display">
                  Task Kanban Workspace
                </h1>
                <p className="text-sm text-text-secondary mt-1">
                  Drag and drop cards between statuses to dynamically update progress.
                </p>
              </div>

              {/* Share Global filters with Board (search & priority) */}
              <div className="premium-card p-5 border border-border-subtle bg-bg-secondary">
                <TaskFilters />
              </div>

              {/* Kanban Grid */}
              <KanbanBoard onEdit={handleEditClick} onDelete={handleDeleteClick} />
            </>
          )}

          {/* Tab View C: Settings */}
          {activeTab === 'settings' && (
            <SettingsTab />
          )}
        </div>
      </main>

      {/* 3. Bottom Navigation - Mobile Devices Only */}
      <div className="flex md:hidden fixed bottom-0 left-0 right-0 h-16 bg-bg-secondary border-t border-border-subtle items-center justify-around z-30 select-none shadow-md">
        <button
          onClick={() => setActiveTab('board')}
          className={`flex flex-col items-center justify-center focus:outline-none cursor-pointer transition-colors
            ${activeTab === 'board' ? 'text-accent-amber font-bold' : 'text-text-secondary hover:text-text-primary'}`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-mono uppercase tracking-wider">Board</span>
        </button>
        <button
          onClick={() => setActiveTab('manager')}
          className={`flex flex-col items-center justify-center focus:outline-none cursor-pointer transition-colors
            ${activeTab === 'manager' ? 'text-accent-amber font-bold' : 'text-text-secondary hover:text-text-primary'}`}
        >
          <CheckSquare className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-mono uppercase tracking-wider">Tasks</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center justify-center focus:outline-none cursor-pointer transition-colors
            ${activeTab === 'settings' ? 'text-accent-amber font-bold' : 'text-text-secondary hover:text-text-primary'}`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-mono uppercase tracking-wider">Settings</span>
        </button>
      </div>

      {/* Edit modal popup */}
      <TaskEditModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        task={editingTask}
      />

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={!!deletingTaskId}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action performs a soft deletion in the database."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingTaskId(null)}
        loading={deleteLoading}
      />
    </div>
  );
};

export const Dashboard = () => {
  return (
    <TaskProvider>
      <DashboardContent />
    </TaskProvider>
  );
};

export default Dashboard;
