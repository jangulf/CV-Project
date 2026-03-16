import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import type { CvData, Experience } from "./types";
import { ExperienceForm } from "./components/ExperienceForm";
import { CvPreview } from "./components/CvPreview";

const initialCv: CvData = {
  fullName: "---",
  title: "IT Systems / DevOps Engineer",
  summary:
    "Low-code/no-code application development, DevOps, cloud platforms, and embedded systems with a focus on reliable, well-documented solutions.",
  fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  experiences: [
    {
      id: "1",
      from: "04/2025",
      to: "Heute",
      title: "IT Systems Engineer – Low-Code Application Development",
      company: "Escriba AG",
      description:
        "Low-code/no-code application development, SQL-based databases, backend programming with Java 7 and JavaScript. API and web service integrations (REST/SOAP), SAP & SAP SuccessFactors integration, Tomcat configuration, Grafana monitoring, and technical solution design."
    },
    {
      id: "2",
      from: "11/2024",
      to: "02/2025",
      title: "DevOps Engineer Kurs",
      company: "DataScientest",
      description:
        "Linux-Systemadministration, NGINX, AWS (Cloud Practitioner, Solutions Architect), Docker, Kubernetes, Jenkins, Monitoring (Prometheus, Grafana, Datadog), Terraform, Ansible, Datenbanken (MySQL, PostgreSQL, MongoDB)."
    },
    {
      id: "3",
      from: "05/2024",
      to: "11/2024",
      title: "DevOps Engineer",
      company: "Nicos AG, Münster",
      description:
        "ServiceNow Platform DevOps, Service Katalog, CMDB, CI/CD, AWS (ECS/EKS, S3, Lambda), CloudFormation, JavaScript, Python Scripting & Automation, Cisco ISE, OTRS, GitLab, Workflow Automation, Agile Planung, Dokumentation."
    }
  ],
  projects: [
    {
      id: "p1",
      title: "Embedded Web Smart Home and Mailing Systems",
      description:
        "Embedded Systeme und IoT-Anwendungen mit E-Mail-Kommunikation (SMTP/IMAP) und AWS IoT / MQTT."
    },
    {
      id: "p2",
      title: "Smart Shopping Systems",
      description:
        "QT-basierte grafische Benutzerschnittstellen in C++ mit SQLite-Datenhaltung."
    },
    {
      id: "p3",
      title: "Spracherkennungs- und Übersetzungssystem",
      description:
        "Cloudbasiertes System mit Python, FastAPI, JavaScript, Node.js. AWS (S3, EKS, CloudWatch), DevOps-Tools (GitHub, Jira, Docker, CI/CD), Monitoring (Prometheus, Grafana)."
    }
  ],
  education: [
    {
      id: "e1",
      from: "04/2020",
      to: "05/2024",
      school: "Berliner Hochschule für Technik (BHT), Berlin",
      degree:
        "Bachelor of Engineering (B.Eng.), Technische Informatik (Embedded Systems)"
    },
    {
      id: "e2",
      from: "11/2016",
      to: "02/2019",
      school: "Winkler+Partner GmbH, Berlin",
      degree:
        "Ausbildung Elektroniker für Energie und Gebäudetechnik / Gebäude- und Elektrotechnik"
    }
  ],
  skills: [
    "Python",
    "C",
    "C++",
    "Java",
    "JavaScript",
    "TypeScript",
    "FastAPI",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "REST APIs",
    "CI/CD (GitLab, Jenkins)"
  ],
  languages: [
    { id: "l1", name: "Arabisch", level: "Muttersprache" },
    { id: "l2", name: "Deutsch", level: "C1" },
    { id: "l3", name: "Englisch", level: "C1" },
    { id: "l4", name: "Spanisch", level: "A1" }
  ],
  interests: [
    "Literatur",
    "Umweltschutz",
    "Kunst",
    "Yoga",
    "Reisen"
  ]
};

type EditorTab = "profile" | "experience" | "projects" | "education" | "skills";

function App() {
  const [cv, setCv] = useState<CvData>(initialCv);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<EditorTab>("experience");
  const [isSaving, setIsSaving] = useState(false);
  const previewRef = useRef<HTMLDivElement | null>(null);

  // load from local storage on first mount
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("cv-studio-data");
      if (!raw) return;
      const parsed = JSON.parse(raw) as CvData;
      setCv(prev => ({ ...prev, ...parsed }));
    } catch {
      // ignore parse errors
    }
  }, []);

  const sortedExperiences = useMemo(
    () => [...cv.experiences],
    [cv.experiences]
  );

  const handleSaveExperience = useCallback(
    (exp: Experience) => {
      setCv(prev => {
        const exists = prev.experiences.some(e => e.id === exp.id);
        const experiences = exists
          ? prev.experiences.map(e => (e.id === exp.id ? exp : e))
          : [...prev.experiences, exp];
        return { ...prev, experiences };
      });
      setEditing(null);
    },
    []
  );

  const handleEditRequest = (exp: Experience) => {
    setEditing(exp);
  };

  const handleDeleteExperience = (id: string) => {
    setCv(prev => ({
      ...prev,
      experiences: prev.experiences.filter(e => e.id !== id)
    }));
  };

  const exportPdf = useCallback(async () => {
    if (!previewRef.current) return;
    try {
      setIsExporting(true);
      const element = previewRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = 0;
      let heightLeft = imgHeight;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("cv.pdf");
    } finally {
      setIsExporting(false);
    }
  }, []);

  const handleSaveCv = () => {
    try {
      setIsSaving(true);
      window.localStorage.setItem("cv-studio-data", JSON.stringify(cv));
    } finally {
      setTimeout(() => setIsSaving(false), 400);
    }
  };

  const handlePhotoUpload: React.ChangeEventHandler<HTMLInputElement> = event => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setCv(prev => ({ ...prev, photoDataUrl: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="app-root">
      <header className="app-header">
        <div>
          <h1>CV Studio</h1>
          <p>Design and maintain a professional, two-column CV.</p>
        </div>
        <div className="header-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={handleSaveCv}
            disabled={isSaving}
          >
            {isSaving ? "Saved" : "Save changes"}
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={exportPdf}
            disabled={isExporting}
          >
            {isExporting ? "Exporting…" : "Download PDF"}
          </button>
        </div>
      </header>

      <main className="layout">
        <section className="editor-panel">
          <div className="editor-tabs">
            <button
              type="button"
              className={activeTab === "profile" ? "editor-tab active" : "editor-tab"}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </button>
            <button
              type="button"
              className={activeTab === "experience" ? "editor-tab active" : "editor-tab"}
              onClick={() => setActiveTab("experience")}
            >
              Experience
            </button>
            <button
              type="button"
              className={activeTab === "projects" ? "editor-tab active" : "editor-tab"}
              onClick={() => setActiveTab("projects")}
            >
              Projects
            </button>
            <button
              type="button"
              className={activeTab === "education" ? "editor-tab active" : "editor-tab"}
              onClick={() => setActiveTab("education")}
            >
              Education
            </button>
            <button
              type="button"
              className={activeTab === "skills" ? "editor-tab active" : "editor-tab"}
              onClick={() => setActiveTab("skills")}
            >
              Skills & Languages
            </button>
          </div>

          {activeTab === "profile" && (
            <div className="card">
              <div className="field-row">
                <div className="field">
                  <label htmlFor="fullName">Full name</label>
                  <input
                    id="fullName"
                    value={cv.fullName}
                    onChange={e =>
                      setCv(prev => ({ ...prev, fullName: e.target.value }))
                    }
                    placeholder="Your full name"
                  />
                </div>
                <div className="field">
                  <label htmlFor="title">Headline / Title</label>
                  <input
                    id="title"
                    value={cv.title}
                    onChange={e =>
                      setCv(prev => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="DevOps / IT Systems Engineer"
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="summary">Profile summary</label>
                <textarea
                  id="summary"
                  rows={4}
                  value={cv.summary}
                  onChange={e =>
                    setCv(prev => ({ ...prev, summary: e.target.value }))
                  }
                  placeholder="Short summary of your experience and strengths…"
                />
              </div>
              <div className="field">
                <label htmlFor="font">CV font</label>
                <select
                  id="font"
                  value={cv.fontFamily ?? "system"}
                  onChange={e => {
                    const value = e.target.value;
                    let family: string;
                    switch (value) {
                      case "lato":
                        family = '"Lato", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
                        break;
                      case "inter":
                        family = '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
                        break;
                      case "serif":
                        family = '"Merriweather", "Georgia", "Times New Roman", serif';
                        break;
                      case "mono":
                        family = '"Fira Code", "JetBrains Mono", "Consolas", monospace';
                        break;
                      case "system":
                      default:
                        family =
                          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
                    }
                    setCv(prev => ({ ...prev, fontFamily: family }));
                  }}
                >
                  <option value="inter">Inter (modern, default)</option>
                  <option value="lato">Lato (clean sans)</option>
                  <option value="serif">Merriweather (elegant serif)</option>
                  <option value="mono">Fira Code (tech mono)</option>
                  <option value="system">System UI</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="photo">Profile photo (shown on the right)</label>
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
                <p className="muted">
                  Use a square, professional headshot for the best result.
                </p>
              </div>
            </div>
          )}

          {activeTab === "experience" && (
            <>
              <ExperienceForm
                key={editing?.id ?? "new"}
                initial={editing}
                onSave={handleSaveExperience}
              />

              <div className="experience-list">
                <h3>Timeline</h3>
                {sortedExperiences.length === 0 && (
                  <p className="muted">
                    No experiences yet. Add your first one above.
                  </p>
                )}
                <ul>
                  {sortedExperiences.map(exp => (
                    <li key={exp.id} className="experience-list-item">
                      <div>
                        <div className="experience-list-title">
                          {exp.from} – {exp.to} · {exp.title}
                        </div>
                        <div className="experience-list-company">{exp.company}</div>
                      </div>
                      <div className="experience-list-actions">
                        <button type="button" onClick={() => handleEditRequest(exp)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="danger"
                          onClick={() => handleDeleteExperience(exp.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {activeTab === "projects" && (
            <div className="card">
              {cv.projects.map((project, index) => (
                <div key={project.id} className="stacked-block">
                  <div className="field">
                    <label htmlFor={`project-title-${project.id}`}>
                      Project {index + 1} title
                    </label>
                    <input
                      id={`project-title-${project.id}`}
                      value={project.title}
                      onChange={e =>
                        setCv(prev => ({
                          ...prev,
                          projects: prev.projects.map(p =>
                            p.id === project.id ? { ...p, title: e.target.value } : p
                          )
                        }))
                      }
                    />
                  </div>
                  <div className="field">
                    <label htmlFor={`project-desc-${project.id}`}>Description</label>
                    <textarea
                      id={`project-desc-${project.id}`}
                      rows={3}
                      value={project.description}
                      onChange={e =>
                        setCv(prev => ({
                          ...prev,
                          projects: prev.projects.map(p =>
                            p.id === project.id
                              ? { ...p, description: e.target.value }
                              : p
                          )
                        }))
                      }
                    />
                  </div>
                  <div className="form-actions">
                    <button
                      type="button"
                      className="secondary-button subtle"
                      onClick={() =>
                        setCv(prev => ({
                          ...prev,
                          projects: prev.projects.filter(p => p.id !== project.id)
                        }))
                      }
                    >
                      Remove project
                    </button>
                  </div>
                </div>
              ))}
              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    setCv(prev => ({
                      ...prev,
                      projects: [
                        ...prev.projects,
                        {
                          id: crypto.randomUUID(),
                          title: "",
                          description: ""
                        }
                      ]
                    }))
                  }
                >
                  Add project
                </button>
              </div>
            </div>
          )}

          {activeTab === "education" && (
            <div className="card">
              {cv.education.map(edu => (
                <div key={edu.id} className="stacked-block">
                  <div className="field-row">
                    <div className="field">
                      <label htmlFor={`edu-from-${edu.id}`}>From</label>
                      <input
                        id={`edu-from-${edu.id}`}
                        value={edu.from}
                        onChange={e =>
                          setCv(prev => ({
                            ...prev,
                            education: prev.education.map(e2 =>
                              e2.id === edu.id ? { ...e2, from: e.target.value } : e2
                            )
                          }))
                        }
                      />
                    </div>
                    <div className="field">
                      <label htmlFor={`edu-to-${edu.id}`}>To</label>
                      <input
                        id={`edu-to-${edu.id}`}
                        value={edu.to}
                        onChange={e =>
                          setCv(prev => ({
                            ...prev,
                            education: prev.education.map(e2 =>
                              e2.id === edu.id ? { ...e2, to: e.target.value } : e2
                            )
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label htmlFor={`edu-degree-${edu.id}`}>Degree</label>
                    <input
                      id={`edu-degree-${edu.id}`}
                      value={edu.degree}
                      onChange={e =>
                        setCv(prev => ({
                          ...prev,
                          education: prev.education.map(e2 =>
                            e2.id === edu.id ? { ...e2, degree: e.target.value } : e2
                          )
                        }))
                      }
                    />
                  </div>
                  <div className="field">
                    <label htmlFor={`edu-school-${edu.id}`}>Institution</label>
                    <input
                      id={`edu-school-${edu.id}`}
                      value={edu.school}
                      onChange={e =>
                        setCv(prev => ({
                          ...prev,
                          education: prev.education.map(e2 =>
                            e2.id === edu.id ? { ...e2, school: e.target.value } : e2
                          )
                        }))
                      }
                    />
                  </div>
                  <div className="form-actions">
                    <button
                      type="button"
                      className="secondary-button subtle"
                      onClick={() =>
                        setCv(prev => ({
                          ...prev,
                          education: prev.education.filter(e2 => e2.id !== edu.id)
                        }))
                      }
                    >
                      Remove entry
                    </button>
                  </div>
                </div>
              ))}
              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    setCv(prev => ({
                      ...prev,
                      education: [
                        ...prev.education,
                        {
                          id: crypto.randomUUID(),
                          from: "",
                          to: "",
                          school: "",
                          degree: ""
                        }
                      ]
                    }))
                  }
                >
                  Add education entry
                </button>
              </div>
            </div>
          )}

          {activeTab === "skills" && (
            <div className="card">
              <div className="field">
                <label>Skills</label>
                {cv.skills.map((skill, index) => (
                  <div key={index} className="field-row skill-row">
                    <input
                      value={skill}
                      onChange={e =>
                        setCv(prev => {
                          const next = [...prev.skills];
                          next[index] = e.target.value;
                          return { ...prev, skills: next };
                        })
                      }
                      placeholder="e.g. Docker, Kubernetes"
                    />
                    <button
                      type="button"
                      className="secondary-button subtle"
                      onClick={() =>
                        setCv(prev => ({
                          ...prev,
                          skills: prev.skills.filter((_, i) => i !== index)
                        }))
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div className="form-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                      setCv(prev => ({
                        ...prev,
                        skills: [...prev.skills, ""]
                      }))
                    }
                  >
                    Add skill
                  </button>
                </div>
              </div>
              <div className="field">
                <label>Languages</label>
                {cv.languages.map((lang, index) => (
                  <div key={lang.id} className="field-row language-row">
                    <input
                      value={lang.name}
                      onChange={e =>
                        setCv(prev => ({
                          ...prev,
                          languages: prev.languages.map((l, i) =>
                            i === index ? { ...l, name: e.target.value } : l
                          )
                        }))
                      }
                      placeholder="Language"
                    />
                    <input
                      value={lang.level}
                      onChange={e =>
                        setCv(prev => ({
                          ...prev,
                          languages: prev.languages.map((l, i) =>
                            i === index ? { ...l, level: e.target.value } : l
                          )
                        }))
                      }
                      placeholder="Level (e.g. C1)"
                    />
                    <button
                      type="button"
                      className="secondary-button subtle"
                      onClick={() =>
                        setCv(prev => ({
                          ...prev,
                          languages: prev.languages.filter((_, i) => i !== index)
                        }))
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div className="form-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                      setCv(prev => ({
                        ...prev,
                        languages: [
                          ...prev.languages,
                          { id: crypto.randomUUID(), name: "", level: "" }
                        ]
                      }))
                    }
                  >
                    Add language
                  </button>
                </div>
              </div>
              <div className="field">
                <label htmlFor="interests">Interests (comma separated)</label>
                <textarea
                  id="interests"
                  rows={2}
                  value={cv.interests.join(", ")}
                  onChange={e =>
                    setCv(prev => ({
                      ...prev,
                      interests: e.target.value
                        .split(",")
                        .map(s => s.trim())
                        .filter(Boolean)
                    }))
                  }
                />
              </div>
            </div>
          )}
        </section>

        <section className="preview-panel">
          <CvPreview ref={previewRef} cv={cv} />
        </section>
      </main>
    </div>
  );
}

export default App;

