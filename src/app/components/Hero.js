"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const stats = [
  { value: "4+", label: "Years building on the web" },
  { value: "20+", label: "Shipped client projects" },
  { value: "12", label: "Open-source repositories" },
  { value: "∞", label: "Cups of chai per release" },
];

const typingStrings = [
  "Frontend Engineer",
  "Interface Builder",
  "Indie Hacker",
  "Lifelong Student",
];

export default function Hero() {
  const [profileImgError, setProfileImgError] = useState(false);

  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const isVisibleRef = useRef(true);
  const rafIdRef = useRef(0);

  // Typing effect
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
  }, [typing]);

  // Single kept canvas animation: 35 particles, batched line strokes,
  // pauses when offscreen / tab hidden / reduced-motion preferred.
  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) return;

    const reduceMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let particles = [];
    let width = 0;
    let height = 0;
    let dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));

    const PARTICLE_COUNT = 35;
    const LINK_DISTANCE = 130;
    const LINK_DISTANCE_SQ = LINK_DISTANCE * LINK_DISTANCE;
    const MAX_SPEED = 0.35;

    const resize = () => {
      const rect = hero.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const next = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        next.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * MAX_SPEED,
          vy: (Math.random() - 0.5) * MAX_SPEED,
          r: Math.random() * 1.4 + 0.8,
        });
      }
      particles = next;
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(42, 157, 143, 0.5)";
        ctx.fill();
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }

      ctx.beginPath();
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DISTANCE_SQ) {
            const alpha = 1 - d2 / LINK_DISTANCE_SQ;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(42, 157, 143, ${alpha * 0.35})`;
          }
        }
      }
      ctx.lineWidth = 1;
      ctx.stroke();

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(42, 157, 143, 0.85)";
        ctx.fill();
      }

      rafIdRef.current = requestAnimationFrame(draw);
    };

    resize();

    if (reduceMotion) {
      drawStatic();
      const onResize = () => {
        resize();
        drawStatic();
      };
      window.addEventListener("resize", onResize);
      return () => {
        window.removeEventListener("resize", onResize);
      };
    }

    rafIdRef.current = requestAnimationFrame(draw);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    const io = new IntersectionObserver(
      (entries) => {
        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i];
          if (entry.target === hero) {
            isVisibleRef.current = entry.isIntersecting;
            if (!entry.isIntersecting) {
              if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = 0;
              }
            } else if (!rafIdRef.current) {
              rafIdRef.current = requestAnimationFrame(draw);
            }
          }
        }
      },
      { threshold: 0 }
    );
    io.observe(hero);

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = 0;
        }
      } else if (isVisibleRef.current && !rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = 0;
      }
    };
  }, []);

  // Passive mouse glow: writes CSS vars on the hero container.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const reduceMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const onMove = (e) => {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      hero.style.setProperty("--mx", `${x}px`);
      hero.style.setProperty("--my", `${y}px`);
    };
    hero.addEventListener("mousemove", onMove, { passive: true });
    return () => hero.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      id="about"
      ref={heroRef}
      className="relative min-h-screen pt-24 pb-12 overflow-hidden hero-bg"
      style={{
        "--mx": "50%",
        "--my": "50%",
      }}
    >
      <div className="hero-mouse-glow" aria-hidden="true" />

      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />
      <div className="orb orb-3" aria-hidden="true" />

      <div className="bg-grid" aria-hidden="true" />

      <canvas
        ref={canvasRef}
        className="hero-particles"
        aria-hidden="true"
      />

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

        <span
          className="inline-block text-xs font-semibold tracking-[0.25em] uppercase mb-5"
          style={{ color: "var(--accent)" }}
        >
          Portfolio · Est. 2024
        </span>

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

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/contact"
            className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 font-medium rounded-full"
          >
            <span>Start a Project</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  );
}
