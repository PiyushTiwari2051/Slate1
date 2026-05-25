import express from 'express';
import { 
  getTasks, 
  createTask, 
  updateTask, 
  deleteTask,
  clearAllTasks
} from '../controllers/taskController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validateTask } from '../middlewares/validateRequest.js';

const router = express.Router();

router.use(protect); // Apply JWT protection globally to all task endpoints

router.delete('/clear', clearAllTasks);

router.route('/')
  .get(getTasks)
  .post(validateTask, createTask);

router.route('/:id')
  .put(validateTask, updateTask)
  .delete(deleteTask);

export default router;
