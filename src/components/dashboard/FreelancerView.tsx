"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Briefcase, FileText, MessageSquare,
  Wallet, BarChart3, User, ShieldCheck, Zap, Lock, Rocket,
  CreditCard, ChevronRight, AlertTriangle,
  CheckCircle2, Clock, Activity, Bitcoin, LifeBuoy, X, CheckCircle, Box,
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
  Crown, Sparkle, Gem, Radio, MessageCircle, Cpu,
  Database, Code, Palette, LineChart, ShoppingBag,
  Megaphone, Camera, Music, BookMarked, Truck,
  HeartHandshake, GraduationCap, Wrench, MonitorSmartphone,
  Layers3, Filter, ChevronUp, ArrowUpDown, SortAsc,
  Banknote, Building, Coins, Wallet2, UserCheck, Fingerprint,
  BarChart2, Languages, Moon, Sun, ChevronLeft,
  HelpCircle, Lightbulb, TrendingDown, Users,
  PlayCircle, CheckSquare, Inbox, ClipboardList, UserPlus,
  FileCheck, BadgeDollarSign,
  Paperclip, Mic, MoreVertical, PhoneCall, VideoIcon,
  AtSign, Hash as HashIcon, Smile, Image as ImageIcon,
  ChevronDown as ChevronDownIcon, Minimize2,
} from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface Toast { id: number; msg: string; type: "success" | "error" | "info"; }
type ModalStep = "packages" | "choice" | "binance" | "mpesa" | "card";
type ProfileTab = "profile" | "security" | "notifications" | "achievements" | "settings";
type VaultTab = "overview" | "history" | "limits" | "referral";

interface ChatTarget {
  id: string;
  name: string;
  subtitle: string;
  avatar: string;
  type: string;
  kind: "freelance" | "corporate";
  context: string;
  company?: string;
  domain?: string;
  dept?: string;
  salary?: number;
  budget?: number;
}

interface ChatBubble {
  id: number;
  from: "them" | "me";
  body: string;
  time: string;
}

// ─────────────────────────────────────────────
// Primitives
// ─────────────────────────────────────────────
const PulseDot = ({ color = "#0055FF", size = 7 }: { color?: string; size?: number }) => (
  <span className="relative inline-flex" style={{ width: size, height: size }}>
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-40" style={{ backgroundColor: color }} />
    <span className="relative inline-flex rounded-full" style={{ width: size, height: size, backgroundColor: color }} />
  </span>
);

const RippleButton = ({ children, onClick, className = "", disabled = false, style }: {
  children: React.ReactNode; onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string; disabled?: boolean; style?: React.CSSProperties;
}) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples(r => [...r, { x: e.clientX - rect.left, y: e.clientY - rect.top, id }]);
    setTimeout(() => setRipples(r => r.filter(rip => rip.id !== id)), 700);
    onClick?.(e);
  };
  return (
    <button onClick={handleClick} disabled={disabled} style={style}
      className={`relative overflow-hidden select-none transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}>
      {children}
      {ripples.map(r => (
        <span key={r.id} className="absolute rounded-full bg-white/25 animate-ping pointer-events-none"
          style={{ left: r.x - 14, top: r.y - 14, width: 28, height: 28, animationDuration: "0.7s" }} />
      ))}
    </button>
  );
};

const Card = ({ children, className = "", onClick }: {
  children: React.ReactNode; className?: string; onClick?: () => void;
}) => (
  <div onClick={onClick}
    className={`bg-white border border-gray-100 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${onClick ? "cursor-pointer" : ""} ${className}`}>
    {children}
  </div>
);

const StatCard = ({ label, value, icon, color = "#0055FF", sub }: {
  label: string; value: string | number; icon: React.ReactNode; color?: string; sub?: string;
}) => (
  <div className="p-3.5 rounded-xl border border-gray-100 bg-white text-center">
    <div className="w-7 h-7 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: `${color}12`, color }}>
      {icon}
    </div>
    <p className="text-[14px] font-black text-gray-900 leading-none">{value}</p>
    {sub && <p className="text-[8px] text-gray-400 font-semibold mt-0.5">{sub}</p>}
    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1 leading-none">{label}</p>
  </div>
);

const Badge = ({ children, color = "#0055FF", className = "" }: { children: React.ReactNode; color?: string; className?: string }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-bold border ${className}`}
    style={{ color, borderColor: `${color}28`, backgroundColor: `${color}0c` }}>
    {children}
  </span>
);

const SectionHead = ({ label, sub }: { label: string; sub?: string }) => (
  <div className="mb-3">
    <h3 className="text-[20px] font-black text-gray-900 leading-tight tracking-tight">{label}</h3>
    {sub && <p className="text-[10px] text-gray-400 font-medium mt-0.5">{sub}</p>}
  </div>
);

// ─────────────────────────────────────────────
// Company Logo
// ─────────────────────────────────────────────
const CompanyLogo = ({ name, domain, size = 44 }: { name: string; domain: string; size?: number }) => {
  const [imgSrc, setImgSrc] = useState<string | null>(`https://logo.clearbit.com/${domain}`);
  const [stage, setStage] = useState<"clearbit" | "favicon" | "initials">("clearbit");
  const initials = name.replace(/[^a-zA-Z\s]/g, "").split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("");
  const brandPalette = [
    { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
    { bg: "#F0FDF4", text: "#15803D", border: "#BBF7D0" },
    { bg: "#FDF4FF", text: "#7E22CE", border: "#E9D5FF" },
    { bg: "#FFF7ED", text: "#C2410C", border: "#FED7AA" },
    { bg: "#F0F9FF", text: "#0369A1", border: "#BAE6FD" },
    { bg: "#FFF1F2", text: "#BE123C", border: "#FECDD3" },
    { bg: "#FFFBEB", text: "#B45309", border: "#FDE68A" },
    { bg: "#ECFDF5", text: "#047857", border: "#A7F3D0" },
  ];
  const palette = brandPalette[name.charCodeAt(0) % brandPalette.length];
  const handleError = () => {
    if (stage === "clearbit") { setStage("favicon"); setImgSrc(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`); }
    else { setStage("initials"); setImgSrc(null); }
  };
  if (stage === "initials" || !imgSrc) {
    return (
      <div style={{ width: size, height: size, minWidth: size, backgroundColor: palette.bg, border: `1.5px solid ${palette.border}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ fontSize: size * 0.33, fontWeight: 900, color: palette.text, letterSpacing: "-0.02em", lineHeight: 1 }}>{initials || "?"}</span>
      </div>
    );
  }
  return (
    <div style={{ width: size, height: size, minWidth: size, borderRadius: 12, flexShrink: 0 }}
      className="overflow-hidden bg-white border border-gray-100 flex items-center justify-center shadow-sm">
      <img src={imgSrc} alt={name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: stage === "favicon" ? 6 : 4 }} onError={handleError} />
    </div>
  );
};

const MarketplaceAvatar = ({ initials, type, seed, size = 40 }: { initials: string; type: string; seed?: string; size?: number }) => {
  const typeRing: Record<string, string> = {
    "Web Dev": "#3B82F6", "Design": "#8B5CF6", "Writing": "#10B981",
    "Marketing": "#F59E0B", "Data": "#06B6D4", "AI": "#EF4444",
    "Security": "#DC2626", "Web3": "#7C3AED", "Video": "#EC4899",
  };
  const ring = typeRing[type] || "#3B82F6";
  const [errored, setErrored] = useState(false);
  const src = `https://i.pravatar.cc/150?u=${encodeURIComponent(seed || initials)}`;
  return (
    <div style={{ width: size, height: size, minWidth: size, borderRadius: 10, padding: 2, background: `linear-gradient(135deg, ${ring}, ${ring}88)`, flexShrink: 0 }}>
      {errored
        ? <div style={{ width: "100%", height: "100%", borderRadius: 8, background: `linear-gradient(135deg, ${ring}cc, ${ring})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: size * 0.32 }}>{initials.slice(0, 2)}</div>
        : <img src={src} alt={initials} onError={() => setErrored(true)} style={{ width: "100%", height: "100%", borderRadius: 8, objectFit: "cover", display: "block" }} />
      }
    </div>
  );
};

// ─────────────────────────────────────────────
// Payment Logos
// ─────────────────────────────────────────────
const BinanceLogo = ({ size = 44 }: { size?: number }) => (
  <div style={{ width: size, height: size, minWidth: size, background: "linear-gradient(135deg, #1a1a2e, #16213e)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.35)", border: "1px solid #F0B90B33" }}>
    <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill="#F0B90B">
      <path d="M12 0L9.26 2.74 12 5.48 14.74 2.74zM5.48 6.52L2.74 9.26 5.48 12 8.22 9.26zM18.52 6.52L15.78 9.26 18.52 12 21.26 9.26zM9.26 9.26L12 12l2.74-2.74L12 6.52zM5.48 15.78L2.74 18.52 5.48 21.26 8.22 18.52zM18.52 15.78L15.78 18.52 18.52 21.26 21.26 18.52zM12 18.52L9.26 21.26 12 24 14.74 21.26z" />
    </svg>
  </div>
);

const MpesaLogoSVG = ({ size = 44 }: { size?: number }) => (
  <div style={{ width: size, height: size, minWidth: size, background: "linear-gradient(135deg, #16A34A, #15803D)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(22,163,74,0.3)" }}>
    <svg viewBox="0 0 44 44" width={size} height={size}>
      <text x="50%" y="38%" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="14" fontWeight="900" fontFamily="Arial Black, sans-serif">M</text>
      <text x="50%" y="68%" textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.9)" fontSize="6.5" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing="1.2">PESA</text>
    </svg>
  </div>
);

const PaystackLogo = ({ size = 44 }: { size?: number }) => (
  <div style={{ width: size, height: size, minWidth: size, background: "linear-gradient(135deg, #011B33, #00C3F7)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,195,247,0.3)" }}>
    <svg viewBox="0 0 50 50" width={size * 0.64} height={size * 0.64} fill="none">
      <rect x="4" y="14" width="42" height="8" rx="4" fill="white" />
      <rect x="4" y="28" width="28" height="8" rx="4" fill="white" opacity="0.65" />
    </svg>
  </div>
);

const VisaIcon = () => (
  <div className="h-6 px-2.5 rounded bg-[#1A1F71] flex items-center justify-center">
    <span className="text-white font-black text-[11px] italic tracking-tight">VISA</span>
  </div>
);
const MastercardIcon = () => (
  <div className="h-6 px-1.5 rounded bg-white border border-gray-200 flex items-center gap-0">
    <div className="w-3.5 h-3.5 rounded-full bg-[#EB001B] opacity-90" />
    <div className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] opacity-90 -ml-1" />
  </div>
);

// ─────────────────────────────────────────────
// Premium Lock Section
// ─────────────────────────────────────────────
const PremiumLockedSection = ({ title, description, icon, cta, onCta, features }: {
  title: string; description: string; icon: React.ReactNode; cta: string; onCta: () => void; features?: string[];
}) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
    className="relative rounded-2xl overflow-hidden border border-blue-100 p-7 text-center"
    style={{ background: "linear-gradient(135deg, #f8faff 0%, #eef2ff 100%)" }}>
    <div className="w-12 h-12 mx-auto mb-3 rounded-2xl flex items-center justify-center bg-white border border-blue-100 shadow-sm text-blue-600">{icon}</div>
    <Badge color="#0055FF" className="mb-3"><Crown size={8} /> Members Only</Badge>
    <h3 className="text-[16px] font-black text-gray-900 mb-2 leading-tight">{title}</h3>
    <p className="text-[10px] text-gray-500 leading-relaxed mb-5 max-w-xs mx-auto">{description}</p>
    {features && (
      <div className="grid grid-cols-2 gap-2 mb-5 text-left max-w-xs mx-auto">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-2 p-2 bg-white rounded-xl border border-blue-50">
            <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center shrink-0"><Check size={8} className="text-blue-600" /></div>
            <p className="text-[9px] font-semibold text-gray-500">{f}</p>
          </div>
        ))}
      </div>
    )}
    <RippleButton onClick={onCta}
      className="px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-md"
      style={{ background: "linear-gradient(135deg, #0055FF, #0041CC)" }}>
      {cta}
    </RippleButton>
  </motion.div>
);

// ─────────────────────────────────────────────
// Toggle Row
// ─────────────────────────────────────────────
const ToggleRow = ({ label, sub, value, onChange, icon, color = "#3B82F6" }: {
  label: string; sub?: string; value: boolean; onChange: () => void; icon?: React.ReactNode; color?: string;
}) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
    <div className="flex items-center gap-2.5">
      {icon && <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}12`, color }}>{icon}</div>}
      <div>
        <p className="text-[11px] font-bold text-gray-800">{label}</p>
        {sub && <p className="text-[9px] text-gray-400 font-medium mt-0.5">{sub}</p>}
      </div>
    </div>
    <button onClick={onChange} className="transition-all duration-200 shrink-0">
      {value
        ? <div className="w-10 h-5.5 rounded-full relative shadow-inner" style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)`, height: 22, width: 40 }}>
            <div className="absolute right-0.5 top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow" style={{ width: 18, height: 18 }} />
          </div>
        : <div className="rounded-full bg-gray-200 relative" style={{ height: 22, width: 40 }}>
            <div className="absolute left-0.5 top-0.5 bg-white rounded-full shadow" style={{ width: 18, height: 18 }} />
          </div>
      }
    </button>
  </div>
);

// ─────────────────────────────────────────────
// Corporate Hiring Card
// ─────────────────────────────────────────────
const CorporateHiringCard = () => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
    className="rounded-2xl border border-purple-100 overflow-hidden"
    style={{ background: "linear-gradient(135deg, #FAF5FF 0%, #EEF2FF 100%)" }}>
    <div className="p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center shrink-0 shadow-sm">
          <Building2 size={14} className="text-white" />
        </div>
        <div>
          <h4 className="text-[12px] font-black text-gray-900">Corporate Hiring Process</h4>
          <p className="text-[9px] text-purple-500 font-semibold">Fortune 500 roles · Full-time remote · Monthly salary</p>
        </div>
      </div>
      <div className="mb-3 p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
        <AlertCircle size={11} className="text-amber-500 mt-0.5 shrink-0" />
        <p className="text-[9px] text-amber-800 font-semibold leading-relaxed">
          Corporate roles require a formal HR application, CV review & interview. Freelance gigs start immediately after buying HU.
        </p>
      </div>
      <div className="grid grid-cols-5 items-center gap-1 mb-3">
        {[
          { icon: <Zap size={10} />, color: "#3B82F6", title: "Buy HU & Apply" },
          { icon: <ChevronRight size={10} />, color: "#ccc", title: "" },
          { icon: <ClipboardList size={10} />, color: "#8B5CF6", title: "Submit CV" },
          { icon: <ChevronRight size={10} />, color: "#ccc", title: "" },
          { icon: <Users size={10} />, color: "#06B6D4", title: "HR Review" },
        ].map((item, i) => (
          item.title
            ? <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${item.color}15`, color: item.color }}>{item.icon}</div>
                <p className="text-[7.5px] font-bold text-gray-500 text-center leading-tight">{item.title}</p>
              </div>
            : <div key={i} className="flex justify-center text-gray-300">{item.icon}</div>
        ))}
      </div>
      <div className="flex items-start gap-2 p-2.5 bg-purple-50 border border-purple-100 rounded-xl">
        <Info size={10} className="text-purple-500 mt-0.5 shrink-0" />
        <p className="text-[9px] text-purple-700 font-semibold leading-relaxed">
          Min. <strong>50 HU</strong> (Pro Uplink) to apply. Senior "Premium" roles require 100 HU.
        </p>
      </div>
    </div>
  </motion.div>
);

// ─────────────────────────────────────────────
// Instant Access Banner
// ─────────────────────────────────────────────
const InstantAccessBanner = ({ huBalance, onBrowse }: { huBalance: number; onBrowse: () => void }) => (
  <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
    className="rounded-2xl overflow-hidden border border-green-200 shadow-md"
    style={{ background: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 60%, #A7F3D0 100%)" }}>
    <div className="p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center shrink-0">
          <CheckCircle size={16} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="text-[9px] font-black uppercase tracking-widest text-green-600">Access Unlocked</p>
          <h4 className="text-[14px] font-black text-gray-900 leading-none">All Freelance Gigs Ready</h4>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[20px] font-black text-green-700 leading-none">{huBalance} HU</p>
          <p className="text-[8px] text-green-600 font-bold">Active</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: "Applications", value: "Zero", icon: <CheckCircle size={10} /> },
          { label: "Wait Time", value: "None", icon: <Zap size={10} /> },
          { label: "Gigs Open", value: "24+", icon: <Briefcase size={10} /> },
        ].map((s, i) => (
          <div key={i} className="bg-white/70 rounded-xl p-2 text-center border border-green-100">
            <div className="flex justify-center mb-0.5 text-green-600">{s.icon}</div>
            <p className="text-[12px] font-black text-gray-900">{s.value}</p>
            <p className="text-[8px] font-bold text-gray-500 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>
      <button onClick={onBrowse}
        className="w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white bg-green-600 hover:bg-green-700 transition-all flex items-center justify-center gap-2">
        <PlayCircle size={12} /> Browse & Start Gigs Now
      </button>
    </div>
  </motion.div>
);

// ─────────────────────────────────────────────
// PREMIUM PAYWALL POPUP — White, official, generic "Continue" CTA
// ─────────────────────────────────────────────
const CallPaywallPopup = ({ open, feature, sub, onClose, onUnlock, kind }: {
  open: boolean; feature: string; sub: string; onClose: () => void; onUnlock: () => void; kind: "freelance" | "corporate";
}) => {
  const accent = kind === "corporate" ? "#7C3AED" : "#0055FF";
  const accent2 = kind === "corporate" ? "#4F46E5" : "#0EA5E9";
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 z-20 flex items-center justify-center p-6"
          style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(14px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.92, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 26, stiffness: 360 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl bg-white"
            style={{ border: "1px solid rgba(15,23,42,0.06)" }}
          >
            {/* Top accent bar */}
            <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${accent}, ${accent2})` }} />

            <div className="relative p-7 text-center">
              <button onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-all">
                <X size={13} />
              </button>

              {/* Premium icon */}
              <div className="relative w-16 h-16 mx-auto mb-5">
                <div className="absolute inset-0 rounded-2xl opacity-20 blur-xl" style={{ background: accent }} />
                <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${accent}, ${accent2})` }}>
                  <Lock size={26} className="text-white" />
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3"
                style={{ background: `${accent}10`, border: `1px solid ${accent}25` }}>
                <Crown size={9} style={{ color: accent }} />
                <span className="text-[8.5px] font-black uppercase tracking-widest" style={{ color: accent }}>Premium Feature</span>
              </div>

              <h3 className="text-[17px] font-black text-slate-900 leading-tight mb-2">{feature}</h3>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-6 px-2">{sub}</p>

              {/* Trust strip */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {[
                  { icon: <ShieldCheck size={12} />, label: "Verified" },
                  { icon: <Zap size={12} />, label: "Instant" },
                  { icon: <BadgeCheck size={12} />, label: "Official" },
                ].map((p, i) => (
                  <div key={i} className="p-2.5 rounded-xl text-center bg-slate-50 border border-slate-100">
                    <div className="w-7 h-7 mx-auto rounded-lg flex items-center justify-center mb-1" style={{ background: `${accent}12`, color: accent }}>{p.icon}</div>
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">{p.label}</p>
                  </div>
                ))}
              </div>

              <RippleButton onClick={onUnlock}
                className="w-full py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 shadow-lg transition-all"
                style={{ background: `linear-gradient(135deg, ${accent}, ${accent2})` }}>
                Continue <ArrowRight size={13} />
              </RippleButton>
              <p className="text-[8.5px] font-semibold text-slate-400 mt-3 leading-relaxed">
                Choose a HU pack on the next screen · Cancel anytime
              </p>
              <button onClick={onClose} className="mt-2 text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-all">
                Maybe later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export const FreelancerView = ({ jobs, userMetadata }: { jobs: any[]; userMetadata: any }) => {
  const { user } = useUser();

  const [currency, setCurrency] = useState<"USD" | "EUR" | "GBP" | "KES">("USD");
  const RATE: Record<string, number> = { USD: 1, EUR: 0.92, GBP: 0.79, KES: 130 };
  const SYMBOLS: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", KES: "KES " };
  const fmt = (usd: number) => {
    const val = usd * RATE[currency];
    return `${SYMBOLS[currency]}${val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: currency === "KES" ? 0 : 2 })}`;
  };

  const [activeTab, setActiveTab] = useState("home");
  const [gigMode, setGigMode] = useState<"marketplace" | "corporate">("marketplace");
  const [gigCategory, setGigCategory] = useState("All");
  const [gigSort, setGigSort] = useState<"newest" | "highest" | "lowest">("newest");
  const [gigSearch, setGigSearch] = useState("");
  const [corpCategory, setCorpCategory] = useState("All");

  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = (msg: string, type: Toast["type"] = "info") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3800);
  };

  const [huBalance, setHuBalance] = useState(5);
  const [cashBalance] = useState(0.0);
  const isVerified = userMetadata?.status === "Verified";
  const hasHU = huBalance >= 10;

  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState<ModalStep>("packages");
  const [selectedPack, setSelectedPack] = useState<typeof uplinkPackages[0] | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [mpesaNum, setMpesaNum] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [calcHU, setCalcHU] = useState("1200");
  const [selectedCryptoNet, setSelectedCryptoNet] = useState<"TRC20" | "ERC20">("TRC20");
  const calcUSD = Math.round((parseFloat(calcHU || "0") / 120) * 10 * 100) / 100;

  const [expandedMsg, setExpandedMsg] = useState<number | null>(null);
  const [showBalance, setShowBalance] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeVaultTab, setActiveVaultTab] = useState<VaultTab>("overview");
  const [expandedGig, setExpandedGig] = useState<string | null>(null);
  const [justPurchased, setJustPurchased] = useState(false);

  // ── Chat state ──
  const [chatTarget, setChatTarget] = useState<ChatTarget | null>(null);
  const [chatDraft, setChatDraft] = useState("");
  const [chatThread, setChatThread] = useState<ChatBubble[]>([]);
  const [callPaywall, setCallPaywall] = useState<{ open: boolean; feature: string; sub: string } | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState({ missions: true, payments: true, messages: false, weekly: true, newGigs: true });
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [generatedApiKey, setGeneratedApiKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");
  const [sessions] = useState([
    { device: "Chrome · Windows", location: "Online", last: "Active now", current: true },
    { device: "Safari · iPhone", location: "Online", last: "2 hours ago", current: false },
  ]);
  const [revokedSession, setRevokedSession] = useState<number[]>([]);

  const [activeProfileTab, setActiveProfileTab] = useState<ProfileTab>("profile");
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileBio, setProfileBio] = useState("Freelancer on Nexus. Ready to take on global opportunities.");
  const [profileSkills, setProfileSkills] = useState(["React", "Node.js", "TypeScript"]);
  const [profileLocation, setProfileLocation] = useState("Worldwide");
  const [profileRate, setProfileRate] = useState("$25/hr");
  const [profileAvailability, setProfileAvailability] = useState("Available Now");
  const [showApiKey, setShowApiKey] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);

  const uplinkPackages = [
    {
      id: 1, name: "Starter", price: 3, hu: 150,
      desc: "Try the platform and access basic gigs instantly.",
      hot: false, highlight: false,
      access: "Basic gigs up to $120 budget",
      roi: "Potential $1,200 earnings",
      color: "#10B981",
      perks: ["24 basic gigs", "Instant activation", "Direct client contact"],
    },
    {
      id: 2, name: "Basic", price: 6, hu: 400,
      desc: "Best for active job seekers wanting more options.",
      hot: false, highlight: false,
      access: "Basic + Standard gigs up to $600",
      roi: "Potential $4,800 earnings",
      color: "#3B82F6",
      perks: ["40+ gigs unlocked", "Standard + basic tiers", "Instant activation"],
    },
    {
      id: 3, name: "Pro", price: 12, hu: 900,
      desc: "Unlock advanced gigs and start earning big.",
      hot: true, highlight: true,
      access: "All gigs up to $2,200 budget",
      roi: "Potential $22,000 earnings",
      color: "#8B5CF6",
      perks: ["All gig tiers unlocked", "Advanced + Expert gigs", "Priority support"],
    },
    {
      id: 4, name: "Pro Uplink", price: 20, hu: 1200,
      desc: "Maximum access including corporate role applications.",
      hot: false, highlight: false,
      access: "All gigs + corporate role applications",
      roi: "Potential $50,000+ earnings",
      color: "#EF4444",
      perks: ["All tiers unlocked", "Corporate role access", "Highest priority queue"],
    },
  ];

  const marketplaceGigs = useMemo(() => [
    { id: "m1", title: "Landing Page (React / Next.js)", budget: 120, client: "StartupLaunch Co", avatar: "SL", type: "Web Dev", duration: "3 Days", level: "Basic", desc: "Build a clean, responsive landing page for a SaaS product. Pixel-perfect design from Figma. Deploy to Vercel.", skills: ["React", "Next.js", "Tailwind"], deliverables: "Source code + deployment", huRequired: 10 },
    { id: "m2", title: "Logo Design (3 Concepts)", budget: 90, client: "BrandSpark", avatar: "BS", type: "Design", duration: "2 Days", level: "Basic", desc: "Design 3 logo concepts for a fintech startup. Deliver in SVG, PNG, and PDF with colour palette and font suggestions.", skills: ["Illustrator", "Figma", "Branding"], deliverables: "3 logo concepts + brand kit", huRequired: 10 },
    { id: "m3", title: "Product Description Copywriting (20)", budget: 80, client: "ShopCloud", avatar: "SC", type: "Writing", duration: "2 Days", level: "Basic", desc: "Write SEO-optimised product descriptions for 20 e-commerce items. Tone: professional, persuasive, concise.", skills: ["Copywriting", "SEO", "E-commerce"], deliverables: "20 product descriptions in Google Doc", huRequired: 10 },
    { id: "m4", title: "Google Ads Campaign Setup", budget: 150, client: "AdGrowth Media", avatar: "AG", type: "Marketing", duration: "3 Days", level: "Basic", desc: "Set up a Google Ads search campaign for a local business. Keyword research, ad copy, bid strategy, conversion tracking.", skills: ["Google Ads", "PPC", "Analytics"], deliverables: "Live campaign + performance report", huRequired: 10 },
    { id: "m5", title: "Data Cleaning & Excel Dashboard", budget: 110, client: "InsightFirst", avatar: "IF", type: "Data", duration: "2 Days", level: "Basic", desc: "Clean a 5,000-row dataset and build an Excel dashboard with KPI charts and filters.", skills: ["Excel", "Power Query", "Data Cleaning"], deliverables: "Clean dataset + Excel dashboard", huRequired: 10 },
    { id: "m6", title: "WordPress Blog Setup (5 pages)", budget: 130, client: "ContentFlow", avatar: "CF", type: "Web Dev", duration: "3 Days", level: "Basic", desc: "Install and configure WordPress with a premium theme. Set up 5 pages and SEO plugin.", skills: ["WordPress", "Elementor", "SEO"], deliverables: "Live WordPress site + documentation", huRequired: 10 },
    { id: "m7", title: "Social Media Content Pack (30 posts)", budget: 200, client: "ViralBrand Studio", avatar: "VB", type: "Marketing", duration: "5 Days", level: "Basic", desc: "Create 30 branded social media graphics for Instagram and LinkedIn with captions.", skills: ["Canva", "Copywriting", "Social Media"], deliverables: "30 posts + templates + captions", huRequired: 10 },
    { id: "m8", title: "ChatGPT Prompt Engineering Pack", budget: 160, client: "AI Solutions Hub", avatar: "AI", type: "AI", duration: "3 Days", level: "Basic", desc: "Design a library of 50 high-performance prompts for a business use case. Include usage guide.", skills: ["Prompt Engineering", "ChatGPT", "Copywriting"], deliverables: "50 tested prompts + guide PDF", huRequired: 10 },
    { id: "m9", title: "Python Automated Reporting Script", budget: 280, client: "DataFlow Inc", avatar: "DF", type: "Data", duration: "4 Days", level: "Standard", desc: "Build a Python script that pulls from Google Sheets, processes KPIs, and auto-emails a PDF report every Monday.", skills: ["Python", "Pandas", "SMTP"], deliverables: "Script + documentation", huRequired: 20 },
    { id: "m10", title: "Social Media Management (1 Month)", budget: 400, client: "BrandBoost", avatar: "BB", type: "Marketing", duration: "30 Days", level: "Standard", desc: "Manage 3 social channels for 30 days: 4 posts/week, engagement, analytics reporting.", skills: ["Social Media", "Copywriting", "Analytics"], deliverables: "Monthly report + assets", huRequired: 20 },
    { id: "m11", title: "Mobile App UI Design (Figma)", budget: 600, client: "AppCraft Studio", avatar: "AC", type: "Design", duration: "8 Days", level: "Standard", desc: "Design 20+ screens for an iOS/Android fintech app. Includes design system and interactive prototype.", skills: ["Figma", "UI/UX", "Prototyping"], deliverables: "Figma file + prototype link", huRequired: 20 },
    { id: "m12", title: "SEO Optimization for Business Site", budget: 320, client: "Rank Fast", avatar: "RF", type: "Marketing", duration: "5 Days", level: "Standard", desc: "Full SEO audit, fix technical issues, optimize 15 pages, set up Google Search Console.", skills: ["SEO", "Ahrefs", "Technical SEO"], deliverables: "SEO report + optimized pages", huRequired: 20 },
    { id: "m13", title: "Full-Stack Web App (React & Node)", budget: 1200, client: "TechBuild Global", avatar: "TB", type: "Web Dev", duration: "14 Days", level: "Advanced", desc: "Build a SaaS dashboard with React frontend, Node.js API, PostgreSQL database, JWT auth, and admin panel.", skills: ["React", "Node.js", "PostgreSQL"], deliverables: "Deployed app + source code", huRequired: 30 },
    { id: "m14", title: "AI Chatbot for Customer Support", budget: 950, client: "RetailBot Inc", avatar: "RB", type: "AI", duration: "10 Days", level: "Advanced", desc: "Integrate GPT-4 to build a customer support chatbot with intent routing and Zendesk integration.", skills: ["Python", "OpenAI API", "Zendesk"], deliverables: "Live chatbot + admin dashboard", huRequired: 30 },
    { id: "m15", title: "Cybersecurity Audit for Company", budget: 1500, client: "SecureNet Ltd", avatar: "SN", type: "Security", duration: "7 Days", level: "Advanced", desc: "Perform penetration testing on company infrastructure: network, web app, internal APIs.", skills: ["Burp Suite", "Nmap", "OWASP"], deliverables: "Pentest report + remediation guide", huRequired: 30 },
    { id: "m16", title: "Smart Contract Development (Solidity)", budget: 1800, client: "Nexus Protocol", avatar: "NP", type: "Web3", duration: "10 Days", level: "Advanced", desc: "Develop and test ERC-20 token + staking contract in Solidity. Deploy to testnet with Hardhat.", skills: ["Solidity", "Hardhat", "Ethers.js"], deliverables: "Audited contracts + frontend hook", huRequired: 30 },
    { id: "m17", title: "ML Model for Sales Predictions", budget: 1400, client: "Predict Pro", avatar: "PP", type: "AI", duration: "12 Days", level: "Advanced", desc: "Train a time-series model on 3 years of sales data to forecast monthly revenue per product category.", skills: ["Python", "XGBoost", "Scikit-learn"], deliverables: "Model + REST API + dashboard", huRequired: 30 },
    { id: "m18", title: "Next.js Performance & SEO Overhaul", budget: 1800, client: "E-Com Solutions", avatar: "EC", type: "Web Dev", duration: "10 Days", level: "Advanced", desc: "Audit and improve Core Web Vitals: code splitting, image optimization, SSG/ISR, structured data.", skills: ["Next.js", "Lighthouse", "Vercel"], deliverables: "Optimized site + audit report", huRequired: 30 },
    { id: "m19", title: "Brand Identity Design System", budget: 2200, client: "Branding Co", avatar: "BC", type: "Design", duration: "14 Days", level: "Advanced", desc: "Create a comprehensive brand identity: logo suite, color system, typography, and Figma component library.", skills: ["Figma", "Illustrator", "Brand Strategy"], deliverables: "Full brand book + Figma kit", huRequired: 30 },
    { id: "m20", title: "API Security Penetration Testing", budget: 2100, client: "SafeVault Corp", avatar: "SV", type: "Security", duration: "7 Days", level: "Expert", desc: "In-depth API security assessment: auth bypass, injection, race conditions. OWASP API Top 10 coverage.", skills: ["Postman", "Burp Suite", "Python"], deliverables: "Detailed report + fix recommendations", huRequired: 50 },
    { id: "m21", title: "NFT Collection + Contracts + Frontend", budget: 2800, client: "CryptoArt Hub", avatar: "CA", type: "Web3", duration: "14 Days", level: "Expert", desc: "End-to-end NFT collection: generative art engine, ERC-721 contract, whitelist/mint frontend.", skills: ["Solidity", "React", "IPFS"], deliverables: "Deployed collection + minting site", huRequired: 50 },
    { id: "m22", title: "Enterprise CRM Custom Integration", budget: 3200, client: "SalesForce Partners", avatar: "SP", type: "Web Dev", duration: "21 Days", level: "Expert", desc: "Build a custom Salesforce integration with real-time webhook sync and bi-directional data flow.", skills: ["Salesforce API", "Node.js", "REST"], deliverables: "Integration + documentation", huRequired: 50 },
    { id: "m23", title: "Deep Learning Computer Vision System", budget: 4000, client: "VisionAI Labs", avatar: "VA", type: "AI", duration: "21 Days", level: "Expert", desc: "Train a YOLOv8 object detection model on custom dataset for real-time product defect detection.", skills: ["PyTorch", "YOLOv8", "OpenCV"], deliverables: "Trained model + inference API", huRequired: 50 },
    { id: "m24", title: "DeFi Protocol Architecture & Audit", budget: 5000, client: "DeFi Builders DAO", avatar: "DB", type: "Web3", duration: "30 Days", level: "Expert", desc: "Design and audit a multi-chain DeFi liquidity protocol with formal security audit and testnet launch.", skills: ["Solidity", "DeFi", "Security"], deliverables: "Protocol + audit report + docs", huRequired: 50 },
  ], []);

  const corporateGigs = useMemo(() => [
    { id: "c1", title: "Remote Fleet Data Analyst", salary: 8000, domain: "tesla.com", company: "Tesla", badge: "EV · Remote", dept: "Engineering", desc: "Analyze fleet telemetry data from 500k+ Tesla vehicles. Build dashboards tracking range and charging patterns.", skills: ["Python", "SQL", "Tableau"], type: "Full-time Remote", huRequired: 50 },
    { id: "c2", title: "Cloud Support Engineer", salary: 9000, domain: "amazon.com", company: "Amazon", badge: "AWS · Senior", dept: "Cloud", desc: "Provide enterprise-level AWS support for Fortune 500 clients. Resolve complex infrastructure issues.", skills: ["AWS", "Linux", "Networking"], type: "Full-time Remote", huRequired: 50 },
    { id: "c3", title: "Payment Integrity Analyst", salary: 11000, domain: "stripe.com", company: "Stripe", badge: "FinTech · Remote", dept: "Finance", desc: "Investigate payment anomalies, fraud patterns, and dispute trends across Stripe's global transaction network.", skills: ["SQL", "Python", "Risk Analysis"], type: "Full-time Remote", huRequired: 50 },
    { id: "c4", title: "Security Operations Specialist", salary: 12000, domain: "kraken.com", company: "Kraken", badge: "Crypto · Remote", dept: "Security", desc: "Monitor Kraken's security posture 24/7: threat intelligence, incident response, and security automation.", skills: ["SIEM", "Incident Response", "Crypto"], type: "Full-time Remote", huRequired: 50 },
    { id: "c5", title: "Frontend Engineer (React)", salary: 10500, domain: "shopify.com", company: "Shopify", badge: "E-Com · Remote", dept: "Engineering", desc: "Build Shopify's merchant-facing dashboard features in React. Work on accessibility and performance.", skills: ["React", "TypeScript", "Polaris"], type: "Full-time Remote", huRequired: 50 },
    { id: "c6", title: "Data Platform Engineer", salary: 13500, domain: "databricks.com", company: "Databricks", badge: "Data · Senior", dept: "Data", desc: "Build and scale Databricks' internal data infrastructure. Design lakehouse pipelines processing 100TB+ daily.", skills: ["Spark", "Delta Lake", "Python"], type: "Senior Full-time Remote", huRequired: 100 },
    { id: "c7", title: "Product Manager — Global Expansion", salary: 9500, domain: "google.com", company: "Google", badge: "Remote · Senior", dept: "Product", desc: "Lead product strategy for Google's expansion into 15 new emerging markets. Define roadmaps and own OKRs.", skills: ["Product Strategy", "Analytics", "Leadership"], type: "Senior Full-time Remote", huRequired: 100 },
    { id: "c8", title: "Mobile Engineer (iOS/Android)", salary: 11000, domain: "meta.com", company: "Meta", badge: "Remote · Mid", dept: "Engineering", desc: "Build features in the Facebook/Instagram mobile apps used by 3 billion people.", skills: ["React Native", "Swift", "Kotlin"], type: "Full-time Remote", huRequired: 100 },
    { id: "c9", title: "DevOps Engineer", salary: 10000, domain: "microsoft.com", company: "Microsoft", badge: "Azure · Remote", dept: "Infrastructure", desc: "Maintain CI/CD pipelines, Kubernetes clusters, and Azure infrastructure for Microsoft's developer tools.", skills: ["Kubernetes", "Azure", "Terraform"], type: "Full-time Remote", huRequired: 50 },
    { id: "c10", title: "UX Researcher", salary: 8500, domain: "airbnb.com", company: "Airbnb", badge: "Remote · Contract", dept: "Design", desc: "Conduct user research for Airbnb's host experience product. Synthesize insights into actionable design directions.", skills: ["User Research", "Figma", "Data Analysis"], type: "Contract Remote", huRequired: 50 },
    { id: "c11", title: "Blockchain Developer", salary: 14000, domain: "coinbase.com", company: "Coinbase", badge: "Crypto · Remote", dept: "Engineering", desc: "Build and audit smart contracts on Ethereum, Base, and Polygon for Coinbase's DeFi and NFT products.", skills: ["Solidity", "Go", "Web3.js"], type: "Senior Full-time Remote", huRequired: 100 },
    { id: "c12", title: "Growth Marketing Manager", salary: 9000, domain: "spotify.com", company: "Spotify", badge: "Marketing · Remote", dept: "Marketing", desc: "Drive artist and listener acquisition campaigns globally. Manage $2M+ monthly ad budget.", skills: ["Growth", "Paid Media", "Analytics"], type: "Full-time Remote", huRequired: 50 },
    { id: "c13", title: "ML Infrastructure Engineer", salary: 15000, domain: "openai.com", company: "OpenAI", badge: "AI · Remote", dept: "AI", desc: "Build and scale infrastructure powering OpenAI's model training and inference with GPU clusters.", skills: ["PyTorch", "CUDA", "Distributed Systems"], type: "Senior Full-time Remote", huRequired: 100 },
    { id: "c14", title: "Backend Engineer (Go/Rust)", salary: 12000, domain: "discord.com", company: "Discord", badge: "Remote · Mid", dept: "Engineering", desc: "Build low-latency microservices handling 4 billion messages daily.", skills: ["Go", "Rust", "Distributed Systems"], type: "Full-time Remote", huRequired: 50 },
    { id: "c15", title: "Data Scientist — Ads Platform", salary: 13000, domain: "twitter.com", company: "X (Twitter)", badge: "Data · Senior", dept: "Data", desc: "Build ML models optimizing ad relevance and bidding for X's advertising platform.", skills: ["Python", "TensorFlow", "Causal ML"], type: "Senior Full-time Remote", huRequired: 100 },
    { id: "c16", title: "Smart Contract Auditor", salary: 17000, domain: "binance.com", company: "Binance", badge: "Crypto · Senior", dept: "Security", desc: "Audit DeFi protocols integrated with Binance Smart Chain. Identify vulnerabilities and write PoCs.", skills: ["Solidity", "Security", "DeFi"], type: "Senior Full-time Remote", huRequired: 100 },
    { id: "c17", title: "API Developer (Payments)", salary: 10000, domain: "paypal.com", company: "PayPal", badge: "FinTech · Remote", dept: "Engineering", desc: "Design and build payment APIs handling $1.5T in annual transaction volume.", skills: ["Java", "REST", "Payments"], type: "Full-time Remote", huRequired: 50 },
    { id: "c18", title: "Content Strategy Manager", salary: 7500, domain: "hubspot.com", company: "HubSpot", badge: "Marketing · Remote", dept: "Marketing", desc: "Lead HubSpot's blog and resource content strategy. Own SEO content roadmap and drive 2M+ monthly visits.", skills: ["Content Strategy", "SEO", "Leadership"], type: "Full-time Remote", huRequired: 30 },
    { id: "c19", title: "Cloud Security Architect", salary: 16000, domain: "cloudflare.com", company: "Cloudflare", badge: "Security · Senior", dept: "Security", desc: "Design Cloudflare's zero-trust security architecture protecting 25M+ websites.", skills: ["Zero Trust", "Networking", "AWS/GCP"], type: "Senior Full-time Remote", huRequired: 100 },
    { id: "c20", title: "iOS Engineer", salary: 11500, domain: "uber.com", company: "Uber", badge: "Mobile · Remote", dept: "Engineering", desc: "Build the Uber Eats iOS app used by 100M+ customers. Optimize cold start, animations, and A/B testing.", skills: ["Swift", "SwiftUI", "XCTest"], type: "Full-time Remote", huRequired: 50 },
    { id: "c21", title: "Full Stack Engineer (TypeScript)", salary: 10000, domain: "notion.so", company: "Notion", badge: "SaaS · Remote", dept: "Engineering", desc: "Build Notion's collaborative workspace features: real-time sync, block editor, API integrations.", skills: ["TypeScript", "React", "Node.js"], type: "Full-time Remote", huRequired: 50 },
    { id: "c22", title: "Analytics Engineer", salary: 9500, domain: "figma.com", company: "Figma", badge: "Design · Remote", dept: "Data", desc: "Own Figma's data warehouse and analytics stack. Build dbt models and enable data-driven decisions.", skills: ["dbt", "SQL", "Looker"], type: "Full-time Remote", huRequired: 50 },
  ], []);

  const gigCategories = ["All", "Web Dev", "Design", "Writing", "Marketing", "Data", "AI", "Security", "Web3"];
  const corpDepts = ["All", "Engineering", "Data", "Security", "Marketing", "Product", "Design", "AI", "Infrastructure", "Finance", "Cloud"];

  const filteredMarket = useMemo(() => {
    let list = gigCategory === "All" ? marketplaceGigs : marketplaceGigs.filter(g => g.type === gigCategory);
    if (gigSearch) list = list.filter(g => g.title.toLowerCase().includes(gigSearch.toLowerCase()) || g.client.toLowerCase().includes(gigSearch.toLowerCase()));
    if (gigSort === "highest") list = [...list].sort((a, b) => b.budget - a.budget);
    if (gigSort === "lowest") list = [...list].sort((a, b) => a.budget - b.budget);
    return list;
  }, [gigCategory, gigSearch, gigSort, marketplaceGigs]);

  const filteredCorp = useMemo(() => (
    corpCategory === "All" ? corporateGigs : corporateGigs.filter(c => c.dept === corpCategory)
  ), [corpCategory, corporateGigs]);

  const typeColors: Record<string, string> = {
    "Web Dev": "#3B82F6", "Design": "#8B5CF6", "Writing": "#10B981",
    "Marketing": "#F59E0B", "Data": "#06B6D4", "AI": "#EF4444",
    "Security": "#DC2626", "Web3": "#7C3AED", "Video": "#EC4899",
  };
  const levelColors: Record<string, string> = {
    "Basic": "#10B981", "Standard": "#3B82F6", "Advanced": "#8B5CF6", "Expert": "#EF4444",
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.getElementById("paystack-inline-script")) return;
    const script = document.createElement("script");
    script.id = "paystack-inline-script";
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Open freelance chat — empty thread
  const openChatForGig = (g: { id: string; title: string; client: string; avatar: string; type: string; budget: number }) => {
    setChatTarget({
      id: `gig-${g.id}`,
      name: g.client,
      subtitle: g.title,
      avatar: g.avatar,
      type: g.type,
      kind: "freelance",
      context: g.title,
      budget: g.budget,
    });
    setChatThread([]);
    setChatDraft("");
  };

  // Open corporate chat — empty thread
  const openChatForCorporate = (c: { id: string; title: string; company: string; domain: string; dept: string; salary: number; badge: string }) => {
    setChatTarget({
      id: `corp-${c.id}`,
      name: `${c.company}`,
      subtitle: c.title,
      avatar: c.domain,
      type: c.dept,
      kind: "corporate",
      context: `${c.title} @ ${c.company}`,
      company: c.company,
      domain: c.domain,
      dept: c.dept,
      salary: c.salary,
    });
    setChatThread([]);
    setChatDraft("");
  };

  const triggerCallPaywall = (feature: string, sub: string) => {
    setCallPaywall({ open: true, feature, sub });
  };

  const navItems = [
    { id: "home", icon: <Home size={17} />, label: "Home" },
    { id: "tasks", icon: <Briefcase size={17} />, label: "Jobs" },
    { id: "contracts", icon: <FileText size={17} />, label: "Work" },
    { id: "messages", icon: <MessageSquare size={17} />, label: "Chats" },
    { id: "earnings", icon: <Wallet size={17} />, label: "Wallet" },
    { id: "analytics", icon: <BarChart3 size={17} />, label: "Stats" },
    { id: "support", icon: <LifeBuoy size={17} />, label: "Help" },
    { id: "me", icon: <User size={17} />, label: "Me" },
  ];

  const messages = [
    { sender: "Nexus HQ", body: "Welcome to Nexus! Purchase Handshake Units (HU) to instantly unlock all freelance gigs on the platform. Once you have HU, every freelance gig is immediately available — no waiting, no applications needed. Corporate roles require a standard HR hiring process.", time: "Just now", unread: true, avatar: "🏢" },
    { sender: "Security Bot", body: "Your connection is encrypted and secure. You have 5 HU left. Purchase at least 150 HU (Starter pack) to unlock all basic freelance gigs and start working immediately with zero application process.", time: "14m ago", unread: true, avatar: "🤖" },
    { sender: "Exchange Relay", body: "Currency rates updated. Switch between USD, EUR, GBP and more in your wallet settings. Withdrawals are available in your local currency after completing jobs.", time: "1h ago", unread: false, avatar: "📡" },
  ];

  const openRefill = () => { setModalStep("packages"); setShowModal(true); };

  const handleStartGig = (gigTitle: string) => {
    if (!hasHU) { addToast("Purchase HU to instantly unlock and start this gig", "error"); openRefill(); }
    else addToast(`You're now working on: ${gigTitle}`, "success");
  };

  const handleApplyCorporate = (gigTitle: string) => {
    if (!hasHU) { addToast("Purchase HU to apply for corporate roles", "error"); openRefill(); }
    else addToast(`Application submitted for: ${gigTitle} — HR will review within 2–5 business days`, "success");
  };

  const BINANCE_WALLETS = { TRC20: "TFWxe4TFcjUNgPJVgf5iXrMsw1oe4gDv9X", ERC20: "0x742d35Cc6634C0532925a3b8D4c9F1B7e9f6c89" };

  const handlePay = async (method: "MPESA" | "CARD" | "BINANCE") => {
    if (method !== "BINANCE" && !agreed) return addToast("Please agree to the terms first.", "info");
    if (!selectedPack) return addToast("Please select a package first.", "error");
    setIsPaying(true);
    try {
      if (method === "MPESA") {
        const clean = mpesaNum.replace(/\D/g, "");
        if (!clean.startsWith("254") || clean.length !== 12) {
          addToast("Please use format: 254XXXXXXXXX (12 digits)", "error"); setIsPaying(false); return;
        }
        const res = await fetch("/api/intasend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: selectedPack.price * 130, phone: clean, email: user?.primaryEmailAddress?.emailAddress, metadata: { hu: selectedPack.hu } }),
        });
        if (res.ok) { addToast("Check your phone — M-Pesa prompt sent!", "success"); setShowModal(false); }
        else addToast("M-Pesa connection failed. Try again.", "error");
      } else if (method === "CARD") {
        const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
        const email = user?.primaryEmailAddress?.emailAddress;
        if (!email) { addToast("Please ensure you are logged in with a valid email.", "error"); setIsPaying(false); return; }
        const PaystackPop = (window as any).PaystackPop;
        if (!PaystackPop) { addToast("Paystack is loading — please try again in a moment.", "info"); setIsPaying(false); return; }
        const ref = `HU-${selectedPack.id}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        const handler = PaystackPop.setup({
          key: paystackPublicKey, email,
          amount: selectedPack.price * 130 * 100,
          currency: "KES",
          channels: ["card"],
          ref,
          label: `${selectedPack.name} Pack — ${selectedPack.hu} HU`,
          onClose: () => { setIsPaying(false); addToast("Payment window closed.", "info"); },
          callback: (response: { reference: string }) => {
            setIsPaying(false);
            setHuBalance(prev => prev + selectedPack.hu);
            setJustPurchased(true);
            addToast(`Payment confirmed! ${selectedPack.hu} HU credited — all gigs unlocked! Ref: ${response.reference}`, "success");
            setShowModal(false);
          },
        });
        handler.openIframe();
        return;
      } else if (method === "BINANCE") {
        addToast("Binance Pay link generated. Complete payment to receive HU.", "info");
        setShowModal(false);
      }
    } catch { addToast("Network error. Please try again.", "error"); }
    finally { setIsPaying(false); }
  };

  const copyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopied(true);
    addToast("Address copied!", "success");
    setTimeout(() => setCopied(false), 2500);
  };

  const faqItems = [
    { q: "What are Handshake Units (HU)?", a: "HU are your platform access credits. Once you purchase HU, all corresponding freelance gigs become available immediately — no applications, no waiting. Corporate roles still require a formal HR application process." },
    { q: "Do I need to apply to each freelance gig?", a: "Absolutely not for freelance gigs! Once you buy HU, ALL matching freelance gigs are instantly unlocked and ready to start. Clients have pre-approved all listed workers. Corporate roles are the only exception." },
    { q: "How are freelance gigs different from corporate roles?", a: "Freelance gigs: buy HU → start immediately, zero applications, project-based pay. Corporate roles: buy HU → submit CV → HR review (2–5 days) → video interview → formal offer → monthly salary." },
    { q: "Which payment methods are supported?", a: "Card via Paystack (Visa/Mastercard worldwide), Binance Pay (USDT crypto — worldwide, instant), and M-Pesa (East Africa — instant STK Push)." },
    { q: "How fast is payment and HU credit?", a: "Card (Paystack) is near-instant. Binance Pay is instant once confirmed on-chain. M-Pesa is instant via STK Push. HU balances are credited automatically once payment is confirmed." },
    { q: "Can I withdraw my earnings?", a: "Yes! Once your balance reaches $50, you can withdraw via Binance Pay, M-Pesa, or PayPal. Withdrawals are processed within 24 hours." },
    { q: "Is my data and money safe?", a: "Yes. All data is protected using TLS 1.3 encryption in transit and AES-256 at rest. Payments are handled by certified processors (Paystack, Binance, Safaricom). No financial data is stored on our servers." },
  ];

  const achievements = [
    { id: 1, title: "First Login", desc: "Joined the platform", icon: <Star size={14} />, color: "#F59E0B", earned: true },
    { id: 2, title: "Profile Set Up", desc: "Completed your profile", icon: <UserCheck size={14} />, color: "#10B981", earned: true },
    { id: 3, title: "First Gig Started", desc: "Began your first job", icon: <Briefcase size={14} />, color: "#3B82F6", earned: false },
    { id: 4, title: "First Earning", desc: "Completed a paid job", icon: <DollarSign size={14} />, color: "#8B5CF6", earned: false },
    { id: 5, title: "Top Rated", desc: "Earned 5-star feedback", icon: <Award size={14} />, color: "#EF4444", earned: false },
    { id: 6, title: "Verified Pro", desc: "Profile fully verified", icon: <BadgeCheck size={14} />, color: "#06B6D4", earned: false },
    { id: 7, title: "Referral King", desc: "Referred 5 friends", icon: <Gift size={14} />, color: "#EC4899", earned: false },
    { id: 8, title: "Elite Worker", desc: "Completed 10 jobs", icon: <Trophy size={14} />, color: "#7C3AED", earned: false },
  ];

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <div className="min-h-screen font-sans overflow-x-hidden" style={{ background: "#F1F4FA", paddingBottom: chatTarget ? "0" : "76px" }}>

      {/* Toasts */}
      <div className="fixed top-3 right-3 z-999 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div key={t.id}
              initial={{ opacity: 0, x: 60, scale: 0.92 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 60, scale: 0.92 }}
              className={`pointer-events-auto flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-[10px] font-bold border shadow-lg bg-white max-w-75 ${t.type === "success" ? "border-green-200 text-green-700" : t.type === "error" ? "border-red-200 text-red-700" : "border-blue-200 text-blue-700"}`}>
              {t.type === "success" ? <CheckCircle size={12} className="text-green-500 shrink-0" /> : t.type === "error" ? <AlertTriangle size={12} className="text-red-500 shrink-0" /> : <BellRing size={12} className="text-blue-500 shrink-0" />}
              <span className="flex-1 leading-tight">{t.msg}</span>
              <button onClick={() => setToasts(p => p.filter(x => x.id !== t.id))} className="ml-1 opacity-40 hover:opacity-100 shrink-0"><X size={10} /></button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ─── CHAT OVERLAY — Official white theme ─── */}
      <AnimatePresence>
        {chatTarget && (
          <motion.div
            key="chat-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-500 flex flex-col"
            style={{ background: "#F7F8FB" }}
          >
            {/* Subtle accent wash */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-[0.06]"
                style={{ background: chatTarget.kind === "corporate"
                  ? "radial-gradient(circle, #7c3aed, transparent)"
                  : "radial-gradient(circle, #0055ff, transparent)" }} />
              <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-[0.05]"
                style={{ background: chatTarget.kind === "corporate"
                  ? "radial-gradient(circle, #4f46e5, transparent)"
                  : "radial-gradient(circle, #0ea5e9, transparent)" }} />
            </div>

            {/* ── FREELANCE CHAT HEADER ── */}
            {chatTarget.kind === "freelance" && (
              <div className="relative z-10 px-4 pt-4 pb-3 flex items-center gap-3 bg-white border-b border-slate-200/70 shadow-sm">
                <button
                  onClick={() => setChatTarget(null)}
                  className="w-9 h-9 rounded-2xl flex items-center justify-center transition-all bg-slate-100 hover:bg-slate-200 shrink-0">
                  <ChevronLeft size={16} className="text-slate-700" />
                </button>

                <MarketplaceAvatar initials={chatTarget.avatar} type={chatTarget.type} seed={chatTarget.name} size={42} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[13px] font-black text-slate-900 truncate">{chatTarget.name}</p>
                    <BadgeCheck size={13} className="text-blue-500 shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <PulseDot color="#10b981" size={5} />
                    <p className="text-[9px] font-semibold text-slate-500 truncate">Online · {chatTarget.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => triggerCallPaywall("Voice call with client", "Open a verified, encrypted voice channel with this client.")}
                    className="w-9 h-9 rounded-2xl flex items-center justify-center transition-all bg-blue-50 hover:bg-blue-100">
                    <Phone size={14} className="text-blue-600" />
                  </button>
                  <button
                    onClick={() => triggerCallPaywall("Video call with client", "Start an HD video meeting with this verified client.")}
                    className="w-9 h-9 rounded-2xl flex items-center justify-center transition-all bg-blue-50 hover:bg-blue-100">
                    <VideoIcon size={14} className="text-blue-600" />
                  </button>
                  <button
                    onClick={() => triggerCallPaywall("Chat options", "Manage chat settings, mute, report or block this client.")}
                    className="w-9 h-9 rounded-2xl flex items-center justify-center transition-all bg-slate-100 hover:bg-slate-200">
                    <MoreVertical size={14} className="text-slate-600" />
                  </button>
                </div>
              </div>
            )}

            {/* ── CORPORATE CHAT HEADER (HR Portal) ── */}
            {chatTarget.kind === "corporate" && (
              <div className="relative z-10 flex flex-col bg-white border-b border-slate-200/70 shadow-sm">
                {/* Top bar */}
                <div className="px-4 pt-4 pb-3 flex items-center gap-3">
                  <button
                    onClick={() => setChatTarget(null)}
                    className="w-9 h-9 rounded-2xl flex items-center justify-center transition-all bg-slate-100 hover:bg-slate-200 shrink-0">
                    <ChevronLeft size={16} className="text-slate-700" />
                  </button>

                  <div className="w-11 h-11 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center bg-linear-to-br from-purple-50 to-indigo-50 border border-purple-100">
                    {chatTarget.domain ? (
                      <img
                        src={`https://logo.clearbit.com/${chatTarget.domain}`}
                        alt={chatTarget.company || ""}
                        className="w-8 h-8 object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <Building2 size={18} className="text-purple-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[13px] font-black text-slate-900 truncate">{chatTarget.company} · Talent Team</p>
                      <div className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                        <BadgeCheck size={9} className="text-purple-600" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <PulseDot color="#a855f7" size={5} />
                      <p className="text-[9px] font-semibold text-slate-500 truncate">Official HR Channel · Verified Employer</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => triggerCallPaywall("Schedule HR interview", "Book a formal interview slot with the recruiter directly from your calendar.")}
                      className="w-9 h-9 rounded-2xl flex items-center justify-center transition-all bg-purple-50 hover:bg-purple-100">
                      <Calendar size={14} className="text-purple-600" />
                    </button>
                    <button
                      onClick={() => triggerCallPaywall("Video interview room", "Join the official video interview room hosted by the company's HR team.")}
                      className="w-9 h-9 rounded-2xl flex items-center justify-center transition-all bg-purple-50 hover:bg-purple-100">
                      <VideoIcon size={14} className="text-purple-600" />
                    </button>
                    <button
                      onClick={() => triggerCallPaywall("Recruiter options", "View company profile, request referral, or report this listing.")}
                      className="w-9 h-9 rounded-2xl flex items-center justify-center transition-all bg-slate-100 hover:bg-slate-200">
                      <MoreVertical size={14} className="text-slate-600" />
                    </button>
                  </div>
                </div>

                {/* Corporate job context strip */}
                <div className="mx-4 mb-3 p-3 rounded-2xl flex items-center gap-3 bg-linear-to-br from-purple-50 to-indigo-50/50 border border-purple-100">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-purple-100">
                    <Briefcase size={14} className="text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-slate-900 truncate">{chatTarget.subtitle}</p>
                    <p className="text-[8.5px] text-purple-600/80 font-semibold">{chatTarget.dept} · {chatTarget.salary ? fmt(chatTarget.salary) + "/mo" : ""}</p>
                  </div>
                  <div className="shrink-0 px-2 py-1 rounded-lg bg-purple-600 text-white">
                    <p className="text-[8px] font-black uppercase tracking-widest">Active</p>
                  </div>
                </div>

                {/* Corporate quick actions — legit company features */}
                <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
                  {[
                    { icon: <FileCheck size={11} />, label: "Submit CV", sub: "Application & cover letter" },
                    { icon: <Calendar size={11} />, label: "Book Interview", sub: "Schedule HR interview" },
                    { icon: <FileText size={11} />, label: "Job Description", sub: "Full role details & scope" },
                    { icon: <Shield size={11} />, label: "Sign NDA", sub: "Mutual non-disclosure" },
                    { icon: <Gift size={11} />, label: "Benefits", sub: "Compensation breakdown" },
                    { icon: <Building size={11} />, label: "Company Profile", sub: "About the employer" },
                  ].map((a, i) => (
                    <button key={i}
                      onClick={() => triggerCallPaywall(a.label, a.sub + ".")}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all">
                      <span className="text-purple-600">{a.icon}</span>
                      <span className="text-[9.5px] font-bold text-slate-700">{a.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── MESSAGES AREA ── */}
            <div className="flex-1 overflow-y-auto relative z-10" style={{ padding: "20px 16px 8px" }}>

              {/* Empty state */}
              {chatThread.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col items-center justify-center h-full text-center py-12"
                >
                  {chatTarget.kind === "corporate" ? (
                    <>
                      <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5 relative bg-linear-to-br from-purple-50 to-indigo-50 border border-purple-100">
                        <Building2 size={34} className="text-purple-500" />
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center bg-white border border-purple-200 shadow-sm">
                          <Lock size={13} className="text-purple-600" />
                        </div>
                      </div>
                      <p className="text-[16px] font-black text-slate-900 mb-2">Secure HR Portal</p>
                      <p className="text-[10.5px] text-slate-500 font-medium leading-relaxed max-w-xs">
                        You're connecting with the official <strong className="text-slate-700">{chatTarget.company}</strong> recruiting team for the <strong className="text-slate-700">{chatTarget.subtitle}</strong> role.
                      </p>
                      <div className="mt-6 p-4 rounded-2xl text-left w-full max-w-xs bg-white border border-slate-200 shadow-sm">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Hiring pipeline</p>
                        {[
                          { step: "01", label: "Activate access", done: false },
                          { step: "02", label: "Submit CV & cover letter", done: false },
                          { step: "03", label: "HR review (2–5 days)", done: false },
                          { step: "04", label: "Video interview", done: false },
                          { step: "05", label: "Receive formal offer", done: false },
                        ].map((s, i) => (
                          <div key={i} className="flex items-center gap-2.5 mb-2 last:mb-0">
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[8px] font-black bg-purple-50 text-purple-600 border border-purple-100">{s.step}</div>
                            <p className="text-[10px] font-semibold text-slate-600">{s.label}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5 relative bg-linear-to-br from-blue-50 to-sky-50 border border-blue-100">
                        <MessageCircle size={34} className="text-blue-500" />
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center bg-white border border-blue-200 shadow-sm">
                          <Lock size={13} className="text-blue-600" />
                        </div>
                      </div>
                      <p className="text-[16px] font-black text-slate-900 mb-2">Encrypted Client Channel</p>
                      <p className="text-[10.5px] text-slate-500 font-medium leading-relaxed max-w-xs">
                        Your private channel with <strong className="text-slate-700">{chatTarget.name}</strong> for the <strong className="text-slate-700">{chatTarget.subtitle}</strong> gig.
                      </p>
                      <div className="mt-6 p-4 rounded-2xl text-left w-full max-w-xs bg-white border border-slate-200 shadow-sm">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">To start messaging</p>
                        {[
                          { icon: <Zap size={11} />, label: "Activate your account", color: "#3b82f6" },
                          { icon: <CheckCircle size={11} />, label: "Instant verification", color: "#10b981" },
                          { icon: <Send size={11} />, label: "Full messaging unlocks", color: "#8b5cf6" },
                        ].map((s, i) => (
                          <div key={i} className="flex items-center gap-2.5 mb-2 last:mb-0">
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                              style={{ background: `${s.color}15`, color: s.color }}>{s.icon}</div>
                            <p className="text-[10px] font-semibold text-slate-600">{s.label}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {/* Actual messages */}
              {chatThread.map(b => (
                <div key={b.id} className={`flex mb-3 ${b.from === "me" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[76%] px-3.5 py-2.5 text-[11px] leading-relaxed shadow-sm ${
                    b.from === "me"
                      ? "rounded-2xl rounded-br-md text-white"
                      : "rounded-2xl rounded-bl-md bg-white border border-slate-200 text-slate-800"
                  }`} style={b.from === "me"
                    ? { background: chatTarget.kind === "corporate"
                        ? "linear-gradient(135deg, #7c3aed, #4f46e5)"
                        : "linear-gradient(135deg, #0055ff, #0ea5e9)" }
                    : undefined
                  }>
                    <p className="font-medium">{b.body}</p>
                    <p className={`text-[7.5px] mt-1 font-bold ${b.from === "me" ? "opacity-70" : "text-slate-400"}`}>{b.time}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* ── COMPOSER ── */}
            <div className="relative z-10 px-4 pb-6 pt-3 bg-white border-t border-slate-200/70">

              {/* Lock notice */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3 bg-slate-50 border border-slate-200">
                <Lock size={11} className="text-slate-500 shrink-0" />
                <p className="text-[9.5px] font-semibold text-slate-600 leading-tight">
                  {chatTarget.kind === "corporate"
                    ? "Activate your account to message the HR team and submit your application"
                    : "Activate your account to unlock messaging, attachments, and calls"}
                </p>
              </div>

              <div className="flex items-end gap-2.5">
                <button
                  onClick={() => triggerCallPaywall("Send attachments", "Share portfolios, CVs, contracts and project files securely.")}
                  className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all bg-slate-100 hover:bg-slate-200">
                  <Paperclip size={15} className="text-slate-600" />
                </button>

                <div className="flex-1 flex items-center gap-2 rounded-2xl px-4 py-3 transition-all bg-slate-50 border border-slate-200 focus-within:border-slate-300">
                  <input
                    value={chatDraft}
                    onChange={e => setChatDraft(e.target.value)}
                    placeholder={chatTarget.kind === "corporate" ? "Message the Talent Team…" : "Type a message…"}
                    className="flex-1 bg-transparent outline-none text-[11.5px] font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-medium"
                    style={{ caretColor: chatTarget.kind === "corporate" ? "#7c3aed" : "#0055ff" }}
                  />
                  <button
                    onClick={() => triggerCallPaywall("Voice messages", "Record and send secure voice notes.")}
                    className="text-slate-400 hover:text-slate-600 transition-all">
                    <Mic size={14} />
                  </button>
                </div>

                <button
                  onClick={() => triggerCallPaywall(
                    chatTarget.kind === "corporate" ? "Message the HR team" : "Send message",
                    chatTarget.kind === "corporate"
                      ? "Open a direct, official communication channel with the recruiting team."
                      : "Start a secure conversation with this verified client."
                  )}
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all shadow-md"
                  style={{ background: chatTarget.kind === "corporate"
                    ? "linear-gradient(135deg, #7c3aed, #4f46e5)"
                    : "linear-gradient(135deg, #0055ff, #0ea5e9)" }}>
                  <Send size={15} className="text-white" />
                </button>
              </div>

              <p className="text-center text-[8.5px] font-semibold text-slate-400 mt-3 flex items-center justify-center gap-1.5">
                <ShieldCheck size={9} className="text-emerald-500" />
                End-to-end encrypted · {chatTarget.kind === "corporate" ? "Official HR portal · Verified employer" : "Verified Nexus client"}
              </p>
            </div>

            {/* Paywall popup */}
            {callPaywall && (
              <CallPaywallPopup
                open={callPaywall.open}
                feature={callPaywall.feature}
                sub={callPaywall.sub}
                kind={chatTarget.kind}
                onClose={() => setCallPaywall(null)}
                onUnlock={() => { setCallPaywall(null); setChatTarget(null); openRefill(); }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── MAIN CONTENT (only when not in chat) ─── */}
      {!chatTarget && (
        <>
          <div className="max-w-5xl mx-auto pt-4 px-3 relative z-10">
            <AnimatePresence mode="wait">

              {/* ═══════════════ HOME ═══════════════ */}
              {activeTab === "home" && (
                <motion.div key="home" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }} className="space-y-4">

                  {/* Hero */}
                  <div className="rounded-2xl border border-gray-100 shadow-sm p-5 flex justify-between items-center overflow-hidden relative bg-white">
                    <div className="absolute right-0 top-0 w-56 h-56 rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #0055FF, transparent)", transform: "translate(35%,-35%)" }} />
                    <div>
                      <p className="text-[8.5px] font-black text-gray-400 uppercase tracking-[0.15em] mb-0.5">Welcome back</p>
                      <h2 className="text-[22px] font-black text-gray-900 leading-none tracking-tight">{user?.firstName || "Operator"}</h2>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <PulseDot color="#10B981" size={5} />
                        <span className="text-[9px] font-semibold text-gray-400">Connected · All systems running</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 px-3 py-2 rounded-xl shadow-sm">
                        <Zap size={13} className="text-blue-600" fill="#3B82F6" />
                        <span className="text-[15px] font-black text-gray-900">{huBalance}</span>
                        <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">HU</span>
                      </div>
                      <div className="relative">
                        <button onClick={() => setShowCurrencyMenu(m => !m)}
                          className="text-[8.5px] font-bold bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all flex items-center gap-1">
                          {currency} <ChevronDown size={8} />
                        </button>
                        {showCurrencyMenu && (
                          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden w-40">
                            {(["USD", "EUR", "GBP", "KES"] as const).map(c => (
                              <button key={c} onClick={() => { setCurrency(c); setShowCurrencyMenu(false); }}
                                className={`block w-full text-left px-3.5 py-2.5 text-[10px] font-bold hover:bg-blue-50 transition-all ${currency === c ? "text-blue-600 bg-blue-50" : "text-gray-700"}`}>
                                {c} — {c === "USD" ? "US Dollar" : c === "EUR" ? "Euro" : c === "GBP" ? "British Pound" : "Kenyan Shilling"}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {justPurchased && hasHU && (
                    <InstantAccessBanner huBalance={huBalance} onBrowse={() => setActiveTab("tasks")} />
                  )}

                  {/* CTA + Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <div className="md:col-span-3 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden"
                      style={{ background: "linear-gradient(135deg, #0041CC 0%, #0055FF 55%, #1D8EF0 100%)" }}>
                      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, #ffffff 0%, transparent 50%)" }} />
                      <div className="relative z-10">
                        <div className="flex items-center gap-1.5 mb-1">
                          <div className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center">
                            <Rocket size={11} className="text-white" />
                          </div>
                          <p className="text-[8px] font-black uppercase tracking-[0.15em] text-blue-200">One Purchase. Instant Freelance Access.</p>
                        </div>
                        <h3 className="text-[17px] font-black text-white leading-snug mb-2 tracking-tight">
                          Buy HU → All Freelance Gigs<br />Unlock Immediately
                        </h3>
                        <p className="text-[10px] text-blue-100 leading-relaxed mb-4">
                          24+ opportunities from top companies. Start working the moment your payment clears — <strong className="text-white">zero applications, zero waiting.</strong>
                        </p>
                        <div className="flex gap-2">
                          <RippleButton onClick={openRefill}
                            className="flex-1 py-2.5 rounded-xl text-[9.5px] font-black uppercase tracking-widest text-blue-700 bg-white hover:bg-blue-50 transition-all shadow-sm">
                            Unlock Gigs — Buy HU
                          </RippleButton>
                          <button onClick={() => setActiveTab("tasks")}
                            className="px-4 py-2.5 rounded-xl text-[9.5px] font-black uppercase tracking-widest border border-white/25 text-white/80 hover:text-white hover:bg-white/10 transition-all">
                            Browse →
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2 grid grid-cols-2 gap-2">
                      <StatCard label="Freelance Gigs" value="24+" icon={<Briefcase size={13} />} color="#10B981" sub="Instant start" />
                      <StatCard label="Uptime" value="99.9%" icon={<Wifi size={13} />} color="#3B82F6" />
                      <StatCard label="Your HU" value={huBalance} icon={<Zap size={13} />} color="#8B5CF6" sub={hasHU ? "Active" : "Top up"} />
                      <StatCard label="Countries" value="195+" icon={<Globe size={13} />} color="#F59E0B" />
                    </div>
                  </div>

                  {/* Low HU Warning */}
                  {!hasHU && (
                    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                      className="p-3.5 rounded-xl border border-amber-200 bg-amber-50 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                        <Lock size={15} className="text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10.5px] font-black text-amber-800">Freelance gigs are locked — buy HU to unlock instantly</p>
                        <p className="text-[9px] text-amber-600 font-medium mt-0.5">Balance: {huBalance} HU · Starter ($3) → unlocks 24 basic gigs right now</p>
                      </div>
                      <button onClick={openRefill} className="shrink-0 px-3.5 py-2 rounded-xl text-[9.5px] font-black uppercase tracking-widest text-white bg-amber-500 hover:bg-amber-600 transition-all shadow-sm">
                        Unlock
                      </button>
                    </motion.div>
                  )}

                  {/* Quick Actions */}
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { icon: <Zap size={16} />, label: "Buy HU", color: "#3B82F6", bg: "linear-gradient(135deg, #EFF6FF, #DBEAFE)", action: openRefill },
                      { icon: <Briefcase size={16} />, label: "Browse Gigs", color: "#8B5CF6", bg: "linear-gradient(135deg, #F5F3FF, #EDE9FE)", action: () => setActiveTab("tasks") },
                      { icon: <Wallet size={16} />, label: "My Wallet", color: "#10B981", bg: "linear-gradient(135deg, #ECFDF5, #D1FAE5)", action: () => setActiveTab("earnings") },
                      { icon: <BarChart3 size={16} />, label: "My Stats", color: "#F59E0B", bg: "linear-gradient(135deg, #FFFBEB, #FEF3C7)", action: () => setActiveTab("analytics") },
                    ].map((item, i) => (
                      <button key={i} onClick={item.action}
                        className="p-3.5 rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-md transition-all text-center group">
                        <div className="w-9 h-9 rounded-xl mx-auto mb-1.5 flex items-center justify-center transition-transform group-hover:scale-110"
                          style={{ background: item.bg, color: item.color }}>
                          {item.icon}
                        </div>
                        <p className="text-[8.5px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-gray-800 transition-all leading-none">{item.label}</p>
                      </button>
                    ))}
                  </div>

                  {/* Freelance vs Corporate */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-green-200 p-4" style={{ background: "linear-gradient(135deg, #ECFDF5, #F0FDF4)" }}>
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-green-600 flex items-center justify-center shrink-0">
                          <PlayCircle size={14} className="text-white" />
                        </div>
                        <div>
                          <h4 className="text-[11px] font-black text-green-900">Freelance Gigs</h4>
                          <p className="text-[8.5px] text-green-600 font-bold uppercase tracking-wide">Instant · Zero Applications</p>
                        </div>
                      </div>
                      <p className="text-[9.5px] text-green-800 font-medium leading-relaxed mb-2">Buy HU once → every matching gig unlocks immediately. Pick a gig and start in minutes.</p>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge color="#059669"><CheckCircle size={7} /> Start Immediately</Badge>
                        <Badge color="#059669"><Zap size={7} /> Project-Based Pay</Badge>
                      </div>
                    </div>
                    <div className="rounded-xl border border-purple-200 p-4" style={{ background: "linear-gradient(135deg, #FAF5FF, #F5F3FF)" }}>
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center shrink-0">
                          <Building2 size={14} className="text-white" />
                        </div>
                        <div>
                          <h4 className="text-[11px] font-black text-purple-900">Corporate Roles</h4>
                          <p className="text-[8.5px] text-purple-600 font-bold uppercase tracking-wide">HR Process · Monthly Salary</p>
                        </div>
                      </div>
                      <p className="text-[9.5px] text-purple-800 font-medium leading-relaxed mb-2">Fortune 500 full-time remote roles. Apply with HU → CV review → video interview → formal offer.</p>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge color="#7C3AED"><Clock size={7} /> 2–5 Day Review</Badge>
                        <Badge color="#7C3AED"><DollarSign size={7} /> Monthly Salary</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Top Companies */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[8.5px] font-black uppercase tracking-[0.12em] text-gray-400">Top Companies Hiring Now</p>
                      <button onClick={() => { setGigMode("corporate"); setActiveTab("tasks"); }} className="text-[8.5px] font-bold text-blue-500 hover:text-blue-700 flex items-center gap-0.5">
                        View all <ChevronRight size={9} />
                      </button>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                      {[
                        { domain: "tesla.com", name: "Tesla" }, { domain: "amazon.com", name: "Amazon" },
                        { domain: "stripe.com", name: "Stripe" }, { domain: "google.com", name: "Google" },
                        { domain: "openai.com", name: "OpenAI" }, { domain: "coinbase.com", name: "Coinbase" },
                        { domain: "shopify.com", name: "Shopify" }, { domain: "microsoft.com", name: "Microsoft" },
                        { domain: "meta.com", name: "Meta" }, { domain: "discord.com", name: "Discord" },
                      ].map((c, i) => (
                        <button key={i} onClick={() => { setGigMode("corporate"); setActiveTab("tasks"); }}
                          className="shrink-0 p-2.5 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-md transition-all group">
                          <CompanyLogo name={c.name} domain={c.domain} size={36} />
                          <p className="text-[7.5px] font-bold text-gray-400 mt-1 text-center group-hover:text-gray-700">{c.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Global Stats */}
                  <div className="grid grid-cols-4 gap-2">
                    <StatCard label="Online" value="12,847" icon={<Users size={13} />} color="#10B981" sub="Workers" />
                    <StatCard label="Open Today" value="2,341" icon={<Briefcase size={13} />} color="#3B82F6" sub="Gigs" />
                    <StatCard label="Avg Value" value={fmt(847)} icon={<TrendingUp size={13} />} color="#8B5CF6" sub="Per gig" />
                    <StatCard label="Paid Out" value="$4.2M" icon={<DollarSign size={13} />} color="#F59E0B" sub="This month" />
                  </div>
                </motion.div>
              )}

              {/* ═══════════════ JOBS ═══════════════ */}
              {activeTab === "tasks" && (
                <motion.div key="tasks" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <SectionHead label="Global Gig Board" sub={`${marketplaceGigs.length + corporateGigs.length} gigs ready worldwide`} />
                    <Badge color="#10B981"><PulseDot color="#10B981" size={5} /> Live</Badge>
                  </div>

                  {hasHU && gigMode === "marketplace" && (
                    <div className="px-3.5 py-2.5 rounded-xl border border-green-200 flex items-center gap-2.5" style={{ background: "linear-gradient(135deg, #ECFDF5, #D1FAE5)" }}>
                      <CheckCircle size={13} className="text-green-600 shrink-0" />
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-green-900">All freelance gigs unlocked — tap any to start now</p>
                        <p className="text-[8.5px] text-green-700 font-medium mt-0.5">HU: {huBalance} · No applications · Clients pre-approved all workers</p>
                      </div>
                      <span className="text-[15px] font-black text-green-700">{huBalance}<span className="text-[8px] font-bold ml-0.5">HU</span></span>
                    </div>
                  )}

                  {/* Mode tabs */}
                  <div className="flex gap-1 p-1 rounded-xl border border-gray-200 bg-white w-fit shadow-sm">
                    {(["marketplace", "corporate"] as const).map(m => (
                      <button key={m} onClick={() => setGigMode(m)}
                        className={`px-5 py-2 rounded-lg text-[9.5px] font-black uppercase tracking-widest transition-all ${gigMode === m ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-800"}`}>
                        {m === "marketplace" ? "Freelance Gigs" : "Corporate Roles"}
                      </button>
                    ))}
                  </div>

                  {/* ── Marketplace ── */}
                  {gigMode === "marketplace" && (
                    <>
                      <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-green-200" style={{ background: "linear-gradient(135deg, #ECFDF5, #D1FAE5)" }}>
                        <CheckCircle2 size={12} className="text-green-600 shrink-0" />
                        <p className="text-[9.5px] font-semibold text-green-800 leading-relaxed flex-1">
                          <strong>Zero applications for freelance gigs.</strong> Buy HU → gigs unlock instantly.
                        </p>
                        {!hasHU && (
                          <button onClick={openRefill} className="shrink-0 px-2.5 py-1.5 rounded-lg text-[8.5px] font-black text-white bg-green-600 hover:bg-green-700 transition-all">Buy HU</button>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 shadow-sm">
                          <Search size={12} className="text-gray-400 shrink-0" />
                          <input value={gigSearch} onChange={e => setGigSearch(e.target.value)} placeholder="Search gigs or clients..."
                            className="flex-1 text-[10.5px] outline-none text-gray-700 placeholder-gray-400 bg-transparent" />
                          {gigSearch && <button onClick={() => setGigSearch("")}><X size={10} className="text-gray-400 hover:text-gray-600" /></button>}
                        </div>
                        <select value={gigSort} onChange={e => setGigSort(e.target.value as typeof gigSort)}
                          className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-[10.5px] font-semibold text-gray-600 outline-none cursor-pointer shadow-sm">
                          <option value="newest">Newest</option>
                          <option value="highest">Highest Pay</option>
                          <option value="lowest">Lowest Pay</option>
                        </select>
                      </div>

                      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                        {gigCategories.map(cat => (
                          <button key={cat} onClick={() => setGigCategory(cat)}
                            className={`shrink-0 px-3.5 py-1.5 rounded-full text-[9px] font-bold border transition-all ${gigCategory === cat ? "bg-blue-600 text-white border-blue-600" : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                            {cat}
                          </button>
                        ))}
                      </div>

                      <div className="flex gap-2 flex-wrap items-center">
                        {[["Basic", "#10B981"], ["Standard", "#3B82F6"], ["Advanced", "#8B5CF6"], ["Expert", "#EF4444"]].map(([l, c]) => (
                          <div key={l} className="flex items-center gap-1 px-2 py-1 bg-white border border-gray-100 rounded-lg">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c }} />
                            <span className="text-[8.5px] font-bold text-gray-500">{l}</span>
                          </div>
                        ))}
                        <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-100 rounded-lg ml-auto">
                          <PlayCircle size={8} className="text-blue-600" />
                          <span className="text-[8.5px] font-bold text-blue-600">{hasHU ? "All Unlocked" : "Buy HU to Unlock"}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {filteredMarket.map(g => {
                          const lc = levelColors[g.level] || "#3B82F6";
                          const tc = typeColors[g.type] || "#3B82F6";
                          const isExpanded = expandedGig === g.id;
                          return (
                            <motion.div key={g.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                              className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg hover:border-gray-200 transition-all overflow-hidden relative group"
                              style={{ borderTop: `3px solid ${tc}` }}>
                              {hasHU && (
                                <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[7.5px] font-black bg-green-500 text-white shadow-sm">
                                  <CheckCircle size={7} /> Ready
                                </div>
                              )}
                              <div className="p-4">
                                <div className="flex items-start justify-between mb-2.5">
                                  <MarketplaceAvatar initials={g.avatar} type={g.type} seed={g.client} size={38} />
                                  <div className="flex gap-1 flex-wrap justify-end pr-12">
                                    <Badge color={tc}>{g.type}</Badge>
                                    <Badge color={lc}>{g.level}</Badge>
                                  </div>
                                </div>
                                <h4 className="text-[11.5px] font-black text-gray-900 mb-0.5 leading-snug">{g.title}</h4>
                                <p className="text-[9px] text-gray-400 font-medium mb-1.5">{g.client} · {g.duration}</p>
                                <p className="text-[9.5px] text-gray-500 leading-relaxed mb-2.5 line-clamp-2">{g.desc}</p>
                                <div className="flex gap-1 flex-wrap mb-2.5">
                                  {g.skills.map((s, si) => (
                                    <span key={si} className="px-1.5 py-0.5 rounded text-[7.5px] font-bold bg-gray-100 text-gray-500">{s}</span>
                                  ))}
                                </div>

                                <AnimatePresence>
                                  {isExpanded && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                      <div className="mb-2 p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                                        <p className="text-[8.5px] font-bold text-gray-400 uppercase mb-0.5">Deliverables</p>
                                        <p className="text-[9.5px] font-semibold text-gray-700">{g.deliverables}</p>
                                      </div>
                                      <div className="mb-2 p-2.5 bg-green-50 rounded-xl border border-green-100">
                                        <p className="text-[8.5px] font-bold text-green-600 uppercase mb-0.5">How to Start</p>
                                        <p className="text-[9.5px] font-semibold text-green-800">
                                          {hasHU ? "✓ HU active — tap 'Start Gig' and begin right now. No approval needed." : "Purchase HU → gig activates instantly."}
                                        </p>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>

                                <button onClick={() => setExpandedGig(isExpanded ? null : g.id)}
                                  className="text-[8.5px] font-bold text-blue-500 hover:text-blue-700 transition-all mb-2.5 flex items-center gap-0.5">
                                  {isExpanded ? <><ChevronUp size={8} /> Less</> : <><ChevronDown size={8} /> More details</>}
                                </button>

                                <div className="flex items-center justify-between pt-2.5 border-t border-gray-50">
                                  <div>
                                    <p className="text-[15px] font-black text-gray-900 leading-none">{fmt(g.budget)}</p>
                                    <p className="text-[7.5px] text-gray-400 font-medium mt-0.5">Project budget</p>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() => openChatForGig(g)}
                                      title="Chat with client"
                                      className="w-9 h-9 rounded-xl border border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-all shadow-sm">
                                      <MessageCircle size={13} />
                                    </button>
                                    {hasHU
                                      ? <RippleButton onClick={() => handleStartGig(g.title)}
                                          className="px-3.5 py-2 rounded-xl text-[8.5px] font-black uppercase tracking-widest text-white flex items-center gap-1 shadow-sm"
                                          style={{ background: `linear-gradient(135deg, ${tc}, ${tc}bb)` }}>
                                          <PlayCircle size={10} /> Start Gig
                                        </RippleButton>
                                      : <button onClick={openRefill}
                                          className="px-3.5 py-2 rounded-xl text-[8.5px] font-black uppercase tracking-widest flex items-center gap-1 border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all">
                                          <Lock size={9} /> Unlock
                                        </button>
                                    }
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>

                      {filteredMarket.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                          <Search size={28} className="mx-auto mb-2 opacity-40" />
                          <p className="text-[12px] font-semibold text-gray-600">No gigs match your search</p>
                          <button onClick={() => { setGigSearch(""); setGigCategory("All"); }}
                            className="mt-2 px-4 py-2 rounded-xl text-[9.5px] font-bold text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-all">
                            Clear Filters
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {/* ── Corporate ── */}
                  {gigMode === "corporate" && (
                    <>
                      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                        {corpDepts.map(d => (
                          <button key={d} onClick={() => setCorpCategory(d)}
                            className={`shrink-0 px-3.5 py-1.5 rounded-full text-[9px] font-bold border transition-all ${corpCategory === d ? "bg-blue-600 text-white border-blue-600" : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                            {d}
                          </button>
                        ))}
                      </div>

                      <div className="px-3.5 py-2.5 rounded-xl border border-amber-200" style={{ background: "linear-gradient(135deg, #FFFBEB, #FFF7ED)" }}>
                        <div className="flex items-center gap-2">
                          <Info size={11} className="text-amber-500 shrink-0" />
                          <p className="text-[9.5px] text-amber-800 font-semibold leading-relaxed">
                            <strong>Corporate roles require a formal HR process</strong> — unlike freelance gigs, they don't start immediately after buying HU.
                          </p>
                        </div>
                      </div>

                      <CorporateHiringCard />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {filteredCorp.map(c => {
                          const isExpanded = expandedGig === c.id;
                          const costColor = c.huRequired >= 100 ? "#EF4444" : "#8B5CF6";
                          return (
                            <div key={c.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg hover:border-gray-200 transition-all overflow-hidden"
                              style={{ borderTop: "3px solid #8B5CF6" }}>
                              <div className="p-4">
                                <div className="flex items-center gap-1.5 mb-2.5 px-2.5 py-1.5 rounded-xl border border-purple-100"
                                  style={{ background: "linear-gradient(135deg, #FAF5FF, #F5F3FF)" }}>
                                  <Building2 size={9} className="text-purple-500 shrink-0" />
                                  <p className="text-[8px] font-black text-purple-700 uppercase tracking-widest">Full-Time Corporate · HR Process</p>
                                </div>
                                <div className="flex items-center gap-3 mb-3">
                                  <CompanyLogo name={c.company} domain={c.domain} size={44} />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-[8.5px] font-bold uppercase tracking-wide text-gray-400 mb-0.5">{c.company}</p>
                                    <h4 className="text-[11.5px] font-black text-gray-900 leading-snug">{c.title}</h4>
                                    <div className="flex gap-1 mt-1 flex-wrap">
                                      <Badge color="#8B5CF6">{c.badge}</Badge>
                                      <Badge color="#06B6D4">{c.dept}</Badge>
                                    </div>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <p className="text-[15px] font-black text-gray-900 leading-none">{fmt(c.salary)}</p>
                                    <p className="text-[8px] text-gray-400 font-medium mt-0.5">/month</p>
                                  </div>
                                </div>
                                <p className="text-[9.5px] text-gray-500 leading-relaxed mb-2.5">{c.desc}</p>
                                <div className="flex gap-1 flex-wrap mb-2.5">
                                  {c.skills.map((s, si) => (
                                    <span key={si} className="px-1.5 py-0.5 rounded text-[7.5px] font-bold bg-gray-100 text-gray-500">{s}</span>
                                  ))}
                                </div>

                                <AnimatePresence>
                                  {isExpanded && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                      <div className="mb-2 p-2.5 bg-purple-50 rounded-xl border border-purple-100">
                                        <p className="text-[8.5px] font-bold text-purple-600 uppercase mb-0.5">Hiring Pipeline</p>
                                        <p className="text-[9.5px] font-semibold text-purple-800">Apply → Submit CV → HR Review (2–5 days) → Video Interview → Offer</p>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>

                                <button onClick={() => setExpandedGig(isExpanded ? null : c.id)}
                                  className="text-[8.5px] font-bold text-blue-500 hover:text-blue-700 transition-all mb-2.5 flex items-center gap-0.5">
                                  {isExpanded ? <><ChevronUp size={8} /> Less</> : <><ChevronDown size={8} /> More details</>}
                                </button>

                                <div className="flex items-center gap-1 mb-2.5 px-2.5 py-1.5 rounded-lg"
                                  style={{ backgroundColor: `${costColor}0c`, border: `1px solid ${costColor}22` }}>
                                  <Zap size={9} style={{ color: costColor }} />
                                  <span className="text-[8.5px] font-black uppercase" style={{ color: costColor }}>Requires {c.huRequired} HU to Apply</span>
                                  {c.huRequired >= 100 && <span className="ml-auto text-[7.5px] font-bold text-red-400">Senior Role</span>}
                                </div>

                                <div className="flex gap-1.5">
                                  {/* Corporate Chat Button — opens dark HR portal */}
                                  <button
                                    onClick={() => openChatForCorporate(c)}
                                    title="Open HR Portal"
                                    className="shrink-0 flex items-center gap-1.5 px-3 h-10 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-600 transition-all text-[8.5px] font-black">
                                    <Building2 size={12} />
                                    HR Portal
                                  </button>
                                  {hasHU
                                    ? <RippleButton onClick={() => handleApplyCorporate(c.title)}
                                        className="flex-1 py-2.5 rounded-xl text-[9.5px] font-black uppercase tracking-widest text-white flex items-center justify-center gap-1.5 shadow-sm"
                                        style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}>
                                        <ClipboardList size={11} /> Submit Application <ArrowUpRight size={10} />
                                      </RippleButton>
                                    : <button onClick={openRefill}
                                        className="flex-1 py-2.5 rounded-xl text-[9.5px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 border border-purple-200 bg-purple-50 text-purple-600 hover:bg-purple-100 transition-all">
                                        <Lock size={11} /> Purchase HU to Apply
                                      </button>
                                  }
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {/* ═══════════════ WALLET ═══════════════ */}
              {activeTab === "earnings" && (
                <motion.div key="earnings" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }} className="space-y-4">
                  <SectionHead label="My Wallet" sub="Earnings, HU balance, and withdrawals" />

                  <div className="flex gap-1 p-1 rounded-xl border border-gray-200 bg-white w-fit overflow-x-auto no-scrollbar shadow-sm">
                    {(["overview", "history", "limits", "referral"] as const).map(t => (
                      <button key={t} onClick={() => setActiveVaultTab(t)}
                        className={`shrink-0 px-4 py-2 rounded-lg text-[9.5px] font-black uppercase tracking-widest transition-all ${activeVaultTab === t ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-800"}`}>
                        {t}
                      </button>
                    ))}
                  </div>

                  {activeVaultTab === "overview" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-5 rounded-2xl border border-blue-100 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)" }}>
                          <div className="absolute right-0 top-0 w-28 h-28 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #0055FF, transparent)", transform: "translate(30%,-30%)" }} />
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm"><Zap size={14} className="text-white" fill="white" /></div>
                            <Badge color="#3B82F6"><PulseDot color="#3B82F6" size={5} /> Active</Badge>
                          </div>
                          <p className="text-[8.5px] font-bold uppercase tracking-[0.15em] text-blue-400 mb-0.5">Handshake Units (HU)</p>
                          <div className="flex items-end gap-1.5 mb-1">
                            <span className="text-[38px] font-black text-gray-900 leading-none">{huBalance}</span>
                            <span className="text-[16px] font-black text-blue-600 mb-1">HU</span>
                          </div>
                          <p className="text-[9.5px] font-medium text-gray-500 mb-4">{hasHU ? "All matching freelance gigs unlocked" : "Purchase HU to unlock freelance gigs instantly"}</p>
                          <div className="flex gap-2">
                            <button onClick={openRefill} className="flex-1 px-3.5 py-2.5 rounded-xl text-[9.5px] font-black uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm">+ Top Up</button>
                            <button onClick={() => setActiveVaultTab("history")} className="px-3.5 py-2.5 rounded-xl text-[9.5px] font-black uppercase tracking-widest border border-blue-200 text-blue-600 hover:bg-blue-50 transition-all">History</button>
                          </div>
                        </div>

                        <div className="p-5 rounded-2xl border border-green-100 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)" }}>
                          <div className="absolute right-0 top-0 w-28 h-28 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #10B981, transparent)", transform: "translate(30%,-30%)" }} />
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-8 h-8 rounded-xl bg-green-600 flex items-center justify-center shadow-sm"><DollarSign size={14} className="text-white" /></div>
                            <button onClick={() => setShowBalance(b => !b)} className="text-gray-400 hover:text-gray-600 transition-all p-1 rounded-lg hover:bg-white/50">
                              {showBalance ? <Eye size={14} /> : <EyeOff size={14} />}
                            </button>
                          </div>
                          <p className="text-[8.5px] font-bold uppercase tracking-[0.15em] text-green-400 mb-0.5">Earnings Balance</p>
                          <div className="flex items-end gap-1.5 mb-1">
                            <span className="text-[38px] font-black text-gray-900 leading-none">{showBalance ? fmt(cashBalance) : "••••"}</span>
                          </div>
                          <p className="text-[9.5px] font-medium text-gray-500 mb-4">Ready to withdraw · Min. $50.00</p>
                          <RippleButton onClick={() => addToast("Minimum withdrawal is $50.00. Complete your first gig to earn.", "info")}
                            className="w-full py-2.5 rounded-xl text-[9.5px] font-black uppercase tracking-widest border border-green-200 text-green-700 hover:bg-green-100 transition-all flex items-center justify-center gap-1.5 bg-white/50">
                            Withdraw Money <ArrowUpRight size={11} />
                          </RippleButton>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        <StatCard label="Earned" value={fmt(0)} icon={<TrendingUp size={13} />} color="#10B981" sub="All time" />
                        <StatCard label="Withdrawn" value={fmt(0)} icon={<Download size={13} />} color="#3B82F6" sub="All time" />
                        <StatCard label="Pending" value={fmt(0)} icon={<Clock size={13} />} color="#F59E0B" sub="In review" />
                        <StatCard label="HU" value={huBalance} icon={<Zap size={13} />} color="#8B5CF6" sub="Balance" />
                      </div>

                      <Card className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center"><Calculator size={12} className="text-blue-600" /></div>
                          <span className="text-[11px] font-black text-gray-800">HU Value Calculator</span>
                        </div>
                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                            <p className="text-[8px] font-bold text-gray-400 uppercase mb-0.5">HU Amount</p>
                            <input type="number" value={calcHU} onChange={e => setCalcHU(e.target.value)}
                              className="bg-transparent w-full text-[16px] font-black outline-none text-gray-900" min="0" />
                          </div>
                          <RefreshCw size={12} className="text-gray-400" />
                          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-right">
                            <p className="text-[8px] font-bold text-gray-400 uppercase mb-0.5">Est. Gig Value</p>
                            <p className="text-[16px] font-black text-green-600 leading-none">
                              {isNaN(calcUSD) || calcUSD <= 0 ? "—" : fmt(calcUSD)}
                            </p>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center"><Globe size={12} className="text-blue-600" /></div>
                          <span className="text-[11px] font-black text-gray-800">Withdrawal Methods</span>
                        </div>
                        <div className="space-y-2">
                          {[
                            { name: "Binance Pay (USDT)", sub: "Worldwide · Instant settlement", logo: <BinanceLogo size={38} />, status: "Global", color: "#F0B90B" },
                            { name: "M-Pesa", sub: "Kenya, Tanzania, Uganda, Rwanda · Instant", logo: <MpesaLogoSVG size={38} />, status: "East Africa", color: "#16A34A" },
                          ].map((m, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all">
                              {m.logo}
                              <div className="flex-1">
                                <p className="text-[10.5px] font-black text-gray-900">{m.name}</p>
                                <p className="text-[8.5px] text-gray-400 font-medium mt-0.5">{m.sub}</p>
                              </div>
                              <Badge color={m.color}>{m.status}</Badge>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>
                  )}

                  {activeVaultTab === "history" && (
                    <PremiumLockedSection
                      title="Transaction History"
                      description="Your full earnings record, withdrawal history, and HU purchase log appear here once you complete your first gig or top up."
                      icon={<Clock size={24} />}
                      cta="Unlock Gigs Now"
                      onCta={() => setActiveTab("tasks")}
                      features={["Full record", "CSV export", "HU log", "Withdrawals"]}
                    />
                  )}

                  {activeVaultTab === "limits" && (
                    <div className="space-y-3">
                      <Card className="p-4">
                        <h4 className="text-[10px] font-black uppercase tracking-wide text-gray-500 mb-3">Withdrawal Limits</h4>
                        <div className="space-y-3">
                          {[
                            { label: "Daily Withdrawal", used: 0, limit: 500, unit: "USD" },
                            { label: "Monthly Withdrawal", used: 0, limit: 5000, unit: "USD" },
                            { label: "HU Used Today", used: 0, limit: 200, unit: "HU" },
                          ].map((item, i) => (
                            <div key={i}>
                              <div className="flex justify-between mb-1">
                                <span className="text-[9.5px] font-bold text-gray-600">{item.label}</span>
                                <span className="text-[9.5px] font-black text-gray-900">{item.used} / {item.limit} {item.unit}</span>
                              </div>
                              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full rounded-full bg-blue-500" style={{ width: `${(item.used / item.limit) * 100}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
                        <ChevronsUp size={14} className="text-amber-500 shrink-0" />
                        <div className="flex-1">
                          <p className="text-[10px] font-black text-amber-800">Verify your profile to increase limits 10×</p>
                          <p className="text-[8.5px] text-amber-600 font-medium mt-0.5">Verified accounts get priority processing</p>
                        </div>
                        <button onClick={() => { setActiveTab("me"); setActiveProfileTab("security"); }}
                          className="shrink-0 px-3 py-1.5 rounded-xl text-[8.5px] font-black text-amber-700 border border-amber-300 bg-amber-100 hover:bg-amber-200 transition-all">
                          Verify
                        </button>
                      </div>
                    </div>
                  )}

                  {activeVaultTab === "referral" && (
                    <div className="p-6 rounded-2xl border border-purple-100 text-center" style={{ background: "linear-gradient(135deg, #F5F3FF 0%, #EEF2FF 100%)" }}>
                      <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-purple-100 flex items-center justify-center">
                        <Gift size={22} className="text-purple-600" />
                      </div>
                      <h4 className="text-[16px] font-black text-gray-900 mb-1.5">Refer Friends & Earn</h4>
                      <p className="text-[10px] text-gray-500 font-medium mb-4">Get <strong className="text-purple-700">50 free HU</strong> for every friend who joins and tops up</p>
                      <div className="bg-white p-3.5 rounded-xl border border-purple-100 flex items-center gap-3 text-left mb-4">
                        <div className="flex-1">
                          <p className="text-[8.5px] text-gray-400 font-medium mb-0.5">Your referral code</p>
                          <p className="text-[15px] font-black text-blue-600 tracking-widest">NEXUS-{user?.firstName?.toUpperCase() || "USER"}07</p>
                        </div>
                        <button onClick={() => { navigator.clipboard.writeText("NEXUS-" + (user?.firstName?.toUpperCase() || "USER") + "07"); addToast("Referral code copied!", "success"); }}
                          className="p-2 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all">
                          <Copy size={12} className="text-gray-500" />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <StatCard label="Referred" value="0" icon={<Users size={12} />} color="#8B5CF6" />
                        <StatCard label="HU Earned" value="0" icon={<Zap size={12} />} color="#3B82F6" />
                        <StatCard label="$ Earned" value={fmt(0)} icon={<DollarSign size={12} />} color="#10B981" />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ═══════════════ WORK ═══════════════ */}
              {activeTab === "contracts" && (
                <motion.div key="contracts" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }} className="space-y-4">
                  <SectionHead label="My Work" sub="Active gigs, contracts, and completed jobs" />
                  <div className="grid grid-cols-4 gap-2 opacity-40 pointer-events-none select-none">
                    <StatCard label="Active Gigs" value="—" icon={<Briefcase size={13} />} color="#3B82F6" />
                    <StatCard label="Completed" value="—" icon={<CheckCircle2 size={13} />} color="#10B981" />
                    <StatCard label="Earned" value="—" icon={<DollarSign size={13} />} color="#F59E0B" />
                    <StatCard label="Rating" value="—" icon={<Star size={13} />} color="#8B5CF6" />
                  </div>

                  <PremiumLockedSection
                    title="No Gigs Started Yet"
                    description="Purchase HU and start your first freelance gig to unlock this section. Active work, milestones, client ratings, and earnings all appear here."
                    icon={<FileText size={24} />}
                    cta="Browse & Unlock Gigs"
                    onCta={() => setActiveTab("tasks")}
                    features={["Active gigs", "Client chat", "Milestones", "Earnings log", "Dispute help", "Ratings"]}
                  />

                  <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-[0.12em] text-gray-400">Trending Gigs — Start Today</p>
                    {marketplaceGigs.slice(0, 3).map(g => (
                      <div key={g.id} onClick={() => { setActiveTab("tasks"); setGigMode("marketplace"); }}
                        className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl cursor-pointer hover:border-blue-200 hover:shadow-md transition-all group">
                        <MarketplaceAvatar initials={g.avatar} type={g.type} seed={g.client} size={34} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10.5px] font-black text-gray-900 truncate">{g.title}</p>
                          <p className="text-[8.5px] text-gray-400 font-medium">{g.client} · {g.duration}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[12px] font-black text-gray-900">{fmt(g.budget)}</p>
                          <Badge color={levelColors[g.level] || "#3B82F6"}>{g.level}</Badge>
                        </div>
                        <ChevronRight size={13} className="text-gray-300 group-hover:text-blue-400 transition-colors shrink-0" />
                      </div>
                    ))}
                    <button onClick={() => setActiveTab("tasks")}
                      className="w-full py-2.5 rounded-xl text-[9.5px] font-black uppercase tracking-widest text-blue-600 border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-all">
                      Browse All Gigs →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ═══════════════ CHATS ═══════════════ */}
              {activeTab === "messages" && (
                <motion.div key="messages" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <SectionHead label="Messages" sub="Platform notifications and system updates" />
                    <Badge color="#3B82F6">{messages.filter(m => m.unread).length} unread</Badge>
                  </div>

                  <div className="space-y-2">
                    {messages.map((m, i) => (
                      <div key={i} onClick={() => setExpandedMsg(expandedMsg === i ? null : i)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${m.unread ? "bg-blue-50 border-blue-100 shadow-sm" : "bg-white border-gray-100"} hover:border-blue-200`}>
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-base shrink-0">{m.avatar}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                              <div className="flex items-center gap-1.5">
                                <p className="text-[10.5px] font-black text-gray-900">{m.sender}</p>
                                {m.unread && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                              </div>
                              <span className="text-[8.5px] text-gray-400 font-medium shrink-0">{m.time}</span>
                            </div>
                            <p className={`text-[9.5px] text-gray-500 font-medium leading-relaxed ${expandedMsg === i ? "" : "line-clamp-2"}`}>{m.body}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-5 rounded-2xl border border-dashed border-gray-200 text-center">
                    <MessageSquare size={22} className="mx-auto mb-2 text-gray-300" />
                    <p className="text-[11px] font-black text-gray-700">Client messages appear here</p>
                    <p className="text-[9.5px] text-gray-400 font-medium mt-0.5 max-w-xs mx-auto leading-relaxed">
                      Once you start a freelance gig, your direct client channel opens here automatically.
                    </p>
                    <button onClick={() => setActiveTab("tasks")}
                      className="mt-3 px-4 py-2 rounded-xl text-[9.5px] font-bold text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-all">
                      Browse Gigs →
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ═══════════════ STATS ═══════════════ */}
              {activeTab === "analytics" && (
                <motion.div key="analytics" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }} className="space-y-4">
                  <SectionHead label="My Stats" sub="Performance overview and earnings analytics" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <StatCard label="Success Rate" value="0%" icon={<CheckCircle2 size={13} />} color="#10B981" />
                    <StatCard label="Gigs Done" value="0" icon={<Briefcase size={13} />} color="#3B82F6" />
                    <StatCard label="Total Earned" value={fmt(0)} icon={<DollarSign size={13} />} color="#F59E0B" />
                    <StatCard label="Avg Rating" value="—" icon={<Star size={13} />} color="#8B5CF6" />
                  </div>

                  <PremiumLockedSection
                    title="Stats Unlock After First Gig"
                    description="Earnings charts, completion rate, client ratings, and skill analytics appear here after you complete your first gig on Nexus."
                    icon={<BarChart3 size={24} />}
                    cta="Start Your First Gig"
                    onCta={() => setActiveTab("tasks")}
                    features={["Earnings chart", "Win rate", "Client ratings", "Skill breakdown"]}
                  />

                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-lg bg-green-50 flex items-center justify-center"><TrendingUp size={12} className="text-green-600" /></div>
                      <span className="text-[10.5px] font-black text-gray-800">Your Earning Potential</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { pack: "Starter ($3)", potential: "$1,200", color: "#10B981" },
                        { pack: "Basic ($6)", potential: "$4,800", color: "#3B82F6" },
                        { pack: "Pro ($12)", potential: "$22,000", color: "#8B5CF6" },
                        { pack: "Pro Uplink ($20)", potential: "$50,000+", color: "#EF4444" },
                      ].map((item, i) => (
                        <div key={i} className="p-3 rounded-xl border border-gray-100 bg-gray-50">
                          <p className="text-[8px] font-bold text-gray-400 mb-0.5">{item.pack}</p>
                          <p className="text-[14px] font-black leading-none" style={{ color: item.color }}>{item.potential}</p>
                          <p className="text-[7.5px] text-gray-400 mt-0.5">potential earnings</p>
                        </div>
                      ))}
                    </div>
                    <button onClick={openRefill} className="mt-3 w-full py-2.5 rounded-xl text-[9.5px] font-black uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm">
                      Buy HU & Start Earning →
                    </button>
                  </Card>
                </motion.div>
              )}

              {/* ═══════════════ HELP ═══════════════ */}
              {activeTab === "support" && (
                <motion.div key="support" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }} className="max-w-lg mx-auto space-y-4">
                  <SectionHead label="Help Center" sub="Worldwide support, 24/7" />

                  <div className="p-3.5 rounded-xl border border-green-200 bg-green-50 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-xl bg-green-600 flex items-center justify-center shrink-0"><CheckCircle size={13} className="text-white" /></div>
                    <div className="flex-1">
                      <p className="text-[10.5px] font-black text-green-800">All Systems Running Normally</p>
                      <p className="text-[8.5px] text-green-600 font-medium">Platform · Payments · Gigs · Wallet — all operational</p>
                    </div>
                    <Badge color="#10B981"><PulseDot color="#10B981" size={5} /> 99.9%</Badge>
                  </div>

                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center"><HelpCircle size={12} className="text-indigo-600" /></div>
                      <span className="text-[10.5px] font-black text-gray-800">Frequently Asked Questions</span>
                    </div>
                    <div className="space-y-1.5">
                      {faqItems.map((item, i) => (
                        <div key={i} onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                          className="p-3.5 bg-indigo-50 border border-indigo-100 rounded-xl cursor-pointer hover:border-indigo-200 transition-all">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-[10.5px] font-bold text-indigo-900">{item.q}</p>
                            <ChevronDown size={11} className={`text-indigo-400 shrink-0 transition-transform ${expandedFaq === i ? "rotate-180" : ""}`} />
                          </div>
                          <AnimatePresence>
                            {expandedFaq === i && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                                <p className="text-[10px] text-indigo-700 leading-relaxed mt-2.5 pt-2.5 border-t border-indigo-200">{item.a}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                    <button onClick={openRefill}
                      className="mt-4 w-full py-3 rounded-xl text-[9.5px] font-black uppercase tracking-widest text-white hover:opacity-90 shadow-sm"
                      style={{ background: "linear-gradient(135deg, #4F46E5, #0055FF)" }}>
                      Buy HU — Unlock Gigs Now →
                    </button>
                  </Card>

                  <Card className="p-4 space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-[0.12em] text-gray-400 mb-2">Contact Support</p>
                    {[
                      { label: "Email Us", value: "support@nexusgigs.me", icon: <Mail size={14} />, sub: "We reply within 2 hours", color: "#3B82F6", action: () => window.location.href = "mailto:support@nexusgigs.me" },
                      { label: "Chat on WhatsApp", value: "Tap to open WhatsApp", icon: <MessageCircle size={14} />, sub: "Mon–Fri · Available globally", color: "#25D366", action: () => window.open("https://wa.me/254113637325", "_blank") },
                      { label: "Live Chat", value: "Coming Soon", icon: <MessageSquare size={14} />, sub: "In-app · Under development", color: "#8B5CF6", action: undefined },
                    ].map((item, i) => (
                      <div key={i} onClick={item.action}
                        className={`p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3 ${item.action ? "cursor-pointer hover:border-blue-200 hover:bg-blue-50" : "opacity-50"} transition-all`}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${item.color}12`, color: item.color }}>{item.icon}</div>
                        <div className="flex-1">
                          <p className="text-[10.5px] font-black text-gray-900">{item.label}</p>
                          <p className="text-[8.5px] text-gray-400 font-medium mt-0.5">{item.sub}</p>
                        </div>
                        {item.action && <ChevronRight size={12} className="text-gray-400 shrink-0" />}
                      </div>
                    ))}
                  </Card>
                </motion.div>
              )}

              {/* ═══════════════ ME / PROFILE ═══════════════ */}
              {activeTab === "me" && (
                <motion.div key="me" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }} className="space-y-4">
                  <SectionHead label="My Profile" sub="Account, security, and preferences" />

                  <div className="rounded-2xl border border-gray-100 p-5 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)" }}>
                    <div className="absolute right-0 top-0 w-40 h-40 rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, #0055FF, transparent)", transform: "translate(30%,-30%)" }} />
                    <div className="flex items-start gap-4">
                      <div className="relative shrink-0">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg"
                          style={{ background: "linear-gradient(135deg, #0055FF, #8B5CF6)" }}>
                          {(user?.firstName?.[0] || "U").toUpperCase()}
                        </div>
                        {isVerified && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center shadow-sm">
                            <Check size={8} className="text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <h3 className="text-[16px] font-black text-gray-900 leading-none">
                            {`${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Freelancer"}
                          </h3>
                          {isVerified
                            ? <Badge color="#10B981"><BadgeCheck size={8} /> Verified</Badge>
                            : <Badge color="#F59E0B"><AlertCircle size={8} /> Unverified</Badge>
                          }
                        </div>
                        <p className="text-[9px] text-gray-400 font-medium mb-1.5">{user?.primaryEmailAddress?.emailAddress || "—"}</p>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Badge color="#3B82F6"><Globe size={7} /> {profileLocation}</Badge>
                          <Badge color="#8B5CF6"><Zap size={7} /> {profileAvailability}</Badge>
                        </div>

                        {editingProfile ? (
                          <div className="mt-3 space-y-2.5">
                            {[
                              { label: "Bio", el: <textarea value={profileBio} onChange={e => setProfileBio(e.target.value)} rows={2} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-[10.5px] text-gray-700 outline-none focus:border-blue-400 resize-none transition-all" /> },
                              { label: "Location", el: <input value={profileLocation} onChange={e => setProfileLocation(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-[10.5px] text-gray-700 outline-none focus:border-blue-400 transition-all" /> },
                              { label: "Hourly Rate", el: <input value={profileRate} onChange={e => setProfileRate(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-[10.5px] text-gray-700 outline-none focus:border-blue-400 transition-all" /> },
                              { label: "Skills (comma separated)", el: <input value={profileSkills.join(", ")} onChange={e => setProfileSkills(e.target.value.split(",").map(s => s.trim()).filter(Boolean))} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-[10.5px] text-gray-700 outline-none focus:border-blue-400 transition-all" /> },
                            ].map((row, i) => (
                              <div key={i}>
                                <label className="text-[8px] font-bold text-gray-400 uppercase tracking-wide mb-0.5 block">{row.label}</label>
                                {row.el}
                              </div>
                            ))}
                            <RippleButton onClick={() => { setEditingProfile(false); addToast("Profile updated!", "success"); }}
                              className="w-full py-2.5 rounded-xl text-[9.5px] font-black uppercase tracking-widest text-white shadow-sm"
                              style={{ background: "linear-gradient(135deg, #0055FF, #0041CC)" }}>
                              Save Profile
                            </RippleButton>
                          </div>
                        ) : (
                          <div className="mt-2">
                            <p className="text-[10px] text-gray-500 leading-relaxed">{profileBio}</p>
                            <div className="flex gap-1 flex-wrap mt-2">
                              {profileSkills.map((skill, i) => (
                                <span key={i} className="px-2 py-0.5 rounded-full text-[8.5px] font-bold bg-blue-50 text-blue-600 border border-blue-100">{skill}</span>
                              ))}
                            </div>
                            <button onClick={() => setEditingProfile(true)} className="mt-2 text-[9px] font-bold text-blue-500 hover:text-blue-700 flex items-center gap-1">
                              <Edit3 size={9} /> Edit Profile
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {!isVerified && (
                    <div className="p-4 rounded-xl border border-amber-200" style={{ background: "linear-gradient(135deg, #FFFBEB, #FFF7ED)" }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <UserCheck size={13} className="text-amber-600" />
                          <span className="text-[10.5px] font-black text-amber-800">Profile Completion</span>
                        </div>
                        <span className="text-[12px] font-black text-amber-600">45%</span>
                      </div>
                      <div className="h-1.5 bg-amber-100 rounded-full overflow-hidden mb-2">
                        <motion.div initial={{ width: 0 }} animate={{ width: "45%" }} transition={{ delay: 0.3, duration: 0.8 }}
                          className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #F59E0B, #EF4444)" }} />
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { label: "Email verified", done: true },
                          { label: "Profile photo", done: false },
                          { label: "ID verification", done: false },
                          { label: "Phone number", done: false },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${item.done ? "bg-green-500" : "bg-gray-200"}`}>
                              {item.done ? <Check size={7} className="text-white" /> : <X size={7} className="text-gray-400" />}
                            </div>
                            <span className={`text-[8.5px] font-semibold ${item.done ? "text-gray-700" : "text-gray-400"}`}>{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-4 gap-2">
                    <StatCard label="HU Balance" value={huBalance} icon={<Zap size={12} />} color="#3B82F6" />
                    <StatCard label="Gigs Done" value="0" icon={<CheckSquare size={12} />} color="#10B981" />
                    <StatCard label="Earned" value={fmt(0)} icon={<DollarSign size={12} />} color="#F59E0B" />
                    <StatCard label="Rating" value="—" icon={<Star size={12} />} color="#8B5CF6" />
                  </div>

                  <div className="flex gap-1 p-1 rounded-xl border border-gray-200 bg-white overflow-x-auto no-scrollbar shadow-sm">
                    {([
                      { id: "profile" as ProfileTab, label: "Profile", icon: <User size={10} /> },
                      { id: "security" as ProfileTab, label: "Security", icon: <Shield size={10} /> },
                      { id: "notifications" as ProfileTab, label: "Alerts", icon: <Bell size={10} /> },
                      { id: "achievements" as ProfileTab, label: "Badges", icon: <Trophy size={10} /> },
                      { id: "settings" as ProfileTab, label: "Settings", icon: <Settings size={10} /> },
                    ]).map(t => (
                      <button key={t.id} onClick={() => setActiveProfileTab(t.id)}
                        className={`shrink-0 flex items-center gap-1 px-3.5 py-2 rounded-lg text-[9.5px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeProfileTab === t.id ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-800"}`}>
                        {t.icon} {t.label}
                      </button>
                    ))}
                  </div>

                  {activeProfileTab === "profile" && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                      <Card className="p-4">
                        <p className="text-[8.5px] font-black uppercase tracking-[0.12em] text-gray-400 mb-3">Account Info</p>
                        <div className="space-y-0.5">
                          {[
                            { label: "Display Name", value: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "—", icon: <User size={12} />, color: "#3B82F6" },
                            { label: "Email", value: user?.primaryEmailAddress?.emailAddress || "—", icon: <Mail size={12} />, color: "#10B981" },
                            { label: "Account Type", value: "Freelancer · Global", icon: <Briefcase size={12} />, color: "#8B5CF6" },
                            { label: "HU Balance", value: `${huBalance} HU`, icon: <Zap size={12} />, color: "#0055FF" },
                            { label: "Cash Balance", value: fmt(cashBalance), icon: <DollarSign size={12} />, color: "#10B981" },
                            { label: "Hourly Rate", value: profileRate, icon: <TrendingUp size={12} />, color: "#EF4444" },
                            { label: "Location", value: profileLocation, icon: <MapPin size={12} />, color: "#06B6D4" },
                          ].map((row, i) => (
                            <div key={i} className="flex items-center gap-2.5 py-2.5 border-b border-gray-50 last:border-0">
                              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${row.color}12`, color: row.color }}>{row.icon}</div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[7.5px] font-bold text-gray-400 uppercase tracking-wide">{row.label}</p>
                                <p className="text-[10.5px] font-black text-gray-900 mt-0.5 break-all">{row.value}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>

                      <Card className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-[8.5px] font-black uppercase tracking-[0.12em] text-gray-400">My Skills</p>
                          <button onClick={() => setEditingProfile(true)} className="text-[8.5px] font-bold text-blue-500 flex items-center gap-0.5"><Edit3 size={8} /> Edit</button>
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                          {profileSkills.map((skill, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-xl text-[9.5px] font-bold bg-blue-50 text-blue-700 border border-blue-100">{skill}</span>
                          ))}
                        </div>
                      </Card>
                    </motion.div>
                  )}

                  {activeProfileTab === "security" && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                      <div className="p-4 rounded-2xl border border-blue-100" style={{ background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)" }}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center"><Shield size={13} className="text-white" /></div>
                            <span className="text-[11px] font-black text-blue-900">Security Score</span>
                          </div>
                          <span className="text-[18px] font-black text-blue-600">40<span className="text-[11px] text-blue-400">/100</span></span>
                        </div>
                        <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden mb-1">
                          <motion.div initial={{ width: 0 }} animate={{ width: "40%" }} transition={{ delay: 0.2, duration: 0.8 }}
                            className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #3B82F6, #0055FF)" }} />
                        </div>
                        <p className="text-[8.5px] text-blue-500 font-medium">Enable 2FA to boost score to 80+</p>
                      </div>

                      <Card className="p-4">
                        <p className="text-[8.5px] font-black uppercase tracking-[0.12em] text-gray-400 mb-2">Security Settings</p>
                        <ToggleRow
                          label="Two-Factor Authentication"
                          sub={twoFAEnabled ? "Your account is protected" : "Strongly recommended"}
                          value={twoFAEnabled}
                          onChange={() => { setTwoFAEnabled(v => !v); addToast(twoFAEnabled ? "2FA disabled" : "2FA enabled!", twoFAEnabled ? "info" : "success"); }}
                          icon={<Fingerprint size={12} />}
                          color="#10B981"
                        />
                      </Card>

                      <Card className="p-4">
                        <p className="text-[8.5px] font-black uppercase tracking-[0.12em] text-gray-400 mb-3">Active Sessions</p>
                        <div className="space-y-2">
                          {sessions.map((s, i) => (
                            <div key={i} className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all ${revokedSession.includes(i) ? "opacity-40 bg-gray-50 border-gray-100" : s.current ? "bg-green-50 border-green-100" : "bg-gray-50 border-gray-100"}`}>
                              <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                                <Smartphone size={13} className="text-gray-500" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-1.5">
                                  <p className="text-[10px] font-black text-gray-900">{s.device}</p>
                                  {s.current && <Badge color="#10B981">Current</Badge>}
                                </div>
                                <p className="text-[8.5px] text-gray-400 font-medium">{s.location} · {s.last}</p>
                              </div>
                              {!s.current && !revokedSession.includes(i) && (
                                <button onClick={() => { setRevokedSession(r => [...r, i]); addToast("Session revoked", "success"); }}
                                  className="px-2.5 py-1 rounded-lg border border-red-200 bg-red-50 text-[8.5px] font-bold text-red-600 hover:bg-red-100 transition-all">
                                  Revoke
                                </button>
                              )}
                              {revokedSession.includes(i) && <span className="text-[8.5px] font-bold text-gray-400">Revoked</span>}
                            </div>
                          ))}
                        </div>
                      </Card>

                      <Card className="p-4">
                        <p className="text-[8.5px] font-black uppercase tracking-[0.12em] text-gray-400 mb-1.5">API Access</p>
                        <p className="text-[9.5px] text-gray-500 font-medium mb-3">Generate an API key to connect external tools to Nexus.</p>
                        {generatedApiKey ? (
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-mono text-[9.5px] text-gray-600 truncate">
                                {showApiKey ? generatedApiKey : "••••••••••••••••••••••••••••••••"}
                              </div>
                              <button onClick={() => setShowApiKey(v => !v)} className="p-2.5 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 transition-all">
                                {showApiKey ? <EyeOff size={12} className="text-gray-500" /> : <Eye size={12} className="text-gray-500" />}
                              </button>
                              <button onClick={() => { navigator.clipboard.writeText(generatedApiKey); setCopiedKey(true); addToast("API key copied!", "success"); setTimeout(() => setCopiedKey(false), 2000); }}
                                className="p-2.5 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 transition-all">
                                {copiedKey ? <Check size={12} className="text-green-500" /> : <Copy size={12} className="text-gray-500" />}
                              </button>
                            </div>
                            <button onClick={() => { setGeneratedApiKey(null); addToast("API key revoked", "info"); }} className="text-[9.5px] font-bold text-red-500 hover:text-red-700 transition-all">
                              Revoke Key
                            </button>
                          </div>
                        ) : (
                          <RippleButton onClick={() => { const key = "nxs_" + Math.random().toString(36).substr(2, 32); setGeneratedApiKey(key); addToast("API key generated!", "success"); }}
                            className="w-full py-2.5 rounded-xl text-[9.5px] font-black uppercase tracking-widest border border-blue-200 text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-1.5">
                            <Key size={11} /> Generate API Key
                          </RippleButton>
                        )}
                      </Card>
                    </motion.div>
                  )}

                  {activeProfileTab === "notifications" && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                      <Card className="p-4">
                        <p className="text-[8.5px] font-black uppercase tracking-[0.12em] text-gray-400 mb-1">Notification Preferences</p>
                        <ToggleRow label="New Gig Alerts" sub="When matching gigs are posted" value={notifications.newGigs} onChange={() => setNotifications(n => ({ ...n, newGigs: !n.newGigs }))} icon={<Briefcase size={12} />} color="#3B82F6" />
                        <ToggleRow label="Payment Updates" sub="Confirmations, withdrawals, HU credits" value={notifications.payments} onChange={() => setNotifications(n => ({ ...n, payments: !n.payments }))} icon={<DollarSign size={12} />} color="#10B981" />
                        <ToggleRow label="Mission Alerts" sub="Status changes on active gigs" value={notifications.missions} onChange={() => setNotifications(n => ({ ...n, missions: !n.missions }))} icon={<Target size={12} />} color="#8B5CF6" />
                        <ToggleRow label="Message Alerts" sub="Client messages and announcements" value={notifications.messages} onChange={() => setNotifications(n => ({ ...n, messages: !n.messages }))} icon={<MessageSquare size={12} />} color="#F59E0B" />
                        <ToggleRow label="Weekly Summary" sub="Performance digest every Monday" value={notifications.weekly} onChange={() => setNotifications(n => ({ ...n, weekly: !n.weekly }))} icon={<BarChart3 size={12} />} color="#06B6D4" />
                      </Card>
                    </motion.div>
                  )}

                  {activeProfileTab === "achievements" && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        {achievements.map(ach => (
                          <div key={ach.id} className={`p-3.5 rounded-2xl border flex items-start gap-2.5 transition-all ${ach.earned ? "bg-white border-gray-100 shadow-sm" : "bg-gray-50 border-gray-100 opacity-50"}`}>
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                              style={{ backgroundColor: ach.earned ? `${ach.color}12` : "#F3F4F6", color: ach.earned ? ach.color : "#9CA3AF" }}>
                              {ach.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1 flex-wrap">
                                <p className="text-[10.5px] font-black text-gray-900">{ach.title}</p>
                                {ach.earned && <Check size={8} className="text-green-500" />}
                              </div>
                              <p className="text-[8.5px] text-gray-400 font-medium mt-0.5">{ach.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 rounded-2xl border border-blue-100 bg-blue-50 text-center">
                        <Trophy size={16} className="mx-auto text-blue-500 mb-1.5" />
                        <p className="text-[10.5px] font-black text-gray-800">{achievements.filter(a => a.earned).length} of {achievements.length} badges earned</p>
                        <p className="text-[8.5px] text-gray-400 font-medium mt-0.5">Purchase HU and start gigs to unlock more</p>
                        <button onClick={openRefill} className="mt-2.5 px-4 py-1.5 rounded-xl text-[9.5px] font-bold text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 transition-all">
                          Unlock Gigs →
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {activeProfileTab === "settings" && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                      <Card className="p-4">
                        <p className="text-[8.5px] font-black uppercase tracking-[0.12em] text-gray-400 mb-3">App Settings</p>
                        <div className="space-y-0.5">
                          {[
                            {
                              icon: <Languages size={12} />, color: "#3B82F6", label: "Language", sub: "Display language",
                              el: <select value={selectedLang} onChange={e => { setSelectedLang(e.target.value); addToast("Language updated", "success"); }} className="text-[9.5px] font-bold text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none cursor-pointer">
                                <option>English</option><option>Français</option><option>Español</option><option>Deutsch</option><option>Swahili</option><option>Arabic</option>
                              </select>
                            },
                            {
                              icon: <DollarSign size={12} />, color: "#10B981", label: "Currency", sub: "Display currency",
                              el: <select value={currency} onChange={e => setCurrency(e.target.value as typeof currency)} className="text-[9.5px] font-bold text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none cursor-pointer">
                                <option value="USD">USD ($)</option><option value="EUR">EUR (€)</option><option value="GBP">GBP (£)</option><option value="KES">KES</option>
                              </select>
                            },
                            {
                              icon: <Globe size={12} />, color: "#8B5CF6", label: "Availability", sub: "Visible to clients",
                              el: <select value={profileAvailability} onChange={e => { setProfileAvailability(e.target.value); addToast("Availability updated", "success"); }} className="text-[9.5px] font-bold text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none cursor-pointer">
                                <option>Available Now</option><option>Part-time Only</option><option>Unavailable</option>
                              </select>
                            },
                          ].map((row, i) => (
                            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${row.color}12`, color: row.color }}>{row.icon}</div>
                                <div>
                                  <p className="text-[10.5px] font-bold text-gray-800">{row.label}</p>
                                  <p className="text-[8.5px] text-gray-400 font-medium">{row.sub}</p>
                                </div>
                              </div>
                              {row.el}
                            </div>
                          ))}
                        </div>
                      </Card>

                      <Card className="p-4">
                        <p className="text-[8.5px] font-black uppercase tracking-[0.12em] text-gray-400 mb-3">Account Actions</p>
                        <div className="space-y-2">
                          <button onClick={() => addToast("Data export requested — email sent within 24h", "info")}
                            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all flex items-center gap-2.5 text-left">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0"><Download size={12} className="text-blue-600" /></div>
                            <div>
                              <p className="text-[10.5px] font-bold text-gray-700">Export My Data</p>
                              <p className="text-[8.5px] text-gray-400 font-medium">Download all account data (GDPR)</p>
                            </div>
                          </button>
                          <button onClick={() => addToast("Account deletion requires identity verification", "error")}
                            className="w-full p-3 rounded-xl border border-red-100 bg-red-50 hover:bg-red-100 transition-all flex items-center gap-2.5 text-left">
                            <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center shrink-0"><Trash2 size={12} className="text-red-500" /></div>
                            <div>
                              <p className="text-[10.5px] font-bold text-red-600">Delete Account</p>
                              <p className="text-[8.5px] text-red-400 font-medium">Permanently remove your account</p>
                            </div>
                          </button>
                        </div>
                      </Card>

                      <SignOutButton>
                        <button className="w-full py-3.5 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition-all flex items-center justify-center gap-2.5 group shadow-sm">
                          <LogOut size={14} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                          <span className="text-[10.5px] font-black text-gray-500 group-hover:text-red-500 transition-colors uppercase tracking-widest">Sign Out</span>
                        </button>
                      </SignOutButton>
                    </motion.div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* ═══════════════ BOTTOM NAV ═══════════════ */}
          <div className="fixed bottom-0 left-0 right-0 z-100 border-t border-gray-100"
            style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(16px)", boxShadow: "0 -4px 24px rgba(0,0,0,0.06)" }}>
            <div className="max-w-5xl mx-auto flex items-center justify-around px-1 overflow-x-auto no-scrollbar" style={{ height: 64 }}>
              {navItems.map(item => (
                <button key={item.id} onClick={() => setActiveTab(item.id)}
                  className={`flex flex-col items-center justify-center gap-0.5 h-full flex-1 min-w-13 transition-all duration-200 relative ${activeTab === item.id ? "text-blue-600" : "text-gray-400 hover:text-gray-600"}`}>
                  {activeTab === item.id && (
                    <motion.span layoutId="nav-indicator"
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-b-full bg-blue-600" />
                  )}
                  <div className={`transition-all duration-200 ${activeTab === item.id ? "scale-110" : "scale-100"}`}>{item.icon}</div>
                  <span className={`text-[7.5px] font-bold uppercase tracking-widest leading-none ${activeTab === item.id ? "text-blue-600" : "text-gray-400"}`}>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ═══════════════ REFILL MODAL ═══════════════ */}
          <AnimatePresence>
            {showModal && (
              <div className="fixed inset-0 z-600 flex items-end sm:items-center justify-center p-3">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/55" style={{ backdropFilter: "blur(8px)" }}
                  onClick={() => !isPaying && setShowModal(false)} />

                <motion.div initial={{ scale: 0.93, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.93, y: 24 }}
                  transition={{ type: "spring", damping: 26, stiffness: 320 }}
                  className="relative w-full max-w-sm bg-white border border-gray-200 rounded-3xl p-5 shadow-2xl overflow-hidden max-h-[94vh] overflow-y-auto no-scrollbar">

                  {modalStep === "packages" && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-[18px] font-black text-gray-900 leading-none">Unlock Gigs Instantly</h3>
                          <p className="text-[10px] text-gray-400 font-medium mt-0.5">One purchase → all matching freelance gigs unlock immediately.</p>
                        </div>
                        <button onClick={() => setShowModal(false)} className="p-1.5 bg-gray-100 rounded-xl text-gray-500 hover:bg-gray-200 transition-all"><X size={14} /></button>
                      </div>

                      <div className="p-3 rounded-xl border border-green-200 bg-green-50 flex items-center gap-2">
                        <CheckCircle2 size={12} className="text-green-600 shrink-0" />
                        <p className="text-[9.5px] font-semibold text-green-800 leading-relaxed">
                          <strong>Payment confirmed = gigs unlocked.</strong> Start working in minutes — no applications, no waiting.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: "Avg ROI on $3", value: "400×", sub: "Starter pack" },
                          { label: "Top earner", value: "$50K+", sub: "Pro Uplink users" },
                        ].map((s, i) => (
                          <div key={i} className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-center">
                            <p className="text-[18px] font-black text-blue-700 leading-none">{s.value}</p>
                            <p className="text-[8px] font-bold text-blue-500 mt-0.5">{s.label}</p>
                            <p className="text-[7.5px] text-gray-400 font-medium">{s.sub}</p>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2.5">
                        {uplinkPackages.map(pack => (
                          <div key={pack.id} onClick={() => { setSelectedPack(pack); setModalStep("choice"); setAgreed(false); }}
                            className={`relative p-3.5 rounded-2xl border cursor-pointer transition-all hover:shadow-lg active:scale-[0.98] ${pack.highlight ? "border-slate-300 bg-slate-50 shadow-md ring-2 ring-purple-200" : "bg-white border-gray-200 hover:border-gray-300"}`}
                            style={{ borderLeft: `4px solid ${pack.color}` }}>
                            {pack.hot && (
                              <div className="absolute -top-2.5 right-3 px-2.5 py-0.5 rounded-full text-[8px] font-black text-white shadow-sm"
                                style={{ backgroundColor: pack.color }}>
                                ⭐ MOST POPULAR
                              </div>
                            )}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${pack.color}15`, color: pack.color }}>
                                  <Zap size={15} />
                                </div>
                                <div>
                                  <p className="text-[12px] font-black text-gray-900">{pack.name}</p>
                                  <p className="text-[8.5px] font-bold text-gray-400">{pack.hu.toLocaleString()} HU</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-[20px] font-black leading-none" style={{ color: pack.color }}>${pack.price}</p>
                                <p className="text-[8px] text-gray-400 font-medium">one-time</p>
                              </div>
                            </div>
                            <p className="text-[9.5px] text-gray-500 font-medium mb-2">{pack.desc}</p>
                            <div className="flex flex-wrap gap-1">
                              {pack.perks.map((perk, pi) => (
                                <div key={pi} className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[7.5px] font-semibold bg-gray-100 text-gray-600">
                                  <Check size={6} /> {perk}
                                </div>
                              ))}
                            </div>
                            <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                              <p className="text-[8px] font-bold text-gray-400">{pack.access}</p>
                              <p className="text-[8.5px] font-black" style={{ color: pack.color }}>{pack.roi}</p>
                            </div>
                            <div className="mt-2 flex items-center justify-center gap-1 text-gray-400">
                              <span className="text-[8.5px] font-bold text-gray-500">Tap to select →</span>
                              <ChevronRight size={11} className="text-gray-400" />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                        <ShieldCheck size={11} className="text-gray-400 shrink-0" />
                        <p className="text-[8.5px] text-gray-500 font-medium">PCI-DSS enabled · Instant HU credit · Encrypted payment</p>
                      </div>
                    </div>
                  )}

                  {modalStep === "choice" && selectedPack && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5">
                        <button onClick={() => setModalStep("packages")} className="p-1.5 bg-gray-100 rounded-xl text-gray-500 hover:bg-gray-200 transition-all"><ChevronLeft size={13} /></button>
                        <div>
                          <h4 className="text-[12px] font-black text-gray-900">Choose Payment Method</h4>
                          <p className="text-[9.5px] text-gray-400 font-medium mt-0.5">
                            {selectedPack.name} · {selectedPack.hu} HU · <span className="font-black" style={{ color: selectedPack.color }}>${selectedPack.price}.00</span>
                          </p>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl border border-green-200 bg-green-50">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Zap size={11} className="text-green-600 shrink-0" fill="#10B981" />
                          <p className="text-[9.5px] font-black text-green-900">After payment — you get immediately:</p>
                        </div>
                        <div className="space-y-1">
                          {[
                            `${selectedPack.hu} HU credited instantly`,
                            selectedPack.access + " — all unlocked",
                            "Start any gig in under 60 seconds",
                          ].map((item, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                              <CheckCircle size={9} className="text-green-500 shrink-0" />
                              <p className="text-[9px] font-semibold text-green-800">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <RippleButton onClick={() => setModalStep("card")}
                          className="w-full p-4 rounded-2xl border-2 border-cyan-300 bg-cyan-50 hover:bg-cyan-100 transition-all flex items-center gap-3 shadow-sm">
                          <PaystackLogo size={40} />
                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="text-[12px] font-black text-gray-900">Pay by Card</p>
                              <Badge color="#00C3F7">Recommended</Badge>
                            </div>
                            <p className="text-[9px] font-medium text-gray-600">Visa / Mastercard · ${selectedPack.price}.00 · Worldwide</p>
                            <div className="flex items-center gap-1.5 mt-1"><VisaIcon /><MastercardIcon /></div>
                          </div>
                          <ChevronRight size={14} className="text-gray-400 shrink-0" />
                        </RippleButton>

                        <RippleButton onClick={() => setModalStep("binance")}
                          className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 hover:bg-yellow-50 hover:border-yellow-200 transition-all flex items-center gap-3">
                          <BinanceLogo size={40} />
                          <div className="flex-1 text-left">
                            <p className="text-[12px] font-black text-gray-900">Binance Pay</p>
                            <p className="text-[9px] font-medium text-gray-500">USDT (TRC20 / ERC20) · ${selectedPack.price}.00 · Instant</p>
                          </div>
                          <ChevronRight size={14} className="text-gray-400 shrink-0" />
                        </RippleButton>

                        <RippleButton onClick={() => setModalStep("mpesa")}
                          className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 hover:bg-green-50 hover:border-green-200 transition-all flex items-center gap-3">
                          <MpesaLogoSVG size={40} />
                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-2">
                              <p className="text-[12px] font-black text-gray-900">M-Pesa</p>
                              <Badge color="#16A34A">East Africa</Badge>
                            </div>
                            <p className="text-[9px] font-medium text-gray-500">STK Push · KES {selectedPack.price * 130} · Instant</p>
                          </div>
                          <ChevronRight size={14} className="text-gray-400 shrink-0" />
                        </RippleButton>
                      </div>

                      <div className="flex items-start gap-2">
                        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} id="terms-agree" className="mt-0.5 accent-blue-600 shrink-0" />
                        <label htmlFor="terms-agree" className="text-[8.5px] text-gray-400 font-medium leading-relaxed cursor-pointer">
                          I agree to the Nexus Terms of Service. HU credits are non-refundable once gig access is granted.
                        </label>
                      </div>
                    </div>
                  )}

                  {modalStep === "card" && selectedPack && (
                    <div className="space-y-3.5">
                      <div className="flex items-center gap-2.5">
                        <button onClick={() => setModalStep("choice")} className="p-1.5 bg-gray-100 rounded-xl text-gray-500 hover:bg-gray-200 transition-all"><ChevronLeft size={13} /></button>
                        <div>
                          <h4 className="text-[12px] font-black text-gray-900">Secure Card Payment</h4>
                          <p className="text-[9px] text-gray-400 font-medium">Visa & Mastercard · Worldwide · Powered by Paystack</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl border border-gray-100 shadow-sm" style={{ background: "linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)" }}>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Total</p>
                            <p className="text-[30px] font-black text-gray-900 leading-none">${selectedPack.price}<span className="text-[14px] text-gray-400 font-bold"> USD</span></p>
                            <p className="text-[9px] text-blue-600 font-bold mt-0.5">≈ KES {(selectedPack.price * 130).toLocaleString()} on statement</p>
                          </div>
                          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${selectedPack.color}12`, color: selectedPack.color }}>
                            <Zap size={22} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-white p-2 rounded-xl border border-gray-100">
                            <p className="text-[7.5px] text-gray-400 font-bold uppercase mb-0.5">Package</p>
                            <p className="text-[10.5px] font-black text-gray-900">{selectedPack.name}</p>
                          </div>
                          <div className="bg-white p-2 rounded-xl border border-gray-100">
                            <p className="text-[7.5px] text-gray-400 font-bold uppercase mb-0.5">You receive</p>
                            <p className="text-[10.5px] font-black" style={{ color: selectedPack.color }}>{selectedPack.hu} HU</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl border border-green-100" style={{ background: "linear-gradient(135deg, #ECFDF5, #F0FDF4)" }}>
                        <div className="flex items-center gap-1.5 mb-1.5"><CheckCircle2 size={11} className="text-green-600" /><p className="text-[9.5px] font-black text-green-900">After payment clears:</p></div>
                        {[`${selectedPack.hu} HU credited instantly`, `${selectedPack.access} — unlocked`, "Start any matching gig with zero wait"].map((item, i) => (
                          <div key={i} className="flex items-center gap-1.5 mb-1">
                            <div className="w-3.5 h-3.5 rounded-full bg-green-500 flex items-center justify-center shrink-0"><Check size={7} className="text-white" /></div>
                            <p className="text-[8.5px] font-semibold text-green-800">{item}</p>
                          </div>
                        ))}
                      </div>

                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Accepted Cards</p>
                          <div className="flex items-center gap-1.5"><VisaIcon /><MastercardIcon /></div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck size={11} className="text-cyan-500 shrink-0" />
                          <p className="text-[8.5px] font-medium text-gray-500">256-bit TLS · PCI-DSS Level 1 · No card data stored</p>
                        </div>
                      </div>

                      {!agreed && (
                        <div className="flex items-start gap-2">
                          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} id="terms-card" className="mt-0.5 accent-blue-600 shrink-0" />
                          <label htmlFor="terms-card" className="text-[8.5px] text-gray-400 font-medium leading-relaxed cursor-pointer">
                            I agree to the Nexus Terms of Service. HU credits are non-refundable once gig access is granted.
                          </label>
                        </div>
                      )}

                      <RippleButton disabled={isPaying || !agreed} onClick={() => handlePay("CARD")}
                        className="w-full py-3.5 rounded-xl text-[10.5px] font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 shadow-md"
                        style={{ background: agreed ? "linear-gradient(135deg, #00C3F7, #011B33)" : undefined }}>
                        {isPaying
                          ? <><RefreshCw size={13} className="animate-spin" /> Opening Checkout…</>
                          : <><CreditCard size={13} /> Pay ${selectedPack.price}.00 by Card</>}
                      </RippleButton>
                      <p className="text-center text-[8.5px] text-gray-400 font-medium">Secured by Paystack · We never store your card number</p>
                    </div>
                  )}

                  {modalStep === "binance" && selectedPack && (
                    <div className="space-y-3.5">
                      <div className="flex items-center gap-2.5">
                        <button onClick={() => setModalStep("choice")} className="p-1.5 bg-gray-100 rounded-xl text-gray-500 hover:bg-gray-200 transition-all"><ChevronLeft size={13} /></button>
                        <h4 className="text-[12px] font-black text-gray-900">Binance Pay (Crypto)</h4>
                      </div>

                      <div className="flex gap-2">
                        {(["TRC20", "ERC20"] as const).map(net => (
                          <button key={net} onClick={() => setSelectedCryptoNet(net)}
                            className={`flex-1 py-2 rounded-xl text-[9.5px] font-black border transition-all ${selectedCryptoNet === net ? "bg-yellow-500 text-white border-yellow-500" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                            {net}
                          </button>
                        ))}
                      </div>

                      <div className="bg-gray-50 rounded-2xl p-3 flex justify-center border border-gray-200">
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${BINANCE_WALLETS[selectedCryptoNet]}`} alt="QR Code" className="w-32 h-32 block rounded-xl" />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                          <p className="text-[8px] text-gray-400 font-medium mb-0.5">Amount</p>
                          <p className="text-[14px] font-black text-gray-900">${selectedPack.price}.00 USDT</p>
                        </div>
                        <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                          <p className="text-[8px] text-gray-400 font-medium mb-0.5">Network</p>
                          <p className="text-[14px] font-black text-yellow-600">{selectedCryptoNet}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-[9.5px] font-bold text-gray-500 mb-1.5">Wallet Address ({selectedCryptoNet})</p>
                        <div className="flex gap-2">
                          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-[9.5px] font-mono text-gray-600 truncate">{BINANCE_WALLETS[selectedCryptoNet]}</div>
                          <button onClick={() => copyAddress(BINANCE_WALLETS[selectedCryptoNet])} className="p-2.5 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 transition-all">
                            {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} className="text-gray-500" />}
                          </button>
                        </div>
                      </div>

                      <div className="p-2.5 bg-amber-50 border border-amber-100 rounded-xl">
                        <p className="text-[9.5px] font-bold text-amber-800">⚠️ Send only USDT on {selectedCryptoNet} network</p>
                        <p className="text-[8.5px] text-amber-600 font-medium mt-0.5">Wrong network = permanent loss of funds.</p>
                      </div>

                      <RippleButton onClick={() => handlePay("BINANCE")}
                        className="w-full py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-sm"
                        style={{ background: "linear-gradient(135deg, #F0B90B, #D4921F)" }}>
                        I've Sent Payment — Confirm
                      </RippleButton>
                    </div>
                  )}

                  {modalStep === "mpesa" && selectedPack && (
                    <div className="space-y-3.5">
                      <div className="flex items-center gap-2.5">
                        <button onClick={() => setModalStep("choice")} className="p-1.5 bg-gray-100 rounded-xl text-gray-500 hover:bg-gray-200 transition-all"><ChevronLeft size={13} /></button>
                        <h4 className="text-[12px] font-black text-gray-900">Pay with M-Pesa</h4>
                      </div>

                      <div className="p-3.5 bg-green-50 border border-green-200 rounded-xl">
                        <div className="flex items-center gap-2 mb-0.5">
                          <CheckCircle size={13} className="text-green-500 shrink-0" />
                          <p className="text-[12px] font-black text-green-800">Total: KES {(selectedPack.price * 130).toLocaleString()}</p>
                        </div>
                        <p className="text-[9px] text-green-600 font-medium pl-5">{selectedPack.hu} HU credited instantly after confirmation.</p>
                      </div>

                      <div>
                        <p className="text-[9.5px] font-bold text-gray-600 mb-1.5">Your Safaricom Number</p>
                        <input value={mpesaNum} onChange={e => setMpesaNum(e.target.value)} placeholder="254712345678"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-[16px] font-black text-gray-900 outline-none focus:border-green-400 text-center tracking-widest transition-all placeholder:text-gray-300 focus:bg-white" />
                        <p className="text-[9px] text-gray-400 font-medium mt-1.5 text-center">Format: 254XXXXXXXXX · 12 digits total</p>
                      </div>

                      {!agreed && (
                        <div className="flex items-start gap-2">
                          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} id="terms-mpesa" className="mt-0.5 accent-green-600 shrink-0" />
                          <label htmlFor="terms-mpesa" className="text-[8.5px] text-gray-400 font-medium leading-relaxed cursor-pointer">
                            I agree to the Nexus Terms of Service. HU credits are non-refundable once gig access is granted.
                          </label>
                        </div>
                      )}

                      <RippleButton disabled={isPaying} onClick={() => handlePay("MPESA")}
                        className="w-full py-3.5 rounded-xl text-[10.5px] font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 shadow-sm"
                        style={{ background: "linear-gradient(135deg, #16A34A, #15803D)" }}>
                        {isPaying
                          ? <><RefreshCw size={13} className="animate-spin" /> Sending Prompt…</>
                          : `Pay KES ${(selectedPack.price * 130).toLocaleString()}`}
                      </RippleButton>
                      <p className="text-center text-[8.5px] text-gray-400 font-medium">Kenya · Tanzania · Uganda · Rwanda · Instant STK Push</p>
                    </div>
                  )}

                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        .font-sans { font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; }
      `}</style>
    </div>
  );
};