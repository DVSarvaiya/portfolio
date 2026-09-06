"use client";

import { useRef } from "react";

/**
 * ProjectCard — a single project card with a pointer-tracking radial
 * highlight and a subtle 3D tilt, both driven by CSS custom properties
 * written via a ref (no React state, no re-renders).
 *
 * Behaviour:
 *  - pointermove: writes --px / --py (0–100%) and --rx / --ry (±6deg) to
 *    the root element so CSS can position the spotlight and rotate the
 *    inner content. The four vars transition smoothly back to a flat
 *    state when the cursor leaves.
 *  - pointerleave: clears all four vars to "" so CSS returns to the
 *    default, non-tilted state.
 *  - Tilt + spotlight are disabled under prefers-reduced-motion and on
 *    coarse pointers (touch) — CSS handles both via media / pointer
 *    queries, so this component stays platform-agnostic.
 */
export default function ProjectCard({ title, tag, year, description, tech, link }) {
  const cardRef = useRef(null);

  const handlePointerMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    // Clamp to [0, 100] so out-of-bounds events never produce NaN.
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));
    // Rotation deltas: ±6deg max. Negative because moving down should tilt
    // the top of the card toward the viewer (rotateX positive), and moving
    // right should rotate the right edge away (rotateY positive).
    const rx = ((clampedY - 50) / 50) * -6;
    const ry = ((clampedX - 50) / 50) * 6;
    el.style.setProperty("--px", `${clampedX}%`);
    el.style.setProperty("--py", `${clampedY}%`);
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
  };

  const handlePointerLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--px", "");
    el.style.setProperty("--py", "");
    el.style.setProperty("--rx", "");
    el.style.setProperty("--ry", "");
  };

  return (
    <article
      ref={cardRef}
      className="reveal project-card"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* Decorative layers — sit behind the content and stay flat. */}
      <div className="project-card__border" aria-hidden="true" />
      <div className="project-card__spotlight" aria-hidden="true" />

      {/* Tilted content wrapper — preserves 3D and rotates with the vars. */}
      <div className="project-card__inner">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
          aria-label={`Open ${title} on GitHub`}
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
              <span className="m-4 text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full tag-primary">
                {tag}
              </span>
              <span
                className="m-4 text-xs font-mono"
                style={{ opacity: 0.7 }}
              >
                {year}
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
              {title}
            </h3>
            <p className="text-sm text-foreground/65 leading-relaxed mb-4">
              {description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {tech.map((t) => (
                <span
                  key={t}
                  className="text-[11px] font-medium px-2 py-0.5 rounded-md"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </a>
      </div>
    </article>
  );
}
