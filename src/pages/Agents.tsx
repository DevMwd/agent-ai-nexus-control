
import React from 'react';
import { Link } from 'react-router-dom';
import { useAgents } from '@/contexts/AgentContext';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Pencil } from 'lucide-react';
import AgentCard from '@/components/AgentCard';
import { Button } from '@/components/ui/button';

const Agents: React.FC = () => {
  const { agents } = useAgents();
  const { isAdmin } = useAuth();

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Agents Team</h1>
        {isAdmin() && (
          <Link 
            to="/agents/new" 
            className="flex items-center gap-2 bg-action-primary text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Agent marketplace</span>
            <span className="bg-white text-action-primary text-xs px-2 py-0.5 rounded-full ml-1">Soon</span>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="relative">
            <AgentCard agent={agent} />
            {isAdmin() && (
              <Link 
                to={`/agents/${agent.id}/edit`}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition-all"
                title="Edit Agent"
              >
                <Pencil className="w-4 h-4 text-gray-600" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Agents;
