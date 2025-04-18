
import React from 'react';
import { Link } from 'react-router-dom';
import { useAgents } from '@/contexts/AgentContext';
import { useAuth } from '@/contexts/AuthContext';
import { Plus } from 'lucide-react';
import AgentCard from '@/components/AgentCard';

const Agents: React.FC = () => {
  const { agents, loading } = useAgents();
  const { isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading agents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Agents Team</h1>
        {isAdmin() && (
          <Link 
            to="/agents/new" 
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
          >
            <Plus className="w-5 h-5" />
            <span>Agent marketplace</span>
            <span className="bg-white text-indigo-600 text-xs px-2 py-0.5 rounded-full ml-1">Soon</span>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="h-full transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <AgentCard agent={agent} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Agents;
