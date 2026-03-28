import { useState } from 'react';
import { UploadCloud, FileType, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import axios from 'axios';
import Classic from './components/CVTemplates/Classic';
import ModernMinimal from './components/CVTemplates/ModernMinimal';
import BoldSidebar from './components/CVTemplates/BoldSidebar';
import ATSSafe from './components/CVTemplates/ATSSafe';

function App() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState('');
  
  const [jdMode, setJdMode] = useState('manual'); // 'manual' | 'file'
  const [jdFile, setJdFile] = useState(null);
  const [jdTrimmedNotice, setJdTrimmedNotice] = useState(false);
  
  const [isUploading, setIsUploading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [generatedCvData, setGeneratedCvData] = useState(null);
  const [activeTemplate, setActiveTemplate] = useState('ModernMinimal');

  const validateFile = (selectedFile, type) => {
    let allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (type === 'jd') allowedTypes.push('text/plain');

    if (!allowedTypes.includes(selectedFile.type)) {
      setError(`Only ${type === 'jd' ? 'PDF, DOCX, and TXT' : 'PDF and DOCX'} files are allowed.`);
      return false;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return false;
    }
    setError('');
    return true;
  };

  const handleResumeChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && validateFile(selectedFile, 'resume')) setFile(selectedFile);
  };

  const handleResumeDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile, 'resume')) setFile(droppedFile);
  };

  const handleJdChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && validateFile(selectedFile, 'jd')) setJdFile(selectedFile);
  };

  const handleJdDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile, 'jd')) setJdFile(droppedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please upload a resume file.');
      return;
    }

    if (!targetRole.trim()) {
      setError('Please fill in the target role.');
      return;
    }

    if (jdMode === 'manual' && !jobDescription.trim()) {
      setError('Please fill in the job description.');
      return;
    }

    if (jdMode === 'file' && !jdFile) {
      setError('Please upload a job description file.');
      return;
    }

    setIsUploading(true);
    setLoadingText('Processing and Extracting Text...');
    setError('');
    setSuccess(false);
    setJdTrimmedNotice(false);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('targetRole', targetRole);

    if (jdMode === 'manual') {
      formData.append('jobDescription', jobDescription);
    } else {
      formData.append('jobDescriptionFile', jdFile);
    }

    try {
      const uploadRes = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const extractedData = uploadRes.data.data;
      if (extractedData.jdTrimmed) {
        setJdTrimmedNotice(true);
      }

      // Chain Phase 2: AI Integration
      setLoadingText('Generating AI CV... (this may take up to 15 seconds)');
      
      const generateRes = await axios.post('http://localhost:5000/api/generate', {
        resumeText: extractedData.resumeText,
        jobDescription: extractedData.jobDescription,
        targetRole: extractedData.targetRole
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const cvJson = generateRes.data.data;
      console.log('Final CV JSON (Phase 2):', cvJson);
      
      setGeneratedCvData(cvJson);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'An error occurred during processing. Please try again.');
    } finally {
      setIsUploading(false);
      setLoadingText('');
    }
  };

  const templates = {
    Classic: Classic,
    ModernMinimal: ModernMinimal,
    BoldSidebar: BoldSidebar,
    ATSSafe: ATSSafe,
  };

  if (success && generatedCvData) {
    const ActiveComponent = templates[activeTemplate];
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex flex-col">
        <div className="max-w-[1400px] mx-auto w-full mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your AI-Tailored CV</h1>
          <button 
            onClick={() => { setSuccess(false); setGeneratedCvData(null); }}
            className="px-5 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Create Another
          </button>
        </div>

        <div className="flex flex-1 max-w-[1400px] mx-auto w-full gap-8">
          {/* Thumbnails Sidebar */}
          <div className="w-[280px] flex flex-col gap-6 overflow-y-auto pb-12 px-2 scrollbar-thin">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Select Template</h2>
            {Object.keys(templates).map(key => {
              const TemplateUI = templates[key];
              const isSelected = activeTemplate === key;
              return (
                <div 
                  key={key} 
                  onClick={() => setActiveTemplate(key)}
                  className={`relative cursor-pointer transition-all duration-200 transform hover:scale-105 ${isSelected ? 'ring-4 ring-indigo-500 ring-offset-4' : 'ring-1 ring-gray-200'} rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl`}
                  style={{ width: '220px', height: '311px' }} /* ~27% scale of 794x1123 */
                >
                  <div style={{ transform: 'scale(0.277)', transformOrigin: 'top left', width: '794px', height: '1123px', pointerEvents: 'none' }}>
                    <TemplateUI cvData={generatedCvData} />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent p-4 pt-10">
                    <p className="text-white font-semibold text-sm text-center uppercase tracking-wide">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-indigo-500 text-white rounded-full p-1 shadow-md">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Live Preview Pane */}
          <div className="flex-1 bg-gray-300/40 border border-gray-300 rounded-xl overflow-auto shadow-inner relative max-h-[85vh]">
            <div className="sticky top-0 h-0 w-full flex justify-end z-10 pointer-events-none">
              <div className="p-4">
                <button className="pointer-events-auto bg-indigo-600 hover:bg-indigo-700 transition focus:ring-4 focus:ring-indigo-300 text-white px-6 py-2.5 rounded-lg shadow-lg font-bold flex items-center gap-2">
                  <span>Download PDF</span>
                  <FileText className="w-4 h-4" />
                </button>
              </div>
            </div>
             
            {/* Centering Wrapper for the fixed-size A4 CV */}
            <div className="w-full min-w-[850px] flex justify-center py-8">
              <div className="shadow-2xl rounded-sm transition-all duration-300 bg-white" style={{ width: '794px', minHeight: '1123px' }}>
                <ActiveComponent cvData={generatedCvData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            Resume Builder
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Phase 1: Upload your existing resume and provide job details
          </p>
        </div>
        
        <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
          
          {/* Target Role Input */}
          <div>
            <label htmlFor="target-role" className="block text-sm font-medium text-gray-700">
              Target Role
            </label>
            <div className="mt-1">
              <input
                id="target-role"
                name="target-role"
                type="text"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                placeholder="e.g. Senior Frontend Developer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                disabled={isUploading}
              />
            </div>
          </div>

          {/* Job Description Section */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Job Description
              </label>
              <div className="flex space-x-2 bg-gray-100 p-1 rounded-md">
                <button 
                  type="button"
                  onClick={() => setJdMode('manual')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${jdMode === 'manual' ? 'bg-white shadow-sm text-gray-900 border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Type manually
                </button>
                <button 
                  type="button"
                  onClick={() => setJdMode('file')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${jdMode === 'file' ? 'bg-white shadow-sm text-gray-900 border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Upload file
                </button>
              </div>
            </div>
            <div className="mt-1">
              {jdMode === 'manual' ? (
                <textarea
                  id="job-description"
                  name="job-description"
                  rows="6"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  disabled={isUploading}
                />
              ) : (
                <label 
                  htmlFor="jd-upload"
                  className={`flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${jdFile ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 hover:border-gray-400 bg-white'}`}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={handleJdDrop}
                >
                  <div className="space-y-1 text-center w-full">
                    {jdFile ? (
                      <div className="flex flex-col items-center">
                        <FileType className="mx-auto h-12 w-12 text-indigo-500" />
                        <p className="mt-2 text-sm text-gray-800 font-medium">{jdFile.name}</p>
                        <p className="text-xs text-gray-500">{(jdFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setJdFile(null); setJdMode('manual'); }}
                          className="mt-3 text-sm text-red-600 hover:text-red-500 font-medium z-10 relative cursor-pointer"
                          disabled={isUploading}
                        >
                          Remove file
                        </button>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600 justify-center">
                          <span className="font-medium text-indigo-600 hover:text-indigo-500">Upload a file</span>
                          <span className="pl-1">or drag and drop</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          PDF, DOCX, TXT up to 5MB
                        </p>
                      </>
                    )}
                    <input id="jd-upload" name="jd-upload" type="file" className="sr-only" onChange={handleJdChange} accept=".pdf,.docx,.txt" disabled={isUploading}/>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* File Upload Dropzone (Resume) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resume/CV (PDF or DOCX)
            </label>
            <label 
              htmlFor="resume-upload"
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${file ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 hover:border-gray-400 bg-white'}`}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={handleResumeDrop}
            >
              <div className="space-y-1 text-center w-full">
                {file ? (
                  <div className="flex flex-col items-center">
                    <FileType className="mx-auto h-12 w-12 text-indigo-500" />
                    <p className="mt-2 text-sm text-gray-800 font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFile(null); }}
                      className="mt-3 text-sm text-red-600 hover:text-red-500 font-medium z-10 relative cursor-pointer"
                      disabled={isUploading}
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <span className="font-medium text-indigo-600 hover:text-indigo-500">Upload a file</span>
                      <span className="pl-1">or drag and drop</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, DOCX up to 5MB
                    </p>
                  </>
                )}
                <input id="resume-upload" name="resume-upload" type="file" className="sr-only" onChange={handleResumeChange} accept=".pdf,.docx" disabled={isUploading}/>
              </div>
            </label>
          </div>

          {/* Feedback Messages */}
          <div className="space-y-3">
            {error && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            {jdTrimmedNotice && (
              <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-yellow-500" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Job description trimmed to 2000 characters for processing.</h3>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isUploading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white transition-all duration-150 ease-in-out ${isUploading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md hover:shadow-lg'}`}
            >
              {isUploading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {loadingText}
                </span>
              ) : (
                'Process Resume & Generate CV'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
