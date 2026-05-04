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
  Activity, Landmark, Bitcoin, HelpCircle, X, CheckCircle, Box,
  UserCircle, DollarSign, ArrowUpRight, Shield,
  Send, Copy, Check, Sparkles, Building2,
  ArrowRight, RefreshCw, Eye, EyeOff, Search,
  BellRing, Flame, BadgeCheck, Wifi, Calculator, Settings,
  TrendingUp, Target, Star, Globe, ChevronDown,
  LifeBuoy,
} from "lucide-react";

// ─────────────────────────────────────────────
// TYPES & INTERFACES
// ─────────────────────────────────────────────
interface Toast {
  id: number;
  msg: string;
  type: "success" | "error" | "info";
}

interface PrimitiveProps {
  children?: React.ReactNode;
  className?: string;
  accent?: boolean;
  glow?: boolean;
  onClick?: (e: any) => void;
  disabled?: boolean;
}

// ─────────────────────────────────────────────
// ATOMIC COMPONENTS
// ─────────────────────────────────────────────

const PulseDot = ({ color = "#00f5d4", size = 7 }: { color?: string; size?: number }) => (
  <span className="relative inline-flex" style={{ width: size, height: size }}>
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-40" style={{ backgroundColor: color }} />
    <span className="relative inline-flex rounded-full" style={{ width: size, height: size, backgroundColor: color }} />
  </span>
);

const GlassCard = ({ children, className = "", accent = false, glow = false }: PrimitiveProps) => (
  <div className={`relative bg-white/3 backdrop-blur-2xl border border-white/8 rounded-[28px] transition-all duration-300 ${accent ? "border-l-[3px] border-l-[#00f5d4]" : ""} ${glow ? "shadow-[0_0_40px_rgba(0,245,212,0.08)]" : ""} ${className}`}>
    {children}
  </div>
);

const StatCard = ({ label, value, icon, color = "#00f5d4" }: { label: string; value: string | number; icon: React.ReactNode; color?: string }) => (
  <GlassCard className="p-4 text-center">
    <div className="flex justify-center mb-1.5" style={{ color }}>{icon}</div>
    <p className="text-[11px] font-black tracking-tighter text-white leading-none">{value}</p>
    <p className="text-[7px] font-bold text-white/30 uppercase tracking-widest mt-1.5 leading-none">{label}</p>
  </GlassCard>
);

const CompanyLogo = ({ name, domain, size = 44 }: { name: string; domain: string; size?: number }) => {
  const [src, setSrc] = useState(`https://logo.clearbit.com/${domain}`);
  return (
    <div style={{ width: size, height: size }} className="rounded-xl overflow-hidden bg-white border border-white/10 flex items-center justify-center shrink-0 shadow-lg">
      <img src={src} alt={name} className="w-full h-full object-contain p-1.5" onError={() => setSrc(`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0d1117&color=00f5d4&bold=true`)} />
    </div>
  );
};

const RippleButton = ({ children, onClick, className = "", disabled = false }: PrimitiveProps) => {
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
    <button onClick={handleClick} disabled={disabled} className={`relative overflow-hidden select-none active:scale-[0.97] transition-all disabled:opacity-50 ${className}`}>
      {children}
      {ripples.map((r) => (
        <span key={r.id} className="absolute rounded-full bg-white/20 animate-ping pointer-events-none" style={{ left: r.x - 14, top: r.y - 14, width: 28, height: 28 }} />
      ))}
    </button>
  );
};

// ─────────────────────────────────────────────
// MAIN VIEW COMPONENT
// ─────────────────────────────────────────────

export const FreelancerView = ({ jobs, userMetadata }: { jobs: any[]; userMetadata: any }) => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("home");
  const [gigMode, setGigMode] = useState<"marketplace" | "corporate">("marketplace");
  const [currency, setCurrency] = useState<"USD" | "KES">("USD");
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Logic State
  const [huBalance, setHuBalance] = useState(5);
  const [cashBalance] = useState(0.0);
  const isVerified = userMetadata?.status === "Verified";
  const [expandedMsg, setExpandedMsg] = useState<number | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState<"packages" | "choice" | "mpesa" | "binance">("packages");
  const [selectedPack, setSelectedPack] = useState<any>(null);
  const [agreed, setAgreed] = useState(false);
  const [mpesaNum, setMpesaNum] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [copied, setCopied] = useState(false);

  // Constants
  const RATE = 130;
  const fmt = (usd: number) => currency === "USD" ? `$${usd.toFixed(2)}` : `KES ${(usd * RATE).toLocaleString()}`;

  // Fix for the error in image_d2f418.jpg
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

  const uplinkPackages = [
    { id: 1, name: "Starter", price: 3, hu: 150, desc: "Small gigs uplink." },
    { id: 2, name: "Basic", price: 6, hu: 400, desc: "Extended reach tasks." },
    { id: 3, name: "Pro Uplink", price: 10, hu: 1200, desc: "Global Corporate access.", hot: true },
    { id: 4, name: "Elite", price: 18, hu: 2500, desc: "Priority Handshakes." },
    { id: 5, name: "Alpha", price: 30, hu: 5000, desc: "Ultimate worker power." },
  ];

  const addToast = (msg: string, type: Toast["type"] = "info") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  };

  const openRefill = () => {
    setModalStep("packages");
    setShowModal(true);
  };

  const handleApply = (cost: number) => {
    if (huBalance >= cost) {
      setHuBalance((p) => p - cost);
      addToast(`Transmission Successful! −${cost} HU`, "success");
    } else {
      openRefill();
    }
  };

  const handlePay = async (method: "CARD" | "MPESA") => {
    if (!agreed) return addToast("Agree to network rules first.", "info");
    if (!selectedPack) return addToast("Select a package.", "error");
    setIsPaying(true);
    try {
      if (method === "CARD") {
        const res = await fetch("/api/paystack", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: selectedPack.price, currency: "USD", email: user?.primaryEmailAddress?.emailAddress }),
        });
        const data = await res.json();
        if (data?.data?.authorization_url) window.location.href = data.data.authorization_url;
      } else {
        const clean = mpesaNum.replace(/\D/g, "");
        const res = await fetch("/api/intasend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: selectedPack.price * RATE, phone: clean, email: user?.primaryEmailAddress?.emailAddress }),
        });
        if (res.ok) { addToast("Check phone for STK Prompt", "success"); setShowModal(false); }
      }
    } catch { addToast("System Error", "error"); } finally { setIsPaying(false); }
  };

  const [calcHU, setCalcHU] = useState("1200");
  const calcResult = Math.round(parseFloat(calcHU || "0") * 1.083);

  return (
    <div className="min-h-screen text-white font-sans pb-28 overflow-x-hidden bg-[#02060c]">
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-125 h-125 bg-[#00f5d4] blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-125 h-125 bg-blue-600 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto pt-6 px-4 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 text-left">
              <header className="relative flex justify-between items-center p-6 rounded-4xl bg-white/4 border border-white/8 shadow-2xl backdrop-blur-3xl overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#00f5d4]" />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 italic">Global Hub</p>
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none">{user?.firstName || "Operator"}</h2>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <div className="bg-[#00f5d4]/10 border border-[#00f5d4]/20 px-4 py-2 rounded-xl flex items-center gap-2">
                      <Zap size={15} className="text-[#00f5d4] fill-[#00f5d4]" />
                      <span className="text-sm font-black">{huBalance} HU</span>
                   </div>
                   <button onClick={() => setCurrency(c => c === "USD" ? "KES" : "USD")} className="text-[7px] font-black uppercase bg-white/5 border border-white/10 px-2 py-1 rounded-lg text-white/40 italic">Currency: {currency}</button>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GlassCard className="p-7 space-y-4" accent glow>
                  <div className="flex items-center gap-3"><div className="w-12 h-12 rounded-2xl bg-[#00f5d4]/10 flex items-center justify-center text-[#00f5d4]"><ShieldCheck size={24}/></div><h4 className="text-sm font-black uppercase tracking-widest leading-none">Uplink Status</h4></div>
                  <p className="text-[10px] text-white/40 leading-relaxed italic">Fortune 500 handshakes require Units (HU) to process signals. This verification prioritizes your profile over automated bots.</p>
                  <button onClick={openRefill} className="w-full py-4 bg-white text-black font-black rounded-2xl text-[9px] uppercase tracking-widest shadow-glow active:scale-95 transition-all">Refill Uplink</button>
                </GlassCard>
                <div className="grid grid-cols-2 gap-3">
                  <StatCard label="Success" value="0%" icon={<CheckCircle size={14}/>} />
                  <StatCard label="Network" value="Active" icon={<Wifi size={14}/>} color="#00f5d4" />
                  <StatCard label="Trust" value="Beta" icon={<Shield size={14}/>} color="#fb923c" />
                  <StatCard label="Live Jobs" value={jobs.length} icon={<Target size={14}/>} color="#a78bfa" />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "tasks" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-left">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black uppercase tracking-tighter italic">Mission <span className="text-[#00f5d4]">Slide</span></h3>
                <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
                  <PulseDot color="#10b981" size={5}/>
                  <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Connected</span>
                </div>
              </div>

              <div className="flex gap-1 p-1 bg-white/5 rounded-2xl w-fit mx-auto border border-white/5">
                {["marketplace", "corporate"].map((m) => (
                  <button key={m} onClick={() => setGigMode(m as any)} className={`px-8 py-3 rounded-xl text-[9px] font-black uppercase transition-all ${gigMode === m ? "bg-[#00f2ff] text-black shadow-lg shadow-[#00f2ff]/20" : "text-white/30 hover:text-white/50"}`}>{m}</button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {jobs.map((g: any, idx) => {
                  const isLocked = idx > 1 && huBalance < 10;
                  return (
                    <div key={g.id} className={`relative p-6 rounded-[35px] bg-white/3 border border-white/10 transition-all ${isLocked ? "blur-md pointer-events-none opacity-40" : "hover:border-white/20 shadow-2xl"}`}>
                      {isLocked && <div className="absolute inset-0 z-20 flex items-center justify-center"><div className="bg-black/80 px-5 py-3 rounded-2xl border border-[#00f2ff]/30 text-center shadow-2xl"><Lock size={18} className="mx-auto mb-1 text-[#00f2ff]" /><p className="text-[7px] font-black text-white uppercase tracking-widest">Refill HU</p></div></div>}
                      <div className="flex justify-between items-start mb-5">
                        <CompanyLogo name={g.client || g.company} domain={g.domain || "google.com"} size={48} />
                        <span className="text-[8px] font-black text-[#00f2ff] bg-[#00f2ff]/10 px-3 py-1 rounded-lg border border-[#00f2ff]/20 uppercase">10 HU</span>
                      </div>
                      <h4 className="text-[12px] font-black uppercase text-white mb-2 leading-tight h-10 line-clamp-2">{g.title}</h4>
                      <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-6">{g.client || g.company}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <p className="text-lg font-black text-white">{fmt(g.budget || g.salary)}</p>
                        <RippleButton onClick={() => handleApply(10)} className="px-5 py-2.5 bg-[#00f5d4] text-black font-black rounded-xl text-[9px] uppercase tracking-widest italic shadow-glow">Apply</RippleButton>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === "earnings" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pt-2 text-left max-w-2xl mx-auto">
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 rounded-[35px] border border-white/10 bg-linear-to-br from-[#00f2ff]/20 to-transparent shadow-3xl text-left">
                     <Zap size={20} className="text-[#00f2ff] mb-4" fill="#00f2ff"/>
                     <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 italic">Uplink Power</p>
                     <h4 className="text-4xl font-black italic text-white leading-none">{huBalance} <span className="text-xs text-[#00f2ff]">HU</span></h4>
                     <p className="text-[7px] font-bold text-gray-600 uppercase mt-1">Available Units</p>
                  </div>
                  <div className="p-6 rounded-[35px] border border-white/10 bg-linear-to-br from-emerald-500/10 to-transparent shadow-3xl text-left relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 blur-3xl rounded-full" />
                     <DollarSign size={20} className="text-emerald-400 mb-4" />
                     <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 italic">Settlement</p>
                     <h4 className="text-4xl font-black italic text-white leading-none">{fmt(cashBalance)}</h4>
                     <button onClick={() => addToast("Under minimum threshold", "error")} className="text-[7px] font-black text-emerald-400 uppercase tracking-widest mt-2 underline italic decoration-emerald-500/50 underline-offset-4">Withdraw</button>
                  </div>
               </div>

               <GlassCard className="p-5 text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <Calculator size={14} className="text-[#00f2ff]"/>
                    <h4 className="text-[9px] font-black uppercase italic text-white/50 tracking-widest">Uplink Converter</h4>
                  </div>
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-left">
                    <div className="bg-black/30 p-3 rounded-2xl border border-white/5 text-left">
                      <p className="text-[6px] font-black text-white/20 uppercase mb-1">Units (HU)</p>
                      <input type="number" value={calcHU} onChange={(e) => setCalcHU(e.target.value)} className="bg-transparent w-full text-lg font-black outline-none text-white tracking-tighter" />
                    </div>
                    <RefreshCw size={14} className="text-white/10 animate-spin" />
                    <div className="bg-black/30 p-3 rounded-2xl border border-white/5 text-right">
                      <p className="text-[6px] font-black text-white/20 uppercase mb-1">Estimate</p>
                      <p className="text-lg font-black text-emerald-400 italic leading-none">Ksh {calcResult.toLocaleString()}</p>
                    </div>
                  </div>
               </GlassCard>
            </motion.div>
          )}

          {activeTab === "contracts" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-10 text-center">
               <div className="p-16 bg-white/4 border border-red-500/20 rounded-[50px] shadow-3xl text-center">
                  <ShieldAlert size={50} className="mx-auto text-red-500 mb-6" />
                  <h3 className="text-xl font-black uppercase italic text-white mb-2 leading-none">History Locked</h3>
                  <p className="text-gray-400 text-[10px] mb-8 max-w-xs mx-auto italic leading-relaxed text-center">Verify your uplink to view your work history and mission earnings log.</p>
                  <button onClick={openRefill} className="px-10 py-4 bg-red-600 text-white font-black rounded-2xl text-[10px] uppercase shadow-lg active:scale-95 italic">Initialize Protocol</button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- SLIM NAV BAR --- */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-100 w-[94%] max-w-xl">
        <div className="h-16 bg-black/85 backdrop-blur-3xl border border-white/10 rounded-full flex items-center justify-around px-2 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center gap-0.5 transition-all duration-300 ${activeTab === item.id ? 'text-[#00f2ff] scale-110' : 'text-white/20 hover:text-white'}`}>
              <div className={activeTab === item.id ? "bg-[#00f2ff]/10 p-1.5 rounded-xl border border-[#00f2ff]/20 shadow-glow" : "p-1.5"}>{item.icon}</div>
              <span className="text-[6px] font-black uppercase tracking-tighter opacity-70 leading-none">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* --- REFILL MODAL --- */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-600 flex items-center justify-center p-6 backdrop-blur-md bg-black/70">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0" onClick={() => !isPaying && setShowModal(false)} />
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="relative w-full max-w-sm bg-[#080d19] border border-white/10 rounded-[45px] p-8 shadow-3xl overflow-hidden text-left">
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-[#00f2ff] to-transparent shadow-glow" />
              {modalStep === "packages" ? (
                <div className="space-y-6">
                   <div className="flex justify-between items-start text-left">
                      <div className="text-left"><h3 className="text-xl font-black italic uppercase tracking-tight text-white leading-none">Uplink Refill</h3><p className="text-[10px] text-gray-500 uppercase mt-1 italic">Authorize mission units</p></div>
                      <button className="p-2 bg-white/5 rounded-xl border border-white/10 text-white/30 hover:text-white" onClick={() => setShowModal(false)}><X size={18}/></button>
                   </div>
                   <div className="space-y-2.5 max-h-87.5 overflow-y-auto no-scrollbar pr-1 text-left">
                      <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl mb-2 flex items-center gap-4 text-left shadow-inner">
                         <Zap size={16} className="text-red-500 shrink-0"/>
                         <p className="text-[9px] text-red-400 font-bold uppercase tracking-widest italic leading-tight text-left">Insufficient Power: {huBalance} HU available.</p>
                      </div>
                      {uplinkPackages.map(pkg => (
                        <RippleButton key={pkg.id} onClick={() => { setSelectedPack(pkg); setModalStep("choice"); }} className={`w-full p-5 rounded-[25px] border transition-all group flex items-center justify-between shadow-xl ${pkg.hot ? "bg-[#00f2ff]/5 border-[#00f2ff]/40 shadow-glow" : "bg-white/3 border-white/8 hover:bg-white/5"}`}>
                           <div className="text-left z-10"><h5 className="text-xs font-black uppercase text-white leading-none mb-1 text-left">{pkg.name}</h5><p className="text-[8px] font-bold text-gray-600 uppercase tracking-tight leading-tight text-left">{pkg.desc}</p></div>
                           <div className="text-right z-10"><p className="text-sm font-black text-white italic">{pkg.hu} HU</p><p className="text-[10px] font-black text-[#00f2ff]">KES {(pkg.price * RATE).toLocaleString()}</p></div>
                        </RippleButton>))}
                   </div>
                   <div className="p-4 bg-white/3 rounded-2xl border border-white/5 flex items-center gap-3 cursor-pointer text-left" onClick={() => setAgreed(!agreed)}>
                      <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${agreed ? "bg-[#00f2ff] border-[#00f2ff]" : "border-white/20"} text-left`}>{agreed && <Check size={12} className="text-black font-black"/>}</div>
                      <p className="text-[9px] font-black text-gray-500 uppercase leading-tight italic text-left">I agree to refill units.</p>
                   </div>
                </div>
              ) : modalStep === "choice" ? (
                <div className="space-y-6 text-left">
                   <div className="flex items-center gap-3 text-left">
                      <button onClick={() => setModalStep("packages")} className="p-2 bg-white/5 rounded-lg text-white/30 hover:text-white"><ChevronDown size={14} className="rotate-90"/></button>
                      <h4 className="text-xs font-black uppercase text-white italic leading-none text-left">Gateway Hub</h4>
                   </div>
                   <div className="space-y-3 text-left">
                      <RippleButton onClick={() => handlePay("CARD")} className="w-full p-6 bg-indigo-600 text-white rounded-[25px] flex items-center justify-between shadow-2xl italic">
                         <div className="flex items-center gap-4 text-left"><div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><Landmark size={24}/></div><div className="text-left"><p className="text-sm font-black italic">Bank / Card</p><p className="text-[9px] font-bold uppercase opacity-70 mt-1">Visa · Paystack</p></div></div>
                         <ChevronRight size={18}/>
                      </RippleButton>
                      <RippleButton onClick={() => setModalStep("binance")} className="w-full p-6 bg-amber-500 text-white rounded-[25px] flex items-center justify-between shadow-2xl italic text-left">
                         <div className="flex items-center gap-4 text-left"><div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-black"><Zap size={24} fill="white"/></div><div className="text-left"><p className="text-sm font-black italic">Binance USDT</p><p className="text-[9px] font-bold uppercase opacity-70 mt-1">TRC20 · Crypto</p></div></div>
                         <ChevronRight size={18}/>
                      </RippleButton>
                      <RippleButton onClick={() => setModalStep("mpesa")} className="w-full p-6 bg-emerald-600 text-white rounded-[25px] flex items-center justify-between shadow-2xl italic text-left">
                         <div className="flex items-center gap-4 text-left"><div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-black text-lg">M</div><div className="text-left"><p className="text-sm font-black italic">M-Pesa</p><p className="text-[9px] font-bold uppercase opacity-70 mt-1">Instant Push</p></div></div>
                         <ChevronRight size={18}/>
                      </RippleButton>
                   </div>
                </div>
              ) : modalStep === "binance" ? (
                <div className="space-y-6 text-left">
                  <div className="flex items-center gap-3 text-left"><button onClick={() => setModalStep("choice")} className="p-2 bg-white/5 rounded-xl text-white/30"><ChevronDown size={14} className="rotate-90"/></button><h4 className="text-xs font-black uppercase text-white italic">Binance Uplink</h4></div>
                  <div className="bg-white rounded-4xl p-4 mx-auto border-4 border-amber-500/20"><img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=TFWxe4TFcjUNgPJVgf5iXrMsw1oe4gDv9X" alt="QR" className="w-32 h-32 mx-auto" /></div>
                  <div className="bg-black/40 p-4 rounded-3xl border border-white/5 flex justify-between items-center text-xs font-black"><div><p className="text-[7px] text-gray-600 uppercase italic leading-none mb-1">Total</p><p>${selectedPack?.price}.00 USDT</p></div><div><p className="text-[7px] text-gray-600 uppercase italic leading-none mb-1">Network</p><p className="text-amber-500 tracking-widest">TRC20</p></div></div>
                  <div className="space-y-2 text-left"><p className="text-[8px] font-black text-gray-600 uppercase tracking-widest italic ml-1">Uplink Address</p><div className="flex gap-2 text-left"><div className="flex-1 bg-white/3 border border-white/5 rounded-xl p-3 text-[8px] font-mono text-gray-400 truncate text-left">TFWxe4TFcjUNgPJVgf5iXrMsw1oe4gDv9X</div><button onClick={() => { navigator.clipboard.writeText("TFWxe4TFcjUNgPJVgf5iXrMsw1oe4gDv9X"); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="bg-white/5 border border-white/5 p-3 rounded-xl">{copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} className="text-gray-500" />}</button></div></div>
                  <RippleButton onClick={() => { addToast("Terminal signal sent.", "success"); setShowModal(false); }} className="w-full py-4 bg-[#00f2ff] text-black font-black rounded-[20px] uppercase text-[10px] shadow-glow transition-all">I Have Paid</RippleButton>
                </div>
              ) : (
                <div className="space-y-6 text-center">
                   <div className="flex items-center gap-3 text-left"><button onClick={() => setModalStep("choice")} className="p-2 bg-white/5 rounded-lg text-white/30"><ChevronDown size={14} className="rotate-90"/></button><h4 className="text-xs font-black uppercase text-white italic leading-none text-left">M-Pesa Gateway</h4></div>
                   <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-[30px] text-left"><p className="text-[10px] font-black text-emerald-500 uppercase italic text-left tracking-widest">Fee: KES {(selectedPack?.price * RATE).toLocaleString()}</p></div>
                   <div className="space-y-2 text-left"><p className="text-[8px] font-black text-gray-600 uppercase tracking-widest italic leading-none ml-1 text-left">Number</p><input value={mpesaNum} onChange={(e) => setMpesaNum(e.target.value)} placeholder="2547XXXXXXXX" className="w-full bg-black/40 border border-white/10 rounded-[25px] p-5 text-2xl font-black text-white outline-none focus:border-emerald-500 text-center tracking-widest transition-all" /></div>
                   <RippleButton disabled={isPaying} onClick={() => handlePay("MPESA")} className="w-full py-5 bg-emerald-600 text-white font-black rounded-[25px] text-[11px] uppercase shadow-2xl italic">{isPaying ? "Pushing STK..." : "Initiate Uplink"}</RippleButton>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .shadow-glow { box-shadow: 0 0 25px rgba(0, 245, 212, 0.4); }
      `}</style>
    </div>
  );
};