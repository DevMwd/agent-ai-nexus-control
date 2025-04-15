
import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Database, Activity, FileEdit, ClipboardList, Globe, Cloud } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  color?: string;
  icon?: string;
  count?: number;
  onEdit: () => void;
  onDelete: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ 
  name, 
  color = 'blue',
  icon = 'database',
  count,
  onEdit,
  onDelete
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'database': return <Database className="w-5 h-5" />;
      case 'activity': return <Activity className="w-5 h-5" />;
      case 'file-edit': return <FileEdit className="w-5 h-5" />;
      case 'clipboard-list': return <ClipboardList className="w-5 h-5" />;
      case 'globe': return <Globe className="w-5 h-5" />;
      case 'cloud': return <Cloud className="w-5 h-5" />;
      default: return <Database className="w-5 h-5" />;
    }
  };
  
  const getBgColor = () => {
    switch (color) {
      case 'blue': return 'bg-blue-100';
      case 'red': return 'bg-red-100';
      case 'yellow': return 'bg-yellow-100';
      case 'green': return 'bg-green-100';
      case 'purple': return 'bg-purple-100';
      default: return 'bg-gray-100';
    }
  };
  
  return (
    <div className="border rounded-lg p-4 relative">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className={`${getBgColor()} p-2 rounded-lg`}>
            {getIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{name}</h3>
            {count !== undefined && (
              <span className="text-sm text-gray-500">{count} services</span>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
