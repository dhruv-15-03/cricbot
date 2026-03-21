import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CricBot — Your AI Cricket Expert",
  description:
    "Ask CricBot anything about cricket — rules, players, tournaments, records, and iconic moments. Powered by AI with a curated cricket knowledge base.",
  keywords: [
    "cricket",
    "chatbot",
    "AI",
    "cricket rules",
    "cricket stats",
    "IPL",
    "World Cup",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
