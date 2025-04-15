
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAgents, AIAgent, ServiceCategory } from '@/contexts/AgentContext';
import { Star, Clock, CircleDollarSign, Shield, Cog, ArrowLeft, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScoreBar from '@/components/ScoreBar';
import CategoryChart from '@/components/CategoryChart';
import EfficiencyGauge from '@/components/EfficiencyGauge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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

  // Prepare data for category chart
  const categoryData = Object.entries(agent.categoriesDistribution)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name: name as ServiceCategory,
      value
    }));

  const llmData = Object.entries({
    'Private GPT': 45,
    'Azure OpenAI': 31,
    'Claude 3 Opus': 24
  }).map(([name, value]) => ({
    name: name as any, // This is a temporary fix until we create a proper LLM type
    value
  }));

  const logoInitials = agent.title.substring(0, 2).toUpperCase();
  const isValidLogoUrl = typeof agent.logo === 'string' && 
    (agent.logo.startsWith('http') || agent.logo.startsWith('data:'));

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <Link to="/" className="flex items-center text-gray-600 hover:text-action-primary">
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back</span>
        </Link>
      </div>

      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-6">
          <Avatar className="w-20 h-20">
            {isValidLogoUrl ? (
              <AvatarImage src={agent.logo} alt={agent.title} className="object-cover" />
            ) : null}
            <AvatarFallback className="bg-gray-200 text-gray-700 text-xl font-semibold">
              {logoInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-4xl font-bold">{agent.title}</h1>
              <span className="text-gray-500">{agent.subtitle}</span>
            </div>
            <p className="text-gray-600">{agent.description}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="agent-stats" className="mb-6">
        <TabsList className="bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="agent-stats" className="rounded-md">Agent stats</TabsTrigger>
          <TabsTrigger value="chat" className="rounded-md">Chat with Agent</TabsTrigger>
          <TabsTrigger value="session-log" className="rounded-md">Session log</TabsTrigger>
          <TabsTrigger value="reoptimize" className="rounded-md">
            Reoptimize
            <span className="bg-white text-action-primary text-xs px-2 py-0.5 rounded-full ml-1">Soon</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-md">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="agent-stats" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between mb-6">
                <h3 className="text-xl font-semibold">LLM optimization</h3>
                <div className="text-sm">
                  <div className="font-medium">Private GPT</div>
                  <div className="text-gray-500">Provider</div>
                  <div className="text-gray-500">On-premise</div>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Bluesky optimized the LLM models for each node based on 4 key parameters
              </p>

              <div className="p-2 border border-gray-200 rounded-full inline-flex items-center mb-6">
                <span className="text-gray-700 font-medium">Documents validation</span>
                <Cog className="w-5 h-5 text-gray-500 ml-2" />
              </div>

              <h4 className="text-lg font-semibold mb-4">Optimization Metrics</h4>
              
              <ScoreBar 
                label="Quality" 
                value={agent.scores.quality} 
                maxValue={5} 
                colorClass="progress-quality" 
                icon={<Star className="w-4 h-4 text-yellow-500" />}
              />
              <ScoreBar 
                label="Speed" 
                value={agent.scores.speed} 
                maxValue={5} 
                colorClass="progress-speed" 
                icon={<Clock className="w-4 h-4 text-blue-500" />}
              />
              <ScoreBar 
                label="Saving" 
                value={agent.scores.saving} 
                maxValue={5} 
                colorClass="progress-saving" 
                icon={<CircleDollarSign className="w-4 h-4 text-green-500" />}
              />
              <ScoreBar 
                label="Privacy" 
                value={agent.scores.privacy} 
                maxValue={5} 
                colorClass="progress-privacy" 
                icon={<Shield className="w-4 h-4 text-red-500" />}
              />

              <div className="grid grid-cols-3 mt-6 text-center">
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

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-6">Agent nodes</h3>
              <p className="text-gray-600 mb-6">
                This agent uses 3 functional nodes to complete its operations
              </p>

              <div className="p-2 border border-gray-200 rounded-full inline-flex items-center justify-between mb-6 w-full">
                <span className="text-gray-700 font-medium">Documents validation</span>
                <Cog className="w-5 h-5 text-gray-500" />
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
                  <span className="mr-1">Q:</span>
                  <span>4.6%</span>
                </div>
                <div className="inline-flex items-center bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm">
                  <span className="mr-1">S:</span>
                  <span>3.1%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Monthly Cost Configured</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-500">€187,20</div>
                <div className="text-sm text-gray-500">Configuration</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Total Cost Effective</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-500">€0,00</div>
                <div className="text-sm text-gray-500">From Sessions Logs</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Cost per Session</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-500">€37,44</div>
                <div className="text-sm text-gray-500">Average</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Sessions</h3>
              <div className="text-center">
                <div className="text-4xl font-bold">5</div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-6">Costs Analysis</h2>
            <Tabs defaultValue="configured" className="mb-6">
              <TabsList className="bg-action-primary p-1 rounded-lg w-auto inline-flex">
                <TabsTrigger value="configured" className="rounded-md text-white data-[state=active]:bg-white data-[state=active]:text-action-primary">
                  Configured Costs
                </TabsTrigger>
                <TabsTrigger value="log" className="rounded-md text-white data-[state=active]:bg-white data-[state=active]:text-action-primary">
                  Costs (Log)
                </TabsTrigger>
              </TabsList>

              <TabsContent value="configured" className="pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm lg:col-span-2">
                    <h3 className="text-xl font-semibold mb-6">Costi Effettivi (dai Log delle Sessioni)</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-gray-600 mb-1">Total Cost</div>
                        <div className="text-2xl font-bold text-blue-500">€ 0.00</div>
                        <div className="text-xs text-gray-500">Da log sessioni</div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-gray-600 mb-1">Services Cost</div>
                        <div className="text-2xl font-bold text-blue-500">€ 0.00</div>
                        <div className="text-xs text-gray-500">0% on total</div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-gray-600 mb-1">LLM Cost</div>
                        <div className="text-2xl font-bold text-blue-500">€ 0.00</div>
                        <div className="text-xs text-gray-500">100% on total</div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="text-gray-700 font-medium mb-2">Percentage distribution</div>
                      <div className="relative h-6 bg-purple-600 rounded-lg">
                        <div className="flex absolute top-0 left-0 right-0 bottom-0">
                          <div className="flex items-center justify-center text-xs text-white">
                            <span className="mr-1">Servizi: 0%</span>
                          </div>
                          <div className="flex-1"></div>
                          <div className="flex items-center justify-center text-xs text-white">
                            <span className="mr-1">LLM: 100%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold mb-6">Costs by Service Category</h3>
                    <CategoryChart data={categoryData} />
                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="service-badge service-badge-integrations">INTEGRATIONS 32%</span>
                      <span className="service-badge service-badge-reasoning">REASONING 40%</span>
                      <span className="service-badge service-badge-db">DB 28%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold mb-6">Costs by Type of LLM</h3>
                    <CategoryChart data={llmData} />
                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="service-badge bg-indigo-100 text-indigo-800">Private GPT</span>
                      <span className="service-badge bg-indigo-100 text-indigo-800">Azure OpenAI</span>
                      <span className="service-badge bg-indigo-100 text-indigo-800">Claude 3 Opus</span>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold mb-6">Efficency</h3>
                    <EfficiencyGauge 
                      value={72} 
                      improvement="24% improvement over the previous configuration"
                    />
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-semibold mb-6">Optimization Scores</h3>
                    <ScoreBar 
                      label="Quality" 
                      value={4.2} 
                      maxValue={5} 
                      colorClass="progress-quality" 
                      icon={<Star className="w-4 h-4 text-yellow-500" />}
                    />
                    <ScoreBar 
                      label="Speed" 
                      value={3.8} 
                      maxValue={5} 
                      colorClass="progress-speed" 
                      icon={<Clock className="w-4 h-4 text-blue-500" />}
                    />
                    <ScoreBar 
                      label="Saving" 
                      value={4.5} 
                      maxValue={5} 
                      colorClass="progress-saving" 
                      icon={<CircleDollarSign className="w-4 h-4 text-green-500" />}
                    />
                    <ScoreBar 
                      label="Privacy" 
                      value={4.0} 
                      maxValue={5} 
                      colorClass="progress-privacy" 
                      icon={<Shield className="w-4 h-4 text-red-500" />}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="log" className="pt-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-6">Session Logs (Coming Soon)</h3>
                  <p className="text-gray-600">
                    Detailed session logs will be displayed here, showing the services used, costs incurred,
                    and performance metrics for each agent execution.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>

        <TabsContent value="chat" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="mb-6">
                <Tabs defaultValue="new" className="w-full">
                  <TabsList className="bg-action-primary p-1 rounded-lg w-auto inline-flex">
                    <TabsTrigger value="new" className="rounded-md text-white data-[state=active]:bg-white data-[state=active]:text-action-primary">
                      New session
                    </TabsTrigger>
                    <TabsTrigger value="history" className="rounded-md text-white data-[state=active]:bg-white data-[state=active]:text-action-primary">
                      Session history
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">1. Analyze the list of components</h3>
                <p className="text-gray-600 mb-6">
                  Analyze and search the web for useful data and information on those components
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Market</h3>
                <p className="text-gray-600 mb-2">
                  Choose the market on which to perform the research
                </p>
                <div className="relative">
                  <select className="w-full p-3 pr-10 border border-gray-300 rounded-lg appearance-none">
                    <option>market1</option>
                    <option>market2</option>
                    <option>market3</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Enter the required data</h3>
                <p className="text-gray-600 mb-2">
                  AC&E Structured Data Entry.
                </p>
                <button className="flex items-center text-blue-500 hover:text-blue-700">
                  <Plus className="w-5 h-5 mr-1" />
                  <span>add new</span>
                </button>
              </div>

              <div className="flex justify-center mt-8">
                <button className="bg-action-primary text-white py-3 px-6 rounded-lg text-lg font-medium hover:bg-opacity-90 transition-colors">
                  WORK IT
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto flex items-center justify-center text-xl font-semibold mb-4">
                  {agent.logo}
                </div>
                <h3 className="text-xl font-bold">{agent.title}</h3>
                <p className="text-gray-600">{agent.description}</p>
              </div>

              <div className="flex-1 overflow-y-auto mb-6">
                {/* Chat messages would go here */}
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Text your message"
                  className="w-full border border-gray-300 rounded-full py-3 px-4 pr-12"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="session-log" className="pt-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-6">Session Logs (Coming Soon)</h3>
            <p className="text-gray-600">
              This tab will display detailed logs of all sessions run with this agent,
              including timestamps, inputs, outputs, and associated costs.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="reoptimize" className="pt-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-6">Reoptimize Agent (Coming Soon)</h3>
            <p className="text-gray-600">
              This feature will allow you to optimize the agent's performance by adjusting parameters
              like speed, quality, and cost efficiency.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="pt-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-6">Agent Settings</h3>
            <p className="text-gray-600">
              Configure prompts, LLM settings, and other parameters for this agent.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg mt-4">
              <p className="text-gray-600">
                Settings configuration options will be available here.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentDetails;
