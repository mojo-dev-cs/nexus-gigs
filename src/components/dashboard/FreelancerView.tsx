"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
  Send, MessageCircle, Share2, ThumbsUp, Copy, Check, Sparkles, GraduationCap
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
  const [copied, setCopied] = useState(false);
  
  const [customAlert, setCustomAlert] = useState<{show: boolean, title: string, msg: string, type: 'info' | 'error' | 'success'}>({
    show: false, title: '', msg: '', type: 'info'
  });

  const [paymentStep, setPaymentStep] = useState<"terms" | "choice" | "card" | "mpesa" | "binance">("terms");

  const showAlert = (title: string, msg: string, type: 'info' | 'error' | 'success' = 'info') => {
    setCustomAlert({ show: true, title, msg, type });
  };

  const copyAddress = () => {
    navigator.clipboard.writeText("TFWxe4TFcjUNgPJVgf5iXrMsw1oe4gDv9X");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            showAlert("Under Review", "We got your payment. We are checking your account. We will email the survey form soon.", "success");
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
    if (isVerified) return showAlert("Verified", "Your account is already verified.", "success");
    if (isUnderReview) return showAlert("Review in Progress", "We are checking your payment. We will email you the survey soon. If you fail, you get your money back.", "info");
    setShowVerifyModal(true);
  };

  const handleSecurePayment = async (method: "M-PESA" | "CARD") => {
    if (!agreedToTerms) return showAlert("Wait", "Please agree to the rules first.", "info");
    setIsPaying(true);

    if (method === "M-PESA") {
      const cleanPhone = mpesaNumber.replace(/\D/g, ''); 
      if (!cleanPhone.startsWith("254") || cleanPhone.length !== 12) {
        setIsPaying(false);
        return showAlert("Phone Error", "Please use 254XXXXXXXXX.", "error");
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
          showAlert("Prompt Sent", "Enter PIN on your phone to pay.", "success");
          setShowVerifyModal(false);
        }
      } catch (error) { showAlert("Error", "Link lost.", "error"); }
      finally { setIsPaying(false); }
    } else {
      try {
        const response = await fetch("/api/paystack", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            amount: 1300, // Paystack uses cents, so 1300 = $13.00
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
    if(!supportMsg) return showAlert("Empty", "Please type your message in the box first.", "info");
    window.location.href = `mailto:support@nexusgigs.me?subject=Help&body=Msg: ${supportMsg}%0D%0AID: ${user?.id}`;
  };

  const marketplaceGigs = useMemo(() => [
    { id: "1", title: "Enterprise: Cloud Infrastructure Security Audit", budget: 1450, client: "Aegis Data", rating: 5.0, dur: "10 Days", img: "https://i.pravatar.cc/150?u=aegis", type: "Security", status: "Active" },
    { id: "2", title: "Academic: Advanced Calculus & Physics Solutions", budget: 85, client: "Academic Hub", rating: 4.8, dur: "24 Hours", img: "https://i.pravatar.cc/150?u=school", type: "School Work", status: "Active" },
    { id: "3", title: "Web3: Smart Contract Vulnerability Scan (Solidity)", budget: 2200, client: "Nexus Protocol", rating: 4.9, dur: "5 Days", img: "https://i.pravatar.cc/150?u=crypto", type: "Web3", status: "Active" },
    { id: "4", title: "Backend: Node.js Memory Leak Investigation", budget: 400, client: "StreamSync", rating: 5.0, dur: "Expired", img: "https://i.pravatar.cc/150?u=node", type: "Startup", status: "Expired" },
    { id: "5", title: "School Work: University Thesis Formatting (Latex)", budget: 120, client: "Dr. Aris", rating: 4.9, dur: "3 Days", img: "https://i.pravatar.cc/150?u=thesis", type: "Academic", status: "Active" },
    { id: "6", title: "UI/UX: Fintech Dashboard Design System", budget: 3200, client: "Vertex Pay", rating: 4.8, dur: "14 Days", img: "https://i.pravatar.cc/150?u=pay", type: "Fintech", status: "Active" },
    { id: "7", title: "DevOps: Kubernetes Cluster Optimization", budget: 950, client: "CloudScale", rating: 5.0, dur: "Expired", img: "https://i.pravatar.cc/150?u=devops", type: "Agency", status: "Expired" },
    { id: "8", title: "Database: PostgreSQL Query Performance Tuning", budget: 600, client: "DataLake Inc", rating: 4.7, dur: "48 Hours", img: "https://i.pravatar.cc/150?u=db", type: "Enterprise", status: "Active" },
    { id: "9", title: "School: Business Law Case Study Analysis", budget: 50, client: "Legal Studies", rating: 4.6, dur: "12 Hours", img: "https://i.pravatar.cc/150?u=law", type: "Academic", status: "Active" },
    { id: "10", title: "AI: Custom LLM Integration (OpenAI API)", budget: 1800, client: "MindGraph AI", rating: 5.0, dur: "7 Days", img: "https://i.pravatar.cc/150?u=ai", type: "Research", status: "Active" },
    { id: "11", title: "Mobile: Flutter Push Notification Debugging", budget: 250, client: "GoMove App", rating: 4.6, dur: "Expired", img: "https://i.pravatar.cc/150?u=mobile", type: "Startup", status: "Expired" },
    { id: "12", title: "Security: Penetration Test (External API)", budget: 2500, client: "VaultCore", rating: 5.0, dur: "10 Days", img: "https://i.pravatar.cc/150?u=vault", type: "Banking", status: "Active" },
    { id: "13", title: "Python: Automated Web Scraping & Data Pipeline", budget: 850, client: "MarketSense", rating: 4.8, dur: "4 Days", img: "https://i.pravatar.cc/150?u=py", type: "Analytics", status: "Active" },
    { id: "14", title: "Shopify: Liquid Theme Customization (Premium)", budget: 550, client: "Luxe Label", rating: 4.9, dur: "Expired", img: "https://i.pravatar.cc/150?u=luxe", type: "Retail", status: "Expired" },
    { id: "15", title: "Technical Writing: API Documentation (Swagger)", budget: 700, client: "DevDocs Hub", rating: 5.0, dur: "5 Days", img: "https://i.pravatar.cc/150?u=doc", type: "SaaS", status: "Active" },
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
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-[#00f2ff]/30 pb-24 overflow-x-hidden text-sm">
      <div className="fixed inset-0 pointer-events-none">
        <motion.div animate={{ opacity: [0.1, 0.15, 0.1] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto pt-4 px-4 relative z-10">
        <AnimatePresence mode="wait">
          
          {/* --- 🏠 HOME --- */}
          {activeTab === "home" && (
            <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <header className="flex justify-between items-center bg-white/5 backdrop-blur-xl p-4 rounded-[15px] border border-white/10 shadow-2xl relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#00f2ff]" />
                <div className="space-y-0.5">
                  <p className="text-[9px] font-black uppercase text-gray-500">Welcome</p>
                  <h2 className="text-xl font-black italic uppercase tracking-tighter">{user?.firstName || "User"}</h2>
                </div>
                <div className="flex items-center gap-2 bg-black/40 px-2 py-1 rounded-lg border border-white/5 shadow-inner">
                   <div className={`w-1.5 h-1.5 rounded-full ${isVerified ? 'bg-[#00f2ff] shadow-[0_0_10px_#00f2ff]' : isUnderReview ? 'bg-amber-500 animate-pulse' : 'bg-red-500'}`} />
                   <span className="text-[7px] font-bold uppercase tracking-widest">{isVerified ? "VERIFIED" : isUnderReview ? "REVIEWING" : "UNVERIFIED"}</span>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-linear-to-br from-[#00f2ff]/10 to-transparent border border-[#00f2ff]/20 rounded-[20px] shadow-2xl flex flex-col justify-between h-36">
                  <div><p className="text-[7px] font-bold uppercase text-[#00f2ff] mb-0.5">My Balance</p><h3 className="text-3xl font-black tracking-tighter">$0.00</h3></div>
                  <button onClick={() => setActiveTab("earnings")} className="w-full py-2 bg-white text-black font-black rounded-lg text-[9px] uppercase hover:bg-[#00f2ff] transition-all">Wallet</button>
                </div>

                {!isVerified && (
                  <div className="md:col-span-2 p-5 bg-white/5 border border-white/10 rounded-[25px] flex flex-col items-center gap-4 backdrop-blur-xl relative overflow-hidden shadow-2xl border-l-4 border-l-[#00f2ff] group transition-all hover:bg-white/[0.07]">
                    <div className="flex flex-row items-center gap-4 w-full">
                        <div className="w-12 h-12 bg-[#00f2ff]/10 rounded-xl flex items-center justify-center text-[#00f2ff] shadow-inner shrink-0 border border-[#00f2ff]/20 relative z-10">
                          <ShieldCheck size={24} className="drop-shadow-[0_0_10px_rgba(0,242,255,0.5)]" />
                        </div>
                        <div className="flex-1 relative z-10 space-y-1 text-left">
                            <h4 className="text-sm font-black uppercase italic tracking-tighter text-white">Verify Account</h4>
                            <p className="text-[9px] text-gray-400 font-medium leading-relaxed">Unlock the elite technical missions network.</p>
                        </div>
                        <button onClick={handleVerifyClick} className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase italic tracking-widest transition-all shadow-glow active:scale-95 ${isUnderReview ? "bg-amber-500 text-black animate-pulse" : "bg-[#00f2ff] text-black hover:scale-105"}`}>{isUnderReview ? "Review" : "Start"}</button>
                    </div>

                    <div className="w-full grid grid-cols-2 gap-2 mt-2 border-t border-white/5 pt-3">
                         {[
                             {t: "Unlimited Gigs", i: <Layers size={10}/>},
                             {t: "Instant Vault Payouts", i: <Zap size={10}/>},
                             {t: "Higher Trust Score", i: <ThumbsUp size={10}/>},
                             {t: "Global Client Connect", i: <Globe size={10}/>}
                         ].map((benefit, b) => (
                             <div key={b} className="flex items-center gap-2">
                                 <div className="text-[#00f2ff]">{benefit.i}</div>
                                 <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">{benefit.t}</span>
                             </div>
                         ))}
                    </div>
                  </div>
                )}

                <div className="p-5 bg-white/3 border border-white/5 rounded-[25px] shadow-2xl">
                  <div className="flex justify-between items-center mb-3 px-1">
                    <h4 className="text-[8px] font-black uppercase tracking-widest text-gray-400">Account Progress</h4>
                    <span className="text-[8px] font-black text-[#00f2ff]">Phase 1 Sync</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { l: "Jobs", v: "0", i: <Target size={11} className="text-[#00f2ff]"/> },
                      { l: "Uptime", v: "99.9%", i: <Activity size={11} className="text-emerald-500"/> },
                      { l: "Status", v: "Tier 1", i: <Cpu size={11} className="text-amber-500"/> },
                      { l: "Score", v: "0.0", i: <Star size={11} className="text-purple-500"/> }
                    ].map((st, i) => (
                      <div key={i} className="bg-black/20 p-2.5 rounded-xl border border-white/5 text-center">
                         <div className="mb-0.5 flex justify-center">{st.i}</div>
                         <p className="text-[9px] font-black">{st.v}</p>
                         <p className="text-[5px] font-bold text-gray-600 uppercase leading-none">{st.l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* --- 💰 VAULT --- */}
          {activeTab === "earnings" && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4 pt-2">
               <div className="bg-linear-to-br from-[#00f2ff]/20 via-transparent to-transparent p-6 rounded-[30px] border border-white/10 shadow-3xl relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00f2ff]/5 blur-[60px] rounded-full" />
                  <div className="flex justify-between items-start mb-10">
                     <div className="p-3 bg-white/5 rounded-xl border border-white/10"><Landmark size={20} className="text-[#00f2ff]"/></div>
                     <div className="bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-2">
                        <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Secured Wallet</span>
                     </div>
                  </div>
                  <div className="space-y-1 mb-8">
                     <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Available Balance</p>
                     <h4 className="text-5xl font-black italic tracking-tighter text-white leading-none">$0.00</h4>
                     <p className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">Approx: KES 0.00</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                     <button onClick={() => showAlert("Insufficient Funds", "You do not have any money in your wallet to withdraw.", "error")} className="py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase italic shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2">Withdraw <ArrowUpRight size={14}/></button>
                     <button className="py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase italic active:scale-95 transition-all flex items-center justify-center gap-2 opacity-50 cursor-not-allowed">Transfer <Send size={12}/></button>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-white/3 border border-white/5 rounded-2xl text-left">
                     <div className="flex items-center gap-2 mb-2 text-gray-500"><History size={12}/><span className="text-[8px] font-black uppercase">Recent Activity</span></div>
                     <p className="text-[10px] text-gray-500 font-bold italic">No node transmissions yet.</p>
                  </div>
                  <div className="p-4 bg-white/3 border border-white/5 rounded-2xl text-left">
                     <div className="flex items-center gap-2 mb-2 text-gray-500"><TrendingUp size={12}/><span className="text-[8px] font-black uppercase">Node Growth</span></div>
                     <p className="text-[10px] text-gray-500 font-bold italic">Bidding active required.</p>
                  </div>
               </div>
            </motion.div>
          )}

          {/* --- 💼 GIGS --- */}
          {activeTab === "tasks" && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="flex justify-between items-center px-2"><h3 className="text-lg font-bold uppercase tracking-tighter">Gig <span className="text-[#00f2ff]">Feed</span></h3><div className="flex items-center gap-2 bg-emerald-500/10 px-2 py-0.5 rounded-full"><div className="w-1 h-1 bg-emerald-500 rounded-full animate-ping" /><span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest">Live</span></div></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {marketplaceGigs.map((g) => (
                  <div key={g.id} className={`p-4 rounded-[15px] bg-white/5 border border-white/10 transition-all ${g.status === 'Expired' ? 'opacity-40 grayscale' : 'hover:border-[#00f2ff]/30 shadow-xl'}`}>
                    <div className="flex justify-between items-start mb-2"><img src={g.img} className="w-8 h-8 rounded-lg object-cover border border-white/10" alt="cl" /><span className={`text-[7px] font-bold px-1.5 py-0.5 rounded uppercase ${g.status === 'Active' ? 'bg-[#00f2ff]/10 text-[#00f2ff]' : 'bg-white/5 text-gray-500'}`}>{g.dur}</span></div>
                    <h4 className="text-[10px] font-black uppercase mb-1 line-clamp-2 h-7 leading-tight">{g.title}</h4>
                    <div className="flex justify-between items-center pt-2 border-t border-white/5">
                        <p className="text-sm font-bold text-[#00f2ff] tracking-tighter">${g.budget}</p>
                        <button onClick={handleVerifyClick} className={`px-3 py-1 rounded-md text-[7px] font-black uppercase transition-all bg-white text-black hover:bg-[#00f2ff] ${isVerified ? 'opacity-100' : 'opacity-30'}`}>{isVerified ? "Bid" : "Apply"}</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 px-2">
                  <button onClick={handleVerifyClick} className="w-full py-4 bg-white/5 border border-dashed border-white/20 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase italic text-gray-500 hover:border-[#00f2ff]/50 hover:text-white transition-all group">
                      <Lock size={14} className="group-hover:text-[#00f2ff] transition-colors"/> See More Gigs
                  </button>
              </div>
            </motion.div>
          )}

          {/* Remaining tabs (Work, Chats, Stats, Me, Help) */}
          {activeTab === "contracts" && (
            <div className="pt-10 px-4 text-center space-y-6">
               <div className="p-16 bg-white/5 border border-red-500/20 rounded-[50px] shadow-3xl">
                  <ShieldAlert size={50} className="mx-auto text-red-500 mb-6" />
                  <h3 className="text-xl font-black uppercase italic text-white leading-none mb-2">Tab Locked</h3>
                  <p className="text-gray-400 text-[11px] mb-8 max-w-xs mx-auto italic">Complete your identity check to see your work and money history.</p>
                  {!isVerified && <button onClick={handleVerifyClick} className="w-full py-5 bg-red-600 text-white font-black rounded-2xl text-[10px] uppercase shadow-lg">Unlock Tab</button>}
               </div>
            </div>
          )}

          {activeTab === "messages" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
               <h3 className="text-xl font-bold uppercase px-2">System <span className="text-[#00f2ff]">Log</span></h3>
               {[
                 { t: "Nexus HQ", m: "Welcome Node. Please finish your verification to talk to others." },
                 { t: "Security Bot", m: "External account connection is encrypted. Identity sync is required." }
               ].map((msg, i) => (
                 <div key={i} onClick={() => setExpandedMsg(expandedMsg === i ? null : i)} className="p-6 rounded-[30px] bg-white/3 border border-white/5 cursor-pointer hover:bg-white/5 transition-all group">
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

          {activeTab === "analytics" && (
            <div className="space-y-8">
               <h3 className="text-xl font-bold uppercase px-2 text-left">Work <span className="text-[#00f2ff]">Pulse</span></h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { l: "Success", v: "0%", i: <CheckCircle2 size={16} className="text-emerald-500"/> },
                    { l: "Gigs", v: "0", i: <Briefcase size={16} className="text-blue-500"/> },
                    { l: "Trust", v: "Beta", i: <ShieldCheck size={16} className="text-purple-500"/> },
                    { l: "Paid", v: "$0.00", i: <DollarSign size={16} className="text-yellow-500"/> }
                  ].map(stat => (
                    <div key={stat.l} className="p-6 bg-white/5 border border-white/10 rounded-[25px] text-center shadow-xl">
                       <div className="mb-2 flex justify-center">{stat.i}</div>
                       <p className="text-[8px] text-gray-500 uppercase mb-1 font-bold">{stat.l}</p>
                       <p className="text-lg font-black">{stat.v}</p>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === "account" && (
            <div className="max-w-xl mx-auto space-y-6 text-center pt-2">
               <div className="p-10 bg-linear-to-br from-white/10 to-white/5 border border-white/20 rounded-[50px] shadow-3xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#00f2ff] to-transparent shadow-glow" />
                  <div className="relative w-24 h-24 mx-auto mb-6 bg-white/10 rounded-[35px] border border-white/10 flex items-center justify-center">
                    <UserCircle size={48} className="text-gray-500"/>
                    <div className="absolute -bottom-2 -right-2 bg-black border-2 border-[#00f2ff] p-1.5 rounded-xl text-[#00f2ff] shadow-glow"><Fingerprint size={14}/></div>
                  </div>
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-1 leading-none text-white">{user?.fullName}</h3>
                  <div className="inline-block px-4 py-1 bg-black/40 rounded-full border border-white/5 text-[8px] font-bold text-[#00f2ff] uppercase tracking-[0.3em] mb-8 shadow-inner italic">Account Pulse: Active</div>
                  
                  <div className="grid grid-cols-2 gap-3 px-2 mb-8">
                     <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-left">
                        <p className="text-[7px] font-black text-gray-500 uppercase mb-1">Node Security</p>
                        <div className="flex items-center gap-2 text-emerald-400 font-black text-[9px] uppercase italic"><Shield size={12}/> Encrypted</div>
                     </div>
                     <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-left">
                        <p className="text-[7px] font-black text-gray-500 uppercase mb-1">Settlement Relay</p>
                        <div className="flex items-center gap-2 text-[#00f2ff] font-black text-[9px] uppercase italic"><QrCode size={12}/> Localized</div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 px-2">
                     <button onClick={() => setActiveTab('earnings')} className="py-3.5 bg-white text-black rounded-2xl font-black uppercase text-[9px] shadow-xl active:scale-95 transition-all">Vault Hub</button>
                     <button onClick={() => setActiveTab('support')} className="py-3.5 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-[9px] text-white">Support</button>
                  </div>
               </div>
               <SignOutButton><button className="px-10 py-4 bg-red-500/10 border-2 border-red-500/20 text-red-500 font-black italic rounded-full uppercase text-[8px] active:scale-95 transition-all">Terminate Session</button></SignOutButton>
            </div>
          )}

          {activeTab === "support" && (
             <div className="space-y-6">
                <h3 className="text-xl font-bold uppercase px-2 tracking-widest text-[#00f2ff]">Help <span className="text-white">Center</span></h3>
                <div className="grid md:grid-cols-2 gap-5">
                   <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] space-y-6 shadow-2xl backdrop-blur-xl text-left">
                      <div className="space-y-1"><p className="text-[9px] font-black text-gray-500 uppercase leading-none mb-1">Support Email</p><p className="text-xs font-black italic text-white underline cursor-pointer" onClick={() => window.location.href="mailto:support@nexusgigs.me"}>support@nexusgigs.me</p></div>
                      <div className="space-y-1"><p className="text-[9px] font-black text-gray-500 uppercase leading-none mb-1">WhatsApp Direct</p><p className="text-xs italic text-[#00f2ff] font-bold">+1 (500) 555-0006</p></div>
                      <div className="pt-6 border-t border-white/5">
                        <p className="text-[10px] font-bold text-gray-500 uppercase mb-4 tracking-widest text-left">Type your problem here:</p>
                        <textarea value={supportMsg} onChange={e => setSupportMsg(e.target.value)} placeholder="How can we help?" className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-xs font-bold outline-none focus:border-[#00f2ff] h-32 mb-4 shadow-inner text-white resize-none" />
                        <button onClick={handleSupportEmail} className="w-full py-5 bg-[#00f2ff] text-black font-black rounded-2xl text-[10px] uppercase shadow-glow transition-all tracking-widest">Send Message</button>
                      </div>
                   </div>
                   <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] grid grid-cols-2 gap-3 shadow-2xl">
                      {[
                        { n: 'Instagram', i: <Share2 size={20}/>, l: 'https://www.instagram.com/nexusgigs' },
                        { n: 'TikTok', i: <Zap size={20}/>, l: 'https://www.tiktok.com/@nexusgigss' },
                        { n: 'Telegram', i: <Send size={20}/>, l: 'https://t.me/nexusGigs' },
                        { n: 'Facebook', i: <ThumbsUp size={20}/>, l: 'https://www.facebook.com/share/1CJMYz5kGH/' }
                      ].map(soc => (
                        <button key={soc.n} onClick={() => window.open(soc.l, '_blank')} className="p-5 bg-black/40 border border-white/5 rounded-3xl flex flex-col items-center gap-3 hover:border-[#00f2ff] group transition-all shadow-xl active:scale-95"><div className="text-gray-400 group-hover:text-white transition-all group-hover:scale-110">{soc.i}</div><span className="text-[8px] font-black uppercase text-gray-500">{soc.n}</span></button>
                      ))}
                      <button onClick={() => window.open('https://whatsapp.com/channel/0029VbCmx1AAu3aMiY7XVf1J', '_blank')} className="col-span-2 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-[30px] flex items-center justify-between group hover:bg-emerald-500 transition-all shadow-lg px-8 active:scale-95"><span className="text-[10px] font-black uppercase italic group-hover:text-black">WhatsApp Channel</span><MessageCircle size={20} className="text-emerald-500 group-hover:text-black"/></button>
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
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="relative w-full max-w-90 bg-[#0a0f1e] border-2 border-white/10 rounded-[35px] p-8 text-center shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#00f2ff] to-transparent shadow-glow" />
              
              {paymentStep === "terms" ? (
                <div className="space-y-4">
                  <ShieldCheck size={36} className="text-[#00f2ff] mx-auto shadow-glow" />
                  <h3 className="text-lg font-black italic uppercase tracking-tight text-white leading-none">Verification</h3>
                  
                  <div className="bg-white/5 p-4 rounded-2xl text-left border border-white/5 space-y-3 shadow-inner">
                    <div className="space-y-2">
                      <div className="flex gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-[#00f2ff]/20 flex items-center justify-center shrink-0"><span className="text-[9px] font-black text-[#00f2ff]">1</span></div>
                        <p className="text-[9px] text-gray-300 font-medium leading-relaxed"><strong>Vetting Fee:</strong> A one-time <span className="text-white">$10 (KES 1,300)</span> commitment fee to filter out bots and maintain high job quality.</p>
                      </div>
                      <div className="flex gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-[#00f2ff]/20 flex items-center justify-center shrink-0"><span className="text-[9px] font-black text-[#00f2ff]">2</span></div>
                        <p className="text-[9px] text-gray-300 font-medium leading-relaxed"><strong>Review Process:</strong> Our team will check your profile. We will email you a specialized survey and schedule a quick intro call.</p>
                      </div>
                      <div className="flex gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-[#00f2ff]/20 flex items-center justify-center shrink-0"><span className="text-[9px] font-black text-[#00f2ff]">3</span></div>
                        <p className="text-[9px] text-gray-300 font-medium leading-relaxed"><strong>Full Access:</strong> Once approved, you gain unlimited bidding rights and instant access to all global vault withdrawals.</p>
                      </div>
                    </div>
                    <div className="pt-1.5 border-t border-white/5">
                      <p className="text-[8px] text-emerald-400 font-bold italic flex items-center gap-1.5 leading-none"><CheckCircle2 size={8}/> 100% Refund Guarantee if you fail the screening process.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5 cursor-pointer text-left transition-all hover:bg-white/10" onClick={() => setAgreedToTerms(!agreedToTerms)}>
                    <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${agreedToTerms ? 'bg-[#00f2ff] border-[#00f2ff]' : 'border-white/20'}`}>{agreedToTerms && <X size={10} className="text-black font-black"/>}</div>
                    <span className="text-[8px] font-black italic text-gray-400 leading-tight uppercase">I agree to pay the $10 fee and follow the refund rules.</span>
                  </div>
                  
                  <button disabled={!agreedToTerms} onClick={() => setPaymentStep("choice")} className={`w-full py-4 rounded-2xl font-black uppercase italic text-[10px] transition-all tracking-[0.2em] ${agreedToTerms ? 'bg-[#00f2ff] text-black shadow-glow hover:scale-[1.02]' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}>Pay & Sync</button>
                </div>
              ) : paymentStep === "choice" ? (
                <div className="space-y-4 text-sm">
                  <h3 className="text-[11px] font-black uppercase italic tracking-widest text-[#00f2ff]">SELECT PAYMENT METHOD</h3>
                  <div className="space-y-2.5 text-left">
                    <button onClick={() => handleSecurePayment("CARD")} className="w-full p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between group hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20"><Landmark size={18} className="text-white" /></div>
                        <div>
                          <p className="font-black text-white text-[10px]">Credit / Debit Card <span className="ml-1.5 text-[7px] px-1.5 py-0.5 bg-amber-500/10 text-amber-500/60 rounded-full font-bold uppercase border border-amber-500/20">Bank</span></p>
                          <p className="text-[8px] text-gray-500 font-bold uppercase">Visa, Mastercard, Amex</p>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-gray-600 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button onClick={() => setPaymentStep("mpesa")} className="w-full p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between group hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center font-black text-white shadow-lg shadow-emerald-500/20">M</div>
                        <div>
                          <p className="font-black text-white text-[10px]">M-Pesa <span className="ml-1.5 text-[7px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-500 rounded-full font-bold uppercase">Instant</span></p>
                          <p className="text-[8px] text-gray-500 font-bold uppercase">Pay via mobile money</p>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-gray-600 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button onClick={() => setPaymentStep("binance")} className="w-full p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between group hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20"><Zap size={16} className="fill-white text-white" /></div>
                        <div>
                          <p className="font-black text-white text-[10px]">Binance (USDT) <span className="ml-1.5 text-[7px] px-1.5 py-0.5 bg-amber-500/20 text-amber-500 rounded-full font-bold uppercase">Crypto</span></p>
                          <p className="text-[8px] text-gray-500 font-bold uppercase">Pay with USDT crypto</p>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-gray-600 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button disabled className="w-full p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between group opacity-50 cursor-not-allowed">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white">PP</div>
                        <div>
                          <p className="font-black text-white text-[10px]">PayPal <span className="ml-1.5 text-[7px] px-1.5 py-0.5 bg-amber-500/10 text-amber-500/60 rounded-full font-bold uppercase border border-amber-500/20">Limited regions</span></p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase">Pay with your PayPal account</p>
                        </div>
                      </div>
                      <Info size={14} className="text-gray-600" />
                    </button>
                  </div>
                  <div className="pt-4 border-t border-white/5 text-left">
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Sparkles size={12} className="text-[#00f2ff]"/> Why Purchase?</p>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="p-2.5 bg-white/3 border border-white/5 rounded-xl"><div className="w-5 h-5 bg-purple-600/20 rounded-lg flex items-center justify-center mb-1.5"><Zap size={10} className="text-purple-500"/></div><p className="text-[7px] font-bold text-white uppercase leading-tight">Access unlimited tasks</p></div>
                      <div className="p-2.5 bg-white/3 border border-white/5 rounded-xl"><div className="w-5 h-5 bg-emerald-600/20 rounded-lg flex items-center justify-center mb-1.5"><DollarSign size={10} className="text-emerald-500"/></div><p className="text-[7px] font-bold text-white uppercase leading-tight">Earn more with more bids</p></div>
                    </div>
                  </div>
                  <button onClick={() => setPaymentStep("terms")} className="mt-4 text-[8px] text-gray-500 uppercase font-black italic tracking-[0.3em]">Go Back</button>
                </div>
              ) : paymentStep === "binance" ? (
                <div className="space-y-4">
                  <div className="bg-indigo-700/20 -mx-8 -mt-8 p-5 flex items-center justify-between border-b border-white/10 text-left">
                    <div className="flex items-center gap-2.5">
                       <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center"><Zap size={14} className="text-white fill-white"/></div>
                       <div><p className="text-[7px] font-black text-indigo-300 uppercase leading-none">PAYMENT</p><p className="text-[10px] font-black text-white uppercase">Pay with Binance USDT</p></div>
                    </div>
                    <button onClick={() => setPaymentStep("choice")} className="p-1.5 hover:bg-white/5 rounded-full transition-all"><X size={16} className="text-gray-400"/></button>
                  </div>
                  <div className="bg-white rounded-xl p-3.5 shadow-2xl">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=TFWxe4TFcjUNgPJVgf5iXrMsw1oe4gDv9X" alt="Binance QR" className="w-36 h-36 mx-auto" />
                    <p className="mt-2.5 text-[8px] font-bold text-gray-400 uppercase">Scan to get wallet address</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 border-y border-white/5 py-3.5">
                    <div className="text-left"><p className="text-[7px] font-black text-gray-500 uppercase mb-0.5">Amount to Send</p><p className="text-md font-black text-white">$10.00 USDT</p></div>
                    <div className="text-right"><p className="text-[7px] font-black text-gray-500 uppercase mb-0.5">You Receive</p><p className="text-md font-black text-[#00f2ff]">Phase 1 Active</p></div>
                  </div>
                  <div className="space-y-2.5 text-left">
                    <p className="text-[8px] font-black text-gray-500 uppercase">WALLET ADDRESS</p>
                    <div className="flex gap-2">
                       <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-[8px] font-mono text-gray-300 break-all truncate">TFWxe4TFcjUNgPJVgf5iXrMsw1oe4gDv9X</div>
                       <button onClick={copyAddress} className="bg-white/5 border border-white/10 p-3 rounded-xl hover:bg-white/10 transition-all text-gray-400 hover:text-white">
                          {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                       </button>
                    </div>
                  </div>
                  <div className="p-2.5 bg-blue-500/5 border border-blue-500/20 rounded-xl flex items-start gap-2.5 text-left">
                    <Info size={12} className="text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-[8px] font-bold text-blue-300/80 leading-relaxed uppercase">Only send USDT (TRC20) to this address. Other assets will be lost forever.</p>
                  </div>
                  <button onClick={() => showAlert("Transmitted", "Node signal sent. Once the blockchain confirms your hash, your node will sync within 2 hours.", "success")} className="w-full py-3.5 bg-[#00f2ff] text-black font-black rounded-xl uppercase italic text-[9px] shadow-glow">Confirm Transmission</button>
                </div>
              ) : (
                <div className="space-y-6">
                   <Smartphone size={28} className="text-emerald-500 mx-auto animate-bounce" />
                   <div className="space-y-1.5">
                      <h3 className="text-md font-black uppercase italic text-white leading-none">M-Pesa Sync</h3>
                      <p className="text-[9px] text-gray-500 font-bold uppercase leading-none">Enter phone to pay $10</p>
                   </div>
                   <input value={mpesaNumber} onChange={e => setMpesaNumber(e.target.value)} placeholder="2547XXXXXXXX" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-center text-xl font-black text-white outline-none focus:border-emerald-500 shadow-inner" />
                   <div className="space-y-3">
                      <button disabled={isPaying} onClick={() => handleSecurePayment("M-PESA")} className={`w-full py-4 bg-emerald-600 text-white font-black rounded-xl uppercase italic text-[10px] shadow-lg tracking-widest`}>{isPaying ? "Sending..." : "Pay $10 (1,300 KES)"}</button>
                      <button onClick={() => setPaymentStep("choice")} className="text-[8px] text-gray-500 uppercase font-black italic tracking-widest">Back</button>
                   </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- CUSTOM ALERT --- */}
      <AnimatePresence>
        {customAlert.show && (
          <div className="fixed inset-0 z-300 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-75 bg-[#0a0f1e] border-2 border-white/10 rounded-[30px] p-6 text-center shadow-3xl relative">
                <div className={`absolute top-0 left-0 w-full h-1.5 ${customAlert.type === 'error' ? 'bg-red-500' : 'bg-[#00f2ff] shadow-glow'}`} />
                <div className="mb-4 flex justify-center">
                  {customAlert.type === 'error' ? <AlertTriangle size={28} className="text-red-500" /> : customAlert.type === 'success' ? <CheckCircle size={28} className="text-emerald-500" /> : <Info size={28} className="text-[#00f2ff]" />}
                </div>
                <h4 className="text-sm font-black uppercase italic mb-2.5 text-white tracking-tighter leading-none">{customAlert.title}</h4>
                <p className="text-[9px] text-gray-400 italic mb-6 leading-relaxed tracking-wide">{customAlert.msg}</p>
                <button onClick={() => setCustomAlert({...customAlert, show: false})} className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase italic hover:bg-white hover:text-black transition-all">Dismiss</button>
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