import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
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
  metadataBase: new URL("https://email-nexus-apex-horizon.vercel.app/"),
  title: "Email Nexus | WhatsApp Gmail Integration by Apex Horizon",
  description:
    "Email Nexus by Apex Horizon brings your Gmail to WhatsApp. Manage, query, and structure your emails via text. Join the waitlist for the ultimate productivity tool.",
  keywords: ["Gmail on WhatsApp", "Email on WhatsApp", "AI email assistant", "Invoice search WhatsApp", "Save attachments WhatsApp", "SaaS", "Inbox manager"],
  authors: [{ name: "Email Nexus Team" }, { name: "Apex Horizon" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Email Nexus | Your Gmail, now on WhatsApp",
    description: "Manage your inbox, find invoices, and save attachments from WhatsApp. Privacy-first, AI-powered.",
    url: "https://email-nexus-apex-horizon.vercel.app/",
    siteName: "Email Nexus",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Email Nexus | Your Gmail, now on WhatsApp",
    description: "Manage your inbox, find invoices, and save attachments from WhatsApp. Privacy-first, AI-powered.",
    creator: "@EmailNexus",
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
      <Analytics />
      <body className="min-h-full flex flex-col bg-[#030712] text-zinc-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
        {children}
      </body>
    </html>
  );
}
