import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

// Define the precise Zod schema to validate Gemini's output
export const CVSchema = z.object({
  personal: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedin: z.string().optional(),
    portfolio: z.string().optional(),
  }),
  summary: z.string(),
  experience: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      duration: z.string(),
      bullets: z.array(z.string()),
    })
  ).optional().default([]),
  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string(),
      year: z.string(),
      grade: z.string().optional(),
    })
  ).optional().default([]),
  projects: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      tech: z.array(z.string()).optional().default([]),
      link: z.string().optional(),
    })
  ).optional().default([]),
  skills: z.object({
    technical: z.array(z.string()).optional().default([]),
    soft: z.array(z.string()).optional().default([]),
    tools: z.array(z.string()).optional().default([]),
  }).optional().default({ technical: [], soft: [], tools: [] }),
  certifications: z.array(z.string()).optional().default([]),
  achievements: z.array(z.string()).optional().default([]),
  aiGenerated: z.object({
    projects: z.array(z.number()).optional().default([]),
    achievements: z.array(z.number()).optional().default([]),
    skills: z.object({
      technical: z.array(z.string()).optional().default([]),
      tools: z.array(z.string()).optional().default([]),
    }).optional().default({ technical: [], tools: [] })
  }).optional().default({ projects: [], achievements: [], skills: { technical: [], tools: [] } })
});

/**
 * Calls Gemini 3.1 Flash-Lite to synthesize the CV JSON
 * @param {string} resumeText - Raw text extracted from the user's resume
 * @param {string} jobDescription - Target job description text
 * @param {string} targetRole - The user's target job title
 * @returns {Promise<object>} - Valid CV JSON object
 */
export async function generateAugmentedCV(resumeText, jobDescription, targetRole) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });

  // Truncate job description to a safe size just in case (e.g. 3000 chars)
  const safeJobDesc = jobDescription.substring(0, 3000);
  const safeResume = resumeText.substring(0, 15000);

  const prompt = `
You are an expert technical recruiter and resume writer. I am providing you with a candidate's existing resume text, a target job role, and a specific job description. 

Your task is to rewrite, augment, and perfectly tailor the candidate's resume to match the exact requirements and keywords of the job description.

Candidate Target Role: ${targetRole}

Target Job Description:
"""
${safeJobDesc}
"""

Candidate Current Resume Text:
"""
${safeResume}
"""

Instructions for augmentation:
1. Parse the resume into structured data. Extract their name, contact info, experience, education, projects, etc.
2. Rewrite the "summary" to specifically highlight why the candidate is a perfect fit for this specific job description. Keep the summary under 300 characters. Match the seniority tone to the candidate's actual experience level. For students or early-career candidates, use confident but grounded language — avoid terms like "Expert" or "seasoned" unless clearly justified by the resume.
3. Reframe the candidate's existing experience bullets to emphasize relevant keywords from the job description.
4. You may add new projects, skills, and achievements to strengthen the CV. However, you must NEVER add, invent, or modify experience entries beyond what exists in the original resume. Experience must reflect only what the candidate actually provided. Ensure new achievements or projects match the seniority level of the candidate — DO NOT over-inflate their experience or make up completely unbelievable senior feats if they are junior.
5. Every single bullet point must be under 120 characters to ensure perfect formatting. Keep them impactful and metric-driven where possible.
6. For project links, if no specific repository URL is available in the original resume, set link to "" (empty string) rather than reusing the portfolio URL.
7. Return an "aiGenerated" field in the exact shape below, listing the array indexes of any projects, achievements, and skills that you added and were NOT present in the original resume. If nothing new was added for a field, return empty arrays/objects.

You MUST return ONLY a fully valid JSON object that matches the exact structure below. Do not include any preamble, markdown code blocks (\`\`\`json), or trailing text. ONLY output raw JSON.

Output JSON Structure:
{
  "personal": { "name": "string", "email": "string", "phone": "string", "location": "string", "linkedin": "string", "portfolio": "string" },
  "summary": "string",
  "experience": [{ "company": "string", "role": "string", "duration": "string", "bullets": ["string"] }],
  "education": [{ "institution": "string", "degree": "string", "year": "string", "grade": "string" }],
  "projects": [{ "name": "string", "description": "string", "tech": ["string"], "link": "string" }],
  "skills": { "technical": ["string"], "soft": ["string"], "tools": ["string"] },
  "certifications": ["string"],
  "achievements": ["string"],
  "aiGenerated": {
    "projects": [0],
    "achievements": [0],
    "skills": {
      "technical": ["string"],
      "tools": ["string"]
    }
  }
}
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean up potential markdown blocks if Gemini accidentally includes them
    const cleanedText = responseText.replace(/^\\s*\\`\\`\\`json\\s*/g, '').replace(/\\`\\`\\`\\s*$/g, '').trim();

    const parsedJson = JSON.parse(cleanedText);
    
    // Validate output thoroughly via Zod
    const validatedData = CVSchema.parse(parsedJson);
    return validatedData;

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation failed against schema:', error.errors);
      throw new Error('AI returned an invalid CV structure that failed validation.');
    } else if (error instanceof SyntaxError) {
      console.error('Failed to parse JSON from AI:', error);
      throw new Error('AI returned unparseable syntax instead of valid JSON.');
    }
    throw error;
  }
}
