"use client";

import { useState, useEffect, useRef } from "react";

const milestones = [
  {
    year: "2022",
    title: "Started Development",
    body: "First steps with HTML, CSS and JavaScript; built small static sites.",
  },
  {
    year: "2023",
    title: "Went Full-Stack",
    body: "Picked up React and Node.js; shipped a first full CRUD application.",
  },
  {
    year: "2024",
    title: "Production Work",
    body: "Built and deployed real projects with databases, auth and CI/CD.",
  },
  {
    year: "2025",
    title: "Automation & AI",
    body: "Began automating workflows and building AI-assisted tooling.",
  },
];

export default function Journey() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const cardRefs = useRef([]);
  const sectionRef = useRef(null);

  // Detect reduced motion once on mount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handle = () => setReducedMotion(mq.matches);
    handle();
    if (mq.addEventListener) {
      mq.addEventListener("change", handle);
      return () => mq.removeEventListener("change", handle);
    }
    mq.addListener(handle);
    return () => mq.removeListener(handle);
  }, []);

  // Track which milestone is currently in view using IntersectionObserver.
  useEffect(() => {
    if (!sectionRef.current) return;

    // For reduced motion, just show all cards without pinning/scroll-driven state.
    if (reducedMotion) return;

    const ratios = new Array(milestones.length).fill(0);

    const observer = new IntersectionObserver(
      (entries) => {
        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i];
          const idxAttr = entry.target.getAttribute("data-index");
          if (idxAttr === null) continue;
          const idx = Number(idxAttr);
          ratios[idx] = entry.intersectionRatio;
        }
        // Pick the card with the highest visible ratio; fall back to last-seen.
        let best = 0;
        let bestVal = -1;
        for (let i = 0; i < ratios.length; i++) {
          if (ratios[i] > bestVal) {
            bestVal = ratios[i];
            best = i;
          }
        }
        if (bestVal > 0) {
          setActiveIndex((prev) => (prev === best ? prev : best));
        }
      },
      {
        // Account for the sticky column — pick the middle of the viewport.
        rootMargin: "-35% 0px -35% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    const refs = cardRefs.current;
    for (let i = 0; i < refs.length; i++) {
      if (refs[i]) observer.observe(refs[i]);
    }

    return () => observer.disconnect();
  }, [reducedMotion]);

  // For reduced motion, default the active label to the most recent milestone.
  const displayIndex = reducedMotion ? milestones.length - 1 : activeIndex;
  const activeMilestone = milestones[displayIndex] || milestones[0];

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="relative"
      style={{ background: "var(--background)" }}
    >
      {/* 300vh runway: the inner "stage" sticks while the user scrolls through. */}
      <div className="relative" style={{ minHeight: "300vh" }}>
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 w-full">
            {/* Section heading */}
            <div className="mb-8 sm:mb-10 max-w-2xl">
              <span
                className="inline-block text-xs font-semibold tracking-[0.25em] uppercase mb-3"
                style={{ color: "var(--primary)" }}
              >
                Journey
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--foreground)",
                  letterSpacing: "-0.02em",
                }}
              >
                A slow, deliberate path
              </h2>
              <p className="mt-3 text-foreground/65">
                Four years, four different hats. Here&apos;s how the practice
                has unfolded.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
              {/* Sticky-ish year + title */}
              <div className="md:col-span-5">
                <div
                  className="text-7xl sm:text-8xl font-bold leading-none"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--primary)",
                    letterSpacing: "-0.03em",
                  }}
                  aria-live={reducedMotion ? "off" : "polite"}
                >
                  {activeMilestone.year}
                </div>
                <div
                  className="mt-4 text-2xl sm:text-3xl font-semibold transition-opacity duration-300"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--foreground)",
                    letterSpacing: "-0.01em",
                    opacity: reducedMotion ? 1 : 0.9,
                  }}
                  aria-live={reducedMotion ? "off" : "polite"}
                >
                  {activeMilestone.title}
                </div>
                <div
                  className="mt-3 h-1.5 rounded-full overflow-hidden"
                  style={{ background: "var(--surface)", width: "180px" }}
                  aria-hidden="true"
                >
                  <div
                    className="journey-progress"
                    style={{
                      display: "block",
                      height: "100%",
                      width: "100%",
                      background:
                        "linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%)",
                      transformOrigin: "left center",
                    }}
                  />
                </div>
              </div>

              {/* Cards column — these scroll past while the left column is sticky */}
              <div className="md:col-span-7 space-y-6">
                {milestones.map((m, i) => {
                  const isActive = i === displayIndex;
                  return (
                    <article
                      key={m.year}
                      ref={(el) => {
                        cardRefs.current[i] = el;
                      }}
                      data-index={i}
                      className="card-surface p-6 sm:p-7 transition-all duration-300"
                      style={{
                        opacity: reducedMotion ? 1 : isActive ? 1 : 0.55,
                        transform: reducedMotion
                          ? "none"
                          : isActive
                          ? "translateY(0) scale(1)"
                          : "translateY(0) scale(0.985)",
                        borderColor: reducedMotion
                          ? "var(--border)"
                          : isActive
                          ? "var(--primary-soft)"
                          : "var(--border)",
                        boxShadow: reducedMotion
                          ? "0 2px 12px rgba(15, 31, 28, 0.08)"
                          : isActive
                          ? "0 14px 32px rgba(15, 31, 28, 0.14)"
                          : "0 2px 12px rgba(15, 31, 28, 0.06)",
                      }}
                      aria-current={isActive ? "step" : undefined}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className="text-xs font-semibold tracking-[0.2em] uppercase"
                          style={{ color: "var(--accent)" }}
                        >
                          {m.year}
                        </span>
                        <span
                          className="text-[11px] font-mono px-2 py-0.5 rounded-md"
                          style={{
                            background: "var(--surface)",
                            border: "1px solid var(--border)",
                            color: "var(--foreground)",
                          }}
                        >
                          Step {i + 1} / {milestones.length}
                        </span>
                      </div>
                      <h3
                        className="text-lg sm:text-xl font-semibold mb-2"
                        style={{
                          fontFamily: "var(--font-display)",
                          color: "var(--foreground)",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {m.title}
                      </h3>
                      <p className="text-sm sm:text-[15px] leading-relaxed text-foreground/70">
                        {m.body}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
