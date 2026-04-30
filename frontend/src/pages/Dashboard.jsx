import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { taskAPI } from '../services/api';
import { CheckCircle2, Clock, AlertCircle, ListTodo, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await taskAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Tasks', value: stats?.totalTasks || 0, icon: ListTodo, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Completed', value: stats?.completedTasks || 0, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'In Progress', value: stats?.inProgressTasks || 0, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Overdue', value: stats?.overdueTasks || 0, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>)}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">Here's what's happening with your projects and tasks.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${card.bg} ${card.color} mr-4`}>
                <card.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Recent Tasks</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {stats?.recentTasks?.length > 0 ? (
            stats.recentTasks.map((task) => (
              <div key={task.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-4 ${
                    task.status === 'COMPLETED' ? 'bg-green-500' : 
                    task.status === 'IN_PROGRESS' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
                    <p className="text-xs text-gray-500">{task.project.name}</p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-10 text-center text-gray-500">
              No tasks found.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
