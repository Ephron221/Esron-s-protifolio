import React from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  MessageSquare, 
  Settings, 
  Layers, 
  TrendingUp, 
  Clock,
  ExternalLink
} from 'lucide-react';
import { useProjects, useSkills, useServices } from '../../hooks/usePortfolio';

const DashboardOverview = () => {
  const { data: projects } = useProjects();
  const { data: skills } = useSkills();
  const { data: services } = useServices();

  const stats = [
    { label: 'Total Projects', value: projects?.length || 0, icon: Briefcase, color: 'text-primary' },
    { label: 'Skills Added', value: skills?.length || 0, icon: Settings, color: 'text-blue-500' },
    { label: 'Services Offered', value: services?.length || 0, icon: Layers, color: 'text-purple-500' },
    { label: 'Recent Messages', value: 12, icon: MessageSquare, color: 'text-secondary-success' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome back, Admin. Here's what's happening with your portfolio.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-black/40 p-6 rounded-2xl border border-gray-200 dark:border-white/5 hover:border-primary/50 dark:hover:border-primary/20 transition-all shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gray-100 dark:bg-white/5 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-bold text-secondary-success bg-secondary-success/10 px-2 py-1 rounded-full flex items-center gap-1">
                <TrendingUp size={12} /> +2.5%
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-black/40 p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <Clock size={20} className="text-primary" /> Recent Activity
            </h2>
            <button className="text-sm text-primary hover:underline">View all</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {i}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">New project "AI Portfolio" added</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">2 hours ago</p>
                </div>
                <button className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors">
                  <ExternalLink size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white dark:bg-black/40 p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full p-4 text-left rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-primary hover:text-black transition-all font-medium group text-gray-700 dark:text-white">
              Add New Project
            </button>
            <button className="w-full p-4 text-left rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-primary hover:text-black transition-all font-medium group text-gray-700 dark:text-white">
              Update Skills
            </button>
            <button className="w-full p-4 text-left rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-primary hover:text-black transition-all font-medium group text-gray-700 dark:text-white">
              Check Messages
            </button>
            <button className="w-full p-4 text-left rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-primary hover:text-black transition-all font-medium group text-gray-700 dark:text-white">
              Edit Home Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
