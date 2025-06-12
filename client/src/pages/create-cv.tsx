import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, FileText, Sparkles, CheckCircle } from "lucide-react";
import { cvCreationSchema, type CvCreationData } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useToast } from "@/hooks/use-toast";

export default function CreateCv() {
  const [, setLocation] = useLocation();
  const { profile } = useUserProfile();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [cvCreated, setCvCreated] = useState(false);

  const form = useForm<CvCreationData>({
    resolver: zodResolver(cvCreationSchema),
    defaultValues: {
      description: ""
    }
  });

  const createCvMutation = useMutation({
    mutationFn: async (data: CvCreationData) => {
      const response = await fetch("/api/cvs/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          candidateId: profile.id,
          userEmail: profile.email,
          userName: profile.name
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create CV");
      }

      return response.json();
    },
    onSuccess: () => {
      setCvCreated(true);
      queryClient.invalidateQueries({ queryKey: ['/api/cvs'] });
      toast({
        title: "CV Created Successfully",
        description: "Your CV has been generated from your description",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create CV",
        description: error.message || "Please try again with more details",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: CvCreationData) => {
    createCvMutation.mutate(data);
  };

  if (!profile.id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>
            Please log in to create your CV.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (cvCreated) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-flux-success/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-flux-success" />
            </div>
            <CardTitle className="text-2xl">CV Created Successfully!</CardTitle>
            <CardDescription>
              Your professional CV has been generated using AI and is ready to use
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your CV has been automatically structured with your experience, skills, and education.
              You can now view and edit it in your dashboard.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => setLocation("/dashboard")} className="bg-flux-primary hover:bg-flux-primary/90">
                <FileText className="w-4 h-4 mr-2" />
                View My CV
              </Button>
              <Button variant="outline" onClick={() => setLocation("/dashboard")}>
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCreateCV = () => {
    window.dispatchEvent(new Event('open-cv-assistant'));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8 text-center">
        <div className="mx-auto w-16 h-16 bg-flux-primary/10 rounded-full flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-flux-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Create Your CV with AI</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Tell us about your background in natural language, and our AI will create a professional CV for you
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tell Us About Yourself</CardTitle>
          <CardDescription>
            Describe your work experience, education, skills, and any other relevant information. 
            The more details you provide, the better your CV will be.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Background</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Example: I'm a software engineer with 5 years of experience at Google and Microsoft. I have a Computer Science degree from Stanford. I'm skilled in React, Node.js, Python, and cloud technologies. I led a team of 3 developers and built several high-impact products..."
                        className="min-h-[200px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h4 className="font-medium text-sm">💡 Tips for better results:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Include job titles, companies, and duration of employment</li>
                  <li>• Mention your education (degree, school, graduation year)</li>
                  <li>• List technical skills, programming languages, or tools</li>
                  <li>• Add any certifications, awards, or notable achievements</li>
                  <li>• Include languages you speak and proficiency levels</li>
                </ul>
              </div>

              <Button 
                type="submit" 
                disabled={createCvMutation.isPending}
                className="w-full bg-flux-primary hover:bg-flux-primary/90"
              >
                {createCvMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Your CV...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create My CV
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}