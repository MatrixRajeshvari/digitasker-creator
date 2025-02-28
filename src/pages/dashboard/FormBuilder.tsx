
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
  Sparkles
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
            <Label>Options</Label>
            {element.options?.map((option, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input 
                  value={option}
                  onChange={e => {
                    const newOptions = [...(element.options || [])];
                    newOptions[index] = e.target.value;
                    updateElement(element.id, { options: newOptions });
                  }}
                />
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    const newOptions = [...(element.options || [])];
                    newOptions.splice(index, 1);
                    updateElement(element.id, { options: newOptions });
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const newOptions = [...(element.options || []), `Option ${(element.options?.length || 0) + 1}`];
                updateElement(element.id, { options: newOptions });
              }}
            >
              <PlusCircle className="mr-2 h-3 w-3" />
              Add Option
            </Button>
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
        
        <div className="pt-4">
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
      {/* Header with improved design */}
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

      {/* Tabs with improved styling */}
      <Tabs defaultValue="builder" className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-6 p-1 bg-muted/60">
          <TabsTrigger value="builder" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <FileText className="mr-2 h-4 w-4" />
            Form Builder
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <SettingsIcon className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="theme" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
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
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium">Elements</CardTitle>
                    <CardDescription>Add elements to your form</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-2">
                    {elementTypeOptions.map(type => (
                      <Button
                        key={type.value}
                        variant="outline"
                        className="flex flex-col h-auto py-4 justify-center items-center gap-2 hover:bg-accent/50 hover:border-primary/50 transition-all"
                        onClick={() => addElement(type.value)}
                      >
                        <span className="flex items-center justify-center h-8 w-8 rounded-md bg-primary/10 text-primary">
                          {elementIcons[type.value]}
                        </span>
                        <span className="text-xs">{type.label}</span>
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                {/* Element properties */}
                {selectedElement && (
                  <Card className="border shadow-sm animate-in fade-in duration-300">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-medium">Properties</CardTitle>
                      <CardDescription>Edit the selected element</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ElementPropertyEditor />
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
            
            {/* Form Preview with improved styling */}
            <div className={`bg-card border rounded-md shadow-sm lg:col-span-${previewMode ? 12 : 6} p-6 relative ${previewMode ? 'animate-in fade-in zoom-in-95' : ''}`}>
              {previewMode && (
                <div className="absolute top-3 right-3 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium flex items-center">
                  <Eye className="h-3 w-3 mr-1.5" />
                  Preview Mode
                </div>
              )}
              
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
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Choose an element type</DialogTitle>
                          <DialogDescription>
                            Select the type of element you want to add to your form.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-3 gap-3 py-4">
                          {elementTypeOptions.map(type => (
                            <Button
                              key={type.value}
                              variant="outline"
                              className="flex flex-col h-auto py-4 justify-center items-center gap-2 hover:bg-accent/50 hover:border-primary/50 transition-all"
                              onClick={() => {
                                addElement(type.value);
                                // Close the dialog
                                document.body.click();
                              }}
                            >
                              <span className="flex items-center justify-center h-8 w-8 rounded-md bg-primary/10 text-primary">
                                {elementIcons[type.value]}
                              </span>
                              <span className="text-xs">{type.label}</span>
                            </Button>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {formData.elements.map((element, index) => (
                    <div 
                      key={element.id}
                      className={`p-4 rounded-md transition-all ${
                        selectedElement === element.id && !previewMode 
                          ? 'ring-2 ring-primary/70 bg-accent/20' 
                          : ''
                      } ${
                        !previewMode ? 'cursor-pointer hover:bg-accent/10 border border-transparent hover:border-accent' : ''
                      }`}
                      onClick={() => selectElement(element.id)}
                      draggable={!previewMode}
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={e => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                    >
                      {!previewMode && (
                        <div className="flex justify-between items-center mb-3 py-1.5 px-3 rounded bg-muted/80 text-muted-foreground">
                          <div className="flex items-center text-xs">
                            <GripVertical className="h-4 w-4 cursor-grab mr-2 text-muted-foreground/60" />
                            <span className="font-medium">
                              {element.type.charAt(0).toUpperCase() + element.type.slice(1)}
                            </span>
                            {element.required && (
                              <div className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-800 rounded-sm text-[10px] font-medium">
                                Required
                              </div>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={e => {
                                      e.stopPropagation();
                                      const elementIndex = formData.elements.findIndex(el => el.id === element.id);
                                      if (elementIndex > 0) {
                                        const newElements = [...formData.elements];
                                        const temp = newElements[elementIndex];
                                        newElements[elementIndex] = newElements[elementIndex - 1];
                                        newElements[elementIndex - 1] = temp;
                                        setFormData(prev => ({ ...prev, elements: newElements }));
                                      }
                                    }}
                                    disabled={index === 0}
                                  >
                                    <ArrowLeft className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                  <p>Move up</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={e => {
                                      e.stopPropagation();
                                      deleteElement(element.id);
                                    }}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                  <p>Delete element</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={e => {
                                      e.stopPropagation();
                                      const newElement = { ...element, id: generateId() };
                                      setFormData(prev => ({
                                        ...prev,
                                        elements: [...prev.elements, newElement]
                                      }));
                                    }}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                  <p>Duplicate element</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      )}
                      {renderElementPreview(element)}
                    </div>
                  ))}

                  {/* Add Element Button */}
                  {!previewMode && (
                    <Button 
                      variant="outline" 
                      className="w-full py-6 border-dashed border-primary/30 hover:border-primary/70 hover:bg-primary/5 transition-all"
                      onClick={() => setSelectedElement(null)}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Element
                    </Button>
                  )}

                  {/* Submit Button Preview */}
                  {previewMode && (
                    <Button className="mt-8 px-8 bg-primary hover:bg-primary/90" disabled={!previewMode}>
                      Submit Form
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Form Summary Panel */}
            {!previewMode && (
              <div className="lg:col-span-3">
                <Card className="border shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium">Form Overview</CardTitle>
                    <CardDescription>Summary and preview options</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="bg-accent/10 p-4 flex flex-col items-center">
                      <Button 
                        onClick={() => setPreviewMode(true)} 
                        variant="outline" 
                        className="mb-2 w-full flex items-center justify-center"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Preview Form
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        See how your form will appear to users
                      </p>
                    </div>
                    
                    <div className="p-4 border-t">
                      <h3 className="font-medium mb-3 text-sm">Form Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center py-2 px-3 rounded-md bg-accent/10">
                          <span className="text-muted-foreground">Form Title:</span>
                          <span className="font-medium truncate max-w-[150px]">{formData.title || "Untitled Form"}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 px-3 rounded-md bg-accent/10">
                          <span className="text-muted-foreground">Elements:</span>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{formData.elements.length}</span>
                            <span className="text-xs text-muted-foreground">
                              ({formData.elements.filter(el => el.required).length} required)
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center py-2 px-3 rounded-md bg-accent/10">
                          <span className="text-muted-foreground">Status:</span>
                          <span className="font-medium capitalize inline-flex items-center">
                            <span className={`h-2 w-2 rounded-full mr-1.5 ${
                              formData.status === 'active' ? 'bg-green-500' : 
                              formData.status === 'draft' ? 'bg-yellow-500' : 'bg-gray-500'
                            }`}></span>
                            {formData.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/30 py-4 flex-col items-stretch gap-2">
                    <div className="text-center text-sm text-muted-foreground mb-2">
                      Form completion checklist
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm bg-white rounded-md p-2 shadow-sm">
                        <div className={`flex items-center justify-center h-5 w-5 rounded-full ${formData.title ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                          {formData.title ? <Check className="h-3.5 w-3.5" /> : "1"}
                        </div>
                        <div className="flex-1 text-left">
                          <span className={formData.title ? 'text-green-700 font-medium' : ''}>Form title</span>
                          {!formData.title && <span className="ml-1 text-muted-foreground">(required)</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm bg-white rounded-md p-2 shadow-sm">
                        <div className={`flex items-center justify-center h-5 w-5 rounded-full ${formData.elements.length > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                          {formData.elements.length > 0 ? <Check className="h-3.5 w-3.5" /> : "2"}
                        </div>
                        <div className="flex-1 text-left">
                          <span className={formData.elements.length > 0 ? 'text-green-700 font-medium' : ''}>Add elements</span>
                          {!formData.elements.length && <span className="ml-1 text-muted-foreground">(at least one)</span>}
                        </div>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-0">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle>Form Settings</CardTitle>
                <CardDescription>Configure your form's basic settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="form-status">Form Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: 'draft' | 'active' | 'archived') => updateFormMetadata('status', value)}
                  >
                    <SelectTrigger id="form-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                          Draft
                        </div>
                      </SelectItem>
                      <SelectItem value="active">
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                          Active
                        </div>
                      </SelectItem>
                      <SelectItem value="archived">
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-gray-500 mr-2"></div>
                          Archived
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Only active forms can receive submissions
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="form-title">Form Title</Label>
                  <Input 
                    id="form-title"
                    value={formData.title}
                    onChange={e => updateFormMetadata('title', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    A clear title helps users understand the purpose of your form
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="form-description">Form Description</Label>
                  <textarea 
                    id="form-description"
                    value={formData.description}
                    onChange={e => updateFormMetadata('description', e.target.value)}
                    className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Provide additional context or instructions for form respondents
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle>Submission Settings</CardTitle>
                <CardDescription>Customize what happens after form submission</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="success-message">Success Message</Label>
                  <textarea 
                    id="success-message"
                    className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Thank you for your submission!"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Message shown to users after successfully submitting the form
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="redirect-url">Redirect URL (Optional)</Label>
                  <Input 
                    id="redirect-url"
                    type="url"
                    placeholder="https://example.com/thank-you"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Redirect users to a specific page after form submission
                  </p>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-accent/20 rounded-md">
                  <input 
                    type="checkbox"
                    id="email-notifications"
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <div>
                    <Label htmlFor="email-notifications" className="font-medium">Enable email notifications</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Get notified via email when someone submits this form
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-accent/20 rounded-md">
                  <input 
                    type="checkbox"
                    id="limit-submissions"
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <div>
                    <Label htmlFor="limit-submissions" className="font-medium">Limit submissions</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Set a maximum number of form submissions
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end pt-2">
                <Button onClick={() => saveForm()} disabled={loading} size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Theme Tab */}
        <TabsContent value="theme" className="mt-0">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle>Form Appearance</CardTitle>
              <CardDescription>Customize the visual style of your form</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                <div className="space-y-3">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="relative">
                      <Button variant="outline" className="h-20 w-full bg-background flex flex-col items-center justify-center gap-2 hover:border-primary/50">
                        <span className="text-xs font-normal">Light</span>
                        <div className="h-2 w-2 rounded-full bg-green-500 absolute top-2 right-2"></div>
                      </Button>
                    </div>
                    <Button variant="outline" className="h-20 w-full bg-slate-900 text-white flex flex-col items-center justify-center gap-2 hover:border-primary/50">
                      <span className="text-xs font-normal">Dark</span>
                    </Button>
                    <Button variant="outline" className="h-20 w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex flex-col items-center justify-center gap-2 hover:border-primary/50">
                      <span className="text-xs font-normal">Custom</span>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Select the color theme for your form
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Label>Font Style</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <Button variant="outline" className="h-20 w-full font-sans flex flex-col items-center justify-center gap-2 hover:border-primary/50">
                      <span className="text-lg">Aa</span>
                      <span className="text-xs font-normal">Sans</span>
                    </Button>
                    <Button variant="outline" className="h-20 w-full font-serif flex flex-col items-center justify-center gap-2 hover:border-primary/50">
                      <span className="text-lg">Aa</span>
                      <span className="text-xs font-normal">Serif</span>
                    </Button>
                    <Button variant="outline" className="h-20 w-full font-mono flex flex-col items-center justify-center gap-2 hover:border-primary/50">
                      <span className="text-lg">Aa</span>
                      <span className="text-xs font-normal">Mono</span>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Choose a font style that matches your brand
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Label>Primary Color</Label>
                  <div className="grid grid-cols-6 gap-2">
                    <div className="h-10 w-full bg-blue-500 rounded-md cursor-pointer ring-2 ring-offset-2 ring-blue-500"></div>
                    <div className="h-10 w-full bg-purple-500 rounded-md cursor-pointer"></div>
                    <div className="h-10 w-full bg-pink-500 rounded-md cursor-pointer"></div>
                    <div className="h-10 w-full bg-orange-500 rounded-md cursor-pointer"></div>
                    <div className="h-10 w-full bg-green-500 rounded-md cursor-pointer"></div>
                    <div className="h-10 w-full bg-slate-700 rounded-md cursor-pointer"></div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This affects buttons, active elements and accents
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Label>Border Style</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <Button variant="outline" className="h-16 w-full flex flex-col items-center justify-center gap-1 hover:border-primary/50">
                      <div className="h-6 w-10 border rounded-md"></div>
                      <span className="text-xs font-normal">Square</span>
                    </Button>
                    <Button variant="outline" className="h-16 w-full flex flex-col items-center justify-center gap-1 hover:border-primary/50">
                      <div className="h-6 w-10 border rounded-lg"></div>
                      <span className="text-xs font-normal">Rounded</span>
                    </Button>
                    <Button variant="outline" className="h-16 w-full flex flex-col items-center justify-center gap-1 hover:border-primary/50">
                      <div className="h-6 w-10 border rounded-xl"></div>
                      <span className="text-xs font-normal">Pill</span>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Choose the border style for form elements
                  </p>
                </div>
              </div>
              
              <div className="mt-8 bg-accent/10 p-4 rounded-md flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="text-sm font-medium">Coming Soon</h3>
                  <p className="text-xs text-muted-foreground">
                    More advanced appearance settings will be available in a future update.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end pt-2">
              <Button onClick={() => toast({ title: "Settings saved", description: "Theme settings have been saved successfully." })} size="sm">
                <Save className="mr-2 h-4 w-4" />
                Save Theme
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormBuilder;
