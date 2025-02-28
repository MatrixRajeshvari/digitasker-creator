
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Mock form data
const mockForm = {
  id: "form_123",
  title: "Customer Feedback Survey",
  description: "Please share your thoughts about our service",
  elements: [
    {
      id: "elem_1",
      type: "text",
      label: "Full Name",
      placeholder: "Enter your full name",
      required: true
    },
    {
      id: "elem_2",
      type: "email",
      label: "Email Address",
      placeholder: "your@email.com",
      required: true
    },
    {
      id: "elem_3",
      type: "select",
      label: "How would you rate our service?",
      required: true,
      options: ["Excellent", "Good", "Average", "Poor", "Very Poor"]
    },
    {
      id: "elem_4",
      type: "textarea",
      label: "Additional Comments",
      placeholder: "Please provide any additional feedback...",
      required: false
    }
  ]
};

const ViewForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<any>(mockForm);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Handle input changes
  const handleInputChange = (elementId: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [elementId]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const missingFields = formData.elements
      .filter((element: any) => element.required && !formValues[element.id])
      .map((element: any) => element.label);
    
    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: `Please fill in the following required fields: ${missingFields.join(", ")}`,
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      
      toast({
        title: "Form Submitted",
        description: "Thank you for your submission!"
      });
    }, 1500);
  };
  
  // Render form elements
  const renderFormElement = (element: any) => {
    switch (element.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <div className="space-y-2" key={element.id}>
            <Label htmlFor={element.id}>
              {element.label} {element.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={element.id}
              type={element.type}
              placeholder={element.placeholder}
              value={formValues[element.id] || ''}
              onChange={(e) => handleInputChange(element.id, e.target.value)}
              required={element.required}
            />
          </div>
        );
      
      case 'textarea':
        return (
          <div className="space-y-2" key={element.id}>
            <Label htmlFor={element.id}>
              {element.label} {element.required && <span className="text-destructive">*</span>}
            </Label>
            <textarea
              id={element.id}
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={element.placeholder}
              value={formValues[element.id] || ''}
              onChange={(e) => handleInputChange(element.id, e.target.value)}
              required={element.required}
            />
          </div>
        );
      
      case 'select':
        return (
          <div className="space-y-2" key={element.id}>
            <Label htmlFor={element.id}>
              {element.label} {element.required && <span className="text-destructive">*</span>}
            </Label>
            <select
              id={element.id}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formValues[element.id] || ''}
              onChange={(e) => handleInputChange(element.id, e.target.value)}
              required={element.required}
            >
              <option value="">Select an option</option>
              {element.options.map((option: string) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="space-y-2" key={element.id}>
            <Label>
              {element.label} {element.required && <span className="text-destructive">*</span>}
            </Label>
            <div className="space-y-2">
              {element.options.map((option: string, index: number) => (
                <div key={`${element.id}-${index}`} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`${element.id}-${index}`}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    onChange={(e) => {
                      const currentValues = formValues[element.id] ? formValues[element.id].split(',') : [];
                      if (e.target.checked) {
                        currentValues.push(option);
                      } else {
                        const index = currentValues.indexOf(option);
                        if (index > -1) {
                          currentValues.splice(index, 1);
                        }
                      }
                      handleInputChange(element.id, currentValues.join(','));
                    }}
                  />
                  <Label htmlFor={`${element.id}-${index}`} className="text-sm">{option}</Label>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'radio':
        return (
          <div className="space-y-2" key={element.id}>
            <Label>
              {element.label} {element.required && <span className="text-destructive">*</span>}
            </Label>
            <div className="space-y-2">
              {element.options.map((option: string, index: number) => (
                <div key={`${element.id}-${index}`} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`${element.id}-${index}`}
                    name={element.id}
                    className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                    value={option}
                    onChange={(e) => handleInputChange(element.id, e.target.value)}
                  />
                  <Label htmlFor={`${element.id}-${index}`} className="text-sm">{option}</Label>
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  // If the form has been submitted, show a thank you message
  if (submitted) {
    return (
      <div className="max-w-md mx-auto py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Submission Received</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">Thank you for your submission!</p>
            <p className="text-muted-foreground text-sm">Your response has been recorded.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => navigate(-1)}>Back to Form</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container max-w-3xl py-6">
      <Card className="border shadow-sm">
        <CardHeader className="border-b bg-muted/40">
          <CardTitle className="text-2xl">{formData.title}</CardTitle>
          {formData.description && (
            <p className="text-muted-foreground">{formData.description}</p>
          )}
        </CardHeader>
        <CardContent className="py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {formData.elements.map(renderFormElement)}
            
            <div className="pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Form"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewForm;
