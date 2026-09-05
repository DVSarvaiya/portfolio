"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  // Dark mode state
  const [isDark, setIsDark] = useState(true);

  // Dark mode effect
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark((prev) => !prev);
  };

  // Existing state
  const [showProjects, setShowProjects] = useState(false);
  const [activeTab, setActiveTab] = useState("projects");
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    message: false,
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileImgError, setProfileImgError] = useState(false);
  const [heroParticles, setHeroParticles] = useState([]);
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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
    if (touched[name]) {
      validateField(name);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setSubmitStatus("success");
      console.log("Form submitted:", formData);
      setForm({ name: "", email: "", message: "" });
      setTouched({ name: false, email: false, message: false });
      setTimeout(() => setSubmitStatus(null), 3000);
    } else {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus(null), 3000);
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "Advanced": return "bg-emerald-500 dark:bg-emerald-400";
      case "Intermediate": return "bg-amber-500 dark:bg-amber-400";
      case "Beginner": return "bg-blue-500 dark:bg-blue-400";
      default: return "bg-gray-500 dark:bg-gray-400";
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

  // Canvas particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let particles = [];
    const particleCount = 80;
    const colors = ["#3b82f6", "#a78bfa", "#60a5fa", "#c4b5fd"];

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - distance / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    animateParticles();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // Generate CSS-based hero particles on mount
  useEffect(() => {
    const particlesArray = [];
    const sizes = [8, 10, 12, 14, 16, 20, 24];
    for (let i = 0; i < 30; i++) {
      particlesArray.push({
        id: i,
        size: sizes[Math.floor(Math.random() * sizes.length)],
        top: `${Math.random() * 90 + 5}%`,
        left: `${Math.random() * 90 + 5}%`,
        opacity: Math.random() * 0.25 + 0.05,
        animationDelay: `${Math.random() * 4}s`,
        animationDuration: `${Math.random() * 6 + 5}s`,
      });
    }
    setHeroParticles(particlesArray);
  }, []);

  // Track mouse position for interactive glow
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: e.clientX,
        y: e.clientY,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // nav links config
  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Skills", href: "#skills" },
    { name: "Contact", href: "#contact" },
  ];

  const socialLinks = [
    { name: "LinkedIn", href: "https://www.linkedin.com/in/dvsarvaiya", icon: (size = "w-4 h-4") => (
      <path d="M20.447 20.447h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.562h.046c.477-.903 1.637-1.852 3.37-1.852 3.601 0 4.267 2.37 4.267 5.453v6.284zM5.337 7.433a2.065 2.065 0 01-2.067 2.067 2.065 2.065 0 012.067-2.067zm0 16.074H1.27V7.433h4.067v16.074zM22.225 1.247H1.771C.792 1.247 0 2.039 0 3.016v18.968C0 21.961.792 22.75 1.771 22.75h20.454c.979 0 1.77-.789 1.77-1.766V3.016c0-.977-.791-1.769-1.77-1.769z" />
    ) },
    { name: "GitHub", href: "https://github.com/DVSarvaiya", icon: (size = "W-4 h-4") => (
      <path d="M12 .001c-6.627 0-12 5.373-12 12 0 5.303 3.438 9.8 8.207 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.604-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.627-5.373-12-12-12z" />
    ) },
  ];

  const renderSocialIcon = (link) => (
    <a
      key={link.name}
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/50 transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 group"
      aria-label={link.name}
    >
      <svg className="w-4 h-4 text-foreground/80 group-hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24">
        {link.icon()}
      </svg>
    </a>
  );

  return (
    <main className="relative min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      {/* Sticky Glass Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/30 dark:border-gray-800/30 backdrop-blur-sm transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a
              href="#about"
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
            >
              Dhruv Sarvaiya
            </a>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="relative text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-foreground transition-colors group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>

            {/* Social Icons & Dark Mode Toggle (Desktop) */}
            <div className="hidden md:flex items-center space-x-4">
              {socialLinks.map(renderSocialIcon)}
              {/* Dark Mode Toggle Button */}
              <button
                onClick={toggleDarkMode}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/50 transition-all duration-300 hover:scale-110 hover:-translate-y-0.5"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <svg className="w-4 h-4 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-primary/20 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <span
                className={`block w-5 h-0.5 bg-gray-800 dark:bg-gray-200 transition-all duration-300 ${
                  mobileMenuOpen ? "rotate-45 translate-y-1" : ""
                }`}
              ></span>
              <span
                className={`block w-5 h-0.5 bg-gray-800 dark:bg-gray-200 transition-all duration-300 ${
                  mobileMenuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`block w-5 h-0.5 bg-gray-800 dark:bg-gray-200 transition-all duration-300 ${
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
          <div className="px-4 pb-4 space-y-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200/10 dark:border-gray-800/10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={closeMobileMenu}
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-foreground transition-colors py-2"
              >
                {link.name}
              </a>
            ))}
            <div className="flex items-center space-x-4 pt-2">
              {socialLinks.map(renderSocialIcon)}
              {/* Dark Mode Toggle Button */}
              <button
                onClick={toggleDarkMode}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/50 transition-all duration-300"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <svg className="w-4 h-4 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="about"
        className="relative h-screen bg-gradient-to-br from-gray-50 to-slate-100 dark:from-[#050505] dark:to-slate-900 overflow-hidden transition-colors duration-300"
      >
        {/* Canvas Background */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(15,15,20,1) 0%, rgba(5,5,5,1) 100%)",
          }}
        />

        {/* CSS-based Particle Background */}
        {heroParticles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-white dark:bg-white animate-pulse"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              top: p.top,
              left: p.left,
              opacity: p.opacity,
              animationDelay: p.animationDelay,
              animationDuration: p.animationDuration,
              backgroundColor: p.color,
            }}
          />
        ))}

        {/* Interactive glow following mouse */}
        <div
          className="absolute z-0 pointer-events-none"
          style={{
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
            transform: `translate(${mousePos.x - 200}px, ${mousePos.y - 200}px)`,
            transition: "transform 0.1s ease-out",
            filter: "blur(40px)",
          }}
        />

        {/* Floating Glowing Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/20 blur-3xl opacity-30 animate-float" style={{ animationDelay: "0s", animationDuration: "8s" }} />
        <div className="absolute bottom-32 right-20 w-96 h-96 rounded-full bg-accent/20 blur-3xl opacity-20 animate-float" style={{ animationDelay: "2s", animationDuration: "10s" }} />

        {/* Floating SVG glowing circles */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: "visible" }}>
          <circle
            className="animate-pulse-slow"
            cx="20%"
            cy="30%"
            r="60"
            fill="none"
            stroke="rgba(59,130,246,0.3)"
            strokeWidth="1.5"
            style={{ animationDelay: "0s", animationDuration: "12s" }}
          />
          <circle
            className="animate-pulse-slow"
            cx="80%"
            cy="70%"
            r="40"
            fill="none"
            stroke="rgba(167,139,250,0.25)"
            strokeWidth="1.5"
            style={{ animationDelay: "3s", animationDuration: "10s" }}
          />
          <circle
            className="animate-pulse-slow"
            cx="50%"
            cy="50%"
            r="120"
            fill="none"
            stroke="rgba(59,130,246,0.15)"
            strokeWidth="1"
            style={{ animationDelay: "1s" }}
          />
        </svg>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
          {/* Profile Image with Glowing Ring */}
          <div className="relative flex items-center justify-center py-20">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 blur-xl opacity-50 animate-pulse-slow"></div>
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-primary via-accent to-primary opacity-20 blur-2xl animate-spin-slow"></div>
              {profileImgError ? (
                <span className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-2 border-gradient-to-r from-primary to-accent shadow-xl flex items-center justify-center bg-gradient-to-br from-primary/30 to-accent/30 text-5xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  DS
                </span>
              ) : (
                <img
                  src="/profile.jpg"
                  alt="Dhruv"
                  onError={() => setProfileImgError(true)}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-2 border-transparent shadow-xl"
                />
              )}
            </div>

            {/* Floating Availability Badge */}
            <div className="absolute -bottom-3 -right-3 bg-white/60 dark:bg-black/60 backdrop-blur-md border border-gray-200/10 dark:border-white/10 rounded-full px-3 py-1.5 flex items-center space-x-1.5 animate-bounce-slow">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-medium text-gray-800 dark:text-gray-200">Available</span>
            </div>
          </div>

          {/* Animated Typing Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4 tracking-tight transition-colors duration-300">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-size-200 animate-gradient-shift">
              {typing.str}
            </span>
            <span className="inline-block w-0.5 h-[1.2em] bg-gradient-to-b from-primary to-accent ml-1 animate-blink"></span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed transition-colors duration-300">
            Crafting elegant digital experiences with modern technologies and
            pixel-perfect design.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a
              href="#contact"
              className="group relative px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="relative z-10 flex items-center space-x-2">
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
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
            <a
              href="#projects"
              className="group relative px-8 py-4 glassmorphism border border-gray-200/10 dark:border-white/10 text-gray-800 dark:text-gray-200 font-medium rounded-full overflow-hidden transition-all duration-300 hover:border-primary/50 hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="relative z-10 flex items-center space-x-2">
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
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
          </div>

          {/* Smooth Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex flex-col items-center space-y-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Scroll Down</span>
              <div className="w-6 h-10 rounded-full border-2 border-gray-300/20 dark:border-white/20 flex justify-center p-1">
                <div className="w-1.5 h-3 bg-gradient-to-b from-primary to-accent rounded-full animate-scroll-dot" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections Wrapper */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Tab Navigation */}
        <nav className="mb-10 animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="flex gap-2 bg-gray-100/80 dark:bg-black/40 backdrop-blur-md border border-gray-200/10 dark:border-white/10 p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab("projects")}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "projects"
                  ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200/50 dark:hover:bg-white/5"
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab("skills")}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "skills"
                  ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200/50 dark:hover:bg-white/5"
              }`}
            >
              Skills
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "contact"
                  ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200/50 dark:hover:bg-white/5"
              }`}
            >
              Contact
            </button>
          </div>
        </nav>

        {/* Projects Section */}
        <section id="projects" className="animate-slide-up" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Featured Projects</h2>
            <button
              onClick={() => setShowProjects((prev) => !prev)}
              className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg text-sm font-medium interactive transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:-translate-y-0.5"
            >
              {showProjects ? "Hide Projects" : "Show All Projects"}
            </button>
          </div>

          {showProjects ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="group glassmorphism border border-gray-200/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-card hover:shadow-glass transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-primary/50 text-2xl font-medium">{project.title}</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{project.description}</p>
                    <div className="mt-4 pt-4 border-t border-gray-200/10 dark:border-white/10 flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">View Details</span>
                      <svg
                        className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors transform group-hover:translate-x-1"
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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 3).map((project) => (
                <article
                  key={project.id}
                  className="group glassmorphism border border-gray-200/10 dark:border-white/10 rounded-2xl overflow-hidden shadow-card hover:shadow-glass transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-primary/50 text-2xl font-medium">{project.title}</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{project.description}</p>
                    <div className="mt-4 pt-4 border-t border-gray-200/10 dark:border-white/10 flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">View Details</span>
                      <svg
                        className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors transform group-hover:translate-x-1"
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

        {/* Skills Section */}
        <section id="skills" className="mt-16 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Technical Skills</h2>
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
                  className="glassmorphism border border-gray-200/10 dark:border-white/10 rounded-2xl p-6 hover:shadow-glass transition-all duration-300"
                >
                  <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
                    {categoryLabels[category]}
                  </h3>
                  <div className="space-y-4">
                    {categorySkills.map((skill) => (
                      <div key={skill.id}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{skill.name}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{skill.level}</span>
                        </div>
                        <div className="h-2 bg-gray-200/50 dark:bg-white/5 rounded-full overflow-hidden">
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

        {/* Contact Section */}
        <section id="contact" className="mt-16 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Get In Touch</h2>
          <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto glassmorphism border border-gray-200/10 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-card"
          >
            {submitStatus === "success" && (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-200 dark:text-emerald-300 animate-fade-in">
                <p className="font-medium">Message sent successfully!</p>
                <p className="text-sm mt-1">I'll get back to you as soon as possible.</p>
              </div>
            )}
            {submitStatus === "error" && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-200 dark:text-red-300 animate-fade-in">
                <p className="font-medium">Please fix the errors below.</p>
              </div>
            )}
            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 rounded-xl border transition-colors bg-white/40 dark:bg-black/40 backdrop-blur-sm ${
                    errors.name
                      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-200/10 dark:border-white/10 focus:border-primary focus:ring-primary"
                  } text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 placeholder-gray-500 dark:placeholder-gray-400`}
                  placeholder="Your name"
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="mt-1.5 text-sm text-red-400 dark:text-red-300 animate-fade-in">
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 rounded-xl border transition-colors bg-white/40 dark:bg-black/40 backdrop-blur-sm ${
                    errors.email
                      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-200/10 dark:border-white/10 focus:border-primary focus:ring-primary"
                  } text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 placeholder-gray-500 dark:placeholder-gray-400`}
                  placeholder="your@email.com"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="mt-1.5 text-sm text-red-400 dark:text-red-300 animate-fade-in">
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={5}
                  className={`w-full px-4 py-3 rounded-xl border transition-colors bg-white/40 dark:bg-black/40 backdrop-blur-sm resize-y min-h-[120px] ${
                    errors.message
                      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-200/10 dark:border-white/10 focus:border-primary focus:ring-primary"
                  } text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 placeholder-gray-500 dark:placeholder-gray-400`}
                  placeholder="Your message..."
                  aria-invalid={errors.message ? "true" : "false"}
                  aria-describedby={errors.message ? "message-error" : undefined}
                />
                {errors.message && (
                  <p id="message-error" className="mt-1.5 text-sm text-red-400 dark:text-red-300 animate-fade-in">
                    {errors.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3.5 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-xl interactive transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white/50 dark:ring-offset-black/50 disabled:opacity-50"
              >
                Send Message
              </button>
            </div>
          </form>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200/10 dark:border-white/10 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Built with Next.js &amp; Tailwind CSS • © {new Date().getFullYear()} Dhruv Sarvaiya
          </p>
        </footer>
      </div>

      {/* Inline Styles & Keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes scroll-dot {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(12px); opacity: 0; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-blink { animation: blink 1s step-start infinite; }
        .animate-scroll-dot { animation: scroll-dot 2s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.6s ease-out forwards; }
        .animate-gradient-shift { animation: gradient-shift 6s ease infinite; }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }

        .bg-size-200 { background-size: 200% 200%; }

        /* Custom gradient border for profile ring */
        .border-gradient-to-r {
          border-image: linear-gradient(to right, #3b82f6, #a78bfa, #60a5fa, #c4b5fd, #3b82f6);
          border-image-slice: 1;
        }
      `}}></style>
    </main>
  );
}
