
import React from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Check, X, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AIAgent, ServiceCategory } from '@/contexts/AgentContext';
import { PieChart, Pie, Cell } from 'recharts';

interface AgentCardProps {
  agent: AIAgent;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const { isAdmin } = useAuth();

  // Prepare data for pie chart
  const pieData = Object.entries(agent.categoriesDistribution).map(([name, value]) => ({
    name: name as ServiceCategory,
    value
  })).filter(item => item.value > 0);

  // Define colors for categories
  const COLORS = {
    'INTEGRATIONS': '#4071FF',
    'REASONING': '#E63946',
    'DB': '#FFC145',
    'DOCUMENT COMPOSITION': '#E63946',
    'SCRAPING - CRAWLING': '#3CAF85',
    'LLM PROVIDER': '#9B6DFF'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 relative">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-xl font-semibold">
            {agent.logo}
          </div>
          <div>
            <div className="text-gray-500 text-sm">{agent.subtitle}</div>
            <h3 className="text-2xl font-bold">{agent.title} {agent.version}</h3>
          </div>
        </div>
        <div className="flex gap-2">
          {isAdmin() && (
            <Link to={`/agents/${agent.id}/edit`} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
              <Pencil className="w-5 h-5 text-gray-600" />
            </Link>
          )}
          {agent.isActive ? (
            <div className="p-2 bg-green-100 rounded-full">
              <Check className="w-5 h-5 text-green-600" />
            </div>
          ) : (
            <div className="p-2 bg-red-100 rounded-full">
              <X className="w-5 h-5 text-red-600" />
            </div>
          )}
        </div>
      </div>

      <p className="text-gray-600 mb-6">
        {agent.description}
      </p>

      <div className="mb-6">
        <div className="text-gray-700 font-medium mb-2">Related services:</div>
        <div className="flex gap-2">
          {agent.services.map((service, index) => (
            <div key={index} className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              {service.logo || service.name.charAt(0)}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="text-gray-700 font-medium mb-2">Applied service categories</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(agent.categoriesDistribution)
            .filter(([_, value]) => value > 0)
            .map(([category]) => {
              const cat = category as ServiceCategory;
              let badgeClass = '';
              
              if (cat === 'INTEGRATIONS') badgeClass = 'service-badge-integrations';
              else if (cat === 'REASONING') badgeClass = 'service-badge-reasoning';
              else if (cat === 'DB') badgeClass = 'service-badge-db';
              
              return (
                <span key={cat} className={`service-badge ${badgeClass}`}>
                  {cat}
                </span>
              );
            })}
        </div>
        
        <div className="flex justify-center">
          <PieChart width={140} height={140}>
            <Pie
              data={pieData}
              cx={70}
              cy={70}
              innerRadius={45}
              outerRadius={65}
              fill="#8884d8"
              dataKey="value"
              stroke="none"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
              ))}
            </Pie>
          </PieChart>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-gray-700 font-medium mb-2">LLMs used:</div>
        <div className="flex gap-2">
          {agent.llms.map((llm, index) => (
            <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
              {llm}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 border-t pt-4 text-center">
        <div>
          <div className="text-gray-500 text-sm">Total cost</div>
          <div className="text-blue-500 font-semibold">€ {agent.totalCost.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-gray-500 text-sm">Services</div>
          <div className="text-gray-700">€ {agent.servicesCost.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-gray-500 text-sm">LLM</div>
          <div className="text-gray-700">€ {agent.llmCost.toFixed(2)}</div>
        </div>
      </div>

      <Link 
        to={`/agents/${agent.id}`}
        className={`mt-6 flex items-center justify-center gap-2 py-3 px-6 rounded-lg w-full transition-colors ${
          agent.isActive 
            ? 'bg-action-primary text-white hover:bg-opacity-90' 
            : 'bg-indigo-100 text-indigo-800'
        }`}
      >
        <MessageCircle className="w-5 h-5" />
        <span>Chat with Agent</span>
      </Link>
    </div>
  );
};

export default AgentCard;
