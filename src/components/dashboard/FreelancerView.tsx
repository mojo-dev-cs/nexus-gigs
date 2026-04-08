"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, Briefcase, FileText, MessageSquare, 
  Wallet, BarChart3, User, Settings, 
  ShieldCheck, Zap, Globe, Lock, Rocket, 
  Smartphone, CreditCard, ChevronRight, AlertTriangle,
  Star, Clock, Bell, Info, ShieldAlert, CheckCircle2,
  Cpu, Moon, Palette, Fingerprint, ChevronDown, MousePointer2,
  Activity, Landmark, Bitcoin, HelpCircle, LifeBuoy, X, CheckCircle, Box,
  ShieldQuestion, UserCircle, DollarSign, ArrowUpRight, History,
  Shield, QrCode, ScanFace, Award, Target
} from "lucide-react";

export const FreelancerView = ({ jobs, userMetadata }: { jobs: any[], userMetadata: any }) => {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("home");
  const [isVerified, setIsVerified] = useState(userMetadata?.status === "Verified");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [currency, setCurrency] = useState<"USD" | "KES">("USD");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const [customAlert, setCustomAlert] = useState<{show: boolean, title: string, msg: string, type: 'info' | 'error' | 'success'}>({
    show: false, title: '', msg: '', type: 'info'
  });

  const [paymentStep, setPaymentStep] = useState<"terms" | "choice" | "card" | "mpesa">("terms");
  const [expandedMsg, setExpandedMsg] = useState<number | null>(null);

  const showAlert = (title: string, msg: string, type: 'info' | 'error' | 'success' = 'info') => {
    setCustomAlert({ show: true, title, msg, type });
  };

  useEffect(() => {
    const finalizeHandshake = async () => {
      if (searchParams.get("payment") === "success" && isLoaded && user && !isVerified) {
        try {
          const response = await fetch("/api/verify-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              amount: 10, 
              method: "Nexus Global Relay"
            }),
          });

          if (response.ok) {
            showAlert("Verified!", "Handshake complete. Check your email for the survey.", "success");
            setIsVerified(true);
          }
        } catch (error) {
          console.error("error:", error);
        }
      }
    };
    finalizeHandshake();
  }, [searchParams, isLoaded, user, isVerified]);

  const handleSecurePayment = async (method: "M-PESA" | "CARD") => {
    if (!agreedToTerms) return showAlert("Notice", "Please agree to the screening terms.", "info");
    setIsPaying(true);

    if (method === "M-PESA") {
      const cleanPhone = mpesaNumber.replace(/\D/g, ''); 
      if (!cleanPhone.startsWith("254") || cleanPhone.length !== 12) {
        setIsPaying(false);
        return showAlert("Format Error", "Use 2547XXXXXXXX.", "error");
      }
      try {
        const response = await fetch("/api/intasend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: 10, phone: cleanPhone, email: user?.primaryEmailAddress?.emailAddress, firstName: user?.firstName, lastName: user?.lastName, method: "M-PESA" }),
        });
        if (response.ok) {
          showAlert("PIN Sent", "Enter your PIN on your phone.", "success");
          setShowVerifyModal(false);
        }
      } catch (error) { showAlert("Error", "Link lost.", "error"); }
      finally { setIsPaying(false); }
    } else {
      try {
        const response = await fetch("/api/paystack", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: 10, email: user?.primaryEmailAddress?.emailAddress, firstName: user?.firstName, lastName: user?.lastName }),
        });
        const data = await response.json();
        if (data.status && data.data.authorization_url) window.location.href = data.data.authorization_url; 
      } catch (error) { showAlert("Error", "Relay down.", "error"); }
      finally { setIsPaying(false); }
    }
  };

  const navItems = [
    { id: 'home', icon: <Home size={16}/>, label: 'Home' },
    { id: 'tasks', icon: <Briefcase size={16}/>, label: 'Gigs' },
    { id: 'contracts', icon: <FileText size={16}/>, label: 'Work' },
    { id: 'messages', icon: <MessageSquare size={16}/>, label: 'Chats' },
    { id: 'earnings', icon: <Wallet size={16}/>, label: 'Vault' },
    { id: 'analytics', icon: <BarChart3 size={16}/>, label: 'Stats' },
    { id: 'support', icon: <LifeBuoy size={16}/>, label: 'Help' },
    { id: 'account', icon: <User size={16}/>, label: 'Me' },
    { id: 'settings', icon: <Settings size={16}/>, label: 'Config' },
  ];

  // --- 💼 UPDATED GIGS (10 MIXED GIGS) ---
  const marketplaceGigs = useMemo(() => [
    { id: "1", title: "Enterprise: Cloud Infrastructure Audit", budget: 850, client: "TechFlow Systems", rating: 5.0, dur: "4 Days", img: "https://i.pravatar.cc/150?u=tech", type: "Company", status: "Active" },
    { id: "2", title: "Assignment: Advanced Calculus Solutions", budget: 60, client: "Mark Thompson", rating: 4.8, dur: "12 Hours", img: "https://i.pravatar.cc/150?u=mark", type: "Academic", status: "Active" },
    { id: "3", title: "Startup: MVP Mobile App UI Design", budget: 1200, client: "Nova Labs", rating: 5.0, dur: "Expired", img: "https://i.pravatar.cc/150?u=nova", type: "Agency", status: "Expired" },
    { id: "4", title: "Company: Fullstack React Dev (Hotfix)", budget: 350, client: "Julia Cody", rating: 4.9, dur: "24 Hours", img: "https://i.pravatar.cc/150?u=julia", type: "Startup", status: "Active" },
    { id: "5", title: "Technical: Rust Smart Contract Audit", budget: 2000, client: "Polygon Hub", rating: 5.0, dur: "3 Days", img: "https://i.pravatar.cc/150?u=poly", type: "Web3", status: "Active" },
    { id: "6", title: "Assignment: 10 Page Literature Review", budget: 100, client: "Liam G.", rating: 4.7, dur: "Expired", img: "https://i.pravatar.cc/150?u=liam", type: "Academic", status: "Expired" },
    { id: "7", title: "Startup: Python Backend API Sync", budget: 500, client: "CloudX", rating: 5.0, dur: "2 Days", img: "https://i.pravatar.cc/150?u=cloud", type: "Company", status: "Active" },
    { id: "8", title: "Design: Cinematic 4K Drone Edit", budget: 250, client: "Vogue Visuals", rating: 4.9, dur: "2 Days", img: "https://i.pravatar.cc/150?u=vogue", type: "Studio", status: "Active" },
    { id: "9", title: "Enterprise: Cybersecurity Protocol v2", budget: 3500, client: "SafeVault", rating: 5.0, dur: "Active", img: "https://i.pravatar.cc/150?u=safe", type: "Enterprise", status: "Active" },
    { id: "10", title: "Technical: C++ Legacy Migration", budget: 1800, client: "Old Guard", rating: 5.0, dur: "Expired", img: "https://i.pravatar.cc/150?u=old", type: "Company", status: "Expired" },
  ], []);

  const handleSupportEmail = () => {
    window.location.href = `mailto:notifications.nexusgigs@gmail.com?subject=Help&body=ID: ${user?.id}`;
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-[#00f2ff]/30 pb-20 overflow-x-hidden">
      
      <div className="fixed inset-0 pointer-events-none">
        <motion.div animate={{ opacity: [0.1, 0.15, 0.1] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto pt-4 px-4 relative z-10">
        <AnimatePresence mode="wait">
          
          {/* --- HOME --- */}
          {activeTab === "home" && (
            <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <header className="flex justify-between items-center bg-white/5 backdrop-blur-xl p-5 rounded-[25px] border border-white/10">
                <h2 className="text-lg font-bold uppercase tracking-widest">{user?.firstName || "Welcome"}</h2>
                <div className="flex items-center gap-3 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                   <div className={`w-2 h-2 rounded-full ${isVerified ? 'bg-[#00f2ff] shadow-[0_0_10px_#00f2ff]' : 'bg-red-500'}`} />
                   <span className="text-[8px] font-bold uppercase tracking-widest">{isVerified ? "VERIFIED NODE" : "UNVERIFIED"}</span>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 bg-linear-to-br from-[#00f2ff]/10 to-transparent border border-[#00f2ff]/20 rounded-[30px] shadow-2xl">
                  <p className="text-[8px] font-bold uppercase text-[#00f2ff] mb-1">Available Vault</p>
                  <h3 className="text-3xl font-black mb-4 tracking-tighter">$0.00</h3>
                  <button onClick={() => setActiveTab("earnings")} className="w-full py-2.5 bg-white text-black font-bold rounded-lg text-[10px] uppercase hover:bg-[#00f2ff] transition-all">My Vault</button>
                </div>
                {!isVerified && (
                  <div className="md:col-span-2 p-6 bg-white/5 border border-white/10 rounded-[30px] flex items-center gap-6 backdrop-blur-md">
                    <div className="w-12 h-12 bg-[#00f2ff]/10 rounded-2xl flex items-center justify-center text-[#00f2ff] shadow-inner"><ShieldCheck size={28}/></div>
                    <div className="flex-1">
                        <h4 className="text-md font-bold uppercase tracking-tight">Identity Required</h4>
                        <p className="text-[10px] text-gray-400 mb-3">Complete the $10 handshake to unlock high-tier mission access.</p>
                        <button onClick={() => { setPaymentStep("terms"); setShowVerifyModal(true); }} className="text-[9px] font-bold uppercase text-[#00f2ff] flex items-center gap-1 hover:text-white transition-all">Start Authentication <ChevronRight size={12} /></button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* --- GIGS --- */}
          {activeTab === "tasks" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-xl font-bold uppercase tracking-tighter">Mission <span className="text-[#00f2ff]">Feed</span></h3>
                <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" /><span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Active</span></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {marketplaceGigs.map((g) => (
                  <div key={g.id} className={`p-5 rounded-[25px] bg-white/5 border border-white/10 transition-all ${g.status === 'Expired' ? 'opacity-40 grayscale' : 'hover:border-[#00f2ff]/30 shadow-xl'}`}>
                    <div className="flex justify-between items-start mb-3">
                       <img src={g.img} className="w-10 h-10 rounded-xl object-cover border border-white/10" alt="client" />
                       <span className={`text-[8px] font-bold px-2 py-1 rounded-lg uppercase ${g.status === 'Active' ? 'bg-[#00f2ff]/10 text-[#00f2ff]' : 'bg-white/5 text-gray-500'}`}>{g.dur}</span>
                    </div>
                    <h4 className="text-xs font-black uppercase mb-1 line-clamp-2 h-8 leading-tight">{g.title}</h4>
                    <div className="flex items-center gap-2 mb-4">
                       <p className="text-[8px] text-gray-500 font-bold uppercase">{g.client}</p>
                       <div className="flex items-center gap-1 text-yellow-400"><Star size={8} fill="currentColor"/><span className="text-[8px] font-bold text-white">{g.rating}</span></div>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-white/5">
                       <p className="text-md font-bold text-[#00f2ff] tracking-tighter">${g.budget}</p>
                       <button onClick={() => setShowVerifyModal(true)} className={`px-4 py-1.5 rounded-lg text-[8px] font-bold uppercase transition-all ${g.status === 'Expired' ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-white text-black hover:bg-[#00f2ff]'}`}>{g.status === 'Expired' ? 'Closed' : 'Bid'}</button>
                    </div>
                  </div>
                ))}
                <button onClick={() => setShowVerifyModal(true)} className="p-5 rounded-[25px] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-all group min-h-40">
                   <Lock size={20} className="text-gray-500 group-hover:text-[#00f2ff] transition-colors" />
                   <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest text-center">Verify Account to Unlock<br/>1.2k+ Specialized Gigs</p>
                </button>
              </div>
            </motion.div>
          )}

          {/* --- WORK --- */}
          {activeTab === "contracts" && (
            <div className="pt-10 px-4">
               <div className="p-10 bg-white/5 border border-red-500/20 rounded-[40px] text-center space-y-4 max-w-md mx-auto shadow-2xl backdrop-blur-xl">
                  <ShieldAlert size={48} className="mx-auto text-red-500" />
                  <h3 className="text-lg font-bold uppercase tracking-widest">Node Encrypted</h3>
                  <p className="text-gray-400 text-[10px]">Your history is protected by the Nexus security layer. Complete the $10 handshake to decrypt your profile history.</p>
                  <button onClick={() => setShowVerifyModal(true)} className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl text-[10px] uppercase shadow-lg hover:scale-105 transition-all">Decrypt Terminal</button>
               </div>
            </div>
          )}

          {/* --- CHATS (CLEAN SYSTEM ONLY) --- */}
          {activeTab === "messages" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
               <h3 className="text-xl font-bold uppercase px-2 tracking-[0.3em]">Console <span className="text-[#00f2ff]">Feed</span></h3>
               <div className="space-y-3">
                  {[
                    { id: 0, t: "Nexus Protocol", m: `Greetings Node_${user?.firstName?.toUpperCase()}. Your identity is in staging. Pay the $10 handshake to start your screening.`, icon: <Shield size={16} className="text-[#00f2ff]"/> },
                    { id: 1, t: "System Sync", m: "Global data relay is 100% operational. High-budget missions are being routed to verified nodes only.", icon: <Activity size={16} className="text-emerald-500"/> }
                  ].map((msg, i) => (
                    <div key={i} onClick={() => setExpandedMsg(expandedMsg === i ? null : i)} className="p-6 rounded-[30px] bg-white/3 border border-white/5 cursor-pointer hover:bg-white/10 transition-all group">
                       <div className="flex gap-4">
                          <div className="p-3 bg-black/40 rounded-xl border border-white/5 shrink-0 group-hover:scale-110 transition-transform">{msg.icon}</div>
                          <div className="flex-1">
                             <h4 className="text-xs font-black uppercase italic tracking-wider mb-1 text-white">{msg.t}</h4>
                             <p className={`text-[10px] text-gray-400 leading-relaxed ${expandedMsg === i ? "" : "line-clamp-1"}`}>{msg.m}</p>
                          </div>
                          <ChevronDown size={14} className={`text-gray-600 transition-transform ${expandedMsg === i ? "rotate-180 text-[#00f2ff]" : ""}`}/>
                       </div>
                    </div>
                  ))}
               </div>
            </motion.div>
          )}

          {/* --- VAULT --- */}
          {activeTab === "earnings" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
               <div className="flex justify-between items-center px-2">
                  <h3 className="text-xl font-bold uppercase tracking-widest">My <span className="text-[#00f2ff]">Vault</span></h3>
                  <div className="p-1.5 bg-white/5 rounded-xl flex gap-1 border border-white/5">
                     <button onClick={() => setCurrency("USD")} className={`px-4 py-1.5 rounded-lg text-[8px] font-black transition-all ${currency === "USD" ? "bg-[#00f2ff] text-black shadow-lg" : "text-gray-500"}`}>USD</button>
                     <button onClick={() => setCurrency("KES")} className={`px-4 py-1.5 rounded-lg text-[8px] font-black transition-all ${currency === "KES" ? "bg-[#00f2ff] text-black shadow-lg" : "text-gray-500"}`}>KES</button>
                  </div>
               </div>

               <div className="relative group perspective-1000">
                  <div className="w-full h-52 bg-linear-to-br from-white/15 to-white/5 backdrop-blur-3xl border border-white/20 rounded-[45px] p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden ring-1 ring-white/10">
                    <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#00f2ff]/5 rounded-full blur-3xl group-hover:bg-[#00f2ff]/10 transition-all duration-1000" />
                    <div className="flex justify-between items-start relative z-10">
                       <div className="space-y-1">
                          <p className="text-[9px] font-bold text-[#00f2ff] uppercase tracking-[0.3em]">Available Assets</p>
                          <h4 className="text-5xl font-black italic tracking-tighter">{currency === "USD" ? "$0.00" : "KES 0"}</h4>
                       </div>
                       <div className="w-12 h-12 bg-white/5 rounded-[20px] flex items-center justify-center border border-white/10 shadow-inner"><Zap className="text-[#00f2ff]" size={20} /></div>
                    </div>
                    <div className="flex justify-between items-end relative z-10">
                       <div className="space-y-1">
                          <p className="text-[7px] font-bold text-gray-500 uppercase tracking-widest">Node ID</p>
                          <p className="text-[10px] font-mono text-white/60 tracking-widest">{user?.id?.substring(0, 10).toUpperCase()}</p>
                       </div>
                       <button onClick={() => showAlert("Access Denied", "Verify node to enable withdrawal relays.", "info")} className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-2xl text-[10px] font-black uppercase italic hover:bg-[#00f2ff] transition-all shadow-xl active:scale-95">
                          Withdraw <ArrowUpRight size={14}/>
                       </button>
                    </div>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-white/5 border border-white/10 rounded-[30px] flex items-center gap-4 group hover:bg-white/10 transition-all">
                     <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 group-hover:scale-110 transition-transform"><History size={18}/></div>
                     <div><p className="text-[7px] font-black text-gray-500 uppercase tracking-widest">Revenue</p><p className="text-sm font-black">$0.00</p></div>
                  </div>
                  <div className="p-6 bg-white/5 border border-white/10 rounded-[30px] flex items-center gap-4 group hover:bg-white/10 transition-all">
                     <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 border border-amber-500/20 group-hover:scale-110 transition-transform"><Clock size={18}/></div>
                     <div><p className="text-[7px] font-black text-gray-500 uppercase tracking-widest">Pending</p><p className="text-sm font-black">$0.00</p></div>
                  </div>
               </div>
            </motion.div>
          )}

          {/* --- STATS --- */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
               <h3 className="text-xl font-bold uppercase px-2 tracking-widest">Node <span className="text-[#00f2ff]">Pulse</span></h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { l: "Success Rate", v: "0%", i: <CheckCircle2 size={16} className="text-emerald-500"/> },
                    { l: "Missions", v: "0", i: <Briefcase size={16} className="text-blue-500"/> },
                    { l: "Trust score", v: "N/A", i: <ShieldCheck size={16} className="text-purple-500"/> },
                    { l: "Total Paid", v: "$0.00", i: <DollarSign size={16} className="text-yellow-500"/> }
                  ].map(stat => (
                    <div key={stat.l} className="p-6 bg-white/5 border border-white/10 rounded-[25px] text-center hover:bg-white/10 transition-all border-b-2 border-b-transparent hover:border-b-[#00f2ff]">
                       <div className="mb-2 flex justify-center">{stat.i}</div>
                       <p className="text-[8px] font-bold text-gray-500 uppercase mb-1 tracking-widest">{stat.l}</p>
                       <p className="text-lg font-black">{stat.v}</p>
                    </div>
                  ))}
               </div>
               <div className="p-12 bg-white/2 border border-white/10 rounded-[40px] text-center group">
                  <Activity size={32} className="mx-auto text-[#00f2ff] opacity-10 mb-4 group-hover:opacity-40 transition-opacity" />
                  <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest leading-loose">Sync your identity node to<br/>unlock live performance tracking</p>
               </div>
            </div>
          )}

          {/* --- ME --- */}
          {activeTab === "account" && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto space-y-6 pb-10">
               <div className="p-12 bg-linear-to-br from-white/10 to-white/5 border border-white/20 rounded-[50px] text-center shadow-3xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#00f2ff] to-transparent opacity-50 shadow-glow" />
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <img src={user?.imageUrl} className="w-full h-full rounded-[40px] object-cover border-4 border-white/10 shadow-2xl" alt="Node" />
                    <div className="absolute -bottom-2 -right-2 bg-black border-2 border-[#00f2ff] p-2 rounded-2xl text-[#00f2ff] shadow-glow"><Fingerprint size={16}/></div>
                  </div>
                  <h3 className="text-4xl font-black italic uppercase tracking-tighter mb-2">{user?.fullName}</h3>
                  <div className="inline-flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/5 mb-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00f2ff]">Identity Tier 1</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <button onClick={() => setActiveTab('earnings')} className="py-5 bg-white text-black rounded-[28px] font-black uppercase italic text-[11px] hover:bg-[#00f2ff] transition-all shadow-xl">Vault Sync</button>
                     <button onClick={() => setActiveTab('settings')} className="py-5 bg-white/5 border border-white/10 rounded-[28px] font-black uppercase italic text-[11px] hover:bg-white/10 transition-all">Config Hub</button>
                  </div>
               </div>
               <div className="flex justify-center pt-4">
                  <SignOutButton><button className="px-10 py-5 bg-red-500/5 border-2 border-red-500/10 text-red-500 font-black italic rounded-[30px] uppercase text-[10px] hover:bg-red-500 hover:text-white transition-all shadow-2xl active:scale-95">Terminate Session</button></SignOutButton>
               </div>
            </motion.div>
          )}

          {/* --- SETTINGS (HIGH-FIDELITY) --- */}
          {activeTab === "settings" && (
            <div className="space-y-6 max-w-xl mx-auto">
               <h3 className="text-2xl font-bold uppercase px-2 tracking-widest">Node <span className="text-[#00f2ff]">Terminal</span></h3>
               <div className="p-10 bg-white/3 border border-white/10 rounded-[45px] space-y-8 shadow-3xl backdrop-blur-2xl">
                  <div className="flex justify-between items-center group cursor-pointer">
                     <div className="flex items-center gap-4">
                        <div className="p-4 bg-white/5 rounded-[22px] group-hover:bg-[#00f2ff]/10 transition-colors shadow-inner"><Moon size={22} className="text-[#00f2ff]"/></div>
                        <div><h4 className="text-xs font-black uppercase tracking-widest">Stealth Protocol</h4><p className="text-[9px] text-gray-500 italic">Invisible mission routing</p></div>
                     </div>
                     <div className="w-10 h-5 bg-white/10 rounded-full p-1 flex justify-end items-center"><div className="w-3 h-3 bg-[#00f2ff] rounded-full shadow-glow" /></div>
                  </div>
                  
                  <div className="flex justify-between items-center group cursor-pointer" onClick={() => showAlert("Interface Signal", "Accent palette synchronized.", "info")}>
                     <div className="flex items-center gap-4">
                        <div className="p-4 bg-white/5 rounded-[22px] group-hover:bg-[#00f2ff]/10 transition-colors shadow-inner"><Palette size={22} className="text-[#00f2ff]"/></div>
                        <div><h4 className="text-xs font-black uppercase tracking-widest">Neon Interface</h4><p className="text-[9px] text-gray-500 italic">Toggle core holographic accent</p></div>
                     </div>
                     <ChevronRight size={16} className="text-gray-600 group-hover:translate-x-2 transition-transform"/>
                  </div>

                  <div className="flex justify-between items-center opacity-40 cursor-not-allowed border-t border-white/5 pt-8">
                     <div className="flex items-center gap-4">
                        <div className="p-4 bg-white/5 rounded-[22px] shadow-inner"><Fingerprint size={22}/></div>
                        <div><h4 className="text-xs font-black uppercase tracking-widest">Biometric Relay</h4><p className="text-[9px] text-gray-500 italic">Verify node identity to unlock</p></div>
                     </div>
                     <Lock size={16} className="text-gray-600"/>
                  </div>

                  <div className="pt-6 border-t border-white/5">
                    <button onClick={() => showAlert("System Saved", "Global configuration saved.", "success")} className="w-full py-5 bg-white text-black font-black italic rounded-3xl text-[11px] uppercase hover:bg-[#00f2ff] transition-all shadow-xl tracking-widest">Apply Handshake</button>
                    <p className="w-full text-[8px] font-bold text-gray-700 uppercase tracking-[0.5em] text-center mt-6">Build Revision 4.0.2 - STABLE</p>
                  </div>
               </div>
            </div>
          )}

          {/* --- HELP --- */}
          {activeTab === "support" && (
             <div className="grid md:grid-cols-2 gap-4">
                <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] shadow-2xl">
                   <h4 className="text-xs font-black uppercase text-[#00f2ff] mb-6 tracking-widest italic">Protocol FAQ</h4>
                   {['Vault Safety Matrix', 'Settlement Latency', 'Screening Protocol'].map(q => (
                     <button key={q} onClick={handleSupportEmail} className="w-full flex justify-between items-center p-4 bg-black/40 rounded-2xl mb-3 text-left hover:bg-white/5 border border-transparent hover:border-white/5 transition-all">
                        <span className="text-[10px] font-bold italic">{q}</span>
                        <ChevronRight size={14} className="text-[#00f2ff]" />
                     </button>
                   ))}
                </div>
                <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] text-center flex flex-col justify-center gap-4 shadow-2xl">
                   <HelpCircle size={48} className="mx-auto text-[#00f2ff] opacity-40" />
                   <p className="text-[10px] text-gray-500 uppercase font-bold">Assistance Relay:</p>
                   <p className="text-xs font-black italic text-white">notifications.nexusgigs@gmail.com</p>
                   <button onClick={handleSupportEmail} className="mt-4 py-4 bg-[#00f2ff] text-black font-black rounded-2xl text-[10px] uppercase shadow-glow active:scale-95 transition-transform">Initialize Uplink</button>
                </div>
             </div>
          )}

        </AnimatePresence>
      </div>

      {/* --- NAV DOCK --- */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-100 w-[94%] max-w-xl">
        <div className="h-16 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-full flex items-center justify-around px-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center gap-0.5 transition-all duration-300 ${activeTab === item.id ? 'text-[#00f2ff] scale-110' : 'text-gray-500 hover:text-white'}`}>
              <div className={activeTab === item.id ? "bg-[#00f2ff]/10 p-1.5 rounded-xl border border-[#00f2ff]/20 shadow-glow" : ""}>{item.icon}</div>
              <span className="text-[6px] font-black uppercase tracking-tighter opacity-70">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* --- VERIFICATION MODAL --- */}
      <AnimatePresence>
        {showVerifyModal && (
          <div className="fixed inset-0 z-200 flex items-center justify-center p-6 backdrop-blur-md bg-black/60">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0" onClick={() => !isPaying && setShowVerifyModal(false)} />
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="relative w-full max-w-90 bg-[#0a0f1e] border-2 border-white/10 rounded-[45px] p-10 text-center shadow-[0_0_100px_rgba(0,242,255,0.1)] overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#00f2ff] to-transparent shadow-glow" />
              
              {paymentStep === "terms" ? (
                <div className="space-y-6">
                  <ShieldCheck size={40} className="text-[#00f2ff] mx-auto shadow-glow" />
                  <h3 className="text-xl font-black italic uppercase tracking-tight">Identity Sync</h3>
                  
                  <div className="bg-white/5 p-5 rounded-3xl text-left border border-white/5 space-y-4">
                     <p className="text-[10px] text-gray-300 font-bold italic leading-relaxed">1. Pay $10 Handshake fee.</p>
                     <p className="text-[10px] text-gray-400 italic leading-tight">2. Pass the technical survey and screening Zoom call.</p>
                     <div className="pt-2 border-t border-white/5">
                        <p className="text-[9px] text-emerald-400 font-bold italic flex items-center gap-2"><CheckCircle2 size={10}/> 100% Refund if you fail screening.</p>
                     </div>
                  </div>
                  
                  {/* AGREEMENT CHECKBOX */}
                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/5 cursor-pointer text-left transition-all hover:bg-white/10" onClick={() => setAgreedToTerms(!agreedToTerms)}>
                     <div className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all shrink-0 ${agreedToTerms ? 'bg-[#00f2ff] border-[#00f2ff]' : 'border-white/20'}`}>
                        {agreedToTerms && <X size={12} className="text-black font-black"/>}
                     </div>
                     <span className="text-[9px] font-black italic text-gray-400 leading-tight uppercase">I agree to the $10 fee, survey, and screening refund policy.</span>
                  </div>

                  <button disabled={!agreedToTerms} onClick={() => setPaymentStep("choice")} className={`w-full py-5 rounded-[25px] font-black uppercase italic text-[11px] transition-all tracking-[0.2em] ${agreedToTerms ? 'bg-[#00f2ff] text-black shadow-glow hover:scale-[1.02]' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}>Accept & Sync</button>
                </div>
              ) : paymentStep === "choice" ? (
                <div className="space-y-6">
                  <h3 className="text-md font-black uppercase italic tracking-widest text-[#00f2ff]">Select Relay</h3>
                  <div className="space-y-3">
                    <button onClick={() => handleSecurePayment("CARD")} className="w-full py-4 bg-white text-black font-black rounded-2xl text-[10px] uppercase italic flex items-center justify-center gap-3 tracking-widest"><CreditCard size={14}/> Global Card</button>
                    <button onClick={() => setPaymentStep("mpesa")} className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl text-[10px] uppercase italic flex items-center justify-center gap-3 tracking-widest shadow-lg"><Smartphone size={14}/> M-Pesa Direct</button>
                  </div>
                  <button onClick={() => setPaymentStep("terms")} className="text-[9px] text-gray-500 uppercase font-black italic tracking-[0.3em]">Go Back</button>
                </div>
              ) : (
                <div className="space-y-8">
                   <Smartphone size={32} className="text-emerald-500 mx-auto animate-bounce" />
                   <input value={mpesaNumber} onChange={e => setMpesaNumber(e.target.value)} placeholder="2547XXXXXXXX" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-center text-2xl font-black text-white outline-none focus:border-emerald-500 shadow-inner" />
                   <div className="space-y-4">
                    <button disabled={isPaying} onClick={() => handleSecurePayment("M-PESA")} className={`w-full py-5 bg-emerald-600 text-white font-black rounded-2xl uppercase italic text-[11px] shadow-lg tracking-widest`}>{isPaying ? "ENCRYPTING..." : "Transmit KES 1,300"}</button>
                    <button onClick={() => setPaymentStep("choice")} className="text-[9px] text-gray-500 uppercase font-black italic tracking-widest">Back</button>
                   </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- ALERT POPUP --- */}
      <AnimatePresence>
        {customAlert.show && (
          <div className="fixed inset-0 z-300 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-75 bg-[#0a0f1e] border-2 border-white/10 rounded-[40px] p-8 text-center shadow-3xl relative">
                <div className={`absolute top-0 left-0 w-full h-1.5 ${customAlert.type === 'error' ? 'bg-red-500' : 'bg-[#00f2ff] shadow-glow'}`} />
                <div className="mb-6 flex justify-center">
                  {customAlert.type === 'error' ? <AlertTriangle size={32} className="text-red-500" /> : <CheckCircle size={32} className="text-emerald-500" />}
                </div>
                <h4 className="text-md font-black uppercase italic mb-3 text-white tracking-tighter leading-none">{customAlert.title}</h4>
                <p className="text-[10px] text-gray-400 italic mb-8 leading-relaxed tracking-wide">{customAlert.msg}</p>
                <button onClick={() => setCustomAlert({...customAlert, show: false})} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase italic hover:bg-white hover:text-black transition-all">Dismiss Signal</button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .perspective-1000 { perspective: 1000px; }
        .shadow-glow { box-shadow: 0 0 15px rgba(0, 242, 255, 0.3); }
      `}</style>
    </div>
  );
};