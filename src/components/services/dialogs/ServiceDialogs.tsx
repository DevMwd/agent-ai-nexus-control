
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ServiceForm, { ServiceFormValues } from '../forms/ServiceForm';
import { Service } from '@/contexts/AgentContext';

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Service</DialogTitle>
        </DialogHeader>
        <ServiceForm 
          onSubmit={onSubmit} 
          onCancel={onClose} 
          submitLabel="Add Service"
        />
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
        </DialogHeader>
        <ServiceForm 
          onSubmit={onSubmit} 
          onCancel={onClose} 
          defaultValues={defaultValues}
          submitLabel="Save Changes"
        />
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Service</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this service? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
