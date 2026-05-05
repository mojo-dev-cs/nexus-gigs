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
  Banknote, Building, Coins, Wallet2,
} from "lucide-react";

interface Toast {
  id: number;
  msg: string;
  type: "success" | "error" | "info";
}

// ── Primitives ─────────────────────────────────────────────────────────────

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
      className={`relative overflow-hidden select-none transition-transform active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}>
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

// ── PREMIUM CompanyLogo ─────────────────────────────────────────────────────
// 3-tier: Clearbit → Google favicon → styled initials with brand-matched color
const CompanyLogo = ({ name, domain, size = 44 }: { name: string; domain: string; size?: number }) => {
  const [imgSrc, setImgSrc] = useState<string | null>(`https://logo.clearbit.com/${domain}`);
  const [stage, setStage] = useState<"clearbit" | "favicon" | "initials">("clearbit");

  const initials = name
    .replace(/[^a-zA-Z\s]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  // Deterministic brand color per company initial
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
    if (stage === "clearbit") {
      setStage("favicon");
      setImgSrc(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
    } else {
      setStage("initials");
      setImgSrc(null);
    }
  };

  if (stage === "initials" || !imgSrc) {
    return (
      <div
        style={{
          width: size,
          height: size,
          minWidth: size,
          backgroundColor: palette.bg,
          border: `1.5px solid ${palette.border}`,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span style={{
          fontSize: size * 0.33,
          fontWeight: 900,
          color: palette.text,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}>
          {initials || "?"}
        </span>
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size, minWidth: size, borderRadius: 12, flexShrink: 0 }}
      className="overflow-hidden bg-white border border-gray-100 flex items-center justify-center shadow-sm"
    >
      <img
        src={imgSrc}
        alt={name}
        style={{ width: "100%", height: "100%", objectFit: "contain", padding: stage === "favicon" ? 6 : 4 }}
        onError={handleError}
      />
    </div>
  );
};

// ── PREMIUM MarketplaceAvatar ───────────────────────────────────────────────
// Shows a styled initials avatar with type-matched color gradient
const MarketplaceAvatar = ({
  initials, type, size = 44,
}: { initials: string; type: string; size?: number }) => {
  const typeGradients: Record<string, { from: string; to: string; text: string }> = {
    "Web Dev":   { from: "#3B82F6", to: "#1D4ED8", text: "#fff" },
    "Design":    { from: "#8B5CF6", to: "#6D28D9", text: "#fff" },
    "Writing":   { from: "#10B981", to: "#047857", text: "#fff" },
    "Marketing": { from: "#F59E0B", to: "#D97706", text: "#fff" },
    "Data":      { from: "#06B6D4", to: "#0284C7", text: "#fff" },
    "AI":        { from: "#EF4444", to: "#B91C1C", text: "#fff" },
    "Security":  { from: "#DC2626", to: "#991B1B", text: "#fff" },
    "Web3":      { from: "#7C3AED", to: "#5B21B6", text: "#fff" },
    "Video":     { from: "#EC4899", to: "#BE185D", text: "#fff" },
  };
  const g = typeGradients[type] || { from: "#6B7280", to: "#374151", text: "#fff" };

  return (
    <div
      style={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: 12,
        background: `linear-gradient(135deg, ${g.from}, ${g.to})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: `0 2px 8px ${g.from}40`,
      }}
    >
      <span style={{
        fontSize: size * 0.32,
        fontWeight: 900,
        color: g.text,
        letterSpacing: "-0.02em",
        lineHeight: 1,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}>
        {initials.slice(0, 2)}
      </span>
    </div>
  );
};

// Payment method logos
const MpesaLogo = ({ size = 40 }: { size?: number }) => (
  <div style={{ width: size, height: size, minWidth: size }} className="rounded-xl overflow-hidden bg-green-600 flex items-center justify-center shadow-sm">
    <svg viewBox="0 0 40 40" width={size} height={size}>
      <rect width="40" height="40" fill="#16A34A"/>
      <text x="50%" y="54%" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="16" fontWeight="900" fontFamily="Arial Black">M</text>
    </svg>
  </div>
);

const PaystackLogo = ({ size = 40 }: { size?: number }) => (
  <div style={{ width: size, height: size, minWidth: size }} className="rounded-xl overflow-hidden flex items-center justify-center shadow-sm bg-[#3d4eac]">
    <svg viewBox="0 0 40 40" width={size} height={size}>
      <rect width="40" height="40" fill="#3d4eac"/>
      <rect x="10" y="11" width="20" height="4.5" rx="2.5" fill="white"/>
      <rect x="10" y="17.5" width="14" height="4.5" rx="2.5" fill="white" opacity="0.7"/>
      <rect x="10" y="24" width="18" height="4.5" rx="2.5" fill="white" opacity="0.45"/>
    </svg>
  </div>
);

const BinanceLogo = ({ size = 40 }: { size?: number }) => (
  <div style={{ width: size, height: size, minWidth: size }} className="rounded-xl bg-[#F3BA2F] flex items-center justify-center shadow-sm">
    <svg viewBox="0 0 40 40" width={size - 8} height={size - 8} fill="white">
      <path d="M20 4l3.5 3.5L20 11l-3.5-3.5L20 4zm-8 8l3.5 3.5L12 19l-3.5-3.5L12 12zm16 0l3.5 3.5L28 19l-3.5-3.5L28 12zM20 20l3.5 3.5L20 27l-3.5-3.5L20 20zm-8 8l3.5 3.5L12 35l-3.5-3.5L12 28zm16 0l3.5 3.5L28 35l-3.5-3.5L28 28zM20 12l8 8-8 8-8-8 8-8z"/>
    </svg>
  </div>
);

const PaypalLogo = ({ size = 40 }: { size?: number }) => (
  <div style={{ width: size, height: size, minWidth: size }} className="rounded-xl bg-[#003087] flex items-center justify-center shadow-sm">
    <svg viewBox="0 0 60 24" width={size - 6} height={16} fill="none">
      <text x="50%" y="75%" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="9" fontWeight="900" fontFamily="Arial">PayPal</text>
    </svg>
  </div>
);

const PremiumLockedSection = ({
  title, description, icon, cta, onCta, features,
}: {
  title: string; description: string; icon: React.ReactNode; cta: string; onCta: () => void; features?: string[];
}) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
    className="relative rounded-2xl overflow-hidden border border-gray-100 bg-linear-to-br from-slate-50 to-blue-50 p-8 text-center">
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

// ── Main Component ──────────────────────────────────────────────────────────

export const FreelancerView = ({ jobs, userMetadata }: { jobs: any[]; userMetadata: any }) => {
  const { user } = useUser();

  const [currency, setCurrency] = useState<"USD" | "KES">("USD");
  const RATE = 130;
  const fmt = (usd: number) =>
    currency === "USD"
      ? `$${usd.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
      : `KES ${(usd * RATE).toLocaleString()}`;

  const [activeTab, setActiveTab] = useState("home");
  const [gigMode, setGigMode] = useState<"marketplace" | "corporate">("marketplace");
  const [gigCategory, setGigCategory] = useState("All");
  const [gigSort, setGigSort] = useState<"newest" | "highest" | "lowest">("newest");
  const [gigSearch, setGigSearch] = useState("");

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
  const [modalStep, setModalStep] = useState<"packages" | "choice" | "mpesa" | "binance">("packages");
  const [selectedPack, setSelectedPack] = useState<(typeof uplinkPackages)[0] | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [mpesaNum, setMpesaNum] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [calcHU, setCalcHU] = useState("1200");
  const calcKES = Math.round(parseFloat(calcHU || "0") * 1.083);

  const [expandedMsg, setExpandedMsg] = useState<number | null>(null);
  const [showBalance, setShowBalance] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeVaultTab, setActiveVaultTab] = useState<"overview" | "history" | "limits" | "referral">("overview");

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

  const uplinkPackages = [
    { id: 1, name: "Starter", price: 3, hu: 150, desc: "Apply for a few small gigs today.", hot: false },
    { id: 2, name: "Basic", price: 6, hu: 400, desc: "Get access to more local tasks.", hot: false },
    { id: 3, name: "Pro Uplink", price: 10, hu: 1200, desc: "Unlock global company missions.", hot: true },
    { id: 4, name: "Elite", price: 18, hu: 2500, desc: "Priority access + HR direct line.", hot: false },
    { id: 5, name: "Alpha", price: 30, hu: 5000, desc: "Full power for top workers.", hot: false },
  ];

  // ── Marketplace Gigs ──
  const marketplaceGigs = useMemo(() => [
    { id: "m1", title: "Fix Bugs in My WordPress Site", budget: 80, client: "BlogPro Media", avatar: "BP", type: "Web Dev", duration: "2 Days", cost: 10, level: "Basic" },
    { id: "m2", title: "Write 5 Blog Posts About Finance", budget: 120, client: "Money Tips KE", avatar: "MT", type: "Writing", duration: "4 Days", cost: 10, level: "Basic" },
    { id: "m3", title: "Create a Logo for My Restaurant", budget: 90, client: "Taste of Nairobi", avatar: "TN", type: "Design", duration: "3 Days", cost: 10, level: "Basic" },
    { id: "m4", title: "Set Up My Instagram Business Page", budget: 60, client: "Fashionista KE", avatar: "FK", type: "Marketing", duration: "1 Day", cost: 10, level: "Basic" },
    { id: "m5", title: "Excel Data Entry & Cleanup", budget: 75, client: "Accounts Plus", avatar: "AP", type: "Data", duration: "2 Days", cost: 10, level: "Basic" },
    { id: "m6", title: "Build a Simple E-Commerce Website", budget: 450, client: "ShopEasy Ltd", avatar: "SE", type: "Web Dev", duration: "7 Days", cost: 20, level: "Standard" },
    { id: "m7", title: "Design Pitch Deck for Startup", budget: 350, client: "Venture Lab", avatar: "VL", type: "Design", duration: "5 Days", cost: 20, level: "Standard" },
    { id: "m8", title: "Python Script for Automated Reports", budget: 280, client: "DataFlow Inc", avatar: "DF", type: "Data", duration: "4 Days", cost: 20, level: "Standard" },
    { id: "m9", title: "Social Media Management (1 Month)", budget: 400, client: "BrandBoost KE", avatar: "BB", type: "Marketing", duration: "30 Days", cost: 20, level: "Standard" },
    { id: "m10", title: "Mobile App UI Design (Figma)", budget: 600, client: "AppCraft Studio", avatar: "AC", type: "Design", duration: "8 Days", cost: 20, level: "Standard" },
    { id: "m11", title: "SEO Optimization for Small Business", budget: 320, client: "Rank Fast KE", avatar: "RF", type: "Marketing", duration: "5 Days", cost: 20, level: "Standard" },
    { id: "m12", title: "Full-Stack Web App with React & Node", budget: 1200, client: "TechBuild Africa", avatar: "TB", type: "Web Dev", duration: "14 Days", cost: 30, level: "Advanced" },
    { id: "m13", title: "AI Chatbot for Customer Support", budget: 950, client: "RetailBot Inc", avatar: "RB", type: "AI", duration: "10 Days", cost: 30, level: "Advanced" },
    { id: "m14", title: "Cybersecurity Audit for Company", budget: 1500, client: "SecureNet Ltd", avatar: "SN", type: "Security", duration: "7 Days", cost: 30, level: "Advanced" },
    { id: "m15", title: "Smart Contract Development (Solidity)", budget: 1800, client: "Nexus Protocol", avatar: "NP", type: "Web3", duration: "10 Days", cost: 30, level: "Advanced" },
    { id: "m16", title: "Machine Learning Model for Sales Predictions", budget: 1400, client: "Predict Pro", avatar: "PP", type: "AI", duration: "12 Days", cost: 30, level: "Advanced" },
    { id: "m17", title: "API Security Penetration Testing", budget: 2100, client: "SafeVault Corp", avatar: "SV", type: "Security", duration: "7 Days", cost: 50, level: "Expert" },
    { id: "m18", title: "NFT Collection Smart Contracts + Frontend", budget: 2800, client: "CryptoArt Hub", avatar: "CA", type: "Web3", duration: "14 Days", cost: 50, level: "Expert" },
    { id: "m19", title: "Enterprise CRM Custom Integration", budget: 3200, client: "SalesForce Partners", avatar: "SP", type: "Web Dev", duration: "21 Days", cost: 50, level: "Expert" },
    { id: "m20", title: "Deep Learning Computer Vision System", budget: 4000, client: "VisionAI Labs", avatar: "VA", type: "AI", duration: "21 Days", cost: 50, level: "Expert" },
    { id: "m21", title: "DeFi Protocol Architecture & Audit", budget: 5000, client: "DeFi Builders DAO", avatar: "DB", type: "Web3", duration: "30 Days", cost: 50, level: "Expert" },
    { id: "m22", title: "Next.js Speed & SEO Enterprise Overhaul", budget: 1800, client: "E-Com Solutions", avatar: "EC", type: "Web Dev", duration: "10 Days", cost: 30, level: "Advanced" },
    { id: "m23", title: "Brand Identity Design System", budget: 2200, client: "Branding Co", avatar: "BC", type: "Design", duration: "14 Days", cost: 30, level: "Advanced" },
    { id: "m24", title: "Video Editing for YouTube Channel", budget: 200, client: "Content King KE", avatar: "CK", type: "Video", duration: "5 Days", cost: 10, level: "Basic" },
  ], []);

  // ── Corporate Gigs ──
  const corporateGigs = useMemo(() => [
    { id: "c1", title: "Remote Fleet Data Analyst", salary: 8000, domain: "tesla.com", company: "Tesla", cost: 50, badge: "EV · Remote", dept: "Engineering" },
    { id: "c2", title: "Cloud Support Engineer", salary: 9000, domain: "amazon.com", company: "Amazon", cost: 50, badge: "AWS · Senior", dept: "Cloud" },
    { id: "c3", title: "Payment Integrity Analyst", salary: 11000, domain: "stripe.com", company: "Stripe", cost: 50, badge: "FinTech · Remote", dept: "Finance" },
    { id: "c4", title: "Security Operations Specialist", salary: 12000, domain: "kraken.com", company: "Kraken", cost: 50, badge: "Crypto · Remote", dept: "Security" },
    { id: "c5", title: "Frontend Engineer (React)", salary: 10500, domain: "shopify.com", company: "Shopify", cost: 50, badge: "E-Com · Remote", dept: "Engineering" },
    { id: "c6", title: "Data Platform Engineer", salary: 13500, domain: "databricks.com", company: "Databricks", cost: 100, badge: "Data · Senior", dept: "Data" },
    { id: "c7", title: "Product Manager — Africa Expansion", salary: 9500, domain: "google.com", company: "Google", cost: 100, badge: "Remote · Senior", dept: "Product" },
    { id: "c8", title: "Mobile Engineer (iOS/Android)", salary: 11000, domain: "meta.com", company: "Meta", cost: 100, badge: "Remote · Mid", dept: "Engineering" },
    { id: "c9", title: "DevOps Engineer", salary: 10000, domain: "microsoft.com", company: "Microsoft", cost: 50, badge: "Azure · Remote", dept: "Infrastructure" },
    { id: "c10", title: "UX Researcher", salary: 8500, domain: "airbnb.com", company: "Airbnb", cost: 50, badge: "Remote · Contract", dept: "Design" },
    { id: "c11", title: "Blockchain Developer", salary: 14000, domain: "coinbase.com", company: "Coinbase", cost: 100, badge: "Crypto · Remote", dept: "Engineering" },
    { id: "c12", title: "Growth Marketing Manager", salary: 9000, domain: "spotify.com", company: "Spotify", cost: 50, badge: "Marketing · Remote", dept: "Marketing" },
    { id: "c13", title: "ML Infrastructure Engineer", salary: 15000, domain: "openai.com", company: "OpenAI", cost: 100, badge: "AI · Remote", dept: "AI" },
    { id: "c14", title: "Backend Engineer (Go/Rust)", salary: 12000, domain: "discord.com", company: "Discord", cost: 50, badge: "Remote · Mid", dept: "Engineering" },
    { id: "c15", title: "Data Scientist — Ads Platform", salary: 13000, domain: "twitter.com", company: "X (Twitter)", cost: 100, badge: "Data · Senior", dept: "Data" },
    { id: "c16", title: "Site Reliability Engineer", salary: 12500, domain: "netflix.com", company: "Netflix", cost: 100, badge: "Remote · Senior", dept: "Infrastructure" },
    { id: "c17", title: "API Developer (Payments)", salary: 10000, domain: "paypal.com", company: "PayPal", cost: 50, badge: "FinTech · Remote", dept: "Engineering" },
    { id: "c18", title: "Content Strategy Manager", salary: 7500, domain: "hubspot.com", company: "HubSpot", cost: 30, badge: "Marketing · Remote", dept: "Marketing" },
    { id: "c19", title: "Cloud Security Architect", salary: 16000, domain: "cloudflare.com", company: "Cloudflare", cost: 100, badge: "Security · Senior", dept: "Security" },
    { id: "c20", title: "iOS Engineer", salary: 11500, domain: "uber.com", company: "Uber", cost: 50, badge: "Mobile · Remote", dept: "Engineering" },
    { id: "c21", title: "Full Stack Engineer (TypeScript)", salary: 10000, domain: "notion.so", company: "Notion", cost: 50, badge: "SaaS · Remote", dept: "Engineering" },
    { id: "c22", title: "Analytics Engineer", salary: 9500, domain: "figma.com", company: "Figma", cost: 50, badge: "Design · Remote", dept: "Data" },
  ], []);

  const gigCategories = ["All", "Web Dev", "Design", "Writing", "Marketing", "Data", "AI", "Security", "Web3", "Video"];
  const corpDepts = ["All", "Engineering", "Data", "Security", "Marketing", "Product", "Design", "AI", "Infrastructure", "Finance"];

  const [corpCategory, setCorpCategory] = useState("All");

  const filteredMarket = useMemo(() => {
    let list = gigCategory === "All" ? marketplaceGigs : marketplaceGigs.filter(g => g.type === gigCategory);
    if (gigSearch) list = list.filter(g => g.title.toLowerCase().includes(gigSearch.toLowerCase()) || g.client.toLowerCase().includes(gigSearch.toLowerCase()));
    if (gigSort === "highest") list = [...list].sort((a, b) => b.budget - a.budget);
    if (gigSort === "lowest") list = [...list].sort((a, b) => a.budget - b.budget);
    return list;
  }, [gigCategory, gigSearch, gigSort, marketplaceGigs]);

  const filteredCorp = useMemo(() => {
    return corpCategory === "All" ? corporateGigs : corporateGigs.filter(c => c.dept === corpCategory);
  }, [corpCategory, corporateGigs]);

  const typeColors: Record<string, string> = {
    "Web Dev": "#3B82F6", "Design": "#8B5CF6", "Writing": "#10B981",
    "Marketing": "#F59E0B", "Data": "#06B6D4", "AI": "#EF4444",
    "Security": "#DC2626", "Web3": "#7C3AED", "Video": "#EC4899",
  };

  const levelColors: Record<string, string> = {
    "Basic": "#10B981", "Standard": "#3B82F6", "Advanced": "#8B5CF6", "Expert": "#EF4444",
  };

  const navItems = [
    { id: "home",      icon: <Home size={17} />,        label: "Home"   },
    { id: "tasks",     icon: <Briefcase size={17} />,   label: "Jobs"   },
    { id: "contracts", icon: <FileText size={17} />,    label: "Work"   },
    { id: "messages",  icon: <MessageSquare size={17} />, label: "Chats" },
    { id: "earnings",  icon: <Wallet size={17} />,      label: "Wallet" },
    { id: "analytics", icon: <BarChart3 size={17} />,   label: "Stats"  },
    { id: "support",   icon: <LifeBuoy size={17} />,    label: "Help"   },
  ];

  const messages = [
    { sender: "Nexus HQ", body: "Welcome! To keep global clients safe, you need Handshake Units (HU) to apply for jobs. Top up now to start earning.", time: "Just now", unread: true, avatar: "🏢" },
    { sender: "Security Bot", body: "Your connection is secure. You have 5 HU left. You need at least 10 HU to apply for any job. Pick a package to get started.", time: "14m ago", unread: true, avatar: "🤖" },
    { sender: "Exchange Relay", body: "Exchange rate updated: $1.00 = KES 130. Use the Wallet calculator to check your balance before withdrawing.", time: "1h ago", unread: false, avatar: "📡" },
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

  const handlePay = async (method: "CARD" | "MPESA") => {
    if (!agreed) return addToast("Please agree to the terms first.", "info");
    if (!selectedPack) return addToast("Please select a package first.", "error");
    setIsPaying(true);
    try {
      if (method === "CARD") {
        const kesAmount = selectedPack.price * RATE;
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
      } else {
        const clean = mpesaNum.replace(/\D/g, "");
        if (!clean.startsWith("254") || clean.length !== 12) {
          addToast("Please use format: 254XXXXXXXXX (12 digits)", "error"); return;
        }
        const res = await fetch("/api/intasend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: selectedPack.price * RATE, phone: clean,
            email: user?.primaryEmailAddress?.emailAddress,
            metadata: { hu: selectedPack.hu },
          }),
        });
        if (res.ok) { addToast("Check your phone — M-Pesa prompt sent!", "success"); setShowModal(false); }
        else addToast("M-Pesa connection failed. Try again.", "error");
      }
    } catch { addToast("Network error. Please try again.", "error"); }
    finally { setIsPaying(false); }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText("TFWxe4TFcjUNgPJVgf5iXrMsw1oe4gDv9X");
    setCopied(true);
    addToast("Address copied!", "success");
    setTimeout(() => setCopied(false), 2500);
  };

  const faqItems = [
    { q: "What are Handshake Units (HU)?", a: "HU are your access tokens on the Nexus platform. Each time you apply for a job, some HU are used. This keeps out fake applicants and makes sure only serious workers can apply. Higher-paying jobs cost more HU." },
    { q: "How fast does M-Pesa payment work?", a: "M-Pesa is instant. A pop-up will appear on your Safaricom phone within a few seconds. Your HU balance is updated within 5 minutes after payment is confirmed." },
    { q: "Can I withdraw my money?", a: "Yes! Once your balance reaches $50, you can withdraw through M-Pesa, Bank Transfer, or Binance. Make sure your profile is verified to unlock full withdrawal options." },
    { q: "How many HU do I need to apply?", a: "Basic jobs cost 10 HU. Standard jobs cost 20 HU. Advanced jobs cost 30 HU. Expert jobs cost 50 HU. Corporate jobs from big companies cost 50–100 HU because clients have very high standards." },
    { q: "Is my information safe?", a: "Yes. All your data is protected using top-level encryption (TLS 1.3 and AES-256). We never share your personal details with anyone without your permission." },
  ];

  return (
    <div
      className="min-h-screen font-sans overflow-x-hidden"
      style={{
        // ── CLEAN premium background — no dark blobs ──
        background: "#F7F9FC",
        paddingBottom: "72px",
      }}
    >
      {/* Subtle top accent line — replaces distracting blobs */}
      <div className="fixed top-0 left-0 right-0 h-0.75 z-200"
        style={{ background: "linear-gradient(90deg, #0047B3 0%, #0066FF 50%, #38BDF8 100%)" }} />

      {/* Toasts */}
      <div className="fixed top-5 right-4 z-999 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div key={t.id} initial={{ opacity: 0, x: 80, scale: 0.92 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 80, scale: 0.92 }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-bold border shadow-lg bg-white ${
                t.type === "success" ? "border-green-200 text-green-700"
                  : t.type === "error" ? "border-red-200 text-red-700"
                  : "border-blue-200 text-blue-700"}`}>
              {t.type === "success" ? <CheckCircle size={14} className="text-green-500" /> : t.type === "error" ? <AlertTriangle size={14} className="text-red-500" /> : <BellRing size={14} className="text-blue-500" />}
              <span>{t.msg}</span>
              <button onClick={() => setToasts((p) => p.filter((x) => x.id !== t.id))} className="ml-1 opacity-40 hover:opacity-100"><X size={12} /></button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="max-w-5xl mx-auto pt-6 px-4 relative z-10">
        <AnimatePresence mode="wait">

          {/* ══ HOME ══════════════════════════════════════════════ */}
          {activeTab === "home" && (
            <motion.div key="home" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="space-y-5">

              {/* Greeting header */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Welcome back</p>
                  <h2 className="text-[26px] font-black text-gray-900 leading-none">
                    {user?.firstName || "Operator"}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <PulseDot color="#10B981" size={7} />
                    <span className="text-[10px] font-semibold text-gray-400">Connected · All systems working</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2.5 rounded-xl">
                    <Zap size={15} className="text-blue-600" fill="#3B82F6" />
                    <span className="text-[16px] font-black text-gray-900">{huBalance}</span>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">HU</span>
                  </div>
                  <button
                    onClick={() => setCurrency((c) => (c === "USD" ? "KES" : "USD"))}
                    className="text-[9px] font-bold bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all"
                  >
                    {currency} ⇄ Switch
                  </button>
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
                      <p className="text-[9px] text-blue-200 mt-0.5">How you access jobs on Nexus</p>
                    </div>
                  </div>
                  <p className="text-[12px] text-blue-100 leading-relaxed mb-5">
                    Every job application uses <strong className="text-white">Handshake Units (HU)</strong>. This keeps out spam and puts serious workers like you first in hiring queues worldwide.
                  </p>
                  <div className="flex gap-2">
                    <RippleButton onClick={openRefill} className="flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-700 bg-white hover:bg-blue-50 transition-all">
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
                  <StatCard label="Trust Level" value="Beta" icon={<Shield size={15} />} color="#F59E0B" />
                </div>
              </div>

              {/* Low HU warning */}
              {huBalance < 10 && (
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                    <Info size={18} className="text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-black text-amber-800 uppercase tracking-wide">You need at least 10 HU to apply for any job</p>
                    <p className="text-[10px] text-amber-600 font-medium mt-0.5">Current balance: {huBalance} HU · You need {10 - huBalance} more HU</p>
                  </div>
                  <button onClick={openRefill} className="shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white bg-amber-500 hover:bg-amber-600 transition-all">
                    Top Up
                  </button>
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

              {/* Live activity feed */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Activity size={14} className="text-blue-500" />
                    <span className="text-[11px] font-black text-gray-700 uppercase tracking-wide">Live Activity Feed</span>
                  </div>
                  <Badge color="#10B981"><PulseDot color="#10B981" size={5} /> Live</Badge>
                </div>
                <div className="space-y-3">
                  {[
                    { msg: "Emmanuel K. just earned $850 via Stripe gig", time: "2m ago", color: "#10B981" },
                    { msg: "David N. applied to Tesla Data Analyst role", time: "7m ago", color: "#3B82F6" },
                    { msg: "Alice V. withdrew KES 14,000 successfully", time: "15m ago", color: "#8B5CF6" },
                    { msg: "John M. topped up 1,200 HU — Pro Uplink", time: "22m ago", color: "#F59E0B" },
                    { msg: "Sara B. completed a Security Audit — $1,500", time: "35m ago", color: "#EF4444" },
                  ].map((a, i) => (
                    <div key={i} className="flex items-center gap-3 py-1">
                      <PulseDot color={a.color} size={6} />
                      <p className="text-[10px] text-gray-600 font-medium flex-1">{a.msg}</p>
                      <span className="text-[9px] text-gray-400 font-medium shrink-0">{a.time}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Scroll ticker */}
              <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-white py-3">
                <motion.div className="whitespace-nowrap flex gap-16 items-center"
                  animate={{ x: [0, -900] }} transition={{ repeat: Infinity, duration: 30, ease: "linear" }}>
                  {["Emmanuel refilled 1,200 HU", "David N. earned $850", "John M. applied to Tesla", "Alice V. withdrew KES 14,000",
                    "System: All secure · TLS 1.3", "Kraken · Stripe · Amazon hiring now", "24 new jobs posted today"].map((t, i) => (
                    <span key={i} className="inline-flex items-center gap-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                      <PulseDot color="#3B82F6" size={5} />{t}
                    </span>
                  ))}
                </motion.div>
              </div>

              {/* Featured companies — real logos via CompanyLogo */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Companies Hiring Now</p>
                <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
                  {[
                    { domain: "tesla.com", name: "Tesla" },
                    { domain: "amazon.com", name: "Amazon" },
                    { domain: "stripe.com", name: "Stripe" },
                    { domain: "google.com", name: "Google" },
                    { domain: "openai.com", name: "OpenAI" },
                    { domain: "coinbase.com", name: "Coinbase" },
                    { domain: "netflix.com", name: "Netflix" },
                    { domain: "shopify.com", name: "Shopify" },
                  ].map((c, i) => (
                    <button key={i} onClick={() => { setGigMode("corporate"); setActiveTab("tasks"); }}
                      className="shrink-0 p-3 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all">
                      <CompanyLogo name={c.name} domain={c.domain} size={38} />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ══ GIGS ══════════════════════════════════════════════ */}
          {activeTab === "tasks" && (
            <motion.div key="tasks" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="space-y-4">

              <div className="flex items-center justify-between flex-wrap gap-3">
                <SectionHead label="Job Board" sub={`${filteredMarket.length + filteredCorp.length} jobs available now`} />
                <Badge color="#10B981"><PulseDot color="#10B981" size={5} /> Hiring Open</Badge>
              </div>

              {huBalance < 10 && (
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                    <Lock size={18} className="text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-black text-amber-800">You can browse all jobs, but need {10 - huBalance} more HU to apply</p>
                    <p className="text-[10px] text-amber-600 font-medium mt-0.5">Top up HU to start applying instantly</p>
                  </div>
                  <button onClick={openRefill} className="shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-white bg-amber-500 hover:bg-amber-600 transition-all">
                    Top Up Now
                  </button>
                </div>
              )}

              {/* Mode Toggle */}
              <div className="flex gap-1 p-1 rounded-xl border border-gray-200 bg-white w-fit">
                {(["marketplace", "corporate"] as const).map((m) => (
                  <button key={m} onClick={() => setGigMode(m)}
                    className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${gigMode === m ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-800"}`}>
                    {m === "marketplace" ? "🛒 Freelance" : "🏢 Corporate"}
                  </button>
                ))}
              </div>

              {gigMode === "marketplace" && (
                <>
                  <div className="flex gap-2 flex-wrap">
                    <div className="flex-1 min-w-50 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5">
                      <Search size={14} className="text-gray-400 shrink-0" />
                      <input value={gigSearch} onChange={e => setGigSearch(e.target.value)} placeholder="Search jobs..."
                        className="flex-1 text-[11px] outline-none text-gray-700 placeholder-gray-400 bg-transparent" />
                    </div>
                    <select value={gigSort} onChange={e => setGigSort(e.target.value as any)}
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
                      <div key={l} className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-100 rounded-lg">
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
                        <div key={g.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group">
                          <div className="flex items-start justify-between mb-3">
                            {/* ✅ Premium MarketplaceAvatar — replaces plain colored box */}
                            <MarketplaceAvatar initials={g.avatar} type={g.type} size={44} />
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
                            {canApply ? (
                              <RippleButton onClick={() => handleApply(g.cost)}
                                className="px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest text-white"
                                style={{ background: `linear-gradient(135deg, ${tc}, ${tc}cc)` }}>
                                Apply · {g.cost} HU
                              </RippleButton>
                            ) : (
                              <button onClick={openRefill}
                                className="px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 transition-all">
                                <Lock size={10} /> Need {g.cost} HU
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {filteredMarket.length === 0 && (
                    <div className="text-center py-16 text-gray-400">
                      <Search size={32} className="mx-auto mb-3 opacity-40" />
                      <p className="text-[13px] font-semibold">No jobs match your search</p>
                      <p className="text-[11px] mt-1">Try a different category or search term</p>
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
                    <p className="text-[10px] font-semibold text-blue-700">Corporate jobs from top companies require <strong>50–100 HU</strong> due to higher client standards and verification.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredCorp.map((c) => {
                      const canApply = huBalance >= c.cost;
                      const costColor = c.cost >= 100 ? "#EF4444" : "#8B5CF6";
                      return (
                        <div key={c.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-gray-200 transition-all">
                          <div className="flex items-center gap-4 mb-4">
                            {/* ✅ CompanyLogo with 3-tier fallback */}
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

                          {canApply ? (
                            <RippleButton onClick={() => handleApply(c.cost)}
                              className="w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white flex items-center justify-center gap-2"
                              style={{ background: "linear-gradient(135deg, #0066FF, #0047B3)" }}>
                              <Zap size={12} /> Apply · {c.cost} HU <ArrowUpRight size={12} />
                            </RippleButton>
                          ) : (
                            <button onClick={openRefill}
                              className="w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 transition-all">
                              <Lock size={13} /> Need {c.cost} HU to Apply <ArrowUpRight size={13} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* ══ VAULT / WALLET ════════════════════════════════════ */}
          {activeTab === "earnings" && (
            <motion.div key="earnings" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="space-y-5">
              <SectionHead label="My Wallet" sub="Track your earnings and withdrawals" />
              <div className="flex gap-1 p-1 rounded-xl border border-gray-200 bg-white w-fit">
                {(["overview", "history", "limits", "referral"] as const).map((t) => (
                  <button key={t} onClick={() => setActiveVaultTab(t)}
                    className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeVaultTab === t ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-800"}`}>
                    {t}
                  </button>
                ))}
              </div>

              {activeVaultTab === "overview" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-7 rounded-2xl border border-blue-100 bg-linear-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
                      <div className="flex items-center justify-between mb-5">
                        <Zap size={22} className="text-blue-600" fill="#3B82F6" />
                        <Badge color="#3B82F6"><PulseDot color="#3B82F6" size={5} /> Active</Badge>
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-2">Handshake Units (HU)</p>
                      <div className="flex items-end gap-2 mb-1">
                        <span className="text-[44px] font-black text-gray-900 leading-none">{huBalance}</span>
                        <span className="text-[20px] font-black text-blue-600 mb-1">HU</span>
                      </div>
                      <p className="text-[10px] font-medium text-gray-400">Available to use on jobs</p>
                      <div className="flex gap-2 mt-5">
                        <button onClick={openRefill} className="flex-1 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-700 transition-all">
                          + Top Up
                        </button>
                        <button onClick={() => setActiveVaultTab("history")} className="px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-200 text-blue-600 hover:bg-blue-50 transition-all">
                          History
                        </button>
                      </div>
                    </div>

                    <div className="p-7 rounded-2xl border border-green-100 bg-linear-to-br from-green-50 to-emerald-50 relative overflow-hidden">
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
                      <p className="text-[10px] font-medium text-gray-400">Ready to withdraw</p>
                      <RippleButton onClick={() => addToast("Minimum withdrawal amount is $50.00", "error")}
                        className="mt-5 w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-green-200 text-green-700 hover:bg-green-100 transition-all flex items-center justify-center gap-2">
                        Withdraw Money <ArrowUpRight size={13} />
                      </RippleButton>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <StatCard label="Total Earned" value="$0" icon={<TrendingUp size={15} />} color="#10B981" sub="All time" />
                    <StatCard label="Withdrawn" value="$0" icon={<Download size={15} />} color="#3B82F6" sub="All time" />
                    <StatCard label="Pending" value="$0" icon={<Clock size={15} />} color="#F59E0B" sub="In review" />
                    <StatCard label="HU Spent" value="0" icon={<Zap size={15} />} color="#8B5CF6" sub="All jobs" />
                  </div>

                  <Card className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Calculator size={15} className="text-blue-500" />
                      <span className="text-[11px] font-black text-gray-700 uppercase tracking-wide">HU → KES Calculator</span>
                    </div>
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Units (HU)</p>
                        <input type="number" value={calcHU} onChange={(e) => setCalcHU(e.target.value)}
                          className="bg-transparent w-full text-[16px] font-black outline-none text-gray-900" />
                      </div>
                      <RefreshCw size={14} className="text-gray-400" />
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-right">
                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">KES</p>
                        <p className="text-[16px] font-black text-green-600 leading-none">{isNaN(calcKES) ? "—" : calcKES.toLocaleString()}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <CreditCard size={15} className="text-blue-500" />
                      <span className="text-[11px] font-black text-gray-700 uppercase tracking-wide">How to Withdraw</span>
                    </div>
                    <div className="space-y-3">
                      {[
                        { name: "M-Pesa", sub: "Instant · Safaricom · KES", status: "Active", color: "#10B981", logo: <MpesaLogo /> },
                        { name: "Bank Transfer", sub: "1–3 business days · USD / KES", status: "Available", color: "#3B82F6", logo: <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"><Landmark size={18} className="text-white" /></div> },
                        { name: "Binance USDT", sub: "TRC20 · Instant · Borderless", status: "Available", color: "#F3BA2F", logo: <BinanceLogo /> },
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
                  description="Your full earnings record, withdrawal history, and HU spending history appear here once you complete your first job or top up."
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
                      <p className="text-[9px] text-amber-600 font-medium mt-0.5">Verified accounts get 10x higher withdrawal limits</p>
                    </div>
                    <button onClick={openRefill} className="shrink-0 px-3 py-1.5 rounded-xl text-[9px] font-black text-amber-700 border border-amber-300 bg-amber-100 hover:bg-amber-200 transition-all">
                      Verify
                    </button>
                  </div>
                </div>
              )}

              {activeVaultTab === "referral" && (
                <div className="space-y-4">
                  <div className="p-7 rounded-2xl border border-purple-100 bg-linear-to-br from-purple-50 to-indigo-50 text-center">
                    <Gift size={32} className="mx-auto text-purple-600 mb-3" />
                    <h4 className="text-[18px] font-black text-gray-900 mb-2">Refer Friends & Earn</h4>
                    <p className="text-[11px] text-gray-500 font-medium mb-5">Get 50 free HU for every friend who joins and tops up</p>
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
                      <StatCard label="$ Earned" value="$0" icon={<DollarSign size={14} />} color="#10B981" />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ══ WORK ══════════════════════════════════════════════ */}
          {activeTab === "contracts" && (
            <motion.div key="contracts" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="space-y-5">
              <SectionHead label="My Work" sub="Your active and completed jobs" />

              <div className="grid grid-cols-4 gap-3 opacity-40 pointer-events-none select-none">
                <StatCard label="Active Jobs" value="—" icon={<Briefcase size={15} />} color="#3B82F6" />
                <StatCard label="Completed" value="—" icon={<CheckCircle2 size={15} />} color="#10B981" />
                <StatCard label="Earned" value="—" icon={<DollarSign size={15} />} color="#F59E0B" />
                <StatCard label="Rating" value="—" icon={<Star size={15} />} color="#8B5CF6" />
              </div>

              <PremiumLockedSection
                title="No Jobs Yet"
                description="Apply to your first job to unlock this section. You will see your active contracts, completed work, and client ratings here."
                icon={<FileText size={28} />}
                cta="Browse Jobs Now"
                onCta={() => setActiveTab("tasks")}
                features={["Active contracts", "Client chat", "Milestones", "Earnings log", "Dispute help", "Ratings"]}
              />

              <div className="relative p-6 rounded-2xl border border-gray-100 bg-gray-50 overflow-hidden">
                <div className="absolute inset-0 z-10 bg-white/60" style={{ backdropFilter: "blur(8px)" }} />
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded-full w-2/3" />
                    <div className="h-2 bg-gray-100 rounded-full w-1/2" />
                  </div>
                  <div className="h-5 bg-gray-200 rounded-full w-16" />
                </div>
                <div className="h-2 bg-gray-100 rounded-full w-full mb-2" />
                <div className="h-2 bg-gray-100 rounded-full w-4/5" />
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <div className="flex items-center gap-3 px-5 py-3 rounded-xl border border-gray-200 bg-white shadow-sm">
                    <Lock size={16} className="text-blue-500" />
                    <span className="text-[10px] font-bold text-gray-600">Apply for a job to unlock this section</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══ STATS ═════════════════════════════════════════════ */}
          {activeTab === "analytics" && (
            <motion.div key="analytics" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="space-y-5">
              <SectionHead label="My Stats" sub="Track your performance and earnings" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Success Rate" value="0%" icon={<CheckCircle2 size={15} />} color="#10B981" />
                <StatCard label="Jobs Done" value="0" icon={<Briefcase size={15} />} color="#3B82F6" />
                <StatCard label="Total Earned" value={fmt(0)} icon={<DollarSign size={15} />} color="#F59E0B" />
                <StatCard label="Uptime" value="100%" icon={<Wifi size={15} />} color="#8B5CF6" />
              </div>
              <PremiumLockedSection
                title="Stats Unlock After First Job"
                description="Charts, earnings history, application win rate, and client breakdown appear after you complete your first job."
                icon={<BarChart3 size={28} />}
                cta="Apply to First Job"
                onCta={() => setActiveTab("tasks")}
                features={["Earnings chart", "Win rate", "Client ratings", "Skill breakdown"]}
              />
            </motion.div>
          )}

          {/* ══ SUPPORT ═══════════════════════════════════════════ */}
          {activeTab === "support" && (
            <motion.div key="support" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="max-w-lg mx-auto space-y-5">
              <SectionHead label="Help Center" sub="We are here to help you" />

              <div className="p-4 rounded-xl border border-green-200 bg-green-50 flex items-center gap-4">
                <PulseDot color="#10B981" size={8} />
                <div className="flex-1">
                  <p className="text-[11px] font-black text-green-800">All Systems Running Normally</p>
                  <p className="text-[10px] text-green-600 font-medium">Platform · Payments · Jobs · Wallet — all working fine</p>
                </div>
                <Badge color="#10B981">99.9%</Badge>
              </div>

              <Card className="p-5 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Get in Touch</p>
                {[
                  { label: "Email Us", value: "support@nexusgigs.me", icon: <Mail size={16} />, sub: "We reply within 2 hours", color: "#3B82F6", action: () => window.location.href = "mailto:support@nexusgigs.me" },
                  { label: "Chat on WhatsApp", value: "Tap to open WhatsApp", icon: <MessageCircle size={16} />, sub: "Mon–Fri · 8am–8pm EAT", color: "#25D366", action: () => window.open("https://wa.me/254113637325", "_blank") },
                  { label: "Live Chat", value: "Coming Soon", icon: <MessageSquare size={16} />, sub: "In-app · Under development", color: "#8B5CF6", action: undefined },
                ].map((item, i) => (
                  <div key={i} onClick={item.action}
                    className={`p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-4 ${item.action ? "cursor-pointer hover:border-blue-200 hover:bg-blue-50" : "opacity-50"} transition-all`}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${item.color}15`, color: item.color }}>
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
                  <span className="text-[11px] font-black text-gray-700 uppercase tracking-wide">Common Questions</span>
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
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
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

          {/* ══ MESSAGES ══════════════════════════════════════════ */}
          {activeTab === "messages" && (
            <motion.div key="messages" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <SectionHead label="Messages" sub="System updates and client chats" />
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

              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex items-center gap-3 opacity-60 cursor-not-allowed">
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

        </AnimatePresence>
      </div>

      {/* ══ BOTTOM NAV ════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-100 bg-white border-t border-gray-200 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
        <div className="max-w-5xl mx-auto h-18 flex items-center justify-around px-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 h-full flex-1 transition-all duration-200 relative ${
                activeTab === item.id ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {activeTab === item.id && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.75 rounded-b-full bg-blue-600" />
              )}
              <div className={`transition-all duration-200 ${activeTab === item.id ? "scale-110" : "scale-100"}`}>
                {item.icon}
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-widest leading-none ${activeTab === item.id ? "text-blue-600" : "text-gray-400"}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ══ REFILL MODAL ══════════════════════════════════════════ */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-600 flex items-end sm:items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => !isPaying && setShowModal(false)} />
            <motion.div initial={{ scale: 0.93, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.93, y: 24 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="relative w-full max-w-sm bg-white border border-gray-200 rounded-3xl p-7 shadow-2xl overflow-hidden">

              {modalStep === "packages" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[20px] font-black text-gray-900 leading-none">Top Up HU</h3>
                      <p className="text-[11px] text-gray-400 font-medium mt-1">Pick a package to get started</p>
                    </div>
                    <button onClick={() => setShowModal(false)} className="p-2 bg-gray-100 rounded-xl text-gray-500 hover:bg-gray-200 transition-all">
                      <X size={16} />
                    </button>
                  </div>

                  {huBalance < 10 && (
                    <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-xl">
                      <Zap size={14} className="text-red-500 shrink-0" />
                      <p className="text-[10px] text-red-600 font-bold">You only have {huBalance} HU left. Minimum to apply: 10 HU</p>
                    </div>
                  )}

                  <div className="space-y-2 max-h-72 overflow-y-auto no-scrollbar">
                    {uplinkPackages.map((pkg) => (
                      <RippleButton key={pkg.id} onClick={() => { setSelectedPack(pkg); setModalStep("choice"); }}
                        className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${
                          pkg.hot ? "border-blue-300 bg-blue-50" : "border-gray-100 bg-gray-50 hover:bg-gray-100"}`}>
                        <div className="text-left">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h5 className="text-[12px] font-black text-gray-900">{pkg.name}</h5>
                            {pkg.hot && <Badge color="#3B82F6"><Flame size={9} /> Most Popular</Badge>}
                          </div>
                          <p className="text-[10px] font-medium text-gray-500">{pkg.desc}</p>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <p className="text-[14px] font-black text-gray-900">{pkg.hu} HU</p>
                          <p className="text-[11px] font-black text-blue-600">KES {(pkg.price * RATE).toLocaleString()}</p>
                        </div>
                      </RippleButton>
                    ))}
                  </div>

                  <div onClick={() => setAgreed((a) => !a)}
                    className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-100 transition-all">
                    <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${agreed ? "border-blue-500 bg-blue-500" : "border-gray-300"}`}>
                      {agreed && <Check size={11} className="text-white font-black" />}
                    </div>
                    <p className="text-[10px] font-medium text-gray-500">I agree to the refill terms and platform rules.</p>
                  </div>
                </div>
              )}

              {modalStep === "choice" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setModalStep("packages")} className="p-2 bg-gray-100 rounded-xl text-gray-500 hover:bg-gray-200 transition-all">
                      <ChevronDown size={15} className="rotate-90" />
                    </button>
                    <div>
                      <h4 className="text-[13px] font-black text-gray-900">Choose Payment Method</h4>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                        {selectedPack?.name} · {selectedPack?.hu} HU · <span className="text-blue-600 font-black">KES {((selectedPack?.price || 0) * RATE).toLocaleString()}</span>
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-blue-100 bg-blue-50 flex items-center gap-3">
                    <Info size={13} className="text-blue-500 shrink-0" />
                    <p className="text-[10px] font-medium text-blue-700">
                      You will be charged exactly <strong>KES {((selectedPack?.price || 0) * RATE).toLocaleString()}</strong> for {selectedPack?.hu} HU
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <RippleButton onClick={() => handlePay("CARD")}
                      className="w-full p-4 rounded-xl flex items-center gap-4 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 transition-all">
                      <PaystackLogo size={44} />
                      <div className="flex-1 text-left">
                        <p className="text-[13px] font-black text-gray-900">Bank Card</p>
                        <p className="text-[10px] font-medium text-gray-500 mt-0.5">Visa · Mastercard · via Paystack</p>
                        <p className="text-[9px] text-indigo-600 font-bold mt-0.5">Charges KES {((selectedPack?.price || 0) * RATE).toLocaleString()} exactly</p>
                      </div>
                      <ChevronRight size={16} className="text-gray-400 shrink-0" />
                    </RippleButton>

                    <RippleButton onClick={() => setModalStep("binance")}
                      className="w-full p-4 rounded-xl flex items-center gap-4 border border-amber-200 bg-amber-50 hover:bg-amber-100 transition-all">
                      <BinanceLogo size={44} />
                      <div className="flex-1 text-left">
                        <p className="text-[13px] font-black text-gray-900">Binance USDT</p>
                        <p className="text-[10px] font-medium text-gray-500 mt-0.5">TRC20 network · ${selectedPack?.price}.00 USDT</p>
                        <p className="text-[9px] text-amber-600 font-bold mt-0.5">Scan QR code · Works anywhere in the world</p>
                      </div>
                      <ChevronRight size={16} className="text-gray-400 shrink-0" />
                    </RippleButton>

                    <RippleButton onClick={() => setModalStep("mpesa")}
                      className="w-full p-4 rounded-xl flex items-center gap-4 border border-green-200 bg-green-50 hover:bg-green-100 transition-all">
                      <MpesaLogo size={44} />
                      <div className="flex-1 text-left">
                        <p className="text-[13px] font-black text-gray-900">M-Pesa</p>
                        <p className="text-[10px] font-medium text-gray-500 mt-0.5">Safaricom STK push · KES {((selectedPack?.price || 0) * RATE).toLocaleString()}</p>
                        <p className="text-[9px] text-green-600 font-bold mt-0.5">Instant · No card needed · Kenya only</p>
                      </div>
                      <ChevronRight size={16} className="text-gray-400 shrink-0" />
                    </RippleButton>

                    <div className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 flex items-center gap-4 cursor-not-allowed opacity-50">
                      <PaypalLogo size={44} />
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <p className="text-[13px] font-black text-gray-500">PayPal</p>
                          <Badge color="#EF4444">Not Available</Badge>
                        </div>
                        <p className="text-[10px] font-medium text-gray-400 mt-0.5">Not available in Kenya and most African countries</p>
                      </div>
                      <Lock size={14} className="text-gray-400 shrink-0" />
                    </div>
                  </div>
                </div>
              )}

              {modalStep === "binance" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setModalStep("choice")} className="p-2 bg-gray-100 rounded-xl text-gray-500 hover:bg-gray-200 transition-all">
                      <ChevronDown size={15} className="rotate-90" />
                    </button>
                    <h4 className="text-[13px] font-black text-gray-900">Pay with Binance USDT</h4>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 mx-auto w-fit border border-gray-200">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=TFWxe4TFcjUNgPJVgf5iXrMsw1oe4gDv9X" alt="QR" className="w-36 h-36 block rounded-xl" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <p className="text-[9px] text-gray-400 font-medium mb-1">Amount</p>
                      <p className="text-[14px] font-black text-gray-900">${selectedPack?.price}.00 USDT</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <p className="text-[9px] text-gray-400 font-medium mb-1">Network</p>
                      <p className="text-[14px] font-black text-amber-600">TRC20</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 mb-2">Wallet Address</p>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-[10px] font-mono text-gray-500 truncate">TFWxe4TFcjUNgPJVgf5iXrMsw1oe4gDv9X</div>
                      <button onClick={copyAddress} className="p-3 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 transition-all">
                        {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-gray-500" />}
                      </button>
                    </div>
                  </div>
                  <RippleButton onClick={() => { addToast("Payment received. Your HU will be credited in ~2 hours.", "success"); setShowModal(false); }}
                    className="w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-700 transition-all">
                    I Have Paid — Confirm
                  </RippleButton>
                </div>
              )}

              {modalStep === "mpesa" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setModalStep("choice")} className="p-2 bg-gray-100 rounded-xl text-gray-500 hover:bg-gray-200 transition-all">
                      <ChevronDown size={15} className="rotate-90" />
                    </button>
                    <h4 className="text-[13px] font-black text-gray-900">Pay with M-Pesa</h4>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle size={15} className="text-green-500 shrink-0" />
                      <p className="text-[11px] font-black text-green-800">Total: KES {((selectedPack?.price || 0) * RATE).toLocaleString()}</p>
                    </div>
                    <p className="text-[10px] text-green-600 font-medium pl-6">This exact amount will be taken from your Safaricom account. You get {selectedPack?.hu} HU right away.</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-600 mb-2">Your Safaricom Number</p>
                    <input value={mpesaNum} onChange={(e) => setMpesaNum(e.target.value)} placeholder="254712345678"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-[18px] font-black text-gray-900 outline-none focus:border-blue-400 text-center tracking-widest transition-all placeholder:text-gray-300 focus:bg-white" />
                    <p className="text-[10px] text-gray-400 font-medium mt-2 text-center">Format: 254XXXXXXXXX — 12 digits total</p>
                  </div>
                  <RippleButton disabled={isPaying} onClick={() => handlePay("MPESA")}
                    className="w-full py-4 rounded-xl text-[11px] font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 transition-all">
                    {isPaying ? <><RefreshCw size={14} className="animate-spin" /> Sending prompt…</> : `Pay KES ${((selectedPack?.price || 0) * RATE).toLocaleString()} — Send to My Phone`}
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
};5