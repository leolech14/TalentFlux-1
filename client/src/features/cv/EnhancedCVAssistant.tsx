import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Sparkles, ChevronDown, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  text: string;
  hint: string;
  category: string;
}

const guidedQuestions: Question[] = [
  {
    id: "1",
    text: "What's your full name and professional title?",
    hint: "Example: John Doe, Senior Software Engineer",
    category: "Personal Info"
  },
  {
    id: "2",
    text: "Tell me about your most recent work experience",
    hint: "Include company name, role, duration, and key achievements",
    category: "Experience"
  },
  {
    id: "3",
    text: "What are your top technical skills?",
    hint: "List programming languages, frameworks, tools you're proficient in",
    category: "Skills"
  },
  {
    id: "4",
    text: "Describe your educational background",
    hint: "Include degree, institution, graduation year, and relevant coursework",
    category: "Education"
  },
  {
    id: "5",
    text: "What are your career goals and aspirations?",
    hint: "Share what type of role you're looking for and your long-term goals",
    category: "Goals"
  }
];

export function EnhancedCVAssistant() {
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { toast } = useToast();
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up audio context for visualization
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      
      // Start visualization
      visualizeAudio();
      
      // Set up media recorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        chunks.push(e.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        // Here you would send to transcription API
        simulateTranscription();
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // Simulate real-time transcription
      simulateRealtimeTranscription();
    } catch (error) {
      toast({
        title: "Microphone Error",
        description: "Please allow microphone access to continue",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setAudioLevel(0);
    }
  };

  const visualizeAudio = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    setAudioLevel(average / 255 * 100);
    
    animationFrameRef.current = requestAnimationFrame(visualizeAudio);
  };

  const simulateRealtimeTranscription = () => {
    const words = ["I am", "a senior", "software engineer", "with 5 years", "of experience..."];
    let index = 0;
    
    const interval = setInterval(() => {
      if (index < words.length && isRecording) {
        setTranscript(prev => prev + (prev ? " " : "") + words[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 500);
  };

  const simulateTranscription = () => {
    const currentQ = guidedQuestions[currentQuestion];
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: transcript
    }));
    
    toast({
      title: "Answer Recorded!",
      description: "Moving to the next question...",
    });
    
    setTimeout(() => {
      if (currentQuestion < guidedQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setTranscript("");
      } else {
        toast({
          title: "CV Complete!",
          description: "Your AI-powered CV is ready for download",
        });
      }
    }, 1500);
  };

  const progress = ((currentQuestion + 1) / guidedQuestions.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-4xl mx-auto p-6"
    >
      <Card className="bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              AI CV Assistant
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {guidedQuestions.length}
              </span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6"
          >
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold mb-2">
                {guidedQuestions[currentQuestion].text}
              </h3>
              <p className="text-sm text-muted-foreground">
                {guidedQuestions[currentQuestion].hint}
              </p>
            </div>

            {/* Audio Visualization */}
            <div className="relative mb-8">
              <div className="h-32 bg-white/5 rounded-lg overflow-hidden relative">
                {isRecording && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20"
                    animate={{
                      scaleX: audioLevel / 100,
                    }}
                    style={{ originX: 0 }}
                    transition={{ duration: 0.1 }}
                  />
                )}
                
                <div className="absolute inset-0 flex items-center justify-center">
                  {isRecording ? (
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-6 h-6 text-purple-400 animate-pulse" />
                      <span className="text-sm text-purple-400">Listening...</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Click the microphone to start recording
                    </span>
                  )}
                </div>

                {/* Audio level bars */}
                {isRecording && (
                  <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-1 p-4">
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-purple-400 rounded-full"
                        animate={{
                          height: Math.random() * audioLevel * 0.5 + 10,
                        }}
                        transition={{
                          duration: 0.1,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Transcript Display */}
            {transcript && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10"
              >
                <p className="text-sm">{transcript}</p>
              </motion.div>
            )}

            {/* Recording Button */}
            <div className="flex justify-center">
              <motion.button
                className={`p-6 rounded-full ${
                  isRecording 
                    ? "bg-red-500 hover:bg-red-600" 
                    : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                } text-white shadow-2xl transition-all duration-300`}
                onClick={isRecording ? stopRecording : startRecording}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isRecording ? (
                  <MicOff className="w-8 h-8" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </motion.button>
            </div>

            {/* Skip Button */}
            <div className="flex justify-center mt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  if (currentQuestion < guidedQuestions.length - 1) {
                    setCurrentQuestion(prev => prev + 1);
                    setTranscript("");
                  }
                }}
              >
                Skip this question
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress Indicators */}
        <div className="p-6 border-t border-white/10">
          <div className="flex justify-center gap-2">
            {guidedQuestions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index <= currentQuestion
                    ? "bg-purple-500 w-8"
                    : "bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
} 