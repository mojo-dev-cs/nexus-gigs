"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import {
  Home, Briefcase, FileText, MessageSquare,
  Wallet, BarChart3, User, ShieldCheck, Zap, Globe, Lock, Rocket,
  Smartphone, CreditCard, ChevronRight, AlertTriangle,
  Star, Clock, Bell, Info, ShieldAlert, CheckCircle2,
  Cpu, Moon, Palette, Fingerprint, ChevronDown, MousePointer2,
  Activity, Landmark, Bitcoin, HelpCircle, LifeBuoy, X, CheckCircle, Box,
  ShieldQuestion, UserCircle, DollarSign, ArrowUpRight, History,
  Shield, QrCode, ScanFace, Award, Target, TrendingUp, Layers,
  Send, MessageCircle, Share2, ThumbsUp, Copy, Check, Sparkles, GraduationCap, Building2, UserCheck,
  ArrowRight, Plus, Minus, RefreshCw, Eye, EyeOff, Search, Filter, 
  BellRing, ChevronUp, Flame, Crown, BadgeCheck, Wifi, WifiOff
} from "lucide-react";

// --- ANIMATED COUNTER HOOK ---
const useAnimatedCounter = (target: number, duration = 1200) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return count;
};

// --- RIPPLE BUTTON ---
const RippleButton = ({ children, onClick, className, disabled }: any) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples(r => [...r, { x: e.clientX - rect.left, y: e.clientY - rect.top, id }]);
    setTimeout(() => setRipples(r => r.filter(rip => rip.id !== id)), 600);
    onClick?.(e);
  };
  return (
    <button onClick={handleClick} disabled={disabled} className={`relative overflow-hidden ${className}`} style={{ WebkitTapHighlightColor: "transparent" }}>
      {children}
      {ripples.map(r => (
        <span key={r.id} className="absolute rounded-full bg-white/30 animate-ping pointer-events-none"
          style={{ left: r.x - 10, top: r.y - 10, width: 20, height: 20, animationDuration: "0.6s" }} />
      ))}
    </button>
  );
};

// --- GLASSMORPHISM CARD ---
const GlassCard = ({ children, className = "", accent = false, glow = false }: any) => (
  <div className={`
    relative bg-white/4 backdrop-blur-xl border border-white/8 rounded-[22px] 
    transition-all duration-300 hover:border-white/[0.14] hover:bg-white/6
    ${accent ? "border-l-2 border-l-[#00f2ff]" : ""}
    ${glow ? "shadow-[0_0_30px_rgba(0,242,255,0.08)]" : ""}
    ${className}
  `}>
    {children}
  </div>
);

// --- PULSE DOT ---
const PulseDot = ({ color = "#00f2ff", size = 8 }: { color?: string; size?: number }) => (
  <span className="relative inline-flex" style={{ width: size, height: size }}>
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50" style={{ backgroundColor: color }} />
    <span className="relative inline-flex rounded-full" style={{ width: size, height: size, backgroundColor: color }} />
  </span>
);

// --- LOGO COMPONENT ---
const CompanyLogo = ({ name, domain, size = 40 }: { name: string; domain: string; size?: number }) => {
  const [src, setSrc] = useState<string | null>(`https://logo.clearbit.com/${domain}`);
  const [failed, setFailed] = useState(false);
  const initials = name.replace(/[^a-zA-Z\s]/g, "").split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
  const colors = [
    { bg: "#0d1b2e", accent: "#00f2ff" }, { bg: "#0f2027", accent: "#43e97b" },
    { bg: "#1c0533", accent: "#f093fb" }, { bg: "#0d1b2a", accent: "#f9c74f" },
    { bg: "#1a0a00", accent: "#ff6b35" }, { bg: "#001233", accent: "#4cc9f0" },
    { bg: "#10002b", accent: "#e040fb" }, { bg: "#012a4a", accent: "#48cae4" },
  ];
  const { bg, accent } = colors[name.charCodeAt(0) % colors.length];
  if (failed || !src) return (
    <div style={{ width: size, height: size, borderRadius: 12, background: bg, border: `1px solid ${accent}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontSize: size * 0.3, fontWeight: 800, color: accent, letterSpacing: "-0.03em", fontFamily: "monospace" }}>{initials}</span>
    </div>
  );
  return (
    <img src={src} alt={name} width={size} height={size}
      style={{ width: size, height: size, borderRadius: 12, objectFit: "contain", background: "#fff", padding: 5, flexShrink: 0 }}
      onError={() => { if (!src.includes("google.com")) setSrc(`https://www.google.com/s2/favicons?domain=${domain}&sz=64`); else setFailed(true); }} />
  );
};

// --- SKELETON LOADER ---
const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />
);

// --- TOAST SYSTEM ---
type Toast = { id: number; msg: string; type: "success" | "error" | "info" };
const ToastContainer = ({ toasts, remove }: { toasts: Toast[]; remove: (id: number) => void }) => (
  <div className="fixed top-4 right-4 z-500 flex flex-col gap-2 pointer-events-none">
    <AnimatePresence>
      {toasts.map(t => (
        <motion.div key={t.id} initial={{ opacity: 0, x: 80, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 80, scale: 0.9 }} transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest shadow-2xl border backdrop-blur-xl
            ${t.type === "success" ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
              : t.type === "error" ? "bg-red-500/20 border-red-500/30 text-red-400"
              : "bg-[#00f2ff]/10 border-[#00f2ff]/20 text-[#00f2ff]"}`}>
          {t.type === "success" ? <CheckCircle size={13} /> : t.type === "error" ? <AlertTriangle size={13} /> : <Info size={13} />}
          <span>{t.msg}</span>
          <button onClick={() => remove(t.id)} className="ml-1 opacity-50 hover:opacity-100 pointer-events-auto"><X size={11} /></button>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

// --- STAT CARD WITH TREND ---
const StatCard = ({ label, value, icon, trend, color = "#00f2ff" }: any) => (
  <GlassCard className="p-4 text-center group cursor-default">
    <div className="flex justify-center mb-2" style={{ color }}>{icon}</div>
    <p className="text-[11px] font-black tracking-tighter">{value}</p>
    <p className="text-[8px] font-bold text-gray-600 uppercase leading-none mt-0.5">{label}</p>
    {trend && <div className="mt-1.5 text-[7px] font-black text-emerald-500 flex items-center justify-center gap-0.5"><TrendingUp size={8} />{trend}</div>}
  </GlassCard>
);

// --- BALANCE VISIBILITY ---
const BalanceDisplay = ({ amount, currency }: { amount: number; currency: string }) => {
  const [visible, setVisible] = useState(true);
  return (
    <div className="flex items-center gap-3">
      <h4 className="text-5xl font-black italic tracking-tighter text-white leading-none">
        {visible ? `$${amount.toFixed(2)}` : "••••••"}
      </h4>
      <button onClick={() => setVisible(v => !v)} className="text-gray-600 hover:text-white transition-colors mt-1">
        {visible ? <Eye size={16} /> : <EyeOff size={16} />}
      </button>
    </div>
  );
};

// --- ACTIVITY FEED ITEM ---
const ActivityItem = ({ icon, title, time, color = "#00f2ff" }: any) => (
  <div className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}15`, color }}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-black uppercase text-white truncate">{title}</p>
    </div>
    <span className="text-[8px] text-gray-600 font-bold uppercase shrink-0">{time}</span>
  </div>
);

// --- SEARCH BAR COMPONENT ---
const SearchBar = ({ placeholder, value, onChange }: any) => (
  <div className="relative">
    <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-[11px] font-bold text-white placeholder:text-gray-700 outline-none focus:border-[#00f2ff]/50 transition-colors" />
  </div>
);

// --- TYPE FILTER CHIPS ---
const FilterChips = ({ filters, active, onSelect }: any) => (
  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
    {filters.map((f: string) => (
      <button key={f} onClick={() => onSelect(f)}
        className={`shrink-0 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all border
          ${active === f ? "bg-[#00f2ff] text-black border-[#00f2ff]" : "bg-white/5 text-gray-500 border-white/10 hover:border-white/20"}`}>
        {f}
      </button>
    ))}
  </div>
);

// === MAIN COMPONENT ===
export const FreelancerView = ({ jobs, userMetadata }: { jobs: any[]; userMetadata: any }) => {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("home");
  const [gigSlide, setGigSlide] = useState<"internal" | "corporate">("internal");
  const [isVerified, setIsVerified] = useState(userMetadata?.status === "Verified");
  const [isUnderReview, setIsUnderReview] = useState(userMetadata?.status === "Pending");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showGigsRestriction, setShowGigsRestriction] = useState(false);
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [supportMsg, setSupportMsg] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [expandedMsg, setExpandedMsg] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [gigSearch, setGigSearch] = useState("");
  const [gigFilter, setGigFilter] = useState("All");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [notifBadge, setNotifBadge] = useState(3);
  const [isOnline, setIsOnline] = useState(true);
  const [paymentStep, setPaymentStep] = useState<"terms" | "choice" | "card" | "mpesa" | "binance">("terms");

  // Legacy modal
  const [customAlert, setCustomAlert] = useState<{ show: boolean; title: string; msg: string; type: "info" | "error" | "success" }>({ show: false, title: "", msg: "", type: "info" });

  const toastIdRef = useRef(0);
  const addToast = (msg: string, type: Toast["type"] = "info") => {
    const id = ++toastIdRef.current;
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };

  const showAlert = (title: string, msg: string, type: "info" | "error" | "success" = "info") => {
    setCustomAlert({ show: true, title, msg, type });
  };

  const copyAddress = () => {
    navigator.clipboard.writeText("TFWxe4TFcjUNgPJVgf5iXrMsw1oe4gDv9X");
    setCopied(true);
    addToast("Address copied!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const handleOnline = () => { setIsOnline(true); addToast("Connected", "success"); };
    const handleOffline = () => { setIsOnline(false); addToast("Connection lost", "error"); };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => { window.removeEventListener("online", handleOnline); window.removeEventListener("offline", handleOffline); };
  }, []);

  useEffect(() => {
    const finalizeHandshake = async () => {
      if (searchParams.get("payment") === "success" && isLoaded && user && !isVerified) {
        try {
          const response = await fetch("/api/verify-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id, email: user.primaryEmailAddress?.emailAddress, amount: 10, status: "Pending", method: "Nexus Global Relay" }),
          });
          if (response.ok) {
            addToast("Payment received — review started", "success");
            setIsUnderReview(true);
          }
        } catch (e) { console.error(e); }
      }
    };
    finalizeHandshake();
  }, [searchParams, isLoaded, user, isVerified]);

  const handleVerifyClick = () => {
    if (isVerified) return addToast("Already verified", "success");
    if (isUnderReview) return addToast("Review in progress — check your email", "info");
    setPaymentStep("terms");
    setShowVerifyModal(true);
  };

  const handleApplyAction = () => {
    if (isVerified) { addToast("Connecting to client terminal…", "info"); }
    else { setShowGigsRestriction(true); }
  };

  const handleSecurePayment = async (method: "M-PESA" | "CARD") => {
    if (!agreedToTerms) return addToast("Agree to terms first", "info");
    setIsPaying(true);
    if (method === "M-PESA") {
      const cleanPhone = mpesaNumber.replace(/\D/g, "");
      if (!cleanPhone.startsWith("254") || cleanPhone.length !== 12) {
        setIsPaying(false);
        return addToast("Use format: 254XXXXXXXXX", "error");
      }
      try {
        const response = await fetch("/api/intasend", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: 1300, phone: cleanPhone, email: user?.primaryEmailAddress?.emailAddress, firstName: user?.firstName, lastName: user?.lastName, method: "M-PESA" }),
        });
        if (response.ok) { addToast("Check phone for PIN prompt", "success"); setShowVerifyModal(false); }
      } catch { addToast("Connection failed", "error"); } finally { setIsPaying(false); }
    } else {
      try {
        const response = await fetch("/api/paystack", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: 1300, currency: "USD", email: user?.primaryEmailAddress?.emailAddress, firstName: user?.firstName, lastName: user?.lastName }),
        });
        const data = await response.json();
        if (data.status && data.data.authorization_url) window.location.href = data.data.authorization_url;
      } catch { addToast("Payment relay down", "error"); } finally { setIsPaying(false); }
    }
  };

  const handleSupportEmail = () => {
    if (!supportMsg) return addToast("Type your message first", "info");
    window.location.href = `mailto:support@nexusgigs.me?subject=Help&body=Msg: ${supportMsg}%0D%0AID: ${user?.id}`;
  };

  const allGigTypes = ["All", "Security", "Academic", "Web3", "Startup", "Fintech", "Agency", "Enterprise", "Research", "School Work"];

const marketplaceGigs = useMemo(() => [
    { id: "1", title: "Cyber: Bank API Penetration Test", budget: 2100, client: "SafeVault", rating: 5.0, dur: "7 Days", img: "https://i.pravatar.cc/150?u=safe", type: "Security", status: "Active", hot: true },
    { id: "2", title: "Academic: Python Scripts for Lab Research", budget: 110, client: "BioTech Lab", rating: 5.0, dur: "5 Days", img: "https://i.pravatar.cc/150?u=lab", type: "School Work", status: "Active", hot: false },
    { id: "3", title: "Web3: Smart Contract Vulnerability Scan (Solidity)", budget: 2200, client: "Nexus Protocol", rating: 4.9, dur: "5 Days", img: "https://i.pravatar.cc/150?u=crypto", type: "Web3", status: "Active", hot: true },
    { id: "4", title: "School Work: Advanced Calculus Problem Set", budget: 45, client: "Academic Hub", rating: 4.8, dur: "Expired", img: "https://i.pravatar.cc/150?u=school", type: "Academic", status: "Expired", hot: false },
    { id: "5", title: "Next.js: Speed & SEO Optimization", budget: 800, client: "E-Com Solutions", rating: 4.9, dur: "4 Days", img: "https://i.pravatar.cc/150?u=ecom", type: "Dev", status: "Active", hot: true },
    { id: "6", title: "Fintech: Mobile App UI/UX Design System", budget: 1500, client: "Vertex Pay", rating: 4.8, dur: "14 Days", img: "https://i.pravatar.cc/150?u=pay", type: "Design", status: "Active", hot: false },
    { id: "7", title: "DevOps: AWS Kubernetes Cluster Setup", budget: 1200, client: "CloudScale", rating: 5.0, dur: "Expired", img: "https://i.pravatar.cc/150?u=devops", type: "Agency", status: "Expired", hot: false },
    { id: "8", title: "Database: SQL Query Performance Tuning", budget: 450, client: "DataLake Inc", rating: 4.7, dur: "48 Hours", img: "https://i.pravatar.cc/150?u=db", type: "Enterprise", status: "Active", hot: false },
    { id: "9", title: "University Thesis: Data Science Analysis", budget: 130, client: "Dr. Aris", rating: 4.9, dur: "3 Days", img: "https://i.pravatar.cc/150?u=thesis", type: "Academic", status: "Active", hot: true },
    { id: "10", title: "AI: Custom Chatbot for SaaS (OpenAI)", budget: 1800, client: "MindGraph AI", rating: 5.0, dur: "7 Days", img: "https://i.pravatar.cc/150?u=ai", type: "Research", status: "Active", hot: true },
    { id: "11", title: "Academic: Legal Case Study Analysis", budget: 70, client: "Legal Hub", rating: 4.6, dur: "Expired", img: "https://i.pravatar.cc/150?u=law", type: "School Work", status: "Expired", hot: false },
    { id: "12", title: "Shopify: Liquid Theme Customization", budget: 550, client: "Luxe Label", rating: 4.9, dur: "3 Days", img: "https://i.pravatar.cc/150?u=luxe", type: "Dev", status: "Active", hot: false },
    { id: "13", title: "Cyber: Malware Reverse Engineering", budget: 3000, client: "DefendX", rating: 5.0, dur: "10 Days", img: "https://i.pravatar.cc/150?u=def", type: "Security", status: "Active", hot: true },
    { id: "14", title: "School Work: Organic Chemistry Lab Report", budget: 40, client: "Science Pro", rating: 4.5, dur: "12 Hours", img: "https://i.pravatar.cc/150?u=chem", type: "Academic", status: "Active", hot: false },
    { id: "15", title: "Backend: Node.js Memory Leak Debugging", budget: 350, client: "SyncStream", rating: 4.9, dur: "24 Hours", img: "https://i.pravatar.cc/150?u=node", type: "Startup", status: "Active", hot: false },
  ], []);
  const filteredGigs = useMemo(() => {
    return marketplaceGigs.filter(g => {
      const matchSearch = g.title.toLowerCase().includes(gigSearch.toLowerCase()) || g.client.toLowerCase().includes(gigSearch.toLowerCase());
      const matchFilter = gigFilter === "All" || g.type === gigFilter;
      return matchSearch && matchFilter;
    });
  }, [marketplaceGigs, gigSearch, gigFilter]);

  const corporateGigs = useMemo(() => [
    { id: "c1", title: "Tesla: Remote Fleet Data Analyst", salary: "$85k – $120k", location: "Global / Remote", headcount: 5, domain: "tesla.com", company: "Tesla", status: "Open" },
    { id: "c2", title: "AWS: Cloud Infrastructure Support Engineer", salary: "$95k – $140k", location: "EMEA Remote", headcount: 12, domain: "amazon.com", company: "Amazon", status: "Open" },
    { id: "c3", title: "Kraken: Cryptographic Security Specialist", salary: "$110k – $160k", location: "Remote", headcount: 3, domain: "kraken.com", company: "Kraken", status: "Open" },
    { id: "c4", title: "GitLab: DevOps Node Engineer", salary: "$130k+", location: "Remote First", headcount: 8, domain: "gitlab.com", company: "GitLab", status: "Open" },
    { id: "c5", title: "Automattic: WordPress Happiness Engineer", salary: "$65k – $90k", location: "Remote", headcount: 20, domain: "automattic.com", company: "Automattic", status: "Open" },
    { id: "c6", title: "Atlassian: Technical Product Manager", salary: "$140k – $190k", location: "Remote APAC/US", headcount: 4, domain: "atlassian.com", company: "Atlassian", status: "Open" },
    { id: "c7", title: "CrowdStrike: Remote Incident Responder", salary: "$115k+", location: "Remote", headcount: 6, domain: "crowdstrike.com", company: "CrowdStrike", status: "Open" },
    { id: "c8", title: "Coinbase: Smart Contract Auditor", salary: "$150k – $220k", location: "Remote", headcount: 2, domain: "coinbase.com", company: "Coinbase", status: "Open" },
    { id: "c9", title: "Veeva Systems: Life Sciences Data Specialist", salary: "$90k – $130k", location: "Remote", headcount: 10, domain: "veeva.com", company: "Veeva", status: "Open" },
    { id: "c10", title: "Toptal: Technical Interviewer (Freelance-Core)", salary: "$100k+", location: "Global Remote", headcount: 15, domain: "toptal.com", company: "Toptal", status: "Open" },
  ], []);

  const navItems = [
    { id: "home", icon: <Home size={15} />, label: "Home" },
    { id: "tasks", icon: <Briefcase size={15} />, label: "Gigs" },
    { id: "contracts", icon: <FileText size={15} />, label: "Work" },
    { id: "messages", icon: <MessageSquare size={15} />, label: "Chats", badge: notifBadge },
    { id: "earnings", icon: <Wallet size={15} />, label: "Vault" },
    { id: "analytics", icon: <BarChart3 size={15} />, label: "Stats" },
    { id: "support", icon: <LifeBuoy size={15} />, label: "Help" },
    { id: "account", icon: <User size={15} />, label: "Me" },
  ];

  // Recent activity data
  const activities = [
    { icon: <Eye size={11} />, title: "Profile viewed by Vertex Pay", time: "2m ago", color: "#a78bfa" },
    { icon: <Zap size={11} />, title: "New mission: AI Integration task", time: "1h ago", color: "#00f2ff" },
    { icon: <Shield size={11} />, title: "Security check passed", time: "3h ago", color: "#34d399" },
    { icon: <Star size={11} />, title: "Platform rating updated", time: "1d ago", color: "#fbbf24" },
  ];

  return (
    <div className="min-h-screen bg-[#010812] text-white font-sans selection:bg-[#00f2ff]/30 pb-28 overflow-x-hidden text-sm">
      
      {/* AMBIENT BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-125 h-125 rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, #00f2ff 0%, transparent 70%)" }} />
        <div className="absolute bottom-[-10%] left-[-15%] w-100 h-100 rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }} />
        <div className="absolute top-[40%] left-[30%] w-75 h-75 rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)" }} />
        {/* Grid lines */}
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      {/* TOAST SYSTEM */}
      <ToastContainer toasts={toasts} remove={id => setToasts(t => t.filter(x => x.id !== id))} />

      {/* CONNECTION STATUS BAR */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div initial={{ height: 0 }} animate={{ height: 28 }} exit={{ height: 0 }}
            className="fixed top-0 left-0 right-0 z-600 bg-red-500/90 flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-white overflow-hidden">
            <WifiOff size={11} /> No connection — retrying…
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto pt-4 px-4 relative z-10">
        <AnimatePresence mode="wait">

          {/* ═══════════════════════ HOME ═══════════════════════ */}
          {activeTab === "home" && (
            <motion.div key="home" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="space-y-4">
              
              {/* HEADER */}
              <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
                className="relative overflow-hidden flex justify-between items-center bg-white/4 backdrop-blur-2xl p-4 rounded-[20px] border border-white/8">
                <div className="absolute top-0 left-0 w-1 h-full rounded-l-[20px]" style={{ background: "linear-gradient(180deg, #00f2ff, #7c3aed)" }} />
                <div className="space-y-0.5 pl-2">
                  <p className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-600">Nexus Node</p>
                  <h2 className="text-xl font-black italic uppercase tracking-tighter">{user?.firstName || "User"}</h2>
                  <p className="text-[8px] text-gray-600 font-medium">GMT+3 · {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</p>
                </div>
                <div className="flex items-center gap-3">
                  {/* Notification bell */}
                  <button onClick={() => { setNotifBadge(0); setActiveTab("messages"); }} className="relative p-2 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all">
                    <Bell size={14} className="text-gray-400" />
                    {notifBadge > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#00f2ff] rounded-full text-[7px] font-black text-black flex items-center justify-center">{notifBadge}</span>}
                  </button>
                  <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-xl border border-white/6">
                    <PulseDot color={isVerified ? "#00f2ff" : isUnderReview ? "#f59e0b" : "#ef4444"} size={6} />
                    <span className="text-[7px] font-black uppercase tracking-widest text-gray-400">
                      {isVerified ? "Verified" : isUnderReview ? "Review" : "Unverified"}
                    </span>
                  </div>
                </div>
              </motion.header>

              {/* BALANCE + VERIFY ROW */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* BALANCE CARD */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="relative overflow-hidden p-5 rounded-[22px] border border-white/8 flex flex-col justify-between h-40"
                  style={{ background: "linear-gradient(135deg, rgba(0,242,255,0.08) 0%, rgba(0,242,255,0.02) 100%)" }}>
                  <div className="absolute top-2 right-2 text-[#00f2ff]/10"><Landmark size={60} /></div>
                  <div>
                    <p className="text-[7px] font-black uppercase tracking-[0.3em] text-[#00f2ff]/70 mb-1">Vault Balance</p>
                    <BalanceDisplay amount={0} currency="USD" />
                    <p className="text-[8px] font-bold text-gray-700 mt-0.5">≈ KES 0.00</p>
                  </div>
                  <RippleButton onClick={() => setActiveTab("earnings")}
                    className="w-full py-2 bg-white text-black font-black rounded-xl text-[9px] uppercase tracking-widest hover:bg-[#00f2ff] transition-colors">
                    Open Vault
                  </RippleButton>
                </motion.div>

                {/* VERIFY CARD */}
                {!isVerified && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="md:col-span-2 relative overflow-hidden p-5 rounded-[22px] border border-white/8 bg-white/3 backdrop-blur-xl">
                    <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, #00f2ff 0%, transparent 60%)" }} />
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative w-12 h-12 bg-[#00f2ff]/10 rounded-2xl flex items-center justify-center border border-[#00f2ff]/20 shrink-0">
                        <ShieldCheck size={22} className="text-[#00f2ff]" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                          <span className="text-[7px] font-black text-black">!</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-black uppercase italic tracking-tighter mb-0.5">Unlock Full Access</h4>
                        <p className="text-[9px] text-gray-500 leading-relaxed">One-time $10 vetting fee to join the elite network.</p>
                      </div>
                      <RippleButton onClick={handleVerifyClick}
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase italic tracking-widest transition-all ${isUnderReview ? "bg-amber-500 text-black animate-pulse" : "bg-[#00f2ff] text-black hover:scale-105"}`}>
                        {isUnderReview ? "Pending" : "Verify →"}
                      </RippleButton>
                    </div>
                    <div className="grid grid-cols-4 gap-2 pt-3 border-t border-white/5">
                      {[{ t: "Missions", i: <Layers size={9} /> }, { t: "Payouts", i: <Zap size={9} /> }, { t: "Trust Score", i: <ThumbsUp size={9} /> }, { t: "Global Net", i: <Globe size={9} /> }].map((b, i) => (
                        <div key={i} className="flex flex-col items-center gap-1 p-2 bg-white/3 rounded-xl">
                          <div className="text-[#00f2ff]">{b.i}</div>
                          <span className="text-[7px] font-bold text-gray-500 uppercase text-center leading-tight">{b.t}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* STATS ROW */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="grid grid-cols-4 gap-2">
                  <StatCard label="Jobs" value="0" icon={<Target size={13} />} color="#00f2ff" />
                  <StatCard label="Uptime" value="99.9%" icon={<Activity size={13} />} color="#34d399" trend="+0.1%" />
                  <StatCard label="Tier" value="T-1" icon={<Cpu size={13} />} color="#f59e0b" />
                  <StatCard label="Score" value="—" icon={<Star size={13} />} color="#a78bfa" />
                </motion.div>
              </div>

              {/* RECENT ACTIVITY */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <GlassCard className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-[8px] font-black uppercase tracking-widest text-gray-500">Recent Activity</h4>
                    <span className="text-[7px] font-black text-[#00f2ff] uppercase">Live Feed</span>
                  </div>
                  {activities.map((a, i) => <ActivityItem key={i} {...a} />)}
                </GlassCard>
              </motion.div>

              {/* QUICK ACTIONS */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Browse Gigs", icon: <Briefcase size={16} />, color: "#00f2ff", tab: "tasks" },
                    { label: "My Vault", icon: <Wallet size={16} />, color: "#a78bfa", tab: "earnings" },
                    { label: "Get Help", icon: <LifeBuoy size={16} />, color: "#34d399", tab: "support" },
                  ].map((action, i) => (
                    <RippleButton key={i} onClick={() => setActiveTab(action.tab)}
                      className="flex flex-col items-center gap-2 p-4 rounded-[18px] border border-white/8 bg-white/3 hover:border-white/15 transition-all group">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center transition-all group-hover:scale-110" style={{ backgroundColor: `${action.color}15`, color: action.color }}>
                        {action.icon}
                      </div>
                      <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">{action.label}</span>
                    </RippleButton>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ═══════════════════════ GIGS ═══════════════════════ */}
          {activeTab === "tasks" && (
            <motion.div key="tasks" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tighter">Mission <span className="text-[#00f2ff]">Relay</span></h3>
                  <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">{filteredGigs.filter(g => g.status === "Active").length} active · {marketplaceGigs.length} total</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                  <PulseDot color="#10b981" size={6} />
                  <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest">Live</span>
                </div>
              </div>

              {/* TOGGLE */}
              <div className="bg-white/4 p-1 rounded-2xl flex border border-white/8 max-w-sm">
                {(["internal", "corporate"] as const).map(mode => (
                  <button key={mode} onClick={() => setGigSlide(mode)}
                    className={`flex-1 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${gigSlide === mode ? (mode === "internal" ? "bg-[#00f2ff] text-black" : "bg-white text-black") : "text-gray-600"}`}>
                    {mode === "internal" ? "Internal" : "Corporate"}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {gigSlide === "internal" ? (
                  <motion.div key="int" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    {/* SEARCH + FILTER */}
                    <SearchBar placeholder="Search missions…" value={gigSearch} onChange={setGigSearch} />
                    <FilterChips filters={allGigTypes} active={gigFilter} onSelect={setGigFilter} />

                    {filteredGigs.length === 0 ? (
                      <div className="text-center py-16 text-gray-600">
                        <Search size={28} className="mx-auto mb-2 opacity-30" />
                        <p className="text-[10px] font-black uppercase">No missions found</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {filteredGigs.map((g, idx) => (
                          <motion.div key={g.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
                            className={`relative p-4 rounded-[18px] border transition-all group ${g.status === "Expired" ? "opacity-40 grayscale bg-white/2 border-white/5" : "bg-white/4 border-white/8 hover:border-white/20 hover:bg-white/[0.07]"}`}>
                            {g.hot && g.status === "Active" && (
                              <div className="absolute -top-2 -right-2 bg-orange-500 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
                                <Flame size={8} className="text-white" />
                                <span className="text-[7px] font-black text-white uppercase">Hot</span>
                              </div>
                            )}
                            <div className="flex justify-between items-start mb-3">
                              <img src={g.img} className="w-9 h-9 rounded-xl object-cover border border-white/10" alt="" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                              <div className="flex flex-col items-end gap-1">
                                <span className={`text-[7px] font-bold px-2 py-0.5 rounded-full uppercase border ${g.status === "Active" ? "bg-[#00f2ff]/10 text-[#00f2ff] border-[#00f2ff]/20" : "bg-white/5 text-gray-600 border-white/5"}`}>{g.dur}</span>
                                <div className="flex items-center gap-0.5"><Star size={8} className="text-amber-500 fill-amber-500" /><span className="text-[7px] font-bold text-amber-500">{g.rating}</span></div>
                              </div>
                            </div>
                            <p className="text-[8px] text-[#00f2ff]/60 font-black uppercase tracking-widest mb-1">{g.type}</p>
                            <h4 className="text-[10px] font-black uppercase mb-3 line-clamp-2 leading-tight">{g.title}</h4>
                            <div className="flex justify-between items-center pt-3 border-t border-white/5">
                              <p className="text-base font-black tracking-tighter text-white">${g.budget.toLocaleString()}</p>
                              <RippleButton onClick={handleApplyAction}
                                className={`px-4 py-1.5 rounded-xl text-[8px] font-black uppercase transition-all ${g.status === "Active" ? "bg-[#00f2ff] text-black hover:scale-105" : "bg-white/5 text-gray-600 cursor-not-allowed"}`}
                                disabled={g.status === "Expired"}>
                                {g.status === "Active" ? "Apply" : "Expired"}
                              </RippleButton>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div key="corp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    <GlassCard className="p-4 flex items-start gap-3">
                      <ShieldAlert size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[9px] font-black uppercase text-indigo-300 mb-0.5">Corporate Handshake Protocol</p>
                        <p className="text-[8px] text-gray-500 leading-relaxed">Applications for global entities require Verified Identity + HR vetting.</p>
                      </div>
                    </GlassCard>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {corporateGigs.map((c, idx) => (
                        <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                          className="p-4 rounded-[20px] bg-white/3 border border-white/8 hover:border-white/16 transition-all">
                          <div className="flex items-center gap-3 mb-3">
                            <CompanyLogo name={c.company} domain={c.domain} size={44} />
                            <div className="min-w-0">
                              <h4 className="text-[10px] font-black uppercase leading-tight truncate">{c.title}</h4>
                              <p className="text-[8px] font-bold text-[#00f2ff] mt-0.5">{c.salary}</p>
                              <p className="text-[7px] text-gray-600 font-bold uppercase">{c.location}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 mb-3">
                            <div className="flex-1 bg-white/3 p-2 rounded-xl border border-white/5 text-center">
                              <p className="text-[6px] font-black text-gray-600 uppercase mb-0.5">Slots</p>
                              <p className="text-[9px] font-black">{c.headcount}</p>
                            </div>
                            <div className="flex-1 bg-white/3 p-2 rounded-xl border border-white/5 text-center">
                              <p className="text-[6px] font-black text-gray-600 uppercase mb-0.5">Status</p>
                              <p className="text-[9px] font-black text-emerald-400">● Open</p>
                            </div>
                          </div>
                          <RippleButton onClick={handleApplyAction} className="w-full py-2.5 bg-white text-black font-black rounded-xl text-[8px] uppercase tracking-widest active:scale-95 transition-all">
                            Request Handshake
                          </RippleButton>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <RippleButton onClick={handleApplyAction} className="w-full py-4 bg-[#00f2ff] text-black rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:scale-[1.01] transition-transform group">
                <Lock size={13} /> See More Missions <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </RippleButton>
            </motion.div>
          )}

          {/* ═══════════════════════ WORK ═══════════════════════ */}
          {activeTab === "contracts" && (
            <motion.div key="contracts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-8 px-4 space-y-6 text-center">
              <GlassCard className="p-14 text-center">
                <div className="w-20 h-20 bg-red-500/10 rounded-[28px] flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                  <ShieldAlert size={36} className="text-red-500" />
                </div>
                <h3 className="text-xl font-black uppercase italic mb-2">Access Locked</h3>
                <p className="text-[11px] text-gray-500 mb-8 max-w-xs mx-auto leading-relaxed">Complete identity verification to view your contract history and earnings.</p>
                {!isVerified && (
                  <RippleButton onClick={handleVerifyClick} className="w-full max-w-xs mx-auto block py-4 bg-red-500 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest active:scale-95 transition-all">
                    Unlock Now
                  </RippleButton>
                )}
              </GlassCard>
            </motion.div>
          )}

          {/* ═══════════════════════ VAULT ═══════════════════════ */}
          {activeTab === "earnings" && (
            <motion.div key="earnings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              
              {/* VAULT HERO */}
              <div className="relative overflow-hidden p-7 rounded-[28px] border border-white/8"
                style={{ background: "linear-gradient(135deg, rgba(0,242,255,0.1) 0%, rgba(124,58,237,0.05) 100%)" }}>
                <div className="absolute top-0 right-0 w-64 h-64 opacity-5" style={{ background: "radial-gradient(circle, #00f2ff, transparent)" }} />
                <div className="flex justify-between items-start mb-8">
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/10"><Landmark size={20} className="text-[#00f2ff]" /></div>
                  <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    <PulseDot color="#10b981" size={6} />
                    <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest">Vault Active</span>
                  </div>
                </div>
                <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.3em] mb-2">Available Balance</p>
                <BalanceDisplay amount={0} currency="USD" />
                <p className="text-[8px] font-bold text-gray-700 mt-1 mb-8">≈ KES 0.00</p>
                <div className="grid grid-cols-2 gap-3">
                  <RippleButton onClick={() => addToast("No funds available to withdraw", "error")}
                    className="py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all">
                    Withdraw <ArrowUpRight size={13} />
                  </RippleButton>
                  <button disabled className="py-4 bg-white/5 border border-white/10 text-gray-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 cursor-not-allowed">
                    Transfer <Send size={12} />
                  </button>
                </div>
              </div>

              {/* VAULT STATS */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Total Earned", value: "$0.00", icon: <TrendingUp size={14} />, color: "#00f2ff" },
                  { label: "Pending", value: "$0.00", icon: <Clock size={14} />, color: "#f59e0b" },
                  { label: "Withdrawn", value: "$0.00", icon: <ArrowUpRight size={14} />, color: "#a78bfa" },
                ].map((s, i) => (
                  <GlassCard key={i} className="p-4 text-center">
                    <div className="flex justify-center mb-2" style={{ color: s.color }}>{s.icon}</div>
                    <p className="text-[11px] font-black">{s.value}</p>
                    <p className="text-[7px] font-bold text-gray-600 uppercase mt-0.5">{s.label}</p>
                  </GlassCard>
                ))}
              </div>

              {/* TRANSACTION HISTORY */}
              <GlassCard className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-[8px] font-black uppercase tracking-widest text-gray-500">Transaction Log</h4>
                  <History size={13} className="text-gray-700" />
                </div>
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center"><History size={20} className="text-gray-700" /></div>
                  <p className="text-[9px] font-black uppercase text-gray-700">No transactions yet</p>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* ═══════════════════════ STATS ═══════════════════════ */}
          {activeTab === "analytics" && (
            <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tighter">Work <span className="text-[#00f2ff]">Pulse</span></h3>
                  <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Phase 1 — Beta</p>
                </div>
                <span className="text-[7px] font-black text-gray-700 uppercase">Since account creation</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { l: "Success Rate", v: "—", i: <CheckCircle2 size={18} className="text-emerald-500" />, sub: "No data yet" },
                  { l: "Gigs Done", v: "0", i: <Briefcase size={18} className="text-blue-500" />, sub: "Start applying" },
                  { l: "Trust Tier", v: "Beta", i: <ShieldCheck size={18} className="text-purple-500" />, sub: "Verify to level up" },
                  { l: "Total Paid", v: "$0.00", i: <DollarSign size={18} className="text-amber-500" />, sub: "Unlocked on first job" },
                ].map(stat => (
                  <GlassCard key={stat.l} className="p-5 text-center">
                    <div className="mb-2 flex justify-center">{stat.i}</div>
                    <p className="text-lg font-black mb-0.5">{stat.v}</p>
                    <p className="text-[7px] text-gray-600 uppercase font-bold">{stat.l}</p>
                    <p className="text-[7px] text-gray-700 mt-1 italic">{stat.sub}</p>
                  </GlassCard>
                ))}
              </div>

              {/* MILESTONES */}
              <GlassCard className="p-5">
                <h4 className="text-[8px] font-black uppercase tracking-widest text-gray-500 mb-4">Milestone Track</h4>
                {[
                  { label: "Complete first gig", done: false, reward: "+50 score" },
                  { label: "Earn first $100", done: false, reward: "+100 score" },
                  { label: "Get verified", done: isVerified, reward: "Full access" },
                  { label: "5-star rating", done: false, reward: "Elite badge" },
                ].map((m, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 ${m.done ? "bg-emerald-500/20 text-emerald-500" : "bg-white/5 text-gray-700"}`}>
                      {m.done ? <Check size={10} /> : <Minus size={10} />}
                    </div>
                    <span className={`flex-1 text-[10px] font-bold ${m.done ? "line-through text-gray-600" : "text-white"}`}>{m.label}</span>
                    <span className="text-[8px] font-black text-[#00f2ff] bg-[#00f2ff]/10 px-2 py-0.5 rounded-full">{m.reward}</span>
                  </div>
                ))}
              </GlassCard>
            </motion.div>
          )}

          {/* ═══════════════════════ SUPPORT ═══════════════════════ */}
          {activeTab === "support" && (
            <motion.div key="support" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter"><span className="text-[#00f2ff]">Help</span> Center</h3>
                <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">We respond within 24h</p>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <GlassCard className="p-6 space-y-5">
                  <div className="space-y-1">
                    <p className="text-[7px] font-black text-gray-600 uppercase tracking-widest">Email Support</p>
                    <p className="text-xs font-black text-white cursor-pointer hover:text-[#00f2ff] transition-colors" onClick={() => window.location.href = "mailto:support@nexusgigs.me"}>support@nexusgigs.me</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[7px] font-black text-gray-600 uppercase tracking-widest">WhatsApp</p>
                    <p className="text-xs font-bold text-[#00f2ff]">+1 (500) 555-0006</p>
                  </div>
                  <div className="pt-4 border-t border-white/5">
                    <textarea value={supportMsg} onChange={e => setSupportMsg(e.target.value)} placeholder="Describe your issue…"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-[11px] font-medium outline-none focus:border-[#00f2ff]/50 h-28 mb-3 text-white resize-none transition-colors placeholder:text-gray-700" />
                    <RippleButton onClick={handleSupportEmail} className="w-full py-4 bg-[#00f2ff] text-black font-black rounded-2xl text-[9px] uppercase tracking-widest active:scale-95 transition-all">
                      Send Message
                    </RippleButton>
                  </div>
                </GlassCard>
                <GlassCard className="p-6">
                  <p className="text-[7px] font-black text-gray-600 uppercase tracking-widest mb-4">Community</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { n: "Instagram", i: <Share2 size={18} />, l: "https://www.instagram.com/nexusgigs", color: "#e1306c" },
                      { n: "TikTok", i: <Zap size={18} />, l: "https://www.tiktok.com/@nexusgigss", color: "#69c9d0" },
                      { n: "Telegram", i: <Send size={18} />, l: "https://t.me/nexusGigs", color: "#229ed9" },
                      { n: "Facebook", i: <ThumbsUp size={18} />, l: "https://www.facebook.com/share/1CJMYz5kGH/", color: "#1877f2" },
                    ].map(soc => (
                      <button key={soc.n} onClick={() => window.open(soc.l, "_blank")}
                        className="p-4 rounded-2xl border border-white/8 bg-white/3 flex flex-col items-center gap-2 hover:border-white/20 transition-all active:scale-95 group">
                        <div className="transition-all group-hover:scale-110" style={{ color: soc.color }}>{soc.i}</div>
                        <span className="text-[8px] font-black uppercase text-gray-600">{soc.n}</span>
                      </button>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════ MESSAGES ═══════════════════════ */}
          {activeTab === "messages" && (
            <motion.div key="messages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black uppercase tracking-tighter">System <span className="text-[#00f2ff]">Log</span></h3>
                <button onClick={() => setNotifBadge(0)} className="text-[8px] font-black text-gray-600 uppercase hover:text-white transition-colors">
                  Mark all read
                </button>
              </div>
              {[
{ t: "Nexus HQ", m: "Welcome to the Nexus network, Node user. Your entry into our specialized mission ecosystem is almost complete. To ensure the safety of our global clients and the integrity of our high-budget missions, you must finish your Phase 1 identity sync. Once verified, you will gain full access to the corporate slide and unlimited bidding rights. We look forward to seeing your performance metrics climb.", time: "Just now", unread: true },
                { t: "Security ", m: "End-to-end encryption is active for this node. We have performed a preliminary scan of your connection and no unauthorized relays or data leaks were detected. However, per protocol 74-B, your external account sync is currently paused. Please complete the one-time security vetting fee to establish a permanent encrypted handshake with our financial vault.", time: "5m ago", unread: true },
                { t: "Verification ", m: "Status Update: Your profile is currently set to 'Tier 0 - Limited'. Global enterprise clients frequently filter for 'Verified' status when selecting freelancers for smart contract audits and enterprise security missions. By completing your identity sync now, you will automatically boost your visibility index by 400% and unlock the instant withdrawal terminal.", time: "45m ago", unread: true },
                { t: "Nexus HQ", m: "Weekly Mission Alert: Over 50 new high-budget technical missions have been added to the internal slide this hour. We have noticed your skills align with several cloud infrastructure audits. These missions are currently restricted to Tier 1 users. Verify your account today to submit your first handshake proposal and start earning in the Nexus ecosystem.", time: "2h ago", unread: false },
                { t: "System Relay", m: "Maintenance Report: All financial bridges and M-Pesa gateways are operating at 99.9% uptime. Your local currency exchange rates have been updated to reflect current market data ($1 = 130 KES). Please ensure your wallet node is synced before attempting any internal transfers or withdrawing mission assets to your external accounts.", time: "5h ago", unread: false },              ].map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  onClick={() => setExpandedMsg(expandedMsg === i ? null : i)}
                  className={`p-5 rounded-[22px] border cursor-pointer transition-all ${msg.unread ? "border-[#00f2ff]/20 bg-[#00f2ff]/4" : "border-white/6 bg-white/2"} hover:border-white/20`}>
                  <div className="flex gap-3 items-center">
                    <div className="p-2.5 bg-black/40 rounded-xl border border-white/10 text-[#00f2ff] shrink-0">
                      <MessageSquare size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <h4 className="text-[10px] font-black uppercase italic text-white">{msg.t}</h4>
                        <div className="flex items-center gap-2">
                          {msg.unread && <div className="w-1.5 h-1.5 bg-[#00f2ff] rounded-full" />}
                          <span className="text-[7px] font-bold text-gray-700">{msg.time}</span>
                        </div>
                      </div>
                      <p className={`text-[9px] text-gray-500 leading-relaxed ${expandedMsg === i ? "" : "line-clamp-1"}`}>{msg.m}</p>
                    </div>
                    <ChevronDown size={13} className={`text-gray-700 transition-transform shrink-0 ${expandedMsg === i ? "rotate-180" : ""}`} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* ═══════════════════════ ACCOUNT ═══════════════════════ */}
          {activeTab === "account" && (
            <motion.div key="account" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-xl mx-auto space-y-4">
              <GlassCard className="p-8 text-center overflow-hidden relative" glow>
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg, transparent, #00f2ff, transparent)" }} />
                {/* AVATAR */}
                <div className="relative w-24 h-24 mx-auto mb-5">
                  <div className="w-full h-full bg-linear-to-br from-[#00f2ff]/20 to-purple-500/20 rounded-[30px] border border-white/10 flex items-center justify-center">
                    {user?.imageUrl ? (
                      <img src={user.imageUrl} alt="avatar" className="w-full h-full rounded-[30px] object-cover" />
                    ) : (
                      <UserCircle size={44} className="text-gray-600" />
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-black border-2 border-[#00f2ff] p-1.5 rounded-xl text-[#00f2ff]">
                    <Fingerprint size={12} />
                  </div>
                </div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-1">{user?.fullName || "—"}</h3>
                <p className="text-[8px] font-bold text-gray-600 uppercase tracking-[0.3em] mb-4">{user?.primaryEmailAddress?.emailAddress}</p>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/40 rounded-full border border-white/5 mb-6">
                  <PulseDot color="#00f2ff" size={5} />
                  <span className="text-[7px] font-black text-[#00f2ff] uppercase tracking-[0.3em]">Node Active</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { l: "Node Security", v: "Encrypted", icon: <Shield size={11} />, color: "#34d399" },
                    { l: "Settlement", v: "Localized", icon: <QrCode size={11} />, color: "#00f2ff" },
                    { l: "Identity", v: isVerified ? "Verified" : "Pending", icon: <BadgeCheck size={11} />, color: isVerified ? "#34d399" : "#f59e0b" },
                    { l: "Tier", v: "Beta / 1", icon: <Crown size={11} />, color: "#a78bfa" },
                  ].map((item, i) => (
                    <div key={i} className="bg-white/3 p-3 rounded-2xl border border-white/5 text-left">
                      <p className="text-[6px] font-black text-gray-600 uppercase tracking-widest mb-1">{item.l}</p>
                      <div className="flex items-center gap-1.5" style={{ color: item.color }}>
                        {item.icon}
                        <span className="font-black text-[9px] uppercase italic">{item.v}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <RippleButton onClick={() => setActiveTab("earnings")} className="py-3 bg-white text-black rounded-2xl font-black uppercase text-[9px] tracking-widest active:scale-95 transition-all">
                    Vault Hub
                  </RippleButton>
                  <RippleButton onClick={() => setActiveTab("support")} className="py-3 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-[9px] tracking-widest hover:border-white/20 transition-all">
                    Support
                  </RippleButton>
                </div>
              </GlassCard>

              <SignOutButton>
                <button className="w-full py-4 bg-red-500/10 border border-red-500/20 text-red-500 font-black italic rounded-2xl uppercase text-[9px] tracking-widest active:scale-95 transition-all hover:bg-red-500/20">
                  Terminate Session
                </button>
              </SignOutButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══════════════════════ NAV BAR ═══════════════════════ */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-100 w-[92%] max-w-xl">
        <div className="h-14.5 bg-black/85 backdrop-blur-3xl border border-white/9 rounded-[999px] flex items-center justify-around px-3 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center gap-0.5 transition-all duration-200 ${activeTab === item.id ? "text-[#00f2ff] scale-110" : "text-gray-600 hover:text-gray-300"}`}>
              <div className={`transition-all ${activeTab === item.id ? "bg-[#00f2ff]/10 p-1.5 rounded-xl border border-[#00f2ff]/20" : "p-1.5"}`}>
                {item.icon}
              </div>
              <span className="text-[5.5px] font-black uppercase tracking-tight opacity-80 leading-none">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#00f2ff] rounded-full text-[6px] font-black text-black flex items-center justify-center">{item.badge}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════════════ GIGS RESTRICTION POPUP ═══════════════════════ */}
      <AnimatePresence>
        {showGigsRestriction && (
          <div className="fixed inset-0 z-300 flex items-center justify-center p-6 backdrop-blur-md bg-black/70">
            <motion.div initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.88, opacity: 0 }} transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="w-full max-w-85 bg-[#080e1d] border border-white/10 rounded-[36px] p-8 shadow-2xl text-center">
              <div className="w-16 h-16 bg-[#00f2ff]/10 rounded-[22px] flex items-center justify-center mx-auto mb-5 border border-[#00f2ff]/20">
                <ShieldAlert size={32} className="text-[#00f2ff]" />
              </div>
              <h4 className="text-lg font-black uppercase italic mb-2 tracking-tighter">Access Restricted</h4>
              <p className="text-[10px] text-gray-500 mb-7 leading-relaxed">Verify your account to apply for gigs and access the full mission network.</p>
              <div className="space-y-2">
                <RippleButton onClick={() => { setShowGigsRestriction(false); handleVerifyClick(); }}
                  className="w-full py-4 bg-[#00f2ff] text-black font-black rounded-2xl text-[10px] uppercase tracking-widest active:scale-95 transition-all">
                  Verify Now
                </RippleButton>
                <button onClick={() => setShowGigsRestriction(false)} className="w-full py-4 bg-white/5 text-gray-500 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                  Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════ VERIFICATION MODAL ═══════════════════════ */}
      <AnimatePresence>
        {showVerifyModal && (
          <div className="fixed inset-0 z-200 flex items-center justify-center p-4 backdrop-blur-md bg-black/70">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0" onClick={() => !isPaying && setShowVerifyModal(false)} />
            <motion.div initial={{ scale: 0.94, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 12 }} transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="relative w-full max-w-sm bg-[#070d1a] border border-white/10 rounded-4xl p-7 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg, transparent, #00f2ff, transparent)" }} />

              {paymentStep === "terms" && (
                <motion.div key="terms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={18} className="text-[#00f2ff]" />
                      <span className="font-black text-sm uppercase italic tracking-tighter">Verify Account</span>
                    </div>
                    <button onClick={() => setShowVerifyModal(false)} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"><X size={14} className="text-gray-500" /></button>
                  </div>
                  <div className="bg-white/3 p-4 rounded-2xl border border-white/[0.07] space-y-3">
                    {[
                      { n: "1", t: "Vetting Fee", d: "One-time $10 (KES 1,300) to filter bots." },
                      { n: "2", t: "Manual Review", d: "Account audit + survey within 24h." },
                      { n: "3", t: "Full Access", d: "Unlimited bidding & instant withdrawals." },
                    ].map(item => (
                      <div key={item.n} className="flex gap-3">
                        <div className="w-5 h-5 rounded-lg bg-[#00f2ff]/15 flex items-center justify-center shrink-0 text-[#00f2ff] text-[8px] font-black">{item.n}</div>
                        <div>
                          <p className="text-[9px] font-black text-white uppercase mb-0.5">{item.t}</p>
                          <p className="text-[8px] text-gray-600 leading-relaxed">{item.d}</p>
                        </div>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-white/5 flex items-center gap-2">
                      <CheckCircle2 size={10} className="text-emerald-500" />
                      <p className="text-[8px] text-emerald-500 font-bold italic">100% refund if vetting fails.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl border border-white/[0.07] cursor-pointer hover:border-white/20 transition-all" onClick={() => setAgreedToTerms(!agreedToTerms)}>
                    <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${agreedToTerms ? "bg-[#00f2ff] border-[#00f2ff]" : "border-white/20"}`}>
                      {agreedToTerms && <Check size={10} className="text-black" />}
                    </div>
                    <span className="text-[8px] font-bold text-gray-500 uppercase leading-tight">I agree to the $10 fee and refund terms.</span>
                  </div>
                  <RippleButton disabled={!agreedToTerms} onClick={() => setPaymentStep("choice")}
                    className={`w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${agreedToTerms ? "bg-[#00f2ff] text-black" : "bg-white/5 text-gray-700 cursor-not-allowed"}`}>
                    Continue to Payment
                  </RippleButton>
                </motion.div>
              )}

              {paymentStep === "choice" && (
                <motion.div key="choice" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <button onClick={() => setPaymentStep("terms")} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"><ChevronDown size={14} className="text-gray-500 rotate-90" /></button>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Select Payment</span>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { label: "Bank / Card", sub: "Visa · Mastercard · Amex", icon: <Landmark size={18} className="text-white" />, bg: "bg-indigo-600", action: () => handleSecurePayment("CARD"), badge: null },
                      { label: "M-Pesa", sub: "Mobile money · Instant", icon: <span className="text-white font-black text-lg">M</span>, bg: "bg-emerald-600", action: () => setPaymentStep("mpesa"), badge: "Instant" },
                      { label: "Binance USDT", sub: "TRC20 · Crypto", icon: <Zap size={18} className="text-white fill-white" />, bg: "bg-amber-500", action: () => setPaymentStep("binance"), badge: "Crypto" },
                    ].map((method, i) => (
                      <RippleButton key={i} onClick={method.action}
                        className="w-full p-4 bg-white/3 border border-white/8 rounded-2xl flex items-center justify-between hover:border-white/20 hover:bg-white/6 transition-all group">
                        <div className="flex items-center gap-3">
                          <div className={`w-11 h-11 ${method.bg} rounded-xl flex items-center justify-center shadow-lg`}>{method.icon}</div>
                          <div className="text-left">
                            <div className="flex items-center gap-2">
                              <p className="font-black text-white text-[12px]">{method.label}</p>
                              {method.badge && <span className="text-[7px] px-2 py-0.5 bg-white/10 text-gray-400 rounded-full uppercase font-black">{method.badge}</span>}
                            </div>
                            <p className="text-[9px] text-gray-600 font-bold">{method.sub}</p>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-gray-700 group-hover:translate-x-0.5 transition-transform" />
                      </RippleButton>
                    ))}
                    <button disabled className="w-full p-4 bg-white/2 border border-white/5 rounded-2xl flex items-center gap-3 opacity-40 cursor-not-allowed">
                      <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-[11px]">PP</div>
                      <div className="text-left">
                        <div className="flex items-center gap-2"><p className="font-black text-white text-[12px]">PayPal</p><span className="text-[7px] px-2 py-0.5 bg-amber-500/10 text-amber-500/60 border border-amber-500/20 rounded-full uppercase font-black">Limited</span></div>
                        <p className="text-[9px] text-gray-600 font-bold">Restricted regions</p>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}

              {paymentStep === "mpesa" && (
                <motion.div key="mpesa" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setPaymentStep("choice")} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"><ChevronDown size={14} className="text-gray-500 rotate-90" /></button>
                    <div className="flex items-center gap-2"><div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-sm">M</div><span className="font-black text-sm uppercase italic">M-Pesa</span></div>
                  </div>
                  <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-xl">
                    <p className="text-[8px] font-black text-emerald-500 uppercase">Pay KES 1,300 (~$10)</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Safaricom Number</p>
                    <input value={mpesaNumber} onChange={e => setMpesaNumber(e.target.value)} placeholder="2547XXXXXXXX"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xl font-black text-white outline-none focus:border-emerald-500 text-center tracking-widest transition-colors" />
                    <p className="text-[8px] text-gray-700 text-center font-medium">Format: 254XXXXXXXXX</p>
                  </div>
                  <RippleButton disabled={isPaying} onClick={() => handleSecurePayment("M-PESA")}
                    className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest active:scale-95 transition-all">
                    {isPaying ? "Sending prompt…" : "Pay KES 1,300"}
                  </RippleButton>
                </motion.div>
              )}

              {paymentStep === "binance" && (
                <motion.div key="binance" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setPaymentStep("choice")} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"><ChevronDown size={14} className="text-gray-500 rotate-90" /></button>
                      <div className="flex items-center gap-2"><div className="w-7 h-7 bg-amber-500 rounded-xl flex items-center justify-center"><Zap size={13} className="text-white fill-white" /></div><span className="font-black text-sm uppercase italic">USDT</span></div>
                    </div>
                    <span className="text-[8px] font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full uppercase">TRC20</span>
                  </div>
                  <div className="bg-white rounded-2xl p-3 flex items-center justify-center shadow-xl">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=TFWxe4TFcjUNgPJVgf5iXrMsw1oe4gDv9X" alt="QR" className="w-36 h-36" />
                  </div>
                  <div className="flex gap-3 bg-white/3 p-3 rounded-2xl border border-white/[0.07] justify-between">
                    <div><p className="text-[7px] font-black text-gray-600 uppercase mb-0.5">Amount</p><p className="text-sm font-black">$10.00 USDT</p></div>
                    <div className="text-right"><p className="text-[7px] font-black text-gray-600 uppercase mb-0.5">Network</p><p className="text-sm font-black text-amber-500">TRC20</p></div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[8px] font-black text-gray-600 uppercase">Wallet Address</p>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-white/3 border border-white/[0.07] rounded-xl p-3 text-[8px] font-mono text-gray-400 truncate">TFWxe4TFcjUNgPJVgf5iXrMsw1oe4gDv9X</div>
                      <button onClick={copyAddress} className="bg-white/5 border border-white/9 p-3 rounded-xl hover:bg-white/10 transition-all">
                        {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} className="text-gray-500" />}
                      </button>
                    </div>
                  </div>
                  <RippleButton onClick={() => { addToast("Signal sent — syncing in ~2h", "success"); setShowVerifyModal(false); }}
                    className="w-full py-3.5 bg-[#00f2ff] text-black font-black rounded-2xl uppercase text-[9px] tracking-widest active:scale-95 transition-all">
                    Confirm Payment
                  </RippleButton>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════ LEGACY ALERT (fallback) ═══════════════════════ */}
      <AnimatePresence>
        {customAlert.show && (
          <div className="fixed inset-0 z-400 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-75 bg-[#080e1d] border border-white/10 rounded-[28px] p-6 shadow-2xl text-center">
              <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-[28px] ${customAlert.type === "error" ? "bg-red-500" : "bg-[#00f2ff]"}`} />
              <div className="mb-4 flex justify-center mt-2">
                {customAlert.type === "error" ? <AlertTriangle size={26} className="text-red-500" /> : customAlert.type === "success" ? <CheckCircle size={26} className="text-emerald-500" /> : <Info size={26} className="text-[#00f2ff]" />}
              </div>
              <h4 className="text-sm font-black uppercase italic mb-2 tracking-tighter">{customAlert.title}</h4>
              <p className="text-[9px] text-gray-500 italic mb-5 leading-relaxed">{customAlert.msg}</p>
              <button onClick={() => setCustomAlert({ ...customAlert, show: false })} className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase hover:bg-white hover:text-black transition-all">
                Dismiss
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};
