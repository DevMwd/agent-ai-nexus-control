
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Download, FileText, Database, Pencil, Check } from 'lucide-react';
import { AIAgent, ServiceCategory } from '@/contexts/AgentContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
      return <Database className="w-5 h-5 text-gray-600" />;
    } else if (name.includes('document') || name.includes('file') || name.includes('text')) {
      return <FileText className="w-5 h-5 text-gray-600" />;
    } else {
      return <Download className="w-5 h-5 text-gray-600" />; 
    }
  };
  
  // Function to get category icon
  const getCategoryIcon = (category: string) => {
    if (category === 'INTEGRATIONS') {
      return <Download className="w-4 h-4 mr-1" />;
    } else if (category === 'REASONING') {
      return <FileText className="w-4 h-4 mr-1" />;
    } else if (category === 'DB') {
      return <Database className="w-4 h-4 mr-1" />;
    }
    return null;
  };

  return (
    <Card className="overflow-hidden rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col bg-white">
      {/* Card Header */}
      <div className="p-6">
        {/* Title section with avatar and edit/active buttons */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 rounded-full bg-gray-200">
              {isValidLogoUrl ? (
                <AvatarImage src={agent.logo} alt={agent.title} className="object-cover" />
              ) : null}
              <AvatarFallback className="text-2xl font-semibold text-gray-600">
                {logoInitials}
              </AvatarFallback>
            </Avatar>
            <div className="mt-1">
              <p className="text-gray-500 text-sm">{agent.subtitle}</p>
              <h3 className="text-3xl font-bold text-black mt-1">{agent.title} {agent.version}</h3>
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
        
        {/* Description and Related services in a row */}
        <div className="flex justify-between mb-10">
          <div className="w-1/2 pr-4">
            <p className="text-gray-500">{agent.description}</p>
          </div>
          <div>
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
        </div>
        
        {/* Applied service categories with chart */}
        <div className="mb-8">
          <h4 className="text-xl font-bold text-black mb-4">Applied service categories</h4>
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              {Object.entries(agent.categoriesDistribution)
                .filter(([_, value]) => value > 0)
                .slice(0, 3)
                .map(([category]) => {
                  const categoryName = category as ServiceCategory;
                  return (
                    <Badge 
                      key={category}
                      className="flex items-center text-blue-700 bg-blue-50 border-blue-200 rounded-full py-1 px-4 text-xs"
                      variant="outline"
                    >
                      {getCategoryIcon(categoryName)}
                      <span>{categoryName}</span>
                    </Badge>
                  );
                })}
            </div>
            
            {/* Custom donut chart that matches design with tooltips */}
            <div className="h-32 w-32 relative">
              <svg viewBox="0 0 36 36" className="h-full w-full">
                <TooltipProvider>
                  {/* Background circle */}
                  <circle cx="18" cy="18" r="15.915" fill="none" className="stroke-[3]" stroke="#e2e8f0" strokeDasharray="100" strokeDashoffset="0"></circle>
                  
                  {/* LLM PROVIDER segment */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <circle 
                        cx="18" 
                        cy="18" 
                        r="15.915" 
                        fill="none" 
                        className="stroke-[3] cursor-pointer" 
                        stroke="#1a1562" 
                        strokeDasharray="25 75" 
                        strokeDashoffset="0" 
                        strokeLinecap="round"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>LLM PROVIDER: 25%</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  {/* INTEGRATIONS segment */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <circle 
                        cx="18" 
                        cy="18" 
                        r="15.915" 
                        fill="none" 
                        className="stroke-[3] cursor-pointer" 
                        stroke="#4071FF" 
                        strokeDasharray="40 60" 
                        strokeDashoffset="-25" 
                        strokeLinecap="round"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>INTEGRATIONS: 40%</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  {/* DB segment */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <circle 
                        cx="18" 
                        cy="18" 
                        r="15.915" 
                        fill="none" 
                        className="stroke-[3] cursor-pointer" 
                        stroke="#e2e8f0" 
                        strokeDasharray="35 65" 
                        strokeDashoffset="-65" 
                        strokeLinecap="round"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>DB: 35%</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </svg>
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
          className="block w-full py-4 px-4 bg-blue-100 text-center font-medium text-blue-900 hover:bg-blue-200 transition-colors"
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
