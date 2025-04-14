import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAgents } from '@/contexts/AgentContext';
import { Edit, ArrowLeft, Settings, Plus, X, Check, Database, Activity, FileEdit, ClipboardList, Globe, Cloud, Trash2, Search, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { servicesDB, llmModelsDB } from '@/utils/database';
import { Service, ServiceCategory, LLMModelDetails } from '@/contexts/AgentContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';

// CategoryBadge component
const CategoryBadge = ({ category }: { category: string }) => {
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
  const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);
  
  // LLM model state
  const [isAddLLMDialogOpen, setIsAddLLMDialogOpen] = useState(false);
  const [isEditLLMDialogOpen, setIsEditLLMDialogOpen] = useState(false);
  const [isDeleteLLMDialogOpen, setIsDeleteLLMDialogOpen] = useState(false);
  const [selectedLLM, setSelectedLLM] = useState<string | null>(null);
  const [llmToEdit, setLLMToEdit] = useState<LLMModelDetails | null>(null);
  
  // Logo upload state
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [editLogoPreview, setEditLogoPreview] = useState<string | null>(null);
  const [editLogoFile, setEditLogoFile] = useState<File | null>(null);
  
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
    hasFreetier: z.boolean().default(false)
  });

  const llmFormSchema = z.object({
    name: z.string().min(2, { message: "Il nome deve avere almeno 2 caratteri" }),
    provider: z.string().min(2, { message: "Specifica il provider" }),
    inputCost: z.number().min(0, { message: "Il costo deve essere positivo" }),
    outputCost: z.number().min(0, { message: "Il costo deve essere positivo" }),
    maxContext: z.string().min(2, { message: "Specifica il contesto massimo" }),
    strengths: z.array(z.string()).min(1, { message: "Aggiungi almeno un punto di forza" }),
    limitations: z.array(z.string()).min(1, { message: "Aggiungi almeno una limitazione" })
  });

  type ServiceFormValues = z.infer<typeof serviceFormSchema>;
  type LLMFormValues = z.infer<typeof llmFormSchema>;

  // Service form
  const serviceForm = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: "",
      category: "DB",
      costStructure: "",
      costPerUnit: "",
      hasFreetier: false
    }
  });

  // LLM form
  const llmForm = useForm<LLMFormValues>({
    resolver: zodResolver(llmFormSchema),
    defaultValues: {
      name: "",
      provider: "",
      inputCost: 0.000001,
      outputCost: 0.000001,
      maxContext: "",
      strengths: [""],
      limitations: [""]
    }
  });

  // Handle logo file uploads for new LLM
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const clearLogoPreview = () => {
    setLogoPreview(null);
    setLogoFile(null);
  };
  
  // Handle logo file uploads for editing LLM
  const handleEditLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const clearEditLogoPreview = () => {
    setEditLogoPreview(null);
    setEditLogoFile(null);
  };

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
        hasFreetier: service.hasFreetier
      });
      setIsEditServiceDialogOpen(true);
    }
  };

  const handleDeleteService = (id: string) => {
    setSelectedService(id);
    setIsDeleteServiceDialogOpen(true);
  };

  const handleAddServiceSubmit = async (values: ServiceFormValues) => {
    const newService: Service = {
      id: uuidv4(),
      name: values.name,
      category: values.category as ServiceCategory,
      costStructure: values.costStructure,
      costPerUnit: values.costPerUnit,
      hasFreetier: values.hasFreetier
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

  const handleEditServiceSubmit = async (values: ServiceFormValues) => {
    if (!serviceToEdit) return;
    
    const updatedService: Service = {
      id: serviceToEdit.id,
      name: values.name,
      category: values.category as ServiceCategory,
      costStructure: values.costStructure,
      costPerUnit: values.costPerUnit,
      hasFreetier: values.hasFreetier,
      logo: serviceToEdit.logo
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
      setEditLogoPreview(llm.logo || null);
      llmForm.reset({
        name: llm.name,
        provider: llm.provider,
        inputCost: llm.inputCost,
        outputCost: llm.outputCost,
        maxContext: llm.maxContext,
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

  const handleAddLLMSubmit = async (values: LLMFormValues) => {
    // For demo, we're just using the dataURL as the logo
    // In a real app, you'd upload this to storage and get a URL back
    const logoUrl = logoPreview || "";
    
    const newLLM: LLMModelDetails = {
      id: uuidv4(),
      name: values.name,
      provider: values.provider,
      inputCost: values.inputCost,
      outputCost: values.outputCost,
      maxContext: values.maxContext,
      logo: logoUrl,
      strengths: values.strengths,
      limitations: values.limitations
    };
    
    try {
      await llmModelsDB.create(newLLM);
      setLLMModelsList(prev => [...prev, newLLM]);
      setFilteredLLMModels(prev => [...prev, newLLM]);
      setIsAddLLMDialogOpen(false);
      setLogoPreview(null);
      setLogoFile(null);
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

  const handleEditLLMSubmit = async (values: LLMFormValues) => {
    if (!llmToEdit) return;
    
    // Use the new logo if available, otherwise keep the existing one
    const logoUrl = editLogoPreview || llmToEdit.logo || "";
    
    const updatedLLM: LLMModelDetails = {
      id: llmToEdit.id,
      name: values.name,
      provider: values.provider,
      inputCost: values.inputCost,
      outputCost: values.outputCost,
      maxContext: values.maxContext,
      logo: logoUrl,
      strengths: values.strengths,
      limitations: values.limitations
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
      setEditLogoPreview(null);
      setEditLogoFile(null);
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
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold">LLM Models</h1>
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
                      <div className="bg-gray-200 rounded-lg p-2 h-12 w-12 flex items-center justify-center overflow-hidden">
                        {model.logo ? (
                          <Avatar className="h-full w-full">
                            <AvatarImage src={model.logo} alt={model.name} className="object-cover" />
                            <AvatarFallback>{model.name[0]}</AvatarFallback>
                          </Avatar>
                        ) : (
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
                      <div>€{model.inputCost.toFixed(6)} / token</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-sm">Output</div>
                      <div>€{model.outputCost.toFixed(6)} / token</div>
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
                color="purple" 
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
                <Plus className="w-5 h-5 mr-2" />
                <span>Add New Category</span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add LLM Dialog */}
      <Dialog open={isAddLLMDialogOpen} onOpenChange={setIsAddLLMDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New LLM Model</DialogTitle>
            <DialogDescription>
              Enter the details for the new language model.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...llmForm}>
            <form onSubmit={llmForm.handleSubmit(handleAddLLMSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={llmForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="GPT-4o, Claude 3, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={llmForm.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provider</FormLabel>
                      <FormControl>
                        <Input placeholder="OpenAI, Anthropic, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={llmForm.control}
                  name="inputCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Input Cost (€/token)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.000001"
                          min="0"
                          placeholder="0.000010" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={llmForm.control}
                  name="outputCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Output Cost (€/token)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.000001"
                          min="0"
                          placeholder="0.000030" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={llmForm.control}
                  name="maxContext"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Context</FormLabel>
                      <FormControl>
                        <Input placeholder="128K tokens" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="col-span-2">
                  <Label>Logo</Label>
                  <div className="mt-2 flex items-center gap-4">
                    {logoPreview ? (
                      <div className="relative h-16 w-16">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={logoPreview} alt="Logo preview" className="object-cover" />
                          <AvatarFallback>LLM</AvatarFallback>
                        </Avatar>
                        <button 
                          onClick={clearLogoPreview}
                          className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm border border-gray-200"
                          type="button"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                      </div>
                    )}
                    
                    <label htmlFor="logo-upload" className="cursor-pointer flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800">
                      <Upload className="w-4 h-4" />
                      <span>Upload logo</span>
                      <input 
                        id="logo-upload" 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleLogoChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <Label>Strengths</Label>
                <div className="space-y-2 mt-2">
                  {llmForm.watch('strengths').map((strength, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        value={strength}
                        onChange={(e) => {
                          const newStrengths = [...llmForm.getValues().strengths];
                          newStrengths[index] = e.target.value;
                          llmForm.setValue('strengths', newStrengths);
                        }}
                        placeholder="Enter a strength"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveStrengthField(index)}
                        disabled={llmForm.watch('strengths').length <= 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddStrengthField}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Strength
                  </Button>
                </div>
              </div>
              
              <div>
                <Label>Limitations</Label>
                <div className="space-y-2 mt-2">
                  {llmForm.watch('limitations').map((limitation, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        value={limitation}
                        onChange={(e) => {
                          const newLimitations = [...llmForm.getValues().limitations];
                          newLimitations[index] = e.target.value;
                          llmForm.setValue('limitations', newLimitations);
                        }}
                        placeholder="Enter a limitation"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveLimitationField(index)}
                        disabled={llmForm.watch('limitations').length <= 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddLimitationField}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Limitation
                  </Button>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddLLMDialogOpen(false)} type="button">
                  Cancel
                </Button>
                <Button variant="action" type="submit">Save</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit LLM Dialog */}
      <Dialog open={isEditLLMDialogOpen} onOpenChange={setIsEditLLMDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit LLM Model</DialogTitle>
            <DialogDescription>
              Update the details for this language model.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...llmForm}>
            <form onSubmit={llmForm.handleSubmit(handleEditLLMSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={llmForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="GPT-4o, Claude 3, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={llmForm.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provider</FormLabel>
                      <FormControl>
                        <Input placeholder="OpenAI, Anthropic, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={llmForm.control}
                  name="inputCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Input Cost (€/token)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.000001"
                          min="0"
                          placeholder="0.000010" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={llmForm.control}
                  name="outputCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Output Cost (€/token)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.000001"
                          min="0"
                          placeholder="0.000030" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={llmForm.control}
                  name="maxContext"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Context</FormLabel>
                      <FormControl>
                        <Input placeholder="128K tokens" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="col-span-2">
                  <Label>Logo</Label>
                  <div className="mt-2 flex items-center gap-4">
                    {editLogoPreview ? (
                      <div className="relative h-16 w-16">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={editLogoPreview} alt="Logo preview" className="object-cover" />
                          <AvatarFallback>LLM</AvatarFallback>
                        </Avatar>
                        <button 
                          onClick={clearEditLogoPreview}
                          className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm border border-gray-200"
                          type="button"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                      </div>
                    )}
                    
                    <label htmlFor="edit-logo-upload" className="cursor-pointer flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800">
                      <Upload className="w-4 h-4" />
                      <span>Upload logo</span>
                      <input 
                        id="edit-logo-upload" 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleEditLogoChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <Label>Strengths</Label>
                <div className="space-y-2 mt-2">
                  {llmForm.watch('strengths').map((strength, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        value={strength}
                        onChange={(e) => {
                          const newStrengths = [...llmForm.getValues().strengths];
                          newStrengths[index] = e.target.value;
                          llmForm.setValue('strengths', newStrengths);
                        }}
                        placeholder="Enter a strength"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveStrengthField(index)}
                        disabled={llmForm.watch('strengths').length <= 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddStrengthField}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Strength
                  </Button>
                </div>
              </div>
              
              <div>
                <Label>Limitations</Label>
                <div className="space-y-2 mt-2">
                  {llmForm.watch('limitations').map((limitation, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        value={limitation}
                        onChange={(e) => {
                          const newLimitations = [...llmForm.getValues().limitations];
                          newLimitations[index] = e.target.value;
                          llmForm.setValue('limitations', newLimitations);
                        }}
                        placeholder="Enter a limitation"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveLimitationField(index)}
                        disabled={llmForm.watch('limitations').length <= 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddLimitationField}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Limitation
                  </Button>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditLLMDialogOpen(false)} type="button">
                  Cancel
                </Button>
                <Button variant="action" type="submit">Save</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Other Dialogs */}
      <Dialog open={isAddServiceDialogOpen} onOpenChange={setIsAddServiceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
          </DialogHeader>
          <Form {...serviceForm}>
            <form onSubmit={serviceForm.handleSubmit(handleAddServiceSubmit)} className="space-y-4">
              {/* Form fields for service */}
              <FormField
                control={serviceForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Service name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={serviceForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="INTEGRATIONS">INTEGRATIONS</SelectItem>
                        <SelectItem value="REASONING">REASONING</SelectItem>
                        <SelectItem value="DB">DB</SelectItem>
                        <SelectItem value="DOCUMENT COMPOSITION">DOCUMENT COMPOSITION</SelectItem>
                        <SelectItem value="SCRAPING - CRAWLING">SCRAPING - CRAWLING</SelectItem>
                        <SelectItem value="LLM PROVIDER">LLM PROVIDER</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={serviceForm.control}
                name="costStructure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost Structure</FormLabel>
                    <FormControl>
                      <Input placeholder="Per request, per token, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={serviceForm.control}
                name="costPerUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost per Unit</FormLabel>
                    <FormControl>
                      <Input placeholder="Cost details" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={serviceForm.control}
                name="hasFreetier"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </FormControl>
                    <FormLabel className="m-0">Has Free Tier</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddServiceDialogOpen(false)} type="button">
                  Cancel
                </Button>
                <Button type="submit">Add Service</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditServiceDialogOpen} onOpenChange={setIsEditServiceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          <Form {...serviceForm}>
            <form onSubmit={serviceForm.handleSubmit(handleEditServiceSubmit)} className="space-y-4">
              {/* Form fields for service edit */}
              <FormField
                control={serviceForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Service name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={serviceForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="INTEGRATIONS">INTEGRATIONS</SelectItem>
                        <SelectItem value="REASONING">REASONING</SelectItem>
                        <SelectItem value="DB">DB</SelectItem>
                        <SelectItem value="DOCUMENT COMPOSITION">DOCUMENT COMPOSITION</SelectItem>
                        <SelectItem value="SCRAPING - CRAWLING">SCRAPING - CRAWLING</SelectItem>
                        <SelectItem value="LLM PROVIDER">LLM PROVIDER</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={serviceForm.control}
                name="costStructure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost Structure</FormLabel>
                    <FormControl>
                      <Input placeholder="Per request, per token, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={serviceForm.control}
                name="costPerUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost per Unit</FormLabel>
                    <FormControl>
                      <Input placeholder="Cost details" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={serviceForm.control}
                name="hasFreetier"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </FormControl>
                    <FormLabel className="m-0">Has Free Tier</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditServiceDialogOpen(false)} type="button">
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteServiceDialogOpen} onOpenChange={setIsDeleteServiceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this service? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteServiceDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteServiceSubmit}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteLLMDialogOpen} onOpenChange={setIsDeleteLLMDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete LLM Model</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this LLM model? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteLLMDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteLLMSubmit}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Category name"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="categoryColor">Color</Label>
              <Select onValueChange={setCategoryColor} defaultValue={categoryColor}>
                <SelectTrigger id="categoryColor" className="mt-1">
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      {color.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="categoryIcon">Icon</Label>
              <Select onValueChange={setCategoryIcon} defaultValue={categoryIcon}>
                <SelectTrigger id="categoryIcon" className="mt-1">
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((icon) => (
                    <SelectItem key={icon.value} value={icon.value}>
                      {icon.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCategorySubmit}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditCategoryDialogOpen} onOpenChange={setIsEditCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editCategoryName">Category Name</Label>
              <Input
                id="editCategoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Category name"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="editCategoryColor">Color</Label>
              <Select onValueChange={setCategoryColor} defaultValue={categoryColor}>
                <SelectTrigger id="editCategoryColor" className="mt-1">
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      {color.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="editCategoryIcon">Icon</Label>
              <Select onValueChange={setCategoryIcon} defaultValue={categoryIcon}>
                <SelectTrigger id="editCategoryIcon" className="mt-1">
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((icon) => (
                    <SelectItem key={icon.value} value={icon.value}>
                      {icon.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCategorySubmit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteCategoryDialogOpen} onOpenChange={setIsDeleteCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the category "{selectedCategory}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteCategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategorySubmit}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicesLLM;
