const prisma = require('../config/prisma');

const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId: req.user.id,
        members: {
          create: { userId: req.user.id }, // Owner is also a member
        },
      },
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: { userId: req.user.id },
        },
      },
      include: {
        owner: { select: { name: true, email: true } },
        _count: { select: { tasks: true, members: true } },
      },
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        members: { include: { user: { select: { id: true, name: true, email: true, role: true } } } },
        tasks: { include: { assignee: { select: { name: true } } } },
      },
    });

    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Check if user is a member
    const isMember = project.members.some(m => m.userId === req.user.id);
    if (!isMember && project.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied: You are not a member of this project' });
    }

    // If member is not admin, only show their assigned tasks (optional, based on requirement)
    if (req.user.role === 'MEMBER') {
      project.tasks = project.tasks.filter(task => task.assignedTo === req.user.id);
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const project = await prisma.project.findUnique({ where: { id } });
    if (project.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Only owners can update projects' });
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: { name, description },
    });
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({ where: { id } });
    if (project.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Only owners can delete projects' });
    }

    await prisma.projectMember.deleteMany({ where: { projectId: id } });
    await prisma.task.deleteMany({ where: { projectId: id } });
    await prisma.project.delete({ where: { id } });

    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase();

    const userToAdd = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!userToAdd) return res.status(404).json({ message: 'User not found' });

    const membership = await prisma.projectMember.create({
      data: {
        projectId,
        userId: userToAdd.id,
      },
    });
    res.json(membership);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const removeMember = async (req, res) => {
  try {
    const { projectId, userId } = req.params;
    await prisma.projectMember.delete({
      where: {
        userId_projectId: { userId, projectId },
      },
    });
    res.json({ message: 'Member removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};
