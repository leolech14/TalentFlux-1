import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

export async function generateCVFromResponses(responses: string[]): Promise<CVData> {
  const systemPrompt = `You are a professional CV writer specializing in LinkedIn-quality resumes. 

Convert the user's natural language responses into a structured, professional CV. Follow these guidelines:
1. Extract and format information professionally
2. Use action verbs and quantify achievements where possible
3. Ensure consistent formatting and professional language
4. Fill in reasonable professional formatting where details are sparse
5. Create compelling, concise descriptions

Return the CV data as a JSON object with the exact structure specified.`;

  const userPrompt = `Please convert these responses into a professional CV:

Personal Info & Contact: ${responses[0]}
Professional Summary: ${responses[1]}  
Work Experience: ${responses[2]}
Education: ${responses[3]}
Skills: ${responses[4]}
Certifications: ${responses[5] || 'None'}

Return a JSON object with this exact structure:
{
  "personalInfo": {
    "fullName": "",
    "email": "",
    "phone": "", 
    "location": "",
    "linkedinUrl": "",
    "summary": ""
  },
  "experience": [
    {
      "title": "",
      "company": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "description": "",
      "achievements": []
    }
  ],
  "education": [
    {
      "degree": "",
      "institution": "",
      "location": "",
      "graduationDate": "",
      "gpa": "",
      "honors": ""
    }
  ],
  "skills": {
    "technical": [],
    "soft": [],
    "languages": []
  },
  "certifications": [
    {
      "name": "",
      "issuer": "",
      "date": "",
      "credentialId": ""
    }
  ]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    });

    const cvData = JSON.parse(response.choices[0].message.content || '{}');
    
    // Validate and ensure all required fields exist
    return {
      personalInfo: {
        fullName: cvData.personalInfo?.fullName || '',
        email: cvData.personalInfo?.email || '',
        phone: cvData.personalInfo?.phone || '',
        location: cvData.personalInfo?.location || '',
        linkedinUrl: cvData.personalInfo?.linkedinUrl || '',
        summary: cvData.personalInfo?.summary || ''
      },
      experience: cvData.experience || [],
      education: cvData.education || [],
      skills: {
        technical: cvData.skills?.technical || [],
        soft: cvData.skills?.soft || [],
        languages: cvData.skills?.languages || []
      },
      certifications: cvData.certifications || []
    };
  } catch (error) {
    console.error('CV generation error:', error);
    throw new Error('Failed to generate CV');
  }
}

export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  try {
    // Create a temporary file-like object for OpenAI
    const audioFile = new File([audioBuffer], 'audio.wav', { type: 'audio/wav' });
    
    const response = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en'
    });

    return response.text;
  } catch (error) {
    console.error('Audio transcription error:', error);
    throw new Error('Failed to transcribe audio');
  }
}