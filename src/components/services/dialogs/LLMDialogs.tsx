
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import LLMForm, { LLMFormValues } from '../forms/LLMForm';
import { LLMModelDetails } from '@/contexts/AgentContext';

interface AddLLMDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: LLMFormValues, logoFile?: File | null) => void;
}

export const AddLLMDialog: React.FC<AddLLMDialogProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New LLM Model</DialogTitle>
          <DialogDescription>
            Enter the details for the new language model.
          </DialogDescription>
        </DialogHeader>
        <LLMForm 
          onSubmit={onSubmit} 
          onCancel={onClose} 
          submitLabel="Add LLM"
        />
      </DialogContent>
    </Dialog>
  );
};

interface EditLLMDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: LLMFormValues, logoFile?: File | null) => void;
  llm: LLMModelDetails | null;
}

export const EditLLMDialog: React.FC<EditLLMDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  llm
}) => {
  if (!llm) return null;

  const defaultValues: LLMFormValues = {
    name: llm.name,
    provider: llm.provider,
    inputCost: llm.inputCost,
    outputCost: llm.outputCost,
    maxContext: llm.maxContext,
    logo: llm.logo || "",
    strengths: llm.strengths,
    limitations: llm.limitations
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit LLM Model</DialogTitle>
          <DialogDescription>
            Update the details for this language model.
          </DialogDescription>
        </DialogHeader>
        <LLMForm 
          onSubmit={onSubmit} 
          onCancel={onClose} 
          defaultValues={defaultValues}
          submitLabel="Save Changes"
          initialLogoPreview={llm.logo || null}
        />
      </DialogContent>
    </Dialog>
  );
};

interface DeleteLLMDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export const DeleteLLMDialog: React.FC<DeleteLLMDialogProps> = ({
  isOpen,
  onClose,
  onDelete
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete LLM Model</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this LLM model? This action cannot be undone.
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
