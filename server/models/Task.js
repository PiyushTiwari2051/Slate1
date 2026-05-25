import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true  // Index for fast user-based queries
  },
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  dueDate: {
    type: Date,
    default: null
  },
  priority: {
    type: String,
    enum: { values: ['Low', 'Medium', 'High'], message: 'Priority must be Low, Medium, or High' },
    default: 'Medium'
  },
  status: {
    type: String,
    enum: { values: ['Pending', 'In-Progress', 'Completed'], message: 'Invalid status value' },
    default: 'Pending'
  },
  isDeleted: { type: Boolean, default: false }  // Soft delete support
}, {
  timestamps: true
});

// Auto-filter soft-deleted tasks from all queries
taskSchema.pre(/^find/, function(next) {
  this.where({ isDeleted: false });
  next();
});

export default mongoose.model('Task', taskSchema);
