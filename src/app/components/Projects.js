"use client";

import { useState } from "react";
import ProjectCard from "./ProjectCard";

const projects = [
  {
    id: 1,
    title: "Tide — Habit Tracker",
    tag: "Web App",
    year: "2024",
    description:
      "A minimalist habit tracker that visualises streaks as soft tidal curves, built with Next.js and a Postgres backend.",
    tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
    link: "https://github.com/DVSarvaiya/tide",
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
  },
];

export default function Projects() {
  const [showProjects, setShowProjects] = useState(false);

  const visibleProjects = showProjects ? projects : projects.slice(0, 3);

  return (
    <section
      id="projects"
      className="py-20 sm:py-24"
      style={{ background: "var(--surface)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div className="max-w-xl">
            <span
              className="inline-block text-xs font-semibold tracking-[0.25em] uppercase mb-3"
              style={{ color: "var(--accent)" }}
            >
              Selected Work
            </span>
            <h2
              className="reveal text-3xl sm:text-4xl font-bold"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--foreground)",
                letterSpacing: "-0.02em",
                animationDelay: "0s",
              }}
            >
              Things I&apos;ve built recently
            </h2>
            <p className="mt-3 text-foreground/65">
              A handful of personal and client projects from the last couple
              of years. Each one taught me something I now use every day.
            </p>
          </div>
          <button
            onClick={() => setShowProjects((prev) => !prev)}
            className="btn-accent self-start sm:self-auto px-5 py-2.5 text-sm font-medium rounded-full inline-flex items-center gap-2"
            aria-label={showProjects ? "Show fewer projects" : "Show all projects"}
          >
            {showProjects ? "Show Less" : "Show All"}
            <svg
              className="w-4 h-4 transition-transform"
              style={{
                transform: showProjects ? "rotate(180deg)" : "rotate(0deg)",
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleProjects.map((project, index) => (
            <div
              key={project.id}
              className="reveal"
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
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
      </div>
    </section>
  );
}
