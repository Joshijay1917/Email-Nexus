"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

interface ChatMessage {
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  hasAttachment?: {
    name: string;
    size: string;
    type: "pdf" | "image";
  };
}

export default function Home() {
  // Waitlist state
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
    position?: number;
  }>({ type: null, message: "" });

  // WhatsApp Simulator State
  const [activePrompt, setActivePrompt] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: "assistant",
      text: "👋 Hello! I am your Email Nexus Assistant. I link your Gmail securely with WhatsApp. Ask me to find any invoice, save attachments, or summarize your emails!",
      timestamp: "10:30 AM",
    },
  ]);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Social proof waitlist count
  const [waitlistCount, setWaitlistCount] = useState(148);

  // Ref for chat auto-scrolling
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Softly increment social proof ticker occasionally for active feeling
    const interval = setInterval(() => {
      setWaitlistCount((prev) => prev + (Math.random() > 0.7 ? 1 : 0));
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll chat body to bottom when new messages arrive or agent is typing
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatMessages, isTyping]);

  // Parse bold markdown tags (i.e. **text**) into strong elements
  const formatMessageText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-extrabold text-zinc-950">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const handleWaitlistSubmit = async (e: React.FormEvent, source: string) => {
    e.preventDefault();
    const targetEmail = email.trim();
    if (!targetEmail) return;

    setIsLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus({
          type: "success",
          message: data.message,
          position: data.position,
        });
        setEmail("");
        // Dynamically increment the local ticker for added impact
        setWaitlistCount((prev) => prev + 1);
      } else {
        setStatus({
          type: "error",
          message: data.error || "Something went wrong. Please try again.",
        });
      }
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Predefined prompts for simulator
  const prompts = [
    {
      id: 1,
      label: "🔍 Find AWS Invoice",
      userMsg: "Hey Nexus, find my last AWS invoice.",
      aiResponse: "Found it! 💸 AWS Cloud Services Invoice from May 1, 2026. Total amount: **$45.20**. Sent by *aws-billing@amazon.com*.",
      attachment: { name: "AWS-Invoice-May2026.pdf", size: "142 KB", type: "pdf" as const },
    },
    {
      id: 2,
      label: "✈️ Save flight ticket",
      userMsg: "Save my airline boarding pass to the vault.",
      aiResponse: "Boarding pass secured! ✈️ *United Airlines Flight UA240* to San Francisco. I've automatically uploaded **BoardingPass-UA240.pdf** to your Secure Vault.",
      attachment: { name: "BoardingPass-UA240.pdf", size: "1.1 MB", type: "pdf" as const },
    },
    {
      id: 3,
      label: "⚡ Summarize unread emails",
      userMsg: "Summarize my unread emails from today.",
      aiResponse: "Here is your quick Nexus Digest 🌟 (3 key unread emails):\n\n1. **Sarah (Vercel)**: Wants to schedule a 15-minute call regarding integration next Tuesday.\n2. **Bank of America**: Your monthly statement is ready for review.\n3. **Github**: 5 new alerts in your repository.",
    },
  ];

  const triggerChatSimulation = (promptId: number) => {
    if (isTyping || activePrompt === promptId) return;

    setActivePrompt(promptId);
    const selected = prompts.find((p) => p.id === promptId);
    if (!selected) return;

    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Step 1: Append User Message
    const userMessage: ChatMessage = {
      sender: "user",
      text: selected.userMsg,
      timestamp: time,
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Step 2: Realistic AI Response Delay
    setTimeout(() => {
      setIsTyping(false);
      const aiMessage: ChatMessage = {
        sender: "assistant",
        text: selected.aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        hasAttachment: selected.attachment,
      };
      setChatMessages((prev) => [...prev, aiMessage]);
    }, 1800);
  };

  const faqData = [
    {
      q: "How does Email Nexus connect to my Gmail?",
      a: "Email Nexus connects securely via official Google OAuth 2.0. We request read-only permissions for search queries and attachments extraction. You can revoke access instantly at any time in your Google settings.",
    },
    {
      q: "Is my email data shared with WhatsApp or Meta?",
      a: "Absolutely not. We use WhatsApp simply as the delivery conduit for your specific queries. Your full email inbox is never sent or synchronized. Emails are parsed temporarily, securely processed via isolated AI nodes, and never stored permanently on our servers.",
    },
    {
      q: "What does 'Privacy-First' actually mean?",
      a: "It means zero persistent database storage for your email contents. We don't train AI models on your messages. We employ end-to-end encryption, and any extracted files/invoices are saved in your personal, encrypted Attachments Vault.",
    },
    {
      q: "Is Email Nexus free to use?",
      a: "During our beta testing phase, Email Nexus is 100% free for our waitlisted members. Once we launch officially, we will offer a generous free tier alongside premium plans for power users with higher volumes.",
    },
    {
      q: "How do I get my WhatsApp invitation?",
      a: "Sign up for the waitlist below! Once we verify your queue position, we will email you an onboarding link to securely link your Google Account and instantly add the Email Nexus assistant to your WhatsApp contacts.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#030712] overflow-hidden flex flex-col justify-between">
      {/* Google Structured Data JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Email Nexus",
            "operatingSystem": "All",
            "applicationCategory": "CommunicationApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "description": "Find any invoice, save any attachment, and manage your inbox without ever leaving WhatsApp. Privacy-first, AI-powered."
          })
        }}
      />

      {/* Dynamic Background Glowing Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] glow-pulse pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] glow-pulse pointer-events-none" />
      <div className="glow-overlay" />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#030712]/50 border-b border-zinc-900 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-0">
            {/* Logo */}
            {/* <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20"> */}
            <Image src={'/logo.png'} width={50} height={50} alt="Logo" />
            {/* </div> */}
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Email<span className="text-emerald-500">Nexus</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#simulator" className="hover:text-white transition-colors">Try Simulator</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            </nav>
            <a
              href="#waitlist"
              className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium text-sm hover:bg-emerald-500/20 transition-all duration-300"
              id="nav-cta-btn"
            >
              Beta Waitlist
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 md:py-20 z-10 flex flex-col gap-24">

        {/* HERO SECTION */}
        <section id="waitlist" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">
                Active Private Beta
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              Your Gmail, <br />
              <span className="text-gradient-whatsapp-gmail">now on WhatsApp.</span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-400 font-normal leading-relaxed max-w-2xl">
              Find any invoice, save any attachment, and manage your inbox without ever leaving WhatsApp. Privacy-first, AI-powered.
            </p>

            {/* Waitlist submission */}
            <div className="mt-4 flex flex-col gap-3 max-w-md">
              {status.type === "success" ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex flex-col gap-3 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                      ✓
                    </div>
                    <span className="font-bold text-lg text-white">You are on the list!</span>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {status.message}
                  </p>
                  {status.position && (
                    <div className="mt-2 p-3 rounded-xl bg-[#030712] border border-emerald-500/10 flex justify-between items-center">
                      <span className="text-xs text-zinc-400">YOUR QUEUE POSITION</span>
                      <span className="font-mono text-lg font-extrabold text-emerald-400">#{status.position}</span>
                    </div>
                  )}
                  <span className="text-xs text-zinc-400 italic">We will notify you at your registered email as slots open.</span>
                </div>
              ) : (
                <form onSubmit={(e) => handleWaitlistSubmit(e, "hero")} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className="w-full px-4 py-3.5 rounded-xl bg-zinc-900/50 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 transition-all"
                      id="hero-email-input"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#030712] font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 min-w-[170px]"
                    id="hero-join-btn"
                  >
                    {isLoading ? (
                      <span className="w-5 h-5 border-2 border-[#030712] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Join the Beta Waitlist"
                    )}
                  </button>
                </form>
              )}

              {status.type === "error" && (
                <p className="text-sm text-red-400 mt-1 flex items-center gap-1.5" id="hero-error-msg">
                  ⚠️ {status.message}
                </p>
              )}

              <p className="text-xs text-zinc-500 mt-1">
                🔒 We care about your privacy. No spam. Unsubscribe anytime.
              </p>
            </div>

            {/* Social Proof Counter */}
            <div className="mt-2 flex items-center gap-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-[#030712] bg-emerald-700 flex items-center justify-center text-[10px] font-bold text-white">JD</div>
                <div className="w-8 h-8 rounded-full border-2 border-[#030712] bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">MK</div>
                <div className="w-8 h-8 rounded-full border-2 border-[#030712] bg-purple-600 flex items-center justify-center text-[10px] font-bold text-white">SL</div>
              </div>
              <span className="text-sm font-medium text-zinc-400">
                Join <span className="text-emerald-400 font-extrabold">{waitlistCount}</span> forward-thinking innovators validating the future.
              </span>
            </div>
          </div>

          {/* WHATSAPP CHAT SIMULATOR CARD */}
          <div id="simulator" className="lg:col-span-5 flex flex-col gap-6">
            <div className="w-full max-w-[380px] mx-auto rounded-[36px] border-[12px] border-zinc-800 bg-[#075E54] overflow-hidden shadow-2xl relative flex flex-col h-[520px]">

              {/* WhatsApp App Header */}
              <div className="bg-[#075E54] py-3.5 px-4 flex items-center justify-between text-white border-b border-[#128C7E]/40 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-emerald-950 font-bold text-sm shadow">
                      <Image src={'/logo.png'} width={90} height={90} alt="Logo" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#075E54]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm tracking-wide">Nexus Assistant</h4>
                    <span className="text-[10px] text-emerald-100 font-medium">AI Agent • Online</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 opacity-80">
                  {/* Phone Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                    <path d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.506 1.83l-2.24 2.24a15.562 15.562 0 0 0 6.59 6.59l2.24-2.24a1.875 1.875 0 0 1 1.83-.506l4.423 1.105a1.875 1.875 0 0 1 1.42 1.819V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" />
                  </svg>
                  {/* Menu Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75h.008v.008H12V6.75Zm0 5.25h.008v.008H12V12Zm0 5.25h.008v.008H12v-.008Z" />
                  </svg>
                </div>
              </div>

              {/* Chat Body */}
              <div ref={chatContainerRef} className="flex-1 min-h-0 bg-[#ECE5DD] p-4 overflow-y-auto flex flex-col gap-3.5 scrollbar-thin">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs shadow-sm ${msg.sender === "user"
                      ? "bg-[#DCF8C6] text-zinc-900 self-end rounded-tr-none"
                      : "bg-white text-zinc-900 self-start rounded-tl-none"
                      }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{formatMessageText(msg.text)}</p>

                    {/* Attachment box */}
                    {msg.hasAttachment && (
                      <div className="mt-2 p-2 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xl">📄</span>
                          <div className="text-[10px]">
                            <p className="font-bold text-zinc-800 leading-tight">{msg.hasAttachment.name}</p>
                            <p className="text-zinc-500">{msg.hasAttachment.size}</p>
                          </div>
                        </div>
                        <button className="px-1.5 py-0.5 rounded bg-emerald-500 text-white font-bold text-[9px]">
                          Save
                        </button>
                      </div>
                    )}
                    <span className="block text-[8px] text-zinc-400 text-right mt-1 leading-none">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}

                {/* Animated Typing Indicator */}
                {isTyping && (
                  <div className="bg-white text-zinc-900 self-start rounded-2xl rounded-tl-none px-3.5 py-2.5 text-xs shadow-sm max-w-[85%] flex items-center gap-1">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                )}

              </div>

              {/* Chat Input Placeholder */}
              <div className="bg-[#f0f0f0] p-2 border-t border-zinc-200 flex items-center gap-2">
                <div className="flex-1 bg-white rounded-full px-3.5 py-1.5 text-xs text-zinc-400 border border-zinc-200">
                  Type a message...
                </div>
                <div className="w-8 h-8 rounded-full bg-[#128C7E] flex items-center justify-center text-white text-sm shadow">
                  🎤
                </div>
              </div>
            </div>

            {/* Clickable Action Prompts */}
            <div className="flex flex-col gap-2 max-w-[380px] mx-auto w-full">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider text-center">
                Click a prompt to test simulated assistant:
              </p>
              <div className="flex flex-col gap-2">
                {prompts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => triggerChatSimulation(p.id)}
                    disabled={isTyping}
                    className={`w-full text-left text-xs px-4 py-2.5 rounded-xl border font-medium transition-all ${activePrompt === p.id
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                      : "bg-zinc-900/40 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/60"
                      } disabled:opacity-50`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CORE VALUES / FEATURES SECTION */}
        <section id="features" className="flex flex-col gap-12">
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-3">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              A Complete Inbox Powerhouse on WhatsApp
            </h2>
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
              No complex downloads, no secondary apps. Manage, query, and structure your secure Gmail correspondence dynamically with standard WhatsApp texts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-card glass-card-hover rounded-3xl p-8 flex flex-col gap-5 text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6 text-emerald-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Instant AI Search</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Need to find that flight reference, a contract detail, or last month&apos;s utility bill? Just ask Nexus in plain words. No more complex search queries.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card glass-card-hover rounded-3xl p-8 flex flex-col gap-5 text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6 text-emerald-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75v6.75m0 0-3-3m3 3 3-3m-8.25 6a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Attachments Vault</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Instruct Nexus to auto-extract incoming email attachments (PDFs, images, ZIPs) and push them securely to your personal vault, organized and ready to download.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card glass-card-hover rounded-3xl p-8 flex flex-col gap-5 text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6 text-emerald-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Dynamic AI Summaries</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Stay updated on-the-go. Receive custom daily updates or request instant structured summaries of your unread emails so you only open your desktop when critical.
              </p>
            </div>
          </div>
        </section>

        {/* SECURITY & TRUST BANNER */}
        <section className="relative rounded-3xl border border-zinc-800 bg-gradient-to-r from-zinc-900/40 via-emerald-950/10 to-zinc-900/40 p-8 md:p-12 overflow-hidden flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="flex flex-col gap-3 text-left max-w-xl">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Privacy-First Framework</span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">Secured by Enterprise-Grade Technology</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              We never store your emails. Your Gmail integration uses official read-only tokens, and our parsing engine operates in ephemeral sandbox environments. End-to-end encrypted, zero logs retained.
            </p>
          </div>
          <div className="flex gap-6 shrink-0">
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                🔒
              </div>
              <span className="text-xs font-semibold text-zinc-300">256-Bit SSL</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                🔑
              </div>
              <span className="text-xs font-semibold text-zinc-300">Google OAuth</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                🛡️
              </div>
              <span className="text-xs font-semibold text-zinc-300">GDPR Compliant</span>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="flex flex-col gap-12 text-center">
          <div className="flex flex-col gap-3 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-white">3 Simple Steps to Supercharge Your Inbox</h2>
            <p className="text-zinc-400 text-sm md:text-base">Get set up in less than 2 minutes. No credit card required.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="flex flex-col gap-4 items-center">
              <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 text-xl font-bold flex items-center justify-center text-emerald-400">
                1
              </div>
              <h4 className="text-lg font-bold text-white">Securely Sync Gmail</h4>
              <p className="text-zinc-400 text-xs leading-relaxed max-w-xs">
                Authorize Email Nexus securely via standard Google OAuth login. We only require read-only metadata search access.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col gap-4 items-center">
              <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 text-xl font-bold flex items-center justify-center text-emerald-400">
                2
              </div>
              <h4 className="text-lg font-bold text-white">Add WhatsApp Assistant</h4>
              <p className="text-zinc-400 text-xs leading-relaxed max-w-xs">
                Click our invitation link to instantly trigger a chat thread with the Nexus AI verified contact on WhatsApp.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col gap-4 items-center">
              <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 text-xl font-bold flex items-center justify-center text-emerald-400">
                3
              </div>
              <h4 className="text-lg font-bold text-white">Manage & Query Ephemerally</h4>
              <p className="text-zinc-400 text-xs leading-relaxed max-w-xs">
                Send plain text queries to search, receive automated push notifications for chosen tags, and manage attachments easily.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section id="faq" className="flex flex-col gap-12 max-w-4xl mx-auto w-full">
          <div className="text-center flex flex-col gap-3">
            <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
            <p className="text-zinc-400 text-sm">Everything you need to know about security, billing, and connectivity.</p>
          </div>

          <div className="flex flex-col gap-3">
            {faqData.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-zinc-800/80 bg-zinc-900/25 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-sm sm:text-base text-zinc-100 hover:text-white transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className={`text-emerald-400 transition-transform duration-300 ${openFaq === idx ? "rotate-45" : ""}`}>
                    ➕
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-zinc-900 pt-3 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* SECONDARY CTA / BOTTOM capture */}
        <section className="text-center py-12 border-t border-zinc-900 flex flex-col items-center gap-6">
          <h2 className="text-3xl font-extrabold text-white">Ready to change how you manage email?</h2>
          <p className="text-zinc-400 text-sm max-w-md">Join the private beta waitlist today. Real validation, real productivity.</p>
          <a
            href="#waitlist"
            className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#030712] font-extrabold shadow-lg shadow-emerald-500/25 transition-all"
          >
            Claim Your Waitlist Slot Now
          </a>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-900 bg-[#02050c] px-6 py-8 z-10 text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-white">
              Email<span className="text-emerald-500">Nexus</span>
            </span>
            <span>© 2026. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="#features" className="hover:text-zinc-300 transition-colors">Features</a>
            <a href="#simulator" className="hover:text-zinc-300 transition-colors">Simulator</a>
            <a href="#faq" className="hover:text-zinc-300 transition-colors">FAQ</a>
            <span className="text-zinc-700">|</span>
            <span className="text-zinc-500">Privacy Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
