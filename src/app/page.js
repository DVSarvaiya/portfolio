"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [showProjects, setShowProjects] = useState(false);
  const [activeTab, setActiveTab] = useState("projects");

  const projects = [
    { id: 1, title: "Project One", description: "A React-based portfolio site with modern design and smooth animations." },
    { id: 2, title: "Project Two", description: "A full-stack e-commerce app with payment integration and admin dashboard." },
    { id: 3, title: "Project Three", description: "A real-time chat application with WebSocket connections and file sharing." },
    { id: 4, title: "Project Four", description: "A task management tool with drag-and-drop boards and team collaboration." },
    { id: 5, title: "Project Five", description: "A weather dashboard using external APIs with location-based forecasts." },
    { id: 6, title: "Project Six", description: "A markdown editor with live preview and export functionality." },
  ];

  const skills = [
    { id: 1, name: "JavaScript", level: "Advanced", category: "frontend" },
    { id: 2, name: "React", level: "Advanced", category: "frontend" },
    { id: 3, name: "Node.js", level: "Intermediate", category: "backend" },
    { id: 4, name: "Tailwind CSS", level: "Intermediate", category: "frontend" },
    { id: 5, name: "TypeScript", level: "Advanced", category: "frontend" },
    { id: 6, name: "PostgreSQL", level: "Intermediate", category: "backend" },
    { id: 7, name: "GraphQL", level: "Beginner", category: "backend" },
    { id: 8, name: "Docker", level: "Intermediate", category: "devops" },
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

  const [submitStatus, setSubmitStatus] = useState(null);

  const validate = () => {
    const newErrors = { name: "", email: "", message: "" };
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
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
      setSubmitStatus("success");
      console.log("Form submitted:", form);
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitStatus(null), 3000);
    } else {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus(null), 3000);
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "Advanced": return "bg-emerald-500";
      case "Intermediate": return "bg-amber-500";
      case "Beginner": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const filteredProjects = projects;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <header className="mb-12 lg:mb-16 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                Dhruv Sarvaiya
              </h1>
              <p className="mt-3 text-lg sm:text-xl text-secondary max-w-2xl">
                Full-stack developer crafting elegant digital experiences
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.linkedin.com/in/dvsarvaiya"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary interactive px-6 py-3 text-sm font-medium"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/DVSarvaiya"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary interactive px-6 py-3 text-sm font-medium"
              >
                GitHub
              </a>
            </div>
          </div>
        </header>

        <nav className="mb-10 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab("projects")}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "projects"
                  ? "bg-primary text-white shadow-md"
                  : "text-secondary hover:text-foreground"
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab("skills")}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "skills"
                  ? "bg-primary text-white shadow-md"
                  : "text-secondary hover:text-foreground"
              }`}
            >
              Skills
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "contact"
                  ? "bg-primary text-white shadow-md"
                  : "text-secondary hover:text-foreground"
              }`}
            >
              Contact
            </button>
          </div>
        </nav>

        <section id="projects" className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Featured Projects</h2>
            <button
              onClick={() => setShowProjects((prev) => !prev)}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium interactive transition-colors hover:bg-primary-hover"
            >
              {showProjects ? "Hide Projects" : "Show All Projects"}
            </button>
          </div>

          {showProjects && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <article
                  key={project.id}
                  className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-primary/50 text-2xl font-medium">{project.title}</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-secondary line-clamp-2">{project.description}</p>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                      <span className="text-xs text-secondary">View Details</span>
                      <svg
                        className="w-5 h-5 text-secondary group-hover:text-primary transition-colors transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section id="skills" className="mt-16 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">Technical Skills</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {["frontend", "backend", "devops"].map((category) => {
              const categorySkills = skills.filter((s) => s.category === category);
              if (categorySkills.length === 0) return null;
              const categoryLabels = {
                frontend: "Frontend",
                backend: "Backend",
                devops: "DevOps",
              };
              return (
                <div key={category} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
                    {categoryLabels[category]}
                  </h3>
                  <div className="space-y-4">
                    {categorySkills.map((skill) => (
                      <div key={skill.id}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium text-foreground">{skill.name}</span>
                          <span className="text-xs text-secondary">{skill.level}</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getLevelColor(skill.level)} rounded-full transition-all duration-500`}
                            style={{
                              width:
                                skill.level === "Advanced"
                                  ? "90%"
                                  : skill.level === "Intermediate"
                                  ? "65%"
                                  : "35%",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section id="contact" className="mt-16 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">Get In Touch</h2>
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
            {submitStatus === "success" && (
              <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 animate-fade-in">
                <p className="font-medium">Message sent successfully!</p>
                <p className="text-sm mt-1">I'll get back to you as soon as possible.</p>
              </div>
            )}
            {submitStatus === "error" && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-800 dark:text-red-200 animate-fade-in">
                <p className="font-medium">Please fix the errors below.</p>
              </div>
            )}
            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                    errors.name
                      ? "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-primary"
                  } bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50`}
                  placeholder="Your name"
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400 animate-fade-in">
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                    errors.email
                      ? "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-primary"
                  } bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50`}
                  placeholder="your@email.com"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400 animate-fade-in">
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full px-4 py-3 rounded-xl border transition-colors resize-y min-h-[120px] ${
                    errors.message
                      ? "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-primary"
                  } bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50`}
                  placeholder="Your message..."
                  aria-invalid={errors.message ? "true" : "false"}
                  aria-describedby={errors.message ? "message-error" : undefined}
                />
                {errors.message && (
                  <p id="message-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400 animate-fade-in">
                    {errors.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3.5 bg-primary text-white font-medium rounded-xl interactive transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50"
              >
                Send Message
              </button>
            </div>
          </form>
        </section>

        <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <p className="text-center text-sm text-secondary">
            Built with Next.js & Tailwind CSS • © {new Date().getFullYear()} Dhruv Sarvaiya
          </p>
        </footer>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
      `}</style>
    </main>
  );
}
