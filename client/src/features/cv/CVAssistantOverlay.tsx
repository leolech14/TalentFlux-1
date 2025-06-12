import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Play, Pause, RotateCcw, FileText, Sparkles, Volume2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "../../hooks/use-toast";
import { Button } from "../../components/ui/button";

interface CVAssistantOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const CV_QUESTIONS = [
  "Tell me about your most recent job role and key responsibilities",
  "What major achievements or projects are you most proud of?",
  "Describe your technical skills and areas of expertise",
  "What education or certifications do you have?",
  "What type of role are you looking for next?",
  "Tell me about a challenge you overcame at work",
  "What makes you stand out from other candidates?",
  "Describe your leadership or teamwork experiences"
];

export function CVAssistantOverlay({ isOpen, onClose }: CVAssistantOverlayProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcription, setTranscription] = useState("");
  const { toast } = useToast();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording && intervalRef.current === null) {
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else if (!isRecording && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      toast({
        title: "Recording started",
        description: "Speak naturally about your experience",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to record your responses",
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingTime(0);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const { transcription } = await response.json();
        setTranscription(transcription);
        
        // Add to responses
        const newResponses = [...responses];
        newResponses[currentQuestion] = transcription;
        setResponses(newResponses);
        
        toast({
          title: "Response recorded",
          description: "Your answer has been transcribed and saved",
          duration: 3000,
        });
      } else {
        throw new Error('Transcription failed');
      }
    } catch (error) {
      toast({
        title: "Transcription failed",
        description: "Please try recording again",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < CV_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setTranscription("");
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setTranscription(responses[currentQuestion - 1] || "");
    }
  };

  const readQuestion = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(CV_QUESTIONS[currentQuestion]);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      setIsPlaying(true);
      
      utterance.onend = () => setIsPlaying(false);
      speechSynthesis.speak(utterance);
    }
  };

  const generateCV = async () => {
    if (responses.filter(r => r && r.trim()).length < 3) {
      toast({
        title: "Need more information",
        description: "Please answer at least 3 questions to generate your CV",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    try {
      const response = await fetch('/api/cv/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses: responses.filter(r => r && r.trim()) }),
      });

      if (response.ok) {
        toast({
          title: "CV Generated Successfully!",
          description: "Your CV has been created and saved to your profile",
          duration: 4000,
        });
        onClose();
      } else {
        throw new Error('CV generation failed');
      }
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Please try again or contact support",
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          data-testid="cv-assistant-overlay"
        >
          {/* Enhanced backdrop with blur */}
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-lg"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* CV Assistant Panel with enhanced glass effect and golden glow */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.3, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.3, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Golden glow effect emerging from beneath */}
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/20 via-amber-500/30 to-orange-400/20 blur-xl opacity-75 animate-pulse" />
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-300/10 via-amber-400/20 to-orange-300/10 blur-lg opacity-90" />
              
              {/* Main card with enhanced glass effect and blurred edges */}
              <div className="relative bg-white/10 dark:bg-black/20 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                {/* Subtle gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/5 pointer-events-none" />
                
                <div className="relative p-8 space-y-6">
                  {/* Header with enhanced styling */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="p-2 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full shadow-lg"
                      >
                        <FileText className="w-5 h-5 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="text-2xl font-bold text-white drop-shadow-lg">CV Assistant</h3>
                        <p className="text-white/80 text-sm">AI-powered CV creation with voice input</p>
                      </div>
                    </div>
                    <div className="text-amber-400 font-medium">
                      Question {currentQuestion + 1} of {CV_QUESTIONS.length}
                    </div>
                  </div>

                  {/* Current question with enhanced styling */}
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-lg font-semibold text-white flex-1">
                        {CV_QUESTIONS[currentQuestion]}
                      </h4>
                      <Button
                        onClick={readQuestion}
                        disabled={isPlaying}
                        variant="ghost"
                        size="sm"
                        className="ml-3 text-amber-400 hover:text-amber-300 hover:bg-white/10"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </Button>
                    </div>
                    
                    {/* Recording controls with enhanced styling */}
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <Button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`relative w-20 h-20 rounded-full transition-all duration-300 ${
                          isRecording 
                            ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30' 
                            : 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 shadow-lg shadow-amber-500/30'
                        }`}
                      >
                        {isRecording ? (
                          <MicOff className="w-8 h-8 text-white" />
                        ) : (
                          <Mic className="w-8 h-8 text-white" />
                        )}
                        {isRecording && (
                          <motion.div
                            className="absolute inset-0 border-4 border-white/30 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        )}
                      </Button>
                    </div>

                    {/* Recording timer */}
                    {isRecording && (
                      <div className="text-center">
                        <div className="text-red-400 font-mono text-lg">
                          Recording: {formatTime(recordingTime)}
                        </div>
                        <div className="text-white/60 text-sm mt-1">
                          Tap the mic again to stop
                        </div>
                      </div>
                    )}

                    {/* Transcription display */}
                    {transcription && (
                      <div className="mt-4 p-4 bg-white/10 rounded-lg border border-white/20">
                        <h5 className="text-white font-medium mb-2">Your Response:</h5>
                        <p className="text-white/90 text-sm leading-relaxed">{transcription}</p>
                      </div>
                    )}
                  </div>

                  {/* Navigation and action buttons */}
                  <div className="flex items-center justify-between space-x-4">
                    <div className="flex space-x-2">
                      <Button
                        onClick={previousQuestion}
                        disabled={currentQuestion === 0}
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={nextQuestion}
                        disabled={currentQuestion === CV_QUESTIONS.length - 1}
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        Next
                      </Button>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => {
                          setCurrentQuestion(0);
                          setResponses([]);
                          setTranscription("");
                        }}
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                      </Button>
                      <Button
                        onClick={generateCV}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30"
                        disabled={responses.filter(r => r && r.trim()).length < 3}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Generate CV
                      </Button>
                    </div>
                  </div>

                  {/* Progress indicator */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-white/70">
                      <span>Progress</span>
                      <span>{responses.filter(r => r && r.trim()).length}/{CV_QUESTIONS.length} answered</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 shadow-lg"
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${(responses.filter(r => r && r.trim()).length / CV_QUESTIONS.length) * 100}%` 
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}