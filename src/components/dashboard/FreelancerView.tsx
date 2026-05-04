"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  BellRing, ChevronUp, Flame, Crown, BadgeCheck, Wifi, WifiOff, Calculator, Settings
} from "lucide-react";

// --- GLOBAL COMPONENTS ---

const PulseDot = ({ color = "#00f2ff", size = 8 }: { color?: string; size?: number }) => (
  <span className="relative inline-flex" style={{ width: size, height: size }}>
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50" style={{ backgroundColor: color }} />
    <span className="relative inline-flex rounded-full" style={{ width: size, height: size, backgroundColor: color }} />
  </span>
);

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

const GlassCard = ({ children, className = "", accent = false, glow = false }: any) => (
  <div className={`relative bg-white/4 backdrop-blur-xl border border-white/8 rounded-[22px] transition-all duration-300 hover:border-white/[0.14] hover:bg-white/6 ${accent ? "border-l-2 border-l-[#00f2ff]" : ""} ${glow ? "shadow-[0_0_30px_rgba(0,242,255,0.08)]" : ""} ${className}`}>
    {children}
  </div>
);

const StatCard = ({ label, value, icon, color = "#00f2ff" }: any) => (
  <GlassCard className="p-4 text-center group cursor-default">
    <div className="flex justify-center mb-2" style={{ color }}>{icon}</div>
    <p className="text-[11px] font-black tracking-tighter text-white">{value}</p>
    <p className="text-[8px] font-bold text-gray-600 uppercase leading-none mt-0.5">{label}</p>
  </GlassCard>
);

const CompanyLogo = ({ name, domain, size = 40 }: { name: string; domain: string; size?: number }) => {
  const [src, setSrc] = useState<string>(`https://logo.clearbit.com/${domain}`);
  return (
    <div style={{ width: size, height: size }} className="shrink-0">
      <img src={src} alt={name} className="w-full h-full rounded-xl object-contain bg-white p-1 border border-white/10"
        onError={() => setSrc(`https://ui-avatars.com/api/?name=${name}&background=random`)} />
    </div>
  );
};

const ToastContainer = ({ toasts, remove }: { toasts: { id: number; msg: string; type: string }[]; remove: (id: number) => void }) => (
  <div className="fixed top-4 right-4 z-999 flex flex-col gap-2 pointer-events-none">
    <AnimatePresence>
      {toasts.map(t => (
        <motion.div key={t.id} initial={{ opacity: 0, x: 80, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 80, scale: 0.9 }} transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest shadow-2xl border backdrop-blur-xl ${t.type === "success" ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" : t.type === "error" ? "bg-red-500/20 border-red-500/30 text-red-400" : "bg-[#00f2ff]/10 border-[#00f2ff]/20 text-[#00f2ff]"}`}>
          {t.type === "success" ? <CheckCircle size={13} /> : t.type === "error" ? <AlertTriangle size={13} /> : <Info size={13} />}
          <span>{t.msg}</span>
          <button onClick={() => remove(t.id)} className="ml-1 opacity-50 hover:opacity-100 pointer-events-auto"><X size={11} /></button>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

// === MAIN VIEW COMPONENT ===

export const FreelancerView = ({ jobs, userMetadata }: { jobs: any[]; userMetadata: any }) => {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- UI STATE ---
  const [activeTab, setActiveTab] = useState("home");
  const [gigSlide, setGigSlide] = useState<"internal" | "corporate">("internal");
  const [expandedMsg, setExpandedMsg] = useState<number | null>(null);
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: string }[]>([]);

  // --- LOGIC STATE ---
  const [huBalance, setHuBalance] = useState(5); // GIFTED UNITS
  const [cashBalance] = useState(0.00);
  const [isVerified] = useState(userMetadata?.status === "Verified");
  const [isUnderReview, setIsUnderReview] = useState(userMetadata?.status === "Pending");

  // --- REFILL & PAYMENT MODAL STATE ---
  const [showRefillModal, setShowRefillModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"packages" | "choice" | "mpesa">("packages");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  // --- CALCULATOR STATE ---
  const [calcHU, setCalcHU] = useState("1200");
  const calcKES = Math.floor(parseFloat(calcHU || "0") * 1.083);

  // Define packages inside to avoid scope errors
  const uplinkPackages = [
    { id: 1, name: "Starter", price: 3, hu: 150, desc: "Apply for a few local jobs." },
    { id: 2, name: "Basic", price: 6, hu: 400, desc: "Apply for more local tasks." },
    { id: 3, name: "Pro Uplink", price: 10, hu: 1200, desc: "Unlock Global Corporate missions.", hot: true },
    { id: 4, name: "Elite", price: 18, hu: 2500, desc: "Priority Handshakes + HR direct." },
    { id: 5, name: "Alpha", price: 30, hu: 5000, desc: "Ultimate power for top workers." },
  ];

  const addToast = (msg: string, type: string = "info") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };

  const handleApplyAction = (cost: number) => {
    if (huBalance >= cost) {
      setHuBalance(prev => prev - cost);
      addToast(`Handshake sent! -${cost} HU consumed.`, "success");
    } else {
      setPaymentStep("packages");
      setShowRefillModal(true);
    }
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
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: 1300, phone: cleanPhone, email: user?.primaryEmailAddress?.emailAddress, method: "M-PESA" }),
        });
        if (response.ok) {
          addToast("Check your phone for the PIN prompt", "success");
          setShowRefillModal(false);
        }
      } catch { addToast("Connection lost", "error"); } finally { setIsPaying(false); }
    } else {
      // CARD PAYMENT LOGIC
      try {
        const response = await fetch("/api/paystack", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: 1300, currency: "USD", email: user?.primaryEmailAddress?.emailAddress }),
        });
        const data = await response.json();
        if (data.status && data.data.authorization_url) window.location.href = data.data.authorization_url;
      } catch { addToast("Payment relay down", "error"); } finally { setIsPaying(false); }
    }
  };

  const marketplaceGigs = useMemo(() => [
    { id: "1", title: "API Security Penetration Test", budget: 2100, client: "SafeVault", dur: "7 Days", img: "https://i.pravatar.cc/150?u=safe", type: "Security", status: "Active" },
    { id: "2", title: "Python Scripts for Data Analysis", budget: 110, client: "BioTech Lab", dur: "5 Days", img: "https://i.pravatar.cc/150?u=lab", type: "Academic", status: "Active" },
    { id: "3", title: "Smart Contract Audit (Solidity)", budget: 2200, client: "Nexus Protocol", dur: "5 Days", img: "https://i.pravatar.cc/150?u=crypto", type: "Web3", status: "Active" },
    { id: "4", title: "Next.js Speed & SEO Optimization", budget: 800, client: "E-Com Sol", dur: "4 Days", img: "https://i.pravatar.cc/150?u=ecom", type: "Startup", status: "Active" },
  ], []);

  const corporateGigs = useMemo(() => [
    { id: "c1", title: "Tesla: Remote Fleet Data Analyst", salary: "$8k/mo", domain: "tesla.com", company: "Tesla" },
    { id: "c2", title: "Amazon: Cloud Support Engineer", salary: "$9k/mo", domain: "amazon.com", company: "Amazon" },
    { id: "c3", title: "Stripe: Payment Integrity Analyst", salary: "$11k/mo", domain: "stripe.com", company: "Stripe" },
  ], []);

  const navItems = [
    { id: "home", icon: <Home size={16} />, label: "Home" },
    { id: "tasks", icon: <Briefcase size={16} />, label: "Gigs" },
    { id: "contracts", icon: <FileText size={16} />, label: "Work" },
    { id: "messages", icon: <MessageSquare size={16} />, label: "Chats" },
    { id: "earnings", icon: <Wallet size={16} />, label: "Vault" },
    { id: "analytics", icon: <BarChart3 size={16} />, label: "Stats" },
    { id: "support", icon: <LifeBuoy size={16} />, label: "Help" },
    { id: "account", icon: <User size={16} />, label: "Me" },
  ];

  return (
    <div className="min-h-screen bg-[#010812] text-white font-sans pb-28 overflow-x-hidden text-sm">
      <ToastContainer toasts={toasts} remove={id => setToasts(t => t.filter(x => x.id !== id))} />

      <div className="max-w-5xl mx-auto pt-4 px-4 relative z-10 text-left">
        <AnimatePresence mode="wait">

          {/* 🏠 HOME */}
          {activeTab === "home" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <header className="relative flex justify-between items-center bg-white/4 backdrop-blur-2xl p-6 rounded-[22px] border border-white/8 shadow-2xl">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#00f2ff]" />
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-500 italic">Uplink Operator</p>
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter">{user?.firstName || "Operator"}</h2>
                </div>
                <div className="bg-black/40 px-4 py-2 rounded-xl border border-[#00f2ff]/20 flex items-center gap-2">
                   <Zap size={16} className="text-[#00f2ff] fill-[#00f2ff]" />
                   <span className="text-sm font-black text-white">{huBalance} HU</span>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GlassCard className="p-6 space-y-4" accent>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#00f2ff]/10 rounded-xl flex items-center justify-center text-[#00f2ff] shadow-inner"><ShieldCheck size={20}/></div>
                    <h4 className="text-xs font-black uppercase tracking-widest">Why Refill?</h4>
                  </div>
                  <p className="text-[9px] text-gray-400 leading-relaxed italic">Fortune 500 companies like Tesla require Handshake Units (HU) to process handshakes. This proves you are a verified professional worker and not a bot, putting your uplink first in line.</p>
                  <button onClick={() => { setPaymentStep("packages"); setShowRefillModal(true); }} className="w-full py-3.5 bg-white text-black font-black rounded-xl text-[9px] uppercase tracking-widest shadow-glow active:scale-95 transition-all italic">Refill Uplink Now</button>
                </GlassCard>
                <div className="grid grid-cols-2 gap-3">
                  <StatCard label="Success" value="0%" icon={<CheckCircle size={15}/>} color="#34d399" />
                  <StatCard label="Uptime" value="99.9%" icon={<Wifi size={15}/>} color="#00f2ff" />
                  <StatCard label="Signals" value={marketplaceGigs.length + corporateGigs.length} icon={<Target size={15}/>} color="#a78bfa" />
                  <StatCard label="Trust" value="Beta" icon={<Shield size={15}/>} color="#f59e0b" />
                </div>
              </div>
            </motion.div>
          )}

          {/* 💼 GIGS */}
          {activeTab === "tasks" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-xl font-black uppercase tracking-tighter">Mission <span className="text-[#00f2ff]">Feed</span></h3>
                <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                   <PulseDot color="#10b981" size={6} />
                   <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
                </div>
              </div>

              <div className="bg-black/40 border border-white/5 py-2.5 rounded-xl overflow-hidden relative shadow-inner">
                <motion.div animate={{ x: [0, -600] }} transition={{ repeat: Infinity, duration: 30, ease: "linear" }} className="whitespace-nowrap flex gap-12 items-center">
                   {["Emmanuel refilled 1200 HU", "David Nzalu earned $850", "John Mututho applied for Tesla", "Alice Vaati withdrawn KES 14,000", "Network: Global Uplink Secure"].map((t, i) => (
                     <span key={i} className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2"><PulseDot color="#00f2ff" size={4}/> {t}</span>
                   ))}
                </motion.div>
              </div>

              <div className="bg-white/5 p-1 rounded-2xl flex border border-white/10 max-w-sm mx-auto w-full">
                <button onClick={() => setGigSlide("internal")} className={`flex-1 py-3 rounded-xl text-[8px] font-black uppercase transition-all ${gigSlide === "internal" ? "bg-[#00f2ff] text-black shadow-glow" : "text-gray-500"}`}>Marketplace</button>
                <button onClick={() => setGigSlide("corporate")} className={`flex-1 py-3 rounded-xl text-[8px] font-black uppercase transition-all ${gigSlide === "corporate" ? "bg-white text-black shadow-glow" : "text-gray-500"}`}>Corporate</button>
              </div>

              {gigSlide === "internal" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {marketplaceGigs.map((g, idx) => (
                    <div key={g.id} className={`relative p-5 rounded-[22px] bg-white/4 border border-white/8 transition-all ${idx > 2 ? "blur-[3px] pointer-events-none opacity-40" : "hover:border-white/20 shadow-xl"}`}>
                       {idx > 2 && <div className="absolute inset-0 flex items-center justify-center z-20"><div className="bg-black/80 px-4 py-2 rounded-xl border border-[#00f2ff]/40 text-center"><Lock size={14} className="mx-auto mb-1 text-[#00f2ff]"/><p className="text-[7px] font-black text-white uppercase tracking-widest leading-none">Refill Uplink</p></div></div>}
                       <div className="flex justify-between items-start mb-4">
                          <img src={g.img} className="w-10 h-10 rounded-xl border border-white/10" alt="" />
                          <span className="text-[7px] font-black text-[#00f2ff] bg-[#00f2ff]/10 px-2.5 py-1 rounded-full border border-[#00f2ff]/20 uppercase">10 HU</span>
                       </div>
                       <h4 className="text-[11px] font-black uppercase text-white mb-4 line-clamp-2 h-8 leading-tight">{g.title}</h4>
                       <div className="flex justify-between items-center pt-3 border-t border-white/5">
                          <p className="text-base font-black text-[#00f2ff] tracking-tighter">${g.budget}</p>
                          <RippleButton onClick={() => handleApplyAction(10)} className="px-4 py-2 bg-[#00f2ff] text-black font-black rounded-lg text-[8px] uppercase shadow-glow">Apply</RippleButton>
                       </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-5 bg-indigo-500/10 border border-indigo-500/20 rounded-[22px] flex items-start gap-4">
                     <ShieldAlert size={20} className="text-indigo-400 mt-1 shrink-0" />
                     <p className="text-[9px] text-gray-400 italic leading-relaxed">Corporate handshakes require Tier 1 authorization. Refill units to unlock high-budget applications for global roles.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {corporateGigs.map(c => (
                       <div key={c.id} className="p-6 rounded-[25px] bg-black/40 border border-white/10 hover:border-white/20 transition-all shadow-2xl relative overflow-hidden">
                          <div className="flex items-center gap-5 mb-5 text-left">
                             <CompanyLogo name={c.company} domain={c.domain} size={52} />
                             <div className="min-w-0">
                                <h4 className="text-xs font-black uppercase text-white leading-tight truncate">{c.title}</h4>
                                <p className="text-[10px] font-bold text-[#00f2ff] mt-0.5">{c.salary}</p>
                             </div>
                          </div>
                          <RippleButton onClick={() => handleApplyAction(50)} className="w-full py-3.5 bg-white text-black font-black rounded-xl text-[9px] uppercase italic flex items-center justify-center gap-2 active:scale-95 shadow-xl">
                             Send Handshake (50 HU) <ArrowUpRight size={14}/>
                          </RippleButton>
                       </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ═══════════════════════ VAULT ═══════════════════════ */}
          {activeTab === "earnings" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pt-2 text-left">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-8 rounded-[35px] border border-white/10 bg-linear-to-br from-[#00f2ff]/20 to-transparent shadow-3xl text-left">
                     <Zap size={24} className="text-[#00f2ff] mb-6" fill="#00f2ff"/>
                     <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 italic">Uplink Power</p>
                     <h4 className="text-5xl font-black italic text-white mb-2">{huBalance} <span className="text-[#00f2ff]">HU</span></h4>
                     <p className="text-[8px] font-bold text-gray-600 uppercase">Available Units</p>
                  </div>
                  <div className="p-8 rounded-[35px] border border-white/10 bg-linear-to-br from-emerald-500/10 to-transparent shadow-3xl text-left relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl rounded-full" />
                     <DollarSign size={24} className="text-emerald-400 mb-6" />
                     <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 italic">Mission Earnings</p>
                     <h4 className="text-5xl font-black italic text-white mb-4">${cashBalance.toFixed(2)}</h4>
                     <RippleButton onClick={() => addToast("Protocol Error: Account balance under minimum threshold ($50.00)", "error")} 
                       className="w-full py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 shadow-2xl transition-all italic">
                        Withdraw <ArrowUpRight size={14}/>
                     </RippleButton>
                  </div>
               </div>

               <div className="max-w-sm mx-auto w-full">
                 <GlassCard className="p-5 shadow-2xl">
                    <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                       <Calculator size={14} className="text-[#00f2ff]"/>
                       <h4 className="text-[9px] font-black uppercase italic tracking-widest text-white">Uplink Value Converter</h4>
                    </div>
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                       <div className="bg-black/40 p-3 rounded-xl border border-white/5 text-left">
                          <p className="text-[7px] font-black text-gray-600 uppercase mb-1">Units (HU)</p>
                          <input type="number" value={calcHU} onChange={(e) => setCalcHU(e.target.value)} 
                            className="bg-transparent w-full text-lg font-black outline-none text-white tracking-tighter" />
                       </div>
                       <RefreshCw size={14} className="text-gray-700 animate-spin" style={{ animationDuration: '6s' }}/>
                       <div className="bg-black/40 p-3 rounded-xl border border-white/5 text-right">
                          <p className="text-[7px] font-black text-gray-600 uppercase mb-1">Estimated KES</p>
                          <p className="text-lg font-black text-emerald-400 italic leading-none">Ksh {calcKES.toLocaleString()}</p>
                       </div>
                    </div>
                 </GlassCard>
               </div>
            </motion.div>
          )}

          {/* Rest of the Tabs (Work, Stats, Help, Me, Chats) */}
          {activeTab === "contracts" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-10 px-4 text-center">
               <div className="p-16 bg-white/4 border border-red-500/20 rounded-[50px] shadow-3xl text-center">
                  <ShieldAlert size={55} className="mx-auto text-red-500 mb-6" />
                  <h3 className="text-xl font-black uppercase italic text-white mb-2">History Locked</h3>
                  <p className="text-gray-400 text-[11px] mb-8 max-w-xs mx-auto italic leading-relaxed text-center">Verify your uplink to view your work history and mission earnings log.</p>
                  {!isVerified && <button onClick={() => { setPaymentStep("packages"); setShowRefillModal(true); }} className="px-10 py-4 bg-red-600 text-white font-black rounded-2xl text-[10px] uppercase shadow-lg transition-all active:scale-95 italic">Verify Uplink</button>}
               </div>
            </motion.div>
          )}

          {activeTab === "analytics" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                <StatCard label="Success" value="0%" icon={<CheckCircle2 size={16}/>} color="#34d399" />
                <StatCard label="Missions" value="0" icon={<Briefcase size={16}/>} />
                <StatCard label="Paid" value="$0.00" icon={<DollarSign size={16}/>} color="#f59e0b" />
                <StatCard label="Network" value="Active" icon={<Wifi size={16}/>} color="#00f2ff" />
            </motion.div>
          )}

          {activeTab === "support" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-4 max-w-xl mx-auto">
               <GlassCard className="p-8 space-y-6">
                  <div className="text-center"><h3 className="text-xl font-black uppercase italic text-[#00f2ff]">Help Center</h3><p className="text-[8px] font-bold text-gray-600 uppercase italic">Uplink Support Active</p></div>
                  <div className="space-y-4 text-left">
                     <div className="p-5 bg-black/40 rounded-2xl border border-white/5 cursor-pointer hover:border-[#00f2ff]/30 transition-all text-left" onClick={() => window.location.href="mailto:support@nexusgigs.me"}>
                        <p className="text-[8px] font-black text-gray-600 uppercase mb-1">Email Terminal</p><p className="text-xs font-black italic text-white underline">support@nexusgigs.me</p>
                     </div>
                     <div className="p-5 bg-black/40 rounded-2xl border border-white/5 text-left">
                        <p className="text-[8px] font-black text-gray-600 uppercase mb-1">Official WhatsApp</p><p className="text-xs font-bold text-[#00f2ff]">+254 113 637325</p>
                     </div>
                  </div>
               </GlassCard>
            </motion.div>
          )}

          {activeTab === "account" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto space-y-6 pb-20">
              <div className="p-10 text-center bg-white/5 backdrop-blur-3xl rounded-[50px] border border-white/10 shadow-3xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#00f2ff] shadow-glow" />
                <div className="relative w-32 h-32 mx-auto mb-8 group">
                   <div className="absolute inset-0 bg-[#00f2ff]/20 blur-xl rounded-full animate-pulse" />
                   <div className="relative w-full h-full bg-black/60 rounded-[40px] border-2 border-white/10 flex items-center justify-center overflow-hidden shadow-inner">
                      {user?.imageUrl ? <img src={user.imageUrl} className="w-full h-full object-cover shadow-2xl" alt="" /> : <UserCircle size={65} className="text-gray-500" />}
                      <div className="absolute bottom-2 right-2 p-2 bg-[#00f2ff] rounded-2xl text-black shadow-glow"><BadgeCheck size={18}/></div>
                   </div>
                </div>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-2">{user?.fullName || "Operator"}</h3>
                <div className="flex justify-center gap-4 mb-10">
                   <div className="px-4 py-2 bg-black/40 rounded-full border border-white/5 flex items-center gap-2"><PulseDot color="#10b981" size={6} /><span className="text-[9px] font-black uppercase text-emerald-500 italic">Sync Active</span></div>
                   <div className="px-4 py-2 bg-black/40 rounded-full border border-white/5 text-[#00f2ff] shadow-inner"><span className="text-[9px] font-black uppercase italic">{isVerified ? "Tier 1 Elite" : "Tier 0 Beta"}</span></div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                   <button onClick={() => setActiveTab('earnings')} className="py-5 bg-white text-black rounded-[25px] font-black uppercase text-[11px] shadow-2xl flex items-center justify-center gap-2 active:scale-95 transition-all italic">Vault Hub <ArrowUpRight size={15}/></button>
                   <button className="py-5 bg-white/5 border border-white/10 text-white rounded-[25px] font-black uppercase text-[11px] flex items-center justify-center gap-2 active:scale-95 transition-all italic">Settings <Settings size={15}/></button>
                </div>
                <SignOutButton><button className="w-full py-5 bg-red-500/10 border border-red-500/20 text-red-500 font-black italic rounded-[25px] uppercase text-[10px] hover:bg-red-500/20 transition-all">Terminate Session</button></SignOutButton>
              </div>
            </motion.div>
          )}

          {activeTab === "messages" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-left">
               <h3 className="text-xl font-bold uppercase px-2 text-left">System <span className="text-[#00f2ff]">Log</span></h3>
               {[
                 { t: "Uplink HQ", m: "Welcome to the Nexus network. To keep high-budget global clients safe, you must refill your Handshake Units (HU). Once refilled, you gain full access to apply for all missions immediately.", time: "Just now", unread: true },
                 { t: "Security Bot", m: "Uplink encryption is active. We noticed your power is low (5 HU). Missions require at least 10 HU. Pick a refill package to establish a permanent connection with the vault.", time: "12m ago", unread: true },
                 { t: "System Relay", m: "Exchange rates updated: $1.00 USD is currently trading at KES 130.00. Use the Vault Calculator for real-time node liquidity checks before withdrawal.", time: "2h ago", unread: false },
               ].map((msg, i) => (
                 <div key={i} onClick={() => setExpandedMsg(expandedMsg === i ? null : i)} className={`p-6 rounded-[30px] border cursor-pointer transition-all ${msg.unread ? "bg-[#00f2ff]/5 border-[#00f2ff]/20 shadow-glow" : "bg-white/3 border-white/5"}`}>
                    <div className="flex gap-4 items-center">
                       <div className="p-3 bg-black/40 rounded-xl text-[#00f2ff] shadow-inner"><MessageSquare size={16}/></div>
                       <div className="flex-1 text-left">
                          <div className="flex justify-between items-center mb-1">
                             <h4 className="text-[10px] font-black uppercase italic text-white leading-none">{msg.t}</h4>
                             <span className="text-[7px] text-gray-500 font-bold uppercase">{msg.time}</span>
                          </div>
                          <p className={`text-[10px] text-gray-400 leading-relaxed ${expandedMsg === i ? "" : "line-clamp-1"}`}>{msg.m}</p>
                       </div>
                       <ChevronDown size={14} className={`text-gray-600 transition-transform ${expandedMsg === i ? "rotate-180" : ""}`}/>
                    </div>
                 </div>
               ))}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* --- SLIM NAV BAR --- */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-100 w-[94%] max-w-xl">
        <div className="h-16 bg-black/85 backdrop-blur-3xl border border-white/10 rounded-full flex items-center justify-around px-2 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center gap-0.5 transition-all duration-300 ${activeTab === item.id ? 'text-[#00f2ff] scale-110' : 'text-gray-600 hover:text-white'}`}>
              <div className={activeTab === item.id ? "bg-[#00f2ff]/10 p-1.5 rounded-xl border border-[#00f2ff]/20 shadow-glow" : ""}>{item.icon}</div>
              <span className="text-[6px] font-black uppercase tracking-tighter opacity-70 leading-none">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* --- REFILL MODAL (Logic Fixed) --- */}
      <AnimatePresence>
        {showRefillModal && (
          <div className="fixed inset-0 z-600 flex items-center justify-center p-6 backdrop-blur-md bg-black/70">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0" onClick={() => !isPaying && setShowRefillModal(false)} />
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="relative w-full max-w-sm bg-[#080d19] border border-white/10 rounded-[40px] p-8 shadow-3xl overflow-hidden text-left">
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-[#00f2ff] to-transparent shadow-glow" />
              
              {paymentStep === "packages" ? (
                <div className="space-y-6">
                   <div className="flex justify-between items-start">
                      <div className="text-left"><h3 className="text-xl font-black italic uppercase tracking-tight text-white leading-none">Refill Uplink</h3><p className="text-[10px] text-gray-500 uppercase mt-1 italic leading-none">Send handshake uplink</p></div>
                      <button className="p-2 bg-white/5 rounded-xl border border-white/10 text-gray-500 active:scale-90" onClick={() => setShowRefillModal(false)}><X size={18}/></button>
                   </div>
                   <div className="space-y-2.5 max-h-87.5 overflow-y-auto no-scrollbar pr-1">
                      <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl mb-2 flex items-center gap-4 text-left shadow-inner">
                         <Zap size={16} className="text-red-500 shrink-0"/>
                         <p className="text-[9px] text-red-400 font-bold uppercase tracking-widest italic leading-tight">Low Power: {huBalance} HU available. 10 HU minimum needed.</p>
                      </div>
                      {uplinkPackages.map(pkg => (
                        <RippleButton key={pkg.id} onClick={() => setPaymentStep("choice")}
                          className={`w-full p-5 rounded-[22px] border transition-all relative overflow-hidden group flex items-center justify-between shadow-xl ${pkg.hot ? "bg-[#00f2ff]/5 border-[#00f2ff]/40 shadow-glow" : "bg-white/3 border-white/8 hover:bg-white/5"}`}>
                           <div className="text-left z-10"><h5 className="text-xs font-black uppercase text-white leading-none mb-1">{pkg.name}</h5><p className="text-[8px] font-bold text-gray-500 uppercase tracking-tight leading-tight">{pkg.desc}</p></div>
                           <div className="text-right z-10"><p className="text-sm font-black text-white italic">{pkg.hu} HU</p><p className="text-[10px] font-black text-[#00f2ff]">KES {(pkg.price * 130).toLocaleString()}</p></div>
                        </RippleButton>
                      ))}
                   </div>
                   <div className="p-4 bg-white/3 rounded-2xl border border-white/5 flex items-center gap-3 cursor-pointer text-left" onClick={() => setAgreedToTerms(!agreedToTerms)}>
                      <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${agreedToTerms ? "bg-[#00f2ff] border-[#00f2ff]" : "border-white/20"} text-left`}>{agreedToTerms && <Check size={12} className="text-black font-black"/>}</div>
                      <p className="text-[9px] font-black text-gray-500 uppercase leading-tight italic">Agree to refill units & follow rules.</p>
                   </div>
                </div>
              ) : (
                <div className="space-y-6 text-left">
                   <div className="flex items-center gap-3 text-left">
                      <button onClick={() => setPaymentStep("packages")} className="p-2 bg-white/5 rounded-lg text-gray-500 active:scale-90"><ChevronDown size={14} className="rotate-90"/></button>
                      <h4 className="text-xs font-black uppercase text-white italic text-left">Select Gateway</h4>
                   </div>
                   <div className="space-y-3 text-left">
                      <RippleButton onClick={() => handleSecurePayment("M-PESA")} className="w-full p-6 bg-emerald-600 text-white rounded-[22px] flex items-center justify-between shadow-2xl active:scale-95 transition-all italic text-left">
                         <div className="flex items-center gap-4 text-left"><div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-black text-lg">M</div><div className="text-left"><p className="text-sm font-black italic">M-Pesa</p><p className="text-[8px] font-bold uppercase opacity-70 tracking-widest leading-none">Instant Settlement</p></div></div>
                         <ChevronRight size={18}/>
                      </RippleButton>
                      <RippleButton onClick={() => handleSecurePayment("CARD")} className="w-full p-6 bg-indigo-600 text-white rounded-[22px] flex items-center justify-between shadow-2xl active:scale-95 transition-all italic text-left">
                         <div className="flex items-center gap-4 text-left"><Landmark size={24}/><div className="text-left"><p className="text-sm font-black italic text-left leading-none">Bank / Card</p><p className="text-[8px] font-bold uppercase opacity-70 tracking-widest leading-none">Visa · Mastercard</p></div></div>
                         <ChevronRight size={18}/>
                      </RippleButton>
                   </div>
                   <button onClick={() => setPaymentStep("packages")} className="w-full text-center text-[9px] font-black text-gray-600 uppercase tracking-widest italic pt-2">Return to Packs</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .shadow-glow { box-shadow: 0 0 20px rgba(0, 242, 255, 0.4); }
      `}</style>
    </div>
  );
};