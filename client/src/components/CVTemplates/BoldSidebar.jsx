import React from 'react';

const BoldSidebar = ({ cvData }) => {
  if (!cvData) return null;

  const { personal, summary, experience, education, projects, skills, certifications, achievements } = cvData;

  return (
    <div 
      className="bg-white mx-auto shadow-sm flex font-sans"
      style={{ width: '794px', minHeight: '1123px' }}
    >
      {/* Sidebar Content (Left Pane) */}
      <div className="w-[30%] bg-blue-600 text-blue-50 p-6 flex flex-col gap-8 break-words">
        
        {/* Profile Info */}
        <section className="text-center mt-4">
          <div className="w-24 h-24 mx-auto bg-blue-400 rounded-full flex items-center justify-center text-4xl font-bold text-white mb-4">
            {personal?.name ? personal.name.split(' ').map(n => n[0]).join('') : "CV"}
          </div>
          <h2 className="text-xl font-bold text-white mb-1">{personal?.name || ""}</h2>
          <p className="text-sm text-blue-200 font-medium">Professional Profile</p>
        </section>

        {/* Contact Details */}
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wider text-blue-200 border-b border-blue-400 pb-1 mb-3">Contact</h3>
          <ul className="text-xs space-y-3">
            {personal?.email && (
              <li>
                <span className="block text-blue-200 font-medium mb-0.5">Email</span>
                <span className="text-white break-all">{personal.email}</span>
              </li>
            )}
            {personal?.phone && (
              <li>
                <span className="block text-blue-200 font-medium mb-0.5">Phone</span>
                <span className="text-white">{personal.phone}</span>
              </li>
            )}
            {personal?.location && (
              <li>
                <span className="block text-blue-200 font-medium mb-0.5">Location</span>
                <span className="text-white">{personal.location}</span>
              </li>
            )}
            {personal?.linkedin && (
              <li>
                <span className="block text-blue-200 font-medium mb-0.5">LinkedIn</span>
                <a href={"https://" + personal.linkedin.replace(/^https?:\/\//, '')} className="hover:underline text-white break-all">{personal.linkedin.replace(/^https?:\/\//, '')}</a>
              </li>
            )}
            {personal?.portfolio && (
              <li>
                <span className="block text-blue-200 font-medium mb-0.5">Portfolio</span>
                <a href={"https://" + personal.portfolio.replace(/^https?:\/\//, '')} className="hover:underline text-white break-all">{personal.portfolio.replace(/^https?:\/\//, '')}</a>
              </li>
            )}
          </ul>
        </section>

        {/* Core Skills */}
        {skills && (skills.technical?.length > 0 || skills.soft?.length > 0 || skills.tools?.length > 0) && (
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-200 border-b border-blue-400 pb-1 mb-3">Expertise</h3>
            <div className="flex flex-col gap-3 text-xs">
              {skills.technical && skills.technical.length > 0 && (
                <div>
                  <h4 className="font-bold text-blue-100 mb-1">Technical Skills</h4>
                  <p className="text-white leading-relaxed">{skills.technical.join(' • ')}</p>
                </div>
              )}
              {skills.tools && skills.tools.length > 0 && (
                <div>
                  <h4 className="font-bold text-blue-100 mb-1">Tools & Platforms</h4>
                  <p className="text-white leading-relaxed">{skills.tools.join(' • ')}</p>
                </div>
              )}
              {skills.soft && skills.soft.length > 0 && (
                <div>
                  <h4 className="font-bold text-blue-100 mb-1">Professional Skills</h4>
                  <p className="text-white leading-relaxed">{skills.soft.join(' • ')}</p>
                </div>
              )}
            </div>
          </section>
        )}

      </div>

      {/* Main Content (Right Pane) */}
      <div className="w-[70%] p-8 flex flex-col gap-6 text-gray-800">
        
        {/* Name Header Large */}
        <header className="mb-2">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">{personal?.name || ""}</h1>
          <div className="w-16 h-1 bg-blue-600 rounded"></div>
        </header>

        {/* Summary */}
        {summary && (
          <section>
            <h2 className="text-xl font-bold text-blue-600 mb-2 flex items-center gap-2">
              <span className="inline-block w-6 text-center">☺</span> Profile
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
          </section>
        )}

        {/* Professional Experience */}
        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-blue-600 mb-4 flex items-center gap-2">
              <span className="inline-block w-6 text-center">💼</span> Experience
            </h2>
            <div className="flex flex-col gap-5">
              {experience.map((job, idx) => (
                <div key={idx} className="relative pl-4 border-l-2 border-gray-200">
                  <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-[7px] top-1"></div>
                  <h3 className="font-bold text-gray-900 text-base">{job.role || ""}</h3>
                  <div className="flex items-center gap-2 mb-2 text-sm">
                    <span className="font-semibold text-gray-700">{job.company || ""}</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-blue-600 font-medium italic">{job.duration || ""}</span>
                  </div>
                  {job.bullets && job.bullets.length > 0 && (
                    <ul className="list-disc ml-4 text-sm text-gray-600 space-y-1">
                      {job.bullets.map((b, bIdx) => <li key={bIdx}>{b}</li>)}
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
            <h2 className="text-xl font-bold text-blue-600 mb-3 flex items-center gap-2">
              <span className="inline-block w-6 text-center">🚀</span> Projects
            </h2>
            <div className="flex flex-col gap-4">
              {projects.map((proj, idx) => (
                <div key={idx}>
                  <h3 className="font-bold text-gray-800 text-sm">
                    {proj.name || ""}
                    {proj.link && <a href={"https://" + proj.link.replace(/^https?:\/\//, '')} className="ml-2 text-xs font-normal text-blue-500 hover:underline">[{proj.link.replace(/^https?:\/\//, '')}]</a>}
                  </h3>
                  <p className="text-sm text-gray-600 my-1">{proj.description || ""}</p>
                  {proj.tech && proj.tech.length > 0 && (
                    <div className="text-xs text-gray-500 italic mt-0.5">Tech stack: {proj.tech.join(', ')}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-blue-600 mb-3 flex items-center gap-2">
              <span className="inline-block w-6 text-center">🎓</span> Education
            </h2>
            <div className="flex flex-col gap-3">
              {education.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">{edu.degree || ""}</h3>
                    <p className="text-gray-600 text-sm">{edu.institution || ""}</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm font-semibold text-blue-600">{edu.year || ""}</span>
                    {edu.grade && <span className="text-xs text-gray-500">{edu.grade}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements / Certs */}
        {((achievements && achievements.length > 0) || (certifications && certifications.length > 0)) && (
          <section>
            <h2 className="text-xl font-bold text-blue-600 mb-3 flex items-center gap-2">
              <span className="inline-block w-6 text-center">★</span> Highlights
            </h2>
            <ul className="list-disc ml-5 text-sm text-gray-600 space-y-1">
              {achievements?.map((ach, idx) => <li key={"ach-" + idx}>{ach}</li>)}
              {certifications?.map((crt, idx) => <li key={"crt-" + idx}>{crt}</li>)}
            </ul>
          </section>
        )}

      </div>
    </div>
  );
};

export default BoldSidebar;
