
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Pencil, Check, X } from 'lucide-react';
import { AIAgent, ServiceCategory } from '@/contexts/AgentContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell } from 'recharts';

interface AgentCardProps {
  agent: AIAgent;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const { isAdmin } = useAuth();
  
  // Transform categories distribution for the pie chart
  const categoryData = Object.entries(agent.categoriesDistribution)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name: name as ServiceCategory,
      value
    }));
  
  // Define colors for categories
  const COLORS: Record<ServiceCategory, string> = {
    'INTEGRATIONS': '#4071FF',
    'REASONING': '#E63946',
    'DB': '#FFC145',
    'DOCUMENT COMPOSITION': '#E63946',
    'SCRAPING - CRAWLING': '#3CAF85',
    'LLM PROVIDER': '#9B6DFF'
  };
  
  return (
    <Card className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative">
        {/* Agent header with status icon */}
        <div className="p-6 pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold">
                {agent.logo}
              </div>
              <div>
                <p className="text-sm text-gray-500">{agent.subtitle}</p>
                <h3 className="text-xl font-bold">{agent.title} {agent.version}</h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin() && (
                <Link 
                  to={`/agents/${agent.id}/edit`}
                  className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-all"
                  title="Edit Agent"
                >
                  <Pencil className="w-4 h-4 text-gray-600" />
                </Link>
              )}
              {agent.isActive ? (
                <div className="p-2 bg-white rounded-full shadow" title="Active">
                  <Check className="w-4 h-4 text-green-500" />
                </div>
              ) : (
                <div className="p-2 bg-white rounded-full shadow" title="Inactive">
                  <X className="w-4 h-4 text-red-500" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Agent description */}
        <div className="px-6 pb-4">
          <p className="text-gray-600 text-sm">{agent.description}</p>
        </div>

        {/* Related services */}
        <div className="px-6 pb-4">
          <h4 className="text-sm font-medium mb-2">Related services:</h4>
          <div className="flex gap-2">
            {agent.services.slice(0, 3).map((service, index) => (
              <div key={index} className="p-2 bg-gray-100 rounded-full">
                <span className="text-xs">{service.name.charAt(0)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Applied service categories */}
        <div className="px-6 pb-4">
          <h4 className="text-sm font-medium mb-2">Applied service categories</h4>
          <div className="flex flex-wrap gap-2 mb-3">
            {Object.entries(agent.categoriesDistribution)
              .filter(([_, value]) => value > 0)
              .map(([category]) => {
                const categoryType = category as ServiceCategory;
                let bgColor = 'bg-blue-100';
                let textColor = 'text-blue-700';
                
                switch (categoryType) {
                  case 'INTEGRATIONS':
                    bgColor = 'bg-blue-100';
                    textColor = 'text-blue-700';
                    break;
                  case 'REASONING':
                    bgColor = 'bg-red-100';
                    textColor = 'text-red-700';
                    break;
                  case 'DB':
                    bgColor = 'bg-yellow-100';
                    textColor = 'text-yellow-700';
                    break;
                  case 'DOCUMENT COMPOSITION':
                    bgColor = 'bg-purple-100';
                    textColor = 'text-purple-700';
                    break;
                  case 'SCRAPING - CRAWLING':
                    bgColor = 'bg-green-100';
                    textColor = 'text-green-700';
                    break;
                  case 'LLM PROVIDER':
                    bgColor = 'bg-indigo-100';
                    textColor = 'text-indigo-700';
                    break;
                }
                
                return (
                  <div 
                    key={category} 
                    className={`px-3 py-1 rounded-full text-xs ${bgColor} ${textColor} font-medium uppercase`}
                  >
                    {category}
                  </div>
                );
              })}
          </div>
          
          {/* Pie chart for categories */}
          <div className="h-24 flex justify-center">
            <PieChart width={100} height={100}>
              <Pie
                data={categoryData}
                cx={50}
                cy={50}
                innerRadius={25}
                outerRadius={40}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                ))}
              </Pie>
            </PieChart>
          </div>
        </div>

        {/* LLMs used */}
        <div className="px-6 pb-4">
          <h4 className="text-sm font-medium mb-2">LLMs used:</h4>
          <div className="flex flex-wrap gap-2">
            {agent.llms.map((llm, index) => (
              <div 
                key={index} 
                className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium"
              >
                {llm}
              </div>
            ))}
          </div>
        </div>

        {/* Cost section */}
        <div className="px-6 pb-4 grid grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-500">Total cost</div>
            <div className="text-lg font-semibold text-blue-500">€ {agent.totalCost.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Services</div>
            <div className="text-lg font-semibold">€ {agent.servicesCost.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">LLM</div>
            <div className="text-lg font-semibold">€ {agent.llmCost.toFixed(2)}</div>
          </div>
        </div>

        {/* Chat with Agent button */}
        <Link 
          to={`/agents/${agent.id}`}
          className={`block w-full py-3 px-4 text-center font-medium ${
            agent.isActive 
              ? 'bg-indigo-900 text-white hover:bg-indigo-800' 
              : 'bg-indigo-100 text-indigo-900 hover:bg-indigo-200'
          } transition-colors`}
        >
          <div className="flex items-center justify-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Chat with Agent
          </div>
        </Link>
      </div>
    </Card>
  );
};

export default AgentCard;
