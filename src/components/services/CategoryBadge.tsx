
import React from 'react';

interface CategoryBadgeProps {
  category: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const getColor = () => {
    switch (category) {
      // Service categories
      case 'INTEGRATIONS': return 'bg-blue-100 text-blue-800';
      case 'REASONING': return 'bg-red-100 text-red-800';
      case 'DB': return 'bg-yellow-100 text-yellow-800';
      case 'DOCUMENT COMPOSITION': return 'bg-purple-100 text-purple-800';
      case 'SCRAPING - CRAWLING': return 'bg-green-100 text-green-800';
      case 'LLM PROVIDER': return 'bg-indigo-100 text-indigo-800';
      
      // Provider-specific colors
      case 'OpenAI': return 'bg-emerald-100 text-emerald-800';
      case 'Anthropic': return 'bg-violet-100 text-violet-800';
      case 'Google': return 'bg-blue-100 text-blue-800';
      case 'Meta': return 'bg-sky-100 text-sky-800';
      case 'Mistral AI': return 'bg-amber-100 text-amber-800';
      case 'DeepSeek': return 'bg-rose-100 text-rose-800';
      case '01.AI': return 'bg-teal-100 text-teal-800';
      case 'Alibaba': return 'bg-orange-100 text-orange-800';
      
      // Additional providers for the new models
      case 'Claude': return 'bg-violet-100 text-violet-800';
      case 'Gemini': return 'bg-cyan-100 text-cyan-800';
      case 'LLaMA': return 'bg-lime-100 text-lime-800';
      case 'Yi': return 'bg-fuchsia-100 text-fuchsia-800';
      case 'Qwen': return 'bg-orange-100 text-orange-800';
      
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
