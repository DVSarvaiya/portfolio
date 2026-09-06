"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Home() {
  // Dark mode state - instant toggle via DOM
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initial theme load (runs once)
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const useDark = savedTheme ? savedTheme === "dark" : prefersDark;
    setIsDark(useDark);
    if (useDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setMounted(true);
  }, []);

  // Sync state -> DOM and storage whenever isDark changes
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

  // Instant dark mode toggle - updates DOM directly for zero re-render delay
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

  // Existing state
  const [showProjects, setShowProjects] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileImgError, setProfileImgError] = useState(false);

  const form = {
    name: "",
    email: "",
    message: "",
  };

  const [formData, setForm] = useState(form);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState(null);

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

  // Existing form handlers
  const validate = () => {
    const newErrors = { name: "", email: "", message: "" };
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email is invalid.";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required.";
    setErrors(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.message;
  };

  const validateField = (fieldName) => {
    let error = "";
    const value = formData[fieldName];
    switch (fieldName) {
      case "name":
        if (!value.trim()) error = "Name is required.";
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required.";
        } else if (!/^\S+@\S+\.\S+$/.test(value)) {
          error = "Email is invalid.";
        }
        break;
      case "message":
        if (!value.trim()) error = "Message is required.";
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [fieldName]: error }));
    return error === "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      validateField(name);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    validateField(name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setSubmitStatus("success");
      console.log("Form submitted:", formData);
      setForm({ name: "", email: "", message: "" });
      setErrors({ name: "", email: "", message: "" });
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

  // Typing effect
  const typingStrings = [
    "Full-Stack Developer",
    "Creative Coder",
    "Problem Solver",
    "Tech Enthusiast",
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
          newSpeed = 150;
          if (newStr.length === currentString.length) {
            newIsDeleting = true;
            newSpeed = 2000;
          } else {
            newIsDeleting = false;
          }
          newIndex = prev.index;
        } else {
          newStr = currentString.substring(0, prev.str.length - 1);
          newSpeed = 80;
          if (newStr.length === 0) {
            newIsDeleting = false;
            newIndex = (prev.index + 1) % typingStrings.length;
          } else {
            newIsDeleting = true;
            newIndex = prev.index;
          }
        }
        return { str: newStr, index: newIndex, isDeleting: newIsDeleting, speed: newSpeed };
      });
    }, typing.speed);

    return () => clearTimeout(timeout);
  }, [typing, typingStrings]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // nav links config
  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Projects", href: "#projects" },
    { name: "Skills", href: "#skills" },
    { name: "Contact", href: "/contact" },
  ];

  const socialLinks = [
    { name: "LinkedIn", href: "https://www.linkedin.com/in/dvsarvaiya", icon: (
      <path d="M20.447 20.447h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.562h.046c.477-.903 1.637-1.852 3.37-1.852 3.601 0 4.267 2.37 4.267 5.453v6.284zM5.337 7.433a2.065 2.065 0 01-2.067 2.067 2.065 2.065 0 012.067-2.067zm0 16.074H1.27V7.433h4.067v16.074zM22.225 1.247H1.771C.792 1.247 0 2.039 0 3.016v18.968C0 21.961.792 22.75 1.771 22.75h20.454c.979 0 1.77-.789 1.77-1.766V3.016c0-.977-.791-1.769-1.77-1.769z" />
    ) },
    { name: "GitHub", href: "https://github.com/DVSarvaiya", icon: (
      <path d="M12 .001c-6.627 0-12 5.373-12 12 0 5.303 3.438 9.8 8.207 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.604-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.627-5.373-12-12-12z" />
    ) },
  ];

  const renderSocialIcon = (link) => (
    <a
      key={link.name}
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-blue-100 border border-slate-200 hover:border-blue-400 transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 group dark:bg-white/5 dark:hover:bg-primary/20 dark:border-white/10 dark:hover:border-primary/50"
      aria-label={link.name}
    >
      <svg className="w-4 h-4 text-slate-600 group-hover:text-blue-600 transition-colors dark:text-foreground/80 dark:group-hover:text-primary" fill="currentColor" viewBox="0 0 24 24">
        {link.icon}
      </svg>
    </a>
  );

  return (
    <main className="relative min-h-screen bg-slate-50 text-slate-800 transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100">
      {/* Sticky Glass Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 border-b border-slate-200/60 backdrop-blur-md transition-colors duration-300 dark:bg-gray-900/80 dark:border-gray-800/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a
              href="#about"
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-500 dark:from-primary dark:to-accent"
            >
              Dhruv Sarvaiya
            </a>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                link.name === "About" || link.name === "Contact" ? (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="relative text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors group dark:text-gray-200 dark:hover:text-foreground"
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-violet-500 transition-all duration-300 group-hover:w-full dark:from-primary dark:to-accent"></span>
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className="relative text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors group dark:text-gray-200 dark:hover:text-foreground"
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-violet-500 transition-all duration-300 group-hover:w-full dark:from-primary dark:to-accent"></span>
                  </a>
                )
              ))}
            </div>

            {/* Social Icons & Dark Mode Toggle (Desktop) */}
            <div className="hidden md:flex items-center space-x-3">
              {socialLinks.map(renderSocialIcon)}
              {/* Dark Mode Toggle Button - instant DOM update */}
              <button
                onClick={toggleDarkMode}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-blue-100 border border-slate-200 hover:border-blue-400 transition-all duration-200 hover:scale-110 hover:-translate-y-0.5 dark:bg-white/5 dark:hover:bg-primary/20 dark:border-white/10 dark:hover:border-primary/50"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <svg className="w-4 h-4 text-slate-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-slate-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 border border-slate-200 hover:bg-blue-100 transition-colors dark:bg-white/5 dark:border-white/10 dark:hover:bg-primary/20"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <span
                className={`block w-5 h-0.5 bg-slate-800 transition-all duration-300 dark:bg-gray-200 ${
                  mobileMenuOpen ? "rotate-45 translate-y-1" : ""
                }`}
              ></span>
              <span
                className={`block w-5 h-0.5 bg-slate-800 transition-all duration-300 dark:bg-gray-200 ${
                  mobileMenuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`block w-5 h-0.5 bg-slate-800 transition-all duration-300 dark:bg-gray-200 ${
                  mobileMenuOpen ? "-rotate-45 -translate-y-1" : ""
                }`}
              ></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu - slide down with fade-in */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="px-4 pb-4 space-y-3 bg-white/95 border-t border-slate-200/60 dark:bg-gray-900/95 dark:border-gray-800/30">
            {navLinks.map((link) => (
              link.name === "About" || link.name === "Contact" ? (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="block text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors py-2 dark:text-gray-200 dark:hover:text-foreground"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="block text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors py-2 dark:text-gray-200 dark:hover:text-foreground"
                >
                  {link.name}
                </a>
              )
            ))}
            <div className="flex items-center space-x-3 pt-2">
              {socialLinks.map(renderSocialIcon)}
              {/* Dark Mode Toggle Button */}
              <button
                onClick={toggleDarkMode}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-blue-100 border border-slate-200 hover:border-blue-400 transition-all duration-200 dark:bg-white/5 dark:hover:bg-primary/20 dark:border-white/10 dark:hover:border-primary/50"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <svg className="w-4 h-4 text-slate-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-slate-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - lighter, cleaner design */}
      <section
        id="about"
        className="relative min-h-screen pt-24 pb-12 bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden dark:from-[#050505] dark:to-slate-900"
      >
        {/* Soft decorative gradient blobs */}
        <div
          className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-40"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-30"
          style={{ background: "radial-gradient(circle, rgba(167,139,250,0.25) 0%, transparent 70%)" }}
        />

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] text-center">
          {/* Profile Image with Soft Ring */}
          <div className="relative mb-8">
            <div
              className="absolute -inset-2 rounded-full blur-xl opacity-40"
              style={{ background: "linear-gradient(135deg, #3b82f6, #a78bfa)" }}
            />
            <div
              className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full p-[3px]"
              style={{ background: "linear-gradient(135deg, #3b82f6, #a78bfa)" }}
            >
              <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                {profileImgError ? (
                  <span className="text-5xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-500">
                    DS
                  </span>
                ) : (
                  <img
                    src="/profile.jpg"
                    alt="Dhruv"
                    onError={() => setProfileImgError(true)}
                    className="w-full h-full rounded-full object-cover"
                  />
                )}
              </div>
            </div>

            {/* Availability Badge */}
            <div className="absolute -bottom-2 -right-2 bg-white border border-slate-200 rounded-full px-3 py-1.5 flex items-center space-x-1.5 shadow-md dark:bg-black/60 dark:border-white/10 dark:backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-medium text-slate-700 dark:text-gray-200">Available</span>
            </div>
          </div>

          {/* Animated Typing Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-gray-100 mb-4 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-violet-500 to-blue-600 dark:from-primary dark:via-accent dark:to-primary">
              {typing.str}
            </span>
            <span
              className="inline-block w-[3px] h-[0.9em] ml-1 align-middle"
              style={{
                background: "linear-gradient(180deg, #3b82f6, #a78bfa)",
                animation: "blink 1s step-start infinite",
              }}
            ></span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Crafting elegant digital experiences with modern technologies and
            pixel-perfect design.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/contact"
              className="group relative px-8 py-3.5 text-white font-medium rounded-full overflow-hidden transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #a78bfa)",
                boxShadow: "0 4px 14px rgba(59,130,246,0.35)",
              }}
            >
              <span className="flex items-center space-x-2">
                <span>Get In Touch</span>
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 19l2-2-2-2M17 5l2 2-2 2M19 12H5"
                  />
                </svg>
              </span>
            </Link>
            <a
              href="#projects"
              className="group relative px-8 py-3.5 bg-white text-slate-700 font-medium rounded-full border border-slate-200 transition-all duration-300 hover:border-blue-400 hover:-translate-y-0.5 active:translate-y-0 dark:bg-white/5 dark:text-gray-200 dark:border-white/10 dark:hover:border-primary/50"
              style={{ boxShadow: "0 2px 8px rgba(15,23,42,0.04)" }}
            >
              <span className="flex items-center space-x-2">
                <span>View My Work</span>
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 19l2-2-2-2M17 5l2 2-2 2M19 12H5"
                  />
                </svg>
              </span>
            </a>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex flex-col items-center space-y-2">
              <span className="text-xs text-slate-500 dark:text-gray-400">Scroll Down</span>
              <div className="w-6 h-10 rounded-full border-2 border-slate-300 flex justify-center p-1 dark:border-white/20">
                <div
                  className="w-1.5 h-3 rounded-full"
                  style={{
                    background: "linear-gradient(180deg, #3b82f6, #a78bfa)",
                    animation: "scroll-dot 2s ease-in-out infinite",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections Wrapper */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Projects Section */}
        <section id="projects">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-gray-100">Featured Projects</h2>
            <button
              onClick={() => setShowProjects((prev) => !prev)}
              className="px-4 py-2 text-white rounded-lg text-sm font-medium transition-all hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #a78bfa)",
                boxShadow: "0 2px 10px rgba(59,130,246,0.3)",
              }}
            >
              {showProjects ? "Hide Projects" : "Show All Projects"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(showProjects ? projects : projects.slice(0, 3)).map((project) => (
              <article
                key={project.id}
                className="group bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 dark:bg-white/5 dark:border-white/10"
                style={{ boxShadow: "0 2px 12px rgba(15,23,42,0.06)" }}
              >
                <div
                  className="aspect-video relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(167,139,250,0.1) 100%)",
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-blue-500/60 text-2xl font-medium dark:text-primary/50">
                      {project.title}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-gray-400 line-clamp-2">{project.description}</p>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between dark:border-white/10">
                    <span className="text-xs text-slate-500 dark:text-gray-400">View Details</span>
                    <svg
                      className="w-5 h-5 text-slate-500 group-hover:text-blue-600 transition-all group-hover:translate-x-1 dark:text-gray-400 dark:group-hover:text-primary"
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
        </section>

        {/* Skills Section */}
        <section id="skills" className="mt-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-gray-100 mb-8">Technical Skills</h2>
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
                <div
                  key={category}
                  className="bg-white border border-slate-200 rounded-2xl p-6 transition-all duration-300 dark:bg-white/5 dark:border-white/10"
                  style={{ boxShadow: "0 2px 12px rgba(15,23,42,0.06)" }}
                >
                  <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-4 dark:text-primary">
                    {categoryLabels[category]}
                  </h3>
                  <div className="space-y-4">
                    {categorySkills.map((skill) => (
                      <div key={skill.id}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium text-slate-900 dark:text-gray-100">{skill.name}</span>
                          <span className="text-xs text-slate-500 dark:text-gray-400">{skill.level}</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden dark:bg-white/5">
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

        {/* Contact CTA Section */}
        <section id="contact" className="mt-16">
          <div
            className="text-center bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 dark:bg-white/5 dark:border-white/10"
            style={{ boxShadow: "0 2px 16px rgba(15,23,42,0.06)" }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-gray-100 mb-3">
              Let&apos;s Build Something Together
            </h2>
            <p className="text-slate-600 dark:text-gray-400 max-w-xl mx-auto mb-6">
              Have a project in mind or just want to chat? Head over to the
              dedicated contact page to send a message, drop an email, or
              connect on social.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center space-x-2 px-6 py-3 text-white font-medium rounded-full transition-all hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #a78bfa)",
                boxShadow: "0 4px 14px rgba(59,130,246,0.35)",
              }}
            >
              <span>Visit Contact Page</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-200 dark:border-white/10">
          <p className="text-center text-sm text-slate-500 dark:text-gray-400">
            Built with Next.js & Tailwind CSS • © {new Date().getFullYear()} Dhruv Sarvaiya
          </p>
        </footer>
      </div>

      {/* Inline Styles & Keyframes (minimal, no @apply) */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes scroll-dot {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(12px); opacity: 0; }
        }
      `}}></style>
    </main>
  );
}
