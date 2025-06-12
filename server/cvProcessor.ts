import OpenAI from "openai";
import type { InsertCv } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface CvProcessingResult {
  success: boolean;
  cv?: InsertCv;
  error?: string;
}

export async function processCvFromNaturalLanguage(
  description: string,
  candidateId: number,
  userEmail: string,
  userName: string
): Promise<CvProcessingResult> {
  try {
    const prompt = `
You are an expert CV/resume parser. Extract structured information from the following natural language description and return it as JSON.

User description: "${description}"

Extract the following information and format it as JSON:
- name: Use "${userName}" as the name
- email: Use "${userEmail}" as the email
- phone: Extract phone number if mentioned, otherwise null
- location: Extract location/city if mentioned, otherwise null
- summary: Create a professional 2-3 sentence summary based on the description
- experience: Array of experience objects with format: {"company": "Company Name", "position": "Job Title", "duration": "Start - End", "description": "Job responsibilities"}
- education: Array of education objects with format: {"institution": "School Name", "degree": "Degree Type", "field": "Field of Study", "duration": "Start - End"}
- skills: Array of skill names extracted from the description
- certifications: Array of certification objects with format: {"name": "Certification Name", "issuer": "Issuing Organization", "date": "Date"}
- languages: Array of language objects with format: {"language": "Language Name", "proficiency": "Proficiency Level"}

Rules:
1. If information is not mentioned, use empty arrays or null values
2. Infer reasonable information from context
3. Make the summary professional and compelling
4. Return valid JSON only, no additional text
5. Use the provided name and email exactly as given

Return the JSON response in this exact format:
{
  "name": "${userName}",
  "email": "${userEmail}",
  "phone": null,
  "location": null,
  "summary": "",
  "experience": [],
  "education": [],
  "skills": [],
  "certifications": [],
  "languages": []
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional CV parser. Return only valid JSON with the extracted information."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    });

    const content = response.choices[0].message.content;
    if (!content) {
      return { success: false, error: "No response from AI" };
    }

    const parsedData = JSON.parse(content);
    
    // Convert arrays to JSON strings as required by the schema
    const cv: InsertCv = {
      candidateId,
      name: parsedData.name,
      email: parsedData.email,
      phone: parsedData.phone,
      location: parsedData.location,
      summary: parsedData.summary,
      experience: parsedData.experience.map((exp: any) => JSON.stringify(exp)),
      education: parsedData.education.map((edu: any) => JSON.stringify(edu)),
      skills: parsedData.skills,
      certifications: parsedData.certifications.map((cert: any) => JSON.stringify(cert)),
      languages: parsedData.languages.map((lang: any) => JSON.stringify(lang))
    };

    return { success: true, cv };

  } catch (error) {
    console.error('Error processing CV with OpenAI:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to process CV description" 
    };
  }
}