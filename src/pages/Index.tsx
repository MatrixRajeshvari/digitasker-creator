
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, FormInput, Upload, BarChart3, Settings, Lock, Users } from "lucide-react";

const Index = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: FormInput,
      title: "Intuitive Form Builder",
      description: "Drag and drop interface to create customized forms with ease."
    },
    {
      icon: Upload,
      title: "PDF/Excel Import",
      description: "Upload existing forms and convert them to digital versions automatically."
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Get insights from your form submissions with real-time analytics."
    },
    {
      icon: Settings,
      title: "Customizable Settings",
      description: "Configure your forms with custom branding and advanced settings."
    },
    {
      icon: Lock,
      title: "Secure Data Storage",
      description: "All form data is encrypted and securely stored in MongoDB."
    },
    {
      icon: Users,
      title: "User Management",
      description: "Assign different roles to team members for granular control."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="w-full py-4 px-4 sm:px-6 lg:px-8 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold">FormFlow</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
              How It Works
            </a>
            <Link to={isAuthenticated ? "/dashboard" : "/login"} className="text-sm font-medium hover:text-primary transition-colors">
              {isAuthenticated ? "Dashboard" : "Sign In"}
            </Link>
            {!isAuthenticated && (
              <Button asChild size="sm">
                <Link to="/register">Get Started</Link>
              </Button>
            )}
          </nav>
          <Button asChild variant="ghost" size="sm" className="md:hidden">
            <Link to={isAuthenticated ? "/dashboard" : "/login"}>
              {isAuthenticated ? "Dashboard" : "Sign In"}
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-accent/20">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Form Builder Platform
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                Create digital forms with ease
              </h1>
              <p className="text-xl text-muted-foreground">
                Build, collect, and analyze form submissions with our intuitive platform. 
                Import existing PDF and Excel forms to get started quickly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link to="/register" className="gap-2">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            </div>
            <div className="flex-1 shadow-2xl rounded-xl overflow-hidden border">
              <img 
                src="https://placehold.co/600x400/f5f5f5/cccccc?text=Form+Builder+Preview" 
                alt="Form Builder Preview" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="w-full py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to create, manage, and analyze digital forms
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border transition-all hover:shadow-md">
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-accent/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">
              Get started in just a few simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-xl font-bold text-primary-foreground mb-4">
                  1
                </div>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>
                  Sign up and choose your role in the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our platform offers role-based access control, allowing you to manage permissions for your team members.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild>
                  <Link to="/register">Register Now</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="border border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-xl font-bold text-primary-foreground mb-4">
                  2
                </div>
                <CardTitle>Build Your Form</CardTitle>
                <CardDescription>
                  Use our drag-and-drop builder or import existing forms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our intuitive form builder makes it easy to create digital forms. You can also upload PDF or Excel files to convert them.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" disabled>
                  Try Builder
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="border border-primary/20">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-xl font-bold text-primary-foreground mb-4">
                  3
                </div>
                <CardTitle>Collect & Analyze</CardTitle>
                <CardDescription>
                  Share your form and collect submissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Share your form with a link, embed it on your website, or send it via email. Track submissions and analyze responses.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" disabled>
                  View Analytics
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
            Join thousands of users who build and manage digital forms with our platform
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/register">Create Free Account</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white hover:bg-white/10" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 px-4 sm:px-6 lg:px-8 border-t">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-bold">FormFlow</span>
              <p className="text-sm text-muted-foreground mt-1">
                © 2023 FormFlow. All rights reserved.
              </p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
