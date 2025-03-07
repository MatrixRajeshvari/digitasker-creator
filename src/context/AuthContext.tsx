
import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ensureDBConnected } from "@/services/mongoDBService";
import { User, IUser } from "@/models/User";

// Define user roles
export enum UserRole {
  ADMIN = "admin",
  EDITOR = "editor",
  VIEWER = "viewer",
}

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  hasPermission: (requiredRole: UserRole) => boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          // In a real app, validate the token with your backend here
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function with MongoDB integration
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Connect to MongoDB
      await ensureDBConnected();

      // This would be an API call in a real app
      // For demo purposes, we're querying MongoDB directly from the frontend
      // In a production app, this should be done via a secure API

      // Since we are in the browser environment, direct MongoDB queries won't work
      // For demonstration, we'll use mock data that simulates a MongoDB response
      if (email === "admin@example.com" && password === "password") {
        const mockUser: User = {
          id: "1",
          email: "admin@example.com",
          name: "Admin User",
          role: UserRole.ADMIN,
          createdAt: new Date(),
        };
        
        localStorage.setItem("user", JSON.stringify(mockUser));
        setUser(mockUser);
        
        toast({
          title: "Logged in successfully",
          description: `Welcome back, ${mockUser.name}!`,
        });
        
        return;
      }
      
      // Simulate different user roles based on email
      if (email.includes("editor")) {
        const mockUser: User = {
          id: "2",
          email,
          name: "Editor User",
          role: UserRole.EDITOR,
          createdAt: new Date(),
        };
        
        localStorage.setItem("user", JSON.stringify(mockUser));
        setUser(mockUser);
        
        toast({
          title: "Logged in successfully",
          description: `Welcome back, ${mockUser.name}!`,
        });
        
        return;
      }
      
      if (email.includes("viewer")) {
        const mockUser: User = {
          id: "3",
          email,
          name: "Viewer User",
          role: UserRole.VIEWER,
          createdAt: new Date(),
        };
        
        localStorage.setItem("user", JSON.stringify(mockUser));
        setUser(mockUser);
        
        toast({
          title: "Logged in successfully",
          description: `Welcome back, ${mockUser.name}!`,
        });
        
        return;
      }
      
      throw new Error("Invalid credentials");
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid email or password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function with MongoDB integration
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Connect to MongoDB
      await ensureDBConnected();

      // This would be an API call in a real app
      // For demo purposes, we're simulating MongoDB response
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role: UserRole.VIEWER, // Default role for new users
        createdAt: new Date(),
      };
      
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
      
      toast({
        title: "Registration successful",
        description: `Welcome, ${name}!`,
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  // Forgot password
  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      // This would be an API call in a real app
      toast({
        title: "Reset email sent",
        description: "If your email exists in our system, you'll receive a password reset link.",
      });
    } catch (error) {
      toast({
        title: "Request failed",
        description: error instanceof Error ? error.message : "Failed to process your request",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (token: string, password: string) => {
    setIsLoading(true);
    try {
      // This would be an API call in a real app
      toast({
        title: "Password reset successful",
        description: "Your password has been reset. You can now log in with your new password.",
      });
    } catch (error) {
      toast({
        title: "Reset failed",
        description: error instanceof Error ? error.message : "Failed to reset password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has permission based on role
  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!user) return false;
    
    const roleHierarchy = {
      [UserRole.ADMIN]: 3,
      [UserRole.EDITOR]: 2,
      [UserRole.VIEWER]: 1,
    };
    
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
