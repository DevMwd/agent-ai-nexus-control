
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Database, FileText, Pencil, Check, Download, FileJson, Code } from 'lucide-react';
import { AIAgent, ServiceCategory } from '@/contexts/AgentContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { PieChart, Pie, Cell } from 'recharts';

interface AgentCardProps {
  agent: AIAgent;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const { isAdmin } = useAuth();
  
  const categoryData = Object.entries(agent.categoriesDistribution)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name: name as ServiceCategory,
      value
    }));

  const COLORS: Record<ServiceCategory, string> = {
    'INTEGRATIONS': '#4071FF',
    'REASONING': '#4071FF',
    'DB': '#e2e8f0',
    'DOCUMENT COMPOSITION': '#E63946',
    'SCRAPING - CRAWLING': '#3CAF85',
    'LLM PROVIDER': '#1a1562'
  };

  const logoInitials = agent.title.substring(0, 2).toUpperCase();
  
  const isValidLogoUrl = typeof agent.logo === 'string' && 
    (agent.logo.startsWith('http') || agent.logo.startsWith('data:'));
  
  // Helper function to get the appropriate icon for a service
  const getServiceIcon = (serviceName: string) => {
    const name = serviceName.toLowerCase();
    
    if (name.includes('database') || name.includes('sql') || name.includes('storage') || name.includes('airtable')) {
      return <Database className="w-5 h-5" />;
    } else if (name.includes('document') || name.includes('file') || name.includes('text') || name.includes('apitemplate')) {
      return <FileText className="w-5 h-5" />;
    } else if (name.includes('code') || name.includes('api') || name.includes('firecrawl')) {
      return <Code className="w-5 h-5" />;
    } else {
      return <FileJson className="w-5 h-5" />; // Default icon
    }
  };

  return (
    <Card className="overflow-hidden rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col">
      {/* Card Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 rounded-full bg-gray-200">
              {isValidLogoUrl ? (
                <AvatarImage src={agent.logo} alt={agent.title} className="object-cover" />
              ) : null}
              <AvatarFallback className="text-xl font-semibold text-gray-500">
                {logoInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-gray-500 text-sm">{agent.subtitle}</p>
              <h3 className="text-2xl font-bold text-black mt-1">{agent.title} {agent.version}</h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin() && (
              <div 
                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-all cursor-pointer"
                title="Edit Agent"
              >
                <Pencil className="w-5 h-5 text-gray-600" />
              </div>
            )}
            {agent.isActive ? (
              <div className="p-2 bg-green-500 rounded-full" title="Active">
                <Check className="w-5 h-5 text-white" />
              </div>
            ) : (
              <div className="p-2 bg-red-500 rounded-full" title="Inactive">
                <Check className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        </div>
        
        <p className="text-gray-500 mb-6">{agent.description}</p>
        
        {/* Related Services Section */}
        <div className="mb-6">
          <h4 className="text-xl font-bold text-black mb-3">Related services:</h4>
          <div className="flex gap-2">
            {agent.services.slice(0, 3).map((service, index) => (
              <div 
                key={index} 
                className="p-2.5 bg-gray-200 rounded-full flex items-center justify-center"
                title={service.name}
              >
                {getServiceIcon(service.name)}
              </div>
            ))}
          </div>
        </div>
        
        {/* Categories Section with Chart */}
        <div className="mb-6">
          <h4 className="text-xl font-bold text-black mb-3">Applied service categories</h4>
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="space-y-2 mb-4 md:mb-0">
              {Object.entries(agent.categoriesDistribution)
                .filter(([_, value]) => value > 0)
                .slice(0, 3)
                .map(([category]) => {
                  const categoryType = category as ServiceCategory;
                  let icon;
                  
                  if (categoryType === 'INTEGRATIONS') {
                    icon = <Download className="w-4 h-4 text-blue-600" />;
                  } else if (categoryType === 'REASONING') {
                    icon = <FileText className="w-4 h-4 text-blue-600" />;
                  } else if (categoryType === 'DB') {
                    icon = <Database className="w-4 h-4 text-blue-600" />;
                  } else {
                    icon = <FileJson className="w-4 h-4 text-blue-600" />;
                  }
                  
                  return (
                    <div 
                      key={category} 
                      className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-full border border-blue-200 w-fit"
                    >
                      {icon}
                      <span className="ml-2 font-medium">{category}</span>
                    </div>
                  );
                })}
            </div>
            
            <div className="w-36 h-36 mx-auto md:mx-0">
              <PieChart width={150} height={150}>
                <Pie
                  data={categoryData}
                  cx={75}
                  cy={75}
                  innerRadius={35}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[entry.name] || '#e2e8f0'} 
                    />
                  ))}
                </Pie>
              </PieChart>
            </div>
          </div>
        </div>
        
        {/* LLMs Section */}
        <div className="mb-6">
          <h4 className="text-xl font-bold text-black mb-2">LLMs used:</h4>
          <div className="flex flex-wrap gap-2">
            {agent.llms.map((llm, index) => (
              <span 
                key={index} 
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {llm}
              </span>
            ))}
          </div>
        </div>
        
        {/* Cost Section */}
        <div className="grid grid-cols-3 gap-2 mb-2">
          <div>
            <p className="text-gray-500 mb-1">Total cost</p>
            <p className="text-xl font-bold text-blue-600">€ {agent.totalCost.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">Services</p>
            <p className="text-xl font-bold text-gray-700">€ {agent.servicesCost.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-500 mb-1">LLM</p>
            <p className="text-xl font-bold text-gray-700">€ {agent.llmCost.toFixed(2)}</p>
          </div>
        </div>
      </div>
      
      {/* Action Button */}
      <div className="mt-auto">
        <Link 
          to={`/agents/${agent.id}`}
          className="block w-full py-4 px-4 bg-indigo-100 text-center font-medium text-indigo-900 hover:bg-indigo-200 transition-colors"
        >
          <div className="flex items-center justify-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <span className="text-lg">Chat with Agent</span>
          </div>
        </Link>
      </div>
    </Card>
  );
};

export default AgentCard;
