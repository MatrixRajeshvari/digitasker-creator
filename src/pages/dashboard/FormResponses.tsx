
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DownloadIcon, 
  FileTextIcon, 
  EyeIcon,
  ChevronLeft, 
  ChevronRight
} from "lucide-react";

interface FormResponse {
  id: string;
  submittedAt: string;
  data: Record<string, string>;
}

const FormResponses = () => {
  const { id } = useParams();
  const [responses, setResponses] = useState<FormResponse[]>([
    {
      id: "resp_1",
      submittedAt: "2023-06-10T14:30:00Z",
      data: {
        "Full Name": "John Doe",
        "Email": "john.doe@example.com",
        "Feedback": "The service was excellent!"
      }
    },
    {
      id: "resp_2",
      submittedAt: "2023-06-11T09:15:00Z",
      data: {
        "Full Name": "Jane Smith",
        "Email": "jane.smith@example.com",
        "Feedback": "I had a great experience, but there could be improvements."
      }
    },
    {
      id: "resp_3",
      submittedAt: "2023-06-12T16:45:00Z",
      data: {
        "Full Name": "Bob Johnson",
        "Email": "bob.johnson@example.com",
        "Feedback": "The product met my expectations."
      }
    }
  ]);
  
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(null);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };
  
  // Get all unique keys from all responses
  const getAllKeys = () => {
    const keysSet = new Set<string>();
    responses.forEach(response => {
      Object.keys(response.data).forEach(key => keysSet.add(key));
    });
    return Array.from(keysSet);
  };
  
  const keys = getAllKeys();
  
  // Export responses to CSV
  const exportToCSV = () => {
    const headers = ['ID', 'Submitted At', ...keys];
    
    const csvRows = [
      headers.join(','),
      ...responses.map(response => {
        return [
          response.id,
          formatDate(response.submittedAt),
          ...keys.map(key => response.data[key] ? `"${response.data[key].replace(/"/g, '""')}"` : '')
        ].join(',');
      })
    ];
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `form-responses-${id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Form Responses</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Responses ({responses.length})</CardTitle>
          <CardDescription>
            View and analyze submissions to your form
          </CardDescription>
        </CardHeader>
        <CardContent>
          {responses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileTextIcon className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-medium">No responses yet</h3>
              <p className="text-sm text-muted-foreground">
                When people submit your form, their responses will appear here.
              </p>
            </div>
          ) : (
            <div className="relative overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Submitted At</TableHead>
                    {keys.map(key => (
                      <TableHead key={key}>{key}</TableHead>
                    ))}
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {responses.map(response => (
                    <TableRow key={response.id}>
                      <TableCell className="font-mono text-xs">{response.id}</TableCell>
                      <TableCell>{formatDate(response.submittedAt)}</TableCell>
                      {keys.map(key => (
                        <TableCell key={key}>
                          {response.data[key] || '-'}
                        </TableCell>
                      ))}
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setSelectedResponse(response)}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="flex items-center justify-end space-x-2 py-4">
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {selectedResponse && (
        <Card>
          <CardHeader>
            <CardTitle>Response Details</CardTitle>
            <CardDescription>
              Submitted {formatDate(selectedResponse.submittedAt)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(selectedResponse.data).map(([key, value]) => (
                <div key={key}>
                  <h3 className="font-medium text-sm">{key}</h3>
                  <p className="text-muted-foreground">{value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FormResponses;
