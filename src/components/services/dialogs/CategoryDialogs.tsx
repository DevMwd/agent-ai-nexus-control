
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Folder, FolderPlus, PencilRuler, Trash2 } from 'lucide-react';

interface CategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  categoryName: string;
  setCategoryName: (name: string) => void;
  categoryColor: string;
  setCategoryColor: (color: string) => void;
  categoryIcon: string;
  setCategoryIcon: (icon: string) => void;
  title: string;
  description?: string;
  submitLabel: string;
  colorOptions: { name: string; value: string }[];
  iconOptions: { name: string; value: string }[];
}

export const CategoryDialog: React.FC<CategoryDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categoryName,
  setCategoryName,
  categoryColor,
  setCategoryColor,
  categoryIcon,
  setCategoryIcon,
  title,
  description,
  submitLabel,
  colorOptions,
  iconOptions
}) => {
  const isAddNew = title.toLowerCase().includes('add');
  const gradientClass = isAddNew 
    ? "bg-gradient-to-r from-green-500 to-emerald-600" 
    : "bg-gradient-to-r from-amber-500 to-orange-600";
  
  const HeaderIcon = isAddNew ? FolderPlus : PencilRuler;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-xl">
        <div className={`${gradientClass} p-6 text-white`}>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <HeaderIcon className="h-5 w-5" />
              </div>
              <DialogTitle className="text-2xl">{title}</DialogTitle>
            </div>
            {description && <DialogDescription className="text-white/80 mt-2">{description}</DialogDescription>}
          </DialogHeader>
        </div>
        <div className="p-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="categoryName" className="text-base font-medium">Category Name</Label>
              <Input
                id="categoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter category name"
                className="rounded-lg h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categoryColor" className="text-base font-medium">Color</Label>
              <Select onValueChange={setCategoryColor} defaultValue={categoryColor}>
                <SelectTrigger id="categoryColor" className="rounded-lg h-11">
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  {colorOptions.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full bg-category-${color.value}`}></div>
                        {color.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categoryIcon" className="text-base font-medium">Icon</Label>
              <Select onValueChange={setCategoryIcon} defaultValue={categoryIcon}>
                <SelectTrigger id="categoryIcon" className="rounded-lg h-11">
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  {iconOptions.map((icon) => (
                    <SelectItem key={icon.value} value={icon.value}>
                      <div className="flex items-center gap-2">
                        <Folder className="h-4 w-4" />
                        {icon.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter className="mt-8">
            <Button variant="outline" onClick={onClose} className="rounded-lg">
              Cancel
            </Button>
            <Button onClick={onSubmit} className="rounded-lg">
              {submitLabel}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface DeleteCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  categoryName: string | null;
}

export const DeleteCategoryDialog: React.FC<DeleteCategoryDialogProps> = ({
  isOpen,
  onClose,
  onDelete,
  categoryName
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
              <DialogTitle className="text-2xl">Delete Category</DialogTitle>
            </div>
          </DialogHeader>
        </div>
        <div className="p-6">
          <DialogDescription className="py-4 text-lg">
            Are you sure you want to delete the category "{categoryName}"? This action cannot be undone.
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
