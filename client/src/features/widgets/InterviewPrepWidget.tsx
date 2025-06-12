import { motion } from "framer-motion";
import { Brain, Mic, FileText, Lightbulb, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface PrepTopic {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  duration: string;
  questions: string[];
}

const prepTopics: PrepTopic[] = [
  {
    id: "1",
    title: "Tell me about yourself",
    difficulty: "easy",
    duration: "2-3 min",
    questions: [
      "What's your background?",
      "Why are you interested in this role?",
      "What are your key strengths?"
    ]
  },
  {
    id: "2",
    title: "Technical Skills Assessment",
    difficulty: "medium",
    duration: "5-10 min",
    questions: [
      "Describe a challenging project",
      "How do you stay updated?",
      "Problem-solving approach"
    ]
  },
  {
    id: "3",
    title: "Behavioral Questions",
    difficulty: "hard",
    duration: "10-15 min",
    questions: [
      "Conflict resolution example",
      "Leadership experience",
      "Handling failure"
    ]
  }
];

export function InterviewPrepWidget() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isPracticing, setIsPracticing] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-500/20 text-green-400";
      case "medium": return "bg-yellow-500/20 text-yellow-400";
      case "hard": return "bg-red-500/20 text-red-400";
      default: return "";
    }
  };

  return (
    <Card className="h-full bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
            <Brain className="w-4 h-4 text-purple-400" />
          </div>
          Interview Prep Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!selectedTopic ? (
          <>
            <p className="text-sm text-muted-foreground mb-3">
              Practice common interview questions with AI feedback
            </p>
            {prepTopics.map((topic, index) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => setSelectedTopic(topic.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{topic.title}</h4>
                  <Badge className={`text-xs ${getDifficultyColor(topic.difficulty)}`}>
                    {topic.difficulty}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {topic.questions.length} questions
                  </span>
                  <span className="flex items-center gap-1">
                    <Play className="w-3 h-3" />
                    {topic.duration}
                  </span>
                </div>
              </motion.div>
            ))}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Practice Session</h4>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setSelectedTopic(null);
                  setIsPracticing(false);
                }}
              >
                Back
              </Button>
            </div>
            
            <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">AI Tip</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Take a deep breath, speak clearly, and use the STAR method (Situation, Task, Action, Result) for behavioral questions.
              </p>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              onClick={() => setIsPracticing(!isPracticing)}
            >
              <Mic className="w-4 h-4 mr-2" />
              {isPracticing ? "Stop Practice" : "Start Practice"}
            </Button>

            {isPracticing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <p className="text-sm text-center text-muted-foreground">
                  🎤 Recording... Speak your answer clearly
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
} 