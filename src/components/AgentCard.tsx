import React from 'react';
import { AIAgent } from '@/contexts/AgentContext';

interface AgentCardProps {
  agent: AIAgent;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-xl mr-4">
          {agent.logo}
        </div>
        <div>
          <h3 className="text-lg font-semibold">{agent.title}</h3>
          <p className="text-gray-500 text-sm">{agent.subtitle}</p>
        </div>
      </div>
      <p className="text-gray-600">{agent.description}</p>
    </div>
  );
};

export default AgentCard;
