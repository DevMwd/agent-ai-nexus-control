
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAgents, AIAgent, ServiceCategory } from '@/contexts/AgentContext';
import { Star, Clock, CircleDollarSign, Shield, Cog, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScoreBar from '@/components/ScoreBar';
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

  const logoInitials = agent.title.substring(0, 2).toUpperCase();
  const isValidLogoUrl = typeof agent.logo === 'string' && 
    (agent.logo.startsWith('http') || agent.logo.startsWith('data:'));

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
            <AvatarFallback className="text-xl font-semibold">{logoInitials}</AvatarFallback>
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
        <TabsList className="bg-lavender-100 p-1 rounded-lg mb-6 w-full max-w-3xl">
          <TabsTrigger value="agent-stats" className="rounded-md data-[state=active]:bg-white">Agent stats</TabsTrigger>
          <TabsTrigger value="chat" className="rounded-md data-[state=active]:bg-white">Chat with Agent</TabsTrigger>
          <TabsTrigger value="session-log" className="rounded-md data-[state=active]:bg-white">Session log</TabsTrigger>
          <TabsTrigger value="reoptimize" className="rounded-md data-[state=active]:bg-white flex items-center">
            Reoptimize
            <span className="bg-white text-gray-400 text-xs px-2 py-0.5 rounded-full ml-1">Soon</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-md data-[state=active]:bg-white">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="agent-stats">
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
                <Cog className="w-5 h-5 text-gray-500" />
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
