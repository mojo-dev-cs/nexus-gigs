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
} from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface Toast {
  id: number;
  msg: string;
  type: "success" | "error" | "info";
}

type ModalStep = "packages" | "choice" | "binance" | "paypal" | "mpesa" | "card";
type ProfileTab = "profile" | "security" | "notifications" | "achievements" | "settings";
type VaultTab = "overview" | "history" | "limits" | "referral";

// ─────────────────────────────────────────────
// Primitives
// ─────────────────────────────────────────────
const PulseDot = ({ color = "#0066FF", size = 7 }: { color?: string; size?: number }) => (
  <span className="relative inline-flex" style={{ width: size, height: size }}>
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-30" style={{ backgroundColor: color }} />
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
      className={`relative overflow-hidden select-none transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}>
      {children}
      {ripples.map((r) => (
        <span key={r.id} className="absolute rounded-full bg-white/20 animate-ping pointer-events-none"
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

const StatCard = ({ label, value, icon, color = "#0066FF", sub }: {
  label: string; value: string | number; icon: React.ReactNode; color?: string; sub?: string;
}) => (
  <Card className="p-4 text-center">
    <div className="flex justify-center mb-2" style={{ color }}>{icon}</div>
    <p className="text-[14px] font-black text-gray-800 leading-none">{value}</p>
    {sub && <p className="text-[9px] text-gray-400 font-semibold mt-0.5 leading-none">{sub}</p>}
    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mt-1.5 leading-none">{label}</p>
  </Card>
);

const Badge = ({ children, color = "#0066FF", className = "" }: { children: React.ReactNode; color?: string; className?: string }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold border ${className}`}
    style={{ color, borderColor: `${color}30`, backgroundColor: `${color}0f` }}>
    {children}
  </span>
);

const SectionHead = ({ label, sub }: { label: string; sub?: string }) => (
  <div className="mb-2">
    <h3 className="text-[22px] font-black text-gray-900 leading-tight">{label}</h3>
    {sub && <p className="text-[11px] text-gray-400 font-medium mt-0.5">{sub}</p>}
  </div>
);

// ─────────────────────────────────────────────
// Company Logo
// ─────────────────────────────────────────────
const CompanyLogo = ({ name, domain, size = 44 }: { name: string; domain: string; size?: number }) => {
  const [imgSrc, setImgSrc] = useState<string | null>(`https://logo.clearbit.com/${domain}`);
  const [stage, setStage] = useState<"clearbit" | "favicon" | "initials">("clearbit");

  const initials = name.replace(/[^a-zA-Z\s]/g, "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
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
        <span style={{ fontSize: size * 0.33, fontWeight: 900, color: palette.text, letterSpacing: "-0.02em", lineHeight: 1 }}>
          {initials || "?"}
        </span>
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

// ─────────────────────────────────────────────
// Marketplace Avatar
// ─────────────────────────────────────────────
const MarketplaceAvatar = ({ initials, type, seed, size = 44 }: { initials: string; type: string; seed?: string; size?: number }) => {
  const typeRing: Record<string, string> = {
    "Web Dev": "#3B82F6", "Design": "#8B5CF6", "Writing": "#10B981",
    "Marketing": "#F59E0B", "Data": "#06B6D4", "AI": "#EF4444",
    "Security": "#DC2626", "Web3": "#7C3AED", "Video": "#EC4899",
  };
  const ring = typeRing[type] || "#3B82F6";
  const [errored, setErrored] = useState(false);
  const src = `https://i.pravatar.cc/150?u=${encodeURIComponent(seed || initials)}`;

  return (
    <div style={{ width: size, height: size, minWidth: size, borderRadius: 12, padding: 2, background: `linear-gradient(135deg, ${ring}, ${ring}99)`, flexShrink: 0, boxShadow: `0 2px 10px ${ring}33` }}>
      {errored
        ? <div style={{ width: "100%", height: "100%", borderRadius: 10, background: `linear-gradient(135deg, ${ring}, ${ring}cc)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: size * 0.32 }}>{initials.slice(0, 2)}</div>
        : <img src={src} alt={initials} onError={() => setErrored(true)} style={{ width: "100%", height: "100%", borderRadius: 10, objectFit: "cover", display: "block" }} />
      }
    </div>
  );
};

// ─────────────────────────────────────────────
// Payment Logos
// ─────────────────────────────────────────────
const BinanceLogo = ({ size = 44 }: { size?: number }) => (
  <div style={{ width: size, height: size, minWidth: size, background: "linear-gradient(135deg, #1a1a2e, #16213e)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.4)", border: "1px solid #F0B90B44" }}>
    <svg viewBox="0 0 24 24" width={size * 0.62} height={size * 0.62} fill="#F0B90B">
      <path d="M12 0L9.26 2.74 12 5.48 14.74 2.74zM5.48 6.52L2.74 9.26 5.48 12 8.22 9.26zM18.52 6.52L15.78 9.26 18.52 12 21.26 9.26zM9.26 9.26L12 12l2.74-2.74L12 6.52zM5.48 15.78L2.74 18.52 5.48 21.26 8.22 18.52zM18.52 15.78L15.78 18.52 18.52 21.26 21.26 18.52zM12 18.52L9.26 21.26 12 24 14.74 21.26z"/>
    </svg>
  </div>
);

const PayPalSVGLogo = ({ size = 44 }: { size?: number }) => (
  <div style={{ width: size, height: size, minWidth: size, background: "#003087", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,48,135,0.35)" }}>
    <svg viewBox="0 0 24 28" width={size * 0.45} height={size * 0.45 * 1.166} fill="none">
      <path d="M20.5 4.5C21.5 6.2 21.7 8.3 21.1 10.3C19.7 15.1 15.4 16.5 11.3 16.5H9.5L8 24H3.5L6.5 4H14.5C17.2 4 19.2 4.1 20.5 4.5Z" fill="#009CDE"/>
      <path d="M22 2.3C22.9 4 23.1 6.1 22.5 8.1C21.1 13 16.8 14.3 12.7 14.3H10.9L9.4 22H4.9L7.9 2H15.9C18.6 2 20.7 2.1 22 2.3Z" fill="#012169"/>
      <path d="M9 20H7.5L8 17H9.5C12.5 17 15.8 16 17.5 13C19.3 9.8 19 6.2 16.8 4C19.5 4.5 21.3 6.5 21.3 10C21.3 15.5 17 20 11 20H9Z" fill="#003087"/>
    </svg>
  </div>
);

const MpesaLogoSVG = ({ size = 44 }: { size?: number }) => (
  <div style={{ width: size, height: size, minWidth: size, background: "linear-gradient(135deg, #22C55E, #15803D)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(34,197,94,0.35)" }}>
    <svg viewBox="0 0 44 44" width={size} height={size}>
      <text x="50%" y="38%" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="14" fontWeight="900" fontFamily="Arial Black, sans-serif">M</text>
      <text x="50%" y="68%" textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.9)" fontSize="6.5" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing="1.2">PESA</text>
    </svg>
  </div>
);

const PaystackLogo = ({ size = 44 }: { size?: number }) => (
  <div style={{ width: size, height: size, minWidth: size, background: "linear-gradient(135deg, #011B33, #00C3F7)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,195,247,0.35)" }}>
    <svg viewBox="0 0 50 50" width={size * 0.64} height={size * 0.64} fill="none">
      <rect x="4" y="14" width="42" height="8" rx="4" fill="white" opacity="1"/>
      <rect x="4" y="28" width="28" height="8" rx="4" fill="white" opacity="0.7"/>
    </svg>
  </div>
);

// ─────────────────────────────────────────────
// HU Explainer
// ─────────────────────────────────────────────
const HUExplainer = ({ onTopUp }: { onTopUp: () => void }) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
    className="rounded-2xl border border-indigo-100 overflow-hidden"
    style={{ background: "linear-gradient(135deg, #EEF2FF 0%, #F0F9FF 100%)" }}>
    <div className="p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
          <Lightbulb size={15} className="text-white" />
        </div>
        <h4 className="text-[13px] font-black text-gray-900">How Handshake Units (HU) Work</h4>
      </div>
      <p className="text-[11px] text-gray-600 leading-relaxed mb-4">
        HU are your platform access tokens. <strong>Once you purchase any package, every matching gig is instantly unlocked — no applications, no waiting, no rejections.</strong> Just buy HU and start working globally.
      </p>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { step: "1", icon: <Zap size={13} />, label: "Buy HU", sub: "Pick any package", color: "#3B82F6" },
          { step: "2", icon: <CheckCircle2 size={13} />, label: "Instant Access", sub: "All gigs unlock now", color: "#8B5CF6" },
          { step: "3", icon: <DollarSign size={13} />, label: "Work & Earn", sub: "Withdraw your pay", color: "#10B981" },
        ].map((s) => (
          <div key={s.step} className="bg-white rounded-xl p-3 border border-white/80 text-center shadow-sm">
            <div className="w-7 h-7 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: `${s.color}15`, color: s.color }}>
              {s.icon}
            </div>
            <p className="text-[10px] font-black text-gray-800 leading-none">{s.label}</p>
            <p className="text-[9px] text-gray-400 font-medium mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>
      <div className="mb-3 p-3 bg-white rounded-xl border border-indigo-100 flex items-start gap-2">
        <CheckCircle2 size={13} className="text-indigo-500 mt-0.5 shrink-0" />
        <p className="text-[10px] text-indigo-700 font-semibold leading-relaxed">
          <strong>Zero applications.</strong> Unlike traditional freelance platforms, every gig on Nexus is pre-approved. Your HU purchase is your credential — clients have already said yes.
        </p>
      </div>
      <button onClick={onTopUp}
        className="w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all hover:opacity-90"
        style={{ background: "linear-gradient(135deg, #4F46E5, #0066FF)" }}>
        Unlock All Gigs — Buy HU Now →
      </button>
    </div>
  </motion.div>
);

// ─────────────────────────────────────────────
// Corporate Hiring Process Card
// ─────────────────────────────────────────────
const CorporateHiringCard = () => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
    className="rounded-2xl border border-purple-100 overflow-hidden"
    style={{ background: "linear-gradient(135deg, #FAF5FF 0%, #EEF2FF 100%)" }}>
    <div className="p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center shrink-0">
          <Building2 size={16} className="text-white" />
        </div>
        <div>
          <h4 className="text-[13px] font-black text-gray-900">Corporate Hiring Process</h4>
          <p className="text-[10px] text-purple-500 font-semibold">Real Fortune 500 roles · Full-time remote · Monthly salary</p>
        </div>
      </div>

      <p className="text-[10px] text-gray-600 font-medium leading-relaxed mb-4">
        Corporate roles go through a structured hiring pipeline — unlike freelance gigs which start immediately after buying HU.
        Purchase HU to <strong className="text-gray-800">unlock and apply</strong>, then follow the steps below.
      </p>

      <div className="space-y-2 mb-4">
        {[
          {
            step: 1, icon: <Zap size={12} />, color: "#3B82F6", bg: "#EFF6FF",
            title: "Buy HU & Apply",
            desc: "Purchase any Pro Uplink package or higher to unlock corporate roles. Submit your application directly from the gig card with one tap."
          },
          {
            step: 2, icon: <ClipboardList size={12} />, color: "#8B5CF6", bg: "#F5F3FF",
            title: "Submit CV & Credentials",
            desc: "Upload your resume, portfolio, and any relevant certifications. Make sure your profile is complete — HR will review it thoroughly."
          },
          {
            step: 3, icon: <Users size={12} />, color: "#06B6D4", bg: "#ECFEFF",
            title: "HR Review (2–5 Business Days)",
            desc: "The company's HR team reviews your profile against role requirements. Top candidates are shortlisted and contacted directly."
          },
          {
            step: 4, icon: <Video size={12} />, color: "#F59E0B", bg: "#FFFBEB",
            title: "Video Interview",
            desc: "Shortlisted candidates are invited to a structured video interview with the hiring team. Be prepared to discuss your experience and technical skills."
          },
          {
            step: 5, icon: <BadgeDollarSign size={12} />, color: "#10B981", bg: "#ECFDF5",
            title: "Offer & Onboarding",
            desc: "Successful candidates receive a formal offer letter and begin paid onboarding. Monthly salary is paid directly to your Nexus wallet."
          },
        ].map((item) => (
          <div key={item.step} className="flex items-start gap-3 bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              style={{ backgroundColor: item.bg, color: item.color }}>
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Step {item.step}</span>
              </div>
              <p className="text-[10px] font-black text-gray-900 leading-none">{item.title}</p>
              <p className="text-[9px] text-gray-500 font-medium mt-1 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl">
        <AlertCircle size={13} className="text-amber-500 mt-0.5 shrink-0" />
        <p className="text-[9px] text-amber-700 font-semibold leading-relaxed">
          Corporate roles require a minimum of <strong>50 HU</strong> (Pro Uplink+). Senior roles labelled "Premium Role" require 100 HU. Your HU balance is a quality signal that companies take seriously.
        </p>
      </div>
    </div>
  </motion.div>
);

// ─────────────────────────────────────────────
// Premium Locked Section
// ─────────────────────────────────────────────
const PremiumLockedSection = ({
  title, description, icon, cta, onCta, features,
}: {
  title: string; description: string; icon: React.ReactNode; cta: string; onCta: () => void; features?: string[];
}) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
    className="relative rounded-2xl overflow-hidden border border-gray-100 p-8 text-center"
    style={{ background: "linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)" }}>
    <div className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center bg-white border border-blue-100 shadow-sm text-blue-600">
      {icon}
    </div>
    <Badge color="#0066FF" className="mb-4"><Crown size={9} /> Members Only</Badge>
    <h3 className="text-[18px] font-black text-gray-900 mb-3 leading-tight">{title}</h3>
    <p className="text-[11px] text-gray-500 leading-relaxed mb-6 max-w-xs mx-auto">{description}</p>
    {features && (
      <div className="grid grid-cols-2 gap-2 mb-6 text-left max-w-xs mx-auto">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-blue-50">
            <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Check size={9} className="text-blue-600" />
            </div>
            <p className="text-[9px] font-semibold text-gray-500">{f}</p>
          </div>
        ))}
      </div>
    )}
    <RippleButton onClick={onCta}
      className="px-10 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white"
      style={{ background: "linear-gradient(135deg, #0066FF, #0047B3)" }}>
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
  <div className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0">
    <div className="flex items-center gap-3">
      {icon && <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15`, color }}>{icon}</div>}
      <div>
        <p className="text-[11px] font-bold text-gray-800">{label}</p>
        {sub && <p className="text-[9px] text-gray-400 font-medium mt-0.5">{sub}</p>}
      </div>
    </div>
    <button onClick={onChange} className="transition-all duration-200">
      {value
        ? <div className="w-11 h-6 rounded-full relative" style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}>
            <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm" />
          </div>
        : <div className="w-11 h-6 rounded-full bg-gray-200 relative">
            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm" />
          </div>
      }
    </button>
  </div>
);

// ─────────────────────────────────────────────
// Main FreelancerView Component
// ─────────────────────────────────────────────
export const FreelancerView = ({ jobs, userMetadata }: { jobs: any[]; userMetadata: any }) => {
  const { user } = useUser();

  const [currency, setCurrency] = useState<"USD" | "EUR" | "GBP" | "KES">("USD");
  const RATE: Record<string, number> = { USD: 1, EUR: 0.92, GBP: 0.79, KES: 130 };
  const SYMBOLS: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", KES: "KES " };
  const fmt = (usd: number) => {
    const r = RATE[currency];
    const sym = SYMBOLS[currency];
    const val = usd * r;
    return `${sym}${val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: currency === "KES" ? 0 : 2 })}`;
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
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  };

  const [huBalance, setHuBalance] = useState(5);
  const [cashBalance] = useState(0.0);
  const isVerified = userMetadata?.status === "Verified";
  const hasHU = huBalance >= 10;

  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState<ModalStep>("packages");
  const [selectedPack, setSelectedPack] = useState<(typeof uplinkPackages)[0] | null>(null);
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
  const [showHUExplainer, setShowHUExplainer] = useState(true);
  const [expandedGig, setExpandedGig] = useState<string | null>(null);

  const [expandedSetting, setExpandedSetting] = useState<string | null>(null);
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
      desc: "Try out the platform and access basic gigs.",
      hot: false, highlight: false,
      access: "Basic gigs up to $120 budget",
      roi: "Potential $1,200 earnings",
      color: "#10B981",
      perks: ["Access to 24 basic gigs", "Direct client contact", "Instant activation"],
    },
    {
      id: 2, name: "Basic", price: 6, hu: 400,
      desc: "Best for active job seekers wanting more options.",
      hot: false, highlight: false,
      access: "Basic + Standard gigs up to $600",
      roi: "Potential $4,800 earnings",
      color: "#3B82F6",
      perks: ["Access to 40+ gigs", "Standard + basic tiers", "Instant activation"],
    },
    {
      id: 3, name: "Pro", price: 12, hu: 900,
      desc: "Unlock advanced gigs and start earning big.",
      hot: true, highlight: true,
      access: "All gigs up to $2,200 budget",
      roi: "Potential $22,000 earnings",
      color: "#8B5CF6",
      perks: ["Unlock all gig tiers", "Advanced + Expert gigs", "Priority support"],
    },
    {
      id: 4, name: "Pro Uplink", price: 20, hu: 1200,
      desc: "Maximum access including corporate roles.",
      hot: false, highlight: false,
      access: "All gigs + corporate roles",
      roi: "Potential $50,000+ earnings",
      color: "#EF4444",
      perks: ["All gig tiers unlocked", "Corporate role access", "Highest priority queue"],
    },
  ];

  const marketplaceGigs = useMemo(() => [
    {
      id: "m1", title: "Landing Page (React / Next.js)", budget: 120, client: "StartupLaunch Co", avatar: "SL", type: "Web Dev", duration: "3 Days", level: "Basic",
      desc: "Build a clean, responsive landing page for a SaaS product. Pixel-perfect design from Figma. Deploy to Vercel.",
      skills: ["React", "Next.js", "Tailwind"], deliverables: "Source code + deployment", huRequired: 10,
    },
    {
      id: "m2", title: "Logo Design (3 Concepts)", budget: 90, client: "BrandSpark", avatar: "BS", type: "Design", duration: "2 Days", level: "Basic",
      desc: "Design 3 logo concepts for a fintech startup. Deliver in SVG, PNG, and PDF. Include colour palette and font suggestions.",
      skills: ["Illustrator", "Figma", "Branding"], deliverables: "3 logo concepts + brand kit", huRequired: 10,
    },
    {
      id: "m3", title: "Product Description Copywriting (20 items)", budget: 80, client: "ShopCloud", avatar: "SC", type: "Writing", duration: "2 Days", level: "Basic",
      desc: "Write SEO-optimised product descriptions for 20 e-commerce items. Tone: professional, persuasive, concise.",
      skills: ["Copywriting", "SEO", "E-commerce"], deliverables: "20 product descriptions in Google Doc", huRequired: 10,
    },
    {
      id: "m4", title: "Google Ads Campaign Setup", budget: 150, client: "AdGrowth Media", avatar: "AG", type: "Marketing", duration: "3 Days", level: "Basic",
      desc: "Set up a Google Ads search campaign for a local business. Keyword research, ad copy, bid strategy, conversion tracking.",
      skills: ["Google Ads", "PPC", "Analytics"], deliverables: "Live campaign + performance report", huRequired: 10,
    },
    {
      id: "m5", title: "Data Cleaning & Excel Dashboard", budget: 110, client: "InsightFirst", avatar: "IF", type: "Data", duration: "2 Days", level: "Basic",
      desc: "Clean a 5,000-row dataset (remove duplicates, fix formats), then build an Excel dashboard with KPI charts and filters.",
      skills: ["Excel", "Power Query", "Data Cleaning"], deliverables: "Clean dataset + Excel dashboard", huRequired: 10,
    },
    {
      id: "m6", title: "WordPress Blog Setup (5 pages)", budget: 130, client: "ContentFlow", avatar: "CF", type: "Web Dev", duration: "3 Days", level: "Basic",
      desc: "Install and configure WordPress with a premium theme. Set up 5 pages (Home, About, Blog, Services, Contact) and SEO plugin.",
      skills: ["WordPress", "Elementor", "SEO"], deliverables: "Live WordPress site + documentation", huRequired: 10,
    },
    {
      id: "m7", title: "Social Media Content Pack (30 posts)", budget: 200, client: "ViralBrand Studio", avatar: "VB", type: "Marketing", duration: "5 Days", level: "Basic",
      desc: "Create 30 branded social media graphics (Instagram, LinkedIn) with captions. Includes 5 story templates and 2 cover banners.",
      skills: ["Canva", "Copywriting", "Social Media"], deliverables: "30 posts + templates + captions", huRequired: 10,
    },
    {
      id: "m8", title: "ChatGPT Prompt Engineering Pack", budget: 160, client: "AI Solutions Hub", avatar: "AI", type: "AI", duration: "3 Days", level: "Basic",
      desc: "Design a library of 50 high-performance prompts for a business use case (sales, support, content). Include usage guide.",
      skills: ["Prompt Engineering", "ChatGPT", "Copywriting"], deliverables: "50 tested prompts + guide PDF", huRequired: 10,
    },
    {
      id: "m9", title: "Python Automated Reporting Script", budget: 280, client: "DataFlow Inc", avatar: "DF", type: "Data", duration: "4 Days", level: "Standard",
      desc: "Build a Python script that pulls from Google Sheets, processes KPIs, and auto-emails a PDF report every Monday.",
      skills: ["Python", "Pandas", "SMTP"], deliverables: "Script + documentation", huRequired: 20,
    },
    {
      id: "m10", title: "Social Media Management (1 Month)", budget: 400, client: "BrandBoost", avatar: "BB", type: "Marketing", duration: "30 Days", level: "Standard",
      desc: "Manage 3 social channels (IG, LinkedIn, Twitter) for 30 days: 4 posts/week, engagement, analytics reporting.",
      skills: ["Social Media", "Copywriting", "Analytics"], deliverables: "Monthly report + assets", huRequired: 20,
    },
    {
      id: "m11", title: "Mobile App UI Design (Figma)", budget: 600, client: "AppCraft Studio", avatar: "AC", type: "Design", duration: "8 Days", level: "Standard",
      desc: "Design 20+ screens for a iOS/Android fintech app. Includes design system, component library, and interactive prototype.",
      skills: ["Figma", "UI/UX", "Prototyping"], deliverables: "Figma file + prototype link", huRequired: 20,
    },
    {
      id: "m12", title: "SEO Optimization for Business Site", budget: 320, client: "Rank Fast", avatar: "RF", type: "Marketing", duration: "5 Days", level: "Standard",
      desc: "Conduct full SEO audit, fix technical issues, optimize 15 pages for target keywords, and set up Google Search Console.",
      skills: ["SEO", "Ahrefs", "Technical SEO"], deliverables: "SEO report + optimized pages", huRequired: 20,
    },
    {
      id: "m13", title: "Full-Stack Web App (React & Node)", budget: 1200, client: "TechBuild Global", avatar: "TB", type: "Web Dev", duration: "14 Days", level: "Advanced",
      desc: "Build a SaaS dashboard with React frontend, Node.js API, PostgreSQL database, JWT auth, and admin panel.",
      skills: ["React", "Node.js", "PostgreSQL"], deliverables: "Deployed app + source code", huRequired: 30,
    },
    {
      id: "m14", title: "AI Chatbot for Customer Support", budget: 950, client: "RetailBot Inc", avatar: "RB", type: "AI", duration: "10 Days", level: "Advanced",
      desc: "Integrate GPT-4 to build a customer support chatbot with intent routing, escalation logic, and Zendesk integration.",
      skills: ["Python", "OpenAI API", "Zendesk"], deliverables: "Live chatbot + admin dashboard", huRequired: 30,
    },
    {
      id: "m15", title: "Cybersecurity Audit for Company", budget: 1500, client: "SecureNet Ltd", avatar: "SN", type: "Security", duration: "7 Days", level: "Advanced",
      desc: "Perform penetration testing on company infrastructure: network, web app, internal APIs. Deliver CVSS-scored findings report.",
      skills: ["Burp Suite", "Nmap", "OWASP"], deliverables: "Pentest report + remediation guide", huRequired: 30,
    },
    {
      id: "m16", title: "Smart Contract Development (Solidity)", budget: 1800, client: "Nexus Protocol", avatar: "NP", type: "Web3", duration: "10 Days", level: "Advanced",
      desc: "Develop and test ERC-20 token + staking contract in Solidity. Deploy to testnet with Hardhat and write unit tests.",
      skills: ["Solidity", "Hardhat", "Ethers.js"], deliverables: "Audited contracts + frontend hook", huRequired: 30,
    },
    {
      id: "m17", title: "ML Model for Sales Predictions", budget: 1400, client: "Predict Pro", avatar: "PP", type: "AI", duration: "12 Days", level: "Advanced",
      desc: "Train a time-series model (XGBoost/LSTM) on 3 years of sales data to forecast monthly revenue per product category.",
      skills: ["Python", "XGBoost", "Scikit-learn"], deliverables: "Model + REST API + dashboard", huRequired: 30,
    },
    {
      id: "m18", title: "Next.js Performance & SEO Overhaul", budget: 1800, client: "E-Com Solutions", avatar: "EC", type: "Web Dev", duration: "10 Days", level: "Advanced",
      desc: "Audit and improve Core Web Vitals on Next.js site: code splitting, image optimization, SSG/ISR, structured data, meta tags.",
      skills: ["Next.js", "Lighthouse", "Vercel"], deliverables: "Optimized site + audit report", huRequired: 30,
    },
    {
      id: "m19", title: "Brand Identity Design System", budget: 2200, client: "Branding Co", avatar: "BC", type: "Design", duration: "14 Days", level: "Advanced",
      desc: "Create a comprehensive brand identity: logo suite, color system, typography, motion guidelines, and Figma component library.",
      skills: ["Figma", "Illustrator", "Brand Strategy"], deliverables: "Full brand book + Figma kit", huRequired: 30,
    },
    {
      id: "m20", title: "API Security Penetration Testing", budget: 2100, client: "SafeVault Corp", avatar: "SV", type: "Security", duration: "7 Days", level: "Expert",
      desc: "In-depth API security assessment: auth bypass, injection, race conditions, mass assignment. OWASP API Top 10 coverage.",
      skills: ["Postman", "Burp Suite", "Python"], deliverables: "Detailed report + fix recommendations", huRequired: 50,
    },
    {
      id: "m21", title: "NFT Collection + Smart Contracts + Frontend", budget: 2800, client: "CryptoArt Hub", avatar: "CA", type: "Web3", duration: "14 Days", level: "Expert",
      desc: "End-to-end NFT collection: generative art engine, ERC-721 contract, whitelist/mint frontend, OpenSea metadata integration.",
      skills: ["Solidity", "React", "IPFS"], deliverables: "Deployed collection + minting site", huRequired: 50,
    },
    {
      id: "m22", title: "Enterprise CRM Custom Integration", budget: 3200, client: "SalesForce Partners", avatar: "SP", type: "Web Dev", duration: "21 Days", level: "Expert",
      desc: "Build a custom Salesforce integration with real-time webhook sync, bi-directional data flow, and automated workflows.",
      skills: ["Salesforce API", "Node.js", "REST"], deliverables: "Integration + documentation", huRequired: 50,
    },
    {
      id: "m23", title: "Deep Learning Computer Vision System", budget: 4000, client: "VisionAI Labs", avatar: "VA", type: "AI", duration: "21 Days", level: "Expert",
      desc: "Train a YOLOv8 object detection model on custom dataset (5k images) for real-time product defect detection in manufacturing.",
      skills: ["PyTorch", "YOLOv8", "OpenCV"], deliverables: "Trained model + inference API", huRequired: 50,
    },
    {
      id: "m24", title: "DeFi Protocol Architecture & Audit", budget: 5000, client: "DeFi Builders DAO", avatar: "DB", type: "Web3", duration: "30 Days", level: "Expert",
      desc: "Design and audit a multi-chain DeFi liquidity protocol: AMM design, governance tokenomics, formal security audit, testnet launch.",
      skills: ["Solidity", "DeFi", "Security"], deliverables: "Protocol + audit report + docs", huRequired: 50,
    },
  ], []);

  const corporateGigs = useMemo(() => [
    {
      id: "c1", title: "Remote Fleet Data Analyst", salary: 8000, domain: "tesla.com", company: "Tesla", badge: "EV · Remote", dept: "Engineering",
      desc: "Analyze fleet telemetry data from 500k+ Tesla vehicles. Build dashboards to track range, charging patterns, and predictive maintenance signals.",
      skills: ["Python", "SQL", "Tableau"], type: "Full-time Remote", huRequired: 50,
    },
    {
      id: "c2", title: "Cloud Support Engineer", salary: 9000, domain: "amazon.com", company: "Amazon", badge: "AWS · Senior", dept: "Cloud",
      desc: "Provide enterprise-level AWS support for Fortune 500 clients. Resolve complex infrastructure issues and optimize cloud architectures.",
      skills: ["AWS", "Linux", "Networking"], type: "Full-time Remote", huRequired: 50,
    },
    {
      id: "c3", title: "Payment Integrity Analyst", salary: 11000, domain: "stripe.com", company: "Stripe", badge: "FinTech · Remote", dept: "Finance",
      desc: "Investigate payment anomalies, fraud patterns, and dispute trends across Stripe's global transaction network. Build risk models.",
      skills: ["SQL", "Python", "Risk Analysis"], type: "Full-time Remote", huRequired: 50,
    },
    {
      id: "c4", title: "Security Operations Specialist", salary: 12000, domain: "kraken.com", company: "Kraken", badge: "Crypto · Remote", dept: "Security",
      desc: "Monitor Kraken's security posture 24/7: threat intelligence, incident response, and security automation for one of the world's largest crypto exchanges.",
      skills: ["SIEM", "Incident Response", "Crypto"], type: "Full-time Remote", huRequired: 50,
    },
    {
      id: "c5", title: "Frontend Engineer (React)", salary: 10500, domain: "shopify.com", company: "Shopify", badge: "E-Com · Remote", dept: "Engineering",
      desc: "Build Shopify's merchant-facing dashboard features in React. Collaborate with design systems team on accessibility and performance.",
      skills: ["React", "TypeScript", "Polaris"], type: "Full-time Remote", huRequired: 50,
    },
    {
      id: "c6", title: "Data Platform Engineer", salary: 13500, domain: "databricks.com", company: "Databricks", badge: "Data · Senior", dept: "Data",
      desc: "Build and scale Databricks' internal data infrastructure. Design lakehouse pipelines processing 100TB+ daily across multi-cloud.",
      skills: ["Spark", "Delta Lake", "Python"], type: "Senior Full-time Remote", huRequired: 100,
    },
    {
      id: "c7", title: "Product Manager — Global Expansion", salary: 9500, domain: "google.com", company: "Google", badge: "Remote · Senior", dept: "Product",
      desc: "Lead product strategy for Google's expansion into 15 new emerging markets. Define roadmaps, run A/B tests, and own OKRs.",
      skills: ["Product Strategy", "Analytics", "Leadership"], type: "Senior Full-time Remote", huRequired: 100,
    },
    {
      id: "c8", title: "Mobile Engineer (iOS/Android)", salary: 11000, domain: "meta.com", company: "Meta", badge: "Remote · Mid", dept: "Engineering",
      desc: "Build features in the Facebook/Instagram mobile apps used by 3 billion people. Ship performant, accessible cross-platform code.",
      skills: ["React Native", "Swift", "Kotlin"], type: "Full-time Remote", huRequired: 100,
    },
    {
      id: "c9", title: "DevOps Engineer", salary: 10000, domain: "microsoft.com", company: "Microsoft", badge: "Azure · Remote", dept: "Infrastructure",
      desc: "Maintain CI/CD pipelines, Kubernetes clusters, and Azure infrastructure for Microsoft's developer tools division.",
      skills: ["Kubernetes", "Azure", "Terraform"], type: "Full-time Remote", huRequired: 50,
    },
    {
      id: "c10", title: "UX Researcher", salary: 8500, domain: "airbnb.com", company: "Airbnb", badge: "Remote · Contract", dept: "Design",
      desc: "Conduct user research (interviews, usability tests, surveys) for Airbnb's host experience product. Synthesize insights into actionable design directions.",
      skills: ["User Research", "Figma", "Data Analysis"], type: "Contract Remote", huRequired: 50,
    },
    {
      id: "c11", title: "Blockchain Developer", salary: 14000, domain: "coinbase.com", company: "Coinbase", badge: "Crypto · Remote", dept: "Engineering",
      desc: "Build and audit smart contracts on Ethereum, Base, and Polygon for Coinbase's DeFi and NFT product lines.",
      skills: ["Solidity", "Go", "Web3.js"], type: "Senior Full-time Remote", huRequired: 100,
    },
    {
      id: "c12", title: "Growth Marketing Manager", salary: 9000, domain: "spotify.com", company: "Spotify", badge: "Marketing · Remote", dept: "Marketing",
      desc: "Drive artist and listener acquisition campaigns globally. Manage $2M+ monthly ad budget across Meta, Google, and programmatic channels.",
      skills: ["Growth", "Paid Media", "Analytics"], type: "Full-time Remote", huRequired: 50,
    },
    {
      id: "c13", title: "ML Infrastructure Engineer", salary: 15000, domain: "openai.com", company: "OpenAI", badge: "AI · Remote", dept: "AI",
      desc: "Build and scale the infrastructure powering OpenAI's model training and inference. Work with petabyte-scale datasets and GPU clusters.",
      skills: ["PyTorch", "CUDA", "Distributed Systems"], type: "Senior Full-time Remote", huRequired: 100,
    },
    {
      id: "c14", title: "Backend Engineer (Go/Rust)", salary: 12000, domain: "discord.com", company: "Discord", badge: "Remote · Mid", dept: "Engineering",
      desc: "Build low-latency microservices handling 4 billion messages daily. Work on voice, video, and real-time data infrastructure.",
      skills: ["Go", "Rust", "Distributed Systems"], type: "Full-time Remote", huRequired: 50,
    },
    {
      id: "c15", title: "Data Scientist — Ads Platform", salary: 13000, domain: "twitter.com", company: "X (Twitter)", badge: "Data · Senior", dept: "Data",
      desc: "Build ML models optimizing ad relevance and bidding for X's advertising platform. Own A/B testing framework and revenue modeling.",
      skills: ["Python", "TensorFlow", "Causal ML"], type: "Senior Full-time Remote", huRequired: 100,
    },
    {
      id: "c16", title: "Smart Contract Auditor", salary: 17000, domain: "binance.com", company: "Binance", badge: "Crypto · Senior", dept: "Security",
      desc: "Audit DeFi protocols integrated with Binance Smart Chain. Identify vulnerabilities, write PoCs, and produce professional audit reports.",
      skills: ["Solidity", "Security", "DeFi"], type: "Senior Full-time Remote", huRequired: 100,
    },
    {
      id: "c17", title: "API Developer (Payments)", salary: 10000, domain: "paypal.com", company: "PayPal", badge: "FinTech · Remote", dept: "Engineering",
      desc: "Design and build payment APIs handling $1.5T in annual transaction volume. Focus on reliability, latency, and developer experience.",
      skills: ["Java", "REST", "Payments"], type: "Full-time Remote", huRequired: 50,
    },
    {
      id: "c18", title: "Content Strategy Manager", salary: 7500, domain: "hubspot.com", company: "HubSpot", badge: "Marketing · Remote", dept: "Marketing",
      desc: "Lead HubSpot's blog and resource content strategy. Manage a team of 8 writers, own SEO content roadmap, and drive 2M+ monthly visits.",
      skills: ["Content Strategy", "SEO", "Leadership"], type: "Full-time Remote", huRequired: 30,
    },
    {
      id: "c19", title: "Cloud Security Architect", salary: 16000, domain: "cloudflare.com", company: "Cloudflare", badge: "Security · Senior", dept: "Security",
      desc: "Design Cloudflare's zero-trust security architecture protecting 25M+ websites. Lead threat modeling and security reviews for new products.",
      skills: ["Zero Trust", "Networking", "AWS/GCP"], type: "Senior Full-time Remote", huRequired: 100,
    },
    {
      id: "c20", title: "iOS Engineer", salary: 11500, domain: "uber.com", company: "Uber", badge: "Mobile · Remote", dept: "Engineering",
      desc: "Build the Uber Eats iOS app used by 100M+ customers. Optimize cold start, animations, offline experience, and A/B testing infrastructure.",
      skills: ["Swift", "SwiftUI", "XCTest"], type: "Full-time Remote", huRequired: 50,
    },
    {
      id: "c21", title: "Full Stack Engineer (TypeScript)", salary: 10000, domain: "notion.so", company: "Notion", badge: "SaaS · Remote", dept: "Engineering",
      desc: "Build Notion's collaborative workspace features: real-time sync, block editor, API integrations, and enterprise admin tools.",
      skills: ["TypeScript", "React", "Node.js"], type: "Full-time Remote", huRequired: 50,
    },
    {
      id: "c22", title: "Analytics Engineer", salary: 9500, domain: "figma.com", company: "Figma", badge: "Design · Remote", dept: "Data",
      desc: "Own Figma's data warehouse and analytics stack. Build dbt models, define metrics, and enable data-driven decisions across product and growth.",
      skills: ["dbt", "SQL", "Looker"], type: "Full-time Remote", huRequired: 50,
    },
  ], []);

  const gigCategories = ["All", "Web Dev", "Design", "Writing", "Marketing", "Data", "AI", "Security", "Web3", "Video"];
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

  // ── Load Paystack inline script once on mount ──
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.getElementById("paystack-inline-script")) return;
    const script = document.createElement("script");
    script.id = "paystack-inline-script";
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const navItems = [
    { id: "home",      icon: <Home size={17} />,          label: "Home"   },
    { id: "tasks",     icon: <Briefcase size={17} />,     label: "Jobs"   },
    { id: "contracts", icon: <FileText size={17} />,      label: "Work"   },
    { id: "messages",  icon: <MessageSquare size={17} />, label: "Chats"  },
    { id: "earnings",  icon: <Wallet size={17} />,        label: "Wallet" },
    { id: "analytics", icon: <BarChart3 size={17} />,     label: "Stats"  },
    { id: "support",   icon: <LifeBuoy size={17} />,      label: "Help"   },
    { id: "me",        icon: <User size={17} />,          label: "Me"     },
  ];

  const messages = [
    { sender: "Nexus HQ", body: "Welcome to Nexus! Purchase Handshake Units (HU) to instantly unlock all gigs on the platform. Once you have HU, every freelance gig is immediately available — no waiting, no applications needed.", time: "Just now", unread: true, avatar: "🏢" },
    { sender: "Security Bot", body: "Your connection is encrypted and secure. You have 5 HU left. Purchase at least 150 HU (Starter pack) to unlock all basic gigs and start working immediately with zero application process.", time: "14m ago", unread: true, avatar: "🤖" },
    { sender: "Exchange Relay", body: "Currency rates updated. Switch between USD, EUR, GBP and more in your wallet settings. Withdrawals are available in your local currency after completing jobs.", time: "1h ago", unread: false, avatar: "📡" },
  ];

  const openRefill = () => { setModalStep("packages"); setShowModal(true); };

  const handleStartGig = (gigTitle: string) => {
    if (!hasHU) {
      addToast("Purchase HU to instantly unlock and start this gig", "error");
      openRefill();
    } else {
      addToast(`You're now working on: ${gigTitle}`, "success");
    }
  };

  const handleApplyCorporate = (gigTitle: string) => {
    if (!hasHU) {
      addToast("Purchase HU to apply for corporate roles", "error");
      openRefill();
    } else {
      addToast(`Application submitted for: ${gigTitle} — HR will review within 2–5 business days`, "success");
    }
  };

  const handlePay = async (method: "MPESA" | "PAYPAL" | "CARD" | "BINANCE") => {
    if (!agreed) return addToast("Please agree to the terms first.", "info");
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
          body: JSON.stringify({
            amount: selectedPack.price * 130, phone: clean,
            email: user?.primaryEmailAddress?.emailAddress,
            metadata: { hu: selectedPack.hu },
          }),
        });
        if (res.ok) { addToast("Check your phone — M-Pesa prompt sent!", "success"); setShowModal(false); }
        else addToast("M-Pesa connection failed. Try again.", "error");
      } else if (method === "PAYPAL") {
        addToast("Redirecting to PayPal...", "info");
        setTimeout(() => { addToast("PayPal checkout ready!", "success"); setShowModal(false); }, 1500);
      } else if (method === "CARD") {
        const paystackPublicKey =
          process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
        const email = user?.primaryEmailAddress?.emailAddress;
        if (!email) { addToast("Please ensure you are logged in with a valid email.", "error"); setIsPaying(false); return; }
        const PaystackPop = (window as any).PaystackPop;
        if (!PaystackPop) {
          addToast("Paystack is loading — please try again in a moment.", "info");
          setIsPaying(false);
          return;
        }
        const ref = `HU-${selectedPack.id}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        const KES_RATE = 130;
        const amountInKes = selectedPack.price * KES_RATE;
        const handler = PaystackPop.setup({
          key: paystackPublicKey,
          email,
          amount: amountInKes * 100,
          currency: "KES",
          ref,
          label: `${selectedPack.name} Pack — ${selectedPack.hu} HU`,
          metadata: {
            custom_fields: [
              { display_name: "Package", variable_name: "package", value: selectedPack.name },
              { display_name: "HU Amount", variable_name: "hu_amount", value: String(selectedPack.hu) },
            ],
          },
          onClose: () => {
            setIsPaying(false);
            addToast("Payment window closed. Come back when you're ready!", "info");
          },
          callback: (response: { reference: string }) => {
            setIsPaying(false);
            setHuBalance((prev) => prev + selectedPack.hu);
            addToast(`Payment confirmed! ${selectedPack.hu} HU credited. Ref: ${response.reference}`, "success");
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

  const BINANCE_WALLETS = {
    TRC20: "TFWxe4TFcjUNgPJVgf5iXrMsw1oe4gDv9X",
    ERC20: "0x742d35Cc6634C0532925a3b8D4c9F1B7e9f6c89",
  };

  const faqItems = [
    { q: "What are Handshake Units (HU)?", a: "HU are your platform access tokens. Once you purchase HU, all corresponding gigs on the platform become instantly available for you to start working — no applications, no waiting. You simply buy a package and begin immediately." },
    { q: "Do I need to apply to each freelance gig?", a: "Absolutely not! That's what makes Nexus different from every other freelance platform. Once you buy HU, ALL freelance gigs are instantly unlocked and ready for you to start immediately — no applications, no screening, no rejections. Clients have pre-approved all listed workers. Corporate roles are the ONLY exception, which require a formal application and HR review process." },
    { q: "Which payment methods are supported?", a: "We support: Card via Paystack (Visa/Mastercard — available worldwide), Binance Pay (USDT crypto — worldwide, instant), M-Pesa (East Africa: Kenya, Tanzania, Uganda, Rwanda — instant STK Push), and PayPal (selected regions: EU, UK, US, Canada, Australia only — currently limited)." },
    { q: "How fast is payment and HU credit?", a: "Card (Paystack) and Binance Pay are near-instant (within minutes). M-Pesa is instant via STK Push. PayPal is within 1 hour. HU balances are credited automatically once payment is confirmed on-chain or by the processor." },
    { q: "Can I withdraw my earnings?", a: "Yes! Once your balance reaches $50, you can withdraw via Binance Pay, M-Pesa, or PayPal. Verified accounts get priority processing and higher daily/monthly limits. Withdrawals are processed within 24 hours." },
    { q: "How do corporate gigs work?", a: "Corporate roles go through a full hiring pipeline: you apply (requires HU) → submit your CV and credentials → company HR reviews your profile (2–5 business days) → shortlisted candidates attend a video interview → successful candidates receive an offer and begin paid onboarding. Monthly salaries are paid directly to your Nexus wallet." },
    { q: "Is my data and money safe?", a: "Yes. All data is protected using TLS 1.3 encryption in transit and AES-256 at rest. We comply with GDPR. Payments are handled by certified processors (Paystack, Binance, Safaricom). No financial data is stored on our servers, and no data is ever sold to third parties." },
  ];

  const achievements = [
    { id: 1, title: "First Login", desc: "Joined the platform", icon: <Star size={16} />, color: "#F59E0B", earned: true },
    { id: 2, title: "Profile Set Up", desc: "Completed your profile", icon: <UserCheck size={16} />, color: "#10B981", earned: true },
    { id: 3, title: "First Gig Started", desc: "Began your first job", icon: <Briefcase size={16} />, color: "#3B82F6", earned: false },
    { id: 4, title: "First Earning", desc: "Completed a paid job", icon: <DollarSign size={16} />, color: "#8B5CF6", earned: false },
    { id: 5, title: "Top Rated", desc: "Earned 5-star feedback", icon: <Award size={16} />, color: "#EF4444", earned: false },
    { id: 6, title: "Verified Pro", desc: "Profile fully verified", icon: <BadgeCheck size={16} />, color: "#06B6D4", earned: false },
    { id: 7, title: "Referral King", desc: "Referred 5 friends", icon: <Gift size={16} />, color: "#EC4899", earned: false },
    { id: 8, title: "Elite Worker", desc: "Completed 10 jobs", icon: <Trophy size={16} />, color: "#7C3AED", earned: false },
  ];

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  return (
    <div className="min-h-screen font-sans overflow-x-hidden" style={{ background: "#F5F7FB", paddingBottom: "88px" }}>

      {/* Toast Notifications */}
      <div className="fixed top-5 right-4 z-999 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div key={t.id}
              initial={{ opacity: 0, x: 80, scale: 0.92 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 80, scale: 0.92 }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-bold border shadow-lg bg-white ${
                t.type === "success" ? "border-green-200 text-green-700"
                : t.type === "error" ? "border-red-200 text-red-700"
                : "border-blue-200 text-blue-700"}`}>
              {t.type === "success" ? <CheckCircle size={14} className="text-green-500" />
                : t.type === "error" ? <AlertTriangle size={14} className="text-red-500" />
                : <BellRing size={14} className="text-blue-500" />}
              <span>{t.msg}</span>
              <button onClick={() => setToasts((p) => p.filter((x) => x.id !== t.id))} className="ml-1 opacity-40 hover:opacity-100"><X size={12} /></button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="max-w-5xl mx-auto pt-6 px-4 relative z-10">
        <AnimatePresence mode="wait">

          {/* ══ HOME ══ */}
          {activeTab === "home" && (
            <motion.div key="home" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="space-y-5">

              {/* Header */}
              <div className="rounded-2xl border border-gray-100 shadow-sm p-6 flex justify-between items-center overflow-hidden relative"
                style={{ background: "linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)" }}>
                <div className="absolute right-0 top-0 w-64 h-64 rounded-full opacity-[0.04]"
                  style={{ background: "radial-gradient(circle, #3B82F6, transparent)", transform: "translate(30%,-30%)" }} />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Welcome back</p>
                  <h2 className="text-[26px] font-black text-gray-900 leading-none">{user?.firstName || "Operator"}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <PulseDot color="#10B981" size={7} />
                    <span className="text-[10px] font-semibold text-gray-400">Connected · All systems running</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2.5 rounded-xl">
                    <Zap size={15} className="text-blue-600" fill="#3B82F6" />
                    <span className="text-[16px] font-black text-gray-900">{huBalance}</span>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">HU</span>
                  </div>
                  <div className="relative">
                    <button onClick={() => setShowCurrencyMenu(m => !m)}
                      className="text-[9px] font-bold bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all flex items-center gap-1">
                      {currency} <ChevronDown size={10} />
                    </button>
                    {showCurrencyMenu && (
                      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                        {(["USD", "EUR", "GBP", "KES"] as const).map(c => (
                          <button key={c} onClick={() => { setCurrency(c); setShowCurrencyMenu(false); }}
                            className={`block w-full text-left px-4 py-2 text-[10px] font-bold hover:bg-blue-50 transition-all ${currency === c ? "text-blue-600 bg-blue-50" : "text-gray-700"}`}>
                            {c} — {c === "USD" ? "US Dollar" : c === "EUR" ? "Euro" : c === "GBP" ? "British Pound" : "Kenyan Shilling"}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Main CTA Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-3 rounded-2xl p-6 text-white shadow-md"
                  style={{ background: "linear-gradient(135deg, #0047B3 0%, #0066FF 60%, #1D8EF0 100%)" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <PlayCircle size={18} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black uppercase tracking-wide">One Purchase. Instant Access. Zero Applications.</h4>
                      <p className="text-[9px] text-blue-200 mt-0.5">Buy HU → all freelance gigs unlock immediately · No waiting required</p>
                    </div>
                  </div>
                  <p className="text-[12px] text-blue-100 leading-relaxed mb-5">
                    Buy any HU package and <strong className="text-white">all matching gigs activate the moment your payment clears.</strong> Browse 46 global opportunities from top companies — start working instantly, no applications.
                  </p>
                  <div className="flex gap-2">
                    <RippleButton onClick={openRefill}
                      className="flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-700 bg-white hover:bg-blue-50 transition-all">
                      Unlock Gigs — Buy HU
                    </RippleButton>
                    <button onClick={() => setActiveTab("tasks")}
                      className="px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/30 text-white/80 hover:text-white hover:bg-white/10 transition-all">
                      Browse →
                    </button>
                  </div>
                </div>
                <div className="md:col-span-2 grid grid-cols-2 gap-3">
                  <StatCard label="Gigs Available" value="46" icon={<Briefcase size={15} />} color="#10B981" sub="Ready to start" />
                  <StatCard label="Uptime" value="99.9%" icon={<Wifi size={15} />} color="#3B82F6" />
                  <StatCard label="Your HU" value={huBalance} icon={<Zap size={15} />} color="#8B5CF6" sub={hasHU ? "Active" : "Top up to start"} />
                  <StatCard label="Countries" value="195+" icon={<Globe size={15} />} color="#F59E0B" />
                </div>
              </div>

              {/* Low HU Warning */}
              {!hasHU && (
                <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-xl border border-amber-200 bg-amber-50 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                    <Lock size={18} className="text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-black text-amber-800 uppercase tracking-wide">Gigs are locked — purchase HU to unlock instantly</p>
                    <p className="text-[10px] text-amber-600 font-medium mt-0.5">Current balance: {huBalance} HU · Buy Starter ($3) to unlock 24 basic gigs right now</p>
                  </div>
                  <button onClick={openRefill} className="shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white bg-amber-500 hover:bg-amber-600 transition-all">
                    Unlock Now
                  </button>
                </motion.div>
              )}

              {/* HU Explainer */}
              {showHUExplainer && (
                <div className="relative">
                  <button onClick={() => setShowHUExplainer(false)}
                    className="absolute top-3 right-3 z-10 p-1.5 bg-white/80 rounded-lg border border-gray-200 hover:bg-white transition-all">
                    <X size={11} className="text-gray-400" />
                  </button>
                  <HUExplainer onTopUp={openRefill} />
                </div>
              )}

              {/* Quick actions */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { icon: <Zap size={18} />, label: "Buy HU", color: "#3B82F6", bg: "#EFF6FF", action: openRefill },
                  { icon: <Briefcase size={18} />, label: "Browse Gigs", color: "#8B5CF6", bg: "#F5F3FF", action: () => setActiveTab("tasks") },
                  { icon: <Wallet size={18} />, label: "My Wallet", color: "#10B981", bg: "#ECFDF5", action: () => setActiveTab("earnings") },
                  { icon: <BarChart3 size={18} />, label: "My Stats", color: "#F59E0B", bg: "#FFFBEB", action: () => setActiveTab("analytics") },
                ].map((item, i) => (
                  <button key={i} onClick={item.action}
                    className="p-4 rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm transition-all text-center group">
                    <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ backgroundColor: item.bg, color: item.color }}>
                      {item.icon}
                    </div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-gray-800 transition-all leading-none">{item.label}</p>
                  </button>
                ))}
              </div>

              {/* Activity */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Activity size={14} className="text-blue-500" />
                    <span className="text-[11px] font-black text-gray-700 uppercase tracking-wide">Your Activity</span>
                  </div>
                  <Badge color="#10B981"><PulseDot color="#10B981" size={5} /> Live</Badge>
                </div>
                <div className="text-center py-6">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <Sparkles size={18} className="text-blue-500" />
                  </div>
                  <p className="text-[12px] font-black text-gray-700">No activity yet</p>
                  <p className="text-[10px] text-gray-400 font-medium mt-1">Purchase HU to unlock gigs. Once you start working, live updates appear here.</p>
                  <button onClick={openRefill}
                    className="mt-4 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-700 bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-all">
                    Unlock Gigs Now
                  </button>
                </div>
              </Card>

              {/* Top companies */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Top Companies With Open Gigs</p>
                <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
                  {[
                    { domain: "tesla.com", name: "Tesla" },
                    { domain: "amazon.com", name: "Amazon" },
                    { domain: "stripe.com", name: "Stripe" },
                    { domain: "google.com", name: "Google" },
                    { domain: "openai.com", name: "OpenAI" },
                    { domain: "coinbase.com", name: "Coinbase" },
                    { domain: "shopify.com", name: "Shopify" },
                    { domain: "netflix.com", name: "Netflix" },
                    { domain: "microsoft.com", name: "Microsoft" },
                    { domain: "meta.com", name: "Meta" },
                  ].map((c, i) => (
                    <button key={i} onClick={() => { setGigMode("corporate"); setActiveTab("tasks"); }}
                      className="shrink-0 p-3 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all group">
                      <CompanyLogo name={c.name} domain={c.domain} size={40} />
                      <p className="text-[8px] font-bold text-gray-400 mt-1.5 text-center group-hover:text-gray-700 transition-all">{c.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Global stats bar */}
              <div className="grid grid-cols-4 gap-3">
                <StatCard label="Workers Online" value="12,847" icon={<Users size={15} />} color="#10B981" sub="Globally" />
                <StatCard label="Gigs Open Today" value="2,341" icon={<Briefcase size={15} />} color="#3B82F6" sub="Last 24h" />
                <StatCard label="Avg Gig Value" value={fmt(847)} icon={<TrendingUp size={15} />} color="#8B5CF6" sub="Per project" />
                <StatCard label="Paid Out" value="$4.2M" icon={<DollarSign size={15} />} color="#F59E0B" sub="This month" />
              </div>
            </motion.div>
          )}

          {/* ══ JOBS ══ */}
          {activeTab === "tasks" && (
            <motion.div key="tasks" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <SectionHead label="Global Gig Board" sub={`${marketplaceGigs.length + corporateGigs.length} gigs ready worldwide`} />
                <Badge color="#10B981"><PulseDot color="#10B981" size={5} /> Gigs Open</Badge>
              </div>

              {!hasHU && (
                <div className="p-5 rounded-2xl border border-blue-200 flex items-center gap-4"
                  style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #EEF2FF 100%)" }}>
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                    <PlayCircle size={22} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[12px] font-black text-blue-900">Purchase HU — All freelance gigs unlock instantly, zero applications needed</p>
                    <p className="text-[10px] text-blue-600 font-medium mt-0.5">Browse everything now. Buy any package and start working immediately. Clients have already pre-approved all workers on the platform.</p>
                  </div>
                  <button onClick={openRefill} className="shrink-0 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase text-white bg-blue-600 hover:bg-blue-700 transition-all">
                    Unlock Gigs
                  </button>
                </div>
              )}

              <div className="flex gap-1 p-1 rounded-xl border border-gray-200 bg-white w-fit">
                {(["marketplace", "corporate"] as const).map((m) => (
                  <button key={m} onClick={() => setGigMode(m)}
                    className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${gigMode === m ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-800"}`}>
                    {m === "marketplace" ? "Freelance" : "Corporate"}
                  </button>
                ))}
              </div>

              {gigMode === "marketplace" && (
                <>
                  {/* Instant access banner */}
                  <div className="flex items-center gap-3 p-4 rounded-2xl border border-green-200"
                    style={{ background: "linear-gradient(135deg, #ECFDF5, #D1FAE5)" }}>
                    <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={16} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] font-black text-green-900">All freelance gigs are instantly available after buying HU</p>
                      <p className="text-[10px] text-green-700 font-medium mt-0.5">No applications. No waiting. No rejections. Buy HU once → pick any gig → start working immediately.</p>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <div className="flex-1 min-w-50 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5">
                      <Search size={14} className="text-gray-400 shrink-0" />
                      <input value={gigSearch} onChange={e => setGigSearch(e.target.value)} placeholder="Search gigs or clients..."
                        className="flex-1 text-[11px] outline-none text-gray-700 placeholder-gray-400 bg-transparent" />
                      {gigSearch && <button onClick={() => setGigSearch("")}><X size={12} className="text-gray-400 hover:text-gray-600" /></button>}
                    </div>
                    <select value={gigSort} onChange={e => setGigSort(e.target.value as typeof gigSort)}
                      className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-[11px] font-semibold text-gray-600 outline-none cursor-pointer">
                      <option value="newest">Newest First</option>
                      <option value="highest">Highest Pay</option>
                      <option value="lowest">Lowest Pay</option>
                    </select>
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {gigCategories.map((cat) => (
                      <button key={cat} onClick={() => setGigCategory(cat)}
                        className={`shrink-0 px-4 py-1.5 rounded-full text-[10px] font-bold border transition-all ${gigCategory === cat ? "bg-blue-600 text-white border-blue-600" : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"}`}>
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {[["Basic", "#10B981"], ["Standard", "#3B82F6"], ["Advanced", "#8B5CF6"], ["Expert", "#EF4444"]].map(([l, c]) => (
                      <div key={l} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-100 rounded-lg">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
                        <span className="text-[9px] font-bold text-gray-500">{l}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg ml-auto">
                      <PlayCircle size={10} className="text-blue-600" />
                      <span className="text-[9px] font-bold text-blue-600">{hasHU ? "All Gigs Unlocked" : "Buy HU to Unlock All"}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredMarket.map((g) => {
                      const lc = levelColors[g.level] || "#3B82F6";
                      const tc = typeColors[g.type] || "#3B82F6";
                      const isExpanded = expandedGig === g.id;
                      return (
                        <motion.div key={g.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-200 transition-all group overflow-hidden">
                          <div className="p-5">
                            <div className="flex items-start justify-between mb-3">
                              <MarketplaceAvatar initials={g.avatar} type={g.type} seed={g.client} size={44} />
                              <div className="flex gap-1 flex-wrap justify-end">
                                <Badge color={tc}>{g.type}</Badge>
                                <Badge color={lc}>{g.level}</Badge>
                              </div>
                            </div>
                            <h4 className="text-[12px] font-black text-gray-900 mb-1 leading-snug">{g.title}</h4>
                            <p className="text-[10px] text-gray-400 font-medium mb-2">{g.client} · {g.duration}</p>
                            <p className="text-[10px] text-gray-500 leading-relaxed mb-3 line-clamp-2">{g.desc}</p>
                            <div className="flex gap-1 flex-wrap mb-3">
                              {g.skills.map((s, si) => (
                                <span key={si} className="px-2 py-0.5 rounded-md text-[8px] font-bold bg-gray-100 text-gray-500">{s}</span>
                              ))}
                            </div>

                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden">
                                  <div className="mb-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Deliverables</p>
                                    <p className="text-[10px] font-semibold text-gray-700">{g.deliverables}</p>
                                  </div>
                                  <div className="mb-3 p-3 bg-green-50 rounded-xl border border-green-100">
                                    <p className="text-[9px] font-bold text-green-600 uppercase mb-1">How to Start</p>
                                    <p className="text-[10px] font-semibold text-green-800">Purchase HU → tap "Start Gig" → begin working immediately. No application or approval needed.</p>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            <button onClick={() => setExpandedGig(isExpanded ? null : g.id)}
                              className="text-[9px] font-bold text-blue-500 hover:text-blue-700 transition-all mb-3 flex items-center gap-1">
                              {isExpanded ? <><ChevronUp size={10} /> Less details</> : <><ChevronDown size={10} /> More details</>}
                            </button>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                              <div>
                                <p className="text-[16px] font-black text-gray-900 leading-none">{fmt(g.budget)}</p>
                                <p className="text-[8px] text-gray-400 font-medium mt-0.5">Project budget</p>
                              </div>
                              {hasHU
                                ? <RippleButton onClick={() => handleStartGig(g.title)}
                                    className="px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-white flex items-center gap-1.5"
                                    style={{ background: `linear-gradient(135deg, ${tc}, ${tc}cc)` }}>
                                    <PlayCircle size={11} /> Start Gig
                                  </RippleButton>
                                : <button onClick={openRefill}
                                    className="px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all">
                                    <Lock size={10} /> Unlock
                                  </button>
                              }
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {filteredMarket.length === 0 && (
                    <div className="text-center py-16 text-gray-400">
                      <Search size={32} className="mx-auto mb-3 opacity-40" />
                      <p className="text-[13px] font-semibold">No gigs match your search</p>
                      <p className="text-[11px] mt-1">Try a different category or search term</p>
                      <button onClick={() => { setGigSearch(""); setGigCategory("All"); }} className="mt-3 px-4 py-2 rounded-xl text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-all">
                        Clear Filters
                      </button>
                    </div>
                  )}
                </>
              )}

              {gigMode === "corporate" && (
                <>
                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {corpDepts.map((d) => (
                      <button key={d} onClick={() => setCorpCategory(d)}
                        className={`shrink-0 px-4 py-1.5 rounded-full text-[10px] font-bold border transition-all ${corpCategory === d ? "bg-blue-600 text-white border-blue-600" : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                        {d}
                      </button>
                    ))}
                  </div>

                  {/* Corporate Hiring Process Card */}
                  <CorporateHiringCard />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredCorp.map((c) => {
                      const isExpanded = expandedGig === c.id;
                      const costColor = c.huRequired >= 100 ? "#EF4444" : "#8B5CF6";
                      return (
                        <div key={c.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-200 transition-all overflow-hidden">
                          <div className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                              <CompanyLogo name={c.company} domain={c.domain} size={52} />
                              <div className="min-w-0 flex-1">
                                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-0.5">{c.company}</p>
                                <h4 className="text-[12px] font-black text-gray-900 leading-snug">{c.title}</h4>
                                <div className="flex gap-1 mt-1 flex-wrap">
                                  <Badge color="#8B5CF6">{c.badge}</Badge>
                                  <Badge color="#06B6D4">{c.dept}</Badge>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-[16px] font-black text-gray-900 leading-none">{fmt(c.salary)}</p>
                                <p className="text-[9px] text-gray-400 font-medium mt-0.5">/month</p>
                              </div>
                            </div>

                            <p className="text-[10px] text-gray-500 leading-relaxed mb-3">{c.desc}</p>

                            <div className="flex gap-1 flex-wrap mb-3">
                              {c.skills.map((s, si) => (
                                <span key={si} className="px-2 py-0.5 rounded-md text-[8px] font-bold bg-gray-100 text-gray-500">{s}</span>
                              ))}
                            </div>

                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden">
                                  <div className="mb-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Employment Type</p>
                                    <p className="text-[10px] font-semibold text-gray-700">{c.type}</p>
                                  </div>
                                  <div className="mb-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
                                    <p className="text-[9px] font-bold text-purple-600 uppercase mb-1">Application Process</p>
                                    <p className="text-[10px] font-semibold text-purple-800">Apply → Submit CV → HR Review (2–5 days) → Video Interview → Offer & Onboarding</p>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            <button onClick={() => setExpandedGig(isExpanded ? null : c.id)}
                              className="text-[9px] font-bold text-blue-500 hover:text-blue-700 transition-all mb-3 flex items-center gap-1">
                              {isExpanded ? <><ChevronUp size={10} /> Less details</> : <><ChevronDown size={10} /> More details</>}
                            </button>

                            <div className="flex items-center gap-1.5 mb-3 px-3 py-2 rounded-lg"
                              style={{ backgroundColor: `${costColor}0f`, border: `1px solid ${costColor}25` }}>
                              <Zap size={11} style={{ color: costColor }} />
                              <span className="text-[9px] font-black uppercase" style={{ color: costColor }}>Requires {c.huRequired} HU to Apply</span>
                              {c.huRequired >= 100 && <span className="ml-auto text-[8px] font-bold text-red-400">Premium Role</span>}
                            </div>

                            {hasHU
                              ? <RippleButton onClick={() => handleApplyCorporate(c.title)}
                                  className="w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white flex items-center justify-center gap-2"
                                  style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}>
                                  <ClipboardList size={13} /> Apply Now <ArrowUpRight size={12} />
                                </RippleButton>
                              : <button onClick={openRefill}
                                  className="w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-purple-200 bg-purple-50 text-purple-600 hover:bg-purple-100 transition-all">
                                  <Lock size={13} /> Purchase HU to Apply
                                </button>
                            }
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* ══ WALLET ══ */}
          {activeTab === "earnings" && (
            <motion.div key="earnings" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="space-y-5">
              <SectionHead label="My Wallet" sub="Track your earnings, HU balance, and withdrawals" />
              <div className="flex gap-1 p-1 rounded-xl border border-gray-200 bg-white w-fit overflow-x-auto no-scrollbar">
                {(["overview", "history", "limits", "referral"] as const).map((t) => (
                  <button key={t} onClick={() => setActiveVaultTab(t)}
                    className={`shrink-0 px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeVaultTab === t ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-800"}`}>
                    {t}
                  </button>
                ))}
              </div>

              {activeVaultTab === "overview" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-7 rounded-2xl border border-blue-100 relative overflow-hidden"
                      style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)" }}>
                      <div className="flex items-center justify-between mb-5">
                        <Zap size={22} className="text-blue-600" fill="#3B82F6" />
                        <Badge color="#3B82F6"><PulseDot color="#3B82F6" size={5} /> Active</Badge>
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-2">Handshake Units (HU)</p>
                      <div className="flex items-end gap-2 mb-1">
                        <span className="text-[44px] font-black text-gray-900 leading-none">{huBalance}</span>
                        <span className="text-[20px] font-black text-blue-600 mb-1">HU</span>
                      </div>
                      <p className="text-[10px] font-medium text-gray-500">{hasHU ? "All gigs unlocked and ready to start" : "Purchase HU to unlock all gigs instantly"}</p>
                      <div className="flex gap-2 mt-5">
                        <button onClick={openRefill} className="flex-1 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-700 transition-all">
                          + Top Up
                        </button>
                        <button onClick={() => setActiveVaultTab("history")} className="px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-200 text-blue-600 hover:bg-blue-50 transition-all">
                          History
                        </button>
                      </div>
                    </div>

                    <div className="p-7 rounded-2xl border border-green-100 relative overflow-hidden"
                      style={{ background: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)" }}>
                      <div className="flex items-center justify-between mb-5">
                        <DollarSign size={22} className="text-green-600" />
                        <button onClick={() => setShowBalance(b => !b)} className="text-gray-400 hover:text-gray-600 transition-all">
                          {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-green-400 mb-2">Earnings Balance</p>
                      <div className="flex items-end gap-2 mb-1">
                        <span className="text-[44px] font-black text-gray-900 leading-none">
                          {showBalance ? fmt(cashBalance) : "••••••"}
                        </span>
                      </div>
                      <p className="text-[10px] font-medium text-gray-500">Ready to withdraw</p>
                      <RippleButton onClick={() => addToast("Minimum withdrawal is $50.00. Complete your first gig to earn.", "info")}
                        className="mt-5 w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-green-200 text-green-700 hover:bg-green-100 transition-all flex items-center justify-center gap-2">
                        Withdraw Money <ArrowUpRight size={13} />
                      </RippleButton>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <StatCard label="Total Earned" value={fmt(0)} icon={<TrendingUp size={15} />} color="#10B981" sub="All time" />
                    <StatCard label="Withdrawn" value={fmt(0)} icon={<Download size={15} />} color="#3B82F6" sub="All time" />
                    <StatCard label="Pending" value={fmt(0)} icon={<Clock size={15} />} color="#F59E0B" sub="In review" />
                    <StatCard label="HU Balance" value={huBalance} icon={<Zap size={15} />} color="#8B5CF6" sub="Available" />
                  </div>

                  {/* HU Calculator */}
                  <Card className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Calculator size={15} className="text-blue-500" />
                      <span className="text-[11px] font-black text-gray-700 uppercase tracking-wide">HU Value Calculator</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium mb-3">See what your HU balance could earn you</p>
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Units (HU)</p>
                        <input type="number" value={calcHU} onChange={(e) => setCalcHU(e.target.value)}
                          className="bg-transparent w-full text-[16px] font-black outline-none text-gray-900" min="0" />
                      </div>
                      <RefreshCw size={14} className="text-gray-400" />
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-right">
                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Est. Gig Value</p>
                        <p className="text-[16px] font-black text-green-600 leading-none">
                          {isNaN(calcUSD) || calcUSD <= 0 ? "—" : fmt(calcUSD)}
                        </p>
                      </div>
                    </div>
                    <p className="text-[9px] text-gray-400 font-medium mt-2 text-center">Based on average gig value per HU spent</p>
                  </Card>

                  {/* Withdrawal Methods — Bank Wire removed */}
                  <Card className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Globe size={15} className="text-blue-500" />
                      <span className="text-[11px] font-black text-gray-700 uppercase tracking-wide">Withdrawal Methods</span>
                    </div>
                    <div className="space-y-3">
                      {[
                        { name: "Binance Pay (USDT/Crypto)", sub: "Worldwide · Instant settlement · Best option globally", logo: <BinanceLogo size={40} />, status: "Global", color: "#F0B90B" },
                        { name: "M-Pesa", sub: "Kenya, Tanzania, Uganda, Rwanda · Instant STK Push", logo: <MpesaLogoSVG size={40} />, status: "East Africa", color: "#16A34A" },
                        { name: "PayPal", sub: "EU, UK, US, Canada, Australia · Selected regions only", logo: <PayPalSVGLogo size={40} />, status: "Select Regions", color: "#003087" },
                      ].map((m, i) => (
                        <div key={i} className="flex items-center gap-4 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                          {m.logo}
                          <div className="flex-1">
                            <p className="text-[11px] font-black text-gray-900">{m.name}</p>
                            <p className="text-[9px] text-gray-400 font-medium">{m.sub}</p>
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
                  description="Your full earnings record, withdrawal history, and HU purchase log will appear here once you complete your first gig or top up."
                  icon={<Clock size={28} />}
                  cta="Unlock Gigs Now"
                  onCta={() => setActiveTab("tasks")}
                  features={["Full record", "CSV export", "HU log", "Withdrawals"]}
                />
              )}

              {activeVaultTab === "limits" && (
                <div className="space-y-3">
                  <Card className="p-5">
                    <h4 className="text-[11px] font-black uppercase tracking-wide text-gray-500 mb-4">Withdrawal Limits</h4>
                    <div className="space-y-4">
                      {[
                        { label: "Daily Withdrawal", used: 0, limit: 500, unit: "USD" },
                        { label: "Monthly Withdrawal", used: 0, limit: 5000, unit: "USD" },
                        { label: "HU Balance Used Today", used: 0, limit: 200, unit: "HU" },
                      ].map((item, i) => (
                        <div key={i}>
                          <div className="flex justify-between mb-1.5">
                            <span className="text-[10px] font-bold text-gray-600">{item.label}</span>
                            <span className="text-[10px] font-black text-gray-900">{item.used} / {item.limit} {item.unit}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-blue-500" style={{ width: `${(item.used / item.limit) * 100}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
                    <ChevronsUp size={16} className="text-amber-500 shrink-0" />
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-amber-800">Verify your profile to increase limits 10×</p>
                      <p className="text-[9px] text-amber-600 font-medium mt-0.5">Verified accounts get priority processing and higher limits</p>
                    </div>
                    <button onClick={() => { setActiveTab("me"); setActiveProfileTab("security"); }} className="shrink-0 px-3 py-1.5 rounded-xl text-[9px] font-black text-amber-700 border border-amber-300 bg-amber-100 hover:bg-amber-200 transition-all">
                      Verify
                    </button>
                  </div>
                </div>
              )}

              {activeVaultTab === "referral" && (
                <div className="space-y-4">
                  <div className="p-7 rounded-2xl border border-purple-100 text-center"
                    style={{ background: "linear-gradient(135deg, #F5F3FF 0%, #EEF2FF 100%)" }}>
                    <Gift size={32} className="mx-auto text-purple-600 mb-3" />
                    <h4 className="text-[18px] font-black text-gray-900 mb-2">Refer Friends & Earn</h4>
                    <p className="text-[11px] text-gray-500 font-medium mb-5">Get <strong className="text-purple-700">50 free HU</strong> for every friend who joins and tops up</p>
                    <div className="bg-white p-4 rounded-xl border border-purple-100 flex items-center gap-3 text-left mb-4">
                      <div className="flex-1">
                        <p className="text-[9px] text-gray-400 font-medium mb-1">Your referral code</p>
                        <p className="text-[16px] font-black text-blue-600 tracking-widest">NEXUS-{user?.firstName?.toUpperCase() || "USER"}07</p>
                      </div>
                      <button onClick={() => { navigator.clipboard.writeText("NEXUS-" + (user?.firstName?.toUpperCase() || "USER") + "07"); addToast("Referral code copied!", "success"); }}
                        className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all">
                        <Copy size={14} className="text-gray-500" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <StatCard label="Referred" value="0" icon={<User size={14} />} color="#8B5CF6" />
                      <StatCard label="HU Earned" value="0" icon={<Zap size={14} />} color="#3B82F6" />
                      <StatCard label="$ Earned" value={fmt(0)} icon={<DollarSign size={14} />} color="#10B981" />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ══ WORK / CONTRACTS ══ */}
          {activeTab === "contracts" && (
            <motion.div key="contracts" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="space-y-5">
              <SectionHead label="My Work" sub="Active and completed gigs" />
              <div className="grid grid-cols-4 gap-3 opacity-40 pointer-events-none select-none">
                <StatCard label="Active Gigs" value="—" icon={<Briefcase size={15} />} color="#3B82F6" />
                <StatCard label="Completed" value="—" icon={<CheckCircle2 size={15} />} color="#10B981" />
                <StatCard label="Earned" value="—" icon={<DollarSign size={15} />} color="#F59E0B" />
                <StatCard label="Rating" value="—" icon={<Star size={15} />} color="#8B5CF6" />
              </div>
              <PremiumLockedSection
                title="No Gigs Started Yet"
                description="Purchase HU and start your first gig to unlock this section. You'll see active work, milestones, client ratings, and earnings here."
                icon={<FileText size={28} />}
                cta="Browse & Unlock Gigs"
                onCta={() => setActiveTab("tasks")}
                features={["Active gigs", "Client chat", "Milestones", "Earnings log", "Dispute help", "Ratings"]}
              />
            </motion.div>
          )}

          {/* ══ MESSAGES ══ */}
          {activeTab === "messages" && (
            <motion.div key="messages" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="space-y-4">
              <SectionHead label="Messages" sub="Platform notifications and system updates" />
              <div className="space-y-2">
                {messages.map((m, i) => (
                  <div key={i} onClick={() => setExpandedMsg(expandedMsg === i ? null : i)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${m.unread ? "bg-blue-50 border-blue-100" : "bg-white border-gray-100"} hover:border-blue-200`}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-lg shrink-0">
                        {m.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <div className="flex items-center gap-2">
                            <p className="text-[11px] font-black text-gray-900">{m.sender}</p>
                            {m.unread && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                          </div>
                          <span className="text-[9px] text-gray-400 font-medium shrink-0">{m.time}</span>
                        </div>
                        <p className={`text-[10px] text-gray-500 font-medium leading-relaxed ${expandedMsg === i ? "" : "line-clamp-2"}`}>{m.body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ══ STATS ══ */}
          {activeTab === "analytics" && (
            <motion.div key="analytics" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="space-y-5">
              <SectionHead label="My Stats" sub="Performance and earnings overview" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Success Rate" value="0%" icon={<CheckCircle2 size={15} />} color="#10B981" />
                <StatCard label="Gigs Done" value="0" icon={<Briefcase size={15} />} color="#3B82F6" />
                <StatCard label="Total Earned" value={fmt(0)} icon={<DollarSign size={15} />} color="#F59E0B" />
                <StatCard label="Uptime" value="100%" icon={<Wifi size={15} />} color="#8B5CF6" />
              </div>
              <PremiumLockedSection
                title="Stats Unlock After First Gig"
                description="Earnings charts, completion rate, client ratings, and skill analytics appear after you complete your first gig on Nexus."
                icon={<BarChart3 size={28} />}
                cta="Start Your First Gig"
                onCta={() => setActiveTab("tasks")}
                features={["Earnings chart", "Win rate", "Client ratings", "Skill breakdown"]}
              />
            </motion.div>
          )}

          {/* ══ SUPPORT ══ */}
          {activeTab === "support" && (
            <motion.div key="support" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="max-w-lg mx-auto space-y-5">
              <SectionHead label="Help Center" sub="We're here to support you worldwide" />

              <div className="p-4 rounded-xl border border-green-200 bg-green-50 flex items-center gap-4">
                <PulseDot color="#10B981" size={8} />
                <div className="flex-1">
                  <p className="text-[11px] font-black text-green-800">All Systems Running Normally</p>
                  <p className="text-[10px] text-green-600 font-medium">Platform · Payments · Gigs · Wallet — all operational globally</p>
                </div>
                <Badge color="#10B981">99.9%</Badge>
              </div>

              <Card className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <HelpCircle size={14} className="text-indigo-500" />
                  <span className="text-[11px] font-black text-gray-700 uppercase tracking-wide">Frequently Asked Questions</span>
                </div>
                <div className="space-y-2">
                  {faqItems.map((item, i) => (
                    <div key={i} onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                      className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl cursor-pointer hover:border-indigo-200 transition-all">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[11px] font-bold text-indigo-900">{item.q}</p>
                        <ChevronDown size={13} className={`text-indigo-400 shrink-0 transition-transform ${expandedFaq === i ? "rotate-180" : ""}`} />
                      </div>
                      <AnimatePresence>
                        {expandedFaq === i && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                            <p className="text-[11px] text-indigo-700 leading-relaxed mt-3 pt-3 border-t border-indigo-200">{item.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
                <button onClick={openRefill} className="mt-3 w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all"
                  style={{ background: "linear-gradient(135deg, #4F46E5, #0066FF)" }}>
                  Buy HU — Unlock Gigs Now →
                </button>
              </Card>

              <Card className="p-5 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Contact Support</p>
                {[
                  { label: "Email Us", value: "support@nexusgigs.me", icon: <Mail size={16} />, sub: "We reply within 2 hours", color: "#3B82F6", action: () => window.location.href = "mailto:support@nexusgigs.me" },
                  { label: "Chat on WhatsApp", value: "Tap to open WhatsApp", icon: <MessageCircle size={16} />, sub: "Mon–Fri · Available globally", color: "#25D366", action: () => window.open("https://wa.me/254113637325", "_blank") },
                  { label: "Live Chat", value: "Coming Soon", icon: <MessageSquare size={16} />, sub: "In-app · Under development", color: "#8B5CF6", action: undefined },
                ].map((item, i) => (
                  <div key={i} onClick={item.action}
                    className={`p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-4 ${item.action ? "cursor-pointer hover:border-blue-200 hover:bg-blue-50" : "opacity-50"} transition-all`}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] font-black text-gray-900">{item.label}</p>
                      <p className="text-[9px] text-gray-400 font-medium mt-0.5">{item.sub}</p>
                    </div>
                    {item.action && <ChevronRight size={14} className="text-gray-400 shrink-0" />}
                  </div>
                ))}
              </Card>
            </motion.div>
          )}

          {/* ══ ME / PROFILE ══ */}
          {activeTab === "me" && (
            <motion.div key="me" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="space-y-5">
              <SectionHead label="My Profile" sub="Manage your account, security, and preferences" />

              {/* Profile header */}
              <div className="rounded-2xl border border-gray-100 p-6 relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)" }}>
                <div className="absolute right-0 top-0 w-48 h-48 rounded-full opacity-[0.04]"
                  style={{ background: "radial-gradient(circle, #3B82F6, transparent)", transform: "translate(30%,-30%)" }} />
                <div className="flex items-start gap-5">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-md"
                      style={{ background: "linear-gradient(135deg, #0066FF, #8B5CF6)" }}>
                      {(user?.firstName?.[0] || "U").toUpperCase()}
                    </div>
                    {isVerified && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                        <Check size={10} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-[18px] font-black text-gray-900 leading-none">
                        {`${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Freelancer"}
                      </h3>
                      {isVerified
                        ? <Badge color="#10B981"><BadgeCheck size={10} /> Verified</Badge>
                        : <Badge color="#F59E0B"><AlertCircle size={10} /> Unverified</Badge>
                      }
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium mb-2">{user?.primaryEmailAddress?.emailAddress || "—"}</p>
                    <div className="flex items-center gap-3">
                      <Badge color="#3B82F6"><Globe size={9} /> {profileLocation}</Badge>
                      <Badge color="#8B5CF6"><Zap size={9} /> {profileAvailability}</Badge>
                    </div>

                    {editingProfile ? (
                      <div className="mt-4 space-y-3">
                        <div>
                          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mb-1 block">Bio</label>
                          <textarea value={profileBio} onChange={e => setProfileBio(e.target.value)} rows={2}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-[11px] text-gray-700 outline-none focus:border-blue-400 resize-none transition-all" />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mb-1 block">Location</label>
                          <input value={profileLocation} onChange={e => setProfileLocation(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-[11px] text-gray-700 outline-none focus:border-blue-400 transition-all" />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mb-1 block">Hourly Rate</label>
                          <input value={profileRate} onChange={e => setProfileRate(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-[11px] text-gray-700 outline-none focus:border-blue-400 transition-all" />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mb-1 block">Skills (comma separated)</label>
                          <input value={profileSkills.join(", ")} onChange={e => setProfileSkills(e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-[11px] text-gray-700 outline-none focus:border-blue-400 transition-all" />
                        </div>
                        <RippleButton onClick={() => { setEditingProfile(false); addToast("Profile updated!", "success"); }}
                          className="w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white"
                          style={{ background: "linear-gradient(135deg, #0066FF, #0047B3)" }}>
                          Save Profile
                        </RippleButton>
                      </div>
                    ) : (
                      <div className="mt-3">
                        <p className="text-[11px] text-gray-500 leading-relaxed">{profileBio}</p>
                        <div className="flex gap-1.5 flex-wrap mt-3">
                          {profileSkills.map((skill, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-full text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-100">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile completion */}
              {!isVerified && (
                <div className="p-4 rounded-2xl border border-amber-200" style={{ background: "linear-gradient(135deg, #FFFBEB, #FFF7ED)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <UserCheck size={14} className="text-amber-600" />
                      <span className="text-[11px] font-black text-amber-800">Profile Completion</span>
                    </div>
                    <span className="text-[12px] font-black text-amber-600">45%</span>
                  </div>
                  <div className="h-2 bg-amber-100 rounded-full overflow-hidden mb-3">
                    <motion.div initial={{ width: 0 }} animate={{ width: "45%" }} transition={{ delay: 0.3, duration: 0.8 }}
                      className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #F59E0B, #EF4444)" }} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Email verified", done: true },
                      { label: "Profile photo", done: false },
                      { label: "ID verification", done: false },
                      { label: "Phone number", done: false },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${item.done ? "bg-green-500" : "bg-gray-200"}`}>
                          {item.done ? <Check size={9} className="text-white" /> : <X size={9} className="text-gray-400" />}
                        </div>
                        <span className={`text-[9px] font-semibold ${item.done ? "text-gray-700" : "text-gray-400"}`}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Profile Stats Row */}
              <div className="grid grid-cols-4 gap-3">
                <StatCard label="HU Balance" value={huBalance} icon={<Zap size={14} />} color="#3B82F6" />
                <StatCard label="Gigs Done" value="0" icon={<CheckSquare size={14} />} color="#10B981" />
                <StatCard label="Total Earned" value={fmt(0)} icon={<DollarSign size={14} />} color="#F59E0B" />
                <StatCard label="Rating" value="—" icon={<Star size={14} />} color="#8B5CF6" />
              </div>

              {/* Tabs */}
              <div className="flex gap-1 p-1 rounded-xl border border-gray-200 bg-white overflow-x-auto no-scrollbar">
                {([
                  { id: "profile" as const, label: "Profile", icon: <User size={12} /> },
                  { id: "security" as const, label: "Security", icon: <Shield size={12} /> },
                  { id: "notifications" as const, label: "Alerts", icon: <Bell size={12} /> },
                  { id: "achievements" as const, label: "Badges", icon: <Trophy size={12} /> },
                  { id: "settings" as const, label: "Settings", icon: <Settings size={12} /> },
                ]).map((t) => (
                  <button key={t.id} onClick={() => setActiveProfileTab(t.id)}
                    className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeProfileTab === t.id ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-800"}`}>
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>

              {activeProfileTab === "profile" && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <Card className="p-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Account Info</p>
                    <div className="space-y-3">
                      {[
                        { label: "Display Name", value: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "—", icon: <User size={14} />, color: "#3B82F6" },
                        { label: "Email", value: user?.primaryEmailAddress?.emailAddress || "—", icon: <Mail size={14} />, color: "#10B981" },
                        { label: "Account Type", value: "Freelancer · Global", icon: <Briefcase size={14} />, color: "#8B5CF6" },
                        { label: "Member Since", value: "2025", icon: <Calendar size={14} />, color: "#F59E0B" },
                        { label: "HU Balance", value: `${huBalance} HU`, icon: <Zap size={14} />, color: "#0066FF" },
                        { label: "Cash Balance", value: fmt(cashBalance), icon: <DollarSign size={14} />, color: "#10B981" },
                        { label: "Hourly Rate", value: profileRate, icon: <TrendingUp size={14} />, color: "#EF4444" },
                        { label: "Location", value: profileLocation, icon: <MapPin size={14} />, color: "#06B6D4" },
                      ].map((row, i) => (
                        <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${row.color}15`, color: row.color }}>{row.icon}</div>
                          <div className="flex-1">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">{row.label}</p>
                            <p className="text-[11px] font-black text-gray-900 mt-0.5 break-all">{row.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">My Skills</p>
                      <button onClick={() => setEditingProfile(true)} className="text-[9px] font-bold text-blue-500 hover:text-blue-700 transition-all flex items-center gap-1">
                        <Edit3 size={10} /> Edit
                      </button>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {profileSkills.map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-xl text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">{skill}</span>
                      ))}
                      {profileSkills.length === 0 && (
                        <p className="text-[10px] text-gray-400 font-medium">Add your skills to attract better gigs</p>
                      )}
                    </div>
                  </Card>

                  <Card className="p-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Quick Actions</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Buy HU", icon: <Zap size={16} />, color: "#3B82F6", bg: "#EFF6FF", action: openRefill },
                        { label: "Browse Gigs", icon: <Briefcase size={16} />, color: "#8B5CF6", bg: "#F5F3FF", action: () => setActiveTab("tasks") },
                        { label: "My Wallet", icon: <Wallet size={16} />, color: "#10B981", bg: "#ECFDF5", action: () => setActiveTab("earnings") },
                        { label: "Get Help", icon: <LifeBuoy size={16} />, color: "#F59E0B", bg: "#FFFBEB", action: () => setActiveTab("support") },
                      ].map((item, i) => (
                        <button key={i} onClick={item.action}
                          className="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-all flex items-center gap-3 text-left">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: item.bg, color: item.color }}>{item.icon}</div>
                          <span className="text-[10px] font-black text-gray-700">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeProfileTab === "security" && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <div className="p-5 rounded-2xl border border-blue-100" style={{ background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Shield size={16} className="text-blue-600" />
                        <span className="text-[12px] font-black text-blue-900">Security Score</span>
                      </div>
                      <span className="text-[20px] font-black text-blue-600">40<span className="text-[12px] text-blue-400">/100</span></span>
                    </div>
                    <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-blue-500" style={{ width: "40%" }} />
                    </div>
                    <p className="text-[9px] text-blue-500 font-medium mt-2">Enable 2FA to boost your score to 80+</p>
                  </div>

                  <Card className="p-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Security Settings</p>
                    <ToggleRow
                      label="Two-Factor Authentication"
                      sub={twoFAEnabled ? "Your account is protected with 2FA" : "Strongly recommended — add an extra layer"}
                      value={twoFAEnabled}
                      onChange={() => { setTwoFAEnabled(v => !v); addToast(twoFAEnabled ? "2FA disabled" : "2FA enabled!", twoFAEnabled ? "info" : "success"); }}
                      icon={<Fingerprint size={14} />}
                      color="#10B981"
                    />
                    {twoFAEnabled && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3">
                        <CheckCircle size={14} className="text-green-500 shrink-0" />
                        <p className="text-[10px] font-semibold text-green-700">2FA active — your account is secured</p>
                      </div>
                    )}
                  </Card>

                  <Card className="p-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Active Sessions</p>
                    <div className="space-y-2">
                      {sessions.map((s, i) => (
                        <div key={i} className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${revokedSession.includes(i) ? "opacity-40 bg-gray-50 border-gray-100" : s.current ? "bg-green-50 border-green-100" : "bg-gray-50 border-gray-100"}`}>
                          <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0">
                            <Smartphone size={15} className="text-gray-500" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-[11px] font-black text-gray-900">{s.device}</p>
                              {s.current && <Badge color="#10B981">Current</Badge>}
                            </div>
                            <p className="text-[9px] text-gray-400 font-medium mt-0.5">{s.location} · {s.last}</p>
                          </div>
                          {!s.current && !revokedSession.includes(i) && (
                            <button onClick={() => { setRevokedSession(r => [...r, i]); addToast("Session revoked", "success"); }}
                              className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-[9px] font-bold text-red-600 hover:bg-red-100 transition-all">
                              Revoke
                            </button>
                          )}
                          {revokedSession.includes(i) && <span className="text-[9px] font-bold text-gray-400">Revoked</span>}
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">API Access</p>
                    <p className="text-[10px] text-gray-500 font-medium mb-3">Generate an API key to connect external tools to Nexus.</p>
                    {generatedApiKey ? (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 font-mono text-[10px] text-gray-600 truncate">
                            {showApiKey ? generatedApiKey : "••••••••••••••••••••••••••••••••"}
                          </div>
                          <button onClick={() => setShowApiKey(v => !v)} className="p-3 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 transition-all">
                            {showApiKey ? <EyeOff size={14} className="text-gray-500" /> : <Eye size={14} className="text-gray-500" />}
                          </button>
                          <button onClick={() => { navigator.clipboard.writeText(generatedApiKey); setCopiedKey(true); addToast("API key copied!", "success"); setTimeout(() => setCopiedKey(false), 2000); }}
                            className="p-3 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 transition-all">
                            {copiedKey ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-gray-500" />}
                          </button>
                        </div>
                        <button onClick={() => { setGeneratedApiKey(null); addToast("API key revoked", "info"); }}
                          className="text-[10px] font-bold text-red-500 hover:text-red-700 transition-all">
                          Revoke Key
                        </button>
                      </div>
                    ) : (
                      <RippleButton onClick={() => { const key = "nxs_" + Math.random().toString(36).substr(2, 32); setGeneratedApiKey(key); addToast("API key generated!", "success"); }}
                        className="w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-200 text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                        <Key size={13} /> Generate API Key
                      </RippleButton>
                    )}
                  </Card>
                </motion.div>
              )}

              {activeProfileTab === "notifications" && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="p-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Notification Preferences</p>
                    <ToggleRow label="New Gig Alerts" sub="Get notified when matching gigs are posted globally" value={notifications.newGigs} onChange={() => setNotifications(n => ({ ...n, newGigs: !n.newGigs }))} icon={<Briefcase size={14} />} color="#3B82F6" />
                    <ToggleRow label="Payment Updates" sub="Confirmations, withdrawals, and HU credits" value={notifications.payments} onChange={() => setNotifications(n => ({ ...n, payments: !n.payments }))} icon={<DollarSign size={14} />} color="#10B981" />
                    <ToggleRow label="Mission Alerts" sub="Status changes on your active gigs" value={notifications.missions} onChange={() => setNotifications(n => ({ ...n, missions: !n.missions }))} icon={<Target size={14} />} color="#8B5CF6" />
                    <ToggleRow label="Message Alerts" sub="Client messages and platform announcements" value={notifications.messages} onChange={() => setNotifications(n => ({ ...n, messages: !n.messages }))} icon={<MessageSquare size={14} />} color="#F59E0B" />
                    <ToggleRow label="Weekly Summary" sub="Performance digest every Monday" value={notifications.weekly} onChange={() => setNotifications(n => ({ ...n, weekly: !n.weekly }))} icon={<BarChart3 size={14} />} color="#06B6D4" />
                  </Card>
                </motion.div>
              )}

              {activeProfileTab === "achievements" && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {achievements.map((ach) => (
                      <div key={ach.id}
                        className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${ach.earned ? "bg-white border-gray-100 shadow-sm" : "bg-gray-50 border-gray-100 opacity-50"}`}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: ach.earned ? `${ach.color}15` : "#F3F4F6", color: ach.earned ? ach.color : "#9CA3AF" }}>
                          {ach.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="text-[11px] font-black text-gray-900 leading-none">{ach.title}</p>
                            {ach.earned && <Check size={10} className="text-green-500" />}
                          </div>
                          <p className="text-[9px] text-gray-400 font-medium mt-1">{ach.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 rounded-2xl border border-blue-100 bg-blue-50 text-center">
                    <Trophy size={20} className="mx-auto text-blue-500 mb-2" />
                    <p className="text-[11px] font-black text-gray-800">{achievements.filter(a => a.earned).length} of {achievements.length} badges earned</p>
                    <p className="text-[9px] text-gray-400 font-medium mt-1">Purchase HU and start gigs to unlock more achievements</p>
                    <button onClick={openRefill} className="mt-3 px-4 py-2 rounded-xl text-[10px] font-bold text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 transition-all">
                      Unlock Gigs →
                    </button>
                  </div>
                </motion.div>
              )}

              {activeProfileTab === "settings" && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <Card className="p-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">App Settings</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-3 border-b border-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500"><Languages size={14} /></div>
                          <div>
                            <p className="text-[11px] font-bold text-gray-800">Language</p>
                            <p className="text-[9px] text-gray-400 font-medium">Display language</p>
                          </div>
                        </div>
                        <select value={selectedLang} onChange={e => { setSelectedLang(e.target.value); addToast("Language updated", "success"); }}
                          className="text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none cursor-pointer">
                          <option>English</option>
                          <option>Français</option>
                          <option>Español</option>
                          <option>Deutsch</option>
                          <option>Swahili</option>
                          <option>Arabic</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center text-green-500"><DollarSign size={14} /></div>
                          <div>
                            <p className="text-[11px] font-bold text-gray-800">Currency</p>
                            <p className="text-[9px] text-gray-400 font-medium">How amounts are displayed</p>
                          </div>
                        </div>
                        <select value={currency} onChange={e => setCurrency(e.target.value as typeof currency)}
                          className="text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none cursor-pointer">
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="KES">KES</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500"><Globe size={14} /></div>
                          <div>
                            <p className="text-[11px] font-bold text-gray-800">Availability</p>
                            <p className="text-[9px] text-gray-400 font-medium">Visible to clients</p>
                          </div>
                        </div>
                        <select value={profileAvailability} onChange={e => { setProfileAvailability(e.target.value); addToast("Availability updated", "success"); }}
                          className="text-[10px] font-bold text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none cursor-pointer">
                          <option>Available Now</option>
                          <option>Part-time Only</option>
                          <option>Unavailable</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500"><Clock size={14} /></div>
                          <div>
                            <p className="text-[11px] font-bold text-gray-800">Timezone</p>
                            <p className="text-[9px] text-gray-400 font-medium">Auto-detected</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-500">UTC±Auto</span>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Account Actions</p>
                    <div className="space-y-2">
                      <button onClick={() => addToast("Data export requested — email sent within 24h", "info")}
                        className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all flex items-center gap-3 text-left">
                        <Download size={15} className="text-gray-500 shrink-0" />
                        <div>
                          <p className="text-[11px] font-bold text-gray-700">Export My Data</p>
                          <p className="text-[9px] text-gray-400 font-medium">Download all your account data (GDPR)</p>
                        </div>
                      </button>
                      <button onClick={() => addToast("Account deletion requires identity verification", "error")}
                        className="w-full p-3.5 rounded-xl border border-red-100 bg-red-50 hover:bg-red-100 transition-all flex items-center gap-3 text-left">
                        <Trash2 size={15} className="text-red-500 shrink-0" />
                        <div>
                          <p className="text-[11px] font-bold text-red-600">Delete Account</p>
                          <p className="text-[9px] text-red-400 font-medium">Permanently remove your account</p>
                        </div>
                      </button>
                    </div>
                  </Card>
                  <SignOutButton>
                    <button className="w-full py-4 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition-all flex items-center justify-center gap-3 group">
                      <LogOut size={16} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                      <span className="text-[11px] font-black text-gray-500 group-hover:text-red-500 transition-colors uppercase tracking-widest">Sign Out</span>
                    </button>
                  </SignOutButton>
                </motion.div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ══ BOTTOM NAV ══ */}
      <div className="fixed bottom-0 left-0 right-0 z-100 border-t border-gray-100 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]"
        style={{ background: "rgba(255,255,255,0.96)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-5xl mx-auto h-18 flex items-center justify-around px-1 overflow-x-auto no-scrollbar">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 h-full flex-1 min-w-13 transition-all duration-200 relative ${activeTab === item.id ? "text-blue-600" : "text-gray-400 hover:text-gray-600"}`}>
              {activeTab === item.id && (
                <motion.span layoutId="nav-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-b-full bg-blue-600" />
              )}
              <div className={`transition-all duration-200 ${activeTab === item.id ? "scale-110" : "scale-100"}`}>{item.icon}</div>
              <span className={`text-[8px] font-bold uppercase tracking-widest leading-none whitespace-nowrap ${activeTab === item.id ? "text-blue-600" : "text-gray-400"}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ══ REFILL MODAL ══ */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-600 flex items-end sm:items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              style={{ backdropFilter: "blur(6px)" }}
              onClick={() => !isPaying && setShowModal(false)} />

            <motion.div initial={{ scale: 0.93, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.93, y: 24 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="relative w-full max-w-sm bg-white border border-gray-200 rounded-3xl p-6 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar">

              {/* ── PACKAGES STEP ── */}
              {modalStep === "packages" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[20px] font-black text-gray-900 leading-none">Buy HU</h3>
                      <p className="text-[11px] text-gray-400 font-medium mt-1">Purchase once — all matching gigs unlock instantly</p>
                    </div>
                    <button onClick={() => setShowModal(false)} className="p-2 bg-gray-100 rounded-xl text-gray-500 hover:bg-gray-200 transition-all">
                      <X size={16} />
                    </button>
                  </div>

                  <div className="p-3 rounded-xl border border-green-100 bg-green-50 flex items-center gap-3">
                    <PlayCircle size={14} className="text-green-600 shrink-0" />
                    <p className="text-[10px] font-semibold text-green-700">
                      <strong>No applications needed.</strong> Buy any package below and all matching freelance gigs are immediately available — no waiting, no screening.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {uplinkPackages.map((pack) => (
                      <div key={pack.id} onClick={() => { setSelectedPack(pack); setModalStep("choice"); setAgreed(false); }}
                        className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-md ${pack.highlight ? "border-purple-400 bg-purple-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                        {pack.hot && (
                          <div className="absolute -top-2.5 right-4 px-3 py-0.5 rounded-full text-[9px] font-black text-white"
                            style={{ background: "linear-gradient(135deg, #7C3AED, #0066FF)" }}>
                            MOST POPULAR
                          </div>
                        )}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${pack.color}15`, color: pack.color }}>
                              <Zap size={15} />
                            </div>
                            <div>
                              <p className="text-[13px] font-black text-gray-900">{pack.name}</p>
                              <p className="text-[9px] font-bold text-gray-400">{pack.hu} HU</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[20px] font-black" style={{ color: pack.color }}>${pack.price}</p>
                            <p className="text-[9px] text-gray-400 font-medium">one-time</p>
                          </div>
                        </div>
                        <p className="text-[10px] text-gray-500 font-medium mb-2">{pack.desc}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {pack.perks.map((perk, pi) => (
                            <div key={pi} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-bold" style={{ backgroundColor: `${pack.color}10`, color: pack.color }}>
                              <Check size={8} /> {perk}
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                          <p className="text-[9px] font-bold text-gray-400">{pack.access}</p>
                          <p className="text-[9px] font-black" style={{ color: pack.color }}>{pack.roi}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <ShieldCheck size={13} className="text-blue-500 shrink-0" />
                    <p className="text-[9px] text-gray-500 font-medium">Secure checkout · Instant HU credit · All payments encrypted</p>
                  </div>
                </div>
              )}

              {/* ── CHOICE STEP ── */}
              {modalStep === "choice" && selectedPack && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setModalStep("packages")} className="p-2 bg-gray-100 rounded-xl text-gray-500 hover:bg-gray-200 transition-all">
                      <ChevronLeft size={15} />
                    </button>
                    <div>
                      <h4 className="text-[13px] font-black text-gray-900">Choose Payment Method</h4>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                        {selectedPack.name} · {selectedPack.hu} HU · <span className="font-black" style={{ color: selectedPack.color }}>${selectedPack.price}.00 USD</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-blue-100 bg-blue-50 flex items-center gap-3">
                    <ShieldCheck size={13} className="text-blue-600 shrink-0" />
                    <p className="text-[10px] font-medium text-blue-700">
                      Secure checkout · {selectedPack.hu} HU credited instantly · All freelance gigs unlock after confirmation
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {/* Card / Paystack — Primary recommended */}
                    <RippleButton onClick={() => setModalStep("card")}
                      className="w-full p-4 rounded-2xl border-2 border-cyan-300 bg-cyan-50 hover:bg-cyan-100 transition-all flex items-center gap-4">
                      <PaystackLogo size={44} />
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-[13px] font-black text-gray-900">Card (Paystack)</p>
                          <Badge color="#00C3F7">Recommended</Badge>
                        </div>
                        <p className="text-[10px] font-medium text-gray-500">Visa / Mastercard · ${selectedPack.price}.00 USD</p>
                        <p className="text-[9px] font-bold text-cyan-600 mt-0.5">Worldwide · Near-instant · Buyer protection</p>
                      </div>
                      <ChevronRight size={16} className="text-gray-400 shrink-0" />
                    </RippleButton>

                    {/* Binance */}
                    <RippleButton onClick={() => setModalStep("binance")}
                      className="w-full p-4 rounded-2xl border border-yellow-200 bg-yellow-50 hover:bg-yellow-100 transition-all flex items-center gap-4">
                      <BinanceLogo size={44} />
                      <div className="flex-1 text-left">
                        <p className="text-[13px] font-black text-gray-900">Binance Pay</p>
                        <p className="text-[10px] font-medium text-gray-500 mt-0.5">USDT (TRC20 / ERC20) · ${selectedPack.price}.00</p>
                        <p className="text-[9px] font-bold text-yellow-600 mt-0.5">Worldwide · Instant settlement</p>
                      </div>
                      <ChevronRight size={16} className="text-gray-400 shrink-0" />
                    </RippleButton>

                    {/* M-Pesa */}
                    <RippleButton onClick={() => setModalStep("mpesa")}
                      className="w-full p-4 rounded-2xl border border-green-200 bg-green-50 hover:bg-green-100 transition-all flex items-center gap-4">
                      <MpesaLogoSVG size={44} />
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <p className="text-[13px] font-black text-gray-900">M-Pesa</p>
                          <Badge color="#16A34A">East Africa</Badge>
                        </div>
                        <p className="text-[10px] font-medium text-gray-500 mt-0.5">Safaricom STK Push · KES {selectedPack.price * 130}</p>
                        <p className="text-[9px] font-bold text-green-600 mt-0.5">Kenya, Tanzania, Uganda, Rwanda</p>
                      </div>
                      <ChevronRight size={16} className="text-gray-400 shrink-0" />
                    </RippleButton>

                    {/* PayPal — greyed out, limited regions */}
                    <div>
                      <div className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 flex items-center gap-4 opacity-55 cursor-not-allowed select-none">
                        <PayPalSVGLogo size={44} />
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <p className="text-[13px] font-black text-gray-600">PayPal</p>
                            <Badge color="#6B7280">Limited Regions</Badge>
                          </div>
                          <p className="text-[10px] font-medium text-gray-400 mt-0.5">${selectedPack.price}.00 USD</p>
                          <p className="text-[9px] font-bold text-gray-400 mt-0.5">EU, UK, US, Canada, Australia only</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5 px-1">
                        <AlertCircle size={10} className="text-amber-500 shrink-0" />
                        <p className="text-[9px] text-amber-600 font-semibold">Not available in your region — use Card (Paystack) or Binance instead</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} id="terms-agree" className="mt-0.5 accent-blue-600 shrink-0" />
                    <label htmlFor="terms-agree" className="text-[9px] text-gray-400 font-medium leading-relaxed cursor-pointer">
                      I agree to the Nexus Terms of Service and understand HU credits are non-refundable once gig access is granted.
                    </label>
                  </div>
                </div>
              )}

              {/* ── CARD / PAYSTACK STEP ── */}
              {modalStep === "card" && selectedPack && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setModalStep("choice")} className="p-2 bg-gray-100 rounded-xl text-gray-500 hover:bg-gray-200 transition-all">
                      <ChevronLeft size={15} />
                    </button>
                    <div>
                      <h4 className="text-[13px] font-black text-gray-900">Pay by Card (Paystack)</h4>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">Secure worldwide card checkout</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center py-5 gap-3">
                    <PaystackLogo size={80} />
                    <p className="text-[11px] text-gray-500 font-semibold">Paystack Secure Checkout</p>
                  </div>

                  <div className="p-4 bg-linear-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-2xl text-center">
                    <p className="text-[26px] font-black text-gray-900">${selectedPack.price}.00 <span className="text-[14px] font-bold text-gray-400">USD</span></p>
                    <p className="text-[11px] text-cyan-600 font-bold mt-1">KES {(selectedPack.price * 130).toLocaleString()} <span className="text-gray-400 font-medium">(charged currency)</span></p>
                    <p className="text-[10px] text-cyan-700 font-semibold mt-0.5">{selectedPack.hu} Handshake Units · {selectedPack.name} Pack</p>
                    <div className="flex items-center justify-center gap-1.5 mt-2">
                      <CheckCircle2 size={11} className="text-green-500" />
                      <p className="text-[9px] text-green-600 font-bold">All freelance gigs unlock instantly after payment</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl border border-gray-100 space-y-2.5" style={{ background: "#FAFBFF" }}>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">What happens next</p>
                    {[
                      { icon: <ExternalLink size={11} />, text: "Paystack's secure payment window opens in your browser" },
                      { icon: <CreditCard size={11} />, text: "Enter your Visa or Mastercard details on Paystack's PCI-DSS certified page" },
                      { icon: <CheckCircle2 size={11} />, text: "Payment confirmed — your HU balance is credited instantly" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-cyan-100 flex items-center justify-center shrink-0 text-cyan-600">
                          {item.icon}
                        </div>
                        <p className="text-[10px] text-gray-600 font-medium">{item.text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <ShieldCheck size={14} className="text-cyan-500 shrink-0" />
                    <p className="text-[10px] font-medium text-gray-500">256-bit SSL · PCI-DSS certified · Visa & Mastercard · No card data stored on our servers</p>
                  </div>

                  <RippleButton disabled={isPaying} onClick={() => handlePay("CARD")}
                    className="w-full py-4 rounded-xl text-[11px] font-black uppercase tracking-widest text-white flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg, #00C3F7, #011B33)" }}>
                    {isPaying
                      ? <><RefreshCw size={14} className="animate-spin" /> Opening Paystack…</>
                      : <><CreditCard size={14} /> Pay ${selectedPack.price}.00 via Paystack</>}
                  </RippleButton>
                  <p className="text-center text-[9px] text-gray-400 font-medium">Powered by Paystack · Available worldwide · Your email is shared with Paystack only</p>
                </div>
              )}

              {/* ── BINANCE STEP ── */}
              {modalStep === "binance" && selectedPack && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setModalStep("choice")} className="p-2 bg-gray-100 rounded-xl text-gray-500 hover:bg-gray-200 transition-all">
                      <ChevronLeft size={15} />
                    </button>
                    <h4 className="text-[13px] font-black text-gray-900">Pay with Binance</h4>
                  </div>

                  <div className="flex gap-2">
                    {(["TRC20", "ERC20"] as const).map(net => (
                      <button key={net} onClick={() => setSelectedCryptoNet(net)}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-black border transition-all ${selectedCryptoNet === net ? "bg-yellow-500 text-white border-yellow-500" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                        {net} {net === "TRC20" ? "(TRX)" : "(ETH)"}
                      </button>
                    ))}
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 flex justify-center border border-gray-200">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${BINANCE_WALLETS[selectedCryptoNet]}`}
                      alt="QR Code" className="w-36 h-36 block rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <p className="text-[9px] text-gray-400 font-medium mb-1">Amount</p>
                      <p className="text-[14px] font-black text-gray-900">${selectedPack.price}.00 USDT</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <p className="text-[9px] text-gray-400 font-medium mb-1">Network</p>
                      <p className="text-[14px] font-black text-yellow-600">{selectedCryptoNet}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-gray-500 mb-2">Wallet Address ({selectedCryptoNet})</p>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-[10px] font-mono text-gray-600 truncate">
                        {BINANCE_WALLETS[selectedCryptoNet]}
                      </div>
                      <button onClick={() => copyAddress(BINANCE_WALLETS[selectedCryptoNet])}
                        className="p-3 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 transition-all">
                        {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-gray-500" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                    <p className="text-[10px] font-bold text-amber-800">⚠️ Send only USDT on {selectedCryptoNet} network</p>
                    <p className="text-[9px] text-amber-600 font-medium mt-0.5">Wrong network = permanent loss of funds. Double-check before sending.</p>
                  </div>

                  <RippleButton onClick={() => handlePay("BINANCE")}
                    className="w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-white bg-yellow-500 hover:bg-yellow-600 transition-all">
                    I Have Paid — Confirm
                  </RippleButton>
                </div>
              )}

              {/* ── MPESA STEP ── */}
              {modalStep === "mpesa" && selectedPack && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setModalStep("choice")} className="p-2 bg-gray-100 rounded-xl text-gray-500 hover:bg-gray-200 transition-all">
                      <ChevronLeft size={15} />
                    </button>
                    <h4 className="text-[13px] font-black text-gray-900">Pay with M-Pesa</h4>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                    <div className="flex items-center gap-3 mb-1">
                      <CheckCircle size={15} className="text-green-500 shrink-0" />
                      <p className="text-[11px] font-black text-green-800">Total: KES {selectedPack.price * 130}</p>
                    </div>
                    <p className="text-[10px] text-green-600 font-medium pl-6">You get {selectedPack.hu} HU instantly. All freelance gigs unlock immediately after confirmation.</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-600 mb-2">Your Safaricom Number</p>
                    <input value={mpesaNum} onChange={(e) => setMpesaNum(e.target.value)} placeholder="254712345678"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-[18px] font-black text-gray-900 outline-none focus:border-green-400 text-center tracking-widest transition-all placeholder:text-gray-300 focus:bg-white" />
                    <p className="text-[10px] text-gray-400 font-medium mt-2 text-center">Format: 254XXXXXXXXX · 12 digits total</p>
                  </div>
                  <RippleButton disabled={isPaying} onClick={() => handlePay("MPESA")}
                    className="w-full py-4 rounded-xl text-[11px] font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 transition-all">
                    {isPaying
                      ? <><RefreshCw size={14} className="animate-spin" /> Sending prompt…</>
                      : `Pay KES ${selectedPack.price * 130} — Send to Phone`}
                  </RippleButton>
                  <p className="text-center text-[9px] text-gray-400 font-medium">Available in Kenya, Tanzania, Uganda, Rwanda · Instant STK Push</p>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        .font-sans { font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; }
      `}</style>
    </div>
  );
};
