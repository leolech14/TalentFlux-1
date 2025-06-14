import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Linkedin, Chrome, Apple } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

const employerFormSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  roleTitle: z.string().min(2, "Your role/title is required"),
  email: z.string().email("Please enter a valid email"),
});

type EmployerFormData = z.infer<typeof employerFormSchema>;

export default function OnboardingEmployer() {
  const [, navigate] = useLocation();

  const form = useForm<EmployerFormData>({
    resolver: zodResolver(employerFormSchema),
    defaultValues: {
      companyName: "",
      roleTitle: "",
      email: "",
    },
  });

  const onSubmit = (data: EmployerFormData) => {
    console.log("Employer registration:", data);
    // Navigate to dashboard after successful registration
    navigate("/dashboard");
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
          <Card className="shadow-xl border-0 bg-card bg-opacity-50 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                <Building className="text-white w-8 h-8" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold text-foreground">Join as an Employer</CardTitle>
                <p className="text-muted-foreground mt-2">
                  Find the best talent with AI-powered candidate matching
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your company name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="roleTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Role/Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. HR Manager, Recruiter, CEO" {...field} />
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
                        <FormLabel>Work Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your.email@company.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                    Create Company Profile
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