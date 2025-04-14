import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAgents } from '@/contexts/AgentContext';
import { Edit, ArrowLeft, Settings, Plus, X, Check, Database, Activity, FileEdit, ClipboardList, Globe, Cloud, Trash2, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { servicesDB, llmModelsDB } from '@/utils/database';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// CategoryBadge component
const CategoryBadge = ({ category }: { category: string }) => {
  const getColor = () => {
    switch (category) {
      case 'INTEGRATIONS': return 'bg-blue-100 text-blue-800';
      case 'REASONING': return 'bg-red-100 text-red-800';
      case 'DB': return 'bg-yellow-100 text-yellow-800';
      case 'DOCUMENT COMPOSITION': return 'bg-red-100 text-red-800';
      case 'SCRAPING - CRAWLING': return 'bg-green-100 text-green-800';
      case 'LLM PROVIDER': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <span className={`${getColor()} px-2 py-1 rounded-full text-xs font-medium`}>
      {category}
    </span>
  );
};

// CategoryCard component
const CategoryCard = ({ 
  name, 
  color, 
  icon,
  onEdit,
  onDelete
}: { 
  name: string; 
  color: string; 
  icon: string;
  onEdit: () => void;
  onDelete: () => void;
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
          <h3 className="font-semibold text-lg">{name}</h3>
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

const ServicesLLM: React.FC = () => {
  const [activeTab, setActiveTab] = useState("services");
  const { services, llmModels } = useAgents();
  const [servicesList, setServicesList] = useState(services);
  const [llmModelsList, setLLMModelsList] = useState(llmModels);
  const [filteredLLMModels, setFilteredLLMModels] = useState(llmModels);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Category state
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false);
  const [isDeleteCategoryDialogOpen, setIsDeleteCategoryDialogOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryColor, setCategoryColor] = useState("blue");
  const [categoryIcon, setCategoryIcon] = useState("database");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Service state
  const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = useState(false);
  const [isEditServiceDialogOpen, setIsEditServiceDialogOpen] = useState(false);
  const [isDeleteServiceDialogOpen, setIsDeleteServiceDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [serviceToEdit, setServiceToEdit] = useState<any>(null);
  
  // LLM model state
  const [isAddLLMDialogOpen, setIsAddLLMDialogOpen] = useState(false);
  const [isEditLLMDialogOpen, setIsEditLLMDialogOpen] = useState(false);
  const [isDeleteLLMDialogOpen, setIsDeleteLLMDialogOpen] = useState(false);
  const [selectedLLM, setSelectedLLM] = useState<string | null>(null);
  const [llmToEdit, setLLMToEdit] = useState<any>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      const dbServices = await servicesDB.getAll();
      const dbLLMModels = await llmModelsDB.getAll();
      setServicesList(dbServices);
      setLLMModelsList(dbLLMModels);
      setFilteredLLMModels(dbLLMModels);
    };
    
    fetchData();
  }, []);
  
  useEffect(() => {
    if (searchTerm) {
      const filtered = llmModelsList.filter(model => 
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.provider.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLLMModels(filtered);
    } else {
      setFilteredLLMModels(llmModelsList);
    }
  }, [searchTerm, llmModelsList]);

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

  // Define validators for our forms
  const serviceFormSchema = z.object({
    name: z.string().min(2, { message: "Il nome deve avere almeno 2 caratteri" }),
    category: z.string({ required_error: "Seleziona una categoria" }),
    costStructure: z.string().min(2, { message: "Specifica la struttura dei costi" }),
    costPerUnit: z.string().min(2, { message: "Specifica il costo per unità" }),
    hasFreetier: z.boolean().default(false),
    logo: z.string().optional()
  });

  const llmFormSchema = z.object({
    name: z.string().min(2, { message: "Il nome deve avere almeno 2 caratteri" }),
    provider: z.string().min(2, { message: "Specifica il provider" }),
    inputCost: z.number().min(0, { message: "Il costo deve essere positivo" }),
    outputCost: z.number().min(0, { message: "Il costo deve essere positivo" }),
    maxContext: z.string().min(2, { message: "Specifica il contesto massimo" }),
    logo: z.string().optional(),
    strengths: z.array(z.string()).min(1, { message: "Aggiungi almeno un punto di forza" }),
    limitations: z.array(z.string()).min(1, { message: "Aggiungi almeno una limitazione" })
  });

  // Service form
  const serviceForm = useForm<z.infer<typeof serviceFormSchema>>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: "",
      category: "DB",
      costStructure: "",
      costPerUnit: "",
      hasFreetier: false,
      logo: ""
    }
  });

  // LLM form
  const llmForm = useForm<z.infer<typeof llmFormSchema>>({
    resolver: zodResolver(llmFormSchema),
    defaultValues: {
      name: "",
      provider: "",
      inputCost: 0.000001,
      outputCost: 0.000001,
      maxContext: "",
      logo: "",
      strengths: [""],
      limitations: [""]
    }
  });

  // Service handlers
  const handleEditService = (id: string) => {
    const service = servicesList.find(s => s.id === id);
    if (service) {
      setServiceToEdit(service);
      serviceForm.reset({
        name: service.name,
        category: service.category,
        costStructure: service.costStructure,
        costPerUnit: service.costPerUnit,
        hasFreetier: service.hasFreetier,
        logo: service.logo || ""
      });
      setIsEditServiceDialogOpen(true);
    }
  };

  const handleDeleteService = (id: string) => {
    setSelectedService(id);
    setIsDeleteServiceDialogOpen(true);
  };

  const handleAddServiceSubmit = async (values: z.infer<typeof serviceFormSchema>) => {
    const newService = {
      id: uuidv4(),
      ...values
    };
    
    try {
      await servicesDB.create(newService);
      setServicesList(prev => [...prev, newService]);
      setIsAddServiceDialogOpen(false);
      serviceForm.reset();
      toast({
        title: "Servizio Aggiunto",
        description: `Il servizio "${values.name}" è stato aggiunto con successo.`,
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiunta del servizio.",
        variant: "destructive"
      });
    }
  };

  const handleEditServiceSubmit = async (values: z.infer<typeof serviceFormSchema>) => {
    if (!serviceToEdit) return;
    
    const updatedService = {
      id: serviceToEdit.id,
      ...values
    };
    
    try {
      await servicesDB.update(updatedService);
      setServicesList(prev => prev.map(service => 
        service.id === serviceToEdit.id ? updatedService : service
      ));
      setIsEditServiceDialogOpen(false);
      toast({
        title: "Servizio Aggiornato",
        description: `Il servizio "${values.name}" è stato aggiornato con successo.`,
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiornamento del servizio.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteServiceSubmit = async () => {
    if (!selectedService) return;
    
    try {
      await servicesDB.delete(selectedService);
      setServicesList(prev => prev.filter(service => service.id !== selectedService));
      setIsDeleteServiceDialogOpen(false);
      toast({
        title: "Servizio Eliminato",
        description: "Il servizio è stato eliminato con successo.",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'eliminazione del servizio.",
        variant: "destructive"
      });
    }
    
    setSelectedService(null);
  };

  // LLM handlers
  const handleEditLLM = (id: string) => {
    const llm = llmModelsList.find(m => m.id === id);
    if (llm) {
      setLLMToEdit(llm);
      llmForm.reset({
        name: llm.name,
        provider: llm.provider,
        inputCost: llm.inputCost,
        outputCost: llm.outputCost,
        maxContext: llm.maxContext,
        logo: llm.logo || "",
        strengths: llm.strengths,
        limitations: llm.limitations
      });
      setIsEditLLMDialogOpen(true);
    }
  };

  const handleDeleteLLM = (id: string) => {
    setSelectedLLM(id);
    setIsDeleteLLMDialogOpen(true);
  };

  const handleAddLLMSubmit = async (values: z.infer<typeof llmFormSchema>) => {
    const newLLM = {
      id: uuidv4(),
      ...values
    };
    
    try {
      await llmModelsDB.create(newLLM);
      setLLMModelsList(prev => [...prev, newLLM]);
      setFilteredLLMModels(prev => [...prev, newLLM]);
      setIsAddLLMDialogOpen(false);
      llmForm.reset();
      toast({
        title: "LLM Aggiunto",
        description: `Il modello "${values.name}" è stato aggiunto con successo.`,
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiunta del modello LLM.",
        variant: "destructive"
      });
    }
  };

  const handleEditLLMSubmit = async (values: z.infer<typeof llmFormSchema>) => {
    if (!llmToEdit) return;
    
    const updatedLLM = {
      id: llmToEdit.id,
      ...values
    };
    
    try {
      await llmModelsDB.update(updatedLLM);
      setLLMModelsList(prev => prev.map(llm => 
        llm.id === llmToEdit.id ? updatedLLM : llm
      ));
      setFilteredLLMModels(prev => prev.map(llm => 
        llm.id === llmToEdit.id ? updatedLLM : llm
      ));
      setIsEditLLMDialogOpen(false);
      toast({
        title: "LLM Aggiornato",
        description: `Il modello "${values.name}" è stato aggiornato con successo.`,
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiornamento del modello LLM.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteLLMSubmit = async () => {
    if (!selectedLLM) return;
    
    try {
      await llmModelsDB.delete(selectedLLM);
      setLLMModelsList(prev => prev.filter(llm => llm.id !== selectedLLM));
      setFilteredLLMModels(prev => prev.filter(llm => llm.id !== selectedLLM));
      setIsDeleteLLMDialogOpen(false);
      toast({
        title: "LLM Eliminato",
        description: "Il modello LLM è stato eliminato con successo.",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'eliminazione del modello LLM.",
        variant: "destructive"
      });
    }
    
    setSelectedLLM(null);
  };

  // Category handlers
  const handleManageCategories = () => {
    setActiveTab("categories");
    toast({
      title: "Gestione Categorie",
      description: "Sei passato alla scheda Categorie. Puoi aggiungere, modificare o eliminare categorie.",
    });
  };

  const handleNewService = () => {
    serviceForm.reset();
    setIsAddServiceDialogOpen(true);
  };

  const handleSelectModel = (modelId: string) => {
    toast({
      title: "Modello Selezionato",
      description: `La funzionalità di selezione del modello sarà implementata in un futuro aggiornamento.`,
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
        title: "Categoria Aggiunta",
        description: `La categoria "${categoryName}" è stata aggiunta con successo.`,
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
        title: "Categoria Aggiornata",
        description: `La categoria "${selectedCategory}" è stata aggiornata in "${categoryName}".`,
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
      title: "Categoria Eliminata",
      description: `La categoria "${selectedCategory}" è stata eliminata con successo.`,
    });
    setIsDeleteCategoryDialogOpen(false);
    setSelectedCategory(null);
  };

  const handleAddStrengthField = () => {
    const currentStrengths = llmForm.getValues().strengths;
    llmForm.setValue('strengths', [...currentStrengths, '']);
  };

  const handleRemoveStrengthField = (index: number) => {
    const currentStrengths = llmForm.getValues().strengths;
    if (currentStrengths.length > 1) {
      llmForm.setValue('strengths', currentStrengths.filter((_, i) => i !== index));
    }
  };

  const handleAddLimitationField = () => {
    const currentLimitations = llmForm.getValues().limitations;
    llmForm.setValue('limitations', [...currentLimitations, '']);
  };

  const handleRemoveLimitationField = (index: number) => {
    const currentLimitations = llmForm.getValues().limitations;
    if (currentLimitations.length > 1) {
      llmForm.setValue('limitations', currentLimitations.filter((_, i) => i !== index));
    }
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
                          <DropdownMenuItem onClick={() => handleEditService(service.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteService(service.id)}>
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

              <div className="mb-6 flex justify-between items-center">
                <Tabs defaultValue="browse" className="w-auto">
                  <TabsList className="bg-gray-100 p-1 rounded-lg inline-flex">
                    <TabsTrigger value="browse" className="rounded-md">Browse LLMs</TabsTrigger>
                    <TabsTrigger value="tested" className="rounded-md">Tested LLMs (0)</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button variant="action" className="flex items-center gap-2" onClick={() => setIsAddLLMDialogOpen(true)}>
                  <Plus className="w-5 h-5" />
                  <span>New LLM Model</span>
                </Button>
              </div>

              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search LLM models..."
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 pl-12"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="w-6 h-6 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLLMModels.map((model) => (
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
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEditLLM(model.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDeleteLLM(model.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
                <Plus className="w-5
