import { forwardRef } from "react";
import type { CvData } from "../types";

interface Props {
  cv: CvData;
}

export const CvPreview = forwardRef<HTMLDivElement, Props>(({ cv }, ref) => {
  return (
    <div
      className="cv-root"
      ref={ref}
      style={cv.fontFamily ? { fontFamily: cv.fontFamily } : undefined}
    >
      <header className="cv-header">
        <div className="cv-header-main">
          <h1 className="cv-name">{cv.fullName}</h1>
          <p className="cv-title">{cv.title}</p>
        </div>
        <div className="cv-photo-wrapper">
          {cv.photoDataUrl ? (
            <img src={cv.photoDataUrl} alt="Profile" className="cv-photo" />
          ) : (
            <div className="cv-photo placeholder">
              <span>Photo</span>
            </div>
          )}
        </div>
      </header>

      <div className="cv-layout">
        <aside className="cv-sidebar-main">
          <section className="cv-section compact">
            <h2>Profil</h2>
            <p>{cv.summary}</p>
          </section>

          <section className="cv-section compact">
            <h2>Fähigkeiten</h2>
            <ul className="cv-list">
              {cv.skills.map(skill => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </section>

          <section className="cv-section compact">
            <h2>Sprachen</h2>
            <ul className="cv-list">
              {cv.languages.map(lang => (
                <li key={lang.id}>
                  {lang.name} – {lang.level}
                </li>
              ))}
            </ul>
          </section>

          <section className="cv-section compact">
            <h2>Interessen</h2>
            <ul className="cv-list inline">
              {cv.interests.map(interest => (
                <li key={interest}>{interest}</li>
              ))}
            </ul>
          </section>
        </aside>

        <main className="cv-main">
          <section className="cv-section">
            <h2>Berufserfahrung</h2>
            {cv.experiences.map(exp => (
              <article key={exp.id} className="cv-block">
                <div className="cv-block-header">
                  <div>
                    <div className="cv-block-title">
                      {exp.from} – {exp.to} · {exp.title}
                    </div>
                    <div className="cv-block-subtitle">{exp.company}</div>
                  </div>
                </div>
                <p className="cv-block-body">{exp.description}</p>
              </article>
            ))}
          </section>

          <section className="cv-section">
            <h2>Relevante Projekte</h2>
            {cv.projects.map(project => (
              <article key={project.id} className="cv-block">
                <div className="cv-block-title">{project.title}</div>
                <p className="cv-block-body">{project.description}</p>
              </article>
            ))}
          </section>

          <section className="cv-section">
            <h2>Ausbildung</h2>
            {cv.education.map(edu => (
              <article key={edu.id} className="cv-block">
                <div className="cv-block-header">
                  <div>
                    <div className="cv-block-title">
                      {edu.from} – {edu.to} · {edu.degree}
                    </div>
                    <div className="cv-block-subtitle">{edu.school}</div>
                  </div>
                </div>
                {edu.details && (
                  <p className="cv-block-body">{edu.details}</p>
                )}
              </article>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
});

CvPreview.displayName = "CvPreview";

