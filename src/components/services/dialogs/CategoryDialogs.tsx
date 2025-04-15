import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Folder, FolderPlus, PencilRuler, Trash2, Database, Activity, FileEdit, ClipboardList, Globe,
  Cloud, Brain, Code, Settings, BarChart, ShoppingCart, Share2, ZapOff, Zap, FileText, Heart,
  ChartPie, ChartLine, ArrowUpDown, Boxes, CreditCard, CircleDollarSign, LucideIcon, Mail, MessageSquare
} from 'lucide-react';

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

  const availableColors = [
    { name: 'Red', value: '#FF5733' },
    { name: 'Blue', value: '#337AFF' },
    { name: 'Green', value: '#33FF57' },
    { name: 'Purple', value: '#8733FF' },
    { name: 'Yellow', value: '#FFD133' },
    { name: 'Cyan', value: '#33FFF5' },
    { name: 'Pink', value: '#FF33E6' },
    { name: 'Orange', value: '#FF8C33' },
    { name: 'Teal', value: '#33FFB8' },
    { name: 'Lavender', value: '#D133FF' },
  ];

  const IconComponent = ({ iconName }: { iconName: string }) => {
    switch (iconName) {
      case 'database': return <Database className="h-4 w-4" />;
      case 'activity': return <Activity className="h-4 w-4" />;
      case 'file-edit': return <FileEdit className="h-4 w-4" />;
      case 'clipboard-list': return <ClipboardList className="h-4 w-4" />;
      case 'globe': return <Globe className="h-4 w-4" />;
      case 'cloud': return <Cloud className="h-4 w-4" />;
      case 'brain': return <Brain className="h-4 w-4" />;
      case 'code': return <Code className="h-4 w-4" />;
      case 'settings': return <Settings className="h-4 w-4" />;
      case 'chart-pie': return <ChartPie className="h-4 w-4" />;
      case 'chart-line': return <ChartLine className="h-4 w-4" />;
      case 'bar-chart': return <BarChart className="h-4 w-4" />;
      case 'shopping-cart': return <ShoppingCart className="h-4 w-4" />;
      case 'share': return <Share2 className="h-4 w-4" />;
      case 'zap': return <Zap className="h-4 w-4" />;
      case 'zap-off': return <ZapOff className="h-4 w-4" />;
      case 'file-text': return <FileText className="h-4 w-4" />;
      case 'heart': return <Heart className="h-4 w-4" />;
      case 'folder': return <Folder className="h-4 w-4" />;
      case 'arrow-up-down': return <ArrowUpDown className="h-4 w-4" />;
      case 'boxes': return <Boxes className="h-4 w-4" />;
      case 'credit-card': return <CreditCard className="h-4 w-4" />;
      case 'circle-dollar-sign': return <CircleDollarSign className="h-4 w-4" />;
      case 'mail': return <Mail className="h-4 w-4" />;
      case 'message-square': return <MessageSquare className="h-4 w-4" />;
      default: return <Folder className="h-4 w-4" />;
    }
  };

  const extendedIconOptions = [
    { name: 'Database', value: 'database' },
    { name: 'Activity', value: 'activity' },
    { name: 'File Edit', value: 'file-edit' },
    { name: 'Clipboard', value: 'clipboard-list' },
    { name: 'Globe', value: 'globe' },
    { name: 'Cloud', value: 'cloud' },
    { name: 'Brain', value: 'brain' },
    { name: 'Code', value: 'code' },
    { name: 'Settings', value: 'settings' },
    { name: 'Chart Pie', value: 'chart-pie' },
    { name: 'Chart Line', value: 'chart-line' },
    { name: 'Bar Chart', value: 'bar-chart' },
    { name: 'Shopping Cart', value: 'shopping-cart' },
    { name: 'Share', value: 'share' },
    { name: 'Zap', value: 'zap' },
    { name: 'Zap Off', value: 'zap-off' },
    { name: 'File Text', value: 'file-text' },
    { name: 'Heart', value: 'heart' },
    { name: 'Folder', value: 'folder' },
    { name: 'Arrow Up Down', value: 'arrow-up-down' },
    { name: 'Boxes', value: 'boxes' },
    { name: 'Credit Card', value: 'credit-card' },
    { name: 'Circle Dollar Sign', value: 'circle-dollar-sign' },
    { name: 'Mail', value: 'mail' },
    { name: 'Message Square', value: 'message-square' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-xl border-none shadow-xl">
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
        <div className="p-6 bg-white">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="categoryName" className="text-base font-medium">Category Name</Label>
              <Input
                id="categoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter category name"
                className="rounded-lg h-11 border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categoryColor" className="text-base font-medium">Color</Label>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {availableColors.map((color) => (
                  <div 
                    key={color.value}
                    className={`h-8 w-8 rounded-full cursor-pointer transition-all hover:scale-110 ${categoryColor === color.value ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setCategoryColor(color.value)}
                    title={color.name}
                  />
                ))}
              </div>
              <Input
                type="color"
                value={categoryColor}
                onChange={(e) => setCategoryColor(e.target.value)}
                className="w-full h-11 mt-2 cursor-pointer border-gray-300 rounded-lg"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categoryIcon" className="text-base font-medium">Icon</Label>
              <Select onValueChange={setCategoryIcon} defaultValue={categoryIcon}>
                <SelectTrigger id="categoryIcon" className="rounded-lg h-11 border-gray-300">
                  <SelectValue placeholder="Select an icon">
                    {categoryIcon && (
                      <div className="flex items-center gap-2">
                        <IconComponent iconName={categoryIcon} />
                        <span>{extendedIconOptions.find(i => i.value === categoryIcon)?.name || 'Icon'}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-lg max-h-[300px] bg-white shadow-lg border-none">
                  {extendedIconOptions.map((icon) => (
                    <SelectItem key={icon.value} value={icon.value}>
                      <div className="flex items-center gap-2">
                        <IconComponent iconName={icon.value} />
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
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-xl border-none shadow-xl">
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
        <div className="p-6 bg-white">
          <DialogDescription className="py-4 text-lg text-gray-700">
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
