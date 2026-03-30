import React from 'react';
import EditableField from '../EditableField';

const Classic = ({ cvData, isEditMode = false, onUpdate = () => {} }) => {
  if (!cvData) return null;

  const { personal, summary, experience, education, projects, skills, certifications, achievements, aiGenerated } = cvData;
  const safeAi = aiGenerated || { projects: [], achievements: [], skills: { technical: [], tools: [] } };

  return (
    <div
      className="bg-white mx-auto shadow-sm"
      style={{ width: '794px', minHeight: '1123px', padding: '40px 50px' }}
    >
      <div className="font-serif text-gray-900 leading-relaxed text-[13px]">

        {/* Header */}
        <header className="text-center mb-5">
          <EditableField
            as="h1"
            className="text-3xl font-bold uppercase tracking-wider mb-2 block text-center"
            value={personal?.name || ""}
            path={['personal', 'name']}
            isEditMode={isEditMode}
            onUpdate={onUpdate}
          />
          <div className="text-[13px] flex flex-wrap justify-center gap-x-3 gap-y-1 text-gray-700">
            {personal?.email !== undefined && <EditableField as="span" value={personal.email} path={['personal', 'email']} isEditMode={isEditMode} onUpdate={onUpdate} />}
            {personal?.phone !== undefined && <><span className="text-gray-400">|</span><EditableField as="span" value={personal.phone} path={['personal', 'phone']} isEditMode={isEditMode} onUpdate={onUpdate} /></>}
            {personal?.location !== undefined && <><span className="text-gray-400">|</span><EditableField as="span" value={personal.location} path={['personal', 'location']} isEditMode={isEditMode} onUpdate={onUpdate} /></>}
            {personal?.linkedin !== undefined && <><span className="text-gray-400">|</span><EditableField as="span" value={personal.linkedin.replace(/^https?:\/\//, '')} path={['personal', 'linkedin']} isEditMode={isEditMode} onUpdate={onUpdate} /></>}
            {personal?.portfolio !== undefined && <><span className="text-gray-400">|</span><EditableField as="span" value={personal.portfolio.replace(/^https?:\/\//, '')} path={['personal', 'portfolio']} isEditMode={isEditMode} onUpdate={onUpdate} /></>}
          </div>
        </header>

        {/* Summary */}
        {summary !== undefined && (
          <section className="mb-5">
            <h2 className="text-base font-bold uppercase border-b border-gray-300 mb-2 pb-1">Professional Summary</h2>
            <EditableField as="p" className="text-justify" value={summary} path={['summary']} isEditMode={isEditMode} onUpdate={onUpdate} />
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section className="mb-5">
            <h2 className="text-base font-bold uppercase border-b border-gray-300 mb-3 pb-1">Experience</h2>
            <div className="flex flex-col gap-4">
              {experience.map((job, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <EditableField as="h3" className="font-bold text-[14px]" value={job.role || ""} path={['experience', idx, 'role']} isEditMode={isEditMode} onUpdate={onUpdate} />
                    <EditableField as="span" className="italic whitespace-nowrap text-gray-600" value={job.duration || ""} path={['experience', idx, 'duration']} isEditMode={isEditMode} onUpdate={onUpdate} />
                  </div>
                  <EditableField as="div" className="font-semibold mb-1 text-gray-700" value={job.company || ""} path={['experience', idx, 'company']} isEditMode={isEditMode} onUpdate={onUpdate} />
                  {job.bullets && job.bullets.length > 0 && (
                    <ul className="mt-1 space-y-1 list-none pl-0">
                      {job.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2">
                          <span className="mt-[5px] shrink-0 w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                          <EditableField as="span" className="flex-1" value={bullet} path={['experience', idx, 'bullets', bIdx]} isEditMode={isEditMode} onUpdate={onUpdate} />
                        </li>
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
          <section className="mb-5">
            <h2 className="text-base font-bold uppercase border-b border-gray-300 mb-3 pb-1">Projects</h2>
            <div className="flex flex-col gap-3">
              {projects.map((proj, idx) => {
                const isAi = Array.isArray(safeAi.projects) && safeAi.projects.includes(idx);
                return (
                  <div key={idx}>
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <EditableField as="h3" className="font-bold text-[14px]" value={proj.name || ""} path={['projects', idx, 'name']} isEditMode={isEditMode} isAiGenerated={isAi} onUpdate={onUpdate} />
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noreferrer" className="text-[12px] text-indigo-600 hover:underline font-normal">View Project →</a>
                      )}
                    </div>
                    <EditableField as="p" className="mb-1.5" value={proj.description || ""} path={['projects', idx, 'description']} isEditMode={isEditMode} isAiGenerated={isAi} onUpdate={onUpdate} />
                    {proj.tech && Array.isArray(proj.tech) && proj.tech.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {proj.tech.map((t, tIdx) => (
                          <span key={tIdx} className="bg-gray-100 text-gray-700 text-[11px] px-2 py-0.5 rounded-full border border-gray-200">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <section className="mb-5">
            <h2 className="text-base font-bold uppercase border-b border-gray-300 mb-3 pb-1">Education</h2>
            <div className="flex flex-col gap-3">
              {education.map((edu, idx) => (
                <div key={idx} className="mb-1">
                  <div className="flex justify-between items-baseline">
                    <EditableField as="span" className="font-bold text-[13px]" value={edu.degree || ""} path={['education', idx, 'degree']} isEditMode={isEditMode} onUpdate={onUpdate} />
                    <EditableField as="span" className="text-[12px] text-gray-500 whitespace-nowrap" value={edu.year || ""} path={['education', idx, 'year']} isEditMode={isEditMode} onUpdate={onUpdate} />
                  </div>
                  <div className="flex justify-between items-baseline mt-0.5">
                    <EditableField as="span" className="text-[12px] text-gray-600" value={edu.institution || ""} path={['education', idx, 'institution']} isEditMode={isEditMode} onUpdate={onUpdate} />
                    {edu.grade !== undefined && (
                      <EditableField as="span" className="text-[12px] text-gray-500 italic whitespace-nowrap" value={edu.grade} path={['education', idx, 'grade']} isEditMode={isEditMode} onUpdate={onUpdate} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills && (skills.technical?.length > 0 || skills.soft?.length > 0 || skills.tools?.length > 0) && (
          <section className="mb-5">
            <h2 className="text-base font-bold uppercase border-b border-gray-300 mb-2 pb-1">Skills</h2>
            <div className="space-y-1">
              {skills.technical?.length > 0 && (
                <div>
                  <span className="font-bold">Technical: </span>
                  <EditableField as="span" value={(Array.isArray(skills.technical) ? skills.technical : []).join(', ')} path={['skills', 'technical']} isEditMode={isEditMode} isAiGenerated={safeAi.skills?.technical?.length > 0} onUpdate={(path, val) => onUpdate(path, val.split(',').map(s => s.trim()).filter(Boolean))} />
                </div>
              )}
              {skills.tools?.length > 0 && (
                <div>
                  <span className="font-bold">Tools: </span>
                  <EditableField as="span" value={(Array.isArray(skills.tools) ? skills.tools : []).join(', ')} path={['skills', 'tools']} isEditMode={isEditMode} isAiGenerated={safeAi.skills?.tools?.length > 0} onUpdate={(path, val) => onUpdate(path, val.split(',').map(s => s.trim()).filter(Boolean))} />
                </div>
              )}
              {skills.soft?.length > 0 && (
                <div>
                  <span className="font-bold">Soft Skills: </span>
                  <EditableField as="span" value={(Array.isArray(skills.soft) ? skills.soft : []).join(', ')} path={['skills', 'soft']} isEditMode={isEditMode} onUpdate={(path, val) => onUpdate(path, val.split(',').map(s => s.trim()).filter(Boolean))} />
                </div>
              )}
            </div>
          </section>
        )}

        {/* Achievements & Certifications */}
        {((achievements && achievements.length > 0) || (certifications && certifications.length > 0)) && (
          <section>
            <h2 className="text-base font-bold uppercase border-b border-gray-300 mb-2 pb-1">Additional Information</h2>
            <ul className="mt-1 space-y-1 list-none pl-0">
              {certifications?.map((cert, idx) => (
                <li key={'cert-' + idx} className="flex items-start gap-2">
                  <span className="mt-[5px] shrink-0 w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                  <EditableField as="span" className="flex-1" value={cert} path={['certifications', idx]} isEditMode={isEditMode} onUpdate={onUpdate} />
                </li>
              ))}
              {achievements?.map((ach, idx) => {
                const isAi = Array.isArray(safeAi.achievements) && safeAi.achievements.includes(idx);
                return (
                  <li key={'ach-' + idx} className="flex items-start gap-2">
                    <span className="mt-[5px] shrink-0 w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                    <EditableField as="span" className="flex-1" value={ach} path={['achievements', idx]} isEditMode={isEditMode} isAiGenerated={isAi} onUpdate={onUpdate} />
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};

export default Classic;
