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
  Menu, Building2, Layers3, Settings2
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
      transition={{ duration: 0.5 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-17 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-900">
            <Terminal size={14} className="text-white" />
          </div>
          <span className="text-gray-900 font-black text-[17px] tracking-tight" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
            nexus<span className="text-blue-600">gigs</span>
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {["Features", "How It Works", "Talent", "For Business"].map((item) => (
            <a key={item} href="#" className="text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors">{item}</a>
          ))}
        </nav>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          <SignInButton mode="modal">
            <button className="text-[13px] font-semibold text-gray-600 hover:text-gray-900 transition-colors px-4 py-2">
              Sign in
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-5 py-2.5 rounded-full text-[13px] font-semibold text-white bg-gray-900 hover:bg-gray-800 transition-all hover:scale-[1.02]">
              Get started free
            </button>
          </SignUpButton>
        </div>

        {/* Mobile menu */}
        <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-t border-gray-100 px-6 pb-6 overflow-hidden"
          >
            <div className="flex flex-col gap-4 pt-4">
              {["Features", "How It Works", "Talent", "For Business"].map((item) => (
                <a key={item} href="#" className="text-[14px] font-medium text-gray-600">{item}</a>
              ))}
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                <SignInButton mode="modal">
                  <button className="w-full py-3 rounded-xl text-[13px] font-semibold text-gray-700 border border-gray-200">Sign in</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="w-full py-3 rounded-xl text-[13px] font-semibold text-white bg-gray-900">Get started free</button>
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
    {
      icon: <ShieldCheck size={20} />,
      title: "Escrow-Protected Pay",
      desc: "Every contract is funded upfront. Funds release only when both sides approve delivery.",
      tag: "Trust"
    },
    {
      icon: <Zap size={20} />,
      title: "Instant Global Payouts",
      desc: "Mobile money in seconds, crypto in minutes, bank wires in 1–2 days. 70+ currencies.",
      tag: "Speed"
    },
    {
      icon: <Globe size={20} />,
      title: "Truly Borderless",
      desc: "Live in 184 countries. Auto-FX at mid-market rates with zero hidden conversion fees.",
      tag: "Global"
    },
    {
      icon: <Cpu size={20} />,
      title: "AI Skill Matching",
      desc: "Smart routing connects your skills to the highest-paying compatible briefs daily.",
      tag: "AI"
    },
    {
      icon: <Lock size={20} />,
      title: "Bank-grade Security",
      desc: "AES-256 at rest, TLS 1.3 in flight, hardware-key 2FA and biometric login.",
      tag: "Security"
    },
    {
      icon: <BarChart3 size={20} />,
      title: "Real-time Analytics",
      desc: "Live earnings, win-rate, reputation and conversion analytics in one dashboard.",
      tag: "Insights"
    },
  ];

  const steps = [
    { num: "01", title: "Create Your Profile", desc: "Sign up free in 60 seconds. Verify your identity, skills and KYC in under 3 minutes.", icon: <UserPlus size={18} /> },
    { num: "02", title: "Get Verified Globally", desc: "Our AI reviews credentials, builds your trust score and matches you with global demand.", icon: <BadgeCheck size={18} /> },
    { num: "03", title: "Win Premium Gigs", desc: "Spend Hustle Units to apply to hand-picked briefs from clients in 180+ countries.", icon: <Target size={18} /> },
    { num: "04", title: "Earn in Your Currency", desc: "Withdraw to M-Pesa, PayPal, Stripe, Binance Pay or local bank — instant or same-day.", icon: <DollarSign size={18} /> },
  ];

  const TESTIMONIALS = [
    { name: "Amara O.", role: "Brand Designer · Lagos", quote: "I went from chasing invoices to getting paid the same day. NexusGigs feels built for global freelancers first.", initials: "AO", color: "#4F46E5" },
    { name: "Daniel K.", role: "Full-stack Dev · Nairobi", quote: "Escrow plus M-Pesa is a cheat code. No more ghost clients, no more 5-day bank waits.", initials: "DK", color: "#0EA5E9" },
    { name: "Priya S.", role: "AI Engineer · Bengaluru", quote: "Brief quality is in a different league. Real budgets, real briefs, real clients worldwide.", initials: "PS", color: "#10B981" },
    { name: "Liam R.", role: "Motion Designer · London", quote: "The cleanest freelance UX I've used in years. The mobile experience is genuinely excellent.", initials: "LR", color: "#F59E0B" },
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
  ];

  const paymentMethods = [
    { name: "M-PESA", sub: "Instant · Kenya", color: "#16A34A", bg: "#F0FDF4", icon: <Smartphone size={16} className="text-green-700" /> },
    { name: "PayPal", sub: "Minutes", color: "#003087", bg: "#EFF6FF", icon: <CreditCard size={16} className="text-blue-800" /> },
    { name: "Binance", sub: "Crypto USDT", color: "#F0B90B", bg: "#FEFCE8", icon: <Bitcoin size={16} className="text-yellow-600" /> },
    { name: "Stripe", sub: "Card · Global", color: "#635BFF", bg: "#F5F3FF", icon: <Layers size={16} className="text-indigo-600" /> },
    { name: "Bank Wire", sub: "1–2 Business Days", color: "#374151", bg: "#F9FAFB", icon: <Landmark size={16} className="text-gray-700" /> },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <Nav />

      {/* ─────── HERO ─────── */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute top-0 right-0 w-150 h-150 rounded-full opacity-[0.12] blur-[100px] pointer-events-none" style={{ background: "radial-gradient(circle, #3B82F6, transparent)" }} />
        <div className="absolute bottom-0 left-0 w-100 h-100 rounded-full opacity-[0.07] blur-[80px] pointer-events-none" style={{ background: "radial-gradient(circle, #8B5CF6, transparent)" }} />

        <div className="max-w-6xl mx-auto relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-200 bg-blue-50 mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-blue-700 text-[11px] font-semibold tracking-wide flex items-center gap-1.5">
                <Globe size={11} /> Now live in 184 countries
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[52px] md:text-[80px] font-black leading-[0.92] tracking-[-0.03em] mb-6 text-gray-900"
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
            >
              The freelance platform
              <br />
              <span className="relative inline-block">
                <span className="relative z-10 text-blue-600">built for the world.</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="absolute bottom-1 left-0 right-0 h-3 bg-blue-100 rounded-sm -z-10 origin-left"
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="max-w-xl mx-auto text-[16px] text-gray-500 leading-relaxed mb-10"
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
                <button className="px-8 py-4 rounded-full text-[14px] font-semibold text-white bg-gray-900 hover:bg-gray-800 transition-all hover:scale-[1.02] flex items-center gap-2.5 shadow-lg shadow-gray-900/20">
                  Start earning — it's free <ArrowRight size={15} />
                </button>
              </SignUpButton>
              <button className="px-8 py-4 rounded-full text-[14px] font-semibold text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center gap-2.5">
                <PlayCircle size={15} /> Watch 90s demo
              </button>
            </motion.div>

            {/* Trust row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[12px] text-gray-400"
            >
              <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-green-500" /> 5 free HU on signup</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-green-500" /> No card required</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-green-500" /> Cancel anytime</span>
              <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-blue-500" /> SOC 2 · GDPR · PCI-DSS</span>
            </motion.div>
          </div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto"
          >
            {heroStats.map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                <p className="text-[36px] font-black text-gray-900 leading-none mb-1" style={{ fontFamily: "'DM Sans', system-ui" }}>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Payment methods strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-14 flex flex-wrap justify-center items-center gap-3"
          >
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Pay & withdraw via</span>
            {paymentMethods.map((p, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: p.bg }}>
                  {p.icon}
                </div>
                <div>
                  <p className="text-[11px] font-black text-gray-800 leading-none">{p.name}</p>
                  <p className="text-[9px] text-gray-400 font-medium mt-0.5">{p.sub}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─────── SOCIAL PROOF BAR ─────── */}
      <section className="py-6 border-y border-gray-100 bg-gray-50 overflow-hidden">
        <div className="relative">
          <motion.div
            className="whitespace-nowrap flex gap-16 items-center"
            animate={{ x: [0, -1200] }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          >
            {[
              "Emmanuel K. earned $850 via Stripe gig",
              "David N. applied to Tesla Data Analyst",
              "Alice V. withdrew KES 14,000 successfully",
              "John M. topped up 1,200 HU — Pro Uplink",
              "Sara B. completed Security Audit — $1,500",
              "Kraken · Stripe · Amazon · Google hiring now",
              "24 new jobs posted today · 184 countries",
              "Emmanuel K. earned $850 via Stripe gig",
              "David N. applied to Tesla Data Analyst",
              "Alice V. withdrew KES 14,000 successfully",
            ].map((t, i) => (
              <span key={i} className="inline-flex items-center gap-3 text-[12px] font-medium text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                {t}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─────── FEATURES ─────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-white mb-5 text-[11px] font-semibold text-gray-600">
              <Sparkles size={11} className="text-blue-500" /> Platform features
            </div>
            <h2 className="text-[40px] md:text-[52px] font-black leading-[0.96] tracking-tight text-gray-900 mb-4" style={{ fontFamily: "'DM Sans', system-ui" }}>
              Everything a modern<br />freelancer needs.
            </h2>
            <p className="text-gray-500 text-[15px] max-w-md">Built from the ground up for the global workforce — not an afterthought.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="group p-7 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50 text-gray-700 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    {f.icon}
                  </div>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest border border-gray-100 px-2.5 py-1 rounded-full">{f.tag}</span>
                </div>
                <h3 className="text-[16px] font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────── HOW IT WORKS ─────── */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-white mb-5 text-[11px] font-semibold text-gray-600">
              <ListChecks size={11} className="text-blue-500" /> Simple process
            </div>
            <h2 className="text-[40px] md:text-[52px] font-black tracking-tight text-gray-900" style={{ fontFamily: "'DM Sans', system-ui" }}>
              From signup to payout<br />in 4 steps.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative p-7 rounded-2xl border border-gray-200 bg-white"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[11px] font-black text-gray-300 tracking-widest">{step.num}</span>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-900 text-white">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-[15px] font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">{step.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ChevronRight size={16} className="text-gray-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────── GLOBAL REACH ─────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-white mb-5 text-[11px] font-semibold text-gray-600">
                <Globe size={11} className="text-blue-500" /> Global reach
              </div>
              <h2 className="text-[40px] md:text-[52px] font-black tracking-tight text-gray-900 leading-tight mb-5" style={{ fontFamily: "'DM Sans', system-ui" }}>
                Live across<br />6 continents.
              </h2>
              <p className="text-[15px] text-gray-500 leading-relaxed mb-8">
                From Lagos to London, Manila to Manhattan — NexusGigs settles work and payments in 70+ local currencies at mid-market rates.
              </p>
              <SignUpButton mode="modal">
                <button className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-[13px] font-semibold text-white bg-gray-900 hover:bg-gray-800 transition-all hover:scale-[1.02]">
                  Join the network <ArrowRight size={14} />
                </button>
              </SignUpButton>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="flex flex-wrap gap-2.5">
                {REGIONS.map((r) => (
                  <div
                    key={r.name}
                    className="flex items-center gap-2 px-3 py-2 rounded-full text-[12px] font-medium text-gray-600 bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                  >
                    <span className="text-sm leading-none">{r.flag}</span>
                    {r.name}
                  </div>
                ))}
                <div className="flex items-center gap-2 px-3 py-2 rounded-full text-[12px] font-semibold text-white bg-gray-900">
                  <Globe size={12} /> +168 more
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────── TESTIMONIALS ─────── */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-white mb-5 text-[11px] font-semibold text-gray-600">
              <HeartHandshake size={11} className="text-pink-500" /> Loved worldwide
            </div>
            <h2 className="text-[40px] md:text-[52px] font-black tracking-tight text-gray-900" style={{ fontFamily: "'DM Sans', system-ui" }}>
              Trusted by 420,000+<br />freelancers.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl border border-gray-200 bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, k) => <Star key={k} size={12} fill="#F59E0B" stroke="#F59E0B" />)}
                </div>
                <p className="text-[13px] text-gray-600 leading-relaxed mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-[12px] shrink-0"
                    style={{ backgroundColor: t.color }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-gray-900">{t.name}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────── FAQ ─────── */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-white mb-5 text-[11px] font-semibold text-gray-600">
              <MessageCircle size={11} className="text-blue-500" /> Common questions
            </div>
            <h2 className="text-[40px] md:text-[52px] font-black tracking-tight text-gray-900" style={{ fontFamily: "'DM Sans', system-ui" }}>
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
                transition={{ delay: i * 0.06 }}
                className="rounded-xl border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-[14px] font-semibold text-gray-800">{f.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 shrink-0 ml-4 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-5 text-[13px] text-gray-500 leading-relaxed border-t border-gray-100"
                        style={{ paddingTop: "16px" }}>
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
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl bg-gray-900 p-14 md:p-20 text-center overflow-hidden"
          >
            <div
              className="absolute inset-0 pointer-events-none opacity-30"
              style={{ background: "radial-gradient(circle at 30% 0%, rgba(99,102,241,0.6), transparent 50%), radial-gradient(circle at 70% 100%, rgba(59,130,246,0.4), transparent 50%)" }}
            />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 mb-8 text-[11px] font-semibold text-white/70">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Platform status: All systems operational
              </div>
              <h2 className="text-[40px] md:text-[60px] font-black text-white leading-tight tracking-tight mb-5" style={{ fontFamily: "'DM Sans', system-ui" }}>
                Ready to go global?
              </h2>
              <p className="text-white/60 text-[16px] mb-10 max-w-lg mx-auto leading-relaxed">
                Join 420,000+ freelancers earning on NexusGigs across 184 countries. Your first 5 Hustle Units are free.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <SignUpButton mode="modal">
                  <button className="px-9 py-4 rounded-full text-[14px] font-semibold text-gray-900 bg-white hover:bg-gray-100 transition-all hover:scale-[1.02] inline-flex items-center gap-2.5">
                    Create free account <ArrowRight size={15} />
                  </button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <button className="px-9 py-4 rounded-full text-[14px] font-semibold text-white/80 border border-white/15 hover:border-white/25 hover:text-white transition-all">
                    I already have one
                  </button>
                </SignInButton>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─────── FOOTER ─────── */}
      <footer className="border-t border-gray-100 py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-900">
                  <Terminal size={14} className="text-white" />
                </div>
                <span className="text-gray-900 font-black text-[17px]" style={{ fontFamily: "'DM Sans', system-ui" }}>
                  nexus<span className="text-blue-600">gigs</span>
                </span>
              </div>
              <p className="text-[13px] text-gray-400 max-w-xs leading-relaxed">
                The freelance economy, rebuilt for the world. Escrow-secured, instantly paid, globally connected.
              </p>
              <div className="mt-5 flex items-center gap-2 text-[11px] text-gray-400">
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
                <p className="text-[11px] font-bold tracking-widest text-gray-400 uppercase mb-4">{c.h}</p>
                <ul className="space-y-2.5">
                  {c.l.map((x) => (
                    <li key={x}>
                      <a href="#" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">{x}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-gray-400">
            <span>© {new Date().getFullYear()} NexusGigs Global Inc. · 184 Countries</span>
            <div className="flex items-center gap-5">
              <a href="mailto:hello@nexusgigs.com" className="flex items-center gap-1.5 hover:text-gray-700 transition-colors">
                <Mail size={11} /> hello@nexusgigs.com
              </a>
              <a href="#" className="flex items-center gap-1.5 hover:text-gray-700 transition-colors">
                <MessageCircle size={11} /> Live Chat
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
  <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-md w-full"
    >
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/60 p-12 text-center">
        <div className="w-20 h-20 rounded-2xl mx-auto mb-8 flex items-center justify-center bg-blue-50 border border-blue-100">
          <Mail size={36} className="text-blue-600" />
        </div>
        <h2 className="text-[28px] font-black text-gray-900 mb-3" style={{ fontFamily: "'DM Sans', system-ui" }}>Check your inbox</h2>
        <p className="text-[14px] text-gray-500 leading-relaxed mb-8">
          We sent a confirmation link to{" "}
          <span className="text-blue-600 font-semibold">{email || "your email"}</span>.
          Click it to activate your account.
        </p>
        <div className="space-y-2.5 mb-8">
          {["Open your email app", "Find the email from NexusGigs", "Click the confirmation link", "Return here to continue"].map((s, i) => (
            <div key={i} className="flex items-center gap-3 text-left p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white bg-gray-900 shrink-0">{i + 1}</div>
              <span className="text-[12px] font-medium text-gray-600">{s}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-2 text-[12px] text-gray-400">
          <RefreshCw size={12} />
          <span>Didn't receive it? Check your spam folder.</span>
        </div>
      </div>
    </motion.div>
  </div>
);

// ─────────────────────────────────────────────
// CONSENT SCREEN
// ─────────────────────────────────────────────

const ConsentScreen = ({ onContinue }: { onContinue: () => void }) => (
  <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-lg w-full"
    >
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/60 p-12 text-center">
        <div className="w-18 h-18 rounded-2xl mx-auto mb-8 flex items-center justify-center bg-gray-50 border border-gray-200">
          <Fingerprint size={32} className="text-gray-700" />
        </div>
        <h2 className="text-[28px] font-black text-gray-900 mb-4 leading-tight" style={{ fontFamily: "'DM Sans', system-ui" }}>
          Identity Verification
        </h2>
        <p className="text-[14px] text-gray-500 leading-relaxed mb-8">
          To maintain the quality and safety of the NexusGigs network, all new members complete a brief verification process. Takes about 3 minutes.
        </p>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: <Clock size={16} />, label: "3 min process" },
            { icon: <Lock size={16} />, label: "Encrypted data" },
            { icon: <ShieldCheck size={16} />, label: "GDPR compliant" },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center">
              <div className="text-gray-600 flex justify-center mb-2">{item.icon}</div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-gray-400 mb-8 leading-relaxed">
          By continuing, you agree to our{" "}
          <span className="text-blue-600 font-medium cursor-pointer">Terms of Service</span> and{" "}
          <span className="text-blue-600 font-medium cursor-pointer">Privacy Policy</span>.
          Your information will never be sold or shared.
        </p>

        <button
          onClick={onContinue}
          className="w-full py-4 rounded-xl text-[13px] font-semibold text-white bg-gray-900 hover:bg-gray-800 transition-all flex items-center justify-center gap-2.5"
        >
          <Shield size={15} /> I agree — let's verify
        </button>
      </div>
    </motion.div>
  </div>
);

// ─────────────────────────────────────────────
// PATH SELECTION
// ─────────────────────────────────────────────

const PathSelection = ({ onSelect }: { onSelect: (role: string) => void }) => (
  <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
    <div className="max-w-3xl w-full">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-900">
            <Terminal size={14} className="text-white" />
          </div>
          <span className="text-gray-900 font-black text-[17px]" style={{ fontFamily: "'DM Sans', system-ui" }}>
            nexus<span className="text-blue-600">gigs</span>
          </span>
        </div>
        <h2 className="text-[36px] md:text-[44px] font-black text-gray-900 mb-2" style={{ fontFamily: "'DM Sans', system-ui" }}>How are you joining?</h2>
        <p className="text-[14px] text-gray-400 font-medium">Choose your role on the platform</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-5">
        {[
          {
            role: "freelancer",
            icon: <UserIcon size={28} />,
            title: "I'm a freelancer",
            sub: "I want to find work & get paid",
            description: "Browse projects, apply to gigs, and earn securely with instant global payouts.",
            perks: ["Access verified job listings", "Build your reputation score", "M-Pesa, bank & crypto payouts", "Join exclusive talent networks"],
            badge: "For professionals",
          },
          {
            role: "client",
            icon: <Building2 size={28} />,
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
            className="group p-8 rounded-2xl bg-white border border-gray-200 text-left hover:border-gray-900 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gray-50 text-gray-700 group-hover:bg-gray-900 group-hover:text-white transition-colors">
                {opt.icon}
              </div>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest border border-gray-100 px-3 py-1 rounded-full">{opt.badge}</span>
            </div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{opt.sub}</p>
            <h3 className="text-[22px] font-black text-gray-900 mb-3" style={{ fontFamily: "'DM Sans', system-ui" }}>{opt.title}</h3>
            <p className="text-[13px] text-gray-500 mb-6 leading-relaxed">{opt.description}</p>
            <div className="space-y-2">
              {opt.perks.map((perk) => (
                <div key={perk} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center bg-green-100 shrink-0">
                    <Check size={9} className="text-green-600" />
                  </div>
                  <span className="text-[12px] text-gray-500">{perk}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-2 text-[13px] font-semibold text-gray-900 group-hover:gap-3 transition-all">
              Continue <ChevronRight size={15} />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// VETTING FORM — Streamlined with choices
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
];

type FormData = {
  legalName: string;
  phone: string;
  country: string;
  code: string;
  bio: string;
  skills: string[];
  job: string;
  yearsExp: string;
  portfolio: string;
  pay: string;
  idType: string;
  availability: string;
  hourlyRate: string;
};

const VettingForm = ({ role, onFinalize }: { role: string; onFinalize: () => void }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [data, setData] = useState<FormData>({
    legalName: "", phone: "", country: "Kenya", code: "+254",
    bio: "", skills: [], job: "Developer", yearsExp: "1–2 yrs",
    portfolio: "", pay: "M-Pesa", idType: "National ID",
    availability: "Full-time", hourlyRate: "$10–$25/hr",
  });

  const skillOptions = [
    "React", "Node.js", "Python", "UI/UX Design", "Figma",
    "TypeScript", "Flutter", "DevOps", "Data Science",
    "Copywriting", "SEO", "Video Editing", "Solidity", "AI/ML"
  ];

  const toggleSkill = (s: string) => {
    setData((d) => ({
      ...d,
      skills: d.skills.includes(s) ? d.skills.filter((x) => x !== s) : [...d.skills, s],
    }));
  };

  const update = (k: keyof FormData, v: string) =>
    setData((d) => ({ ...d, [k]: v }));

  const handleCountry = (name: string) => {
    const found = countries.find((c) => c.name === name);
    setData((d) => ({ ...d, country: name, code: found?.code || "+254" }));
  };

  const inputBase = "w-full rounded-xl px-4 py-3.5 text-[14px] text-gray-900 outline-none transition-all border border-gray-200 bg-white placeholder-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-100";
  const labelBase = "block text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2";

  const ChoiceButton = ({
    selected, onClick, children, className = ""
  }: { selected: boolean; onClick: () => void; children: React.ReactNode; className?: string }) => (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
        selected
          ? "border-gray-900 bg-gray-900 text-white"
          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
      } ${className}`}
    >
      {selected && (
        <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-white flex items-center justify-center">
          <Check size={9} className="text-gray-900" />
        </span>
      )}
      {children}
    </button>
  );

  const stepTitles = ["Your Profile", "Skills & Availability", "Verification & Payout"];
  const stepDescs = ["Tell us who you are", "What you do & when you work", "Secure your account"];

  const jobRoles = [
    { id: "Developer", icon: <Code size={16} /> },
    { id: "Designer", icon: <Layers3 size={16} /> },
    { id: "Data Scientist", icon: <BarChart3 size={16} /> },
    { id: "Marketer", icon: <TrendingUp size={16} /> },
    { id: "Writer", icon: <Award size={16} /> },
    { id: "Video Editor", icon: <PlayCircle size={16} /> },
  ];

  const experienceLevels = ["< 1 yr", "1–2 yrs", "3–5 yrs", "5–10 yrs", "10+ yrs"];
  const availabilityOptions = ["Full-time", "Part-time", "Weekends only", "Project-based"];
  const rateOptions = ["< $10/hr", "$10–$25/hr", "$25–$50/hr", "$50–$100/hr", "$100+/hr"];
  const paymentOptions = [
    { id: "M-Pesa", icon: <Smartphone size={16} />, desc: "Instant STK push · Kenya" },
    { id: "Bank Transfer", icon: <Landmark size={16} />, desc: "Local or international wire" },
    { id: "Crypto (USDT)", icon: <Bitcoin size={16} />, desc: "USDT on TRC20 · Global" },
  ];
  const idTypes = ["National ID", "Passport", "Alien ID", "Student ID"];

  const canProceed = step === 1
    ? data.legalName.trim().length > 1 && data.phone.length >= 8
    : step === 2
    ? data.skills.length > 0
    : true;

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-gray-50">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-900">
              <Terminal size={14} className="text-white" />
            </div>
            <span className="text-gray-900 font-black text-[17px]" style={{ fontFamily: "'DM Sans', system-ui" }}>
              nexus<span className="text-blue-600">gigs</span>
            </span>
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1">Step {step} of {totalSteps}</p>
          <h2 className="text-[26px] font-black text-gray-900" style={{ fontFamily: "'DM Sans', system-ui" }}>{stepTitles[step - 1]}</h2>
          <p className="text-[13px] text-gray-400 mt-1">{stepDescs[step - 1]}</p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5 mb-8">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className="h-1 rounded-full flex-1 transition-all duration-500"
              style={{
                background: i < step ? "#111827" : "#E5E7EB",
              }}
            />
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-7">
            <AnimatePresence mode="wait">

              {/* ── STEP 1: Profile ── */}
              {step === 1 && (
                <motion.div
                  key="s1"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  className="space-y-5"
                >
                  <div>
                    <label className={labelBase}>Full Legal Name</label>
                    <input
                      value={data.legalName}
                      onChange={(e) => update("legalName", e.target.value)}
                      className={inputBase}
                      placeholder="e.g. Jane Kamau"
                    />
                  </div>

                  <div>
                    <label className={labelBase}>Country</label>
                    <select
                      value={data.country}
                      onChange={(e) => handleCountry(e.target.value)}
                      className={inputBase}
                    >
                      {countries.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.flag} {c.name} ({c.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelBase}>WhatsApp / Phone</label>
                    <div className="flex gap-2">
                      <div className="px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-[14px] font-semibold text-gray-500 shrink-0">
                        {data.code}
                      </div>
                      <input
                        value={data.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        className={`${inputBase} flex-1`}
                        placeholder="712 345 678"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelBase}>Short bio</label>
                    <textarea
                      value={data.bio}
                      onChange={(e) => update("bio", e.target.value)}
                      rows={3}
                      className={inputBase}
                      placeholder="2–3 sentences about who you are and what you do..."
                    />
                    <p className="text-[10px] text-gray-400 mt-1.5 ml-1">This appears on your public profile</p>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 2: Skills & Availability ── */}
              {step === 2 && (
                <motion.div
                  key="s2"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  className="space-y-6"
                >
                  {/* Role */}
                  <div>
                    <label className={labelBase}>Primary Role</label>
                    <div className="grid grid-cols-3 gap-2">
                      {jobRoles.map((j) => (
                        <ChoiceButton
                          key={j.id}
                          selected={data.job === j.id}
                          onClick={() => update("job", j.id)}
                        >
                          <span className="text-inherit opacity-70">{j.icon}</span>
                          <span className="text-[12px] font-semibold">{j.id}</span>
                        </ChoiceButton>
                      ))}
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <label className={labelBase}>Years of Experience</label>
                    <div className="flex flex-wrap gap-2">
                      {experienceLevels.map((y) => (
                        <button
                          key={y}
                          type="button"
                          onClick={() => update("yearsExp", y)}
                          className={`px-4 py-2.5 rounded-xl text-[12px] font-semibold border transition-all ${
                            data.yearsExp === y
                              ? "bg-gray-900 text-white border-gray-900"
                              : "border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <label className={labelBase}>Top Skills <span className="text-gray-300">(select all that apply)</span></label>
                    <div className="flex flex-wrap gap-2">
                      {skillOptions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleSkill(s)}
                          className={`px-3.5 py-2 rounded-full text-[12px] font-medium border transition-all ${
                            data.skills.includes(s)
                              ? "bg-blue-600 text-white border-blue-600"
                              : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
                          }`}
                        >
                          {data.skills.includes(s) ? "✓ " : ""}{s}
                        </button>
                      ))}
                    </div>
                    {data.skills.length === 0 && (
                      <p className="text-[11px] text-red-400 mt-2 ml-1">Please select at least one skill</p>
                    )}
                  </div>

                  {/* Availability */}
                  <div>
                    <label className={labelBase}>Availability</label>
                    <div className="grid grid-cols-2 gap-2">
                      {availabilityOptions.map((a) => (
                        <ChoiceButton key={a} selected={data.availability === a} onClick={() => update("availability", a)}>
                          <span className="text-[12px] font-semibold">{a}</span>
                        </ChoiceButton>
                      ))}
                    </div>
                  </div>

                  {/* Rate */}
                  <div>
                    <label className={labelBase}>Expected Hourly Rate</label>
                    <div className="flex flex-wrap gap-2">
                      {rateOptions.map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => update("hourlyRate", r)}
                          className={`px-4 py-2.5 rounded-xl text-[12px] font-semibold border transition-all ${
                            data.hourlyRate === r
                              ? "bg-gray-900 text-white border-gray-900"
                              : "border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Portfolio (optional) */}
                  <div>
                    <label className={labelBase}>Portfolio / GitHub <span className="text-gray-300">(optional)</span></label>
                    <div className="relative">
                      <Link2 size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        value={data.portfolio}
                        onChange={(e) => update("portfolio", e.target.value)}
                        className={`${inputBase} pl-10`}
                        placeholder="https://yourportfolio.com"
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1.5 ml-1">Adding a portfolio increases hire rate by 3×</p>
                  </div>
                </motion.div>
              )}

              {/* ── STEP 3: Verification & Payout ── */}
              {step === 3 && (
                <motion.div
                  key="s3"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <ShieldCheck size={18} className="text-blue-600 shrink-0" />
                    <div>
                      <p className="text-[12px] font-bold text-blue-800">End-to-End Encrypted</p>
                      <p className="text-[10px] text-blue-500 font-medium">All payment data secured with AES-256</p>
                    </div>
                  </div>

                  {/* ID Type */}
                  <div>
                    <label className={labelBase}>ID Verification Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {idTypes.map((id) => (
                        <ChoiceButton key={id} selected={data.idType === id} onClick={() => update("idType", id)}>
                          <span className="text-[12px] font-semibold">{id}</span>
                        </ChoiceButton>
                      ))}
                    </div>
                  </div>

                  {/* Payment method */}
                  <div>
                    <label className={labelBase}>Primary Payout Method</label>
                    <div className="space-y-2">
                      {paymentOptions.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => update("pay", p.id)}
                          className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                            data.pay === p.id
                              ? "border-gray-900 bg-gray-50"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                              data.pay === p.id ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {p.icon}
                          </div>
                          <div className="flex-1">
                            <p className={`text-[13px] font-semibold ${data.pay === p.id ? "text-gray-900" : "text-gray-700"}`}>{p.id}</p>
                            <p className="text-[11px] text-gray-400">{p.desc}</p>
                          </div>
                          {data.pay === p.id && (
                            <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
                              <Check size={10} className="text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Profile summary */}
                  <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Profile Summary</p>
                    <div className="space-y-2 text-[12px]">
                      {[
                        { label: "Name", value: data.legalName || "—" },
                        { label: "Role", value: data.job },
                        { label: "Skills", value: data.skills.length ? `${data.skills.length} selected` : "—" },
                        { label: "Availability", value: data.availability },
                        { label: "Rate", value: data.hourlyRate },
                        { label: "Payout", value: data.pay },
                      ].map((r) => (
                        <div key={r.label} className="flex justify-between">
                          <span className="text-gray-400">{r.label}</span>
                          <span className="font-semibold text-gray-700">{r.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex gap-3 mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="px-6 py-4 rounded-xl text-[13px] font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all"
                >
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={() => (step < totalSteps ? setStep((s) => s + 1) : onFinalize())}
                disabled={!canProceed}
                className="flex-1 py-4 rounded-xl text-[13px] font-semibold text-white bg-gray-900 hover:bg-gray-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
              >
                {step === totalSteps ? (
                  <><Rocket size={15} /> Launch My Profile</>
                ) : (
                  <>Continue <ArrowRight size={14} /></>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-center text-[11px] text-gray-400 mt-5">
          <ShieldCheck size={11} className="inline mr-1 text-green-500" />
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
    { label: "Encrypting your profile data", icon: <Lock size={14} /> },
    { label: "Generating your trust score", icon: <Shield size={14} /> },
    { label: "Connecting to talent network", icon: <Wifi size={14} /> },
    { label: "Syncing payment relays", icon: <Zap size={14} /> },
    { label: "Finalizing your workspace", icon: <Rocket size={14} /> },
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 text-center">
      <div className="max-w-sm w-full">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-900">
            <Terminal size={18} className="text-white" />
          </div>
          <span className="text-gray-900 font-black text-[20px]" style={{ fontFamily: "'DM Sans', system-ui" }}>
            nexus<span className="text-blue-600">gigs</span>
          </span>
        </div>

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-14 h-14 rounded-full border-2 border-gray-200 border-t-gray-900 mx-auto mb-8"
        />

        <h2 className="text-[22px] font-black text-gray-900 mb-1" style={{ fontFamily: "'DM Sans', system-ui" }}>
          Initializing your workspace
        </h2>
        <p className="text-[13px] text-gray-400 mb-10">
          Welcome, <span className="text-gray-700 font-semibold">{name || "Operator"}</span>
        </p>

        {/* Progress */}
        <div className="mb-6">
          <div className="h-1.5 rounded-full overflow-hidden bg-gray-200 mb-3">
            <div
              className="h-full rounded-full bg-gray-900 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-semibold text-gray-400">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Task list */}
        <div className="space-y-2 text-left">
          {tasks.map((task, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: i <= currentTask ? 1 : 0.25, x: 0 }}
              transition={{ delay: i * 0.2 }}
              className={`flex items-center gap-3 p-3 rounded-xl ${
                i === currentTask ? "bg-white border border-gray-200" : "bg-transparent"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                  i < currentTask ? "bg-gray-900 text-white" : i === currentTask ? "text-blue-600" : "text-gray-300"
                }`}
              >
                {i < currentTask ? <Check size={10} /> : task.icon}
              </div>
              <span
                className={`text-[12px] font-medium ${
                  i === currentTask ? "text-gray-700" : i < currentTask ? "text-gray-400 line-through" : "text-gray-300"
                }`}
              >
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
        className="fixed inset-0 z-999 flex items-center justify-center pointer-events-none bg-white/90 backdrop-blur-sm"
      >
        <motion.div
          initial={{ y: 400, scale: 0.5, opacity: 1 }}
          animate={{ y: -1500, scale: 4, opacity: [1, 1, 0] }}
          transition={{ duration: 1.1, ease: [0.36, 0, 0.66, -0.56] }}
          className="flex flex-col items-center"
        >
          <Rocket size={60} className="text-gray-900" />
          <div
            className="w-px h-40 mt-2"
            style={{ background: "linear-gradient(to bottom, #111827, transparent)" }}
          />
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
    return <div className="min-h-screen bg-white" />;
  }

  if (step === "landing") return <LandingPage />;
  if (step === "email-confirm") return <EmailConfirmScreen email={user?.emailAddresses?.[0]?.emailAddress} />;
  if (step === "consent") return <ConsentScreen onContinue={() => setStep("path")} />;
  if (step === "path") return <PathSelection onSelect={handleRoleSelect} />;
  if (step === "vetting") return <VettingForm role={selectedRole || "freelancer"} onFinalize={handleFinalize} />;
  if (step === "loading") return <LoadingScreen name={user?.firstName || undefined} />;

  if (step === "dashboard") {
    return (
      <main className="min-h-screen bg-white">
        <RocketWarp active={isWarping} />
        {selectedRole === "freelancer"
          ? <FreelancerView jobs={[]} userMetadata={user?.publicMetadata || {}} />
          : <ClientView jobs={[]} />}
      </main>
    );
  }

  return null;
}
