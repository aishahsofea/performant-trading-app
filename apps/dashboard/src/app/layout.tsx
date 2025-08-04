import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { PerformanceProvider } from "@/providers";

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
        <PerformanceProvider
          config={{
            appName: "web-app",
            apiEndpoint: "/api/metrics",
            userId: "user-123", // TODO: get from auth system
            enableErrorTracking: true,
            enableCustomMetrics: true,
          }}
        >
          <div className="min-h-screen container mx-auto px-4 py-8">
            {children}
          </div>
        </PerformanceProvider>
        <Analytics />
      </body>
    </html>
  );
}
