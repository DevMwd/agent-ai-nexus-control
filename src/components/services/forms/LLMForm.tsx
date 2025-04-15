import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { X, Plus, Upload } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export const llmFormSchema = z.object({
  name: z.string().min(2, { message: "Il nome deve avere almeno 2 caratteri" }),
  provider: z.string().min(2, { message: "Specifica il provider" }),
  inputCost: z.number().min(0, { message: "Il costo deve essere positivo" }),
  outputCost: z.number().min(0, { message: "Il costo deve essere positivo" }),
  maxContext: z.string().min(2, { message: "Specifica il contesto massimo" }),
  logo: z.string().optional(),
  strengths: z.array(z.string()).min(1, { message: "Aggiungi almeno un punto di forza" }),
  limitations: z.array(z.string()).min(1, { message: "Aggiungi almeno una limitazione" })
});

export type LLMFormValues = z.infer<typeof llmFormSchema>;

interface LLMFormProps {
  onSubmit: (values: LLMFormValues, logoFile?: File | null) => void;
  onCancel: () => void;
  defaultValues?: LLMFormValues;
  submitLabel?: string;
  initialLogoPreview?: string | null;
}

const LLMForm: React.FC<LLMFormProps> = ({ 
  onSubmit, 
  onCancel, 
  defaultValues = {
    name: "",
    provider: "",
    inputCost: 0.000001,
    outputCost: 0.000001,
    maxContext: "",
    logo: "",
    strengths: [""],
    limitations: [""]
  },
  submitLabel = "Save",
  initialLogoPreview = null
}) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(initialLogoPreview);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  
  const form = useForm<LLMFormValues>({
    resolver: zodResolver(llmFormSchema),
    defaultValues
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        form.setValue('logo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const clearLogoPreview = () => {
    setLogoPreview(null);
    setLogoFile(null);
    form.setValue('logo', '');
  };

  const handleFormSubmit = (values: LLMFormValues) => {
    onSubmit(values, logoFile);
  };

  const handleAddStrengthField = () => {
    const currentStrengths = form.getValues().strengths;
    form.setValue('strengths', [...currentStrengths, '']);
  };

  const handleRemoveStrengthField = (index: number) => {
    const currentStrengths = form.getValues().strengths;
    if (currentStrengths.length > 1) {
      form.setValue('strengths', currentStrengths.filter((_, i) => i !== index));
    }
  };

  const handleAddLimitationField = () => {
    const currentLimitations = form.getValues().limitations;
    form.setValue('limitations', [...currentLimitations, '']);
  };

  const handleRemoveLimitationField = (index: number) => {
    const currentLimitations = form.getValues().limitations;
    if (currentLimitations.length > 1) {
      form.setValue('limitations', currentLimitations.filter((_, i) => i !== index));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
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
            control={form.control}
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
            control={form.control}
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
            control={form.control}
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
            control={form.control}
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
            {form.watch('strengths').map((strength, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  value={strength}
                  onChange={(e) => {
                    const newStrengths = [...form.getValues().strengths];
                    newStrengths[index] = e.target.value;
                    form.setValue('strengths', newStrengths);
                  }}
                  placeholder="Enter a strength"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveStrengthField(index)}
                  disabled={form.watch('strengths').length <= 1}
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
            {form.watch('limitations').map((limitation, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  value={limitation}
                  onChange={(e) => {
                    const newLimitations = [...form.getValues().limitations];
                    newLimitations[index] = e.target.value;
                    form.setValue('limitations', newLimitations);
                  }}
                  placeholder="Enter a limitation"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveLimitationField(index)}
                  disabled={form.watch('limitations').length <= 1}
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
          <Button variant="outline" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button variant="action" type="submit">{submitLabel}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default LLMForm;
