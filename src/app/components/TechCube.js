// TechCube — a pure CSS 3D rotating cube that displays six core tech
// labels. No external packages, no per-frame React state. The cube spins
// via a CSS keyframe (`cube-spin`) defined in globals.css, and pauses
// when the user hovers the cube. Honors prefers-reduced-motion.

export default function TechCube() {
  // Six faces. Each label is a real tech I work with daily.
  const faces = [
    {
      key: "front",
      label: "React",
      transform: "translateZ(90px) rotateY(0deg)",
    },
    {
      key: "right",
      label: "Next.js",
      transform: "rotateY(90deg) translateZ(90px)",
    },
    {
      key: "back",
      label: "JavaScript",
      transform: "rotateY(180deg) translateZ(90px)",
    },
    {
      key: "left",
      label: "TypeScript",
      transform: "rotateY(-90deg) translateZ(90px)",
    },
    {
      key: "top",
      label: "Tailwind",
      transform: "rotateX(90deg) translateZ(90px)",
    },
    {
      key: "bottom",
      label: "Node.js",
      transform: "rotateX(-90deg) translateZ(90px)",
    },
  ];

  return (
    <>
      {/* Inline keyframes so the file is self-contained even if globals.css
          hasn't been updated yet. globals.css mirrors this exact rule. */}
      <style>{`
        @keyframes cube-spin {
          0% {
            transform: rotateX(0deg) rotateY(0deg);
          }
          100% {
            transform: rotateX(360deg) rotateY(360deg);
          }
        }
      `}</style>

      <div
        className="techcube-perspective"
        aria-label="Rotating tech cube showcasing six core technologies"
        role="img"
        style={{
          perspective: "1000px",
          width: "100%",
          height: "220px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Hover container — pausing the animation on hover gives the user
            a chance to read each face without losing the focus state. */}
        <div
          className="techcube-hover"
          style={{
            width: "180px",
            height: "180px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="techcube-spin"
            style={{
              position: "relative",
              width: "180px",
              height: "180px",
              transformStyle: "preserve-3d",
              animation: "cube-spin 20s linear infinite",
            }}
          >
            {faces.map((face) => (
              <div
                key={face.key}
                className="techcube-face"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "180px",
                  height: "180px",
                  background: "var(--glass-bg)",
                  border: "1px solid var(--glass-border)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  color: "var(--foreground)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                  fontFamily: "var(--font-display)",
                  letterSpacing: "-0.01em",
                  fontSize: "1.05rem",
                  borderRadius: "12px",
                  boxShadow: "0 6px 20px rgba(15, 31, 28, 0.12)",
                  transform: face.transform,
                }}
              >
                {face.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS that ties the hover container to the animation state and
          respects reduced-motion preference without any JS. */}
      <style>{`
        .techcube-hover:hover .techcube-spin {
          animation-play-state: paused;
        }
        .techcube-face {
          backface-visibility: visible;
        }
        @media (prefers-reduced-motion: reduce) {
          .techcube-spin {
            animation: none !important;
            transform: rotateX(-15deg) rotateY(25deg);
          }
        }
      `}</style>
    </>
  );
}
