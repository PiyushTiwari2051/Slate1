import api from './api';

export const taskService = {
  getTasks: async (params) => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },
  
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },
  
  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },
  
  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
  
  submitContact: async (contactData) => {
    const response = await api.post('/contact', contactData);
    return response.data;
  },

  clearAllTasks: async () => {
    const response = await api.delete('/tasks/clear');
    return response.data;
  }
};
