import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, FileText, Upload, Wand2, User, Calendar } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import type { Cv } from "@shared/schema";
import { useState } from "react";
import { CVAIAssistantPanel } from "../cv/CVAIAssistantPanel";

export function CVWidget() {
  const [, setLocation] = useLocation();
  const { profile } = useUserProfile();

  const { data: cv, isLoading } = useQuery<Cv | null>({
    queryKey: ['/api/cvs/candidate', profile.id],
    queryFn: async (): Promise<Cv | null> => {
      if (!profile.id) return null;

      const response = await fetch(`/api/cvs/candidate/${profile.id}`);
      if (response.status === 404) return null;
      if (!response.ok) throw new Error('Failed to fetch CV');

      return response.json();
    },
    enabled: !!profile.id
  });

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-flux-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (cv) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-flux-primary" />
            Your CV
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date(cv.updatedAt).toLocaleDateString()}
            </p>
            <div className="flex flex-wrap gap-2">
              {cv.skills?.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-flux-primary/10 text-flux-primary"
                >
                  {skill}
                </span>
              ))}
              {cv.skills && cv.skills.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{cv.skills.length - 3} more
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => setLocation('/dashboard?panel=cv-view')}
            >
              <FileText className="w-4 h-4 mr-1" />
              View CV
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setLocation('/dashboard?panel=cv-edit')}
            >
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full border-dashed border-2 border-flux-primary/20 bg-gradient-to-br from-flux-primary/5 to-purple-500/5">
      <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center space-y-4">
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2
          }}
          className="w-12 h-12 bg-flux-primary/10 rounded-full flex items-center justify-center"
        >
          <Sparkles className="w-6 h-6 text-flux-primary" />
        </motion.div>

        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Create Your CV</h3>
          <p className="text-sm text-muted-foreground">
            Use AI to build your professional CV from natural language
          </p>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <Button
            onClick={() => setLocation('/dashboard?panel=cv-ai-assistant')}
            className="w-full bg-flux-primary hover:bg-flux-primary/90 group relative overflow-hidden"
          >
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 2
              }}
              className="mr-2"
            >
              <Wand2 className="w-4 h-4" />
            </motion.div>
            Create with AI
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setLocation('/dashboard?panel=cv-upload')}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload File
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}