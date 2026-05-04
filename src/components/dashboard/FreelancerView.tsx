"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Briefcase, FileText, MessageSquare,
  Wallet, BarChart3, User, ShieldCheck, Zap, Lock, Rocket,
  CreditCard, ChevronRight, AlertTriangle,
  CheckCircle2, Clock, ShieldAlert,
  Activity, Landmark, Bitcoin, LifeBuoy, X, CheckCircle, Box,
  UserCircle, DollarSign, ArrowUpRight, Shield,
  Send, Copy, Check, Sparkles, Building2,
  ArrowRight, RefreshCw, Eye, EyeOff, Search,
  BellRing, Flame, BadgeCheck, Wifi, Calculator, Settings,
  TrendingUp, Target, Star, Globe, ChevronDown,
} from "lucide-react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface Toast {
  id: number;
  msg: string;
  type: "success" | "error" | "info";
}

// ─────────────────────────────────────────────
// ATOMIC PRIMITIVES
// ─────────────────────────────────────────────

const PulseDot = ({ color = "#00f5d4", size = 7 }: { color?: string; size?: number }) => (
  <span className="relative inline-flex" style={{ width: size, height: size }}>
    <span
      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-40"
      style={{ backgroundColor: color }}
    />
    <span className="relative inline-flex rounded-full" style={{ width: size, height: size, backgroundColor: color }} />
  </span>
);

const RippleButton = ({
  children,
  onClick,
  className = "",
  disabled = false,
  style,
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((r) => [...r, { x: e.clientX - rect.left, y: e.clientY - rect.top, id }]);
    setTimeout(() => setRipples((r) => r.filter((rip) => rip.id !== id)), 700);
    onClick?.(e);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      style={style}
      className={`relative overflow-hidden select-none transition-transform active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute rounded-full bg-white/20 animate-ping pointer-events-none"
          style={{ left: r.x - 14, top: r.y - 14, width: 28, height: 28, animationDuration: "0.7s" }}
        />
      ))}
    </button>
  );
};

// Glass card with optional accent stripe
const GlassCard = ({
  children,
  className = "",
  accent = false,
  glow = false,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
  glow?: boolean;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className={`relative bg-white/[0.035] backdrop-blur-2xl border border-white/[0.07] rounded-3xl transition-all duration-300
      hover:border-white/12 hover:bg-white/5.5
      ${accent ? "border-l-[3px] border-l-[#00f5d4]" : ""}
      ${glow ? "shadow-[0_0_40px_rgba(0,245,212,0.07)]" : ""}
      ${onClick ? "cursor-pointer" : ""}
      ${className}`}
  >
    {children}
  </div>
);

// Micro stat cards
const StatCard = ({
  label,
  value,
  icon,
  color = "#00f5d4",
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}) => (
  <GlassCard className="p-4 text-center group">
    <div className="flex justify-center mb-2" style={{ color }}>
      {icon}
    </div>
    <p className="text-[13px] font-black tracking-tight text-white leading-none">{value}</p>
    <p className="text-[8px] font-bold text-white/30 uppercase tracking-[0.12em] mt-1.5 leading-none">{label}</p>
  </GlassCard>
);

// Company Logo with clearbit + fallback
const CompanyLogo = ({
  name,
  domain,
  size = 44,
}: {
  name: string;
  domain: string;
  size?: number;
}) => {
  const [src, setSrc] = useState(`https://logo.clearbit.com/${domain}`);
  return (
    <div
      style={{ width: size, height: size, minWidth: size }}
      className="rounded-[14px] overflow-hidden bg-white border border-white/10 flex items-center justify-center shadow-xl"
    >
      <img
        src={src}
        alt={name}
        className="w-full h-full object-contain p-1.5"
        onError={() =>
          setSrc(
            `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0d1117&color=00f5d4&bold=true&size=128`
          )
        }
      />
    </div>
  );
};

// Badge pill
const Badge = ({
  children,
  color = "#00f5d4",
}: {
  children: React.ReactNode;
  color?: string;
}) => (
  <span
    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.12em] border"
    style={{
      color,
      borderColor: `${color}33`,
      backgroundColor: `${color}0f`,
    }}
  >
    {children}
  </span>
);

// Section heading
const SectionHead = ({ label, accent }: { label: string; accent: string }) => (
  <div className="flex items-center gap-3 mb-1">
    <h3 className="text-[22px] font-black italic uppercase tracking-tighter leading-none text-white">
      {label.split(" ")[0]}{" "}
      <span style={{ color: "#00f5d4" }}>{label.split(" ").slice(1).join(" ")}</span>
    </h3>
    <div className="flex-1 h-px bg-white/5" />
  </div>
);

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export const FreelancerView = ({
  jobs,
  userMetadata,
}: {
  jobs: any[];
  userMetadata: any;
}) => {
  const { user } = useUser();

  // ── Currency ────────────────────────────────
  const [currency, setCurrency] = useState<"USD" | "KES">("USD");
  const RATE = 130;
  const fmt = (usd: number) =>
    currency === "USD"
      ? `$${usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : `KES ${(usd * RATE).toLocaleString()}`;

  // ── Navigation ──────────────────────────────
  const [activeTab, setActiveTab] = useState("home");
  const [gigMode, setGigMode] = useState<"marketplace" | "corporate">("marketplace");

  // ── Toasts ──────────────────────────────────
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = (msg: string, type: Toast["type"] = "info") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  };

  // ── Balances ────────────────────────────────
  const [huBalance, setHuBalance] = useState(5);
  const [cashBalance] = useState(0.0);
  const isVerified = userMetadata?.status === "Verified";

  // ── Refill Modal ────────────────────────────
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState<"packages" | "choice" | "mpesa" | "binance">("packages");
  const [selectedPack, setSelectedPack] = useState<(typeof uplinkPackages)[0] | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [mpesaNum, setMpesaNum] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [copied, setCopied] = useState(false);

  // ── Calculator ──────────────────────────────
  const [calcHU, setCalcHU] = useState("1200");
  const calcKES = Math.round(parseFloat(calcHU || "0") * 1.083);

  // ── Messages expanded ───────────────────────
  const [expandedMsg, setExpandedMsg] = useState<number | null>(null);

  // ─────────────────────────────────────────────
  // DATA
  // ─────────────────────────────────────────────

  const uplinkPackages = [
    { id: 1, name: "Starter", price: 3, hu: 150, desc: "Apply for a few small gigs today.", hot: false },
    { id: 2, name: "Basic", price: 6, hu: 400, desc: "Expand reach to local tasks.", hot: false },
    { id: 3, name: "Pro Uplink", price: 10, hu: 1200, desc: "Unlock Global Corporate missions.", hot: true },
    { id: 4, name: "Elite", price: 18, hu: 2500, desc: "Priority handshakes + HR direct.", hot: false },
    { id: 5, name: "Alpha", price: 30, hu: 5000, desc: "Maximum power for top workers.", hot: false },
  ];

  const marketplaceGigs = useMemo(
    () => [
      {
        id: "1",
        title: "API Security Penetration Test",
        budget: 2100,
        client: "SafeVault",
        img: "https://i.pravatar.cc/150?u=safe",
        type: "Security",
        duration: "7 Days",
        cost: 10,
      },
      {
        id: "2",
        title: "Python Scripts for Data Analysis",
        budget: 110,
        client: "BioTech Lab",
        img: "https://i.pravatar.cc/150?u=lab",
        type: "Academic",
        duration: "5 Days",
        cost: 10,
      },
      {
        id: "3",
        title: "Smart Contract Audit (Solidity)",
        budget: 2200,
        client: "Nexus Protocol",
        img: "https://i.pravatar.cc/150?u=crypto",
        type: "Web3",
        duration: "5 Days",
        cost: 10,
      },
      {
        id: "4",
        title: "Next.js Speed & SEO Optimization",
        budget: 800,
        client: "E-Com Solutions",
        img: "https://i.pravatar.cc/150?u=ecom",
        type: "Startup",
        duration: "4 Days",
        cost: 10,
      },
      {
        id: "5",
        title: "Mobile App UI/UX Redesign",
        budget: 1400,
        client: "AppWorks Studio",
        img: "https://i.pravatar.cc/150?u=appworks",
        type: "Design",
        duration: "10 Days",
        cost: 10,
      },
      {
        id: "6",
        title: "AI Chatbot Integration (OpenAI)",
        budget: 950,
        client: "RetailBot Inc",
        img: "https://i.pravatar.cc/150?u=retail",
        type: "AI",
        duration: "6 Days",
        cost: 10,
      },
    ],
    []
  );

  const corporateGigs = useMemo(
    () => [
      { id: "c1", title: "Remote Fleet Data Analyst", salary: 8000, domain: "tesla.com", company: "Tesla", cost: 50, badge: "EV · Remote" },
      { id: "c2", title: "Cloud Support Engineer", salary: 9000, domain: "amazon.com", company: "Amazon", cost: 50, badge: "AWS · Senior" },
      { id: "c3", title: "Payment Integrity Analyst", salary: 11000, domain: "stripe.com", company: "Stripe", cost: 50, badge: "FinTech · Remote" },
      { id: "c4", title: "Security Operations Specialist", salary: 12000, domain: "kraken.com", company: "Kraken", cost: 50, badge: "Crypto · Remote" },
      { id: "c5", title: "Frontend Engineer (React)", salary: 10500, domain: "shopify.com", company: "Shopify", cost: 50, badge: "E-Com · Remote" },
      { id: "c6", title: "Data Platform Engineer", salary: 13500, domain: "databricks.com", company: "Databricks", cost: 50, badge: "Data · Senior" },
    ],
    []
  );

  const navItems = [
    { id: "home", icon: <Home size={15} />, label: "Home" },
    { id: "tasks", icon: <Briefcase size={15} />, label: "Gigs" },
    { id: "contracts", icon: <FileText size={15} />, label: "Work" },
    { id: "messages", icon: <MessageSquare size={15} />, label: "Chats" },
    { id: "earnings", icon: <Wallet size={15} />, label: "Vault" },
    { id: "analytics", icon: <BarChart3 size={15} />, label: "Stats" },
    { id: "support", icon: <LifeBuoy size={15} />, label: "Help" },
    { id: "account", icon: <User size={15} />, label: "Me" },
  ];

  const messages = [
    {
      sender: "Uplink HQ",
      body: "Welcome to the Nexus. To keep global clients secure, you must hold Handshake Units (HU). Refilling gives you immediate access to all missions.",
      time: "Just now",
      unread: true,
    },
    {
      sender: "Security Bot",
      body: "Encryption active. Your uplink power is low (5 HU). Missions require at least 10 HU to apply. Pick a package to establish a permanent connection.",
      time: "14m ago",
      unread: true,
    },
    {
      sender: "Exchange Relay",
      body: "Rates Updated: $1.00 is trading at KES 130.00. Use the Vault Calculator to verify node liquidity before withdrawal.",
      time: "1h ago",
      unread: false,
    },
  ];

  // ─────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────

  const openRefill = () => {
    setModalStep("packages");
    setShowModal(true);
  };

  const handleApply = (cost: number) => {
    if (huBalance >= cost) {
      setHuBalance((p) => p - cost);
      addToast(`Handshake sent! −${cost} HU`, "success");
    } else {
      openRefill();
    }
  };

  const handlePay = async (method: "CARD" | "MPESA") => {
    if (!agreed) return addToast("Please agree to the network rules first.", "info");
    if (!selectedPack) return addToast("Select a package first.", "error");
    setIsPaying(true);

    try {
      if (method === "CARD") {
        const res = await fetch("/api/paystack", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: selectedPack.price,
            currency: "USD",
            email: user?.primaryEmailAddress?.emailAddress,
          }),
        });
        const data = await res.json();
        if (data?.data?.authorization_url) window.location.href = data.data.authorization_url;
        else addToast("Payment gateway error.", "error");
      } else {
        const clean = mpesaNum.replace(/\D/g, "");
        if (!clean.startsWith("254") || clean.length !== 12) {
          addToast("Format: 254XXXXXXXXX (12 digits)", "error");
          return;
        }
        const res = await fetch("/api/intasend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: selectedPack.price * RATE,
            phone: clean,
            email: user?.primaryEmailAddress?.emailAddress,
          }),
        });
        if (res.ok) {
          addToast("Check your phone for the STK prompt.", "success");
          setShowModal(false);
        } else {
          addToast("M-Pesa connection failed.", "error");
        }
      }
    } catch {
      addToast("Network error. Try again.", "error");
    } finally {
      setIsPaying(false);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText("TFWxe4TFcjUNgPJVgf5iXrMsw1oe4gDv9X");
    setCopied(true);
    addToast("Address copied!", "success");
    setTimeout(() => setCopied(false), 2500);
  };

  const typeColors: Record<string, string> = {
    Security: "#f87171",
    Academic: "#60a5fa",
    Web3: "#a78bfa",
    Startup: "#fb923c",
    Design: "#e879f9",
    AI: "#34d399",
  };

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────

  return (
    <div
      className="min-h-screen text-white font-sans pb-28 overflow-x-hidden"
      style={{ background: "linear-gradient(160deg, #030810 0%, #050c18 60%, #03080f 100%)" }}
    >
      {/* ── Ambient blobs ─────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-175 h-175 rounded-full opacity-[0.04] blur-[140px]"
          style={{ background: "radial-gradient(circle, #00f5d4, transparent)" }}
        />
        <div
          className="absolute bottom-0 -left-40 w-150 h-150 rounded-full opacity-[0.05] blur-[120px]"
          style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-225 h-100 rounded-full opacity-[0.02] blur-[200px]"
          style={{ background: "radial-gradient(ellipse, #00f5d4, transparent)" }}
        />
        {/* subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* ── Toast Stack ────────────────────────── */}
      <div className="fixed top-5 right-4 z-999 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 80, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.92 }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-wider border backdrop-blur-2xl shadow-2xl ${
                t.type === "success"
                  ? "bg-emerald-500/15 border-emerald-500/25 text-emerald-400"
                  : t.type === "error"
                  ? "bg-red-500/15 border-red-500/25 text-red-400"
                  : "bg-blue-500/15 border-blue-500/25 text-blue-400"
              }`}
            >
              {t.type === "success" ? <CheckCircle size={12} /> : t.type === "error" ? <AlertTriangle size={12} /> : <BellRing size={12} />}
              <span>{t.msg}</span>
              <button
                onClick={() => setToasts((p) => p.filter((x) => x.id !== t.id))}
                className="ml-1 opacity-40 hover:opacity-100"
              >
                <X size={10} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── Content ────────────────────────────── */}
      <div className="max-w-5xl mx-auto pt-5 px-4 relative z-10">
        <AnimatePresence mode="wait">

          {/* ════════════════ HOME ════════════════ */}
          {activeTab === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
              className="space-y-5"
            >
              {/* Header */}
              <header className="relative flex justify-between items-center p-6 rounded-[26px] border border-white/[0.07] bg-white/[0.035] backdrop-blur-2xl overflow-hidden shadow-2xl">
                <div
                  className="absolute top-0 left-0 w-0.75 h-full rounded-r-full"
                  style={{ background: "linear-gradient(to bottom, #00f5d4, transparent)" }}
                />
                <div className="pl-2">
                  <p className="text-[8px] font-black uppercase tracking-[0.25em] text-white/25 mb-1.5">Global Uplink Network</p>
                  <h2 className="text-[26px] font-black italic uppercase tracking-tighter leading-none text-white">
                    {user?.firstName || "Operator"}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <PulseDot color="#00f5d4" size={6} />
                    <span className="text-[8px] font-bold uppercase tracking-widest text-white/30">Connected</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2 bg-[#00f5d4]/10 border border-[#00f5d4]/20 px-4 py-2.5 rounded-[14px]">
                    <Zap size={14} className="text-[#00f5d4]" fill="#00f5d4" />
                    <span className="text-sm font-black text-white">{huBalance}</span>
                    <span className="text-[9px] font-black text-[#00f5d4] uppercase tracking-widest">HU</span>
                  </div>
                  <button
                    onClick={() => setCurrency((c) => (c === "USD" ? "KES" : "USD"))}
                    className="text-[7px] font-black uppercase bg-white/4 border border-white/[0.07] px-3 py-1.5 rounded-lg text-white/30 hover:text-white transition-all"
                  >
                    {currency} ⇄
                  </button>
                </div>
              </header>

              {/* Cards row */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Uplink card */}
                <GlassCard className="md:col-span-3 p-6 space-y-4" accent glow>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(0,245,212,0.12)" }}
                    >
                      <ShieldCheck size={18} className="text-[#00f5d4]" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.18em] text-white">Protocol Verification</h4>
                      <p className="text-[8px] text-white/25 font-bold uppercase tracking-widest">Uplink Authentication</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-white/40 leading-relaxed">
                    Fortune 500 handshakes require <span className="text-[#00f5d4] font-bold">Uplink Units (HU)</span> to transmit your
                    profile. HU filters bot applications and places you at the front of hiring queues globally.
                  </p>
                  <div className="flex gap-2">
                    <RippleButton
                      onClick={openRefill}
                      className="flex-1 py-3 rounded-[14px] text-[9px] font-black uppercase tracking-widest text-black"
                      style={{ background: "linear-gradient(135deg, #00f5d4, #0097a7)" }}
                    >
                      Refill Uplink
                    </RippleButton>
                    <button
                      onClick={() => setActiveTab("tasks")}
                      className="px-5 py-3 rounded-[14px] text-[9px] font-black uppercase tracking-widest border border-white/8 bg-white/4 text-white/50 hover:text-white transition-all"
                    >
                      View Gigs →
                    </button>
                  </div>
                </GlassCard>

                {/* Stats */}
                <div className="md:col-span-2 grid grid-cols-2 gap-3">
                  <StatCard label="Success Rate" value="0%" icon={<CheckCircle2 size={15} />} color="#34d399" />
                  <StatCard label="System Uptime" value="99.9%" icon={<Wifi size={15} />} color="#00f5d4" />
                  <StatCard label="Live Missions" value={marketplaceGigs.length + corporateGigs.length} icon={<Target size={15} />} color="#a78bfa" />
                  <StatCard label="Trust Level" value="Beta" icon={<Shield size={15} />} color="#fb923c" />
                </div>
              </div>

              {/* Live feed ticker */}
              <div className="relative overflow-hidden rounded-[14px] border border-white/5 bg-white/2 py-3">
                <motion.div
                  className="whitespace-nowrap flex gap-16 items-center"
                  animate={{ x: [0, -700] }}
                  transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
                >
                  {[
                    "Emmanuel refilled 1200 HU",
                    "David N. earned $850",
                    "John M. applied for Tesla",
                    "Alice V. withdrew KES 14,000",
                    "System: Encryption Secure · TLS 1.3",
                    "Kraken · Stripe · Amazon hiring now",
                  ].map((t, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-2.5 text-[8px] font-black text-white/20 uppercase tracking-[0.18em]"
                    >
                      <PulseDot color="#00f5d4" size={4} />
                      {t}
                    </span>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ════════════════ GIGS ════════════════ */}
          {activeTab === "tasks" && (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
              className="space-y-5"
            >
              <div className="flex items-center justify-between">
                <SectionHead label="Mission Feed" accent="#00f5d4" />
                <Badge color="#34d399">
                  <PulseDot color="#34d399" size={5} /> Uplink Active
                </Badge>
              </div>

              {/* Mode toggle */}
              <div className="flex gap-1 p-1 rounded-2xl border border-white/[0.07] bg-white/3 w-fit mx-auto">
                {(["marketplace", "corporate"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setGigMode(m)}
                    className={`px-8 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                      gigMode === m ? "bg-[#00f5d4] text-black shadow-lg" : "text-white/30 hover:text-white/60"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {gigMode === "marketplace" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {marketplaceGigs.map((g, idx) => {
                    const locked = idx > 2 && huBalance < 10;
                    return (
                      <div
                        key={g.id}
                        className={`relative p-5 rounded-[22px] border transition-all ${
                          locked
                            ? "border-white/4 bg-white/2 opacity-50 blur-[2px] pointer-events-none grayscale"
                            : "border-white/[0.07] bg-white/[0.035] hover:border-white/[0.14] hover:bg-white/5.5 shadow-xl"
                        }`}
                      >
                        {locked && (
                          <div className="absolute inset-0 flex items-center justify-center z-20 rounded-[22px]">
                            <div className="bg-black/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-[#00f5d4]/30 text-center">
                              <Lock size={14} className="mx-auto mb-1 text-[#00f5d4]" />
                              <p className="text-[7px] font-black text-white uppercase tracking-widest">Refill HU</p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-start justify-between mb-4">
                          <img
                            src={g.img}
                            className="w-10 h-10 rounded-xl border border-white/10 object-cover"
                            alt={g.client}
                          />
                          <Badge color={typeColors[g.type] || "#00f5d4"}>{g.type}</Badge>
                        </div>
                        <h4 className="text-[11px] font-black uppercase text-white mb-1 leading-snug line-clamp-2">{g.title}</h4>
                        <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest mb-4">{g.client} · {g.duration}</p>
                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                          <div>
                            <p className="text-[14px] font-black text-white leading-none">{fmt(g.budget)}</p>
                            <p className="text-[7px] text-white/25 font-bold uppercase mt-0.5">Project budget</p>
                          </div>
                          <RippleButton
                            onClick={() => handleApply(g.cost)}
                            className="px-5 py-2.5 rounded-[11px] text-[8px] font-black uppercase tracking-widest text-black"
                            style={{ background: "linear-gradient(135deg, #00f5d4, #0097a7)" }}
                          >
                            Apply · {g.cost} HU
                          </RippleButton>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {corporateGigs.map((c) => (
                    <div
                      key={c.id}
                      className="p-6 rounded-[26px] border border-white/[0.07] bg-white/[0.035] hover:border-white/[0.14] hover:bg-white/5 transition-all shadow-2xl group"
                    >
                      <div className="flex items-center gap-4 mb-5">
                        <CompanyLogo name={c.company} domain={c.domain} size={52} />
                        <div className="min-w-0">
                          <p className="text-[8px] font-black uppercase tracking-[0.15em] text-white/25 mb-0.5">{c.company}</p>
                          <h4 className="text-[11px] font-black uppercase text-white leading-snug truncate">{c.title}</h4>
                          <Badge color="#a78bfa">{c.badge}</Badge>
                        </div>
                        <div className="ml-auto text-right shrink-0">
                          <p className="text-[14px] font-black text-white leading-none">{fmt(c.salary)}</p>
                          <p className="text-[7px] text-white/25 font-bold uppercase mt-0.5">/ month</p>
                        </div>
                      </div>
                      <RippleButton
                        onClick={() => handleApply(c.cost)}
                        className="w-full py-3.5 rounded-[14px] text-[9px] font-black uppercase tracking-widest border border-white/8 bg-white/6 text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                      >
                        <Zap size={12} className="text-[#00f5d4]" /> Handshake · {c.cost} HU <ArrowUpRight size={12} />
                      </RippleButton>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ════════════════ VAULT ════════════════ */}
          {activeTab === "earnings" && (
            <motion.div
              key="earnings"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
              className="space-y-5"
            >
              <SectionHead label="Vault Hub" accent="#00f5d4" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* HU Balance */}
                <div
                  className="p-7 rounded-[28px] border border-[#00f5d4]/15 overflow-hidden relative"
                  style={{ background: "linear-gradient(135deg, rgba(0,245,212,0.08) 0%, rgba(0,245,212,0.02) 100%)" }}
                >
                  <div
                    className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] opacity-30"
                    style={{ background: "radial-gradient(circle, #00f5d4, transparent)" }}
                  />
                  <Zap size={20} className="text-[#00f5d4] mb-5" fill="#00f5d4" />
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 mb-1.5">Uplink Units</p>
                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-[40px] font-black italic text-white leading-none">{huBalance}</span>
                    <span className="text-[18px] font-black text-[#00f5d4] mb-1">HU</span>
                  </div>
                  <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Liquid Power Available</p>
                  <button
                    onClick={openRefill}
                    className="mt-5 px-5 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest text-black"
                    style={{ background: "linear-gradient(135deg, #00f5d4, #0097a7)" }}
                  >
                    + Refill Units
                  </button>
                </div>

                {/* Cash Balance */}
                <div
                  className="p-7 rounded-[28px] border border-emerald-500/15 overflow-hidden relative"
                  style={{ background: "linear-gradient(135deg, rgba(52,211,153,0.07) 0%, rgba(52,211,153,0.02) 100%)" }}
                >
                  <div
                    className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] opacity-20"
                    style={{ background: "radial-gradient(circle, #34d399, transparent)" }}
                  />
                  <DollarSign size={20} className="text-emerald-400 mb-5" />
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 mb-1.5">Settlement Balance</p>
                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-[40px] font-black italic text-white leading-none">{fmt(cashBalance)}</span>
                  </div>
                  <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Available for withdrawal</p>
                  <RippleButton
                    onClick={() => addToast("Minimum withdrawal is $50.00", "error")}
                    className="mt-5 w-full py-3 rounded-[14px] text-[9px] font-black uppercase tracking-widest border border-white/8 bg-white/5 text-white/50 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    Withdraw <ArrowUpRight size={12} />
                  </RippleButton>
                </div>
              </div>

              {/* Calculator */}
              <GlassCard className="p-5 max-w-sm mx-auto w-full">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator size={13} className="text-[#00f5d4]" />
                  <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/50">HU → KES Converter</span>
                </div>
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <div className="bg-black/40 p-3 rounded-[14px] border border-white/6">
                    <p className="text-[7px] font-black text-white/20 uppercase mb-1">Units (HU)</p>
                    <input
                      type="number"
                      value={calcHU}
                      onChange={(e) => setCalcHU(e.target.value)}
                      className="bg-transparent w-full text-[15px] font-black outline-none text-white"
                    />
                  </div>
                  <RefreshCw size={13} className="text-white/15 animate-spin" style={{ animationDuration: "5s" }} />
                  <div className="bg-black/40 p-3 rounded-[14px] border border-white/6 text-right">
                    <p className="text-[7px] font-black text-white/20 uppercase mb-1">KES</p>
                    <p className="text-[15px] font-black text-emerald-400 leading-none">
                      {isNaN(calcKES) ? "—" : calcKES.toLocaleString()}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* ════════════════ WORK ════════════════ */}
          {activeTab === "contracts" && (
            <motion.div
              key="contracts"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
              className="flex items-center justify-center min-h-[60vh]"
            >
              <div className="text-center p-14 rounded-[40px] border border-red-500/15 bg-red-500/4 max-w-sm w-full">
                <ShieldAlert size={50} className="mx-auto text-red-500/70 mb-6" />
                <h3 className="text-[18px] font-black italic uppercase tracking-tight text-white mb-3 leading-none">History Locked</h3>
                <p className="text-[11px] text-white/30 mb-8 leading-relaxed">
                  Complete profile verification to view your work history and mission earnings log.
                </p>
                <RippleButton
                  onClick={openRefill}
                  className="px-10 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest text-white"
                  style={{ background: "linear-gradient(135deg, #ef4444, #b91c1c)" }}
                >
                  Verify Now
                </RippleButton>
              </div>
            </motion.div>
          )}

          {/* ════════════════ STATS ════════════════ */}
          {activeTab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
              className="space-y-5"
            >
              <SectionHead label="Performance Stats" accent="#00f5d4" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Success Rate" value="0%" icon={<CheckCircle2 size={15} />} color="#34d399" />
                <StatCard label="Missions" value="0" icon={<Briefcase size={15} />} color="#00f5d4" />
                <StatCard label="Settled" value={fmt(0)} icon={<DollarSign size={15} />} color="#fb923c" />
                <StatCard label="Uptime" value="100%" icon={<Wifi size={15} />} color="#a78bfa" />
              </div>
              <GlassCard className="p-8 text-center">
                <TrendingUp size={32} className="mx-auto text-white/10 mb-3" />
                <p className="text-[11px] text-white/25 font-bold uppercase tracking-widest">No activity yet. Apply to missions to generate analytics.</p>
              </GlassCard>
            </motion.div>
          )}

          {/* ════════════════ HELP ════════════════ */}
          {activeTab === "support" && (
            <motion.div
              key="support"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
              className="max-w-lg mx-auto space-y-5"
            >
              <SectionHead label="Help Center" accent="#00f5d4" />
              <GlassCard className="p-8 space-y-5" glow>
                <div className="flex items-center gap-2 mb-2">
                  <PulseDot color="#34d399" size={6} />
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/30">Support Online</span>
                </div>
                {[
                  { label: "Email Terminal", value: "support@nexusgigs.me", icon: <Send size={13} />, action: () => window.location.href = "mailto:support@nexusgigs.me" },
                  { label: "WhatsApp Relay", value: "+254 113 637325", icon: <MessageSquare size={13} />, action: undefined },
                ].map((item, i) => (
                  <div
                    key={i}
                    onClick={item.action}
                    className={`p-5 bg-black/30 rounded-[18px] border border-white/6 flex items-center justify-between ${item.action ? "cursor-pointer hover:border-[#00f5d4]/30" : ""} transition-all`}
                  >
                    <div>
                      <p className="text-[7px] font-black uppercase tracking-[0.18em] text-white/25 mb-1.5">{item.label}</p>
                      <p className="text-[12px] font-black text-white">{item.value}</p>
                    </div>
                    <div className="text-[#00f5d4]">{item.icon}</div>
                  </div>
                ))}
                <div className="p-4 bg-amber-500/6 border border-amber-500/15 rounded-[14px] flex items-center gap-3">
                  <Clock size={13} className="text-amber-500 shrink-0" />
                  <p className="text-[9px] text-white/30 font-bold leading-relaxed">Support hours: Mon–Fri, 08:00–20:00 EAT. Response within 2 hours.</p>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* ════════════════ MESSAGES ════════════════ */}
          {activeTab === "messages" && (
            <motion.div
              key="messages"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
              className="space-y-4"
            >
              <SectionHead label="System Relay" accent="#00f5d4" />
              {messages.map((msg, i) => (
                <div
                  key={i}
                  onClick={() => setExpandedMsg(expandedMsg === i ? null : i)}
                  className={`p-5 rounded-[22px] border cursor-pointer transition-all ${
                    msg.unread
                      ? "bg-[#00f5d4]/4 border-[#00f5d4]/20"
                      : "bg-white/3 border-white/6"
                  }`}
                >
                  <div className="flex gap-4 items-start">
                    <div className="p-2.5 bg-black/40 rounded-xl text-[#00f5d4] shrink-0 mt-0.5">
                      <MessageSquare size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white">{msg.sender}</h4>
                        <span className="text-[7px] text-white/20 font-bold uppercase">{msg.time}</span>
                      </div>
                      <p className={`text-[10px] text-white/35 leading-relaxed ${expandedMsg === i ? "" : "line-clamp-1"}`}>
                        {msg.body}
                      </p>
                    </div>
                    <ChevronDown
                      size={13}
                      className={`text-white/20 shrink-0 mt-1 transition-transform ${expandedMsg === i ? "rotate-180" : ""}`}
                    />
                  </div>
                  {msg.unread && (
                    <div className="flex justify-end mt-2">
                      <span className="w-2 h-2 rounded-full bg-[#00f5d4]" />
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          )}

          {/* ════════════════ ACCOUNT ════════════════ */}
          {activeTab === "account" && (
            <motion.div
              key="account"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
              className="max-w-md mx-auto space-y-4 pb-8"
            >
              {/* Profile card */}
              <div className="p-8 rounded-[36px] border border-white/[0.07] bg-white/[0.035] backdrop-blur-2xl text-center relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ background: "linear-gradient(90deg, transparent, #00f5d4, transparent)" }}
                />
                <div className="relative w-28 h-28 mx-auto mb-6">
                  <div
                    className="absolute inset-0 rounded-[30px] blur-2xl opacity-30"
                    style={{ background: "radial-gradient(circle, #00f5d4, transparent)" }}
                  />
                  <div className="relative w-full h-full bg-black/60 rounded-[30px] border border-white/10 flex items-center justify-center overflow-hidden">
                    {user?.imageUrl ? (
                      <img src={user.imageUrl} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <UserCircle size={60} className="text-white/20" />
                    )}
                  </div>
                  <div
                    className="absolute -bottom-1 -right-1 p-2 rounded-2xl text-black"
                    style={{ background: "linear-gradient(135deg, #00f5d4, #0097a7)" }}
                  >
                    <BadgeCheck size={14} />
                  </div>
                </div>
                <h3 className="text-[22px] font-black italic uppercase tracking-tight text-white mb-2 leading-none">
                  {user?.fullName || "Operator"}
                </h3>
                <p className="text-[9px] text-white/25 font-bold uppercase tracking-[0.2em] mb-4">
                  {user?.primaryEmailAddress?.emailAddress || "—"}
                </p>
                <div className="flex justify-center gap-3 mb-6">
                  <Badge color="#34d399">
                    <PulseDot color="#34d399" size={5} /> Synced
                  </Badge>
                  <Badge color="#00f5d4">{isVerified ? "Elite Node" : "Standard"}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <RippleButton
                    onClick={() => setActiveTab("earnings")}
                    className="py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest text-black flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg, #00f5d4, #0097a7)" }}
                  >
                    Vault <ArrowUpRight size={13} />
                  </RippleButton>
                  <button className="py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-white/8 bg-white/4 text-white/40 hover:text-white flex items-center justify-center gap-2 transition-all">
                    Settings <Settings size={13} />
                  </button>
                </div>
              </div>

              {/* Sign out */}
              <SignOutButton>
                <button className="w-full py-4 rounded-[18px] border border-red-500/15 bg-red-500/4 text-red-500/70 text-[9px] font-black uppercase tracking-widest hover:bg-red-500/8 transition-all">
                  Terminate Session
                </button>
              </SignOutButton>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ─────────────────────────────────────────
          NAV BAR
      ──────────────────────────────────────────── */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-100 w-[95%] max-w-lg">
        <div className="h-15 bg-black/80 backdrop-blur-3xl border border-white/8 rounded-full flex items-center justify-around px-2 shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-0.5 transition-all duration-200 ${
                activeTab === item.id ? "text-[#00f5d4] scale-110" : "text-white/20 hover:text-white/50"
              }`}
            >
              <div
                className={`transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-[#00f5d4]/10 border border-[#00f5d4]/20 p-2 rounded-[10px]"
                    : "p-2"
                }`}
              >
                {item.icon}
              </div>
              <span className="text-[6px] font-black uppercase tracking-widest leading-none opacity-70">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────
          REFILL MODAL
      ──────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-600 flex items-end sm:items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => !isPaying && setShowModal(false)}
            />
            <motion.div
              initial={{ scale: 0.93, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.93, y: 24 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="relative w-full max-w-sm bg-[#06101f] border border-white/8 rounded-[36px] p-7 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{ background: "linear-gradient(90deg, transparent, #00f5d4, transparent)" }}
              />

              {/* ── Packages ── */}
              {modalStep === "packages" && (
                <div className="space-y-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[18px] font-black italic uppercase tracking-tight text-white leading-none">Refill Power</h3>
                      <p className="text-[8px] text-white/25 font-bold uppercase tracking-widest mt-1">Choose uplink package</p>
                    </div>
                    <button
                      onClick={() => setShowModal(false)}
                      className="p-2 bg-white/5 rounded-[10px] border border-white/6 text-white/30 hover:text-white transition-all"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Low power alert */}
                  <div className="flex items-center gap-3 p-4 bg-red-500/[0.07] border border-red-500/15 rounded-2xl">
                    <Zap size={14} className="text-red-400 shrink-0" />
                    <p className="text-[9px] text-red-400/80 font-bold uppercase tracking-widest">
                      Low power detected · {huBalance} HU remaining
                    </p>
                  </div>

                  {/* Package list */}
                  <div className="space-y-2 max-h-75 overflow-y-auto no-scrollbar">
                    {uplinkPackages.map((pkg) => (
                      <RippleButton
                        key={pkg.id}
                        onClick={() => { setSelectedPack(pkg); setModalStep("choice"); }}
                        className={`w-full p-4 rounded-[18px] border flex items-center justify-between transition-all ${
                          pkg.hot
                            ? "border-[#00f5d4]/30 bg-[#00f5d4]/6"
                            : "border-white/6 bg-white/3 hover:bg-white/5"
                        }`}
                      >
                        <div className="text-left">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h5 className="text-[11px] font-black uppercase text-white leading-none">{pkg.name}</h5>
                            {pkg.hot && <Badge color="#00f5d4"><Flame size={8} /> Popular</Badge>}
                          </div>
                          <p className="text-[8px] font-bold text-white/25 uppercase tracking-wide">{pkg.desc}</p>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <p className="text-[13px] font-black text-white leading-none">{pkg.hu} HU</p>
                          <p className="text-[9px] font-black text-[#00f5d4] leading-none mt-1">KES {(pkg.price * RATE).toLocaleString()}</p>
                        </div>
                      </RippleButton>
                    ))}
                  </div>

                  {/* Terms */}
                  <div
                    onClick={() => setAgreed((a) => !a)}
                    className="flex items-center gap-3 p-3.5 bg-white/3 border border-white/5 rounded-[14px] cursor-pointer"
                  >
                    <div
                      className={`w-5 h-5 rounded-[7px] border-2 flex items-center justify-center shrink-0 transition-all ${
                        agreed ? "border-[#00f5d4] bg-[#00f5d4]" : "border-white/15"
                      }`}
                    >
                      {agreed && <Check size={11} className="text-black font-black" />}
                    </div>
                    <p className="text-[8px] font-bold text-white/25 uppercase leading-tight tracking-wide">
                      I agree to the refill protocol and network rules.
                    </p>
                  </div>
                </div>
              )}

              {/* ── Gateway Choice ── */}
              {modalStep === "choice" && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setModalStep("packages")}
                      className="p-2 bg-white/5 rounded-[10px] border border-white/6 text-white/30"
                    >
                      <ChevronDown size={14} className="rotate-90" />
                    </button>
                    <div>
                      <h4 className="text-[11px] font-black uppercase italic text-white leading-none">Select Gateway</h4>
                      <p className="text-[8px] text-white/25 font-bold uppercase tracking-widest mt-0.5">
                        {selectedPack?.name} · {selectedPack?.hu} HU · KES {((selectedPack?.price || 0) * RATE).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      {
                        label: "Bank / Card",
                        sub: "Visa · Mastercard (Paystack)",
                        icon: <Landmark size={20} />,
                        bg: "#4f46e5",
                        action: () => handlePay("CARD"),
                      },
                      {
                        label: "Binance USDT",
                        sub: "TRC20 · Instant",
                        icon: <Zap size={20} fill="white" />,
                        bg: "#f59e0b",
                        action: () => setModalStep("binance"),
                      },
                      {
                        label: "M-Pesa",
                        sub: "Instant STK Push",
                        icon: <span className="text-lg font-black">M</span>,
                        bg: "#059669",
                        action: () => setModalStep("mpesa"),
                      },
                    ].map((g, i) => (
                      <RippleButton
                        key={i}
                        onClick={g.action}
                        className="w-full p-5 rounded-[20px] flex items-center justify-between text-white"
                        style={{ background: `linear-gradient(135deg, ${g.bg}, ${g.bg}cc)` }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            {g.icon}
                          </div>
                          <div className="text-left">
                            <p className="text-[12px] font-black leading-none">{g.label}</p>
                            <p className="text-[8px] font-bold opacity-60 uppercase tracking-widest mt-1">{g.sub}</p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="opacity-60" />
                      </RippleButton>
                    ))}
                    <button
                      disabled
                      className="w-full p-5 rounded-[20px] border border-white/5 bg-white/2 flex items-center gap-4 opacity-30 cursor-not-allowed"
                    >
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-[10px] font-black text-white">PP</div>
                      <div className="text-left">
                        <p className="text-[12px] font-black text-white/50 leading-none">PayPal</p>
                        <p className="text-[8px] font-bold text-red-400 uppercase tracking-widest mt-1">Region Limited</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* ── Binance ── */}
              {modalStep === "binance" && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setModalStep("choice")} className="p-2 bg-white/5 rounded-[10px] border border-white/6 text-white/30">
                      <ChevronDown size={14} className="rotate-90" />
                    </button>
                    <h4 className="text-[11px] font-black uppercase italic text-white">Binance USDT</h4>
                  </div>
                  <div className="bg-white rounded-[20px] p-4 mx-auto w-fit border-4 border-amber-400/20">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=TFWxe4TFcjUNgPJVgf5iXrMsw1oe4gDv9X"
                      alt="QR"
                      className="w-36 h-36 block"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/40 p-3.5 rounded-[14px] border border-white/6">
                      <p className="text-[7px] text-white/20 uppercase font-bold mb-1">Amount</p>
                      <p className="text-[12px] font-black text-white">${selectedPack?.price}.00 USDT</p>
                    </div>
                    <div className="bg-black/40 p-3.5 rounded-[14px] border border-white/6">
                      <p className="text-[7px] text-white/20 uppercase font-bold mb-1">Network</p>
                      <p className="text-[12px] font-black text-amber-400">TRC20</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[7px] font-black text-white/20 uppercase tracking-widest mb-2">Uplink Address</p>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-black/40 border border-white/6 rounded-xl p-3 text-[8px] font-mono text-white/35 truncate">
                        TFWxe4TFcjUNgPJVgf5iXrMsw1oe4gDv9X
                      </div>
                      <button
                        onClick={copyAddress}
                        className="p-3 bg-white/5 border border-white/6 rounded-xl hover:bg-white/10 transition-all"
                      >
                        {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} className="text-white/30" />}
                      </button>
                    </div>
                  </div>
                  <RippleButton
                    onClick={() => { addToast("Signal received. Syncing in ~2h", "success"); setShowModal(false); }}
                    className="w-full py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest text-black"
                    style={{ background: "linear-gradient(135deg, #00f5d4, #0097a7)" }}
                  >
                    I Have Paid
                  </RippleButton>
                </div>
              )}

              {/* ── M-Pesa ── */}
              {modalStep === "mpesa" && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setModalStep("choice")} className="p-2 bg-white/5 rounded-[10px] border border-white/6 text-white/30">
                      <ChevronDown size={14} className="rotate-90" />
                    </button>
                    <h4 className="text-[11px] font-black uppercase italic text-white">M-Pesa Gateway</h4>
                  </div>
                  <div className="p-4 bg-emerald-500/6 border border-emerald-500/15 rounded-2xl flex items-center gap-3">
                    <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                    <p className="text-[9px] font-black text-emerald-400/80 uppercase tracking-widest">
                      Uplink Fee: KES {((selectedPack?.price || 0) * RATE).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[7px] font-black text-white/20 uppercase tracking-widest mb-2">Safaricom Number</p>
                    <input
                      value={mpesaNum}
                      onChange={(e) => setMpesaNum(e.target.value)}
                      placeholder="254712345678"
                      className="w-full bg-black/40 border border-white/8 rounded-2xl p-4 text-[18px] font-black text-white outline-none focus:border-emerald-500/50 text-center tracking-widest transition-all placeholder:text-white/15"
                    />
                  </div>
                  <RippleButton
                    disabled={isPaying}
                    onClick={() => handlePay("MPESA")}
                    className="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg, #059669, #065f46)" }}
                  >
                    {isPaying ? (
                      <>
                        <RefreshCw size={13} className="animate-spin" /> Pushing STK…
                      </>
                    ) : (
                      "Initialize Uplink"
                    )}
                  </RippleButton>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};