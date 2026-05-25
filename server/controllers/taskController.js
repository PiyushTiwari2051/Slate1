import mongoose from 'mongoose';
import Task from '../models/Task.js';
import asyncHandler from '../utils/asyncHandler.js';

// GET /api/tasks
export const getTasks = asyncHandler(async (req, res) => {
  const { status, priority, search, sortBy = 'createdAt', order = 'desc', page = 1, limit = 20 } = req.query;

  const filter = { userId: req.user.id };
  
  if (status && status !== 'All') {
    filter.status = status;
  }
  if (priority && priority !== 'All') {
    filter.priority = priority;
  }
  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }

  const sortOrder = order === 'asc' ? 1 : -1;
  
  // Custom sorting rules (e.g. priority mapping or simple field sort)
  const sortOptions = {};
  if (sortBy === 'priority') {
    // For sorting by priority, we can sort alphabetically or rely on front-end sort,
    // but a standard field sort works.
    sortOptions.priority = sortOrder;
  } else {
    sortOptions[sortBy] = sortOrder;
  }

  const limitNum = Number(limit);
  const skip = (Number(page) - 1) * limitNum;

  const [tasks, total] = await Promise.all([
    Task.find(filter).sort(sortOptions).skip(skip).limit(limitNum),
    Task.countDocuments(filter)
  ]);

  // Stats aggregation — always return real-time counts
  // Note: aggregation bypasses pre(/^find/) hook, so we MUST filter isDeleted: false
  const stats = await Task.aggregate([
    { 
      $match: { 
        userId: new mongoose.Types.ObjectId(req.user.id), 
        isDeleted: false 
      } 
    },
    { 
      $group: { 
        _id: '$status', 
        count: { $sum: 1 } 
      } 
    }
  ]);

  const statsMap = { Total: 0, Pending: 0, 'In-Progress': 0, Completed: 0 };
  stats.forEach(s => {
    if (s._id in statsMap) {
      statsMap[s._id] = s.count;
    }
  });
  
  statsMap.Total = statsMap.Pending + statsMap['In-Progress'] + statsMap.Completed;

  res.status(200).json({ 
    success: true, 
    tasks, 
    stats: statsMap, 
    total, 
    page: Number(page), 
    pages: Math.ceil(total / limitNum) 
  });
});

// POST /api/tasks
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, dueDate, priority, status } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, message: 'Task title is required.' });
  }

  const task = await Task.create({ 
    userId: req.user.id, 
    title, 
    description, 
    dueDate: dueDate || null, 
    priority: priority || 'Medium', 
    status: status || 'Pending' 
  });
  
  res.status(201).json({ success: true, message: 'Task created!', task });
});

// PUT /api/tasks/:id
export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found.' });
  }

  const allowed = ['title', 'description', 'dueDate', 'priority', 'status'];
  allowed.forEach(field => { 
    if (req.body[field] !== undefined) {
      task[field] = req.body[field];
    }
  });
  await task.save();

  res.status(200).json({ success: true, message: 'Task updated!', task });
});

// DELETE /api/tasks/:id
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found.' });
  }

  task.isDeleted = true;  // Soft delete
  await task.save();

  res.status(200).json({ success: true, message: 'Task deleted.' });
});

// DELETE /api/tasks/clear
export const clearAllTasks = asyncHandler(async (req, res) => {
  await Task.updateMany(
    { userId: req.user.id, isDeleted: false },
    { isDeleted: true }
  );

  res.status(200).json({ success: true, message: 'All tasks cleared successfully.' });
});

