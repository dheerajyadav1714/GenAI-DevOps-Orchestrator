import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "D.A.M.I | DevOps Autonomous Multi-agent Intelligence",
  description: "D.A.M.I — AI-powered multi-agent platform for autonomous DevOps: self-healing CI/CD, cloud architecture design, and real-time DORA metrics. Built on Google Cloud.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-background text-on-surface overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
