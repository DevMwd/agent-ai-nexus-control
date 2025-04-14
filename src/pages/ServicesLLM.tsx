
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAgents } from '@/contexts/AgentContext';
import { Edit, ArrowLeft, Settings, Plus, X, Check, Database, Activity, FileEdit, ClipboardList, Globe, Cloud } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

const ServicesLLM: React.FC = () => {
  const [activeTab, setActiveTab] = useState("services");
  const { services, llmModels } = useAgents();
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false);
  const [isDeleteCategoryDialogOpen, setIsDeleteCategoryDialogOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryColor, setCategoryColor] = useState("blue");
  const [categoryIcon, setCategoryIcon] = useState("database");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'database':
        return <Database className="w-5 h-5" />;
      case 'activity':
        return <Activity className="w-5 h-5" />;
      case 'file-edit':
        return <FileEdit className="w-5 h-5" />;
      case 'clipboard-list':
        return <ClipboardList className="w-5 h-5" />;
      case 'globe':
        return <Globe className="w-5 h-5" />;
      case 'cloud':
        return <Cloud className="w-5 h-5" />;
      default:
        return <Database className="w-5 h-5" />;
    }
  };

  const handleEditService = (id: string) => {
    toast({
      title: "Edit Service",
      description: "Service editing functionality will be implemented in a future update.",
    });
  };

  const handleManageCategories = () => {
    setActiveTab("categories");
    toast({
      title: "Manage Categories",
      description: "Switched to the Categories tab. You can add, edit, or delete categories.",
    });
  };

  const handleNewService = () => {
    toast({
      title: "New Service",
      description: "New service creation functionality will be implemented in a future update.",
    });
  };

  const handleSelectModel = (modelId: string) => {
    toast({
      title: "Model Selected",
      description: `Model selection functionality will be implemented in a future update.`,
    });
  };

  const handleAddCategory = () => {
    setIsAddCategoryDialogOpen(true);
  };

  const handleEditCategory = (name: string) => {
    setSelectedCategory(name);
    setCategoryName(name);
    setCategoryColor("blue");
    setCategoryIcon("database");
    setIsEditCategoryDialogOpen(true);
  };

  const handleDeleteCategory = (name: string) => {
    setSelectedCategory(name);
    setIsDeleteCategoryDialogOpen(true);
  };

  const handleAddCategorySubmit = () => {
    if (categoryName.trim()) {
      toast({
        title: "Category Added",
        description: `Category "${categoryName}" has been added successfully.`,
      });
      setIsAddCategoryDialogOpen(false);
      setCategoryName("");
      setCategoryColor("blue");
      setCategoryIcon("database");
    }
  };

  const handleEditCategorySubmit = () => {
    if (categoryName.trim()) {
      toast({
        title: "Category Updated",
        description: `Category "${selectedCategory}" has been updated to "${categoryName}".`,
      });
      setIsEditCategoryDialogOpen(false);
      setCategoryName("");
      setCategoryColor("blue");
      setCategoryIcon("database");
      setSelectedCategory(null);
    }
  };

  const handleDeleteCategorySubmit = () => {
    toast({
      title: "Category Deleted",
      description: `Category "${selectedCategory}" has been deleted successfully.`,
    });
    setIsDeleteCategoryDialogOpen(false);
    setSelectedCategory(null);
  };

  const iconOptions = [
    { name: 'Database', value: 'database' },
    { name: 'Activity', value: 'activity' },
    { name: 'File Edit', value: 'file-edit' },
    { name: 'Clipboard', value: 'clipboard-list' },
    { name: 'Globe', value: 'globe' },
    { name: 'Cloud', value: 'cloud' },
  ];

  const colorOptions = [
    { name: 'Blue', value: 'blue' },
    { name: 'Red', value: 'red' },
    { name: 'Yellow', value: 'yellow' },
    { name: 'Green', value: 'green' },
    { name: 'Purple', value: 'purple' },
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <Tabs defaultValue="services" onValueChange={setActiveTab}>
        <TabsList className="bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="services" className="rounded-md">Services</TabsTrigger>
          <TabsTrigger value="llm" className="rounded-md">LLM Models</TabsTrigger>
          <TabsTrigger value="categories" className="rounded-md">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Services</h1>
            <div className="flex gap-4">
              <Button variant="outline" className="flex items-center gap-2" onClick={handleManageCategories}>
                <Settings className="w-5 h-5" />
                <span>Manage Categories</span>
              </Button>
              <Button variant="action" className="flex items-center gap-2" onClick={handleNewService}>
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
                {services.map((service) => (
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
                      <Button variant="ghost" className="text-gray-600 hover:text-action-primary" onClick={() => handleEditService(service.id)}>
                        <Edit className="w-5 h-5" />
                        <span className="ml-1">Edit</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="llm" className="mt-6">
          {activeTab === "llm" && (
            <>
              <div className="mb-6">
                <Link to="/services-llm" className="flex items-center text-gray-600 hover:text-action-primary">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  <span>LLM Models Management</span>
                </Link>
              </div>

              <div className="mb-6">
                <Tabs defaultValue="browse">
                  <TabsList className="bg-gray-100 p-1 rounded-lg inline-flex">
                    <TabsTrigger value="browse" className="rounded-md">Browse LLMs</TabsTrigger>
                    <TabsTrigger value="tested" className="rounded-md">Tested LLMs (0)</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search LLM models..."
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 pl-12"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {llmModels.map((model) => (
                  <div key={model.id} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="bg-gray-200 rounded-lg p-2">
                            {model.logo || (
                              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                              </svg>
                            )}
                          </div>
                          <h3 className="text-xl font-bold">{model.name}</h3>
                        </div>
                        <div className="text-gray-500 text-sm mt-1">{model.provider}</div>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">OpenAI</span>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-gray-700 font-medium mb-2">Costs</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-gray-500 text-sm">Input</div>
                          <div>${model.inputCost.toFixed(6)} / token</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-sm">Output</div>
                          <div>${model.outputCost.toFixed(6)} / token</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-sm">Max context</div>
                          <div>{model.maxContext}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-gray-700 font-medium mb-2">Strengths</h4>
                      <ul className="space-y-2">
                        {model.strengths.map((strength, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-gray-700 font-medium mb-2">Limitations</h4>
                      <ul className="space-y-2">
                        {model.limitations.map((limitation, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <span>{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      onClick={() => handleSelectModel(model.id)}
                      className="w-full bg-white border border-action-primary text-action-primary font-medium py-2 rounded-lg hover:bg-action-primary hover:text-white transition-colors"
                    >
                      Select
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Service Categories</h1>
              <Button variant="action" className="flex items-center gap-2" onClick={handleAddCategory}>
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
                onEdit={() => handleEditCategory("INTEGRATIONS")}
                onDelete={() => handleDeleteCategory("INTEGRATIONS")}
              />
              <CategoryCard 
                name="REASONING" 
                color="red" 
                icon="activity"
                onEdit={() => handleEditCategory("REASONING")}
                onDelete={() => handleDeleteCategory("REASONING")}
              />
              <CategoryCard 
                name="DB" 
                color="yellow" 
                icon="database"
                onEdit={() => handleEditCategory("DB")}
                onDelete={() => handleDeleteCategory("DB")}
              />
              <CategoryCard 
                name="DOCUMENT COMPOSITION" 
                color="red" 
                icon="file-edit"
                onEdit={() => handleEditCategory("DOCUMENT COMPOSITION")}
                onDelete={() => handleDeleteCategory("DOCUMENT COMPOSITION")}
              />
              <CategoryCard 
                name="SCRAPING - CRAWLING" 
                color="green" 
                icon="globe"
                onEdit={() => handleEditCategory("SCRAPING - CRAWLING")}
                onDelete={() => handleDeleteCategory("SCRAPING - CRAWLING")}
              />
              <CategoryCard 
                name="LLM PROVIDER" 
                color="purple" 
                icon="cloud"
                onEdit={() => handleEditCategory("LLM PROVIDER")}
                onDelete={() => handleDeleteCategory("LLM PROVIDER")}
              />
              <div 
                className="border border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center cursor-pointer hover:bg-gray-50"
                onClick={handleAddCategory}
              >
                <Plus className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-gray-500">Add New Category</span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Category Dialog */}
      <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new service category with a name, color, and icon.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <Input
                id="name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">
                Color
              </label>
              <div className="col-span-3 flex gap-2">
                {colorOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`w-8 h-8 rounded-full border ${
                      categoryColor === option.value ? 'ring-2 ring-blue-500' : ''
                    } bg-${option.value}-100`}
                    onClick={() => setCategoryColor(option.value)}
                    title={option.name}
                  />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">
                Icon
              </label>
              <div className="col-span-3 flex flex-wrap gap-2">
                {iconOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`p-2 rounded-md border ${
                      categoryIcon === option.value ? 'bg-blue-100 border-blue-300' : 'bg-gray-50'
                    }`}
                    onClick={() => setCategoryIcon(option.value)}
                    title={option.name}
                  >
                    {getCategoryIcon(option.value)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddCategoryDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddCategorySubmit}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryDialogOpen} onOpenChange={setIsEditCategoryDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category name, color, and icon.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="edit-name" className="text-right">
                Name
              </label>
              <Input
                id="edit-name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">
                Color
              </label>
              <div className="col-span-3 flex gap-2">
                {colorOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`w-8 h-8 rounded-full border ${
                      categoryColor === option.value ? 'ring-2 ring-blue-500' : ''
                    } bg-${option.value}-100`}
                    onClick={() => setCategoryColor(option.value)}
                    title={option.name}
                  />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">
                Icon
              </label>
              <div className="col-span-3 flex flex-wrap gap-2">
                {iconOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`p-2 rounded-md border ${
                      categoryIcon === option.value ? 'bg-blue-100 border-blue-300' : 'bg-gray-50'
                    }`}
                    onClick={() => setCategoryIcon(option.value)}
                    title={option.name}
                  >
                    {getCategoryIcon(option.value)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditCategoryDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditCategorySubmit}>Update Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <Dialog open={isDeleteCategoryDialogOpen} onOpenChange={setIsDeleteCategoryDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the category "{selectedCategory}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteCategoryDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategorySubmit}>Delete Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface CategoryBadgeProps {
  category: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  let badgeClass = '';
  
  switch (category) {
    case 'DB':
      badgeClass = 'service-badge-db';
      break;
    case 'DOCUMENT COMPOSITION':
      badgeClass = 'service-badge-document';
      break;
    case 'SCRAPING - CRAWLING':
      badgeClass = 'service-badge-scraping';
      break;
    case 'REASONING':
      badgeClass = 'service-badge-reasoning';
      break;
    case 'INTEGRATIONS':
      badgeClass = 'service-badge-integrations';
      break;
    case 'LLM PROVIDER':
      badgeClass = 'service-badge-provider';
      break;
    default:
      badgeClass = 'bg-gray-100 text-gray-800';
  }
  
  return (
    <span className={`service-badge ${badgeClass}`}>
      {category}
    </span>
  );
};

interface CategoryCardProps {
  name: string;
  color: 'blue' | 'red' | 'yellow' | 'green' | 'purple';
  icon: string;
  onEdit: () => void;
  onDelete: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, color, icon, onEdit, onDelete }) => {
  let colorClass = '';
  
  switch (color) {
    case 'blue':
      colorClass = 'bg-blue-100 text-blue-800 border-blue-300';
      break;
    case 'red':
      colorClass = 'bg-red-100 text-red-800 border-red-300';
      break;
    case 'yellow':
      colorClass = 'bg-yellow-100 text-yellow-800 border-yellow-300';
      break;
    case 'green':
      colorClass = 'bg-green-100 text-green-800 border-green-300';
      break;
    case 'purple':
      colorClass = 'bg-purple-100 text-purple-800 border-purple-300';
      break;
  }

  const getIcon = () => {
    switch (icon) {
      case 'database':
        return <Database className="w-5 h-5" />;
      case 'activity':
        return <Activity className="w-5 h-5" />;
      case 'file-edit':
        return <FileEdit className="w-5 h-5" />;
      case 'clipboard-list':
        return <ClipboardList className="w-5 h-5" />;
      case 'globe':
        return <Globe className="w-5 h-5" />;
      case 'cloud':
        return <Cloud className="w-5 h-5" />;
      default:
        return <Database className="w-5 h-5" />;
    }
  };
  
  return (
    <div className={`border rounded-lg p-4 ${colorClass}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {getIcon()}
          <span className="font-medium">{name}</span>
        </div>
        <div className="flex gap-2">
          <button 
            className="p-1 hover:bg-white hover:bg-opacity-30 rounded"
            onClick={onEdit}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            className="p-1 hover:bg-white hover:bg-opacity-30 rounded"
            onClick={onDelete}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicesLLM;
