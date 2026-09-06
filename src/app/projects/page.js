"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";

const allProjects = [
  {
    id: 1,
    title: "Tide — Habit Tracker",
    tag: "Web App",
    year: "2024",
    description:
      "A minimalist habit tracker that visualises streaks as soft tidal curves, built with Next.js and a Postgres backend.",
    tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
    link: "https://github.com/DVSarvaiya/tide",
    category: "Web App",
  },
  {
    id: 2,
    title: "Lumen Notes",
    tag: "Productivity",
    year: "2024",
    description:
      "End-to-end encrypted markdown notes with a focus-mode editor and offline-first sync using IndexedDB.",
    tech: ["React", "TypeScript", "IndexedDB", "WebCrypto"],
    link: "https://github.com/DVSarvaiya/lumen-notes",
    category: "Productivity",
  },
  {
    id: 3,
    title: "Folio Studio",
    tag: "Design System",
    year: "2023",
    description:
      "A component library and design system used across four client projects, themed around warm neutrals.",
    tech: ["React", "Storybook", "Tailwind CSS"],
    link: "https://github.com/DVSarvaiya/folio-studio",
    category: "Design System",
  },
  {
    id: 4,
    title: "Drift Weather",
    tag: "API + UI",
    year: "2023",
    description:
      "A location-aware weather dashboard that pairs 7-day forecasts with a quiet, hand-drawn map aesthetic.",
    tech: ["Next.js", "Open-Meteo", "D3"],
    link: "https://github.com/DVSarvaiya/drift-weather",
    category: "Web App",
  },
  {
    id: 5,
    title: "Atlas Kanban",
    tag: "SaaS",
    year: "2022",
    description:
      "A real-time team kanban with optimistic updates, drag-and-drop boards, and a calm two-column layout.",
    tech: ["React", "Node.js", "WebSockets", "PostgreSQL"],
    link: "https://github.com/DVSarvaiya/atlas-kanban",
    category: "SaaS",
  },
  {
    id: 6,
    title: "Quill Editor",
    tag: "OSS",
    year: "2022",
    description:
      "A lightweight markdown editor with live preview, slash commands, and one-click export to HTML or PDF.",
    tech: ["React", "ProseMirror", "TypeScript"],
    link: "https://github.com/DVSarvaiya/quill-editor",
    category: "OSS",
  },
  {
    id: 7,
    title: "Marquee CMS",
    tag: "Web App",
    year: "2023",
    description:
      "A headless CMS aimed at small editorial teams — block-based, markdown-first, with a generous preview mode.",
    tech: ["Next.js", "tRPC", "PostgreSQL", "S3"],
    link: "https://github.com/DVSarvaiya/marquee-cms",
    category: "Web App",
  },
  {
    id: 8,
    title: "Sundial Analytics",
    tag: "Dashboard",
    year: "2024",
    description:
      "A privacy-respecting analytics dashboard with a single-glance daily summary and CSV export built in.",
    tech: ["Next.js", "TypeScript", "ClickHouse", "Recharts"],
    link: "https://github.com/DVSarvaiya/sundial-analytics",
    category: "Dashboard",
  },
  {
    id: 9,
    title: "Cobalt Icons",
    tag: "OSS",
    year: "2022",
    description:
      "An open-source icon set of 240+ stroke icons, designed on a 1.5px grid and shipped as both SVG and a React package.",
    tech: ["SVG", "React", "TypeScript"],
    link: "https://github.com/DVSarvaiya/cobalt-icons",
    category: "OSS",
  },
];

const categories = [
  "All",
  "Web App",
  "Productivity",
  "Design System",
  "Dashboard",
  "SaaS",
  "OSS",
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

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? allProjects
    : allProjects.filter((p) => p.category === activeCategory);

  return (
    <main className="relative min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />

      {/* Heading */}
      <section
        className="relative pt-32 pb-12 overflow-hidden hero-bg"
        style={{ "--mx": "50%", "--my": "50%" }}
      >
        <div
          className="absolute -top-24 -left-24 w-80 h-80 rounded-full blur-3xl opacity-40 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(42,157,143,0.25) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-20 -right-16 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(224,120,86,0.22) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <span
            className="inline-block text-xs font-semibold tracking-[0.25em] uppercase mb-4"
            style={{ color: "var(--accent)" }}
          >
            Projects
          </span>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--foreground)",
              letterSpacing: "-0.025em",
            }}
          >
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
              All selected work,
            </span>{" "}
            in one place.
          </h1>
          <p
            className="text-lg max-w-2xl leading-relaxed"
            style={{ color: "var(--foreground)", opacity: 0.75 }}
          >
            Personal projects, client work, and a couple of open-source
            libraries. Filter by category to narrow things down.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase"
              style={{ color: "var(--foreground)", opacity: 0.55 }}
            >
              {filtered.length} {filtered.length === 1 ? "project" : "projects"}
            </span>
            <span
              className="hidden sm:inline-block w-1 h-1 rounded-full"
              style={{ background: "var(--border)" }}
              aria-hidden="true"
            />
            <span
              className="text-xs font-medium"
              style={{ color: "var(--foreground)", opacity: 0.55 }}
            >
              Last updated Q2 2025
            </span>
          </div>
        </div>
      </section>

      {/* Filter + grid */}
      <section
        className="py-12 sm:py-16"
        style={{ background: "var(--surface)" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category filter */}
          <div
            className="mb-10 flex flex-wrap items-center gap-2 p-1.5 rounded-2xl"
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              width: "fit-content",
            }}
            role="tablist"
            aria-label="Filter projects by category"
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(cat)}
                  className="px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200"
                  style={{
                    background: isActive ? "var(--primary)" : "transparent",
                    color: isActive ? "#FFFBF3" : "var(--foreground)",
                    opacity: isActive ? 1 : 0.7,
                    boxShadow: isActive
                      ? "0 4px 14px rgba(42, 157, 143, 0.25)"
                      : "none",
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div
              className="card-surface p-10 text-center"
              style={{ borderRadius: "18px" }}
            >
              <p
                className="text-base"
                style={{ color: "var(--foreground)", opacity: 0.7 }}
              >
                No projects in this category yet — check back soon.
              </p>
              <button
                type="button"
                onClick={() => setActiveCategory("All")}
                className="btn-ghost mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full"
              >
                <span>Show All Projects</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((project, index) => (
                <div
                  key={project.id}
                  className="reveal"
                  style={{ animationDelay: `${(index + 1) * 0.06}s` }}
                >
                  <ProjectCard
                    title={project.title}
                    tag={project.tag}
                    year={project.year}
                    description={project.description}
                    tech={project.tech}
                    link={project.link}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA strip */}
      <section className="py-20 sm:py-24 bg-background">
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
                Have a project in mind?
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold mb-4"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "#FFFBF3",
                  letterSpacing: "-0.02em",
                }}
              >
                Let&apos;s build something together.
              </h2>
              <p
                className="max-w-xl mx-auto mb-8"
                style={{ color: "rgba(255,251,243,0.85)" }}
              >
                I&apos;m taking on a small number of new projects this
                quarter. If you&apos;ve got something interesting, I&apos;d
                love to hear about it.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-7 py-3.5 font-medium rounded-full transition-all duration-200"
                  style={{
                    background: "transparent",
                    color: "#FFFBF3",
                    border: "1px solid rgba(255,251,243,0.45)",
                  }}
                >
                  <span>More About Me</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
