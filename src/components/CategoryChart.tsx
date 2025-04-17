
import React from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { ServiceCategory } from '@/contexts/AgentContext';

interface CategoryChartData {
  name: string;
  value: number;
}

interface CategoryChartProps {
  data: CategoryChartData[];
  colorMap?: Record<string, string>;
}

const CategoryChart: React.FC<CategoryChartProps> = ({ data, colorMap }) => {
  // Define default colors for service categories
  const DEFAULT_COLORS = {
    'INTEGRATIONS': '#4071FF',
    'REASONING': '#E63946',
    'DB': '#FFC145',
    'DOCUMENT COMPOSITION': '#E63946',
    'SCRAPING - CRAWLING': '#3CAF85',
    'LLM PROVIDER': '#9B6DFF',
    // Add default colors for LLM providers
    'Private GPT': '#6366f1',
    'Azure OpenAI': '#06b6d4',
    'Claude 3 Opus': '#a855f7',
    'GPT-4o': '#10b981',
    'GPT-4o Mini': '#84cc16',
    'GPT-3.5 Turbo': '#3b82f6',
  };

  // Use provided color map or default to the standard colors
  const COLORS = colorMap || DEFAULT_COLORS;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[entry.name] || `hsl(${index * 45 % 360}, 70%, 60%)`} 
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryChart;
