"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, Briefcase, FileText, MessageSquare, 
  Wallet, BarChart3, User, Settings, 
  ShieldCheck, Zap, Globe, Lock, Rocket, 
  Smartphone, CreditCard, ChevronRight, AlertTriangle,
  Star, Clock, Bell, Info, ShieldAlert, CheckCircle2,
  Cpu, Moon, Palette, Fingerprint, ChevronDown, MousePointer2,
  Activity, Landmark, Bitcoin, HelpCircle, LifeBuoy, X, CheckCircle
} from "lucide-react";

export const FreelancerView = ({ jobs, userMetadata }: { jobs: any[], userMetadata: any }) => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("home");
  const [isVerified, setIsVerified] = useState(userMetadata?.status === "Verified");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [currency, setCurrency] = useState<"USD" | "KES">("USD");
  
  // --- 💎 CUSTOM 3D ALERT STATE ---
  const [customAlert, setCustomAlert] = useState<{show: boolean, title: string, msg: string, type: 'info' | 'error' | 'success'}>({
    show: false, title: '', msg: '', type: 'info'
  });

  const [paymentStep, setPaymentStep] = useState<"terms" | "choice" | "card" | "mpesa">("terms");
  const [expandedMsg, setExpandedMsg] = useState<number | null>(null);

  const showAlert = (title: string, msg: string, type: 'info' | 'error' | 'success' = 'info') => {
    setCustomAlert({ show: true, title, msg, type });
  };

  // --- 📲 DIRECT STK PUSH HANDSHAKE ---
  const handleIntasendPayment = async (method: "M-PESA" | "CARD") => {
    if (method === "M-PESA") {
      const cleanPhone = mpesaNumber.replace(/\D/g, ''); 
      if (!cleanPhone.startsWith("254") || cleanPhone.length !== 12) {
        return showAlert("Format Error", "Please use 2547XXXXXXXX format (12 digits).", "error");
      }
    }

    setIsPaying(true);
    try {
      const response = await fetch("/api/intasend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 1300, // $10.00 (KES 1,300)
          phone: mpesaNumber.replace(/\D/g, ''), 
          email: user?.primaryEmailAddress?.emailAddress,
          firstName: user?.firstName,
          lastName: user?.lastName,
          method: method
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showAlert("Signal Received", "Check your phone for the M-Pesa PIN prompt to finalize the handshake.", "success");
        setShowVerifyModal(false);
      } else {
        showAlert("Uplink Denied", data.message || "Protocol Error", "error");
      }
    } catch (error) {
      showAlert("Sync Lost", "Server is not responding to the handshake.", "error");
    } finally {
      setIsPaying(false);
    }
  };

  const navItems = [
    { id: 'home', icon: <Home size={20}/>, label: 'Home' },
    { id: 'tasks', icon: <Briefcase size={20}/>, label: 'Gigs' },
    { id: 'contracts', icon: <FileText size={20}/>, label: 'Work' },
    { id: 'messages', icon: <MessageSquare size={20}/>, label: 'Chats' },
    { id: 'earnings', icon: <Wallet size={20}/>, label: 'Vault' },
    { id: 'analytics', icon: <BarChart3 size={20}/>, label: 'Stats' },
    { id: 'support', icon: <LifeBuoy size={20}/>, label: 'Support' },
    { id: 'account', icon: <User size={20}/>, label: 'Profile' },
    { id: 'settings', icon: <Settings size={20}/>, label: 'Config' },
  ];

  // --- 💼 MODERN GIG DATA ---
  const marketplaceGigs = useMemo(() => [
    { id: "1", title: "Academic Writing: 5000 word document", budget: 150, client: "Julia Cody", rating: 5.0, dur: "2 Days", img: "https://i.pravatar.cc/150?u=company1", type: "Company", status: "Active" },
    { id: "2", title: "Python Data Science Assignment", budget: 45, client: "Kevin S.", rating: 4.8, dur: "5 Hours", img: "https://i.pravatar.cc/150?u=student1", type: "Student", status: "Active" },
    { id: "3", title: "Cyber Security Protocol Scan", budget: 1200, client: "SafeNet Berlin", rating: 5.0, dur: "Expired", img: "https://i.pravatar.cc/150?u=company2", type: "Company", status: "Expired" },
    { id: "4", title: "React Native UI Bug Fixes", budget: 150, client: "Clinton Devs", rating: 4.9, dur: "10 Hours", img: "https://i.pravatar.cc/150?u=company3", type: "Company", status: "Active" },
    { id: "5", title: "C++ Homework Relay", budget: 30, client: "Sarah J.", rating: 4.5, dur: "3 Hours", img: "https://i.pravatar.cc/150?u=student2", type: "Student", status: "Active" },
    { id: "6", title: "Backend API Sync", budget: 700, client: "Global Hub", rating: 5.0, dur: "Expired", img: "https://i.pravatar.cc/150?u=company4", type: "Company", status: "Expired" },
  ], []);

  const handleSupportEmail = () => {
    const mailtoLink = `mailto:notifications.nexusgigs@gmail.com?subject=Support Request: ${user?.firstName}&body=User ID: ${user?.id}%0D%0AIssue Details: `;
    window.location.href = mailtoLink;
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-[#00f2ff]/30 pb-32 overflow-x-hidden">
      
      {/* BACKGROUND AMBIENCE */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div animate={{ opacity: [0.1, 0.2, 0.1] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute top-0 right-0 w-125 h-125 bg-blue-600/10 blur-[120px] rounded-full" />
        <motion.div animate={{ opacity: [0.05, 0.15, 0.05] }} transition={{ repeat: Infinity, duration: 8 }} className="absolute bottom-0 left-0 w-125 h-125 bg-[#00f2ff]/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto pt-10 px-6 relative z-10">
        <AnimatePresence mode="wait">
          
          {/* --- 🏠 TAB: HOME --- */}
          {activeTab === "home" && (
            <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-8">
              <header className="flex justify-between items-center bg-white/3 backdrop-blur-xl p-8 rounded-[40px] border border-white/10 shadow-2xl">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">{user?.firstName}</h2>
                <div className="flex items-center gap-4 bg-black/40 px-6 py-3 rounded-2xl border border-white/5">
                   <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-2.5 h-2.5 bg-[#00f2ff] rounded-full shadow-[0_0_15px_#00f2ff]" />
                   <span className="text-[10px] font-black uppercase tracking-widest">{isVerified ? "VERIFIED" : "UNVERIFIED"}</span>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div whileHover={{ scale: 1.02 }} className="p-10 bg-linear-to-br from-[#00f2ff]/20 to-transparent border-2 border-[#00f2ff]/30 rounded-[50px] shadow-2xl relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 p-6 opacity-10 group-hover:opacity-30 transition-all group-hover:rotate-12"><Wallet size={80} className="text-[#00f2ff]"/></div>
                  <p className="text-[10px] font-black uppercase text-[#00f2ff] mb-2 italic tracking-[0.2em]">Account Balance</p>
                  <h3 className="text-5xl font-black italic mb-8">$0.00</h3>
                  <button onClick={() => showAlert("Withdrawal Denied", "Minimum withdrawal threshold is $10.00. Keep completing missions to unlock funds.", "info")} className="w-full py-4 bg-white text-black font-black rounded-2xl text-[10px] uppercase hover:bg-[#00f2ff] transition-all tracking-[0.2em] shadow-xl active:scale-95">Withdraw Funds</button>
                </motion.div>
                
                <div className="md:col-span-2 p-10 bg-white/3 border border-[#00f2ff]/20 rounded-[50px] flex items-center gap-8 shadow-3xl backdrop-blur-md relative overflow-hidden">
                   <div className="w-20 h-20 bg-[#00f2ff]/10 rounded-3xl flex items-center justify-center text-[#00f2ff] shrink-0"><ShieldCheck size={40}/></div>
                   <div className="flex-1">
                      <h4 className="text-2xl font-black italic uppercase mb-2 tracking-tighter">Account Verification</h4>
                      <p className="text-xs text-gray-400 italic mb-6 leading-relaxed">Activation requires a one-time protocol fee. This eliminates fake nodes and optimizes global mission routing for verified freelancers. Safe, secure, and refundable.</p>
                      <button onClick={() => { setPaymentStep("terms"); setShowVerifyModal(true); }} className="flex items-center gap-2 text-[10px] font-black uppercase text-[#00f2ff] hover:text-white transition-all group">
                         Verify Now <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* --- 💼 TAB: GIGS (MODERN CARDS) --- */}
          {activeTab === "tasks" && (
            <motion.div key="tasks" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} className="space-y-10">
              <div className="flex justify-between items-end border-b border-white/10 pb-6">
                <h3 className="text-4xl font-black uppercase italic tracking-tighter">Gigs <span className="text-[#00f2ff]">Feed</span></h3>
                <div className="flex items-center gap-2 bg-[#00f2ff]/10 px-4 py-1.5 rounded-full border border-[#00f2ff]/20">
                   <div className="w-1.5 h-1.5 bg-[#00f2ff] rounded-full animate-ping" />
                   <p className="text-[9px] font-black text-[#00f2ff] uppercase italic tracking-widest">Live Feed</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {marketplaceGigs.map((g, i) => (
                  <motion.div key={g.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -8 }} className={`p-8 rounded-[45px] bg-white/3 border border-white/10 transition-all duration-500 shadow-2xl backdrop-blur-md group ${g.status === 'Expired' ? 'grayscale opacity-40' : 'hover:border-[#00f2ff]/40'}`}>
                    <div className="flex justify-between items-start mb-6">
                       <img src={g.img} className="w-16 h-16 rounded-2xl border-2 border-white/10 group-hover:rotate-6 transition-transform object-cover" alt="Avatar" />
                       <div className="text-right">
                          <div className="flex items-center gap-1 bg-black/40 px-3 py-1 rounded-full mb-2"><Star size={10} className="text-yellow-400 fill-yellow-400" /><span className="text-[10px] font-black">{g.rating}</span></div>
                          <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${g.type === 'Company' ? 'border-[#00f2ff] text-[#00f2ff]' : 'border-purple-500 text-purple-500'}`}>{g.type}</span>
                       </div>
                    </div>
                    <h4 className="text-lg font-black italic uppercase mb-2 leading-tight h-12 overflow-hidden">{g.title}</h4>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-8">{g.client}</p>
                    <div className="flex justify-between items-center pt-6 border-t border-white/5">
                       <p className="text-2xl font-black text-[#00f2ff] tracking-tighter">${g.budget}</p>
                       <button onClick={() => { setPaymentStep("terms"); setShowVerifyModal(true); }} className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase italic transition-all ${g.status === 'Expired' ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-white text-black hover:bg-[#00f2ff] shadow-lg'}`}>{g.status === 'Expired' ? 'Expired' : 'Bid Now'}</button>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-center pt-10"><button onClick={() => { setPaymentStep("terms"); setShowVerifyModal(true); }} className="px-12 py-5 border-2 border-[#00f2ff]/30 rounded-full text-xs font-black uppercase italic text-[#00f2ff] hover:bg-[#00f2ff] hover:text-black transition-all shadow-[0_0_30px_rgba(0,242,255,0.15)]">See More (Verify Node)</button></div>
            </motion.div>
          )}

          {/* --- 📜 TAB: WORK --- */}
          {activeTab === "contracts" && (
            <motion.div key="work" initial={{ opacity: 0, rotateY: 90 }} animate={{ opacity: 1, rotateY: 0 }} className="pt-20">
               <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="p-16 bg-white/2 border-2 border-red-500/20 rounded-[60px] text-center space-y-8 max-w-2xl mx-auto shadow-3xl backdrop-blur-2xl">
                  <ShieldAlert size={80} className="mx-auto text-red-500 animate-pulse" />
                  <h3 className="text-3xl font-black uppercase italic text-white tracking-tighter">Account ENCRYPTED</h3>
                  <p className="text-gray-400 text-xs italic leading-loose px-4">Account Alert: Your profile history is locked. You must establish a secure connection ($10.00) to decrypt history and begin live engagements.</p>
                  <button onClick={() => { setPaymentStep("terms"); setShowVerifyModal(true); }} className="px-14 py-6 bg-red-500 text-white font-black rounded-2xl text-[10px] uppercase italic hover:scale-105 transition-all shadow-2xl">Initialize Verification</button>
               </motion.div>
            </motion.div>
          )}

          {/* --- 💬 TAB: CHATS --- */}
          {activeTab === "messages" && (
            <motion.div key="chats" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
               <h3 className="text-3xl font-black uppercase italic border-b border-white/10 pb-4 tracking-tighter">Command <span className="text-[#00f2ff]">Feed</span></h3>
               <div className="space-y-4">
                  {[
                    { id: 0, t: "Welcome", m: `Greetings ${user?.firstName}. Welcome to NexusGigs. Your account is currently in guest mode. To begin receiving gigs from global clients, please proceed to Verification ($10). This activates your secure vault.`, icon: <Bell className="text-black"/>, bg: "bg-[#00f2ff]" },
                    { id: 1, t: "Market Alert", m: "Global rates for UI Audits have surged by 20%. Verification is required to access these high-tier missions.", icon: <Info className="text-gray-400"/>, bg: "bg-white/5" },
                    { id: 2, t: "Sync Status", m: "Account handshake optimized at 0.02ms. Global relay connection is 100% stable.", icon: <Activity size={20} className="text-emerald-400"/>, bg: "bg-white/5" }
                  ].map((notif, idx) => (
                    <motion.div 
                      key={notif.id} 
                      layout
                      onClick={() => setExpandedMsg(expandedMsg === idx ? null : idx)} 
                      className={`p-8 rounded-[35px] border border-white/10 shadow-xl cursor-pointer transition-all ${notif.bg} ${expandedMsg === idx ? 'scale-[1.02]' : 'hover:bg-white/10'}`}
                    >
                       <div className="flex gap-6 items-start">
                          <div className={`p-4 rounded-2xl shrink-0 ${notif.bg === 'bg-white/5' ? 'bg-white/10' : 'bg-white/20'}`}>{notif.icon}</div>
                          <div className="flex-1">
                             <p className={`text-[10px] font-black uppercase italic ${notif.bg === 'bg-[#00f2ff]' ? 'text-black/60' : 'text-[#00f2ff]'}`}>System Relay</p>
                             <h4 className={`text-lg font-black italic uppercase ${notif.bg === 'bg-[#00f2ff]' ? 'text-black' : 'text-white'}`}>{notif.t}</h4>
                             <AnimatePresence>
                               {expandedMsg === idx && (
                                 <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className={`mt-4 text-xs italic leading-relaxed ${notif.bg === 'bg-[#00f2ff]' ? 'text-black/80' : 'text-gray-400'}`}>
                                   {notif.m}
                                 </motion.p>
                               )}
                             </AnimatePresence>
                          </div>
                          <ChevronDown className={`transition-transform ${expandedMsg === idx ? 'rotate-180' : ''} ${notif.bg === 'bg-[#00f2ff]' ? 'text-black' : ''}`} />
                       </div>
                    </motion.div>
                  ))}
               </div>
            </motion.div>
          )}

          {/* --- 💰 TAB: VAULT --- */}
          {activeTab === "earnings" && (
            <motion.div key="vault" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="p-14 bg-linear-to-br from-emerald-500/20 to-transparent border-2 border-emerald-500/30 rounded-[60px] text-center shadow-3xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-6 opacity-10"><Zap size={100} className="text-emerald-400" /></div>
                     <p className="text-[11px] font-black text-emerald-400 uppercase italic tracking-[0.5em] mb-4 relative z-10">Available Balance</p>
                     <h4 className="text-[6rem] font-black italic tracking-tighter text-white relative z-10 leading-none">{currency === "USD" ? "$0.00" : "KES 0"}</h4>
                     <div className="mt-4 inline-flex items-center gap-2 bg-emerald-500/10 px-4 py-1 rounded-full"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /><span className="text-[8px] font-black uppercase text-emerald-500">Live </span></div>
                  </div>
                  <div className="p-14 bg-white/2 border border-white/10 rounded-[60px] text-center shadow-xl relative overflow-hidden">
                     <p className="text-[11px] font-black text-amber-500 uppercase italic tracking-[0.5em] mb-4 relative z-10">Pending Balance</p>
                     <h4 className="text-[4rem] font-black italic text-gray-600 relative z-10 leading-none">{currency === "USD" ? "$0.00" : "KES 0"}</h4>
                     <p className="mt-4 text-[8px] font-black uppercase text-gray-500 tracking-widest italic">Calculating settlements...</p>
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { l: "Mpesa ", i: <Smartphone size={24}/>, d: "Instant Sync", c: "hover:border-emerald-500" },
                    { l: "Bank payment", i: <Landmark size={24}/>, d: "Swift Transfer", c: "hover:border-blue-500" },
                    { l: "crypto Payout", i: <Bitcoin size={24}/>, d: "Crypto Swap", c: "hover:border-[#00f2ff]" }
                  ].map(btn => (
                    <motion.button key={btn.l} onClick={() => showAlert("Insufficient Funds", "Minimal withdrawal is $10.00. Continue bidding to reach quota.", "info")} whileHover={{ y: -8 }} className={`p-10 bg-black/40 border border-white/10 rounded-[45px] flex flex-col items-center gap-4 transition-all shadow-xl group ${btn.c}`}>
                       <div className="text-[#00f2ff] group-hover:scale-110 transition-transform">{btn.i}</div>
                       <div className="text-center">
                          <span className="block text-[11px] font-black uppercase italic tracking-widest text-white">{btn.l}</span>
                          <span className="block text-[8px] font-black uppercase italic text-gray-500 mt-1">{btn.d}</span>
                       </div>
                    </motion.button>
                  ))}
               </div>
            </motion.div>
          )}

          {/* --- 📊 TAB: ANALYTICS --- */}
          {activeTab === "analytics" && (
            <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
               <h3 className="text-3xl font-black uppercase italic border-b border-white/10 pb-4 tracking-tighter">Account <span className="text-[#00f2ff]">Metrics</span></h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="p-16 bg-white/2 border border-white/10 rounded-[70px] text-center shadow-3xl relative overflow-hidden">
                     <div className="flex items-end justify-center gap-5 h-48 mb-12">
                        {[40, 70, 30, 90, 60, 100, 85].map((h, i) => (
                           <motion.div key={i} animate={{ height: [`${h}%`, `${h+10}%`, `${h}%`] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }} className="w-10 bg-[#00f2ff] rounded-t-xl shadow-[0_0_30px_rgba(0,242,255,0.4)]" />
                        ))}
                     </div>
                     <p className="text-[12px] font-black uppercase italic text-gray-500 tracking-[0.5em]">Global Matrix</p>
                  </div>
                  <div className="space-y-4 flex flex-col justify-center">
                     {[{ l: "Success Rate", v: "0%", g: "UNSTAINED", c: "text-emerald-400" }, { l: "Reputation Score", v: "0.0", g: "ELITE", c: "text-[#00f2ff]" }].map(s => (
                       <motion.div key={s.l} whileHover={{ x: 10 }} className="p-8 bg-white/3 border border-white/5 rounded-3xl flex justify-between items-center shadow-xl">
                          <p className="text-[10px] font-black uppercase italic text-gray-500">{s.l}</p>
                          <div className="text-right"><p className="text-2xl font-black italic">{s.v}</p><p className={`text-[8px] font-black ${s.c} uppercase tracking-widest`}>{s.g}</p></div>
                       </motion.div>
                     ))}
                  </div>
               </div>
            </motion.div>
          )}

          {/* --- 🛠️ TAB: SUPPORT --- */}
          {activeTab === "support" && (
            <motion.div key="support" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
               <h3 className="text-3xl font-black uppercase italic border-b border-white/10 pb-4 tracking-tighter">Support <span className="text-[#00f2ff]">Terminal</span></h3>
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="p-10 bg-white/2 border border-white/10 rounded-[50px] space-y-6 shadow-3xl backdrop-blur-xl">
                     <h4 className="text-lg font-black uppercase italic text-[#00f2ff]">General Assistance</h4>
                     <div className="space-y-4">
                        {['Account Connection Issues', 'Mission Bidding Rules', 'Withdrawal Protocols', 'Verification Help'].map(item => (
                          <div key={item} onClick={handleSupportEmail} className="flex justify-between items-center p-5 bg-black/40 border border-white/5 rounded-2xl hover:bg-white/5 transition-all cursor-pointer">
                             <span className="text-xs font-bold text-gray-300 italic">{item}</span>
                             <ChevronRight size={14} className="text-[#00f2ff]" />
                          </div>
                        ))}
                     </div>
                  </div>
                  <div className="p-10 bg-white/2 border border-white/10 rounded-[50px] flex flex-col justify-center text-center space-y-6 shadow-3xl">
                     <div className="p-6 bg-[#00f2ff]/10 rounded-full mx-auto w-fit"><HelpCircle size={48} className="text-[#00f2ff]" /></div>
                     <h4 className="text-xl font-black uppercase italic">Direct Assistance</h4>
                     <p className="text-gray-400 text-xs italic px-6 leading-loose">Transmit your technical account issues directly to our team at <span className="text-[#00f2ff]">notifications.nexusgigs@gmail.com</span></p>
                     <button onClick={handleSupportEmail} className="px-10 py-4 bg-[#00f2ff] text-black font-black rounded-3xl uppercase italic text-[11px] shadow-xl">Initialize Direct Uplink</button>
                  </div>
               </div>
            </motion.div>
          )}

          {/* --- 👤 TAB: PROFILE --- */}
          {activeTab === "account" && (
            <motion.div key="profile" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto space-y-10">
               <div className="p-16 bg-white/3 border border-white/10 rounded-[70px] text-center shadow-3xl relative overflow-hidden">
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <img src={user?.imageUrl} className="w-full h-full rounded-[40px] border-4 border-[#00f2ff]/20 shadow-2xl object-cover" alt="P" />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-black rounded-full border-2 border-[#00f2ff] flex items-center justify-center text-[#00f2ff] shadow-glow"><Cpu size={14}/></div>
                  </div>
                  <h3 className="text-5xl font-black italic uppercase tracking-tighter mb-4">{user?.fullName}</h3>
                  <p className="text-[#00f2ff] text-[10px] font-black uppercase italic tracking-[0.5em] mb-12">Status-Level 1</p>
                  <div className="grid grid-cols-2 gap-6">
                     <motion.button whileTap={{ scale: 0.95 }} onClick={() => setActiveTab('earnings')} className="p-8 bg-[#00f2ff] text-black rounded-[35px] font-black uppercase italic text-[12px] shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3">
                        Withdraw <MousePointer2 size={16}/>
                     </motion.button>
                     <motion.button whileTap={{ scale: 0.95 }} onClick={() => setActiveTab('settings')} className="p-8 bg-white/5 border border-white/10 rounded-[35px] font-black uppercase italic text-[12px] hover:bg-white/10 transition-all">Settings</motion.button>
                  </div>
               </div>
               <div className="flex justify-center"><SignOutButton><button className="px-10 py-5 bg-red-500/10 border-2 border-red-500/20 text-red-500 font-black italic rounded-3xl uppercase text-[10px] hover:bg-red-500 hover:text-white transition-all tracking-[0.3em]">Logout Connection</button></SignOutButton></div>
            </motion.div>
          )}

          {/* --- ⚙️ TAB: SETTINGS --- */}
          {activeTab === "settings" && (
            <motion.div key="settings" initial={{ opacity: 0, rotateY: 20 }} animate={{ opacity: 1, rotateY: 0 }} className="space-y-8">
               <h3 className="text-3xl font-black uppercase italic tracking-tighter border-b border-white/10 pb-4">Configuration <span className="text-[#00f2ff]">Hub</span></h3>
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="p-10 bg-white/2 border border-white/10 rounded-[50px] space-y-10 shadow-3xl backdrop-blur-xl">
                     <div className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-4"><div className="p-4 bg-[#00f2ff]/10 rounded-2xl text-[#00f2ff]"><Moon size={24}/></div><span className="text-sm font-black uppercase italic">Stealth Protocol</span></div>
                        <div className="w-14 h-7 bg-white/10 rounded-full p-1 flex justify-end items-center"><div className="w-5 h-5 bg-[#00f2ff] rounded-full shadow-[0_0_15px_#00f2ff]" /></div>
                     </div>
                     <div className="flex items-center justify-between group cursor-pointer" onClick={() => showAlert("Interface Reset", "System neon palette synchronized.", "info")}>
                        <div className="flex items-center gap-4"><div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500"><Palette size={24}/></div><span className="text-sm font-black uppercase italic">Neon Interface</span></div>
                        <ChevronRight className="text-gray-600 group-hover:translate-x-2 transition-transform" />
                     </div>
                  </div>
                  <div className="p-10 bg-white/2 border border-white/10 rounded-[50px] space-y-10 shadow-3xl backdrop-blur-xl">
                     <div className="flex items-center justify-between opacity-50 cursor-not-allowed">
                        <div className="flex items-center gap-4"><div className="p-4 bg-purple-500/10 rounded-2xl text-purple-500"><Fingerprint size={24}/></div><span className="text-sm font-black uppercase italic">Biometric Handshake</span></div>
                        <span className="text-[9px] font-black text-purple-400 bg-purple-400/10 px-3 py-1 rounded-lg">ENCRYPTED</span>
                     </div>
                     <div className="flex items-center justify-between group cursor-pointer" onClick={() => setActiveTab('analytics')}>
                        <div className="flex items-center gap-4"><div className="p-4 bg-white/5 rounded-2xl text-white"><Cpu size={24}/></div><span className="text-sm font-black uppercase italic">Logs</span></div>
                        <ChevronRight className="text-gray-600 group-hover:translate-x-2 transition-transform" />
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* --- 📱 NAV DOCK --- */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-100 w-[94%] max-w-3xl overflow-x-auto no-scrollbar rounded-[45px]">
        <div className="h-24 bg-black/60 backdrop-blur-[50px] border border-white/10 rounded-[45px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex items-center px-10 min-w-max gap-8 border-t-white/10">
          {navItems.map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)} 
              className={`flex flex-col items-center p-4 rounded-3xl transition-all duration-500 group relative shrink-0 ${activeTab === item.id ? 'text-[#00f2ff] scale-110' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            >
              {activeTab === item.id && <motion.div layoutId="navGlow" className="absolute inset-0 bg-[#00f2ff]/10 rounded-3xl border border-[#00f2ff]/20 blur-sm shadow-[0_0_20px_#00f2ff20]" />}
              <span className="relative z-10 transition-transform group-hover:scale-110 group-hover:-translate-y-1">{item.icon}</span>
              <span className="text-[7px] font-black uppercase mt-2 tracking-tighter relative z-10">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* --- 🚨 MODAL: TWO-STEP ACTIVATION --- */}
      <AnimatePresence>
        {showVerifyModal && (
          <div className="fixed inset-0 z-200 flex items-center justify-center p-6 backdrop-blur-3xl">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80" onClick={() => !isPaying && setShowVerifyModal(false)} />
            <motion.div initial={{ scale: 0.9, y: 50, rotateX: 20 }} animate={{ scale: 1, y: 0, rotateX: 0 }} exit={{ scale: 0.9, y: 50, rotateX: 20 }} className="relative w-full max-w-md bg-[#0a0f1e] border-2 border-white/10 rounded-[70px] p-16 text-center shadow-[0_0_120px_rgba(0,242,255,0.15)] overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#00f2ff] to-transparent" />
              
              {paymentStep === "terms" ? (
                <div className="space-y-10">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-10 border border-white/10 shadow-[0_0_30px_#00f2ff20]"><ShieldCheck size={48} className="text-[#00f2ff]" /></div>
                  <h3 className="text-4xl font-black italic uppercase text-white tracking-tighter leading-tight">ACCOUNT <br /><span className="text-[#00f2ff]">VALIDATION</span></h3>
                  <div className="bg-[#00f2ff]/5 border border-[#00f2ff]/20 p-6 rounded-3xl space-y-4 text-left">
                     <p className="text-[10px] font-black text-[#00f2ff] uppercase italic tracking-widest flex items-center justify-center gap-2">
                        <CheckCircle2 size={12}/> Protocol Check
                     </p>
                     <p className="text-[10px] text-gray-400 italic leading-relaxed">
                       Activation requires a mandatory Account Validation Survey. If your account profile fails the survey, or activation is unsuccessful, a **100% Automatic Refund** is issued to your payment method immediately.
                     </p>
                  </div>
                  <div className="space-y-4">
                    <button onClick={() => setPaymentStep("choice")} className="w-full py-6 bg-[#00f2ff] text-black font-black rounded-4xl uppercase text-xs italic shadow-2xl hover:scale-105 active:scale-95 transition-all">Agree & Continue →</button>
                    <button onClick={() => setShowVerifyModal(false)} className="text-[10px] text-gray-600 font-black uppercase italic tracking-[0.4em] hover:text-white transition-colors">Decline Terms</button>
                  </div>
                </div>
              ) : paymentStep === "choice" ? (
                <div className="space-y-10">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-10 border border-white/10 shadow-[0_0_30px_#00f2ff20]"><CreditCard size={48} className="text-[#00f2ff]" /></div>
                  <h3 className="text-4xl font-black italic uppercase text-white tracking-tighter leading-tight">SELECT <br /><span className="text-[#00f2ff]">METHOD</span></h3>
                  <div className="space-y-4 text-center">
                    <p className="text-[10px] font-black text-gray-500 uppercase italic mb-4">Activation Fee: $10.00</p>
                    <button disabled className="w-full py-6 bg-white/5 text-gray-500 font-black rounded-4xl uppercase text-xs italic border border-white/10 cursor-not-allowed opacity-50 flex items-center justify-center gap-2">💳 Card payment (Disabled)</button>
                    <button onClick={() => setPaymentStep("mpesa")} className="w-full py-6 bg-emerald-600 text-white font-black rounded-4xl uppercase text-xs italic shadow-2xl hover:scale-105 active:scale-95 transition-all">📱 M-Pesa Direct Sync</button>
                  </div>
                  <button onClick={() => setPaymentStep("terms")} className="text-[10px] text-gray-500 font-black uppercase italic tracking-widest hover:text-white transition-colors">Back to Terms</button>
                </div>
              ) : (
                <div className="space-y-10">
                   <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-10 border border-white/10">
                     <Smartphone size={40} className="text-emerald-500" />
                   </div>
                   <h3 className="text-3xl font-black italic uppercase text-white tracking-tighter leading-tight">SECURE <br /><span className="text-[#00f2ff]">HANDSHAKE</span></h3>
                   
                   <input value={mpesaNumber} onChange={e => setMpesaNumber(e.target.value)} placeholder="2547XXXXXXXX" className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-center text-2xl font-black outline-none focus:border-emerald-500 text-white tracking-[0.4em] shadow-inner" />
                   
                   <div className="space-y-4">
                    <button disabled={isPaying} onClick={() => handleIntasendPayment("M-PESA")} className={`w-full py-6 bg-emerald-600 text-white font-black rounded-3xl uppercase text-xs italic shadow-2xl transition-all hover:scale-105 active:scale-95`}>
                      {isPaying ? "ENCRYPTING..." : `Transfer KES 1,300 ($10.00)`}
                    </button>
                    <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest italic">Protected by Nexus Secure Refund Protocol</p>
                   </div>
                   <button onClick={() => setPaymentStep("choice")} className="text-[10px] text-gray-500 font-black uppercase italic tracking-widest hover:text-white transition-colors">Go Back</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- 💎 CUSTOM 3D ALERT SYSTEM --- */}
      <AnimatePresence>
        {customAlert.show && (
          <div className="fixed inset-0 z-300 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
             <motion.div initial={{ scale: 0.8, opacity: 0, rotateX: 20 }} animate={{ scale: 1, opacity: 1, rotateX: 0 }} exit={{ scale: 0.8, opacity: 0 }} className="w-full max-w-sm bg-[#0a0f1e] border-2 border-white/10 rounded-[50px] p-10 text-center shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 ${customAlert.type === 'error' ? 'bg-red-500' : customAlert.type === 'success' ? 'bg-emerald-500' : 'bg-[#00f2ff]'}`} />
                
                <div className="mb-6 flex justify-center">
                  {customAlert.type === 'error' && <AlertTriangle size={48} className="text-red-500" />}
                  {customAlert.type === 'success' && <CheckCircle size={48} className="text-emerald-500" />}
                  {customAlert.type === 'info' && <Info size={48} className="text-[#00f2ff]" />}
                </div>

                <h4 className="text-xl font-black uppercase italic mb-4 tracking-tighter text-white">{customAlert.title}</h4>
                <p className="text-xs text-gray-400 italic leading-relaxed mb-8">{customAlert.msg}</p>

                <button onClick={() => setCustomAlert({...customAlert, show: false})} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase italic hover:bg-white hover:text-black transition-all">Close</button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .shadow-glow { box-shadow: 0 0 15px rgba(0, 242, 255, 0.4); }
      `}</style>
    </div>
  );
};