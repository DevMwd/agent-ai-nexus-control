
import React from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { ServiceCategory } from '@/contexts/AgentContext';

interface CategoryChartProps {
  data: {
    name: ServiceCategory;
    value: number;
  }[];
}

const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
  // Define colors for categories
  const COLORS = {
    'INTEGRATIONS': '#4071FF',
    'REASONING': '#E63946',
    'DB': '#FFC145',
    'DOCUMENT COMPOSITION': '#E63946',
    'SCRAPING - CRAWLING': '#3CAF85',
    'LLM PROVIDER': '#9B6DFF'
  };

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
            <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryChart;
