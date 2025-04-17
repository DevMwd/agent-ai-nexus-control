
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CostAnalysis } from '@/contexts/AgentContext';
import { TrendingUp, Clock, DollarSign, Calculator } from 'lucide-react';

interface ROIAnalysisCardProps {
  costAnalysis: CostAnalysis;
}

const ROIAnalysisCard: React.FC<ROIAnalysisCardProps> = ({ costAnalysis }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">ROI Analysis</h2>
          <div className="flex items-center gap-1 text-sm">
            <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
              {costAnalysis.roi}% ROI
            </span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-6">
          Cost comparison between agent automation and manual process
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2 text-blue-700">
              <Calculator className="h-4 w-4" />
              <span className="font-medium">Agent Process</span>
            </div>
            <div className="text-xl font-bold">€ {costAnalysis.hourlyRate.toFixed(2)}</div>
            <div className="text-sm text-gray-500">Hourly rate</div>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2 text-gray-700">
              <Calculator className="h-4 w-4" />
              <span className="font-medium">Manual Process</span>
            </div>
            <div className="text-xl font-bold">€ {costAnalysis.manualHourlyRate.toFixed(2)}</div>
            <div className="text-sm text-gray-500">Hourly rate</div>
          </div>
        </div>
        
        <div className="space-y-5 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>Session Length</span>
            </div>
            <div className="font-semibold">{costAnalysis.sessionLength} min</div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4 text-green-600" />
              <span>Time Saved Per Session</span>
            </div>
            <div className="font-semibold">{costAnalysis.timeSavedPerSession} min</div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-600">
              <Calculator className="h-4 w-4 text-purple-600" />
              <span>Annual Sessions</span>
            </div>
            <div className="font-semibold">{costAnalysis.annualSessions}</div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4 text-indigo-600" />
              <span>Annual Time Saved</span>
            </div>
            <div className="font-semibold">{costAnalysis.annualTimeSaved.toFixed(1)} hours</div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-600">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span>Annual Cost Saved</span>
            </div>
            <div className="font-semibold">€ {costAnalysis.annualCostSaved.toFixed(2)}</div>
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 text-gray-700 font-medium">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span>Return on Investment</span>
            </div>
            <div className="font-bold text-green-600">{costAnalysis.roi}%</div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700">
          <p className="font-medium">💡 Insight</p>
          <p className="mt-1">
            Using this agent saves approximately {costAnalysis.annualTimeSaved.toFixed(1)} hours per year, 
            resulting in a {costAnalysis.roi}% return on investment.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ROIAnalysisCard;
