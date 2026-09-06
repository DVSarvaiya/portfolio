"use client";

import Link from "next/link";

const contactChannels = [
  {
    id: "email",
    label: "Email",
    value: "dhruv@dvsarvaiya.dev",
    href: "mailto:dhruv@dvsarvaiya.dev",
    description:
      "The fastest way to reach me. I reply within a day during weekdays.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    id: "github",
    label: "GitHub",
    value: "github.com/DVSarvaiya",
    href: "https://github.com/DVSarvaiya",
    description:
      "Browse my open-source work, side projects and forks worth keeping.",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 .001c-6.627 0-12 5.373-12 12 0 5.303 3.438 9.8 8.207 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.604-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/dvsarvaiya",
    href: "https://www.linkedin.com/in/dvsarvaiya",
    description:
      "Connect with me professionally — endorsements, recommendations and roles welcome.",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.447h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.562h.046c.477-.903 1.637-1.852 3.37-1.852 3.601 0 4.267 2.37 4.267 5.453v6.284zM5.337 7.433a2.065 2.065 0 01-2.067 2.067 2.065 2.065 0 012.067-2.067zm0 16.074H1.27V7.433h4.067v16.074zM22.225 1.247H1.771C.792 1.247 0 2.039 0 3.016v18.968C0 21.961.792 22.75 1.771 22.75h20.454c.979 0 1.77-.789 1.77-1.766V3.016c0-.977-.791-1.769-1.77-1.769z" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Decorative gradient blobs */}
      <div
        className="absolute top-24 left-10 w-72 h-72 rounded-full blur-3xl opacity-50 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(224,120,86,0.22) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 right-10 w-96 h-96 rounded-full blur-3xl opacity-40 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(42,157,143,0.22) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium mb-10 transition-colors"
          style={{ color: "var(--foreground)/0.7" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--foreground)";
            e.currentTarget.style.opacity = "0.7";
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Home</span>
        </Link>

        {/* Heading */}
        <div className="text-center mb-14">
          <span
            className="inline-block text-xs font-semibold tracking-[0.25em] uppercase mb-4"
            style={{ color: "var(--accent)" }}
          >
            Get In Touch
          </span>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5"
            style={{
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.025em",
              color: "var(--foreground)",
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
              Say hello.
            </span>
          </h1>
          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "var(--foreground)/0.7", opacity: 0.85 }}
          >
            I&apos;m always open to discussing new projects, creative ideas, or
            opportunities to be part of something thoughtful. Pick the channel
            that suits you and I&apos;ll get back to you as soon as I can.
          </p>
        </div>

        {/* Channels */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contactChannels.map((channel) => (
            <li key={channel.id}>
              <a
                href={channel.href}
                target={channel.id === "email" ? undefined : "_blank"}
                rel={channel.id === "email" ? undefined : "noopener noreferrer"}
                className="group card-surface flex flex-col h-full p-6"
                aria-label={`${channel.label}: ${channel.value}`}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors"
                  style={{
                    background: "rgba(42,157,143,0.12)",
                    color: "var(--primary)",
                    border: "1px solid rgba(42,157,143,0.25)",
                  }}
                >
                  {channel.icon}
                </div>
                <h2
                  className="text-xs font-semibold uppercase tracking-[0.2em] mb-1"
                  style={{ color: "var(--foreground)/0.55", opacity: 0.85 }}
                >
                  {channel.label}
                </h2>
                <p
                  className="text-lg font-semibold mb-3 break-all transition-colors"
                  style={{
                    color: "var(--foreground)",
                    fontFamily: "var(--font-display)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {channel.value}
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--foreground)/0.65", opacity: 0.85 }}
                >
                  {channel.description}
                </p>
                <div
                  className="mt-5 pt-4 flex items-center justify-between"
                  style={{ borderTop: "1px solid var(--border)" }}
                >
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "var(--primary)" }}
                  >
                    {channel.id === "email" ? "Send Email" : "Visit Profile"}
                  </span>
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    style={{ color: "var(--primary)" }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            </li>
          ))}
        </ul>

        {/* Response time block */}
        <div
          className="mt-12 text-center rounded-2xl p-8"
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            boxShadow: "0 2px 14px rgba(15, 31, 28, 0.06)",
          }}
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "var(--primary)" }}
            />
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase"
              style={{ color: "var(--primary)" }}
            >
              Response Time
            </span>
          </div>
          <h2
            className="text-2xl font-bold mb-2"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--foreground)",
              letterSpacing: "-0.02em",
            }}
          >
            Within 24&ndash;48 hours
          </h2>
          <p
            className="text-sm max-w-xl mx-auto"
            style={{ color: "var(--foreground)/0.65", opacity: 0.9 }}
          >
            I typically reply within a day or two on weekdays. For anything
            urgent, email is the fastest route. I read every message.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border">
        <p
          className="text-center text-sm py-6"
          style={{ color: "var(--foreground)/0.55" }}
        >
          Built with Next.js &amp; Tailwind CSS • © {new Date().getFullYear()} Dhruv Sarvaiya
        </p>
      </footer>
    </main>
  );
}
