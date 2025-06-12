import OpenAI from 'openai';
import puppeteer from 'puppeteer';

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

export async function generateCVFromAIResponses(responses: string[]): Promise<CVData> {
  const systemPrompt = `You are a professional CV writer specializing in creating LinkedIn-quality resumes.

Convert the user's natural language responses into a structured, professional CV. The responses cover:
1. Professional background, experience, and key skills
2. Significant achievements and accomplishments  
3. Career goals and aspirations

Guidelines:
1. Extract and format information professionally
2. Use action verbs and quantify achievements where possible
3. Create compelling, concise descriptions
4. Infer reasonable professional details from context
5. Ensure consistent formatting and professional language

Return the CV data as a JSON object with the exact structure specified.`;

  const userPrompt = `Please convert these voice responses into a professional CV:

Background & Experience: ${responses[0]}
Achievements & Accomplishments: ${responses[1] || 'Not provided'}
Career Goals: ${responses[2] || 'Not provided'}

Return a JSON object with this exact structure:
{
  "personalInfo": {
    "fullName": "",
    "email": "",
    "phone": "", 
    "location": "",
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
      "date": ""
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
        fullName: cvData.personalInfo?.fullName || 'John Doe',
        email: cvData.personalInfo?.email || 'john.doe@email.com',
        phone: cvData.personalInfo?.phone || '+1-555-0123',
        location: cvData.personalInfo?.location || 'City, State',
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
    console.error('AI CV generation error:', error);
    throw new Error('Failed to generate CV');
  }
}

export async function generateCVPDF(cvData: CVData): Promise<Buffer> {
  let browser;
  try {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @page { size: A4; margin: 0.5in; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 0; 
            color: #333; 
            line-height: 1.4;
            font-size: 11px;
        }
        .header { 
            text-align: center; 
            border-bottom: 3px solid #2563eb; 
            padding-bottom: 15px; 
            margin-bottom: 25px; 
        }
        .name { 
            font-size: 24px; 
            font-weight: bold; 
            color: #1e40af; 
            margin-bottom: 8px; 
            letter-spacing: 0.5px;
        }
        .contact { 
            font-size: 12px; 
            color: #666; 
            margin-bottom: 5px;
        }
        .section { 
            margin-bottom: 20px; 
            page-break-inside: avoid;
        }
        .section-title { 
            font-size: 14px; 
            font-weight: bold; 
            color: #1e40af; 
            border-bottom: 1px solid #e5e7eb; 
            padding-bottom: 3px; 
            margin-bottom: 12px; 
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .job { 
            margin-bottom: 15px; 
            page-break-inside: avoid;
        }
        .job-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 5px;
        }
        .job-title { 
            font-weight: bold; 
            font-size: 13px; 
            color: #1f2937;
        }
        .job-dates {
            font-size: 11px;
            color: #6b7280;
            font-weight: 500;
        }
        .job-details { 
            color: #6b7280; 
            margin-bottom: 6px; 
            font-size: 11px;
            font-style: italic;
        }
        .job-description {
            margin-bottom: 8px;
            text-align: justify;
        }
        .skills-container { 
            display: flex; 
            flex-wrap: wrap; 
            gap: 6px; 
            margin-top: 8px;
        }
        .skill { 
            background: linear-gradient(135deg, #dbeafe, #bfdbfe); 
            color: #1e40af; 
            padding: 3px 8px; 
            border-radius: 12px; 
            font-size: 10px; 
            font-weight: 500;
            border: 1px solid #93c5fd;
        }
        .skills-category {
            margin-bottom: 12px;
        }
        .skills-category-title {
            font-weight: 600;
            color: #374151;
            margin-bottom: 6px;
            font-size: 11px;
        }
        ul { 
            margin: 6px 0; 
            padding-left: 16px; 
        }
        li { 
            margin-bottom: 3px; 
            font-size: 11px;
        }
        .summary {
            text-align: justify;
            font-style: italic;
            color: #4b5563;
            border-left: 3px solid #2563eb;
            padding-left: 12px;
            margin: 15px 0;
        }
        .education-item, .cert-item {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 10px;
        }
        .education-main, .cert-main {
            flex: 1;
        }
        .education-date, .cert-date {
            font-size: 11px;
            color: #6b7280;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${cvData.personalInfo.fullName}</div>
        <div class="contact">
            ${cvData.personalInfo.email} • ${cvData.personalInfo.phone}
        </div>
        <div class="contact">
            ${cvData.personalInfo.location}
        </div>
    </div>

    ${cvData.personalInfo.summary ? `
    <div class="section">
        <div class="section-title">Professional Summary</div>
        <div class="summary">${cvData.personalInfo.summary}</div>
    </div>
    ` : ''}

    ${cvData.experience.length > 0 ? `
    <div class="section">
        <div class="section-title">Professional Experience</div>
        ${cvData.experience.map(exp => `
        <div class="job">
            <div class="job-header">
                <div class="job-title">${exp.title}</div>
                <div class="job-dates">${exp.startDate} - ${exp.endDate}</div>
            </div>
            <div class="job-details">${exp.company} • ${exp.location}</div>
            <div class="job-description">${exp.description}</div>
            ${exp.achievements.length > 0 ? `
            <ul>
                ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
            </ul>
            ` : ''}
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${cvData.education.length > 0 ? `
    <div class="section">
        <div class="section-title">Education</div>
        ${cvData.education.map(edu => `
        <div class="education-item">
            <div class="education-main">
                <div class="job-title">${edu.degree}</div>
                <div class="job-details">${edu.institution} • ${edu.location}</div>
                ${edu.gpa ? `<div style="font-size: 10px; color: #6b7280;">GPA: ${edu.gpa}</div>` : ''}
                ${edu.honors ? `<div style="font-size: 10px; color: #059669; font-weight: 500;">${edu.honors}</div>` : ''}
            </div>
            <div class="education-date">${edu.graduationDate}</div>
        </div>
        `).join('')}
    </div>
    ` : ''}

    <div class="section">
        <div class="section-title">Skills</div>
        ${cvData.skills.technical.length > 0 ? `
        <div class="skills-category">
            <div class="skills-category-title">Technical Skills</div>
            <div class="skills-container">
                ${cvData.skills.technical.map(skill => `<span class="skill">${skill}</span>`).join('')}
            </div>
        </div>
        ` : ''}
        ${cvData.skills.soft.length > 0 ? `
        <div class="skills-category">
            <div class="skills-category-title">Soft Skills</div>
            <div class="skills-container">
                ${cvData.skills.soft.map(skill => `<span class="skill" style="background: linear-gradient(135deg, #d1fae5, #a7f3d0); color: #065f46; border-color: #6ee7b7;">${skill}</span>`).join('')}
            </div>
        </div>
        ` : ''}
        ${cvData.skills.languages.length > 0 ? `
        <div class="skills-category">
            <div class="skills-category-title">Languages</div>
            <div class="skills-container">
                ${cvData.skills.languages.map(lang => `<span class="skill" style="background: linear-gradient(135deg, #ede9fe, #ddd6fe); color: #7c3aed; border-color: #c4b5fd;">${lang}</span>`).join('')}
            </div>
        </div>
        ` : ''}
    </div>

    ${cvData.certifications.length > 0 ? `
    <div class="section">
        <div class="section-title">Certifications</div>
        ${cvData.certifications.map(cert => `
        <div class="cert-item">
            <div class="cert-main">
                <div class="job-title">${cert.name}</div>
                <div class="job-details">${cert.issuer}</div>
            </div>
            <div class="cert-date">${cert.date}</div>
        </div>
        `).join('')}
    </div>
    ` : ''}
</body>
</html>`;

    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      }
    });

    return Buffer.from(pdfBuffer);
    
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF');
  } finally {
    if (browser) {
      await browser.close();
    }
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