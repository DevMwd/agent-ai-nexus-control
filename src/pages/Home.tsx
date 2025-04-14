
import React from 'react';
import { Link } from 'react-router-dom';
import { useAgents } from '@/contexts/AgentContext';
import { Activity, Users, Database, Clock } from 'lucide-react';

const Home: React.FC = () => {
  const { agents } = useAgents();
  
  // Calculate some statistics for the dashboard
  const totalAgents = agents.length;
  const activeAgents = agents.filter(agent => agent.isActive).length;
  const totalSessions = agents.reduce((total, agent) => total + agent.sessions.length, 0);
  const totalCost = agents.reduce((total, agent) => total + agent.totalCost, 0);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your AI Agent Management Platform</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard 
          title="Total Agents" 
          value={totalAgents.toString()} 
          icon={<Users className="w-8 h-8 text-blue-500" />}
          linkTo="/agents"
        />
        <DashboardCard 
          title="Active Agents" 
          value={activeAgents.toString()} 
          icon={<Activity className="w-8 h-8 text-green-500" />}
          linkTo="/agents"
        />
        <DashboardCard 
          title="Total Sessions" 
          value={totalSessions.toString()} 
          icon={<Clock className="w-8 h-8 text-purple-500" />}
          linkTo="/session-logs"
        />
        <DashboardCard 
          title="Total Cost" 
          value={`€${totalCost.toFixed(2)}`} 
          icon={<Database className="w-8 h-8 text-red-500" />}
          linkTo="/admin"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <p className="text-gray-600">Recent agent activity will appear here.</p>
          <Link to="/session-logs" className="text-action-primary font-medium block mt-4">
            View all activity
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/agents" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Activity className="w-6 h-6 text-action-primary mb-2" />
              <span className="font-medium">Manage Agents</span>
            </Link>
            <Link to="/services-llm" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Database className="w-6 h-6 text-action-primary mb-2" />
              <span className="font-medium">Services & LLM</span>
            </Link>
            <Link to="/session-logs" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Clock className="w-6 h-6 text-action-primary mb-2" />
              <span className="font-medium">Session Logs</span>
            </Link>
            <Link to="/profile" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Users className="w-6 h-6 text-action-primary mb-2" />
              <span className="font-medium">Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  linkTo: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, linkTo }) => {
  return (
    <Link to={linkTo} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-600">{title}</h3>
        {icon}
      </div>
      <div className="text-3xl font-bold">{value}</div>
    </Link>
  );
};

export default Home;
