"use client";

import { useState, useMemo } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Briefcase, FileText, MessageSquare, Wallet, BarChart3, User,
  ShieldCheck, Zap, Lock, Rocket, CreditCard, ChevronRight, AlertTriangle,
  CheckCircle2, Clock, ShieldAlert, Activity, Landmark, Bitcoin, LifeBuoy,
  X, CheckCircle, UserCircle, DollarSign, ArrowUpRight, Shield, Send, Copy,
  Check, Sparkles, Building2, ArrowRight, RefreshCw, Eye, EyeOff, Search,
  BellRing, Flame, BadgeCheck, Calculator, Settings, TrendingUp, Target,
  Star, Globe, Award, Gift, Bell, Key, Smartphone, Mail, MapPin, Calendar,
  Edit3, ExternalLink, Download, Upload, AlertCircle, Trophy, Hash, Percent,
  Info, Phone, BookOpen, Plus, Trash2, LogOut, Crown, Gem, MessageCircle,
  Code, Palette, Camera, Filter, Banknote, Building, Coins, Wallet2,
} from "lucide-react";

interface Toast { id: number; msg: string; type: "success" | "error" | "info" }

/* ─────────────────────────────────────────────────────────────────────────
   PRIMITIVES
   ───────────────────────────────────────────────────────────────────────── */

const RippleButton = ({
  children, onClick, className = "", disabled = false, style,
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const handleClick = (e: React.MouseEvent) => {
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
      className={`relative overflow-hidden ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute rounded-full bg-white/40 pointer-events-none"
          style={{
            left: r.x, top: r.y, width: 0, height: 0,
            transform: "translate(-50%, -50%)",
            animation: "ripple 0.7s ease-out forwards",
          }}
        />
      ))}
      <style jsx>{`
        @keyframes ripple {
          to { width: 300px; height: 300px; opacity: 0; }
        }
      `}</style>
    </button>
  );
};

const Card = ({ children, className = "", onClick }: {
  children: React.ReactNode; className?: string; onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-2xl border border-gray-100 ${onClick ? "cursor-pointer hover:border-gray-200 hover:shadow-sm transition-all" : ""} ${className}`}
  >
    {children}
  </div>
);

const StatCard = ({ label, value, icon, color = "#0066FF", sub }: {
  label: string; value: string | number; icon: React.ReactNode; color?: string; sub?: string;
}) => (
  <Card className="p-4">
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
      style={{ backgroundColor: `${color}15`, color }}
    >{icon}</div>
    <p className="text-lg font-black text-gray-900 leading-none">{value}</p>
    {sub && <p className="text-[9px] text-gray-400 mt-1">{sub}</p>}
    <p className="text-[10px] text-gray-500 mt-1 font-medium">{label}</p>
  </Card>
);

const Badge = ({ children, color = "#0066FF", className = "" }: {
  children: React.ReactNode; color?: string; className?: string;
}) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold ${className}`}
    style={{ backgroundColor: `${color}15`, color }}
  >{children}</span>
);

const SectionHead = ({ label, sub }: { label: string; sub?: string }) => (
  <div className="mb-3">
    <h3 className="text-sm font-black text-gray-900">{label}</h3>
    {sub && <p className="text-[10px] text-gray-500 mt-0.5">{sub}</p>}
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────
   COMPANY LOGO (3-tier fallback)
   ───────────────────────────────────────────────────────────────────────── */

const CompanyLogo = ({ name, domain, size = 44 }: { name: string; domain: string; size?: number }) => {
  const [imgSrc, setImgSrc] = useState<string | null>(`https://logo.clearbit.com/${domain}`);
  const [stage, setStage] = useState<"clearbit" | "favicon" | "initials">("clearbit");
  const initials = name.replace(/[^a-zA-Z\s]/g, "").split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("");
  const palette = [
    { bg: "#EFF6FF", text: "#1D4ED8" }, { bg: "#F0FDF4", text: "#15803D" },
    { bg: "#FDF4FF", text: "#7E22CE" }, { bg: "#FFF7ED", text: "#C2410C" },
    { bg: "#F0F9FF", text: "#0369A1" }, { bg: "#FFF1F2", text: "#BE123C" },
  ][name.charCodeAt(0) % 6];

  const handleError = () => {
    if (stage === "clearbit") { setStage("favicon"); setImgSrc(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`); }
    else { setStage("initials"); setImgSrc(null); }
  };

  if (!imgSrc) return (
    <div className="rounded-xl flex items-center justify-center font-black border"
      style={{ width: size, height: size, backgroundColor: palette.bg, color: palette.text, borderColor: `${palette.text}20`, fontSize: size * 0.35 }}>
      {initials || "?"}
    </div>
  );
  return (
    <div className="rounded-xl bg-white border border-gray-100 p-1.5 flex items-center justify-center" style={{ width: size, height: size }}>
      <img src={imgSrc} alt={name} onError={handleError} className="w-full h-full object-contain" />
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────
   FREELANCER AVATAR — now uses real DiceBear portraits
   ───────────────────────────────────────────────────────────────────────── */

const FreelancerAvatar = ({ seed, type, size = 44 }: { seed: string; type: string; size?: number }) => {
  const ringColor: Record<string, string> = {
    "Web Dev": "#3B82F6", "Design": "#8B5CF6", "Writing": "#10B981",
    "Marketing": "#F59E0B", "Data": "#06B6D4", "AI": "#EF4444",
    "Security": "#DC2626", "Web3": "#7C3AED", "Video": "#EC4899",
  };
  const ring = ringColor[type] || "#6B7280";
  const url = `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=eff6ff,f0fdf4,fdf4ff,fff7ed,f0f9ff,fff1f2`;
  return (
    <div className="rounded-xl overflow-hidden bg-white border-2 shrink-0" style={{ width: size, height: size, borderColor: ring }}>
      <img src={url} alt={seed} className="w-full h-full object-cover" />
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────
   PAYMENT METHOD LOGOS — official-style brand marks
   ───────────────────────────────────────────────────────────────────────── */

const MpesaLogo = ({ size = 40 }: { size?: number }) => (
  <div className="rounded-xl flex items-center justify-center font-black text-white shadow-sm"
    style={{ width: size, height: size, background: "linear-gradient(135deg, #43B02A 0%, #2E7D1F 100%)" }}>
    <span style={{ fontSize: size * 0.32, letterSpacing: "-0.5px" }}>M-PESA</span>
  </div>
);

const BinanceLogo = ({ size = 40 }: { size?: number }) => (
  <div className="rounded-xl flex items-center justify-center shadow-sm"
    style={{ width: size, height: size, background: "linear-gradient(135deg, #F3BA2F 0%, #E0A60E 100%)" }}>
    <svg viewBox="0 0 126.61 126.61" width={size * 0.6} height={size * 0.6}>
      <path fill="#fff" d="M38.73 53.2l24.59-24.58 24.6 24.6 14.3-14.31L63.32 0 24.42 38.9zM0 63.31l14.3-14.3 14.3 14.3-14.3 14.3zm38.73 10.11l24.59 24.59 24.6-24.6 14.31 14.29-38.9 38.91-38.91-38.88zm59.28-10.11l14.3-14.31 14.3 14.3-14.3 14.31z"/>
      <path fill="#fff" d="M77.83 63.3L63.32 48.78 52.59 59.5l-1.23 1.24-2.54 2.54 14.5 14.51 14.51-14.49z"/>
    </svg>
  </div>
);

const BankLogo = ({ size = 40 }: { size?: number }) => (
  <div className="rounded-xl flex items-center justify-center shadow-sm"
    style={{ width: size, height: size, background: "linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)" }}>
    <Landmark size={size * 0.55} className="text-white" strokeWidth={2.2} />
  </div>
);

const PaypalLogo = ({ size = 40 }: { size?: number }) => (
  <div className="rounded-xl flex items-center justify-center shadow-sm bg-white border border-gray-200"
    style={{ width: size, height: size }}>
    <svg viewBox="0 0 24 24" width={size * 0.65} height={size * 0.65}>
      <path fill="#003087" d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/>
      <path fill="#0070BA" d="M19.93 6.534c-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.105-.32 2.027a.563.563 0 0 0 .555.65h3.882c.46 0 .85-.334.922-.788l.038-.197.731-4.64.047-.255a.93.93 0 0 1 .921-.788h.581c3.762 0 6.705-1.528 7.564-5.946.359-1.847.173-3.388-.777-4.471a3.71 3.71 0 0 0-1.06-.83z"/>
      <path fill="#001C64" d="M19.93 6.534a8.063 8.063 0 0 0-.99-.218c-.61-.099-1.279-.146-1.996-.146h-6.057a.92.92 0 0 0-.91.788l-1.288 8.165-.037.238a1.05 1.05 0 0 1 1.05-.9h2.19c4.298 0 7.664-1.747 8.647-6.797.03-.149.054-.294.077-.437a5.243 5.243 0 0 0-.686-.693z"/>
    </svg>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────────────────────────────────── */

export const FreelancerView = ({ jobs, userMetadata }: { jobs: any[]; userMetadata: any }) => {
  const { user } = useUser();
  const RATE = 130;
  const [currency, setCurrency] = useState<"USD" | "KES">("USD");
  const fmt = (usd: number) =>
    currency === "USD"
      ? `$${usd.toLocaleString()}`
      : `KES ${(usd * RATE).toLocaleString()}`;

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
  const isVerified = userMetadata?.status === "Verified";

  // Top-up modal
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState<"packages" | "choice" | "mpesa" | "binance" | "bank" | "paypal">("packages");
  const [selectedPack, setSelectedPack] = useState<any>(null);
  const [agreed, setAgreed] = useState(false);
  const [mpesaNum, setMpesaNum] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [copied, setCopied] = useState(false);

  // Me tab state
  const [meSection, setMeSection] = useState<"profile" | "achievements" | "settings" | "referrals">("profile");
  const [editingProfile, setEditingProfile] = useState(false);
  const [profile, setProfile] = useState({
    headline: "Full-Stack Developer · React · Node",
    bio: "Building production web apps for 5+ years. Specialized in React, Next.js and serverless architectures.",
    location: "Nairobi, Kenya",
    languages: ["English", "Swahili"],
    skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
  });
  const [newSkill, setNewSkill] = useState("");
  const [notifications, setNotifications] = useState({
    missions: true, payments: true, messages: false, weekly: true, newGigs: true,
  });
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const referralCode = useMemo(() => "NEXUS-" + (user?.id?.slice(-6).toUpperCase() || "OPER42"), [user]);
  const [payoutMethods, setPayoutMethods] = useState([
    { id: 1, type: "M-Pesa", details: "+254 7•• ••• 432", primary: true },
    { id: 2, type: "Bank", details: "KCB •••• 8821", primary: false },
  ]);

  const uplinkPackages = [
    { id: 1, name: "Starter", price: 3, hu: 150, desc: "A few small gigs.", hot: false },
    { id: 2, name: "Basic", price: 6, hu: 400, desc: "More local tasks.", hot: false },
    { id: 3, name: "Pro Uplink", price: 10, hu: 1200, desc: "Global missions.", hot: true },
    { id: 4, name: "Elite", price: 18, hu: 2500, desc: "Priority + HR line.", hot: false },
    { id: 5, name: "Alpha", price: 30, hu: 5000, desc: "Top tier.", hot: false },
  ];

  // Marketplace gigs
  const marketplaceGigs = useMemo(() => [
    { id: "m1", title: "Fix Bugs in My WordPress Site", budget: 80, client: "BlogPro Media", avatar: "BlogPro", type: "Web Dev", duration: "2 Days", cost: 10, level: "Basic" },
    { id: "m2", title: "Write 5 Blog Posts About Finance", budget: 120, client: "Money Tips KE", avatar: "MoneyTips", type: "Writing", duration: "4 Days", cost: 10, level: "Basic" },
    { id: "m3", title: "Create a Logo for My Restaurant", budget: 90, client: "Taste of Nairobi", avatar: "TasteNbo", type: "Design", duration: "3 Days", cost: 10, level: "Basic" },
    { id: "m4", title: "Set Up My Instagram Business Page", budget: 60, client: "Fashionista KE", avatar: "Fashion", type: "Marketing", duration: "1 Day", cost: 10, level: "Basic" },
    { id: "m5", title: "Excel Data Entry & Cleanup", budget: 75, client: "Accounts Plus", avatar: "Accounts", type: "Data", duration: "2 Days", cost: 10, level: "Basic" },
    { id: "m6", title: "Build a Simple E-Commerce Website", budget: 450, client: "ShopEasy Ltd", avatar: "ShopEasy", type: "Web Dev", duration: "7 Days", cost: 20, level: "Standard" },
    { id: "m7", title: "Design Pitch Deck for Startup", budget: 350, client: "Venture Lab", avatar: "Venture", type: "Design", duration: "5 Days", cost: 20, level: "Standard" },
    { id: "m8", title: "Python Script for Automated Reports", budget: 280, client: "DataFlow Inc", avatar: "DataFlow", type: "Data", duration: "4 Days", cost: 20, level: "Standard" },
    { id: "m9", title: "Social Media Management (1 Month)", budget: 400, client: "BrandBoost KE", avatar: "Brand", type: "Marketing", duration: "30 Days", cost: 20, level: "Standard" },
    { id: "m10", title: "Mobile App UI Design (Figma)", budget: 600, client: "AppCraft Studio", avatar: "AppCraft", type: "Design", duration: "8 Days", cost: 20, level: "Standard" },
    { id: "m11", title: "SEO Optimization for Small Business", budget: 320, client: "Rank Fast KE", avatar: "RankFast", type: "Marketing", duration: "5 Days", cost: 20, level: "Standard" },
    { id: "m12", title: "Full-Stack Web App with React & Node", budget: 1200, client: "TechBuild Africa", avatar: "TechBuild", type: "Web Dev", duration: "14 Days", cost: 30, level: "Advanced" },
    { id: "m13", title: "AI Chatbot for Customer Support", budget: 950, client: "RetailBot Inc", avatar: "RetailBot", type: "AI", duration: "10 Days", cost: 30, level: "Advanced" },
    { id: "m14", title: "Cybersecurity Audit for Company", budget: 1500, client: "SecureNet Ltd", avatar: "Secure", type: "Security", duration: "7 Days", cost: 30, level: "Advanced" },
    { id: "m15", title: "Smart Contract Development (Solidity)", budget: 1800, client: "Nexus Protocol", avatar: "NexusP", type: "Web3", duration: "10 Days", cost: 30, level: "Advanced" },
    { id: "m16", title: "ML Model for Sales Predictions", budget: 1400, client: "Predict Pro", avatar: "Predict", type: "AI", duration: "12 Days", cost: 30, level: "Advanced" },
    { id: "m17", title: "API Security Penetration Testing", budget: 2100, client: "SafeVault Corp", avatar: "Vault", type: "Security", duration: "7 Days", cost: 50, level: "Expert" },
    { id: "m18", title: "NFT Collection Smart Contracts", budget: 2800, client: "CryptoArt Hub", avatar: "Crypto", type: "Web3", duration: "14 Days", cost: 50, level: "Expert" },
    { id: "m19", title: "Enterprise CRM Integration", budget: 3200, client: "SalesForce Partners", avatar: "Sales", type: "Web Dev", duration: "21 Days", cost: 50, level: "Expert" },
    { id: "m20", title: "Computer Vision System", budget: 4000, client: "VisionAI Labs", avatar: "Vision", type: "AI", duration: "21 Days", cost: 50, level: "Expert" },
    { id: "m21", title: "DeFi Protocol Architecture & Audit", budget: 5000, client: "DeFi Builders", avatar: "DeFi", type: "Web3", duration: "30 Days", cost: 50, level: "Expert" },
    { id: "m22", title: "Next.js Speed & SEO Overhaul", budget: 1800, client: "E-Com Solutions", avatar: "ECom", type: "Web Dev", duration: "10 Days", cost: 30, level: "Advanced" },
    { id: "m23", title: "Brand Identity Design System", budget: 2200, client: "Branding Co", avatar: "Branding", type: "Design", duration: "14 Days", cost: 30, level: "Advanced" },
    { id: "m24", title: "Video Editing for YouTube", budget: 200, client: "Content King KE", avatar: "Content", type: "Video", duration: "5 Days", cost: 10, level: "Basic" },
  ], []);

  const corporateGigs = useMemo(() => [
    { id: "c1", title: "Remote Fleet Data Analyst", salary: 8000, domain: "tesla.com", company: "Tesla", cost: 50, badge: "EV · Remote", dept: "Engineering" },
    { id: "c2", title: "Cloud Support Engineer", salary: 9000, domain: "amazon.com", company: "Amazon", cost: 50, badge: "AWS · Senior", dept: "Cloud" },
    { id: "c3", title: "Payment Integrity Analyst", salary: 11000, domain: "stripe.com", company: "Stripe", cost: 50, badge: "FinTech · Remote", dept: "Finance" },
    { id: "c4", title: "Security Operations Specialist", salary: 12000, domain: "kraken.com", company: "Kraken", cost: 50, badge: "Crypto · Remote", dept: "Security" },
    { id: "c5", title: "Frontend Engineer (React)", salary: 10500, domain: "shopify.com", company: "Shopify", cost: 50, badge: "E-Com · Remote", dept: "Engineering" },
    { id: "c6", title: "Data Platform Engineer", salary: 13500, domain: "databricks.com", company: "Databricks", cost: 100, badge: "Data · Senior", dept: "Data" },
    { id: "c7", title: "Product Manager — Africa", salary: 9500, domain: "google.com", company: "Google", cost: 100, badge: "Remote · Senior", dept: "Product" },
    { id: "c8", title: "Mobile Engineer (iOS/Android)", salary: 11000, domain: "meta.com", company: "Meta", cost: 100, badge: "Remote · Mid", dept: "Engineering" },
    { id: "c9", title: "DevOps Engineer", salary: 10000, domain: "microsoft.com", company: "Microsoft", cost: 50, badge: "Azure · Remote", dept: "Infrastructure" },
    { id: "c10", title: "UX Researcher", salary: 8500, domain: "airbnb.com", company: "Airbnb", cost: 50, badge: "Remote · Contract", dept: "Design" },
    { id: "c11", title: "Blockchain Developer", salary: 14000, domain: "coinbase.com", company: "Coinbase", cost: 100, badge: "Crypto · Remote", dept: "Engineering" },
    { id: "c12", title: "Growth Marketing Manager", salary: 9000, domain: "spotify.com", company: "Spotify", cost: 50, badge: "Marketing · Remote", dept: "Marketing" },
    { id: "c13", title: "ML Infrastructure Engineer", salary: 15000, domain: "openai.com", company: "OpenAI", cost: 100, badge: "AI · Remote", dept: "AI" },
    { id: "c14", title: "Backend Engineer (Go/Rust)", salary: 12000, domain: "discord.com", company: "Discord", cost: 50, badge: "Remote · Mid", dept: "Engineering" },
    { id: "c15", title: "Site Reliability Engineer", salary: 12500, domain: "netflix.com", company: "Netflix", cost: 100, badge: "Remote · Senior", dept: "Infrastructure" },
    { id: "c16", title: "API Developer (Payments)", salary: 10000, domain: "paypal.com", company: "PayPal", cost: 50, badge: "FinTech · Remote", dept: "Engineering" },
    { id: "c17", title: "Cloud Security Architect", salary: 16000, domain: "cloudflare.com", company: "Cloudflare", cost: 100, badge: "Security · Senior", dept: "Security" },
    { id: "c18", title: "iOS Engineer", salary: 11500, domain: "uber.com", company: "Uber", cost: 50, badge: "Mobile · Remote", dept: "Engineering" },
    { id: "c19", title: "Full Stack Engineer (TS)", salary: 10000, domain: "notion.so", company: "Notion", cost: 50, badge: "SaaS · Remote", dept: "Engineering" },
    { id: "c20", title: "Analytics Engineer", salary: 9500, domain: "figma.com", company: "Figma", cost: 50, badge: "Design · Remote", dept: "Data" },
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

  const filteredCorp = useMemo(() =>
    corpCategory === "All" ? corporateGigs : corporateGigs.filter(c => c.dept === corpCategory),
  [corpCategory, corporateGigs]);

  const typeColors: Record<string, string> = {
    "Web Dev": "#3B82F6", "Design": "#8B5CF6", "Writing": "#10B981",
    "Marketing": "#F59E0B", "Data": "#06B6D4", "AI": "#EF4444",
    "Security": "#DC2626", "Web3": "#7C3AED", "Video": "#EC4899",
  };
  const levelColors: Record<string, string> = {
    "Basic": "#10B981", "Standard": "#3B82F6", "Advanced": "#8B5CF6", "Expert": "#EF4444",
  };

  // Achievements
  const achievements = [
    { icon: <Trophy size={18}/>, title: "First Gig", desc: "Completed your first project", earned: true, color: "#F59E0B" },
    { icon: <Star size={18}/>, title: "5-Star Streak", desc: "Five consecutive 5-star reviews", earned: true, color: "#3B82F6" },
    { icon: <Flame size={18}/>, title: "On Fire", desc: "10 gigs in 30 days", earned: false, color: "#EF4444" },
    { icon: <Crown size={18}/>, title: "Top Earner", desc: "Hit $5,000 lifetime earnings", earned: false, color: "#8B5CF6" },
    { icon: <Gem size={18}/>, title: "Premium Tier", desc: "Reached Elite rank", earned: false, color: "#06B6D4" },
    { icon: <BadgeCheck size={18}/>, title: "Verified Pro", desc: "ID + skills verification", earned: true, color: "#10B981" },
  ];

  const navItems = [
    { id: "home",      icon: <Home size={18}/>,         label: "Home"   },
    { id: "tasks",     icon: <Briefcase size={18}/>,    label: "Jobs"   },
    { id: "earnings",  icon: <Wallet size={18}/>,       label: "Wallet" },
    { id: "messages",  icon: <MessageSquare size={18}/>,label: "Chats"  },
    { id: "me",        icon: <User size={18}/>,         label: "Me"     },
  ];

  const openRefill = () => { setModalStep("packages"); setShowModal(true); };

  const handleApply = (cost: number) => {
    if (huBalance >= cost) {
      setHuBalance(p => p - cost);
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
          body: JSON.stringify({ amount: kesAmount, currency: "KES", email: user?.primaryEmailAddress?.emailAddress, metadata: { hu: selectedPack.hu, pack: selectedPack.name } }),
        });
        const data = await res.json();
        if (data?.data?.authorization_url) window.location.href = data.data.authorization_url;
        else addToast("Payment error.", "error");
      } else {
        const clean = mpesaNum.replace(/\D/g, "");
        if (!clean.startsWith("254") || clean.length !== 12) {
          addToast("Use format: 254XXXXXXXXX", "error"); setIsPaying(false); return;
        }
        const res = await fetch("/api/intasend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: selectedPack.price * RATE, phone: clean, email: user?.primaryEmailAddress?.emailAddress, metadata: { hu: selectedPack.hu } }),
        });
        if (res.ok) { addToast("Check your phone — M-Pesa prompt sent!", "success"); setShowModal(false); }
        else addToast("M-Pesa connection failed.", "error");
      }
    } catch { addToast("Network error.", "error"); }
    finally { setIsPaying(false); }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText("TFWxe4TFcjUNgPJVgf5iXrMsw1oe4gDv9X");
    setCopied(true);
    addToast("Address copied!", "success");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 relative">
      {/* Subtle accent line — replaces the dark nexusgigs top bar */}
      <div className="h-1 w-full bg-linear-to-r from-blue-500 via-purple-500 to-emerald-500" />

      {/* Toasts */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-[92%] max-w-md">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-[12px] font-semibold backdrop-blur ${
                t.type === "success" ? "bg-emerald-600/95 text-white" :
                t.type === "error"   ? "bg-red-600/95 text-white" :
                                       "bg-gray-900/95 text-white"
              }`}
            >
              {t.type === "success" ? <CheckCircle2 size={16}/> : t.type === "error" ? <AlertTriangle size={16}/> : <Info size={16}/>}
              <span className="flex-1">{t.msg}</span>
              <button onClick={() => setToasts(p => p.filter(x => x.id !== t.id))} className="opacity-60 hover:opacity-100">
                <X size={14}/>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Main */}
      <main className="max-w-md mx-auto px-4 pt-6 pb-6">
        <AnimatePresence mode="wait">

          {/* ════════════════════════════════ HOME ════════════════════════════════ */}
          {activeTab === "home" && (
            <motion.div key="home" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Welcome back</p>
                  <h1 className="text-2xl font-black text-gray-900 mt-1">{user?.firstName || "Operator"}</h1>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[10px] text-gray-500 font-medium">Connected · All systems operational</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg">
                    <Zap size={12} className="text-blue-600" />
                    <span className="text-[12px] font-black text-blue-700">{huBalance}</span>
                    <span className="text-[9px] font-bold text-blue-500">HU</span>
                  </div>
                  <button
                    onClick={() => setCurrency(c => c === "USD" ? "KES" : "USD")}
                    className="text-[9px] font-bold bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg text-gray-500 hover:text-gray-800"
                  >
                    {currency} ⇄ Switch
                  </button>
                </div>
              </div>

              {/* Hero CTA */}
              <div className="rounded-3xl p-6 text-white relative overflow-hidden"
                   style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E3A8A 60%, #312E81 100%)" }}>
                <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-blue-500/20 blur-3xl" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
                      <ShieldCheck size={18}/>
                    </div>
                    <div>
                      <p className="text-[12px] font-black">Handshake Units Required</p>
                      <p className="text-[9px] uppercase tracking-widest text-white/50 font-bold">Access tokens</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-white/70 leading-relaxed mb-4">
                    Every job application uses HU. Keeps spam out, puts serious workers first.
                  </p>
                  <div className="flex gap-2">
                    <RippleButton onClick={openRefill}
                      className="flex-1 bg-white text-blue-700 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:shadow-lg transition-all">
                      Top Up HU
                    </RippleButton>
                    <button onClick={() => setActiveTab("tasks")}
                      className="px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/30 text-white/80 hover:bg-white/10">
                      Browse →
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <StatCard label="Earnings" value={fmt(2480)} icon={<DollarSign size={16}/>} color="#10B981" sub="Lifetime" />
                <StatCard label="Active Jobs" value="3" icon={<Briefcase size={16}/>} color="#3B82F6" sub="In progress" />
                <StatCard label="Rating" value="4.9★" icon={<Star size={16}/>} color="#8B5CF6" sub="From 27 reviews" />
                <StatCard label="Success Rate" value="98%" icon={<TrendingUp size={16}/>} color="#F59E0B" sub="On-time delivery" />
              </div>

              {huBalance < 10 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
                    <AlertTriangle size={16} className="text-amber-600"/>
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-bold text-amber-900">Need at least 10 HU to apply</p>
                    <p className="text-[10px] text-amber-700">Balance: {huBalance} · Need {10 - huBalance} more</p>
                  </div>
                  <button onClick={openRefill} className="bg-amber-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg">Top Up</button>
                </div>
              )}

              {/* Quick actions */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { icon: <CreditCard size={16}/>, label: "Top Up", color: "#3B82F6", bg: "#EFF6FF", action: openRefill },
                  { icon: <Search size={16}/>, label: "Jobs", color: "#8B5CF6", bg: "#F5F3FF", action: () => setActiveTab("tasks") },
                  { icon: <Wallet size={16}/>, label: "Wallet", color: "#10B981", bg: "#ECFDF5", action: () => setActiveTab("earnings") },
                  { icon: <User size={16}/>, label: "Me", color: "#F59E0B", bg: "#FFFBEB", action: () => setActiveTab("me") },
                ].map((q, i) => (
                  <button key={i} onClick={q.action} className="bg-white rounded-2xl border border-gray-100 p-3 hover:border-gray-200 hover:shadow-sm transition">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto" style={{ backgroundColor: q.bg, color: q.color }}>
                      {q.icon}
                    </div>
                    <p className="text-[10px] font-bold text-gray-700 mt-2">{q.label}</p>
                  </button>
                ))}
              </div>

              {/* Live activity */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Activity size={14} className="text-emerald-600"/>
                    <h3 className="text-sm font-black text-gray-900">Live Activity</h3>
                  </div>
                  <Badge color="#10B981">● Live</Badge>
                </div>
                <div className="space-y-2.5">
                  {[
                    { msg: "Emmanuel K. earned $850", time: "2m", color: "#10B981" },
                    { msg: "David N. applied to Tesla", time: "7m", color: "#3B82F6" },
                    { msg: "Alice V. withdrew KES 14,000", time: "15m", color: "#8B5CF6" },
                    { msg: "John M. topped up Pro Uplink", time: "22m", color: "#F59E0B" },
                  ].map((a, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: a.color }} />
                      <span className="flex-1 text-gray-700">{a.msg}</span>
                      <span className="text-gray-400 text-[10px]">{a.time}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Companies */}
              <div>
                <SectionHead label="Companies Hiring Now" />
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
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
                      className="shrink-0 p-3 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-sm transition">
                      <CompanyLogo name={c.name} domain={c.domain} size={36} />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ════════════════════════════════ JOBS ════════════════════════════════ */}
          {activeTab === "tasks" && (
            <motion.div key="tasks" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900">Find Work</h2>
                <Badge color="#10B981">● Hiring open</Badge>
              </div>

              {/* Mode toggle */}
              <div className="bg-white border border-gray-100 rounded-2xl p-1 flex">
                {(["marketplace", "corporate"] as const).map(m => (
                  <button key={m} onClick={() => setGigMode(m)}
                    className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition ${
                      gigMode === m ? "bg-blue-600 text-white shadow-sm" : "text-gray-500"
                    }`}>
                    {m === "marketplace" ? "🛒 Freelance" : "🏢 Corporate"}
                  </button>
                ))}
              </div>

              {gigMode === "marketplace" && (
                <>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-white border border-gray-200 rounded-xl px-3 flex items-center gap-2">
                      <Search size={14} className="text-gray-400"/>
                      <input value={gigSearch} onChange={e => setGigSearch(e.target.value)} placeholder="Search jobs..."
                        className="flex-1 text-[11px] outline-none py-2.5 bg-transparent text-gray-700"/>
                    </div>
                    <select value={gigSort} onChange={e => setGigSort(e.target.value as any)}
                      className="bg-white border border-gray-200 rounded-xl px-2 text-[11px] font-semibold text-gray-600 outline-none">
                      <option value="newest">Newest</option>
                      <option value="highest">Highest pay</option>
                      <option value="lowest">Lowest pay</option>
                    </select>
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
                    {gigCategories.map(cat => (
                      <button key={cat} onClick={() => setGigCategory(cat)}
                        className={`shrink-0 px-4 py-1.5 rounded-full text-[10px] font-bold border transition ${
                          gigCategory === cat ? "bg-blue-600 text-white border-blue-600" : "bg-white border-gray-200 text-gray-500"
                        }`}>{cat}</button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {filteredMarket.map(g => {
                      const canApply = huBalance >= g.cost;
                      const lc = levelColors[g.level] || "#3B82F6";
                      const tc = typeColors[g.type] || "#3B82F6";
                      return (
                        <Card key={g.id} className="p-4">
                          <div className="flex items-start gap-3 mb-3">
                            {/* ✅ Profile pic added */}
                            <FreelancerAvatar seed={g.avatar} type={g.type} size={44}/>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-gray-900 leading-tight">{g.title}</h4>
                              <p className="text-[10px] text-gray-500 mt-0.5">{g.client} · {g.duration}</p>
                              <div className="flex gap-1.5 mt-2">
                                <Badge color={tc}>{g.type}</Badge>
                                <Badge color={lc}>{g.level}</Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div>
                              <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest">Budget</p>
                              <p className="text-base font-black text-gray-900">{fmt(g.budget)}</p>
                            </div>
                            <RippleButton onClick={() => handleApply(g.cost)}
                              className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                canApply ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-100 text-gray-400"
                              }`}>
                              Apply · {g.cost} HU
                            </RippleButton>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </>
              )}

              {gigMode === "corporate" && (
                <>
                  <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
                    {corpDepts.map(d => (
                      <button key={d} onClick={() => setCorpCategory(d)}
                        className={`shrink-0 px-4 py-1.5 rounded-full text-[10px] font-bold border transition ${
                          corpCategory === d ? "bg-blue-600 text-white border-blue-600" : "bg-white border-gray-200 text-gray-500"
                        }`}>{d}</button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {filteredCorp.map(c => {
                      const canApply = huBalance >= c.cost;
                      return (
                        <Card key={c.id} className="p-4">
                          <div className="flex items-start gap-3 mb-3">
                            <CompanyLogo name={c.company} domain={c.domain} size={44}/>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-gray-900 leading-tight">{c.title}</h4>
                              <p className="text-[10px] text-gray-500 mt-0.5">{c.company} · {c.dept}</p>
                              <div className="mt-2"><Badge color="#3B82F6">{c.badge}</Badge></div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div>
                              <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest">Salary</p>
                              <p className="text-base font-black text-gray-900">{fmt(c.salary)}<span className="text-[10px] text-gray-400">/mo</span></p>
                            </div>
                            <RippleButton onClick={() => handleApply(c.cost)}
                              className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                canApply ? "bg-gray-900 text-white hover:bg-black" : "bg-gray-100 text-gray-400"
                              }`}>
                              Apply · {c.cost} HU
                            </RippleButton>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* ════════════════════════════════ WALLET ════════════════════════════════ */}
          {activeTab === "earnings" && (
            <motion.div key="earnings" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <h2 className="text-xl font-black text-gray-900">Wallet</h2>

              <div className="rounded-3xl p-6 text-white relative overflow-hidden"
                   style={{ background: "linear-gradient(135deg, #065F46 0%, #047857 60%, #064E3B 100%)" }}>
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-emerald-400/20 blur-3xl"/>
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold">Available Balance</p>
                    <button onClick={() => setShowBalance(s => !s)} className="text-white/60 hover:text-white">
                      {showBalance ? <Eye size={14}/> : <EyeOff size={14}/>}
                    </button>
                  </div>
                  <p className="text-3xl font-black mt-2">{showBalance ? fmt(2480) : "•••••"}</p>
                  <div className="flex gap-2 mt-5">
                    <button className="flex-1 bg-white text-emerald-700 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">
                      <Download size={12} className="inline mr-1"/> Withdraw
                    </button>
                    <button onClick={openRefill} className="flex-1 border border-white/30 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">
                      <Upload size={12} className="inline mr-1"/> Top Up
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <SectionHead label="Payment methods" sub="Choose how to send & receive money" />
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { logo: <MpesaLogo size={36}/>, name: "M-Pesa", sub: "Instant · KE", color: "#43B02A" },
                    { logo: <BinanceLogo size={36}/>, name: "Binance", sub: "USDT · Crypto", color: "#F3BA2F" },
                    { logo: <BankLogo size={36}/>, name: "Bank", sub: "1–2 days", color: "#1E3A8A" },
                    { logo: <PaypalLogo size={36}/>, name: "PayPal", sub: "Global", color: "#003087" },
                  ].map((m, i) => (
                    <Card key={i} className="p-4 hover:border-blue-200 hover:shadow-sm transition cursor-pointer">
                      <div className="flex items-center gap-3 mb-3">
                        {m.logo}
                        <div className="min-w-0">
                          <p className="text-[12px] font-black text-gray-900 truncate">{m.name}</p>
                          <p className="text-[9px] text-gray-500">{m.sub}</p>
                        </div>
                      </div>
                      <button className="w-full text-[9px] font-black uppercase tracking-widest py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">
                        Select
                      </button>
                    </Card>
                  ))}
                </div>
              </div>

              <Card className="p-4">
                <SectionHead label="Recent transactions" />
                <div className="space-y-3">
                  {[
                    { name: "Tesla — Data Analyst", amt: 850, type: "in", time: "2h ago" },
                    { name: "Top up · M-Pesa", amt: -10, type: "out", time: "1d ago" },
                    { name: "Stripe — UI design", amt: 320, type: "in", time: "3d ago" },
                  ].map((tx, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px]">
                      <div>
                        <p className="font-bold text-gray-900">{tx.name}</p>
                        <p className="text-[10px] text-gray-400">{tx.time}</p>
                      </div>
                      <p className={`font-black ${tx.amt > 0 ? "text-emerald-600" : "text-red-500"}`}>
                        {tx.amt > 0 ? "+" : ""}{fmt(Math.abs(tx.amt))}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* ════════════════════════════════ MESSAGES ════════════════════════════════ */}
          {activeTab === "messages" && (
            <motion.div key="messages" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <h2 className="text-xl font-black text-gray-900">Messages</h2>
              {[
                { sender: "Nexus HQ", body: "Welcome! Top up HU to start applying for jobs.", time: "Just now", unread: true, avatar: "🏢" },
                { sender: "Security Bot", body: "You have 5 HU left. Need 10+ to apply.", time: "14m", unread: true, avatar: "🤖" },
                { sender: "Exchange Relay", body: "Rate updated: $1 = KES 130.", time: "1h", unread: false, avatar: "📡" },
              ].map((m, i) => (
                <Card key={i} className="p-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg">{m.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-[12px] font-black text-gray-900">{m.sender}</p>
                      <p className="text-[9px] text-gray-400">{m.time}</p>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-1 line-clamp-2">{m.body}</p>
                  </div>
                  {m.unread && <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5"/>}
                </Card>
              ))}
            </motion.div>
          )}

          {/* ════════════════════════════════ ME ════════════════════════════════ */}
          {activeTab === "me" && (
            <motion.div key="me" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              {/* Hero profile card */}
              <div className="rounded-3xl p-5 text-white relative overflow-hidden"
                   style={{ background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4C1D95 100%)" }}>
                <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-purple-500/20 blur-3xl"/>
                <div className="relative flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/10 border-2 border-white/30">
                      <img src={user?.imageUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.id || "me"}`}
                           alt="me" className="w-full h-full object-cover"/>
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white text-purple-700 flex items-center justify-center shadow-md">
                      <Camera size={12}/>
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-black truncate">{user?.firstName || "Operator"} {user?.lastName || ""}</h2>
                    <p className="text-[10px] text-white/70 truncate">{profile.headline}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge color="#10B981" className="bg-emerald-500/20! text-emerald-200!">
                        <BadgeCheck size={10}/> Verified
                      </Badge>
                      <Badge color="#F59E0B" className="bg-amber-400/20! text-amber-200!">
                        <Crown size={10}/> Elite
                      </Badge>
                    </div>
                  </div>
                </div>
                {/* XP Bar */}
                <div className="relative mt-5">
                  <div className="flex items-center justify-between text-[10px] text-white/70 font-bold mb-1">
                    <span>Level 7 · Pro</span>
                    <span>2,480 / 3,000 XP</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-linear-to-r from-amber-400 to-pink-500 rounded-full" style={{ width: "82%" }}/>
                  </div>
                </div>
              </div>

              {/* Section tabs */}
              <div className="bg-white border border-gray-100 rounded-2xl p-1 flex">
                {(["profile", "achievements", "settings", "referrals"] as const).map(s => (
                  <button key={s} onClick={() => setMeSection(s)}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition ${
                      meSection === s ? "bg-gray-900 text-white" : "text-gray-500"
                    }`}>{s}</button>
                ))}
              </div>

              {/* PROFILE */}
              {meSection === "profile" && (
                <Card className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <SectionHead label="About" />
                    <button onClick={() => setEditingProfile(e => !e)} className="text-[10px] font-bold text-blue-600 flex items-center gap-1">
                      <Edit3 size={11}/> {editingProfile ? "Save" : "Edit"}
                    </button>
                  </div>
                  {editingProfile ? (
                    <textarea
                      value={profile.bio}
                      onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                      className="w-full text-[11px] border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-400"
                      rows={4}
                    />
                  ) : (
                    <p className="text-[12px] text-gray-700 leading-relaxed">{profile.bio}</p>
                  )}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-gray-400"/>
                      <span className="text-[11px] text-gray-700">{profile.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe size={14} className="text-gray-400"/>
                      <span className="text-[11px] text-gray-700">{profile.languages.join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-gray-400"/>
                      <span className="text-[11px] text-gray-700 truncate">{user?.primaryEmailAddress?.emailAddress || "—"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400"/>
                      <span className="text-[11px] text-gray-700">Joined Jan 2024</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.skills.map(s => (
                        <span key={s} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-bold">
                          {s}
                          {editingProfile && (
                            <button onClick={() => setProfile(p => ({ ...p, skills: p.skills.filter(x => x !== s) }))}>
                              <X size={10}/>
                            </button>
                          )}
                        </span>
                      ))}
                      {editingProfile && (
                        <div className="flex gap-1">
                          <input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="+ Add skill"
                            className="text-[10px] border border-gray-200 rounded-lg px-2 py-1 outline-none w-24"/>
                          <button onClick={() => { if (newSkill) { setProfile(p => ({ ...p, skills: [...p.skills, newSkill] })); setNewSkill(""); } }}
                            className="bg-blue-600 text-white rounded-lg px-2 text-[10px] font-bold">Add</button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
                    <div className="text-center">
                      <p className="text-base font-black text-gray-900">27</p>
                      <p className="text-[9px] text-gray-500 uppercase font-bold">Gigs done</p>
                    </div>
                    <div className="text-center">
                      <p className="text-base font-black text-gray-900">98%</p>
                      <p className="text-[9px] text-gray-500 uppercase font-bold">On time</p>
                    </div>
                    <div className="text-center">
                      <p className="text-base font-black text-gray-900">4.9★</p>
                      <p className="text-[9px] text-gray-500 uppercase font-bold">Rating</p>
                    </div>
                  </div>
                </Card>
              )}

              {/* ACHIEVEMENTS */}
              {meSection === "achievements" && (
                <div className="space-y-4">
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <SectionHead label="Achievements" sub={`${achievements.filter(a => a.earned).length} of ${achievements.length} unlocked`}/>
                      <Trophy size={20} className="text-amber-500"/>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {achievements.map((a, i) => (
                        <div key={i} className={`p-3 rounded-2xl border ${a.earned ? "border-gray-100 bg-white" : "border-dashed border-gray-200 bg-gray-50 opacity-60"}`}>
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                               style={{ backgroundColor: `${a.color}15`, color: a.color }}>
                            {a.icon}
                          </div>
                          <p className="text-[11px] font-black text-gray-900">{a.title}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{a.desc}</p>
                          {a.earned && <Badge color={a.color} className="mt-2"><CheckCircle2 size={9}/> Earned</Badge>}
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card className="p-4">
                    <SectionHead label="Streaks" />
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3 bg-orange-50 rounded-xl">
                        <Flame size={20} className="mx-auto text-orange-500"/>
                        <p className="text-lg font-black text-gray-900 mt-1">12</p>
                        <p className="text-[9px] text-gray-500 uppercase font-bold">Day streak</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-xl">
                        <Target size={20} className="mx-auto text-blue-500"/>
                        <p className="text-lg font-black text-gray-900 mt-1">8/10</p>
                        <p className="text-[9px] text-gray-500 uppercase font-bold">Weekly goal</p>
                      </div>
                      <div className="text-center p-3 bg-emerald-50 rounded-xl">
                        <Award size={20} className="mx-auto text-emerald-500"/>
                        <p className="text-lg font-black text-gray-900 mt-1">Top 5%</p>
                        <p className="text-[9px] text-gray-500 uppercase font-bold">Earners</p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* SETTINGS */}
              {meSection === "settings" && (
                <div className="space-y-4">
                  <Card className="p-4">
                    <SectionHead label="Notifications"/>
                    {Object.entries(notifications).map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-3">
                          <Bell size={14} className="text-gray-400"/>
                          <span className="text-[11px] font-semibold text-gray-700 capitalize">{k}</span>
                        </div>
                        <button onClick={() => setNotifications(n => ({ ...n, [k]: !v }))}
                          className={`relative w-10 h-6 rounded-full transition ${v ? "bg-blue-600" : "bg-gray-200"}`}>
                          <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition ${v ? "left-4.5" : "left-0.5"}`}/>
                        </button>
                      </div>
                    ))}
                  </Card>

                  <Card className="p-4">
                    <SectionHead label="Security"/>
                    <div className="flex items-center justify-between py-2.5">
                      <div className="flex items-center gap-3">
                        <Shield size={14} className="text-gray-400"/>
                        <div>
                          <p className="text-[11px] font-semibold text-gray-700">Two-Factor Auth</p>
                          <p className="text-[9px] text-gray-400">Extra protection on login</p>
                        </div>
                      </div>
                      <button onClick={() => { setTwoFAEnabled(t => !t); addToast(twoFAEnabled ? "2FA disabled" : "2FA enabled", "success"); }}
                        className={`relative w-10 h-6 rounded-full transition ${twoFAEnabled ? "bg-emerald-500" : "bg-gray-200"}`}>
                        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition ${twoFAEnabled ? "left-4.5" : "left-0.5"}`}/>
                      </button>
                    </div>
                    <button className="w-full mt-2 text-left flex items-center justify-between py-2.5 border-t border-gray-50">
                      <div className="flex items-center gap-3">
                        <Key size={14} className="text-gray-400"/>
                        <span className="text-[11px] font-semibold text-gray-700">Change password</span>
                      </div>
                      <ChevronRight size={14} className="text-gray-400"/>
                    </button>
                    <button className="w-full text-left flex items-center justify-between py-2.5 border-t border-gray-50">
                      <div className="flex items-center gap-3">
                        <Smartphone size={14} className="text-gray-400"/>
                        <span className="text-[11px] font-semibold text-gray-700">Active sessions (2)</span>
                      </div>
                      <ChevronRight size={14} className="text-gray-400"/>
                    </button>
                  </Card>

                  <Card className="p-4">
                    <SectionHead label="Preferences"/>
                    <div className="flex items-center justify-between py-2.5">
                      <div className="flex items-center gap-3">
                        <Globe size={14} className="text-gray-400"/>
                        <span className="text-[11px] font-semibold text-gray-700">Language</span>
                      </div>
                      <span className="text-[10px] text-gray-500">English (EAT)</span>
                    </div>
                    <div className="flex items-center justify-between py-2.5 border-t border-gray-50">
                      <div className="flex items-center gap-3">
                        <DollarSign size={14} className="text-gray-400"/>
                        <span className="text-[11px] font-semibold text-gray-700">Currency</span>
                      </div>
                      <button onClick={() => setCurrency(c => c === "USD" ? "KES" : "USD")}
                        className="text-[10px] font-bold text-blue-600">{currency}</button>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <SectionHead label="Account"/>
                    <button className="w-full text-left flex items-center justify-between py-2.5">
                      <div className="flex items-center gap-3">
                        <Download size={14} className="text-gray-400"/>
                        <span className="text-[11px] font-semibold text-gray-700">Export my data</span>
                      </div>
                      <ChevronRight size={14} className="text-gray-400"/>
                    </button>
                    <SignOutButton>
                      <button className="w-full text-left flex items-center justify-between py-2.5 border-t border-gray-50 text-red-600">
                        <div className="flex items-center gap-3">
                          <LogOut size={14}/>
                          <span className="text-[11px] font-semibold">Sign out</span>
                        </div>
                        <ChevronRight size={14}/>
                      </button>
                    </SignOutButton>
                  </Card>
                </div>
              )}

              {/* REFERRALS */}
              {meSection === "referrals" && (
                <div className="space-y-4">
                  <div className="rounded-3xl p-5 text-white relative overflow-hidden"
                       style={{ background: "linear-gradient(135deg, #BE185D 0%, #BE123C 50%, #9F1239 100%)" }}>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-pink-500/30 blur-3xl"/>
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-3">
                        <Gift size={18}/>
                        <p className="text-[12px] font-black uppercase tracking-widest">Refer & Earn</p>
                      </div>
                      <p className="text-2xl font-black">Earn 50 HU + $5</p>
                      <p className="text-[11px] text-white/70 mt-1">For every friend who joins & tops up</p>
                      <div className="bg-white/10 backdrop-blur rounded-xl p-3 mt-4 flex items-center justify-between">
                        <div>
                          <p className="text-[9px] uppercase tracking-widest text-white/60 font-bold">Your code</p>
                          <p className="text-base font-black tracking-wider">{referralCode}</p>
                        </div>
                        <button onClick={() => { navigator.clipboard.writeText(referralCode); addToast("Code copied!", "success"); }}
                          className="bg-white text-pink-700 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest">
                          Copy
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        <div><p className="text-lg font-black">3</p><p className="text-[9px] text-white/60 uppercase font-bold">Invited</p></div>
                        <div><p className="text-lg font-black">2</p><p className="text-[9px] text-white/60 uppercase font-bold">Joined</p></div>
                        <div><p className="text-lg font-black">$10</p><p className="text-[9px] text-white/60 uppercase font-bold">Earned</p></div>
                      </div>
                    </div>
                  </div>

                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <SectionHead label="Payout methods" sub="Where withdrawals are sent"/>
                      <button className="text-[10px] font-black text-blue-600 flex items-center gap-1">
                        <Plus size={12}/> Add
                      </button>
                    </div>
                    {payoutMethods.map(p => (
                      <div key={p.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                        {p.type === "M-Pesa" ? <MpesaLogo size={36}/> : p.type === "Bank" ? <BankLogo size={36}/> : <PaypalLogo size={36}/>}
                        <div className="flex-1">
                          <p className="text-[11px] font-black text-gray-900">{p.type}</p>
                          <p className="text-[10px] text-gray-500">{p.details}</p>
                        </div>
                        {p.primary && <Badge color="#10B981">Primary</Badge>}
                        <button onClick={() => setPayoutMethods(pm => pm.filter(x => x.id !== p.id))} className="text-gray-400 hover:text-red-500">
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    ))}
                  </Card>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* ════════════════════ TOP-UP MODAL ════════════════════ */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-end md:items-center justify-center p-0 md:p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ y: 50 }} animate={{ y: 0 }} exit={{ y: 50 }}
              onClick={e => e.stopPropagation()}
              className="bg-white w-full max-w-md rounded-t-3xl md:rounded-3xl p-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-gray-900">
                  {modalStep === "packages" && "Top up HU"}
                  {modalStep === "choice" && "Choose payment"}
                  {modalStep === "mpesa" && "Pay with M-Pesa"}
                  {modalStep === "binance" && "Pay with Binance"}
                  {modalStep === "bank" && "Bank Transfer"}
                  {modalStep === "paypal" && "Pay with PayPal"}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400"><X size={18}/></button>
              </div>

              {modalStep === "packages" && (
                <div className="space-y-2">
                  {uplinkPackages.map(p => (
                    <button key={p.id} onClick={() => { setSelectedPack(p); setModalStep("choice"); }}
                      className="w-full flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-blue-300 hover:bg-blue-50/30 transition text-left">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-[13px] font-black text-gray-900">{p.name}</p>
                          {p.hot && <Badge color="#EF4444"><Flame size={9}/> HOT</Badge>}
                        </div>
                        <p className="text-[10px] text-gray-500 mt-0.5">{p.desc}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-black text-blue-600">${p.price}</p>
                        <p className="text-[10px] text-gray-500">{p.hu} HU</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {modalStep === "choice" && selectedPack && (
                <div>
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 mb-4">
                    <p className="text-[10px] text-blue-600 uppercase font-bold tracking-widest">Selected</p>
                    <p className="text-[13px] font-black text-blue-900">{selectedPack.name} · {selectedPack.hu} HU · ${selectedPack.price}</p>
                  </div>
                  <p className="text-[11px] font-black text-gray-700 mb-3 uppercase tracking-widest">Choose method</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { logo: <MpesaLogo size={44}/>, name: "M-Pesa", sub: "Instant", step: "mpesa" as const },
                      { logo: <BinanceLogo size={44}/>, name: "Binance", sub: "USDT", step: "binance" as const },
                      { logo: <BankLogo size={44}/>, name: "Bank", sub: "1–2 days", step: "bank" as const },
                      { logo: <PaypalLogo size={44}/>, name: "PayPal", sub: "Global", step: "paypal" as const },
                    ].map((m, i) => (
                      <button key={i} onClick={() => setModalStep(m.step)}
                        className="p-4 rounded-2xl border border-gray-100 hover:border-blue-300 hover:shadow-md transition flex flex-col items-center gap-2">
                        {m.logo}
                        <p className="text-[12px] font-black text-gray-900">{m.name}</p>
                        <p className="text-[9px] text-gray-500">{m.sub}</p>
                      </button>
                    ))}
                  </div>
                  <label className="flex items-start gap-2 mt-4 cursor-pointer">
                    <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5"/>
                    <span className="text-[10px] text-gray-600">I agree to the Terms and HU non-refund policy.</span>
                  </label>
                </div>
              )}

              {modalStep === "mpesa" && selectedPack && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <MpesaLogo size={40}/>
                    <div>
                      <p className="text-[12px] font-black text-emerald-900">Total: KES {(selectedPack.price * RATE).toLocaleString()}</p>
                      <p className="text-[10px] text-emerald-700">{selectedPack.hu} HU</p>
                    </div>
                  </div>
                  <input
                    value={mpesaNum} onChange={e => setMpesaNum(e.target.value)}
                    placeholder="254712345678"
                    className="w-full border border-gray-200 rounded-xl p-3 text-[12px] outline-none focus:border-emerald-400"
                  />
                  <RippleButton onClick={() => handlePay("MPESA")} disabled={isPaying}
                    className="w-full bg-emerald-600 text-white py-3 rounded-xl text-[11px] font-black uppercase tracking-widest">
                    {isPaying ? "Sending..." : "Send M-Pesa Prompt"}
                  </RippleButton>
                </div>
              )}

              {modalStep === "binance" && selectedPack && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                    <BinanceLogo size={40}/>
                    <div>
                      <p className="text-[12px] font-black text-amber-900">Send {selectedPack.price} USDT (TRC-20)</p>
                      <p className="text-[10px] text-amber-700">{selectedPack.hu} HU credited after 1 confirmation</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                    <p className="text-[9px] uppercase font-bold text-gray-500 tracking-widest">USDT TRC-20 address</p>
                    <p className="text-[10px] font-mono break-all mt-1">TFWxe4TFcjUNgPJVgf5iXrMsw1oe4gDv9X</p>
                    <button onClick={copyAddress}
                      className="mt-2 w-full bg-amber-500 text-white py-2 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1">
                      {copied ? <><Check size={12}/> Copied</> : <><Copy size={12}/> Copy address</>}
                    </button>
                  </div>
                </div>
              )}

              {modalStep === "bank" && selectedPack && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                    <BankLogo size={40}/>
                    <div>
                      <p className="text-[12px] font-black text-blue-900">Wire ${selectedPack.price} via SWIFT/Local</p>
                      <p className="text-[10px] text-blue-700">Settles in 1–2 business days</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-2 text-[11px]">
                    <div className="flex justify-between"><span className="text-gray-500">Bank</span><span className="font-bold">KCB Bank Kenya</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Account</span><span className="font-bold font-mono">1107845321</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">SWIFT</span><span className="font-bold font-mono">KCBLKENX</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Reference</span><span className="font-bold">{user?.id?.slice(-8) || "NEXUS"}</span></div>
                  </div>
                </div>
              )}

              {modalStep === "paypal" && selectedPack && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                    <PaypalLogo size={40}/>
                    <div>
                      <p className="text-[12px] font-black text-blue-900">Pay ${selectedPack.price} via PayPal</p>
                      <p className="text-[10px] text-blue-700">Instant credit · 3.4% fee applies</p>
                    </div>
                  </div>
                  <RippleButton onClick={() => addToast("Redirecting to PayPal...", "info")}
                    className="w-full bg-[#003087] text-white py-3 rounded-xl text-[11px] font-black uppercase tracking-widest">
                    Continue to PayPal
                  </RippleButton>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════ BOTTOM NAV ════════════════════ */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-100 z-30">
        <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2">
          {navItems.map(item => {
            const active = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className="flex-1 flex flex-col items-center gap-0.5 py-2 relative">
                {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-full"/>}
                <span className={active ? "text-blue-600" : "text-gray-400"}>{item.icon}</span>
                <span className={`text-[9px] font-bold ${active ? "text-blue-600" : "text-gray-400"}`}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default FreelancerView;
