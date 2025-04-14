
import React from 'react';

interface CategoryBadgeProps {
  category: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const getColor = () => {
    switch (category) {
      case 'INTEGRATIONS': return 'bg-blue-100 text-blue-800';
      case 'REASONING': return 'bg-red-100 text-red-800';
      case 'DB': return 'bg-yellow-100 text-yellow-800';
      case 'DOCUMENT COMPOSITION': return 'bg-purple-100 text-purple-800';
      case 'SCRAPING - CRAWLING': return 'bg-green-100 text-green-800';
      case 'LLM PROVIDER': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <span className={`${getColor()} px-2 py-1 rounded-full text-xs font-medium`}>
      {category}
    </span>
  );
};

export default CategoryBadge;
