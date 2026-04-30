const express = require('express');
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} = require('../controllers/projectController');
const { authMiddleware, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getProjects);
router.get('/:id', getProjectById);

// Admin only routes
router.post('/', authorize('ADMIN'), createProject);
router.put('/:id', authorize('ADMIN'), updateProject);
router.delete('/:id', authorize('ADMIN'), deleteProject);
router.post('/:projectId/members', authorize('ADMIN'), addMember);
router.delete('/:projectId/members/:userId', authorize('ADMIN'), removeMember);

module.exports = router;
