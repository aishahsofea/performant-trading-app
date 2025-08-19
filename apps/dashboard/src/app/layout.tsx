import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { PerformanceProvider } from "@/providers";
import { DevelopmentPerformancePanel } from "@/components/DevelopmentPerformancePanel";
import { SessionProvider } from "@/components/providers/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trading dashboard - Performance monitored",
  description: "Trading dashboard with performance monitoring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <PerformanceProvider
            config={{
              appName: "web-app",
              apiEndpoint: "/api/metrics",
              userId: "user-123", // TODO: get from auth system
              enableErrorTracking: true,
              enableCustomMetrics: true,
            }}
          >
            <div className="min-h-screen container mx-auto max-w-full">
              {children}
            </div>
            <DevelopmentPerformancePanel />
          </PerformanceProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
