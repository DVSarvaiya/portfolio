import Link from "next/link";
import Navbar from "../components/Navbar";

const skillGroups = [
  {
    id: "frontend",
    title: "Frontend",
    items: [
      { name: "TypeScript", level: "Advanced" },
      { name: "React", level: "Advanced" },
      { name: "Next.js", level: "Advanced" },
      { name: "Tailwind CSS", level: "Advanced" },
      { name: "Framer Motion / CSS Animations", level: "Intermediate" },
      { name: "Accessibility (WCAG 2.1 AA)", level: "Intermediate" },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    items: [
      { name: "Node.js", level: "Intermediate" },
      { name: "PostgreSQL", level: "Intermediate" },
      { name: "Prisma ORM", level: "Intermediate" },
      { name: "REST & GraphQL APIs", level: "Intermediate" },
      { name: "Supabase / Firebase", level: "Intermediate" },
    ],
  },
  {
    id: "tooling",
    title: "Tooling & Workflow",
    items: [
      { name: "Git & GitHub Actions", level: "Advanced" },
      { name: "Docker", level: "Intermediate" },
      { name: "Vercel / Cloudflare", level: "Intermediate" },
      { name: "Figma → Code", level: "Advanced" },
      { name: "Playwright / Vitest", level: "Intermediate" },
    ],
  },
  {
    id: "design",
    title: "Design",
    items: [
      { name: "Design Systems", level: "Advanced" },
      { name: "Typography & Hierarchy", level: "Advanced" },
      { name: "Color & Theming", level: "Advanced" },
      { name: "Microinteractions", level: "Intermediate" },
    ],
  },
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

const principles = [
  {
    id: "calm",
    title: "Calm over flashy",
    body: "I prefer interfaces that don't fight for attention. Soft motion, generous whitespace, typography that does the work.",
  },
  {
    id: "honest",
    title: "Honest interfaces",
    body: "States should mean something. Loading, empty, error — each gets a moment of care, not a stock spinner.",
  },
  {
    id: "durable",
    title: "Built to last",
    body: "Boring choices for foundations, interesting choices for the surface. The fun lives where users can see it.",
  },
  {
    id: "accessible",
    title: "Accessible by default",
    body: "Keyboard-first navigation, focus-visible rings, color contrast — accessibility is a baseline, not an add-on.",
  },
];

const timeline = [
  {
    year: "2022",
    title: "First lines of code",
    body: "Started with HTML and CSS. Built a handful of static sites and fell in love with making things on the web.",
  },
  {
    year: "2023",
    title: "Went full-stack",
    body: "Picked up React, then Node.js, then databases. Shipped my first full CRUD application end-to-end.",
  },
  {
    year: "2024",
    title: "Production work",
    body: "Built and deployed real client projects with auth, payments, CI/CD and the boring infrastructure that holds it together.",
  },
  {
    year: "2025",
    title: "Automation & AI tooling",
    body: "Began building internal tools and AI-assisted workflows — both for clients and for my own practice.",
  },
];

function Footer() {
  return (
    <footer className="bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-border">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-foreground/55">
            © {new Date().getFullYear()} Dhruv Sarvaiya. Built with Next.js &amp; Tailwind CSS.
          </p>
          <Link
            href="/"
            className="text-sm font-medium transition-colors"
            style={{ color: "var(--foreground)", opacity: 0.7 }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default function AboutPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />

      {/* Hero strip */}
      <section
        className="relative pt-32 pb-16 overflow-hidden hero-bg"
        style={{ "--mx": "50%", "--my": "50%" }}
      >
        <div
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-40 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(224,120,86,0.25) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-20 -left-16 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(42,157,143,0.22) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span
            className="inline-block text-xs font-semibold tracking-[0.25em] uppercase mb-4"
            style={{ color: "var(--accent)" }}
          >
            About
          </span>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--foreground)",
              letterSpacing: "-0.025em",
            }}
          >
            I&apos;m Dhruv — a frontend engineer building{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              calm, considered
            </span>{" "}
            interfaces.
          </h1>
          <p
            className="text-lg sm:text-xl max-w-2xl leading-relaxed"
            style={{ color: "var(--foreground)", opacity: 0.75 }}
          >
            Based in Gujarat, India. I&apos;ve spent the last four years
            designing and shipping web products — mostly with Next.js,
            TypeScript and a lot of chai. I care about typography, motion that
            means something, and code a future-me will be able to read.
          </p>
        </div>
      </section>

      {/* Bio + Principles */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="card-surface p-8 sm:p-10 mb-12"
            style={{ borderRadius: "20px" }}
          >
            <h2
              className="text-2xl sm:text-3xl font-bold mb-4"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--foreground)",
                letterSpacing: "-0.02em",
              }}
            >
              A bit more about me
            </h2>
            <div
              className="space-y-4 text-base leading-relaxed"
              style={{ color: "var(--foreground)", opacity: 0.8 }}
            >
              <p>
                I started building for the web because it was the cheapest way
                to put an idea in front of real people. Four years later, that
                hasn&apos;t changed — I still get a small thrill when
                something I&apos;ve made shows up on someone else&apos;s
                screen and works.
              </p>
              <p>
                I work mostly on the frontend, but I&apos;ve shipped enough
                full-stack product to know when to leave the comfortable layer
                and dig into a database or a deploy pipeline. My favourite
                projects sit at the intersection of design and engineering —
                the place where a pixel-perfect mockup has to survive contact
                with reality.
              </p>
              <p>
                Outside of work I read a lot of fiction, sketch badly, and
                maintain a small but growing collection of mechanical
                keyboards. I keep a notebook of small UI details I see in the
                wild — most of them end up in client work, eventually.
              </p>
            </div>
          </div>

          <h2
            className="text-2xl sm:text-3xl font-bold mb-8"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--foreground)",
              letterSpacing: "-0.02em",
            }}
          >
            How I think about the work
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {principles.map((p) => (
              <article
                key={p.id}
                className="card-surface p-6"
                style={{ borderRadius: "16px" }}
              >
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--foreground)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {p.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--foreground)", opacity: 0.7 }}
                >
                  {p.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Skills grid */}
      <section
        className="py-16 sm:py-20"
        style={{ background: "var(--surface)" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-10">
            <span
              className="inline-block text-xs font-semibold tracking-[0.25em] uppercase mb-3"
              style={{ color: "var(--primary)" }}
            >
              Skills
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--foreground)",
                letterSpacing: "-0.02em",
              }}
            >
              The full toolbox
            </h2>
            <p className="mt-3 text-foreground/65">
              Where I&apos;m sharp, where I&apos;m growing, and where I lean on
              a teammate. Honest ranges rather than inflated percentages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillGroups.map((group) => (
              <div
                key={group.id}
                className="card-surface p-6"
                style={{ borderRadius: "16px" }}
              >
                <h3
                  className="text-xs font-semibold uppercase tracking-[0.2em] mb-5"
                  style={{ color: "var(--primary)" }}
                >
                  {group.title}
                </h3>
                <div className="space-y-4">
                  {group.items.map((skill) => (
                    <div key={skill.name}>
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
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span
              className="inline-block text-xs font-semibold tracking-[0.25em] uppercase mb-3"
              style={{ color: "var(--accent)" }}
            >
              Timeline
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--foreground)",
                letterSpacing: "-0.02em",
              }}
            >
              How I got here
            </h2>
          </div>

          <ol className="space-y-5">
            {timeline.map((m, idx) => (
              <li
                key={m.year}
                className="card-surface p-6 flex flex-col sm:flex-row gap-6"
                style={{ borderRadius: "16px" }}
              >
                <div
                  className="sm:w-28 flex-shrink-0 text-3xl font-bold leading-none"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--primary)",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {m.year}
                </div>
                <div className="flex-1">
                  <h3
                    className="text-lg font-semibold mb-1.5"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--foreground)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {m.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--foreground)", opacity: 0.72 }}
                  >
                    {m.body}
                  </p>
                  <span
                    className="inline-block mt-3 text-[11px] font-mono px-2 py-0.5 rounded-md"
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                    }}
                  >
                    Step {idx + 1} / {timeline.length}
                  </span>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/projects"
              className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 font-medium rounded-full"
            >
              <span>See Selected Work</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/contact"
              className="btn-ghost inline-flex items-center gap-2 px-7 py-3.5 font-medium rounded-full"
            >
              <span>Get in Touch</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
