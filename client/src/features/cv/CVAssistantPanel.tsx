import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Send, Download, Eye, Sparkles, FileText, User } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { useToast } from "../../hooks/use-toast";
import { useAuth } from "../../hooks/useAuth";
import { emitAIEvent } from "../../ai/emitAIEvent";
import { recordFeedback } from "../../ai/recordFeedback";
import { SuccessNotification } from "../../components/SuccessNotification";
import { TranslatedText } from "../../components/TranslatedText";
import type { Cv } from "@shared/schema";

interface CVAssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedinUrl?: string;
    summary: string;
  };
  experience: Array<{
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location: string;
    graduationDate: string;
    gpa?: string;
    honors?: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
  };
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    credentialId?: string;
  }>;
}

const questions = [
  "Let's start with your basic information. What's your full name?",
  "What's your email address?", 
  "What's your phone number?",
  "What's your current location (city, country)?",
  "Tell me about your professional summary or career objective.",
  "Describe your most recent work experience, including job title, company, and key achievements.",
  "What are your top technical skills and proficiencies?",
  "Tell me about your educational background.",
  "What are some of your key accomplishments or projects you're proud of?",
  "Any certifications, awards, or additional information you'd like to include?"
];

export default function CVAssistantPanel({ isOpen, onClose }: CVAssistantPanelProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedCV, setGeneratedCV] = useState<CVData | null>(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close();
      }
    };
  }, []);

  const updateAudioLevel = () => {
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setAudioLevel(average / 255);
      
      if (isRecording) {
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up audio analysis
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      
      // Set up recording
      mediaRecorderRef.current = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        await transcribeAudio(audioBlob);
        
        // Clean up
        stream.getTracks().forEach(track => track.stop());
        if (audioContextRef.current?.state !== 'closed') {
          audioContextRef.current?.close();
        }
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      updateAudioLevel();
      
    } catch (error) {
      toast({
        title: "Recording failed",
        description: "Please check your microphone permissions",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Transcription failed');

      const { text } = await response.json();
      setCurrentInput(text);
      toast({
        title: "Audio transcribed",
        description: "You can edit the text before submitting",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Transcription failed",
        description: "Please try typing your response instead",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmitResponse = async () => {
    if (!currentInput.trim()) return;

    const newResponses = [...responses, currentInput];
    setResponses(newResponses);

    // Emit AI event for CV assistant interaction
    try {
      await emitAIEvent('cv-assistant-response', {
        userId: user?.id?.toString() || 'anonymous',
        route: '/cv-assistant',
        device: window.innerWidth < 768 ? 'mobile' : 'desktop',
        userAgent: navigator.userAgent,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Failed to emit AI event:', error);
    }

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
      setCurrentInput("");
    } else {
      // Generate CV
      await generateCV(newResponses);
    }
  };

  const generateCV = async (responses: string[]) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/cv/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses, userId: user?.id })
      });

      if (!response.ok) throw new Error('CV generation failed');

      const cvData = await response.json();
      setGeneratedCV(cvData);
      
      toast({
        title: "CV Generated!",
        description: "Your professional CV is ready for download",
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadCV = async () => {
    if (!generatedCV) return;
    
    try {
      const response = await fetch('/api/cv/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generatedCV)
      });

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${generatedCV.personalInfo.fullName.replace(/\s+/g, '_')}_CV.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setShowSuccessNotification(true);

      // Emit AI event for CV download
      if (user?.id) {
        await emitAIEvent('cv-downloaded', {
          userId: user?.id?.toString() || 'anonymous',
          route: '/cv-assistant',
          device: window.innerWidth < 768 ? 'mobile' : 'desktop'
        });
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <SuccessNotification
        isVisible={showSuccessNotification}
        onClose={() => setShowSuccessNotification(false)}
        title="CV Downloaded!"
        message="Your CV has been saved to your downloads folder. Preview and download your professional CV"
        onDownload={downloadCV}
      />
      
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative bg-white/10 dark:bg-gray-900/10 backdrop-blur-2xl rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-white/20 dark:border-gray-700/20"
          >
            {/* Glass frame effect with gradient */}
            <div className="absolute inset-0 rounded-2xl border border-white/30 dark:border-gray-400/30 pointer-events-none" />
            <div className="absolute inset-[1px] rounded-2xl border border-white/10 dark:border-gray-500/10 pointer-events-none" />
            
            {/* Inner glass background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent dark:from-gray-100/20 dark:via-gray-100/5 dark:to-transparent pointer-events-none" />
            
            <div className="relative flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10 dark:border-gray-700/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      <TranslatedText text="AI CV Assistant" />
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <TranslatedText text={`Step ${currentStep + 1} of ${questions.length}`} />
                    </p>
                  </div>
                </div>
                <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  ×
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {!generatedCV ? (
                  <div className="space-y-6">
                    {/* Current Question */}
                    <Card className="bg-white/20 dark:bg-gray-800/20 border-white/20 dark:border-gray-700/30 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                          <User className="w-5 h-5" />
                          <TranslatedText text="Question" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
                          <TranslatedText text={questions[currentStep]} />
                        </p>
                      </CardContent>
                    </Card>

                    {/* Response Input */}
                    <Card className="bg-white/20 dark:bg-gray-800/20 border-white/20 dark:border-gray-700/30 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <Textarea
                            value={currentInput}
                            onChange={(e) => setCurrentInput(e.target.value)}
                            placeholder="Type your response or use voice recording..."
                            className="min-h-32 bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-600/30 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                            disabled={isProcessing}
                          />
                          
                          <div className="flex items-center gap-3">
                            {!isRecording ? (
                              <Button
                                onClick={startRecording}
                                variant="outline"
                                size="sm"
                                className="bg-white/20 border-white/30 text-gray-900 dark:text-gray-100 hover:bg-white/30"
                                disabled={isProcessing}
                              >
                                <Mic className="w-4 h-4 mr-2" />
                                <TranslatedText text="Record" />
                              </Button>
                            ) : (
                              <Button
                                onClick={stopRecording}
                                variant="outline"
                                size="sm"
                                className="bg-red-500/20 border-red-400/30 text-red-600 dark:text-red-400 hover:bg-red-500/30"
                              >
                                <MicOff className="w-4 h-4 mr-2" />
                                <TranslatedText text="Stop" />
                              </Button>
                            )}
                            
                            {isRecording && (
                              <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <div
                                      key={i}
                                      className="w-1 bg-red-500 rounded-full transition-all duration-100"
                                      style={{
                                        height: `${Math.max(4, audioLevel * 20 + Math.random() * 8)}px`,
                                      }}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-red-600 dark:text-red-400">
                                  <TranslatedText text="Recording..." />
                                </span>
                              </div>
                            )}
                            
                            <Button
                              onClick={handleSubmitResponse}
                              disabled={!currentInput.trim() || isProcessing}
                              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                            >
                              {isProcessing ? (
                                <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin mr-2" />
                              ) : (
                                <Send className="w-4 h-4 mr-2" />
                              )}
                              <TranslatedText text={currentStep === questions.length - 1 ? "Generate CV" : "Next"} />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <CVPreview cv={generatedCV} onDownload={downloadCV} />
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

function CVPreview({ cv, onDownload }: { cv: CVData | null; onDownload: () => void }) {
  if (!cv) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <FileText className="w-5 h-5" />
          <TranslatedText text="Your Professional CV" />
        </h3>
        <div className="flex gap-2">
          <Button onClick={onDownload} className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <Download className="w-4 h-4 mr-2" />
            <TranslatedText text="Download PDF" />
          </Button>
        </div>
      </div>

      <div className="bg-white/20 dark:bg-gray-800/20 rounded-lg p-6 border border-white/20 dark:border-gray-700/30 backdrop-blur-sm max-h-96 overflow-y-auto">
        <div className="space-y-4 text-gray-900 dark:text-gray-100">
          <div>
            <h4 className="font-bold text-xl">{cv.personalInfo.fullName}</h4>
            <p className="text-gray-700 dark:text-gray-300">{cv.personalInfo.email} | {cv.personalInfo.phone}</p>
            <p className="text-gray-700 dark:text-gray-300">{cv.personalInfo.location}</p>
          </div>
          
          {cv.personalInfo.summary && (
            <div>
              <h5 className="font-semibold">
                <TranslatedText text="Professional Summary" />
              </h5>
              <p className="text-gray-700 dark:text-gray-300">{cv.personalInfo.summary}</p>
            </div>
          )}
          
          {cv.experience.length > 0 && (
            <div>
              <h5 className="font-semibold">
                <TranslatedText text="Experience" />
              </h5>
              {cv.experience.map((exp, i) => (
                <div key={i} className="mt-2">
                  <p className="font-medium">{exp.title} at {exp.company}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{exp.startDate} - {exp.endDate}</p>
                  <p className="text-gray-700 dark:text-gray-300">{exp.description}</p>
                </div>
              ))}
            </div>
          )}
          
          {cv.skills.technical.length > 0 && (
            <div>
              <h5 className="font-semibold">
                <TranslatedText text="Technical Skills" />
              </h5>
              <p className="text-gray-700 dark:text-gray-300">{cv.skills.technical.join(', ')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}