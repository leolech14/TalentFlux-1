import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { X, Send, MessageSquare, Code, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AssistantOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AssistantOverlay({ isOpen, onClose }: AssistantOverlayProps) {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"general" | "repo">("general");
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const endpoint = mode === "repo" ? "/api/repo/query" : "/api/ai/query";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });

      if (!res.ok) {
        throw new Error(`Failed to get response: ${res.statusText}`);
      }

      const data = await res.json();
      setResponse(data.response || data.message || "No response received");
    } catch (error) {
      console.error("Assistant query error:", error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden bg-background/95 backdrop-blur-sm border border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            AI Assistant
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Mode Selection */}
          <div className="flex gap-2">
            <Button
              variant={mode === "general" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("general")}
              className="flex items-center gap-2"
            >
              <Lightbulb className="w-4 h-4" />
              General
            </Button>
            <Button
              variant={mode === "repo" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("repo")}
              className="flex items-center gap-2"
            >
              <Code className="w-4 h-4" />
              Code Repository
            </Button>
          </div>

          {/* Query Input */}
          <div className="space-y-2">
            <Textarea
              placeholder={mode === "repo" 
                ? "Ask about the codebase, components, or implementation details..."
                : "How can I help you with TalentFlux today?"
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-[100px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.ctrlKey) {
                  handleSubmit();
                }
              }}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                Press Ctrl+Enter to send
              </span>
              <Button onClick={handleSubmit} disabled={isLoading || !query.trim()}>
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Send
              </Button>
            </div>
          </div>

          {/* Response */}
          {response && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Response:</h4>
              <div className="bg-muted/50 rounded-md p-3 max-h-[300px] overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm">{response}</pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}