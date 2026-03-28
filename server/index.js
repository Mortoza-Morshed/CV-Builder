import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { parseResume } from './utils/parseResume.js';
import { generateAugmentedCV } from './utils/generateCV.js';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Set up multer for file uploads
// Accept PDF and DOCX, max 5MB
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOCX, and TXT are allowed.'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
});

/**
 * Basic health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

/**
 * Handle resume upload and extract text
 * Expects multpart/form-data with 'resume' file, 'jobDescription' and 'targetRole' text fields
 */
app.post('/api/upload', (req, res) => {
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'jobDescriptionFile', maxCount: 1 }
  ])(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
    
    if (!req.files || !req.files['resume']) {
      return res.status(400).json({ success: false, error: 'No resume file uploaded' });
    }

    try {
      let { jobDescription, targetRole } = req.body;
      const resumeFile = req.files['resume'][0];
      const resumePath = resumeFile.path;
      const resumeMimeType = resumeFile.mimetype;

      // Extract text from the uploaded resume file
      const resumeText = await parseResume(resumePath, resumeMimeType);

      let jdTrimmed = false;
      let finalJobDescription = jobDescription || '';

      // If a Job Description file was uploaded, parse it too
      if (req.files['jobDescriptionFile']) {
        const jdFile = req.files['jobDescriptionFile'][0];
        const extractedJd = await parseResume(jdFile.path, jdFile.mimetype);
        
        if (extractedJd.length > 2000) {
          finalJobDescription = extractedJd.substring(0, 2000);
          jdTrimmed = true;
        } else {
          finalJobDescription = extractedJd;
        }
      }

      res.json({
        success: true,
        data: {
          resumeText,
          jobDescription: finalJobDescription,
          targetRole,
          jdTrimmed
        }
      });
    } catch (error) {
      console.error('Error parsing files:', error);
      res.status(500).json({ success: false, error: 'Failed to parse uploaded files' });
    }
  });
});

/**
 * Handle resume augmentation via Gemini AI
 * Expects JSON body: { resumeText, jobDescription, targetRole }
 */
app.post('/api/generate', async (req, res) => {
  try {
    const { resumeText, jobDescription, targetRole } = req.body;
    
    if (!resumeText || !jobDescription || !targetRole) {
      return res.status(400).json({ success: false, error: 'Missing required fields for generation' });
    }

    const cvData = await generateAugmentedCV(resumeText, jobDescription, targetRole);

    res.json({
      success: true,
      data: cvData
    });
  } catch (error) {
    console.error('Error in /api/generate:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to generate CV' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
