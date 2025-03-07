import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FileText, 
  PlusCircle, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ArrowUpDown,
  Loader2,
  CheckCircle2,
  Calendar,
  FileUp,
  Trash2,
  Copy,
  Edit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { ensureDBConnected } from "@/services/mongoDBService";
import { Form, IForm, FormStatus } from "@/models/Form";

interface FormData {
  id: string;
  title: string;
  status: FormStatus;
  createdAt: string;
  submissions: number;
  lastSubmission: string | null;
}

const Forms = () => {
  const { user } = useAuth();
  const [forms, setForms] = useState<FormData[]>([]);
  const [filteredForms, setFilteredForms] = useState<FormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortConfig, setSortConfig] = useState<{ key: keyof FormData; direction: 'asc' | 'desc' }>({
    key: 'createdAt',
    direction: 'desc'
  });
  
  const { toast } = useToast();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        setIsLoading(true);
        
        await ensureDBConnected();
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockForms: FormData[] = Array.from({ length: 15 }, (_, i) => ({
          id: (i + 1).toString(),
          title: [
            "Customer Feedback",
            "Job Application",
            "Event Registration",
            "Product Survey",
            "Contact Request",
            "Newsletter Signup",
            "Support Ticket",
            "Membership Application",
            "Workshop Registration",
            "Feedback Form"
          ][Math.floor(Math.random() * 10)] + ` ${i + 1}`,
          status: ['active', 'draft', 'archived'][Math.floor(Math.random() * 3)] as FormStatus,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
          submissions: Math.floor(Math.random() * 200),
          lastSubmission: Math.random() > 0.2 
            ? new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString().split('T')[0]
            : null
        }));
        
        setForms(mockForms);
        setFilteredForms(mockForms);
      } catch (error) {
        console.error("Error fetching forms:", error);
        toast({
          title: "Error",
          description: "Failed to load forms. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchForms();
  }, [toast]);

  useEffect(() => {
    const result = forms.filter(form => {
      const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || form.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    
    const sortedResult = [...result].sort((a, b) => {
      if (sortConfig.key === 'submissions') {
        return sortConfig.direction === 'asc' 
          ? a.submissions - b.submissions
          : b.submissions - a.submissions;
      } else if (sortConfig.key === 'createdAt') {
        return sortConfig.direction === 'asc'
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        return 0;
      }
    });
    
    setFilteredForms(sortedResult);
  }, [forms, searchTerm, statusFilter, sortConfig]);

  const handleSort = (key: keyof FormData) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const deleteForm = (id: string) => {
    setForms(forms.filter(form => form.id !== id));
    
    toast({
      title: "Form deleted",
      description: "The form has been successfully deleted.",
    });
  };

  const duplicateForm = (id: string) => {
    const formToDuplicate = forms.find(form => form.id === id);
    
    if (formToDuplicate) {
      const newForm: FormData = {
        ...formToDuplicate,
        id: (Math.max(...forms.map(f => parseInt(f.id))) + 1).toString(),
        title: `${formToDuplicate.title} (Copy)`,
        status: 'draft',
        submissions: 0,
        lastSubmission: null,
        createdAt: new Date().toISOString().split('T')[0],
      };
      
      setForms([...forms, newForm]);
      
      toast({
        title: "Form duplicated",
        description: "A copy of the form has been created.",
      });
    }
  };

  const getStatusBadge = (status: FormStatus) => {
    switch(status) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'draft':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Draft</Badge>;
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
        <span className="ml-2 text-lg">Loading forms...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Forms</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/dashboard/forms/new" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              New Form
            </Link>
          </Button>
          <Button variant="outline" className="gap-2">
            <FileUp className="h-4 w-4" />
            Import
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:w-auto sm:flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search forms..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredForms.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">
                  <Button 
                    variant="ghost" 
                    className="p-0 font-semibold text-muted-foreground hover:text-foreground"
                    onClick={() => handleSort('title')}
                  >
                    Form Title
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    className="p-0 font-semibold text-muted-foreground hover:text-foreground"
                    onClick={() => handleSort('status')}
                  >
                    Status
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    className="p-0 font-semibold text-muted-foreground hover:text-foreground"
                    onClick={() => handleSort('createdAt')}
                  >
                    Created
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    className="p-0 font-semibold text-muted-foreground hover:text-foreground"
                    onClick={() => handleSort('submissions')}
                  >
                    Submissions
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredForms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <Link
                        to={`/dashboard/forms/${form.id}/edit`}
                        className="hover:underline"
                      >
                        {form.title}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(form.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3" />
                      {form.createdAt}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <CheckCircle2 className="mr-1 h-3 w-3 text-muted-foreground" />
                      <span>{form.submissions}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <Link to={`/dashboard/forms/${form.id}/responses`}>
                          View
                        </Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link to={`/dashboard/forms/${form.id}/edit`} className="flex items-center cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/forms/${form.id}`} className="flex items-center cursor-pointer">
                              <FileText className="mr-2 h-4 w-4" />
                              Preview
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => duplicateForm(form.id)} className="flex items-center cursor-pointer">
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => deleteForm(form.id)}
                            className="text-destructive focus:text-destructive flex items-center cursor-pointer"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-accent/10">
          <div className="mb-4 p-3 rounded-full bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-1">No forms found</h3>
          <p className="text-muted-foreground text-center max-w-sm mb-6">
            {searchTerm || statusFilter !== 'all'
              ? "No forms match your current filters. Try changing your search or filter criteria."
              : "You haven't created any forms yet. Get started by creating your first form."}
          </p>
          <div className="flex gap-4">
            <Button asChild>
              <Link to="/dashboard/forms/new" className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Create Form
              </Link>
            </Button>
            <Button variant="outline" className="gap-2">
              <FileUp className="h-4 w-4" />
              Import Form
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forms;
