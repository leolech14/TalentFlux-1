import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Sparkles, Camera, Download, Mail, User, Phone, Calendar, MapPin, Check, AlertCircle, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { generateCVPDF } from "@/services/pdfGenerator";

type Step = "personal-info" | "voice-recording" | "photo-capture" | "preview";

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  location: string;
}

interface Question {
  id: string;
  text: string;
  hint: string;
  category: string;
}

const guidedQuestions: Question[] = [
  {
    id: "intro",
    text: "Tell me about yourself",
    hint: "Brief introduction",
    category: "personal"
  },
  {
    id: "experience",
    text: "What's your work experience?",
    hint: "Companies, roles, duration",
    category: "professional"
  },
  {
    id: "education",
    text: "What's your educational background?",
    hint: "Degrees, institutions, years",
    category: "education"
  },
  {
    id: "skills",
    text: "What are your key skills?",
    hint: "Technical & soft skills",
    category: "skills"
  },
  {
    id: "achievements",
    text: "What are your proudest achievements?",
    hint: "Projects, awards, impact",
    category: "achievements"
  },
  {
    id: "goals",
    text: "What are your career goals?",
    hint: "Future aspirations",
    category: "goals"
  }
];

export function EnhancedCVAssistant() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<Step>("personal-info");
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    location: ""
  });
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Question animation state
  const [visibleQuestions, setVisibleQuestions] = useState<number[]>([0]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const questionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Uint8Array[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);

  // WebSpeech API for real-time transcription
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
    }
  }, []);

  // Question rotation effect
  useEffect(() => {
    if (currentStep === "voice-recording" && isRecording && !isPaused) {
      // Start with first question visible
      setVisibleQuestions([0]);
      setCurrentQuestionIndex(0);

      // Set up interval to rotate questions
      const startQuestionRotation = () => {
        questionTimerRef.current = setInterval(() => {
          setCurrentQuestionIndex(prev => {
            const nextIndex = prev + 1;

            // Update visible questions (max 3)
            setVisibleQuestions(current => {
              const newVisible = [...current];

              // Add new question if not already visible
              if (!newVisible.includes(nextIndex) && nextIndex < guidedQuestions.length) {
                newVisible.push(nextIndex);
              }

              // Remove oldest question if more than 3
              if (newVisible.length > 3) {
                newVisible.shift();
              }

              return newVisible;
            });

            // Loop back to start if reached end
            return nextIndex >= guidedQuestions.length ? 0 : nextIndex;
          });
        }, 12000); // 12 seconds per question
      };

      // Start rotation after 1 second
      const timeout = setTimeout(startQuestionRotation, 1000);

      return () => {
        clearTimeout(timeout);
        if (questionTimerRef.current) {
          clearInterval(questionTimerRef.current);
        }
      };
    }
  }, [currentStep, isRecording, isPaused]);

  const handlePersonalInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (personalInfo.fullName && personalInfo.email && personalInfo.phone) {
      setCurrentStep("voice-recording");
      toast({
        title: "Great! Let's continue",
        description: "Now let's record your professional experience",
      });
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          const arrayBuffer = await event.data.arrayBuffer();
          audioChunksRef.current.push(new Uint8Array(arrayBuffer));
        }
      };

      mediaRecorderRef.current.start(100);
      setIsRecording(true);
      setIsPaused(false);
      visualizeAudio();
      startRealtimeTranscription();

      toast({
        title: "Recording started",
        description: "Answer the questions as they appear. You can pause anytime.",
      });
    } catch (error) {
      toast({
        title: "Microphone Error",
        description: "Please allow microphone access to continue",
        variant: "destructive"
      });
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
      setIsPaused(true);

      // Pause question rotation
      if (questionTimerRef.current) {
        clearInterval(questionTimerRef.current);
      }

      toast({
        title: "Recording paused",
        description: "Scroll through questions or click play to resume",
      });
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
      setIsPaused(false);

      // Resume question rotation
      questionTimerRef.current = setInterval(() => {
        setCurrentQuestionIndex(prev => {
          const nextIndex = prev + 1;
          setVisibleQuestions(current => {
            const newVisible = [...current];
            if (!newVisible.includes(nextIndex) && nextIndex < guidedQuestions.length) {
              newVisible.push(nextIndex);
            }
            if (newVisible.length > 3) {
              newVisible.shift();
            }
            return newVisible;
          });
          return nextIndex >= guidedQuestions.length ? 0 : nextIndex;
        });
      }, 12000);

      toast({
        title: "Recording resumed",
        description: "Continue answering the questions",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      // Clear question timer
      if (questionTimerRef.current) {
        clearInterval(questionTimerRef.current);
      }

      processTranscription();
    }
  };

  const visualizeAudio = () => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(streamRef.current!);
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const updateLevel = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setAudioLevel(average);

      if (isRecording && !isPaused) {
        animationFrameRef.current = requestAnimationFrame(updateLevel);
      }
    };

    updateLevel();
  };

  const startRealtimeTranscription = () => {
    if (recognitionRef.current) {
      let finalTranscript = '';

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        setCurrentTranscript(finalTranscript + interimTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };

      recognitionRef.current.start();
    }
  };

  const processTranscription = async () => {
    if (audioChunksRef.current.length > 0) {
      // Combine all chunks
      const totalLength = audioChunksRef.current.reduce((acc, chunk) => acc + chunk.length, 0);
      const combinedArray = new Uint8Array(totalLength);
      let offset = 0;

      for (const chunk of audioChunksRef.current) {
        combinedArray.set(chunk, offset);
        offset += chunk.length;
      }

      // Create blob from combined audio
      const audioBlob = new Blob([combinedArray], { type: 'audio/webm' });

      // Store the transcript
      setAnswers({
        voiceResponse: currentTranscript || "Voice response recorded"
      });

      toast({
        title: "Recording complete!",
        description: "Now let's capture your photo for the CV",
      });

      setTimeout(() => setCurrentStep("photo-capture"), 1500);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Please allow camera access to continue",
        variant: "destructive"
      });
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setPhotoData(dataUrl);

        // Stop camera
        if (videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
        }

        toast({
          title: "Photo captured!",
          description: "Generating your professional CV...",
        });

        generatePDF();
      }
    }
  };

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      // Process voice responses with AI to extract structured data
      const voiceResponse = answers.voiceResponse || '';

      // Send voice response to AI for processing
      let processedData;
      try {
        const response = await fetch('/api/cv/process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            personalInfo,
            voiceResponse,
            photoData
          })
        });

        if (response.ok) {
          processedData = await response.json();
        } else {
          throw new Error('AI processing failed');
        }
      } catch (error) {
        console.error('AI processing error:', error);
        // Fallback to basic processing
        processedData = {
          personalInfo: {
            name: personalInfo.fullName,
            title: "Professional",
            email: personalInfo.email,
            phone: personalInfo.phone,
            location: personalInfo.location,
            dateOfBirth: personalInfo.dateOfBirth,
            photo: photoData || undefined
          },
          summary: voiceResponse.substring(0, 300) + (voiceResponse.length > 300 ? "..." : ""),
          experience: [],
          education: [],
          skills: {
            technical: [],
            soft: [],
            languages: []
          }
        };
      }

      // Make sure photo is included in the data
      if (photoData && processedData.personalInfo) {
        processedData.personalInfo.photo = photoData;
      }

      const blob = generateCVPDF(processedData);
      setPdfBlob(blob);
      setCurrentStep("preview");
    } catch (error) {
      toast({
        title: "PDF Generation Error",
        description: "Failed to generate CV. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const downloadPDF = () => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${personalInfo.fullName.replace(/\s+/g, '_')}_CV.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "CV Downloaded!",
        description: "Your CV has been saved to your downloads folder",
      });
    }
  };

  const sendViaEmail = async (emailAddress?: string) => {
    if (pdfBlob) {
      const targetEmail = emailAddress || personalInfo.email;
      setIsSendingEmail(true);

      try {
        // Convert blob to base64
        const reader = new FileReader();
        reader.readAsDataURL(pdfBlob);
        reader.onloadend = async () => {
          const base64data = reader.result as string;

          const response = await fetch('/api/cv/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: targetEmail,
              pdfBase64: base64data,
              cvData: {
                personalInfo,
                answers
              }
            })
          });

          if (response.ok) {
            toast({
              title: "Email Sent!",
              description: `CV has been sent to ${targetEmail}`,
            });
            setShowEmailDialog(false);
            setCustomEmail("");
          } else {
            const error = await response.json();
            throw new Error(error.error || 'Failed to send email');
          }
        };
      } catch (error) {
        toast({
          title: "Email Error",
          description: error instanceof Error ? error.message : "Failed to send email. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsSendingEmail(false);
      }
    }
  };

  const scrollToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setVisibleQuestions([Math.max(0, index - 1), index, Math.min(guidedQuestions.length - 1, index + 1)]);
  };

  const progress = currentStep === "voice-recording"
    ? 50
    : currentStep === "photo-capture" ? 75
    : currentStep === "preview" ? 100
    : 25;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-5xl mx-auto p-3"
    >
      <Card className="bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden">
        {/* Header */}
        <div className="p-3 border-b border-white/10">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              AI CV Assistant
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                Step {currentStep === "personal-info" ? 1 : currentStep === "voice-recording" ? 2 : currentStep === "photo-capture" ? 3 : 4} of 4
              </span>
            </div>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Personal Information */}
          {currentStep === "personal-info" && (
            <motion.div
              key="personal-info"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4"
            >
              <div className="text-center mb-4">
                <User className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h3 className="text-base font-semibold mb-1">Let's start with your basic information</h3>
                <p className="text-xs text-muted-foreground">We need this to create your professional CV</p>
              </div>

              <form onSubmit={handlePersonalInfoSubmit} className="space-y-3 max-w-md mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Label htmlFor="fullName" className="text-xs">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={personalInfo.fullName}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="John Doe"
                    required
                    className="mt-1 h-8 text-sm"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label htmlFor="email" className="text-xs">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john.doe@example.com"
                    required
                    className="mt-1 h-8 text-sm"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label htmlFor="phone" className="text-xs">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                    required
                    className="mt-1 h-8 text-sm"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Label htmlFor="dateOfBirth" className="text-xs">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={personalInfo.dateOfBirth}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="mt-1 h-8 text-sm"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Label htmlFor="location" className="text-xs">Location</Label>
                  <Input
                    id="location"
                    value={personalInfo.location}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="San Francisco, CA"
                    className="mt-1 h-8 text-sm"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button type="submit" className="w-full h-9 text-sm bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Continue to Voice Recording
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          )}

          {/* Step 2: Voice Recording - Animated Questions */}
          {currentStep === "voice-recording" && (
            <motion.div
              key="voice-recording"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4"
            >
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold mb-1">
                  Tell us about yourself
                </h3>
                <p className="text-xs text-muted-foreground">
                  Answer the questions as they appear
                </p>
              </div>

              {/* Recording Controls */}
              <div className="flex justify-center gap-3 mb-4">
                {!isRecording ? (
                  <motion.button
                    className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-2xl transition-all duration-300"
                    onClick={startRecording}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Mic className="w-6 h-6" />
                  </motion.button>
                ) : (
                  <>
                    <motion.button
                      className={`p-3 rounded-full ${
                        isPaused
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-yellow-500 hover:bg-yellow-600"
                      } text-white shadow-xl transition-all duration-300`}
                      onClick={isPaused ? resumeRecording : pauseRecording}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isPaused ? (
                        <Play className="w-5 h-5" />
                      ) : (
                        <Pause className="w-5 h-5" />
                      )}
                    </motion.button>
                    <motion.button
                      className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-xl transition-all duration-300"
                      onClick={stopRecording}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <MicOff className="w-5 h-5" />
                    </motion.button>
                  </>
                )}
              </div>

              {/* Audio Visualization */}
              <div className="relative mb-4">
                <div className="h-20 bg-white/5 rounded-lg overflow-hidden relative">
                  {isRecording && !isPaused && (
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
                        <motion.div
                          animate={{ scale: isPaused ? 1 : [1, 1.2, 1] }}
                          transition={{ repeat: isPaused ? 0 : Infinity, duration: 1.5 }}
                        >
                          <Mic className="w-4 h-4 text-purple-400" />
                        </motion.div>
                        <span className="text-xs text-purple-400">
                          {isPaused ? "Paused - Scroll to review questions" : "Recording... Speak naturally"}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Click the microphone to start
                      </span>
                    )}
                  </div>

                  {/* Audio level bars */}
                  {isRecording && !isPaused && (
                    <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-0.5 p-2">
                      {[...Array(20)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-0.5 bg-purple-400 rounded-full"
                          animate={{
                            height: Math.random() * audioLevel * 0.3 + 5,
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

              {/* Animated Questions Container */}
              <div className="relative">
                <div
                  ref={scrollContainerRef}
                  className="relative h-64 overflow-hidden"
                >
                  {/* Questions */}
                  <div className="space-y-3 max-w-2xl mx-auto">
                    <AnimatePresence mode="popLayout">
                      {visibleQuestions.map((questionIndex) => {
                        const question = guidedQuestions[questionIndex];
                        if (!question) return null;

                        return (
                          <motion.div
                            key={question.id}
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              scale: 1,
                              transition: {
                                duration: 0.5,
                                ease: "easeOut"
                              }
                            }}
                            exit={{
                              opacity: 0,
                              y: -50,
                              scale: 0.9,
                              transition: {
                                duration: 0.5,
                                ease: "easeIn"
                              }
                            }}
                            className="bg-white/5 rounded-lg p-4 border border-white/10"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-semibold text-purple-400">{questionIndex + 1}</span>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-base mb-1">{question.text}</h4>
                                <p className="text-xs text-muted-foreground opacity-70">{question.hint}</p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Slim Scrollbar - Only visible when paused */}
                {isPaused && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="absolute right-0 top-0 h-full w-1 bg-white/10 rounded-full overflow-hidden"
                  >
                    <motion.div
                      className="w-full bg-purple-400/50 rounded-full cursor-pointer"
                      style={{
                        height: `${100 / guidedQuestions.length}%`,
                        y: `${(currentQuestionIndex / guidedQuestions.length) * 100}%`
                      }}
                      drag="y"
                      dragConstraints={{ top: 0, bottom: 0 }}
                      dragElastic={0}
                      onDrag={(_, info) => {
                        const percentage = info.point.y / scrollContainerRef.current!.offsetHeight;
                        const index = Math.round(percentage * (guidedQuestions.length - 1));
                        scrollToQuestion(Math.max(0, Math.min(guidedQuestions.length - 1, index)));
                      }}
                    />
                  </motion.div>
                )}
              </div>

              {/* Question Progress Dots */}
              <div className="flex justify-center gap-1 mt-4">
                {guidedQuestions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => isPaused && scrollToQuestion(index)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      visibleQuestions.includes(index)
                        ? "bg-purple-400 w-3"
                        : "bg-white/20"
                    } ${isPaused ? "cursor-pointer hover:bg-purple-300" : ""}`}
                    disabled={!isPaused}
                  />
                ))}
              </div>

              {isRecording && (
                <p className="text-center text-xs text-muted-foreground mt-3">
                  {isPaused ? "Click play to resume or stop to finish" : "Pause to scroll through questions"}
                </p>
              )}
            </motion.div>
          )}

          {/* Step 3: Photo Capture */}
          {currentStep === "photo-capture" && (
            <motion.div
              key="photo-capture"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4"
              onAnimationComplete={() => startCamera()}
            >
              <div className="text-center mb-3">
                <Camera className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h3 className="text-base font-semibold mb-1">Let's capture your professional photo</h3>
                <p className="text-xs text-muted-foreground">Position your face within the frame</p>
              </div>

              <div className="relative max-w-sm mx-auto">
                {/* Camera View */}
                <div className="relative rounded-lg overflow-hidden bg-black aspect-[3/4]">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />

                  {/* Face Frame Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-36 h-48 border-3 border-purple-400 rounded-full opacity-50" />
                  </div>

                  {/* Instructions */}
                  <div className="absolute top-2 left-0 right-0 text-center">
                    <div className="inline-flex items-center gap-1 bg-black/50 backdrop-blur px-3 py-1 rounded-full">
                      <AlertCircle className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-white">Good lighting • No glasses • No hats</span>
                    </div>
                  </div>
                </div>

                <canvas ref={canvasRef} className="hidden" />

                {/* Capture Button */}
                <motion.button
                  className="mt-3 w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-semibold shadow-xl text-sm"
                  onClick={capturePhoto}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Camera className="w-4 h-4 inline mr-2" />
                  Capture Photo
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Preview and Export */}
          {currentStep === "preview" && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4"
            >
              <div className="text-center mb-3">
                <Check className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <h3 className="text-base font-semibold mb-1">Your CV is ready!</h3>
                <p className="text-xs text-muted-foreground">Preview and download your professional CV</p>
              </div>

              {/* PDF Preview */}
              <div className="bg-white/10 rounded-lg p-3 mb-4">
                <div className="aspect-[8.5/11] bg-white rounded shadow-xl flex items-center justify-center overflow-hidden max-h-[400px]">
                  {isGeneratingPDF ? (
                    <div className="text-gray-400">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      >
                        <Sparkles className="w-6 h-6" />
                      </motion.div>
                      <p className="mt-2 text-sm">Generating PDF...</p>
                    </div>
                  ) : pdfBlob ? (
                    <iframe
                      src={URL.createObjectURL(pdfBlob)}
                      className="w-full h-full"
                      title="CV Preview"
                    />
                  ) : (
                    <div className="text-gray-400">
                      <p className="text-sm">CV Preview</p>
                      <p className="text-xs mt-1">{personalInfo.fullName}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Export Options */}
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  className="py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-semibold shadow-xl flex items-center justify-center gap-2 text-sm"
                  onClick={downloadPDF}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!pdfBlob}
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </motion.button>

                <motion.button
                  className="py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-semibold shadow-xl flex items-center justify-center gap-2 text-sm"
                  onClick={() => setShowEmailDialog(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!pdfBlob}
                >
                  <Mail className="w-4 h-4" />
                  Send via Email
                </motion.button>
              </div>

              {/* Email Dialog */}
              {showEmailDialog && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                  onClick={() => setShowEmailDialog(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-lg font-semibold mb-4">Send CV via Email</h3>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="sendToEmail" className="text-sm">Send to email address</Label>
                        <Input
                          id="sendToEmail"
                          type="email"
                          value={customEmail}
                          onChange={(e) => setCustomEmail(e.target.value)}
                          placeholder={personalInfo.email}
                          className="mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Leave empty to send to your email ({personalInfo.email})
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setShowEmailDialog(false)}
                          className="flex-1"
                          disabled={isSendingEmail}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => sendViaEmail(customEmail || personalInfo.email)}
                          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                          disabled={isSendingEmail}
                        >
                          {isSendingEmail ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="w-4 h-4 mr-2"
                              >
                                <Mail className="w-4 h-4" />
                              </motion.div>
                              Sending...
                            </>
                          ) : (
                            <>
                              <Mail className="w-4 h-4 mr-2" />
                              Send Email
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}