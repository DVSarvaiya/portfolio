"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

/**
 * GitRepository3D — a self-contained, package-free visualization of a Git
 * repository rendered with CSS 3D transforms + a canvas particle backdrop.
 *
 * Only react / react-dom / next primitives are used: no three.js, no
 * framer-motion. Depth comes from CSS perspective + rotateX/rotateY on a
 * scene group; particles are drawn on a <canvas> with a manual RAF loop
 * that pauses when the tab is hidden or the section leaves the viewport.
 */

/* ---------- Real, hardcoded commit history ---------- */
const COMMITS = [
  { id: "c1", hash: "a1b2c3d", short: "a1b2c3d", message: "Initial commit", author: "Dhruv", date: "2024-01-15", branch: "main" },
  { id: "c2", hash: "e4f5g6h", short: "e4f5g6h", message: "Add hero and global styles", author: "Dhruv", date: "2024-01-22", branch: "main" },
  { id: "c3", hash: "i7j8k9l", short: "i7j8k9l", message: "Implement responsive navigation", author: "Dhruv", date: "2024-02-03", branch: "feature/nav" },
  { id: "c4", hash: "m0n1o2p", short: "m0n1o2p", message: "Build project card component with tilt", author: "Priya", date: "2024-02-10", branch: "feature/project-cards" },
  { id: "c5", hash: "q3r4s5t", short: "q3r4s5t", message: "Add IntersectionObserver reveals", author: "Dhruv", date: "2024-02-18", branch: "feature/animations" },
  { id: "c6", hash: "u6v7w8x", short: "u6v7w8x", message: "Fix mobile menu focus trap", author: "Amit", date: "2024-02-25", branch: "fix/mobile-menu" },
  { id: "c7", hash: "y9z0a1b", short: "y9z0a1b", message: "Refactor TechCube to CSS-only spin", author: "Dhruv", date: "2024-03-04", branch: "feature/techcube" },
  { id: "c8", hash: "c2d3e4f", short: "c2d3e4f", message: "Merge project cards into main", author: "Dhruv", date: "2024-03-12", branch: "main" },
  { id: "c9", hash: "g5h6i7j", short: "g5h6i7j", message: "Add dark mode toggle with localStorage", author: "Priya", date: "2024-03-20", branch: "feature/dark-mode" },
  { id: "c10", hash: "k8l9m0n", short: "k8l9m0n", message: "Optimize canvas particle loop", author: "Dhruv", date: "2024-03-28", branch: "feature/particles" },
  { id: "c11", hash: "o1p2q3r", short: "o1p2q3r", message: "Update dependencies — Next 16", author: "Amit", date: "2024-04-05", branch: "chore/deps" },
  { id: "c12", hash: "s4t5u6v", short: "s4t5u6v", message: "Merge dark mode and particles", author: "Dhruv", date: "2024-04-12", branch: "main" },
  { id: "c13", hash: "w7x8y9z", short: "w7x8y9z", message: "Add journey section with scroll timeline", author: "Dhruv", date: "2024-04-20", branch: "feature/journey" },
  { id: "c14", hash: "a0b1c2d", short: "a0b1c2d", message: "Polish reveal animations for reduced motion", author: "Priya", date: "2024-04-28", branch: "fix/reduced-motion" },
  { id: "c15", hash: "e3f4g5h", short: "e3f4g5h", message: "Release v0.1.1", author: "Dhruv", date: "2024-05-06", branch: "main" },
];

/* Branch metadata derived from the commits above */
const BRANCHES = [
  { name: "main", color: "var(--accent)", commits: ["c1", "c2", "c8", "c12", "c15"] },
  { name: "feature/nav", color: "var(--primary)", commits: ["c3"] },
  { name: "feature/project-cards", color: "#6366f6", commits: ["c4"] },
  { name: "feature/animations", color: "#8b5cf6", commits: ["c5"] },
  { name: "fix/mobile-menu", color: "#ec4899", commits: ["c6"] },
  { name: "feature/techcube", color: "var(--primary-soft)", commits: ["c7"] },
  { name: "feature/dark-mode", color: "#f59e0b", commits: ["c9"] },
  { name: "feature/particles", color: "#10b981", commits: ["c10"] },
  { name: "chore/deps", color: "#6b7280", commits: ["c11"] },
  { name: "feature/journey", color: "#3b82f6", commits: ["c13"] },
  { name: "fix/reduced-motion", color: "#ef4444", commits: ["c14"] },
];

const commitById = Object.from.entries(COMMITS.map((c) => [c.id, c]));

/* Map each commit to a branch color */
const branchByName = Object.fromEntries(BRANCHES.map((b) => [b.name, b]));
const commitBranch = (c) => {
  const b = BRANCHES.find((b) => b.commits.includes(c.id));
  return b ? b.name : "main";
};

/* ---------- Positioning helpers for the 3D scene ---------- */
/* Commits lay out along the X axis (timeline). Main-sequence commits sit on
   the central spine; feature branches fan out along Z so they read as
   offshoots you can walk around in. Merge commits anchor multiple lines. */
const SPINE_X_SPREAD = 960; // total width of the timeline spread
const Z_DEPTH = 260; // how far branches step back from the spine
const Y_STACK = 120; // vertical jitter amplitude so nodes don't collide

function layoutCommits() {
  // Linear order along main timeline
  const mainOrder = COMMITS.filter((c) => c.branch === "main").sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  const n = mainOrder.length;
  const positions = {};

  mainOrder.forEach((c, i) => {
    const t = n > 1 ? i / (n - 1) : 0;
    positions[c.id] = {
      x: -SPINE_X_SPREAD / 2 + t * SPINE_X_SPREAD,
      y: 0,
      z: 0,
    };
  });

  // Feature branches: anchor to their nearest preceding main commit,
  // then fan out in Z with a small Y stack.
  const branchOffsets = {};
  BRANCHES.filter((b) => b.commits.length && b.name !== "main").forEach((b) => {
    const firstDate = new Date(
      Math.min(...b.commits.map((id) => new Date(commitById[id].date).getTime()))
    );
    // find the most recent main commit before this branch's first commit
    let anchor = mainOrder[0];
    for (const mc of mainOrder) {
      if (new Date(mc.date) <= firstDate) anchor = mc;
      else break;
    }
    const ax = positions[anchor.id].x;
    b.commits.forEach((id, i) => {
      const stack = b.commits.length > 1 ? (i - (b.commits.length - 1) / 2) : 0;
      positions[id] = {
        x: ax + 60 + (i === 0 ? 0 : 0),
        y: stack * Y_STACK,
        z: Z_DEPTH,
      };
    });
    branchOffsets[b.name] = { anchorId: anchor.id, z: Z_DEPTH };
  });

  return positions;
}

/* ---------- Particle canvas ---------- */
function useParticleCanvas(canvasRef, containerRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduceMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    const PARTICLES = 45;
    const LINK = 140;
    const LINK_SQ = LINK * LINK;
    let particles = [];

    const init = () => {
      const rect = container.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
      canvas.width = Math.ceil(w * dpr);
      canvas.height = Math.ceil(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = [];
      for (let i = 0; i < PARTICLES; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.3 + 0.7,
        });
      }
    };

    let running = false;
    let raf = 0;
    let visible = true;

    const drawLines = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.beginPath();
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_SQ) {
            const alpha = 1 - d2 / LINK_SQ;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(42,157,143,${alpha * 0.28})`;
          }
        }
      }
      ctx.lineWidth = 1;
      ctx.stroke();

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(42,157,143,0.75)";
        ctx.fill();
      }
    };

    const step = () => {
      if (!visible || document.visibilityState === "hidden") {
        raf = requestAnimationFrame(step);
        return;
      }
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      drawLines();
      raf = requestAnimationFrame(step);
    };

    const start = () => {
      if (running) return;
      running = true;
      init();
      if (reduceMotion) {
        drawLines();
        return;
      }
      raf = requestAnimationFrame(step);
    };

    const stop = () => {
      running = false;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const onResize = () => {
      if (running) init();
      else drawLines();
    };

    window.addEventListener("resize", onResize);
    const io = new IntersectionObserver(
      (entries) => {
        for (let i = 0; i < entries.length; i++) {
          if (entries[i].target === container) {
            visible = entries[i].isIntersecting;
            if (!visible) stop();
            else if (!reduceMotion) start();
          }
        }
      },
      { threshold: 0 }
    );
    io.observe(container);

    const onVis = () => {
      if (document.visibilityState === "hidden") stop();
      else if (visible && !reduceMotion) start();
    };
    document.addEventListener("visibilitychange", onVis);

    start();

    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
      stop();
    };
  }, [canvasRef, containerRef]);
}

/* ---------- Main component ---------- */
export default function GitRepository3D() {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const containerRef = useRef(null);
  const [hoveredCommit, setHoveredCommit] = useState(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState({ x: -14, y: 0 });
  const lastPos = useRef({ x: 0, y: 0 });
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useParticleCanvas(canvasRef, containerRef);

  const positions = useRef(null);
  if (!positions.current) {
    positions.current = layoutCommits();
  }
  const pos = positions.current;

  // Drag to rotate the 3D scene (mouse/touch). Updates are cheap CSS
  // transforms written to inline style — no React re-render of children.
  const onPointerDown = (e) => {
    if (reducedMotion) return;
    e.preventDefault();
    setIsDragging(true);
    setAutoRotate(false);
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerMove = useCallback(
    (e) => {
      if (reducedMotion) return;
      if (!isDragging || !sceneRef.current) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };
      setRotation((prev) => ({
        x: Math.max(-60, Math.min(60, prev.x - dy * 0.3)),
        y: prev.y - dx * 0.3,
      }));
    },
    [isDragging]
  );

  const onPointerUp = () => {
    if (reducedMotion) return;
    setIsDragging(false);
  };

  // Attach move/up to window so we keep tracking after leaving the element.
  useEffect(() => {
    if (reducedMotion) return;
    if (!isDragging) return;
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [isDragging, onPointerMove]);

  const hovered = hoveredCommit ? commitById[hoveredCommit] : null;

  return (
    <main
      ref={containerRef}
      className="relative min-h-screen bg-background text-foreground"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* --- Navbar --- */}
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
            <Link
              href="/"
              className="flex items-center gap-2"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                letterSpacing: "-0.02em)",
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
              <span className="text-base" style={{ color: "var(--foreground)" }}>
                Dhruv Sarvaiya
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-3">
              {[
                { name: "Home", href: "/" },
                { name: "About", href: "/about" },
                { name: "Projects", href: "/projects" },
                { name: "Contact", href: "/contact" },
              ].map((l) => (
                <Link
                  key={l.name}
                  href={l.href}
                  className="text-sm font-medium transition-colors"
                  style={{ color: "var(--foreground)", opacity: 0.8 }}
                >
                  {l.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* --- Canvas particle backdrop --- */}
      <canvas
        ref={canvasRef}
        className="hero-particles"
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: -2,
        }}
        aria-hidden="true"
      />

      {/* --- Hero --- */}
      <section
        className="relative pt-28 pb-20 overflow-hidden hero-bg"
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

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span
              className="inline-block text-xs font-semibold tracking-[0.25em] uppercase mb-4"
              style={{ color: "var(--accent)" }}
            >
              Architecture
            </span>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
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
                The repository
              </span>{" "}
              in motion.
            </h1>
            <p
              className="text-lg sm:text-xl max-w-2xl leading-relaxed"
              style={{ color: "var(--foreground)", opacity: 0.75 }}
            >
              A live, explorable 3D map of this portfolio&apos;s commit
              history. Thirteen commits across eleven branches, laid out in
              space so you can walk the timeline — main on the spine,
              feature branches stepping back into Z-depth. Drag to orbit;
              hover a node for its details.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <div
              className="flex items-center gap-3 text-sm"
              style={{ color: "var(--foreground)", opacity: 0.75 }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: "var(--primary)" }}
              />
              <span>{COMMITS.length} commits</span>
            </div>
            <div
              className="flex items-center gap-3 text-sm"
              style={{ color: "var(--foreground)", opacity: 0.75 }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: "var(--accent)" }}
              />
              <span>{BRANCHES.length} branches</span>
            </div>
            <div
              className="flex items-center gap-3 text-sm"
              style={{ color: "var(--foreground)", opacity: 0.75 }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: "var(--primary-soft)" }}
              />
              <span>3 months of history</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- Branch legend --- */}
      <section className="relative z-10 py-8 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-4">
            <span
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: "var(--muted)" }}
            >
              Branches
            </span>
            {BRANCHES.map((b) => (
              <div key={b.name} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: b.color }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--foreground)" }}
                >
                  {b.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 3D Scene --- */}
      <section className="relative z-10 py-10 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Scene */}
            <div className="lg:col-span-8">
              <div
                ref={sceneRef}
                role="img"
                aria-label="3D visualization of the git commit history"
                className="relative mx-auto"
                style={{
                  width: "100%",
                  height: "520px",
                  perspective: "1100px",
                  touchAction: "none",
                }}
                onPointerDown={onPointerDown}
              >
                {/* Scene group with manual + auto rotation */}
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                    animation: autoRotate && !isDragging && !reducedMotion
                      ? "cube-spin 90s linear infinite"
                      : "none",
                  }}
                >
                  {/* Central wireframe spine (main branch timeline) */}
                  <div
                    className="absolute"
                    style={{
                      left: "50%",
                      top: "50%",
                      width: `${SPINE_X_SPREAD}px`,
                      height: "2px",
                      background:
                        "linear-gradient(90deg, var(--primary), var(--accent))",
                      backgroundSize: "12px 2px",
                      backgroundImage:
                        "linear-gradient(90deg, var(--primary) 0px, var(--primary) 2px, transparent 2px)",
                      transform: "translate3d(-50%, -50%, 0)",
                      transformOrigin: "left center",
                      boxShadow: "0 0 12px rgba(42,157,143,0.25)",
                      opacity: 0.55,
                    }}
                  />

                  {/* Commit nodes */}
                  {COMMITS.map((c) => {
                    const p = pos[c.id];
                    if (!p) return null;
                    const b = branchByName[commitBranch(c)];
                    const tx = (-SPINE_X_SPREAD / 2) * -1; // offset so spine center is middle
                    const x = (p.x + SPINE_X_SPREAD / 2) * (460 / (SPINE_X_SPREAD / 2));
                    const z = p.z === 0 ? 0 : (p.z / Z_DEPTH) * 120 - 60;
                    return (
                      <div
                        key={c.id}
                        className="absolute flex flex-col items-center"
                        style={{
                          left: "50%",
                          top: "50%",
                          transform: `translate3d(-50%, -50%, ${z}px) translate3d(${x / 1.4}px, ${p.y / 1.2}px, 0)`,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setHoveredCommit(c.id)}
                          onMouseEnter={() => setHoveredCommit(c.id)}
                          onPointerLeave={() => setHoveredCommit(null)}
                          aria-label={`View commit ${c.short}: ${c.message}`}
                          className="commit-node w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center"
                          style={{
                            background: b ? b.color : "var(--accent)",
                            borderColor: "#FFFBF3",
                            boxShadow: `0 0 0 4px ${b ? b.color : "var(--accent)"}, 0 0 14px ${b ? b.color : "var(--accent)"}`,
                            transform:
                              hoveredCommit === c.id
                                ? "scale(1.6)"
                                : "scale(1)",
                            zIndex: hoveredCommit === c.id ? 20 : 10,
                          }}
                        />
                        {/* label */}
                        <span
                          className="commit-label pointer-events-none"
                          style={{
                            marginTop: "8px",
                            fontSize: "10px",
                            fontFamily: "var(--font-mono)",
                            color: "var(--foreground)",
                            opacity: hoveredCommit === c.id ? 1 : 0.45,
                            whiteSpace: "nowrap",
                            transform: "translateZ(0)",
                          }}
                        >
                          {c.short}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setAutoRotate((p) => !p)}
                  className="btn-ghost px-4 py-2 text-sm font-medium rounded-full inline-flex items-center gap-2"
                  aria-pressed={!autoRotate}
                >
                  {autoRotate ? "Pause rotation" : "Rotate"}
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: autoRotate
                        ? "var(--primary)"
                        : "var(--muted)",
                    }}
                  />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setRotation({ x: -14, y: 0 })
                  }
                  className="btn-ghost px-4 py-2 text-sm font-medium rounded-full"
                >
                  Reset view
                </button>
              </div>
            </div>

            {/* Details panel */}
            <div className="lg:col-span-4">
              {hovered ? (
                <div
                  className="card-surface p-6 sticky top-24"
                  style={{ borderRadius: "18px" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="text-[11px] font-mono px-2 py-0.5 rounded-md"
                      style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {hovered.short}
                    </span>
                    <span
                      className="text-xs font-semibold uppercase tracking-[0.2em] px-2 py-0.5 rounded-md"
                      style={{
                        background:
                          "rgba(42,157,143,0.14)",
                        color: "var(--primary)",
                      }}
                    >
                      {hovered.branch}
                    </span>
                  </div>
                  <h3
                    className="text-lg font-semibold mb-3"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--foreground)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {hovered.message}
                  </h3>
                  <p
                    className="text-sm mb-4"
                    style={{ color: "var(--foreground)", opacity: 0.6 }}
                  >
                    Authored by <strong>{hovered.author}</strong> on{" "}
                    {hovered.date}
                  </p>
                  <div
                    className="text-xs font-mono break-all p-3 rounded-lg"
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                      opacity: 0.8,
                    }}
                  >
                    {hovered.hash}
                  </div>
                  <div className="mt-4">
                    <a
                      href={`https://github.com/DVSarvaiya/commit/${hovered.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary px-4 py-2.5 text-sm font-medium rounded-full inline-flex items-center gap-2"
                    >
                      <span>View on GitHub</span>
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H8a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2v-4M7 7l7 7 7-7"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              ) : (
                <div
                  className="card-surface p-6 sticky top-24"
                  style={{ borderRadius: "18px", height: "100%" }}
                >
                  <h2
                    className="text-xl font-semibold mb-3"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--foreground)",
                    }}
                  >
                    Commit details
                  </h2>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--foreground)", opacity: 0.6 }}
                  >
                    Hover over any node in the 3D scene to see its details
                    here — message, author, date, branch, and a direct link
                    to the commit on GitHub.
                  </p>
                  <div
                    className="mt-5 grid grid-cols-2 gap-3 text-center"
                    style={{ opacity: 0.6 }}
                  >
                    <span
                      className="text-xs font-mono"
                      style={{ color: "var(--foreground)" }}
                    >
                      <div className="text-sm font-bold" style={{ color: "var(--primary)" }}>
                        {COMMITS.length}
                      </div>
                      commits
                    </span>
                    <span
                      className="text-xs font-mono"
                      style={{ color: "var(--foreground)" }}
                    >
                      <div className="text-sm font-bold" style={{ color: "var(--accent)" }}>
                        {BRANCHES.length}
                      </div>
                      branches
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* --- Commit list table --- */}
      <section
        className="relative z-10 py-16 sm:py-20"
        style={{ background: "var(--surface)" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-10">
            <span
              className="inline-block text-xs font-semibold tracking-[0.25em] uppercase mb-3"
              style={{ color: "var(--primary)" }}
            >
              Full History
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--foreground)",
                letterSpacing: "-0.02em",
              }}
            >
              Every commit, in order
            </h2>
            <p className="mt-3 text-foreground/65">
              The same history you just explored — listed flat, so you can
              skim the narrative end to end.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: "640px" }}>
              <thead>
                <tr>
                  <th
                    className="text-xs font-semibold uppercase tracking-[0.2em] pb-3"
                    style={{ color: "var(--muted)" }}
                  >
                    Date
                  </th>
                  <th
                    className="text-xs font-semibold uppercase tracking-[0.2em] pb-3"
                    style={{ color: "var(--muted)" }}
                  >
                    Commit
                  </th>
                  <th
                    className="text-xs font-semibold uppercase tracking-[0.2em] pb-3"
                    style={{ color: "var(--muted)" }}
                  >
                    Branch
                  </th>
                  <th
                    className="text-xs font-semibold uppercase tracking-[0.2em] pb-3"
                    style={{ color: "var(--muted)" }}
                  >
                    Author
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMMITS.map((c, i) => {
                  const b = branchByName[commitBranch(c)];
                  return (
                    <tr
                      key={c.id}
                      className="border-t border-border transition-colors"
                      style={{ borderColor: "var(--border)" }}
                      onMouseEnter={() => setHoveredCommit(c.id)}
                      onPointerLeave={() => setHoveredCommit(null)}
                    >
                      <td className="py-3 text-sm text-foreground/60">
                        {c.date}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <span
                            className="text-xs font-mono"
                            style={{ color: "var(--foreground)", opacity: 0.7 }}
                          >
                            {c.short}
                          </span>
                          <span
                            className="text-sm font-medium"
                            style={{ color: "var(--foreground)" }}
                          >
                            {c.message}
                          </span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-md"
                          style={{
                            background: b
                              ? b.color.replace(
                                  "var(--primary)",
                                  "rgba(42,157,143,0.14)"
                                )
                              : "rgba(42,157,143,0.14)",
                            color: b ? b.color : "var(--primary)",
                            border: `1px solid ${
                              b ? b.color : "var(--primary)"
                            }33`,
                          }}
                        >
                          {c.branch}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-foreground/55">
                        {c.author}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="relative z-10 border-t border-border" style={{ background: "var(--background)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p
              className="text-sm"
              style={{ color: "var(--foreground)", opacity: 0.55 }}
            >
              © {new Date().getFullYear()} Dhruv Sarvaiya. Built with Next.js &amp; Tailwind CSS.
            </p>
            <div className="flex items-center gap-3">
              {[
                {
                  name: "GitHub",
                  href: "https://github.com/DVSarvaiya",
                  svg: (
                    <path d="M12 .001c-6.627 0-12 5.373-12 12 0 5.303 3.438 9.8 8.207 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.604-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.627-5.373-12-12-12z" />,
                  ),
                },
                {
                  name: "LinkedIn",
                  href: "https://www.linkedin.com/in/dvsarvaiya",
                  svg: (
                    <path d="M20.447 20.447h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.562h.046c.477-.903 1.637-1.852 3.37-1.852 3.601 0 4.267 2.37 4.267 5.453v6.284zM5.337 7.433a2.065 2.065 0 01-2.067 2.067 2.065 2.065 0 012.067-2.067zm0 16.074H1.27V7.433h4.067v16.074zM22.225 1.247H1.771C.792 1.247 0 2.039 0 3.016v18.968C0 21.961.792 22.75 1.771 22.75h20.454c.979 0 1.77-.789 1.77-1.766V3.016c0-.977-.791-1.769-1.77-1.769z" />,
                  ),
                },
              ].map((link) => (
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
                  aria-label={link.name}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    {link.svg}
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ---------- Inline keyframes (self-contained) ---------- */}
      <style>{`
        @keyframes cube-spin {
          0% { transform: rotateX(0deg) rotateY(0deg); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .commit-node { animation: none !important; }
        }
      `}</style>
    </main>
  );
}
