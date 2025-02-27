
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft,
  FileText,
  Download,
  Filter,
  Search,
  Calendar,
  MoreHorizontal,
  Trash2,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock response data type
interface FormResponse {
  id: string;
  formId: string;
  submittedAt: string;
  data: Record<string, any>;
  status: 'new' | 'viewed' | 'archived';
}

interface FormDetails {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  fields: { id: string; label: string; type: string }[];
}

const FormResponses = () => {
  const { id } = useParams();
  const { toast } = useToast();
  
  const [formResponses, setFormResponses] = useState<FormResponse[]>([]);
  const [formDetails, setFormDetails] = useState<FormDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(null);
  
  // Fetch form details and responses
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call to get form details
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock form details
        const mockFormDetails: FormDetails = {
          id: id as string,
          title: "Customer Feedback Survey",
          description: "Collect customer feedback about our products and services",
          createdAt: "2023-05-15",
          updatedAt: "2023-06-22",
          fields: [
            { id: "name", label: "Full Name", type: "text" },
            { id: "email", label: "Email Address", type: "email" },
            { id: "source", label: "How did you hear about us?", type: "select" },
            { id: "rating", label: "Rating", type: "number" },
            { id: "feedback", label: "Your Feedback", type: "textarea" }
          ]
        };
        
        // Mock form responses
        const mockResponses: FormResponse[] = Array.from({ length: 12 }, (_, i) => ({
          id: (i + 1).toString(),
          formId: id as string,
          submittedAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
          status: ['new', 'viewed', 'viewed', 'archived'][Math.floor(Math.random() * 4)] as 'new' | 'viewed' | 'archived',
          data: {
            name: [
              "John Smith", 
              "Emma Johnson", 
              "Michael Brown", 
              "Sofia Garcia", 
              "James Wilson"
            ][Math.floor(Math.random() * 5)],
            email: [
              "john@example.com",
              "emma@example.com",
              "michael@example.com",
              "sofia@example.com",
              "james@example.com"
            ][Math.floor(Math.random() * 5)],
            source: [
              "Search Engine",
              "Social Media",
              "Friend/Family",
              "Advertisement",
              "Other"
            ][Math.floor(Math.random() * 5)],
            rating: Math.floor(Math.random() * 5) + 1,
            feedback: [
              "Great product, very satisfied with the quality!",
              "Service was excellent, but delivery was a bit slow.",
              "Amazing customer support. Would recommend to friends.",
              "The product met my expectations, but could be improved.",
              "Everything was perfect. Will definitely buy again."
            ][Math.floor(Math.random() * 5)]
          }
        }));
        
        setFormDetails(mockFormDetails);
        setFormResponses(mockResponses);
      } catch (error) {
        console.error("Error fetching form data:", error);
        toast({
          title: "Error",
          description: "Failed to load form responses.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchData();
    }
  }, [id, toast]);

  // Filter responses
  const filteredResponses = formResponses.filter(response => {
    const matchesStatus = statusFilter === "all" || response.status === statusFilter;
    
    // Search in response data values
    const matchesSearch = searchTerm === "" || 
      Object.values(response.data).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    return matchesStatus && matchesSearch;
  });

  // Delete response
  const deleteResponse = (responseId: string) => {
    setFormResponses(prev => prev.filter(r => r.id !== responseId));
    
    if (selectedResponse?.id === responseId) {
      setSelectedResponse(null);
    }
    
    toast({
      title: "Response deleted",
      description: "The response has been removed."
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: 'new' | 'viewed' | 'archived' }) => {
    switch (status) {
      case 'new':
        return <Badge variant="default">New</Badge>;
      case 'viewed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Viewed</Badge>;
      case 'archived':
        return <Badge variant="secondary">Archived</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading responses...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/dashboard/forms">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Form Responses</h1>
            <p className="text-muted-foreground">{formDetails?.title}</p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <Link to={`/dashboard/forms/${id}/edit`}>
              <FileText className="h-4 w-4" />
              Edit Form
            </Link>
          </Button>
        </div>
      </div>

      {/* Response Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formResponses.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formResponses.filter(r => r.status === 'new').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formResponses.length > 0 
                ? (formResponses.reduce((sum, r) => sum + (r.data.rating || 0), 0) / formResponses.length).toFixed(1)
                : "N/A"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">
              {formResponses.length > 0 
                ? formatDate(formResponses.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())[0].submittedAt)
                : "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search responses..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="viewed">Viewed</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Responses and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Responses Table */}
        <div className={`lg:col-span-${selectedResponse ? 2 : 3}`}>
          {filteredResponses.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Submitter</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResponses.map((response) => (
                    <TableRow 
                      key={response.id}
                      className={selectedResponse?.id === response.id ? "bg-accent/50" : ""}
                    >
                      <TableCell className="font-medium">
                        <div 
                          className="cursor-pointer hover:underline"
                          onClick={() => {
                            if (response.status === 'new') {
                              // Mark as viewed
                              setFormResponses(prev => 
                                prev.map(r => 
                                  r.id === response.id 
                                    ? { ...r, status: 'viewed' } 
                                    : r
                                )
                              );
                            }
                            setSelectedResponse(response);
                          }}
                        >
                          {response.data.name}
                          <div className="text-xs text-muted-foreground">{response.data.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={response.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                          {formatDate(response.submittedAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setSelectedResponse(response)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              // Mark as viewed/new (toggle)
                              setFormResponses(prev => 
                                prev.map(r => 
                                  r.id === response.id 
                                    ? { ...r, status: r.status === 'new' ? 'viewed' : 'new' } 
                                    : r
                                )
                              );
                            }}>
                              Mark as {response.status === 'new' ? 'Viewed' : 'New'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              // Archive/unarchive (toggle)
                              setFormResponses(prev => 
                                prev.map(r => 
                                  r.id === response.id 
                                    ? { ...r, status: r.status === 'archived' ? 'viewed' : 'archived' } 
                                    : r
                                )
                              );
                            }}>
                              {response.status === 'archived' ? 'Unarchive' : 'Archive'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => deleteResponse(response.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-accent/10">
              <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-1">No responses found</h3>
              <p className="text-muted-foreground text-center max-w-sm mb-4">
                {searchTerm || statusFilter !== 'all'
                  ? "No responses match your current filters. Try adjusting your search criteria."
                  : "This form hasn't received any submissions yet."}
              </p>
              <Button variant="outline" asChild>
                <Link to={`/forms/${id}`}>View Form</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Response Details */}
        {selectedResponse && (
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Response Details</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setSelectedResponse(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                    Submitted: {formatDate(selectedResponse.submittedAt)}
                  </div>
                  <StatusBadge status={selectedResponse.status} />
                </div>

                <div className="space-y-4 pt-2">
                  {Object.entries(selectedResponse.data).map(([key, value]) => {
                    const field = formDetails?.fields.find(f => f.id === key);
                    return (
                      <div key={key} className="space-y-1">
                        <h4 className="text-sm font-medium text-muted-foreground">{field?.label || key}</h4>
                        <div className="text-sm font-medium">
                          {typeof value === 'string' && value.length > 100 
                            ? (
                              <div className="p-3 bg-accent/30 rounded-md whitespace-pre-wrap">
                                {value}
                              </div>
                            ) 
                            : value}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="space-y-2 pt-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {
                      // Toggle archive status
                      setFormResponses(prev => 
                        prev.map(r => 
                          r.id === selectedResponse.id 
                            ? { ...r, status: r.status === 'archived' ? 'viewed' : 'archived' } 
                            : r
                        )
                      );
                      
                      // Update selected response
                      setSelectedResponse(prev => 
                        prev ? { ...prev, status: prev.status === 'archived' ? 'viewed' as const : 'archived' as const } : null
                      );
                    }}
                  >
                    {selectedResponse.status === 'archived' ? 'Unarchive' : 'Archive'} Response
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="w-full justify-start"
                    onClick={() => deleteResponse(selectedResponse.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Response
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormResponses;
