import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Sparkles, Camera, Download, Mail, User, Phone, Calendar, MapPin, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { generateCVPDF, generateMockCVData } from "@/services/pdfGenerator";

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
    id: "1",
    text: "What is your current role and professional experience?",
    hint: "Include your job title, company, and years of experience",
    category: "Experience"
  },
  {
    id: "2",
    text: "What are your key skills and areas of expertise?",
    hint: "Technical skills, tools, frameworks, and soft skills",
    category: "Skills"
  },
  {
    id: "3",
    text: "What is your educational background?",
    hint: "Degrees, institutions, certifications, and relevant coursework",
    category: "Education"
  },
  {
    id: "4",
    text: "What are your most significant achievements?",
    hint: "Specific accomplishments, metrics, or projects you're proud of",
    category: "Achievements"
  },
  {
    id: "5",
    text: "Tell us anything else about yourself",
    hint: "Feel free to share your career goals, hobbies, languages, or anything that makes you unique",
    category: "Personal"
  }
];

export function EnhancedCVAssistant() {
  const [currentStep, setCurrentStep] = useState<Step>("personal-info");
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    location: ""
  });
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<any>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handlePersonalInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personalInfo.fullName || !personalInfo.email || !personalInfo.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    setCurrentStep("voice-recording");
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      visualizeAudio();

      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioChunks(chunks);
        processTranscription();
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setCurrentTranscript("");
      const recognition = startRealtimeTranscription();
      setSpeechRecognition(recognition);
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

      // Stop speech recognition if it's running
      if (speechRecognition) {
        speechRecognition.stop();
        setSpeechRecognition(null);
      }

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

  const startRealtimeTranscription = () => {
    // Check for browser speech recognition support
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript + ' ';
          } else {
            interim += transcript;
          }
        }
        
        if (final) {
          setCurrentTranscript(prev => prev + final);
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          toast({
            title: "Speech Recognition Error",
            description: "Audio will be processed server-side instead",
            variant: "destructive"
          });
        }
      };
      
      recognition.start();
      return recognition;
    } else {
      // No browser speech recognition - will use server-side processing
      toast({
        title: "Using Server Processing",
        description: "Audio will be transcribed when recording stops",
      });
      return null;
    }
  };

  const processTranscription = async () => {
    let finalTranscript = currentTranscript;
    
    // If no transcript from browser speech recognition, try server-side processing
    if (!finalTranscript.trim() && audioChunks.length > 0) {
      try {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');
        
        const response = await fetch('/api/transcribe', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          const result = await response.json();
          finalTranscript = result.transcript;
        } else {
          throw new Error('Server transcription failed');
        }
      } catch (error) {
        console.error('Transcription error:', error);
        toast({
          title: "Transcription Error",
          description: "Please speak clearly and try again",
          variant: "destructive"
        });
        return;
      }
    }
    
    // Save the transcript to answers
    const updatedAnswers = { ...answers };
    updatedAnswers.voiceResponse = finalTranscript;
    setAnswers(updatedAnswers);

    toast({
      title: "Recording Complete!",
      description: "Now let's capture your photo for the CV",
    });
    setTimeout(() => setCurrentStep("photo-capture"), 1500);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }
      });
      streamRef.current = stream;
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

        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }

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

  const sendViaEmail = async () => {
    if (pdfBlob) {
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
              email: personalInfo.email,
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
              description: `CV has been sent to ${personalInfo.email}`,
            });
          } else {
            throw new Error('Failed to send email');
          }
        };
      } catch (error) {
        toast({
          title: "Email Error",
          description: "Failed to send email. Please try again.",
          variant: "destructive"
        });
      }
    }
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

          {/* Step 2: Voice Recording - All Questions Visible */}
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
                  Answer the questions below in a single recording
                </p>
              </div>

              {/* Recording Button at the top */}
              <div className="flex justify-center mb-4">
                <motion.button
                  className={`p-4 rounded-full ${
                    isRecording
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  } text-white shadow-2xl transition-all duration-300`}
                  onClick={isRecording ? stopRecording : startRecording}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isRecording ? (
                    <MicOff className="w-6 h-6" />
                  ) : (
                    <Mic className="w-6 h-6" />
                  )}
                </motion.button>
              </div>

              {/* Audio Visualization */}
              <div className="relative mb-4">
                <div className="h-20 bg-white/5 rounded-lg overflow-hidden relative">
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
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          <Mic className="w-4 h-4 text-purple-400" />
                        </motion.div>
                        <span className="text-xs text-purple-400">Recording... Speak naturally</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Click the microphone above to start
                      </span>
                    )}
                  </div>

                  {/* Audio level bars */}
                  {isRecording && (
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

              {/* Transcript Display */}
              {currentTranscript && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10 max-h-24 overflow-y-auto"
                >
                  <p className="text-xs">{currentTranscript}</p>
                </motion.div>
              )}

              {/* All Questions Display - More Compact */}
              <div className="space-y-2 max-w-2xl mx-auto">
                {guidedQuestions.map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white/5 rounded-lg p-3 border border-white/10"
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-purple-400">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-0.5">{question.text}</h4>
                        <p className="text-xs text-muted-foreground">{question.hint}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {isRecording && (
                <p className="text-center text-xs text-muted-foreground mt-3">
                  When you're done, click the button to stop recording
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
                  onClick={sendViaEmail}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!pdfBlob}
                >
                  <Mail className="w-4 h-4" />
                  Send via Email
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
} 