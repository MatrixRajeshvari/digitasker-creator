import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FileText, 
  PlusCircle, 
  Save, 
  Trash2, 
  ArrowLeft,
  GripVertical,
  Settings as SettingsIcon,
  Eye,
  Copy,
  X,
  Check,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Move
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define the types for our form elements
type FormElementType = 'text' | 'number' | 'email' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'time' | 'file' | 'heading' | 'paragraph';

interface FormElement {
  id: string;
  type: FormElementType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select, checkbox, radio
  description?: string;
}

interface FormData {
  id?: string;
  title: string;
  description: string;
  elements: FormElement[];
  status: 'draft' | 'active' | 'archived';
}

// Default form data
const defaultFormData: FormData = {
  title: "Untitled Form",
  description: "",
  elements: [],
  status: 'draft'
};

// Helper function to generate unique IDs
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

// Element icon mapping
const elementIcons: Record<FormElementType, React.ReactNode> = {
  text: <FileText className="h-5 w-5" />,
  number: <span className="text-lg font-semibold">123</span>,
  email: <span className="text-lg">@</span>,
  textarea: <FileText className="h-5 w-5" />,
  select: <span className="text-lg">▼</span>,
  checkbox: <span className="text-lg">☑</span>,
  radio: <span className="text-lg">○</span>,
  date: <span className="text-lg">📅</span>,
  time: <span className="text-lg">⏰</span>,
  file: <span className="text-lg">📎</span>,
  heading: <span className="text-lg font-bold">H</span>,
  paragraph: <span className="text-lg">¶</span>,
};

const FormBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  // Fetch form data if editing an existing form
  useEffect(() => {
    if (id) {
      setLoading(true);
      // This would be an API call in a real app
      setTimeout(() => {
        // Mock data for demonstration
        const mockForm: FormData = {
          id,
          title: "Sample Feedback Form",
          description: "Please provide your feedback about our services",
          elements: [
            {
              id: generateId(),
              type: "text",
              label: "Full Name",
              placeholder: "Enter your full name",
              required: true,
              description: "Please enter your full name as it appears on your ID"
            },
            {
              id: generateId(),
              type: "email",
              label: "Email Address",
              placeholder: "your@email.com",
              required: true
            },
            {
              id: generateId(),
              type: "select",
              label: "How did you hear about us?",
              required: false,
              options: ["Social Media", "Friend/Family", "Advertisement", "Search Engine", "Other"]
            },
            {
              id: generateId(),
              type: "textarea",
              label: "Your Feedback",
              placeholder: "Please provide your feedback...",
              required: true
            }
          ],
          status: "active"
        };
        
        setFormData(mockForm);
        setLoading(false);
      }, 800);
    }
  }, [id]);

  // Update form metadata
  const updateFormMetadata = (key: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Add a new element
  const addElement = (type: FormElementType) => {
    const newElement: FormElement = {
      id: generateId(),
      type,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      placeholder: type === 'heading' || type === 'paragraph' ? undefined : 'Enter value...',
      required: false
    };

    // Add default options for select, checkbox, radio
    if (type === 'select' || type === 'checkbox' || type === 'radio') {
      newElement.options = ['Option 1', 'Option 2', 'Option 3'];
    }

    setFormData(prev => ({
      ...prev,
      elements: [...prev.elements, newElement]
    }));

    setSelectedElement(newElement.id);

    toast({
      title: "Element added",
      description: `${type} element has been added to your form.`
    });
  };

  // Update element properties
  const updateElement = (elementId: string, updates: Partial<FormElement>) => {
    setFormData(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === elementId ? { ...el, ...updates } : el
      )
    }));
  };

  // Delete an element
  const deleteElement = (elementId: string) => {
    setFormData(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== elementId)
    }));

    if (selectedElement === elementId) {
      setSelectedElement(null);
    }

    toast({
      title: "Element deleted",
      description: "The element has been removed from your form."
    });
  };

  // Handle element selection
  const selectElement = (elementId: string) => {
    if (!previewMode) {
      setSelectedElement(elementId === selectedElement ? null : elementId);
    }
  };

  // Handle element reordering
  const handleDragStart = (index: number) => {
    setIsDragging(true);
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    
    if (draggedIndex !== index) {
      const newElements = [...formData.elements];
      const draggedElement = newElements[draggedIndex];
      
      // Remove the dragged element
      newElements.splice(draggedIndex, 1);
      // Insert it at the new position
      newElements.splice(index, 0, draggedElement);
      
      setFormData(prev => ({
        ...prev,
        elements: newElements
      }));
      
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedIndex(null);
  };

  // Move element up or down
  const moveElement = (elementId: string, direction: 'up' | 'down') => {
    const elementIndex = formData.elements.findIndex(el => el.id === elementId);
    if (
      (direction === 'up' && elementIndex === 0) || 
      (direction === 'down' && elementIndex === formData.elements.length - 1)
    ) {
      return;
    }

    const newElements = [...formData.elements];
    const targetIndex = direction === 'up' ? elementIndex - 1 : elementIndex + 1;
    
    // Swap the elements
    [newElements[elementIndex], newElements[targetIndex]] = 
    [newElements[targetIndex], newElements[elementIndex]];
    
    setFormData(prev => ({ ...prev, elements: newElements }));
  };

  // Save the form
  const saveForm = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Form title is required.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    // This would be an API call in a real app
    setTimeout(() => {
      setLoading(false);
      
      toast({
        title: "Form saved",
        description: id 
          ? "Your form has been updated successfully." 
          : "Your form has been created successfully."
      });

      // Navigate back to forms list
      navigate("/dashboard/forms");
    }, 1000);
  };

  // Element type option list for adding new elements
  const elementTypeOptions: { value: FormElementType; label: string }[] = [
    { value: 'text', label: 'Text Field' },
    { value: 'number', label: 'Number Field' },
    { value: 'email', label: 'Email Field' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'select', label: 'Dropdown' },
    { value: 'checkbox', label: 'Checkboxes' },
    { value: 'radio', label: 'Radio Buttons' },
    { value: 'date', label: 'Date Picker' },
    { value: 'time', label: 'Time Picker' },
    { value: 'file', label: 'File Upload' },
    { value: 'heading', label: 'Heading' },
    { value: 'paragraph', label: 'Paragraph' }
  ];

  // Group element types by category
  const groupedElementTypes = {
    basicInputs: elementTypeOptions.filter(type => 
      ['text', 'number', 'email', 'textarea'].includes(type.value)),
    selectionInputs: elementTypeOptions.filter(type => 
      ['select', 'checkbox', 'radio'].includes(type.value)),
    specializedInputs: elementTypeOptions.filter(type => 
      ['date', 'time', 'file'].includes(type.value)),
    layoutElements: elementTypeOptions.filter(type => 
      ['heading', 'paragraph'].includes(type.value))
  };

  // Render a preview of an element based on its type
  const renderElementPreview = (element: FormElement) => {
    const isSelected = selectedElement === element.id;
    
    switch (element.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <div className="space-y-2">
            <Label>{element.label} {element.required && <span className="text-destructive">*</span>}</Label>
            <Input 
              type={element.type} 
              placeholder={element.placeholder} 
              disabled={previewMode ? false : true}
            />
            {element.description && (
              <p className="text-sm text-muted-foreground">{element.description}</p>
            )}
          </div>
        );
      
      case 'textarea':
        return (
          <div className="space-y-2">
            <Label>{element.label} {element.required && <span className="text-destructive">*</span>}</Label>
            <textarea 
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={element.placeholder}
              disabled={previewMode ? false : true}
            />
            {element.description && (
              <p className="text-sm text-muted-foreground">{element.description}</p>
            )}
          </div>
        );
      
      case 'select':
        return (
          <div className="space-y-2">
            <Label>{element.label} {element.required && <span className="text-destructive">*</span>}</Label>
            <Select disabled={!previewMode}>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {element.options?.map((option, index) => (
                  <SelectItem key={index} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {element.description && (
              <p className="text-sm text-muted-foreground">{element.description}</p>
            )}
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="space-y-2">
            <Label>{element.label} {element.required && <span className="text-destructive">*</span>}</Label>
            <div className="space-y-2">
              {element.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id={`${element.id}-${index}`} 
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    disabled={previewMode ? false : true}
                  />
                  <label htmlFor={`${element.id}-${index}`} className="text-sm">{option}</label>
                </div>
              ))}
            </div>
            {element.description && (
              <p className="text-sm text-muted-foreground">{element.description}</p>
            )}
          </div>
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            <Label>{element.label} {element.required && <span className="text-destructive">*</span>}</Label>
            <div className="space-y-2">
              {element.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id={`${element.id}-${index}`} 
                    name={element.id}
                    className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                    disabled={previewMode ? false : true}
                  />
                  <label htmlFor={`${element.id}-${index}`} className="text-sm">{option}</label>
                </div>
              ))}
            </div>
            {element.description && (
              <p className="text-sm text-muted-foreground">{element.description}</p>
            )}
          </div>
        );
      
      case 'date':
        return (
          <div className="space-y-2">
            <Label>{element.label} {element.required && <span className="text-destructive">*</span>}</Label>
            <Input 
              type="date" 
              disabled={previewMode ? false : true}
            />
            {element.description && (
              <p className="text-sm text-muted-foreground">{element.description}</p>
            )}
          </div>
        );
      
      case 'time':
        return (
          <div className="space-y-2">
            <Label>{element.label} {element.required && <span className="text-destructive">*</span>}</Label>
            <Input 
              type="time" 
              disabled={previewMode ? false : true}
            />
            {element.description && (
              <p className="text-sm text-muted-foreground">{element.description}</p>
            )}
          </div>
        );
      
      case 'file':
        return (
          <div className="space-y-2">
            <Label>{element.label} {element.required && <span className="text-destructive">*</span>}</Label>
            <Input 
              type="file" 
              disabled={previewMode ? false : true}
            />
            {element.description && (
              <p className="text-sm text-muted-foreground">{element.description}</p>
            )}
          </div>
        );
      
      case 'heading':
        return (
          <h2 className="text-2xl font-bold">{element.label}</h2>
        );
      
      case 'paragraph':
        return (
          <p className="text-muted-foreground">{element.label}</p>
        );
      
      default:
        return null;
    }
  };

  // Element property editor
  const ElementPropertyEditor = () => {
    if (!selectedElement) return null;
    
    const element = formData.elements.find(el => el.id === selectedElement);
    if (!element) return null;
    
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="element-label">Label</Label>
          <Input 
            id="element-label"
            value={element.label}
            onChange={e => updateElement(element.id, { label: e.target.value })}
          />
        </div>
        
        {(element.type !== 'heading' && element.type !== 'paragraph') && (
          <div className="space-y-2">
            <Label htmlFor="element-placeholder">Placeholder</Label>
            <Input 
              id="element-placeholder"
              value={element.placeholder || ''}
              onChange={e => updateElement(element.id, { placeholder: e.target.value })}
            />
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="element-description">Help Text</Label>
          <Input 
            id="element-description"
            value={element.description || ''}
            onChange={e => updateElement(element.id, { description: e.target.value })}
          />
        </div>
        
        {(['select', 'checkbox', 'radio'].includes(element.type)) && (
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <Label>Options</Label>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const newOptions = [...(element.options || []), `Option ${(element.options?.length || 0) + 1}`];
                  updateElement(element.id, { options: newOptions });
                }}
                className="h-7 px-2 text-xs"
              >
                <PlusCircle className="mr-1 h-3 w-3" />
                Add Option
              </Button>
            </div>
            <div className="max-h-[200px] overflow-y-auto space-y-2 p-1">
              {element.options?.map((option, index) => (
                <div key={index} className="flex gap-2 rounded-md border p-1 bg-background">
                  <Input 
                    value={option}
                    onChange={e => {
                      const newOptions = [...(element.options || [])];
                      newOptions[index] = e.target.value;
                      updateElement(element.id, { options: newOptions });
                    }}
                    className="h-8 text-sm"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      const newOptions = [...(element.options || [])];
                      newOptions.splice(index, 1);
                      updateElement(element.id, { options: newOptions });
                    }}
                    className="h-8 w-8"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {(element.type !== 'heading' && element.type !== 'paragraph') && (
          <div className="flex items-center space-x-2 pt-1">
            <input 
              type="checkbox"
              id="element-required"
              checked={element.required}
              onChange={e => updateElement(element.id, { required: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="element-required">Required field</Label>
          </div>
        )}
        
        <div className="pt-4 space-y-2">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => moveElement(element.id, 'up')}
              className="flex-1 text-sm"
              disabled={formData.elements.findIndex(el => el.id === element.id) === 0}
            >
              <ChevronUp className="mr-1 h-4 w-4" />
              Move Up
            </Button>
            <Button 
              variant="outline" 
              onClick={() => moveElement(element.id, 'down')}
              className="flex-1 text-sm"
              disabled={formData.elements.findIndex(el => el.id === element.id) === formData.elements.length - 1}
            >
              <ChevronDown className="mr-1 h-4 w-4" />
              Move Down
            </Button>
          </div>
          <Button 
            variant="destructive" 
            onClick={() => deleteElement(element.id)}
            className="w-full"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Element
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate("/dashboard/forms")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Create New Form
            </h1>
            <p className="text-sm text-muted-foreground">Design your form by adding and configuring elements</p>
          </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button 
            variant={previewMode ? "default" : "outline"} 
            className="flex-1 sm:flex-none"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button 
            className="flex-1 sm:flex-none bg-primary hover:bg-primary/90"
            onClick={saveForm} 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">◌</span>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Form
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="builder" className="w-full">
        <TabsList className="w-full max-w-md mx-auto mb-8 p-1 bg-muted/60">
          <TabsTrigger value="builder" className="flex-1 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <FileText className="mr-2 h-4 w-4" />
            Form Builder
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex-1 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <SettingsIcon className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="theme" className="flex-1 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Sparkles className="mr-2 h-4 w-4" />
            Theme
          </TabsTrigger>
        </TabsList>

        {/* Builder Tab */}
        <TabsContent value="builder" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form Elements Panel */}
            {!previewMode && (
              <div className="lg:col-span-3 space-y-4">
                <Card className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Form Elements</CardTitle>
                    <CardDescription>Add elements to build your form</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {/* Basic Inputs */}
                    <div className="mb-4">
                      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Basic Inputs</h3>
                      <div className="grid grid-cols-2 gap-1.5">
                        {groupedElementTypes.basicInputs.map(type => (
                          <Button
                            key={type.value}
                            variant="outline"
                            className="flex flex-col h-auto py-3 justify-center items-center gap-1.5 hover:bg-accent/50 hover:border-primary/30 transition-all"
                            onClick={() => addElement(type.value)}
                          >
                            <span className="flex items-center justify-center h-7 w-7 rounded-md bg-primary/10 text-primary">
                              {elementIcons[type.value]}
                            </span>
                            <span className="text-xs">{type.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Selection Inputs */}
                    <div className="mb-4">
                      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Selection Inputs</h3>
                      <div className="grid grid-cols-2 gap-1.5">
                        {groupedElementTypes.selectionInputs.map(type => (
                          <Button
                            key={type.value}
                            variant="outline"
                            className="flex flex-col h-auto py-3 justify-center items-center gap-1.5 hover:bg-accent/50 hover:border-primary/30 transition-all"
                            onClick={() => addElement(type.value)}
                          >
                            <span className="flex items-center justify-center h-7 w-7 rounded-md bg-primary/10 text-primary">
                              {elementIcons[type.value]}
                            </span>
                            <span className="text-xs">{type.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Specialized Inputs */}
                    <div className="mb-4">
                      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Specialized Inputs</h3>
                      <div className="grid grid-cols-2 gap-1.5">
                        {groupedElementTypes.specializedInputs.map(type => (
                          <Button
                            key={type.value}
                            variant="outline"
                            className="flex flex-col h-auto py-3 justify-center items-center gap-1.5 hover:bg-accent/50 hover:border-primary/30 transition-all"
                            onClick={() => addElement(type.value)}
                          >
                            <span className="flex items-center justify-center h-7 w-7 rounded-md bg-primary/10 text-primary">
                              {elementIcons[type.value]}
                            </span>
                            <span className="text-xs">{type.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Layout Elements */}
                    <div>
                      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Layout Elements</h3>
                      <div className="grid grid-cols-2 gap-1.5">
                        {groupedElementTypes.layoutElements.map(type => (
                          <Button
                            key={type.value}
                            variant="outline"
                            className="flex flex-col h-auto py-3 justify-center items-center gap-1.5 hover:bg-accent/50 hover:border-primary/30 transition-all"
                            onClick={() => addElement(type.value)}
                          >
                            <span className="flex items-center justify-center h-7 w-7 rounded-md bg-primary/10 text-primary">
                              {elementIcons[type.value]}
                            </span>
                            <span className="text-xs">{type.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Element properties */}
                {selectedElement && (
                  <Card className="border shadow-sm sticky top-4 animate-in fade-in duration-300">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium">Element Properties</CardTitle>
                      <CardDescription>
                        {formData.elements.find(el => el.id === selectedElement)?.type.charAt(0).toUpperCase() + 
                         formData.elements.find(el => el.id === selectedElement)?.type.slice(1)} element settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ElementPropertyEditor />
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
            
            {/* Form Preview */}
            <div className={`bg-card border rounded-md shadow-sm lg:col-span-${previewMode ? 12 : 6} relative ${previewMode ? 'animate-in fade-in zoom-in-95' : ''}`}>
              {previewMode && (
                <div className="absolute top-3 right-3 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium flex items-center">
                  <Eye className="h-3 w-3 mr-1.5" />
                  Preview Mode
                </div>
              )}
              
              <div className="p-6">
                {/* Form Title & Description */}
                {!previewMode ? (
                  <div className="mb-8 space-y-4">
                    <Input
                      value={formData.title}
                      onChange={e => updateFormMetadata('title', e.target.value)}
                      className="text-2xl font-bold border-0 border-b rounded-none px-0 focus-visible:ring-0 pb-1"
                      placeholder="Form Title"
                    />
                    <Input
                      value={formData.description}
                      onChange={e => updateFormMetadata('description', e.target.value)}
                      className="border-0 border-b rounded-none px-0 focus-visible:ring-0 text-muted-foreground"
                      placeholder="Form Description (optional)"
                    />
                  </div>
                ) : (
                  <div className="mb-8 space-y-2 border-b pb-4">
                    <h1 className="text-2xl font-bold">{formData.title}</h1>
                    {formData.description && (
                      <p className="text-muted-foreground">{formData.description}</p>
                    )}
                  </div>
                )}

                {/* Form Elements */}
                {formData.elements.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed rounded-md bg-accent/5">
                    <div className="flex flex-col items-center">
                      <div className="mb-4 p-4 rounded-full bg-primary/10">
                        <PlusCircle className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">Add Your First Element</h3>
                      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                        Start building your form by adding elements from the sidebar
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="lg" className="bg-primary hover:bg-primary/90 px-8">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Element
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Choose an element type</DialogTitle>
                            <DialogDescription>
                              Select the type of element you want to add to your form.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            {/* Basic Inputs */}
                            <div className="mb-4">
                              <h3 className="text-sm font-medium mb-2">Basic Inputs</h3>
                              <div className="grid grid-cols-4 gap-2">
                                {groupedElementTypes.basicInputs.map(type => (
                                  <Button
                                    key={type.value}
                                    variant="outline"
                                    className="flex flex-col h-auto py-3 justify-center items-center gap-1.5 hover:bg-accent/50 hover:border-primary/30 transition-all"
