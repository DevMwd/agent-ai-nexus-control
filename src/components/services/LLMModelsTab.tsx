
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Search } from 'lucide-react';
import { LLMModelDetails } from "@/contexts/AgentContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LLMCard from './LLMCard';

interface LLMModelsTabProps {
  llmModels: LLMModelDetails[];
  onAddLLM: () => void;
  onEditLLM: (id: string) => void;
  onDeleteLLM: (id: string) => void;
  onSelectLLM: (id: string) => void;
}

const LLMModelsTab: React.FC<LLMModelsTabProps> = ({ 
  llmModels, 
  onAddLLM, 
  onEditLLM, 
  onDeleteLLM, 
  onSelectLLM 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredModels, setFilteredModels] = useState(llmModels);

  React.useEffect(() => {
    if (searchTerm) {
      const filtered = llmModels.filter(model => 
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.provider.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredModels(filtered);
    } else {
      setFilteredModels(llmModels);
    }
  }, [searchTerm, llmModels]);

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">LLM Models</h1>
        <Button variant="action" className="flex items-center gap-2" onClick={onAddLLM}>
          <Plus className="w-5 h-5" />
          <span>New LLM Model</span>
        </Button>
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search LLM models..."
          className="w-full border border-gray-300 rounded-lg py-3 px-4 pl-12"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="w-6 h-6 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModels.map((model) => (
          <LLMCard 
            key={model.id}
            model={model}
            onEdit={onEditLLM}
            onDelete={onDeleteLLM}
            onSelect={onSelectLLM}
          />
        ))}
      </div>
    </div>
  );
};

export default LLMModelsTab;
