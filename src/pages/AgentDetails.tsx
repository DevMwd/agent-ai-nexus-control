
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAgents, AIAgent, ServiceCategory } from '@/contexts/AgentContext';
import { Star, Clock, CircleDollarSign, Shield, Cog, ArrowLeft, ChevronDown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScoreBar from '@/components/ScoreBar';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import CategoryChart from '@/components/CategoryChart';
import EfficiencyGauge from '@/components/EfficiencyGauge';
import { Card, CardContent } from '@/components/ui/card';

const AgentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { agents, setCurrentAgent } = useAgents();
  const [agent, setAgent] = useState<AIAgent | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const foundAgent = agents.find(a => a.id === id);
    if (foundAgent) {
      setAgent(foundAgent);
      setCurrentAgent(foundAgent);
    } else {
      navigate('/');
    }

    return () => {
      setCurrentAgent(null);
    };
  }, [id, agents, navigate, setCurrentAgent]);

  if (!agent) {
    return <div>Loading...</div>;
  }

  const logoInitials = agent.title.substring(0, 2).toUpperCase();
  const isValidLogoUrl = typeof agent.logo === 'string' && 
    (agent.logo.startsWith('http') || agent.logo.startsWith('data:'));

  // Prepare data for category chart
  const categoryData = Object.entries(agent.categoriesDistribution).map(([name, value]) => ({
    name,
    value
  })).filter(item => item.value > 0);
  
  // Prepare data for LLM cost distribution chart
  const llmCostData = [
    { name: 'Private GPT', value: 45 },
    { name: 'Azure OpenAI', value: 31 },
    { name: 'Claude 3 Opus', value: 24 }
  ];

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Link to="/" className="flex items-center text-gray-600 hover:text-action-primary">
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back</span>
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <Avatar className="w-16 h-16 bg-gray-200">
          {isValidLogoUrl ? (
            <AvatarImage src={agent.logo} alt={agent.title} className="object-cover" />
          ) : (
            <AvatarFallback className="text-xl font-semibold bg-gray-200 text-gray-600">{logoInitials}</AvatarFallback>
          )}
        </Avatar>
        <div>
          <div className="flex items-center">
            <h1 className="text-3xl font-bold mr-2">{agent.title}</h1>
            <span className="text-gray-500">{agent.subtitle}</span>
          </div>
          <p className="text-gray-600 mt-1">{agent.description}</p>
        </div>
      </div>

      <Tabs defaultValue="agent-stats" className="mb-6">
        <TabsList className="bg-lavender-100 rounded-lg mb-6 w-full max-w-full overflow-x-auto">
          <TabsTrigger value="agent-stats" className="rounded-md data-[state=active]:bg-white">Agent stats</TabsTrigger>
          <TabsTrigger value="chat" className="rounded-md data-[state=active]:bg-white">Chat with Agent</TabsTrigger>
          <TabsTrigger value="session-log" className="rounded-md data-[state=active]:bg-white">Session log</TabsTrigger>
          <TabsTrigger value="reoptimize" className="rounded-md data-[state=active]:bg-white flex items-center">
            Reoptimize
            <span className="bg-white text-gray-400 text-xs px-2 py-0.5 rounded-full ml-1">Soon</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-md data-[state=active]:bg-white">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="agent-stats" className="bg-transparent">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* LLM optimization card */}
            <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
              <div className="flex justify-between mb-6">
                <h3 className="text-xl font-semibold">LLM optimization</h3>
                <div className="text-sm text-right">
                  <div className="font-medium">Private GPT</div>
                  <div className="text-gray-500">Provider</div>
                  <div className="text-gray-500">On-premise</div>
                </div>
              </div>
              <p className="text-gray-500 mb-6">
                Bluesky optimized the LLM models for each node based on 4 key parameters
              </p>

              <div className="p-2 border border-gray-200 rounded-full inline-flex items-center justify-between w-full mb-6">
                <span className="text-gray-700 font-medium">Documents validation</span>
                <ChevronDown className="w-5 h-5 text-gray-500" />
              </div>

              <h4 className="text-lg font-semibold mb-4">Optimization Metrics</h4>
              
              <ScoreBar 
                label="Quality" 
                value={4.6} 
                maxValue={5} 
                colorClass="bg-yellow-500" 
                icon={<Star className="w-4 h-4 text-yellow-500" />}
              />
              <ScoreBar 
                label="Speed" 
                value={3.1} 
                maxValue={5} 
                colorClass="bg-blue-500" 
                icon={<Clock className="w-4 h-4 text-blue-500" />}
              />
              <ScoreBar 
                label="Saving" 
                value={3.4} 
                maxValue={5} 
                colorClass="bg-green-500" 
                icon={<CircleDollarSign className="w-4 h-4 text-green-500" />}
              />
              <ScoreBar 
                label="Privacy" 
                value={4.9} 
                maxValue={5} 
                colorClass="bg-red-500" 
                icon={<Shield className="w-4 h-4 text-red-500" />}
              />

              <div className="grid grid-cols-3 mt-6 text-center pt-6 border-t border-gray-100">
                <div>
                  <div className="text-gray-500 text-sm">Calls</div>
                  <div className="font-medium">120</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm">Token</div>
                  <div className="font-medium">5000</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm">Monthly cost</div>
                  <div className="font-medium">€ 18.000,00</div>
                </div>
              </div>
            </div>

            {/* Agent nodes card */}
            <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
              <h3 className="text-xl font-semibold mb-6">Agent nodes</h3>
              <p className="text-gray-500 mb-6">
                This agent uses 3 functional nodes to complete its operations
              </p>

              <div className="p-2 border border-gray-200 rounded-full inline-flex items-center justify-between mb-6 w-full">
                <span className="text-gray-700 font-medium">Documents validation</span>
                <ChevronDown className="w-5 h-5 text-gray-500" />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-gray-500 text-sm mb-1">LLM</div>
                  <div className="font-medium">Private GPT</div>
                  <div className="text-gray-500 text-xs">On-premise</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm mb-1">Cost</div>
                  <div className="font-medium">€ 18000.00</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm mb-1">Calls</div>
                  <div className="font-medium">120</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm mb-1">Token</div>
                  <div className="font-medium">5000</div>
                </div>
              </div>

              <div className="flex gap-2 mb-6">
                <div className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm">
                  <span className="mr-1">Q: 4.6%</span>
                </div>
                <div className="inline-flex items-center bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm">
                  <span className="mr-1">S: 3.1%</span>
                </div>
              </div>
            </div>

            {/* Cost cards */}
            <div className="flex flex-col gap-6">
              {/* Monthly Cost Configured */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Monthly Cost Configured</h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">€187,20</div>
                  <div className="text-sm text-gray-500">Configuration</div>
                </div>
              </div>
              
              {/* Total Cost Effective */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Total Cost Effective</h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">€0,00</div>
                  <div className="text-sm text-gray-500">From Sessions Logs</div>
                </div>
              </div>
              
              {/* Cost per Session */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Cost per Session</h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">€37,44</div>
                  <div className="text-sm text-gray-500">Average</div>
                </div>
              </div>
              
              {/* Sessions */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Sessions</h3>
                <div className="text-center">
                  <div className="text-4xl font-bold">5</div>
                  <div className="text-sm text-gray-500">Total</div>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Analysis Section */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Costs Analysis</h2>
            <div className="inline-flex p-1 bg-indigo-950 rounded-full mb-6">
              <button className="px-6 py-2 text-white rounded-full bg-indigo-950">Configured Costs</button>
              <button className="px-6 py-2 text-gray-800 rounded-full bg-white">Costs (Log)</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* ROI Calculation Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
                <h3 className="text-xl font-semibold mb-6">Calculation of return on investment ROI</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Total Cost */}
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="flex justify-between mb-2">
                      <div className="text-gray-700 font-medium">Total Cost</div>
                      <div className="flex items-center justify-center bg-white rounded-full w-6 h-6 text-blue-500">€</div>
                    </div>
                    <div className="text-xl font-bold mb-1">€187.20</div>
                    <div className="text-sm text-gray-500">Monthly</div>
                  </div>
                  
                  {/* Services Cost */}
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="flex justify-between mb-2">
                      <div className="text-gray-700 font-medium">Services Cost</div>
                      <div className="flex items-center justify-center bg-white rounded-full w-6 h-6 text-blue-500">€</div>
                    </div>
                    <div className="text-xl font-bold mb-1">€187.20</div>
                    <div className="text-sm text-gray-500">100% on total</div>
                  </div>
                  
                  {/* LLM Cost */}
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="flex justify-between mb-2">
                      <div className="text-gray-700 font-medium">LLM Cost</div>
                      <div className="flex items-center justify-center bg-white rounded-full w-6 h-6 text-blue-500">€</div>
                    </div>
                    <div className="text-xl font-bold mb-1">€0.00</div>
                    <div className="text-sm text-gray-500">0% on total</div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h4 className="text-lg font-semibold mb-4">Percentage distribution</h4>
                  <div className="relative h-5 bg-blue-500 rounded-full w-full mb-2">
                    {/* This simulates a 100% filled bar */}
                  </div>
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                      <span>Services: 100%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-gray-300 mr-2"></div>
                      <span>LLM: 0%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Category Distribution Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-6">Costs by Service Category</h3>
                <div className="mb-4 flex justify-center">
                  <CategoryChart data={categoryData} />
                </div>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium flex items-center">
                    <span className="mr-1">INTEGRATIONS</span>
                  </button>
                  <button className="px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-medium flex items-center">
                    <span className="mr-1">REASONING</span>
                  </button>
                  <button className="px-4 py-2 bg-yellow-100 text-yellow-600 rounded-full text-sm font-medium flex items-center">
                    <span className="mr-1">DB</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom row cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {/* LLM Cost Distribution Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-6 text-center">Costs by Type of LLM</h3>
                <div className="mb-6 flex justify-center">
                  <CategoryChart 
                    data={llmCostData} 
                    colorMap={{
                      'Private GPT': '#1A1F2C',
                      'Azure OpenAI': '#3B82F6',
                      'Claude 3 Opus': '#7C3AED'
                    }}
                  />
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <button className="px-3 py-1 bg-gray-800 text-white rounded-full text-xs font-medium">
                    Private GPT
                  </button>
                  <button className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-medium">
                    Azure OpenAI
                  </button>
                  <button className="px-3 py-1 bg-purple-500 text-white rounded-full text-xs font-medium">
                    Claude 3 Opus
                  </button>
                </div>
              </div>
              
              {/* Efficiency Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-center">Efficency</h3>
                <div className="flex justify-center">
                  <EfficiencyGauge 
                    value={72} 
                    label="Efficiency Score"
                    improvement="24% improvement over the previous configuration"
                  />
                </div>
              </div>
              
              {/* Optimization Scores Card */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-6 text-center">Optimization Scores</h3>
                <div className="space-y-4 px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-500 mr-2" />
                      <span className="text-gray-700 font-medium">Quality</span>
                    </div>
                    <div className="font-semibold">4.2/5</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-blue-500 mr-2" />
                      <span className="text-gray-700 font-medium">Speed</span>
                    </div>
                    <div className="font-semibold">3.8/5</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CircleDollarSign className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-gray-700 font-medium">Saving</span>
                    </div>
                    <div className="font-semibold">4.5/5</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 text-red-500 mr-2" />
                      <span className="text-gray-700 font-medium">Privacy</span>
                    </div>
                    <div className="font-semibold">4.0/5</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="chat">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-6">Chat with Agent</h3>
            <p className="text-gray-600">
              Start a new chat session with this agent.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="session-log">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-6">Session Logs</h3>
            <p className="text-gray-600">
              View past session logs and analytics.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="reoptimize">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-6">Reoptimize Agent (Coming Soon)</h3>
            <p className="text-gray-600">
              This feature will allow you to optimize the agent's performance by adjusting parameters.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-6">Agent Settings</h3>
            <p className="text-gray-600">
              Configure prompts, LLM settings, and other parameters for this agent.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentDetails;
