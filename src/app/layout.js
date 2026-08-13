import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Dhruv Sarvaiya - Portfolio",
  description: "Frontend developer portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className="bg-background text-foreground min-h-screen transition-colors duration-300"
        style={{ margin: 0 }}
      >
        {children}
      </body>
    </html>
  );
}
