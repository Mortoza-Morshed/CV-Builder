import React from "react";
import EditableField from "../EditableField";

const BoldSidebar = ({ cvData, isEditMode = false, onUpdate = () => {} }) => {
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
      className="bg-white mx-auto shadow-sm flex font-sans"
      style={{ width: "794px", minHeight: "1123px" }}
    >
      {/* Sidebar (Left Pane — 30%) */}
      <div className="w-[30%] bg-blue-600 text-blue-50 p-6 flex flex-col gap-7 break-words">
        {/* Avatar + Name */}
        <section className="text-center mt-4">
          <div className="w-20 h-20 mx-auto bg-blue-400 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-3 overflow-hidden">
            {personal?.name
              ? personal.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
              : "CV"}
          </div>
          <EditableField
            as="h2"
            className="text-lg font-bold text-white mb-0.5 block"
            value={personal?.name || ""}
            path={["personal", "name"]}
            isEditMode={isEditMode}
            darkBackground={true}
            onUpdate={onUpdate}
          />
          <p className="text-xs text-blue-200 font-medium">Professional Profile</p>
        </section>

        {/* Contact */}
        <section>
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-200 border-b border-blue-400 pb-1 mb-3">
            Contact
          </h3>
          <ul className="text-xs space-y-2.5">
            {personal?.email !== undefined && (
              <li>
                <span className="block text-blue-200 font-medium mb-0.5">Email</span>
                <EditableField
                  as="span"
                  className="text-white break-all block"
                  value={personal.email}
                  path={["personal", "email"]}
                  isEditMode={isEditMode}
                  darkBackground={true}
                  onUpdate={onUpdate}
                />
              </li>
            )}
            {personal?.phone !== undefined && (
              <li>
                <span className="block text-blue-200 font-medium mb-0.5">Phone</span>
                <EditableField
                  as="span"
                  className="text-white block"
                  value={personal.phone}
                  path={["personal", "phone"]}
                  isEditMode={isEditMode}
                  darkBackground={true}
                  onUpdate={onUpdate}
                />
              </li>
            )}
            {personal?.location !== undefined && (
              <li>
                <span className="block text-blue-200 font-medium mb-0.5">Location</span>
                <EditableField
                  as="span"
                  className="text-white block"
                  value={personal.location}
                  path={["personal", "location"]}
                  isEditMode={isEditMode}
                  darkBackground={true}
                  onUpdate={onUpdate}
                />
              </li>
            )}
            {personal?.linkedin !== undefined && (
              <li>
                <span className="block text-blue-200 font-medium mb-0.5">LinkedIn</span>
                <EditableField
                  as="span"
                  className="text-white break-all block"
                  value={personal.linkedin.replace(/^https?:\/\//, "")}
                  path={["personal", "linkedin"]}
                  isEditMode={isEditMode}
                  darkBackground={true}
                  onUpdate={onUpdate}
                />
              </li>
            )}
            {personal?.portfolio !== undefined && (
              <li>
                <span className="block text-blue-200 font-medium mb-0.5">Portfolio</span>
                <EditableField
                  as="span"
                  className="text-white break-all block"
                  value={personal.portfolio.replace(/^https?:\/\//, "")}
                  path={["personal", "portfolio"]}
                  isEditMode={isEditMode}
                  darkBackground={true}
                  onUpdate={onUpdate}
                />
              </li>
            )}
          </ul>
        </section>

        {/* Skills */}
        {skills &&
          (skills.technical?.length > 0 || skills.soft?.length > 0 || skills.tools?.length > 0) && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-200 border-b border-blue-400 pb-1 mb-3">
                Expertise
              </h3>
              <div className="flex flex-col gap-3 text-xs">
                {skills.technical !== undefined && skills.technical.length > 0 && (
                  <div>
                    <h4 className="font-bold text-blue-100 mb-1">Technical Skills</h4>
                    <EditableField
                      as="p"
                      className="text-white leading-relaxed block"
                      value={(Array.isArray(skills.technical) ? skills.technical : []).join(" • ")}
                      path={["skills", "technical"]}
                      isEditMode={isEditMode}
                      isAiGenerated={safeAi.skills?.technical?.length > 0}
                      darkBackground={true}
                      onUpdate={(path, val) =>
                        onUpdate(
                          path,
                          val
                            .split("•")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        )
                      }
                    />
                  </div>
                )}
                {skills.tools !== undefined && skills.tools.length > 0 && (
                  <div>
                    <h4 className="font-bold text-blue-100 mb-1">Tools & Platforms</h4>
                    <EditableField
                      as="p"
                      className="text-white leading-relaxed block"
                      value={(Array.isArray(skills.tools) ? skills.tools : []).join(" • ")}
                      path={["skills", "tools"]}
                      isEditMode={isEditMode}
                      isAiGenerated={safeAi.skills?.tools?.length > 0}
                      darkBackground={true}
                      onUpdate={(path, val) =>
                        onUpdate(
                          path,
                          val
                            .split("•")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        )
                      }
                    />
                  </div>
                )}
                {skills.soft !== undefined && skills.soft.length > 0 && (
                  <div>
                    <h4 className="font-bold text-blue-100 mb-1">Professional Skills</h4>
                    <EditableField
                      as="p"
                      className="text-white leading-relaxed block"
                      value={(Array.isArray(skills.soft) ? skills.soft : []).join(" • ")}
                      path={["skills", "soft"]}
                      isEditMode={isEditMode}
                      darkBackground={true}
                      onUpdate={(path, val) =>
                        onUpdate(
                          path,
                          val
                            .split("•")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        )
                      }
                    />
                  </div>
                )}
              </div>
            </section>
          )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-200 border-b border-blue-400 pb-1 mb-3">
              Languages
            </h3>
            <ul className="space-y-1">
              {languages.map((lang, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-300 shrink-0" />
                  <EditableField
                    as="span"
                    value={lang}
                    path={["languages", idx]}
                    className="text-xs text-blue-100"
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
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-200 border-b border-blue-400 pb-1 mb-3">
              Interests
            </h3>
            <ul className="space-y-1">
              {interests.map((interest, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-300 shrink-0" />
                  <EditableField
                    as="span"
                    value={interest}
                    path={["interests", idx]}
                    className="text-xs text-blue-100"
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
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-200 border-b border-blue-400 pb-1 mb-3">
            References
          </h3>
          <p className="text-xs text-blue-200 italic">
            {references || 'Available upon request'}
          </p>
        </section>
      </div>

      {/* Main Content (Right Pane — 70%) */}
      <div className="w-[70%] p-7 flex flex-col gap-5 text-gray-800">
        {/* Summary */}
        {summary !== undefined && (
          <section>
            <h2 className="text-lg font-bold text-blue-600 mb-2 flex items-center gap-2">
              <span className="inline-block w-5 text-center text-base">☺</span> Profile
            </h2>
            <EditableField
              as="p"
              className="text-sm text-gray-700 leading-relaxed block"
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
            <h2 className="text-lg font-bold text-blue-600 mb-3 flex items-center gap-2">
              <span className="inline-block w-5 text-center text-base">💼</span> Experience
            </h2>
            <div className="flex flex-col gap-4">
              {experience.map((job, idx) => (
                <div key={idx} className="relative pl-4 border-l-2 border-gray-200">
                  <div className="absolute w-2.5 h-2.5 bg-blue-600 rounded-full -left-[6px] top-1.5" />
                  <EditableField
                    as="h3"
                    className="font-bold text-gray-900 text-sm block"
                    value={job.role || ""}
                    path={["experience", idx, "role"]}
                    isEditMode={isEditMode}
                    onUpdate={onUpdate}
                  />
                  <div className="flex items-center gap-2 mb-1 text-xs flex-wrap">
                    <EditableField
                      as="span"
                      className="font-semibold text-gray-700"
                      value={job.company || ""}
                      path={["experience", idx, "company"]}
                      isEditMode={isEditMode}
                      onUpdate={onUpdate}
                    />
                    <span className="text-gray-400">|</span>
                    <EditableField
                      as="span"
                      className="text-blue-600 font-medium italic whitespace-nowrap"
                      value={job.duration || ""}
                      path={["experience", idx, "duration"]}
                      isEditMode={isEditMode}
                      onUpdate={onUpdate}
                    />
                  </div>
                  {job.bullets && job.bullets.length > 0 && (
                    <ul className="mt-1 space-y-1 list-none pl-0">
                      {job.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2">
                          <span className="mt-[5px] shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400" />
                          <EditableField
                            as="span"
                            className="flex-1 text-xs text-gray-600"
                            value={b}
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
            <h2 className="text-lg font-bold text-blue-600 mb-3 flex items-center gap-2">
              <span className="inline-block w-5 text-center text-base">🚀</span> Projects
            </h2>
            <div className="flex flex-col gap-3">
              {projects.map((proj, idx) => {
                const isAi = Array.isArray(safeAi.projects) && safeAi.projects.includes(idx);
                return (
                  <div key={idx}>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <EditableField
                        as="h3"
                        className="font-bold text-gray-800 text-sm"
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
                          className="text-xs text-blue-500 hover:underline"
                        >
                          View Project →
                        </a>
                      )}
                    </div>
                    <EditableField
                      as="p"
                      className="text-xs text-gray-600 mb-1.5 block"
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
                            className="bg-blue-50 text-blue-700 text-[10px] px-1.5 py-0.5 rounded border border-blue-100"
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
            <h2 className="text-lg font-bold text-blue-600 mb-2 flex items-center gap-2">
              <span className="inline-block w-5 text-center text-base">★</span> Highlights
            </h2>
            <ul className="mt-1 space-y-1 list-none pl-0">
              {achievements.map((ach, idx) => {
                const isAi =
                  Array.isArray(safeAi.achievements) && safeAi.achievements.includes(idx);
                return (
                  <li key={"ach-" + idx} className="flex items-start gap-2">
                    <span className="mt-[5px] shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <EditableField
                      as="span"
                      className="flex-1 text-xs text-gray-600"
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
            <h2 className="text-lg font-bold text-blue-600 mb-3 flex items-center gap-2">
              <span className="inline-block w-5 text-center text-base">🎓</span> Education
            </h2>
            <div className="flex flex-col gap-2">
              {education.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div>
                    <EditableField
                      as="h3"
                      className="font-bold text-gray-800 text-sm block"
                      value={edu.degree || ""}
                      path={["education", idx, "degree"]}
                      isEditMode={isEditMode}
                      onUpdate={onUpdate}
                    />
                    <EditableField
                      as="p"
                      className="text-gray-600 text-xs block"
                      value={edu.institution || ""}
                      path={["education", idx, "institution"]}
                      isEditMode={isEditMode}
                      onUpdate={onUpdate}
                    />
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <EditableField
                      as="span"
                      className="block text-xs font-semibold text-blue-600"
                      value={edu.year || ""}
                      path={["education", idx, "year"]}
                      isEditMode={isEditMode}
                      onUpdate={onUpdate}
                    />
                    {edu.grade !== undefined && (
                      <EditableField
                        as="span"
                        className="text-xs text-gray-500 block"
                        value={edu.grade}
                        path={["education", idx, "grade"]}
                        isEditMode={isEditMode}
                        onUpdate={onUpdate}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-blue-600 mb-3 flex items-center gap-2">
              <span className="inline-block w-5 text-center text-base">🏅</span> Certifications
            </h2>
            <ul className="space-y-1">
              {certifications.map((cert, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-[6px] shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 opacity-70" />
                  <EditableField
                    as="span"
                    value={cert}
                    path={['certifications', idx]}
                    className="text-sm flex-1 text-gray-700"
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

export default BoldSidebar;
