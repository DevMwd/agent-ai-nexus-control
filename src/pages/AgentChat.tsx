
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAgents } from '@/contexts/AgentContext';
import { ArrowLeft, Zap, Timer, PiggyBank, Shield, Settings, Cog } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import CategoryChart from '@/components/CategoryChart';
import EfficiencyGauge from '@/components/EfficiencyGauge';
import { Button } from '@/components/ui/button';

const AgentChat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { agents, llmModels, currentAgent, setCurrentAgent, loading } = useAgents();
  const [agent, setAgent] = useState(currentAgent);

  // Prepare chart data for cost distribution
  const costCategoryData = agent ? Object.entries(agent.categoriesDistribution)
    .filter(([_, value]) => value > 0)
    .map(([category, value]) => ({
      name: category,
      value: value
    })) : [];

  // Prepare data for LLM distribution
  const llmDistribution = [
    { name: "Private GPT", value: 45 },
    { name: "Azure OpenAI", value: 31 },
    { name: "Claude 3 Opus", value: 24 }
  ];

  useEffect(() => {
    if (id) {
      const foundAgent = agents.find(agent => agent.id === id) || null;
      setAgent(foundAgent);
      setCurrentAgent(foundAgent);
    }
  }, [id, agents, setCurrentAgent]);

  // Get node data for the first node (Documents validation)
  const documentNode = agent?.nodes.find(node => node.name === "Documents validation") || {
    id: '1',
    name: 'Documents validation',
    type: 'Private GPT',
    cost: 18000,
    calls: 120,
    tokens: 5000,
    scores: {
      quality: 4.6,
      speed: 3.1
    }
  };

  if (loading || !agent) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-action-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header with back button, avatar and title */}
      <div className="flex items-center mb-8 gap-4">
        <Link to={`/agents/${id}`} className="text-gray-600 hover:text-action-primary">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        
        <Avatar className="h-16 w-16 bg-gray-200">
          {typeof agent.logo === 'string' && agent.logo.startsWith('http') ? (
            <AvatarImage src={agent.logo} alt={agent.title} />
          ) : (
            <AvatarFallback className="text-gray-700 text-2xl font-semibold">
              {agent.logo || agent.title.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className="flex-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">{agent.title} <span className="text-gray-500 text-lg">{agent.version}</span></h1>
          <p className="text-gray-500">{agent.subtitle}</p>
        </div>
      </div>

      {/* Agent description */}
      <p className="text-gray-700 mb-6">
        {agent.description}
      </p>

      {/* Tabs navigation */}
      <Tabs defaultValue="agent-stats" className="mb-8">
        <TabsList className="bg-blue-100 p-1 rounded-full w-full max-w-3xl mx-auto mb-8">
          <TabsTrigger 
            value="agent-stats" 
            className="rounded-full data-[state=active]:bg-blue-200 data-[state=active]:text-blue-800 flex-1"
          >
            Agent stats
          </TabsTrigger>
          <TabsTrigger 
            value="chat" 
            className="rounded-full data-[state=active]:bg-blue-200 data-[state=active]:text-blue-800 flex-1"
          >
            Chat with Agent
          </TabsTrigger>
          <TabsTrigger 
            value="session-log" 
            className="rounded-full data-[state=active]:bg-blue-200 data-[state=active]:text-blue-800 flex-1"
          >
            Session log
          </TabsTrigger>
          <TabsTrigger 
            value="reoptimize"
            className="rounded-full data-[state=active]:bg-blue-200 data-[state=active]:text-blue-800 flex-1"
          >
            <Badge variant="outline" className="mr-1 bg-blue-50 border-blue-200">Soon</Badge>
            Reoptimize
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="rounded-full data-[state=active]:bg-blue-200 data-[state=active]:text-blue-800 flex-1"
          >
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Agent stats tab content */}
        <TabsContent value="agent-stats" className="space-y-6">
          {/* First row: KPI cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* LLM Optimization card */}
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between mb-4">
                  <h2 className="text-xl font-bold">LLM optimization</h2>
                  <div className="flex items-center gap-1 text-sm">
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700">Private GPT</Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">Provider</Badge>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700">On-premise</Badge>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">
                  Bluesky optimized the LLM models for each node based on 4 key parameters
                </p>
                
                <div className="relative mb-6">
                  <Button variant="outline" className="w-full justify-between py-3 text-left relative pr-10">
                    Documents validation
                    <span className="absolute right-3">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </Button>
                </div>
                
                <h3 className="font-medium mb-3">Optimization Metrics</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Zap className="text-yellow-500" size={16} />
                    <span className="w-20 font-medium">Quality</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${(4.6/5)*100}%` }}></div>
                    </div>
                    <span className="font-medium">4.6/5</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Timer className="text-blue-500" size={16} />
                    <span className="w-20 font-medium">Speed</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(3.1/5)*100}%` }}></div>
                    </div>
                    <span className="font-medium">3.1/5</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <PiggyBank className="text-green-500" size={16} />
                    <span className="w-20 font-medium">Saving</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${(3.4/5)*100}%` }}></div>
                    </div>
                    <span className="font-medium">3.4/5</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Shield className="text-red-500" size={16} />
                    <span className="w-20 font-medium">Privacy</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: `${(4.9/5)*100}%` }}></div>
                    </div>
                    <span className="font-medium">4.9/5</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t border-gray-100">
                  <div>
                    <div className="text-gray-500 text-sm">Calls</div>
                    <div className="font-medium">{documentNode.calls}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm">Token</div>
                    <div className="font-medium">{documentNode.tokens}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm">Monthly cost</div>
                    <div className="font-medium">€ {(documentNode.cost/1000).toFixed(2)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Agent nodes card */}
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Agent nodes</h2>
                <p className="text-gray-600 mb-6">
                  This agent uses 3 functional nodes to complete its operations
                </p>
                
                <div className="relative mb-6">
                  <Button variant="outline" className="w-full justify-between py-3 text-left relative pr-10">
                    Documents validation
                    <span className="absolute right-3">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </Button>
                  <Button variant="outline" className="absolute -right-4 top-1/2 -translate-y-1/2 p-2 rounded-full">
                    <Cog className="w-5 h-5" />
                  </Button>
                </div>
                
                <div className="space-y-5 mb-6">
                  <div className="flex justify-between items-center">
                    <div className="text-gray-600">LLM</div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="bg-indigo-50 text-indigo-700">Private GPT</Badge>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700">On-premise</Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-gray-600">Cost</div>
                    <div className="font-semibold">€ {(documentNode.cost/1000).toFixed(2)}</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-gray-600">Calls</div>
                    <div className="font-semibold">{documentNode.calls}</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-gray-600">Token</div>
                    <div className="font-semibold">{documentNode.tokens}</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-gray-600">Scores</div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">Q: {documentNode.scores?.quality}</Badge>
                      <Badge variant="outline" className="bg-green-50 text-green-700">S: {documentNode.scores?.speed}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Cost cards */}
            <div className="grid grid-rows-2 gap-6">
              <Card className="overflow-hidden">
                <CardContent className="p-6 flex flex-col justify-between h-full">
                  <h2 className="text-xl font-bold mb-2">Monthly Cost Configured</h2>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-700">€ {agent.totalCost.toFixed(2)}</div>
                    <div className="text-gray-500 mt-1">Configuration</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <CardContent className="p-6 flex flex-col justify-between h-full">
                  <h2 className="text-xl font-bold mb-2">Total Cost Effective</h2>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-700">€ 0.00</div>
                    <div className="text-gray-500 mt-1">From Sessions Logs</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Second row: Session cost and sessions count */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="overflow-hidden">
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <h2 className="text-xl font-bold mb-6">Cost per Session</h2>
                <div className="text-center py-4">
                  <div className="text-4xl font-bold text-blue-700">€ 37.44</div>
                  <div className="text-gray-500 mt-1">Average</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <h2 className="text-xl font-bold mb-6">Sessions</h2>
                <div className="text-center py-4">
                  <div className="text-4xl font-bold text-blue-700">5</div>
                  <div className="text-gray-500 mt-1">Total</div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Costs Analysis section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Costs Analysis</h2>
            <Tabs defaultValue="configured">
              <TabsList className="inline-flex mb-6">
                <TabsTrigger value="configured" className="rounded-l-full rounded-r-none bg-indigo-900 text-white data-[state=active]:bg-indigo-800 px-6">
                  Configured Costs
                </TabsTrigger>
                <TabsTrigger value="log" className="rounded-r-full rounded-l-none bg-white data-[state=active]:bg-gray-100 px-6">
                  Costs (Log)
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="configured" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="col-span-2">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-6">Calculation of return on investment ROI</h3>
                      
                      <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="text-gray-500 mb-2">Total Cost</div>
                          <div className="text-xl font-bold">€ {agent.totalCost.toFixed(2)}</div>
                          <div className="text-sm text-gray-500">Monthly</div>
                        </div>
                        
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="text-gray-500 mb-2">Services Cost</div>
                          <div className="text-xl font-bold">€ {agent.servicesCost.toFixed(2)}</div>
                          <div className="text-sm text-gray-500">100% on total</div>
                        </div>
                        
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="text-gray-500 mb-2">LLM Cost</div>
                          <div className="text-xl font-bold">€ 0.00</div>
                          <div className="text-sm text-gray-500">0% on total</div>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="font-medium mb-3">Percentage distribution</h4>
                        <div className="h-2 bg-blue-500 rounded-full w-full mb-2"></div>
                        <div className="flex justify-between">
                          <div className="flex items-center gap-1 text-sm">
                            <span className="h-2 w-2 bg-blue-500 rounded-full inline-block"></span>
                            Services: 100%
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <span className="h-2 w-2 bg-gray-300 rounded-full inline-block"></span>
                            LLM: 0%
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" className="rounded-full bg-blue-50 text-blue-700 border-blue-200">
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                            <path d="M2.25 9H15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9 2.25V15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          INTEGRATIONS
                        </Button>
                        
                        <Button variant="outline" className="rounded-full bg-red-50 text-red-700 border-red-200">
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                            <path d="M2.25 9H15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9 2.25V15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          REASONING
                        </Button>
                        
                        <Button variant="outline" className="rounded-full bg-yellow-50 text-yellow-700 border-yellow-200">
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                            <path d="M2.25 9H15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9 2.25V15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          DB
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-6">Costs by Service Category</h3>
                      <div className="h-64 mb-6">
                        <CategoryChart data={costCategoryData} />
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" className="rounded-full bg-blue-50 text-blue-700 border-blue-200">
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                            <path d="M9 3.75V14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12.75 6.75L9 3L5.25 6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          INTEGRATIONS
                        </Button>
                        
                        <Button variant="outline" className="rounded-full bg-red-50 text-red-700 border-red-200">
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                            <path d="M9 3.75V14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12.75 6.75L9 3L5.25 6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          REASONING
                        </Button>
                        
                        <Button variant="outline" className="rounded-full bg-yellow-50 text-yellow-700 border-yellow-200">
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                            <path d="M9 3.75V14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12.75 6.75L9 3L5.25 6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          DB
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-6">Costs by Type of LLM</h3>
                      <div className="h-64">
                        <CategoryChart data={llmDistribution} />
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-6">
                        <Button variant="outline" className="rounded-full bg-indigo-50 text-indigo-700 border-indigo-200">
                          Private GPT
                        </Button>
                        
                        <Button variant="outline" className="rounded-full bg-blue-50 text-blue-700 border-blue-200">
                          Azure OpenAI
                        </Button>
                        
                        <Button variant="outline" className="rounded-full bg-purple-50 text-purple-700 border-purple-200">
                          Claude 3 Opus
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-6">Efficency</h3>
                      <div className="h-64 flex items-center justify-center">
                        <EfficiencyGauge 
                          value={72} 
                          improvement="24% improvement over the previous configuration"
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-6">Optimization Scores</h3>
                      
                      <div className="space-y-6 mt-8">
                        <div className="flex items-center gap-2">
                          <Zap className="text-yellow-500" size={18} />
                          <span className="w-20 font-medium">Quality</span>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full">
                            <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${(4.2/5)*100}%` }}></div>
                          </div>
                          <span className="font-medium">4.2/5</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Timer className="text-blue-500" size={18} />
                          <span className="w-20 font-medium">Speed</span>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(3.8/5)*100}%` }}></div>
                          </div>
                          <span className="font-medium">3.8/5</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <PiggyBank className="text-green-500" size={18} />
                          <span className="w-20 font-medium">Saving</span>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${(4.5/5)*100}%` }}></div>
                          </div>
                          <span className="font-medium">4.5/5</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Shield className="text-red-500" size={18} />
                          <span className="w-20 font-medium">Privacy</span>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full">
                            <div className="h-full bg-red-500 rounded-full" style={{ width: `${(4.0/5)*100}%` }}></div>
                          </div>
                          <span className="font-medium">4.0/5</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="log">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-500">Cost logs will be displayed here</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
        
        {/* Chat with agent tab */}
        <TabsContent value="chat">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-10">
                <h3 className="text-xl font-bold mb-2">Chat interface placeholder</h3>
                <p className="text-gray-500">Chat with {agent.title} will be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Session log tab */}
        <TabsContent value="session-log">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-10">
                <h3 className="text-xl font-bold mb-2">Session log placeholder</h3>
                <p className="text-gray-500">Agent session logs will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Reoptimize tab */}
        <TabsContent value="reoptimize">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-10">
                <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
                <p className="text-gray-500">Agent reoptimization will be available in a future update</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Settings tab */}
        <TabsContent value="settings">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Agent Settings</h3>
                <Button variant="outline" className="gap-2">
                  <Settings className="w-4 h-4" />
                  Edit Settings
                </Button>
              </div>
              <p className="text-gray-500">Agent-specific settings will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentChat;
