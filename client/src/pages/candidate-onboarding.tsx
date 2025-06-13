import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Upload, Sparkles, FileText, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TranslatedText } from "@/components/TranslatedText";

export default function CandidateOnboarding() {
  const [, navigate] = useLocation();

  const handleUploadCV = () => {
    // Create a file input and trigger it
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Handle file upload logic here
        navigate('/dashboard');
      }
    };
    input.click();
  };

  const handleCreateWithAI = () => {
    navigate('/cv-assistant');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 dark:from-background dark:via-background dark:to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            <TranslatedText text="Welcome to TalentFlux" />
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            <TranslatedText text="Let's get started by setting up your professional profile. Choose how you'd like to create your CV." />
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload CV Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                  onClick={handleUploadCV}>
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/10 rounded-2xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Upload className="w-8 h-8 text-blue-500" />
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  <TranslatedText text="Upload Existing CV" />
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-center">
                  <TranslatedText text="Already have a CV? Upload it and we'll help you optimize it for better job matches." />
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    <TranslatedText text="Supports PDF, DOC, DOCX formats" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="w-4 h-4" />
                    <TranslatedText text="AI-powered optimization suggestions" />
                  </div>
                </div>

                <Button className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white">
                  <Upload className="w-4 h-4 mr-2" />
                  <TranslatedText text="Choose File" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Create with AI Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="h-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer relative overflow-hidden"
                  onClick={handleCreateWithAI}>
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-yellow-500/10 group-hover:from-purple-500/20 group-hover:via-pink-500/20 group-hover:to-yellow-500/20 transition-all duration-300" />
              
              <CardHeader className="text-center pb-6 relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Wand2 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  <TranslatedText text="Create with AI" />
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4 relative z-10">
                <p className="text-muted-foreground text-center">
                  <TranslatedText text="Let our AI assistant guide you through creating a professional CV from scratch with voice recording and smart suggestions." />
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <TranslatedText text="AI-powered content generation" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Wand2 className="w-4 h-4 text-pink-500" />
                    <TranslatedText text="Voice recording support" />
                  </div>
                </div>

                <Button className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg">
                  <Sparkles className="w-4 h-4 mr-2" />
                  <TranslatedText text="Start AI Creation" />
                </Button>
              </CardContent>
              
              {/* Floating particles effect */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-60"
                  style={{
                    left: `${20 + i * 30}%`,
                    top: `${30 + i * 20}%`,
                  }}
                  animate={{
                    y: [-10, 10, -10],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 2 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3,
                  }}
                />
              ))}
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-muted-foreground">
            <TranslatedText text="You can always change or update your CV later from your dashboard." />
          </p>
          <Button
            variant="ghost"
            className="mt-4 text-muted-foreground hover:text-foreground"
            onClick={() => navigate('/dashboard')}
          >
            <TranslatedText text="Skip for now" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}