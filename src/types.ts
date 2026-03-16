export type LanguageLevel = "A1" | "B1" | "B2" | "C1" | "C2" | "Native";

export interface Experience {
  id: string;
  from: string;
  to: string;
  title: string;
  company: string;
  location?: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
}

export interface Education {
  id: string;
  from: string;
  to: string;
  school: string;
  degree: string;
  details?: string;
}

export interface LanguageSkill {
  id: string;
  name: string;
  level: LanguageLevel | string;
}

export interface CvData {
  fullName: string;
  title: string;
  summary: string;
  photoDataUrl?: string;
  fontFamily?: string;
  experiences: Experience[];
  projects: Project[];
  education: Education[];
  skills: string[];
  languages: LanguageSkill[];
  interests: string[];
}

