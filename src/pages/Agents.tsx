
import React from 'react';
import { Link } from 'react-router-dom';
import { useAgents } from '@/contexts/AgentContext';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Upload } from 'lucide-react';
import AgentCard from '@/components/AgentCard';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Agents: React.FC = () => {
  const { agents, loading, createAgentFromManifest } = useAgents();
  const { isAdmin, isOwner } = useAuth();

  const handleManifestUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if it's a YAML file
    if (!file.name.endsWith('.yml') && !file.name.endsWith('.yaml')) {
      toast.error('Please upload a valid YAML manifest file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        await createAgentFromManifest(content);
        toast.success('Agent created successfully from manifest');
      } catch (error) {
        console.error('Error creating agent from manifest:', error);
        toast.error('Failed to create agent from manifest');
      }
    };
    reader.readAsText(file);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading agents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Agents Team</h1>
        <div className="flex gap-3">
          {isOwner() && (
            <div>
              <input
                type="file"
                id="manifest-upload"
                className="hidden"
                accept=".yml,.yaml"
                onChange={handleManifestUpload}
              />
              <label htmlFor="manifest-upload">
                <Button variant="outline" className="flex items-center gap-2 cursor-pointer" asChild>
                  <span>
                    <Upload className="w-5 h-5" />
                    <span>Create Agent</span>
                  </span>
                </Button>
              </label>
            </div>
          )}
          {isAdmin() && (
            <Link 
              to="/agents/new" 
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
            >
              <Plus className="w-5 h-5" />
              <span>Agent marketplace</span>
              <span className="bg-white text-indigo-600 text-xs px-2 py-0.5 rounded-full ml-1">Soon</span>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="h-full transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <AgentCard agent={agent} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Agents;
