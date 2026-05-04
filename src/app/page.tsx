"use client";

import { useUser, SignInButton, SignUpButton, SignOutButton } from "@clerk/nextjs";
import { useEffect, useState, useCallback, useRef } from "react";
import { FreelancerView } from "@/components/dashboard/FreelancerView";
import { ClientView } from "@/components/dashboard/ClientView";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Shield, Zap, Globe, Cpu, Lock, Rocket,
  Sparkles, Box, Terminal, Target, Users, DollarSign,
  Briefcase, ChevronRight, Activity, Code, Database,
  ArrowRight, CheckCircle2, UserPlus, Fingerprint, Star, Send, Layers, QrCode,
  ShieldCheck, Landmark, Smartphone, GraduationCap, Link2, ChevronDown, X,
  Search, RefreshCw, Eye, EyeOff, Calculator, Settings, BadgeCheck, Wifi,
  User as UserIcon, MousePointer2, ListChecks, Check, Mail, MapPin, Clock,
  TrendingUp, Award, Heart, Coffee
} from "lucide-react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

type Step = "checking" | "landing" | "email-confirm" | "consent" | "path" | "vetting" | "loading" | "dashboard";

// ─────────────────────────────────────────────
// GALAXY BACKGROUND
// ─────────────────────────────────────────────

const ParticleField = () => {
  const particles = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.5 + 0.3,
    duration: 15 + Math.random() * 25,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.6 + 0.1,
  }));

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" style={{ background: "linear-gradient(135deg, #020617 0%, #050d24 50%, #020917 100%)" }}>
      {/* Nebula blobs */}
      <div className="absolute top-[-20%] right-[-10%] w-200 h-200 rounded-full opacity-[0.07]" style={{ background: "radial-gradient(circle, #3b82f6 0%, #1d4ed8 40%, transparent 70%)", filter: "blur(60px)" }} />
      <div className="absolute bottom-[-20%] left-[-10%] w-175 h-175 rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, #6366f1 0%, #4338ca 40%, transparent 70%)", filter: "blur(60px)" }} />
      <div className="absolute top-[40%] left-[30%] w-125 h-125 rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, #00f2ff 0%, transparent 70%)", filter: "blur(80px)" }} />

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

      {/* Stars */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ opacity: [p.opacity * 0.3, p.opacity, p.opacity * 0.3], scale: [1, 1.5, 1] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Shooting stars */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`shoot-${i}`}
          className="absolute h-px"
          style={{ top: `${20 + i * 25}%`, width: "200px", background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.8), transparent)" }}
          animate={{ x: ["-300px", "110vw"], opacity: [0, 1, 0] }}
          transition={{ duration: 2.5, delay: 3 + i * 5, repeat: Infinity, repeatDelay: 8 + i * 4, ease: "easeIn" }}
        />
      ))}
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
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-999 flex items-center justify-center pointer-events-none"
        style={{ background: "rgba(2,6,23,0.9)", backdropFilter: "blur(20px)" }}
      >
        <motion.div
          initial={{ y: 600, scale: 0.3, opacity: 1 }}
          animate={{ y: -1800, scale: 5, opacity: [1, 1, 0] }}
          transition={{ duration: 1.1, ease: [0.36, 0, 0.66, -0.56] }}
          className="relative flex flex-col items-center"
        >
          <Rocket size={100} className="text-[#00f2ff]" style={{ filter: "drop-shadow(0 0 40px #00f2ff)" }} />
          <div className="w-1 h-64 mt-2" style={{ background: "linear-gradient(to bottom, #00f2ff, #3b82f6, transparent)" }} />
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-blue-400"
              style={{ width: 4 + i * 2, height: 4 + i * 2, left: `${-20 + i * 8}px`, top: `${60 + i * 15}px` }}
              animate={{ opacity: [1, 0], scale: [1, 0], x: [-10 + i * 4, -30 + i * 8] }}
              transition={{ duration: 0.4, delay: i * 0.05, repeat: Infinity }}
            />
          ))}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─────────────────────────────────────────────
// STAT COUNTER
// ─────────────────────────────────────────────

const AnimatedCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

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

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

// ─────────────────────────────────────────────
// GLASS CARD
// ─────────────────────────────────────────────

const GlassCard = ({ children, className = "", hover = true }: { children: React.ReactNode; className?: string; hover?: boolean }) => (
  <div className={`relative rounded-3xl ${hover ? "hover:border-white/15 hover:-translate-y-1" : ""} transition-all duration-300 ${className}`}
    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>
    {children}
  </div>
);

// ─────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────

const Nav = ({ onSignIn, onSignUp }: { onSignIn?: () => void; onSignUp?: () => void }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 w-full z-100 transition-all duration-500"
      style={{ background: scrolled ? "rgba(2,6,23,0.8)" : "transparent", backdropFilter: scrolled ? "blur(24px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #00f2ff, #3b82f6)" }}>
            <Terminal size={16} className="text-[#020617]" />
          </div>
          <span className="text-white font-black text-lg tracking-tight" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
            NEXUS<span style={{ color: "#3b82f6" }}>GIGS</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {["Features", "How It Works", "Pricing", "Talent"].map((item) => (
            <a key={item} href="#" className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">{item}</a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <SignInButton mode="modal">
            <button className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors px-4 py-2">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white transition-all hover:scale-105 active:scale-95"
              style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", boxShadow: "0 0 30px rgba(59,130,246,0.35)" }}>
              Join Free
            </button>
          </SignUpButton>
        </div>
      </div>
    </motion.header>
  );
};

// ─────────────────────────────────────────────
// LANDING PAGE
// ─────────────────────────────────────────────

const LandingPage = () => {
  const heroStats = [
    { value: 12400, suffix: "+", label: "Professionals" },
    { value: 98, suffix: "%", label: "Satisfaction" },
    { value: 3200, suffix: "+", label: "Projects Done" },
    { value: 45, suffix: "M+", label: "KES Paid Out" },
  ];

  const steps = [
    { icon: <UserPlus size={20} />, title: "Create Your Profile", desc: "Sign up and complete our quick vetting process to verify your identity and skills." },
    { icon: <BadgeCheck size={20} />, title: "Get Verified", desc: "Our AI-powered system reviews your credentials and assigns you a trust score." },
    { icon: <Search size={20} />, title: "Find Opportunities", desc: "Browse curated job listings matched to your skills and location preferences." },
    { icon: <DollarSign size={20} />, title: "Earn Securely", desc: "Get paid instantly via M-Pesa, bank transfer, or USDT with escrow protection." },
  ];

  const features = [
    { icon: <ShieldCheck size={22} />, title: "End-to-End Encrypted", desc: "All data and transactions secured with military-grade encryption." },
    { icon: <Zap size={22} />, title: "Instant Payouts", desc: "Receive payments within minutes via M-Pesa STK push — no delays." },
    { icon: <Globe size={22} />, title: "Work Anywhere", desc: "Connect with clients globally. Your location is your superpower." },
    { icon: <Cpu size={22} />, title: "AI Skill Matching", desc: "Our system matches you to the most relevant opportunities automatically." },
    { icon: <Users size={22} />, title: "Verified Community", desc: "Every member passes identity verification before joining the network." },
    { icon: <TrendingUp size={22} />, title: "Career Growth Tools", desc: "Track earnings, build reputation, and level up your profile over time." },
  ];

  const whyRemote = [
    { icon: <Clock size={20} />, stat: "2.4× more", label: "productive than office workers", color: "#3b82f6" },
    { icon: <Heart size={20} />, stat: "87%", label: "report better work-life balance", color: "#6366f1" },
    { icon: <DollarSign size={20} />, stat: "KES 50K+", label: "average monthly remote earnings", color: "#00f2ff" },
    { icon: <Globe size={20} />, stat: "195", label: "countries you can work from", color: "#8b5cf6" },
  ];

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <ParticleField />
      <Nav />

      {/* HERO */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-20 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="max-w-5xl mx-auto">

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)" }}>
            <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">Elite Tech Protocol • Now Accepting Applications</span>
          </motion.div>

          <h1 className="text-6xl md:text-[7.5rem] font-black leading-[0.85] tracking-[-0.04em] mb-8"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
            <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="block text-white">
              Your Skills.
            </motion.span>
            <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="block"
              style={{ background: "linear-gradient(135deg, #3b82f6 0%, #00f2ff 50%, #6366f1 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Global Income.
            </motion.span>
            <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="block text-white">
              Zero Limits.
            </motion.span>
          </h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="max-w-xl mx-auto text-gray-400 text-lg leading-relaxed mb-12">
            NexusGigs connects Africa's top talent with global clients. Vetted professionals. Secure escrow payments. Real remote freedom.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <SignUpButton mode="modal">
              <button className="px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest text-white flex items-center gap-3 justify-center transition-all hover:scale-105 active:scale-95"
                style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", boxShadow: "0 0 40px rgba(59,130,246,0.4)" }}>
                Start Earning Today <ArrowRight size={14} />
              </button>
            </SignUpButton>
            <button className="px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest text-gray-300 flex items-center gap-3 justify-center transition-all hover:text-white"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <Briefcase size={14} /> Hire Talent
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {heroStats.map((stat, i) => (
              <GlassCard key={i} className="p-5 text-center" hover={false}>
                <p className="text-3xl font-black text-white mb-1" style={{ fontFamily: "'Space Grotesk', system-ui" }}>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">{stat.label}</p>
              </GlassCard>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-600">
          <ChevronDown size={20} />
        </motion.div>
      </section>

      {/* WHY REMOTE */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4" style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
              <Globe size={11} className="text-indigo-400" />
              <span className="text-indigo-400 text-[9px] font-bold uppercase tracking-widest">The Remote Revolution</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight" style={{ fontFamily: "'Space Grotesk', system-ui" }}>
              Why Working Remote<br />Changes Everything
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">The world has shifted. Top talent no longer needs to be in the same city as their clients. Your geography should never limit your potential.</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {whyRemote.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <GlassCard className="p-6 text-center h-full">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: `${item.color}20`, color: item.color }}>
                    {item.icon}
                  </div>
                  <p className="text-2xl font-black text-white mb-1" style={{ fontFamily: "'Space Grotesk', system-ui", color: item.color }}>{item.stat}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">{item.label}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <GlassCard className="p-8">
              <h3 className="text-2xl font-black text-white mb-4" style={{ fontFamily: "'Space Grotesk', system-ui" }}>Built for African Talent</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">Kenya, Nigeria, Uganda, Tanzania — Africa is home to some of the world's fastest-growing tech talent. NexusGigs is built specifically to connect this talent with global opportunities, with payment rails that actually work here.</p>
              {["M-Pesa instant payouts", "Multi-currency support", "Local bank transfers", "USDT/Crypto options"].map(f => (
                <div key={f} className="flex items-center gap-3 mb-2">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "rgba(59,130,246,0.2)" }}>
                    <Check size={10} className="text-blue-400" />
                  </div>
                  <span className="text-gray-300 text-sm">{f}</span>
                </div>
              ))}
            </GlassCard>
            <GlassCard className="p-8">
              <h3 className="text-2xl font-black text-white mb-4" style={{ fontFamily: "'Space Grotesk', system-ui" }}>Global Clients, Local Freedom</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">Work on projects from clients in the US, UK, Europe, and beyond — while keeping the lifestyle you love. Set your own hours, choose your projects, build your reputation.</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Avg. Hourly Rate", value: "KES 2,500+" },
                  { label: "Top Earner/Month", value: "KES 180K+" },
                  { label: "Projects/Month", value: "200+" },
                  { label: "Response Time", value: "< 2 hrs" },
                ].map(s => (
                  <div key={s.label} className="p-3 rounded-2xl" style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.1)" }}>
                    <p className="text-blue-300 font-black text-lg" style={{ fontFamily: "'Space Grotesk', system-ui" }}>{s.value}</p>
                    <p className="text-gray-500 text-[10px] uppercase tracking-wide">{s.label}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4" style={{ background: "rgba(0,242,255,0.1)", border: "1px solid rgba(0,242,255,0.2)" }}>
              <ListChecks size={11} className="text-cyan-400" />
              <span className="text-cyan-400 text-[9px] font-bold uppercase tracking-widest">Simple Process</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white" style={{ fontFamily: "'Space Grotesk', system-ui" }}>
              Start in 4 Steps
            </h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-8 top-12 bottom-12 w-px hidden md:block" style={{ background: "linear-gradient(to bottom, transparent, rgba(59,130,246,0.4), transparent)" }} />
            <div className="space-y-6">
              {steps.map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <GlassCard className="p-6 md:p-8 flex items-start gap-6 md:ml-16">
                    <div className="shrink-0">
                      <div className="w-14 h-14 md:absolute md:-left-7 md:top-1/2 md:-translate-y-1/2 rounded-2xl flex items-center justify-center relative"
                        style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.3), rgba(99,102,241,0.3))", border: "1px solid rgba(59,130,246,0.3)" }}>
                        <div className="text-blue-400">{step.icon}</div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white"
                          style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
                          {i + 1}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white mb-2" style={{ fontFamily: "'Space Grotesk', system-ui" }}>{step.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-4" style={{ fontFamily: "'Space Grotesk', system-ui" }}>
              Everything You Need<br /><span style={{ color: "#3b82f6" }}>To Succeed</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <GlassCard className="p-8 h-full">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6" }}>
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-black text-white mb-3" style={{ fontFamily: "'Space Grotesk', system-ui" }}>{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <GlassCard className="p-16" hover={false}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="w-20 h-20 rounded-3xl mx-auto mb-8 flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(99,102,241,0.2))", border: "1px solid rgba(59,130,246,0.3)" }}>
                <Rocket size={36} className="text-blue-400" />
              </div>
              <h2 className="text-5xl font-black text-white mb-4" style={{ fontFamily: "'Space Grotesk', system-ui" }}>Ready to Launch?</h2>
              <p className="text-gray-400 mb-10 text-lg">Join thousands of professionals already earning remotely on NexusGigs.</p>
              <SignUpButton mode="modal">
                <button className="px-14 py-5 rounded-full font-black text-sm uppercase tracking-widest text-white inline-flex items-center gap-3 transition-all hover:scale-105 active:scale-95"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", boxShadow: "0 0 60px rgba(59,130,246,0.5)" }}>
                  Create Free Account <ArrowRight size={16} />
                </button>
              </SignUpButton>
            </motion.div>
          </GlassCard>
        </div>
      </section>

      <footer className="relative z-10 py-10 px-6 border-t border-white/5 text-center">
        <p className="text-gray-600 text-[11px] uppercase tracking-widest">© 2024 NexusGigs • Built for Africa's Remote Future</p>
      </footer>
    </div>
  );
};

// ─────────────────────────────────────────────
// EMAIL CONFIRMATION SCREEN
// ─────────────────────────────────────────────

const EmailConfirmScreen = ({ email }: { email?: string }) => (
  <div className="min-h-screen flex items-center justify-center p-6 relative" style={{ background: "#020617" }}>
    <ParticleField />
    <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.6 }}
      className="max-w-md w-full text-center relative z-10">
      <GlassCard className="p-12" hover={false}>
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 rounded-3xl mx-auto mb-8 flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(99,102,241,0.2))", border: "1px solid rgba(59,130,246,0.4)" }}>
          <Mail size={40} className="text-blue-400" />
        </motion.div>

        <h2 className="text-3xl font-black text-white mb-3" style={{ fontFamily: "'Space Grotesk', system-ui" }}>
          Check Your Inbox
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          We sent a confirmation link to <span className="text-blue-400 font-bold">{email || "your email"}</span>. Click it to activate your NexusGigs account.
        </p>

        <div className="space-y-3 mb-8">
          {["Open your email app", "Find the email from NexusGigs", "Click the confirmation link", "Return here to continue"].map((s, i) => (
            <div key={i} className="flex items-center gap-3 text-left p-3 rounded-2xl" style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.1)" }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0"
                style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
                {i + 1}
              </div>
              <span className="text-gray-300 text-[11px] font-semibold uppercase tracking-wide">{s}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
          <RefreshCw size={12} />
          <span>Didn't receive it? Check your spam folder.</span>
        </div>
      </GlassCard>
    </motion.div>
  </div>
);

// ─────────────────────────────────────────────
// CONSENT / INTRO SCREEN
// ─────────────────────────────────────────────

const ConsentScreen = ({ onContinue }: { onContinue: () => void }) => (
  <div className="min-h-screen flex items-center justify-center p-6 relative" style={{ background: "#020617" }}>
    <ParticleField />
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
      className="max-w-lg w-full relative z-10">
      <GlassCard className="p-12 text-center" hover={false}>
        <div className="w-20 h-20 rounded-3xl mx-auto mb-8 flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(99,102,241,0.15))", border: "1px solid rgba(59,130,246,0.3)" }}>
          <Fingerprint size={36} className="text-blue-400" />
        </div>

        <h2 className="text-3xl font-black text-white mb-4 leading-tight" style={{ fontFamily: "'Space Grotesk', system-ui" }}>
          Identity Verification<br />Protocol
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          To maintain the quality and safety of the NexusGigs network, all new members complete a brief verification process. This takes about 3 minutes.
        </p>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: <Clock size={16} />, label: "3 min process" },
            { icon: <Lock size={16} />, label: "Encrypted data" },
            { icon: <ShieldCheck size={16} />, label: "GDPR compliant" },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-2xl text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="text-blue-400 flex justify-center mb-2">{item.icon}</div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{item.label}</p>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-gray-600 mb-8 leading-relaxed">
          By continuing, you agree to our <span className="text-blue-400">Terms of Service</span> and <span className="text-blue-400">Privacy Policy</span>. Your information will never be sold or shared with third parties.
        </p>

        <button onClick={onContinue}
          className="w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest text-white flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", boxShadow: "0 0 40px rgba(59,130,246,0.35)" }}>
          <Shield size={16} /> I Agree — Let's Verify
        </button>
      </GlassCard>
    </motion.div>
  </div>
);

// ─────────────────────────────────────────────
// PATH SELECTION
// ─────────────────────────────────────────────

const PathSelection = ({ onSelect }: { onSelect: (role: string) => void }) => (
  <div className="min-h-screen flex items-center justify-center p-6 relative" style={{ background: "#020617" }}>
    <ParticleField />
    <div className="max-w-4xl w-full relative z-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-3" style={{ fontFamily: "'Space Grotesk', system-ui" }}>I'm Here To...</h2>
        <p className="text-gray-400 text-sm">Choose your role on the platform</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {[
          {
            role: "freelancer",
            icon: <UserIcon size={48} />,
            title: "Find & Do Work",
            sub: "I am a professional",
            description: "Browse projects, get hired, and earn securely with instant payouts.",
            perks: ["Access verified job listings", "Build your reputation score", "Get paid via M-Pesa or bank", "Join exclusive talent networks"],
            color: "#3b82f6",
            gradient: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(99,102,241,0.1))",
            border: "rgba(59,130,246,0.3)",
          },
          {
            role: "client",
            icon: <Briefcase size={48} />,
            title: "Hire & Manage",
            sub: "I need talent",
            description: "Post projects, hire vetted professionals, and pay with full escrow protection.",
            perks: ["Access 12,000+ verified talent", "Escrow payment protection", "AI-powered talent matching", "Milestone-based contracts"],
            color: "#8b5cf6",
            gradient: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(99,102,241,0.1))",
            border: "rgba(139,92,246,0.3)",
          },
        ].map((opt, i) => (
          <motion.button key={opt.role} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.15 }}
            onClick={() => onSelect(opt.role)}
            className="p-10 rounded-3xl text-left group transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02]"
            style={{ background: opt.gradient, border: `1px solid ${opt.border}`, boxShadow: `0 0 60px ${opt.color}15` }}>
            <div className="flex items-start justify-between mb-8">
              <div className="p-4 rounded-2xl" style={{ background: `${opt.color}20`, color: opt.color }}>
                {opt.icon}
              </div>
              <ChevronRight size={20} className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all mt-2" />
            </div>
            <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: opt.color }}>{opt.sub}</p>
            <h3 className="text-3xl font-black text-white mb-3" style={{ fontFamily: "'Space Grotesk', system-ui" }}>{opt.title}</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">{opt.description}</p>
            <div className="space-y-2">
              {opt.perks.map(perk => (
                <div key={perk} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: `${opt.color}30` }}>
                    <Check size={9} style={{ color: opt.color }} />
                  </div>
                  <span className="text-gray-300 text-xs">{perk}</span>
                </div>
              ))}
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
];

type FormData = {
  legalName: string; username: string; phone: string; country: string; code: string;
  bio: string; skills: string[]; job: string; yearsExp: string; school: string;
  portfolio: string; linkedin: string; github: string; pay: string; idType: string;
};

const VettingForm = ({ role, onFinalize }: { role: string; onFinalize: () => void }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [data, setData] = useState<FormData>({
    legalName: "", username: "", phone: "", country: "Kenya", code: "+254",
    bio: "", skills: [], job: "Developer", yearsExp: "1-2", school: "",
    portfolio: "", linkedin: "", github: "", pay: "M-Pesa", idType: "National ID",
  });

  const skillOptions = ["React", "Node.js", "Python", "UI/UX Design", "Figma", "TypeScript", "Flutter", "DevOps", "Data Science", "Copywriting", "SEO", "Video Editing"];

  const toggleSkill = (s: string) => {
    setData(d => ({ ...d, skills: d.skills.includes(s) ? d.skills.filter(x => x !== s) : [...d.skills, s] }));
  };

  const update = (k: keyof FormData, v: string) => setData(d => ({ ...d, [k]: v }));

  const handleCountry = (name: string) => {
    const found = countries.find(c => c.name === name);
    setData(d => ({ ...d, country: name, code: found?.code || "+254" }));
  };

  const inputClass = "w-full bg-transparent rounded-2xl px-4 py-3.5 text-sm text-white outline-none transition-all placeholder-gray-600";
  const inputStyle = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" };
  const focusStyle = { border: "1px solid rgba(59,130,246,0.5)", boxShadow: "0 0 20px rgba(59,130,246,0.1)" };

  const labelClass = "block text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-1";

  const stepTitles = ["Personal Info", "Skills & Experience", "Links & Portfolio", "Payment & Security"];
  const stepIcons = [<UserIcon size={16} />, <Code size={16} />, <Link2 size={16} />, <ShieldCheck size={16} />];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative" style={{ background: "#020617" }}>
      <ParticleField />
      <div className="max-w-lg w-full relative z-10">

        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">Step {step} of {totalSteps}</p>
          <h2 className="text-2xl font-black text-white" style={{ fontFamily: "'Space Grotesk', system-ui" }}>{stepTitles[step - 1]}</h2>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-2 mb-8">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i < step ? "flex-1" : "w-6 opacity-20"}`}
              style={{ background: i < step ? "linear-gradient(90deg, #3b82f6, #6366f1)" : "rgba(255,255,255,0.2)", boxShadow: i < step ? "0 0 10px rgba(59,130,246,0.5)" : "none" }} />
          ))}
        </div>

        <GlassCard className="overflow-hidden" hover={false}>
          {/* Step indicator */}
          <div className="flex border-b border-white/5">
            {stepTitles.map((t, i) => (
              <div key={i} className={`flex-1 py-3 flex flex-col items-center gap-1 transition-all ${i + 1 === step ? "opacity-100" : "opacity-30"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${i + 1 < step ? "bg-blue-500 text-white" : i + 1 === step ? "bg-blue-500/20 text-blue-400" : "bg-white/5 text-gray-600"}`}>
                  {i + 1 < step ? <Check size={11} /> : stepIcons[i]}
                </div>
              </div>
            ))}
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {/* STEP 1 */}
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                  <div>
                    <label className={labelClass}>Legal Full Name</label>
                    <input value={data.legalName} onChange={e => update("legalName", e.target.value)} className={inputClass} style={inputStyle} placeholder="John Kamau" />
                  </div>
                  <div>
                    <label className={labelClass}>Username / Handle</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">@</span>
                      <input value={data.username} onChange={e => update("username", e.target.value)} className={`${inputClass} pl-8`} style={inputStyle} placeholder="johnk_dev" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Country</label>
                    <select value={data.country} onChange={e => handleCountry(e.target.value)} className={inputClass} style={{ ...inputStyle, color: "white" }}>
                      {countries.map(c => <option key={c.name} value={c.name} style={{ background: "#020617" }}>{c.flag} {c.name} ({c.code})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>WhatsApp / Phone Number</label>
                    <div className="flex gap-2">
                      <div className="px-4 py-3.5 rounded-2xl text-sm font-bold text-gray-300 shrink-0" style={inputStyle}>{data.code}</div>
                      <input value={data.phone} onChange={e => update("phone", e.target.value)} className={`${inputClass} flex-1`} style={inputStyle} placeholder="712 345 678" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Short Bio</label>
                    <textarea value={data.bio} onChange={e => update("bio", e.target.value)} rows={3} className={inputClass} style={inputStyle} placeholder="Tell us who you are in 2-3 sentences..." />
                  </div>
                </motion.div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                  <div>
                    <label className={labelClass}>Primary Role</label>
                    <select value={data.job} onChange={e => update("job", e.target.value)} className={inputClass} style={{ ...inputStyle, color: "white" }}>
                      {["Developer", "UI/UX Designer", "Data Scientist", "Marketing Specialist", "Content Writer", "Academic / Tutor", "Video Editor", "DevOps Engineer", "Mobile Developer"].map(j => (
                        <option key={j} value={j} style={{ background: "#020617" }}>{j}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Years of Experience</label>
                    <div className="grid grid-cols-4 gap-2">
                      {["< 1", "1-2", "3-5", "5+"].map(y => (
                        <button key={y} onClick={() => update("yearsExp", y)}
                          className="py-3 rounded-xl text-xs font-bold transition-all"
                          style={{ background: data.yearsExp === y ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.04)", border: data.yearsExp === y ? "1px solid rgba(59,130,246,0.6)" : "1px solid rgba(255,255,255,0.08)", color: data.yearsExp === y ? "#93c5fd" : "#6b7280" }}>
                          {y} yrs
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Skills (Select all that apply)</label>
                    <div className="flex flex-wrap gap-2">
                      {skillOptions.map(s => (
                        <button key={s} onClick={() => toggleSkill(s)}
                          className="px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all"
                          style={{ background: data.skills.includes(s) ? "rgba(59,130,246,0.25)" : "rgba(255,255,255,0.04)", border: data.skills.includes(s) ? "1px solid rgba(59,130,246,0.5)" : "1px solid rgba(255,255,255,0.08)", color: data.skills.includes(s) ? "#93c5fd" : "#6b7280" }}>
                          {data.skills.includes(s) ? "✓ " : ""}{s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>University / Institution (Optional)</label>
                    <div className="relative">
                      <GraduationCap size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                      <input value={data.school} onChange={e => update("school", e.target.value)} className={`${inputClass} pl-10`} style={inputStyle} placeholder="e.g. University of Nairobi" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                  <div className="p-4 rounded-2xl mb-2" style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}>
                    <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-1">Why Links Matter</p>
                    <p className="text-gray-400 text-xs leading-relaxed">Adding portfolio links increases your chances of being hired by 3× on NexusGigs.</p>
                  </div>
                  <div>
                    <label className={labelClass}>Portfolio / Website URL</label>
                    <div className="relative">
                      <Globe size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                      <input value={data.portfolio} onChange={e => update("portfolio", e.target.value)} className={`${inputClass} pl-10`} style={inputStyle} placeholder="https://yourportfolio.com" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>LinkedIn Profile</label>
                    <div className="relative">
                      <Link2 size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                      <input value={data.linkedin} onChange={e => update("linkedin", e.target.value)} className={`${inputClass} pl-10`} style={inputStyle} placeholder="linkedin.com/in/yourname" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>GitHub Profile (for devs)</label>
                    <div className="relative">
                      <Code size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                      <input value={data.github} onChange={e => update("github", e.target.value)} className={`${inputClass} pl-10`} style={inputStyle} placeholder="github.com/yourhandle" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>ID Verification Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["National ID", "Passport", "Alien ID", "Student ID"].map(id => (
                        <button key={id} onClick={() => update("idType", id)}
                          className="py-3 rounded-xl text-xs font-bold transition-all"
                          style={{ background: data.idType === id ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.04)", border: data.idType === id ? "1px solid rgba(59,130,246,0.5)" : "1px solid rgba(255,255,255,0.08)", color: data.idType === id ? "#93c5fd" : "#6b7280" }}>
                          {id}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                  <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: "rgba(0,242,255,0.05)", border: "1px solid rgba(0,242,255,0.15)" }}>
                    <ShieldCheck size={22} className="text-cyan-400 shrink-0" />
                    <div>
                      <p className="text-cyan-300 text-[10px] font-black uppercase tracking-wide mb-0.5">End-to-End Encrypted</p>
                      <p className="text-gray-500 text-[10px]">All payment data is secured with AES-256 encryption</p>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Primary Payment Method</label>
                    <div className="space-y-2">
                      {[
                        { id: "M-Pesa", icon: <Smartphone size={16} />, desc: "Instant STK push payments" },
                        { id: "Bank Transfer", icon: <Landmark size={16} />, desc: "Local or international wire" },
                        { id: "Crypto (USDT)", icon: <Database size={16} />, desc: "USDT on TRC20 or ERC20" },
                      ].map(p => (
                        <button key={p.id} onClick={() => update("pay", p.id)}
                          className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
                          style={{ background: data.pay === p.id ? "rgba(59,130,246,0.12)" : "rgba(255,255,255,0.03)", border: data.pay === p.id ? "1px solid rgba(59,130,246,0.4)" : "1px solid rgba(255,255,255,0.07)" }}>
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: data.pay === p.id ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.05)", color: data.pay === p.id ? "#60a5fa" : "#4b5563" }}>
                            {p.icon}
                          </div>
                          <div className="flex-1">
                            <p className={`text-xs font-black ${data.pay === p.id ? "text-blue-300" : "text-gray-400"}`}>{p.id}</p>
                            <p className="text-[10px] text-gray-600">{p.desc}</p>
                          </div>
                          {data.pay === p.id && <Check size={14} className="text-blue-400" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl" style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.1)" }}>
                    <p className="text-blue-300 text-[10px] font-black uppercase tracking-widest mb-3">Profile Summary</p>
                    <div className="space-y-2 text-[11px]">
                      <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="text-gray-300 font-semibold">{data.legalName || "—"}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Role</span><span className="text-gray-300 font-semibold">{data.job}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Skills</span><span className="text-gray-300 font-semibold">{data.skills.length ? `${data.skills.length} selected` : "—"}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Payment</span><span className="text-gray-300 font-semibold">{data.pay}</span></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex gap-3 mt-8">
              {step > 1 && (
                <button onClick={() => setStep(s => s - 1)}
                  className="px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 transition-all hover:text-white"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  Back
                </button>
              )}
              <button
                onClick={() => step < totalSteps ? setStep(s => s + 1) : onFinalize()}
                disabled={step === 1 && (!data.legalName || !data.phone)}
                className="flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30"
                style={{ background: step === totalSteps ? "linear-gradient(135deg, #00f2ff, #3b82f6)" : "linear-gradient(135deg, #3b82f6, #6366f1)", boxShadow: "0 0 30px rgba(59,130,246,0.3)", color: step === totalSteps ? "#020617" : "white" }}>
                {step === totalSteps ? (
                  <><Rocket size={16} /> Launch My Profile</>
                ) : (
                  <>Continue <ArrowRight size={14} /></>
                )}
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// PREMIUM LOADING SCREEN
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
      setProgress(p => {
        const next = p + 0.8;
        if (next >= 100) { clearInterval(interval); return 100; }
        setCurrentTask(Math.min(Math.floor((next / 100) * tasks.length), tasks.length - 1));
        return next;
      });
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative text-center" style={{ background: "#020617" }}>
      <ParticleField />
      <div className="relative z-10 max-w-sm w-full">

        {/* 3D Orb */}
        <div className="relative w-48 h-48 mx-auto mb-12">
          {/* Outer rings */}
          {[0, 1, 2].map(i => (
            <motion.div key={i}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 4 + i * 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full"
              style={{ border: `1px solid rgba(59,130,246,${0.3 - i * 0.08})`, transform: `rotateX(${60 + i * 10}deg) rotateZ(${i * 60}deg)` }} />
          ))}
          {/* Pulsing core */}
          <motion.div
            animate={{ scale: [0.9, 1.05, 0.9], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-8 rounded-full flex items-center justify-center"
            style={{ background: "radial-gradient(circle, rgba(59,130,246,0.4), rgba(99,102,241,0.15), transparent)", boxShadow: "0 0 60px rgba(59,130,246,0.3), inset 0 0 30px rgba(99,102,241,0.15)" }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}>
              <Zap size={28} className="text-blue-300" />
            </motion.div>
          </motion.div>
          {/* Orbiting dots */}
          {[...Array(6)].map((_, i) => (
            <motion.div key={i}
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
              className="absolute inset-0"
              style={{ transformOrigin: "center" }}>
              <div className="w-2 h-2 rounded-full absolute"
                style={{ background: i % 2 ? "#3b82f6" : "#6366f1", top: "10%", left: "50%", transform: "translateX(-50%)", boxShadow: `0 0 8px ${i % 2 ? "#3b82f6" : "#6366f1"}` }} />
            </motion.div>
          ))}
        </div>

        <motion.h2 animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }}
          className="text-3xl font-black text-white mb-1" style={{ fontFamily: "'Space Grotesk', system-ui" }}>
          Initializing Node
        </motion.h2>
        <p className="text-gray-500 text-sm mb-10">Welcome, <span className="text-blue-400 font-bold">{name || "Operator"}</span></p>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="h-1.5 rounded-full overflow-hidden mb-3" style={{ background: "rgba(255,255,255,0.06)" }}>
            <motion.div className="h-full rounded-full"
              style={{ width: `${progress}%`, background: "linear-gradient(90deg, #3b82f6, #00f2ff)", boxShadow: "0 0 15px rgba(59,130,246,0.6)", transition: "width 0.05s linear" }} />
          </div>
          <div className="flex justify-between text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            <span>Progress</span>
            <span className="text-blue-400">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Task list */}
        <div className="space-y-2">
          {tasks.map((task, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: i <= currentTask ? 1 : 0.25, x: 0 }} transition={{ delay: i * 0.2 }}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: i === currentTask ? "rgba(59,130,246,0.08)" : "transparent", border: i === currentTask ? "1px solid rgba(59,130,246,0.15)" : "1px solid transparent" }}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${i < currentTask ? "bg-blue-500 text-white" : i === currentTask ? "text-blue-400" : "text-gray-700"}`}
                style={{ background: i < currentTask ? "#3b82f6" : "transparent" }}>
                {i < currentTask ? <Check size={10} /> : task.icon}
              </div>
              <span className={`text-[11px] font-semibold uppercase tracking-wide ${i === currentTask ? "text-blue-300" : i < currentTask ? "text-gray-500 line-through" : "text-gray-700"}`}>
                {task.label}
              </span>
              {i === currentTask && (
                <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 0.8, repeat: Infinity }} className="ml-auto">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

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
          // Check if email verified
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
    return <div className="min-h-screen" style={{ background: "#020617" }} />;
  }

  if (step === "landing") return <LandingPage />;
  if (step === "email-confirm") return <EmailConfirmScreen email={user?.emailAddresses?.[0]?.emailAddress} />;
  if (step === "consent") return <ConsentScreen onContinue={() => setStep("path")} />;
  if (step === "path") return <PathSelection onSelect={handleRoleSelect} />;
  if (step === "vetting") return <VettingForm role={selectedRole || "freelancer"} onFinalize={handleFinalize} />;
  if (step === "loading") return <LoadingScreen name={user?.firstName || undefined} />;

  if (step === "dashboard") {
    return (
      <main className="min-h-screen" style={{ background: "#020617" }}>
        <RocketWarp active={isWarping} />
        {selectedRole === "freelancer"
          ? <FreelancerView jobs={[]} userMetadata={user?.publicMetadata || {}} />
          : <ClientView jobs={[]} />}
      </main>
    );
  }

  return null;
}