import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Eye, EyeOff, Mail, Lock, Github, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { TranslatedText } from "@/components/TranslatedText";

export default function Login() {
  const [, navigate] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    // Simulate API call and role determination
    setTimeout(() => {
      setIsLoading(false);
      // Simulate role detection from login response
      const isEmployer = email.includes('company') || email.includes('employer') || email.includes('hr');
      
      if (isEmployer) {
        navigate("/dashboard"); // Direct to employer dashboard
      } else {
        navigate("/candidate-onboarding"); // Candidate gets onboarding screen
      }
    }, 1000);
  };

  const handleSocialLogin = (provider: 'google' | 'linkedin' | 'github') => {
    // Simulate social login and role determination
    setTimeout(() => {
      // For demo, LinkedIn suggests professional/employer use, others default to candidate
      if (provider === 'linkedin') {
        navigate("/dashboard"); // Employer dashboard
      } else {
        navigate("/candidate-onboarding"); // Candidate onboarding
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 dark:from-background dark:via-background dark:to-primary/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              <TranslatedText text="Welcome to TalentFlux" />
            </CardTitle>
            <p className="text-muted-foreground">
              <TranslatedText text="Sign in to access your account" />
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-3 h-11 hover:bg-blue-50 dark:hover:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                onClick={() => handleSocialLogin('google')}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <TranslatedText text="Continue with Gmail" />
              </Button>
              
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-3 h-11 hover:bg-blue-50 dark:hover:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                onClick={() => handleSocialLogin('linkedin')}
              >
                <Linkedin className="w-5 h-5 text-blue-600" />
                <TranslatedText text="Continue with LinkedIn" />
              </Button>
              
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-3 h-11 hover:bg-gray-50 dark:hover:bg-gray-950/20 border-gray-200 dark:border-gray-800"
                onClick={() => handleSocialLogin('github')}
              >
                <Github className="w-5 h-5" />
                <TranslatedText text="Continue with GitHub" />
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  <TranslatedText text="Or continue with email" />
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <TranslatedText text="Signing in..." />
                ) : (
                  <TranslatedText text="Sign In" />
                )}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              <TranslatedText text="Don't have an account?" />{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-primary hover:underline font-medium"
              >
                <TranslatedText text="Sign up" />
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}