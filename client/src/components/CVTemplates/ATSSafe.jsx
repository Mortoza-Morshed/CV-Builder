import React from 'react';
import EditableField from '../EditableField';

const ATSSafe = ({ cvData, isEditMode = false, onUpdate = () => {} }) => {
  if (!cvData) return null;

  const { personal, summary, experience, education, projects, skills, certifications, achievements, aiGenerated } = cvData;
  const safeAi = aiGenerated || { projects: [], achievements: [], skills: { technical: [], tools: [] } };

  // Build the contact line as individual pieces so each is editable
  const contactParts = [
    personal?.location,
    personal?.phone,
    personal?.email,
    personal?.linkedin,
    personal?.portfolio,
  ].filter(Boolean);

  return (
    <div
      className="bg-white mx-auto text-black font-sans leading-relaxed"
      style={{ width: '794px', minHeight: '1123px', padding: '0.75in 1in' }}
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="text-center mb-1 w-full">
        <EditableField
          as="h1"
          className="text-xl font-bold text-center block w-full"
          value={personal?.name || ""}
          path={['personal', 'name']}
          isEditMode={isEditMode}
          onUpdate={onUpdate}
        />
      </div>

      {/* Contact row — pipe-separated, centered */}
      <div className="text-center text-sm mb-1 w-full flex justify-center flex-wrap gap-x-1 gap-y-0.5">
        {personal?.location !== undefined && (
          <EditableField as="span" value={personal.location} path={['personal', 'location']} isEditMode={isEditMode} onUpdate={onUpdate} />
        )}
        {personal?.phone !== undefined && (
          <><span className="text-gray-400 select-none"> | </span><EditableField as="span" value={personal.phone} path={['personal', 'phone']} isEditMode={isEditMode} onUpdate={onUpdate} /></>
        )}
        {personal?.email !== undefined && (
          <><span className="text-gray-400 select-none"> | </span><EditableField as="span" value={personal.email} path={['personal', 'email']} isEditMode={isEditMode} onUpdate={onUpdate} /></>
        )}
        {personal?.linkedin !== undefined && (
          <><span className="text-gray-400 select-none"> | </span><EditableField as="span" value={personal.linkedin} path={['personal', 'linkedin']} isEditMode={isEditMode} onUpdate={onUpdate} /></>
        )}
        {personal?.portfolio !== undefined && (
          <><span className="text-gray-400 select-none"> | </span><EditableField as="span" value={personal.portfolio} path={['personal', 'portfolio']} isEditMode={isEditMode} onUpdate={onUpdate} /></>
        )}
      </div>


      {/* ── Summary ────────────────────────────────────────── */}
      {summary !== undefined && (
        <div className="mb-4">
          <h2 className="text-sm font-bold border-b border-black mb-1 uppercase">Summary</h2>
          <EditableField as="p" className="text-sm block" value={summary} path={['summary']} isEditMode={isEditMode} onUpdate={onUpdate} />
        </div>
      )}

      {/* ── Experience ─────────────────────────────────────── */}
      {experience && experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold border-b border-black mb-2 uppercase">Experience</h2>
          {experience.map((job, idx) => (
            <div key={idx} className="mb-3">
              <div className="flex justify-between text-sm font-bold">
                <EditableField as="span" value={job.role || ""} path={['experience', idx, 'role']} isEditMode={isEditMode} onUpdate={onUpdate} />
                <EditableField as="span" className="text-right" value={job.duration || ""} path={['experience', idx, 'duration']} isEditMode={isEditMode} onUpdate={onUpdate} />
              </div>
              <EditableField as="div" className="text-sm font-medium mb-1 block" value={job.company || ""} path={['experience', idx, 'company']} isEditMode={isEditMode} onUpdate={onUpdate} />
              {job.bullets && job.bullets.length > 0 && (
                <ul className="mt-1 space-y-0.5 list-none pl-0">
                  {job.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2">
                      <span className="shrink-0 mt-[3px]">–</span>
                      <EditableField as="span" className="flex-1" value={b} path={['experience', idx, 'bullets', bIdx]} isEditMode={isEditMode} onUpdate={onUpdate} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Education ──────────────────────────────────────── */}
      {education && education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold border-b border-black mb-2 uppercase">Education</h2>
          {education.map((edu, idx) => (
            <div key={idx} className="mb-2 text-sm">
              <div className="flex justify-between items-baseline">
                <EditableField as="span" className="font-bold" value={edu.degree || ""} path={['education', idx, 'degree']} isEditMode={isEditMode} onUpdate={onUpdate} />
                <EditableField as="span" className="text-sm whitespace-nowrap" value={edu.year || ""} path={['education', idx, 'year']} isEditMode={isEditMode} onUpdate={onUpdate} />
              </div>
              <div className="flex justify-between items-baseline mt-0.5">
                <EditableField as="span" className="text-sm" value={edu.institution || ""} path={['education', idx, 'institution']} isEditMode={isEditMode} onUpdate={onUpdate} />
                {edu.grade !== undefined && (
                  <EditableField as="span" className="text-sm whitespace-nowrap" value={edu.grade} path={['education', idx, 'grade']} isEditMode={isEditMode} onUpdate={onUpdate} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Projects ───────────────────────────────────────── */}
      {projects && projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold border-b border-black mb-2 uppercase">Projects</h2>
          {projects.map((proj, idx) => {
            const isAi = Array.isArray(safeAi.projects) && safeAi.projects.includes(idx);
            return (
              <div key={idx} className="mb-2 text-sm">
                <div className="flex items-center gap-2 flex-wrap font-bold">
                  <EditableField as="span" value={proj.name || ""} path={['projects', idx, 'name']} isEditMode={isEditMode} isAiGenerated={isAi} onUpdate={onUpdate} />
                  {proj.link && (
                    <span className="font-normal text-sm">| {proj.link}</span>
                  )}
                </div>
                {/* ATS: plain comma-separated tech — no colors/pills */}
                {proj.tech && Array.isArray(proj.tech) && proj.tech.length > 0 && (
                  <div className="text-sm italic text-gray-700">
                    Technologies: <EditableField as="span" value={proj.tech.join(', ')} path={['projects', idx, 'tech']} isEditMode={isEditMode} isAiGenerated={isAi} onUpdate={(path, val) => onUpdate(path, val.split(',').map(s => s.trim()))} />
                  </div>
                )}
                <EditableField as="p" className="block mt-0.5" value={proj.description || ""} path={['projects', idx, 'description']} isEditMode={isEditMode} isAiGenerated={isAi} onUpdate={onUpdate} />
              </div>
            );
          })}
        </div>
      )}

      {/* ── Skills ─────────────────────────────────────────── */}
      {skills && (skills.technical?.length > 0 || skills.soft?.length > 0 || skills.tools?.length > 0) && (
        <div className="mb-4">
          <h2 className="text-sm font-bold border-b border-black mb-2 uppercase">Skills</h2>
          <div className="text-sm space-y-0.5">
            {skills.technical?.length > 0 && (
              <div>
                <strong>Technical: </strong>
                <EditableField as="span" value={(Array.isArray(skills.technical) ? skills.technical : []).join(', ')} path={['skills', 'technical']} isEditMode={isEditMode} isAiGenerated={safeAi.skills?.technical?.length > 0} onUpdate={(path, val) => onUpdate(path, val.split(',').map(s => s.trim()).filter(Boolean))} />
              </div>
            )}
            {skills.tools?.length > 0 && (
              <div>
                <strong>Tools: </strong>
                <EditableField as="span" value={(Array.isArray(skills.tools) ? skills.tools : []).join(', ')} path={['skills', 'tools']} isEditMode={isEditMode} isAiGenerated={safeAi.skills?.tools?.length > 0} onUpdate={(path, val) => onUpdate(path, val.split(',').map(s => s.trim()).filter(Boolean))} />
              </div>
            )}
            {skills.soft?.length > 0 && (
              <div>
                <strong>Soft Skills: </strong>
                <EditableField as="span" value={(Array.isArray(skills.soft) ? skills.soft : []).join(', ')} path={['skills', 'soft']} isEditMode={isEditMode} onUpdate={(path, val) => onUpdate(path, val.split(',').map(s => s.trim()).filter(Boolean))} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Certifications & Achievements ──────────────────── */}
      {((achievements && achievements.length > 0) || (certifications && certifications.length > 0)) && (
        <div>
          <h2 className="text-sm font-bold border-b border-black mb-2 uppercase">Certifications &amp; Achievements</h2>
          <ul className="list-disc pl-5 text-sm space-y-0.5">
            {certifications?.map((crt, idx) => (
              <li key={"c-" + idx}>
                <EditableField as="span" value={crt} path={['certifications', idx]} isEditMode={isEditMode} onUpdate={onUpdate} />
              </li>
            ))}
            {achievements?.map((ach, idx) => {
              const isAi = Array.isArray(safeAi.achievements) && safeAi.achievements.includes(idx);
              return (
                <li key={"a-" + idx}>
                  <EditableField as="span" value={ach} path={['achievements', idx]} isEditMode={isEditMode} isAiGenerated={isAi} onUpdate={onUpdate} />
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ATSSafe;
