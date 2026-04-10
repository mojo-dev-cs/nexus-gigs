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
  Shield, QrCode, ScanFace, Award, Target, TrendingUp, Layers,
  Share2, Send, MessageCircle
} from "lucide-react";

export const FreelancerView = ({ jobs, userMetadata }: { jobs: any[], userMetadata: any }) => {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("home");
  
  // --- 🛡️ STATE MANAGEMENT ---
  const [isVerified, setIsVerified] = useState(userMetadata?.status === "Verified");
  const [isUnderReview, setIsUnderReview] = useState(userMetadata?.status === "Pending");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [supportMsg, setSupportMsg] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [currency, setCurrency] = useState<"USD" | "KES">("USD");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [expandedMsg, setExpandedMsg] = useState<number | null>(null);
  
  const [customAlert, setCustomAlert] = useState<{show: boolean, title: string, msg: string, type: 'info' | 'error' | 'success'}>({
    show: false, title: '', msg: '', type: 'info'
  });

  const [paymentStep, setPaymentStep] = useState<"terms" | "choice" | "card" | "mpesa">("terms");

  const showAlert = (title: string, msg: string, type: 'info' | 'error' | 'success' = 'info') => {
    setCustomAlert({ show: true, title, msg, type });
  };

  // --- 🔗 HANDSHAKE LOGIC ---
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
              status: "Pending",
              method: "Nexus Global Relay"
            }),
          });
          if (response.ok) {
            showAlert("Under Review", "Payment received. We are checking your account. The survey form will be shared via email soon.", "success");
            setIsUnderReview(true);
          }
        } catch (error) {
          console.error("sync error:", error);
        }
      }
    };
    finalizeHandshake();
  }, [searchParams, isLoaded, user, isVerified]);

  const handleVerifyClick = () => {
    if (isVerified) return showAlert("Verified", "Your node is already authenticated.", "success");
    if (isUnderReview) return showAlert("Account Under Review", "Verification is in progress. The survey form will be shared via email. If review fails, your refund will be processed.", "info");
    setShowVerifyModal(true);
  };

  const handleSecurePayment = async (method: "M-PESA" | "CARD") => {
    if (!agreedToTerms) return showAlert("Notice", "Please agree to the screening rules.", "info");
    setIsPaying(true);

    if (method === "M-PESA") {
      const cleanPhone = mpesaNumber.replace(/\D/g, ''); 
      if (!cleanPhone.startsWith("254") || cleanPhone.length !== 12) {
        setIsPaying(false);
        return showAlert("Phone Error", "Please use 2547XXXXXXXX.", "error");
      }
      try {
        const response = await fetch("/api/intasend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            amount: 1300, 
            phone: cleanPhone, 
            email: user?.primaryEmailAddress?.emailAddress, 
            firstName: user?.firstName, 
            lastName: user?.lastName, 
            method: "M-PESA" 
          }),
        });
        if (response.ok) {
          showAlert("PIN Prompt Sent", "Check your phone to enter your PIN.", "success");
          setShowVerifyModal(false);
        }
      } catch (error) { showAlert("Error", "Relay failed.", "error"); }
      finally { setIsPaying(false); }
    } else {
      try {
        const response = await fetch("/api/paystack", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            amount: 1000, 
            currency: "USD",
            email: user?.primaryEmailAddress?.emailAddress, 
            firstName: user?.firstName, 
            lastName: user?.lastName 
          }),
        });
        const data = await response.json();
        if (data.status && data.data.authorization_url) window.location.href = data.data.authorization_url; 
      } catch (error) { showAlert("Error", "Relay down.", "error"); }
      finally { setIsPaying(false); }
    }
  };

  const handleSupportEmail = () => {
    if(!supportMsg) return showAlert("Wait", "Please type your issue in the box first.", "info");
    window.location.href = `mailto:support.nexusgigs@gmail.com?subject=Support&body=Msg: ${supportMsg}%0D%0AID: ${user?.id}`;
  };

  const marketplaceGigs = useMemo(() => [
    { id: "1", title: "Enterprise: Cloud Network Audit", budget: 850, client: "TechFlow Systems", rating: 5.0, dur: "4 Days", img: "https://i.pravatar.cc/150?u=tech", type: "Company", status: "Active" },
    { id: "2", title: "Assignment: Advanced Math Solutions", budget: 60, client: "Mark Thompson", rating: 4.8, dur: "12 Hours", img: "https://i.pravatar.cc/150?u=mark", type: "Academic", status: "Active" },
    { id: "3", title: "Startup: Mobile App UI/UX Design", budget: 1200, client: "Nova Labs", rating: 5.0, dur: "Expired", img: "https://i.pravatar.cc/150?u=nova", type: "Agency", status: "Expired" },
    { id: "4", title: "Company: Fullstack React Fixes", budget: 350, client: "Julia Cody", rating: 4.9, dur: "24 Hours", img: "https://i.pravatar.cc/150?u=julia", type: "Startup", status: "Active" },
    { id: "5", title: "Technical: Rust Smart Contract Audit", budget: 2000, client: "Polygon Hub", rating: 5.0, dur: "3 Days", img: "https://i.pravatar.cc/150?u=poly", type: "Web3", status: "Active" },
    { id: "6", title: "Assignment: Psychology Case Study", budget: 100, client: "Liam G.", rating: 4.7, dur: "Expired", img: "https://i.pravatar.cc/150?u=liam", type: "Academic", status: "Expired" },
  ], []);

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

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-[#00f2ff]/30 pb-24 overflow-x-hidden text-sm">
      <div className="fixed inset-0 pointer-events-none">
        <motion.div animate={{ opacity: [0.1, 0.15, 0.1] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto pt-6 px-4 relative z-10">
        <AnimatePresence mode="wait">
          
          {/* --- 🏠 HOME --- */}
          {activeTab === "home" && (
            <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <header className="flex justify-between items-center bg-white/5 backdrop-blur-xl p-5 rounded-[25px] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#00f2ff]" />
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest leading-none">Node Operator</p>
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter">{user?.firstName || "Nexus Node"}</h2>
                </div>
                <div className="flex items-center gap-3 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                   <div className={`w-2 h-2 rounded-full ${isVerified ? 'bg-[#00f2ff] shadow-[0_0_10px_#00f2ff]' : isUnderReview ? 'bg-amber-500 animate-pulse shadow-[0_0_10px_orange]' : 'bg-red-500 shadow-[0_0_10px_red]'}`} />
                   <span className="text-[8px] font-bold uppercase tracking-widest">{isVerified ? "VERIFIED" : isUnderReview ? "REVIEWING" : "UNVERIFIED"}</span>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-8 bg-linear-to-br from-[#00f2ff]/10 to-transparent border border-[#00f2ff]/20 rounded-[30px] shadow-2xl flex flex-col justify-between">
                  <div><p className="text-[8px] font-bold uppercase text-[#00f2ff] mb-1">My Assets</p><h3 className="text-4xl font-black mb-4 tracking-tighter">$0.00</h3></div>
                  <button onClick={() => setActiveTab("earnings")} className="w-full py-3 bg-white text-black font-black rounded-xl text-[10px] uppercase hover:bg-[#00f2ff] transition-all shadow-lg">Vault Hub</button>
                </div>

                {!isVerified && (
                  <div className="md:col-span-2 p-8 bg-white/5 border border-white/10 rounded-[30px] flex items-center gap-6 backdrop-blur-md relative overflow-hidden shadow-2xl border-l-4 border-l-[#00f2ff]">
                    <div className="w-14 h-14 bg-[#00f2ff]/10 rounded-2xl flex items-center justify-center text-[#00f2ff] shadow-inner shrink-0"><ShieldCheck size={32}/></div>
                    <div className="flex-1">
                        <h4 className="text-md font-bold uppercase tracking-tight">Identity Check</h4>
                        <p className="text-[10px] text-gray-400 mb-4 leading-relaxed">Unlock high-paying jobs and withdrawals. Review process takes 24 hours.</p>
                        <button onClick={handleVerifyClick} className="px-8 py-3 bg-[#00f2ff] text-black rounded-xl text-[9px] font-black uppercase italic tracking-widest hover:scale-105 active:scale-95 transition-all shadow-glow">{isUnderReview ? "Status: Pending" : "Start Handshake"}</button>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 bg-white/3 border border-white/5 rounded-[40px] shadow-2xl">
                 <div className="flex justify-between items-center mb-6 px-2">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Mission Status</h4>
                    <span className="text-[10px] font-black text-[#00f2ff]">Beta Relay</span>
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { l: "Jobs", v: "0", i: <Target size={14} className="text-[#00f2ff]"/> },
                      { l: "Uptime", v: "99.9%", i: <Activity size={14} className="text-emerald-500"/> },
                      { l: "Level", v: "Tier 1", i: <Cpu size={14} className="text-amber-500"/> },
                      { l: "Score", v: "0.0", i: <Star size={14} className="text-purple-500"/> }
                    ].map((st, i) => (
                      <div key={i} className="bg-black/20 p-4 rounded-2xl border border-white/5 text-center">
                         <div className="mb-1 flex justify-center">{st.i}</div>
                         <p className="text-xs font-black">{st.v}</p>
                         <p className="text-[7px] font-bold text-gray-600 uppercase leading-none">{st.l}</p>
                      </div>
                    ))}
                 </div>
              </div>
            </motion.div>
          )}

          {/* --- 💼 GIGS --- */}
          {activeTab === "tasks" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-xl font-bold uppercase tracking-tighter">Mission <span className="text-[#00f2ff]">Feed</span></h3>
                <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" /><span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Live</span></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {marketplaceGigs.map((g) => (
                  <div key={g.id} className={`p-5 rounded-[25px] bg-white/5 border border-white/10 transition-all ${g.status === 'Expired' ? 'opacity-40 grayscale' : 'hover:border-[#00f2ff]/30 shadow-xl'}`}>
                    <div className="flex justify-between items-start mb-3"><img src={g.img} className="w-10 h-10 rounded-xl object-cover border border-white/10" alt="cl" /><span className={`text-[8px] font-bold px-2 py-1 rounded-lg uppercase ${g.status === 'Active' ? 'bg-[#00f2ff]/10 text-[#00f2ff]' : 'bg-white/5 text-gray-500'}`}>{g.dur}</span></div>
                    <h4 className="text-xs font-black uppercase mb-1 line-clamp-2 h-8 leading-tight">{g.title}</h4>
                    <div className="flex justify-between items-center pt-3 border-t border-white/5"><p className="text-md font-bold text-[#00f2ff] tracking-tighter">${g.budget}</p><button onClick={handleVerifyClick} className="px-4 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all bg-white text-black hover:bg-[#00f2ff]">Bid</button></div>
                  </div>
                ))}
                <button onClick={handleVerifyClick} className="p-5 rounded-[25px] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-all group min-h-40">
                   <Lock size={20} className="text-gray-500 group-hover:text-[#00f2ff] transition-colors" />
                   <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest text-center">Verify Node to Unlock<br/>1.2k+ Specialist Gigs</p>
                </button>
              </div>
            </motion.div>
          )}

          {/* --- 📜 WORK --- */}
          {activeTab === "contracts" && (
            <div className="pt-10 px-4 text-center space-y-6">
               <div className="p-16 bg-white/5 border border-red-500/20 rounded-[50px] shadow-3xl">
                  <ShieldAlert size={50} className="mx-auto text-red-500 mb-6" />
                  <h3 className="text-xl font-black uppercase tracking-widest text-white italic">History Locked</h3>
                  <p className="text-gray-400 text-[11px] mb-8 max-w-xs mx-auto">Please finish your Identity Handshake to decrypt and view your mission history.</p>
                  <button onClick={handleVerifyClick} className="w-full py-5 bg-red-600 text-white font-black rounded-2xl text-[10px] uppercase shadow-lg hover:scale-105 transition-all">Unlock History</button>
               </div>
            </div>
          )}

          {/* --- 💬 CHATS --- */}
          {activeTab === "messages" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
               <h3 className="text-xl font-bold uppercase px-2 tracking-[0.3em]">Console <span className="text-[#00f2ff]">Log</span></h3>
               {[
                 { t: "Nexus HQ", m: "Welcome. Please complete your identity sync to access global chat." },
                 { t: "Security Bot", m: "System status: Operational. Handshake is recommended." }
               ].map((msg, i) => (
                 <div key={i} onClick={() => setExpandedMsg(expandedMsg === i ? null : i)} className="p-6 rounded-[30px] bg-white/3 border border-white/5 group cursor-pointer hover:bg-white/5 transition-all">
                    <div className="flex gap-4 items-center">
                       <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-[#00f2ff]"><MessageSquare size={16}/></div>
                       <div className="flex-1 text-[10px]">
                          <h4 className="font-black uppercase italic text-white leading-none mb-1">{msg.t}</h4>
                          <p className={`text-gray-400 ${expandedMsg === i ? "" : "line-clamp-1"}`}>{msg.m}</p>
                       </div>
                       <ChevronDown size={14} className={`text-gray-600 transition-transform ${expandedMsg === i ? "rotate-180" : ""}`}/>
                    </div>
                 </div>
               ))}
            </motion.div>
          )}

          {/* --- 💰 VAULT --- */}
          {activeTab === "earnings" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-center">
               <div className="flex justify-between items-center px-2">
                  <h3 className="text-xl font-bold uppercase tracking-widest text-left">Vault <span className="text-[#00f2ff]">Hub</span></h3>
                  <div className="p-1.5 bg-white/5 rounded-xl flex gap-1 border border-white/5">
                     <button onClick={() => setCurrency("USD")} className={`px-4 py-1.5 rounded-lg text-[8px] font-black transition-all ${currency === "USD" ? "bg-[#00f2ff] text-black shadow-lg" : "text-gray-500"}`}>USD</button>
                     <button onClick={() => setCurrency("KES")} className={`px-4 py-1.5 rounded-lg text-[8px] font-black transition-all ${currency === "KES" ? "bg-[#00f2ff] text-black shadow-lg" : "text-gray-500"}`}>KES</button>
                  </div>
               </div>
               <div className="p-12 bg-linear-to-br from-white/10 to-white/5 border border-white/20 rounded-[50px] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5"><Wallet size={120}/></div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Total Available</p>
                  <h4 className="text-6xl font-black italic tracking-tighter mb-10 text-white">{currency === "USD" ? "$0.00" : "KES 0"}</h4>
                  <button onClick={() => showAlert("Balance Insufficient", "There is no balance in your vault to withdraw at this time.", "error")} className="flex items-center gap-3 px-12 py-5 bg-white text-black rounded-2xl text-[11px] font-black uppercase italic mx-auto shadow-xl active:scale-95 transition-all">Withdraw <ArrowUpRight size={16}/></button>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-white/5 border border-white/10 rounded-[30px]"><p className="text-[8px] font-black text-gray-500 uppercase mb-1">Earnings</p><p className="text-lg font-black">$0.00</p></div>
                  <div className="p-6 bg-white/5 border border-white/10 rounded-[30px]"><p className="text-[8px] font-black text-gray-500 uppercase mb-1">In Review</p><p className="text-lg font-black">$0.00</p></div>
               </div>
            </motion.div>
          )}

          {/* --- 📊 STATS --- */}
          {activeTab === "analytics" && (
            <div className="space-y-8">
               <h3 className="text-xl font-bold uppercase px-2 tracking-widest text-left">My <span className="text-[#00f2ff]">Pulse</span></h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { l: "Success", v: "0%", i: <CheckCircle2 size={16} className="text-emerald-500"/> },
                    { l: "Missions", v: "0", i: <Briefcase size={16} className="text-blue-500"/> },
                    { l: "Trust", v: "Beta", i: <ShieldCheck size={16} className="text-purple-500"/> },
                    { l: "Balance", v: "$0.00", i: <DollarSign size={16} className="text-yellow-500"/> }
                  ].map(stat => (
                    <div key={stat.l} className="p-6 bg-white/5 border border-white/10 rounded-[25px] text-center shadow-xl">
                       <div className="mb-2 flex justify-center">{stat.i}</div>
                       <p className="text-[8px] font-bold text-gray-500 uppercase mb-1">{stat.l}</p>
                       <p className="text-lg font-black">{stat.v}</p>
                    </div>
                  ))}
               </div>
               <div className="p-16 bg-white/2 border border-white/5 rounded-[40px] text-center opacity-40 backdrop-blur-md shadow-inner">
                  <Activity size={40} className="mx-auto text-[#00f2ff] mb-4"/>
                  <p className="text-[10px] font-black uppercase tracking-widest leading-loose">Handshake required to<br/>reveal performance data.</p>
               </div>
            </div>
          )}

          {/* --- 👤 ME --- */}
          {activeTab === "account" && (
            <div className="max-w-xl mx-auto space-y-6 text-center">
               <div className="p-12 bg-linear-to-br from-white/10 to-white/5 border border-white/20 rounded-[60px] shadow-3xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#00f2ff] to-transparent shadow-glow" />
                  <div className="relative w-28 h-28 mx-auto mb-8 bg-white/10 rounded-[35px] border border-white/10 flex items-center justify-center">
                    <UserCircle size={55} className="text-gray-500"/>
                    <div className="absolute -bottom-2 -right-2 bg-black border-2 border-[#00f2ff] p-2 rounded-2xl text-[#00f2ff] shadow-glow"><Fingerprint size={16}/></div>
                  </div>
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-2 leading-none">{user?.fullName}</h3>
                  <p className="text-[10px] font-black text-[#00f2ff] uppercase tracking-[0.4em] mb-10 italic">Identity Tier 1</p>
                  <div className="grid grid-cols-2 gap-4">
                     <button onClick={() => setActiveTab('earnings')} className="py-5 bg-white text-black rounded-[25px] font-black uppercase text-[10px] shadow-xl active:scale-95 transition-all">Vault Hub</button>
                     <button onClick={() => setActiveTab('settings')} className="py-5 bg-white/5 border border-white/10 rounded-[25px] font-black uppercase text-[10px]">Settings</button>
                  </div>
               </div>
               <SignOutButton><button className="px-12 py-5 bg-red-500/10 border-2 border-red-500/20 text-red-500 font-black italic rounded-full uppercase text-[10px] tracking-widest active:scale-95 transition-all">Sign Out</button></SignOutButton>
            </div>
          )}

          {/* --- 🛠️ HELP --- */}
          {activeTab === "support" && (
             <div className="space-y-6">
                <h3 className="text-xl font-bold uppercase px-2 tracking-widest text-[#00f2ff]">Help <span className="text-white">Relay</span></h3>
                <div className="grid md:grid-cols-2 gap-5">
                   <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] space-y-6 shadow-2xl">
                      <div className="space-y-1"><p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Support Email</p><p className="text-xs font-black italic text-white underline cursor-pointer" onClick={() => window.location.href="mailto:support.nexusgigs@gmail.com"}>support.nexusgigs@gmail.com</p></div>
                      <div className="space-y-1"><p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">WhatsApp Support</p><p className="text-xs font-black italic text-emerald-400">+254 113 637325</p></div>
                      <div className="pt-4 border-t border-white/5">
                        <textarea value={supportMsg} onChange={e => setSupportMsg(e.target.value)} placeholder="Explain your problem here..." className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs font-bold outline-none focus:border-[#00f2ff] h-28 mb-4 shadow-inner text-white" />
                        <button onClick={handleSupportEmail} className="w-full py-4 bg-[#00f2ff] text-black font-black rounded-2xl text-[10px] uppercase shadow-glow active:scale-95 transition-all">Send Message</button>
                      </div>
                   </div>
                   <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] grid grid-cols-2 gap-3 shadow-2xl">
                      {[
                        { n: 'Instagram', i: <Share2 size={18}/>, l: 'https://www.instagram.com/nexusgigs' },
                        { n: 'TikTok', i: <Zap size={18}/>, l: 'https://www.tiktok.com/@nexusgigss' },
                        { n: 'Telegram', i: <Send size={18}/>, l: 'https://t.me/nexusGigs' },
                        { n: 'Facebook', i: <Globe size={18}/>, l: 'https://www.facebook.com/share/1CJMYz5kGH/' }
                      ].map(soc => (
                        <button key={soc.n} onClick={() => window.open(soc.l, '_blank')} className="p-4 bg-black/40 border border-white/5 rounded-2xl flex flex-col items-center gap-2 hover:border-[#00f2ff] group transition-all">
                           <div className="text-gray-400 group-hover:text-white transition-colors">{soc.i}</div>
                           <span className="text-[8px] font-black uppercase text-gray-500">{soc.n}</span>
                        </button>
                      ))}
                      <button onClick={() => window.open('https://whatsapp.com/channel/0029VbCmx1AAu3aMiY7XVf1J', '_blank')} className="col-span-2 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-[25px] flex items-center justify-between group hover:bg-emerald-500 transition-all shadow-lg">
                         <span className="text-[10px] font-black uppercase italic group-hover:text-black">WhatsApp Channel</span>
                         <MessageCircle size={18} className="text-emerald-500 group-hover:text-black"/>
                      </button>
                   </div>
                </div>
             </div>
          )}

          {/* --- ⚙️ CONFIG --- */}
          {activeTab === "settings" && (
            <div className="space-y-6 max-w-xl mx-auto text-sm font-bold">
               <h3 className="text-2xl font-bold uppercase px-2 tracking-widest text-[#00f2ff]">Terminal <span className="text-white">Settings</span></h3>
               <div className="p-10 bg-white/3 border border-white/10 rounded-[45px] space-y-8 shadow-3xl backdrop-blur-2xl">
                  <div className="flex justify-between items-center group cursor-pointer">
                     <div className="flex items-center gap-4">
                        <div className="p-4 bg-white/5 rounded-[22px] group-hover:bg-[#00f2ff]/10 transition-colors shadow-inner"><Moon size={22} className="text-[#00f2ff]"/></div>
                        <div><h4 className="text-xs font-black uppercase tracking-widest leading-none">Stealth Mode</h4><p className="text-[9px] text-gray-500 italic mt-1 font-bold">Hide node signature</p></div>
                     </div>
                     <div className="w-10 h-5 bg-white/10 rounded-full p-1 flex justify-end items-center"><div className="w-3 h-3 bg-[#00f2ff] rounded-full shadow-glow" /></div>
                  </div>
                  <div className="flex justify-between items-center group cursor-pointer" onClick={() => showAlert("Saved", "Primary color changed.", "success")}>
                     <div className="flex items-center gap-4">
                        <div className="p-4 bg-white/5 rounded-[22px] group-hover:bg-[#00f2ff]/10 transition-colors shadow-inner"><Palette size={22} className="text-[#00f2ff]"/></div>
                        <div><h4 className="text-xs font-black uppercase tracking-widest leading-none">Neon UI</h4><p className="text-[9px] text-gray-500 italic mt-1 font-bold">Toggle core theme</p></div>
                     </div>
                     <ChevronRight size={16} className="text-gray-600 group-hover:translate-x-2 transition-transform"/>
                  </div>
                  <div className="flex justify-between items-center opacity-40 cursor-not-allowed border-t border-white/5 pt-8">
                     <div className="flex items-center gap-4">
                        <div className="p-4 bg-white/5 rounded-[22px] shadow-inner"><Fingerprint size={22}/></div>
                        <div><h4 className="text-xs font-black uppercase tracking-widest leading-none">Biometric Auth</h4><p className="text-[9px] text-gray-500 italic mt-1 font-bold">Verify account to unlock</p></div>
                     </div>
                     <Lock size={16} className="text-gray-600"/>
                  </div>
                  <div className="pt-6 border-t border-white/5">
                    <button onClick={() => showAlert("Saved", "Global settings applied.", "success")} className="w-full py-5 bg-white text-black font-black italic rounded-3xl text-[10px] uppercase hover:bg-[#00f2ff] transition-all shadow-xl tracking-widest">Apply Config</button>
                    <p className="w-full text-[8px] font-bold text-gray-700 uppercase tracking-[0.5em] text-center mt-6">Build 4.0.2 - STABLE</p>
                  </div>
               </div>
            </div>
          )}

        </AnimatePresence>
      </div>

      {/* --- SLIM NAV BAR --- */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-100 w-[94%] max-w-xl">
        <div className="h-16 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-full flex items-center justify-around px-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center gap-0.5 transition-all duration-300 ${activeTab === item.id ? 'text-[#00f2ff] scale-110' : 'text-gray-500 hover:text-white'}`}>
              <div className={activeTab === item.id ? "bg-[#00f2ff]/10 p-1.5 rounded-xl border border-[#00f2ff]/20 shadow-glow" : ""}>{item.icon}</div>
              <span className="text-[6px] font-black uppercase tracking-tighter opacity-70 leading-none">{item.label}</span>
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
                  <h3 className="text-xl font-black italic uppercase tracking-tight text-white">Identity Check</h3>
                  <div className="bg-white/5 p-5 rounded-3xl text-left border border-white/5 space-y-4 shadow-inner">
                     <p className="text-[10px] text-gray-300 font-bold italic leading-relaxed">1. Pay $10 fee.</p>
                     <p className="text-[10px] text-gray-400 italic leading-tight">2. Pass the email survey and Zoom call.</p>
                     <div className="pt-2 border-t border-white/5"><p className="text-[9px] text-emerald-400 font-bold italic flex items-center gap-2 leading-none"><CheckCircle2 size={10}/> 100% Refund if you fail the call.</p></div>
                  </div>
                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/5 cursor-pointer text-left transition-all hover:bg-white/10" onClick={() => setAgreedToTerms(!agreedToTerms)}><div className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all shrink-0 ${agreedToTerms ? 'bg-[#00f2ff] border-[#00f2ff]' : 'border-white/20'}`}>{agreedToTerms && <X size={12} className="text-black font-black"/>}</div><span className="text-[9px] font-black italic text-gray-400 leading-tight uppercase">I agree to the $10 fee, survey, and screening refund rules.</span></div>
                  <button disabled={!agreedToTerms} onClick={() => setPaymentStep("choice")} className={`w-full py-5 rounded-[25px] font-black uppercase italic text-[11px] transition-all tracking-[0.2em] ${agreedToTerms ? 'bg-[#00f2ff] text-black shadow-glow hover:scale-[1.02]' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}>Pay & Sync</button>
                </div>
              ) : paymentStep === "choice" ? (
                <div className="space-y-6 text-sm">
                  <h3 className="text-md font-black uppercase italic tracking-widest text-[#00f2ff]">Pay $10</h3>
                  <div className="space-y-3">
                    <button onClick={() => handleSecurePayment("CARD")} className="w-full py-4 bg-white text-black font-black rounded-2xl text-[10px] uppercase italic flex items-center justify-center gap-3 tracking-widest shadow-xl"><CreditCard size={14}/> Card</button>
                    <button onClick={() => setPaymentStep("mpesa")} className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl text-[10px] uppercase italic flex items-center justify-center gap-3 tracking-widest shadow-lg"><Smartphone size={14}/> M-Pesa</button>
                  </div>
                  <button onClick={() => setPaymentStep("terms")} className="text-[9px] text-gray-500 uppercase font-black italic tracking-[0.3em]">Go Back</button>
                </div>
              ) : (
                <div className="space-y-8">
                   <Smartphone size={32} className="text-emerald-500 mx-auto animate-bounce" />
                   <div className="space-y-2"><h3 className="text-lg font-black uppercase italic text-white">M-Pesa Sync</h3><p className="text-[10px] text-gray-500 font-bold uppercase">Enter phone for protocol relay</p></div>
                   <input value={mpesaNumber} onChange={e => setMpesaNumber(e.target.value)} placeholder="2547XXXXXXXX" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-center text-2xl font-black text-white outline-none focus:border-emerald-500 shadow-inner" />
                   <div className="space-y-4"><button disabled={isPaying} onClick={() => handleSecurePayment("M-PESA")} className={`w-full py-5 bg-emerald-600 text-white font-black rounded-2xl uppercase italic text-[11px] shadow-lg tracking-widest`}>{isPaying ? "Sending..." : "Transmit $10 (1,300 KES)"}</button><button onClick={() => setPaymentStep("choice")} className="text-[9px] text-gray-500 uppercase font-black italic tracking-widest">Back</button></div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {customAlert.show && (
          <div className="fixed inset-0 z-300 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-75 bg-[#0a0f1e] border-2 border-white/10 rounded-[40px] p-8 text-center shadow-3xl relative">
                <div className={`absolute top-0 left-0 w-full h-1.5 ${customAlert.type === 'error' ? 'bg-red-500' : 'bg-[#00f2ff] shadow-glow'}`} />
                <div className="mb-6 flex justify-center">{customAlert.type === 'error' ? <AlertTriangle size={32} className="text-red-500" /> : customAlert.type === 'success' ? <CheckCircle size={32} className="text-emerald-500" /> : <Info size={32} className="text-[#00f2ff]" />}</div>
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