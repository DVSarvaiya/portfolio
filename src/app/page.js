"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [showProjects, setShowProjects] = useState(false);

  const projects = [
    { id: 1, title: "Project One", description: "A React-based portfolio site." },
    { id: 2, title: "Project Two", description: "A full-stack e-commerce app." },
    { id: 3, title: "Project Three", description: "A real-time chat application." },
  ];

  const skills = [
    { id: 1, name: "JavaScript", level: "Advanced" },
    { id: 2, name: "React", level: "Advanced" },
    { id: 3, name: "Node.js", level: "Intermediate" },
    { id: 4, name: "Tailwind CSS", level: "Intermediate" },
  ];

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  });

  const validate = () => {
    const newErrors = { name: "", email: "", message: "" };
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(form.email)) {
      newErrors.email = "Email is invalid.";
    }
    if (!form.message.trim()) newErrors.message = "Message is required.";
    setErrors(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.message;
  };

  useEffect(() => {
    validate();
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form submitted:", form);
      // Reset form
      setForm({ name: "", email: "", message: "" });
    }
  };

  return (
    <main className="main">
      <div className="fade-in">
        <h1 className="name">Dhruv Sarvaiya</h1>
        <a
          href="https://www.linkedin.com/in/dvsarvaiya"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary interactive"
        >
          LinkedIn
        </a>
        <p className="subtitle">Portfolio • Developer</p>
        <a
          href="https://github.com/DVSarvaiya"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary mt-2 interactive"
        >
          GitHub
        </a>
      </div>

      <div className="slide-up">
        <button
          type="button"
          onClick={() => setShowProjects((prev) => !prev)}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded transition-all interactive"
        >
          {showProjects ? "Hide Projects" : "Show Projects"}
        </button>

        {showProjects && (
          <div className="mt-4 flex flex-col gap-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="p-4 border rounded shadow-sm text-left card interactive"
              >
                <h2 className="font-bold text-lg text-foreground">{project.title}</h2>
                <p className="text-sm text-gray-800">{project.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <section className="mt-8 w-full max-w-2xl slide-up">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Skills</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {skills.map((skill) => (
            <div key={skill.id} className="skill-card interactive">
              <h3 className="font-medium text-foreground">{skill.name}</h3>
              <p className="text-sm text-gray-800">{skill.level}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 w-full max-w-2xl slide-up">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Contact</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="contact-input"
            />
            {errors.name && <p className="error-msg">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="contact-input"
            />
            {errors.email && <p className="error-msg">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              className="contact-input"
              rows="5"
            />
            {errors.message && <p className="error-msg">{errors.message}</p>}
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded cursor-pointer transition-all interactive"
          >
            Send Message
          </button>
        </form>
      </section>
    </main>
  );
}
