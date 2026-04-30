const prisma = require('../config/prisma');

const createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate, assignedTo, projectId } = req.body;
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'PENDING',
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedTo,
        projectId,
      },
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, dueDate, assignedTo } = req.body;

    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        status,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        assignedTo,
      },
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await prisma.task.update({
      where: { id },
      data: { status },
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.task.delete({ where: { id } });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let whereClause = {};
    if (role === 'MEMBER') {
      whereClause = { assignedTo: userId };
    }

    const totalTasks = await prisma.task.count({ where: whereClause });
    const completedTasks = await prisma.task.count({
      where: { ...whereClause, status: 'COMPLETED' },
    });
    const pendingTasks = await prisma.task.count({
      where: { ...whereClause, status: 'PENDING' },
    });
    const inProgressTasks = await prisma.task.count({
      where: { ...whereClause, status: 'IN_PROGRESS' },
    });

    const overdueTasks = await prisma.task.count({
      where: {
        ...whereClause,
        status: { not: 'COMPLETED' },
        dueDate: { lt: new Date() },
      },
    });

    const recentTasks = await prisma.task.findMany({
      where: whereClause,
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { project: { select: { name: true } } },
    });

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueTasks,
      recentTasks,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getDashboardStats,
};
