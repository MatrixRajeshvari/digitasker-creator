
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      // Error is handled by the auth context
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">FormFlow</h1>
          <p className="text-muted-foreground">Reset your password</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              {isSubmitted 
                ? "Check your email for reset instructions" 
                : "Enter your email to receive a reset link"}
            </CardDescription>
          </CardHeader>
          
          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending email
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </Button>
                <Link
                  to="/login"
                  className="flex items-center justify-center text-sm text-primary underline-offset-4 hover:underline"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Back to login
                </Link>
              </CardFooter>
            </form>
          ) : (
            <CardContent className="space-y-6">
              <div className="p-4 bg-primary/10 rounded-md text-center">
                <p className="text-sm">
                  We've sent a password reset link to <strong>{email}</strong>.
                  Please check your email.
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <Button asChild variant="outline">
                  <Link to="/login">Back to login</Link>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail("");
                  }}
                >
                  Try another email
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
