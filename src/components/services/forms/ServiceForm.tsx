
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import { Service, ServiceCategory } from '@/contexts/AgentContext';

export const serviceFormSchema = z.object({
  name: z.string().min(2, { message: "Il nome deve avere almeno 2 caratteri" }),
  category: z.string({ required_error: "Seleziona una categoria" }),
  costStructure: z.string().min(2, { message: "Specifica la struttura dei costi" }),
  costPerUnit: z.string().min(2, { message: "Specifica il costo per unità" }),
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
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <Input placeholder="Cost details" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
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
