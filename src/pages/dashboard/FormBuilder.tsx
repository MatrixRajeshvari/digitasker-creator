
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Eye, 
  Save,
  FileText,
  Settings,
  Paintbrush,
  Plus,
  FileIcon,
  Hash,
  AtSign,
  AlignLeft,
  ChevronDown,
  CheckSquare,
  Circle,
  Calendar,
  Clock,
  Upload,
  Heading,
  AlignJustify,
  Check,
  PlusCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

type FormElementType = 'text' | 'number' | 'email' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'time' | 'file' | 'heading' | 'paragraph';

interface FormElement {
  id: string;
  type: FormElementType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

interface FormData {
  id?: string;
  title: string;
  description: string;
  elements: FormElement[];
  status: 'draft' | 'active' | 'archived';
}

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
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  
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

    toast({
      title: "Element added",
      description: `${type} element has been added to your form.`
    });
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

  // Element type list with icons
  const formElements = [
    { type: 'text', label: 'Text Field', icon: <FileIcon className="h-5 w-5" /> },
    { type: 'number', label: 'Number Field', icon: <Hash className="h-5 w-5" /> },
    { type: 'email', label: 'Email Field', icon: <AtSign className="h-5 w-5" /> },
    { type: 'textarea', label: 'Text Area', icon: <AlignLeft className="h-5 w-5" /> },
    { type: 'select', label: 'Dropdown', icon: <ChevronDown className="h-5 w-5" /> },
    { type: 'checkbox', label: 'Checkboxes', icon: <CheckSquare className="h-5 w-5" /> },
    { type: 'radio', label: 'Radio Buttons', icon: <Circle className="h-5 w-5" /> },
    { type: 'date', label: 'Date Picker', icon: <Calendar className="h-5 w-5" /> },
    { type: 'time', label: 'Time Picker', icon: <Clock className="h-5 w-5" /> },
    { type: 'file', label: 'File Upload', icon: <Upload className="h-5 w-5" /> },
    { type: 'heading', label: 'Heading', icon: <Heading className="h-5 w-5" /> },
    { type: 'paragraph', label: 'Paragraph', icon: <AlignJustify className="h-5 w-5" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 py-3">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/forms")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Create New Form</h1>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button
            className="flex items-center gap-2 bg-gray-900"
            onClick={saveForm}
            disabled={loading}
          >
            <Save className="h-4 w-4" />
            Save Form
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <Tabs defaultValue="builder" className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-6 bg-gray-100/60 rounded-lg p-1">
          <TabsTrigger 
            value="builder"
            className="flex items-center gap-2 data-[state=active]:bg-white rounded-md"
          >
            <FileText className="h-4 w-4" />
            Form Builder
          </TabsTrigger>
          <TabsTrigger 
            value="settings"
            className="flex items-center gap-2 data-[state=active]:bg-white rounded-md"
          >
            <Settings className="h-4 w-4" />
            Form Settings
          </TabsTrigger>
          <TabsTrigger
            value="theme" 
            className="flex items-center gap-2 data-[state=active]:bg-white rounded-md"
          >
            <Paintbrush className="h-4 w-4" />
            Theme & Style
          </TabsTrigger>
        </TabsList>

        {/* Builder Tab Content */}
        <TabsContent value="builder">
          <div className="grid grid-cols-12 gap-6">
            {/* Form Elements Panel */}
            <div className="col-span-4">
              <div className="bg-white rounded-lg border p-5 shadow-sm">
                <h2 className="text-lg font-medium mb-3">Form Elements</h2>
                <p className="text-gray-500 text-sm mb-4">
                  Drag and drop elements to build your form
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  {formElements.map((element) => (
                    <button
                      key={element.type}
                      className="flex flex-col items-center justify-center p-4 border rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
                      onClick={() => addElement(element.type as FormElementType)}
                    >
                      <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mb-2">
                        {element.icon}
                      </div>
                      <span className="text-sm">{element.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Preview Area */}
            <div className="col-span-5">
              <div className="bg-white rounded-lg border shadow-sm">
                {/* Form Title Input */}
                <div className="p-4 border-b">
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="text-xl font-medium border-0 px-0 h-auto focus-visible:ring-0"
                    placeholder="Untitled Form"
                  />
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="border-0 px-0 h-auto text-gray-500 text-sm focus-visible:ring-0"
                    placeholder="Form Description"
                  />
                </div>

                {/* Empty State */}
                {formData.elements.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                      <Plus className="h-8 w-8 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Start Building Your Form</h3>
                    <p className="text-gray-500 text-sm mb-6 max-w-sm">
                      Your form is empty. Add elements from the sidebar to get started with creating your custom form.
                    </p>
                    <Button
                      className="mx-auto"
                      onClick={() => {
                        const formElement = document.querySelector(
                          `.bg-white.p-4.button-add-first-element`
                        ) as HTMLElement;
                        if (formElement) formElement.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add First Element
                    </Button>
                  </div>
                )}

                {/* Form Elements List (would render the form elements here) */}
                {formData.elements.length > 0 && (
                  <div className="p-4">
                    {/* Form elements would be rendered here */}
                  </div>
                )}

                {/* Add First Element Button */}
                {formData.elements.length === 0 && (
                  <div className="p-4 border-t bg-white button-add-first-element">
                    <Button
                      className="w-full flex items-center justify-center gap-2 py-6"
                      variant="outline"
                      onClick={() => addElement('text')}
                    >
                      <Plus className="h-5 w-5" />
                      Add First Element
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Form Summary Panel */}
            <div className="col-span-3">
              <div className="bg-white rounded-lg border shadow-sm p-5">
                <h2 className="text-lg font-medium mb-4">Form Summary</h2>
                
                <div className="flex flex-col gap-2 mb-6">
                  <div className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                    <span className="text-gray-500">Form Title:</span>
                    <span className="font-medium">{formData.title || "Untitled Form"}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                    <span className="text-gray-500">Elements:</span>
                    <span className="font-medium">
                      {formData.elements.length} 
                      <span className="text-gray-500 text-xs ml-1">
                        ({formData.elements.filter(el => el.required).length} required)
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                    <span className="text-gray-500">Status:</span>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                      <span className="font-medium">Draft</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="text-sm font-medium mb-3 text-center">Form completion checklist</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm bg-white rounded-md p-2 shadow-sm">
                      <div className={`flex items-center justify-center h-5 w-5 rounded-full ${formData.title ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {formData.title ? <Check className="h-3 w-3" /> : "1"}
                      </div>
                      <div className="flex-1">
                        <span className={formData.title ? 'text-green-600 font-medium' : ''}>Form title</span>
                        {!formData.title && <span className="text-gray-500 text-xs ml-1">(required)</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm bg-white rounded-md p-2 shadow-sm">
                      <div className={`flex items-center justify-center h-5 w-5 rounded-full ${formData.elements.length > 0 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {formData.elements.length > 0 ? <Check className="h-3 w-3" /> : "2"}
                      </div>
                      <div className="flex-1">
                        <span className={formData.elements.length > 0 ? 'text-green-600 font-medium' : ''}>Form elements</span>
                        {formData.elements.length === 0 && <span className="text-gray-500 text-xs ml-1">(at least one required)</span>}
                      </div>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4" onClick={() => setPreviewMode(true)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview Form
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Settings Tab Content */}
        <TabsContent value="settings">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-medium mb-4">Form Settings</h2>
            <p className="text-gray-500 mb-6">Configure the basic settings for your form</p>
            
            {/* Settings content would go here */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="form-status" className="mb-2 block">Form Status</Label>
                <select 
                  id="form-status"
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={formData.status}
                  onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
                <p className="text-gray-500 text-sm mt-1">Only active forms can receive submissions</p>
              </div>
              
              <div>
                <Label htmlFor="form-title" className="mb-2 block">Form Title</Label>
                <Input 
                  id="form-title"
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="form-description" className="mb-2 block">Form Description</Label>
                <textarea 
                  id="form-description"
                  className="w-full rounded-md border border-gray-300 p-2 min-h-[100px]"
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Theme Tab Content */}
        <TabsContent value="theme">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-medium mb-4">Theme & Style</h2>
            <p className="text-gray-500 mb-6">Customize the look and feel of your form</p>
            
            {/* Theme settings would go here */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="mb-2 block">Theme</Label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="border rounded-md p-4 flex flex-col items-center justify-center h-20 cursor-pointer bg-gray-50 relative border-blue-500">
                    <div className="w-2 h-2 rounded-full bg-blue-500 absolute top-2 right-2"></div>
                    <span className="text-sm">Light</span>
                  </div>
                  <div className="border rounded-md p-4 flex flex-col items-center justify-center h-20 cursor-pointer bg-gray-800 text-white">
                    <span className="text-sm">Dark</span>
                  </div>
                  <div className="border rounded-md p-4 flex flex-col items-center justify-center h-20 cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    <span className="text-sm">Colorful</span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="mb-2 block">Font Style</Label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="border rounded-md p-4 flex flex-col items-center justify-center h-20 cursor-pointer border-blue-500">
                    <span className="text-lg mb-1">Aa</span>
                    <span className="text-xs">Sans Serif</span>
                  </div>
                  <div className="border rounded-md p-4 flex flex-col items-center justify-center h-20 cursor-pointer">
                    <span className="text-lg font-serif mb-1">Aa</span>
                    <span className="text-xs">Serif</span>
                  </div>
                  <div className="border rounded-md p-4 flex flex-col items-center justify-center h-20 cursor-pointer">
                    <span className="text-lg font-mono mb-1">Aa</span>
                    <span className="text-xs">Monospace</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormBuilder;
