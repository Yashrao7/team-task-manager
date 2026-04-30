const express = require('express');
const {
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getDashboardStats,
} = require('../controllers/taskController');
const { authMiddleware, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/stats', getDashboardStats);

// Admin can create/update/delete tasks
router.post('/', authorize('ADMIN'), createTask);
router.put('/:id', authorize('ADMIN'), updateTask);
router.delete('/:id', authorize('ADMIN'), deleteTask);

// Members (and Admins) can update task status
router.patch('/:id/status', updateTaskStatus);

module.exports = router;
