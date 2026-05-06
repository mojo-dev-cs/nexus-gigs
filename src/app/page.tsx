"use client";

import { useUser, SignInButton, SignUpButton, SignOutButton } from "@clerk/nextjs";
import { useEffect, useState, useRef } from "react";
import { FreelancerView } from "@/components/dashboard/FreelancerView";
import { ClientView } from "@/components/dashboard/ClientView";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Zap, Globe, Cpu, Lock, Rocket,
  Sparkles, Terminal, Target, Users, DollarSign,
  Briefcase, ChevronRight, Activity, Code, Database,
  ArrowRight, CheckCircle2, UserPlus, Fingerprint, Star, Layers,
  ShieldCheck, Landmark, Smartphone, GraduationCap, Link2, ChevronDown, X,
  Search, RefreshCw, Eye, EyeOff, Calculator, BadgeCheck, Wifi,
  User as UserIcon, ListChecks, Check, Mail, Clock,
  TrendingUp, Award, Heart, Quote, PlayCircle, MessageCircle, Bitcoin,
  CreditCard, Crown, Languages, BarChart3, HeartHandshake, ArrowUpRight,
  Menu, Building2, Layers3, Settings2, MapPin, Calendar, Phone,
  FileText, Camera
} from "lucide-react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

type Step = "checking" | "landing" | "email-confirm" | "consent" | "path" | "vetting" | "loading" | "dashboard";

// ─────────────────────────────────────────────
// ANIMATED COUNTER
// ─────────────────────────────────────────────

const AnimatedCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = value / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setCount(value); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 20);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{count.toLocaleString()}{suffix}</span>;
};

// ─────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 backdrop-blur-2xl border-b border-black/10 shadow-2xl shadow-gray-300/30"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-10 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #f0f0f0, #e0e0e0)" }}>
            <Terminal size={13} className="text-black" />
          </div>
          <span className="text-black font-black text-[16px] tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
            nexus<span style={{ color: "#6366f1" }}>gigs</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-7">
          {["Features", "How It Works", "Talent", "Pricing", "For Business"].map((item) => (
            <a key={item} href="#"
              className="text-[12px] font-medium text-black/50 hover:text-black transition-colors tracking-wide">
              {item}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2.5">
          <SignInButton mode="modal">
            <button className="text-[12px] font-semibold text-black/60 hover:text-black transition-colors px-4 py-2">
              Sign in
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-5 py-2.5 rounded-full text-[12px] font-semibold text-black transition-all hover:opacity-90 hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #e0e0e0, #f0f0f0)" }}>
              Get started free
            </button>
          </SignUpButton>
        </div>

        <button className="md:hidden p-2 text-black/60" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-2xl border-t border-black/10 px-5 pb-5 overflow-hidden"
          >
            <div className="flex flex-col gap-4 pt-4">
              {["Features", "How It Works", "Talent", "Pricing", "For Business"].map((item) => (
                <a key={item} href="#" className="text-[13px] font-medium text-black/50">{item}</a>
              ))}
              <div className="flex flex-col gap-2 pt-3 border-t border-black/10">
                <SignInButton mode="modal">
                  <button className="w-full py-3 rounded-xl text-[12px] font-semibold text-black/70 border border-black/10">Sign in</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="w-full py-3 rounded-xl text-[12px] font-semibold text-black"
                    style={{ background: "linear-gradient(135deg, #e0e0e0, #f0f0f0)" }}>
                    Get started free
                  </button>
                </SignUpButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

// ─────────────────────────────────────────────
// GLASS CARD COMPONENT
// ─────────────────────────────────────────────

const GlassCard = ({ children, className = "", hover = true }: {
  children: React.ReactNode; className?: string; hover?: boolean;
}) => (
  <div className={`
    rounded-2xl border border-black/9 transition-all duration-300
    ${hover ? "hover:border-black/18 hover:shadow-2xl hover:shadow-indigo-500/5" : ""}
    ${className}
  `}
    style={{
      background: "rgba(0,0,0,0.04)",
      backdropFilter: "blur(20px)",
    }}>
    {children}
  </div>
);

// ─────────────────────────────────────────────
// LANDING PAGE
// ─────────────────────────────────────────────

const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const heroStats = [
    { value: 184, suffix: "+", label: "Countries" },
    { value: 420000, suffix: "+", label: "Freelancers" },
    { value: 92, suffix: "M+", label: "USD Paid Out" },
    { value: 97, suffix: "%", label: "Satisfaction" },
  ];

  const features = [
    { icon: <ShieldCheck size={18} />, title: "Escrow-Protected Pay", desc: "Every contract is funded upfront. Funds release only when both sides approve delivery.", tag: "Trust" },
    { icon: <Zap size={18} />, title: "Instant Global Payouts", desc: "Mobile money in seconds, crypto in minutes, bank wires in 1–2 days. 70+ currencies.", tag: "Speed" },
    { icon: <Globe size={18} />, title: "Truly Borderless", desc: "Live in 184 countries. Auto-FX at mid-market rates with zero hidden conversion fees.", tag: "Global" },
    { icon: <Cpu size={18} />, title: "AI Skill Matching", desc: "Smart routing connects your skills to the highest-paying compatible briefs daily.", tag: "AI" },
    { icon: <Lock size={18} />, title: "Bank-grade Security", desc: "AES-256 at rest, TLS 1.3 in flight, hardware-key 2FA and biometric login.", tag: "Security" },
    { icon: <BarChart3 size={18} />, title: "Real-time Analytics", desc: "Live earnings, win-rate, reputation and conversion analytics in one dashboard.", tag: "Insights" },
  ];

  const steps = [
    { num: "01", title: "Create Your Profile", desc: "Sign up free in 60 seconds. Verify your identity, skills and KYC in under 3 minutes.", icon: <UserPlus size={16} /> },
    { num: "02", title: "Get Verified Globally", desc: "Our AI reviews credentials, builds your trust score and matches you with global demand.", icon: <BadgeCheck size={16} /> },
    { num: "03", title: "Win Premium Gigs", desc: "Spend Hustle Units to apply to hand-picked briefs from clients in 180+ countries.", icon: <Target size={16} /> },
    { num: "04", title: "Earn in Your Currency", desc: "Withdraw to M-Pesa, PayPal, Stripe, Binance Pay or local bank — instant or same-day.", icon: <DollarSign size={16} /> },
  ];

  const TESTIMONIALS = [
    {
      name: "Amara Okafor",
      role: "Brand Designer",
      location: "Lagos, Nigeria",
      quote: "I went from chasing invoices to getting paid the same day. NexusGigs feels built for global freelancers first.",
      initials: "AO",
      color: "#6366f1",
      avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&crop=face",
      rating: 5,
      earned: "$24,800"
    },
    {
      name: "Daniel Kamau",
      role: "Full-stack Developer",
      location: "Nairobi, Kenya",
      quote: "Escrow plus M-Pesa is a cheat code. No more ghost clients, no more 5-day bank waits.",
      initials: "DK",
      color: "#3b82f6",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      rating: 5,
      earned: "$38,200"
    },
    {
      name: "Priya Sharma",
      role: "AI Engineer",
      location: "Bengaluru, India",
      quote: "Brief quality is in a different league. Real budgets, real briefs, real clients worldwide.",
      initials: "PS",
      color: "#10b981",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face",
      rating: 5,
      earned: "$61,400"
    },
    {
      name: "Liam Roberts",
      role: "Motion Designer",
      location: "London, UK",
      quote: "The cleanest freelance UX I've used in years. The mobile experience is genuinely excellent.",
      initials: "LR",
      color: "#f59e0b",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
      rating: 5,
      earned: "$29,600"
    },
    {
      name: "Fatima Al-Hassan",
      role: "UX Researcher",
      location: "Dubai, UAE",
      quote: "Finally a platform that treats African and Middle Eastern freelancers as first-class citizens.",
      initials: "FA",
      color: "#ec4899",
      avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=80&h=80&fit=crop&crop=face",
      rating: 5,
      earned: "$44,100"
    },
    {
      name: "Carlos Mendez",
      role: "Blockchain Dev",
      location: "São Paulo, Brazil",
      quote: "Getting paid in USDT with zero fees changed everything. NexusGigs is the future.",
      initials: "CM",
      color: "#14b8a6",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
      rating: 5,
      earned: "$52,900"
    },
  ];

  const REGIONS = [
    { flag: "🇰🇪", name: "Kenya" }, { flag: "🇳🇬", name: "Nigeria" },
    { flag: "🇿🇦", name: "South Africa" }, { flag: "🇬🇭", name: "Ghana" },
    { flag: "🇪🇬", name: "Egypt" }, { flag: "🇺🇸", name: "United States" },
    { flag: "🇬🇧", name: "United Kingdom" }, { flag: "🇩🇪", name: "Germany" },
    { flag: "🇮🇳", name: "India" }, { flag: "🇵🇭", name: "Philippines" },
    { flag: "🇧🇷", name: "Brazil" }, { flag: "🇦🇪", name: "UAE" },
    { flag: "🇸🇬", name: "Singapore" }, { flag: "🇦🇺", name: "Australia" },
    { flag: "🇨🇦", name: "Canada" }, { flag: "🇯🇵", name: "Japan" },
  ];

  const FAQ = [
    { q: "What are Hustle Units (HU)?", a: "HU are in-app credits you spend to apply for gigs. They keep the marketplace spam-free and ensure clients only hear from serious freelancers. Your first 5 HU are on us." },
    { q: "Which countries are supported?", a: "NexusGigs is live in 184 countries. Withdrawals settle in 70+ local currencies via mobile money, bank, PayPal, Stripe and Binance Pay." },
    { q: "How fast are payouts?", a: "Mobile money (M-Pesa, MoMo, GCash) is instant. PayPal/Binance settles in minutes. Bank wires arrive in 1–2 business days." },
    { q: "Is my money safe?", a: "Every contract is escrow-funded. Funds are held by a regulated partner and released only when both sides sign off on delivery." },
    { q: "What are your fees?", a: "Freelancers keep 100% of pay on Pro & Agency plans. Clients pay a small 3% processing fee. No hidden cuts, no FX markup." },
    { q: "How does AI matching work?", a: "Our algorithm analyzes your skills, portfolio, past performance, and availability to surface your profile to the most relevant briefs every day." },
  ];

  const paymentMethods = [
    { name: "M-PESA", sub: "Instant · Kenya", icon: <Smartphone size={14} className="text-green-400" /> },
    { name: "PayPal", sub: "Minutes", icon: <CreditCard size={14} className="text-blue-400" /> },
    { name: "Binance", sub: "Crypto USDT", icon: <Bitcoin size={14} className="text-yellow-400" /> },
    { name: "Stripe", sub: "Card · Global", icon: <Layers size={14} className="text-indigo-400" /> },
    { name: "Bank Wire", sub: "1–2 Days", icon: <Landmark size={14} className="text-white/50" /> },
  ];

  return (
    <div className="min-h-screen text-black" style={{
      background: "#ffffff",
      fontFamily: "'DM Sans', system-ui, sans-serif"
    }}>
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] right-[-10%] w-175 h-175 rounded-full opacity-[0.12]"
          style={{ background: "radial-gradient(circle, #ffffff, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute bottom-[20%] left-[-10%] w-125 h-125 rounded-full opacity-[0.08]"
          style={{ background: "radial-gradient(circle, #f0f0f0, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute top-[50%] left-[40%] w-100 h-100 rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #e0e0e0, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      <Nav />

      {/* ─────── HERO ─────── */}
      <section className="relative pt-32 pb-20 px-5 overflow-hidden z-10">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8"
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.3)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-200 animate-pulse" />
              <span className="text-indigo-600 text-[11px] font-semibold tracking-wide flex items-center gap-1.5">
                <Globe size={10} /> Now live in 184 countries
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-[46px] md:text-[76px] font-black leading-[0.9] tracking-[-0.03em] mb-5"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              The freelance platform
              <br />
              <span style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                built for the world.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="max-w-lg mx-auto text-[14px] text-black/45 leading-relaxed mb-9"
            >
              NexusGigs connects vetted freelancers with serious clients across 184 countries.
              Escrow-protected contracts, instant global payouts, zero platform fees on Pro.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8"
            >
              <SignUpButton mode="modal">
                <button className="px-7 py-3.5 rounded-full text-[13px] font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.02] flex items-center gap-2 shadow-2xl"
                  style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)", boxShadow: "0 0 40px rgba(99,102,241,0.35)" }}>
                  Start earning — it's free <ArrowRight size={14} />
                </button>
              </SignUpButton>
              <button className="px-7 py-3.5 rounded-full text-[13px] font-semibold text-black/70 border border-black/10 hover:border-black/20 hover:text-black transition-all flex items-center gap-2"
                style={{ background: "rgba(0,0,0,0.04)", backdropFilter: "blur(10px)" }}>
                <PlayCircle size={14} /> Watch 90s demo
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] text-black/35"
            >
              <span className="flex items-center gap-1.5"><CheckCircle2 size={11} className="text-green-400" /> 5 free HU on signup</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={11} className="text-green-400" /> No card required</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={11} className="text-green-400" /> Cancel anytime</span>
              <span className="flex items-center gap-1.5"><ShieldCheck size={11} className="text-indigo-400" /> SOC 2 · GDPR · PCI-DSS</span>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-14 max-w-3xl mx-auto"
          >
            {heroStats.map((stat, i) => (
              <GlassCard key={i} className="text-center p-5">
                <p className="text-[32px] font-black text-black leading-none mb-0.5" style={{ fontFamily: "'Syne', sans-serif" }}>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-black/35">{stat.label}</p>
              </GlassCard>
            ))}
          </motion.div>

          {/* Payment strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-10 flex flex-wrap justify-center items-center gap-2.5"
          >
            <span className="text-[10px] font-semibold text-black/30 uppercase tracking-widest">Pay & withdraw via</span>
            {paymentMethods.map((p, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.08)" }}>
                {p.icon}
                <div>
                  <p className="text-[10px] font-black text-black leading-none">{p.name}</p>
                  <p className="text-[8px] text-black/35 mt-0.5">{p.sub}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─────── TICKER ─────── */}
      <div className="py-4 overflow-hidden relative z-10" style={{ borderTop: "1px solid rgba(0,0,0,0.05)", borderBottom: "1px solid rgba(0,0,0,0.05)", background: "rgba(0,0,0,0.02)" }}>
        <motion.div
          className="whitespace-nowrap flex gap-14 items-center"
          animate={{ x: [0, -1200] }}
          transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
        >
          {[
            "Emmanuel K. earned $850 via Stripe",
            "David N. applied to Tesla Data Analyst",
            "Alice V. withdrew KES 14,000",
            "John M. topped up 1,200 HU — Pro",
            "Sara B. completed Security Audit — $1,500",
            "24 new jobs posted today · 184 countries",
            "Emmanuel K. earned $850 via Stripe",
            "David N. applied to Tesla Data Analyst",
            "Alice V. withdrew KES 14,000",
          ].map((t, i) => (
            <span key={i} className="inline-flex items-center gap-3 text-[11px] font-medium text-black/35">
              <span className="w-1 h-1 rounded-full bg-indigo-200 shrink-0" />
              {t}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ─────── FEATURES ─────── */}
      <section className="py-20 px-5 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/10 mb-4 text-[10px] font-semibold text-black/50"
              style={{ background: "rgba(0,0,0,0.04)" }}>
              <Sparkles size={10} className="text-indigo-400" /> Platform features
            </div>
            <h2 className="text-[36px] md:text-[48px] font-black leading-[0.95] tracking-tight text-white mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>
              Everything a modern<br />freelancer needs.
            </h2>
            <p className="text-white/40 text-[13px] max-w-sm">Built from the ground up for the global workforce — not an afterthought.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <GlassCard className="group p-6 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-indigo-400 transition-colors"
                      style={{ background: "rgba(99,102,241,0.12)" }}>
                      {f.icon}
                    </div>
                    <span className="text-[9px] font-semibold text-white/30 uppercase tracking-widest border border-white/7 px-2 py-1 rounded-full">{f.tag}</span>
                  </div>
                  <h3 className="text-[14px] font-bold text-white mb-1.5">{f.title}</h3>
                  <p className="text-[12px] text-white/40 leading-relaxed">{f.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────── HOW IT WORKS ─────── */}
      <section className="py-20 px-5 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 mb-4 text-[10px] font-semibold text-white/50"
              style={{ background: "rgba(255,255,255,0.04)" }}>
              <ListChecks size={10} className="text-indigo-400" /> Simple process
            </div>
            <h2 className="text-[36px] md:text-[48px] font-black tracking-tight text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
              From signup to payout<br />in 4 steps.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="relative p-6 h-full">
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[10px] font-black text-white/15 tracking-widest">{step.num}</span>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-indigo-300"
                      style={{ background: "rgba(99,102,241,0.15)" }}>
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-[13px] font-bold text-white mb-1.5">{step.title}</h3>
                  <p className="text-[11px] text-white/40 leading-relaxed">{step.desc}</p>
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                      <ChevronRight size={14} className="text-white/20" />
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────── GLOBAL REACH ─────── */}
      <section className="py-20 px-5 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 mb-4 text-[10px] font-semibold text-white/50"
                style={{ background: "rgba(255,255,255,0.04)" }}>
                <Globe size={10} className="text-indigo-400" /> Global reach
              </div>
              <h2 className="text-[36px] md:text-[48px] font-black tracking-tight text-white leading-tight mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
                Live across<br />6 continents.
              </h2>
              <p className="text-[13px] text-white/40 leading-relaxed mb-7">
                From Lagos to London, Manila to Manhattan — NexusGigs settles work and payments in 70+ local currencies at mid-market rates.
              </p>
              <SignUpButton mode="modal">
                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[12px] font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}>
                  Join the network <ArrowRight size={13} />
                </button>
              </SignUpButton>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="flex flex-wrap gap-2">
                {REGIONS.map((r) => (
                  <div key={r.name} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium text-white/50 transition-all hover:text-white/80"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <span className="text-sm leading-none">{r.flag}</span>
                    {r.name}
                  </div>
                ))}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}>
                  <Globe size={11} /> +168 more
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────── TESTIMONIALS ─────── */}
      <section className="py-20 px-5 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 mb-4 text-[10px] font-semibold text-white/50"
              style={{ background: "rgba(255,255,255,0.04)" }}>
              <HeartHandshake size={10} className="text-pink-400" /> Loved worldwide
            </div>
            <h2 className="text-[36px] md:text-[48px] font-black tracking-tight text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
              Trusted by 420,000+<br />freelancers.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <GlassCard className="p-5 h-full flex flex-col">
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, k) => <Star key={k} size={11} fill="#f59e0b" stroke="#f59e0b" />)}
                  </div>
                  <p className="text-[12px] text-white/55 leading-relaxed mb-4 flex-1">"{t.quote}"</p>
                  <div className="flex items-center justify-between pt-3 border-t border-white/6">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-white/10"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <div>
                        <p className="text-[11px] font-bold text-white">{t.name}</p>
                        <p className="text-[9px] text-white/35">{t.role} · {t.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-white/30">Earned</p>
                      <p className="text-[11px] font-black text-green-400">{t.earned}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────── FAQ ─────── */}
      <section className="py-20 px-5 relative z-10">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 mb-4 text-[10px] font-semibold text-white/50"
              style={{ background: "rgba(255,255,255,0.04)" }}>
              <MessageCircle size={10} className="text-indigo-400" /> Common questions
            </div>
            <h2 className="text-[36px] md:text-[48px] font-black tracking-tight text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
              Questions, answered.
            </h2>
          </motion.div>

          <div className="space-y-2">
            {FAQ.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-white/3 transition-colors"
                >
                  <span className="text-[13px] font-semibold text-white/80">{f.q}</span>
                  <ChevronDown size={14} className={`text-white/30 shrink-0 ml-4 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 pb-4 text-[12px] text-white/40 leading-relaxed border-t border-white/6 pt-3">
                        {f.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────── CTA ─────── */}
      <section className="py-20 px-5 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl p-12 md:p-16 text-center overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(circle at 30% 0%, rgba(99,102,241,0.15), transparent 50%), radial-gradient(circle at 70% 100%, rgba(59,130,246,0.1), transparent 50%)" }} />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 mb-7 text-[10px] font-semibold text-white/50"
                style={{ background: "rgba(255,255,255,0.04)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Platform status: All systems operational
              </div>
              <h2 className="text-[36px] md:text-[56px] font-black text-white leading-tight tracking-tight mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
                Ready to go global?
              </h2>
              <p className="text-white/40 text-[14px] mb-9 max-w-md mx-auto leading-relaxed">
                Join 420,000+ freelancers earning on NexusGigs across 184 countries. Your first 5 Hustle Units are free.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <SignUpButton mode="modal">
                  <button className="px-8 py-3.5 rounded-full text-[13px] font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.02] inline-flex items-center gap-2"
                    style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)", boxShadow: "0 0 40px rgba(99,102,241,0.3)" }}>
                    Create free account <ArrowRight size={14} />
                  </button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <button className="px-8 py-3.5 rounded-full text-[13px] font-semibold text-white/60 border border-white/10 hover:border-white/20 hover:text-white transition-all">
                    I already have one
                  </button>
                </SignInButton>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─────── FOOTER ─────── */}
      <footer className="border-t border-black/5 py-12 px-5 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-10 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #f0f0f0, #e0e0e0)" }}>
                  <Terminal size={12} className="text-black" />
                </div>
                <span className="text-black font-black text-[15px]" style={{ fontFamily: "'Syne', sans-serif" }}>
                  nexus<span style={{ color: "#6366f1" }}>gigs</span>
                </span>
              </div>
              <p className="text-[12px] text-black/30 max-w-xs leading-relaxed">
                The freelance economy, rebuilt for the world. Escrow-secured, instantly paid, globally connected.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[10px] text-black/25">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                All systems operational
              </div>
            </div>
            {[
              { h: "Product", l: ["Features", "Pricing", "Regions", "Changelog"] },
              { h: "Company", l: ["About", "Careers", "Press", "Contact"] },
              { h: "Legal", l: ["Privacy", "Terms", "Security", "Compliance"] },
            ].map((c) => (
              <div key={c.h}>
                <p className="text-[10px] font-bold tracking-widest text-black/25 uppercase mb-3">{c.h}</p>
                <ul className="space-y-2">
                  {c.l.map((x) => (
                    <li key={x}>
                      <a href="#" className="text-[12px] text-black/35 hover:text-black/70 transition-colors">{x}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-7 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-black/25">
            <span>© 2016–{new Date().getFullYear()} NexusGigs Global Inc. · 184 Countries</span>
            <div className="flex items-center gap-5">
              <a href="mailto:hello@nexusgigs.com" className="flex items-center gap-1.5 hover:text-black/50 transition-colors">
                <Mail size={10} /> hello@nexusgigs.com
              </a>
              <a href="#" className="flex items-center gap-1.5 hover:text-black/50 transition-colors">
                <MessageCircle size={10} /> Live Chat
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// ─────────────────────────────────────────────
// EMAIL CONFIRMATION SCREEN
// ─────────────────────────────────────────────

const EmailConfirmScreen = ({ email }: { email?: string }) => (
  <div className="min-h-screen flex items-center justify-center p-5" style={{ background: "#02040f" }}>
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-sm w-full"
    >
      <GlassCard className="p-10 text-center" hover={false}>
        <div className="w-16 h-16 rounded-2xl mx-auto mb-7 flex items-center justify-center"
          style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)" }}>
          <Mail size={28} className="text-indigo-400" />
        </div>
        <h2 className="text-[22px] font-black text-white mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>Check your inbox</h2>
        <p className="text-[12px] text-white/40 leading-relaxed mb-7">
          We sent a confirmation link to{" "}
          <span className="text-indigo-400 font-semibold">{email || "your email"}</span>.
          Click it to activate your account.
        </p>
        <div className="space-y-2 mb-7">
          {["Open your email app", "Find the email from NexusGigs", "Click the confirmation link", "Return here to continue"].map((s, i) => (
            <div key={i} className="flex items-center gap-3 text-left p-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white shrink-0"
                style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}>{i + 1}</div>
              <span className="text-[11px] font-medium text-white/50">{s}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-2 text-[11px] text-white/30">
          <RefreshCw size={11} />
          <span>Didn't receive it? Check your spam folder.</span>
        </div>
      </GlassCard>
    </motion.div>
  </div>
);

// ─────────────────────────────────────────────
// CONSENT SCREEN
// ─────────────────────────────────────────────

const ConsentScreen = ({ onContinue }: { onContinue: () => void }) => (
  <div className="min-h-screen flex items-center justify-center p-5" style={{ background: "#02040f" }}>
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-sm w-full"
    >
      <GlassCard className="p-10 text-center" hover={false}>
        <div className="w-16 h-16 rounded-2xl mx-auto mb-7 flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <Fingerprint size={28} className="text-white/60" />
        </div>
        <h2 className="text-[22px] font-black text-white mb-3 leading-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
          Identity Verification
        </h2>
        <p className="text-[12px] text-white/40 leading-relaxed mb-7">
          To maintain quality and safety across the NexusGigs network, all new members complete a brief verification process. Takes about 3 minutes.
        </p>

        <div className="grid grid-cols-3 gap-2.5 mb-7">
          {[
            { icon: <Clock size={14} />, label: "3 min" },
            { icon: <Lock size={14} />, label: "Encrypted" },
            { icon: <ShieldCheck size={14} />, label: "GDPR" },
          ].map((item, i) => (
            <div key={i} className="p-3.5 rounded-xl text-center"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="text-indigo-400 flex justify-center mb-1.5">{item.icon}</div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/35">{item.label}</p>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-white/25 mb-6 leading-relaxed">
          By continuing, you agree to our{" "}
          <span className="text-indigo-400 font-medium cursor-pointer">Terms of Service</span> and{" "}
          <span className="text-indigo-400 font-medium cursor-pointer">Privacy Policy</span>.
          Your information will never be sold or shared.
        </p>

        <button
          onClick={onContinue}
          className="w-full py-3.5 rounded-xl text-[12px] font-semibold text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}
        >
          <Shield size={13} /> I agree — let's verify
        </button>
      </GlassCard>
    </motion.div>
  </div>
);

// ─────────────────────────────────────────────
// PATH SELECTION
// ─────────────────────────────────────────────

const PathSelection = ({ onSelect }: { onSelect: (role: string) => void }) => (
  <div className="min-h-screen flex items-center justify-center p-5" style={{ background: "#02040f" }}>
    <div className="max-w-2xl w-full">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="flex items-center justify-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}>
            <Terminal size={13} className="text-white" />
          </div>
          <span className="text-white font-black text-[16px]" style={{ fontFamily: "'Syne', sans-serif" }}>
            nexus<span style={{ color: "#6366f1" }}>gigs</span>
          </span>
        </div>
        <h2 className="text-[30px] md:text-[40px] font-black text-white mb-1.5" style={{ fontFamily: "'Syne', sans-serif" }}>How are you joining?</h2>
        <p className="text-[12px] text-white/35 font-medium">Choose your role on the platform</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-3">
        {[
          {
            role: "freelancer",
            icon: <UserIcon size={24} />,
            title: "I'm a freelancer",
            sub: "I want to find work & get paid",
            description: "Browse projects, apply to gigs, and earn securely with instant global payouts.",
            perks: ["Access verified job listings", "Build your reputation score", "M-Pesa, bank & crypto payouts", "Join exclusive talent networks"],
            badge: "For professionals",
          },
          {
            role: "client",
            icon: <Building2 size={24} />,
            title: "I'm a client",
            sub: "I need to hire talent",
            description: "Post projects, hire vetted professionals, and pay with full escrow protection.",
            perks: ["12,000+ verified talent", "Escrow payment protection", "AI-powered talent matching", "Milestone-based contracts"],
            badge: "For businesses",
          },
        ].map((opt, i) => (
          <motion.button
            key={opt.role}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.12 }}
            onClick={() => onSelect(opt.role)}
            className="group p-7 rounded-2xl text-left transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,102,241,0.4)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 40px rgba(99,102,241,0.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-indigo-400 transition-colors group-hover:text-white"
                style={{ background: "rgba(99,102,241,0.12)" }}>
                {opt.icon}
              </div>
              <span className="text-[9px] font-semibold text-white/30 uppercase tracking-widest border border-white/7 px-2.5 py-1 rounded-full">{opt.badge}</span>
            </div>
            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-0.5">{opt.sub}</p>
            <h3 className="text-[19px] font-black text-white mb-2.5" style={{ fontFamily: "'Syne', sans-serif" }}>{opt.title}</h3>
            <p className="text-[12px] text-white/40 mb-5 leading-relaxed">{opt.description}</p>
            <div className="space-y-1.5">
              {opt.perks.map((perk) => (
                <div key={perk} className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "rgba(16,185,129,0.2)" }}>
                    <Check size={8} className="text-green-400" />
                  </div>
                  <span className="text-[11px] text-white/40">{perk}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-2 text-[12px] font-semibold text-indigo-400 group-hover:gap-3 transition-all">
              Continue <ChevronRight size={13} />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// VETTING FORM
// ─────────────────────────────────────────────

const countries = [
  { name: "Kenya", code: "+254", flag: "🇰🇪" },
  { name: "Nigeria", code: "+234", flag: "🇳🇬" },
  { name: "Uganda", code: "+256", flag: "🇺🇬" },
  { name: "Tanzania", code: "+255", flag: "🇹🇿" },
  { name: "United States", code: "+1", flag: "🇺🇸" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { name: "South Africa", code: "+27", flag: "🇿🇦" },
  { name: "Ghana", code: "+233", flag: "🇬🇭" },
  { name: "India", code: "+91", flag: "🇮🇳" },
  { name: "Philippines", code: "+63", flag: "🇵🇭" },
  { name: "Brazil", code: "+55", flag: "🇧🇷" },
  { name: "Egypt", code: "+20", flag: "🇪🇬" },
  { name: "Germany", code: "+49", flag: "🇩🇪" },
  { name: "Canada", code: "+1", flag: "🇨🇦" },
  { name: "Australia", code: "+61", flag: "🇦🇺" },
  { name: "UAE", code: "+971", flag: "🇦🇪" },
];

type FormData = {
  legalName: string;
  username: string;
  phone: string;
  country: string;
  code: string;
  city: string;
  bio: string;
  skills: string[];
  job: string;
  yearsExp: string;
  portfolio: string;
  linkedin: string;
  github: string;
  pay: string;
  idType: string;
  idNumber: string;
  availability: string;
  hourlyRate: string;
  languages: string[];
  timezone: string;
  projectSize: string;
  education: string;
  specialization: string;
};

const VettingForm = ({ role, onFinalize }: { role: string; onFinalize: () => void }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [data, setData] = useState<FormData>({
    legalName: "", username: "", phone: "", country: "Kenya", code: "+254",
    city: "", bio: "", skills: [], job: "Developer", yearsExp: "1–2 yrs",
    portfolio: "", linkedin: "", github: "",
    pay: "M-Pesa", idType: "National ID", idNumber: "",
    availability: "Full-time", hourlyRate: "$10–$25/hr",
    languages: ["English"], timezone: "EAT (UTC+3)", projectSize: "Medium",
    education: "Bachelor's", specialization: "",
  });

  const skillOptions = [
    "React", "Node.js", "Python", "UI/UX Design", "Figma",
    "TypeScript", "Flutter", "DevOps", "Data Science",
    "Copywriting", "SEO", "Video Editing", "Solidity", "AI/ML",
    "WordPress", "Shopify", "iOS", "Android", "PostgreSQL", "AWS"
  ];

  const languageOptions = ["English", "French", "Swahili", "Arabic", "Spanish", "Portuguese", "Hindi", "German"];

  const toggleSkill = (s: string) =>
    setData((d) => ({ ...d, skills: d.skills.includes(s) ? d.skills.filter((x) => x !== s) : [...d.skills, s] }));

  const toggleLanguage = (l: string) =>
    setData((d) => ({ ...d, languages: d.languages.includes(l) ? d.languages.filter((x) => x !== l) : [...d.languages, l] }));

  const update = (k: keyof FormData, v: string) => setData((d) => ({ ...d, [k]: v }));

  const handleCountry = (name: string) => {
    const found = countries.find((c) => c.name === name);
    setData((d) => ({ ...d, country: name, code: found?.code || "+254" }));
  };

  const inputBase = "w-full rounded-xl px-4 py-3 text-[12px] text-white outline-none transition-all placeholder-white/20"
    + " border border-white/9 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10"
    + " bg-white/4";

  const labelBase = "block text-[10px] font-semibold uppercase tracking-widest text-white/35 mb-1.5";

  const ChipButton = ({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button type="button" onClick={onClick}
      className={`px-3 py-2 rounded-xl text-[11px] font-semibold border transition-all ${
        selected
          ? "text-white border-indigo-500/60"
          : "border-white/8 text-white/40 hover:border-white/20 hover:text-white/60"
      }`}
      style={selected ? { background: "rgba(99,102,241,0.18)" } : { background: "rgba(255,255,255,0.03)" }}>
      {selected && <span className="mr-1 text-indigo-400">✓</span>}
      {children}
    </button>
  );

  const jobRoles = [
    { id: "Developer", icon: <Code size={13} /> },
    { id: "Designer", icon: <Layers3 size={13} /> },
    { id: "Data Scientist", icon: <BarChart3 size={13} /> },
    { id: "Marketer", icon: <TrendingUp size={13} /> },
    { id: "Writer", icon: <Award size={13} /> },
    { id: "Video Editor", icon: <PlayCircle size={13} /> },
    { id: "DevOps", icon: <Settings2 size={13} /> },
    { id: "Consultant", icon: <Briefcase size={13} /> },
    { id: "Other", icon: <Sparkles size={13} /> },
  ];

  const experienceLevels = ["< 1 yr", "1–2 yrs", "3–5 yrs", "5–10 yrs", "10+ yrs"];
  const availabilityOptions = ["Full-time", "Part-time", "Weekends only", "Project-based", "Retainer"];
  const rateOptions = ["< $10/hr", "$10–$25/hr", "$25–$50/hr", "$50–$100/hr", "$100+/hr"];
  const timezones = ["WAT (UTC+1)", "CAT (UTC+2)", "EAT (UTC+3)", "GMT (UTC+0)", "CET (UTC+1)", "IST (UTC+5:30)", "PST (UTC-8)", "EST (UTC-5)"];
  const projectSizes = ["Small (<$500)", "Medium ($500–$5k)", "Large ($5k–$50k)", "Enterprise ($50k+)"];
  const educationLevels = ["High School", "Diploma", "Bachelor's", "Master's", "PhD", "Self-taught", "Bootcamp"];
  const paymentOptions = [
    { id: "M-Pesa", icon: <Smartphone size={13} />, desc: "Instant STK push · Kenya" },
    { id: "Bank Transfer", icon: <Landmark size={13} />, desc: "Local or international wire" },
    { id: "Crypto (USDT)", icon: <Bitcoin size={13} />, desc: "USDT on TRC20 · Global" },
    { id: "PayPal", icon: <CreditCard size={13} />, desc: "Instant to PayPal wallet" },
    { id: "Stripe", icon: <Layers size={13} />, desc: "Card payout · Global" },
  ];
  const idTypes = ["National ID", "Passport", "Alien ID", "Driver's License", "Student ID"];

  const canProceed = step === 1
    ? data.legalName.trim().length > 1 && data.phone.length >= 8 && data.city.trim().length > 1
    : step === 2
    ? data.skills.length > 0 && data.specialization.trim().length > 0
    : step === 3
    ? data.languages.length > 0
    : true;

  const stepTitles = ["Your Identity", "Skills & Expertise", "Preferences & Availability", "Verification & Payout"];
  const stepDescs = ["Tell us who you are", "Showcase your capabilities", "How & when you work", "Secure your account & earnings"];

  return (
    <div className="min-h-screen flex items-center justify-center p-5" style={{ background: "#02040f" }}>
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] right-[-10%] w-150 h-150 rounded-full opacity-[0.08]"
          style={{ background: "radial-gradient(circle, #6366f1, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div className="max-w-lg w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-7">
          <div className="flex items-center justify-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}>
              <Terminal size={12} className="text-white" />
            </div>
            <span className="text-white font-black text-[15px]" style={{ fontFamily: "'Syne', sans-serif" }}>
              nexus<span style={{ color: "#6366f1" }}>gigs</span>
            </span>
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-1">Step {step} of {totalSteps}</p>
          <h2 className="text-[22px] font-black text-white" style={{ fontFamily: "'Syne', sans-serif" }}>{stepTitles[step - 1]}</h2>
          <p className="text-[11px] text-white/35 mt-0.5">{stepDescs[step - 1]}</p>
        </div>

        {/* Progress */}
        <div className="flex gap-1 mb-6">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className="h-0.5 rounded-full flex-1 transition-all duration-500"
              style={{ background: i < step ? "linear-gradient(90deg, #6366f1, #3b82f6)" : "rgba(255,255,255,0.08)" }} />
          ))}
        </div>

        <div className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>
          <div className="p-6">
            <AnimatePresence mode="wait">

              {/* ── STEP 1: Identity ── */}
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelBase}>Full Legal Name</label>
                      <input value={data.legalName} onChange={(e) => update("legalName", e.target.value)}
                        className={inputBase} placeholder="Jane Kamau" />
                    </div>
                    <div>
                      <label className={labelBase}>Username / Handle</label>
                      <input value={data.username} onChange={(e) => update("username", e.target.value)}
                        className={inputBase} placeholder="@janekamau" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelBase}>Country</label>
                      <select value={data.country} onChange={(e) => handleCountry(e.target.value)} className={inputBase}>
                        {countries.map((c) => (
                          <option key={c.name} value={c.name} style={{ background: "#0d0f1e" }}>
                            {c.flag} {c.name} ({c.code})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelBase}>City</label>
                      <input value={data.city} onChange={(e) => update("city", e.target.value)}
                        className={inputBase} placeholder="Nairobi" />
                    </div>
                  </div>

                  <div>
                    <label className={labelBase}>WhatsApp / Phone</label>
                    <div className="flex gap-2">
                      <div className="px-3 py-3 rounded-xl text-[12px] font-semibold text-white/40 shrink-0"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)" }}>
                        {data.code}
                      </div>
                      <input value={data.phone} onChange={(e) => update("phone", e.target.value)}
                        className={`${inputBase} flex-1`} placeholder="712 345 678" />
                    </div>
                  </div>

                  <div>
                    <label className={labelBase}>Professional Bio</label>
                    <textarea value={data.bio} onChange={(e) => update("bio", e.target.value)}
                      rows={3} className={`${inputBase} resize-none`}
                      placeholder="2–3 sentences about who you are and what you do best..." />
                    <p className="text-[9px] text-white/25 mt-1 ml-1">This appears on your public profile card</p>
                  </div>

                  <div>
                    <label className={labelBase}>Education Level</label>
                    <div className="flex flex-wrap gap-1.5">
                      {educationLevels.map((e) => (
                        <ChipButton key={e} selected={data.education === e} onClick={() => update("education", e)}>{e}</ChipButton>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 2: Skills ── */}
              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-5">
                  <div>
                    <label className={labelBase}>Primary Role</label>
                    <div className="grid grid-cols-3 gap-2">
                      {jobRoles.map((j) => (
                        <button key={j.id} type="button" onClick={() => update("job", j.id)}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all text-[11px] font-semibold ${
                            data.job === j.id
                              ? "border-indigo-500/60 text-white"
                              : "border-white/8 text-white/40 hover:border-white/20 hover:text-white/60"
                          }`}
                          style={data.job === j.id ? { background: "rgba(99,102,241,0.15)" } : { background: "rgba(255,255,255,0.03)" }}>
                          <span className={data.job === j.id ? "text-indigo-400" : "text-white/30"}>{j.icon}</span>
                          {j.id}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={labelBase}>Specialization / Niche</label>
                    <input value={data.specialization} onChange={(e) => update("specialization", e.target.value)}
                      className={inputBase} placeholder="e.g. E-commerce React apps, SaaS UI/UX, Fintech APIs" />
                    <p className="text-[9px] text-white/25 mt-1 ml-1">Be specific — this boosts your match rate by 4×</p>
                  </div>

                  <div>
                    <label className={labelBase}>Years of Experience</label>
                    <div className="flex flex-wrap gap-1.5">
                      {experienceLevels.map((y) => (
                        <ChipButton key={y} selected={data.yearsExp === y} onClick={() => update("yearsExp", y)}>{y}</ChipButton>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={labelBase}>Top Skills <span className="text-white/20 normal-case">(select all that apply)</span></label>
                    <div className="flex flex-wrap gap-1.5">
                      {skillOptions.map((s) => (
                        <ChipButton key={s} selected={data.skills.includes(s)} onClick={() => toggleSkill(s)}>{s}</ChipButton>
                      ))}
                    </div>
                    {data.skills.length === 0 && (
                      <p className="text-[10px] text-red-400/70 mt-1.5 ml-1">Please select at least one skill</p>
                    )}
                  </div>

                  <div>
                    <label className={labelBase}>Portfolio / Website</label>
                    <div className="relative">
                      <Link2 size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                      <input value={data.portfolio} onChange={(e) => update("portfolio", e.target.value)}
                        className={`${inputBase} pl-9`} placeholder="https://yourportfolio.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelBase}>LinkedIn</label>
                      <div className="relative">
                        <Link2 size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                        <input value={data.linkedin} onChange={(e) => update("linkedin", e.target.value)}
                          className={`${inputBase} pl-9`} placeholder="linkedin.com/in/you" />
                      </div>
                    </div>
                    <div>
                      <label className={labelBase}>GitHub</label>
                      <div className="relative">
                        <Code size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                        <input value={data.github} onChange={(e) => update("github", e.target.value)}
                          className={`${inputBase} pl-9`} placeholder="github.com/you" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 3: Preferences ── */}
              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-5">
                  <div>
                    <label className={labelBase}>Availability</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {availabilityOptions.map((a) => (
                        <ChipButton key={a} selected={data.availability === a} onClick={() => update("availability", a)}>{a}</ChipButton>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={labelBase}>Expected Hourly Rate</label>
                    <div className="flex flex-wrap gap-1.5">
                      {rateOptions.map((r) => (
                        <ChipButton key={r} selected={data.hourlyRate === r} onClick={() => update("hourlyRate", r)}>{r}</ChipButton>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={labelBase}>Preferred Project Size</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {projectSizes.map((p) => (
                        <ChipButton key={p} selected={data.projectSize === p} onClick={() => update("projectSize", p)}>{p}</ChipButton>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={labelBase}>Languages Spoken</label>
                    <div className="flex flex-wrap gap-1.5">
                      {languageOptions.map((l) => (
                        <ChipButton key={l} selected={data.languages.includes(l)} onClick={() => toggleLanguage(l)}>{l}</ChipButton>
                      ))}
                    </div>
                    {data.languages.length === 0 && (
                      <p className="text-[10px] text-red-400/70 mt-1 ml-1">Select at least one language</p>
                    )}
                  </div>

                  <div>
                    <label className={labelBase}>Timezone</label>
                    <select value={data.timezone} onChange={(e) => update("timezone", e.target.value)} className={inputBase}>
                      {timezones.map((t) => (
                        <option key={t} value={t} style={{ background: "#0d0f1e" }}>{t}</option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 4: Verification ── */}
              {step === 4 && (
                <motion.div key="s4" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-5">
                  <div className="flex items-center gap-2.5 p-3.5 rounded-xl"
                    style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
                    <ShieldCheck size={15} className="text-indigo-400 shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold text-indigo-300">End-to-End Encrypted</p>
                      <p className="text-[9px] text-indigo-400/60 font-medium">All data secured with AES-256 encryption</p>
                    </div>
                  </div>

                  <div>
                    <label className={labelBase}>ID Verification Type</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {idTypes.map((id) => (
                        <ChipButton key={id} selected={data.idType === id} onClick={() => update("idType", id)}>{id}</ChipButton>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={labelBase}>ID Number</label>
                    <input value={data.idNumber} onChange={(e) => update("idNumber", e.target.value)}
                      className={inputBase} placeholder="e.g. 12345678" />
                    <p className="text-[9px] text-white/25 mt-1 ml-1">Used for identity verification only. Never shared.</p>
                  </div>

                  <div>
                    <label className={labelBase}>Primary Payout Method</label>
                    <div className="space-y-1.5">
                      {paymentOptions.map((p) => (
                        <button key={p.id} type="button" onClick={() => update("pay", p.id)}
                          className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                            data.pay === p.id ? "border-indigo-500/50" : "border-white/8 hover:border-white/15"
                          }`}
                          style={data.pay === p.id ? { background: "rgba(99,102,241,0.1)" } : { background: "rgba(255,255,255,0.03)" }}>
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${data.pay === p.id ? "text-indigo-300" : "text-white/30"}`}
                            style={{ background: "rgba(255,255,255,0.06)" }}>
                            {p.icon}
                          </div>
                          <div className="flex-1">
                            <p className={`text-[12px] font-semibold ${data.pay === p.id ? "text-white" : "text-white/50"}`}>{p.id}</p>
                            <p className="text-[10px] text-white/30">{p.desc}</p>
                          </div>
                          {data.pay === p.id && (
                            <div className="w-4 h-4 rounded-full flex items-center justify-center"
                              style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}>
                              <Check size={9} className="text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="p-4 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-white/25 mb-2.5">Profile Summary</p>
                    <div className="space-y-1.5 text-[11px]">
                      {[
                        { label: "Name", value: data.legalName || "—" },
                        { label: "Role", value: `${data.job} · ${data.specialization || "General"}` },
                        { label: "Skills", value: data.skills.length ? `${data.skills.length} selected` : "—" },
                        { label: "Availability", value: data.availability },
                        { label: "Rate", value: data.hourlyRate },
                        { label: "Payout", value: data.pay },
                      ].map((r) => (
                        <div key={r.label} className="flex justify-between">
                          <span className="text-white/30">{r.label}</span>
                          <span className="font-semibold text-white/60">{r.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex gap-2.5 mt-7">
              {step > 1 && (
                <button type="button" onClick={() => setStep((s) => s - 1)}
                  className="px-5 py-3.5 rounded-xl text-[12px] font-semibold text-white/50 border border-white/8 hover:border-white/15 hover:text-white/70 transition-all"
                  style={{ background: "rgba(255,255,255,0.04)" }}>
                  Back
                </button>
              )}
              <button type="button"
                onClick={() => (step < totalSteps ? setStep((s) => s + 1) : onFinalize())}
                disabled={!canProceed}
                className="flex-1 py-3.5 rounded-xl text-[12px] font-semibold text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: canProceed ? "linear-gradient(135deg, #6366f1, #3b82f6)" : "rgba(255,255,255,0.1)" }}>
                {step === totalSteps ? (
                  <><Rocket size={13} /> Launch My Profile</>
                ) : (
                  <>Continue <ArrowRight size={13} /></>
                )}
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] text-white/20 mt-4">
          <ShieldCheck size={10} className="inline mr-1 text-green-400" />
          Your data is encrypted and never shared with third parties
        </p>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// LOADING SCREEN
// ─────────────────────────────────────────────

const LoadingScreen = ({ name }: { name?: string }) => {
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState(0);

  const tasks = [
    { label: "Encrypting your profile data", icon: <Lock size={12} /> },
    { label: "Generating your trust score", icon: <Shield size={12} /> },
    { label: "Connecting to talent network", icon: <Wifi size={12} /> },
    { label: "Syncing payment relays", icon: <Zap size={12} /> },
    { label: "Finalizing your workspace", icon: <Rocket size={12} /> },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + 0.8;
        if (next >= 100) { clearInterval(interval); return 100; }
        setCurrentTask(Math.min(Math.floor((next / 100) * tasks.length), tasks.length - 1));
        return next;
      });
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 text-center" style={{ background: "#02040f" }}>
      <div className="max-w-xs w-full">
        <div className="flex items-center justify-center gap-2 mb-9">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}>
            <Terminal size={16} className="text-white" />
          </div>
          <span className="text-white font-black text-[18px]" style={{ fontFamily: "'Syne', sans-serif" }}>
            nexus<span style={{ color: "#6366f1" }}>gigs</span>
          </span>
        </div>

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full mx-auto mb-7"
          style={{ border: "2px solid rgba(255,255,255,0.07)", borderTopColor: "#6366f1" }}
        />

        <h2 className="text-[20px] font-black text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
          Initializing workspace
        </h2>
        <p className="text-[12px] text-white/35 mb-8">
          Welcome, <span className="text-white/60 font-semibold">{name || "Operator"}</span>
        </p>

        <div className="mb-5">
          <div className="h-1 rounded-full overflow-hidden mb-2" style={{ background: "rgba(255,255,255,0.07)" }}>
            <div className="h-full rounded-full transition-all"
              style={{ width: `${progress}%`, background: "linear-gradient(90deg, #6366f1, #3b82f6)" }} />
          </div>
          <div className="flex justify-between text-[10px] font-semibold text-white/25">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        <div className="space-y-1.5 text-left">
          {tasks.map((task, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: i <= currentTask ? 1 : 0.2, x: 0 }}
              transition={{ delay: i * 0.2 }}
              className={`flex items-center gap-2.5 p-2.5 rounded-xl ${i === currentTask ? "border border-white/7" : ""}`}
              style={i === currentTask ? { background: "rgba(255,255,255,0.04)" } : {}}>
              <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                i < currentTask ? "text-white" : i === currentTask ? "text-indigo-400" : "text-white/20"
              }`}
                style={i < currentTask ? { background: "linear-gradient(135deg, #6366f1, #3b82f6)" } : {}}>
                {i < currentTask ? <Check size={8} /> : task.icon}
              </div>
              <span className={`text-[11px] font-medium ${
                i === currentTask ? "text-white/60" : i < currentTask ? "text-white/25 line-through" : "text-white/20"
              }`}>
                {task.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// ROCKET WARP
// ─────────────────────────────────────────────

const RocketWarp = ({ active }: { active: boolean }) => (
  <AnimatePresence>
    {active && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-999 flex items-center justify-center pointer-events-none"
        style={{ background: "rgba(2,4,15,0.9)", backdropFilter: "blur(10px)" }}
      >
        <motion.div
          initial={{ y: 400, scale: 0.5, opacity: 1 }}
          animate={{ y: -1500, scale: 4, opacity: [1, 1, 0] }}
          transition={{ duration: 1.1, ease: [0.36, 0, 0.66, -0.56] }}
          className="flex flex-col items-center"
        >
          <Rocket size={50} className="text-indigo-400" />
          <div className="w-px h-32 mt-2"
            style={{ background: "linear-gradient(to bottom, #6366f1, transparent)" }} />
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [mounted, setMounted] = useState(false);
  const [isWarping, setIsWarping] = useState(false);
  const [step, setStep] = useState<Step>("checking");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    if (isLoaded) {
      if (!isSignedIn) {
        setStep("landing");
      } else {
        const saved = localStorage.getItem(`nexus_v7_access_${user.id}`);
        if (saved) {
          setSelectedRole(saved);
          setStep("dashboard");
        } else {
          const emailVerified = user?.emailAddresses?.[0]?.verification?.status === "verified";
          if (!emailVerified) {
            setStep("email-confirm");
          } else {
            setStep("consent");
          }
        }
      }
    }
  }, [isLoaded, isSignedIn, user]);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setStep("vetting");
  };

  const handleFinalize = () => {
    setIsWarping(true);
    setTimeout(() => {
      setStep("loading");
      setIsWarping(false);
      setTimeout(() => {
        if (user?.id) localStorage.setItem(`nexus_v7_access_${user.id}`, selectedRole!);
        setStep("dashboard");
      }, 3000);
    }, 900);
  };

  if (!mounted || !isLoaded || step === "checking") {
    return <div className="min-h-screen" style={{ background: "#02040f" }} />;
  }

  if (step === "landing") return <LandingPage />;
  if (step === "email-confirm") return <EmailConfirmScreen email={user?.emailAddresses?.[0]?.emailAddress} />;
  if (step === "consent") return <ConsentScreen onContinue={() => setStep("path")} />;
  if (step === "path") return <PathSelection onSelect={handleRoleSelect} />;
  if (step === "vetting") return <VettingForm role={selectedRole || "freelancer"} onFinalize={handleFinalize} />;
  if (step === "loading") return <LoadingScreen name={user?.firstName || undefined} />;

  if (step === "dashboard") {
    return (
      <main className="min-h-screen" style={{ background: "#ffffff" }}>
        <RocketWarp active={isWarping} />
        {selectedRole === "freelancer"
          ? <FreelancerView jobs={[]} userMetadata={user?.publicMetadata || {}} />
          : <ClientView jobs={[]} />}
      </main>
    );
  }

  return null;
}
