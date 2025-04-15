
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Search } from 'lucide-react';
import { LLMModelDetails } from "@/contexts/AgentContext";
import LLMCard from './LLMCard';
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user, isOwner } = useAuth();

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
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">LLM Models</h1>
        {isOwner() && (
          <Button variant="action" className="flex w-full sm:w-auto items-center gap-2" onClick={onAddLLM}>
            <Plus className="w-5 h-5" />
            <span>New LLM Model</span>
          </Button>
        )}
      </div>

      <div className="relative mb-6">
        <Input
          className="pl-10"
          placeholder="Search LLM models..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {filteredModels.map((model) => (
          <LLMCard 
            key={model.id}
            model={model}
            onEdit={isOwner() ? onEditLLM : undefined}
            onDelete={isOwner() ? onDeleteLLM : undefined}
            onSelect={onSelectLLM}
          />
        ))}
      </div>
    </div>
  );
};

export default LLMModelsTab;
