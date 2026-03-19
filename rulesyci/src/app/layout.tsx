import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RuleSciProvider } from "@/lib/context";
import ToastContainer from "@/components/Toast";

const inter = Inter({ subsets: ["latin"] });

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#ffffff',
};

export const metadata: Metadata = {
  title: 'RuleSci — Ambient Trading Discipline',
  description: 'Proactive habit architecture for modern traders.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'RuleSci',
  },
  manifest: '/manifest.json',
  icons: {
    apple: '/icon-192.png',
  },
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'RuleSci',
    'theme-color': '#ffffff',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#1a1a2e] text-white antialiased min-h-[100dvh] overflow-x-hidden`}>
        <RuleSciProvider>
          {children}
          <ToastContainer />
        </RuleSciProvider>
      </body>
    </html>
  );
}
