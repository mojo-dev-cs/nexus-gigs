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
  Award, Gift, Bell, Key, Smartphone, Mail,
  MapPin, Calendar, Edit3, ExternalLink, PieChart,
  Download, Upload, Repeat, Layers, AlertCircle,
  ChevronsUp, Trophy, Hash, Percent, Info, Link,
  Phone, HeadphonesIcon, BookOpen, Video, FileQuestion,
  ToggleLeft, ToggleRight, Plus, Trash2, LogOut,
  Crown, Sparkle, Gem, Radio,
} from "lucide-react";

interface Toast {
  id: number;
  msg: string;
  type: "success" | "error" | "info";
}

// ── Primitives ────────────────────────────────────────────────────────────────

const PulseDot = ({ color = "#00f5d4", size = 7 }: { color?: string; size?: number }) => (
  <span className="relative inline-flex" style={{ width: size, height: size }}>
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-40" style={{ backgroundColor: color }} />
    <span className="relative inline-flex rounded-full" style={{ width: size, height: size, backgroundColor: color }} />
  </span>
);

const RippleButton = ({
  children, onClick, className = "", disabled = false, style,
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
    <button onClick={handleClick} disabled={disabled} style={style}
      className={`relative overflow-hidden select-none transition-transform active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}>
      {children}
      {ripples.map((r) => (
        <span key={r.id} className="absolute rounded-full bg-white/20 animate-ping pointer-events-none"
          style={{ left: r.x - 14, top: r.y - 14, width: 28, height: 28, animationDuration: "0.7s" }} />
      ))}
    </button>
  );
};

const GlassCard = ({ children, className = "", accent = false, glow = false, onClick }: {
  children: React.ReactNode; className?: string; accent?: boolean; glow?: boolean; onClick?: () => void;
}) => (
  <div onClick={onClick}
    className={`relative bg-white/[0.035] backdrop-blur-2xl border border-white/[0.07] rounded-3xl transition-all duration-300
      hover:border-white/12 hover:bg-white/4.5
      ${accent ? "border-l-[3px] border-l-[#00f5d4]" : ""}
      ${glow ? "shadow-[0_0_40px_rgba(0,245,212,0.07)]" : ""}
      ${onClick ? "cursor-pointer" : ""} ${className}`}>
    {children}
  </div>
);

const StatCard = ({ label, value, icon, color = "#00f5d4", sub }: {
  label: string; value: string | number; icon: React.ReactNode; color?: string; sub?: string;
}) => (
  <GlassCard className="p-4 text-center group">
    <div className="flex justify-center mb-2" style={{ color }}>{icon}</div>
    <p className="text-[13px] font-black tracking-tight text-white leading-none">{value}</p>
    {sub && <p className="text-[7px] text-white/20 font-bold mt-0.5 leading-none">{sub}</p>}
    <p className="text-[8px] font-bold text-white/30 uppercase tracking-[0.12em] mt-1.5 leading-none">{label}</p>
  </GlassCard>
);

const CompanyLogo = ({ name, domain, size = 44 }: { name: string; domain: string; size?: number }) => {
  const [src, setSrc] = useState(`https://logo.clearbit.com/${domain}`);
  return (
    <div style={{ width: size, height: size, minWidth: size }}
      className="rounded-[14px] overflow-hidden bg-white border border-white/10 flex items-center justify-center shadow-xl">
      <img src={src} alt={name} className="w-full h-full object-contain p-1.5"
        onError={() => setSrc(`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0d1117&color=00f5d4&bold=true&size=128`)} />
    </div>
  );
};

const Badge = ({ children, color = "#00f5d4", className = "" }: { children: React.ReactNode; color?: string; className?: string }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.12em] border ${className}`}
    style={{ color, borderColor: `${color}33`, backgroundColor: `${color}0f` }}>
    {children}
  </span>
);

const SectionHead = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3 mb-1">
    <h3 className="text-[22px] font-black italic uppercase tracking-tighter leading-none text-white">
      {label.split(" ")[0]}{" "}
      <span style={{ color: "#00f5d4" }}>{label.split(" ").slice(1).join(" ")}</span>
    </h3>
    <div className="flex-1 h-px bg-white/5" />
  </div>
);

// Premium locked overlay for tabs/sections
const PremiumLockedSection = ({
  title, description, icon, cta, onCta, features,
}: {
  title: string; description: string; icon: React.ReactNode; cta: string; onCta: () => void; features?: string[];
}) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
    className="relative rounded-4xl overflow-hidden border border-white/8 p-8"
    style={{ background: "linear-gradient(160deg, rgba(6,16,31,0.98) 0%, rgba(3,8,15,0.99) 100%)" }}>
    {/* Ambient glow */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 blur-[60px] opacity-20 pointer-events-none"
      style={{ background: "radial-gradient(ellipse, #00f5d4, transparent)" }} />
    <div className="relative z-10 text-center">
      <div className="w-16 h-16 mx-auto mb-5 rounded-[22px] flex items-center justify-center border border-white/10 relative"
        style={{ background: "linear-gradient(135deg, rgba(0,245,212,0.12), rgba(0,245,212,0.04))" }}>
        <div className="absolute inset-0 rounded-[22px] blur-xl opacity-30"
          style={{ background: "radial-gradient(circle, #00f5d4, transparent)" }} />
        <div className="relative text-[#00f5d4]">{icon}</div>
      </div>
      <Badge color="#00f5d4" className="mb-4"><Crown size={8} /> Premium Feature</Badge>
      <h3 className="text-[20px] font-black italic uppercase tracking-tighter text-white mb-3 leading-none">{title}</h3>
      <p className="text-[10px] text-white/30 font-bold leading-relaxed mb-6 max-w-xs mx-auto">{description}</p>
      {features && (
        <div className="grid grid-cols-2 gap-2 mb-6 text-left max-w-xs mx-auto">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-2 p-2.5 bg-white/3 rounded-xl border border-white/5">
              <div className="w-4 h-4 rounded-full bg-[#00f5d4]/15 flex items-center justify-center shrink-0">
                <Check size={8} className="text-[#00f5d4]" />
              </div>
              <p className="text-[8px] font-bold text-white/40 uppercase tracking-wide">{f}</p>
            </div>
          ))}
        </div>
      )}
      <RippleButton onClick={onCta}
        className="px-10 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest text-black mx-auto"
        style={{ background: "linear-gradient(135deg, #00f5d4, #0097a7)" }}>
        {cta}
      </RippleButton>
    </div>
  </motion.div>
);

// Toggle switch component
const Toggle = ({ active, onChange }: { active: boolean; onChange: () => void }) => (
  <button onClick={onChange}
    className={`relative w-10 h-5.5 rounded-full transition-all duration-300 ${active ? "bg-[#00f5d4]" : "bg-white/10"}`}>
    <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300 ${active ? "left-5 bg-black" : "left-0.5 bg-white/30"}`} />
  </button>
);

// ── Payment method logos ──────────────────────────────────────────────────────

const MpesaLogo = () => (
  <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
    <svg viewBox="0 0 40 40" width="36" height="36">
      <rect width="40" height="40" rx="8" fill="#4CAF50"/>
      <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="14" fontWeight="900" fontFamily="Arial">M</text>
    </svg>
  </div>
);

const PaystackLogo = () => (
  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
    <svg viewBox="0 0 40 40" width="36" height="36">
      <rect width="40" height="40" rx="8" fill="#3d4eac"/>
      <rect x="10" y="12" width="20" height="4" rx="2" fill="white" opacity="1"/>
      <rect x="10" y="18" width="14" height="4" rx="2" fill="white" opacity="0.7"/>
      <rect x="10" y="24" width="18" height="4" rx="2" fill="white" opacity="0.5"/>
    </svg>
  </div>
);

const BinanceLogo = () => (
  <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg">
    <svg viewBox="0 0 40 40" width="28" height="28" fill="white">
      <path d="M20 2l4.5 4.5-4.5 4.5-4.5-4.5L20 2zm-9 9l4.5 4.5-4.5 4.5-4.5-4.5L11 11zm18 0l4.5 4.5-4.5 4.5-4.5-4.5L29 11zM20 20l4.5 4.5L20 29l-4.5-4.5L20 20zm-9 9l4.5 4.5-4.5 4.5-4.5-4.5L11 29zm18 0l4.5 4.5-4.5 4.5-4.5-4.5L29 29zM20 11l9 9-9 9-9-9 9-9z"/>
    </svg>
  </div>
);

const PaypalLogo = () => (
  <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center shadow-lg">
    <svg viewBox="0 0 40 40" width="36" height="36">
      <rect width="40" height="40" rx="8" fill="#003087"/>
      <text x="50%" y="56%" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="11" fontWeight="900" fontFamily="Arial">PayPal</text>
    </svg>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────

export const FreelancerView = ({ jobs, userMetadata }: { jobs: any[]; userMetadata: any }) => {
  const { user } = useUser();

  const [currency, setCurrency] = useState<"USD" | "KES">("USD");
  const RATE = 130;
  const fmt = (usd: number) =>
    currency === "USD"
      ? `$${usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : `KES ${(usd * RATE).toLocaleString()}`;

  const [activeTab, setActiveTab] = useState("home");
  const [gigMode, setGigMode] = useState<"marketplace" | "corporate">("marketplace");

  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = (msg: string, type: Toast["type"] = "info") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  };

  const [huBalance, setHuBalance] = useState(5);
  const [cashBalance] = useState(0.0);
  const isVerified = userMetadata?.status === "Verified";

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState<"packages" | "choice" | "mpesa" | "binance">("packages");
  const [selectedPack, setSelectedPack] = useState<(typeof uplinkPackages)[0] | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [mpesaNum, setMpesaNum] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [calcHU, setCalcHU] = useState("1200");
  const calcKES = Math.round(parseFloat(calcHU || "0") * 1.083);

  // UI states
  const [expandedMsg, setExpandedMsg] = useState<number | null>(null);
  const [showBalance, setShowBalance] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeVaultTab, setActiveVaultTab] = useState<"overview" | "history" | "limits" | "referral">("overview");

  // Me tab — functional state
  const [expandedSetting, setExpandedSetting] = useState<string | null>(null);
  const [notifications, setNotifications] = useState({
    missions: true, payments: true, messages: false, weekly: true, newGigs: true,
  });
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [generatedApiKey, setGeneratedApiKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English (EAT)");
  const [sessions] = useState([
    { device: "Chrome · Windows", location: "Nairobi, KE", last: "Active now", current: true },
    { device: "Safari · iPhone 15", location: "Nairobi, KE", last: "2 hours ago", current: false },
  ]);
  const [revokedSession, setRevokedSession] = useState<number[]>([]);

  // Chat message state
  const [chatInput, setChatInput] = useState("");
  const [selectedChat, setSelectedChat] = useState<number | null>(null);

  const uplinkPackages = [
    { id: 1, name: "Starter", price: 3, hu: 150, desc: "Apply for a few small gigs today.", hot: false },
    { id: 2, name: "Basic", price: 6, hu: 400, desc: "Expand reach to local tasks.", hot: false },
    { id: 3, name: "Pro Uplink", price: 10, hu: 1200, desc: "Unlock Global Corporate missions.", hot: true },
    { id: 4, name: "Elite", price: 18, hu: 2500, desc: "Priority handshakes + HR direct.", hot: false },
    { id: 5, name: "Alpha", price: 30, hu: 5000, desc: "Maximum power for top workers.", hot: false },
  ];

  const marketplaceGigs = useMemo(() => [
    { id: "1", title: "API Security Penetration Test", budget: 2100, client: "SafeVault", img: "https://i.pravatar.cc/150?u=safe", type: "Security", duration: "7 Days", cost: 10 },
    { id: "2", title: "Python Scripts for Data Analysis", budget: 110, client: "BioTech Lab", img: "https://i.pravatar.cc/150?u=lab", type: "Academic", duration: "5 Days", cost: 10 },
    { id: "3", title: "Smart Contract Audit (Solidity)", budget: 2200, client: "Nexus Protocol", img: "https://i.pravatar.cc/150?u=crypto", type: "Web3", duration: "5 Days", cost: 10 },
    { id: "4", title: "Next.js Speed & SEO Optimization", budget: 800, client: "E-Com Solutions", img: "https://i.pravatar.cc/150?u=ecom", type: "Startup", duration: "4 Days", cost: 10 },
    { id: "5", title: "Mobile App UI/UX Redesign", budget: 1400, client: "AppWorks Studio", img: "https://i.pravatar.cc/150?u=appworks", type: "Design", duration: "10 Days", cost: 10 },
    { id: "6", title: "AI Chatbot Integration (OpenAI)", budget: 950, client: "RetailBot Inc", img: "https://i.pravatar.cc/150?u=retail", type: "AI", duration: "6 Days", cost: 10 },
  ], []);

  const corporateGigs = useMemo(() => [
    { id: "c1", title: "Remote Fleet Data Analyst", salary: 8000, domain: "tesla.com", company: "Tesla", cost: 50, badge: "EV · Remote" },
    { id: "c2", title: "Cloud Support Engineer", salary: 9000, domain: "amazon.com", company: "Amazon", cost: 50, badge: "AWS · Senior" },
    { id: "c3", title: "Payment Integrity Analyst", salary: 11000, domain: "stripe.com", company: "Stripe", cost: 50, badge: "FinTech · Remote" },
    { id: "c4", title: "Security Operations Specialist", salary: 12000, domain: "kraken.com", company: "Kraken", cost: 50, badge: "Crypto · Remote" },
    { id: "c5", title: "Frontend Engineer (React)", salary: 10500, domain: "shopify.com", company: "Shopify", cost: 50, badge: "E-Com · Remote" },
    { id: "c6", title: "Data Platform Engineer", salary: 13500, domain: "databricks.com", company: "Databricks", cost: 50, badge: "Data · Senior" },
  ], []);

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
    { sender: "Uplink HQ", body: "Welcome to the Nexus. To keep global clients secure, you must hold Handshake Units (HU). Refilling gives you immediate access to all missions.", time: "Just now", unread: true, avatar: "🏢" },
    { sender: "Security Bot", body: "Encryption active. Your uplink power is low (5 HU). Missions require at least 10 HU to apply. Pick a package to establish a permanent connection.", time: "14m ago", unread: true, avatar: "🤖" },
    { sender: "Exchange Relay", body: "Rates Updated: $1.00 is trading at KES 130.00. Use the Vault Calculator to verify node liquidity before withdrawal.", time: "1h ago", unread: false, avatar: "📡" },
  ];

  const typeColors: Record<string, string> = {
    Security: "#f87171", Academic: "#60a5fa", Web3: "#a78bfa", Startup: "#fb923c", Design: "#e879f9", AI: "#34d399",
  };

  const openRefill = () => { setModalStep("packages"); setShowModal(true); };

  const handleApply = (cost: number) => {
    if (huBalance >= cost) {
      setHuBalance((p) => p - cost);
      addToast(`Handshake sent! −${cost} HU`, "success");
    } else {
      addToast(`Need ${cost - huBalance} more HU to apply`, "error");
      openRefill();
    }
  };

  const handlePay = async (method: "CARD" | "MPESA") => {
    if (!agreed) return addToast("Please agree to the network rules first.", "info");
    if (!selectedPack) return addToast("Select a package first.", "error");
    setIsPaying(true);
    try {
      if (method === "CARD") {
        // Charge the exact KES amount shown for the selected package
        const kesAmount = selectedPack.price * RATE;
        const res = await fetch("/api/paystack", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: kesAmount,         // deduct KES as displayed (e.g. KES 1,300 for Pro Uplink)
            currency: "KES",
            email: user?.primaryEmailAddress?.emailAddress,
            metadata: { hu: selectedPack.hu, pack: selectedPack.name },
          }),
        });
        const data = await res.json();
        if (data?.data?.authorization_url) window.location.href = data.data.authorization_url;
        else addToast("Payment gateway error.", "error");
      } else {
        const clean = mpesaNum.replace(/\D/g, "");
        if (!clean.startsWith("254") || clean.length !== 12) {
          addToast("Format: 254XXXXXXXXX (12 digits)", "error"); return;
        }
        const res = await fetch("/api/intasend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: selectedPack.price * RATE,
            phone: clean,
            email: user?.primaryEmailAddress?.emailAddress,
            metadata: { hu: selectedPack.hu },
          }),
        });
        if (res.ok) { addToast("Check your phone for the STK prompt.", "success"); setShowModal(false); }
        else addToast("M-Pesa connection failed.", "error");
      }
    } catch { addToast("Network error. Try again.", "error"); }
    finally { setIsPaying(false); }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText("TFWxe4TFcjUNgPJVgf5iXrMsw1oe4gDv9X");
    setCopied(true);
    addToast("Address copied!", "success");
    setTimeout(() => setCopied(false), 2500);
  };

  const generateApiKey = () => {
    const key = "nxs_" + Array.from({ length: 32 }, () => "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)]).join("");
    setGeneratedApiKey(key);
    addToast("API key generated!", "success");
  };

  const faqItems = [
    { q: "What are Handshake Units (HU)?", a: "HU are your access tokens to the Nexus network. Each application to a gig costs HU, which ensures only serious operators engage with global clients. They protect the ecosystem from spam." },
    { q: "How long does M-Pesa payment take?", a: "M-Pesa STK push is instant. You'll receive a pop-up on your Safaricom phone within seconds. HU are credited to your account within 5 minutes of payment confirmation." },
    { q: "Can I withdraw my earnings?", a: "Yes! Once your balance reaches $50, you can withdraw via M-Pesa, Bank Transfer, or Binance. Verify your profile to unlock the full withdrawal suite." },
    { q: "What is the minimum to apply for a gig?", a: "Standard marketplace gigs require 10 HU minimum. Corporate missions from Fortune 500 companies require 50 HU due to higher client standards and verification layers." },
    { q: "Is my data secure?", a: "All data is encrypted via TLS 1.3 and AES-256 at rest. We never share your personal information with third parties without your explicit consent." },
  ];

  return (
    <div className="min-h-screen text-white font-sans pb-28 overflow-x-hidden"
      style={{ background: "linear-gradient(160deg, #030810 0%, #050c18 60%, #03080f 100%)" }}>

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-175 h-175 rounded-full opacity-[0.04] blur-[140px]"
          style={{ background: "radial-gradient(circle, #00f5d4, transparent)" }} />
        <div className="absolute bottom-0 -left-40 w-150 h-150 rounded-full opacity-[0.05] blur-[120px]"
          style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
      </div>

      {/* Toasts */}
      <div className="fixed top-5 right-4 z-999 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div key={t.id} initial={{ opacity: 0, x: 80, scale: 0.92 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 80, scale: 0.92 }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-wider border backdrop-blur-2xl shadow-2xl ${
                t.type === "success" ? "bg-emerald-500/15 border-emerald-500/25 text-emerald-400"
                  : t.type === "error" ? "bg-red-500/15 border-red-500/25 text-red-400"
                  : "bg-blue-500/15 border-blue-500/25 text-blue-400"}`}>
              {t.type === "success" ? <CheckCircle size={12} /> : t.type === "error" ? <AlertTriangle size={12} /> : <BellRing size={12} />}
              <span>{t.msg}</span>
              <button onClick={() => setToasts((p) => p.filter((x) => x.id !== t.id))} className="ml-1 opacity-40 hover:opacity-100"><X size={10} /></button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="max-w-5xl mx-auto pt-5 px-4 relative z-10">
        <AnimatePresence mode="wait">

          {/* ══════════════════════════════════════════════════════
              HOME
          ══════════════════════════════════════════════════════ */}
          {activeTab === "home" && (
            <motion.div key="home" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="space-y-5">
              <header className="relative flex justify-between items-center p-6 rounded-[26px] border border-white/[0.07] bg-white/[0.035] backdrop-blur-2xl overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-0.75 h-full rounded-r-full" style={{ background: "linear-gradient(to bottom, #00f5d4, transparent)" }} />
                <div className="pl-2">
                  <p className="text-[8px] font-black uppercase tracking-[0.25em] text-white/25 mb-1.5">Global Uplink Network</p>
                  <h2 className="text-[26px] font-black italic uppercase tracking-tighter leading-none text-white">{user?.firstName || "Operator"}</h2>
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
                  <button onClick={() => setCurrency((c) => (c === "USD" ? "KES" : "USD"))}
                    className="text-[7px] font-black uppercase bg-white/4 border border-white/[0.07] px-3 py-1.5 rounded-lg text-white/30 hover:text-white transition-all">
                    {currency} ⇄
                  </button>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <GlassCard className="md:col-span-3 p-6 space-y-4" accent glow>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(0,245,212,0.12)" }}>
                      <ShieldCheck size={18} className="text-[#00f5d4]" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.18em] text-white">Protocol Verification</h4>
                      <p className="text-[8px] text-white/25 font-bold uppercase tracking-widest">Uplink Authentication</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-white/40 leading-relaxed">
                    Fortune 500 handshakes require <span className="text-[#00f5d4] font-bold">Uplink Units (HU)</span> to transmit your profile. HU filters bot applications and places you at the front of hiring queues globally.
                  </p>
                  <div className="flex gap-2">
                    <RippleButton onClick={openRefill} className="flex-1 py-3 rounded-[14px] text-[9px] font-black uppercase tracking-widest text-black"
                      style={{ background: "linear-gradient(135deg, #00f5d4, #0097a7)" }}>
                      Refill Uplink
                    </RippleButton>
                    <button onClick={() => setActiveTab("tasks")}
                      className="px-5 py-3 rounded-[14px] text-[9px] font-black uppercase tracking-widest border border-white/8 bg-white/4 text-white/50 hover:text-white transition-all">
                      View Gigs →
                    </button>
                  </div>
                </GlassCard>
                <div className="md:col-span-2 grid grid-cols-2 gap-3">
                  <StatCard label="Success Rate" value="0%" icon={<CheckCircle2 size={15} />} color="#34d399" />
                  <StatCard label="System Uptime" value="99.9%" icon={<Wifi size={15} />} color="#00f5d4" />
                  <StatCard label="Live Missions" value={marketplaceGigs.length + corporateGigs.length} icon={<Target size={15} />} color="#a78bfa" />
                  <StatCard label="Trust Level" value="Beta" icon={<Shield size={15} />} color="#fb923c" />
                </div>
              </div>

              {/* HU info banner */}
              <div className="p-4 rounded-2xl border flex items-center gap-4"
                style={{ background: "linear-gradient(135deg, rgba(255,193,7,0.06), rgba(255,152,0,0.04))", borderColor: "rgba(255,193,7,0.2)" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg, #ffd700, #ff8c00)" }}>
                  <Info size={16} className="text-black" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-amber-300">Minimum 10 HU required to apply for any gig</p>
                  <p className="text-[8px] text-white/25 font-bold mt-0.5">Your current balance: {huBalance} HU · You need {Math.max(0, 10 - huBalance)} more HU</p>
                </div>
                <button onClick={openRefill} className="ml-auto shrink-0 px-3 py-1.5 rounded-[10px] text-[8px] font-black uppercase tracking-widest text-black"
                  style={{ background: "linear-gradient(135deg, #ffd700, #ff8c00)" }}>
                  Top Up
                </button>
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { icon: <Zap size={16} />, label: "Refill HU", color: "#00f5d4", action: openRefill },
                  { icon: <Briefcase size={16} />, label: "Browse Gigs", color: "#a78bfa", action: () => setActiveTab("tasks") },
                  { icon: <Wallet size={16} />, label: "Vault", color: "#34d399", action: () => setActiveTab("earnings") },
                  { icon: <BarChart3 size={16} />, label: "My Stats", color: "#fb923c", action: () => setActiveTab("analytics") },
                ].map((item, i) => (
                  <button key={i} onClick={item.action}
                    className="p-4 rounded-[18px] border border-white/[0.07] bg-white/3 hover:border-white/12 hover:bg-white/5 transition-all text-center group">
                    <div className="flex justify-center mb-2 transition-transform group-hover:scale-110" style={{ color: item.color }}>{item.icon}</div>
                    <p className="text-[7px] font-black uppercase tracking-widest text-white/30 group-hover:text-white/60 transition-all leading-none">{item.label}</p>
                  </button>
                ))}
              </div>

              {/* Live activity */}
              <GlassCard className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Activity size={13} className="text-[#00f5d4]" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Network Activity</span>
                  </div>
                  <Badge color="#34d399"><PulseDot color="#34d399" size={5} /> Live</Badge>
                </div>
                <div className="space-y-3">
                  {[
                    { msg: "Emmanuel K. earned $850 via Stripe Gig", time: "2m ago", color: "#34d399" },
                    { msg: "David N. applied to Tesla Data Analyst role", time: "7m ago", color: "#00f5d4" },
                    { msg: "Alice V. withdrew KES 14,000 successfully", time: "15m ago", color: "#a78bfa" },
                    { msg: "John M. refilled 1200 HU · Pro Uplink", time: "22m ago", color: "#fb923c" },
                  ].map((a, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <PulseDot color={a.color} size={5} />
                      <p className="text-[9px] text-white/30 font-bold flex-1">{a.msg}</p>
                      <span className="text-[7px] text-white/15 font-bold uppercase shrink-0">{a.time}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Ticker */}
              <div className="relative overflow-hidden rounded-[14px] border border-white/5 bg-white/2 py-3">
                <motion.div className="whitespace-nowrap flex gap-16 items-center"
                  animate={{ x: [0, -700] }} transition={{ repeat: Infinity, duration: 28, ease: "linear" }}>
                  {["Emmanuel refilled 1200 HU", "David N. earned $850", "John M. applied for Tesla", "Alice V. withdrew KES 14,000",
                    "System: Encryption Secure · TLS 1.3", "Kraken · Stripe · Amazon hiring now"].map((t, i) => (
                    <span key={i} className="inline-flex items-center gap-2.5 text-[8px] font-black text-white/20 uppercase tracking-[0.18em]">
                      <PulseDot color="#00f5d4" size={4} />{t}
                    </span>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════
              GIGS — Fully visible, apply button locked per HU
          ══════════════════════════════════════════════════════ */}
          {activeTab === "tasks" && (
            <motion.div key="tasks" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="space-y-5">
              <div className="flex items-center justify-between">
                <SectionHead label="Mission Feed" />
                <Badge color="#34d399"><PulseDot color="#34d399" size={5} /> Uplink Active</Badge>
              </div>

              {/* HU warning — sticky top */}
              {huBalance < 10 && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl border flex items-center gap-4"
                  style={{ background: "linear-gradient(135deg, rgba(255,193,7,0.08), rgba(255,152,0,0.05))", borderColor: "rgba(255,193,7,0.25)" }}>
                  <div className="relative shrink-0">
                    <div className="relative w-10 h-10 rounded-xl flex items-center justify-center border border-amber-400/40"
                      style={{ background: "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,140,0,0.15))" }}>
                      <Lock size={18} className="text-amber-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-300">Apply buttons locked · Need {10 - huBalance} more HU</p>
                    <p className="text-[8px] text-white/25 font-bold mt-0.5">Browse all {marketplaceGigs.length + corporateGigs.length} gigs freely — refill HU to apply</p>
                  </div>
                  <button onClick={openRefill} className="shrink-0 px-4 py-2 rounded-[10px] text-[8px] font-black uppercase tracking-widest text-black"
                    style={{ background: "linear-gradient(135deg, #ffd700, #ff8c00)" }}>
                    Unlock ✦
                  </button>
                </motion.div>
              )}

              {/* Mode toggle */}
              <div className="flex gap-1 p-1 rounded-2xl border border-white/[0.07] bg-white/3 w-fit mx-auto">
                {(["marketplace", "corporate"] as const).map((m) => (
                  <button key={m} onClick={() => setGigMode(m)}
                    className={`px-8 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${gigMode === m ? "bg-[#00f5d4] text-black shadow-lg" : "text-white/30 hover:text-white/60"}`}>
                    {m}
                  </button>
                ))}
              </div>

              {gigMode === "marketplace" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {marketplaceGigs.map((g) => {
                    const canApply = huBalance >= g.cost;
                    return (
                      <div key={g.id} className="p-5 rounded-[22px] border border-white/[0.07] bg-white/[0.035] hover:border-white/[0.14] hover:bg-white/4.5 transition-all shadow-xl">
                        <div className="flex items-start justify-between mb-4">
                          <img src={g.img} className="w-10 h-10 rounded-xl border border-white/10 object-cover" alt={g.client} />
                          <Badge color={typeColors[g.type] || "#00f5d4"}>{g.type}</Badge>
                        </div>
                        <h4 className="text-[11px] font-black uppercase text-white mb-1 leading-snug line-clamp-2">{g.title}</h4>
                        <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest mb-4">{g.client} · {g.duration}</p>
                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                          <div>
                            <p className="text-[14px] font-black text-white leading-none">{fmt(g.budget)}</p>
                            <p className="text-[7px] text-white/25 font-bold uppercase mt-0.5">Project budget</p>
                          </div>
                          {canApply ? (
                            <RippleButton onClick={() => handleApply(g.cost)}
                              className="px-5 py-2.5 rounded-[11px] text-[8px] font-black uppercase tracking-widest text-black"
                              style={{ background: "linear-gradient(135deg, #00f5d4, #0097a7)" }}>
                              Apply · {g.cost} HU
                            </RippleButton>
                          ) : (
                            <button onClick={openRefill}
                              className="px-5 py-2.5 rounded-[11px] text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-amber-400/30 transition-all hover:bg-amber-400/10"
                              style={{ color: "#fbbf24", background: "rgba(255,193,7,0.06)" }}>
                              <Lock size={9} /> Need {g.cost} HU
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {corporateGigs.map((c) => {
                    const canApply = huBalance >= c.cost;
                    return (
                      <div key={c.id} className="p-6 rounded-[26px] border border-white/[0.07] bg-white/[0.035] hover:border-white/[0.14] hover:bg-white/5 transition-all shadow-2xl group">
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
                        {canApply ? (
                          <RippleButton onClick={() => handleApply(c.cost)}
                            className="w-full py-3.5 rounded-[14px] text-[9px] font-black uppercase tracking-widest border border-white/8 bg-white/6 text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                            <Zap size={12} className="text-[#00f5d4]" /> Handshake · {c.cost} HU <ArrowUpRight size={12} />
                          </RippleButton>
                        ) : (
                          <button onClick={openRefill}
                            className="w-full py-3.5 rounded-[14px] text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-amber-400/25 transition-all hover:bg-amber-400/8"
                            style={{ color: "#fbbf24", background: "rgba(255,193,7,0.05)" }}>
                            <Lock size={12} /> Requires {c.cost} HU · Refill to Apply <ArrowUpRight size={12} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════
              VAULT
          ══════════════════════════════════════════════════════ */}
          {activeTab === "earnings" && (
            <motion.div key="earnings" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="space-y-5">
              <SectionHead label="Vault Hub" />
              <div className="flex gap-1 p-1 rounded-2xl border border-white/[0.07] bg-white/3 w-fit">
                {(["overview", "history", "limits", "referral"] as const).map((t) => (
                  <button key={t} onClick={() => setActiveVaultTab(t)}
                    className={`px-5 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${activeVaultTab === t ? "bg-[#00f5d4] text-black" : "text-white/30 hover:text-white/60"}`}>
                    {t}
                  </button>
                ))}
              </div>

              {activeVaultTab === "overview" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-7 rounded-[28px] border border-[#00f5d4]/15 overflow-hidden relative"
                      style={{ background: "linear-gradient(135deg, rgba(0,245,212,0.08) 0%, rgba(0,245,212,0.02) 100%)" }}>
                      <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] opacity-30"
                        style={{ background: "radial-gradient(circle, #00f5d4, transparent)" }} />
                      <div className="flex items-center justify-between mb-5">
                        <Zap size={20} className="text-[#00f5d4]" fill="#00f5d4" />
                        <Badge color="#00f5d4"><PulseDot color="#00f5d4" size={4} /> Liquid</Badge>
                      </div>
                      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 mb-1.5">Uplink Units</p>
                      <div className="flex items-end gap-2 mb-1">
                        <span className="text-[40px] font-black italic text-white leading-none">{huBalance}</span>
                        <span className="text-[18px] font-black text-[#00f5d4] mb-1">HU</span>
                      </div>
                      <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Liquid Power Available</p>
                      <div className="flex gap-2 mt-5">
                        <button onClick={openRefill} className="flex-1 px-5 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest text-black"
                          style={{ background: "linear-gradient(135deg, #00f5d4, #0097a7)" }}>
                          + Refill
                        </button>
                        <button onClick={() => setActiveVaultTab("history")} className="px-4 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest border border-white/8 bg-white/4 text-white/40 hover:text-white transition-all">
                          History
                        </button>
                      </div>
                    </div>

                    <div className="p-7 rounded-[28px] border border-emerald-500/15 overflow-hidden relative"
                      style={{ background: "linear-gradient(135deg, rgba(52,211,153,0.07) 0%, rgba(52,211,153,0.02) 100%)" }}>
                      <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] opacity-20"
                        style={{ background: "radial-gradient(circle, #34d399, transparent)" }} />
                      <div className="flex items-center justify-between mb-5">
                        <DollarSign size={20} className="text-emerald-400" />
                        <button onClick={() => setShowBalance(b => !b)} className="text-white/20 hover:text-white/50 transition-all">
                          {showBalance ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>
                      </div>
                      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 mb-1.5">Settlement Balance</p>
                      <div className="flex items-end gap-2 mb-1">
                        <span className="text-[40px] font-black italic text-white leading-none">
                          {showBalance ? fmt(cashBalance) : "••••••"}
                        </span>
                      </div>
                      <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Available for withdrawal</p>
                      <RippleButton onClick={() => addToast("Minimum withdrawal is $50.00", "error")}
                        className="mt-5 w-full py-3 rounded-[14px] text-[9px] font-black uppercase tracking-widest border border-white/8 bg-white/5 text-white/50 hover:text-white transition-all flex items-center justify-center gap-2">
                        Withdraw <ArrowUpRight size={12} />
                      </RippleButton>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <StatCard label="Total Earned" value="$0" icon={<TrendingUp size={15} />} color="#34d399" sub="Lifetime" />
                    <StatCard label="Withdrawn" value="$0" icon={<Download size={15} />} color="#60a5fa" sub="All time" />
                    <StatCard label="Pending" value="$0" icon={<Clock size={15} />} color="#fb923c" sub="In review" />
                    <StatCard label="HU Spent" value="0" icon={<Zap size={15} />} color="#00f5d4" sub="All gigs" />
                  </div>

                  <GlassCard className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Calculator size={13} className="text-[#00f5d4]" />
                      <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/50">HU → KES Converter</span>
                    </div>
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                      <div className="bg-black/40 p-3 rounded-[14px] border border-white/6">
                        <p className="text-[7px] font-black text-white/20 uppercase mb-1">Units (HU)</p>
                        <input type="number" value={calcHU} onChange={(e) => setCalcHU(e.target.value)}
                          className="bg-transparent w-full text-[15px] font-black outline-none text-white" />
                      </div>
                      <RefreshCw size={13} className="text-white/15 animate-spin" style={{ animationDuration: "5s" }} />
                      <div className="bg-black/40 p-3 rounded-[14px] border border-white/6 text-right">
                        <p className="text-[7px] font-black text-white/20 uppercase mb-1">KES</p>
                        <p className="text-[15px] font-black text-emerald-400 leading-none">{isNaN(calcKES) ? "—" : calcKES.toLocaleString()}</p>
                      </div>
                    </div>
                  </GlassCard>

                  <GlassCard className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <CreditCard size={13} className="text-[#00f5d4]" />
                      <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/50">Withdrawal Methods</span>
                    </div>
                    <div className="space-y-2.5">
                      {[
                        { name: "M-Pesa", sub: "Instant · KES", status: "Active", color: "#34d399", logo: <MpesaLogo /> },
                        { name: "Bank Transfer", sub: "1-3 days · USD/KES", status: "Available", color: "#60a5fa", logo: <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center"><Landmark size={18} className="text-white" /></div> },
                        { name: "Binance USDT", sub: "TRC20 · Instant", status: "Available", color: "#f59e0b", logo: <BinanceLogo /> },
                      ].map((m, i) => (
                        <div key={i} className="flex items-center gap-4 p-3.5 bg-black/30 rounded-2xl border border-white/5">
                          {m.logo}
                          <div className="flex-1">
                            <p className="text-[10px] font-black text-white">{m.name}</p>
                            <p className="text-[8px] text-white/25 font-bold uppercase tracking-wide">{m.sub}</p>
                          </div>
                          <Badge color={m.color}>{m.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </div>
              )}

              {activeVaultTab === "history" && (
                <PremiumLockedSection
                  title="Transaction History"
                  description="Your complete earnings ledger, withdrawal records, and HU spend history appear here once you complete your first mission or refill."
                  icon={<Clock size={28} />}
                  cta="Apply to First Gig"
                  onCta={() => setActiveTab("tasks")}
                  features={["Full ledger", "CSV export", "HU log", "Withdrawal history"]}
                />
              )}

              {activeVaultTab === "limits" && (
                <div className="space-y-3">
                  <GlassCard className="p-5">
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-4">Account Limits</h4>
                    <div className="space-y-4">
                      {[
                        { label: "Daily Withdrawal", used: 0, limit: 500, unit: "USD" },
                        { label: "Monthly Withdrawal", used: 0, limit: 5000, unit: "USD" },
                        { label: "HU Spend Today", used: 0, limit: 200, unit: "HU" },
                      ].map((item, i) => (
                        <div key={i}>
                          <div className="flex justify-between mb-1.5">
                            <span className="text-[9px] font-black text-white/50 uppercase tracking-wider">{item.label}</span>
                            <span className="text-[9px] font-black text-white">{item.used} / {item.limit} {item.unit}</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${(item.used / item.limit) * 100}%`, background: "linear-gradient(90deg, #00f5d4, #0097a7)" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                  <div className="p-4 bg-amber-500/6 border border-amber-500/15 rounded-2xl flex items-center gap-3">
                    <ChevronsUp size={14} className="text-amber-400 shrink-0" />
                    <div>
                      <p className="text-[9px] font-black text-amber-300 uppercase tracking-widest">Verify your profile to increase limits</p>
                      <p className="text-[8px] text-white/25 font-bold mt-0.5">Verified accounts get 10x higher withdrawal limits</p>
                    </div>
                    <button onClick={openRefill} className="ml-auto shrink-0 px-3 py-1.5 rounded-[10px] text-[7px] font-black uppercase tracking-widest text-amber-300 border border-amber-400/30 hover:bg-amber-400/10 transition-all">
                      Verify
                    </button>
                  </div>
                </div>
              )}

              {activeVaultTab === "referral" && (
                <div className="space-y-4">
                  <div className="p-7 rounded-[28px] border border-[#00f5d4]/15 text-center relative overflow-hidden"
                    style={{ background: "linear-gradient(135deg, rgba(0,245,212,0.06), rgba(0,245,212,0.02))" }}>
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-20"
                      style={{ background: "radial-gradient(circle, #00f5d4, transparent)" }} />
                    <Gift size={32} className="mx-auto text-[#00f5d4] mb-3" />
                    <h4 className="text-[16px] font-black italic uppercase tracking-tight text-white mb-2">Refer & Earn</h4>
                    <p className="text-[9px] text-white/30 font-bold mb-5">Earn 50 HU for every friend who joins and refills</p>
                    <div className="bg-black/40 p-4 rounded-2xl border border-white/6 flex items-center gap-3 text-left mb-4">
                      <div className="flex-1">
                        <p className="text-[7px] text-white/20 uppercase font-bold mb-1">Your referral code</p>
                        <p className="text-[14px] font-black text-[#00f5d4] tracking-widest">NEXUS-{user?.firstName?.toUpperCase() || "USER"}07</p>
                      </div>
                      <button onClick={() => { navigator.clipboard.writeText("NEXUS-" + (user?.firstName?.toUpperCase() || "USER") + "07"); addToast("Referral code copied!", "success"); }}
                        className="p-2.5 bg-white/5 border border-white/6 rounded-xl hover:bg-white/10 transition-all">
                        <Copy size={14} className="text-white/30" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <StatCard label="Referred" value="0" icon={<User size={14} />} color="#00f5d4" />
                      <StatCard label="HU Earned" value="0" icon={<Zap size={14} />} color="#34d399" />
                      <StatCard label="$ Earned" value="$0" icon={<DollarSign size={14} />} color="#fb923c" />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════
              WORK — Premium locked with feature preview
          ══════════════════════════════════════════════════════ */}
          {activeTab === "contracts" && (
            <motion.div key="contracts" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="space-y-5">
              <SectionHead label="Work Hub" />

              {/* Teaser stats — grayed out */}
              <div className="grid grid-cols-4 gap-3 opacity-30 pointer-events-none select-none">
                <StatCard label="Active Work" value="—" icon={<Briefcase size={15} />} color="#00f5d4" />
                <StatCard label="Completed" value="—" icon={<CheckCircle2 size={15} />} color="#34d399" />
                <StatCard label="Earned" value="—" icon={<DollarSign size={15} />} color="#fb923c" />
                <StatCard label="Rating" value="—" icon={<Star size={15} />} color="#a78bfa" />
              </div>

              {/* Premium locked */}
              <PremiumLockedSection
                title="Work History Locked"
                description="Your active contracts, completed missions, earnings breakdown, and client ratings appear here. Apply to your first gig to unlock this hub."
                icon={<FileText size={28} />}
                cta="Browse Gigs Now"
                onCta={() => setActiveTab("tasks")}
                features={["Active contracts", "Client messaging", "Milestone tracker", "Earnings log", "Dispute center", "Rating system"]}
              />

              {/* Blurred mock contract card */}
              <div className="relative p-6 rounded-[22px] border border-white/5 bg-white/2 overflow-hidden">
                <div className="absolute inset-0 z-10" style={{ backdropFilter: "blur(12px)" }} />
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-white/10 rounded-full w-2/3" />
                    <div className="h-2 bg-white/5 rounded-full w-1/2" />
                  </div>
                  <div className="h-5 bg-white/10 rounded-full w-16" />
                </div>
                <div className="h-2 bg-white/5 rounded-full w-full mb-2" />
                <div className="h-2 bg-white/5 rounded-full w-4/5" />
                {/* Lock badge centered */}
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <div className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl">
                    <Lock size={16} className="text-[#00f5d4]" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Complete a gig to unlock</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════
              STATS
          ══════════════════════════════════════════════════════ */}
          {activeTab === "analytics" && (
            <motion.div key="analytics" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="space-y-5">
              <SectionHead label="Performance Stats" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Success Rate" value="0%" icon={<CheckCircle2 size={15} />} color="#34d399" />
                <StatCard label="Missions" value="0" icon={<Briefcase size={15} />} color="#00f5d4" />
                <StatCard label="Settled" value={fmt(0)} icon={<DollarSign size={15} />} color="#fb923c" />
                <StatCard label="Uptime" value="100%" icon={<Wifi size={15} />} color="#a78bfa" />
              </div>
              <PremiumLockedSection
                title="Analytics Dashboard"
                description="Charts, earnings trends, application history, win rate, and client breakdown appear after your first completed mission."
                icon={<BarChart3 size={28} />}
                cta="Apply to First Gig"
                onCta={() => setActiveTab("tasks")}
                features={["Earnings chart", "Win rate", "Client ratings", "Skill breakdown"]}
              />
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════
              SUPPORT
          ══════════════════════════════════════════════════════ */}
          {activeTab === "support" && (
            <motion.div key="support" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="max-w-lg mx-auto space-y-5">
              <SectionHead label="Help Center" />

              <div className="p-4 rounded-2xl border flex items-center gap-4"
                style={{ background: "linear-gradient(135deg, rgba(52,211,153,0.06), rgba(52,211,153,0.02))", borderColor: "rgba(52,211,153,0.2)" }}>
                <PulseDot color="#34d399" size={8} />
                <div>
                  <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">All Systems Operational</p>
                  <p className="text-[8px] text-white/25 font-bold">Platform · Payments · Uplink · Vault — All running normally</p>
                </div>
                <Badge color="#34d399" className="ml-auto">99.9%</Badge>
              </div>

              <GlassCard className="p-5 space-y-3" glow>
                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-white/25 mb-2">Contact Channels</p>
                {[
                  { label: "Email Support", value: "support@nexusgigs.me", icon: <Mail size={15} />, sub: "Avg. reply: 2hrs", color: "#60a5fa", action: () => window.location.href = "mailto:support@nexusgigs.me" },
                  { label: "WhatsApp Relay", value: "+254 113 637325", icon: <Phone size={15} />, sub: "Mon–Fri 08:00–20:00 EAT", color: "#34d399", action: () => window.open("https://wa.me/254113637325", "_blank") },
                  { label: "Live Chat", value: "In-app messaging", icon: <MessageSquare size={15} />, sub: "Beta · Coming soon", color: "#a78bfa", action: undefined },
                ].map((item, i) => (
                  <div key={i} onClick={item.action}
                    className={`p-4 bg-black/30 rounded-2xl border border-white/6 flex items-center gap-4 ${item.action ? "cursor-pointer hover:border-[#00f5d4]/30" : "opacity-60"} transition-all`}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-[8px] font-black uppercase tracking-widest text-white/30">{item.label}</p>
                      <p className="text-[11px] font-black text-white mt-0.5">{item.value}</p>
                      <p className="text-[7px] text-white/20 font-bold uppercase tracking-wide mt-0.5">{item.sub}</p>
                    </div>
                    {item.action && <ExternalLink size={13} className="text-white/20 shrink-0" />}
                  </div>
                ))}
              </GlassCard>

              <GlassCard className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <FileQuestion size={13} className="text-[#00f5d4]" />
                  <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/40">Frequently Asked</span>
                </div>
                <div className="space-y-2">
                  {faqItems.map((item, i) => (
                    <div key={i} onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                      className="p-4 bg-black/30 rounded-[14px] border border-white/5 cursor-pointer hover:border-white/10 transition-all">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[9px] font-black text-white/70 uppercase tracking-wide">{item.q}</p>
                        <ChevronDown size={12} className={`text-white/20 shrink-0 transition-transform ${expandedFaq === i ? "rotate-180" : ""}`} />
                      </div>
                      <AnimatePresence>
                        {expandedFaq === i && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                            <p className="text-[9px] text-white/35 leading-relaxed mt-3 pt-3 border-t border-white/5">{item.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════
              MESSAGES — Premium with send locked
          ══════════════════════════════════════════════════════ */}
          {activeTab === "messages" && (
            <motion.div key="messages" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <SectionHead label="System Relay" />
                <Badge color="#fb923c"><Lock size={8} /> Reply Locked</Badge>
              </div>

              {/* Locked compose bar */}
              <div className="p-4 rounded-2xl border border-white/5 bg-white/2 flex items-center gap-3 opacity-50 cursor-not-allowed">
                <div className="flex-1 bg-black/40 border border-white/6 rounded-xl px-4 py-3 text-[10px] text-white/15 font-bold">
                  Apply to a gig to unlock direct client messaging…
                </div>
                <button className="p-3 rounded-xl border border-white/6 bg-white/3">
                  <Lock size={14} className="text-white/20" />
                </button>
              </div>

              {/* Premium locked messaging notice */}
              <div className="p-4 rounded-2xl border flex items-center gap-3"
                style={{ background: "linear-gradient(135deg, rgba(251,146,60,0.06), rgba(251,146,60,0.02))", borderColor: "rgba(251,146,60,0.2)" }}>
                <Crown size={14} className="text-orange-400 shrink-0" />
                <div className="flex-1">
                  <p className="text-[9px] font-black text-orange-300 uppercase tracking-widest">Direct client messaging unlocks after first application</p>
                  <p className="text-[8px] text-white/25 font-bold mt-0.5">System messages below are read-only · Refill HU and apply to enable full relay</p>
                </div>
                <button onClick={openRefill} className="shrink-0 px-3 py-1.5 rounded-[10px] text-[8px] font-black uppercase tracking-widest text-black"
                  style={{ background: "linear-gradient(135deg, #fb923c, #ea580c)" }}>
                  Unlock
                </button>
              </div>

              {messages.map((msg, i) => (
                <div key={i} onClick={() => setExpandedMsg(expandedMsg === i ? null : i)}
                  className={`p-5 rounded-[22px] border cursor-pointer transition-all ${msg.unread ? "bg-[#00f5d4]/4 border-[#00f5d4]/20" : "bg-white/3 border-white/6"}`}>
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-black/40 rounded-xl border border-white/8 flex items-center justify-center text-lg shrink-0 mt-0.5">
                      {msg.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white">{msg.sender}</h4>
                        <span className="text-[7px] text-white/20 font-bold uppercase">{msg.time}</span>
                      </div>
                      <p className={`text-[10px] text-white/35 leading-relaxed ${expandedMsg === i ? "" : "line-clamp-1"}`}>{msg.body}</p>
                      {expandedMsg === i && (
                        <button onClick={(e) => { e.stopPropagation(); openRefill(); }}
                          className="mt-3 flex items-center gap-2 text-[8px] font-black text-[#00f5d4]/60 uppercase tracking-widest hover:text-[#00f5d4] transition-all">
                          <Lock size={10} /> Refill HU to reply <ArrowRight size={10} />
                        </button>
                      )}
                    </div>
                    <ChevronDown size={13} className={`text-white/20 shrink-0 mt-1 transition-transform ${expandedMsg === i ? "rotate-180" : ""}`} />
                  </div>
                  {msg.unread && <div className="flex justify-end mt-2"><span className="w-2 h-2 rounded-full bg-[#00f5d4]" /></div>}
                </div>
              ))}

              {/* Blurred future chat preview */}
              <div className="relative p-5 rounded-[22px] border border-white/5 bg-white/2 overflow-hidden">
                <div className="absolute inset-0 z-10" style={{ backdropFilter: "blur(10px)" }} />
                <div className="flex gap-4 items-center mb-4">
                  <div className="w-10 h-10 bg-white/5 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-2.5 bg-white/8 rounded-full w-1/3" />
                    <div className="h-2 bg-white/4 rounded-full w-1/4" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-white/5 rounded-full w-3/4" />
                  <div className="h-2 bg-white/4 rounded-full w-1/2" />
                </div>
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/8 bg-black/70 backdrop-blur-xl">
                    <Lock size={12} className="text-[#00f5d4]" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/50">Client chats unlock after first mission</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════════
              ACCOUNT — Fully functional
          ══════════════════════════════════════════════════════ */}
          {activeTab === "account" && (
            <motion.div key="account" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="max-w-md mx-auto space-y-4 pb-8">

              {/* Profile hero */}
              <div className="p-8 rounded-[36px] border border-white/[0.07] bg-white/[0.035] backdrop-blur-2xl text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ background: "linear-gradient(90deg, transparent, #00f5d4, transparent)" }} />
                <div className="relative w-28 h-28 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-[30px] blur-2xl opacity-30"
                    style={{ background: "radial-gradient(circle, #00f5d4, transparent)" }} />
                  <div className="relative w-full h-full bg-black/60 rounded-[30px] border border-white/10 flex items-center justify-center overflow-hidden">
                    {user?.imageUrl ? <img src={user.imageUrl} className="w-full h-full object-cover" alt="" /> : <UserCircle size={60} className="text-white/20" />}
                  </div>
                  <div className="absolute -bottom-1 -right-1 p-2 rounded-2xl text-black" style={{ background: "linear-gradient(135deg, #00f5d4, #0097a7)" }}>
                    <BadgeCheck size={14} />
                  </div>
                </div>
                <h3 className="text-[22px] font-black italic uppercase tracking-tight text-white mb-2 leading-none">{user?.fullName || "Operator"}</h3>
                <p className="text-[9px] text-white/25 font-bold uppercase tracking-[0.2em] mb-4">{user?.primaryEmailAddress?.emailAddress || "—"}</p>
                <div className="flex justify-center gap-3 mb-6">
                  <Badge color="#34d399"><PulseDot color="#34d399" size={5} /> Synced</Badge>
                  <Badge color="#00f5d4">{isVerified ? "Elite Node" : "Standard"}</Badge>
                  <Badge color="#fb923c">Beta</Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-6">
                  <StatCard label="HU Balance" value={huBalance} icon={<Zap size={13} />} color="#00f5d4" />
                  <StatCard label="Missions" value="0" icon={<Briefcase size={13} />} color="#a78bfa" />
                  <StatCard label="Earned" value="$0" icon={<DollarSign size={13} />} color="#34d399" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <RippleButton onClick={() => setActiveTab("earnings")}
                    className="py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest text-black flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg, #00f5d4, #0097a7)" }}>
                    Vault <ArrowUpRight size={13} />
                  </RippleButton>
                  <button onClick={openRefill} className="py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest border border-white/8 bg-white/4 text-white/40 hover:text-white flex items-center justify-center gap-2 transition-all">
                    Refill HU <Zap size={13} className="text-[#00f5d4]" />
                  </button>
                </div>
              </div>

              {/* Profile completion */}
              <GlassCard className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Profile Strength</span>
                  <span className="text-[9px] font-black text-[#00f5d4]">40%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full mb-3">
                  <div className="h-full rounded-full w-[40%]" style={{ background: "linear-gradient(90deg, #00f5d4, #0097a7)" }} />
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Email verified", done: true },
                    { label: "Phone number added", done: false },
                    { label: "Profile photo uploaded", done: !!user?.imageUrl },
                    { label: "First HU purchase", done: false },
                    { label: "First gig applied", done: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${item.done ? "bg-[#00f5d4]" : "bg-white/5 border border-white/10"}`}>
                        {item.done && <Check size={9} className="text-black" />}
                      </div>
                      <p className={`text-[9px] font-bold uppercase tracking-wide ${item.done ? "text-white/60" : "text-white/25"}`}>{item.label}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* ── Settings — all functional with expanding panels ── */}
              <GlassCard className="overflow-hidden">

                {/* NOTIFICATIONS */}
                <div>
                  <button onClick={() => setExpandedSetting(expandedSetting === "notifications" ? null : "notifications")}
                    className="w-full flex items-center gap-4 p-4 hover:bg-white/4 transition-all rounded-t-3xl group">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "#00f5d415", color: "#00f5d4" }}>
                      <Bell size={14} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-[10px] font-black text-white uppercase tracking-wide">Notifications</p>
                      <p className="text-[8px] text-white/25 font-bold uppercase tracking-widest">Manage alerts</p>
                    </div>
                    <ChevronDown size={13} className={`text-white/15 group-hover:text-white/40 transition-all ${expandedSetting === "notifications" ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {expandedSetting === "notifications" && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
                        className="overflow-hidden">
                        <div className="px-4 pb-4 space-y-3 border-t border-white/5">
                          <p className="text-[7px] font-black text-white/20 uppercase tracking-widest pt-3 mb-1">Alert preferences</p>
                          {[
                            { key: "missions" as const, label: "New Missions", sub: "Notify when matching gigs post" },
                            { key: "payments" as const, label: "Payment Updates", sub: "HU refills & withdrawals" },
                            { key: "messages" as const, label: "Message Relay", sub: "Client & system messages" },
                            { key: "weekly" as const, label: "Weekly Summary", sub: "Activity digest every Monday" },
                            { key: "newGigs" as const, label: "Gig Alerts", sub: "Corporate missions matching skills" },
                          ].map((n) => (
                            <div key={n.key} className="flex items-center justify-between p-3 bg-black/30 rounded-[14px] border border-white/5">
                              <div>
                                <p className="text-[9px] font-black text-white uppercase tracking-wide">{n.label}</p>
                                <p className="text-[7px] text-white/25 font-bold mt-0.5">{n.sub}</p>
                              </div>
                              <button onClick={() => setNotifications(prev => ({ ...prev, [n.key]: !prev[n.key] }))}
                                className={`relative w-10 h-5 rounded-full transition-all duration-300 ${notifications[n.key] ? "bg-[#00f5d4]" : "bg-white/10"}`}>
                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 ${notifications[n.key] ? "left-5" : "left-0.5"}`} />
                              </button>
                            </div>
                          ))}
                          <button onClick={() => { addToast("Notification preferences saved!", "success"); setExpandedSetting(null); }}
                            className="w-full py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest text-black"
                            style={{ background: "linear-gradient(135deg, #00f5d4, #0097a7)" }}>
                            Save Preferences
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="h-px bg-white/4 mx-4" />

                {/* SECURITY */}
                <div>
                  <button onClick={() => setExpandedSetting(expandedSetting === "security" ? null : "security")}
                    className="w-full flex items-center gap-4 p-4 hover:bg-white/4 transition-all group">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "#60a5fa15", color: "#60a5fa" }}>
                      <Shield size={14} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-[10px] font-black text-white uppercase tracking-wide">Security</p>
                      <p className="text-[8px] text-white/25 font-bold uppercase tracking-widest">2FA · Password</p>
                    </div>
                    <ChevronDown size={13} className={`text-white/15 group-hover:text-white/40 transition-all ${expandedSetting === "security" ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {expandedSetting === "security" && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
                        className="overflow-hidden">
                        <div className="px-4 pb-4 space-y-3 border-t border-white/5">
                          <p className="text-[7px] font-black text-white/20 uppercase tracking-widest pt-3 mb-1">Security settings</p>
                          {/* 2FA Toggle */}
                          <div className="flex items-center justify-between p-3 bg-black/30 rounded-[14px] border border-white/5">
                            <div>
                              <p className="text-[9px] font-black text-white uppercase tracking-wide">Two-Factor Auth</p>
                              <p className="text-[7px] text-white/25 font-bold mt-0.5">{twoFAEnabled ? "Active — Authenticator app linked" : "Disabled — strongly recommended"}</p>
                            </div>
                            <button onClick={() => { setTwoFAEnabled(f => !f); addToast(twoFAEnabled ? "2FA disabled" : "2FA enabled! Scan QR in your auth app.", twoFAEnabled ? "info" : "success"); }}
                              className={`relative w-10 h-5 rounded-full transition-all duration-300 ${twoFAEnabled ? "bg-[#00f5d4]" : "bg-white/10"}`}>
                              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 ${twoFAEnabled ? "left-5" : "left-0.5"}`} />
                            </button>
                          </div>
                          {/* Change password */}
                          <button onClick={() => addToast("Password reset link sent to your email!", "success")}
                            className="w-full p-3 bg-black/30 rounded-[14px] border border-white/5 flex items-center justify-between hover:border-white/10 transition-all">
                            <div className="text-left">
                              <p className="text-[9px] font-black text-white uppercase tracking-wide">Change Password</p>
                              <p className="text-[7px] text-white/25 font-bold mt-0.5">Send reset link to email</p>
                            </div>
                            <ChevronRight size={13} className="text-white/20" />
                          </button>
                          {/* Login activity */}
                          <button onClick={() => { setExpandedSetting("devices"); }}
                            className="w-full p-3 bg-black/30 rounded-[14px] border border-white/5 flex items-center justify-between hover:border-white/10 transition-all">
                            <div className="text-left">
                              <p className="text-[9px] font-black text-white uppercase tracking-wide">Login Activity</p>
                              <p className="text-[7px] text-white/25 font-bold mt-0.5">{sessions.length} active sessions</p>
                            </div>
                            <ChevronRight size={13} className="text-white/20" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="h-px bg-white/4 mx-4" />

                {/* API KEYS */}
                <div>
                  <button onClick={() => setExpandedSetting(expandedSetting === "api" ? null : "api")}
                    className="w-full flex items-center gap-4 p-4 hover:bg-white/4 transition-all group">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "#a78bfa15", color: "#a78bfa" }}>
                      <Key size={14} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-[10px] font-black text-white uppercase tracking-wide">API Keys</p>
                      <p className="text-[8px] text-white/25 font-bold uppercase tracking-widest">Developer access</p>
                    </div>
                    <ChevronDown size={13} className={`text-white/15 group-hover:text-white/40 transition-all ${expandedSetting === "api" ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {expandedSetting === "api" && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
                        className="overflow-hidden">
                        <div className="px-4 pb-4 space-y-3 border-t border-white/5">
                          <p className="text-[7px] font-black text-white/20 uppercase tracking-widest pt-3">API credentials</p>
                          {generatedApiKey ? (
                            <div className="p-3 bg-black/40 border border-[#00f5d4]/20 rounded-[14px]">
                              <p className="text-[7px] font-black text-white/20 uppercase mb-2">Your API Key — copy it now, shown once</p>
                              <div className="flex gap-2">
                                <div className="flex-1 font-mono text-[8px] text-[#00f5d4] truncate">{generatedApiKey}</div>
                                <button onClick={() => { navigator.clipboard.writeText(generatedApiKey); setCopiedKey(true); addToast("API key copied!", "success"); setTimeout(() => setCopiedKey(false), 2000); }}
                                  className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                                  {copiedKey ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} className="text-white/40" />}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="p-3 bg-black/30 border border-white/5 rounded-[14px]">
                              <p className="text-[8px] text-white/25 font-bold">No API keys generated yet.</p>
                            </div>
                          )}
                          <button onClick={generateApiKey}
                            className="w-full py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest text-black"
                            style={{ background: "linear-gradient(135deg, #a78bfa, #7c3aed)" }}>
                            {generatedApiKey ? "Regenerate Key" : "Generate API Key"}
                          </button>
                          <p className="text-[7px] text-white/15 font-bold text-center">Keys are for developer integrations only. Keep them secret.</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="h-px bg-white/4 mx-4" />

                {/* LINKED DEVICES */}
                <div>
                  <button onClick={() => setExpandedSetting(expandedSetting === "devices" ? null : "devices")}
                    className="w-full flex items-center gap-4 p-4 hover:bg-white/4 transition-all group">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "#fb923c15", color: "#fb923c" }}>
                      <Smartphone size={14} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-[10px] font-black text-white uppercase tracking-wide">Linked Devices</p>
                      <p className="text-[8px] text-white/25 font-bold uppercase tracking-widest">{sessions.filter((_, i) => !revokedSession.includes(i)).length} active sessions</p>
                    </div>
                    <ChevronDown size={13} className={`text-white/15 group-hover:text-white/40 transition-all ${expandedSetting === "devices" ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {expandedSetting === "devices" && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
                        className="overflow-hidden">
                        <div className="px-4 pb-4 space-y-2.5 border-t border-white/5">
                          <p className="text-[7px] font-black text-white/20 uppercase tracking-widest pt-3">Active sessions</p>
                          {sessions.map((s, i) => (
                            <div key={i} className={`p-3 bg-black/30 rounded-[14px] border transition-all ${revokedSession.includes(i) ? "opacity-30 border-red-500/15" : "border-white/5"}`}>
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="text-[9px] font-black text-white uppercase tracking-wide">{s.device}</p>
                                    {s.current && <Badge color="#34d399">Current</Badge>}
                                    {revokedSession.includes(i) && <Badge color="#ef4444">Revoked</Badge>}
                                  </div>
                                  <p className="text-[7px] text-white/25 font-bold mt-0.5">{s.location} · {s.last}</p>
                                </div>
                                {!s.current && !revokedSession.includes(i) && (
                                  <button onClick={() => { setRevokedSession(r => [...r, i]); addToast("Session revoked successfully", "success"); }}
                                    className="p-1.5 bg-red-500/10 rounded-lg border border-red-500/15 hover:bg-red-500/20 transition-all">
                                    <X size={11} className="text-red-400" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                          <button onClick={() => { setRevokedSession([1]); addToast("All other sessions terminated!", "success"); }}
                            className="w-full py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest border border-red-500/20 text-red-400/70 hover:bg-red-500/8 transition-all">
                            Revoke All Other Sessions
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="h-px bg-white/4 mx-4" />

                {/* LANGUAGE & REGION */}
                <div>
                  <button onClick={() => setExpandedSetting(expandedSetting === "language" ? null : "language")}
                    className="w-full flex items-center gap-4 p-4 hover:bg-white/4 transition-all rounded-b-3xl group">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "#34d39915", color: "#34d399" }}>
                      <Globe size={14} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-[10px] font-black text-white uppercase tracking-wide">Language & Region</p>
                      <p className="text-[8px] text-white/25 font-bold uppercase tracking-widest">{selectedLang}</p>
                    </div>
                    <ChevronDown size={13} className={`text-white/15 group-hover:text-white/40 transition-all ${expandedSetting === "language" ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {expandedSetting === "language" && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
                        className="overflow-hidden">
                        <div className="px-4 pb-4 space-y-2 border-t border-white/5">
                          <p className="text-[7px] font-black text-white/20 uppercase tracking-widest pt-3 mb-1">Select language</p>
                          {["English (EAT)", "Swahili (KE)", "French (FR)", "Arabic (AR)"].map((lang) => (
                            <button key={lang} onClick={() => { setSelectedLang(lang); addToast(`Language set to ${lang}`, "success"); }}
                              className={`w-full p-3 rounded-[14px] border flex items-center justify-between transition-all ${selectedLang === lang ? "border-[#00f5d4]/30 bg-[#00f5d4]/6" : "border-white/5 bg-black/30 hover:border-white/10"}`}>
                              <span className={`text-[9px] font-black uppercase tracking-wide ${selectedLang === lang ? "text-[#00f5d4]" : "text-white/40"}`}>{lang}</span>
                              {selectedLang === lang && <Check size={12} className="text-[#00f5d4]" />}
                            </button>
                          ))}
                          <div className="flex items-center justify-between p-3 bg-black/30 rounded-[14px] border border-white/5">
                            <div>
                              <p className="text-[9px] font-black text-white uppercase tracking-wide">Currency Display</p>
                              <p className="text-[7px] text-white/25 font-bold mt-0.5">Currently showing {currency}</p>
                            </div>
                            <button onClick={() => { setCurrency(c => c === "USD" ? "KES" : "USD"); addToast(`Currency switched to ${currency === "USD" ? "KES" : "USD"}`, "info"); }}
                              className="px-3 py-1.5 rounded-[10px] text-[8px] font-black uppercase tracking-widest border border-white/8 text-white/40 hover:text-white bg-white/3 transition-all">
                              {currency} ⇄
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </GlassCard>

              {/* Achievements */}
              <GlassCard className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy size={13} className="text-amber-400" />
                  <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/40">Achievements</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { icon: "🌐", label: "Nexus Join", earned: true },
                    { icon: "⚡", label: "First HU", earned: false },
                    { icon: "🎯", label: "First Gig", earned: false },
                    { icon: "💰", label: "First $100", earned: false },
                  ].map((a, i) => (
                    <div key={i} onClick={() => !a.earned && openRefill()}
                      className={`p-3 rounded-2xl border text-center transition-all ${a.earned ? "border-amber-400/30 bg-amber-400/6" : "border-white/5 opacity-40 grayscale cursor-pointer hover:opacity-60"}`}>
                      <div className="text-2xl mb-1 leading-none">{a.icon}</div>
                      <p className="text-[6px] font-black uppercase tracking-widest text-white/40 leading-tight">{a.label}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Danger zone */}
              <GlassCard className="p-5 border-red-500/10">
                <p className="text-[8px] font-black uppercase tracking-widest text-red-400/40 mb-3">Danger Zone</p>
                <div className="space-y-2">
                  <button onClick={() => addToast("Data export request submitted. Check your email in 24h.", "info")}
                    className="w-full p-3 rounded-[14px] border border-white/5 bg-black/30 flex items-center justify-between hover:border-white/10 transition-all">
                    <div className="flex items-center gap-3">
                      <Download size={13} className="text-white/30" />
                      <div className="text-left">
                        <p className="text-[9px] font-black text-white uppercase tracking-wide">Export My Data</p>
                        <p className="text-[7px] text-white/25 font-bold mt-0.5">GDPR compliant · Sent to email</p>
                      </div>
                    </div>
                    <ChevronRight size={13} className="text-white/20" />
                  </button>
                  <SignOutButton>
                    <button className="w-full py-4 rounded-[18px] border border-red-500/15 bg-red-500/4 text-red-500/70 text-[9px] font-black uppercase tracking-widest hover:bg-red-500/8 transition-all flex items-center justify-center gap-2">
                      <LogOut size={13} /> Terminate Session
                    </button>
                  </SignOutButton>
                </div>
              </GlassCard>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Nav Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-100 w-[95%] max-w-lg">
        <div className="h-15 bg-black/80 backdrop-blur-3xl border border-white/8 rounded-full flex items-center justify-around px-2 shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-0.5 transition-all duration-200 ${activeTab === item.id ? "text-[#00f5d4] scale-110" : "text-white/20 hover:text-white/50"}`}>
              <div className={`transition-all duration-200 ${activeTab === item.id ? "bg-[#00f5d4]/10 border border-[#00f5d4]/20 p-2 rounded-[10px]" : "p-2"}`}>
                {item.icon}
              </div>
              <span className="text-[6px] font-black uppercase tracking-widest leading-none opacity-70">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          REFILL MODAL
      ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-600 flex items-end sm:items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => !isPaying && setShowModal(false)} />
            <motion.div initial={{ scale: 0.93, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.93, y: 24 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="relative w-full max-w-sm bg-[#06101f] border border-white/8 rounded-[36px] p-7 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5"
                style={{ background: "linear-gradient(90deg, transparent, #00f5d4, transparent)" }} />

              {/* ── Packages ── */}
              {modalStep === "packages" && (
                <div className="space-y-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[18px] font-black italic uppercase tracking-tight text-white leading-none">Refill Power</h3>
                      <p className="text-[8px] text-white/25 font-bold uppercase tracking-widest mt-1">Choose uplink package</p>
                    </div>
                    <button onClick={() => setShowModal(false)} className="p-2 bg-white/5 rounded-[10px] border border-white/6 text-white/30 hover:text-white transition-all">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-red-500/[0.07] border border-red-500/15 rounded-2xl">
                    <Zap size={14} className="text-red-400 shrink-0" />
                    <p className="text-[9px] text-red-400/80 font-bold uppercase tracking-widest">Low power detected · {huBalance} HU remaining</p>
                  </div>
                  <div className="space-y-2 max-h-75 overflow-y-auto no-scrollbar">
                    {uplinkPackages.map((pkg) => (
                      <RippleButton key={pkg.id} onClick={() => { setSelectedPack(pkg); setModalStep("choice"); }}
                        className={`w-full p-4 rounded-[18px] border flex items-center justify-between transition-all ${
                          pkg.hot ? "border-[#00f5d4]/30 bg-[#00f5d4]/6" : "border-white/6 bg-white/3 hover:bg-white/5"}`}>
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
                  <div onClick={() => setAgreed((a) => !a)}
                    className="flex items-center gap-3 p-3.5 bg-white/3 border border-white/5 rounded-[14px] cursor-pointer">
                    <div className={`w-5 h-5 rounded-[7px] border-2 flex items-center justify-center shrink-0 transition-all ${agreed ? "border-[#00f5d4] bg-[#00f5d4]" : "border-white/15"}`}>
                      {agreed && <Check size={11} className="text-black font-black" />}
                    </div>
                    <p className="text-[8px] font-bold text-white/25 uppercase leading-tight tracking-wide">I agree to the refill protocol and network rules.</p>
                  </div>
                </div>
              )}

              {/* ── Gateway Choice ── */}
              {modalStep === "choice" && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setModalStep("packages")} className="p-2 bg-white/5 rounded-[10px] border border-white/6 text-white/30">
                      <ChevronDown size={14} className="rotate-90" />
                    </button>
                    <div>
                      <h4 className="text-[11px] font-black uppercase italic text-white leading-none">Select Gateway</h4>
                      <p className="text-[8px] text-white/25 font-bold uppercase tracking-widest mt-0.5">
                        {selectedPack?.name} · {selectedPack?.hu} HU · <span className="text-[#00f5d4]">KES {((selectedPack?.price || 0) * RATE).toLocaleString()}</span>
                      </p>
                    </div>
                  </div>

                  {/* Deduction preview */}
                  <div className="p-3 rounded-2xl border flex items-center gap-3"
                    style={{ background: "rgba(0,245,212,0.04)", borderColor: "rgba(0,245,212,0.15)" }}>
                    <Info size={12} className="text-[#00f5d4] shrink-0" />
                    <p className="text-[8px] font-bold text-white/40">
                      Your card/account will be charged exactly <span className="text-[#00f5d4] font-black">KES {((selectedPack?.price || 0) * RATE).toLocaleString()}</span> for {selectedPack?.hu} HU
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {/* Bank / Card */}
                    <RippleButton onClick={() => handlePay("CARD")}
                      className="w-full p-4 rounded-[20px] flex items-center gap-4 border border-indigo-500/30 transition-all hover:border-indigo-400/50"
                      style={{ background: "linear-gradient(135deg, rgba(79,70,229,0.18), rgba(79,70,229,0.08))" }}>
                      <PaystackLogo />
                      <div className="flex-1 text-left">
                        <p className="text-[12px] font-black text-white leading-none">Bank / Card</p>
                        <p className="text-[8px] font-bold text-white/40 mt-1">Visa · Mastercard · Instant via Paystack</p>
                        <p className="text-[7px] text-indigo-400/70 font-bold uppercase tracking-widest mt-0.5">Deducts KES {((selectedPack?.price || 0) * RATE).toLocaleString()} exactly</p>
                      </div>
                      <ChevronRight size={16} className="text-white/30 shrink-0" />
                    </RippleButton>

                    {/* Binance */}
                    <RippleButton onClick={() => setModalStep("binance")}
                      className="w-full p-4 rounded-[20px] flex items-center gap-4 border border-amber-500/30 transition-all hover:border-amber-400/50"
                      style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.06))" }}>
                      <BinanceLogo />
                      <div className="flex-1 text-left">
                        <p className="text-[12px] font-black text-white leading-none">Binance USDT</p>
                        <p className="text-[8px] font-bold text-white/40 mt-1">TRC20 network · ${selectedPack?.price}.00 USDT</p>
                        <p className="text-[7px] text-amber-400/70 font-bold uppercase tracking-widest mt-0.5">Scan QR · 2hr auto-credit · Borderless</p>
                      </div>
                      <ChevronRight size={16} className="text-white/30 shrink-0" />
                    </RippleButton>

                    {/* M-Pesa */}
                    <RippleButton onClick={() => setModalStep("mpesa")}
                      className="w-full p-4 rounded-[20px] flex items-center gap-4 border border-emerald-500/30 transition-all hover:border-emerald-400/50"
                      style={{ background: "linear-gradient(135deg, rgba(5,150,105,0.18), rgba(5,150,105,0.07))" }}>
                      <MpesaLogo />
                      <div className="flex-1 text-left">
                        <p className="text-[12px] font-black text-white leading-none">M-Pesa</p>
                        <p className="text-[8px] font-bold text-white/40 mt-1">Safaricom STK push · KES {((selectedPack?.price || 0) * RATE).toLocaleString()}</p>
                        <p className="text-[7px] text-emerald-400/70 font-bold uppercase tracking-widest mt-0.5">Instant · No card needed · Mobile</p>
                      </div>
                      <ChevronRight size={16} className="text-white/30 shrink-0" />
                    </RippleButton>

                    {/* PayPal — disabled */}
                    <div className="w-full p-4 rounded-[20px] border border-white/5 bg-white/2 flex items-center gap-4 cursor-not-allowed opacity-40">
                      <PaypalLogo />
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <p className="text-[12px] font-black text-white/40 leading-none">PayPal</p>
                          <Badge color="#ef4444">Region Limited</Badge>
                        </div>
                        <p className="text-[8px] font-bold text-white/20 mt-1">Not available in Kenya & most African regions</p>
                      </div>
                      <Lock size={14} className="text-white/15 shrink-0" />
                    </div>
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
                    <h4 className="text-[11px] font-black uppercase italic text-white">Binance USDT · TRC20</h4>
                  </div>
                  <div className="bg-white rounded-[20px] p-4 mx-auto w-fit border-4 border-amber-400/20">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=TFWxe4TFcjUNgPJVgf5iXrMsw1oe4gDv9X" alt="QR" className="w-36 h-36 block" />
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
                      <div className="flex-1 bg-black/40 border border-white/6 rounded-xl p-3 text-[8px] font-mono text-white/35 truncate">TFWxe4TFcjUNgPJVgf5iXrMsw1oe4gDv9X</div>
                      <button onClick={copyAddress} className="p-3 bg-white/5 border border-white/6 rounded-xl hover:bg-white/10 transition-all">
                        {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} className="text-white/30" />}
                      </button>
                    </div>
                  </div>
                  <RippleButton onClick={() => { addToast("Signal received. Syncing in ~2h", "success"); setShowModal(false); }}
                    className="w-full py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest text-black"
                    style={{ background: "linear-gradient(135deg, #00f5d4, #0097a7)" }}>
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
                    <h4 className="text-[11px] font-black uppercase italic text-white">M-Pesa STK Push</h4>
                  </div>
                  <div className="p-4 bg-emerald-500/6 border border-emerald-500/15 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                      <p className="text-[9px] font-black text-emerald-400/80 uppercase tracking-widest">Uplink Fee: KES {((selectedPack?.price || 0) * RATE).toLocaleString()}</p>
                    </div>
                    <p className="text-[7px] text-white/20 font-bold pl-5">Exact amount deducted from your Safaricom account · {selectedPack?.hu} HU credited instantly</p>
                  </div>
                  <div>
                    <p className="text-[7px] font-black text-white/20 uppercase tracking-widest mb-2">Safaricom Number</p>
                    <input value={mpesaNum} onChange={(e) => setMpesaNum(e.target.value)} placeholder="254712345678"
                      className="w-full bg-black/40 border border-white/8 rounded-2xl p-4 text-[18px] font-black text-white outline-none focus:border-emerald-500/50 text-center tracking-widest transition-all placeholder:text-white/15" />
                    <p className="text-[7px] text-white/20 font-bold uppercase tracking-widest mt-2 text-center">Format: 254XXXXXXXXX · 12 digits</p>
                  </div>
                  <RippleButton disabled={isPaying} onClick={() => handlePay("MPESA")}
                    className="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg, #059669, #065f46)" }}>
                    {isPaying ? <><RefreshCw size={13} className="animate-spin" /> Pushing STK…</> : `Pay KES ${((selectedPack?.price || 0) * RATE).toLocaleString()} · Initialize`}
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