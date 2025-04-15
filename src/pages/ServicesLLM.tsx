
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAgents } from '@/contexts/AgentContext';
import { servicesDB, llmModelsDB } from '@/utils/database';
import { Service, ServiceCategory, LLMModelDetails } from '@/contexts/AgentContext';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';

// Import components
import ServicesTab from '@/components/services/ServicesTab';
import LLMModelsTab from '@/components/services/LLMModelsTab';
import CategoriesTab from '@/components/services/CategoriesTab';

// Import dialogs
import { CategoryDialog, DeleteCategoryDialog } from '@/components/services/dialogs/CategoryDialogs';
import { AddServiceDialog, EditServiceDialog, DeleteServiceDialog } from '@/components/services/dialogs/ServiceDialogs';
import { AddLLMDialog, EditLLMDialog, DeleteLLMDialog } from '@/components/services/dialogs/LLMDialogs';

// Import form types
import { ServiceFormValues } from '@/components/services/forms/ServiceForm';
import { LLMFormValues } from '@/components/services/forms/LLMForm';

const ServicesLLM: React.FC = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("services");
  const { services, llmModels } = useAgents();
  const [servicesList, setServicesList] = useState(services);
  const [llmModelsList, setLLMModelsList] = useState(llmModels);
  const { isOwner } = useAuth();
  
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
  
  useEffect(() => {
    const fetchData = async () => {
      const dbServices = await servicesDB.getAll();
      const dbLLMModels = await llmModelsDB.getAll();
      setServicesList(dbServices);
      setLLMModelsList(dbLLMModels);
    };
    
    fetchData();
  }, []);

  // Service handlers
  const handleEditService = (id: string) => {
    if (!isOwner()) return;
    
    const service = servicesList.find(s => s.id === id);
    if (service) {
      setServiceToEdit(service);
      setIsEditServiceDialogOpen(true);
    }
  };

  const handleDeleteService = (id: string) => {
    if (!isOwner()) return;
    
    setSelectedService(id);
    setIsDeleteServiceDialogOpen(true);
  };

  const handleAddServiceSubmit = async (values: ServiceFormValues) => {
    if (!isOwner()) return;
    
    const newService: Service = {
      id: uuidv4(),
      name: values.name,
      category: values.category as ServiceCategory,
      costStructure: values.costStructure,
      costPerUnit: values.costPerUnit,
      hasFreetier: values.hasFreetier,
      logo: values.logo
    };
    
    try {
      await servicesDB.create(newService);
      setServicesList(prev => [...prev, newService]);
      setIsAddServiceDialogOpen(false);
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
    if (!isOwner() || !serviceToEdit) return;
    
    const updatedService: Service = {
      id: serviceToEdit.id,
      name: values.name,
      category: values.category as ServiceCategory,
      costStructure: values.costStructure,
      costPerUnit: values.costPerUnit,
      hasFreetier: values.hasFreetier,
      logo: values.logo
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
    if (!isOwner() || !selectedService) return;
    
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
    if (!isOwner()) return;
    
    const llm = llmModelsList.find(m => m.id === id);
    if (llm) {
      setLLMToEdit(llm);
      setIsEditLLMDialogOpen(true);
    }
  };

  const handleDeleteLLM = (id: string) => {
    if (!isOwner()) return;
    
    setSelectedLLM(id);
    setIsDeleteLLMDialogOpen(true);
  };

  const handleAddLLMSubmit = async (values: LLMFormValues, logoFile?: File | null) => {
    if (!isOwner()) return;
    
    const newLLM: LLMModelDetails = {
      id: uuidv4(),
      name: values.name,
      provider: values.provider,
      inputCost: values.inputCost,
      outputCost: values.outputCost,
      maxContext: values.maxContext,
      logo: values.logo,
      strengths: values.strengths,
      limitations: values.limitations
    };
    
    try {
      await llmModelsDB.create(newLLM);
      setLLMModelsList(prev => [...prev, newLLM]);
      setIsAddLLMDialogOpen(false);
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

  const handleEditLLMSubmit = async (values: LLMFormValues, logoFile?: File | null) => {
    if (!isOwner() || !llmToEdit) return;
    
    const updatedLLM: LLMModelDetails = {
      id: llmToEdit.id,
      name: values.name,
      provider: values.provider,
      inputCost: values.inputCost,
      outputCost: values.outputCost,
      maxContext: values.maxContext,
      logo: values.logo,
      strengths: values.strengths,
      limitations: values.limitations
    };
    
    try {
      await llmModelsDB.update(updatedLLM);
      setLLMModelsList(prev => prev.map(llm => 
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
    if (!isOwner() || !selectedLLM) return;
    
    try {
      await llmModelsDB.delete(selectedLLM);
      setLLMModelsList(prev => prev.filter(llm => llm.id !== selectedLLM));
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
    if (!isOwner()) return;
    setIsAddServiceDialogOpen(true);
  };

  const handleSelectModel = (modelId: string) => {
    if (!isOwner()) return;
    
    toast({
      title: "Modello Selezionato",
      description: `La funzionalità di selezione del modello sarà implementata in un futuro aggiornamento.`,
    });
  };

  const handleAddCategory = () => {
    if (!isOwner()) return;
    setIsAddCategoryDialogOpen(true);
  };

  const handleEditCategory = (name: string) => {
    if (!isOwner()) return;
    
    setSelectedCategory(name);
    setCategoryName(name);
    setCategoryColor("blue");
    setCategoryIcon("database");
    setIsEditCategoryDialogOpen(true);
  };

  const handleDeleteCategory = (name: string) => {
    if (!isOwner()) return;
    
    setSelectedCategory(name);
    setIsDeleteCategoryDialogOpen(true);
  };

  const handleAddCategorySubmit = () => {
    if (!isOwner() || !categoryName.trim()) return;
    
    toast({
      title: "Categoria Aggiunta",
      description: `La categoria "${categoryName}" è stata aggiunta con successo.`,
    });
    setIsAddCategoryDialogOpen(false);
    setCategoryName("");
    setCategoryColor("blue");
    setCategoryIcon("database");
  };

  const handleEditCategorySubmit = () => {
    if (!isOwner() || !categoryName.trim()) return;
    
    toast({
      title: "Categoria Aggiornata",
      description: `La categoria "${selectedCategory}" è stata aggiornata in "${categoryName}".`,
    });
    setIsEditCategoryDialogOpen(false);
    setCategoryName("");
    setCategoryColor("blue");
    setCategoryIcon("database");
    setSelectedCategory(null);
  };

  const handleDeleteCategorySubmit = () => {
    if (!isOwner()) return;
    
    toast({
      title: "Categoria Eliminata",
      description: `La categoria "${selectedCategory}" è stata eliminata con successo.`,
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
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <Tabs defaultValue="services" onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Services & Models</h1>
          <TabsList className="bg-gray-100 p-1 rounded-lg self-start sm:self-auto">
            <TabsTrigger value="services" className="rounded-md text-xs sm:text-sm">Services</TabsTrigger>
            <TabsTrigger value="llm" className="rounded-md text-xs sm:text-sm">LLM Models</TabsTrigger>
            <TabsTrigger value="categories" className="rounded-md text-xs sm:text-sm">Categories</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="services" className="mt-6">
          <ServicesTab
            servicesList={servicesList}
            onManageCategories={handleManageCategories}
            onNewService={handleNewService}
            onEditService={handleEditService}
            onDeleteService={handleDeleteService}
          />
        </TabsContent>

        <TabsContent value="llm" className="mt-6">
          <LLMModelsTab
            llmModels={llmModelsList}
            onAddLLM={() => setIsAddLLMDialogOpen(true)}
            onEditLLM={handleEditLLM}
            onDeleteLLM={handleDeleteLLM}
            onSelectLLM={handleSelectModel}
          />
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <CategoriesTab
            onAddCategory={handleAddCategory}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        </TabsContent>
      </Tabs>

      {/* Only render dialogs if the user is an owner */}
      {isOwner() && (
        <>
          {/* Category Dialogs */}
          <CategoryDialog
            isOpen={isAddCategoryDialogOpen}
            onClose={() => setIsAddCategoryDialogOpen(false)}
            onSubmit={handleAddCategorySubmit}
            categoryName={categoryName}
            setCategoryName={setCategoryName}
            categoryColor={categoryColor}
            setCategoryColor={setCategoryColor}
            categoryIcon={categoryIcon}
            setCategoryIcon={setCategoryIcon}
            title="Add New Category"
            submitLabel="Add Category"
            colorOptions={colorOptions}
            iconOptions={iconOptions}
          />

          <CategoryDialog
            isOpen={isEditCategoryDialogOpen}
            onClose={() => setIsEditCategoryDialogOpen(false)}
            onSubmit={handleEditCategorySubmit}
            categoryName={categoryName}
            setCategoryName={setCategoryName}
            categoryColor={categoryColor}
            setCategoryColor={setCategoryColor}
            categoryIcon={categoryIcon}
            setCategoryIcon={setCategoryIcon}
            title="Edit Category"
            submitLabel="Save Changes"
            colorOptions={colorOptions}
            iconOptions={iconOptions}
          />

          <DeleteCategoryDialog
            isOpen={isDeleteCategoryDialogOpen}
            onClose={() => setIsDeleteCategoryDialogOpen(false)}
            onDelete={handleDeleteCategorySubmit}
            categoryName={selectedCategory}
          />

          {/* Service Dialogs */}
          <AddServiceDialog
            isOpen={isAddServiceDialogOpen}
            onClose={() => setIsAddServiceDialogOpen(false)}
            onSubmit={handleAddServiceSubmit}
          />

          <EditServiceDialog
            isOpen={isEditServiceDialogOpen}
            onClose={() => setIsEditServiceDialogOpen(false)}
            onSubmit={handleEditServiceSubmit}
            service={serviceToEdit}
          />

          <DeleteServiceDialog
            isOpen={isDeleteServiceDialogOpen}
            onClose={() => setIsDeleteServiceDialogOpen(false)}
            onDelete={handleDeleteServiceSubmit}
          />

          {/* LLM Dialogs */}
          <AddLLMDialog
            isOpen={isAddLLMDialogOpen}
            onClose={() => setIsAddLLMDialogOpen(false)}
            onSubmit={handleAddLLMSubmit}
          />

          <EditLLMDialog
            isOpen={isEditLLMDialogOpen}
            onClose={() => setIsEditLLMDialogOpen(false)}
            onSubmit={handleEditLLMSubmit}
            llm={llmToEdit}
          />

          <DeleteLLMDialog
            isOpen={isDeleteLLMDialogOpen}
            onClose={() => setIsDeleteLLMDialogOpen(false)}
            onDelete={handleDeleteLLMSubmit}
          />
        </>
      )}
    </div>
  );
};

export default ServicesLLM;
