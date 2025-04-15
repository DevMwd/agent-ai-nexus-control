
import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Database, Activity, FileEdit, ClipboardList, Globe, Cloud } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

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
      case 'database': return <Database className="w-6 h-6" />;
      case 'activity': return <Activity className="w-6 h-6" />;
      case 'file-edit': return <FileEdit className="w-6 h-6" />;
      case 'clipboard-list': return <ClipboardList className="w-6 h-6" />;
      case 'globe': return <Globe className="w-6 h-6" />;
      case 'cloud': return <Cloud className="w-6 h-6" />;
      default: return <Database className="w-6 h-6" />;
    }
  };
  
  const getBgColor = () => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-600';
      case 'red': return 'bg-red-100 text-red-600';
      case 'yellow': return 'bg-yellow-100 text-yellow-600';
      case 'green': return 'bg-green-100 text-green-600';
      case 'purple': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };
  
  const getBorderColor = () => {
    switch (color) {
      case 'blue': return 'border-blue-200 hover:border-blue-300';
      case 'red': return 'border-red-200 hover:border-red-300';
      case 'yellow': return 'border-yellow-200 hover:border-yellow-300';
      case 'green': return 'border-green-200 hover:border-green-300';
      case 'purple': return 'border-purple-200 hover:border-purple-300';
      default: return 'border-gray-200 hover:border-gray-300';
    }
  };
  
  return (
    <Card className={`overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md ${getBorderColor()}`}>
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3 mb-2">
            <div className={`${getBgColor()} p-3 rounded-lg`}>
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
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 hover:bg-red-100 text-red-500" 
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
