
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Download, Sparkles, FileText, Volume2, Play, Pause } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { useToast } from "../../hooks/use-toast";
import { useAuth } from "../../hooks/useAuth";
import { emitAIEvent } from "../../ai/emitAIEvent";

interface CVAIAssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
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
  }>;
}

const CV_QUESTIONS = [
  {
    id: "background",
    question: "Tell me about your professional background, experience, and key skills. Include your name, contact details, current or most recent role, and what makes you stand out professionally.",
    prompt: "Share your professional story - who you are, your experience, and what you excel at."
  },
  {
    id: "achievements",
    question: "What are your most significant professional achievements, projects, or accomplishments? Include specific examples with measurable results if possible.",
    prompt: "Describe your proudest professional moments and biggest wins."
  },
  {
    id: "goals",
    question: "What type of role are you seeking next? What are your career goals, preferred work environment, and what value would you bring to a new organization?",
    prompt: "Tell me about your career aspirations and ideal next opportunity."
  }
];

export function CVAIAssistantPanel({ isOpen, onClose }: CVAIAssistantPanelProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcription, setTranscription] = useState("");
  const [generatedCV, setGeneratedCV] = useState<CVData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setResponses([]);
      setTranscription("");
      setGeneratedCV(null);
      setShowWelcome(true);
      setRecordingTime(0);
    }
  }, [isOpen]);

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
      if (intervalRef.current) clearInterval(intervalRef.current);
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
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const { text } = await response.json();
        setTranscription(text);
        
        const newResponses = [...responses];
        newResponses[currentStep] = text;
        setResponses(newResponses);
        
        toast({
          title: "Response recorded",
          description: "Your answer has been transcribed and saved",
          duration: 3000,
        });

        // Emit AI event
        await emitAIEvent('cv-ai-response', {
          userId: user?.id?.toString() || 'anonymous',
          route: '/cv-ai-assistant',
          device: window.innerWidth < 768 ? 'mobile' : 'desktop',
          userAgent: navigator.userAgent,
          timestamp: new Date()
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
    } finally {
      setIsProcessing(false);
    }
  };

  const readQuestion = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(CV_QUESTIONS[currentStep].prompt);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      setIsPlaying(true);
      
      utterance.onend = () => setIsPlaying(false);
      speechSynthesis.speak(utterance);
    }
  };

  const nextQuestion = () => {
    if (currentStep < CV_QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
      setTranscription("");
    } else {
      generateCV();
    }
  };

  const generateCV = async () => {
    const validResponses = responses.filter(r => r && r.trim());
    if (validResponses.length < 2) {
      toast({
        title: "Need more information",
        description: "Please answer at least 2 questions to generate your CV",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/cv/generate-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          responses: validResponses,
          userId: user?.id 
        }),
      });

      if (response.ok) {
        const cvData = await response.json();
        setGeneratedCV(cvData);
        
        toast({
          title: "CV Generated Successfully!",
          description: "Your professional CV is ready for download",
          duration: 4000,
        });

        // Emit AI event for successful generation
        await emitAIEvent('cv-ai-generated', {
          userId: user?.id?.toString() || 'anonymous',
          route: '/cv-ai-assistant',
          device: window.innerWidth < 768 ? 'mobile' : 'desktop'
        });
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
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadCV = async () => {
    if (!generatedCV) return;

    try {
      const response = await fetch('/api/cv/download-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvData: generatedCV })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${generatedCV.personalInfo.fullName.replace(/\s+/g, '_')}_CV.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({
          title: "CV Downloaded",
          description: "Your professional CV has been saved as a PDF",
          duration: 3000,
        });

        await emitAIEvent('cv-ai-downloaded', {
          userId: user?.id?.toString() || 'anonymous',
          route: '/cv-ai-assistant',
          device: window.innerWidth < 768 ? 'mobile' : 'desktop'
        });
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Please try again",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-background border rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="p-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
                >
                  <FileText className="w-5 h-5 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-xl font-semibold">AI CV Assistant</h2>
                  <p className="text-sm text-muted-foreground">
                    Create your professional CV with voice guidance
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                ✕
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {showWelcome && !generatedCV ? (
                <div className="p-8 text-center space-y-6">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                    className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto"
                  >
                    <Sparkles className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Welcome to AI CV Creation</h3>
                    <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                      I'll help you create a professional CV using just your voice. Simply tap the microphone and speak naturally about your experience. I'll guide you through 3 key questions to build your perfect CV.
                    </p>
                  </div>

                  <div className="flex items-center justify-center space-x-4">
                    <Button
                      onClick={() => setShowWelcome(false)}
                      className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-8 py-3 text-lg"
                    >
                      <Mic className="w-5 h-5 mr-2" />
                      Start Speaking
                    </Button>
                  </div>
                </div>
              ) : generatedCV ? (
                <CVPreview cv={generatedCV} onDownload={downloadCV} />
              ) : (
                <div className="p-6 space-y-6">
                  {/* Progress Indicator */}
                  <div className="flex items-center gap-2 mb-6">
                    {CV_QUESTIONS.map((_, index) => (
                      <div
                        key={index}
                        className={`h-3 flex-1 rounded-full transition-colors ${
                          index <= currentStep ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Current Question */}
                  <Card className="border-yellow-200 dark:border-yellow-800">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-yellow-500" />
                          Question {currentStep + 1} of {CV_QUESTIONS.length}
                        </div>
                        <Button
                          onClick={readQuestion}
                          disabled={isPlaying}
                          variant="ghost"
                          size="sm"
                          className="text-yellow-600 hover:text-yellow-700"
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 p-4 rounded-lg">
                        <h4 className="font-medium mb-2 text-yellow-800 dark:text-yellow-200">
                          {CV_QUESTIONS[currentStep].prompt}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {CV_QUESTIONS[currentStep].question}
                        </p>
                      </div>

                      {/* Recording Controls */}
                      <div className="flex flex-col items-center space-y-4">
                        <Button
                          onClick={isRecording ? stopRecording : startRecording}
                          disabled={isProcessing}
                          className={`w-24 h-24 rounded-full transition-all duration-300 ${
                            isRecording 
                              ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30' 
                              : 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 shadow-lg shadow-yellow-500/30'
                          }`}
                        >
                          {isRecording ? (
                            <MicOff className="w-8 h-8 text-white" />
                          ) : (
                            <Mic className="w-8 h-8 text-white" />
                          )}
                        </Button>

                        {isRecording && (
                          <div className="text-center">
                            <div className="text-red-500 font-mono text-lg">
                              Recording: {formatTime(recordingTime)}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Tap the mic again to stop
                            </div>
                          </div>
                        )}

                        {isProcessing && (
                          <div className="text-center">
                            <div className="text-yellow-600 text-sm">
                              Processing your response...
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Transcription */}
                      {transcription && (
                        <div className="bg-muted p-4 rounded-lg">
                          <h5 className="font-medium mb-2">Your Response:</h5>
                          <p className="text-sm leading-relaxed">{transcription}</p>
                        </div>
                      )}

                      {/* Navigation */}
                      <div className="flex justify-between">
                        <Button
                          onClick={() => {
                            if (currentStep > 0) {
                              setCurrentStep(prev => prev - 1);
                              setTranscription(responses[currentStep - 1] || "");
                            }
                          }}
                          disabled={currentStep === 0}
                          variant="outline"
                        >
                          Previous
                        </Button>
                        
                        <Button
                          onClick={nextQuestion}
                          disabled={!transcription.trim() || isProcessing}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        >
                          {currentStep === CV_QUESTIONS.length - 1 ? (
                            <>
                              <FileText className="w-4 h-4 mr-2" />
                              Generate CV
                            </>
                          ) : (
                            "Next Question"
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function CVPreview({ cv, onDownload }: { cv: CVData; onDownload: () => void }) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Your Professional CV
        </h3>
        <Button onClick={onDownload} className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
      </div>

      <div className="bg-white text-black p-8 rounded-lg border shadow-sm space-y-6 max-h-[600px] overflow-y-auto">
        {/* Header */}
        <div className="text-center border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">{cv.personalInfo.fullName}</h1>
          <div className="text-gray-600 mt-2 space-y-1">
            <p className="text-lg">{cv.personalInfo.email} • {cv.personalInfo.phone}</p>
            <p>{cv.personalInfo.location}</p>
          </div>
        </div>

        {/* Professional Summary */}
        <div>
          <h2 className="text-xl font-bold mb-3 text-blue-800 border-b border-blue-200 pb-1">Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed">{cv.personalInfo.summary}</p>
        </div>

        {/* Experience */}
        {cv.experience.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-3 text-blue-800 border-b border-blue-200 pb-1">Professional Experience</h2>
            <div className="space-y-4">
              {cv.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-lg">{exp.title}</h3>
                    <span className="text-gray-600 font-medium">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <p className="text-gray-600 mb-2 font-medium">{exp.company} • {exp.location}</p>
                  <p className="text-gray-700 mb-2 leading-relaxed">{exp.description}</p>
                  {exp.achievements.length > 0 && (
                    <ul className="text-gray-700 list-disc list-inside space-y-1">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {cv.education.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-3 text-blue-800 border-b border-blue-200 pb-1">Education</h2>
            <div className="space-y-3">
              {cv.education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{edu.degree}</h3>
                      <p className="text-gray-600">{edu.institution} • {edu.location}</p>
                      {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                      {edu.honors && <p className="text-gray-600 font-medium">{edu.honors}</p>}
                    </div>
                    <span className="text-gray-600 font-medium">{edu.graduationDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        <div>
          <h2 className="text-xl font-bold mb-3 text-blue-800 border-b border-blue-200 pb-1">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cv.skills.technical.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Technical Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {cv.skills.technical.map((skill, i) => (
                    <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {cv.skills.soft.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Soft Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {cv.skills.soft.map((skill, i) => (
                    <span key={i} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {cv.skills.languages.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Languages</h4>
                <div className="flex flex-wrap gap-2">
                  {cv.skills.languages.map((lang, i) => (
                    <span key={i} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Certifications */}
        {cv.certifications.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-3 text-blue-800 border-b border-blue-200 pb-1">Certifications</h2>
            <div className="space-y-2">
              {cv.certifications.map((cert, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{cert.name}</h3>
                    <p className="text-gray-600">{cert.issuer}</p>
                  </div>
                  <span className="text-gray-600 font-medium">{cert.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
