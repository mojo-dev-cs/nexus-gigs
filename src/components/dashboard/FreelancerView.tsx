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
} from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface Toast {
  id: number;
  msg: string;
  type: "success" | "error" | "info";
}

type ModalStep = "packages" | "choice" | "card" | "paypal" | "crypto" | "wire" | "mpesa";
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
// Payment Method SVG Logos (Premium quality)
// ─────────────────────────────────────────────
const VisaLogo = ({ size = 44 }: { size?: number }) => (
  <div style={{ width: size, height: size, minWidth: size, background: "#1A1F71", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(26,31,113,0.3)" }}>
    <svg viewBox="0 0 80 26" width={size * 0.72} height={size * 0.72 * 0.325} fill="none">
      <path d="M30.5 0.8L25.8 25.2H20.2L24.9 0.8H30.5ZM52.6 16.6L55.5 8.5L57.2 16.6H52.6ZM59 25.2H64L59.7 0.8H54.9C53.7 0.8 52.8 1.5 52.4 2.6L44.2 25.2H50L51.2 21.8H58.3L59 25.2ZM45.3 17.4C45.3 11.3 37.1 10.9 37.1 8.3C37.1 7.5 37.9 6.6 39.7 6.4C40.5 6.3 42.8 6.2 45.3 7.4L46.3 2.4C44.9 1.8 43 0.8 40.4 0.8C35 0.8 31.1 3.8 31.1 8C31.1 11.1 33.8 12.8 35.9 13.9C38 15 38.7 15.7 38.7 16.7C38.7 18.3 36.7 19 34.8 19C31.9 19 30.3 18.2 29 17.5L28 22.7C29.4 23.4 31.9 24 34.5 24C40.3 24 44.1 21 44.1 16.5C44.1 16.5 45.3 17.4 45.3 17.4ZM23.9 0.8L14.9 25.2H9L4.5 4.9C4.2 3.7 3.9 3.2 3 2.7C1.5 1.9 -0.1 1.3 -1 1L-0.9 0.8H9C10.3 0.8 11.4 1.7 11.7 3.1L13.9 14.8L19.1 0.8H23.9Z" fill="white"/>
    </svg>
  </div>
);

const MastercardLogo = ({ size = 44 }: { size?: number }) => (
  <div style={{ width: size, height: size, minWidth: size, background: "#252525", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
    <svg viewBox="0 0 52 32" width={size * 0.75} height={size * 0.75 * 0.615}>
      <circle cx="16" cy="16" r="16" fill="#EB001B"/>
      <circle cx="36" cy="16" r="16" fill="#F79E1B"/>
      <path d="M26 5.8C29.1 8.2 31.2 11.9 31.2 16C31.2 20.1 29.1 23.8 26 26.2C22.9 23.8 20.8 20.1 20.8 16C20.8 11.9 22.9 8.2 26 5.8Z" fill="#FF5F00"/>
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

const StripeLogo = ({ size = 44 }: { size?: number }) => (
  <div style={{ width: size, height: size, minWidth: size, background: "linear-gradient(135deg, #635BFF, #4F46E5)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(99,91,255,0.35)" }}>
    <svg viewBox="0 0 24 24" width={size * 0.52} height={size * 0.52} fill="white">
      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
    </svg>
  </div>
);

const USDTLogo = ({ size = 44 }: { size?: number }) => (
  <div style={{ width: size, height: size, minWidth: size, background: "linear-gradient(135deg, #26A17B, #1a8a65)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(38,161,123,0.35)" }}>
    <svg viewBox="0 0 32 32" width={size * 0.62} height={size * 0.62} fill="white">
      <path d="M18 8H14V12H6V15.5H26V12H18V8Z"/>
      <path d="M16 16.5C19.5 16.5 22.5 17.1 24.5 18C22.5 18.9 19.5 19.5 16 19.5C12.5 19.5 9.5 18.9 7.5 18C9.5 17.1 12.5 16.5 16 16.5Z"/>
      <rect x="14.5" y="19" width="3" height="7" rx="1"/>
    </svg>
  </div>
);

const WireTransferLogo = ({ size = 44 }: { size?: number }) => (
  <div style={{ width: size, height: size, minWidth: size, background: "linear-gradient(135deg, #1E40AF, #1D4ED8)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(30,64,175,0.35)" }}>
    <svg viewBox="0 0 32 32" width={size * 0.62} height={size * 0.62} fill="white">
      <rect x="4" y="22" width="24" height="3" rx="1.5" opacity="0.95"/>
      <rect x="6" y="13" width="3.5" height="9" rx="1"/>
      <rect x="14.25" y="13" width="3.5" height="9" rx="1"/>
      <rect x="22.5" y="13" width="3.5" height="9" rx="1"/>
      <polygon points="16,3 28,12 4,12" opacity="0.9"/>
      <rect x="4" y="25.5" width="24" height="1.5" rx="0.75" opacity="0.5"/>
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

const CryptoLogo = ({ size = 44, coin = "BTC" }: { size?: number; coin?: string }) => (
  <div style={{ width: size, height: size, minWidth: size, background: coin === "BTC" ? "linear-gradient(135deg, #F7931A, #E8720C)" : "linear-gradient(135deg, #627EEA, #4B5EDB)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 2px 8px ${coin === "BTC" ? "rgba(247,147,26,0.35)" : "rgba(98,126,234,0.35)"}` }}>
    {coin === "BTC"
      ? <svg viewBox="0 0 24 24" width={size * 0.52} height={size * 0.52} fill="white"><path d="M17.06 11.57c.48-1.6-.98-2.46-2.64-3.03l.54-2.16-1.32-.33-.52 2.1c-.35-.09-.7-.17-1.05-.25l.53-2.12-1.32-.33-.54 2.16c-.29-.07-.57-.13-.84-.2l.01-.04-1.82-.46-.35 1.41s.98.22.96.24c.54.13.63.49.62.77l-1.5 6.02c-.06.16-.22.39-.57.3.01.02-.96-.24-.96-.24l-.66 1.51 1.72.43c.32.08.63.16.94.24l-.55 2.18 1.32.33.54-2.17c.36.1.71.19 1.06.27l-.54 2.15 1.32.33.55-2.18c2.28.43 3.99.26 4.71-1.8.58-1.66-.03-2.62-1.23-3.24.88-.2 1.54-.77 1.72-1.95zm-3.08 4.32c-.41 1.66-3.22.76-4.13.54l.74-2.95c.91.23 3.81.67 3.39 2.41zm.42-4.35c-.38 1.51-2.72.74-3.47.55l.67-2.68c.76.19 3.19.54 2.8 2.13z"/></svg>
      : <svg viewBox="0 0 28 28" width={size * 0.52} height={size * 0.52} fill="white"><path d="M14 2L4 9l10 3 10-3L14 2zM4 19l10 7 10-7-10-3-10 3zM4 14l10 3 10-3-10-3-10 3z" opacity="0.9"/></svg>
    }
  </div>
);

// ─────────────────────────────────────────────
// HU Explainer Component
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
        HU are your platform access tokens. They replace traditional "job board fees" with a fair, transparent system — you only spend tokens when you apply, keeping out spam so <strong>serious workers like you</strong> get noticed by top clients.
      </p>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { step: "1", icon: <Zap size={13} />, label: "Buy HU", sub: "Pick a package", color: "#3B82F6" },
          { step: "2", icon: <Briefcase size={13} />, label: "Apply to Jobs", sub: "Spend HU to apply", color: "#8B5CF6" },
          { step: "3", icon: <DollarSign size={13} />, label: "Get Hired & Earn", sub: "Withdraw your pay", color: "#10B981" },
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
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[
          { label: "Basic jobs", cost: "10 HU", value: "Up to $120 budget", color: "#10B981" },
          { label: "Standard jobs", cost: "20 HU", value: "Up to $600 budget", color: "#3B82F6" },
          { label: "Advanced jobs", cost: "30 HU", value: "Up to $2,200 budget", color: "#8B5CF6" },
          { label: "Corporate roles", cost: "50–100 HU", value: "$7,500–$17,000/mo", color: "#EF4444" },
        ].map((t, i) => (
          <div key={i} className="bg-white rounded-xl p-2.5 border border-white/80 flex items-center gap-2 shadow-sm">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-black text-gray-800 leading-none">{t.label}</p>
              <p className="text-[8px] text-gray-500 font-medium mt-0.5">{t.cost} · {t.value}</p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={onTopUp}
        className="w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all hover:opacity-90"
        style={{ background: "linear-gradient(135deg, #4F46E5, #0066FF)" }}>
        Get Started — Buy HU Now →
      </button>
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
  const [showApiKey, setShowApiKey] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);

  const uplinkPackages = [
    {
      id: 1, name: "Starter", price: 3, hu: 150,
      desc: "Get your first applications in fast.",
      hot: false, highlight: false,
      jobs: "Apply to 15 basic jobs",
      roi: "Potential $1,200 earnings",
      color: "#10B981",
    },
    {
      id: 2, name: "Basic", price: 6, hu: 400,
      desc: "Best for active job seekers.",
      hot: false, highlight: false,
      jobs: "Apply to 40 basic or 20 standard jobs",
      roi: "Potential $4,800 earnings",
      color: "#3B82F6",
    },
    {
      id: 3, name: "Pro Uplink", price: 10, hu: 1200,
      desc: "Unlock global company missions.",
      hot: true, highlight: true,
      jobs: "Apply to 40 standard + corporate jobs",
      roi: "Potential $15,000 earnings",
      color: "#0066FF",
    },
    {
      id: 4, name: "Elite", price: 18, hu: 2500,
      desc: "Priority access + verified status boost.",
      hot: false, highlight: false,
      jobs: "Apply to 50 advanced + expert jobs",
      roi: "Potential $40,000 earnings",
      color: "#8B5CF6",
    },
    {
      id: 5, name: "Alpha", price: 30, hu: 5000,
      desc: "Full platform power for top-tier workers.",
      hot: false, highlight: false,
      jobs: "Unlimited applications for 30 days",
      roi: "Potential $100,000+ earnings",
      color: "#EF4444",
    },
  ];

  const marketplaceGigs = useMemo(() => [
    { id: "m1", title: "Fix Bugs in WordPress Site", budget: 80, client: "BlogPro Media", avatar: "BP", type: "Web Dev", duration: "2 Days", cost: 10, level: "Basic" },
    { id: "m2", title: "Write 5 Finance Blog Posts", budget: 120, client: "Money Tips", avatar: "MT", type: "Writing", duration: "4 Days", cost: 10, level: "Basic" },
    { id: "m3", title: "Logo Design for Restaurant", budget: 90, client: "Taste Studio", avatar: "TS", type: "Design", duration: "3 Days", cost: 10, level: "Basic" },
    { id: "m4", title: "Instagram Business Page Setup", budget: 60, client: "Fashionista Co", avatar: "FC", type: "Marketing", duration: "1 Day", cost: 10, level: "Basic" },
    { id: "m5", title: "Excel Data Entry & Cleanup", budget: 75, client: "Accounts Plus", avatar: "AP", type: "Data", duration: "2 Days", cost: 10, level: "Basic" },
    { id: "m6", title: "YouTube Video Editing (5 videos)", budget: 200, client: "Content King", avatar: "CK", type: "Video", duration: "5 Days", cost: 10, level: "Basic" },
    { id: "m7", title: "Build E-Commerce Website", budget: 450, client: "ShopEasy Ltd", avatar: "SE", type: "Web Dev", duration: "7 Days", cost: 20, level: "Standard" },
    { id: "m8", title: "Startup Pitch Deck Design", budget: 350, client: "Venture Lab", avatar: "VL", type: "Design", duration: "5 Days", cost: 20, level: "Standard" },
    { id: "m9", title: "Python Automated Reporting Script", budget: 280, client: "DataFlow Inc", avatar: "DF", type: "Data", duration: "4 Days", cost: 20, level: "Standard" },
    { id: "m10", title: "Social Media Management (1 Month)", budget: 400, client: "BrandBoost", avatar: "BB", type: "Marketing", duration: "30 Days", cost: 20, level: "Standard" },
    { id: "m11", title: "Mobile App UI Design (Figma)", budget: 600, client: "AppCraft Studio", avatar: "AC", type: "Design", duration: "8 Days", cost: 20, level: "Standard" },
    { id: "m12", title: "SEO Optimization for Business Site", budget: 320, client: "Rank Fast", avatar: "RF", type: "Marketing", duration: "5 Days", cost: 20, level: "Standard" },
    { id: "m13", title: "Full-Stack Web App (React & Node)", budget: 1200, client: "TechBuild Global", avatar: "TB", type: "Web Dev", duration: "14 Days", cost: 30, level: "Advanced" },
    { id: "m14", title: "AI Chatbot for Customer Support", budget: 950, client: "RetailBot Inc", avatar: "RB", type: "AI", duration: "10 Days", cost: 30, level: "Advanced" },
    { id: "m15", title: "Cybersecurity Audit for Company", budget: 1500, client: "SecureNet Ltd", avatar: "SN", type: "Security", duration: "7 Days", cost: 30, level: "Advanced" },
    { id: "m16", title: "Smart Contract Development (Solidity)", budget: 1800, client: "Nexus Protocol", avatar: "NP", type: "Web3", duration: "10 Days", cost: 30, level: "Advanced" },
    { id: "m17", title: "ML Model for Sales Predictions", budget: 1400, client: "Predict Pro", avatar: "PP", type: "AI", duration: "12 Days", cost: 30, level: "Advanced" },
    { id: "m18", title: "Next.js Performance & SEO Overhaul", budget: 1800, client: "E-Com Solutions", avatar: "EC", type: "Web Dev", duration: "10 Days", cost: 30, level: "Advanced" },
    { id: "m19", title: "Brand Identity Design System", budget: 2200, client: "Branding Co", avatar: "BC", type: "Design", duration: "14 Days", cost: 30, level: "Advanced" },
    { id: "m20", title: "API Security Penetration Testing", budget: 2100, client: "SafeVault Corp", avatar: "SV", type: "Security", duration: "7 Days", cost: 50, level: "Expert" },
    { id: "m21", title: "NFT Collection + Smart Contracts + Frontend", budget: 2800, client: "CryptoArt Hub", avatar: "CA", type: "Web3", duration: "14 Days", cost: 50, level: "Expert" },
    { id: "m22", title: "Enterprise CRM Custom Integration", budget: 3200, client: "SalesForce Partners", avatar: "SP", type: "Web Dev", duration: "21 Days", cost: 50, level: "Expert" },
    { id: "m23", title: "Deep Learning Computer Vision System", budget: 4000, client: "VisionAI Labs", avatar: "VA", type: "AI", duration: "21 Days", cost: 50, level: "Expert" },
    { id: "m24", title: "DeFi Protocol Architecture & Audit", budget: 5000, client: "DeFi Builders DAO", avatar: "DB", type: "Web3", duration: "30 Days", cost: 50, level: "Expert" },
  ], []);

  const corporateGigs = useMemo(() => [
    { id: "c1", title: "Remote Fleet Data Analyst", salary: 8000, domain: "tesla.com", company: "Tesla", cost: 50, badge: "EV · Remote", dept: "Engineering" },
    { id: "c2", title: "Cloud Support Engineer", salary: 9000, domain: "amazon.com", company: "Amazon", cost: 50, badge: "AWS · Senior", dept: "Cloud" },
    { id: "c3", title: "Payment Integrity Analyst", salary: 11000, domain: "stripe.com", company: "Stripe", cost: 50, badge: "FinTech · Remote", dept: "Finance" },
    { id: "c4", title: "Security Operations Specialist", salary: 12000, domain: "kraken.com", company: "Kraken", cost: 50, badge: "Crypto · Remote", dept: "Security" },
    { id: "c5", title: "Frontend Engineer (React)", salary: 10500, domain: "shopify.com", company: "Shopify", cost: 50, badge: "E-Com · Remote", dept: "Engineering" },
    { id: "c6", title: "Data Platform Engineer", salary: 13500, domain: "databricks.com", company: "Databricks", cost: 100, badge: "Data · Senior", dept: "Data" },
    { id: "c7", title: "Product Manager — Global Expansion", salary: 9500, domain: "google.com", company: "Google", cost: 100, badge: "Remote · Senior", dept: "Product" },
    { id: "c8", title: "Mobile Engineer (iOS/Android)", salary: 11000, domain: "meta.com", company: "Meta", cost: 100, badge: "Remote · Mid", dept: "Engineering" },
    { id: "c9", title: "DevOps Engineer", salary: 10000, domain: "microsoft.com", company: "Microsoft", cost: 50, badge: "Azure · Remote", dept: "Infrastructure" },
    { id: "c10", title: "UX Researcher", salary: 8500, domain: "airbnb.com", company: "Airbnb", cost: 50, badge: "Remote · Contract", dept: "Design" },
    { id: "c11", title: "Blockchain Developer", salary: 14000, domain: "coinbase.com", company: "Coinbase", cost: 100, badge: "Crypto · Remote", dept: "Engineering" },
    { id: "c12", title: "Growth Marketing Manager", salary: 9000, domain: "spotify.com", company: "Spotify", cost: 50, badge: "Marketing · Remote", dept: "Marketing" },
    { id: "c13", title: "ML Infrastructure Engineer", salary: 15000, domain: "openai.com", company: "OpenAI", cost: 100, badge: "AI · Remote", dept: "AI" },
    { id: "c14", title: "Backend Engineer (Go/Rust)", salary: 12000, domain: "discord.com", company: "Discord", cost: 50, badge: "Remote · Mid", dept: "Engineering" },
    { id: "c15", title: "Data Scientist — Ads Platform", salary: 13000, domain: "twitter.com", company: "X (Twitter)", cost: 100, badge: "Data · Senior", dept: "Data" },
    { id: "c16", title: "Smart Contract Auditor", salary: 17000, domain: "binance.com", company: "Binance", cost: 100, badge: "Crypto · Senior", dept: "Security" },
    { id: "c17", title: "API Developer (Payments)", salary: 10000, domain: "paypal.com", company: "PayPal", cost: 50, badge: "FinTech · Remote", dept: "Engineering" },
    { id: "c18", title: "Content Strategy Manager", salary: 7500, domain: "hubspot.com", company: "HubSpot", cost: 30, badge: "Marketing · Remote", dept: "Marketing" },
    { id: "c19", title: "Cloud Security Architect", salary: 16000, domain: "cloudflare.com", company: "Cloudflare", cost: 100, badge: "Security · Senior", dept: "Security" },
    { id: "c20", title: "iOS Engineer", salary: 11500, domain: "uber.com", company: "Uber", cost: 50, badge: "Mobile · Remote", dept: "Engineering" },
    { id: "c21", title: "Full Stack Engineer (TypeScript)", salary: 10000, domain: "notion.so", company: "Notion", cost: 50, badge: "SaaS · Remote", dept: "Engineering" },
    { id: "c22", title: "Analytics Engineer", salary: 9500, domain: "figma.com", company: "Figma", cost: 50, badge: "Design · Remote", dept: "Data" },
  ], []);

  const gigCategories = ["All", "Web Dev", "Design", "Writing", "Marketing", "Data", "AI", "Security", "Web3", "Video"];
  const corpDepts = ["All", "Engineering", "Data", "Security", "Marketing", "Product", "Design", "AI", "Infrastructure", "Finance"];

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
    { sender: "Nexus HQ", body: "Welcome to Nexus! Handshake Units (HU) are your access tokens — buy HU to apply for jobs globally. The system keeps out spam so you get noticed faster.", time: "Just now", unread: true, avatar: "🏢" },
    { sender: "Security Bot", body: "Your connection is encrypted and secure. You have 5 HU left. You need at least 10 HU to apply for any job. Pick a package to get started immediately.", time: "14m ago", unread: true, avatar: "🤖" },
    { sender: "Exchange Relay", body: "Currency rates updated. Switch between USD, EUR, GBP and more in your wallet settings. Withdrawals are available in your local currency.", time: "1h ago", unread: false, avatar: "📡" },
  ];

  const openRefill = () => { setModalStep("packages"); setShowModal(true); };

  const handleApply = (cost: number) => {
    if (huBalance >= cost) {
      setHuBalance((p) => p - cost);
      addToast(`Application sent! −${cost} HU used`, "success");
    } else {
      addToast(`You need ${cost - huBalance} more HU to apply`, "error");
      openRefill();
    }
  };

  const handlePay = async (method: "CARD" | "MPESA" | "PAYPAL") => {
    if (!agreed) return addToast("Please agree to the terms first.", "info");
    if (!selectedPack) return addToast("Please select a package first.", "error");
    setIsPaying(true);
    try {
      if (method === "CARD") {
        const kesAmount = selectedPack.price * 130;
        const res = await fetch("/api/paystack", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: kesAmount, currency: "KES",
            email: user?.primaryEmailAddress?.emailAddress,
            metadata: { hu: selectedPack.hu, pack: selectedPack.name },
          }),
        });
        const data = await res.json();
        if (data?.data?.authorization_url) window.location.href = data.data.authorization_url;
        else addToast("Payment error. Please try again.", "error");
      } else if (method === "MPESA") {
        const clean = mpesaNum.replace(/\D/g, "");
        if (!clean.startsWith("254") || clean.length !== 12) {
          addToast("Please use format: 254XXXXXXXXX (12 digits)", "error"); return;
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

  const CRYPTO_WALLETS = {
    TRC20: "TFWxe4TFcjUNgPJVgf5iXrMsw1oe4gDv9X",
    ERC20: "0x742d35Cc6634C0532925a3b8D4c9F1B7e9f6c89",
  };

  const faqItems = [
    { q: "What are Handshake Units (HU)?", a: "HU are your access tokens on the Nexus platform. Each time you apply for a job, some HU are used. This keeps out fake applicants and makes sure only serious workers can apply. Higher-paying jobs cost more HU — but the earning potential is proportionally higher too." },
    { q: "Which countries can use Nexus?", a: "Nexus is a fully global platform. Workers from any country can sign up, apply to jobs, and get paid. Clients post jobs from North America, Europe, Asia, Africa, and beyond. You can work from anywhere with an internet connection." },
    { q: "What payment methods are available?", a: "We support Credit/Debit Cards (Visa/Mastercard via Stripe globally), PayPal (200+ countries), Crypto USDT (TRC20/ERC20 worldwide), International Bank Wire (SWIFT), and M-Pesa (East Africa). We're constantly adding new methods." },
    { q: "How fast does payment processing work?", a: "Card payments via Stripe are instant. Crypto confirmations take 5–30 minutes. Bank wire takes 1–3 business days. M-Pesa is instant. HU balances are credited automatically once payment is confirmed." },
    { q: "Can I withdraw my money?", a: "Yes! Once your balance reaches $50, you can withdraw via Bank Transfer (SWIFT), Crypto USDT, PayPal, or M-Pesa. Simply go to your Wallet tab and request a withdrawal. Verified accounts get priority processing." },
    { q: "How many HU do I need to apply?", a: "Basic jobs (up to $120): 10 HU. Standard jobs (up to $600): 20 HU. Advanced jobs (up to $2,200): 30 HU. Expert jobs ($2,000+): 50 HU. Corporate positions from top companies: 50–100 HU due to higher client standards." },
    { q: "Is my information safe?", a: "Absolutely. All data is protected using TLS 1.3 encryption in transit and AES-256 at rest. We are compliant with GDPR and never share your personal details without your explicit consent. Your financial data is handled by certified payment processors." },
  ];

  const achievements = [
    { id: 1, title: "First Login", desc: "Joined the platform", icon: <Star size={16} />, color: "#F59E0B", earned: true },
    { id: 2, title: "Profile Set Up", desc: "Completed your profile", icon: <UserCheck size={16} />, color: "#10B981", earned: true },
    { id: 3, title: "First Application", desc: "Applied to your first job", icon: <Briefcase size={16} />, color: "#3B82F6", earned: false },
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

          {/* ══════════════════════════════════════════════
              HOME
          ══════════════════════════════════════════════ */}
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

              {/* Main cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-3 rounded-2xl p-6 text-white shadow-md"
                  style={{ background: "linear-gradient(135deg, #0047B3 0%, #0066FF 60%, #1D8EF0 100%)" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <ShieldCheck size={18} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black uppercase tracking-wide">Handshake Units Required</h4>
                      <p className="text-[9px] text-blue-200 mt-0.5">Your key to global job opportunities</p>
                    </div>
                  </div>
                  <p className="text-[12px] text-blue-100 leading-relaxed mb-5">
                    Every job application uses <strong className="text-white">Handshake Units (HU)</strong>. This keeps out spam and puts serious workers like you <strong className="text-white">first in hiring queues</strong> worldwide — from New York to Tokyo.
                  </p>
                  <div className="flex gap-2">
                    <RippleButton onClick={openRefill}
                      className="flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-700 bg-white hover:bg-blue-50 transition-all">
                      Top Up HU
                    </RippleButton>
                    <button onClick={() => setActiveTab("tasks")}
                      className="px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/30 text-white/80 hover:text-white hover:bg-white/10 transition-all">
                      Browse Jobs →
                    </button>
                  </div>
                </div>
                <div className="md:col-span-2 grid grid-cols-2 gap-3">
                  <StatCard label="Success Rate" value="0%" icon={<CheckCircle2 size={15} />} color="#10B981" />
                  <StatCard label="Uptime" value="99.9%" icon={<Wifi size={15} />} color="#3B82F6" />
                  <StatCard label="Live Jobs" value={marketplaceGigs.length + corporateGigs.length} icon={<Target size={15} />} color="#8B5CF6" />
                  <StatCard label="Countries" value="195+" icon={<Globe size={15} />} color="#F59E0B" />
                </div>
              </div>

              {/* Low HU Warning */}
              {huBalance < 10 && (
                <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-xl border border-amber-200 bg-amber-50 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                    <Info size={18} className="text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-black text-amber-800 uppercase tracking-wide">You need at least 10 HU to apply for any job</p>
                    <p className="text-[10px] text-amber-600 font-medium mt-0.5">Current balance: {huBalance} HU · You need {10 - huBalance} more HU to start applying</p>
                  </div>
                  <button onClick={openRefill} className="shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white bg-amber-500 hover:bg-amber-600 transition-all">
                    Top Up
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
                  { icon: <Zap size={18} />, label: "Top Up HU", color: "#3B82F6", bg: "#EFF6FF", action: openRefill },
                  { icon: <Briefcase size={18} />, label: "Browse Jobs", color: "#8B5CF6", bg: "#F5F3FF", action: () => setActiveTab("tasks") },
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
                  <p className="text-[10px] text-gray-400 font-medium mt-1">Apply to your first job and your live updates appear here in real time.</p>
                  <button onClick={() => setActiveTab("tasks")}
                    className="mt-4 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-700 bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-all">
                    Browse Jobs
                  </button>
                </div>
              </Card>

              {/* Featured companies */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Top Companies Hiring Globally</p>
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
                <StatCard label="Jobs Posted Today" value="2,341" icon={<Briefcase size={15} />} color="#3B82F6" sub="Last 24h" />
                <StatCard label="Avg Job Value" value={fmt(847)} icon={<TrendingUp size={15} />} color="#8B5CF6" sub="Per project" />
                <StatCard label="Paid Out" value="$4.2M" icon={<DollarSign size={15} />} color="#F59E0B" sub="This month" />
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════
              JOBS
          ══════════════════════════════════════════════ */}
          {activeTab === "tasks" && (
            <motion.div key="tasks" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <SectionHead label="Global Job Board" sub={`${filteredMarket.length + filteredCorp.length} jobs available worldwide`} />
                <Badge color="#10B981"><PulseDot color="#10B981" size={5} /> Hiring Open</Badge>
              </div>

              {huBalance < 10 && (
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                    <Lock size={18} className="text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-black text-amber-800">You can browse all jobs, but need {10 - huBalance} more HU to apply</p>
                    <p className="text-[10px] text-amber-600 font-medium mt-0.5">Top up HU to start applying instantly to jobs worldwide</p>
                  </div>
                  <button onClick={openRefill} className="shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-white bg-amber-500 hover:bg-amber-600 transition-all">
                    Top Up Now
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
                  <div className="flex gap-2 flex-wrap">
                    <div className="flex-1 min-w-50 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5">
                      <Search size={14} className="text-gray-400 shrink-0" />
                      <input value={gigSearch} onChange={e => setGigSearch(e.target.value)} placeholder="Search jobs or clients..."
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
                    {[["Basic", "10 HU", "#10B981"], ["Standard", "20 HU", "#3B82F6"], ["Advanced", "30 HU", "#8B5CF6"], ["Expert", "50 HU", "#EF4444"]].map(([l, h, c]) => (
                      <div key={l} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-100 rounded-lg">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
                        <span className="text-[9px] font-bold text-gray-500">{l}: {h}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredMarket.map((g) => {
                      const canApply = huBalance >= g.cost;
                      const lc = levelColors[g.level] || "#3B82F6";
                      const tc = typeColors[g.type] || "#3B82F6";
                      return (
                        <motion.div key={g.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group">
                          <div className="flex items-start justify-between mb-3">
                            <MarketplaceAvatar initials={g.avatar} type={g.type} seed={g.client} size={44} />
                            <div className="flex gap-1 flex-wrap justify-end">
                              <Badge color={tc}>{g.type}</Badge>
                              <Badge color={lc}>{g.level}</Badge>
                            </div>
                          </div>
                          <h4 className="text-[12px] font-black text-gray-900 mb-1 leading-snug line-clamp-2">{g.title}</h4>
                          <p className="text-[10px] text-gray-400 font-medium mb-4">{g.client} · {g.duration}</p>
                          <div className="flex items-center gap-1.5 mb-3 px-3 py-2 rounded-lg"
                            style={{ backgroundColor: `${lc}10`, border: `1px solid ${lc}30` }}>
                            <Zap size={11} style={{ color: lc }} />
                            <span className="text-[9px] font-black uppercase" style={{ color: lc }}>Requires {g.cost} HU to apply</span>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                            <div>
                              <p className="text-[16px] font-black text-gray-900 leading-none">{fmt(g.budget)}</p>
                              <p className="text-[8px] text-gray-400 font-medium mt-0.5">Project budget</p>
                            </div>
                            {canApply
                              ? <RippleButton onClick={() => handleApply(g.cost)}
                                  className="px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-white"
                                  style={{ background: `linear-gradient(135deg, ${tc}, ${tc}cc)` }}>
                                  Apply · {g.cost} HU
                                </RippleButton>
                              : <button onClick={openRefill}
                                  className="px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 transition-all">
                                  <Lock size={10} /> Need {g.cost} HU
                                </button>
                            }
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  {filteredMarket.length === 0 && (
                    <div className="text-center py-16 text-gray-400">
                      <Search size={32} className="mx-auto mb-3 opacity-40" />
                      <p className="text-[13px] font-semibold">No jobs match your search</p>
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
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 flex items-center gap-3">
                    <Building2 size={15} className="text-blue-600 shrink-0" />
                    <p className="text-[10px] font-semibold text-blue-700">Corporate roles require <strong>50–100 HU</strong> due to higher client standards, verification, and global salary levels.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredCorp.map((c) => {
                      const canApply = huBalance >= c.cost;
                      const costColor = c.cost >= 100 ? "#EF4444" : "#8B5CF6";
                      return (
                        <div key={c.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-gray-200 transition-all">
                          <div className="flex items-center gap-4 mb-4">
                            <CompanyLogo name={c.company} domain={c.domain} size={56} />
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
                              <p className="text-[9px] text-gray-400 font-medium mt-0.5">per month</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 mb-3 px-3 py-2 rounded-lg"
                            style={{ backgroundColor: `${costColor}0f`, border: `1px solid ${costColor}25` }}>
                            <Zap size={11} style={{ color: costColor }} />
                            <span className="text-[9px] font-black uppercase" style={{ color: costColor }}>Requires {c.cost} HU to apply</span>
                            {c.cost >= 100 && <span className="ml-auto text-[8px] font-bold text-red-400">Premium Role</span>}
                          </div>
                          {canApply
                            ? <RippleButton onClick={() => handleApply(c.cost)}
                                className="w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white flex items-center justify-center gap-2"
                                style={{ background: "linear-gradient(135deg, #0066FF, #0047B3)" }}>
                                <Zap size={12} /> Apply · {c.cost} HU <ArrowUpRight size={12} />
                              </RippleButton>
                            : <button onClick={openRefill}
                                className="w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 transition-all">
                                <Lock size={13} /> Need {c.cost} HU to Apply
                              </button>
                          }
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════
              WALLET
          ══════════════════════════════════════════════ */}
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
                      <p className="text-[10px] font-medium text-gray-500">Available to use on jobs</p>
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
                      <RippleButton onClick={() => addToast("Minimum withdrawal is $50.00. Complete your first job to earn.", "info")}
                        className="mt-5 w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-green-200 text-green-700 hover:bg-green-100 transition-all flex items-center justify-center gap-2">
                        Withdraw Money <ArrowUpRight size={13} />
                      </RippleButton>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <StatCard label="Total Earned" value={fmt(0)} icon={<TrendingUp size={15} />} color="#10B981" sub="All time" />
                    <StatCard label="Withdrawn" value={fmt(0)} icon={<Download size={15} />} color="#3B82F6" sub="All time" />
                    <StatCard label="Pending" value={fmt(0)} icon={<Clock size={15} />} color="#F59E0B" sub="In review" />
                    <StatCard label="HU Spent" value="0" icon={<Zap size={15} />} color="#8B5CF6" sub="All jobs" />
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
                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Est. Job Value</p>
                        <p className="text-[16px] font-black text-green-600 leading-none">
                          {isNaN(calcUSD) || calcUSD <= 0 ? "—" : fmt(calcUSD)}
                        </p>
                      </div>
                    </div>
                    <p className="text-[9px] text-gray-400 font-medium mt-2 text-center">Based on average job value per HU spent</p>
                  </Card>

                  {/* Withdrawal Methods */}
                  <Card className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Globe size={15} className="text-blue-500" />
                      <span className="text-[11px] font-black text-gray-700 uppercase tracking-wide">Global Withdrawal Methods</span>
                    </div>
                    <div className="space-y-3">
                      {[
                        { name: "Card (Visa / Mastercard)", sub: "Worldwide via Stripe · Instant", logo: <div className="flex gap-1"><VisaLogo size={36} /><MastercardLogo size={36} /></div>, status: "Available", color: "#3B82F6" },
                        { name: "PayPal", sub: "200+ countries worldwide", logo: <PayPalSVGLogo size={40} />, status: "Available", color: "#003087" },
                        { name: "Crypto USDT", sub: "TRC20 / ERC20 · Worldwide", logo: <USDTLogo size={40} />, status: "Available", color: "#26A17B" },
                        { name: "Bank Wire (SWIFT)", sub: "International transfers · 1–3 days", logo: <WireTransferLogo size={40} />, status: "Available", color: "#1E40AF" },
                        { name: "M-Pesa", sub: "East Africa · Safaricom", logo: <MpesaLogoSVG size={40} />, status: "Regional", color: "#16A34A" },
                      ].map((m, i) => (
                        <div key={i} className="flex items-center gap-4 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="flex items-center">{m.logo}</div>
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
                  description="Your full earnings record, withdrawal history, and HU spending log will appear here once you complete your first job or top up."
                  icon={<Clock size={28} />}
                  cta="Apply to First Job"
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
                        { label: "HU Used Today", used: 0, limit: 200, unit: "HU" },
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
                      <p className="text-[10px] font-black text-amber-800">Verify your profile to increase your limits</p>
                      <p className="text-[9px] text-amber-600 font-medium mt-0.5">Verified accounts get 10× higher withdrawal limits</p>
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

          {/* ══════════════════════════════════════════════
              WORK / CONTRACTS
          ══════════════════════════════════════════════ */}
          {activeTab === "contracts" && (
            <motion.div key="contracts" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="space-y-5">
              <SectionHead label="My Work" sub="Active and completed jobs" />
              <div className="grid grid-cols-4 gap-3 opacity-40 pointer-events-none select-none">
                <StatCard label="Active Jobs" value="—" icon={<Briefcase size={15} />} color="#3B82F6" />
                <StatCard label="Completed" value="—" icon={<CheckCircle2 size={15} />} color="#10B981" />
                <StatCard label="Earned" value="—" icon={<DollarSign size={15} />} color="#F59E0B" />
                <StatCard label="Rating" value="—" icon={<Star size={15} />} color="#8B5CF6" />
              </div>
              <PremiumLockedSection
                title="No Jobs Yet"
                description="Apply to your first job to unlock this section. You will see your active contracts, milestones, client ratings, and earnings here."
                icon={<FileText size={28} />}
                cta="Browse Global Jobs"
                onCta={() => setActiveTab("tasks")}
                features={["Active contracts", "Client chat", "Milestones", "Earnings log", "Dispute help", "Ratings"]}
              />
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════
              STATS
          ══════════════════════════════════════════════ */}
          {activeTab === "analytics" && (
            <motion.div key="analytics" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="space-y-5">
              <SectionHead label="My Stats" sub="Performance and earnings overview" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Success Rate" value="0%" icon={<CheckCircle2 size={15} />} color="#10B981" />
                <StatCard label="Jobs Done" value="0" icon={<Briefcase size={15} />} color="#3B82F6" />
                <StatCard label="Total Earned" value={fmt(0)} icon={<DollarSign size={15} />} color="#F59E0B" />
                <StatCard label="Uptime" value="100%" icon={<Wifi size={15} />} color="#8B5CF6" />
              </div>
              <PremiumLockedSection
                title="Stats Unlock After First Job"
                description="Earnings charts, win rate, client breakdown, and skill analytics appear after you complete your first job on Nexus."
                icon={<BarChart3 size={28} />}
                cta="Apply to First Job"
                onCta={() => setActiveTab("tasks")}
                features={["Earnings chart", "Win rate", "Client ratings", "Skill breakdown"]}
              />
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════
              SUPPORT
          ══════════════════════════════════════════════ */}
          {activeTab === "support" && (
            <motion.div key="support" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="max-w-lg mx-auto space-y-5">
              <SectionHead label="Help Center" sub="We're here to support you worldwide" />

              <div className="p-4 rounded-xl border border-green-200 bg-green-50 flex items-center gap-4">
                <PulseDot color="#10B981" size={8} />
                <div className="flex-1">
                  <p className="text-[11px] font-black text-green-800">All Systems Running Normally</p>
                  <p className="text-[10px] text-green-600 font-medium">Platform · Payments · Jobs · Wallet — all operational globally</p>
                </div>
                <Badge color="#10B981">99.9%</Badge>
              </div>

              {/* HU quick explainer */}
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <HelpCircle size={14} className="text-indigo-500" />
                  <span className="text-[11px] font-black text-gray-700 uppercase tracking-wide">Understanding HU</span>
                </div>
                <div className="space-y-2">
                  {[
                    { q: "Why do I need HU?", a: "HU (Handshake Units) are a quality filter. By requiring workers to spend a small amount of tokens per application, we eliminate spam and ensure every application a client receives is from a serious, committed professional. This massively increases your chances of being hired." },
                    { q: "Is HU fair?", a: "Yes — the cost is tiny compared to potential earnings. 10 HU (worth ~$0.25) gets you a shot at an $80–$120 job. The ROI is enormous. It's like a postage stamp for a business letter." },
                    { q: "Do I get HU back if I'm not hired?", a: "HU are spent on applying, similar to a job board listing fee. However, you only spend them on jobs you choose to apply to, so you are always in control." },
                  ].map((item, i) => (
                    <div key={i} onClick={() => setExpandedFaq(expandedFaq === 100 + i ? null : 100 + i)}
                      className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl cursor-pointer hover:border-indigo-200 transition-all">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[11px] font-bold text-indigo-900">{item.q}</p>
                        <ChevronDown size={13} className={`text-indigo-400 shrink-0 transition-transform ${expandedFaq === 100 + i ? "rotate-180" : ""}`} />
                      </div>
                      <AnimatePresence>
                        {expandedFaq === 100 + i && (
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
                  Buy HU — Start Applying Now
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
                      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{item.label}</p>
                      <p className="text-[12px] font-black text-gray-900 mt-0.5">{item.value}</p>
                      <p className="text-[9px] text-gray-400 font-medium mt-0.5">{item.sub}</p>
                    </div>
                    {item.action && <ExternalLink size={14} className="text-gray-400 shrink-0" />}
                  </div>
                ))}
              </Card>

              <Card className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <FileQuestion size={14} className="text-blue-500" />
                  <span className="text-[11px] font-black text-gray-700 uppercase tracking-wide">Frequently Asked Questions</span>
                </div>
                <div className="space-y-2">
                  {faqItems.map((item, i) => (
                    <div key={i} onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:border-gray-200 transition-all">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[11px] font-bold text-gray-800">{item.q}</p>
                        <ChevronDown size={13} className={`text-gray-400 shrink-0 transition-transform ${expandedFaq === i ? "rotate-180" : ""}`} />
                      </div>
                      <AnimatePresence>
                        {expandedFaq === i && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                            <p className="text-[11px] text-gray-500 leading-relaxed mt-3 pt-3 border-t border-gray-200">{item.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════
              MESSAGES
          ══════════════════════════════════════════════ */}
          {activeTab === "messages" && (
            <motion.div key="messages" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <SectionHead label="Messages" sub="System updates and client messages" />
                <Badge color="#F59E0B"><Lock size={8} /> Replies Locked</Badge>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 flex items-center gap-3">
                <Crown size={15} className="text-amber-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-[11px] font-black text-amber-800">Direct client messaging unlocks after your first application</p>
                  <p className="text-[10px] text-amber-600 font-medium mt-0.5">Top up HU and apply to a job to enable full messaging</p>
                </div>
                <button onClick={openRefill} className="shrink-0 px-3 py-2 rounded-xl text-[10px] font-black text-white bg-amber-500 hover:bg-amber-600 transition-all">
                  Unlock
                </button>
              </div>

              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex items-center gap-3 opacity-60 cursor-not-allowed select-none">
                <div className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-[11px] text-gray-400">
                  Apply to a job to unlock direct client messaging…
                </div>
                <div className="p-3 rounded-xl border border-gray-200 bg-white">
                  <Lock size={14} className="text-gray-400" />
                </div>
              </div>

              {messages.map((msg, i) => (
                <div key={i} onClick={() => setExpandedMsg(expandedMsg === i ? null : i)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${msg.unread ? "bg-blue-50 border-blue-200" : "bg-white border-gray-100"}`}>
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-lg shrink-0">{msg.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-[11px] font-black text-gray-900">{msg.sender}</h4>
                        <span className="text-[9px] text-gray-400 font-medium">{msg.time}</span>
                      </div>
                      <p className={`text-[11px] text-gray-500 leading-relaxed ${expandedMsg === i ? "" : "line-clamp-1"}`}>{msg.body}</p>
                      {expandedMsg === i && (
                        <button onClick={(e) => { e.stopPropagation(); openRefill(); }}
                          className="mt-3 flex items-center gap-2 text-[10px] font-bold text-blue-600 hover:text-blue-800 transition-all">
                          <Lock size={10} /> Top up HU to reply <ArrowRight size={10} />
                        </button>
                      )}
                    </div>
                    {msg.unread && <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 mt-1" />}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════
              ME
          ══════════════════════════════════════════════ */}
          {activeTab === "me" && (
            <motion.div key="me" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="space-y-4 max-w-2xl mx-auto">

              {/* Profile Hero */}
              <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <div className="h-24 relative" style={{ background: "linear-gradient(135deg, #0047B3 0%, #0066FF 60%, #38BDF8 100%)" }}>
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
                </div>
                <div className="bg-white px-6 pb-6">
                  <div className="flex items-end justify-between -mt-8 mb-4">
                    <div className="w-16 h-16 rounded-2xl border-4 border-white shadow-md flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #3B82F6, #1D4ED8)" }}>
                      <span className="text-white text-[22px] font-black">{(user?.firstName?.[0] || "U").toUpperCase()}</span>
                    </div>
                    <button onClick={() => setEditingProfile(e => !e)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all text-[10px] font-bold text-gray-600">
                      <Edit3 size={12} /> {editingProfile ? "Cancel" : "Edit Profile"}
                    </button>
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-[18px] font-black text-gray-900 leading-tight">{user?.firstName} {user?.lastName}</h3>
                      <p className="text-[11px] text-gray-400 font-medium mt-0.5">{user?.primaryEmailAddress?.emailAddress}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <Globe size={10} className="text-gray-400" />
                          <span className="text-[10px] text-gray-400 font-medium">{profileLocation}</span>
                        </div>
                        <Badge color={isVerified ? "#10B981" : "#F59E0B"}>
                          {isVerified ? <><BadgeCheck size={9} /> Verified</> : <><AlertTriangle size={9} /> Unverified</>}
                        </Badge>
                        <Badge color="#3B82F6"><Zap size={9} /> {huBalance} HU</Badge>
                      </div>
                    </div>
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
                        { label: "Display Name", value: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "—", icon: <User size={14} /> },
                        { label: "Email", value: user?.primaryEmailAddress?.emailAddress || "—", icon: <Mail size={14} /> },
                        { label: "Account Type", value: "Freelancer · Global", icon: <Briefcase size={14} /> },
                        { label: "Member Since", value: "2025", icon: <Calendar size={14} /> },
                        { label: "HU Balance", value: `${huBalance} HU`, icon: <Zap size={14} /> },
                        { label: "Cash Balance", value: fmt(cashBalance), icon: <DollarSign size={14} /> },
                      ].map((row, i) => (
                        <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">{row.icon}</div>
                          <div className="flex-1">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">{row.label}</p>
                            <p className="text-[11px] font-black text-gray-900 mt-0.5 break-all">{row.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card className="p-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Quick Actions</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Top Up HU", icon: <Zap size={16} />, color: "#3B82F6", bg: "#EFF6FF", action: openRefill },
                        { label: "Browse Jobs", icon: <Briefcase size={16} />, color: "#8B5CF6", bg: "#F5F3FF", action: () => setActiveTab("tasks") },
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
                  <Card className="p-5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Security Settings</p>
                    <ToggleRow
                      label="Two-Factor Authentication"
                      sub={twoFAEnabled ? "Your account is protected with 2FA" : "Add an extra layer of security"}
                      value={twoFAEnabled}
                      onChange={() => { setTwoFAEnabled(v => !v); addToast(twoFAEnabled ? "2FA disabled" : "2FA enabled!", twoFAEnabled ? "info" : "success"); }}
                      icon={<Fingerprint size={14} />}
                      color="#10B981"
                    />
                    {twoFAEnabled && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3">
                        <CheckCircle size={14} className="text-green-500 shrink-0" />
                        <p className="text-[10px] font-semibold text-green-700">2FA is active — your account is secured</p>
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
                    <ToggleRow label="New Job Alerts" sub="Get notified when matching jobs are posted globally" value={notifications.newGigs} onChange={() => setNotifications(n => ({ ...n, newGigs: !n.newGigs }))} icon={<Briefcase size={14} />} color="#3B82F6" />
                    <ToggleRow label="Payment Updates" sub="Confirmations, withdrawals, and HU credits" value={notifications.payments} onChange={() => setNotifications(n => ({ ...n, payments: !n.payments }))} icon={<DollarSign size={14} />} color="#10B981" />
                    <ToggleRow label="Mission Alerts" sub="Status changes on your applications" value={notifications.missions} onChange={() => setNotifications(n => ({ ...n, missions: !n.missions }))} icon={<Target size={14} />} color="#8B5CF6" />
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
                    <p className="text-[9px] text-gray-400 font-medium mt-1">Apply to jobs to unlock more achievements</p>
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
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500"><Globe size={14} /></div>
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

      {/* ══════════════════════════════════════════════
          BOTTOM NAV
      ══════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-100 border-t border-gray-100 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]"
        style={{ background: "rgba(255,255,255,0.96)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-5xl mx-auto h-18 flex items-center justify-around px-1 overflow-x-auto no-scrollbar">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 h-full flex-1 min-w-13 transition-all duration-200 relative ${activeTab === item.id ? "text-blue-600" : "text-gray-400 hover:text-gray-600"}`}>
              {activeTab === item.id && (
                <motion.span layoutId="nav-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.75 rounded-b-full bg-blue-600" />
              )}
              <div className={`transition-all duration-200 ${activeTab === item.id ? "scale-110" : "scale-100"}`}>{item.icon}</div>
              <span className={`text-[8px] font-bold uppercase tracking-widest leading-none whitespace-nowrap ${activeTab === item.id ? "text-blue-600" : "text-gray-400"}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          REFILL MODAL
      ══════════════════════════════════════════════ */}
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
                      <p className="text-[11px] text-gray-400 font-medium mt-1">Choose a package to start applying</p>
                    </div>
                    <button onClick={() => setShowModal(false)} className="p-2 bg-gray-100 rounded-xl text-gray-500 hover:bg-gray-200 transition-all">
                      <X size={16} />
                    </button>
                  </div>

                  {huBalance < 10 && (
                    <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-xl">
                      <Zap size={14} className="text-red-500 shrink-0" />
                      <p className="text-[10px] text-red-600 font-bold">You have {huBalance} HU. Need at least 10 HU to apply.</p>
                    </div>
                  )}

                  {/* Value prop banner */}
                  <div className="p-3 rounded-xl border border-indigo-100 bg-indigo-50 flex items-center gap-3">
                    <TrendingUp size={14} className="text-indigo-600 shrink-0" />
                    <p className="text-[10px] font-semibold text-indigo-700">
                      <strong>Workers who buy Pro earn 12× more</strong> in their first month than those who start with Starter.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {uplinkPackages.map((pkg) => (
                      <RippleButton key={pkg.id}
                        onClick={() => { if (!agreed) { addToast("Please agree to terms below first", "info"); return; } setSelectedPack(pkg); setModalStep("choice"); }}
                        className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${
                          pkg.highlight
                            ? "border-blue-400 bg-linear-to-r from-blue-50 to-indigo-50 ring-1 ring-blue-300"
                            : "border-gray-100 bg-gray-50 hover:bg-gray-100"}`}>
                        <div className="text-left flex-1">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <h5 className="text-[12px] font-black text-gray-900">{pkg.name}</h5>
                            {pkg.hot && <Badge color={pkg.color}><Flame size={9} /> Most Popular</Badge>}
                          </div>
                          <p className="text-[9px] font-medium text-gray-500">{pkg.jobs}</p>
                          <p className="text-[9px] font-bold mt-0.5" style={{ color: pkg.color }}>{pkg.roi}</p>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <p className="text-[15px] font-black text-gray-900">{pkg.hu} HU</p>
                          <p className="text-[12px] font-black" style={{ color: pkg.color }}>${pkg.price}.00</p>
                        </div>
                      </RippleButton>
                    ))}
                  </div>

                  <div onClick={() => setAgreed(a => !a)}
                    className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-100 transition-all">
                    <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${agreed ? "border-blue-500 bg-blue-500" : "border-gray-300"}`}>
                      {agreed && <Check size={11} className="text-white" />}
                    </div>
                    <p className="text-[10px] font-medium text-gray-500">I agree to the platform terms and refill rules.</p>
                  </div>
                </div>
              )}

              {/* ── PAYMENT CHOICE STEP ── */}
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
                      Secure checkout · Encrypted · {selectedPack.hu} HU credited instantly after confirmation
                    </p>
                  </div>

                  <div className="space-y-2">
                    {/* Card */}
                    <RippleButton onClick={() => setModalStep("card")}
                      className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all flex items-center gap-4">
                      <div className="flex gap-1.5">
                        <VisaLogo size={36} />
                        <MastercardLogo size={36} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-[13px] font-black text-gray-900">Credit / Debit Card</p>
                        <p className="text-[10px] font-medium text-gray-500 mt-0.5">Visa, Mastercard · Worldwide via Stripe</p>
                        <p className="text-[9px] font-bold text-blue-600 mt-0.5">Instant · 195+ countries</p>
                      </div>
                      <ChevronRight size={16} className="text-gray-400 shrink-0" />
                    </RippleButton>

                    {/* PayPal */}
                    <RippleButton onClick={() => setModalStep("paypal")}
                      className="w-full p-4 rounded-2xl border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-all flex items-center gap-4">
                      <PayPalSVGLogo size={44} />
                      <div className="flex-1 text-left">
                        <p className="text-[13px] font-black text-gray-900">PayPal</p>
                        <p className="text-[10px] font-medium text-gray-500 mt-0.5">200+ countries · ${selectedPack.price}.00 USD</p>
                        <p className="text-[9px] font-bold text-blue-700 mt-0.5">Instant · Buyer protection</p>
                      </div>
                      <ChevronRight size={16} className="text-gray-400 shrink-0" />
                    </RippleButton>

                    {/* Crypto */}
                    <RippleButton onClick={() => setModalStep("crypto")}
                      className="w-full p-4 rounded-2xl border border-green-100 bg-green-50 hover:bg-green-100 transition-all flex items-center gap-4">
                      <USDTLogo size={44} />
                      <div className="flex-1 text-left">
                        <p className="text-[13px] font-black text-gray-900">Crypto USDT</p>
                        <p className="text-[10px] font-medium text-gray-500 mt-0.5">TRC20 / ERC20 · ${selectedPack.price}.00 USDT</p>
                        <p className="text-[9px] font-bold text-green-600 mt-0.5">Works anywhere globally · Decentralized</p>
                      </div>
                      <ChevronRight size={16} className="text-gray-400 shrink-0" />
                    </RippleButton>

                    {/* Bank Wire */}
                    <RippleButton onClick={() => setModalStep("wire")}
                      className="w-full p-4 rounded-2xl border border-indigo-100 bg-indigo-50 hover:bg-indigo-100 transition-all flex items-center gap-4">
                      <WireTransferLogo size={44} />
                      <div className="flex-1 text-left">
                        <p className="text-[13px] font-black text-gray-900">Bank Wire (SWIFT)</p>
                        <p className="text-[10px] font-medium text-gray-500 mt-0.5">International · ${selectedPack.price}.00 USD</p>
                        <p className="text-[9px] font-bold text-indigo-600 mt-0.5">1–3 business days · All banks worldwide</p>
                      </div>
                      <ChevronRight size={16} className="text-gray-400 shrink-0" />
                    </RippleButton>

                    {/* M-Pesa (regional) */}
                    <RippleButton onClick={() => setModalStep("mpesa")}
                      className="w-full p-4 rounded-2xl border border-green-200 bg-green-50 hover:bg-green-100 transition-all flex items-center gap-4">
                      <MpesaLogoSVG size={44} />
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <p className="text-[13px] font-black text-gray-900">M-Pesa</p>
                          <Badge color="#16A34A">East Africa</Badge>
                        </div>
                        <p className="text-[10px] font-medium text-gray-500 mt-0.5">Safaricom STK Push · KES {selectedPack.price * 130}</p>
                        <p className="text-[9px] font-bold text-green-600 mt-0.5">Instant · Kenya, Tanzania, Uganda</p>
                      </div>
                      <ChevronRight size={16} className="text-gray-400 shrink-0" />
                    </RippleButton>
                  </div>
                </div>
              )}

              {/* ── CARD STEP ── */}
              {modalStep === "card" && selectedPack && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setModalStep("choice")} className="p-2 bg-gray-100 rounded-xl text-gray-500 hover:bg-gray-200 transition-all">
                      <ChevronLeft size={15} />
                    </button>
                    <h4 className="text-[13px] font-black text-gray-900">Pay with Card</h4>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex gap-1.5"><VisaLogo size={32} /><MastercardLogo size={32} /></div>
                      <div>
                        <p className="text-[11px] font-black text-blue-800">Total: ${selectedPack.price}.00 USD</p>
                        <p className="text-[10px] text-blue-600 font-medium">Powered by Stripe — PCI DSS Compliant</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: "Visa / Mastercard", icon: "💳", sub: "Debit or credit card" },
                      { label: "American Express", icon: "💎", sub: "Where accepted" },
                      { label: "Any local bank card", icon: "🏦", sub: "Most countries supported" },
                    ].map((opt, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                        <span className="text-xl">{opt.icon}</span>
                        <div>
                          <p className="text-[11px] font-black text-gray-800">{opt.label}</p>
                          <p className="text-[9px] text-gray-400 font-medium">{opt.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <RippleButton disabled={isPaying} onClick={() => handlePay("CARD")}
                    className="w-full py-4 rounded-xl text-[11px] font-black uppercase tracking-widest text-white flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg, #1D4ED8, #0066FF)" }}>
                    {isPaying ? <><RefreshCw size={14} className="animate-spin" /> Redirecting to Stripe…</> : `Pay $${selectedPack.price}.00 via Stripe`}
                  </RippleButton>
                  <p className="text-center text-[9px] text-gray-400 font-medium">🔒 Secured by Stripe · TLS 1.3 encryption</p>
                </div>
              )}

              {/* ── PAYPAL STEP ── */}
              {modalStep === "paypal" && selectedPack && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setModalStep("choice")} className="p-2 bg-gray-100 rounded-xl text-gray-500 hover:bg-gray-200 transition-all">
                      <ChevronLeft size={15} />
                    </button>
                    <h4 className="text-[13px] font-black text-gray-900">Pay with PayPal</h4>
                  </div>
                  <div className="flex items-center justify-center py-4">
                    <PayPalSVGLogo size={72} />
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-center">
                    <p className="text-[14px] font-black text-gray-900">${selectedPack.price}.00 USD</p>
                    <p className="text-[10px] text-blue-600 font-medium mt-1">For {selectedPack.hu} Handshake Units · {selectedPack.name} Pack</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
                    <ShieldCheck size={14} className="text-blue-500 shrink-0" />
                    <p className="text-[10px] font-medium text-gray-600">PayPal buyer protection included. You can pay with your PayPal balance, bank, or any linked card.</p>
                  </div>
                  <RippleButton disabled={isPaying} onClick={() => handlePay("PAYPAL")}
                    className="w-full py-4 rounded-xl text-[11px] font-black uppercase tracking-widest text-white flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg, #003087, #009CDE)" }}>
                    {isPaying ? <><RefreshCw size={14} className="animate-spin" /> Redirecting…</> : `Continue with PayPal · $${selectedPack.price}.00`}
                  </RippleButton>
                  <p className="text-center text-[9px] text-gray-400 font-medium">Available in 200+ countries</p>
                </div>
              )}

              {/* ── CRYPTO STEP ── */}
              {modalStep === "crypto" && selectedPack && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setModalStep("choice")} className="p-2 bg-gray-100 rounded-xl text-gray-500 hover:bg-gray-200 transition-all">
                      <ChevronLeft size={15} />
                    </button>
                    <h4 className="text-[13px] font-black text-gray-900">Pay with USDT</h4>
                  </div>

                  <div className="flex gap-2">
                    {(["TRC20", "ERC20"] as const).map(net => (
                      <button key={net} onClick={() => setSelectedCryptoNet(net)}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-black border transition-all ${selectedCryptoNet === net ? "bg-green-600 text-white border-green-600" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                        {net} {net === "TRC20" ? "(TRX)" : "(ETH)"}
                      </button>
                    ))}
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 flex justify-center border border-gray-200">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${CRYPTO_WALLETS[selectedCryptoNet]}`}
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
                      <p className="text-[14px] font-black text-green-600">{selectedCryptoNet}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-gray-500 mb-2">Wallet Address ({selectedCryptoNet})</p>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-[10px] font-mono text-gray-600 truncate">
                        {CRYPTO_WALLETS[selectedCryptoNet]}
                      </div>
                      <button onClick={() => copyAddress(CRYPTO_WALLETS[selectedCryptoNet])}
                        className="p-3 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 transition-all">
                        {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-gray-500" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                    <p className="text-[10px] font-bold text-amber-800">⚠️ Send only USDT on {selectedCryptoNet} network</p>
                    <p className="text-[9px] text-amber-600 font-medium mt-0.5">Sending on wrong network will result in permanent loss of funds</p>
                  </div>

                  <RippleButton onClick={() => { addToast("Payment received. HU credited in ~30 minutes after confirmation.", "success"); setShowModal(false); }}
                    className="w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-white bg-green-600 hover:bg-green-700 transition-all">
                    I Have Paid — Confirm
                  </RippleButton>
                </div>
              )}

              {/* ── WIRE STEP ── */}
              {modalStep === "wire" && selectedPack && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setModalStep("choice")} className="p-2 bg-gray-100 rounded-xl text-gray-500 hover:bg-gray-200 transition-all">
                      <ChevronLeft size={15} />
                    </button>
                    <h4 className="text-[13px] font-black text-gray-900">Bank Wire Transfer</h4>
                  </div>
                  <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <p className="text-[11px] font-black text-indigo-800 mb-1">Transfer Details</p>
                    <div className="space-y-2 mt-2">
                      {[
                        { label: "Bank Name", value: "Nexus Global Payments Ltd" },
                        { label: "Account Number", value: "GB29NWBK60161331926819" },
                        { label: "SWIFT/BIC", value: "NXGBGB21" },
                        { label: "Amount", value: `$${selectedPack.price}.00 USD` },
                        { label: "Reference", value: `NXS-${user?.id?.slice(0,8).toUpperCase() || "USER"}-${selectedPack.hu}HU` },
                      ].map((row, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <span className="text-[9px] font-bold text-indigo-400 uppercase">{row.label}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black text-indigo-900">{row.value}</span>
                            <button onClick={() => { navigator.clipboard.writeText(row.value); addToast(`${row.label} copied!`, "success"); }}
                              className="p-1 hover:bg-indigo-100 rounded transition-all">
                              <Copy size={10} className="text-indigo-400" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                    <p className="text-[10px] font-bold text-amber-800">Important: Include the reference number</p>
                    <p className="text-[9px] text-amber-600 font-medium mt-0.5">Processing takes 1–3 business days. HU credited after confirmation.</p>
                  </div>
                  <RippleButton onClick={() => { addToast("Wire details saved. Send payment and contact support with your receipt.", "success"); setShowModal(false); }}
                    className="w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-white"
                    style={{ background: "linear-gradient(135deg, #1E40AF, #0066FF)" }}>
                    I Have Initiated the Transfer
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
                    <p className="text-[10px] text-green-600 font-medium pl-6">You get {selectedPack.hu} HU instantly after payment confirmation.</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-600 mb-2">Your Safaricom Number</p>
                    <input value={mpesaNum} onChange={(e) => setMpesaNum(e.target.value)} placeholder="254712345678"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-[18px] font-black text-gray-900 outline-none focus:border-green-400 text-center tracking-widest transition-all placeholder:text-gray-300 focus:bg-white" />
                    <p className="text-[10px] text-gray-400 font-medium mt-2 text-center">Format: 254XXXXXXXXX · 12 digits</p>
                  </div>
                  <RippleButton disabled={isPaying} onClick={() => handlePay("MPESA")}
                    className="w-full py-4 rounded-xl text-[11px] font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 transition-all">
                    {isPaying
                      ? <><RefreshCw size={14} className="animate-spin" /> Sending prompt…</>
                      : `Pay KES ${selectedPack.price * 130} — Send to Phone`}
                  </RippleButton>
                  <p className="text-center text-[9px] text-gray-400 font-medium">Available in Kenya, Tanzania, Uganda · Instant</p>
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