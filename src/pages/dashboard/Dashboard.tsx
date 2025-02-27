
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  PlusCircle, 
  Users, 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  FileUp,
  Loader2
} from "lucide-react";

// Mock data types
interface FormStats {
  total: number;
  active: number;
  draft: number;
  archived: number;
  recentSubmissions: number;
  totalSubmissions: number;
}

interface RecentForm {
  id: string;
  title: string;
  createdAt: string;
  submissions: number;
  status: 'active' | 'draft' | 'archived';
}

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<FormStats | null>(null);
  const [recentForms, setRecentForms] = useState<RecentForm[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock API call to fetch stats and recent forms
    const fetchDashboardData = async () => {
      try {
        // In a real app, these would be API calls
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

        // Mock stats
        const mockStats: FormStats = {
          total: 12,
          active: 8,
          draft: 3,
          archived: 1,
          recentSubmissions: 47,
          totalSubmissions: 1248
        };

        // Mock recent forms
        const mockRecentForms: RecentForm[] = [
          {
            id: "1",
            title: "Customer Feedback Survey",
            createdAt: "2023-05-15",
            submissions: 147,
            status: 'active'
          },
          {
            id: "2",
            title: "Product Registration Form",
            createdAt: "2023-06-22",
            submissions: 89,
            status: 'active'
          },
          {
            id: "3",
            title: "Event Registration",
            createdAt: "2023-07-10",
            submissions: 203,
            status: 'active'
          },
          {
            id: "4",
            title: "Employee Satisfaction Survey",
            createdAt: "2023-08-05",
            submissions: 42,
            status: 'draft'
          }
        ];

        setStats(mockStats);
        setRecentForms(mockRecentForms);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.name}!
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/dashboard/forms/new" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              New Form
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/dashboard/forms" className="gap-2">
              <FileText className="h-4 w-4" />
              View All Forms
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.active} active • {stats?.draft} drafts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalSubmissions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.recentSubmissions} in the last 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground mt-1">
              5% increase from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Completion Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3m 24s</div>
            <p className="text-xs text-muted-foreground mt-1">
              12s faster than previous month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Forms and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Forms</CardTitle>
            <CardDescription>
              Your most recently created forms and their submission counts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentForms.length > 0 ? (
                recentForms.map(form => (
                  <div 
                    key={form.id} 
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`rounded-full p-2 ${form.status === 'active' ? 'bg-primary/10 text-primary' : form.status === 'draft' ? 'bg-yellow-500/10 text-yellow-600' : 'bg-gray-500/10 text-gray-600'}`}>
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <Link 
                          to={`/dashboard/forms/${form.id}/edit`}
                          className="font-medium hover:underline block"
                        >
                          {form.title}
                        </Link>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            {form.createdAt}
                          </span>
                          <span>•</span>
                          <span className="flex items-center">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            {form.submissions} submissions
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/dashboard/forms/${form.id}/responses`}>View Responses</Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/forms/${form.id}`}>Preview</Link>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No forms created yet</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t bg-accent/10 flex justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {recentForms.length} of {stats?.total} forms
            </p>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/forms">View all forms</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start gap-2" asChild>
              <Link to="/dashboard/forms/new">
                <PlusCircle className="h-4 w-4" />
                Create new form
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <FileUp className="h-4 w-4" />
              Import PDF/Excel
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2" asChild>
              <Link to="/dashboard/settings">
                <Settings className="h-4 w-4" />
                Manage settings
              </Link>
            </Button>
            {user?.role === 'admin' && (
              <Button variant="outline" className="w-full justify-start gap-2" asChild>
                <Link to="/dashboard/users">
                  <Users className="h-4 w-4" />
                  Manage users
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

// Mocked Icon component for Settings since it was used but not imported
const Settings = (props: any) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
};
