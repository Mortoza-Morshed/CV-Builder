import { useState } from 'react';
import { UploadCloud, FileType, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

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
      
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'An error occurred during processing. Please try again.');
    } finally {
      setIsUploading(false);
      setLoadingText('');
    }
  };

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

            {success && (
              <div className="rounded-md bg-green-50 p-4 border border-green-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">CV processing complete! Check console for the final CV JSON.</h3>
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
