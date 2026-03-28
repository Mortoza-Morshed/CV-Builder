import React from 'react';

const ATSSafe = ({ cvData }) => {
  if (!cvData) return null;

  const { personal, summary, experience, education, projects, skills, certifications, achievements } = cvData;

  return (
    <div 
      className="bg-white mx-auto shadow-sm text-black font-sans leading-relaxed"
      style={{ width: '794px', minHeight: '1123px', padding: '1in' }}
    >
      {/* Header - Personal Info */}
      <h1 className="text-2xl font-bold text-center mb-1">{personal?.name || ""}</h1>
      <p className="text-center text-sm mb-4">
        {personal?.location || ""}
        {personal?.phone ? " | " + personal.phone : ""}
        {personal?.email ? " | " + personal.email : ""}
        {personal?.linkedin ? " | " + personal.linkedin : ""}
        {personal?.portfolio ? " | " + personal.portfolio : ""}
      </p>

      {/* Summary */}
      {summary && (
        <div className="mb-4">
          <h2 className="text-lg font-bold border-b border-black mb-2">SUMMARY</h2>
          <p className="text-sm">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-bold border-b border-black mb-2">EXPERIENCE</h2>
          {experience.map((job, idx) => (
            <div key={idx} className="mb-3">
              <div className="flex justify-between text-sm font-bold">
                <span>{job.role || ""}</span>
                <span>{job.duration || ""}</span>
              </div>
              <div className="text-sm font-medium mb-1">
                {job.company || ""}
              </div>
              {job.bullets && job.bullets.length > 0 && (
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {job.bullets.map((b, bIdx) => <li key={bIdx}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-bold border-b border-black mb-2">EDUCATION</h2>
          {education.map((edu, idx) => (
            <div key={idx} className="mb-2 flex justify-between text-sm">
              <div>
                <span className="font-bold">{edu.degree || ""}</span>
                <span> - {edu.institution || ""}</span>
              </div>
              <div>
                <span>{edu.year || ""}</span>
                {edu.grade && <span> ({edu.grade})</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-bold border-b border-black mb-2">PROJECTS</h2>
          {projects.map((proj, idx) => (
            <div key={idx} className="mb-2">
              <div className="text-sm">
                <span className="font-bold">{proj.name || ""}</span>
                {proj.link && <span> | {proj.link}</span>}
                {proj.tech && proj.tech.length > 0 && <span> | <span className="italic">{proj.tech.join(', ')}</span></span>}
              </div>
              <p className="text-sm">{proj.description || ""}</p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills && (skills.technical?.length > 0 || skills.soft?.length > 0 || skills.tools?.length > 0) && (
        <div className="mb-4">
          <h2 className="text-lg font-bold border-b border-black mb-2">SKILLS</h2>
          <div className="text-sm space-y-1">
            {skills.technical && skills.technical.length > 0 && (
              <p><strong>Technical:</strong> {skills.technical.join(', ')}</p>
            )}
            {skills.tools && skills.tools.length > 0 && (
              <p><strong>Tools:</strong> {skills.tools.join(', ')}</p>
            )}
            {skills.soft && skills.soft.length > 0 && (
              <p><strong>Soft:</strong> {skills.soft.join(', ')}</p>
            )}
          </div>
        </div>
      )}

      {/* Highlights / Achievements / Certs */}
      {((achievements && achievements.length > 0) || (certifications && certifications.length > 0)) && (
        <div>
          <h2 className="text-lg font-bold border-b border-black mb-2">CERTIFICATIONS & ACHIEVEMENTS</h2>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {certifications?.map((crt, idx) => <li key={"c-" + idx}>{crt}</li>)}
            {achievements?.map((ach, idx) => <li key={"a-" + idx}>{ach}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ATSSafe;
