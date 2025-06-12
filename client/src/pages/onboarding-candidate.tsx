import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, User, Linkedin, Chrome, Apple, Sparkles, Wand2, Info } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useUIState } from "@/hooks/useUIState";
import { HelpfulBanner } from "@/components/feedback/HelpfulBanner";

const candidateFormSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  desiredRole: z.string().min(2, "Desired role is required"),
  email: z.string().email("Please enter a valid email"),
  cv: z.instanceof(FileList).optional(),
});

type CandidateFormData = z.infer<typeof candidateFormSchema>;

export default function OnboardingCandidate() {
  const [, setLocation] = useLocation();
  const [dragOver, setDragOver] = useState(false);
  const { setAssistantOpen } = useUIState();

  const form = useForm<CandidateFormData>({
    resolver: zodResolver(candidateFormSchema),
    defaultValues: {
      fullName: "",
      desiredRole: "",
      email: "",
    },
  });

  const onSubmit = (data: CandidateFormData) => {
    console.log("Candidate registration:", data);
    // In a real app, this would save to the database and set user context
    // For now, just navigate to dashboard
    setLocation("/dashboard");
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files && files.length > 0) {
      form.setValue("cv", files);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 dark:from-background dark:via-background dark:to-primary/10">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16 pb-24 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                <User className="text-white w-8 h-8" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold text-foreground">Join as a Candidate</CardTitle>
                <p className="text-muted-foreground mt-2">
                  Find your next opportunity with AI-powered job matching
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="desiredRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Desired Role</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Senior React Developer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* CV Upload */}
                  <div className="space-y-2">
                    <Label>CV/Resume (Optional)</Label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                      }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragOver(false);
                        handleFileUpload(e.dataTransfer.files);
                      }}
                    >
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop your CV here, or click to browse
                      </p>
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        id="cv-upload"
                        onChange={(e) => handleFileUpload(e.target.files)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("cv-upload")?.click()}
                      >
                        Choose File
                      </Button>
                    </div>
                    
                    {/* Magic CV Creation Option */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or create with AI</span>
                      </div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="relative space-y-2"
                    >
                      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
                        <Info className="w-4 h-4 text-flux-primary" />
                        <span>Complete signup to unlock AI CV creation</span>
                      </div>
                      
                      <Button
                        type="button"
                        onClick={() => window.dispatchEvent(new Event("open-cv-assistant"))}
                        className="w-full"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Create CV with AI
                      </Button>
                    </motion.div>
                  </div>

                  {/* Social Import Options */}
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or connect with</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <Button type="button" variant="outline" className="flex items-center space-x-2">
                        <Linkedin className="w-4 h-4 text-blue-600" />
                        <span>LinkedIn</span>
                      </Button>
                      <Button type="button" variant="outline" className="flex items-center space-x-2">
                        <Chrome className="w-4 h-4 text-red-500" />
                        <span>Google</span>
                      </Button>
                      <Button type="button" variant="outline" className="flex items-center space-x-2">
                        <Apple className="w-4 h-4" />
                        <span>Apple</span>
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Create My Profile
                  </Button>
                </form>
              </Form>

              <p className="text-center text-sm text-muted-foreground">
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}