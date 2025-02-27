
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Loader2,
  ArrowLeft,
  Share2,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Form field type definitions
type FormFieldType = 'text' | 'number' | 'email' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'time' | 'file' | 'heading' | 'paragraph';

interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select, checkbox, radio
  description?: string;
}

interface Form {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  createdBy: string;
  createdAt: string;
  isActive: boolean;
}

const ViewForm = () => {
  const { id } = useParams();
  const { toast } = useToast();
  
  const [form, setForm] = useState<Form | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Fetch form data
  useEffect(() => {
    const fetchForm = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock form data
        const mockForm: Form = {
          id: id as string,
          title: "Customer Feedback Survey",
          description: "We value your feedback! Please tell us about your experience with our products and services.",
          fields: [
            {
              id: "name",
              type: "text",
              label: "Full Name",
              placeholder: "Enter your full name",
              required: true
            },
            {
              id: "email",
              type: "email",
              label: "Email Address",
              placeholder: "your@email.com",
              required: true
            },
            {
              id: "phone",
              type: "text",
              label: "Phone Number",
              placeholder: "Your phone number",
              required: false
            },
            {
              id: "source",
              type: "select",
              label: "How did you hear about us?",
              required: false,
              options: ["Social Media", "Friend/Family", "Advertisement", "Search Engine", "Other"]
            },
            {
              id: "heading1",
              type: "heading",
              label: "Product & Service Feedback",
              required: false
            },
            {
              id: "satisfaction",
              type: "radio",
              label: "How satisfied were you with our product/service?",
              required: true,
              options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"]
            },
            {
              id: "features",
              type: "checkbox",
              label: "Which features did you find most useful?",
              required: false,
              options: ["User Interface", "Performance", "Reliability", "Customer Support", "Price", "Documentation"]
            },
            {
              id: "rating",
              type: "number",
              label: "On a scale of 1-10, how likely are you to recommend us?",
              placeholder: "1-10",
              required: true
            },
            {
              id: "feedback",
              type: "textarea",
              label: "Please share any additional feedback or suggestions",
              placeholder: "Your feedback is valuable to us...",
              required: false
            }
          ],
          createdBy: "Admin User",
          createdAt: "2023-05-15",
          isActive: true
        };
        
        setForm(mockForm);
        
        // Initialize form data with empty values
        const initialData: Record<string, any> = {};
        mockForm.fields.forEach(field => {
          if (field.type !== 'heading' && field.type !== 'paragraph') {
            if (field.type === 'checkbox') {
              initialData[field.id] = [];
            } else {
              initialData[field.id] = '';
            }
          }
        });
        
        setFormData(initialData);
      } catch (error) {
        console.error("Error fetching form:", error);
        toast({
          title: "Error",
          description: "Failed to load form. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchForm();
    }
  }, [id, toast]);

  // Handle input change
  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    // Clear error for this field if any
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (fieldId: string, option: string, checked: boolean) => {
    setFormData(prev => {
      const currentValues = Array.isArray(prev[fieldId]) ? [...prev[fieldId]] : [];
      
      if (checked) {
        return { ...prev, [fieldId]: [...currentValues, option] };
      } else {
        return { ...prev, [fieldId]: currentValues.filter(v => v !== option) };
      }
    });
    
    // Clear error for this field if any
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    form?.fields.forEach(field => {
      if (field.required && field.type !== 'heading' && field.type !== 'paragraph') {
        const value = formData[field.id];
        
        if (field.type === 'checkbox' && Array.isArray(value) && value.length === 0) {
          newErrors[field.id] = 'Please select at least one option';
        } else if (!value && value !== 0) {
          newErrors[field.id] = 'This field is required';
        }
      }
      
      // Validate number field
      if (field.type === 'number' && formData[field.id] !== '') {
        const value = Number(formData[field.id]);
        if (isNaN(value)) {
          newErrors[field.id] = 'Please enter a valid number';
        } else if (field.id === 'rating' && (value < 1 || value > 10)) {
          newErrors[field.id] = 'Please enter a number between 1 and 10';
        }
      }
      
      // Validate email field
      if (field.type === 'email' && formData[field.id] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData[field.id])) {
        newErrors[field.id] = 'Please enter a valid email address';
      }
    });
    
    setErrors(newErrors);
    
    // If no errors, submit form
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      
      // Simulate form submission
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        
        toast({
          title: "Form submitted",
          description: "Thank you for your submission!",
        });
      }, 1500);
    } else {
      // Scroll to first error
      const firstErrorId = Object.keys(newErrors)[0];
      const element = document.getElementById(firstErrorId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      toast({
        title: "Form validation error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
    }
  };

  // Render form fields
  const renderField = (field: FormField) => {
    const { id, type, label, placeholder, required, options, description } = field;
    const error = errors[id];
    
    switch (type) {
      case 'text':
      case 'number':
      case 'email':
        return (
          <div className="space-y-2">
            <Label htmlFor={id} className="flex items-center">
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={id}
              type={type}
              placeholder={placeholder}
              value={formData[id] || ''}
              onChange={(e) => handleInputChange(id, e.target.value)}
              aria-invalid={!!error}
              className={error ? "border-destructive" : ""}
            />
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );
      
      case 'textarea':
        return (
          <div className="space-y-2">
            <Label htmlFor={id} className="flex items-center">
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <textarea
              id={id}
              placeholder={placeholder}
              value={formData[id] || ''}
              onChange={(e) => handleInputChange(id, e.target.value)}
              aria-invalid={!!error}
              className={`flex min-h-[100px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${error ? "border-destructive" : "border-input"}`}
            />
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );
      
      case 'select':
        return (
          <div className="space-y-2">
            <Label htmlFor={id} className="flex items-center">
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <select
              id={id}
              value={formData[id] || ''}
              onChange={(e) => handleInputChange(id, e.target.value)}
              aria-invalid={!!error}
              className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${error ? "border-destructive" : "border-input"}`}
            >
              <option value="">Select an option</option>
              {options?.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="space-y-2">
            <div className="flex items-center">
              <Label className="flex items-center">
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </Label>
            </div>
            <div className="space-y-2">
              {options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`${id}-${index}`}
                    checked={Array.isArray(formData[id]) ? formData[id].includes(option) : false}
                    onChange={(e) => handleCheckboxChange(id, option, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor={`${id}-${index}`} className="text-sm font-normal">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            <div className="flex items-center">
              <Label className="flex items-center">
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </Label>
            </div>
            <div className="space-y-2">
              {options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`${id}-${index}`}
                    name={id}
                    value={option}
                    checked={formData[id] === option}
                    onChange={() => handleInputChange(id, option)}
                    className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor={`${id}-${index}`} className="text-sm font-normal">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );
      
      case 'date':
        return (
          <div className="space-y-2">
            <Label htmlFor={id} className="flex items-center">
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={id}
              type="date"
              value={formData[id] || ''}
              onChange={(e) => handleInputChange(id, e.target.value)}
              aria-invalid={!!error}
              className={error ? "border-destructive" : ""}
            />
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );
      
      case 'time':
        return (
          <div className="space-y-2">
            <Label htmlFor={id} className="flex items-center">
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={id}
              type="time"
              value={formData[id] || ''}
              onChange={(e) => handleInputChange(id, e.target.value)}
              aria-invalid={!!error}
              className={error ? "border-destructive" : ""}
            />
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );
      
      case 'file':
        return (
          <div className="space-y-2">
            <Label htmlFor={id} className="flex items-center">
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={id}
              type="file"
              onChange={(e) => handleInputChange(id, e.target.files?.[0] || null)}
              aria-invalid={!!error}
              className={error ? "border-destructive" : ""}
            />
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        );
      
      case 'heading':
        return <h2 className="text-xl font-bold mt-6 mb-2">{label}</h2>;
      
      case 'paragraph':
        return <p className="text-muted-foreground mb-4">{label}</p>;
      
      default:
        return null;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading form...</span>
      </div>
    );
  }

  // Error state - form not found or inactive
  if (!form || !form.isActive) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 border rounded-md shadow-md">
        <h1 className="text-2xl font-bold mb-4">Form Not Available</h1>
        <p className="text-muted-foreground mb-6">
          This form is either inactive or doesn't exist. Please contact the form owner for more information.
        </p>
        <Button asChild>
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  // Success state - after form submission
  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 border rounded-md shadow-md">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Thank You!</h1>
          <p className="text-muted-foreground mb-6">
            Your response has been successfully submitted.
          </p>
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link to="/">Return to Home</Link>
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setFormData({});
                setIsSubmitted(false);
              }}
            >
              Submit Another Response
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Form view
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <Card className="shadow-md">
        <CardHeader>
          <div className="mb-2">
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground -ml-2">
              <Link to="/" className="flex items-center">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </Link>
            </Button>
          </div>
          <CardTitle>{form.title}</CardTitle>
          {form.description && (
            <p className="text-muted-foreground">{form.description}</p>
          )}
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {form.fields.map((field) => (
              <div key={field.id} id={field.id} className="py-1">
                {renderField(field)}
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
            <div className="text-xs text-center text-muted-foreground">
              <p>
                Fields marked with <span className="text-destructive">*</span> are required
              </p>
            </div>
          </CardFooter>
        </form>
      </Card>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Powered by FormFlow
        </p>
        <div className="flex justify-center gap-2 mt-2">
          <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
            <Share2 className="h-3 w-3" />
            Share
          </Button>
          <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs" asChild>
            <Link to="/register">
              <ExternalLink className="h-3 w-3" />
              Create Your Own Form
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewForm;
