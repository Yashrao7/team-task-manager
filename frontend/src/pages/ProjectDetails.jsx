import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { projectAPI, taskAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  ClipboardList, 
  Plus, 
  MoreVertical, 
  Trash2, 
  UserPlus, 
  UserMinus,
  Calendar,
  Clock,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignedTo: '',
    status: 'PENDING'
  });
  
  const [memberEmail, setMemberEmail] = useState('');

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const { data } = await projectAPI.getById(id);
      setProject(data);
    } catch (error) {
      toast.error('Failed to fetch project details');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await taskAPI.create({ ...taskForm, projectId: id });
      toast.success('Task created!');
      setIsTaskModalOpen(false);
      setTaskForm({ title: '', description: '', dueDate: '', assignedTo: '', status: 'PENDING' });
      fetchProject();
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await projectAPI.addMember(id, { email: memberEmail });
      toast.success('Member added!');
      setIsMemberModalOpen(false);
      setMemberEmail('');
      fetchProject();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add member');
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await taskAPI.updateStatus(taskId, newStatus);
      toast.success('Status updated');
      fetchProject();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskAPI.delete(taskId);
      toast.success('Task deleted');
      fetchProject();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this member from project?')) return;
    try {
      await projectAPI.removeMember(id, userId);
      toast.success('Member removed');
      fetchProject();
    } catch (error) {
      toast.error('Failed to remove member');
    }
  };

  if (loading) return <Layout><div className="animate-pulse h-screen bg-gray-100 rounded-xl"></div></Layout>;
  if (!project) return <Layout>Project not found</Layout>;

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content: Tasks */}
        <div className="flex-1">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-6">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                <p className="text-gray-500 text-sm">{project.description}</p>
              </div>
              {user.role === 'ADMIN' && (
                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5 mr-1" />
                  Add Task
                </button>
              )}
            </div>

            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <ClipboardList className="w-5 h-5 mr-2 text-primary" />
                Tasks
              </h3>
              <div className="space-y-4">
                {project.tasks.length > 0 ? (
                  project.tasks.map((task) => (
                    <div key={task.id} className="p-4 border border-gray-100 rounded-xl hover:border-primary/30 transition-colors bg-gray-50/50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-gray-900">{task.title}</h4>
                        <div className="flex items-center space-x-2">
                          <select
                            value={task.status}
                            onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                            className={`text-xs font-medium px-2 py-1 rounded-full border-none focus:ring-0 cursor-pointer ${
                              task.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                              task.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            <option value="PENDING">Pending</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                          </select>
                          {user.role === 'ADMIN' && (
                            <button onClick={() => handleDeleteTask(task.id)} className="text-gray-400 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{task.description}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          Assignee: {task.assignee?.name || 'Unassigned'}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-500">No tasks yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Members */}
        <div className="w-full lg:w-80">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 flex items-center">
                <Users className="w-5 h-5 mr-2 text-primary" />
                Members
              </h3>
              {user.role === 'ADMIN' && (
                <button onClick={() => setIsMemberModalOpen(true)} className="text-primary hover:text-blue-700">
                  <UserPlus className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="p-4 space-y-3">
              {project.members.map((m) => (
                <div key={m.userId} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs mr-3">
                      {m.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{m.user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{m.user.role.toLowerCase()}</p>
                    </div>
                  </div>
                  {user.role === 'ADMIN' && m.userId !== user.id && (
                    <button onClick={() => handleRemoveMember(m.userId)} className="text-gray-300 hover:text-red-500">
                      <UserMinus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Create New Task</h3>
            <form onSubmit={handleCreateTask}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text" required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-gray-900"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-gray-900"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-gray-900"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-gray-900"
                    value={taskForm.assignedTo}
                    onChange={(e) => setTaskForm({...taskForm, assignedTo: e.target.value})}
                  >
                    <option value="">Unassigned</option>
                    {project.members.map(m => (
                      <option key={m.userId} value={m.userId}>{m.user.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex space-x-3">
                <button type="button" onClick={() => setIsTaskModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Add Project Member</h3>
            <form onSubmit={handleAddMember}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">User Email</label>
                <input
                  type="email" required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-gray-900"
                  placeholder="colleague@example.com"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                />
              </div>
              <div className="flex space-x-3">
                <button type="button" onClick={() => setIsMemberModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ProjectDetails;
