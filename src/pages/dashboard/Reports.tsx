import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Download, BarChart3, PieChart, LineChart, TrendingUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from "recharts";

// Mock data for charts
const formSubmissionsData = [
  { name: "Jan", submissions: 65 },
  { name: "Feb", submissions: 59 },
  { name: "Mar", submissions: 80 },
  { name: "Apr", submissions: 81 },
  { name: "May", submissions: 56 },
  { name: "Jun", submissions: 55 },
  { name: "Jul", submissions: 40 },
  { name: "Aug", submissions: 70 },
  { name: "Sep", submissions: 90 },
  { name: "Oct", submissions: 110 },
  { name: "Nov", submissions: 95 },
  { name: "Dec", submissions: 70 }
];

const conversionRateData = [
  { name: "Jan", rate: 65 },
  { name: "Feb", rate: 59 },
  { name: "Mar", rate: 80 },
  { name: "Apr", rate: 81 },
  { name: "May", rate: 56 },
  { name: "Jun", rate: 55 },
  { name: "Jul", rate: 40 },
  { name: "Aug", rate: 50 },
  { name: "Sep", rate: 65 },
  { name: "Oct", rate: 75 },
  { name: "Nov", rate: 80 },
  { name: "Dec", rate: 60 }
];

const completionTimeData = [
  { name: "Jan", time: 4.5 },
  { name: "Feb", time: 5.2 },
  { name: "Mar", time: 4.8 },
  { name: "Apr", time: 4.2 },
  { name: "May", time: 3.8 },
  { name: "Jun", time: 3.5 },
  { name: "Jul", time: 3.2 },
  { name: "Aug", time: 3.0 },
  { name: "Sep", time: 2.8 },
  { name: "Oct", time: 2.5 },
  { name: "Nov", time: 2.3 },
  { name: "Dec", time: 2.1 }
];

const formDistributionData = [
  { name: "Active", value: 60, color: "#8B5CF6" },
  { name: "Draft", value: 25, color: "#F97316" },
  { name: "Archived", value: 15, color: "#71717A" }
];

const COLORS = ["#8B5CF6", "#F97316", "#71717A", "#0EA5E9"];

const topPerformingForms = [
  { id: "1", name: "Customer Feedback Survey", submissions: 452, conversionRate: "78%" },
  { id: "2", name: "Product Registration Form", submissions: 389, conversionRate: "65%" },
  { id: "3", name: "Event Registration", submissions: 352, conversionRate: "82%" },
  { id: "4", name: "Contact Request Form", submissions: 287, conversionRate: "59%" },
  { id: "5", name: "Newsletter Subscription", submissions: 264, conversionRate: "91%" },
];

const Reports = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("year");
  const [selectedFormType, setSelectedFormType] = useState("all");

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading reports...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Reports & Analytics</h1>
        <p className="text-muted-foreground">
          Visualize form performance and user engagement metrics
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="space-y-2 flex-1">
          <Label htmlFor="time-period">Time Period</Label>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger id="time-period">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="quarter">Last quarter</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 flex-1">
          <Label htmlFor="form-type">Form Type</Label>
          <Select value={selectedFormType} onValueChange={setSelectedFormType}>
            <SelectTrigger id="form-type">
              <SelectValue placeholder="Select form type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Forms</SelectItem>
              <SelectItem value="active">Active Forms</SelectItem>
              <SelectItem value="draft">Draft Forms</SelectItem>
              <SelectItem value="archived">Archived Forms</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 flex-1">
          <Label htmlFor="search-forms">Search Forms</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search-forms"
              type="text"
              placeholder="Search by form name..."
              className="pl-8"
            />
          </div>
        </div>

        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Report Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="w-full grid grid-cols-4 max-w-2xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,458</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  <span className="text-green-500 font-medium">12%</span> from last period
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">75.2%</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  <span className="text-green-500 font-medium">5.4%</span> from last period
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Completion Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2m 48s</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  <span className="text-green-500 font-medium">8.2%</span> faster than last period
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Forms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Out of 35 total forms
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Submissions Over Time</CardTitle>
                <CardDescription>Monthly submissions across all forms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={formSubmissionsData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}
                        labelStyle={{ color: 'var(--foreground)' }}
                      />
                      <Legend />
                      <Bar dataKey="submissions" fill="#8B5CF6" name="Submissions" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Form Distribution</CardTitle>
                <CardDescription>Breakdown of forms by status</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="h-[300px] w-full max-w-xs">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={formDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {formDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }} 
                        formatter={(value) => [`${value} forms`, ""]}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Rate Trend</CardTitle>
                <CardDescription>Percentage of visitors who submit forms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={conversionRateData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}
                        formatter={(value) => [`${value}%`, "Conversion Rate"]}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="rate" 
                        name="Conversion Rate" 
                        stroke="#F97316" 
                        strokeWidth={2} 
                        dot={{ r: 4 }} 
                        activeDot={{ r: 6 }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Completion Time Trend</CardTitle>
                <CardDescription>Average time to complete forms in minutes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={completionTimeData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}
                        formatter={(value) => [`${value} min`, "Avg. Completion Time"]}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="time" 
                        name="Completion Time" 
                        stroke="#0EA5E9" 
                        strokeWidth={2} 
                        dot={{ r: 4 }} 
                        activeDot={{ r: 6 }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Forms */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Forms</CardTitle>
              <CardDescription>Forms with the highest submission and conversion rates</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Form Name</TableHead>
                    <TableHead className="text-right">Submissions</TableHead>
                    <TableHead className="text-right">Conversion Rate</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topPerformingForms.map((form) => (
                    <TableRow key={form.id}>
                      <TableCell className="font-medium">{form.name}</TableCell>
                      <TableCell className="text-right">{form.submissions}</TableCell>
                      <TableCell className="text-right">{form.conversionRate}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs would be implemented in a similar way */}
        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle>Submission Analytics</CardTitle>
              <CardDescription>
                Detailed breakdown of form submissions over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={formSubmissionsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}
                      labelStyle={{ color: 'var(--foreground)' }}
                    />
                    <Legend />
                    <Bar dataKey="submissions" fill="#8B5CF6" name="Submissions" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                This chart shows the total number of form submissions across all forms for each month of the year.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversion">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Analytics</CardTitle>
              <CardDescription>
                Detailed breakdown of form conversion rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={conversionRateData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}
                      formatter={(value) => [`${value}%`, "Conversion Rate"]}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="rate" 
                      name="Conversion Rate" 
                      stroke="#F97316" 
                      strokeWidth={2} 
                      dot={{ r: 4 }} 
                      activeDot={{ r: 6 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                This chart shows the percentage of visitors who submit forms after viewing them.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forms">
          <Card>
            <CardHeader>
              <CardTitle>Form Analytics</CardTitle>
              <CardDescription>
                Distribution and performance metrics for all forms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={formDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {formDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }} 
                        formatter={(value) => [`${value} forms`, ""]}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Form Status Distribution</h3>
                  <ul className="space-y-3">
                    {formDistributionData.map((item) => (
                      <li key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                          <span>{item.name} Forms</span>
                        </div>
                        <span className="font-medium">{item.value}</span>
                      </li>
                    ))}
                    <li className="pt-2 border-t flex items-center justify-between">
                      <span className="font-medium">Total Forms</span>
                      <span className="font-medium">{formDistributionData.reduce((acc, item) => acc + item.value, 0)}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
