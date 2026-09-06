import Link from "next/link";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Journey from "./components/Journey";
import TechCube from "./components/TechCube";

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/dvsarvaiya",
    icon: (
      <path d="M20.447 20.447h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.562h.046c.477-.903 1.637-1.852 3.37-1.852 3.601 0 4.267 2.37 4.267 5.453v6.284zM5.337 7.433a2.065 2.065 0 01-2.067 2.067 2.065 2.065 0 012.067-2.067zm0 16.074H1.27V7.433h4.067v16.074zM22.225 1.247H1.771C.792 1.247 0 2.039 0 3.016v18.968C0 21.961.792 22.75 1.771 22.75h20.454c.979 0 1.77-.789 1.77-1.766V3.016c0-.977-.791-1.769-1.77-1.769z" />
    ),
  },
  {
    name: "GitHub",
    href: "https://github.com/DVSarvaiya",
    icon: (
      <path d="M12 .001c-6.627 0-12 5.373-12 12 0 5.303 3.438 9.8 8.207 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.604-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.627-5.373-12-12-12z" />
    ),
  },
];

function SocialIcon({ href, name, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        color: "var(--foreground)",
      }}
      aria-label={name}
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        {icon}
      </svg>
    </a>
  );
}

function Skills() {
  const skills = [
    { id: 1, name: "TypeScript", level: "Advanced", category: "frontend" },
    { id: 2, name: "React", level: "Advanced", category: "frontend" },
    { id: 3, name: "Next.js", level: "Advanced", category: "frontend" },
    { id: 4, name: "Tailwind CSS", level: "Advanced", category: "frontend" },
    { id: 5, name: "Node.js", level: "Intermediate", category: "backend" },
    { id: 6, name: "PostgreSQL", level: "Intermediate", category: "backend" },
    { id: 7, name: "GraphQL", level: "Intermediate", category: "backend" },
    { id: 8, name: "Docker", level: "Intermediate", category: "devops" },
    { id: 9, name: "AWS", level: "Beginner", category: "devops" },
  ];

  const getLevelPercent = (level) => {
    if (level === "Advanced") return "92%";
    if (level === "Intermediate") return "68%";
    return "38%";
  };

  const getLevelTone = (level) => {
    if (level === "Advanced") return "var(--primary)";
    if (level === "Intermediate") return "var(--primary-soft)";
    return "var(--accent)";
  };

  return (
    <section id="skills" className="py-20 sm:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mb-10">
          <span
            className="inline-block text-xs font-semibold tracking-[0.25em] uppercase mb-3"
            style={{ color: "var(--primary)" }}
          >
            Toolbox
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--foreground)",
              letterSpacing: "-0.02em",
            }}
          >
            Skills I reach for daily
          </h2>
          <p className="mt-3 text-foreground/65">
            Comfortable end-to-end on the frontend, comfortable enough on the
            backend to ship a full product without reaching for help.
          </p>
        </div>

        {/* Layout: skill bars on the left, the rotating tech cube on the
            right. On mobile they stack — cube on top, bars below. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Existing 3-column skill bars — unchanged behavior. */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6 order-2 lg:order-1">
            {["frontend", "backend", "devops"].map((category) => {
              const categorySkills = skills.filter((s) => s.category === category);
              if (categorySkills.length === 0) return null;
              const categoryLabels = {
                frontend: "Frontend",
                backend: "Backend",
                devops: "DevOps",
              };
              return (
                <div key={category} className="card-surface p-6">
                  <h3
                    className="text-xs font-semibold uppercase tracking-[0.2em] mb-5"
                    style={{ color: "var(--primary)" }}
                  >
                    {categoryLabels[category]}
                  </h3>
                  <div className="space-y-4">
                    {categorySkills.map((skill) => (
                      <div key={skill.id}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className="text-sm font-medium"
                            style={{ color: "var(--foreground)" }}
                          >
                            {skill.name}
                          </span>
                          <span className="text-xs text-foreground/55">
                            {skill.level}
                          </span>
                        </div>
                        <div
                          className="h-1.5 rounded-full overflow-hidden"
                          style={{ background: "var(--surface)" }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: getLevelPercent(skill.level),
                              background: getLevelTone(skill.level),
                              transition: "width 600ms ease",
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

          {/* Rotating tech cube — a calm visual companion to the bars.
              Hover to pause and read a face. */}
          <div className="lg:col-span-4 order-1 lg:order-2">
            <div
              className="card-surface p-6 lg:sticky lg:top-24"
              style={{ borderRadius: "18px" }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3
                  className="text-xs font-semibold uppercase tracking-[0.2em]"
                  style={{ color: "var(--primary)" }}
                >
                  Stack in Motion
                </h3>
                <span
                  className="text-[11px] font-mono px-2 py-0.5 rounded-md"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  6 / 6
                </span>
              </div>
              <p
                className="text-xs mb-4 leading-relaxed"
                style={{ color: "var(--foreground)", opacity: 0.65 }}
              >
                The six tools I reach for first on any new project. Hover the
                cube to pause it.
              </p>
              <TechCube />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactCta() {
  return (
    <section
      className="py-20 sm:py-24"
      style={{ background: "var(--surface)" }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden text-center rounded-3xl p-10 sm:p-14"
          style={{
            background:
              "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
            boxShadow: "0 18px 48px rgba(15, 31, 28, 0.22)",
          }}
        >
          <div
            className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-30"
            style={{ background: "rgba(255,251,243,0.3)" }}
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-20 -left-12 w-56 h-56 rounded-full opacity-20"
            style={{ background: "rgba(15,31,28,0.6)" }}
            aria-hidden="true"
          />
          <div className="relative z-10">
            <span
              className="inline-block text-xs font-semibold tracking-[0.25em] uppercase mb-4"
              style={{ color: "rgba(255,251,243,0.85)" }}
            >
              Let&apos;s talk
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{
                fontFamily: "var(--font-display)",
                color: "#FFFBF3",
                letterSpacing: "-0.02em",
              }}
            >
              Have an idea brewing?
            </h2>
            <p
              className="max-w-xl mx-auto mb-8"
              style={{ color: "rgba(255,251,243,0.85)" }}
            >
              Whether it&apos;s a startup MVP, a portfolio redesign, or an
              internal tool that needs to feel less internal — I&apos;d love
              to hear about it.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 font-medium rounded-full transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: "#FFFBF3",
                color: "var(--ink)",
                boxShadow: "0 8px 20px rgba(15, 31, 28, 0.25)",
              }}
            >
              <span>Get in Touch</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-border">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-foreground/55">
            © {new Date().getFullYear()} Dhruv Sarvaiya. Built with Next.js &amp; Tailwind CSS.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <SocialIcon
                key={link.name}
                name={link.name}
                href={link.href}
                icon={link.icon}
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <Hero />
      <Projects />
      <Journey />
      <Skills />
      <ContactCta />
      <Footer />
    </main>
  );
}
