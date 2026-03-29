"use client";

import { useState, useEffect } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

declare global {
  interface Window { PayHero: any; }
}

export const FreelancerView = ({ jobs, userMetadata }: { jobs: any[], userMetadata: any }) => {
  const { user } = useUser();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("home");
  const [isVerified, setIsVerified] = useState(userMetadata?.status === "Verified");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [currency, setCurrency] = useState<"USD" | "KES">("USD");
  const [withdrawMethod, setWithdrawMethod] = useState<"mpesa" | "binance" | null>(null);

  const skills = ["Next.js", "React", "Node.js", "TypeScript", "Python", "Solidity", "Web3"];

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

  // --- 💼 15 HIGH-FIDELITY GIGS ---
  const marketplaceGigs = [
    { id: "1", title: "Next.js E-commerce Fix", budget: 450, client: "Alpha Tech", rating: 4.9, dur: "2 Days Left", img: "https://i.pravatar.cc/150?u=1", closed: false },
    { id: "2", title: "Python Data Scraper", budget: 120, client: "Maji Homes", rating: 5.0, dur: "Expired", img: "https://i.pravatar.cc/150?u=2", closed: true },
    { id: "3", title: "Landing Page UI/UX", budget: 300, client: "Nexa Studio", rating: 4.8, dur: "5 Hours Left", img: "https://i.pravatar.cc/150?u=3", closed: false },
    { id: "4", title: "Smart Contract Audit", budget: 1500, client: "Defi Pulse", rating: 5.0, dur: "7 Days Left", img: "https://i.pravatar.cc/150?u=4", closed: false },
    { id: "5", title: "React Native Debugging", budget: 600, client: "AppFlow", rating: 4.7, dur: "Expired", img: "https://i.pravatar.cc/150?u=5", closed: true },
    { id: "6", title: "SEO Content Strategy", budget: 250, client: "Vogue KE", rating: 4.9, dur: "1 Day Left", img: "https://i.pravatar.cc/150?u=6", closed: false },
    { id: "7", title: "Logo Branding Pack", budget: 200, client: "Eco Green", rating: 4.6, dur: "3 Days Left", img: "https://i.pravatar.cc/150?u=7", closed: false },
    { id: "8", title: "Fullstack Dashboard", budget: 2500, client: "Zidi Pay", rating: 5.0, dur: "Expired", img: "https://i.pravatar.cc/150?u=8", closed: true },
    { id: "9", title: "Technical Writing", budget: 80, client: "Dev Blog", rating: 4.8, dur: "12 Hours Left", img: "https://i.pravatar.cc/150?u=9", closed: false },
    { id: "10", title: "Firebase Integration", budget: 400, client: "Swift It", rating: 4.9, dur: "4 Days Left", img: "https://i.pravatar.cc/150?u=10", closed: false },
    { id: "11", title: "Video Editing (YT)", budget: 150, client: "Creator X", rating: 4.7, dur: "Expired", img: "https://i.pravatar.cc/150?u=11", closed: true },
    { id: "12", title: "Shopify Store Setup", budget: 550, client: "Drop Ship", rating: 5.0, dur: "6 Days Left", img: "https://i.pravatar.cc/150?u=12", closed: false },
    { id: "13", title: "API Documentation", budget: 300, client: "FinTech", rating: 4.8, dur: "Expired", img: "https://i.pravatar.cc/150?u=13", closed: true },
    { id: "14", title: "Social Media Manager", budget: 700, client: "Nova Co", rating: 4.9, dur: "2 Weeks Left", img: "https://i.pravatar.cc/150?u=14", closed: false },
    { id: "15", title: "PostgreSQL Optimizer", budget: 900, client: "Data Core", rating: 5.0, dur: "3 Hours Left", img: "https://i.pravatar.cc/150?u=15", closed: false },
  ];

  const handleMpesaVerification = () => {
    if (mpesaNumber.length < 10) return alert("Enter valid M-Pesa number");
    setIsPaying(true);
    if (window.PayHero) {
      window.PayHero.init({
        paymentUrl: "https://lipwa.link/6861",
        containerId: "payHeroContainer",
        channelId: 6861,
        amount: 1250,
        phone: mpesaNumber,
        reference: `verify_${user?.id || Date.now()}`,
        callbackUrl: "https://nexus-gigs.vercel.app/api/mpesa-callback",
      });
    } else {
      alert("Payment system loading... try again in 2s.");
      setIsPaying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-44 pt-4 px-4 text-white relative font-sans selection:bg-[#00f2ff]/30">
      
      {/* --- 🏠 HOME --- */}
      {activeTab === "home" && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <header className="flex justify-between items-center">
            <h2 className="text-2xl font-black italic tracking-tighter uppercase underline decoration-[#00f2ff] underline-offset-8">NODE: {user?.firstName}</h2>
            {isVerified ? (
              <span className="bg-emerald-500/10 text-emerald-500 text-[8px] font-black px-4 py-1.5 rounded-full border border-emerald-500/20 uppercase tracking-widest flex items-center gap-2">🏆 Verified Elite</span>
            ) : (
              <span className="bg-amber-500/10 text-amber-500 text-[8px] font-black px-4 py-1.5 rounded-full border border-amber-500/20 uppercase tracking-widest animate-pulse">Action Required</span>
            )}
          </header>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 bg-linear-to-br from-[#0a0f1e] to-[#00f2ff]/10 border border-[#00f2ff]/20 rounded-[40px] shadow-2xl">
              <p className="text-[10px] font-black uppercase text-[#00f2ff] mb-2 italic">Nexus Balance</p>
              <h3 className="text-4xl font-black italic mb-2">$0.00</h3>
              <button onClick={() => setActiveTab('earnings')} className="w-full py-3 bg-[#00f2ff] text-black font-black rounded-xl text-[9px] uppercase hover:bg-white transition-all">Withdraw</button>
            </div>
            <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] text-center flex flex-col justify-center"><p className="text-[10px] font-black uppercase text-gray-500 mb-2">Success Rate</p><h3 className="text-4xl font-black italic text-emerald-500">0%</h3></div>
            <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] text-center flex flex-col justify-center"><p className="text-[10px] font-black uppercase text-gray-500 mb-2">Open Gigs</p><h3 className="text-4xl font-black italic">15</h3></div>
          </div>

          {!isVerified && (
            <div className="p-10 bg-[#00f2ff]/5 border border-[#00f2ff]/20 rounded-[48px] space-y-6">
               <h3 className="text-xl font-black italic uppercase tracking-tighter border-b border-[#00f2ff]/10 pb-4">Nexus Protocol <span className="text-[#00f2ff]">Briefing</span></h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[11px] text-gray-400 font-medium leading-relaxed">
                  <div className="space-y-3">
                     <h4 className="text-xs font-black text-[#00f2ff] uppercase italic tracking-widest">Verification Protocol ($10.00)</h4>
                     <p>Required to secure the network from bots and ensure high-fidelity client matches. Verification unlocks the Elite Badge and instant withdrawals.</p>
                     <button onClick={() => setShowVerifyModal(true)} className="mt-2 px-6 py-3 bg-[#00f2ff] text-black rounded-xl text-[9px] font-black uppercase hover:bg-white transition-all">Initialize Verification →</button>
                  </div>
                  <div className="space-y-3">
                     <h4 className="text-xs font-black text-white uppercase tracking-widest italic">2% Service Fee</h4>
                     <p>A flat 2% commission is applied to every successful gig settlement to maintain Satellite relay infrastructure.</p>
                  </div>
               </div>
            </div>
          )}
        </div>
      )}

      {/* --- 💼 GIGS MISSION FEED --- */}
      {activeTab === "tasks" && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4">
          <div className="flex justify-between items-end border-b border-white/5 pb-6">
            <h3 className="text-2xl font-black uppercase italic tracking-tighter">Mission <span className="text-[#00f2ff]">Feed</span></h3>
            <p className="text-[8px] font-black text-gray-600 uppercase italic tracking-widest">Scanning Satellite Relays...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {marketplaceGigs.map(g => (
              <div key={g.id} className={`p-8 rounded-[40px] border transition-all group ${g.closed ? 'bg-black/40 border-red-500/10 grayscale opacity-50' : 'bg-white/5 border-white/10 hover:border-[#00f2ff]/30 shadow-2xl'}`}>
                <div className="flex justify-between items-start mb-6">
                   <div className="flex items-center gap-3">
                      <img src={g.img} className="w-10 h-10 rounded-full border border-white/10" alt="C" />
                      <div><p className="text-[10px] font-black uppercase tracking-tighter">{g.client}</p><p className="text-[8px] font-bold text-emerald-500 italic">⭐ {g.rating}/5.0</p></div>
                   </div>
                   <p className="text-2xl font-black text-[#00f2ff] italic">${g.budget}</p>
                </div>
                <h4 className="font-bold text-sm mb-8 line-clamp-1 italic uppercase tracking-tighter">{g.title}</h4>
                <div className="flex justify-between items-center">
                  <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${g.closed ? 'text-red-500' : 'text-gray-500'}`}>{g.dur}</span>
                  {!g.closed && (
                    <button onClick={() => !isVerified ? setShowVerifyModal(true) : alert("Bid Dispatched")} className="px-5 py-2.5 bg-white/5 group-hover:bg-[#00f2ff] group-hover:text-black border border-white/10 rounded-xl text-[8px] font-black uppercase transition-all">Submit Bid</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- 📜 WORK ACTIVATION --- */}
      {activeTab === "contracts" && (
        <div className="py-20 text-center space-y-10 animate-in zoom-in-95">
           <div className="w-24 h-24 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto text-4xl shadow-2xl shadow-amber-500/5">📜</div>
           <h2 className="text-4xl font-black uppercase italic tracking-tighter">Workspace <span className="text-amber-500">Restricted</span></h2>
           <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">Verification protocol pending. To initialize your first contract, complete the $10 node activation fee.</p>
           <button onClick={() => setShowVerifyModal(true)} className="px-12 py-5 bg-amber-500 text-black font-black rounded-2xl uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl shadow-amber-500/20">Authorize Account</button>
        </div>
      )}

      {/* --- 💬 MESSAGES --- */}
      {activeTab === "messages" && (
        <div className="h-[65vh] flex border border-white/10 rounded-[48px] overflow-hidden bg-white/2 animate-in fade-in">
          <aside className="w-1/3 border-r border-white/5 bg-black/20 p-8 hidden md:block">
             <h4 className="text-[10px] font-black text-[#00f2ff] uppercase tracking-[0.3em] mb-8 italic">Satellite Inbox</h4>
             <div className="p-5 bg-[#00f2ff]/5 border border-[#00f2ff]/20 rounded-3xl flex items-center gap-4 cursor-pointer">
                <div className="w-10 h-10 bg-black/40 border border-[#00f2ff]/30 rounded-full flex items-center justify-center text-xs font-black text-[#00f2ff]">HQ</div>
                <div className="flex-1"><p className="text-[10px] font-black text-white italic">Nexus Core</p><p className="text-[8px] text-gray-500 line-clamp-1 italic">Welcome to the network...</p></div>
             </div>
          </aside>
          <main className="flex-1 flex flex-col p-8 bg-black/40">
             <div className="flex-1 space-y-6 overflow-y-auto pr-4">
                <div className="bg-white/5 border border-white/10 p-6 rounded-4xl max-w-lg">
                   <p className="text-xs leading-relaxed italic">Welcome Operator. All client communications and gig briefings will materialize here. To begin bidding, ensure your node is verified.</p>
                   <p className="text-[8px] font-black text-gray-600 mt-4 text-right uppercase tracking-widest">Relay: Satellite-1A</p>
                </div>
             </div>
             <div className="mt-6 flex gap-3">
                <input disabled placeholder="Verification Required to Send Message..." className="flex-1 bg-white/5 border border-white/10 p-5 rounded-3xl text-[10px] font-bold outline-none opacity-40 italic" />
                <button disabled className="p-5 bg-white/10 rounded-3xl opacity-20">➤</button>
             </div>
          </main>
        </div>
      )}

      {/* --- 💰 WALLET --- */}
      {activeTab === "earnings" && (
        <div className="space-y-10 animate-in fade-in">
           <div className="flex justify-between items-end border-b border-white/5 pb-4">
              <h3 className="text-3xl font-black uppercase italic tracking-tighter">Nexus <span className="text-[#00f2ff]">Wallet</span></h3>
              <button onClick={() => setCurrency(currency === "USD" ? "KES" : "USD")} className="text-[9px] font-black uppercase text-[#00f2ff] bg-[#00f2ff]/10 px-4 py-2 rounded-full border border-[#00f2ff]/20 transition-all">Toggle {currency === "USD" ? "KES" : "USD"}</button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-10 bg-linear-to-br from-[#00f2ff]/10 to-transparent border border-[#00f2ff]/20 rounded-[48px] shadow-2xl">
                 <p className="text-[10px] font-black text-[#00f2ff] uppercase italic tracking-widest mb-4">Available Funds</p>
                 <h4 className="text-5xl font-black italic">{currency === "USD" ? "$0.00" : "KES 0"}</h4>
              </div>
              <div className="p-10 bg-white/5 border border-white/10 rounded-[48px]">
                 <p className="text-[10px] font-black text-gray-500 uppercase italic tracking-widest mb-4">Lifetime Yield</p>
                 <h4 className="text-5xl font-black italic text-gray-400">{currency === "USD" ? "$0.00" : "KES 0"}</h4>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-6">
              <div onClick={() => setWithdrawMethod('mpesa')} className={`p-8 rounded-[40px] border cursor-pointer transition-all ${withdrawMethod === 'mpesa' ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/10 bg-white/2 hover:border-white/20'}`}>
                 <div className="flex justify-between items-center mb-4"><span className="text-2xl">📱</span><span className="text-[8px] font-black uppercase text-emerald-500 tracking-widest">M-Pesa</span></div>
                 <p className="text-[10px] font-black uppercase italic">Withdraw via Phone</p>
              </div>
              <div onClick={() => setWithdrawMethod('binance')} className={`p-8 rounded-[40px] border cursor-pointer transition-all ${withdrawMethod === 'binance' ? 'border-amber-500 bg-amber-500/5' : 'border-white/10 bg-white/2 hover:border-white/20'}`}>
                 <div className="flex justify-between items-center mb-4"><span className="text-2xl">🔶</span><span className="text-[8px] font-black uppercase text-amber-500 tracking-widest">Binance Pay</span></div>
                 <p className="text-[10px] font-black uppercase italic">Withdraw via BEP20</p>
              </div>
           </div>

           {withdrawMethod && (
             <button disabled className="w-full py-6 bg-white text-black font-black rounded-3xl uppercase text-[11px] tracking-[0.4em] opacity-30 cursor-not-allowed">Insufficient Balance (Min $10.00)</button>
           )}

           <div className="space-y-4">
              <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 italic px-4">Satellite Transaction Logs</h5>
              <div className="p-20 text-center border border-dashed border-white/5 rounded-[40px] opacity-30 text-[10px] uppercase font-black tracking-widest">No Logs Found</div>
           </div>
        </div>
      )}

      {/* --- 📊 STATS --- */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in zoom-in-95">
           <div className="p-10 bg-white/5 border border-white/10 rounded-[48px] flex flex-col items-center justify-center">
              <div className="h-40 flex items-end gap-3 mb-10">{[20,40,35,90,60,80,45].map((h,i) => (<div key={i} className="flex-1 bg-white/10 rounded-t-2xl hover:bg-[#00f2ff]/30 transition-all" style={{height:`${h}%`}}/>))}</div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Node Impression Pulse</p>
           </div>
           <div className="p-10 bg-white/5 border border-white/10 rounded-[48px] space-y-8">
              {['Profile Impression', 'Conversion Rate', 'Search Placement'].map(s => (
                <div key={s} className="flex justify-between items-end border-b border-white/5 pb-6">
                  <span className="text-[10px] font-black uppercase text-gray-400 italic">{s}</span>
                  <span className="text-3xl font-black italic text-[#00f2ff]">0</span>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* --- 👤 PROFILE --- */}
      {activeTab === "account" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in">
           <div className="md:col-span-1 bg-white/2 border border-white/10 rounded-[56px] p-12 flex flex-col items-center text-center">
              <div className="relative mb-8">
                <div className="w-28 h-28 bg-[#0a0f1e] border-4 border-[#00f2ff]/20 rounded-full flex items-center justify-center text-5xl font-black italic shadow-2xl shadow-[#00f2ff]/10 text-[#00f2ff]">{user?.firstName?.[0]}</div>
                {isVerified && <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-full border-4 border-[#020617] text-[8px]">🏆</div>}
              </div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">{user?.firstName} {user?.lastName}</h3>
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-10 italic">📍KE • NODE ACTIVE</p>
              <div className="w-full flex flex-wrap gap-2 justify-center pt-8 border-t border-white/5">
                {skills.map(s => <span key={s} className="px-4 py-1.5 bg-white/5 rounded-xl text-[9px] font-black uppercase italic">{s}</span>)}
              </div>
           </div>
           <div className="md:col-span-2 p-12 bg-white/5 border border-white/10 rounded-[56px] space-y-10">
              <header className="flex justify-between items-start">
                 <div><h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 italic">Node Rating</h4><h5 className="text-4xl font-black italic text-[#00f2ff]">0.0</h5></div>
                 <div><h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 italic">Rank</h4><h5 className="text-2xl font-black italic uppercase">INITIATE</h5></div>
              </header>
              <div className="space-y-4">
                 <div className="p-8 bg-black/40 border border-white/5 rounded-[40px] flex justify-between items-center"><span className="text-[10px] font-black text-gray-500 uppercase italic">Operator Identity</span><span className="text-xs font-black italic uppercase tracking-wider">{user?.fullName}</span></div>
                 <div className="p-8 bg-black/40 border border-white/5 rounded-[40px] flex justify-between items-center"><span className="text-[10px] font-black text-gray-500 uppercase italic">Satellite Relay</span><span className="text-xs font-black italic lowercase tracking-wider">{user?.emailAddresses[0].emailAddress}</span></div>
              </div>
           </div>
        </div>
      )}

      {/* --- ⚙️ SETTINGS --- */}
      {activeTab === "settings" && (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in">
           <div className="space-y-4">
              {['Satellite Notifications', 'Biometric & Security', 'Financial Gateways', 'Platform Protocol'].map(s => (
                <div key={s} className="p-8 bg-white/5 border border-white/10 rounded-[40px] flex justify-between items-center group cursor-pointer hover:border-[#00f2ff]/30 transition-all">
                   <span className="text-[10px] font-black uppercase text-gray-400 group-hover:text-white italic tracking-widest">{s}</span>
                   <span className="text-gray-700 font-black">EDIT →</span>
                </div>
              ))}
           </div>
           <div className="p-10 bg-white/2 rounded-[56px] text-center space-y-10 border border-white/5 shadow-2xl">
              <p className="text-[9px] font-black text-[#00f2ff] uppercase tracking-[0.5em] italic">Network Connections</p>
              <div className="flex justify-center gap-6">
                 {[
                   { u: 'https://whatsapp.com/channel/0029VbCmx1AAu3aMiY7XVf1J', i: '📱', color: 'hover:bg-emerald-500/20' },
                   { u: 'https://t.me/nexusGigs', i: '✈️', color: 'hover:bg-blue-400/20' },
                   { u: 'https://www.instagram.com/nexusgigs', i: '📷', color: 'hover:bg-pink-500/20' },
                   { u: 'https://www.tiktok.com/@nexusgigss', i: '🎵', color: 'hover:bg-white/20' }
                 ].map((s,i) => (
                   <a key={i} href={s.u} target="_blank" className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center transition-all text-2xl ${s.color} border border-white/5 shadow-xl active:scale-90`}>{s.i}</a>
                 ))}
              </div>
              <SignOutButton><button className="w-full py-5 bg-red-900/10 border border-red-500/20 text-red-500 font-black rounded-3xl text-[10px] uppercase tracking-[0.3em] hover:bg-red-500/10 active:scale-95 transition-all italic">Terminate Session</button></SignOutButton>
           </div>
        </div>
      )}

      {/* --- 🚨 VERIFY MODAL --- */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-300 flex items-center justify-center p-6 backdrop-blur-3xl">
          <div className="absolute inset-0 bg-[#020617]/95" onClick={() => setShowVerifyModal(false)} />
          <div className="relative w-full max-w-sm bg-[#0a0f1e] border border-white/10 rounded-[56px] p-10 text-center animate-in zoom-in-95 shadow-2xl">
            <h3 className="text-2xl font-black uppercase text-[#00f2ff] mb-2 italic tracking-tighter">ACTIVATE <span className="text-white">NODE</span></h3>
            <p className="text-gray-400 text-[11px] mb-10 italic">Secure Channel activation required ($10.00)</p>
            <div className="space-y-4">
              <input value={mpesaNumber} onChange={e => setMpesaNumber(e.target.value)} placeholder="07XXXXXXXX" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-center font-black outline-none focus:border-[#00f2ff] text-white tracking-widest" />
              <div id="payHeroContainer" className="min-h-15 flex items-center justify-center">
                {!isPaying ? (
                  <button onClick={handleMpesaVerification} className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all italic">Pay via M-Pesa</button>
                ) : (
                   <p className="text-[10px] font-black text-[#00f2ff] animate-pulse uppercase tracking-widest italic">Authenticating Payload...</p>
                )}
              </div>
              <button onClick={() => alert("Send Exactly 10 USDT (BEP20) to: 0x3cd9f36bd42df9721eb5eb74daccdba32d31bb47")} className="w-full py-5 bg-[#F0B90B] text-black font-black rounded-2xl uppercase text-[10px] tracking-widest shadow-xl shadow-amber-500/20 active:scale-95 transition-all italic">Binance USDT</button>
            </div>
          </div>
        </div>
      )}

      {/* --- 📱 NAVIGATION BAR --- */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-200 w-[95%] max-w-4xl flex justify-around items-center p-2 bg-[#0a0f1e]/90 backdrop-blur-3xl border border-white/10 rounded-full shadow-2xl overflow-x-auto no-scrollbar scroll-smooth">
        {navItems.map((item) => (
          <button 
            key={item.id} 
            onClick={() => setActiveTab(item.id)} 
            className={`flex flex-col items-center py-3.5 px-6 rounded-full min-w-17.5 transition-all duration-500 ${activeTab === item.id ? 'bg-[#00f2ff] text-black scale-110 shadow-2xl shadow-[#00f2ff]/30' : 'text-gray-500 hover:text-white'}`}
          >
            <span className="text-xl mb-1">{item.icon}</span>
            <span className="text-[7px] font-black uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
