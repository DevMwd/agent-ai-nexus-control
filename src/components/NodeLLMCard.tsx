
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AgentNode, LLMModelDetails } from '@/contexts/AgentContext';
import { Badge } from '@/components/ui/badge';
import { Zap, Timer, Cog } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NodeLLMCardProps {
  node: AgentNode;
  llmModel?: LLMModelDetails;
  onConfigureNode?: (nodeId: string) => void;
}

const NodeLLMCard: React.FC<NodeLLMCardProps> = ({ node, llmModel, onConfigureNode }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">{node.name}</h2>
          <div className="flex items-center gap-1 text-sm">
            {llmModel && (
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700">
                {llmModel.name}
              </Badge>
            )}
            {node.type && (
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                {node.type}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="relative mb-6">
          <Button variant="outline" className="w-full justify-between py-3 text-left relative pr-10">
            {node.name}
            <span className="absolute right-3">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </Button>
          {onConfigureNode && (
            <Button 
              variant="outline" 
              className="absolute -right-4 top-1/2 -translate-y-1/2 p-2 rounded-full"
              onClick={() => onConfigureNode(node.id)}
            >
              <Cog className="w-5 h-5" />
            </Button>
          )}
        </div>
        
        {node.scores && (
          <div className="space-y-4 mb-6">
            {node.scores.quality !== undefined && (
              <div className="flex items-center gap-2">
                <Zap className="text-yellow-500" size={16} />
                <span className="w-20 font-medium">Quality</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${(node.scores.quality/5)*100}%` }}></div>
                </div>
                <span className="font-medium">{node.scores.quality}/5</span>
              </div>
            )}
            
            {node.scores.speed !== undefined && (
              <div className="flex items-center gap-2">
                <Timer className="text-blue-500" size={16} />
                <span className="w-20 font-medium">Speed</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(node.scores.speed/5)*100}%` }}></div>
                </div>
                <span className="font-medium">{node.scores.speed}/5</span>
              </div>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t border-gray-100">
          <div>
            <div className="text-gray-500 text-sm">Calls</div>
            <div className="font-medium">{node.calls}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Tokens</div>
            <div className="font-medium">{node.tokens}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Monthly cost</div>
            <div className="font-medium">€ {(node.cost/1000).toFixed(2)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NodeLLMCard;
