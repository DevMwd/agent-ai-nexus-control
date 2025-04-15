import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAgents, AIAgent, LLMModel, LLMModelDetails } from '@/contexts/AgentContext';
import { ArrowLeft, Save, Upload, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';

const AgentEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { agents, llmModels, updateAgent, loading } = useAgents();
  const [agent, setAgent] = useState<AIAgent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  // State for logo upload
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  
  // Form state
  const form = useForm({
    defaultValues: {
      title: '',
      subtitle: '',
      description: '',
      isActive: true,
      quality: 0,
      speed: 0,
      saving: 0,
      privacy: 0,
      selectedLlms: [] as LLMModel[],
      prompt: ''
    }
  });

  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin()) {
      toast.error("You don't have permission to edit agents");
      navigate('/agents');
      return;
    }
    
    // Wait for agents to load
    if (loading) return;
    
    // Find the agent by ID
    const foundAgent = agents.find(a => a.id === id);
    if (foundAgent) {
      setAgent(foundAgent);
      
      // Set form default values
      form.reset({
        title: foundAgent.title,
        subtitle: foundAgent.subtitle,
        description: foundAgent.description,
        isActive: foundAgent.isActive,
        quality: foundAgent.scores.quality,
        speed: foundAgent.scores.speed,
        saving: foundAgent.scores.saving,
        privacy: foundAgent.scores.privacy,
        selectedLlms: foundAgent.llms,
        prompt: foundAgent.prompt || "System prompt for this agent. In a real application, this would contain the actual prompt configuration."
      });
      
      // Set logo preview if it's not a data URL (to avoid displaying base64 string)
      if (typeof foundAgent.logo === 'string' && foundAgent.logo.length > 10 && 
          (foundAgent.logo.startsWith('http') || foundAgent.logo.startsWith('data:'))) {
        setLogoPreview(foundAgent.logo);
      }
    } else {
      toast.error("Agent not found");
      navigate('/agents');
    }
  }, [id, agents, navigate, isAdmin, form, loading]);

  const onSubmit = async (data: any) => {
    if (!agent || !id) return;
    
    try {
      setIsSubmitting(true);
      
      // Prepare the updated agent data
      const updatedAgent: Partial<AIAgent> & { id: string } = {
        id,
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        isActive: data.isActive,
        scores: {
          quality: data.quality,
          speed: data.speed,
          saving: data.saving,
          privacy: data.privacy
        },
        llms: data.selectedLlms,
        prompt: data.prompt
      };
      
      // Handle logo update
      if (logoFile) {
        // Using initials as fallback if file reading fails
        const logoInitials = data.title.substring(0, 2).toUpperCase();
        
        // In a real app, we'd upload the image to a server.
        // For this demo, we'll create a data URL but store it properly
        const reader = new FileReader();
        reader.onloadend = async () => {
          // Store the logo properly
          if (reader.result) {
            updatedAgent.logo = logoInitials; // Use initials instead of the base64 string
            
            // For a real app, you would do something like:
            // const uploadResponse = await uploadLogoToServer(logoFile);
            // updatedAgent.logo = uploadResponse.logoUrl;
          } else {
            updatedAgent.logo = logoInitials;
          }
          
          await updateAgent(updatedAgent);
          toast.success("Agent updated successfully with new logo");
          navigate(`/agents/${id}`);
        };
        reader.readAsDataURL(logoFile);
      } else {
        // Keep existing logo or use initials
        updatedAgent.logo = agent.logo || data.title.substring(0, 2).toUpperCase();
        await updateAgent(updatedAgent);
        toast.success("Agent updated successfully");
        navigate(`/agents/${id}`);
      }
    } catch (error) {
      console.error("Error updating agent:", error);
      toast.error("Failed to update agent");
      setIsSubmitting(false);
    }
  };

  const handleLlmToggle = (llm: LLMModel) => {
    const currentLlms = form.getValues('selectedLlms');
    if (currentLlms.includes(llm)) {
      form.setValue('selectedLlms', currentLlms.filter(l => l !== llm));
    } else {
      form.setValue('selectedLlms', [...currentLlms, llm]);
    }
  };
  
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

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading agent data...</p>
        </div>
      </div>
    );
  }

  if (!agent) {
    return <div className="container mx-auto px-6 py-8">Agent not found</div>;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <Link to={`/agents/${id}`} className="flex items-center text-gray-600 hover:text-action-primary">
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back to Agent Details</span>
        </Link>
      </div>

      <div className="flex items-center gap-6 mb-8">
        <div className="relative">
          {logoPreview ? (
            <div className="relative w-20 h-20">
              <Avatar className="w-20 h-20">
                <AvatarImage src={logoPreview} alt="Agent logo preview" className="object-cover" />
                <AvatarFallback>{agent.logo}</AvatarFallback>
              </Avatar>
              <button 
                onClick={clearLogoPreview}
                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm border border-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-xl font-semibold">
              {agent.logo}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold">Edit {agent.title}</h1>
          <div className="mt-2">
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Agent Title</Label>
                  <Input
                    id="title"
                    {...form.register('title')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    {...form.register('subtitle')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...form.register('description')}
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={form.watch('isActive')}
                    onCheckedChange={(checked) => form.setValue('isActive', checked)}
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">Active</Label>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Performance Parameters</h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="quality">Quality</Label>
                    <span className="text-sm font-medium">{form.watch('quality')}/5</span>
                  </div>
                  <Slider
                    id="quality"
                    min={0}
                    max={5}
                    step={0.1}
                    value={[form.watch('quality')]}
                    onValueChange={(value) => form.setValue('quality', value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="speed">Speed</Label>
                    <span className="text-sm font-medium">{form.watch('speed')}/5</span>
                  </div>
                  <Slider
                    id="speed"
                    min={0}
                    max={5}
                    step={0.1}
                    value={[form.watch('speed')]}
                    onValueChange={(value) => form.setValue('speed', value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="saving">Cost Efficiency</Label>
                    <span className="text-sm font-medium">{form.watch('saving')}/5</span>
                  </div>
                  <Slider
                    id="saving"
                    min={0}
                    max={5}
                    step={0.1}
                    value={[form.watch('saving')]}
                    onValueChange={(value) => form.setValue('saving', value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="privacy">Privacy</Label>
                    <span className="text-sm font-medium">{form.watch('privacy')}/5</span>
                  </div>
                  <Slider
                    id="privacy"
                    min={0}
                    max={5}
                    step={0.1}
                    value={[form.watch('privacy')]}
                    onValueChange={(value) => form.setValue('privacy', value[0])}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-6">LLM Selection</h2>
              <p className="text-gray-600 mb-4">
                Select the language models this agent can use:
              </p>
              
              <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-2">
                {llmModels.map((llm) => {
                  // Use the name field for LLM models
                  const isSelected = form.watch('selectedLlms').includes(llm.name as LLMModel);
                  
                  return (
                    <div 
                      key={llm.id} 
                      className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer ${isSelected ? 'border-action-primary bg-action-50' : 'border-gray-200 hover:bg-gray-50'}`}
                      onClick={() => handleLlmToggle(llm.name as LLMModel)}
                    >
                      <div className="flex items-center justify-center h-5 w-5">
                        {isSelected ? (
                          <div className="h-5 w-5 rounded bg-action-primary flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        ) : (
                          <div className="h-5 w-5 rounded border border-gray-300"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="text-sm font-medium cursor-pointer">{llm.name}</label>
                        <p className="text-xs text-gray-500">Provider: {llm.provider}</p>
                      </div>
                      <div className="text-right text-xs">
                        <p>Input: €{llm.inputCost.toFixed(6)}/token</p>
                        <p>Output: €{llm.outputCost.toFixed(6)}/token</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Prompt Configuration</h2>
              <p className="text-gray-600 mb-4">
                Edit the system prompt used by this agent:
              </p>
              
              <Textarea
                {...form.register('prompt')}
                rows={10}
                className="font-mono"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              variant="action" 
              className="flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AgentEdit;
