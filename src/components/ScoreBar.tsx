
import React from 'react';

interface ScoreBarProps {
  label: string;
  value: number;
  maxValue: number;
  colorClass: string;
  icon?: React.ReactNode;
}

const ScoreBar: React.FC<ScoreBarProps> = ({ label, value, maxValue, colorClass, icon }) => {
  const percentage = (value / maxValue) * 100;
  
  return (
    <div className="flex items-center mb-3">
      <div className="flex items-center w-28">
        {icon && <span className="mr-2">{icon}</span>}
        <span className="text-gray-700 font-medium">{label}</span>
      </div>
      <div className="flex-1 mx-3">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${colorClass} rounded-full`} 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
      <div className="text-gray-700 font-medium w-16 text-right">
        {value}/{maxValue}
      </div>
    </div>
  );
};

export default ScoreBar;
