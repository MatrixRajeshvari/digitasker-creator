
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
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div className="space-y-4 p-4">
        <h3 className="text-lg font-medium">Edit Element Properties</h3>
        
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
              Add Option
            </Button>
          </div>
        )}
        
        {(element.type !== 'heading' && element.type !== 'paragraph') && (
          <div className="flex items-center space-x-2">
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate("/dashboard/forms")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {id ? "Edit Form" : "Create New Form"}
          </h1>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            variant={previewMode ? "default" : "outline"}
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="mr-2 h-4 w-4" />
            {previewMode ? "Exit Preview" : "Preview"}
          </Button>
          <Button onClick={saveForm} disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            Save Form
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="builder" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="builder">Form Builder</TabsTrigger>
          <TabsTrigger value="settings">Form Settings</TabsTrigger>
          <TabsTrigger value="theme">Theme & Style</TabsTrigger>
        </TabsList>

        {/* Builder Tab */}
        <TabsContent value="builder" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form Elements Panel */}
            {!previewMode && (
              <div className="lg:col-span-3 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Add Elements</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-2">
                    {elementTypeOptions.map(type => (
                      <Button
                        key={type.value}
                        variant="outline"
                        className="flex flex-col h-auto py-4 justify-center items-center gap-2"
                        onClick={() => addElement(type.value)}
                      >
                        <span>{elementIcons[type.value]}</span>
                        <span className="text-xs">{type.label}</span>
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                {/* Element properties */}
                {selectedElement && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Element Properties</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ElementPropertyEditor />
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
            
            {/* Form Preview */}
            <div className={`bg-card border rounded-md lg:col-span-${previewMode ? 12 : 6} p-6`}>
              {/* Form Title & Description */}
              {!previewMode ? (
                <div className="mb-6 space-y-4">
                  <Input
                    value={formData.title}
                    onChange={e => updateFormMetadata('title', e.target.value)}
                    className="text-2xl font-bold border-0 border-b rounded-none px-0 focus-visible:ring-0"
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
                <div className="mb-6 space-y-2">
                  <h1 className="text-2xl font-bold">{formData.title}</h1>
                  {formData.description && (
                    <p className="text-muted-foreground">{formData.description}</p>
                  )}
                </div>
              )}

              {/* Form Elements */}
              {formData.elements.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-md">
                  <p className="text-muted-foreground mb-4">
                    Your form is empty. Add some elements to get started!
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add First Element
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Choose an element type</DialogTitle>
                        <DialogDescription>
                          Select the type of element you want to add to your form.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-3 gap-2 py-4">
                        {elementTypeOptions.map(type => (
                          <Button
                            key={type.value}
                            variant="outline"
                            className="flex flex-col h-auto py-4 justify-center items-center gap-2"
                            onClick={() => {
                              addElement(type.value);
                              // Close the dialog
                              document.body.click();
                            }}
                          >
                            <span>{elementIcons[type.value]}</span>
                            <span className="text-xs">{type.label}</span>
                          </Button>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <div className="space-y-6">
                  {formData.elements.map((element, index) => (
                    <div 
                      key={element.id}
                      className={`p-4 rounded-md ${
                        selectedElement === element.id && !previewMode 
                          ? 'ring-2 ring-primary' 
                          : ''
                      } ${
                        !previewMode ? 'cursor-pointer hover:bg-accent/50' : ''
                      }`}
                      onClick={() => selectElement(element.id)}
                      draggable={!previewMode}
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={e => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                    >
                      {!previewMode && (
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center text-muted-foreground text-sm">
                            <GripVertical className="h-4 w-4 cursor-grab mr-2" />
                            {element.type.charAt(0).toUpperCase() + element.type.slice(1)}
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
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
                              <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={e => {
                                e.stopPropagation();
                                deleteElement(element.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={e => {
                                e.stopPropagation();
                                const newElement = { ...element, id: generateId() };
                                setFormData(prev => ({
                                  ...prev,
                                  elements: [...prev.elements, newElement]
                                }));
                              }}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
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
                      className="w-full py-6 border-dashed"
                      onClick={() => setSelectedElement(null)}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Element
                    </Button>
                  )}

                  {/* Submit Button Preview */}
                  {previewMode && (
                    <Button className="mt-6" disabled={!previewMode}>
                      Submit Form
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Preview Panel */}
            {!previewMode && (
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Form Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="bg-accent/10 p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-4">
                        See how your form will appear to users
                      </p>
                      <Button onClick={() => setPreviewMode(true)} variant="outline">
                        <Eye className="mr-2 h-4 w-4" />
                        Preview Form
                      </Button>
                    </div>
                    
                    <div className="p-4 border-t">
                      <h3 className="font-medium mb-2">Form Summary</h3>
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Form Title:</span>
                          <span className="font-medium truncate max-w-[150px]">{formData.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Elements:</span>
                          <span className="font-medium">{formData.elements.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <span className="font-medium capitalize">{formData.status}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-6">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Form Settings</CardTitle>
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
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="form-title">Form Title</Label>
                  <Input 
                    id="form-title"
                    value={formData.title}
                    onChange={e => updateFormMetadata('title', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="form-description">Form Description</Label>
                  <Input 
                    id="form-description"
                    value={formData.description}
                    onChange={e => updateFormMetadata('description', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Submission Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="success-message">Success Message</Label>
                  <textarea 
                    id="success-message"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Message to display after successful submission"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="redirect-url">Redirect URL (Optional)</Label>
                  <Input 
                    id="redirect-url"
                    type="url"
                    placeholder="https://example.com/thank-you"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox"
                    id="email-notifications"
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="email-notifications">Enable email notifications</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox"
                    id="limit-submissions"
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="limit-submissions">Limit submissions</Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Theme Tab */}
        <TabsContent value="theme" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Form Appearance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Form appearance settings will be implemented in a future version.
              </p>
              
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" className="h-12 bg-background">Light</Button>
                    <Button variant="outline" className="h-12 bg-slate-900 text-white">Dark</Button>
                    <Button variant="outline" className="h-12 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">Custom</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Font</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" className="h-12 font-sans">Sans</Button>
                    <Button variant="outline" className="h-12 font-serif">Serif</Button>
                    <Button variant="outline" className="h-12 font-mono">Mono</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormBuilder;
