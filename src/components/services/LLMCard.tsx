
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check, X, Edit, Trash2, Brain } from 'lucide-react';
import { LLMModelDetails } from "@/contexts/AgentContext";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface LLMCardProps {
  model: LLMModelDetails;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
}

const LLMCard: React.FC<LLMCardProps> = ({ model, onEdit, onDelete, onSelect }) => {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4 sm:p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-gray-100 rounded-lg p-2 h-10 sm:h-12 w-10 sm:w-12 flex items-center justify-center overflow-hidden">
              {model.logo ? (
                <Avatar className="h-full w-full">
                  <AvatarImage src={model.logo} alt={model.name} className="object-cover" />
                  <AvatarFallback><Brain className="h-5 sm:h-6 w-5 sm:w-6 text-gray-700" /></AvatarFallback>
                </Avatar>
              ) : (
                <Brain className="w-5 sm:w-6 h-5 sm:h-6 text-gray-700" />
              )}
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold">{model.name}</h3>
              <div className="text-gray-500 text-xs sm:text-sm">{model.provider}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onEdit(model.id)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 bg-red-50 hover:bg-red-100" 
              onClick={() => onDelete(model.id)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>

        <div className="mb-4 sm:mb-6">
          <h4 className="text-gray-700 font-medium mb-2">Costs</h4>
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <div>
              <div className="text-gray-500 text-xs sm:text-sm">Input</div>
              <div className="text-sm sm:text-base">€{model.inputCost.toFixed(6)} / token</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs sm:text-sm">Output</div>
              <div className="text-sm sm:text-base">€{model.outputCost.toFixed(6)} / token</div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-gray-500 text-xs sm:text-sm">Max context</div>
          <div className="mb-4 sm:mb-6 text-sm sm:text-base">{model.maxContext || "Not specified"}</div>
        </div>

        <div className="mb-4">
          <h4 className="text-gray-700 font-medium mb-2">Strengths</h4>
          <div className="min-h-[60px] sm:min-h-[80px]">
            {model.strengths && model.strengths.length > 0 ? (
              <ul className="space-y-2">
                {model.strengths.map((strength, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-4 sm:w-5 h-4 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base">{strength}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-400 italic text-sm sm:text-base">No strengths specified</div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-gray-700 font-medium mb-2">Limitations</h4>
          <div className="min-h-[60px] sm:min-h-[80px]">
            {model.limitations && model.limitations.length > 0 ? (
              <ul className="space-y-2">
                {model.limitations.map((limitation, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <X className="w-4 sm:w-5 h-4 sm:h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base">{limitation}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-400 italic text-sm sm:text-base">No limitations specified</div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
        <Button 
          onClick={() => onSelect(model.id)}
          className="w-full bg-white border border-action-primary text-action-primary font-medium py-2 rounded-lg hover:bg-action-primary hover:text-white transition-colors"
        >
          Select
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LLMCard;
