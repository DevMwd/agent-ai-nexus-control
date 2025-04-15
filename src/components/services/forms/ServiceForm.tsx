
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import { Service, ServiceCategory } from '@/contexts/AgentContext';
import { Image, Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';

export const serviceFormSchema = z.object({
  name: z.string().min(2, { message: "Il nome deve avere almeno 2 caratteri" }),
  category: z.string({ required_error: "Seleziona una categoria" }),
  costStructure: z.string().min(2, { message: "Specifica la struttura dei costi" }),
  costPerUnit: z.string().min(1, { message: "Specifica il costo per unità" }),
  hasFreetier: z.boolean().default(false),
  logo: z.string().optional()
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;

interface ServiceFormProps {
  onSubmit: (values: ServiceFormValues) => void;
  onCancel: () => void;
  defaultValues?: ServiceFormValues;
  submitLabel?: string;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ 
  onSubmit, 
  onCancel, 
  defaultValues = {
    name: "",
    category: "DB",
    costStructure: "",
    costPerUnit: "",
    hasFreetier: false,
    logo: ""
  },
  submitLabel = "Save"
}) => {
  const defaultLogo = '/public/lovable-uploads/86b10a75-6f9b-47b2-a434-b1e8c0fe23ea.png';
  const [logoPreview, setLogoPreview] = useState<string | null>(defaultValues.logo || null);
  
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogoPreview(base64String);
        form.setValue('logo', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (values: ServiceFormValues) => {
    // If no logo was provided, set the default one
    if (!values.logo) {
      values.logo = defaultLogo;
    }
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
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
          control={form.control}
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
          control={form.control}
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
          control={form.control}
          name="costPerUnit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cost per Unit</FormLabel>
              <FormControl>
                <Input 
                  placeholder="0.00" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="hasFreetier"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Switch 
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="cursor-pointer">Has Free Tier</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo</FormLabel>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <Avatar className="w-16 h-16 border border-gray-200">
                    {logoPreview ? (
                      <AvatarImage src={logoPreview} alt="Service logo" />
                    ) : (
                      <AvatarImage 
                        src={defaultLogo} 
                        alt="Default service logo" 
                      />
                    )}
                    <AvatarFallback>
                      <Image className="h-8 w-8 text-gray-400" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </label>
                    <Input
                      {...field}
                      type="hidden"
                      value={field.value || ''}
                    />
                  </div>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button type="submit">{submitLabel}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ServiceForm;
