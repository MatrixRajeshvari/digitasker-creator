
import { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/context/AuthContext";
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Users, 
  LogOut, 
  Moon, 
  Sun, 
  Menu, 
  X,
  PanelLeft,
  CalendarClock,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function DashboardLayout() {
  const { user, logout, hasPermission } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  
  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);
    
    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: LayoutDashboard,
      requiredRole: UserRole.VIEWER,
    },
    {
      path: "/dashboard/forms",
      name: "Forms",
      icon: FileText,
      requiredRole: UserRole.VIEWER,
    },
    {
      path: "/dashboard/scheduled-forms",
      name: "Scheduled Forms",
      icon: CalendarClock,
      requiredRole: UserRole.VIEWER,
    },
    {
      path: "/dashboard/reports",
      name: "Reports",
      icon: BarChart3,
      requiredRole: UserRole.VIEWER,
    },
    {
      path: "/dashboard/settings",
      name: "Settings",
      icon: Settings,
      requiredRole: UserRole.VIEWER,
    },
    {
      path: "/dashboard/users",
      name: "Users",
      icon: Users,
      requiredRole: UserRole.ADMIN,
    },
  ];

  // Filter nav items based on user roles
  const filteredNavItems = navItems.filter(item => 
    hasPermission(item.requiredRole)
  );

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map(name => name[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          "fixed inset-y-0 z-50 flex h-full flex-col border-r transition-all duration-300 ease-in-out lg:relative",
          isSidebarOpen ? "w-64" : "w-0 lg:w-20",
          "bg-slate-50 dark:bg-slate-900 shadow-md"
        )}
      >
        {/* Sidebar Content */}
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b px-4 border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              {isSidebarOpen && (
                <span className="text-xl font-semibold bg-gradient-to-r from-primary to-blue-500 text-transparent bg-clip-text">FormFlow</span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto hidden lg:flex text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <PanelLeft className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-6 px-3">
            <ul className="space-y-2">
              {filteredNavItems.map((item) => (
                <li key={item.path}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <NavLink
                          to={item.path}
                          className={({ isActive }) =>
                            cn(
                              "flex items-center rounded-md px-3 py-2.5 transition-all",
                              isActive 
                                ? "bg-primary/10 text-primary dark:bg-primary/20" 
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                            )
                          }
                        >
                          <item.icon className={cn(
                            "h-5 w-5",
                            location.pathname === item.path ? "text-primary" : "text-slate-500 dark:text-slate-400"
                          )} />
                          {isSidebarOpen && <span className={cn(
                            "ml-3 font-medium",
                            location.pathname === item.path ? "text-primary" : ""
                          )}>{item.name}</span>}
                        </NavLink>
                      </TooltipTrigger>
                      {!isSidebarOpen && (
                        <TooltipContent side="right" className="font-medium">{item.name}</TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="border-t p-4 border-slate-200 dark:border-slate-700 mt-auto">
            {isSidebarOpen ? (
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-700">
                  <AvatarImage src="" alt={user?.name || "User"} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{user?.name}</p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {user?.email}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="cursor-pointer">
                      {theme === "dark" ? (
                        <Sun className="mr-2 h-4 w-4" />
                      ) : (
                        <Moon className="mr-2 h-4 w-4" />
                      )}
                      {theme === "dark" ? "Light Mode" : "Dark Mode"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-9 w-9 cursor-pointer border border-slate-200 dark:border-slate-700">
                      <AvatarImage src="" alt={user?.name || "User"} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="cursor-pointer">
                      {theme === "dark" ? (
                        <Sun className="mr-2 h-4 w-4" />
                      ) : (
                        <Moon className="mr-2 h-4 w-4" />
                      )}
                      {theme === "dark" ? "Light Mode" : "Dark Mode"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="fixed inset-x-0 top-0 z-40 border-b bg-white/90 backdrop-blur-sm dark:bg-slate-900/90 dark:border-slate-700 lg:hidden">
        <div className="flex h-16 items-center px-4">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="text-slate-500">
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
          <span className="ml-3 text-lg font-semibold bg-gradient-to-r from-primary to-blue-500 text-transparent bg-clip-text">FormFlow</span>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer border border-slate-200 dark:border-slate-700">
                  <AvatarImage src="" alt={user?.name || "User"} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 mt-16 bg-background/80 backdrop-blur-sm lg:hidden">
          <nav className="fixed inset-x-0 top-16 z-40 h-[calc(100vh-4rem)] animate-in slide-in-from-left bg-white dark:bg-slate-900 p-4 border-r dark:border-slate-700 shadow-lg">
            <ul className="space-y-3">
              {filteredNavItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center rounded-md px-3 py-2.5 text-base transition-all",
                        isActive
                          ? "bg-primary/10 text-primary dark:bg-primary/20"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                      )
                    }
                  >
                    <item.icon className={cn(
                      "mr-3 h-5 w-5",
                      location.pathname === item.path ? "text-primary" : "text-slate-500 dark:text-slate-400"
                    )} />
                    <span className="font-medium">{item.name}</span>
                  </NavLink>
                </li>
              ))}
              <li className="pt-2 border-t dark:border-slate-700">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Logout
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className={cn(
        "flex-1 overflow-y-auto pt-16 lg:pt-0 transition-all duration-300",
        isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
      )}>
        <div className="container py-6 animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
