import { motion } from "framer-motion";
import { useState } from "react";
import { useLocation } from "wouter";
import { User, Building, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { api } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import { useUserProfile } from "../hooks/useUserProfile";

export default function Onboarding() {
  const [selectedUserType, setSelectedUserType] = useState<"candidate" | "employer" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, setUser } = useAuth();
  const { updateProfile } = useUserProfile();

  const handleComplete = async () => {
    if (!selectedUserType || !user) {
      toast({
        title: "Error",
        description: "Please select your role",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.auth.onboarding(user.id, {
        userType: selectedUserType,
        name: user.name,
        profileData: {},
      });
      
      setUser(response.user);
      updateProfile({
        ...response.user,
        onboardingComplete: true,
      });
      
      setLocation("/dashboard");
      
      toast({
        title: "Welcome to TalentFlux!",
        description: "Your account has been set up successfully.",
      });
    } catch (error) {
      toast({
        title: "Setup failed",
        description: "There was an error setting up your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-xl">
          <CardContent className="p-8">
            {/* Progress Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Let's get you set up</h2>
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
                  <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-primary to-purple-600 h-2 rounded-full transition-all duration-300 w-1/3"></div>
              </div>
            </div>
            
            {/* User Type Selection */}
            <div>
              <h3 className="text-xl font-semibold mb-6">What brings you to TalentFlux?</h3>
              <div className="grid gap-4 mb-8">
                <motion.label
                  className="group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="radio"
                    name="userType"
                    value="candidate"
                    checked={selectedUserType === "candidate"}
                    onChange={(e) => setSelectedUserType(e.target.value as "candidate")}
                    className="sr-only"
                  />
                  <div className={`p-6 border-2 rounded-xl transition-all ${
                    selectedUserType === "candidate"
                      ? "border-primary bg-primary/5"
                      : "border-slate-200 hover:border-primary/30"
                  }`}>
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        selectedUserType === "candidate"
                          ? "bg-primary text-white"
                          : "bg-primary/10 text-primary"
                      }`}>
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">I'm looking for a job</h4>
                        <p className="text-slate-600">Find opportunities that match your skills</p>
                      </div>
                    </div>
                  </div>
                </motion.label>
                
                <motion.label
                  className="group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="radio"
                    name="userType"
                    value="employer"
                    checked={selectedUserType === "employer"}
                    onChange={(e) => setSelectedUserType(e.target.value as "employer")}
                    className="sr-only"
                  />
                  <div className={`p-6 border-2 rounded-xl transition-all ${
                    selectedUserType === "employer"
                      ? "border-primary bg-primary/5"
                      : "border-slate-200 hover:border-primary/30"
                  }`}>
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        selectedUserType === "employer"
                          ? "bg-primary text-white"
                          : "bg-primary/10 text-primary"
                      }`}>
                        <Building className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">I'm hiring talent</h4>
                        <p className="text-slate-600">Find the perfect candidates for your team</p>
                      </div>
                    </div>
                  </div>
                </motion.label>
              </div>
              
              <Button
                onClick={handleComplete}
                disabled={!selectedUserType || isLoading}
                className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white flex items-center justify-center space-x-2"
              >
                <span>{isLoading ? "Setting up..." : "Continue"}</span>
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
