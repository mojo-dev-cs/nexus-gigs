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
  Activity, Landmark, Bitcoin, HelpCircle, LifeBuoy, X, CheckCircle, Box
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
            showAlert(
              "Account Ready", 
              "Payment received. Your account is now verified. Check your email in 24 hours for a quick welcome survey.", 
              "success"
            );
            setIsVerified(true);
          }
        } catch (error) {
          console.error("Sync error:", error);
        }
      }
    };
    finalizeHandshake();
  }, [searchParams, isLoaded, user, isVerified]);

  // --- 📲 SECURE PAYMENT ---
  const handleSecurePayment = async (method: "M-PESA" | "CARD") => {
    setIsPaying(true);
    const TEST_AMOUNT = 10; 

    if (method === "M-PESA") {
      const cleanPhone = mpesaNumber.replace(/\D/g, ''); 
      if (!cleanPhone.startsWith("254") || cleanPhone.length !== 12) {
        setIsPaying(false);
        return showAlert("Phone Error", "Please use the 2547XXXXXXXX format.", "error");
      }

      try {
        const response = await fetch("/api/intasend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: TEST_AMOUNT,
            phone: cleanPhone, 
            email: user?.primaryEmailAddress?.emailAddress,
            firstName: user?.firstName,
            lastName: user?.lastName,
            method: "M-PESA"
          }),
        });

        if (response.ok) {
          showAlert("PIN Prompt Sent", "Check your phone and enter your M-Pesa PIN to finish.", "success");
          setShowVerifyModal(false);
        } else {
          showAlert("System Busy", "M-Pesa is slow right now. Please try using a Card.", "error");
        }
      } catch (error) {
        showAlert("Error", "Could not connect to the payment server.", "error");
      } finally {
        setIsPaying(false);
      }

    } else {
      try {
        const response = await fetch("/api/paystack", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: TEST_AMOUNT, 
            email: user?.primaryEmailAddress?.emailAddress,
            firstName: user?.firstName,
            lastName: user?.lastName
          }),
        });
        const data = await response.json();

        if (data.status && data.data.authorization_url) {
          window.location.href = data.data.authorization_url; 
        } else {
          showAlert("Offline", "Card payments are currently down.", "error");
        }
      } catch (error) {
        showAlert("Error", "Connection lost.", "error");
      } finally {
        setIsPaying(false);
      }
    }
  };

  const navItems = [
    { id: 'home', icon: <Home size={18}/>, label: 'Home' },
    { id: 'tasks', icon: <Briefcase size={18}/>, label: 'Gigs' },
    { id: 'contracts', icon: <FileText size={18}/>, label: 'Work' },
    { id: 'messages', icon: <MessageSquare size={18}/>, label: 'Chats' },
    { id: 'earnings', icon: <Wallet size={18}/>, label: 'Vault' },
    { id: 'analytics', icon: <BarChart3 size={18}/>, label: 'Stats' },
    { id: 'support', icon: <LifeBuoy size={18}/>, label: 'Help' },
    { id: 'account', icon: <User size={18}/>, label: 'Me' },
    { id: 'settings', icon: <Settings size={18}/>, label: 'Config' },
  ];

  const marketplaceGigs = useMemo(() => [
    { id: "1", title: "Write a 5000 word document", budget: 150, client: "Julia C.", rating: 5.0, dur: "2 Days", img: "https://i.pravatar.cc/150?u=1", type: "Company", status: "Active" },
    { id: "2", title: "Python Data Science Task", budget: 45, client: "Kevin S.", rating: 4.8, dur: "5 Hours", img: "https://i.pravatar.cc/150?u=8", type: "Student", status: "Active" },
    { id: "3", title: "Cyber Security Scan", budget: 1200, client: "SafeNet", rating: 5.0, dur: "Expired", img: "https://i.pravatar.cc/150?u=2", type: "Company", status: "Expired" },
    { id: "4", title: "Fix React UI Bugs", budget: 150, client: "Clinton Devs", rating: 4.9, dur: "10 Hours", img: "https://i.pravatar.cc/150?u=3", type: "Company", status: "Active" },
  ], []);

  const handleSupportEmail = () => {
    window.location.href = `mailto:notifications.nexusgigs@gmail.com?subject=Help Request&body=ID: ${user?.id}`;
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-[#00f2ff]/30 pb-24 overflow-x-hidden">
      
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div animate={{ opacity: [0.1, 0.15, 0.1] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto pt-6 px-4 relative z-10">
        <AnimatePresence mode="wait">
          
          {/* --- HOME TAB --- */}
          {activeTab === "home" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <header className="flex justify-between items-center bg-white/5 backdrop-blur-xl p-6 rounded-[30px] border border-white/10">
                <h2 className="text-xl font-bold uppercase tracking-tight">{user?.firstName || "User"}</h2>
                <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
                   <div className={`w-2 h-2 rounded-full ${isVerified ? 'bg-[#00f2ff] shadow-[0_0_10px_#00f2ff]' : 'bg-red-500'}`} />
                   <span className="text-[9px] font-bold uppercase tracking-widest">{isVerified ? "VERIFIED" : "UNVERIFIED"}</span>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-8 bg-linear-to-br from-[#00f2ff]/10 to-transparent border border-[#00f2ff]/20 rounded-[40px]">
                  <p className="text-[9px] font-bold uppercase text-[#00f2ff] mb-1">Total Balance</p>
                  <h3 className="text-4xl font-bold mb-6">$0.00</h3>
                  <button onClick={() => showAlert("Empty Vault", "You need at least $10 to withdraw.", "info")} className="w-full py-3 bg-white text-black font-bold rounded-xl text-[10px] uppercase hover:bg-[#00f2ff] transition-all">Withdraw</button>
                </div>
                
                {!isVerified && (
                  <div className="md:col-span-2 p-8 bg-white/5 border border-white/10 rounded-[40px] flex items-center gap-6">
                    <ShieldCheck size={32} className="text-[#00f2ff] shrink-0"/>
                    <div className="flex-1">
                        <h4 className="text-lg font-bold uppercase mb-1">Verify Your Account</h4>
                        <p className="text-[11px] text-gray-400 mb-4 leading-relaxed">Pay a small $10 fee to start taking high-paying jobs and withdraw your money safely.</p>
                        <button onClick={() => { setPaymentStep("terms"); setShowVerifyModal(true); }} className="flex items-center gap-2 text-[10px] font-bold uppercase text-[#00f2ff] hover:text-white transition-all">
                          Verify Now <ChevronRight size={14} />
                        </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* --- GIGS TAB --- */}
          {activeTab === "tasks" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
              <h3 className="text-2xl font-bold uppercase tracking-tight">Available <span className="text-[#00f2ff]">Gigs</span></h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {marketplaceGigs.map((g) => (
                  <div key={g.id} className={`p-6 rounded-[35px] bg-white/5 border border-white/10 transition-all ${g.status === 'Expired' ? 'opacity-40 grayscale' : 'hover:border-[#00f2ff]/30'}`}>
                    <div className="flex justify-between items-start mb-4">
                       <img src={g.img} className="w-12 h-12 rounded-xl object-cover" alt="Avatar" />
                       <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-lg"><Star size={10} className="text-yellow-400 fill-yellow-400" /><span className="text-[9px] font-bold">{g.rating}</span></div>
                    </div>
                    <h4 className="text-sm font-bold uppercase mb-1 line-clamp-2 h-10">{g.title}</h4>
                    <p className="text-[9px] text-gray-500 mb-6 uppercase tracking-wider">{g.client}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                       <p className="text-lg font-bold text-[#00f2ff]">${g.budget}</p>
                       <button onClick={() => { if(!isVerified) setShowVerifyModal(true); }} className="px-5 py-2 rounded-lg text-[9px] font-bold uppercase bg-white text-black hover:bg-[#00f2ff] transition-all">Bid</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* --- WORK TAB (ENCRYPTED ALERT ADDED) --- */}
          {activeTab === "contracts" && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="pt-12">
               <div className="p-12 bg-white/5 border border-red-500/20 rounded-[40px] text-center space-y-6 max-w-xl mx-auto shadow-2xl backdrop-blur-xl">
                  <ShieldAlert size={60} className="mx-auto text-red-500 animate-pulse" />
                  <h3 className="text-xl font-bold uppercase text-white">History Locked</h3>
                  <p className="text-gray-400 text-[11px] leading-relaxed">Your project history is encrypted. You must pay the $10 verification fee to unlock your work history and start new projects.</p>
                  <button onClick={() => { setPaymentStep("terms"); setShowVerifyModal(true); }} className="px-10 py-4 bg-red-600 text-white font-bold rounded-xl text-[10px] uppercase hover:bg-red-500 transition-all">Unlock Now</button>
               </div>
            </motion.div>
          )}

          {/* --- CHATS TAB --- */}
          {activeTab === "messages" && (
            <div className="space-y-4">
               <h3 className="text-2xl font-bold uppercase mb-6">Inbox</h3>
               {[
                 { t: "Welcome!", m: "Thanks for joining. Please verify your account for $10 to start earning.", bg: "bg-[#00f2ff]" },
                 { t: "Market News", m: "New high-paying design jobs just landed. Check them out!", bg: "bg-white/5" }
               ].map((msg, i) => (
                 <div key={i} onClick={() => setExpandedMsg(expandedMsg === i ? null : i)} className={`p-6 rounded-[25px] border border-white/10 cursor-pointer transition-all ${msg.bg}`}>
                    <div className="flex justify-between items-center">
                       <div className="flex items-center gap-4">
                          <div className="p-3 bg-white/10 rounded-xl"><Bell size={16} className={msg.bg === 'bg-white/5' ? 'text-white' : 'text-black'}/></div>
                          <div>
                             <h4 className={`text-sm font-bold uppercase ${msg.bg === 'bg-[#00f2ff]' ? 'text-black' : 'text-white'}`}>{msg.t}</h4>
                             {expandedMsg === i && <p className="text-[10px] mt-2 opacity-80 leading-relaxed">{msg.m}</p>}
                          </div>
                       </div>
                       <ChevronDown size={16} className={expandedMsg === i ? 'rotate-180 transition-transform' : 'transition-transform'} />
                    </div>
                 </div>
               ))}
            </div>
          )}

          {/* --- VAULT TAB --- */}
          {activeTab === "earnings" && (
            <div className="space-y-8">
               <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] text-center">
                     <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Available</p>
                     <h4 className="text-5xl font-bold">$0.00</h4>
                  </div>
                  <div className="p-10 bg-white/2 border border-white/5 rounded-[40px] text-center">
                     <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Pending</p>
                     <h4 className="text-3xl font-bold text-gray-600">$0.00</h4>
                  </div>
               </div>
               <div className="flex justify-center gap-4">
                  {["Mpesa", "Bank", "Crypto"].map(item => (
                    <button key={item} onClick={() => showAlert("Balance Low", "Minimum withdraw is $10.", "info")} className="flex-1 p-6 bg-black/40 border border-white/10 rounded-2xl text-[10px] font-bold uppercase hover:border-[#00f2ff] transition-all">{item}</button>
                  ))}
               </div>
            </div>
          )}

          {/* --- SUPPORT TAB --- */}
          {activeTab === "support" && (
            <div className="grid md:grid-cols-2 gap-4">
               <div className="p-8 bg-white/5 border border-white/10 rounded-[40px]">
                  <h4 className="text-sm font-bold uppercase mb-6 text-[#00f2ff]">Common Questions</h4>
                  {['Login Help', 'Payment Issues', 'How to bid'].map(q => (
                    <div key={q} onClick={handleSupportEmail} className="flex justify-between p-4 bg-black/20 rounded-xl mb-2 cursor-pointer hover:bg-white/5">
                       <span className="text-[10px] font-medium">{q}</span>
                       <ChevronRight size={14} className="text-[#00f2ff]" />
                    </div>
                  ))}
               </div>
               <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] text-center flex flex-col justify-center">
                  <HelpCircle size={40} className="mx-auto text-[#00f2ff] mb-4" />
                  <p className="text-[10px] text-gray-400 mb-6">Need help? Email us at:<br/><span className="text-white">notifications.nexusgigs@gmail.com</span></p>
                  <button onClick={handleSupportEmail} className="py-3 bg-[#00f2ff] text-black font-bold rounded-xl text-[10px] uppercase">Contact Us</button>
               </div>
            </div>
          )}

          {/* --- PROFILE TAB --- */}
          {activeTab === "account" && (
            <div className="max-w-2xl mx-auto text-center p-12 bg-white/5 border border-white/10 rounded-[50px]">
               <div className="relative w-24 h-24 mx-auto mb-6">
                  <img src={user?.imageUrl} className="w-full h-full rounded-3xl object-cover border-2 border-[#00f2ff]/20" alt="Me" />
                  <div className="absolute -bottom-2 -right-2 bg-black p-1 rounded-lg border border-[#00f2ff] text-[#00f2ff]"><Cpu size={12}/></div>
               </div>
               <h3 className="text-3xl font-bold uppercase mb-2">{user?.fullName}</h3>
               <p className="text-[#00f2ff] text-[9px] font-bold uppercase tracking-[0.4em] mb-10">Freelancer Tier 1</p>
               <div className="flex gap-4">
                  <button onClick={() => setActiveTab('earnings')} className="flex-1 py-4 bg-[#00f2ff] text-black font-bold rounded-2xl text-[10px] uppercase shadow-lg">Vault</button>
                  <SignOutButton><button className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] uppercase font-bold text-red-500">Log Out</button></SignOutButton>
               </div>
            </div>
          )}

        </AnimatePresence>
      </div>

      {/* --- MINI NAV DOCK --- */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-100 w-[92%] max-w-2xl">
        <div className="h-16 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-full flex items-center justify-around px-4 shadow-2xl">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center gap-1 transition-all ${activeTab === item.id ? 'text-[#00f2ff] scale-110' : 'text-gray-500 hover:text-white'}`}>
              {item.icon}
              <span className="text-[7px] font-bold uppercase">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* --- VERIFICATION MODAL --- */}
      <AnimatePresence>
        {showVerifyModal && (
          <div className="fixed inset-0 z-200 flex items-center justify-center p-6 backdrop-blur-md">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60" onClick={() => !isPaying && setShowVerifyModal(false)} />
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="relative w-full max-w-sm bg-[#0a0f1e] border border-white/10 rounded-[40px] p-10 text-center shadow-3xl">
              {paymentStep === "terms" ? (
                <div className="space-y-8">
                  <ShieldCheck size={40} className="text-[#00f2ff] mx-auto" />
                  <h3 className="text-xl font-bold uppercase">Get Verified</h3>
                  <div className="bg-white/5 p-5 rounded-2xl text-left border border-white/5">
                     <p className="text-[11px] text-gray-400 leading-relaxed">To keep our site safe, all members pay a small <b>$10 fee</b>. This verifies you are real and lets you bid on unlimited jobs.</p>
                  </div>
                  <button onClick={() => setPaymentStep("choice")} className="w-full py-4 bg-[#00f2ff] text-black font-bold rounded-2xl uppercase text-[10px] hover:scale-[1.02] transition-all">I Agree</button>
                </div>
              ) : paymentStep === "choice" ? (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold uppercase">Pay $10</h3>
                  <button onClick={() => handleSecurePayment("CARD")} className="w-full py-4 bg-white text-black font-bold rounded-2xl text-[10px] uppercase">Debit/Credit Card</button>
                  <button onClick={() => setPaymentStep("mpesa")} className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl text-[10px] uppercase">M-Pesa</button>
                  <button onClick={() => setPaymentStep("terms")} className="text-[9px] text-gray-500 uppercase font-bold">Go Back</button>
                </div>
              ) : (
                <div className="space-y-6">
                   <Smartphone size={32} className="text-emerald-500 mx-auto" />
                   <h3 className="text-lg font-bold uppercase">M-Pesa Number</h3>
                   <input value={mpesaNumber} onChange={e => setMpesaNumber(e.target.value)} placeholder="2547XXXXXXXX" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-center text-xl font-bold text-white outline-none focus:border-emerald-500" />
                   <button disabled={isPaying} onClick={() => handleSecurePayment("M-PESA")} className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl uppercase text-[10px]">{isPaying ? "Sending..." : "Pay KES 1,300"}</button>
                   <button onClick={() => setPaymentStep("choice")} className="text-[9px] text-gray-500 uppercase font-bold">Back</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- COMPACT ALERT POPUP --- */}
      <AnimatePresence>
        {customAlert.show && (
          <div className="fixed inset-0 z-300 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-xs bg-[#0a0f1e] border border-white/10 rounded-[35px] p-8 text-center shadow-3xl relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 ${customAlert.type === 'error' ? 'bg-red-500' : customAlert.type === 'success' ? 'bg-emerald-500' : 'bg-[#00f2ff]'}`} />
                <div className="mb-6 flex justify-center">
                  {customAlert.type === 'error' && <AlertTriangle size={32} className="text-red-500" />}
                  {customAlert.type === 'success' && <CheckCircle size={32} className="text-emerald-500" />}
                  {customAlert.type === 'info' && <Info size={32} className="text-[#00f2ff]" />}
                </div>
                <h4 className="text-md font-bold uppercase mb-2 text-white">{customAlert.title}</h4>
                <p className="text-[10px] text-gray-400 mb-8 leading-relaxed">{customAlert.msg}</p>
                <button onClick={() => setCustomAlert({...customAlert, show: false})} className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase hover:bg-white hover:text-black transition-all">Close</button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};