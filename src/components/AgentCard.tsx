
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Pencil, Check, X, Database, Activity, FileEdit, ClipboardList, Globe, Cloud } from 'lucide-react';
import { AIAgent, ServiceCategory } from '@/contexts/AgentContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell } from 'recharts';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

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
      return <Database className="w-4 h-4 text-blue-600" />;
    } else if (name.includes('analytics') || name.includes('monitor') || name.includes('metrics')) {
      return <Activity className="w-4 h-4 text-red-600" />;
    } else if (name.includes('document') || name.includes('file') || name.includes('text')) {
      return <FileEdit className="w-4 h-4 text-purple-600" />;
    } else if (name.includes('list') || name.includes('task') || name.includes('check')) {
      return <ClipboardList className="w-4 h-4 text-yellow-600" />;
    } else if (name.includes('web') || name.includes('api') || name.includes('http')) {
      return <Globe className="w-4 h-4 text-green-600" />;
    } else if (name.includes('cloud') || name.includes('aws') || name.includes('azure')) {
      return <Cloud className="w-4 h-4 text-indigo-600" />;
    } else {
      return <Database className="w-4 h-4 text-gray-600" />; // Default icon
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

  // Get status icon based on isActive
  const StatusIcon = agent.isActive 
    ? <div className="p-2 bg-white rounded-full shadow-sm" title="Active"><Check className="w-4 h-4 text-green-500" /></div>
    : <div className="p-2 bg-white rounded-full shadow-sm" title="Inactive"><X className="w-4 h-4 text-red-500" /></div>;

  return (
    <Card className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-14 h-14">
              {isValidLogoUrl ? (
                <AvatarImage src={agent.logo} alt={agent.title} className="object-cover" />
              ) : null}
              <AvatarFallback className="bg-gray-200 text-gray-700 text-xl font-semibold">
                {logoInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-gray-500">{agent.subtitle}</p>
              <h3 className="text-xl font-bold">{agent.title} {agent.version}</h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin() && (
              <Link 
                to={`/agents/${agent.id}/edit`}
                className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-all"
                title="Edit Agent"
              >
                <Pencil className="w-4 h-4 text-gray-600" />
              </Link>
            )}
            {StatusIcon}
          </div>
        </div>
      </div>

      <div className="px-5 pb-4">
        <p className="text-gray-600 text-sm">{agent.description}</p>
      </div>

      <div className="px-5 pb-4 flex justify-between items-start">
        <div>
          <h4 className="text-sm font-medium mb-2">Related services:</h4>
          <div className="flex gap-2">
            {agent.services.slice(0, 3).map((service, index) => (
              <div key={index} className="p-2 bg-gray-100 rounded-full flex items-center justify-center">
                {getServiceIcon(service.name)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 pb-4">
        <h4 className="text-sm font-medium mb-3">Applied service categories</h4>
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(agent.categoriesDistribution)
            .filter(([_, value]) => value > 0)
            .map(([category]) => {
              const categoryType = category as ServiceCategory;
              const colorClass = getCategoryBadgeColors(categoryType);
              
              let iconComponent;
              switch (categoryType) {
                case 'INTEGRATIONS':
                  iconComponent = <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>;
                  break;
                case 'REASONING':
                  iconComponent = <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>;
                  break;
                case 'DB':
                  iconComponent = <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>;
                  break;
                default:
                  iconComponent = <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /></svg>;
              }
              
              return (
                <div 
                  key={category} 
                  className={`px-3 py-1 rounded-full text-xs border ${colorClass} font-medium flex items-center`}
                >
                  {iconComponent}
                  {category}
                </div>
              );
            })}
        </div>

        <div className="flex">
          <div className="w-2/3">
            {/* Category Badges */}
          </div>
          <div className="w-1/3 flex justify-center">
            <PieChart width={90} height={90}>
              <Pie
                data={categoryData}
                cx={45}
                cy={45}
                innerRadius={20}
                outerRadius={35}
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
      </div>

      <div className="px-5 pb-4">
        <h4 className="text-sm font-medium mb-2">LLMs used:</h4>
        <div className="flex flex-wrap gap-2">
          {displayLLMs.map((llm, index) => (
            <div 
              key={index} 
              className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium border border-indigo-200"
            >
              {llm}
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-2" />

      <div className="px-5 py-3 grid grid-cols-3 gap-4">
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
    </Card>
  );
};

export default AgentCard;
