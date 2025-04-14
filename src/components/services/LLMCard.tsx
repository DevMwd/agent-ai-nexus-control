
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check, X, Edit, Trash2 } from 'lucide-react';
import { LLMModelDetails } from "@/contexts/AgentContext";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface LLMCardProps {
  model: LLMModelDetails;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
}

const LLMCard: React.FC<LLMCardProps> = ({ model, onEdit, onDelete, onSelect }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="bg-gray-200 rounded-lg p-2 h-12 w-12 flex items-center justify-center overflow-hidden">
              {model.logo ? (
                <Avatar className="h-full w-full">
                  <AvatarImage src={model.logo} alt={model.name} className="object-cover" />
                  <AvatarFallback>{model.name[0]}</AvatarFallback>
                </Avatar>
              ) : (
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              )}
            </div>
            <h3 className="text-xl font-bold">{model.name}</h3>
          </div>
          <div className="text-gray-500 text-sm mt-1">{model.provider}</div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onEdit(model.id)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onDelete(model.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-gray-700 font-medium mb-2">Costs</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-gray-500 text-sm">Input</div>
            <div>€{model.inputCost.toFixed(6)} / token</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Output</div>
            <div>€{model.outputCost.toFixed(6)} / token</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Max context</div>
            <div>{model.maxContext}</div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-gray-700 font-medium mb-2">Strengths</h4>
        <ul className="space-y-2">
          {model.strengths.map((strength, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>{strength}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h4 className="text-gray-700 font-medium mb-2">Limitations</h4>
        <ul className="space-y-2">
          {model.limitations.map((limitation, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span>{limitation}</span>
            </li>
          ))}
        </ul>
      </div>

      <Button 
        onClick={() => onSelect(model.id)}
        className="w-full bg-white border border-action-primary text-action-primary font-medium py-2 rounded-lg hover:bg-action-primary hover:text-white transition-colors"
      >
        Select
      </Button>
    </div>
  );
};

export default LLMCard;
