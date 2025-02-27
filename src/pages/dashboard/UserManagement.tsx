
import { useState, useEffect } from "react";
import { 
  Search, 
  UserPlus, 
  Filter, 
  MoreHorizontal, 
  Trash2,
  Shield,
  Mail,
  UserCheck,
  UserX,
  Loader2,
  PlusCircle,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// User data type
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'invited' | 'disabled';
  createdAt: string;
  lastLogin: string | null;
}

const UserManagement = () => {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // New user form
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: UserRole.VIEWER as UserRole,
  });
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock users data
        const mockUsers: User[] = [
          {
            id: "1",
            name: "Admin User",
            email: "admin@example.com",
            role: UserRole.ADMIN,
            status: "active",
            createdAt: "2023-01-15",
            lastLogin: "2023-06-22T14:30:00Z",
          },
          {
            id: "2",
            name: "John Editor",
            email: "john@example.com",
            role: UserRole.EDITOR,
            status: "active",
            createdAt: "2023-02-10",
            lastLogin: "2023-06-20T09:15:00Z",
          },
          {
            id: "3",
            name: "Lisa Viewer",
            email: "lisa@example.com",
            role: UserRole.VIEWER,
            status: "active",
            createdAt: "2023-03-05",
            lastLogin: "2023-06-18T16:45:00Z",
          },
          {
            id: "4",
            name: "Mark Smith",
            email: "mark@example.com",
            role: UserRole.EDITOR,
            status: "invited",
            createdAt: "2023-05-20",
            lastLogin: null,
          },
          {
            id: "5",
            name: "Sarah Johnson",
            email: "sarah@example.com",
            role: UserRole.VIEWER,
            status: "disabled",
            createdAt: "2023-04-12",
            lastLogin: "2023-05-30T11:20:00Z",
          }
        ];
        
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [toast]);
  
  // Filter users
  useEffect(() => {
    const result = users.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
    
    setFilteredUsers(result);
  }, [users, searchTerm, roleFilter, statusFilter]);
  
  // Add new user
  const addUser = async () => {
    if (!newUser.name || !newUser.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsAddingUser(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUserId = String(users.length + 1);
      
      const createdUser: User = {
        id: newUserId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: 'invited',
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: null,
      };
      
      setUsers([...users, createdUser]);
      
      setNewUser({
        name: "",
        email: "",
        role: UserRole.VIEWER,
      });
      
      setIsDialogOpen(false);
      
      toast({
        title: "User invited",
        description: `Invitation sent to ${newUser.email}.`,
      });
    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        title: "Error",
        description: "Failed to add user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingUser(false);
    }
  };
  
  // Update user role
  const updateUserRole = (userId: string, newRole: UserRole) => {
    setUsers(
      users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
    
    toast({
      title: "Role updated",
      description: "User role has been updated successfully.",
    });
  };
  
  // Toggle user status
  const toggleUserStatus = (userId: string) => {
    setUsers(
      users.map(user => {
        if (user.id === userId) {
          const newStatus = user.status === 'active' ? 'disabled' : 'active';
          return { ...user, status: newStatus };
        }
        return user;
      })
    );
    
    const user = users.find(u => u.id === userId);
    const action = user?.status === 'active' ? 'disabled' : 'activated';
    
    toast({
      title: `User ${action}`,
      description: `The user has been ${action} successfully.`,
    });
  };
  
  // Delete user
  const deleteUser = (userId: string) => {
    // Prevent deleting the last admin
    const adminCount = users.filter(u => u.role === UserRole.ADMIN).length;
    const user = users.find(u => u.id === userId);
    
    if (user?.role === UserRole.ADMIN && adminCount <= 1) {
      toast({
        title: "Action denied",
        description: "Cannot delete the last administrator account.",
        variant: "destructive",
      });
      return;
    }
    
    setUsers(users.filter(user => user.id !== userId));
    
    toast({
      title: "User deleted",
      description: "The user has been removed successfully.",
    });
  };
  
  // Resend invitation
  const resendInvitation = (email: string) => {
    toast({
      title: "Invitation resent",
      description: `A new invitation has been sent to ${email}.`,
    });
  };
  
  // Role badge component
  const RoleBadge = ({ role }: { role: UserRole }) => {
    switch (role) {
      case UserRole.ADMIN:
        return <Badge variant="default" className="bg-red-500 hover:bg-red-500/90">Admin</Badge>;
      case UserRole.EDITOR:
        return <Badge variant="default" className="bg-blue-500 hover:bg-blue-500/90">Editor</Badge>;
      case UserRole.VIEWER:
        return <Badge variant="secondary">Viewer</Badge>;
      default:
        return null;
    }
  };
  
  // Status badge component
  const StatusBadge = ({ status }: { status: 'active' | 'invited' | 'disabled' }) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>;
      case 'invited':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Invited</Badge>;
      case 'disabled':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Disabled</Badge>;
      default:
        return null;
    }
  };
  
  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };
  
  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={!hasPermission(UserRole.ADMIN)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite New User</DialogTitle>
              <DialogDescription>
                Send an invitation to a new user to join your organization.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) => setNewUser({ ...newUser, role: value as UserRole })}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.ADMIN}>Administrator</SelectItem>
                    <SelectItem value={UserRole.EDITOR}>Editor</SelectItem>
                    <SelectItem value={UserRole.VIEWER}>Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={addUser}
                disabled={isAddingUser}
              >
                {isAddingUser ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Invitation
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Invitation
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:w-auto sm:flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select 
            value={roleFilter} 
            onValueChange={setRoleFilter}
          >
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
              <SelectItem value={UserRole.EDITOR}>Editor</SelectItem>
              <SelectItem value={UserRole.VIEWER}>Viewer</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={statusFilter} 
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="invited">Invited</SelectItem>
              <SelectItem value="disabled">Disabled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading users...</span>
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt={user.name} />
                        <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={user.status} />
                  </TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell>{formatDate(user.lastLogin)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        
                        <DropdownMenuSeparator />
                        
                        {/* Role Change Options */}
                        <DropdownMenuItem 
                          onClick={() => updateUserRole(user.id, UserRole.ADMIN)}
                          disabled={!hasPermission(UserRole.ADMIN) || user.role === UserRole.ADMIN}
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Make Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => updateUserRole(user.id, UserRole.EDITOR)}
                          disabled={!hasPermission(UserRole.ADMIN) || user.role === UserRole.EDITOR}
                        >
                          <UserCheck className="mr-2 h-4 w-4" />
                          Make Editor
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => updateUserRole(user.id, UserRole.VIEWER)}
                          disabled={!hasPermission(UserRole.ADMIN) || user.role === UserRole.VIEWER}
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          Make Viewer
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        
                        {/* Resend Invitation */}
                        {user.status === 'invited' && (
                          <DropdownMenuItem 
                            onClick={() => resendInvitation(user.email)}
                            disabled={!hasPermission(UserRole.ADMIN)}
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            Resend Invitation
                          </DropdownMenuItem>
                        )}
                        
                        {/* Toggle Status */}
                        <DropdownMenuItem 
                          onClick={() => toggleUserStatus(user.id)}
                          disabled={!hasPermission(UserRole.ADMIN) || user.status === 'invited'}
                        >
                          {user.status === 'active' ? (
                            <>
                              <UserX className="mr-2 h-4 w-4" />
                              Disable User
                            </>
                          ) : (
                            <>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Activate User
                            </>
                          )}
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        
                        {/* Delete User */}
                        <DropdownMenuItem 
                          onClick={() => deleteUser(user.id)}
                          disabled={!hasPermission(UserRole.ADMIN)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
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
          <div className="mb-4 p-3 rounded-full bg-primary/10">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-1">No users found</h3>
          <p className="text-muted-foreground text-center max-w-sm mb-6">
            {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
              ? "No users match your search criteria. Try adjusting your filters."
              : "Get started by inviting users to your organization."}
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button disabled={!hasPermission(UserRole.ADMIN)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Invite First User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite New User</DialogTitle>
                <DialogDescription>
                  Send an invitation to a new user to join your organization.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value) => setNewUser({ ...newUser, role: value as UserRole })}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UserRole.ADMIN}>Administrator</SelectItem>
                      <SelectItem value={UserRole.EDITOR}>Editor</SelectItem>
                      <SelectItem value={UserRole.VIEWER}>Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={addUser}
                  disabled={isAddingUser}
                >
                  {isAddingUser ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Invitation
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Invitation
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
