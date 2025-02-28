
import { useState } from "react";
import { 
  PlusIcon, 
  SearchIcon, 
  MoreHorizontalIcon, 
  CheckIcon, 
  XIcon,
  UserPlusIcon,
  MailIcon,
  RefreshCwIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
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
  TableRow 
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@/context/AuthContext";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'pending';
  lastActive: string;
}

const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([
    {
      id: "user_1",
      name: "Alex Johnson",
      email: "alex@example.com",
      role: UserRole.ADMIN,
      status: 'active',
      lastActive: "2023-06-15T10:30:00Z"
    },
    {
      id: "user_2",
      name: "Sarah Williams",
      email: "sarah@example.com",
      role: UserRole.EDITOR,
      status: 'active',
      lastActive: "2023-06-14T15:45:00Z"
    },
    {
      id: "user_3",
      name: "Michael Brown",
      email: "michael@example.com",
      role: UserRole.VIEWER,
      status: 'inactive',
      lastActive: "2023-06-10T08:20:00Z"
    },
    {
      id: "user_4",
      name: "Emily Davis",
      email: "emily@example.com",
      role: UserRole.EDITOR,
      status: 'active',
      lastActive: "2023-06-13T11:15:00Z"
    },
    {
      id: "user_5",
      name: "Chris Wilson",
      email: "chris@example.com",
      role: UserRole.VIEWER,
      status: 'pending',
      lastActive: ""
    }
  ]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: UserRole.VIEWER
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };
  
  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle new user form changes
  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle role change
  const handleRoleChange = (value: UserRole) => {
    setNewUser(prev => ({
      ...prev,
      role: value
    }));
  };
  
  // Add a new user
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUser.name || !newUser.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newUserId = `user_${users.length + 1}`;
      const createdUser: User = {
        id: newUserId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: 'pending',
        lastActive: ""
      };
      
      setUsers(prev => [...prev, createdUser]);
      setNewUser({
        name: "",
        email: "",
        role: UserRole.VIEWER
      });
      setIsSubmitting(false);
      setIsAddUserOpen(false);
      
      toast({
        title: "User Added",
        description: `An invitation has been sent to ${newUser.email}.`
      });
    }, 1000);
  };
  
  // Update user role
  const updateUserRole = (userId: string, newRole: UserRole) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, role: newRole } 
          : user
      )
    );
    
    toast({
      title: "Role Updated",
      description: `User role has been updated to ${newRole}.`
    });
  };
  
  // Change user status
  const updateUserStatus = (userId: string, newStatus: 'active' | 'inactive') => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, status: newStatus } 
          : user
      )
    );
    
    toast({
      title: "Status Updated",
      description: `User status has been set to ${newStatus}.`
    });
  };
  
  // Resend invitation
  const resendInvitation = (userEmail: string) => {
    toast({
      title: "Invitation Sent",
      description: `A new invitation has been sent to ${userEmail}.`
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Add, remove, and manage user permissions.
          </p>
        </div>
        <div className="w-full sm:w-auto flex gap-2">
          <div className="relative flex-1 sm:flex-initial">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8 w-full sm:w-[200px] lg:w-[300px]"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlusIcon className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleAddUser}>
                <DialogHeader>
                  <DialogTitle>Invite New User</DialogTitle>
                  <DialogDescription>
                    Invite a new user and assign them a role.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter user's full name"
                      value={newUser.name}
                      onChange={handleNewUserChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="user@example.com"
                      value={newUser.email}
                      onChange={handleNewUserChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select 
                      value={newUser.role} 
                      onValueChange={(value) => handleRoleChange(value as UserRole)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={UserRole.ADMIN}>Administrator</SelectItem>
                        <SelectItem value={UserRole.EDITOR}>Editor</SelectItem>
                        <SelectItem value={UserRole.VIEWER}>Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="font-medium">Administrators:</span> Full access to all features.<br />
                      <span className="font-medium">Editors:</span> Can create and edit forms, but cannot manage users.<br />
                      <span className="font-medium">Viewers:</span> Can only view forms and responses.
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">◌</span> Sending...
                      </>
                    ) : (
                      <>
                        <MailIcon className="mr-2 h-4 w-4" />
                        Send Invitation
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Manage users and their permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Select 
                        value={user.role} 
                        onValueChange={(value) => updateUserRole(user.id, value as UserRole)}
                      >
                        <SelectTrigger className="h-8 w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={UserRole.ADMIN}>Administrator</SelectItem>
                          <SelectItem value={UserRole.EDITOR}>Editor</SelectItem>
                          <SelectItem value={UserRole.VIEWER}>Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className={`h-2 w-2 rounded-full mr-2 ${
                          user.status === 'active' ? 'bg-green-500' : 
                          user.status === 'inactive' ? 'bg-gray-500' : 'bg-yellow-500'
                        }`}></span>
                        <span className="capitalize">{user.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(user.lastActive)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {user.status === 'active' ? (
                            <DropdownMenuItem onClick={() => updateUserStatus(user.id, 'inactive')}>
                              <XIcon className="mr-2 h-4 w-4" />
                              Deactivate
                            </DropdownMenuItem>
                          ) : user.status === 'inactive' ? (
                            <DropdownMenuItem onClick={() => updateUserStatus(user.id, 'active')}>
                              <CheckIcon className="mr-2 h-4 w-4" />
                              Activate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => resendInvitation(user.email)}>
                              <RefreshCwIcon className="mr-2 h-4 w-4" />
                              Resend Invite
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <div className="text-xs text-muted-foreground">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserManagement;
