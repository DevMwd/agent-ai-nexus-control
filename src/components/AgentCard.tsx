
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Pencil, Check, X } from 'lucide-react';
import { AIAgent, ServiceCategory } from '@/contexts/AgentContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

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
    <Card className="bg-white rounded-xl shadow-sm overflow-hidden">
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

        {/* Agent description and related services side by side */}
        <div className="px-6 pb-4">
          <div className="flex flex-row gap-6">
            <div className="w-2/3">
              <p className="text-gray-600 text-sm">{agent.description}</p>
            </div>
            <div className="w-1/3">
              <h4 className="text-sm font-medium mb-2">Related services:</h4>
              <div className="flex gap-2">
                {agent.services.slice(0, 3).map((service, index) => (
                  <div key={index} className="p-2 bg-gray-100 rounded-full">
                    <span className="text-xs">{service.name.charAt(0)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Applied service categories and pie chart side by side */}
        <div className="px-6 pb-4">
          <div className="flex flex-row gap-6 items-start">
            <div className="w-2/3">
              <h4 className="text-sm font-medium mb-2">Applied service categories</h4>
              <div className="flex flex-wrap gap-2 mb-3">
                {Object.entries(agent.categoriesDistribution)
                  .filter(([_, value]) => value > 0)
                  .map(([category]) => {
                    const categoryType = category as ServiceCategory;
                    let bgColor = 'bg-blue-100';
                    let textColor = 'text-blue-700';
                    let icon = null;
                    
                    switch (categoryType) {
                      case 'INTEGRATIONS':
                        bgColor = 'bg-blue-100';
                        textColor = 'text-blue-700';
                        icon = <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>;
                        break;
                      case 'REASONING':
                        bgColor = 'bg-red-100';
                        textColor = 'text-red-700';
                        icon = <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>;
                        break;
                      case 'DB':
                        bgColor = 'bg-yellow-100';
                        textColor = 'text-yellow-700';
                        icon = <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>;
                        break;
                      case 'DOCUMENT COMPOSITION':
                        bgColor = 'bg-purple-100';
                        textColor = 'text-purple-700';
                        icon = <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>;
                        break;
                      case 'SCRAPING - CRAWLING':
                        bgColor = 'bg-green-100';
                        textColor = 'text-green-700';
                        icon = <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" x2="22" y1="12" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>;
                        break;
                      case 'LLM PROVIDER':
                        bgColor = 'bg-indigo-100';
                        textColor = 'text-indigo-700';
                        icon = <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.29 7 12 12 20.71 7" /><line x1="12" x2="12" y1="22" y2="12" /></svg>;
                        break;
                    }
                    
                    return (
                      <div 
                        key={category} 
                        className={`px-3 py-1 rounded-full text-xs ${bgColor} ${textColor} font-medium uppercase flex items-center`}
                      >
                        {icon}
                        {category}
                      </div>
                    );
                  })}
              </div>
            </div>
            
            {/* Pie chart for categories with tooltip */}
            <div className="w-1/3 h-24 flex justify-center">
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
                <Tooltip 
                  formatter={(value, name) => [`${value}%`, name]}
                  contentStyle={{ background: 'white', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </PieChart>
            </div>
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
          } transition-colors rounded-b-xl`}
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
