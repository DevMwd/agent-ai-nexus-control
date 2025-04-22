import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAgents, AIAgent, LLMModel, LLMModelDetails, CostAnalysis } from '@/contexts/AgentContext';
import { ArrowLeft, Save, Upload, X, Check, DollarSign, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

interface CostAnalysisFormData {
  hourlyRate: number;
  sessionLength: number;
  manualHourlyRate: number;
  timeSavedPerSession: number;
  annualSessions: number;
}

const AgentEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { agents, llmModels, updateAgent, loading } = useAgents();
  const [agent, setAgent] = useState<AIAgent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const { isAdmin, isOwner } = useAuth();
  
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [primaryLlm, setPrimaryLlm] = useState<LLMModel | undefined>(undefined);
  
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
      prompt: '',
      costAnalysis: {
        hourlyRate: 0,
        sessionLength: 0,
        manualHourlyRate: 0,
        timeSavedPerSession: 0,
        annualSessions: 0
      } as CostAnalysisFormData
    }
  });

  useEffect(() => {
    if (!isAdmin()) {
      toast.error("You don't have permission to edit agents");
      navigate('/agents');
      return;
    }
    
    if (loading) return;
    
    const foundAgent = agents.find(a => a.id === id);
    if (foundAgent) {
      setAgent(foundAgent);
      setPrimaryLlm(foundAgent.primaryLlm);
      
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
        prompt: foundAgent.prompt || "System prompt for this agent. In a real application, this would contain the actual prompt configuration.",
        costAnalysis: {
          hourlyRate: foundAgent.costAnalysis?.hourlyRate || 0,
          sessionLength: foundAgent.costAnalysis?.sessionLength || 0,
          manualHourlyRate: foundAgent.costAnalysis?.manualHourlyRate || 0,
          timeSavedPerSession: foundAgent.costAnalysis?.timeSavedPerSession || 0,
          annualSessions: foundAgent.costAnalysis?.annualSessions || 0
        }
      });
      
      if (typeof foundAgent.logo === 'string' && foundAgent.logo.length > 10 && 
          (foundAgent.logo.startsWith('http') || foundAgent.logo.startsWith('data:'))) {
        setLogoPreview(foundAgent.logo);
      }
    } else {
      toast.error("Agent not found");
      navigate('/agents');
    }
  }, [id, agents, navigate, isAdmin, form, loading]);

  const calculateRoi = (data: CostAnalysisFormData): CostAnalysis => {
    const annualTimeSaved = (data.timeSavedPerSession * data.annualSessions) / 60;
    const annualCostSaved = annualTimeSaved * data.manualHourlyRate;
    const annualAgentCost = (data.hourlyRate * data.sessionLength * data.annualSessions) / 60;
    const roi = annualCostSaved > 0 ? Math.round((annualCostSaved / annualAgentCost) * 100) : 0;

    return {
      hourlyRate: data.hourlyRate,
      sessionLength: data.sessionLength,
      manualHourlyRate: data.manualHourlyRate,
      timeSavedPerSession: data.timeSavedPerSession,
      annualSessions: data.annualSessions,
      annualTimeSaved,
      annualCostSaved,
      roi
    };
  };

  const onSubmit = async (data: any) => {
    if (!agent || !id) return;
    
    try {
      setIsSubmitting(true);
      
      const costAnalysis = calculateRoi(data.costAnalysis);
      
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
        primaryLlm,
        prompt: data.prompt,
        costAnalysis
      };
      
      if (logoFile) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          if (reader.result) {
            updatedAgent.logo = reader.result as string;
          } else {
            updatedAgent.logo = agent.logo || data.title.substring(0, 2).toUpperCase();
          }
          
          await updateAgent(updatedAgent);
          toast.success("Agent updated successfully with new logo");
          navigate(`/agents/${id}`);
        };
        reader.readAsDataURL(logoFile);
      } else {
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
      if (primaryLlm === llm) {
        setPrimaryLlm(undefined);
      }
    } else {
      form.setValue('selectedLlms', [...currentLlms, llm]);
    }
  };

  const handlePrimaryLlmSelect = (llm: LLMModel) => {
    setPrimaryLlm(llm);
    
    const currentLlms = form.getValues('selectedLlms');
    if (!currentLlms.includes(llm)) {
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

  const downloadAgentManifest = () => {
    if (!agent) return;
    
    const manifest = {
      manifest: {
        metadata: {
          version: "2.0",
          title: agent.title,
          description: agent.description,
          tags: ["ai-agent", "assistant"]
        },
        kind: {
          type: "interactive"
        },
        configuration: {
          llms: agent.llms.map(llm => ({ name: llm })),
          primaryLlm: agent.primaryLlm,
          nodes: agent.nodes.map(node => ({
            id: node.id,
            name: node.name,
            type: node.type,
            llm: node.llmId
          })),
          services: agent.services.map(service => ({
            id: service.id,
            name: service.name,
            category: service.category
          }))
        },
        performance: {
          scores: agent.scores,
          roi: {
            hourlyRate: agent.costAnalysis.hourlyRate,
            sessionLength: agent.costAnalysis.sessionLength,
            manualHourlyRate: agent.costAnalysis.manualHourlyRate,
            timeSavedPerSession: agent.costAnalysis.timeSavedPerSession,
            annualSessions: agent.costAnalysis.annualSessions
          }
        },
        prompt: agent.prompt
      }
    };
    
    const manifestYaml = JSON.stringify(manifest, null, 2);
    
    const blob = new Blob([manifestYaml], { type: 'application/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${agent.title.toLowerCase().replace(/\s+/g, '-')}-manifest.yml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Agent manifest downloaded successfully');
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
          <Tabs defaultValue="basic-info" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
              <TabsTrigger value="llm-config">LLM Configuration</TabsTrigger>
              <TabsTrigger value="cost-analysis">Cost Analysis & ROI</TabsTrigger>
              <TabsTrigger value="prompt">Prompt</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic-info">
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
            </TabsContent>
            
            <TabsContent value="llm-config">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-6">Primary LLM</h2>
                  <p className="text-gray-600 mb-4">
                    Select the main language model for this agent:
                  </p>
                  
                  <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-2">
                    {llmModels.map((llm) => {
                      const isPrimary = primaryLlm === llm.name;
                      const isSelected = form.watch('selectedLlms').includes(llm.name as LLMModel);
                      
                      return (
                        <div 
                          key={`primary-${llm.id}`} 
                          className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer ${isPrimary ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}
                          onClick={() => handlePrimaryLlmSelect(llm.name as LLMModel)}
                        >
                          <div className="flex items-center justify-center h-5 w-5">
                            {isPrimary ? (
                              <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            ) : (
                              <div className="h-5 w-5 rounded-full border border-gray-300"></div>
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
                  <h2 className="text-xl font-semibold mb-6">Available LLMs</h2>
                  <p className="text-gray-600 mb-4">
                    Select all the language models this agent can use across its nodes:
                  </p>
                  
                  <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-2">
                    {llmModels.map((llm) => {
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
              </div>
            </TabsContent>
            
            <TabsContent value="cost-analysis">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Cost Analysis & ROI Settings</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          Agent Hourly Rate (€)
                        </Label>
                        <Input
                          type="number"
                          {...form.register('costAnalysis.hourlyRate', { valueAsNumber: true })}
                          min={0}
                          step={0.01}
                        />
                        <p className="text-sm text-gray-500">Cost per hour for the agent's execution</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                          Average Session Length (minutes)
                        </Label>
                        <Input
                          type="number"
                          {...form.register('costAnalysis.sessionLength', { valueAsNumber: true })}
                          min={0}
                          step={1}
                        />
                        <p className="text-sm text-gray-500">Average duration of each agent session</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-red-600" />
                          Manual Process Hourly Rate (€)
                        </Label>
                        <Input
                          type="number"
                          {...form.register('costAnalysis.manualHourlyRate', { valueAsNumber: true })}
                          min={0}
                          step={0.01}
                        />
                        <p className="text-sm text-gray-500">Cost per hour if the task was done manually</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-purple-600" />
                          Time Saved Per Session (minutes)
                        </Label>
                        <Input
                          type="number"
                          {...form.register('costAnalysis.timeSavedPerSession', { valueAsNumber: true })}
                          min={0}
                          step={1}
                        />
                        <p className="text-sm text-gray-500">Time saved compared to manual process</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-orange-600" />
                          Estimated Annual Sessions
                        </Label>
                        <Input
                          type="number"
                          {...form.register('costAnalysis.annualSessions', { valueAsNumber: true })}
                          min={0}
                          step={1}
                        />
                        <p className="text-sm text-gray-500">Expected number of sessions per year</p>
                      </div>
                      
                      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h3 className="font-medium text-gray-700 mb-2">ROI Preview</h3>
                        <p className="text-sm text-gray-600">
                          Update the values above to see the calculated ROI metrics.
                        </p>
                        
                        {(() => {
                          const costData = form.watch('costAnalysis');
                          const isDataValid = costData.hourlyRate > 0 && costData.sessionLength > 0 && costData.manualHourlyRate > 0;
                          
                          if (isDataValid) {
                            const analysis = calculateRoi(costData);
                            return (
                              <div className="mt-3 space-y-1 text-sm">
                                <p>Annual Time Saved: <span className="font-medium">{analysis.annualTimeSaved.toFixed(1)} hours</span></p>
                                <p>Annual Cost Saved: <span className="font-medium">€{analysis.annualCostSaved.toFixed(2)}</span></p>
                                <p>ROI: <span className="font-medium">{analysis.roi}%</span></p>
                              </div>
                            );
                          }
                          
                          return null;
                        })()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="prompt">
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
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end gap-4">
            {isOwner() && (
              <Button 
                type="button" 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={downloadAgentManifest}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download Agent Manifest
              </Button>
            )}
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
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
