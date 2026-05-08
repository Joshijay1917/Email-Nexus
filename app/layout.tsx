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
  title: "Email Nexus | Your Gmail, now on WhatsApp",
  description:
    "Find any invoice, save any attachment, and manage your inbox without ever leaving WhatsApp. Privacy-first, AI-powered.",
  keywords: ["Gmail on WhatsApp", "Email on WhatsApp", "AI email assistant", "Invoice search WhatsApp", "Save attachments WhatsApp", "SaaS", "Inbox manager"],
  authors: [{ name: "Email Nexus Team" }],
  openGraph: {
    title: "Email Nexus | Your Gmail, now on WhatsApp",
    description: "Manage your inbox, find invoices, and save attachments from WhatsApp. Privacy-first, AI-powered.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#030712] text-zinc-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
        {children}
      </body>
    </html>
  );
}
