import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FaGoogle, FaLinkedin, FaApple } from "react-icons/fa";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocialLoginProps {
  onSuccess?: () => void;
}

export function SocialLogin({ onSuccess }: SocialLoginProps) {
  const { toast } = useToast();

  const handleSocialLogin = (provider: string) => {
    // Since we can't implement real OAuth without API keys,
    // we'll simulate the login flow
    toast({
      title: `${provider} Login`,
      description: `Redirecting to ${provider} authentication...`,
    });

    // Simulate successful login after a delay
    setTimeout(() => {
      toast({
        title: "Login Successful!",
        description: `Welcome back! You've been logged in with ${provider}.`,
      });
      onSuccess?.();
    }, 2000);
  };

  const socialProviders = [
    {
      name: "Google",
      icon: FaGoogle,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-500/10 hover:bg-red-500/20",
      onClick: () => handleSocialLogin("Google"),
    },
    {
      name: "LinkedIn",
      icon: FaLinkedin,
      color: "from-blue-600 to-blue-700",
      bgColor: "bg-blue-600/10 hover:bg-blue-600/20",
      onClick: () => handleSocialLogin("LinkedIn"),
    },
    {
      name: "Apple",
      icon: FaApple,
      color: "from-gray-800 to-gray-900",
      bgColor: "bg-gray-800/10 hover:bg-gray-800/20",
      onClick: () => handleSocialLogin("Apple"),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {socialProviders.map((provider, index) => (
          <motion.div
            key={provider.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              variant="outline"
              className={`w-full ${provider.bgColor} border-white/20 transition-all duration-300`}
              onClick={provider.onClick}
            >
              <provider.icon className="w-4 h-4" />
            </Button>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="relative"
      >
        <Button
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          onClick={() => handleSocialLogin("AI Assistant")}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Continue with AI CV Assistant
        </Button>
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-30 animate-pulse" />
      </motion.div>
    </div>
  );
} 