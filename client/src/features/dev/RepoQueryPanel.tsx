import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Code, Search, Brain, Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RepoQueryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QueryResult {
  response: string;
  type: string;
  timestamp: Date;
}

export function RepoQueryPanel({ isOpen, onClose }: RepoQueryPanelProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<QueryResult[]>([]);
  const [repoStatus, setRepoStatus] = useState<{ available: boolean; indexed: boolean } | null>(null);
  const { toast } = useToast();

  const checkRepoStatus = async () => {
    try {
      const response = await fetch("/api/repo/status");
      const status = await response.json();
      setRepoStatus(status);
    } catch (error) {
      console.error("Failed to check repo status:", error);
    }
  };

  const handleQuery = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/repo/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Query failed");
      }

      const data = await response.json();
      const result: QueryResult = {
        response: data.response,
        type: data.type || "repo-query",
        timestamp: new Date()
      };

      setResults(prev => [result, ...prev]);
      setQuery("");

      toast({
        title: "Query completed",
        description: "Repository analysis complete",
        duration: 3000
      });
    } catch (error) {
      console.error("Repo query error:", error);
      toast({
        title: "Query failed",
        description: error instanceof Error ? error.message : "Failed to query repository",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Response copied to clipboard",
      duration: 2000
    });
  };

  const suggestedQueries = [
    "Explain the overall architecture of this TalentFlux application",
    "How does the authentication system work?",
    "Show me the database schema and relationships",
    "What UI components are available and how are they used?",
    "How is the AI assistant functionality implemented?",
    "Explain the CV generation and processing workflow",
    "What are the main API endpoints and their purposes?"
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-background/95 backdrop-blur-sm border border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">Repository AI Assistant</CardTitle>
              <p className="text-sm text-muted-foreground">
                Ask questions about the codebase, architecture, and implementation
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Status Check */}
          <div className="flex items-center gap-2 mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={checkRepoStatus}
              className="flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Check Status
            </Button>
            {repoStatus && (
              <div className="flex gap-2">
                <Badge variant={repoStatus.available ? "default" : "destructive"}>
                  {repoStatus.available ? "AI Available" : "AI Unavailable"}
                </Badge>
                <Badge variant="outline">
                  {repoStatus.indexed ? "Indexed" : "Live Analysis"}
                </Badge>
              </div>
            )}
          </div>

          {/* Query Input */}
          <div className="space-y-3">
            <Textarea
              placeholder="Ask about the codebase: architecture, components, database schema, API endpoints, implementation details..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-[100px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.ctrlKey) {
                  handleQuery();
                }
              }}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                Press Ctrl+Enter to send • AI analyzes code in real-time
              </span>
              <Button 
                onClick={handleQuery} 
                disabled={isLoading || !query.trim()}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Brain className="w-4 h-4" />
                )}
                Analyze
              </Button>
            </div>
          </div>

          {/* Suggested Queries */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">Suggested queries:</h4>
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setQuery(suggestion)}
                  className="text-xs h-8 px-3"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Query Results:</h4>
              {results.map((result, index) => (
                <Card key={index} className="bg-muted/30">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {result.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {result.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(result.response)}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="bg-background rounded-md p-3 max-h-[300px] overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm">
                        {result.response}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Help Text */}
          <div className="text-xs text-muted-foreground bg-muted/30 rounded-md p-3">
            <p className="font-medium mb-1">Tips for effective queries:</p>
            <ul className="space-y-1 ml-4">
              <li>• Ask about specific components or files</li>
              <li>• Request architecture explanations</li>
              <li>• Inquire about implementation patterns</li>
              <li>• Get guidance on extending functionality</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}