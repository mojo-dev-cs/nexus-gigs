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
            showAlert("Done!", "Payment received. You are now verified. Check your email in 24 hours.", "success");
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
    if (!agreedToTerms) return showAlert("Wait", "Please check the box to agree to the rules.", "info");
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
          body: JSON.stringify({ amount: 10, phone: cleanPhone, email: user?.primaryEmailAddress?.emailAddress, firstName: user?.firstName, lastName: user?.lastName, method: "M-PESA" }),
        });
        if (response.ok) {
          showAlert("Check Phone", "Enter your M-Pesa PIN now.", "success");
          setShowVerifyModal(false);
        } else {
          showAlert("Busy", "M-Pesa is slow. Try using a Card.", "error");
        }
      } catch (error) {
        showAlert("Error", "Could not connect.", "error");
      } finally {
        setIsPaying(false);
      }
    } else {
      try {
        const response = await fetch("/api/paystack", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: 10, email: user?.primaryEmailAddress?.emailAddress, firstName: user?.firstName, lastName: user?.lastName }),
        });
        const data = await response.json();
        if (data.status && data.data.authorization_url) {
          window.location.href = data.data.authorization_url; 
        }
      } catch (error) { showAlert("Error", "Card system down.", "error"); }
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

  const marketplaceGigs = useMemo(() => [
    { id: "1", title: "Write a 5000 word travel blog post", budget: 150, client: "Sarah Jenkins", rating: 5.0, dur: "2 Days", img: "https://i.pravatar.cc/150?u=sarah", type: "Expert", status: "Active" },
    { id: "2", title: "Simple Python script for data cleanup", budget: 45, client: "Mark Thompson", rating: 4.8, dur: "5 Hours", img: "https://i.pravatar.cc/150?u=mark", type: "Dev", status: "Active" },
    { id: "3", title: "Design a modern logo for a tech startup", budget: 120, client: "Julia Cody", rating: 5.0, dur: "1 Day", img: "https://i.pravatar.cc/150?u=julia", type: "Designer", status: "Active" },
    { id: "4", title: "React UI component fix (Dark Mode)", budget: 90, client: "Kevin S.", rating: 4.9, dur: "10 Hours", img: "https://i.pravatar.cc/150?u=kevin", type: "Company", status: "Active" },
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
          
          {/* --- 🏠 HOME --- */}
          {activeTab === "home" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <header className="flex justify-between items-center bg-white/5 backdrop-blur-xl p-5 rounded-[25px] border border-white/10">
                <h2 className="text-lg font-bold uppercase">{user?.firstName || "Welcome"}</h2>
                <div className="flex items-center gap-3 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                   <div className={`w-2 h-2 rounded-full ${isVerified ? 'bg-[#00f2ff]' : 'bg-red-500'}`} />
                   <span className="text-[8px] font-bold uppercase tracking-widest">{isVerified ? "VERIFIED" : "UNVERIFIED"}</span>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 bg-linear-to-br from-[#00f2ff]/10 to-transparent border border-[#00f2ff]/20 rounded-[30px]">
                  <p className="text-[8px] font-bold uppercase text-[#00f2ff] mb-1">My Balance</p>
                  <h3 className="text-3xl font-bold mb-4">$0.00</h3>
                  <button onClick={() => setActiveTab("earnings")} className="w-full py-2.5 bg-white text-black font-bold rounded-lg text-[10px] uppercase hover:bg-[#00f2ff]">View Vault</button>
                </div>
                
                {!isVerified && (
                  <div className="md:col-span-2 p-6 bg-white/5 border border-white/10 rounded-[30px] flex items-center gap-6">
                    <ShieldCheck size={28} className="text-[#00f2ff] shrink-0"/>
                    <div className="flex-1">
                        <h4 className="text-md font-bold uppercase">Unlock Your Gigs</h4>
                        <p className="text-[10px] text-gray-400 mb-3">Pay $10 once to unlock all jobs and withdraw your earnings.</p>
                        <button onClick={() => { setPaymentStep("terms"); setShowVerifyModal(true); }} className="text-[9px] font-bold uppercase text-[#00f2ff] flex items-center gap-1">Verify Now <ChevronRight size={12} /></button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* --- 💼 GIGS --- */}
          {activeTab === "tasks" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <h3 className="text-xl font-bold uppercase">Available <span className="text-[#00f2ff]">Jobs</span></h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {marketplaceGigs.map((g) => (
                  <div key={g.id} className="p-5 rounded-[25px] bg-white/5 border border-white/10 hover:border-[#00f2ff]/30 transition-all">
                    <div className="flex justify-between items-start mb-3">
                       <img src={g.img} className="w-10 h-10 rounded-lg object-cover" alt="client" />
                       <span className="text-[8px] font-bold bg-white/5 px-2 py-1 rounded text-gray-400 uppercase">{g.dur}</span>
                    </div>
                    <h4 className="text-xs font-bold uppercase mb-1 line-clamp-2 h-8">{g.title}</h4>
                    <div className="flex items-center gap-2 mb-4">
                       <p className="text-[8px] text-gray-500 font-bold uppercase">{g.client}</p>
                       <div className="flex items-center gap-1 text-yellow-400"><Star size={8} fill="currentColor"/><span className="text-[8px] font-bold text-white">{g.rating}</span></div>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-white/5">
                       <p className="text-md font-bold text-[#00f2ff]">${g.budget}</p>
                       <button onClick={() => setShowVerifyModal(true)} className="px-4 py-1.5 rounded-lg text-[8px] font-bold uppercase bg-white text-black hover:bg-[#00f2ff]">Apply</button>
                    </div>
                  </div>
                ))}
                <button onClick={() => setShowVerifyModal(true)} className="p-5 rounded-[25px] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-all group">
                   <Lock size={20} className="text-gray-500 group-hover:text-[#00f2ff]" />
                   <p className="text-[9px] font-bold text-gray-500 uppercase">Verify to see 500+ more</p>
                </button>
              </div>
            </motion.div>
          )}

          {/* --- 📜 WORK --- */}
          {activeTab === "contracts" && (
            <div className="pt-10">
               <div className="p-10 bg-white/5 border border-red-500/20 rounded-[35px] text-center space-y-4 max-w-md mx-auto">
                  <ShieldAlert size={48} className="mx-auto text-red-500" />
                  <h3 className="text-lg font-bold uppercase">History Locked</h3>
                  <p className="text-gray-400 text-[10px]">Your work history is safe but locked. Pay the $10 fee to unlock your profile and start new jobs.</p>
                  <button onClick={() => setShowVerifyModal(true)} className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl text-[9px] uppercase">Unlock Profile</button>
               </div>
            </div>
          )}

          {/* --- 💬 CHATS (RECONSTRUCTED) --- */}
          {activeTab === "messages" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
               <div className="flex justify-between items-center px-2">
                  <h3 className="text-xl font-bold uppercase">Console <span className="text-[#00f2ff]">Feed</span></h3>
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[8px] font-bold text-emerald-500 uppercase">Secure Link Active</span>
                  </div>
               </div>
               
               <div className="space-y-3">
                  {[
                    { id: 0, t: "Nexus Protocol", m: "Welcome, Node Identity Alpha. To initiate global gig access and secure payouts, your $10 validation handshake is required.", time: "Just now", type: "system", icon: <Shield size={14} className="text-[#00f2ff]"/> },
                    { id: 1, t: "Client: Sarah J.", m: "Hey! I'm interested in your profile for a travel blog project. Please verify so we can start chatting.", time: "2h ago", type: "client", icon: <UserCircle size={14} className="text-white"/> },
                    { id: 2, t: "Global Marketplace", m: "Surge Alert: Digital Marketing and Writing gigs are up by 15% today. Verify now to bid.", time: "5h ago", type: "alert", icon: <Zap size={14} className="text-amber-500"/> }
                  ].map((chat, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setExpandedMsg(expandedMsg === i ? null : i)}
                      className={`p-5 rounded-[28px] border transition-all cursor-pointer relative overflow-hidden ${chat.type === 'system' ? 'bg-[#00f2ff]/5 border-[#00f2ff]/20' : 'bg-white/5 border-white/5'}`}
                    >
                       <div className="flex gap-4 items-start relative z-10">
                          <div className="p-3 bg-black/40 rounded-xl border border-white/5">{chat.icon}</div>
                          <div className="flex-1">
                             <div className="flex justify-between items-center mb-1">
                                <h4 className={`text-xs font-black uppercase italic ${chat.type === 'system' ? 'text-[#00f2ff]' : 'text-white'}`}>{chat.t}</h4>
                                <span className="text-[7px] font-bold text-gray-600 uppercase">{chat.time}</span>
                             </div>
                             <p className="text-[10px] text-gray-400 line-clamp-1 group-hover:line-clamp-none">{chat.m}</p>
                             <AnimatePresence>
                               {expandedMsg === i && (
                                 <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-4 pt-4 border-t border-white/5">
                                    <p className="text-[10px] text-gray-300 leading-relaxed italic">{chat.m}</p>
                                    <button onClick={() => !isVerified && setShowVerifyModal(true)} className="mt-4 px-6 py-2 bg-white text-black text-[9px] font-bold uppercase rounded-lg">Reply (Verify Node)</button>
                                 </motion.div>
                               )}
                             </AnimatePresence>
                          </div>
                       </div>
                    </motion.div>
                  ))}
               </div>
            </motion.div>
          )}

          {/* --- 💰 VAULT (PREMIUM WALLET) --- */}
          {activeTab === "earnings" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
               <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold uppercase">My <span className="text-[#00f2ff]">Vault</span></h3>
                  <div className="p-1.5 bg-white/5 rounded-xl flex gap-1 border border-white/5">
                     <button onClick={() => setCurrency("USD")} className={`px-4 py-1.5 rounded-lg text-[8px] font-black transition-all ${currency === "USD" ? "bg-[#00f2ff] text-black shadow-lg" : "text-gray-500 hover:text-white"}`}>USD</button>
                     <button onClick={() => setCurrency("KES")} className={`px-4 py-1.5 rounded-lg text-[8px] font-black transition-all ${currency === "KES" ? "bg-[#00f2ff] text-black shadow-lg" : "text-gray-500 hover:text-white"}`}>KES</button>
                  </div>
               </div>

               {/* Premium Card Layout */}
               <div className="relative group perspective-1000">
                  <div className="w-full h-52 bg-linear-to-br from-white/15 to-white/5 backdrop-blur-3xl border border-white/20 rounded-[45px] p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden ring-1 ring-white/10">
                    <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#00f2ff]/5 rounded-full blur-3xl group-hover:bg-[#00f2ff]/10 transition-all duration-1000" />
                    <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl" />
                    
                    <div className="flex justify-between items-start relative z-10">
                       <div className="space-y-1">
                          <p className="text-[9px] font-bold text-[#00f2ff] uppercase tracking-[0.3em]">Available Assets</p>
                          <h4 className="text-5xl font-black italic tracking-tighter">{currency === "USD" ? "$0.00" : "KES 0"}</h4>
                       </div>
                       <div className="w-12 h-12 bg-white/5 rounded-[20px] flex items-center justify-center border border-white/10 shadow-inner backdrop-blur-md"><Zap className="text-[#00f2ff]" size={20} /></div>
                    </div>
                    
                    <div className="flex justify-between items-end relative z-10">
                       <div className="space-y-1">
                          <p className="text-[7px] font-bold text-gray-500 uppercase tracking-widest">Node ID</p>
                          <p className="text-[10px] font-mono tracking-widest text-white/60">ID_{user?.id?.substring(0, 8).toUpperCase()}</p>
                       </div>
                       <button onClick={() => showAlert("Handshake Required", "Verify your account for $10 to enable withdrawal relays.", "info")} className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-2xl text-[10px] font-black uppercase italic hover:bg-[#00f2ff] transition-all shadow-[0_10px_20px_rgba(0,0,0,0.3)] active:scale-95">
                          Withdraw <ArrowUpRight size={14}/>
                       </button>
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-white/5 border border-white/10 rounded-[30px] flex items-center gap-4 group hover:bg-white/10 transition-all">
                     <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 group-hover:scale-110 transition-transform"><History size={18}/></div>
                     <div><p className="text-[7px] font-black text-gray-500 uppercase tracking-widest">Received</p><p className="text-sm font-black">$0.00</p></div>
                  </div>
                  <div className="p-5 bg-white/5 border border-white/10 rounded-[30px] flex items-center gap-4 group hover:bg-white/10 transition-all">
                     <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 border border-amber-500/20 group-hover:scale-110 transition-transform"><Clock size={18}/></div>
                     <div><p className="text-[7px] font-black text-gray-500 uppercase tracking-widest">Locked</p><p className="text-sm font-black">$0.00</p></div>
                  </div>
               </div>

               <div className="space-y-3">
                  <div className="flex justify-between items-center px-2">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Recent Activity</p>
                    <History size={12} className="text-gray-700"/>
                  </div>
                  <div className="p-12 border border-dashed border-white/10 rounded-[40px] text-center bg-white/1 backdrop-blur-sm">
                     <p className="text-[9px] text-gray-600 font-bold uppercase italic tracking-widest leading-loose">No active settlements found.<br/>Verify node to start missions.</p>
                  </div>
               </div>
            </motion.div>
          )}

          {/* --- 📊 STATS --- */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
               <h3 className="text-xl font-bold uppercase px-2">My <span className="text-[#00f2ff]">Metrics</span></h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { l: "Success Rate", v: "0%", i: <CheckCircle2 size={16} className="text-emerald-500"/> },
                    { l: "Missions", v: "0", i: <Briefcase size={16} className="text-blue-500"/> },
                    { l: "Node Trust", v: "N/A", i: <ShieldCheck size={16} className="text-purple-500"/> },
                    { l: "Net Revenue", v: "$0.00", i: <DollarSign size={16} className="text-yellow-500"/> }
                  ].map(stat => (
                    <div key={stat.l} className="p-5 bg-white/5 border border-white/10 rounded-[25px] text-center hover:bg-white/10 transition-all border-b-2 border-b-transparent hover:border-b-[#00f2ff]">
                       <div className="mb-2 flex justify-center">{stat.i}</div>
                       <p className="text-[8px] font-bold text-gray-500 uppercase mb-1 tracking-widest">{stat.l}</p>
                       <p className="text-lg font-black">{stat.v}</p>
                    </div>
                  ))}
               </div>
               <div className="p-10 bg-white/2 border border-white/10 rounded-[40px] text-center group">
                  <Activity size={32} className="mx-auto text-[#00f2ff] opacity-10 mb-4 group-hover:opacity-40 transition-opacity" />
                  <p className="text-[9px] text-gray-600 uppercase font-black tracking-[0.2em]">Verification required to sync global matrix data</p>
               </div>
            </div>
          )}

          {/* --- 👤 ME (RECONSTRUCTED) --- */}
          {activeTab === "account" && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto space-y-6 pb-10">
               {/* Identity Card */}
               <div className="p-10 bg-linear-to-br from-white/10 to-white/5 border border-white/10 rounded-[50px] text-center shadow-3xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#00f2ff] to-transparent opacity-50" />
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <div className="absolute inset-0 bg-[#00f2ff]/20 blur-2xl rounded-full" />
                    <img src={user?.imageUrl} className="w-full h-full rounded-[40px] object-cover border-4 border-white/10 relative z-10 shadow-2xl" alt="Identity" />
                    <div className="absolute -bottom-2 -right-2 bg-black border-2 border-[#00f2ff] p-2 rounded-2xl text-[#00f2ff] z-20 shadow-glow"><Fingerprint size={16}/></div>
                  </div>
                  <h3 className="text-4xl font-black italic uppercase tracking-tighter mb-2">{user?.fullName}</h3>
                  <div className="inline-flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/5 mb-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00f2ff]">Status Level 1</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <button onClick={() => setActiveTab('earnings')} className="py-5 bg-white text-black rounded-[28px] font-black uppercase italic text-[11px] hover:bg-[#00f2ff] transition-all shadow-xl">Vault Sync</button>
                     <button onClick={() => setActiveTab('settings')} className="py-5 bg-white/5 border border-white/10 rounded-[28px] font-black uppercase italic text-[11px] hover:bg-white/10 transition-all">Config Hub</button>
                  </div>
               </div>

               {/* Profile Progress & Meta */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] space-y-6">
                     <div className="flex justify-between items-center">
                        <h4 className="text-xs font-black uppercase tracking-widest">Node Completion</h4>
                        <span className="text-[10px] font-bold text-[#00f2ff]">40%</span>
                     </div>
                     <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-[#00f2ff] w-[40%] shadow-glow" />
                     </div>
                     <div className="space-y-3 pt-2">
                        {['Link Portfolio', 'Identity Handshake', 'Sync Technical Skills'].map((item, i) => (
                          <div key={i} className="flex items-center gap-3 opacity-40">
                             <div className="w-1.5 h-1.5 rounded-full bg-white" />
                             <span className="text-[10px] font-medium italic">{item}</span>
                          </div>
                        ))}
                     </div>
                  </div>

                  <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] space-y-4 flex flex-col justify-center">
                     <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
                        <Globe size={16} className="text-[#00f2ff]"/>
                        <div><p className="text-[8px] font-black text-gray-500 uppercase">Current Region</p><p className="text-[10px] font-bold">Global / Remote</p></div>
                     </div>
                     <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
                        <Award size={16} className="text-[#00f2ff]"/>
                        <div><p className="text-[8px] font-black text-gray-500 uppercase">Trust Index</p><p className="text-[10px] font-bold">Authenticated Profile Required</p></div>
                     </div>
                  </div>
               </div>

               <div className="flex justify-center pt-4">
                  <SignOutButton><button className="px-10 py-5 bg-red-500/5 border-2 border-red-500/10 text-red-500 font-black italic rounded-[30px] uppercase text-[10px] hover:bg-red-500 hover:text-white transition-all tracking-[0.4em] shadow-2xl active:scale-95">Terminate Connection</button></SignOutButton>
               </div>
            </motion.div>
          )}

          {/* --- ⚙️ SETTINGS --- */}
          {activeTab === "settings" && (
            <div className="space-y-6 max-w-xl mx-auto">
               <h3 className="text-2xl font-bold uppercase px-2">System <span className="text-[#00f2ff]">Config</span></h3>
               <div className="p-8 bg-white/5 border border-white/10 rounded-[45px] space-y-8 shadow-2xl">
                  <div className="flex justify-between items-center group cursor-pointer">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-[18px] group-hover:bg-[#00f2ff]/10 transition-colors shadow-inner"><Moon size={20} className="text-[#00f2ff]"/></div>
                        <div><h4 className="text-xs font-black uppercase tracking-widest">Stealth Protocol</h4><p className="text-[9px] text-gray-500 italic">Invisible node routing</p></div>
                     </div>
                     <div className="w-10 h-5 bg-white/10 rounded-full p-1 flex justify-end items-center"><div className="w-3 h-3 bg-[#00f2ff] rounded-full shadow-glow" /></div>
                  </div>
                  
                  <div className="flex justify-between items-center opacity-50 cursor-not-allowed">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-[18px] shadow-inner"><Fingerprint size={20}/></div>
                        <div><h4 className="text-xs font-black uppercase tracking-widest">Biometric Sync</h4><p className="text-[9px] text-gray-500 italic">Face ID unlock relay</p></div>
                     </div>
                     <Lock size={16} className="text-gray-600"/>
                  </div>

                  <div className="pt-6 border-t border-white/5">
                     <p className="text-[10px] font-black text-gray-500 uppercase mb-5 tracking-widest">Interface Neon Palette</p>
                     <div className="flex gap-5">
                        <div className="w-8 h-8 rounded-xl bg-[#00f2ff] border-2 border-white ring-4 ring-[#00f2ff]/10 cursor-pointer shadow-glow" />
                        <div className="w-8 h-8 rounded-xl bg-emerald-500 opacity-20 border border-white/10 hover:opacity-100 transition-opacity cursor-pointer" />
                        <div className="w-8 h-8 rounded-xl bg-purple-500 opacity-20 border border-white/10 hover:opacity-100 transition-opacity cursor-pointer" />
                     </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 space-y-4">
                    <button onClick={() => showAlert("System Saved", "Global node configuration synchronized.", "success")} className="w-full py-4 bg-white text-black font-black italic rounded-2xl text-[11px] uppercase hover:bg-[#00f2ff] transition-all shadow-xl">Apply Sync</button>
                    <p className="w-full text-[8px] font-bold text-gray-700 uppercase tracking-[0.5em] text-center">Nexus Build Alpha 4.0.2</p>
                  </div>
               </div>
            </div>
          )}

          {/* --- 🛠️ HELP --- */}
          {activeTab === "support" && (
             <div className="grid md:grid-cols-2 gap-4">
                <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] shadow-2xl">
                   <h4 className="text-xs font-black uppercase text-[#00f2ff] mb-6 tracking-widest italic">Protocol FAQ</h4>
                   {['Is my vault safe?', 'Withdrawal speed?', 'Screening call help'].map(q => (
                     <button key={q} onClick={handleSupportEmail} className="w-full flex justify-between items-center p-4 bg-black/40 rounded-2xl mb-3 text-left hover:bg-white/5 border border-transparent hover:border-white/5 transition-all">
                        <span className="text-[10px] font-bold italic">{q}</span>
                        <ChevronRight size={14} className="text-[#00f2ff]" />
                     </button>
                   ))}
                </div>
                <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] text-center flex flex-col justify-center gap-4 shadow-2xl">
                   <HelpCircle size={48} className="mx-auto text-[#00f2ff] opacity-40" />
                   <p className="text-[10px] text-gray-500 uppercase font-bold">Direct Assistance Relay:</p>
                   <p className="text-xs font-black italic text-white tracking-wide">notifications.nexusgigs@gmail.com</p>
                   <button onClick={handleSupportEmail} className="mt-4 py-3 bg-[#00f2ff] text-black font-black rounded-2xl text-[10px] uppercase shadow-glow">Initialize Uplink</button>
                </div>
             </div>
          )}

        </AnimatePresence>
      </div>

      {/* --- SLIM NAV DOCK --- */}
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

      {/* --- RECONSTRUCTED VERIFICATION MODAL --- */}
      <AnimatePresence>
        {showVerifyModal && (
          <div className="fixed inset-0 z-200 flex items-center justify-center p-6 backdrop-blur-md bg-black/60">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0" onClick={() => !isPaying && setShowVerifyModal(false)} />
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="relative w-full max-w-87.5 bg-[#0a0f1e] border-2 border-white/10 rounded-[45px] p-10 text-center shadow-[0_0_100px_rgba(0,242,255,0.1)] overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#00f2ff] to-transparent shadow-glow" />
              
              {paymentStep === "terms" ? (
                <div className="space-y-6">
                  <ShieldCheck size={40} className="text-[#00f2ff] mx-auto shadow-glow" />
                  <h3 className="text-xl font-black italic uppercase tracking-tight">Identity Handshake</h3>
                  
                  <div className="bg-white/5 p-5 rounded-3xl text-left border border-white/5 space-y-4 shadow-inner">
                     <div className="flex gap-3">
                        <div className="w-5 h-5 bg-[#00f2ff]/10 rounded-full flex items-center justify-center shrink-0 border border-[#00f2ff]/20 text-[10px] font-black text-[#00f2ff]">1</div>
                        <p className="text-[10px] text-gray-300 font-bold leading-relaxed italic">Pay $10 Handshake fee.</p>
                     </div>
                     <div className="flex gap-3">
                        <div className="w-5 h-5 bg-white/5 rounded-full flex items-center justify-center shrink-0 border border-white/10 text-[10px] font-black text-gray-500">2</div>
                        <p className="text-[10px] text-gray-400 leading-relaxed italic">Complete a technical survey sent via email.</p>
                     </div>
                     <div className="flex gap-3">
                        <div className="w-5 h-5 bg-white/5 rounded-full flex items-center justify-center shrink-0 border border-white/10 text-[10px] font-black text-gray-500">3</div>
                        <p className="text-[10px] text-gray-400 leading-relaxed italic">Pass a mandatory screening Zoom call.</p>
                     </div>
                     <div className="pt-2 border-t border-white/5">
                        <p className="text-[9px] text-emerald-400 font-bold italic flex items-center gap-2"><CheckCircle2 size={10}/> 100% Refund if you fail screening.</p>
                     </div>
                  </div>
                  
                  {/* AGREEMENT CHECKBOX */}
                  <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/5 cursor-pointer text-left transition-all hover:bg-white/10" onClick={() => setAgreedToTerms(!agreedToTerms)}>
                     <div className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all shrink-0 ${agreedToTerms ? 'bg-[#00f2ff] border-[#00f2ff]' : 'border-white/20'}`}>
                        {agreedToTerms && <X size={12} className="text-black font-black"/>}
                     </div>
                     <span className="text-[9px] font-black italic text-gray-400 leading-tight uppercase">I agree to the $10 fee, the survey, and the screening call refund policy.</span>
                  </div>

                  <button disabled={!agreedToTerms} onClick={() => setPaymentStep("choice")} className={`w-full py-5 rounded-[25px] font-black uppercase italic text-[11px] transition-all tracking-[0.2em] ${agreedToTerms ? 'bg-[#00f2ff] text-black shadow-glow hover:scale-[1.02]' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}>Accept & Sync</button>
                </div>
              ) : paymentStep === "choice" ? (
                <div className="space-y-6">
                  <h3 className="text-md font-black uppercase italic tracking-widest text-[#00f2ff]">Select Gateway</h3>
                  <div className="space-y-3">
                    <button onClick={() => handleSecurePayment("CARD")} className="w-full py-4 bg-white text-black font-black rounded-2xl text-[10px] uppercase italic flex items-center justify-center gap-3 tracking-widest"><CreditCard size={14}/> Global Card</button>
                    <button onClick={() => setPaymentStep("mpesa")} className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl text-[10px] uppercase italic flex items-center justify-center gap-3 tracking-widest shadow-lg shadow-emerald-900/20"><Smartphone size={14}/> M-Pesa Sync</button>
                  </div>
                  <button onClick={() => setPaymentStep("terms")} className="text-[9px] text-gray-500 uppercase font-black italic tracking-[0.3em] hover:text-white">Go Back</button>
                </div>
              ) : (
                <div className="space-y-8">
                   <Smartphone size={32} className="text-emerald-500 mx-auto animate-bounce" />
                   <div className="space-y-2">
                     <h3 className="text-lg font-black uppercase italic">M-Pesa Direct</h3>
                     <p className="text-[10px] text-gray-500 font-bold uppercase">Enter your phone to push STK</p>
                   </div>
                   <input value={mpesaNumber} onChange={e => setMpesaNumber(e.target.value)} placeholder="2547XXXXXXXX" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-center text-2xl font-black text-white outline-none focus:border-emerald-500 shadow-inner" />
                   <div className="space-y-4">
                    <button disabled={isPaying} onClick={() => handleSecurePayment("M-PESA")} className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl uppercase italic text-[11px] shadow-lg shadow-emerald-600/20 tracking-widest">{isPaying ? "ENCRYPTING..." : "Transmit KES 1,300"}</button>
                    <button onClick={() => setPaymentStep("choice")} className="text-[9px] text-gray-500 uppercase font-black italic tracking-widest">Back</button>
                   </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- SMALL ALERT --- */}
      <AnimatePresence>
        {customAlert.show && (
          <div className="fixed inset-0 z-300 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-75 bg-[#0a0f1e] border-2 border-white/10 rounded-[40px] p-8 text-center shadow-3xl relative">
                <div className={`absolute top-0 left-0 w-full h-1.5 ${customAlert.type === 'error' ? 'bg-red-500' : 'bg-[#00f2ff] shadow-glow'}`} />
                <div className="mb-6 flex justify-center">
                  {customAlert.type === 'error' && <AlertTriangle size={32} className="text-red-500 drop-shadow-[0_0_10px_red]" />}
                  {customAlert.type === 'success' && <CheckCircle size={32} className="text-emerald-500 drop-shadow-[0_0_10px_emerald]" />}
                  {customAlert.type === 'info' && <Info size={32} className="text-[#00f2ff] shadow-glow" />}
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