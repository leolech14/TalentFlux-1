import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Code2, FileCode, GitBranch } from "lucide-react";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { useToast } from "../hooks/use-toast";

export function CodeAssistant() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userMessage,
          context: "You are a code assistant for TalentFlux platform. Help users with technical questions, code reviews, debugging, and implementation details. Provide code examples when relevant. Focus on React, TypeScript, Node.js, and web development best practices."
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I apologize, but I'm having trouble connecting right now. Please try again later."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <Code2 className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Code Repository Assistant</h3>
            <p className="text-white/60 mb-4">Ask about the codebase, components, or implementation details.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-md mx-auto">
              <button
                onClick={() => setInput("What are the main components in this app?")}
                className="p-3 bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 transition-colors text-left"
              >
                <FileCode className="w-4 h-4 text-purple-400 mb-1" />
                <p className="text-sm text-white">Main components</p>
              </button>
              <button
                onClick={() => setInput("How does the authentication work?")}
                className="p-3 bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 transition-colors text-left"
              >
                <GitBranch className="w-4 h-4 text-purple-400 mb-1" />
                <p className="text-sm text-white">Authentication flow</p>
              </button>
            </div>
          </motion.div>
        )}
        
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: message.role === "user" ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl ${
                message.role === "user"
                  ? "bg-purple-500/20 text-white border border-purple-500/30"
                  : "bg-white/10 text-white border border-white/20"
              }`}
            >
              <pre className="text-sm whitespace-pre-wrap font-mono">{message.content}</pre>
            </div>
          </motion.div>
        ))}
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white/10 p-4 rounded-2xl border border-white/20">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-white/10 pt-4">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about components, architecture, or code..."
            className="flex-1 min-h-[60px] max-h-[120px] resize-none bg-white/10 border-white/20 text-white placeholder:text-white/50 font-mono text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-white/50 mt-2">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  );
} 