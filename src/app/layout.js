import "./globals.css";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "Dhruv Sarvaiya — Frontend Engineer & Independent Builder",
  description:
    "Personal site of Dhruv Sarvaiya — a frontend engineer who designs and builds calm, considered web experiences with Next.js, TypeScript and Tailwind.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body
        className="min-h-screen antialiased bg-background text-foreground transition-colors duration-300"
        style={{ margin: 0, fontFamily: "var(--font-body)" }}
      >
        {/* Fixed scroll-progress bar */}
        <div className="scroll-progress" aria-hidden="true" />

        {/* Fixed animated gradient mesh background */}
        <div className="bg-mesh" aria-hidden="true" />

        {/* Scroll progress listener — passive, sets width on .scroll-progress */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){function i(){var t=document.querySelector(".scroll-progress");if(!t)return;var e=window.scrollY||document.documentElement.scrollTop;var n=document.documentElement.scrollHeight-window.innerHeight;var o=n>0?e/n*100:0;t.style.width=o+"%"}window.addEventListener("scroll",i,{passive:!0});window.addEventListener("resize",i,{passive:!0});window.addEventListener("load",i);i();})();`,
          }}
        />

        {children}
      </body>
    </html>
  );
}
