
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAgents } from '@/contexts/AgentContext';
import { ArrowLeft, MessageCircle, Pencil, Zap, Timer, PiggyBank, Shield, Database, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import ScoreBar from '@/components/ScoreBar';
import { Badge } from '@/components/ui/badge';
import CategoryChart from '@/components/CategoryChart';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from "@/components/ui/card";

const AgentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { agents, llmModels, currentAgent, setCurrentAgent, loading } = useAgents();
  const [agent, setAgent] = useState(currentAgent);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  // Prepare chart data for CategoryChart component
  const categoryChartData = agent ? Object.entries(agent.categoriesDistribution)
    .filter(([_, value]) => value > 0)
    .map(([category, value]) => ({
      name: category,
      value: value
    })) : [];

  useEffect(() => {
    if (id) {
      const foundAgent = agents.find(agent => agent.id === id) || null;
      setAgent(foundAgent);
      setCurrentAgent(foundAgent);
    }
  }, [id, agents, setCurrentAgent]);

  const handleChatWithAgent = () => {
    navigate(`/agents/${id}/chat`);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link to="/agents" className="flex items-center text-gray-600 hover:text-action-primary">
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back to Agents</span>
        </Link>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-action-primary"></div>
        </div>
      )}

      {/* Agent not found state */}
      {!loading && !agent && (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-800">Agent not found</h2>
          <p className="text-gray-600 mt-2">The agent you're looking for doesn't exist or may have been removed.</p>
          <Link to="/agents" className="mt-6 inline-block bg-action-primary text-white px-6 py-3 rounded-lg">
            Back to Agents List
          </Link>
        </div>
      )}

      {/* Agent Details Content */}
      {!loading && agent && (
        <div>
          {/* Header with name, avatar and chat button */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                {typeof agent.logo === 'string' && agent.logo.startsWith('http') ? (
                  <AvatarImage src={agent.logo} alt={agent.title} />
                ) : (
                  <AvatarFallback className="bg-gray-200 text-gray-700 text-2xl font-semibold">
                    {agent.logo || agent.title.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="text-gray-500">{agent.subtitle}</p>
                <h1 className="text-3xl font-bold">{agent.title} {agent.version}</h1>
              </div>
            </div>
            
            <div className="flex flex-col xs:flex-row gap-3 w-full md:w-auto">
              <Button 
                className="flex items-center gap-2 w-full md:w-auto" 
                variant="action"
                onClick={handleChatWithAgent}
              >
                <MessageCircle className="w-5 h-5" />
                Chat with Agent
              </Button>
              
              {isAdmin() && (
                <Link to={`/agents/${id}/edit`} className="w-full md:w-auto">
                  <Button variant="outline" className="flex items-center gap-2 w-full">
                    <Pencil className="w-5 h-5" />
                    Edit Agent
                  </Button>
                </Link>
              )}
            </div>
          </div>
          
          {/* Tabs for different sections */}
          <Tabs defaultValue="agent-stats" className="mt-6 rounded-xl">
            <TabsList className="mb-6 bg-gray-100 p-1 rounded-md">
              <TabsTrigger value="agent-stats" className="rounded-md data-[state=active]:bg-white">Statistics</TabsTrigger>
              <TabsTrigger value="roi" className="rounded-md data-[state=active]:bg-white">ROI Analytics</TabsTrigger>
              <TabsTrigger value="settings" className="rounded-md data-[state=active]:bg-white">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="agent-stats" className="bg-transparent">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* LLM optimization card */}
                <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
                  <h2 className="text-xl font-bold mb-6">LLM Optimization</h2>
                  <div className="space-y-6">
                    <ScoreBar 
                      label="Quality" 
                      value={agent.scores.quality} 
                      maxValue={5} 
                      colorClass="bg-blue-500" 
                      icon={<Zap className="w-4 h-4" />}
                    />
                    <ScoreBar 
                      label="Speed" 
                      value={agent.scores.speed} 
                      maxValue={5} 
                      colorClass="bg-green-500" 
                      icon={<Timer className="w-4 h-4" />}
                    />
                    <ScoreBar 
                      label="Saving" 
                      value={agent.scores.saving} 
                      maxValue={5} 
                      colorClass="bg-yellow-500" 
                      icon={<PiggyBank className="w-4 h-4" />}
                    />
                    <ScoreBar 
                      label="Privacy" 
                      value={agent.scores.privacy} 
                      maxValue={5} 
                      colorClass="bg-purple-500" 
                      icon={<Shield className="w-4 h-4" />}
                    />
                  </div>
                </div>
                
                {/* Cost Data card */}
                <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-3">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Cost Data</h2>
                    <div className="flex items-center">
                      <Badge variant="outline" className="mx-1 bg-white">Last 7 days</Badge>
                      <Badge variant="outline" className="mx-1 bg-blue-50 text-blue-700">Last 30 days</Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Total Cost</p>
                      <p className="text-2xl font-bold text-blue-600">€ {agent.totalCost.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">Service Cost</p>
                      <p className="text-2xl font-bold">€ {agent.servicesCost.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm mb-1">LLM Cost</p>
                      <p className="text-2xl font-bold">€ {agent.llmCost.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="h-64">
                    <CategoryChart data={categoryChartData} />
                  </div>
                </div>
                
                {/* Services card */}
                <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
                  <h2 className="text-xl font-bold mb-6">Services</h2>
                  <div className="space-y-4">
                    {agent.services.map((service, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gray-100 p-2 rounded-full">
                            <Database className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium">{service.name}</p>
                            <p className="text-xs text-gray-500">{service.category}</p>
                          </div>
                        </div>
                        <Badge variant={service.hasFreetier ? "secondary" : "outline"} className="text-xs">
                          {service.hasFreetier ? 'Free Tier' : 'Paid'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">Categories Distribution</h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(agent.categoriesDistribution)
                        .filter(([_, value]) => value > 0)
                        .map(([category, value]) => (
                          <Badge key={category} variant="outline" className="py-1.5 px-3">
                            {category} {value}%
                          </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* LLMs card */}
                <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-3">
                  <h2 className="text-xl font-bold mb-6">LLMs used</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {agent.llms.map((llm, index) => {
                      // Find the LLM details from the context
                      const llmDetails = llmModels.find(model => model.name === llm);
                      
                      return (
                        <div key={index} className="border border-gray-100 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-semibold">{llm}</h3>
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                              {llmDetails?.provider || 'Unknown'}
                            </Badge>
                          </div>
                          
                          {llmDetails && (
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Input:</span>
                                <span className="font-medium">€{llmDetails.inputCost.toFixed(6)}/token</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Output:</span>
                                <span className="font-medium">€{llmDetails.outputCost.toFixed(6)}/token</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* ROI Analytics Tab */}
            <TabsContent value="roi" className="bg-transparent">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold">ROI</h3>
                      <DollarSign className="text-green-500 h-6 w-6" />
                    </div>
                    <div className="text-3xl font-bold text-green-600 mb-2">347%</div>
                    <p className="text-gray-500 text-sm">Return on investment</p>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Investment</span>
                        <span className="font-semibold">€ {agent.totalCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Return</span>
                        <span className="font-semibold">€ {(agent.totalCost * 4.47).toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold">Time Saved</h3>
                      <Clock className="text-blue-500 h-6 w-6" />
                    </div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">128 hrs</div>
                    <p className="text-gray-500 text-sm">Monthly time savings</p>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Per session</span>
                        <span className="font-semibold">27 min</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Sessions/month</span>
                        <span className="font-semibold">284</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold">Money Saved</h3>
                      <TrendingUp className="text-purple-500 h-6 w-6" />
                    </div>
                    <div className="text-3xl font-bold text-purple-600 mb-2">€ 8,320</div>
                    <p className="text-gray-500 text-sm">Monthly cost savings</p>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Hourly rate</span>
                        <span className="font-semibold">€ 65</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Hours saved</span>
                        <span className="font-semibold">128</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Productivity Impact</h3>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Task Completion</span>
                          <span className="font-semibold">+42%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Error Reduction</span>
                          <span className="font-semibold">-38%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '38%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Process Automation</span>
                          <span className="font-semibold">+67%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">User Adoption</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Active Users</p>
                        <p className="text-2xl font-bold">87</p>
                        <p className="text-xs text-green-600 mt-1">+12% vs previous month</p>
                      </div>
                      
                      <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Sessions</p>
                        <p className="text-2xl font-bold">284</p>
                        <p className="text-xs text-green-600 mt-1">+19% vs previous month</p>
                      </div>
                      
                      <div className="bg-purple-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Avg. Duration</p>
                        <p className="text-2xl font-bold">5.2m</p>
                        <p className="text-xs text-red-600 mt-1">-8% vs previous month</p>
                      </div>
                      
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Satisfaction</p>
                        <p className="text-2xl font-bold">4.8/5</p>
                        <p className="text-xs text-green-600 mt-1">+0.3 vs previous month</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-6">Annual Projection</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Investment</h4>
                      <div className="space-y-4">
                        <div>
                          <p className="text-gray-500 mb-1">Agent Cost</p>
                          <p className="text-xl font-bold">€ {(agent.totalCost * 12).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Implementation</p>
                          <p className="text-xl font-bold">€ 8,500.00</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Training</p>
                          <p className="text-xl font-bold">€ 3,200.00</p>
                        </div>
                        <div className="pt-4 border-t border-gray-100">
                          <p className="text-gray-500 mb-1">Total Investment</p>
                          <p className="text-2xl font-bold text-blue-600">€ {(agent.totalCost * 12 + 8500 + 3200).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Returns</h4>
                      <div className="space-y-4">
                        <div>
                          <p className="text-gray-500 mb-1">Time Savings</p>
                          <p className="text-xl font-bold">€ {(8320 * 12).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Error Reduction</p>
                          <p className="text-xl font-bold">€ 34,600.00</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Process Improvements</p>
                          <p className="text-xl font-bold">€ 27,800.00</p>
                        </div>
                        <div className="pt-4 border-t border-gray-100">
                          <p className="text-gray-500 mb-1">Total Returns</p>
                          <p className="text-2xl font-bold text-green-600">€ {(8320 * 12 + 34600 + 27800).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-5 rounded-xl">
                      <h4 className="text-lg font-semibold mb-4">ROI Summary</h4>
                      <div className="space-y-4">
                        <div>
                          <p className="text-gray-500 mb-1">Total Investment</p>
                          <p className="text-xl font-bold">€ {(agent.totalCost * 12 + 8500 + 3200).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Total Returns</p>
                          <p className="text-xl font-bold">€ {(8320 * 12 + 34600 + 27800).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 mb-1">Net Benefit</p>
                          <p className="text-xl font-bold text-green-600">€ {((8320 * 12 + 34600 + 27800) - (agent.totalCost * 12 + 8500 + 3200)).toFixed(2)}</p>
                        </div>
                        <div className="pt-4 border-t border-gray-100">
                          <p className="text-gray-500 mb-1">ROI Percentage</p>
                          <p className="text-2xl font-bold text-green-600">347%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold mb-6">Agent Settings</h2>
                <p className="text-gray-500">This tab will contain agent-specific settings.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default AgentDetails;
