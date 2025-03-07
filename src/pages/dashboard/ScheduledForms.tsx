
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  FileText, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Calendar as CalendarIcon, 
  Edit, 
  Trash2, 
  Eye 
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Types for a scheduled form
interface ScheduledForm {
  id: string;
  formId: string;
  formTitle: string;
  startDate: string; // ISO string
  endDate: string | null; // ISO string, null if no end date
  startTime: string; // HH:MM format
  endTime: string | null; // HH:MM format, null if no end time
  status: 'active' | 'scheduled' | 'expired' | 'paused';
  description?: string;
  responseLimit?: number | null; // null if unlimited
  repeatInterval?: 'none' | 'daily' | 'weekly' | 'monthly';
  recurrence?: {
    days?: number[]; // days of week (0-6)
    endAfterOccurrences?: number;
    endAfterDate?: string;
  };
  createdAt: string;
  updatedAt: string;
}

const ScheduledForms = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreatingSchedule, setIsCreatingSchedule] = useState(false);
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduledForm | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration
  const [scheduledForms, setScheduledForms] = useState<ScheduledForm[]>([
    {
      id: "sched-1",
      formId: "form-1",
      formTitle: "Customer Satisfaction Survey",
      startDate: "2023-07-15T00:00:00Z",
      endDate: "2023-08-15T00:00:00Z",
      startTime: "09:00",
      endTime: "17:00",
      status: "active",
      description: "Monthly customer satisfaction survey",
      responseLimit: 200,
      repeatInterval: "monthly",
      recurrence: {
        days: [1, 3, 5], // Monday, Wednesday, Friday
        endAfterOccurrences: 12,
      },
      createdAt: "2023-07-01T00:00:00Z",
      updatedAt: "2023-07-01T00:00:00Z",
    },
    {
      id: "sched-2",
      formId: "form-2",
      formTitle: "Employee Feedback Form",
      startDate: "2023-08-01T00:00:00Z",
      endDate: null,
      startTime: "08:00",
      endTime: null,
      status: "scheduled",
      description: "Quarterly employee feedback collection",
      responseLimit: null,
      repeatInterval: "none",
      recurrence: undefined,
      createdAt: "2023-07-05T00:00:00Z",
      updatedAt: "2023-07-05T00:00:00Z",
    },
    {
      id: "sched-3",
      formId: "form-3",
      formTitle: "Post-Event Feedback",
      startDate: "2023-06-20T00:00:00Z",
      endDate: "2023-06-27T00:00:00Z",
      startTime: "10:00",
      endTime: "20:00",
      status: "expired",
      description: "Feedback for annual company event",
      responseLimit: 150,
      repeatInterval: "none",
      recurrence: undefined,
      createdAt: "2023-06-15T00:00:00Z",
      updatedAt: "2023-06-15T00:00:00Z",
    },
    {
      id: "sched-4",
      formId: "form-4",
      formTitle: "Weekly Team Check-in",
      startDate: "2023-07-10T00:00:00Z",
      endDate: "2023-12-31T00:00:00Z",
      startTime: "14:00",
      endTime: "15:00",
      status: "active",
      description: "Regular team check-in form",
      responseLimit: null,
      repeatInterval: "weekly",
      recurrence: {
        days: [1], // Monday
        endAfterDate: "2023-12-31T00:00:00Z",
      },
      createdAt: "2023-07-05T00:00:00Z",
      updatedAt: "2023-07-05T00:00:00Z",
    },
  ]);

  // Filtered schedules based on search query and filter
  const filteredSchedules = scheduledForms.filter(schedule => {
    const matchesSearch = schedule.formTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (schedule.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    const matchesFilter = filterStatus === 'all' || schedule.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Function to create a new scheduled form
  const createScheduledForm = (data: Omit<ScheduledForm, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    // In a real app, this would be an API call
    setTimeout(() => {
      const newSchedule: ScheduledForm = {
        ...data,
        id: `sched-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setScheduledForms(prev => [...prev, newSchedule]);
      setIsLoading(false);
      setIsCreatingSchedule(false);
      
      toast({
        title: "Schedule created",
        description: "Your form has been scheduled successfully",
      });
    }, 1000);
  };

  // Function to update an existing scheduled form
  const updateScheduledForm = (id: string, data: Partial<ScheduledForm>) => {
    setIsLoading(true);
    // In a real app, this would be an API call
    setTimeout(() => {
      setScheduledForms(prev => 
        prev.map(schedule => 
          schedule.id === id 
            ? { ...schedule, ...data, updatedAt: new Date().toISOString() } 
            : schedule
        )
      );
      setIsLoading(false);
      setIsEditingSchedule(false);
      setSelectedSchedule(null);
      
      toast({
        title: "Schedule updated",
        description: "Your form schedule has been updated successfully",
      });
    }, 1000);
  };

  // Function to delete a scheduled form
  const deleteScheduledForm = (id: string) => {
    setIsLoading(true);
    // In a real app, this would be an API call
    setTimeout(() => {
      setScheduledForms(prev => prev.filter(schedule => schedule.id !== id));
      setIsLoading(false);
      
      toast({
        title: "Schedule deleted",
        description: "Your form schedule has been deleted successfully",
      });
    }, 1000);
  };

  // Render the status badge with appropriate color
  const StatusBadge = ({ status }: { status: ScheduledForm['status'] }) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case 'scheduled':
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Scheduled</Badge>;
      case 'expired':
        return <Badge variant="secondary" className="bg-gray-200 text-gray-700">Expired</Badge>;
      case 'paused':
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Paused</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Formatted date display
  const formatDateDisplay = (startDate: string, endDate: string | null) => {
    const start = new Date(startDate);
    
    if (!endDate) {
      return `${format(start, 'MMM d, yyyy')} - No end date`;
    }
    
    const end = new Date(endDate);
    return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`;
  };

  // Formatted time display
  const formatTimeDisplay = (startTime: string, endTime: string | null) => {
    if (!endTime) {
      return `${startTime} - No end time`;
    }
    return `${startTime} - ${endTime}`;
  };

  // Forms available for scheduling (mock data)
  const availableForms = [
    { id: "form-1", title: "Customer Satisfaction Survey" },
    { id: "form-2", title: "Employee Feedback Form" },
    { id: "form-3", title: "Post-Event Feedback" },
    { id: "form-4", title: "Weekly Team Check-in" },
    { id: "form-5", title: "Product Feedback Survey" },
    { id: "form-6", title: "Website Usability Test" },
  ];

  // Schedule form dialog content
  const ScheduleFormDialog = () => {
    const [formData, setFormData] = useState({
      formId: selectedSchedule?.formId || "",
      formTitle: selectedSchedule?.formTitle || "",
      startDate: selectedSchedule?.startDate.split('T')[0] || "",
      endDate: selectedSchedule?.endDate ? selectedSchedule.endDate.split('T')[0] : "",
      startTime: selectedSchedule?.startTime || "09:00",
      endTime: selectedSchedule?.endTime || "17:00",
      status: selectedSchedule?.status || "scheduled",
      description: selectedSchedule?.description || "",
      responseLimit: selectedSchedule?.responseLimit?.toString() || "",
      repeatInterval: selectedSchedule?.repeatInterval || "none",
    });

    const [hasEndDate, setHasEndDate] = useState(Boolean(selectedSchedule?.endDate));
    const [hasEndTime, setHasEndTime] = useState(Boolean(selectedSchedule?.endTime));
    const [hasResponseLimit, setHasResponseLimit] = useState(Boolean(selectedSchedule?.responseLimit));

    const handleFormInput = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
      // Validation
      if (!formData.formId || !formData.startDate || !formData.startTime) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      // Prepare data for submission
      const scheduleData = {
        formId: formData.formId,
        formTitle: formData.formTitle || availableForms.find(f => f.id === formData.formId)?.title || "",
        startDate: `${formData.startDate}T00:00:00Z`,
        endDate: hasEndDate && formData.endDate ? `${formData.endDate}T00:00:00Z` : null,
        startTime: formData.startTime,
        endTime: hasEndTime && formData.endTime ? formData.endTime : null,
        status: formData.status as 'active' | 'scheduled' | 'expired' | 'paused',
        description: formData.description,
        responseLimit: hasResponseLimit && formData.responseLimit 
          ? parseInt(formData.responseLimit) 
          : null,
        repeatInterval: formData.repeatInterval as 'none' | 'daily' | 'weekly' | 'monthly',
        // We can add recurrence details in a more advanced implementation
        recurrence: formData.repeatInterval !== 'none' 
          ? { days: [1, 3, 5] } // Default to Mon, Wed, Fri
          : undefined,
      };

      if (isEditingSchedule && selectedSchedule) {
        updateScheduledForm(selectedSchedule.id, scheduleData);
      } else {
        createScheduledForm(scheduleData);
      }
    };

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="formId">Select Form</Label>
          <Select
            name="formId"
            value={formData.formId}
            onValueChange={value => {
              handleSelectChange("formId", value);
              const selectedForm = availableForms.find(f => f.id === value);
              if (selectedForm) {
                handleSelectChange("formTitle", selectedForm.title);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a form" />
            </SelectTrigger>
            <SelectContent>
              {availableForms.map(form => (
                <SelectItem key={form.id} value={form.id}>{form.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleFormInput}
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="endDate">End Date</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasEndDate"
                  checked={hasEndDate}
                  onChange={e => setHasEndDate(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="hasEndDate" className="text-xs text-muted-foreground">
                  Set end date
                </Label>
              </div>
            </div>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleFormInput}
              disabled={!hasEndDate}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              name="startTime"
              type="time"
              value={formData.startTime}
              onChange={handleFormInput}
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="endTime">End Time</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasEndTime"
                  checked={hasEndTime}
                  onChange={e => setHasEndTime(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="hasEndTime" className="text-xs text-muted-foreground">
                  Set end time
                </Label>
              </div>
            </div>
            <Input
              id="endTime"
              name="endTime"
              type="time"
              value={formData.endTime}
              onChange={handleFormInput}
              disabled={!hasEndTime}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            name="status"
            value={formData.status}
            onValueChange={value => handleSelectChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="repeatInterval">Repeat</Label>
          <Select
            name="repeatInterval"
            value={formData.repeatInterval}
            onValueChange={value => handleSelectChange("repeatInterval", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select repeat interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Does not repeat</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="responseLimit">Response Limit</Label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="hasResponseLimit"
                checked={hasResponseLimit}
                onChange={e => setHasResponseLimit(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="hasResponseLimit" className="text-xs text-muted-foreground">
                Set limit
              </Label>
            </div>
          </div>
          <Input
            id="responseLimit"
            name="responseLimit"
            type="number"
            value={formData.responseLimit}
            onChange={handleFormInput}
            placeholder="Unlimited"
            disabled={!hasResponseLimit}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Input
            id="description"
            name="description"
            value={formData.description}
            onChange={handleFormInput}
            placeholder="Add a description for this schedule"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => {
            setIsCreatingSchedule(false);
            setIsEditingSchedule(false);
            setSelectedSchedule(null);
          }} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">◌</span>
                {isEditingSchedule ? "Updating..." : "Creating..."}
              </>
            ) : (
              isEditingSchedule ? "Update Schedule" : "Create Schedule"
            )}
          </Button>
        </DialogFooter>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scheduled Forms</h1>
          <p className="text-sm text-muted-foreground">Manage and schedule your forms for specific timeframes</p>
        </div>
        <Dialog open={isCreatingSchedule} onOpenChange={setIsCreatingSchedule}>
          <DialogTrigger asChild>
            <Button className="flex-1 sm:flex-none">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Schedule Form
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Schedule a Form</DialogTitle>
              <DialogDescription>
                Set when your form will be available for submissions
              </DialogDescription>
            </DialogHeader>
            <ScheduleFormDialog />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-96">
          <Input
            placeholder="Search scheduled forms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Schedules List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchedules.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-10 text-center border rounded-md">
            <CalendarClock className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Scheduled Forms Found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery || filterStatus !== 'all' 
                ? "Try changing your search or filter criteria"
                : "Start scheduling your forms to make them available at specific times"}
            </p>
            <Button onClick={() => setIsCreatingSchedule(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Schedule a Form
            </Button>
          </div>
        ) : (
          filteredSchedules.map(schedule => (
            <Card key={schedule.id} className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="relative pb-2">
                <div className="absolute right-4 top-4">
                  <StatusBadge status={schedule.status} />
                </div>
                <CardTitle className="text-lg font-medium">{schedule.formTitle}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {schedule.description || "No description provided"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pb-2">
                <div className="flex items-start gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span>
                    {formatDateDisplay(schedule.startDate, schedule.endDate)}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span>
                    {formatTimeDisplay(schedule.startTime, schedule.endTime)}
                  </span>
                </div>
                {schedule.repeatInterval !== 'none' && (
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs font-normal bg-primary/5">
                      {schedule.repeatInterval.charAt(0).toUpperCase() + schedule.repeatInterval.slice(1)} Repeat
                    </Badge>
                  </div>
                )}
                {schedule.responseLimit && (
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs font-normal">
                      Limit: {schedule.responseLimit} responses
                    </Badge>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between pt-2 pb-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => navigate(`/forms/${schedule.formId}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>View Form</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <div className="flex gap-2">
                  <Dialog open={isEditingSchedule && selectedSchedule?.id === schedule.id} 
                          onOpenChange={(open) => {
                            setIsEditingSchedule(open);
                            if (!open) setSelectedSchedule(null);
                          }}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => {
                        setSelectedSchedule(schedule);
                        setIsEditingSchedule(true);
                      }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px]">
                      <DialogHeader>
                        <DialogTitle>Edit Schedule</DialogTitle>
                        <DialogDescription>
                          Modify when this form will be available
                        </DialogDescription>
                      </DialogHeader>
                      <ScheduleFormDialog />
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" className="h-9 w-9 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Schedule</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this schedule? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => {}}>Cancel</Button>
                        <Button variant="destructive" onClick={() => deleteScheduledForm(schedule.id)}>Delete</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {schedule.status === "paused" ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" className="h-9 w-9 text-green-500" 
                            onClick={() => updateScheduledForm(schedule.id, { status: "active" })}>
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>Activate</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : schedule.status === "active" ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" className="h-9 w-9 text-yellow-500" 
                            onClick={() => updateScheduledForm(schedule.id, { status: "paused" })}>
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>Pause</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : null}
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ScheduledForms;
