
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import LLMForm, { LLMFormValues } from '../forms/LLMForm';
import { LLMModelDetails } from '@/contexts/AgentContext';
import { Brain, Plus, Pencil, Trash2 } from 'lucide-react';

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
      <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden rounded-xl border-none shadow-xl">
        <div className="bg-gradient-to-r from-action-primary to-purple-700 p-6 text-white">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Plus className="h-5 w-5" />
              </div>
              <DialogTitle className="text-2xl">Add New LLM Model</DialogTitle>
            </div>
            <DialogDescription className="text-white/80 mt-2">
              Enter the details for the new language model.
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="p-6 bg-white">
          <LLMForm 
            onSubmit={onSubmit} 
            onCancel={onClose} 
            submitLabel="Add LLM"
          />
        </div>
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
      <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden rounded-xl border-none shadow-xl">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-500 p-6 text-white">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Pencil className="h-5 w-5" />
              </div>
              <DialogTitle className="text-2xl">Edit LLM Model</DialogTitle>
            </div>
            <DialogDescription className="text-white/80 mt-2">
              Update the details for this language model.
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="p-6 bg-white">
          <LLMForm 
            onSubmit={onSubmit} 
            onCancel={onClose} 
            defaultValues={defaultValues}
            submitLabel="Save Changes"
            initialLogoPreview={llm.logo || null}
          />
        </div>
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
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-xl border-none shadow-xl">
        <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 text-white">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Trash2 className="h-5 w-5" />
              </div>
              <DialogTitle className="text-2xl">Delete LLM Model</DialogTitle>
            </div>
          </DialogHeader>
        </div>
        <div className="p-6 bg-white">
          <DialogDescription className="py-4 text-lg text-gray-700">
            Are you sure you want to delete this LLM model? This action cannot be undone.
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
