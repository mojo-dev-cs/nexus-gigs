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
  ShieldQuestion, UserCircle, DollarSign, ArrowUpRight, History
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

  // --- 🛰️ AUTO-SYNC AFTER PAYMENT ---
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
          
          {/* --- HOME --- */}
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

          {/* --- GIGS --- */}
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

          {/* --- WORK --- */}
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

          {/* --- VAULT (NEW MODERN WALLET) --- */}
          {activeTab === "earnings" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
               <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold uppercase">My <span className="text-[#00f2ff]">Vault</span></h3>
                  <div className="p-2 bg-white/5 rounded-lg flex gap-2">
                     <button onClick={() => setCurrency("USD")} className={`px-3 py-1 rounded-md text-[9px] font-bold transition-all ${currency === "USD" ? "bg-[#00f2ff] text-black" : "text-gray-500"}`}>USD</button>
                     <button onClick={() => setCurrency("KES")} className={`px-3 py-1 rounded-md text-[9px] font-bold transition-all ${currency === "KES" ? "bg-[#00f2ff] text-black" : "text-gray-500"}`}>KES</button>
                  </div>
               </div>

               {/* Premium Card */}
               <div className="relative group perspective-1000">
                  <div className="w-full h-56 bg-linear-to-br from-white/15 to-white/5 backdrop-blur-3xl border border-white/20 rounded-[40px] p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#00f2ff]/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-[#00f2ff]/10 transition-all" />
                    <div className="flex justify-between items-start relative z-10">
                       <div>
                          <p className="text-[10px] font-bold text-[#00f2ff] uppercase tracking-widest mb-1">Current Balance</p>
                          <h4 className="text-5xl font-black">{currency === "USD" ? "$0.00" : "KES 0.00"}</h4>
                       </div>
                       <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10"><Zap className="text-[#00f2ff]" size={24} /></div>
                    </div>
                    <div className="flex justify-between items-end relative z-10">
                       <div>
                          <p className="text-[8px] font-bold text-gray-500 uppercase mb-1">Account Node</p>
                          <p className="text-xs font-mono tracking-widest">{user?.id?.substring(0, 12).toUpperCase()}</p>
                       </div>
                       <button onClick={() => showAlert("No Funds", "Connect your account to start receiving payments.", "info")} className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-2xl text-[10px] font-bold uppercase hover:bg-[#00f2ff] transition-all shadow-xl">
                          Payout <ArrowUpRight size={14}/>
                       </button>
                    </div>
                  </div>
               </div>

               {/* Stats Row */}
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center gap-4">
                     <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500"><History size={18}/></div>
                     <div><p className="text-[8px] font-bold text-gray-500 uppercase">Incoming</p><p className="text-sm font-bold">$0.00</p></div>
                  </div>
                  <div className="p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center gap-4">
                     <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500"><Clock size={18}/></div>
                     <div><p className="text-[8px] font-bold text-gray-500 uppercase">Pending</p><p className="text-sm font-bold">$0.00</p></div>
                  </div>
               </div>

               {/* Recent Transactions Placeholder */}
               <div className="space-y-4">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Recent Activity</p>
                  <div className="p-10 border border-white/5 rounded-[35px] text-center bg-white/1">
                     <History size={32} className="mx-auto text-gray-700 mb-3" />
                     <p className="text-[10px] text-gray-600 font-bold uppercase italic">No synchronization logs found.</p>
                  </div>
               </div>
            </motion.div>
          )}

          {/* --- STATS --- */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
               <h3 className="text-xl font-bold uppercase">My <span className="text-[#00f2ff]">Performance</span></h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { l: "Success Rate", v: "0%", i: <CheckCircle2 size={16} className="text-emerald-500"/> },
                    { l: "Jobs Finished", v: "0", i: <Briefcase size={16} className="text-blue-500"/> },
                    { l: "Trust Score", v: "N/A", i: <ShieldCheck size={16} className="text-purple-500"/> },
                    { l: "Total Earned", v: "$0.00", i: <DollarSign size={16} className="text-yellow-500"/> }
                  ].map(stat => (
                    <div key={stat.l} className="p-5 bg-white/5 border border-white/10 rounded-[20px] text-center">
                       <div className="mb-2 flex justify-center">{stat.i}</div>
                       <p className="text-[8px] font-bold text-gray-500 uppercase mb-1">{stat.l}</p>
                       <p className="text-lg font-bold">{stat.v}</p>
                    </div>
                  ))}
               </div>
               <div className="p-8 bg-white/2 border border-white/5 rounded-[30px] text-center">
                  <Activity size={32} className="mx-auto text-[#00f2ff] opacity-20 mb-3" />
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Verification is required to track live data</p>
               </div>
            </div>
          )}

          {/* --- CONFIG --- */}
          {activeTab === "settings" && (
            <div className="space-y-6 max-w-xl mx-auto">
               <h3 className="text-xl font-bold uppercase">System <span className="text-[#00f2ff]">Config</span></h3>
               <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] space-y-8">
                  <div className="flex justify-between items-center group cursor-pointer">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-xl group-hover:bg-[#00f2ff]/10 transition-colors"><Moon size={20} className="text-[#00f2ff]"/></div>
                        <div><h4 className="text-xs font-bold uppercase">Dark Mode Sync</h4><p className="text-[9px] text-gray-500">Currently active by default</p></div>
                     </div>
                     <div className="w-10 h-5 bg-white/10 rounded-full p-1 flex justify-end"><div className="w-3 h-3 bg-[#00f2ff] rounded-full shadow-[0_0_10px_#00f2ff]" /></div>
                  </div>
                  <div className="flex justify-between items-center opacity-50 cursor-not-allowed">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-xl"><Fingerprint size={20}/></div>
                        <div><h4 className="text-xs font-bold uppercase">Face ID Sync</h4><p className="text-[9px] text-gray-500 italic">Verify account to unlock</p></div>
                     </div>
                     <Lock size={16} className="text-gray-600"/>
                  </div>
                  <div className="pt-6 border-t border-white/5 space-y-4">
                    <button onClick={() => showAlert("Saved", "Settings updated.", "success")} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase hover:bg-white/10 transition-all">Save Config</button>
                    <button onClick={() => showAlert("Nexus HQ", "V4.0.2 - Current Build", "info")} className="w-full py-2 text-[8px] font-bold text-gray-600 uppercase tracking-widest text-center">Build 4.0.2</button>
                  </div>
               </div>
            </div>
          )}

          {/* --- HELP --- */}
          {activeTab === "support" && (
             <div className="grid md:grid-cols-2 gap-4">
                <div className="p-6 bg-white/5 border border-white/10 rounded-[30px]">
                   <h4 className="text-xs font-bold uppercase text-[#00f2ff] mb-4">FAQs</h4>
                   {['Is my money safe?', 'How do I withdraw?', 'Account verification help'].map(q => (
                     <button key={q} onClick={handleSupportEmail} className="w-full flex justify-between p-3 bg-black/20 rounded-lg mb-2 text-left hover:bg-white/5">
                        <span className="text-[9px] font-medium">{q}</span>
                        <ChevronRight size={12} className="text-[#00f2ff]" />
                     </button>
                   ))}
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-[30px] text-center flex flex-col justify-center gap-2">
                   <HelpCircle size={32} className="mx-auto text-[#00f2ff]" />
                   <p className="text-[9px] text-gray-400">Email for quick support:</p>
                   <p className="text-[10px] font-bold">notifications.nexusgigs@gmail.com</p>
                </div>
             </div>
          )}

        </AnimatePresence>
      </div>

      {/* --- SLIM NAV DOCK --- */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-100 w-[94%] max-w-xl">
        <div className="h-16 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-full flex items-center justify-around px-2 shadow-2xl">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center gap-0.5 transition-all ${activeTab === item.id ? 'text-[#00f2ff] scale-110' : 'text-gray-500 hover:text-white'}`}>
              <div className={activeTab === item.id ? "bg-[#00f2ff]/10 p-1.5 rounded-xl" : ""}>{item.icon}</div>
              <span className="text-[6px] font-bold uppercase tracking-tighter">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* --- RECONSTRUCTED VERIFICATION MODAL --- */}
      <AnimatePresence>
        {showVerifyModal && (
          <div className="fixed inset-0 z-200 flex items-center justify-center p-6 backdrop-blur-md">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60" onClick={() => !isPaying && setShowVerifyModal(false)} />
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="relative w-full max-w-85 bg-[#0a0f1e] border border-white/10 rounded-[40px] p-10 text-center shadow-3xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#00f2ff] to-transparent" />
              
              {paymentStep === "terms" ? (
                <div className="space-y-6">
                  <ShieldCheck size={40} className="text-[#00f2ff] mx-auto" />
                  <h3 className="text-xl font-bold uppercase">Get Verified</h3>
                  <div className="bg-white/5 p-4 rounded-2xl text-left border border-white/5 space-y-3">
                     <p className="text-[10px] text-gray-300 leading-relaxed font-bold">1. Pay $10 Handshake fee.</p>
                     <p className="text-[10px] text-gray-400 leading-relaxed">2. Complete a technical survey sent via email.</p>
                     <p className="text-[10px] text-gray-400 leading-relaxed">3. Pass a quick screening Zoom call.</p>
                     <p className="text-[9px] text-emerald-400 italic pt-2">★ Failed screening? 100% money back guarantee to your original payment method.</p>
                  </div>
                  
                  {/* AGREEMENT CHECKBOX */}
                  <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5 cursor-pointer text-left" onClick={() => setAgreedToTerms(!agreedToTerms)}>
                     <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${agreedToTerms ? 'bg-[#00f2ff] border-[#00f2ff]' : 'border-white/20'}`}>
                        {agreedToTerms && <X size={12} className="text-black font-bold"/>}
                     </div>
                     <span className="text-[9px] font-bold text-gray-300">I agree to the $10 fee, the email survey, and the screening call policy.</span>
                  </div>

                  <button disabled={!agreedToTerms} onClick={() => setPaymentStep("choice")} className={`w-full py-4 rounded-2xl font-bold uppercase text-[10px] transition-all ${agreedToTerms ? 'bg-[#00f2ff] text-black shadow-lg hover:scale-[1.02]' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}>Initialize Pay</button>
                </div>
              ) : paymentStep === "choice" ? (
                <div className="space-y-5">
                  <h3 className="text-md font-bold uppercase">Pay $10</h3>
                  <button onClick={() => handleSecurePayment("CARD")} className="w-full py-4 bg-white text-black font-bold rounded-2xl text-[10px] uppercase flex items-center justify-center gap-2 tracking-widest"><CreditCard size={14}/> Card</button>
                  <button onClick={() => setPaymentStep("mpesa")} className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl text-[10px] uppercase flex items-center justify-center gap-2 tracking-widest"><Smartphone size={14}/> M-Pesa</button>
                  <button onClick={() => setPaymentStep("terms")} className="text-[9px] text-gray-500 uppercase font-bold">Go Back</button>
                </div>
              ) : (
                <div className="space-y-6">
                   <Smartphone size={32} className="text-emerald-500 mx-auto" />
                   <h3 className="text-lg font-bold uppercase">M-Pesa Number</h3>
                   <input value={mpesaNumber} onChange={e => setMpesaNumber(e.target.value)} placeholder="2547XXXXXXXX" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-center text-xl font-bold text-white outline-none focus:border-emerald-500" />
                   <button disabled={isPaying} onClick={() => handleSecurePayment("M-PESA")} className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl uppercase text-[10px] shadow-lg">{isPaying ? "Sending..." : "Pay KES 1,300"}</button>
                   <button onClick={() => setPaymentStep("choice")} className="text-[9px] text-gray-500 uppercase font-bold">Back</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- SMALL ALERT POPUP --- */}
      <AnimatePresence>
        {customAlert.show && (
          <div className="fixed inset-0 z-300 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-70 bg-[#0a0f1e] border border-white/10 rounded-[35px] p-8 text-center shadow-3xl relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 ${customAlert.type === 'error' ? 'bg-red-500' : customAlert.type === 'success' ? 'bg-emerald-500' : 'bg-[#00f2ff]'}`} />
                <div className="mb-4 flex justify-center">
                  {customAlert.type === 'error' && <AlertTriangle size={24} className="text-red-500" />}
                  {customAlert.type === 'success' && <CheckCircle size={24} className="text-emerald-500" />}
                  {customAlert.type === 'info' && <Info size={24} className="text-[#00f2ff]" />}
                </div>
                <h4 className="text-xs font-bold uppercase mb-2 text-white">{customAlert.title}</h4>
                <p className="text-[9px] text-gray-400 mb-6 leading-relaxed">{customAlert.msg}</p>
                <button onClick={() => setCustomAlert({...customAlert, show: false})} className="w-full py-2.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-bold uppercase hover:bg-white hover:text-black">Dismiss</button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
};