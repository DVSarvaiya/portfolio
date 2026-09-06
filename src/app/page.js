"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  // Dark mode state — instant DOM toggle
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const useDark = savedTheme ? savedTheme === "dark" : prefersDark;
    setIsDark(useDark);
    if (useDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark, mounted]);

  const toggleDarkMode = () => {
    const next = !isDark;
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    setIsDark(next);
  };

  // Existing local UI state
  const [showProjects, setShowProjects] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileImgError, setProfileImgError] = useState(false);

  // Hardcoded projects with realistic details
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

  // Hardcoded skills
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

  // Hardcoded stats
  const stats = [
    { value: "4+", label: "Years building on the web" },
    { value: "20+", label: "Shipped client projects" },
    { value: "12", label: "Open-source repositories" },
    { value: "∞", label: "Cups of chai per release" },
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

  // Typing effect
  const typingStrings = [
    "Frontend Engineer",
    "Interface Builder",
    "Indie Hacker",
    "Lifelong Student",
  ];
  const [typing, setTyping] = useState({
    str: "",
    index: 0,
    isDeleting: false,
    speed: 150,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTyping((prev) => {
        const currentString = typingStrings[prev.index];
        let newStr;
        let newIndex;
        let newIsDeleting;
        let newSpeed;

        if (!prev.isDeleting) {
          newStr = currentString.substring(0, prev.str.length + 1);
          newSpeed = 140;
          if (newStr.length === currentString.length) {
            newIsDeleting = true;
            newSpeed = 1900;
          } else {
            newIsDeleting = false;
          }
          newIndex = prev.index;
        } else {
          newStr = currentString.substring(0, prev.str.length - 1);
          newSpeed = 70;
          if (newStr.length === 0) {
            newIsDeleting = false;
            newIndex = (prev.index + 1) % typingStrings.length;
          } else {
            newIsDeleting = true;
            newIndex = prev.index;
          }
        }
        return {
          str: newStr,
          index: newIndex,
          isDeleting: newIsDeleting,
          speed: newSpeed,
        };
      });
    }, typing.speed);

    return () => clearTimeout(timeout);
  }, [typing, typingStrings]);

  const toggleMobileMenu = () => setMobileMenuOpen((p) => !p);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Projects", href: "#projects" },
    { name: "Skills", href: "#skills" },
    { name: "Contact", href: "/contact" },
  ];

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

  const renderSocialIcon = (link) => (
    <a
      key={link.name}
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        color: "var(--foreground)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--primary)";
        e.currentTarget.style.color = "var(--primary)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.color = "var(--foreground)";
      }}
      aria-label={link.name}
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        {link.icon}
      </svg>
    </a>
  );

  return (
    <main className="relative min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* ====================== NAVBAR ====================== */}
      <nav
        className="fixed top-0 w-full z-50"
        style={{
          background: "var(--glass-bg)",
          borderBottom: "1px solid var(--border)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a
              href="#about"
              className="flex items-center gap-2"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{
                  background: "linear-gradient(135deg, var(--primary), var(--accent))",
                  color: "#FFFBF3",
                }}
              >
                DS
              </span>
              <span className="text-base text-foreground">Dhruv Sarvaiya</span>
            </a>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) =>
                link.name === "About" || link.name === "Contact" ? (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="relative text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className="relative text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                )
              )}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {socialLinks.map(renderSocialIcon)}
              <button
                onClick={toggleDarkMode}
                className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.color = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--foreground)";
                }}
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>

            <button
              onClick={toggleMobileMenu}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg"
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
              }}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <span
                className={`block w-5 h-0.5 transition-all duration-300 ${
                  mobileMenuOpen ? "rotate-45 translate-y-1" : ""
                }`}
                style={{ background: "var(--foreground)" }}
              ></span>
              <span
                className={`block w-5 h-0.5 transition-all duration-300 ${
                  mobileMenuOpen ? "opacity-0" : ""
                }`}
                style={{ background: "var(--foreground)" }}
              ></span>
              <span
                className={`block w-5 h-0.5 transition-all duration-300 ${
                  mobileMenuOpen ? "-rotate-45 -translate-y-1" : ""
                }`}
                style={{ background: "var(--foreground)" }}
              ></span>
            </button>
          </div>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div
            className="px-4 pb-4 space-y-3"
            style={{
              background: "var(--glass-bg)",
              borderTop: "1px solid var(--border)",
            }}
          >
            {navLinks.map((link) =>
              link.name === "About" || link.name === "Contact" ? (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="block text-sm font-medium text-foreground/80 hover:text-foreground transition-colors py-2"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="block text-sm font-medium text-foreground/80 hover:text-foreground transition-colors py-2"
                >
                  {link.name}
                </a>
              )
            )}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map(renderSocialIcon)}
              <button
                onClick={toggleDarkMode}
                className="w-10 h-10 flex items-center justify-center rounded-full"
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ====================== HERO ====================== */}
      <section
        id="about"
        className="relative min-h-screen pt-24 pb-12 overflow-hidden hero-bg"
      >
        {/* Floating orbs parallax layer */}
        <div className="orb orb-1" aria-hidden="true" />
        <div className="orb orb-2" aria-hidden="true" />
        <div className="orb orb-3" aria-hidden="true" />

        {/* Parallax grid behind headline */}
        <div className="bg-grid" aria-hidden="true" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] text-center">
          {/* Profile avatar */}
          <div className="relative mb-8">
            <div
              className="absolute inset-0 rounded-full blur-2xl opacity-50"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary), var(--accent))",
              }}
              aria-hidden="true"
            />
            <div
              className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full p-[3px]"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary), var(--accent))",
              }}
            >
              <div
                className="w-full h-full rounded-full flex items-center justify-center overflow-hidden"
                style={{ background: "var(--surface-2)" }}
              >
                {profileImgError ? (
                  <span
                    className="text-5xl sm:text-6xl font-bold"
                    style={{
                      fontFamily: "var(--font-display)",
                      background:
                        "linear-gradient(135deg, var(--primary), var(--accent))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    DS
                  </span>
                ) : (
                  <img
                    src="/profile.jpg"
                    alt="Dhruv Sarvaiya"
                    onError={() => setProfileImgError(true)}
                    className="w-full h-full rounded-full object-cover"
                  />
                )}
              </div>
            </div>

            <div
              className="absolute -bottom-2 -right-2 rounded-full px-3 py-1.5 flex items-center space-x-1.5"
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                boxShadow: "0 6px 16px rgba(15, 31, 28, 0.14)",
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  background: "var(--primary)",
                  animation: "pulse-ring 1.8s ease-out infinite",
                  boxShadow: "0 0 0 0 var(--primary)",
                }}
              ></span>
              <span className="text-xs font-medium text-foreground">
                Available for work
              </span>
            </div>
          </div>

          {/* Eyebrow */}
          <span
            className="inline-block text-xs font-semibold tracking-[0.25em] uppercase mb-5"
            style={{ color: "var(--accent)" }}
          >
            Portfolio · Est. 2024
          </span>

          {/* Heading */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 tracking-tight"
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
              {typing.str}
            </span>
            <span
              className="inline-block w-[3px] h-[0.9em] ml-1 align-middle"
              style={{
                background: "linear-gradient(180deg, var(--primary), var(--accent))",
                animation: "blink 1s step-start infinite",
              }}
              aria-hidden="true"
            ></span>
          </h1>

          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed text-foreground/70">
            I&apos;m Dhruv — a frontend engineer based in Gujarat. I build calm,
            considered interfaces for the web, mostly with Next.js, TypeScript
            and a lot of tea.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/contact"
              className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 font-medium rounded-full"
            >
              <span>Start a Project</span>
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a
              href="#projects"
              className="btn-ghost inline-flex items-center gap-2 px-8 py-3.5 font-medium rounded-full"
            >
              <span>See Selected Work</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full max-w-3xl">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="card-surface px-4 py-5 text-center"
                style={{ borderRadius: "16px" }}
              >
                <div
                  className="text-2xl sm:text-3xl font-bold"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--primary)",
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm mt-1 text-foreground/60">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="flex flex-col items-center space-y-2">
              <span className="text-xs text-foreground/50">Scroll</span>
              <div
                className="w-6 h-10 rounded-full flex justify-center p-1"
                style={{ border: "1.5px solid var(--border)" }}
              >
                <div
                  className="w-1.5 h-3 rounded-full"
                  style={{
                    background:
                      "linear-gradient(180deg, var(--primary), var(--accent))",
                    animation: "scroll-dot 2s ease-in-out infinite",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================== PROJECTS ====================== */}
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
                className="text-3xl sm:text-4xl font-bold"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--foreground)",
                  letterSpacing: "-0.02em",
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
            {(showProjects ? projects : projects.slice(0, 3)).map((project) => (
              <article key={project.id} className="card-surface overflow-hidden">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                  aria-label={`Open ${project.title} on GitHub`}
                >
                  <div
                    className="aspect-[16/10] relative overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(42,157,143,0.18) 0%, rgba(224,120,86,0.18) 100%)",
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-60"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 20% 30%, rgba(255,251,243,0.4) 0%, transparent 35%), radial-gradient(circle at 80% 70%, rgba(255,251,243,0.25) 0%, transparent 35%)",
                      }}
                      aria-hidden="true"
                    />
                    <div className="absolute inset-0 flex items-end justify-between">
                      <span
                        className="m-4 text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full tag-primary"
                      >
                        {project.tag}
                      </span>
                      <span
                        className="m-4 text-xs font-mono"
                        style={{ color: "var(--foreground)/0.7", opacity: 0.7 }}
                      >
                        {project.year}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3
                      className="text-lg font-semibold mb-2"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: "var(--foreground)",
                      }}
                    >
                      {project.title}
                    </h3>
                    <p className="text-sm text-foreground/65 leading-relaxed line-clamp-3 mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="text-[11px] font-medium px-2 py-0.5 rounded-md"
                          style={{
                            background: "var(--surface)",
                            color: "var(--foreground)/0.75",
                            border: "1px solid var(--border)",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== SKILLS ====================== */}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        </div>
      </section>

      {/* ====================== CONTACT CTA ====================== */}
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

      {/* ====================== FOOTER ====================== */}
      <footer className="bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-foreground/55">
              © {new Date().getFullYear()} Dhruv Sarvaiya. Built with Next.js &amp; Tailwind CSS.
            </p>
            <div className="flex items-center gap-3">{socialLinks.map(renderSocialIcon)}</div>
          </div>
        </div>
      </footer>
    </main>
  );
}
