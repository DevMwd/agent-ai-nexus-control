
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ServiceForm, { ServiceFormValues } from '../forms/ServiceForm';
import { Service } from '@/contexts/AgentContext';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface AddServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ServiceFormValues) => void;
}

export const AddServiceDialog: React.FC<AddServiceDialogProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden rounded-xl">
        <div className="bg-gradient-to-r from-action-blue to-blue-500 p-6 text-white">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Plus className="h-5 w-5" />
              </div>
              <DialogTitle className="text-2xl">Add New Service</DialogTitle>
            </div>
            <DialogDescription className="text-white/80 mt-2">
              Create a new service with the following details.
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="p-6">
          <ServiceForm 
            onSubmit={onSubmit} 
            onCancel={onClose} 
            submitLabel="Add Service"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface EditServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ServiceFormValues) => void;
  service: Service | null;
}

export const EditServiceDialog: React.FC<EditServiceDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  service
}) => {
  if (!service) return null;

  const defaultValues: ServiceFormValues = {
    name: service.name,
    category: service.category,
    costStructure: service.costStructure,
    costPerUnit: service.costPerUnit,
    hasFreetier: service.hasFreetier,
    logo: service.logo || ""
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden rounded-xl">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Pencil className="h-5 w-5" />
              </div>
              <DialogTitle className="text-2xl">Edit Service</DialogTitle>
            </div>
            <DialogDescription className="text-white/80 mt-2">
              Update the service details.
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="p-6">
          <ServiceForm 
            onSubmit={onSubmit} 
            onCancel={onClose} 
            defaultValues={defaultValues}
            submitLabel="Save Changes"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface DeleteServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export const DeleteServiceDialog: React.FC<DeleteServiceDialogProps> = ({
  isOpen,
  onClose,
  onDelete
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-xl">
        <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 text-white">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Trash2 className="h-5 w-5" />
              </div>
              <DialogTitle className="text-2xl">Delete Service</DialogTitle>
            </div>
          </DialogHeader>
        </div>
        <div className="p-6">
          <DialogDescription className="py-4 text-lg">
            Are you sure you want to delete this service? This action cannot be undone.
          </DialogDescription>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={onClose} className="rounded-lg">
              Cancel
            </Button>
            <Button variant="destructive" onClick={onDelete} className="rounded-lg bg-red-600 hover:bg-red-700">
              Delete
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
