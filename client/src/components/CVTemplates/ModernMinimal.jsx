import React from "react";
import EditableField from "../EditableField";

const ModernMinimal = ({ cvData, isEditMode = false, onUpdate = () => {} }) => {
  if (!cvData) return null;

  const {
    personal,
    summary,
    experience,
    education,
    projects,
    skills,
    certifications,
    achievements,
    languages,
    interests,
    coreCompetencies,
    references,
    aiGenerated,
  } = cvData;
  const safeAi = aiGenerated || {
    projects: [],
    achievements: [],
    skills: { technical: [], tools: [] },
  };

  return (
    <div
      className="bg-zinc-50 mx-auto shadow-sm flex font-sans"
      style={{ width: "794px", minHeight: "1123px" }}
    >
      {/* Left Column (35%) — dark sidebar */}
      <div className="w-[35%] bg-zinc-800 text-zinc-100 p-8 flex flex-col gap-7">
        {/* Name + Contact */}
        <section>
          <EditableField
            as="h1"
            className="text-2xl font-extrabold tracking-tight mb-3 text-white uppercase block"
            value={personal?.name || ""}
            path={["personal", "name"]}
            isEditMode={isEditMode}
            darkBackground={true}
            onUpdate={onUpdate}
          />
          <div className="flex flex-col gap-1.5 text-xs text-zinc-300">
            {personal?.email !== undefined && (
              <EditableField
                as="span"
                className="hover:text-white break-all block"
                value={personal.email}
                path={["personal", "email"]}
                isEditMode={isEditMode}
                darkBackground={true}
                onUpdate={onUpdate}
              />
            )}
            {personal?.phone !== undefined && (
              <EditableField
                as="span"
                className="block"
                value={personal.phone}
                path={["personal", "phone"]}
                isEditMode={isEditMode}
                darkBackground={true}
                onUpdate={onUpdate}
              />
            )}
            {personal?.location !== undefined && (
              <EditableField
                as="span"
                className="block"
                value={personal.location}
                path={["personal", "location"]}
                isEditMode={isEditMode}
                darkBackground={true}
                onUpdate={onUpdate}
              />
            )}
            {personal?.linkedin !== undefined && (
              <EditableField
                as="span"
                className="break-all block"
                value={personal.linkedin.replace(/^https?:\/\//, "")}
                path={["personal", "linkedin"]}
                isEditMode={isEditMode}
                darkBackground={true}
                onUpdate={onUpdate}
              />
            )}
            {personal?.portfolio !== undefined && (
              <EditableField
                as="span"
                className="break-all block"
                value={personal.portfolio.replace(/^https?:\/\//, "")}
                path={["personal", "portfolio"]}
                isEditMode={isEditMode}
                darkBackground={true}
                onUpdate={onUpdate}
              />
            )}
          </div>
        </section>

        {/* Skills */}
        {skills &&
          (skills.technical?.length > 0 || skills.soft?.length > 0 || skills.tools?.length > 0) && (
            <section>
              <h2 className="text-xs font-black tracking-widest text-zinc-400 uppercase mb-3 border-b border-zinc-700 pb-2">
                Skills
              </h2>
              <div className="flex flex-col gap-4 text-xs">
                {skills.technical && skills.technical.length > 0 && (
                  <div>
                    <h3 className="font-bold text-white mb-1.5">Technical</h3>
                    <div className="flex flex-wrap gap-1">
                      {skills.technical.map((skill, idx) => {
                        const isAi =
                          Array.isArray(safeAi.skills?.technical) &&
                          safeAi.skills.technical.includes(skill);
                        return (
                          <EditableField
                            as="span"
                            key={idx}
                            className="bg-zinc-700 px-2 py-0.5 rounded text-xs"
                            value={skill}
                            path={["skills", "technical", idx]}
                            isEditMode={isEditMode}
                            isAiGenerated={isAi}
                            darkBackground={true}
                            onUpdate={onUpdate}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
                {skills.tools && skills.tools.length > 0 && (
                  <div>
                    <h3 className="font-bold text-white mb-1.5">Tools & Platforms</h3>
                    <div className="flex flex-wrap gap-1">
                      {skills.tools.map((skill, idx) => {
                        const isAi =
                          Array.isArray(safeAi.skills?.tools) &&
                          safeAi.skills.tools.includes(skill);
                        return (
                          <EditableField
                            as="span"
                            key={idx}
                            className="bg-zinc-700 px-2 py-0.5 rounded text-xs"
                            value={skill}
                            path={["skills", "tools", idx]}
                            isEditMode={isEditMode}
                            isAiGenerated={isAi}
                            darkBackground={true}
                            onUpdate={onUpdate}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
                {skills.soft && skills.soft.length > 0 && (
                  <div>
                    <h3 className="font-bold text-white mb-1.5">Soft Skills</h3>
                    <ul className="text-zinc-300 space-y-0.5 list-disc pl-4">
                      {skills.soft.map((skill, idx) => (
                        <li key={idx}>
                          <EditableField
                            as="span"
                            value={skill}
                            path={["skills", "soft", idx]}
                            isEditMode={isEditMode}
                            darkBackground={true}
                            onUpdate={onUpdate}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <section>
            <h2 className="text-xs font-black tracking-widest text-zinc-400 uppercase mb-3 border-b border-zinc-700 pb-2">
              Languages
            </h2>
            <ul className="space-y-1">
              {languages.map((lang, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0" />
                  <EditableField
                    as="span"
                    value={lang}
                    path={["languages", idx]}
                    className="text-xs text-zinc-300"
                    isEditMode={isEditMode}
                    darkBackground={true}
                    onUpdate={onUpdate}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Interests */}
        {interests && interests.length > 0 && (
          <section>
            <h2 className="text-xs font-black tracking-widest text-zinc-400 uppercase mb-3 border-b border-zinc-700 pb-2">
              Interests
            </h2>
            <ul className="space-y-1">
              {interests.map((interest, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0" />
                  <EditableField
                    as="span"
                    value={interest}
                    path={["interests", idx]}
                    className="text-xs text-zinc-300"
                    isEditMode={isEditMode}
                    darkBackground={true}
                    onUpdate={onUpdate}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Core Competencies */}
        {coreCompetencies && coreCompetencies.length > 0 && (
          <section>
            <h2 className="text-xs font-black tracking-widest text-zinc-400 uppercase mb-3 border-b border-zinc-700 pb-2">
              Core Competencies
            </h2>
            <ul className="space-y-1">
              {coreCompetencies.map((comp, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0" />
                  <EditableField
                    as="span"
                    value={comp}
                    path={['coreCompetencies', idx]}
                    className="text-xs text-zinc-300"
                    isEditMode={isEditMode}
                    darkBackground={true}
                    onUpdate={onUpdate}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* References */}
        <section>
          <h2 className="text-xs font-black tracking-widest text-zinc-400 uppercase mb-3 border-b border-zinc-700 pb-2">
            References
          </h2>
          <p className="text-xs text-zinc-400 italic">
            {references || 'Available upon request'}
          </p>
        </section>
      </div>

      {/* Right Column (65%) */}
      <div className="w-[65%] p-8 bg-white text-zinc-800 flex flex-col gap-5">
        {/* Summary */}
        {summary !== undefined && (
          <section>
            <h2 className="text-base font-bold uppercase tracking-wider text-zinc-800 mb-2 border-b-2 border-zinc-200 pb-1">
              Profile
            </h2>
            <EditableField
              as="p"
              className="text-sm text-zinc-600 leading-relaxed block"
              value={summary}
              path={["summary"]}
              isEditMode={isEditMode}
              onUpdate={onUpdate}
            />
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-base font-bold uppercase tracking-wider text-zinc-800 mb-3 border-b-2 border-zinc-200 pb-1">
              Professional Experience
            </h2>
            <div className="flex flex-col gap-4">
              {experience.map((job, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-start mb-0.5">
                    <EditableField
                      as="h3"
                      className="font-bold text-zinc-900 text-sm"
                      value={job.role || ""}
                      path={["experience", idx, "role"]}
                      isEditMode={isEditMode}
                      onUpdate={onUpdate}
                    />
                    <EditableField
                      as="span"
                      className="text-xs font-semibold text-zinc-500 whitespace-nowrap bg-zinc-100 px-2 py-0.5 rounded"
                      value={job.duration || ""}
                      path={["experience", idx, "duration"]}
                      isEditMode={isEditMode}
                      onUpdate={onUpdate}
                    />
                  </div>
                  <EditableField
                    as="div"
                    className="text-xs font-semibold text-indigo-600 mb-1.5"
                    value={job.company || ""}
                    path={["experience", idx, "company"]}
                    isEditMode={isEditMode}
                    onUpdate={onUpdate}
                  />
                  {job.bullets && job.bullets.length > 0 && (
                    <ul className="mt-1 space-y-1 list-none pl-0">
                      {job.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2">
                          <span className="mt-[5px] shrink-0 w-1.5 h-1.5 rounded-full bg-zinc-400" />
                          <EditableField
                            as="span"
                            className="flex-1 text-xs text-zinc-600"
                            value={bullet}
                            path={["experience", idx, "bullets", bIdx]}
                            isEditMode={isEditMode}
                            onUpdate={onUpdate}
                          />
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
          <section>
            <h2 className="text-base font-bold uppercase tracking-wider text-zinc-800 mb-3 border-b-2 border-zinc-200 pb-1">
              Key Projects
            </h2>
            <div className="flex flex-col gap-3">
              {projects.map((proj, idx) => {
                const isAi = Array.isArray(safeAi.projects) && safeAi.projects.includes(idx);
                return (
                  <div key={idx}>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <EditableField
                        as="h3"
                        className="font-bold text-zinc-900 text-sm"
                        value={proj.name || ""}
                        path={["projects", idx, "name"]}
                        isEditMode={isEditMode}
                        isAiGenerated={isAi}
                        onUpdate={onUpdate}
                      />
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-indigo-500 hover:underline"
                        >
                          View Project →
                        </a>
                      )}
                    </div>
                    <EditableField
                      as="p"
                      className="text-xs text-zinc-600 mb-1.5 leading-snug"
                      value={proj.description || ""}
                      path={["projects", idx, "description"]}
                      isEditMode={isEditMode}
                      isAiGenerated={isAi}
                      onUpdate={onUpdate}
                    />
                    {proj.tech && Array.isArray(proj.tech) && proj.tech.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {proj.tech.map((t, tIdx) => (
                          <span
                            key={tIdx}
                            className="bg-zinc-100 text-zinc-600 text-[10px] px-1.5 py-0.5 rounded border border-zinc-200"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Achievements */}
        {achievements && achievements.length > 0 && (
          <section>
            <h2 className="text-base font-bold uppercase tracking-wider text-zinc-800 mb-2 border-b-2 border-zinc-200 pb-1">
              Achievements
            </h2>
            <ul className="mt-1 space-y-1 list-none pl-0">
              {achievements.map((ach, idx) => {
                const isAi =
                  Array.isArray(safeAi.achievements) && safeAi.achievements.includes(idx);
                return (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-[5px] shrink-0 w-1.5 h-1.5 rounded-full bg-zinc-400" />
                    <EditableField
                      as="span"
                      className="flex-1 text-xs text-zinc-600"
                      value={ach}
                      path={["achievements", idx]}
                      isEditMode={isEditMode}
                      isAiGenerated={isAi}
                      onUpdate={onUpdate}
                    />
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <section>
            <h2 className="text-base font-bold uppercase tracking-wider text-zinc-800 mb-2 border-b-2 border-zinc-200 pb-1">
              Education
            </h2>
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-start mb-2">
                <div>
                  <EditableField
                    as="p"
                    value={edu.degree || ''}
                    path={['education', idx, 'degree']}
                    className="font-semibold text-sm"
                    isEditMode={isEditMode}
                    onUpdate={onUpdate}
                  />
                  <EditableField
                    as="p"
                    value={edu.institution || ''}
                    path={['education', idx, 'institution']}
                    className="text-xs text-zinc-500"
                    isEditMode={isEditMode}
                    onUpdate={onUpdate}
                  />
                </div>
                <div className="text-right shrink-0 ml-4">
                  <EditableField
                    as="p"
                    value={edu.year || ''}
                    path={['education', idx, 'year']}
                    className="text-xs text-zinc-500"
                    isEditMode={isEditMode}
                    onUpdate={onUpdate}
                  />
                  {edu.grade !== undefined && (
                    <EditableField
                      as="p"
                      value={edu.grade}
                      path={['education', idx, 'grade']}
                      className="text-xs text-zinc-500"
                      isEditMode={isEditMode}
                      onUpdate={onUpdate}
                    />
                  )}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <section>
            <h2 className="text-base font-bold uppercase tracking-wider text-zinc-800 mb-2 border-b-2 border-zinc-200 pb-1">
              Certifications
            </h2>
            <ul className="space-y-1">
              {certifications.map((cert, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-[6px] shrink-0 w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                  <EditableField
                    as="span"
                    value={cert}
                    path={['certifications', idx]}
                    className="text-sm flex-1"
                    isEditMode={isEditMode}
                    onUpdate={onUpdate}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};

export default ModernMinimal;
