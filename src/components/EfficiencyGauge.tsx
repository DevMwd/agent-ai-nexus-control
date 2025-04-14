
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface EfficiencyGaugeProps {
  value: number;
  size?: number;
  label?: string;
  improvement?: string;
}

const EfficiencyGauge: React.FC<EfficiencyGaugeProps> = ({ 
  value, 
  size = 200, 
  label, 
  improvement 
}) => {
  const data = [
    { name: 'Value', value: value },
    { name: 'Remaining', value: 100 - value }
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div style={{ width: size, height: size, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              startAngle={180}
              endAngle={0}
              innerRadius={size * 0.6 / 2}
              outerRadius={size * 0.8 / 2}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              <Cell fill="#4071FF" />
              <Cell fill="#F0F1F8" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}
        >
          <div className="text-4xl font-bold text-blue-500">{value}%</div>
          {label && <div className="text-sm text-gray-500">{label}</div>}
        </div>
      </div>
      {improvement && (
        <div className="text-sm text-gray-500 mt-4 text-center">
          {improvement}
        </div>
      )}
    </div>
  );
};

export default EfficiencyGauge;
