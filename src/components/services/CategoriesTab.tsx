
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import CategoryCard from './CategoryCard';

interface CategoriesTabProps {
  onAddCategory: () => void;
  onEditCategory: (name: string) => void;
  onDeleteCategory: (name: string) => void;
}

const CategoriesTab: React.FC<CategoriesTabProps> = ({ 
  onAddCategory, 
  onEditCategory, 
  onDeleteCategory 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Service Categories</h1>
        <Button variant="action" className="flex items-center gap-2" onClick={onAddCategory}>
          <Plus className="w-5 h-5" />
          <span>Add New Category</span>
        </Button>
      </div>
      <p className="text-gray-600 mb-6">
        Manage the categories that services can be assigned to.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CategoryCard 
          name="INTEGRATIONS" 
          color="blue" 
          icon="database"
          onEdit={() => onEditCategory("INTEGRATIONS")}
          onDelete={() => onDeleteCategory("INTEGRATIONS")}
        />
        <CategoryCard 
          name="REASONING" 
          color="red" 
          icon="activity"
          onEdit={() => onEditCategory("REASONING")}
          onDelete={() => onDeleteCategory("REASONING")}
        />
        <CategoryCard 
          name="DB" 
          color="yellow" 
          icon="database"
          onEdit={() => onEditCategory("DB")}
          onDelete={() => onDeleteCategory("DB")}
        />
        <CategoryCard 
          name="DOCUMENT COMPOSITION" 
          color="purple" 
          icon="file-edit"
          onEdit={() => onEditCategory("DOCUMENT COMPOSITION")}
          onDelete={() => onDeleteCategory("DOCUMENT COMPOSITION")}
        />
        <CategoryCard 
          name="SCRAPING - CRAWLING" 
          color="green" 
          icon="globe"
          onEdit={() => onEditCategory("SCRAPING - CRAWLING")}
          onDelete={() => onDeleteCategory("SCRAPING - CRAWLING")}
        />
        <CategoryCard 
          name="LLM PROVIDER" 
          color="purple" 
          icon="cloud"
          onEdit={() => onEditCategory("LLM PROVIDER")}
          onDelete={() => onDeleteCategory("LLM PROVIDER")}
        />
        <div 
          className="border border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center cursor-pointer hover:bg-gray-50"
          onClick={onAddCategory}
        >
          <Plus className="w-5 h-5 mr-2" />
          <span>Add New Category</span>
        </div>
      </div>
    </div>
  );
};

export default CategoriesTab;
