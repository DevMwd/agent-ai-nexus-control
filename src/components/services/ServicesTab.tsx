
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Service } from "@/contexts/AgentContext";
import CategoryBadge from './CategoryBadge';
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredServices = servicesList.filter(service => 
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to get initials from service name
  const getInitials = (name: string) => {
    if (!name) return '';
    const words = name.split(' ');
    if (words.length === 1) {
      return name.substring(0, 2).toUpperCase();
    }
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Services</h1>
        <div className="flex gap-4">
          <Button variant="action" className="flex items-center gap-2" onClick={onNewService}>
            <Plus className="w-5 h-5" />
            <span>New Service</span>
          </Button>
        </div>
      </div>

      <div className="mb-6 relative">
        <Input
          className="pl-10"
          placeholder="Search services by name or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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
            {filteredServices.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No services found. Try adjusting your search query.
                </td>
              </tr>
            ) : (
              filteredServices.map((service) => (
                <tr key={service.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        {service.logo ? (
                          <AvatarImage src={service.logo} alt={service.name} />
                        ) : (
                          <AvatarFallback className="bg-gray-200 text-gray-700 font-medium">
                            {getInitials(service.name)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span className="font-medium">{service.name}</span>
                    </div>
                  </td>
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
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => onEditService(service.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover:bg-red-100 text-red-500" 
                        onClick={() => onDeleteService(service.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServicesTab;
