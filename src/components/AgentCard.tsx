
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Database, Activity, FileEdit, ClipboardList, Globe, Cloud, Check, X, Pencil } from 'lucide-react';
import { AIAgent, ServiceCategory } from '@/contexts/AgentContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

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
    'REASONING': '#E63946',
    'DB': '#FFC145',
    'DOCUMENT COMPOSITION': '#E63946',
    'SCRAPING - CRAWLING': '#3CAF85',
    'LLM PROVIDER': '#9B6DFF'
  };

  const logoInitials = agent.title.substring(0, 2).toUpperCase();
  
  const isValidLogoUrl = typeof agent.logo === 'string' && 
    (agent.logo.startsWith('http') || agent.logo.startsWith('data:'));
  
  const displayLLMs = agent.llms.length > 0 
    ? agent.llms 
    : ['GPT-4o Mini'];

  // Helper function to get the appropriate icon for a service
  const getServiceIcon = (serviceName: string) => {
    const name = serviceName.toLowerCase();
    
    if (name.includes('database') || name.includes('sql') || name.includes('storage')) {
      return <Database className="w-4 h-4" />;
    } else if (name.includes('analytics') || name.includes('monitor') || name.includes('metrics')) {
      return <Activity className="w-4 h-4" />;
    } else if (name.includes('document') || name.includes('file') || name.includes('text')) {
      return <FileEdit className="w-4 h-4" />;
    } else if (name.includes('list') || name.includes('task') || name.includes('check')) {
      return <ClipboardList className="w-4 h-4" />;
    } else if (name.includes('web') || name.includes('api') || name.includes('http')) {
      return <Globe className="w-4 h-4" />;
    } else if (name.includes('cloud') || name.includes('aws') || name.includes('azure')) {
      return <Cloud className="w-4 h-4" />;
    } else {
      return <Database className="w-4 h-4" />; // Default icon
    }
  };

  // Function to get appropriate color based on category
  const getCategoryBadgeColors = (category: ServiceCategory) => {
    switch(category) {
      case 'INTEGRATIONS':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'REASONING':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'DB':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'DOCUMENT COMPOSITION':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'SCRAPING - CRAWLING':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'LLM PROVIDER':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className="overflow-hidden rounded-lg border border-gray-100 h-full flex flex-col">
      {/* Card Header */}
      <div className="p-4 bg-white">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 rounded-lg">
              {isValidLogoUrl ? (
                <AvatarImage src={agent.logo} alt={agent.title} className="object-cover" />
              ) : null}
              <AvatarFallback className="bg-gray-100 text-gray-700 text-xl font-semibold rounded-lg">
                {logoInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{agent.title}</h3>
              <p className="text-sm text-gray-500">{agent.subtitle || "Agent"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin() && (
              <Link 
                to={`/agents/${agent.id}/edit`}
                className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200 transition-all"
                title="Edit Agent"
              >
                <Pencil className="w-4 h-4 text-gray-600" />
              </Link>
            )}
            {agent.isActive ? (
              <div className="p-1.5 bg-green-100 rounded-md" title="Active">
                <Check className="w-4 h-4 text-green-600" />
              </div>
            ) : (
              <div className="p-1.5 bg-red-100 rounded-md" title="Inactive">
                <X className="w-4 h-4 text-red-600" />
              </div>
            )}
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 h-10">{agent.description}</p>
        
        {/* Services Row */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-1">
            <p className="text-xs font-medium text-gray-500 w-full">Services:</p>
            <div className="flex flex-wrap gap-2">
              {agent.services.slice(0, 5).map((service, index) => (
                <div key={index} 
                  className="p-1.5 bg-gray-100 rounded-md flex items-center justify-center"
                  title={service.name}
                >
                  {getServiceIcon(service.name)}
                </div>
              ))}
              {agent.services.length > 5 && (
                <div className="p-1.5 bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-xs text-gray-600 font-medium">+{agent.services.length - 5}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Categories */}
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-500 mb-2">Categories:</p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(agent.categoriesDistribution)
              .filter(([_, value]) => value > 0)
              .slice(0, 3)
              .map(([category]) => {
                const categoryType = category as ServiceCategory;
                return (
                  <Badge 
                    key={category} 
                    variant="outline"
                    className={`px-2 py-1 text-xs ${getCategoryBadgeColors(categoryType)}`}
                  >
                    {category}
                  </Badge>
                );
              })}
            {Object.entries(agent.categoriesDistribution)
              .filter(([_, value]) => value > 0).length > 3 && (
              <Badge 
                variant="outline"
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700"
              >
                +{Object.entries(agent.categoriesDistribution)
                  .filter(([_, value]) => value > 0).length - 3}
              </Badge>
            )}
          </div>
        </div>
        
        {/* LLMs */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2">LLMs:</p>
          <div className="flex flex-wrap gap-1.5">
            {displayLLMs.slice(0, 2).map((llm, index) => (
              <Badge 
                key={index} 
                variant="outline"
                className="px-2 py-1 bg-indigo-100 text-indigo-700 border-indigo-200 text-xs"
              >
                {llm}
              </Badge>
            ))}
            {displayLLMs.length > 2 && (
              <Badge 
                variant="outline"
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs"
              >
                +{displayLLMs.length - 2}
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      {/* Cost Section */}
      <div className="mt-auto">
        <Separator />
        <div className="grid grid-cols-3 gap-2 p-3 text-center bg-gray-50">
          <div>
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-sm font-semibold text-blue-600">€{agent.totalCost.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Services</p>
            <p className="text-sm font-semibold text-gray-700">€{agent.servicesCost.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">LLM</p>
            <p className="text-sm font-semibold text-gray-700">€{agent.llmCost.toFixed(2)}</p>
          </div>
        </div>
        
        {/* Action Button */}
        <Link 
          to={`/agents/${agent.id}`}
          className={`block w-full py-3 px-4 text-center font-medium ${
            agent.isActive 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
              : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
          } transition-colors`}
        >
          <div className="flex items-center justify-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Chat with Agent
          </div>
        </Link>
      </div>
    </Card>
  );
};

export default AgentCard;
