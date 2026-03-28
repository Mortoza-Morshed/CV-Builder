import React from 'react';

const ModernMinimal = ({ cvData }) => {
  if (!cvData) return null;

  const { personal, summary, experience, education, projects, skills, certifications, achievements } = cvData;

  return (
    <div 
      className="bg-zinc-50 mx-auto shadow-sm flex font-sans"
      style={{ width: '794px', minHeight: '1123px' }}
    >
      {/* Left Column (35%) */}
      <div className="w-[35%] bg-zinc-800 text-zinc-100 p-8 flex flex-col gap-8">
        
        {/* Header - Personal Info */}
        <section>
          <h1 className="text-3xl font-extrabold tracking-tight mb-4 text-white uppercase">{personal?.name || ""}</h1>
          <div className="flex flex-col gap-2 text-sm text-zinc-300">
            {personal?.email && <a href={"mailto:" + personal.email} className="hover:text-white break-all">{personal.email}</a>}
            {personal?.phone && <span>{personal.phone}</span>}
            {personal?.location && <span>{personal.location}</span>}
            {personal?.linkedin && <a href={"https://" + personal.linkedin.replace(/^https?:\/\//, '')} className="hover:text-white break-all">{personal.linkedin.replace(/^https?:\/\//, '')}</a>}
            {personal?.portfolio && <a href={"https://" + personal.portfolio.replace(/^https?:\/\//, '')} className="hover:text-white break-all">{personal.portfolio.replace(/^https?:\/\//, '')}</a>}
          </div>
        </section>

        {/* Skills */}
        {skills && (skills.technical?.length > 0 || skills.soft?.length > 0 || skills.tools?.length > 0) && (
          <section>
            <h2 className="text-sm font-black tracking-widest text-zinc-400 uppercase mb-3 border-b border-zinc-700 pb-2">Skills</h2>
            <div className="flex flex-col gap-4 text-sm">
              {skills.technical && skills.technical.length > 0 && (
                <div>
                  <h3 className="font-bold text-white mb-1">Technical</h3>
                  <div className="flex flex-wrap gap-1">
                    {skills.technical.map((skill, idx) => (
                      <span key={idx} className="bg-zinc-700 px-2 py-0.5 rounded text-xs">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
              {skills.tools && skills.tools.length > 0 && (
                <div>
                  <h3 className="font-bold text-white mb-1">Tools & Platforms</h3>
                  <div className="flex flex-wrap gap-1">
                    {skills.tools.map((skill, idx) => (
                      <span key={idx} className="bg-zinc-700 px-2 py-0.5 rounded text-xs">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
              {skills.soft && skills.soft.length > 0 && (
                <div>
                  <h3 className="font-bold text-white mb-1">Soft Skills</h3>
                  <ul className="text-zinc-300 space-y-0.5">
                    {skills.soft.map((skill, idx) => <li key={idx}>{skill}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <section>
            <h2 className="text-sm font-black tracking-widest text-zinc-400 uppercase mb-3 border-b border-zinc-700 pb-2">Education</h2>
            <div className="flex flex-col gap-4 text-sm">
              {education.map((edu, idx) => (
                <div key={idx}>
                  <h3 className="font-bold text-white leading-tight">{edu.degree || ""}</h3>
                  <div className="text-zinc-400 mt-1">{edu.institution || ""}</div>
                  <div className="text-zinc-500 text-xs mt-0.5">{edu.year || ""} {edu.grade ? " | " + edu.grade : ""}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <section>
            <h2 className="text-sm font-black tracking-widest text-zinc-400 uppercase mb-3 border-b border-zinc-700 pb-2">Certifications</h2>
            <ul className="text-sm text-zinc-300 space-y-1">
              {certifications.map((cert, idx) => (
                <li key={idx}>{cert}</li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Right Column (65%) */}
      <div className="w-[65%] p-8 bg-white text-zinc-800 flex flex-col gap-6">
        
        {/* Summary */}
        {summary && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-wider text-zinc-800 mb-2 border-b-2 border-zinc-200 pb-1">Profile</h2>
            <p className="text-sm text-zinc-600 leading-relaxed font-medium">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section className="flex-1">
            <h2 className="text-lg font-bold uppercase tracking-wider text-zinc-800 mb-4 border-b-2 border-zinc-200 pb-1">Professional Experience</h2>
            <div className="flex flex-col gap-5">
              {experience.map((job, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-start mb-0.5">
                    <h3 className="font-bold text-zinc-900">{job.role || ""}</h3>
                    <span className="text-xs font-semibold text-zinc-500 whitespace-nowrap bg-zinc-100 px-2 py-1 rounded">{job.duration || ""}</span>
                  </div>
                  <div className="text-sm font-semibold text-indigo-600 mb-2">{job.company || ""}</div>
                  {job.bullets && job.bullets.length > 0 && (
                    <ul className="list-outside ml-4 list-disc text-sm text-zinc-600 space-y-1.5 marker:text-zinc-400">
                      {job.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="leading-snug">{bullet}</li>
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
          <section>
            <h2 className="text-lg font-bold uppercase tracking-wider text-zinc-800 mb-4 border-b-2 border-zinc-200 pb-1">Key Projects</h2>
            <div className="flex flex-col gap-4">
              {projects.map((proj, idx) => (
                <div key={idx}>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-zinc-900">{proj.name || ""}</h3>
                    {proj.link && <a href={"https://" + proj.link.replace(/^https?:\/\//, '')} className="text-xs text-indigo-500 hover:underline">{proj.link.replace(/^https?:\/\//, '')}</a>}
                  </div>
                  <p className="text-sm text-zinc-600 mb-1 leading-snug">{proj.description || ""}</p>
                  {proj.tech && proj.tech.length > 0 && (
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                      {proj.tech.join(' • ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements */}
        {achievements && achievements.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-wider text-zinc-800 mb-3 border-b-2 border-zinc-200 pb-1">Achievements</h2>
            <ul className="list-outside ml-4 list-disc text-sm text-zinc-600 space-y-1 marker:text-zinc-400">
              {achievements.map((ach, idx) => (
                <li key={idx} className="leading-snug">{ach}</li>
              ))}
            </ul>
          </section>
        )}

      </div>
    </div>
  );
};

export default ModernMinimal;
