import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RuleSciProvider } from "@/lib/context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RuleSci — Trade by Rules. Think by Science.",
  description: "A psychology-first trading discipline system focused on behavior, not profits.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <RuleSciProvider>
          {children}
        </RuleSciProvider>
      </body>
    </html>
  );
}
