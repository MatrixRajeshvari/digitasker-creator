
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FileText, 
  PlusCircle, 
  Save, 
  Trash2, 
  ArrowLeft,
  Settings as SettingsIcon,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Define the types for our form elements
type FormElementType = 'text' | 'number' | 'email' | 'textarea' | 'select' | 'checkbox' | 'radio';

interface FormElement {
  id: string;
  type: FormElementType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select, checkbox, radio
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

const FormBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  
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
      placeholder: 'Enter value...',
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
    { value: 'radio', label: 'Radio Buttons' }
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
          </div>
        );
      
      case 'select':
        return (
          <div className="space-y-2">
            <Label>{element.label} {element.required && <span className="text-destructive">*</span>}</Label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={previewMode ? false : true}
            >
              <option value="">Select an option</option>
              {element.options?.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
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
          </div>
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
        
        <div className="space-y-2">
          <Label htmlFor="element-placeholder">Placeholder</Label>
          <Input 
            id="element-placeholder"
            value={element.placeholder || ''}
            onChange={e => updateElement(element.id, { placeholder: e.target.value })}
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
                  <Trash2 className="h-4 w-4" />
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
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate("/dashboard/forms")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {id ? "Edit Form" : "Create New Form"}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={previewMode ? "default" : "outline"}
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="mr-2 h-4 w-4" />
            {previewMode ? "Exit Preview" : "Preview"}
          </Button>
          <Button onClick={saveForm} disabled={loading}>
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
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="builder">
            <FileText className="mr-2 h-4 w-4" />
            Form Builder
          </TabsTrigger>
          <TabsTrigger value="settings">
            <SettingsIcon className="mr-2 h-4 w-4" />
            Form Settings
          </TabsTrigger>
        </TabsList>

        {/* Builder Tab */}
        <TabsContent value="builder" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form Elements Panel */}
            {!previewMode && (
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Form Elements</CardTitle>
                    <CardDescription>Add elements to your form</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-2">
                    {elementTypeOptions.map(type => (
                      <Button
                        key={type.value}
                        variant="outline"
                        className="h-auto py-4 flex-col justify-center items-center"
                        onClick={() => addElement(type.value)}
                      >
                        <FileText className="h-5 w-5 mb-1" />
                        <span className="text-xs">{type.label}</span>
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Form Preview */}
            <div className={`bg-card border rounded-md p-6 lg:col-span-${previewMode ? 12 : 6}`}>
              {/* Form Title & Description */}
              {!previewMode ? (
                <div className="mb-6 space-y-4">
                  <Input
                    value={formData.title}
                    onChange={e => updateFormMetadata('title', e.target.value)}
                    className="text-2xl font-bold border-0 border-b rounded-none px-0"
                    placeholder="Form Title"
                  />
                  <Input
                    value={formData.description}
                    onChange={e => updateFormMetadata('description', e.target.value)}
                    className="border-0 border-b rounded-none px-0 text-muted-foreground"
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
                  <PlusCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Your form is empty. Add elements from the sidebar to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {formData.elements.map(element => (
                    <div 
                      key={element.id}
                      className={`p-4 rounded-md transition-all ${
                        selectedElement === element.id && !previewMode 
                          ? 'ring-2 ring-primary bg-accent/20' 
                          : 'hover:bg-accent/10'
                      } ${
                        !previewMode ? 'cursor-pointer' : ''
                      }`}
                      onClick={() => selectElement(element.id)}
                    >
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
                    <Button className="mt-4">
                      Submit Form
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Element Properties Panel */}
            {!previewMode && selectedElement && (
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Element Properties</CardTitle>
                    <CardDescription>Customize the selected element</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ElementPropertyEditor />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Form Settings</CardTitle>
              <CardDescription>Configure your form's basic settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="form-status">Form Status</Label>
                <select 
                  id="form-status"
                  value={formData.status}
                  onChange={e => updateFormMetadata('status', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
                <p className="text-xs text-muted-foreground">
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
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="form-description">Form Description</Label>
                <textarea 
                  id="form-description"
                  value={formData.description}
                  onChange={e => updateFormMetadata('description', e.target.value)}
                  className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="success-message">Success Message</Label>
                <textarea 
                  id="success-message"
                  className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Thank you for your submission!"
                />
                <p className="text-xs text-muted-foreground">
                  Message shown to users after successfully submitting the form
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={saveForm} disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormBuilder;
