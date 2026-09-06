"use client";

import Link from "next/link";

const contactChannels = [
  {
    id: "email",
    label: "Email",
    value: "hello@example.com",
    href: "mailto:hello@example.com",
    description: "Drop me a line for project inquiries or just to say hi.",
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
    value: "github.com/example",
    href: "https://github.com/example",
    description: "Browse my open-source contributions and personal experiments.",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 .001c-6.627 0-12 5.373-12 12 0 5.303 3.438 9.8 8.207 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.604-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/example",
    href: "https://linkedin.com/in/example",
    description: "Connect with me professionally or check out my work history.",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.447h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.562h.046c.477-.903 1.637-1.852 3.37-1.852 3.601 0 4.267 2.37 4.267 5.453v6.284zM5.337 7.433a2.065 2.065 0 01-2.067 2.067 2.065 2.065 0 012.067-2.067zm0 16.074H1.27V7.433h4.067v16.074zM22.225 1.247H1.771C.792 1.247 0 2.039 0 3.016v18.968C0 21.961.792 22.75 1.771 22.75h20.454c.979 0 1.77-.789 1.77-1.766V3.016c0-.977-.791-1.769-1.77-1.769z" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  return (
    <main className="relative min-h-screen bg-slate-50 text-slate-800 transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100">
      {/* Soft decorative gradient blobs */}
      <div
        className="absolute top-24 left-10 w-72 h-72 rounded-full blur-3xl opacity-40 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 right-10 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(167,139,250,0.25) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors mb-10 dark:text-gray-400 dark:hover:text-primary"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Home</span>
        </Link>

        {/* Heading */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-blue-600 mb-4 dark:text-primary">
            Get In Touch
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-gray-100 mb-4 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-violet-500 to-blue-600 dark:from-primary dark:via-accent dark:to-primary">
              Contact
            </span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            I&apos;m always open to discussing new projects, creative ideas, or
            opportunities to be part of something great. Reach out through any
            of the channels below and I&apos;ll get back to you as soon as
            possible.
          </p>
        </div>

        {/* Contact Channels */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contactChannels.map((channel) => (
            <li key={channel.id}>
              <a
                href={channel.href}
                target={channel.id === "email" ? undefined : "_blank"}
                rel={channel.id === "email" ? undefined : "noopener noreferrer"}
                className="group flex flex-col h-full bg-white border border-slate-200 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 dark:bg-white/5 dark:border-white/10"
                style={{ boxShadow: "0 2px 12px rgba(15,23,42,0.06)" }}
                aria-label={`${channel.label}: ${channel.value}`}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-blue-600 dark:text-primary"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(167,139,250,0.12) 100%)",
                  }}
                >
                  {channel.icon}
                </div>
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1 dark:text-gray-400">
                  {channel.label}
                </h2>
                <p className="text-lg font-semibold text-slate-900 dark:text-gray-100 mb-3 break-all group-hover:text-blue-600 transition-colors dark:group-hover:text-primary">
                  {channel.value}
                </p>
                <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">
                  {channel.description}
                </p>
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between dark:border-white/10">
                  <span className="text-xs font-medium text-blue-600 dark:text-primary">
                    {channel.id === "email" ? "Send Email" : "Visit Profile"}
                  </span>
                  <svg
                    className="w-4 h-4 text-blue-600 transition-transform group-hover:translate-x-1 dark:text-primary"
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

        {/* Extra context block */}
        <div
          className="mt-12 text-center bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 dark:bg-white/5 dark:border-white/10"
          style={{ boxShadow: "0 2px 12px rgba(15,23,42,0.06)" }}
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-gray-100 mb-2">
            Response Time
          </h2>
          <p className="text-sm text-slate-600 dark:text-gray-400 max-w-xl mx-auto">
            I typically reply within 24&ndash;48 hours during weekdays. For
            urgent requests, email is the fastest way to reach me.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-white/10">
        <p className="text-center text-sm text-slate-500 dark:text-gray-400 py-6">
          Built with Next.js &amp; Tailwind CSS • © {new Date().getFullYear()} Dhruv Sarvaiya
        </p>
      </footer>
    </main>
  );
}
