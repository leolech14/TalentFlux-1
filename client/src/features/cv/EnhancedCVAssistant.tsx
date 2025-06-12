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
    text: "Tell me about your professional background and experience",
    hint: "Include your current role, years of experience, and key responsibilities",
    category: "Experience"
  },
  {
    id: "2",
    text: "What are your most significant achievements?",
    hint: "Mention specific accomplishments, metrics, or projects you're proud of",
    category: "Achievements"
  },
  {
    id: "3",
    text: "What are your key skills and expertise?",
    hint: "List technical skills, tools, frameworks, and soft skills",
    category: "Skills"
  },
  {
    id: "4",
    text: "Describe your educational background",
    hint: "Include degrees, institutions, certifications, and relevant coursework",
    category: "Education"
  },
  {
    id: "5",
    text: "What are your career goals and what type of role are you seeking?",
    hint: "Share your aspirations and the kind of position you're looking for",
    category: "Goals"
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
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
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
        simulateTranscription();
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
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
    const sampleAnswers = [
      "I am a senior software engineer with over 8 years of experience in full-stack development...",
      "Led the development of a microservices architecture that improved system performance by 40%...",
      "Expert in React, TypeScript, Node.js, Python, AWS, and Docker. Strong leadership skills...",
      "Bachelor's degree in Computer Science from UC Berkeley, graduated with honors...",
      "Looking for a senior engineering role where I can lead teams and architect scalable solutions..."
    ];
    
    const words = sampleAnswers[currentQuestion].split(" ");
    let index = 0;
    
    const interval = setInterval(() => {
      if (index < words.length && isRecording) {
        setTranscript(prev => prev + (prev ? " " : "") + words[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 200);
  };

  const simulateTranscription = () => {
    const currentQ = guidedQuestions[currentQuestion];
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: transcript
    }));
    
    if (currentQuestion < guidedQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setTranscript("");
    } else {
      toast({
        title: "Voice Recording Complete!",
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
      // In a real app, you would process the answers with AI
      // For now, we'll use mock data as a base
      const cvData = generateMockCVData();
      
      // Override with actual personal info and photo
      cvData.personalInfo = {
        name: personalInfo.fullName,
        title: "Software Engineer", // This would come from AI processing
        email: personalInfo.email,
        phone: personalInfo.phone,
        location: personalInfo.location,
        dateOfBirth: personalInfo.dateOfBirth,
        photo: photoData || undefined
      };
      
      // Process answers to create a summary (in real app, this would use AI)
      const allAnswers = Object.values(answers).join(' ');
      if (allAnswers.length > 100) {
        cvData.summary = allAnswers.substring(0, 300) + "...";
      }
      
      const blob = generateCVPDF(cvData);
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
    ? ((currentQuestion + 1) / guidedQuestions.length) * 33 + 33
    : currentStep === "photo-capture" ? 66
    : currentStep === "preview" ? 100
    : 33;

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
                Step {currentStep === "personal-info" ? 1 : currentStep === "voice-recording" ? 2 : currentStep === "photo-capture" ? 3 : 4} of 4
              </span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Personal Information */}
          {currentStep === "personal-info" && (
            <motion.div
              key="personal-info"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6"
            >
              <div className="text-center mb-6">
                <User className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                <h3 className="text-xl font-semibold mb-2">Let's start with your basic information</h3>
                <p className="text-sm text-muted-foreground">We need this to create your professional CV</p>
              </div>

              <form onSubmit={handlePersonalInfoSubmit} className="space-y-4 max-w-md mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={personalInfo.fullName}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="John Doe"
                    required
                    className="mt-1"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john.doe@example.com"
                    required
                    className="mt-1"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                    required
                    className="mt-1"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={personalInfo.dateOfBirth}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="mt-1"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={personalInfo.location}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="San Francisco, CA"
                    className="mt-1"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Continue to Voice Recording
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          )}

          {/* Step 2: Voice Recording */}
          {currentStep === "voice-recording" && (
            <motion.div
              key="voice-recording"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
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
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          <Mic className="w-6 h-6 text-purple-400" />
                        </motion.div>
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

              {/* Progress Indicators */}
              <div className="flex justify-center gap-2 mt-8">
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
            </motion.div>
          )}

          {/* Step 3: Photo Capture */}
          {currentStep === "photo-capture" && (
            <motion.div
              key="photo-capture"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6"
              onAnimationComplete={() => startCamera()}
            >
              <div className="text-center mb-6">
                <Camera className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                <h3 className="text-xl font-semibold mb-2">Let's capture your professional photo</h3>
                <p className="text-sm text-muted-foreground">Position your face within the frame</p>
              </div>

              <div className="relative max-w-md mx-auto">
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
                    <div className="w-48 h-64 border-4 border-purple-400 rounded-full opacity-50" />
                  </div>
                  
                  {/* Instructions */}
                  <div className="absolute top-4 left-0 right-0 text-center">
                    <div className="inline-flex items-center gap-2 bg-black/50 backdrop-blur px-4 py-2 rounded-full">
                      <AlertCircle className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-white">Good lighting • No glasses • No hats</span>
                    </div>
                  </div>
                </div>

                <canvas ref={canvasRef} className="hidden" />

                {/* Capture Button */}
                <motion.button
                  className="mt-6 w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-semibold shadow-xl"
                  onClick={capturePhoto}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Camera className="w-5 h-5 inline mr-2" />
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
              className="p-6"
            >
              <div className="text-center mb-6">
                <Check className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <h3 className="text-xl font-semibold mb-2">Your CV is ready!</h3>
                <p className="text-sm text-muted-foreground">Preview and download your professional CV</p>
              </div>

              {/* PDF Preview */}
              <div className="bg-white/10 rounded-lg p-4 mb-6">
                <div className="aspect-[8.5/11] bg-white rounded shadow-xl flex items-center justify-center overflow-hidden">
                  {isGeneratingPDF ? (
                    <div className="text-gray-400">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      >
                        <Sparkles className="w-8 h-8" />
                      </motion.div>
                      <p className="mt-2">Generating PDF...</p>
                    </div>
                  ) : pdfBlob ? (
                    <iframe
                      src={URL.createObjectURL(pdfBlob)}
                      className="w-full h-full"
                      title="CV Preview"
                    />
                  ) : (
                    <div className="text-gray-400">
                      <p>CV Preview</p>
                      <p className="text-sm mt-2">{personalInfo.fullName}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Export Options */}
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  className="py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-semibold shadow-xl flex items-center justify-center gap-2"
                  onClick={downloadPDF}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!pdfBlob}
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </motion.button>

                <motion.button
                  className="py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-semibold shadow-xl flex items-center justify-center gap-2"
                  onClick={sendViaEmail}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!pdfBlob}
                >
                  <Mail className="w-5 h-5" />
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