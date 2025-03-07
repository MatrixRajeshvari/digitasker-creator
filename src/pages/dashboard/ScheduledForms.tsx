
import { useState, useEffect } from "react";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MoreHorizontal,
  PlusCircle,
  Calendar,
  Search,
  Trash2,
  Pencil,
  Play,
  Pause,
  RotateCcw,
  Clock,
  FileText,
  Check,
  X,
  CalendarIcon
} from "lucide-react";
import { Loader2 } from "lucide-react";

// Schedule interface
interface Schedule {
  id: string;
  name: string;
  description?: string;
  formId: string;
  formName: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  startDate: string;
  endDate?: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  recipients: string[];
  lastSent?: string;
  nextSend?: string;
  createdAt: string;
  createdBy: string;
}

// Mock data generator
const generateMockSchedules = (): Schedule[] => {
  return [
    {
      id: "1",
      name: "Weekly Customer Satisfaction Survey",
      description: "Automatically send our customer satisfaction survey every Monday morning",
      formId: "101",
      formName: "Customer Satisfaction Survey",
      frequency: "weekly",
      startDate: "2023-05-01",
      status: "active",
      recipients: ["all-customers@lists.example.com"],
      lastSent: "2023-06-05",
      nextSend: "2023-06-12",
      createdAt: "2023-04-28",
      createdBy: "Admin User"
    },
    {
      id: "2",
      name: "Monthly Team Feedback",
      description: "Collect feedback from team members at the end of each month",
      formId: "102",
      formName: "Team Feedback Form",
      frequency: "monthly",
      startDate: "2023-03-01",
      status: "active",
      recipients: ["team@example.com"],
      lastSent: "2023-05-31",
      nextSend: "2023-06-30",
      createdAt: "2023-02-15",
      createdBy: "Admin User"
    },
    {
      id: "3",
      name: "Quarterly Performance Review",
      description: "Performance review forms sent to managers",
      formId: "103",
      formName: "Performance Review Form",
      frequency: "custom",
      startDate: "2023-01-15",
      status: "paused",
      recipients: ["managers@example.com"],
      lastSent: "2023-04-15",
      nextSend: "2023-07-15",
      createdAt: "2022-12-20",
      createdBy: "Admin User"
    },
    {
      id: "4",
      name: "Daily Project Update",
      description: "Daily project status update sent to project team",
      formId: "104",
      formName: "Project Update Form",
      frequency: "daily",
      startDate: "2023-06-01",
      endDate: "2023-07-31",
      status: "active",
      recipients: ["project-team@example.com"],
      lastSent: "2023-06-06",
      nextSend: "2023-06-07",
      createdAt: "2023-05-25",
      createdBy: "Admin User"
    },
    {
      id: "5",
      name: "New Employee Onboarding",
      description: "First day feedback form for new employees",
      formId: "105",
      formName: "Onboarding Feedback Form",
      frequency: "custom",
      startDate: "2023-02-10",
      status: "draft",
      recipients: [],
      createdAt: "2023-02-08",
      createdBy: "Admin User"
    }
  ];
};

const ScheduledForms = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [currentSchedule, setCurrentSchedule] = useState<Schedule | null>(null);
  
  // New schedule form state
  const [newSchedule, setNewSchedule] = useState<Partial<Schedule>>({
    name: "",
    formId: "",
    frequency: "weekly",
    startDate: new Date().toISOString().split('T')[0],
    status: "draft",
    recipients: []
  });
  
  // Load schedules (mock data)
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        setSchedules(generateMockSchedules());
      } catch (error) {
        console.error("Error fetching schedules:", error);
        toast({
          title: "Error",
          description: "Failed to load scheduled forms. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSchedules();
  }, [toast]);
  
  // Filter schedules based on search query and active tab
  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = 
      schedule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.formName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && schedule.status === activeTab;
  });
  
  // Handle schedule status change
  const handleStatusChange = (scheduleId: string, newStatus: Schedule["status"]) => {
    setSchedules(prev => 
      prev.map(schedule => 
        schedule.id === scheduleId 
          ? { ...schedule, status: newStatus } 
          : schedule
      )
    );
    
    const actionText = newStatus === "active" 
      ? "activated" 
      : newStatus === "paused" 
      ? "paused" 
      : "updated";
      
    toast({
      title: "Schedule " + actionText,
      description: `The schedule has been ${actionText} successfully.`
    });
  };
  
  // Handle schedule deletion
  const handleDeleteSchedule = () => {
    if (!currentSchedule) return;
    
    setSchedules(prev => prev.filter(schedule => schedule.id !== currentSchedule.id));
    setIsDeleteDialogOpen(false);
    setCurrentSchedule(null);
    
    toast({
      title: "Schedule deleted",
      description: "The schedule has been deleted successfully."
    });
  };
  
  // Handle create new schedule
  const handleCreateSchedule = () => {
    if (!newSchedule.name || !newSchedule.formId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const schedule: Schedule = {
      id: Math.random().toString(36).substring(2, 9),
      name: newSchedule.name!,
      description: newSchedule.description,
      formId: newSchedule.formId!,
      formName: "Sample Form", // In a real app, this would be fetched from the form data
      frequency: newSchedule.frequency as 'daily' | 'weekly' | 'monthly' | 'custom',
      startDate: newSchedule.startDate!,
      endDate: newSchedule.endDate,
      status: newSchedule.status as 'active' | 'paused' | 'completed' | 'draft',
      recipients: newSchedule.recipients || [],
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: user?.name || "User"
    };
    
    if (schedule.status === "active") {
      schedule.nextSend = schedule.startDate;
    }
    
    setSchedules(prev => [...prev, schedule]);
    setIsCreateDialogOpen(false);
    setNewSchedule({
      name: "",
      formId: "",
      frequency: "weekly",
      startDate: new Date().toISOString().split('T')[0],
      status: "draft",
      recipients: []
    });
    
    toast({
      title: "Schedule created",
      description: "Your new schedule has been created successfully."
    });
  };
  
  // Handle updating a schedule
  const handleUpdateSchedule = () => {
    if (!currentSchedule || !currentSchedule.name || !currentSchedule.formId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    setSchedules(prev => 
      prev.map(schedule => 
        schedule.id === currentSchedule.id 
          ? currentSchedule 
          : schedule
      )
    );
    
    setIsEditDialogOpen(false);
    setCurrentSchedule(null);
    
    toast({
      title: "Schedule updated",
      description: "The schedule has been updated successfully."
    });
  };
  
  // Status badge renderer
  const renderStatusBadge = (status: Schedule["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "paused":
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Paused</Badge>;
      case "completed":
        return <Badge variant="secondary">Completed</Badge>;
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      default:
        return null;
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading scheduled forms...</span>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scheduled Forms</h1>
          <p className="text-muted-foreground mt-1">
            Automate form distribution on a recurring schedule
          </p>
        </div>
        
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Schedule
        </Button>
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Tabs 
          defaultValue="all" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="paused">Paused</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative w-full sm:w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search schedules..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Schedules List */}
      {filteredSchedules.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-10">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <CalendarIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No scheduled forms found</h3>
            <p className="text-muted-foreground text-center mb-6">
              {searchQuery
                ? "No schedules match your search criteria. Try adjusting your filters."
                : "You haven't created any scheduled forms yet. Get started by creating your first schedule."}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Your First Schedule
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Form</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Next Send</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium">
                    <div>
                      {schedule.name}
                      {schedule.description && (
                        <p className="text-xs text-muted-foreground truncate max-w-xs">
                          {schedule.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link 
                      to={`/dashboard/forms/${schedule.formId}/edit`}
                      className="text-primary hover:underline flex items-center"
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      {schedule.formName}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span className="capitalize">{schedule.frequency}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {schedule.nextSend ? (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{schedule.nextSend}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Not scheduled</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {renderStatusBadge(schedule.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setCurrentSchedule(schedule);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        
                        {schedule.status === "active" ? (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(schedule.id, "paused")}
                          >
                            <Pause className="mr-2 h-4 w-4" />
                            Pause
                          </DropdownMenuItem>
                        ) : schedule.status === "paused" || schedule.status === "draft" ? (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(schedule.id, "active")}
                          >
                            <Play className="mr-2 h-4 w-4" />
                            Activate
                          </DropdownMenuItem>
                        ) : null}
                        
                        <DropdownMenuItem
                          onClick={() => {
                            setCurrentSchedule(schedule);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="text-destructive focus:bg-destructive/10"
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
      )}
      
      {/* Create Schedule Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Schedule</DialogTitle>
            <DialogDescription>
              Set up automated sending for your forms on a recurring schedule.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Schedule Name</Label>
              <Input
                id="name"
                value={newSchedule.name || ""}
                onChange={(e) => setNewSchedule({...newSchedule, name: e.target.value})}
                placeholder="Weekly Customer Feedback"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={newSchedule.description || ""}
                onChange={(e) => setNewSchedule({...newSchedule, description: e.target.value})}
                placeholder="Brief description of this schedule's purpose"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="form">Select Form</Label>
              <Select 
                value={newSchedule.formId} 
                onValueChange={(value) => setNewSchedule({...newSchedule, formId: value})}
              >
                <SelectTrigger id="form">
                  <SelectValue placeholder="Select a form" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="101">Customer Satisfaction Survey</SelectItem>
                  <SelectItem value="102">Team Feedback Form</SelectItem>
                  <SelectItem value="103">Performance Review Form</SelectItem>
                  <SelectItem value="104">Project Update Form</SelectItem>
                  <SelectItem value="105">Onboarding Feedback Form</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={newSchedule.frequency}
                  onValueChange={(value: any) => setNewSchedule({...newSchedule, frequency: value})}
                >
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="status">Initial Status</Label>
                <Select
                  value={newSchedule.status}
                  onValueChange={(value: any) => setNewSchedule({...newSchedule, status: value})}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newSchedule.startDate || ""}
                  onChange={(e) => setNewSchedule({...newSchedule, startDate: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newSchedule.endDate || ""}
                  onChange={(e) => setNewSchedule({...newSchedule, endDate: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="recipients">Recipients (Email, comma separated)</Label>
              <Input
                id="recipients"
                placeholder="user@example.com, team@example.com"
                value={newSchedule.recipients?.join(", ") || ""}
                onChange={(e) => setNewSchedule({
                  ...newSchedule, 
                  recipients: e.target.value.split(",").map(email => email.trim()).filter(Boolean)
                })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSchedule}>
              Create Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Schedule Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Schedule</DialogTitle>
            <DialogDescription>
              Update the settings for this scheduled form.
            </DialogDescription>
          </DialogHeader>
          
          {currentSchedule && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Schedule Name</Label>
                <Input
                  id="edit-name"
                  value={currentSchedule.name}
                  onChange={(e) => setCurrentSchedule({...currentSchedule, name: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description (Optional)</Label>
                <Input
                  id="edit-description"
                  value={currentSchedule.description || ""}
                  onChange={(e) => setCurrentSchedule({...currentSchedule, description: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-form">Form</Label>
                <Select 
                  value={currentSchedule.formId} 
                  onValueChange={(value) => setCurrentSchedule({...currentSchedule, formId: value})}
                >
                  <SelectTrigger id="edit-form">
                    <SelectValue placeholder="Select a form" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="101">Customer Satisfaction Survey</SelectItem>
                    <SelectItem value="102">Team Feedback Form</SelectItem>
                    <SelectItem value="103">Performance Review Form</SelectItem>
                    <SelectItem value="104">Project Update Form</SelectItem>
                    <SelectItem value="105">Onboarding Feedback Form</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-frequency">Frequency</Label>
                  <Select
                    value={currentSchedule.frequency}
                    onValueChange={(value: any) => setCurrentSchedule({...currentSchedule, frequency: value})}
                  >
                    <SelectTrigger id="edit-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={currentSchedule.status}
                    onValueChange={(value: any) => setCurrentSchedule({...currentSchedule, status: value})}
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-startDate">Start Date</Label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    value={currentSchedule.startDate}
                    onChange={(e) => setCurrentSchedule({...currentSchedule, startDate: e.target.value})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-endDate">End Date (Optional)</Label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    value={currentSchedule.endDate || ""}
                    onChange={(e) => setCurrentSchedule({...currentSchedule, endDate: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-recipients">Recipients</Label>
                <Input
                  id="edit-recipients"
                  placeholder="user@example.com, team@example.com"
                  value={currentSchedule.recipients.join(", ")}
                  onChange={(e) => setCurrentSchedule({
                    ...currentSchedule, 
                    recipients: e.target.value.split(",").map(email => email.trim()).filter(Boolean)
                  })}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSchedule}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Schedule</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this schedule? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {currentSchedule && (
            <div className="py-4 border rounded-md p-3 bg-muted/50">
              <p className="font-medium">{currentSchedule.name}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Form: {currentSchedule.formName}
              </p>
            </div>
          )}
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSchedule}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScheduledForms;
