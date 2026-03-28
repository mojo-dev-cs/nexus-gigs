"use client";

import { useState } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { verifyMpesaPayment } from "@/app/dashboard/_actions/payment";
import { useRouter } from "next/navigation";

export const FreelancerView = ({ jobs, userMetadata }: { jobs: any[], userMetadata: any }) => {
  const { user } = useUser();
  const router = useRouter();
  
  // States
  const [activeTab, setActiveTab] = useState("home");
  const [isVerified, setIsVerified] = useState(userMetadata?.isVerified || false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState<string | null>("mpesa");
  
  // Profile Data States
  const [skills, setSkills] = useState(["Next.js", "React", "Tailwind", "Python"]);
  const [newSkill, setNewSkill] = useState("");

  // Navigation Pill Data
  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'tasks', icon: '💼', label: 'Gigs' },
    { id: 'contracts', icon: '📜', label: 'Work' },
    { id: 'messages', icon: '💬', label: 'Chats' },
    { id: 'earnings', icon: '💰', label: 'Wallet' },
    { id: 'analytics', icon: '📊', label: 'Stats' },
    { id: 'account', icon: '👤', label: 'Profile' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  // --- 💼 12 HIGH-FIDELITY GIGS DATA ---
  const marketplaceGigs = [
    { id: "1", title: "E-commerce API Integration", budget: 450, client: "Alpha Tech", rating: "4.9", dur: "5 Days", img: "https://ui-avatars.com/api/?name=AT&background=00f2ff&color=000", expired: false },
    { id: "2", title: "Python Web Scraper", budget: 120, client: "Maji Homes", rating: "5.0", dur: "2 Days", img: "https://ui-avatars.com/api/?name=MH&background=10b981&color=fff", expired: true },
    { id: "3", title: "Modern Landing Page Design", budget: 300, client: "Nexa Studio", rating: "4.8", dur: "3 Days", img: "https://ui-avatars.com/api/?name=NS&background=8b5cf6&color=fff", expired: false },
    { id: "4", title: "Smart Contract Security Audit", budget: 1500, client: "Defi Pulse", rating: "5.0", dur: "7 Days", img: "https://ui-avatars.com/api/?name=DP&background=f59e0b&color=fff", expired: false },
    { id: "5", title: "Technical Writing (5 posts)", budget: 250, client: "DevStream", rating: "4.7", dur: "10 Days", img: "https://ui-avatars.com/api/?name=DS&background=3b82f6&color=fff", expired: true },
    { id: "6", title: "Logo Branding Package", budget: 180, client: "Green Loop", rating: "4.9", dur: "4 Days", img: "https://ui-avatars.com/api/?name=GL&background=10b981&color=fff", expired: false },
    { id: "7", title: "Next.js Dashboard Fixes", budget: 90, client: "Cloud Dev", rating: "4.6", dur: "24 Hours", img: "https://ui-avatars.com/api/?name=CD&background=6b7280&color=fff", expired: false },
    { id: "8", title: "SEO Optimization Strategy", budget: 350, client: "Vogue KE", rating: "5.0", dur: "6 Days", img: "https://ui-avatars.com/api/?name=VK&background=ec4899&color=fff", expired: false },
    { id: "9", title: "Mobile Wireframing (Figma)", budget: 600, client: "Zidi Pay", rating: "4.8", dur: "5 Days", img: "https://ui-avatars.com/api/?name=ZP&background=00f2ff&color=000", expired: false },
    { id: "10", title: "Excel Macros & Data Cleanup", budget: 75, client: "Logi Corp", rating: "4.5", dur: "2 Days", img: "https://ui-avatars.com/api/?name=LC&background=ef4444&color=fff", expired: true },
    { id: "11", title: "Social Media Manager", budget: 200, client: "Kula Exp", rating: "4.9", dur: "30 Days", img: "https://ui-avatars.com/api/?name=KE&background=f97316&color=fff", expired: false },
    { id: "12", title: "App Localization (Swahili)", budget: 150, client: "Global App", rating: "5.0", dur: "4 Days", img: "https://ui-avatars.com/api/?name=GA&background=00f2ff&color=000", expired: false },
  ];

  // --- ⚡ REAL PAYMENT HANDLER ---
  const handleMpesaVerification = async () => {
    if (mpesaNumber.length < 10) return alert("Enter a valid M-Pesa number.");
    setIsPaying(true);

    const result = await verifyMpesaPayment(mpesaNumber);

    if (result.success) {
      alert("✅ " + result.message);
      setIsPaying(false);
      // Logic for confirming manually if needed
    } else {
      setIsPaying(false);
      alert("❌ ERROR: " + result.error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-44 pt-4 px-4 text-white relative selection:bg-[#00f2ff]/30">
      
      {/* --- 🏠 HOME --- */}
      {activeTab === "home" && (
        <div className="space-y-8 animate-in fade-in duration-700">
          <header><h2 className="text-2xl font-black italic tracking-tighter uppercase underline decoration-[#00f2ff] underline-offset-8">NODE: {user?.firstName}</h2></header>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 bg-linear-to-br from-[#0a0f1e] to-[#00f2ff]/10 border border-[#00f2ff]/20 rounded-[40px] shadow-2xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#00f2ff] mb-2 italic">Global Balance</p>
              <h3 className="text-4xl font-black italic mb-2">$0.00</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase mb-6">~ 0.00 KES</p>
              <button onClick={() => setActiveTab('earnings')} className="w-full py-3 bg-[#00f2ff] text-black font-black rounded-xl text-[9px] uppercase hover:bg-white transition-all">Withdraw Funds</button>
            </div>
            <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] flex flex-col justify-center text-center italic"><p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Win Rate</p><h3 className="text-4xl font-black italic text-emerald-500">0%</h3></div>
            <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] flex flex-col justify-center text-center italic"><p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Bids Left</p><h3 className="text-4xl font-black italic">4</h3></div>
          </div>

          <div className="p-10 bg-[#00f2ff]/5 border border-[#00f2ff]/20 rounded-[48px] space-y-6">
             <h3 className="text-xl font-black italic uppercase tracking-tighter border-b border-[#00f2ff]/10 pb-4">Nexus Protocol <span className="text-[#00f2ff]">Briefing</span></h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[11px] text-gray-400 font-medium leading-relaxed">
                <div className="space-y-3">
                   <h4 className="text-xs font-black text-[#00f2ff] uppercase italic tracking-widest">Why Verify ($10 Fee)?</h4>
                   <p>Unlock gigs, earn the "Elite" badge, and get priority in client feeds. Required to prevent bots and secure payments.</p>
                   {/* PAYMENT PROMPT ADDED HERE */}
                   {!isVerified && (
                    <button 
                      onClick={() => setShowVerifyModal(true)} 
                      className="mt-2 px-6 py-3 bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 rounded-xl text-[9px] font-black uppercase hover:bg-emerald-500 hover:text-white transition-all w-fit"
                    >
                      Initialize Verification Process →
                    </button>
                   )}
                </div>
                <div className="space-y-3">
                   <h4 className="text-xs font-black text-[#00f2ff] uppercase italic tracking-widest">2% Commission</h4>
                   <p>A flat 2.0% service fee is applied to every paid gig to maintain cloud infrastructure and 24/7 mission support.</p>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* --- 💼 GIGS MARKETPLACE (12 JOBS) --- */}
      {activeTab === "tasks" && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-xl font-black uppercase italic tracking-tighter">Mission <span className="text-[#00f2ff]">Feed</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketplaceGigs.map(g => (
              <div key={g.id} className={`p-6 border rounded-[30px] transition-all bg-white/2 ${g.expired ? 'border-red-500/20 grayscale' : 'border-white/10 hover:border-[#00f2ff]/30 shadow-lg'}`}>
                <div className="flex justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <img src={g.img} className="w-8 h-8 rounded-full border border-white/10 shadow-sm" alt="Client" />
                    <div><p className="text-[10px] font-bold text-white uppercase">{g.client}</p><p className="text-[8px] font-black text-emerald-500 italic">⭐ {g.rating}/5</p></div>
                  </div>
                  <p className="text-lg font-black text-[#00f2ff]">${g.budget}</p>
                </div>
                <h4 className="text-sm font-bold mb-6 line-clamp-1">{g.title}</h4>
                <div className="flex justify-between items-center">
                  <span className={`text-[9px] font-black uppercase tracking-widest ${g.expired ? 'text-red-500' : 'text-gray-500'}`}>{g.expired ? "⚠️ Expired" : `⏳ ${g.dur}`}</span>
                  {!g.expired && (
                    <button onClick={() => !isVerified && setShowVerifyModal(true)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black uppercase hover:bg-[#00f2ff] hover:text-black transition-all">Submit Bid</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- 📜 WORK: ACTIVATION GATE --- */}
      {activeTab === "contracts" && (
        <div className="space-y-8 animate-in fade-in text-center py-20">
           <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/20"><span className="text-3xl">🛡️</span></div>
           <h2 className="text-3xl font-black uppercase italic tracking-tighter">Mission <span className="text-amber-500">Locked</span></h2>
           <p className="max-w-md mx-auto text-gray-500 text-sm leading-relaxed">To begin your first gig and access the workspace, you must activate your account.</p>
           <button onClick={() => setShowVerifyModal(true)} className="mt-8 px-10 py-4 bg-amber-500 text-black font-black rounded-2xl uppercase text-[10px] tracking-widest hover:scale-105 transition-all">Activate Account Now</button>
        </div>
      )}

      {/* --- 💬 CHATS: WELCOME HUB --- */}
      {activeTab === "messages" && (
        <div className="h-125 flex border border-white/10 rounded-[40px] overflow-hidden bg-white/1">
          <div className="w-1/3 border-r border-white/10 p-6 bg-white/2"><p className="text-[9px] font-black text-[#00f2ff] uppercase italic tracking-widest">Satellite Inbox</p></div>
          <div className="flex-1 flex flex-col p-8">
             <div className="bg-white/5 p-6 rounded-[30px] max-w-lg mb-4">
                <p className="text-xs leading-relaxed">
                   Welcome to <span className="font-black italic text-white uppercase underline decoration-[#00f2ff]">NexusGigs</span>, Operator. <br/><br/>
                   This is your secure communication hub. All transmissions here are encrypted. Coordinate with Visionaries to complete missions and receive instant payouts.
                </p>
                <p className="text-[8px] font-black text-gray-600 mt-4 uppercase italic tracking-widest text-right">MARCH 28, 2026 • SIGNED: HQ</p>
             </div>
          </div>
        </div>
      )}

      {/* --- 💰 WALLET --- */}
      {activeTab === "earnings" && (
        <div className="space-y-8 animate-in fade-in">
           <div className="bg-[#0a0f1e] border border-white/10 rounded-[40px] overflow-hidden">
              <div className="bg-linear-to-r from-purple-900/40 to-black p-10 flex justify-between items-end border-b border-white/5">
                 <div><h3 className="text-4xl font-black italic">$0.00 <span className="text-xs text-gray-500 font-normal">available</span></h3></div>
              </div>
              <div className="p-10 space-y-8">
                 <h4 className="text-xs font-black uppercase tracking-widest italic">Request Withdrawal</h4>
                 <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setWithdrawMethod('mpesa')} className={`p-6 rounded-3xl border transition-all text-left ${withdrawMethod === 'mpesa' ? 'border-[#00f2ff] bg-[#00f2ff]/5' : 'border-white/10 bg-white/5'}`}><p className="font-bold">M-Pesa</p></button>
                    <button onClick={() => setWithdrawMethod('binance')} className={`p-6 rounded-3xl border transition-all text-left ${withdrawMethod === 'binance' ? 'border-[#00f2ff] bg-[#00f2ff]/5' : 'border-white/10 bg-white/5'}`}><p className="font-bold">Binance Pay</p></button>
                 </div>
                 <button className="w-full py-5 bg-purple-900/40 border border-purple-500/30 text-white font-black rounded-3xl uppercase text-[10px] tracking-widest opacity-50 cursor-not-allowed text-center">Withdraw Instantly →</button>
              </div>
           </div>
        </div>
      )}

      {/* --- 📊 STATS --- */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in zoom-in-95">
           <div className="p-8 bg-white/5 border border-white/10 rounded-[40px]">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-8 italic text-center">Earnings Trend</p>
              <div className="h-40 flex items-end gap-3 px-6">{[10, 20, 15, 35, 20, 50, 40, 25, 60, 45, 10, 0].map((h, i) => (<div key={i} className="flex-1 bg-white/5 rounded-t-lg transition-all hover:bg-[#00f2ff]/50" style={{ height: `${h}%` }} />))}</div>
           </div>
           <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] space-y-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic">Growth Intelligence</p>
              <div className="space-y-4">{['Profile Impressions', 'Search Appearances'].map(x => (<div key={x} className="flex justify-between items-end border-b border-white/5 pb-2 text-xs"><span>{x}</span><span className="font-black italic text-[#00f2ff]">0</span></div>))}</div>
           </div>
        </div>
      )}

      {/* --- 👤 PROFILE --- */}
      {activeTab === "account" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
           <div className="md:col-span-1 bg-white/2 border border-white/10 rounded-[48px] p-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-[#0a0f1e] border-4 border-purple-500/20 rounded-full flex items-center justify-center text-4xl font-black italic mb-6">{user?.firstName?.[0]}</div>
              <h3 className="text-xl font-black uppercase italic tracking-tighter">{user?.firstName}</h3>
              <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-8">📍 RUIRU, KE</p>
              <div className="w-full space-y-4 text-left border-t border-white/5 pt-8">
                {skills.map(s => <span key={s} className="inline-block px-3 py-1 bg-white/5 rounded-lg text-[9px] font-bold mr-2 mb-2 uppercase">{s}</span>)}
                <div className="flex gap-2 mt-4"><input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Skill..." className="flex-1 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs outline-none" /><button onClick={() => {if(newSkill) setSkills([...skills, newSkill]); setNewSkill("");}} className="bg-[#00f2ff] text-black px-4 py-2 rounded-xl text-[10px] font-black">ADD</button></div>
              </div>
           </div>
           <div className="md:col-span-2 p-10 bg-white/5 border border-white/10 rounded-[48px] space-y-6">
              <h4 className="text-xs font-black uppercase tracking-widest italic">Identity Details</h4>
              <div className="space-y-4 border-b border-white/5 pb-6 text-sm">
                <p className="font-bold">{user?.fullName}</p>
                <p className="font-bold text-gray-400">{user?.emailAddresses[0].emailAddress}</p>
              </div>
              <div className={`p-6 rounded-4xl border flex items-center gap-6 ${isVerified ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-amber-500/20 bg-amber-500/5'}`}><span className="text-2xl">{isVerified ? '🏆' : '⚠️'}</span><p className="text-xs font-black uppercase italic">{isVerified ? 'Active Protocol' : 'Restricted Access'}</p></div>
           </div>
        </div>
      )}

      {/* --- ⚙️ SETTINGS --- */}
      {activeTab === "settings" && (
        <div className="max-w-xl mx-auto space-y-4 animate-in fade-in">
           {['Global Notifications', 'Security & 2FA', 'Payment Gateways'].map(s => (
              <div key={s} className="p-6 bg-white/5 border border-white/10 rounded-[30px] flex justify-between items-center group cursor-pointer hover:border-[#00f2ff]/30 transition-all"><span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white">{s}</span><span className="text-gray-700">→</span></div>
           ))}
           <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] mt-10 text-center space-y-6">
              <div className="flex justify-center gap-6">{['𝕏', '📷', '💬', '💼'].map((icon, i) => (<button key={i} className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-xl">{icon}</button>))}</div>
              <SignOutButton><button className="w-full py-4 mt-6 bg-red-500/10 border border-red-500/20 text-red-500 font-black rounded-2xl text-[10px] uppercase">Sign Out</button></SignOutButton>
           </div>
        </div>
      )}

      {/* --- 🚨 VERIFY MODAL --- */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-300 flex items-center justify-center p-6 backdrop-blur-3xl">
          <div className="absolute inset-0 bg-[#020617]/95" onClick={() => setShowVerifyModal(false)} />
          <div className="relative w-full max-w-sm bg-[#0a0f1e] border border-white/10 rounded-[48px] p-10 text-center animate-in zoom-in-95">
            <h3 className="text-2xl font-black uppercase text-white mb-2 italic">ACTIVATE <span className="text-[#00f2ff]">GIGS</span></h3>
            <p className="text-gray-400 text-[11px] mb-8 italic">Verification fee: <span className="text-white font-bold">$10.00</span>. Required to unlock professional contracts.</p>
            <div className="space-y-3">
              <input value={mpesaNumber} onChange={e => setMpesaNumber(e.target.value)} placeholder="07XXXXXXXX" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-center font-bold outline-none focus:border-[#00f2ff]" />
              <button disabled={isPaying} onClick={handleMpesaVerification} className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-500/10">
                {isPaying ? "ENCRYPTING..." : "Pay via M-Pesa"}
              </button>
              <button onClick={() => { setIsVerified(true); setShowVerifyModal(false); router.refresh(); }} className="w-full py-2 text-[8px] font-black uppercase text-gray-600 hover:text-white transition-all">
                Confirm Activation (Paid)
              </button>
            </div>
          </div>
        </div>
      )}

      <button onClick={() => setActiveTab('messages')} className="fixed bottom-32 right-8 w-14 h-14 bg-[#00f2ff] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(0,242,255,0.4)] hover:scale-110 active:scale-90 transition-all z-100"><span className="text-2xl text-black font-black">?</span></button>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-200 w-[95%] max-w-4xl flex justify-around items-center p-2 bg-[#0a0f1e]/90 backdrop-blur-3xl border border-white/10 rounded-full shadow-2xl no-scrollbar overflow-x-auto">
         {navItems.map(item => (
           <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center py-3 px-5 rounded-full min-w-17.5 transition-all duration-300 ${activeTab === item.id ? 'bg-[#00f2ff] text-black scale-110 shadow-[0_0_20px_rgba(0,242,255,0.3)]' : 'text-gray-500 hover:text-white'}`}>
              <span className="text-xl mb-0.5">{item.icon}</span>
              <span className="text-[7px] font-black uppercase tracking-tighter">{item.label}</span>
           </button>
         ))}
      </div>
    </div>
  );
};