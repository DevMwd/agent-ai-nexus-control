
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import CategoryCard from './CategoryCard';
import { ServiceCategory } from '@/contexts/AgentContext';

interface CategoriesTabProps {
  onAddCategory: () => void;
  onEditCategory: (name: string) => void;
  onDeleteCategory: (name: string) => void;
}

// This is a mock of categories since we don't have a real list in the current code
const defaultCategories: { name: ServiceCategory; count: number }[] = [
  { name: 'INTEGRATIONS', count: 3 },
  { name: 'REASONING', count: 5 },
  { name: 'DB', count: 2 },
  { name: 'DOCUMENT COMPOSITION', count: 1 },
  { name: 'SCRAPING - CRAWLING', count: 2 },
  { name: 'LLM PROVIDER', count: 4 }
];

const CategoriesTab: React.FC<CategoriesTabProps> = ({
  onAddCategory,
  onEditCategory,
  onDeleteCategory
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories] = useState(defaultCategories);
  
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button 
          variant="action" 
          className="flex items-center gap-2"
          onClick={onAddCategory}
        >
          <Plus className="w-5 h-5" />
          <span>New Category</span>
        </Button>
      </div>

      <div className="mb-6 relative">
        <Input
          className="pl-10"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      {filteredCategories.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No categories found. Try adjusting your search query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.name}
              name={category.name}
              count={category.count}
              onEdit={() => onEditCategory(category.name)}
              onDelete={() => onDeleteCategory(category.name)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesTab;
