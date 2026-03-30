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
  languages: z.array(z.string()).optional().default([]),
  interests: z.array(z.string()).optional().default([]),
  coreCompetencies: z.array(z.string()).optional().default([]),
  references: z.string().optional().default('Available upon request'),
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
  const model = genAI.getGenerativeModel(
    { model: 'gemini-3.1-flash-lite-preview' },
    { apiVersion: 'v1beta' }
  );

  const generationConfig = {
    maxOutputTokens: 8192, // Full CV JSON needs ample headroom — do not lower this
    temperature: 0.4,
  };

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
6. MINIMUM OUTPUT REQUIREMENTS — you MUST meet all of these, no exceptions:
   - At least 3 projects (use real ones from the resume first, synthesize plausible ones if needed to reach 3)
   - At least 3 achievements (metric-driven where possible)
   - At least 6 technical skills relevant to the job description
   - At least 4 tools/platforms
   - At least 2 soft skills
   - Exactly 3–5 languages spoken by the candidate (infer from name, education, location, or stated languages — always include English)
   - Exactly 4–5 interests relevant to the target role (professional not generic — e.g. "Open Source Contribution" not "Reading")
   - Exactly 6 coreCompetencies: short punchy keyword phrases of 2–4 words each that summarize the candidate's strongest professional strengths relevant to the target role. Must be specific to the role, not generic filler. Must NOT repeat anything already in skills.technical or skills.tools. Examples for a Frontend Engineer: ["React Architecture", "UI Performance Tuning", "Component System Design", "Agile Delivery", "Cross-team Collaboration", "Pixel-Perfect Implementation"]
   - Always set references to "Available upon request"
   Do NOT reduce these counts even if the resume has limited information — generate plausible entries to meet minimums.
7. For the education "grade" field, format it as a clean, human-readable string such as "8.68 CGPA", "3.8 GPA", "First Class Honours", or "Distinction". Do NOT wrap it in parentheses or brackets. Do NOT output a bare number. If no grade is present on the resume, omit the field entirely.
99. For project links, if no specific repository URL is available in the original resume, set link to "" (empty string) rather than reusing the portfolio URL.
100. For each project, the description must follow this structure in 2-3 sentences:
- Sentence 1: What was built and its core purpose
- Sentence 2: Key technical decisions, architecture, or interesting implementation details
- Sentence 3: Outcome, impact, scale, or problem it solved (use numbers where possible)
Example of a good project description:
"Built a full-stack e-commerce platform handling secure payments and real-time cart sync across sessions. Architected with React, Node.js, and MongoDB using optimistic UI updates to reduce perceived latency. Reduced checkout drop-off by designing a streamlined 3-step flow with persistent guest cart recovery."
Keep each project sentence under 120 characters to ensure clean formatting. Do not merge all three into one run-on sentence.
101. Return an "aiGenerated" field in the exact shape below, listing the array indexes of any projects, achievements, and skills that you added and were NOT present in the original resume. If nothing new was added for a field, return empty arrays/objects.

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
  "languages": ["string"],
  "interests": ["string"],
  "coreCompetencies": ["string"],
  "references": "Available upon request",
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
    const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig });
    const responseText = result.response.text();

    // Diagnostic: log tail to detect token truncation
    console.log('[generateCV] Raw response length:', responseText.length);
    console.log('[generateCV] Response tail (last 200 chars):', responseText.slice(-200));
    
    // Clean up markdown code fences Gemini sometimes wraps the JSON in
    const cleanedText = responseText
      .replace(/^\s*```json\s*/i, '')
      .replace(/^\s*```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    const parsedJson = JSON.parse(cleanedText);
    
    // Validate output thoroughly via Zod
    const validatedData = CVSchema.parse(parsedJson);

    // Post-validation completeness check — catch silent truncation
    checkCompleteness(validatedData);

    return validatedData;

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[generateCV] Zod validation failed:', error.errors);
      throw new Error('AI returned an invalid CV structure that failed validation.');
    } else if (error instanceof SyntaxError) {
      console.error('[generateCV] Failed to parse JSON from AI:', error);
      throw new Error('AI returned unparseable syntax instead of valid JSON.');
    }
    throw error;
  }
}

/**
 * Checks that the CV has at least the minimum required content.
 * Throws if the response appears truncated or incomplete.
 */
function checkCompleteness(cv) {
  const issues = [];

  if (!cv.projects || cv.projects.length < 2)
    issues.push(`Only ${cv.projects?.length ?? 0} project(s) generated (minimum 2)`);
  if (!cv.achievements || cv.achievements.length < 2)
    issues.push(`Only ${cv.achievements?.length ?? 0} achievement(s) generated (minimum 2)`);
  if (!cv.skills?.technical || cv.skills.technical.length < 4)
    issues.push(`Only ${cv.skills?.technical?.length ?? 0} technical skill(s) generated (minimum 4)`);

  if (issues.length > 0) {
    console.warn('[generateCV] Completeness check failed:', issues);
    const err = new Error('Incomplete CV generation — please retry.');
    err.code = 'CV_INCOMPLETE';
    throw err;
  }
}
