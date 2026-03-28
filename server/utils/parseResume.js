import fs from 'fs/promises';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import mammoth from 'mammoth';

/**
 * Extracts raw text from a PDF, DOCX, or TXT file
 * @param {string} filePath - Path to the uploaded file
 * @param {string} mimeType - MIME type of the file
 * @returns {Promise<string>} - The extracted raw text
 */
export async function parseResume(filePath, mimeType) {
  let text = '';
  
  if (mimeType === 'application/pdf') {
    text = await extractTextFromPDF(filePath);
  } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    text = await extractTextFromDOCX(filePath);
  } else if (mimeType === 'text/plain') {
    text = await fs.readFile(filePath, 'utf-8');
  } else {
    throw new Error('Unsupported file format');
  }
  
  // Clean up trailing newlines and collapse 3+ newlines to max 2
  return text.replace(/\n{3,}/g, '\n\n').trim();
}

async function extractTextFromDOCX(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    throw new Error(`Failed to extract text from DOCX: ${error.message}`);
  }
}

async function extractTextFromPDF(filePath) {
  try {
    const data = await fs.readFile(filePath);
    const dataArray = new Uint8Array(data);
    
    // pdf.js loading task
    const loadingTask = getDocument({ data: dataArray });
    const pdfDocument = await loadingTask.promise;
    
    let fullText = '';
    const numPages = pdfDocument.numPages;

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\\n';
    }

    return fullText;
  } catch (error) {
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}
