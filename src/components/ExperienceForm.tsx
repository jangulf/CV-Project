import { FormEvent, useState } from "react";
import type { Experience } from "../types";

interface Props {
  initial: Experience | null;
  onSave: (exp: Experience) => void;
}

const emptyExperience: Experience = {
  id: "",
  from: "",
  to: "",
  title: "",
  company: "",
  description: ""
};

export function ExperienceForm({ initial, onSave }: Props) {
  const [form, setForm] = useState<Experience>(
    initial ?? { ...emptyExperience, id: crypto.randomUUID() }
  );

  const handleChange = (
    field: keyof Experience,
    value: string
  ) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.company.trim()) return;
    const withId = form.id || crypto.randomUUID();
    onSave({ ...form, id: withId });
    setForm({ ...emptyExperience, id: crypto.randomUUID() });
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="field-row">
        <div className="field">
          <label htmlFor="from">From</label>
          <input
            id="from"
            placeholder="MM/YYYY"
            value={form.from}
            onChange={e => handleChange("from", e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="to">To</label>
          <input
            id="to"
            placeholder="MM/YYYY or Heute"
            value={form.to}
            onChange={e => handleChange("to", e.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="title">Role / Title</label>
        <input
          id="title"
          placeholder="DevOps Engineer"
          value={form.title}
          onChange={e => handleChange("title", e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          placeholder="Company name"
          value={form.company}
          onChange={e => handleChange("company", e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          placeholder="Key tasks, technologies, and achievements…"
          rows={4}
          value={form.description}
          onChange={e => handleChange("description", e.target.value)}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="primary-button">
          {initial ? "Save experience" : "Add experience"}
        </button>
      </div>
    </form>
  );
}

