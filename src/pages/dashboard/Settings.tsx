
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Lock, 
  Bell, 
  Globe, 
  CreditCard, 
  Shield, 
  Save
} from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // User Profile State
  const [profile, setProfile] = useState({
    name: "Jane Smith",
    email: "jane.smith@example.com",
    company: "Acme Inc.",
    jobTitle: "Product Manager"
  });
  
  // Handle profile form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent, message: string) => {
    e.preventDefault();
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      
      toast({
        title: "Settings Saved",
        description: message
      });
    }, 1000);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile" className="flex gap-2 items-center">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="account" className="flex gap-2 items-center">
            <Lock className="h-4 w-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex gap-2 items-center">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex gap-2 items-center">
            <CreditCard className="h-4 w-4" />
            Billing
          </TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <form onSubmit={(e) => handleSubmit(e, "Your profile has been updated.")}>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={profile.name} 
                      onChange={handleProfileChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={profile.email}
                      onChange={handleProfileChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input 
                      id="company" 
                      name="company" 
                      value={profile.company}
                      onChange={handleProfileChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input 
                      id="jobTitle" 
                      name="jobTitle" 
                      value={profile.jobTitle}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        {/* Account Tab */}
        <TabsContent value="account" className="space-y-4">
          <Card>
            <form onSubmit={(e) => handleSubmit(e, "Your password has been updated.")}>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </CardFooter>
            </form>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Shield className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="font-medium">Two-factor authentication is disabled</p>
                  <p className="text-sm text-muted-foreground">
                    Enable two-factor authentication for enhanced security.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Enable 2FA</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <form onSubmit={(e) => handleSubmit(e, "Your notification preferences have been saved.")}>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose when and how to be notified.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive form submission notifications via email.
                      </p>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Form Activity Summary</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive a weekly summary of your form activity.
                      </p>
                    </div>
                    <input type="checkbox" className="toggle" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Product Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Stay updated on new features and improvements.
                      </p>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Preferences"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Plan</CardTitle>
              <CardDescription>
                You are currently on the free plan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4 bg-muted/30">
                <div className="flex justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">Free Plan</h3>
                    <p className="text-sm text-muted-foreground">Basic form functionality</p>
                  </div>
                  <div>
                    <span className="text-2xl font-bold">$0</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>Up to 3 forms</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>Basic form elements</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>100 responses per month</span>
                  </li>
                </ul>
              </div>
              
              <div className="rounded-lg border p-4">
                <div className="flex justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">Pro Plan</h3>
                    <p className="text-sm text-muted-foreground">Advanced features and higher limits</p>
                  </div>
                  <div>
                    <span className="text-2xl font-bold">$12</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>Unlimited forms</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>Advanced form elements</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>1,000 responses per month</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>Form logic and conditions</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>Remove branding</span>
                  </li>
                </ul>
                <Button className="mt-4 w-full">Upgrade to Pro</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
