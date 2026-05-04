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
  <div className={`relative bg-white/4 backdrop-blur-xl border border-white/8 rounded-[22px] transition-all duration-300 hover:border-white/[0.14] hover:bg-white/6 ${accent ? "border-l-2 border-l-[#00f2ff]" : ""} ${glow ? "shadow-[0_0_30px_rgba(0,242,255,0.08)]" : ""} ${className}`}>
    {children}
  </div>
);

// --- STAT CARD ---
const StatCard = ({ label, value, icon, color = "#00f2ff" }: any) => (
  <GlassCard className="p-4 text-center group cursor-default">
    <div className="flex justify-center mb-2" style={{ color }}>{icon}</div>
    <p className="text-[11px] font-black tracking-tighter text-white">{value}</p>
    <p className="text-[8px] font-bold text-gray-600 uppercase leading-none mt-0.5">{label}</p>
  </GlassCard>
);

// --- LOGO COMPONENT (Fixed Type Error) ---
const CompanyLogo = ({ name, domain, size = 40 }: { name: string; domain: string; size?: number }) => {
  const [src, setSrc] = useState<string>(`https://logo.clearbit.com/${domain}`);
  return (
    <div style={{ width: size, height: size }} className="shrink-0">
      <img 
        src={src} 
        alt={name} 
        className="w-full h-full rounded-xl object-contain bg-white p-1 border border-white/10"
        onError={() => setSrc(`https://ui-avatars.com/api/?name=${name}&background=random`)} 
      />
    </div>
  );
};

// --- TOAST SYSTEM ---
type Toast = { id: number; msg: string; type: "success" | "error" | "info" };
const ToastContainer = ({ toasts, remove }: { toasts: Toast[]; remove: (id: number) => void }) => (
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

// === MAIN COMPONENT ===
export const FreelancerView = ({ jobs, userMetadata }: { jobs: any[]; userMetadata: any }) => {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("home");
  const [gigSlide, setGigSlide] = useState<"internal" | "corporate">("internal");
  
  // --- STATE ---
  const [isVerified, setIsVerified] = useState(userMetadata?.status === "Verified");
  const [huBalance, setHuBalance] = useState(5); // 🎁 5 HU GIFT FOR TRICK
  const [cashBalance, setCashBalance] = useState(0.00);
  const [showRefillModal, setShowRefillModal] = useState(false);
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [expandedMsg, setExpandedMsg] = useState<number | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [paymentStep, setPaymentStep] = useState<"packages" | "choice" | "card" | "mpesa" | "binance">("packages");
  const [calcHU, setCalcHU] = useState("1200");
  const [calcKES, setCalcKES] = useState(1300);

  const toastIdRef = useRef(0);
  const addToast = (msg: string, type: Toast["type"] = "info") => {
    const id = ++toastIdRef.current;
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };

  const refillPackages = [
    { id: 1, name: "Starter", price: 3, hu: 150, desc: "Try a few small jobs today." },
    { id: 2, name: "Basic", price: 6, hu: 400, desc: "Apply for more local tasks." },
    { id: 3, name: "Pro Node", price: 10, hu: 1200, desc: "The best choice for big jobs.", hot: true },
    { id: 4, name: "Elite", price: 18, hu: 2500, desc: "Priority access to high pay." },
    { id: 5, name: "Alpha", price: 30, hu: 5000, desc: "Ultimate power for top users." },
  ];

  const handleHUCalc = (val: string) => {
    setCalcHU(val);
    const num = parseFloat(val) || 0;
    setCalcKES(Math.floor(num * 1.083));
  };

  const handleApplyAction = (cost: number) => {
    if (huBalance >= cost) {
      setHuBalance(prev => prev - cost);
      addToast(`Handshake sent! -${cost} HU`, "success");
    } else {
      setPaymentStep("packages");
      setShowRefillModal(true);
    }
  };

  const handleSecurePayment = async (method: "M-PESA" | "CARD") => {
    if (!agreedToTerms) return addToast("Agree to terms first", "info");
    setIsPaying(true);
    setTimeout(() => {
        setIsPaying(false);
        addToast("Terminal Error: Initializing backup relay...", "info");
    }, 2000);
  };

  const marketplaceGigs = useMemo(() => [
    { id: "1", title: "Cyber: Bank API Penetration Test", budget: 2100, client: "SafeVault", rating: 5.0, dur: "7 Days", img: "https://i.pravatar.cc/150?u=safe", type: "Security", status: "Active", hot: true },
    { id: "2", title: "Academic: Python Scripts for Lab Research", budget: 110, client: "BioTech Lab", rating: 5.0, dur: "5 Days", img: "https://i.pravatar.cc/150?u=lab", type: "School Work", status: "Active", hot: false },
    { id: "3", title: "Web3: Smart Contract Vulnerability Scan (Solidity)", budget: 2200, client: "Nexus Protocol", rating: 4.9, dur: "5 Days", img: "https://i.pravatar.cc/150?u=crypto", type: "Web3", status: "Active", hot: true },
    { id: "4", title: "School Work: Advanced Calculus Problem Set", budget: 45, client: "Academic Hub", rating: 4.8, dur: "Expired", img: "https://i.pravatar.cc/150?u=school", type: "Academic", status: "Active", hot: false },
    { id: "5", title: "Next.js: Speed & SEO Optimization", budget: 800, client: "E-Com Solutions", rating: 4.9, dur: "4 Days", img: "https://i.pravatar.cc/150?u=ecom", type: "Startup", status: "Active", hot: true },
    { id: "6", title: "Fintech: Mobile App UI/UX Design System", budget: 1500, client: "Vertex Pay", rating: 4.8, dur: "14 Days", img: "https://i.pravatar.cc/150?u=pay", type: "Design", status: "Active", hot: false },
  ], []);

  const corporateGigs = useMemo(() => [
    { id: "c1", title: "Tesla: Remote Fleet Data Analyst", salary: "$8k/mo", location: "Global / Remote", headcount: 5, domain: "tesla.com", company: "Tesla" },
    { id: "c2", title: "Amazon: Cloud Support Engineer", salary: "$9k/mo", location: "EMEA Remote", headcount: 12, domain: "amazon.com", company: "Amazon" },
  ], []);

  const navItems = [
    { id: "home", icon: <Home size={16} />, label: "Home" },
    { id: "tasks", icon: <Briefcase size={16} />, label: "Gigs" },
    { id: "messages", icon: <MessageSquare size={16} />, label: "Chats" },
    { id: "earnings", icon: <Wallet size={16} />, label: "Vault" },
    { id: "account", icon: <User size={16} />, label: "Me" },
  ];

  return (
    <div className="min-h-screen bg-[#010812] text-white font-sans selection:bg-[#00f2ff]/30 pb-28 overflow-x-hidden text-sm">
      
      {/* AMBIENT BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00f2ff] opacity-5 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600 opacity-5 blur-[100px] rounded-full" />
      </div>

      <ToastContainer toasts={toasts} remove={id => setToasts(t => t.filter(x => x.id !== id))} />

      <div className="max-w-5xl mx-auto pt-4 px-4 relative z-10">
        <AnimatePresence mode="wait">

          {/* ═══════════════════════ HOME ═══════════════════════ */}
          {activeTab === "home" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <header className="relative flex justify-between items-center bg-white/4 backdrop-blur-2xl p-5 rounded-[22px] border border-white/8 shadow-2xl">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#00f2ff] rounded-l-[22px]" />
                <div className="text-left">
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">Node Operator</p>
                  <h2 className="text-xl font-black italic uppercase tracking-tighter">{user?.firstName || "Operator"}</h2>
                </div>
                <div className="bg-black/40 px-3 py-1.5 rounded-xl border border-[#00f2ff]/20 flex items-center gap-2">
                   <Zap size={14} className="text-[#00f2ff] fill-[#00f2ff]" />
                   <span className="text-[11px] font-black">{huBalance} HU</span>
                </div>
              </header>

              <GlassCard className="p-5 flex items-center justify-between shadow-xl" accent>
                <div className="text-left">
                  <h4 className="text-xs font-black uppercase text-[#00f2ff] flex items-center gap-2"><Sparkles size={14}/> Node Power Low</h4>
                  <p className="text-[9px] text-gray-400 mt-1">Refill units to unlock the global corporate mission slide.</p>
                </div>
                <RippleButton onClick={() => { setPaymentStep("packages"); setShowRefillModal(true); }} className="px-4 py-2 bg-white text-black font-black rounded-xl text-[8px] uppercase tracking-widest active:scale-95">Refill Now</RippleButton>
              </GlassCard>

              <div className="grid grid-cols-2 gap-3">
                 <StatCard label="Success Rate" value="0%" icon={<CheckCircle size={15}/>} color="#34d399" />
                 <StatCard label="Sync Status" value="Online" icon={<Wifi size={15}/>} color="#00f2ff" />
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════ GIGS ═══════════════════════ */}
          {activeTab === "tasks" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5 text-left">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-lg font-black uppercase tracking-tighter">Mission <span className="text-[#00f2ff]">Feed</span></h3>
                <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Live</span>
                </div>
              </div>

              {/* FOMO Ticker */}
              <div className="bg-black/40 border border-white/5 py-2 rounded-xl overflow-hidden">
                <motion.div animate={{ x: [0, -400] }} transition={{ repeat: Infinity, duration: 25, ease: "linear" }} className="whitespace-nowrap flex gap-10">
                   {["Node #819 earned $400", "Node #022 applied for Tesla", "User 'Nexus' refilled 1200 HU", "Node #441 withdrawn $1,200", "Global Signal: Active"].map((t, i) => (
                     <span key={i} className="text-[8px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><Activity size={10} className="text-[#00f2ff]"/> {t}</span>
                   ))}
                </motion.div>
              </div>

              <div className="bg-white/5 p-1 rounded-2xl flex border border-white/10 max-w-sm mx-auto w-full shadow-inner">
                <button onClick={() => setGigSlide("internal")} className={`flex-1 py-3 rounded-xl text-[8px] font-black uppercase transition-all ${gigSlide === "internal" ? "bg-[#00f2ff] text-black shadow-glow" : "text-gray-500"}`}>Marketplace</button>
                <button onClick={() => setGigSlide("corporate")} className={`flex-1 py-3 rounded-xl text-[8px] font-black uppercase transition-all ${gigSlide === "corporate" ? "bg-white text-black shadow-glow" : "text-gray-500"}`}>Corporate</button>
              </div>

              {gigSlide === "internal" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {marketplaceGigs.map((g, idx) => (
                    <div key={g.id} className={`relative p-4 rounded-[20px] bg-white/4 border border-white/8 transition-all ${idx > 2 ? "blur-[3px] pointer-events-none opacity-40 grayscale" : "hover:border-white/20 shadow-xl"}`}>
                       {idx > 2 && (
                         <div className="absolute inset-0 flex items-center justify-center z-20">
                            <div className="bg-black/80 px-4 py-2 rounded-xl border border-[#00f2ff]/30 text-center">
                               <Lock size={14} className="mx-auto mb-1 text-[#00f2ff]"/>
                               <p className="text-[7px] font-black text-white uppercase">Refill to Unlock</p>
                            </div>
                         </div>
                       )}
                       <div className="flex justify-between items-start mb-3 text-left">
                          <img src={g.img} className="w-10 h-10 rounded-xl border border-white/10" alt="" />
                          <span className="text-[7px] font-black text-[#00f2ff] bg-[#00f2ff]/10 px-2 py-0.5 rounded-full border border-[#00f2ff]/20 uppercase">10 HU Required</span>
                       </div>
                       <h4 className="text-[10px] font-black uppercase text-white mb-4 line-clamp-2 h-7">{g.title}</h4>
                       <div className="flex justify-between items-center pt-3 border-t border-white/5">
                          <p className="text-sm font-black text-[#00f2ff] tracking-tighter">${g.budget}</p>
                          <RippleButton onClick={() => handleApplyAction(10)} className="px-4 py-1.5 bg-[#00f2ff] text-black font-black rounded-lg text-[8px] uppercase shadow-glow">Apply</RippleButton>
                       </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-start gap-3">
                     <ShieldAlert size={18} className="text-indigo-400 mt-1 shrink-0" />
                     <p className="text-[9px] text-gray-400 italic">Corporate handshakes require Tier 1 Authorization. Refill units to apply for Global Remote roles.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {corporateGigs.map(c => (
                       <div key={c.id} className="p-5 rounded-[22px] bg-black/40 border border-white/10 hover:border-white/20 transition-all shadow-2xl relative overflow-hidden">
                          <div className="flex items-center gap-4 mb-4">
                             <CompanyLogo name={c.company} domain={c.domain} size={48} />
                             <div className="text-left min-w-0">
                                <h4 className="text-[11px] font-black uppercase text-white leading-tight truncate">{c.title}</h4>
                                <p className="text-[9px] font-bold text-[#00f2ff] mt-0.5">{c.salary}</p>
                             </div>
                          </div>
                          <RippleButton onClick={() => handleApplyAction(50)} className="w-full py-3 bg-white text-black font-black rounded-xl text-[8px] uppercase flex items-center justify-center gap-2 active:scale-95 italic">
                             Request Handshake (50 HU) <ArrowUpRight size={14}/>
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
                  <div className="p-7 rounded-[35px] border border-white/10 bg-linear-to-br from-[#00f2ff]/20 to-transparent shadow-3xl text-left">
                     <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 text-[#00f2ff]"><Zap size={22} fill="#00f2ff"/></div>
                     <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Node Power</p>
                     <h4 className="text-4xl font-black italic tracking-tighter text-white mb-2">{huBalance} <span className="text-[#00f2ff]">HU</span></h4>
                     <p className="text-[8px] font-bold text-gray-600 uppercase">Spendable for Missions</p>
                  </div>
                  <div className="p-7 rounded-[35px] border border-white/10 bg-linear-to-br from-emerald-500/10 to-transparent shadow-3xl text-left">
                     <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 text-emerald-400"><DollarSign size={22}/></div>
                     <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Settlement Assets</p>
                     <h4 className="text-4xl font-black italic tracking-tighter text-white mb-2">${cashBalance.toFixed(2)}</h4>
                     <p className="text-[8px] font-bold text-gray-600 uppercase">Available for Withdrawal</p>
                  </div>
               </div>

               {/* Unit Converter */}
               <GlassCard className="p-6">
                  <div className="flex items-center gap-3 mb-6"><Calculator size={16} className="text-[#00f2ff]"/><h4 className="text-xs font-black uppercase italic tracking-widest text-white">Node Liquidity Check</h4></div>
                  <div className="space-y-4">
                     <div className="bg-black/40 p-5 rounded-2xl border border-white/5 text-left">
                        <p className="text-[8px] font-black text-gray-600 uppercase mb-2">Refill Units (HU)</p>
                        <input type="number" value={calcHU} onChange={(e) => handleHUCalc(e.target.value)} 
                          className="bg-transparent w-full text-2xl font-black outline-none text-white tracking-tighter" />
                     </div>
                     <div className="flex justify-center"><RefreshCw size={18} className="text-gray-700"/></div>
                     <div className="bg-black/40 p-5 rounded-2xl border border-white/5 text-left">
                        <p className="text-[8px] font-black text-gray-600 uppercase mb-2">Estimated Value</p>
                        <div className="flex justify-between items-end">
                           <p className="text-2xl font-black text-emerald-400 italic">Ksh {calcKES.toLocaleString()}</p>
                           <p className="text-[10px] font-bold text-gray-700 uppercase">≈ $ {(calcKES / 130).toFixed(2)} USD</p>
                        </div>
                     </div>
                  </div>
               </GlassCard>

               <button disabled className="w-full py-5 bg-white/5 border border-white/10 text-gray-600 rounded-[28px] font-black uppercase text-[10px] tracking-widest cursor-not-allowed opacity-50">
                  Withdrawal Interface Locked (Tier 0)
               </button>
            </motion.div>
          )}

          {/* ═══════════════════════ ACCOUNT ═══════════════════════ */}
          {activeTab === "account" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto space-y-4 pb-20">
              <div className="p-8 text-center bg-white/5 backdrop-blur-xl rounded-[40px] border border-white/10 shadow-3xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#00f2ff] shadow-glow" />
                <div className="relative w-28 h-28 mx-auto mb-6 group">
                   <div className="absolute inset-0 bg-[#00f2ff]/20 blur-xl rounded-full animate-pulse" />
                   <div className="relative w-full h-full bg-black/60 rounded-[35px] border-2 border-white/10 flex items-center justify-center overflow-hidden">
                      {user?.imageUrl ? <img src={user.imageUrl} className="w-full h-full object-cover" alt="" /> : <UserCircle size={55} className="text-gray-500" />}
                      <div className="absolute bottom-1 right-1 p-1 bg-[#00f2ff] rounded-lg text-black shadow-glow"><BadgeCheck size={14}/></div>
                   </div>
                </div>

                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-1">{user?.fullName || "Operator"}</h3>
                <div className="flex justify-center gap-3 mb-8">
                   <div className="px-4 py-1.5 bg-black/40 rounded-full border border-white/5 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                      <span className="text-[8px] font-black uppercase text-emerald-500 italic">Sync Active</span>
                   </div>
                   <div className="px-4 py-1.5 bg-black/40 rounded-full border border-white/5 flex items-center gap-2 text-[#00f2ff]">
                      <span className="text-[8px] font-black uppercase italic">{isVerified ? "Tier 1 Elite" : "Tier 0 Beta"}</span>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                   <button onClick={() => setActiveTab('earnings')} className="py-4 bg-white text-black rounded-2xl font-black uppercase text-[10px] shadow-xl flex items-center justify-center gap-2 active:scale-95 italic transition-all">Vault Hub <ArrowUpRight size={14}/></button>
                   <button className="py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2 active:scale-95 italic transition-all">Settings <Settings size={14}/></button>
                </div>

                <SignOutButton><button className="w-full mt-6 py-5 bg-red-500/5 border border-red-500/20 text-red-500 font-black italic rounded-3xl uppercase text-[9px] hover:bg-red-500/10 flex items-center justify-center gap-3 transition-all">Terminate Node Session</button></SignOutButton>
              </div>
            </motion.div>
          )}

          {/* 📩 CHATS */}
          {activeTab === "messages" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-left">
               <h3 className="text-xl font-bold uppercase px-2 text-left">System <span className="text-[#00f2ff]">Log</span></h3>
               {[
                 { t: "Nexus HQ", m: "Welcome to the Nexus network. To keep our high-budget clients safe, you must refill your Handshake Units (HU). Once refilled, you gain full access to apply for Tesla and Amazon missions immediately.", time: "Just now", unread: true },
                 { t: "Security Bot", m: "Handshake encryption is active. We noticed your node power is low (5 HU). Missions require at least 10 HU. Pick a refill package to establish a permanent connection with our financial vault.", time: "12m ago", unread: true },
               ].map((msg, i) => (
                 <div key={i} onClick={() => setExpandedMsg(expandedMsg === i ? null : i)} className={`p-6 rounded-[30px] border cursor-pointer transition-all ${msg.unread ? "bg-[#00f2ff]/5 border-[#00f2ff]/20 shadow-glow" : "bg-white/3 border-white/5"}`}>
                    <div className="flex gap-4 items-center text-left">
                       <div className="p-3 bg-black/40 rounded-xl text-[#00f2ff]"><MessageSquare size={16}/></div>
                       <div className="flex-1 text-left">
                          <div className="flex justify-between items-center mb-1 text-left">
                             <h4 className="text-[10px] font-black uppercase italic text-white leading-none text-left">{msg.t}</h4>
                             <span className="text-[7px] text-gray-500 font-bold uppercase">{msg.time}</span>
                          </div>
                          <p className={`text-[10px] text-gray-400 leading-relaxed text-left ${expandedMsg === i ? "" : "line-clamp-1"}`}>{msg.m}</p>
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

      {/* --- REFILL HU MODAL (The Master Stroke) --- */}
      <AnimatePresence>
        {showRefillModal && (
          <div className="fixed inset-0 z-600 flex items-center justify-center p-6 backdrop-blur-md bg-black/70 text-left">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0" onClick={() => !isPaying && setShowRefillModal(false)} />
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="relative w-full max-w-sm bg-[#080d19] border border-white/10 rounded-[40px] p-7 shadow-3xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-[#00f2ff] to-transparent shadow-glow" />
              
              {paymentStep === "packages" ? (
                <div className="space-y-5 text-left">
                   <div className="flex justify-between items-start mb-2 text-left">
                      <div className="text-left">
                         <h3 className="text-lg font-black italic uppercase tracking-tight text-white leading-none text-left">Refill Node</h3>
                         <p className="text-[9px] text-gray-500 uppercase mt-1 text-left">Required to send handshake uplink</p>
                      </div>
                      <button className="p-2 bg-white/5 rounded-xl border border-white/10 text-gray-500 active:scale-90" onClick={() => setShowRefillModal(false)}><X size={16}/></button>
                   </div>
                   
                   <div className="space-y-2.5 max-h-87.5 overflow-y-auto no-scrollbar pr-1 text-left">
                      <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl mb-2 flex items-center gap-3 text-left">
                         <Zap size={14} className="text-red-500"/>
                         <p className="text-[8px] text-red-400 font-bold uppercase tracking-widest italic text-left">Underpowered Node: {huBalance} HU detected.</p>
                      </div>
                      {refillPackages.map(pkg => (
                        <RippleButton key={pkg.id} onClick={() => setPaymentStep("choice")}
                          className={`w-full p-4 rounded-2xl border transition-all relative overflow-hidden group flex items-center justify-between ${pkg.hot ? "bg-[#00f2ff]/5 border-[#00f2ff]/40 shadow-glow" : "bg-white/3 border-white/8 hover:bg-white/5"}`}>
                           <div className="z-10 relative text-left">
                              <h5 className="text-[11px] font-black uppercase text-white leading-none mb-1 text-left">{pkg.name} Pack</h5>
                              <p className="text-[8px] font-bold text-gray-500 uppercase tracking-tight text-left">{pkg.desc}</p>
                           </div>
                           <div className="z-10 relative text-right">
                              <p className="text-sm font-black text-white italic text-right">{pkg.hu} HU</p>
                              <p className="text-[9px] font-black text-[#00f2ff] text-right">KES {(pkg.price * 130).toLocaleString()}</p>
                           </div>
                        </RippleButton>
                      ))}
                   </div>

                   <div className="p-4 bg-white/3 rounded-2xl border border-white/5 flex items-center gap-3 cursor-pointer text-left" onClick={() => setAgreedToTerms(!agreedToTerms)}>
                      <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${agreedToTerms ? "bg-[#00f2ff] border-[#00f2ff]" : "border-white/20"} text-left`}>{agreedToTerms && <Check size={12} className="text-black"/>}</div>
                      <p className="text-[8px] font-bold text-gray-500 uppercase text-left leading-tight">I agree to refill my node and follow the network rules.</p>
                   </div>
                </div>
              ) : (
                <div className="space-y-6 text-left">
                   <div className="flex items-center gap-3 text-left">
                      <button onClick={() => setPaymentStep("packages")} className="p-2 bg-white/5 rounded-lg text-gray-500 active:scale-90"><ChevronDown size={14} className="rotate-90"/></button>
                      <h4 className="text-xs font-black uppercase text-white italic text-left">Select Gateway</h4>
                   </div>
                   <div className="space-y-3 text-left">
                      <RippleButton onClick={() => setPaymentStep("mpesa")} className="w-full p-5 bg-emerald-600 text-white rounded-2xl flex items-center justify-between shadow-xl active:scale-95 transition-all italic text-left">
                         <div className="flex items-center gap-4 text-left"><div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-black">M</div><div className="text-left"><p className="text-sm font-black text-left">M-Pesa</p><p className="text-[8px] font-bold uppercase opacity-70 tracking-widest text-left">Instant Delivery</p></div></div>
                         <ChevronRight size={18}/>
                      </RippleButton>
                      <RippleButton onClick={() => setPaymentStep("choice")} className="w-full p-5 bg-indigo-600 text-white rounded-2xl flex items-center justify-between shadow-xl active:scale-95 transition-all italic text-left">
                         <div className="flex items-center gap-4 text-left"><Landmark size={24}/><div className="text-left"><p className="text-sm font-black text-left">Bank / Card</p><p className="text-[8px] font-bold uppercase opacity-70 tracking-widest text-left">Visa · Mastercard</p></div></div>
                         <ChevronRight size={18}/>
                      </RippleButton>
                      <RippleButton onClick={() => setPaymentStep("binance")} className="w-full p-5 bg-amber-500 text-white rounded-2xl flex items-center justify-between shadow-xl active:scale-95 transition-all italic text-left">
                         <div className="flex items-center gap-4 text-left"><Zap size={24} fill="white"/><div className="text-left"><p className="text-sm font-black text-left">Binance USDT</p><p className="text-[8px] font-bold uppercase opacity-70 tracking-widest text-left">TRC20 · Crypto</p></div></div>
                         <ChevronRight size={18}/>
                      </RippleButton>
                   </div>
                   <button onClick={() => setPaymentStep("packages")} className="w-full text-center text-[9px] font-black text-gray-600 uppercase tracking-widest italic pt-2">Return to Node Packs</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .shadow-glow { box-shadow: 0 0 15px rgba(0, 242, 255, 0.3); }
      `}</style>
    </div>
  );
};