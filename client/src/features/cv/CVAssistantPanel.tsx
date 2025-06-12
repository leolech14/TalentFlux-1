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

export function CVAssistantPanel({ isOpen, onClose }: CVAssistantPanelProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedCV, setGeneratedCV] = useState<CVData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const cvQuestions = [
    {
      id: "intro",
      question: "Hi! I'm your AI CV Assistant. Let's create a professional LinkedIn-quality CV together. First, tell me your full name, email, phone number, and current location.",
      placeholder: "e.g., John Smith, john.smith@email.com, +1-555-0123, New York, NY"
    },
    {
      id: "summary",
      question: "Great! Now, describe yourself professionally. What's your current role, years of experience, and key strengths? This will become your professional summary.",
      placeholder: "e.g., I'm a senior software engineer with 5 years of experience in full-stack development, specializing in React and Node.js..."
    },
    {
      id: "experience",
      question: "Tell me about your work experience. For each job, include: company name, your title, dates worked, location, and key responsibilities or achievements.",
      placeholder: "e.g., I worked at Google as a Software Engineer from Jan 2020 to Dec 2022 in Mountain View, CA. I developed web applications, improved system performance by 30%..."
    },
    {
      id: "education",
      question: "What's your educational background? Include degrees, institutions, graduation dates, and any honors or notable achievements.",
      placeholder: "e.g., Bachelor of Science in Computer Science from Stanford University, graduated May 2019, Magna Cum Laude, GPA 3.8"
    },
    {
      id: "skills",
      question: "List your key skills. Include technical skills (programming languages, tools, frameworks), soft skills, and any languages you speak.",
      placeholder: "e.g., Technical: JavaScript, Python, React, AWS, Docker. Soft skills: Leadership, Problem-solving. Languages: English (native), Spanish (fluent)"
    },
    {
      id: "certifications",
      question: "Do you have any certifications, awards, or additional qualifications? If not, just say 'none' or 'skip'.",
      placeholder: "e.g., AWS Certified Solutions Architect, PMP Certification, Google Cloud Professional..."
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setResponses([]);
      setCurrentInput("");
      setGeneratedCV(null);
      setShowPreview(false);
    }
  }, [isOpen]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak clearly and click stop when finished",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Recording failed",
        description: "Please check microphone permissions",
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

      if (response.ok) {
        const { text } = await response.json();
        setCurrentInput(text);
        toast({
          title: "Audio transcribed",
          description: "You can edit the text before submitting",
          duration: 3000,
        });
      } else {
        throw new Error('Transcription failed');
      }
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
      console.warn('Failed to emit AI event:', error);
    }

    if (currentStep < cvQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
      setCurrentInput("");
    } else {
      // All questions answered, generate CV
      await generateCV(newResponses);
    }
  };

  const generateCV = async (allResponses: string[]) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/cv/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          responses: allResponses,
          userId: user?.id 
        })
      });

      if (response.ok) {
        const cvData = await response.json();
        setGeneratedCV(cvData);
        setShowPreview(true);
        
        toast({
          title: "CV Generated Successfully!",
          description: "Your professional CV is ready for review",
          duration: 4000,
        });

        // Emit AI event for successful CV generation
        await emitAIEvent('cv-generated', {
          userId: user?.id?.toString() || 'anonymous',
          route: '/cv-assistant',
          device: window.innerWidth < 768 ? 'mobile' : 'desktop'
        });
      } else {
        throw new Error('CV generation failed');
      }
    } catch (error) {
      toast({
        title: "CV Generation Failed",
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
          description: "Your CV has been saved to your downloads folder",
          duration: 3000,
        });

        // Emit AI event for CV download
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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
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
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">AI CV Assistant</h2>
                  <p className="text-sm text-muted-foreground">
                    Create a professional LinkedIn-quality CV
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                ✕
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {!showPreview ? (
                <div className="p-6 space-y-6">
                  {/* Progress Indicator */}
                  <div className="flex items-center gap-2 mb-6">
                    {cvQuestions.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 flex-1 rounded-full transition-colors ${
                          index <= currentStep ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Current Question */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                        Step {currentStep + 1} of {cvQuestions.length}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {cvQuestions[currentStep].question}
                      </p>

                      <div className="space-y-4">
                        <Textarea
                          value={currentInput}
                          onChange={(e) => setCurrentInput(e.target.value)}
                          placeholder={cvQuestions[currentStep].placeholder}
                          className="min-h-[120px] resize-none"
                          disabled={isProcessing || isRecording}
                        />

                        <div className="flex items-center gap-3">
                          <Button
                            onClick={isRecording ? stopRecording : startRecording}
                            variant={isRecording ? "destructive" : "outline"}
                            size="sm"
                            disabled={isProcessing}
                          >
                            {isRecording ? (
                              <>
                                <MicOff className="w-4 h-4 mr-2" />
                                Stop Recording
                              </>
                            ) : (
                              <>
                                <Mic className="w-4 h-4 mr-2" />
                                Record Audio
                              </>
                            )}
                          </Button>

                          <Button
                            onClick={handleSubmitResponse}
                            disabled={!currentInput.trim() || isProcessing || isRecording}
                            className="ml-auto"
                          >
                            {isProcessing ? (
                              "Processing..."
                            ) : currentStep === cvQuestions.length - 1 ? (
                              <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Generate CV
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-2" />
                                Next Question
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Previous Responses */}
                  {responses.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Your Responses</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {responses.map((response, index) => (
                            <div key={index} className="p-3 bg-muted rounded-lg">
                              <p className="text-xs text-muted-foreground mb-1">
                                {cvQuestions[index].id}
                              </p>
                              <p className="text-sm">{response}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <CVPreview cv={generatedCV} onDownload={downloadCV} />
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function CVPreview({ cv, onDownload }: { cv: CVData | null; onDownload: () => void }) {
  if (!cv) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Eye className="w-5 h-5" />
          CV Preview
        </h3>
        <Button onClick={onDownload} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
      </div>

      <div className="bg-white text-black p-8 rounded-lg border shadow-sm space-y-6 max-h-[600px] overflow-y-auto">
        {/* Header */}
        <div className="text-center border-b pb-4">
          <h1 className="text-2xl font-bold">{cv.personalInfo.fullName}</h1>
          <div className="text-sm text-gray-600 mt-2 space-y-1">
            <p>{cv.personalInfo.email} • {cv.personalInfo.phone}</p>
            <p>{cv.personalInfo.location}</p>
            {cv.personalInfo.linkedinUrl && (
              <p>{cv.personalInfo.linkedinUrl}</p>
            )}
          </div>
        </div>

        {/* Professional Summary */}
        <div>
          <h2 className="text-lg font-semibold mb-2 text-blue-800">Professional Summary</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{cv.personalInfo.summary}</p>
        </div>

        {/* Experience */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-blue-800">Professional Experience</h2>
          <div className="space-y-4">
            {cv.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium">{exp.title}</h3>
                  <span className="text-sm text-gray-600">{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{exp.company} • {exp.location}</p>
                <p className="text-sm text-gray-700 mb-2">{exp.description}</p>
                {exp.achievements.length > 0 && (
                  <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                    {exp.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-blue-800">Education</h2>
          <div className="space-y-3">
            {cv.education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{edu.degree}</h3>
                    <p className="text-sm text-gray-600">{edu.institution} • {edu.location}</p>
                    {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                    {edu.honors && <p className="text-sm text-gray-600">{edu.honors}</p>}
                  </div>
                  <span className="text-sm text-gray-600">{edu.graduationDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-blue-800">Skills</h2>
          <div className="space-y-2">
            {cv.skills.technical.length > 0 && (
              <div>
                <h4 className="font-medium text-sm">Technical Skills:</h4>
                <p className="text-sm text-gray-700">{cv.skills.technical.join(', ')}</p>
              </div>
            )}
            {cv.skills.soft.length > 0 && (
              <div>
                <h4 className="font-medium text-sm">Soft Skills:</h4>
                <p className="text-sm text-gray-700">{cv.skills.soft.join(', ')}</p>
              </div>
            )}
            {cv.skills.languages.length > 0 && (
              <div>
                <h4 className="font-medium text-sm">Languages:</h4>
                <p className="text-sm text-gray-700">{cv.skills.languages.join(', ')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Certifications */}
        {cv.certifications.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3 text-blue-800">Certifications</h2>
            <div className="space-y-2">
              {cv.certifications.map((cert, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-sm">{cert.name}</h3>
                      <p className="text-sm text-gray-600">{cert.issuer}</p>
                      {cert.credentialId && (
                        <p className="text-xs text-gray-500">ID: {cert.credentialId}</p>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">{cert.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}