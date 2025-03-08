
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { connectDB } from "./services/mongoDBService";
import { useToast } from "./hooks/use-toast";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Public Pages
import LandingPage from "./pages/Index";
import NotFound from "./pages/NotFound";

// Dashboard Pages
import Dashboard from "./pages/dashboard/Dashboard";
import Forms from "./pages/dashboard/Forms";
import FormBuilder from "./pages/dashboard/FormBuilder";
import FormResponses from "./pages/dashboard/FormResponses";
import ViewForm from "./pages/dashboard/ViewForm";
import Settings from "./pages/dashboard/Settings";
import UserManagement from "./pages/dashboard/UserManagement";
import ScheduledForms from "./pages/dashboard/ScheduledForms";
import Reports from "./pages/dashboard/Reports";

const queryClient = new QueryClient();

const AppContent = () => {
  const { toast } = useToast();
  const [dbInitialized, setDbInitialized] = useState(false);

  // Initialize MongoDB connection
  useEffect(() => {
    const initMongoDB = async () => {
      try {
        await connectDB();
        setDbInitialized(true);
      } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        toast({
          title: "Database Connection Notice",
          description: "Running in browser environment with mock data",
        });
        // Even though there was an error, we're using mock data, so mark as initialized
        setDbInitialized(true);
      }
    };

    initMongoDB();
  }, [toast]);

  if (!dbInitialized) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-2">Initializing application...</span>
      </div>
    );
  }

  return (
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Dashboard Routes - Protected */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/forms" element={<Forms />} />
                <Route path="/dashboard/forms/new" element={<FormBuilder />} />
                <Route path="/dashboard/forms/:id/edit" element={<FormBuilder />} />
                <Route path="/dashboard/forms/:id/responses" element={<FormResponses />} />
                <Route path="/dashboard/scheduled-forms" element={<ScheduledForms />} />
                <Route path="/dashboard/reports" element={<Reports />} />
                <Route path="/dashboard/settings" element={<Settings />} />
                <Route path="/dashboard/users" element={<UserManagement />} />
              </Route>
            </Route>
            
            {/* Form View Route (Public) */}
            <Route path="/forms/:id" element={<ViewForm />} />
            
            {/* Catch All */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
};

export default App;
