import React from 'react';

const Classic = ({ cvData }) => {
  if (!cvData) return null;

  const { personal, summary, experience, education, projects, skills, certifications, achievements } = cvData;

  return (
    <div 
      className="bg-white mx-auto shadow-sm"
      style={{ width: '794px', minHeight: '1123px', padding: '40px 50px' }}
    >
      <div className="font-serif text-gray-900 leading-relaxed">
        
        {/* Header - Personal Info */}
        <header className="text-center mb-6 border-b-2 border-gray-800 pb-4">
          <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">{personal?.name || ""}</h1>
          <div className="text-sm flex flex-wrap justify-center gap-x-4 gap-y-1 text-gray-700">
            {personal?.email && <span>{personal.email}</span>}
            {personal?.phone && <span>{personal.phone}</span>}
            {personal?.location && <span>{personal.location}</span>}
            {personal?.linkedin && <span>{personal.linkedin.replace(/^https?:\/\//, '')}</span>}
            {personal?.portfolio && <span>{personal.portfolio.replace(/^https?:\/\//, '')}</span>}
          </div>
        </header>

        {/* Summary */}
        {summary && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-2 pb-1">Professional Summary</h2>
            <p className="text-sm text-justify">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">Experience</h2>
            <div className="flex flex-col gap-4">
              {experience.map((job, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-md">{job.role || ""}</h3>
                    <span className="text-sm italic">{job.duration || ""}</span>
                  </div>
                  <div className="text-sm font-semibold mb-1 text-gray-700">{job.company || ""}</div>
                  {job.bullets && job.bullets.length > 0 && (
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {job.bullets.map((bullet, bIdx) => (
                        <li key={bIdx}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">Projects</h2>
            <div className="flex flex-col gap-4">
              {projects.map((proj, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-md">
                      {proj.name || ""} 
                      {proj.link && <span className="font-normal text-sm ml-2 text-indigo-600">({proj.link.replace(/^https?:\/\//, '')})</span>}
                    </h3>
                  </div>
                  <p className="text-sm mb-1">{proj.description || ""}</p>
                  {proj.tech && proj.tech.length > 0 && (
                    <p className="text-xs italic text-gray-600">Technologies: {proj.tech.join(', ')}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">Education</h2>
            <div className="flex flex-col gap-2">
              {education.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-baseline">
                  <div>
                    <h3 className="font-bold text-sm">{edu.degree || ""}</h3>
                    <div className="text-sm text-gray-700">{edu.institution || ""}</div>
                  </div>
                  <div className="text-right text-sm">
                    <div>{edu.year || ""}</div>
                    {edu.grade && <div className="italic text-gray-600">{edu.grade}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills && (skills.technical?.length > 0 || skills.soft?.length > 0 || skills.tools?.length > 0) && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">Skills</h2>
            <div className="text-sm space-y-1">
              {skills.technical && skills.technical.length > 0 && (
                <div><span className="font-bold">Technical:</span> {skills.technical.join(', ')}</div>
              )}
              {skills.tools && skills.tools.length > 0 && (
                <div><span className="font-bold">Tools:</span> {skills.tools.join(', ')}</div>
              )}
              {skills.soft && skills.soft.length > 0 && (
                <div><span className="font-bold">Soft Skills:</span> {skills.soft.join(', ')}</div>
              )}
            </div>
          </section>
        )}

        {/* Achievements & Certifications (Combined for space) */}
        {((achievements && achievements.length > 0) || (certifications && certifications.length > 0)) && (
          <section>
            <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-2 pb-1">Additional Information</h2>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {certifications?.map((cert, idx) => (
                <li key={"cert-" + idx}>{cert}</li>
              ))}
              {achievements?.map((ach, idx) => (
                <li key={"ach-" + idx}>{ach}</li>
              ))}
            </ul>
          </section>
        )}

      </div>
    </div>
  );
};

export default Classic;
