
import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings, Plus, Edit, Trash2 } from 'lucide-react';
import { Service } from "@/contexts/AgentContext";
import CategoryBadge from './CategoryBadge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface ServicesTabProps {
  servicesList: Service[];
  onManageCategories: () => void;
  onNewService: () => void;
  onEditService: (id: string) => void;
  onDeleteService: (id: string) => void;
}

const ServicesTab: React.FC<ServicesTabProps> = ({ 
  servicesList, 
  onManageCategories, 
  onNewService, 
  onEditService, 
  onDeleteService 
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Services</h1>
        <div className="flex gap-4">
          <Button variant="outline" className="flex items-center gap-2" onClick={onManageCategories}>
            <Settings className="w-5 h-5" />
            <span>Manage Categories</span>
          </Button>
          <Button variant="action" className="flex items-center gap-2" onClick={onNewService}>
            <Plus className="w-5 h-5" />
            <span>New Service</span>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left p-4 text-gray-700">Name</th>
              <th className="text-left p-4 text-gray-700">Category</th>
              <th className="text-left p-4 text-gray-700">Cost Structure</th>
              <th className="text-left p-4 text-gray-700">Cost per Unit</th>
              <th className="text-left p-4 text-gray-700">Free Tier</th>
              <th className="text-left p-4 text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {servicesList.map((service) => (
              <tr key={service.id} className="border-b">
                <td className="p-4">{service.name}</td>
                <td className="p-4">
                  <CategoryBadge category={service.category} />
                </td>
                <td className="p-4">{service.costStructure}</td>
                <td className="p-4">{service.costPerUnit}</td>
                <td className="p-4">
                  {service.hasFreetier ? (
                    <span className="text-green-500">Yes</span>
                  ) : (
                    <span className="text-gray-500">No</span>
                  )}
                </td>
                <td className="p-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEditService(service.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDeleteService(service.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServicesTab;
