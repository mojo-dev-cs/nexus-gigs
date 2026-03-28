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
  const [withdrawMethod, setWithdrawMethod] = useState<"mpesa" | "binance">("mpesa");

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

  const marketplaceGigs = [
    { id: "1", title: "E-commerce API Integration", budget: 450, client: "Alpha Tech", rating: 4.9, dur: "5 Days", img: "https://ui-avatars.com/api/?name=AT&background=00f2ff&color=000" },
    { id: "2", title: "Python Web Scraper", budget: 120, client: "Maji Homes", rating: 5.0, dur: "2 Days", img: "https://ui-avatars.com/api/?name=MH&background=10b981&color=fff" },
    { id: "3", title: "Landing Page Redesign", budget: 300, client: "Nexa Studio", rating: 4.8, dur: "3 Days", img: "https://ui-avatars.com/api/?name=NS&background=8b5cf6&color=fff" },
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
            <h2 className="text-2xl font-black italic uppercase underline decoration-[#00f2ff] underline-offset-8">NODE: {user?.firstName}</h2>
            {!isVerified && <span className="bg-amber-500/10 text-amber-500 text-[8px] font-black px-3 py-1 rounded-full border border-amber-500/20 uppercase tracking-widest">Unverified Node</span>}
          </header>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] shadow-2xl">
              <p className="text-[10px] font-black uppercase text-[#00f2ff] mb-2 italic">Nexus Balance</p>
              <h3 className="text-4xl font-black italic mb-2">$0.00</h3>
              <button onClick={() => setActiveTab('earnings')} className="w-full py-3 bg-[#00f2ff] text-black font-black rounded-xl text-[9px] uppercase hover:bg-white transition-all">Withdraw Funds</button>
            </div>
            <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] text-center italic flex flex-col justify-center"><p className="text-[10px] font-black uppercase text-gray-500 mb-2">Win Rate</p><h3 className="text-4xl font-black italic text-emerald-500">0%</h3></div>
            <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] text-center italic flex flex-col justify-center"><p className="text-[10px] font-black uppercase text-gray-500 mb-2">Bids Left</p><h3 className="text-4xl font-black italic">4</h3></div>
          </div>
        </div>
      )}

      {/* --- 💼 GIGS (Pop-up logic integrated) --- */}
      {activeTab === "tasks" && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4">
          <h3 className="text-xl font-black uppercase italic tracking-tighter">Mission <span className="text-[#00f2ff]">Feed</span></h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {marketplaceGigs.map(g => (
              <div key={g.id} className="p-6 bg-white/5 border border-white/10 rounded-[30px] transition-all hover:border-[#00f2ff]/30 group">
                <div className="flex justify-between items-start mb-6">
                   <img src={g.img} className="w-10 h-10 rounded-full border border-white/10" alt="C" />
                   <p className="text-2xl font-black text-[#00f2ff]">${g.budget}</p>
                </div>
                <h4 className="font-bold text-sm mb-6 line-clamp-1">{g.title}</h4>
                <button 
                  onClick={() => !isVerified ? setShowVerifyModal(true) : alert("Application Sent!")}
                  className="w-full py-3 bg-white/5 group-hover:bg-[#00f2ff] group-hover:text-black border border-white/10 rounded-xl text-[9px] font-black uppercase transition-all"
                >
                  Submit Application
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- 📜 WORK --- */}
      {activeTab === "contracts" && (
        <div className="py-20 text-center space-y-8 animate-in zoom-in-95">
           <div className="w-24 h-24 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto text-4xl">📜</div>
           <h2 className="text-3xl font-black uppercase italic">WorkSpace <span className="text-amber-500">Locked</span></h2>
           <p className="text-gray-500 text-sm max-w-sm mx-auto">Verify your account ($10 activation fee) to initialize contracts and begin work.</p>
           <button onClick={() => setShowVerifyModal(true)} className="px-10 py-4 bg-amber-500 text-black font-black rounded-2xl uppercase text-[10px] tracking-widest hover:scale-105 transition-all">Activate Now</button>
        </div>
      )}

      {/* --- 💬 MESSAGES (Messenger Style) --- */}
      {activeTab === "messages" && (
        <div className="h-[60vh] flex border border-white/10 rounded-[40px] overflow-hidden bg-white/2 animate-in fade-in">
          <aside className="w-1/3 border-r border-white/10 bg-black/20 p-6 hidden md:block">
             <p className="text-[10px] font-black text-[#00f2ff] uppercase tracking-widest mb-6">Inbox</p>
             <div className="p-4 bg-white/5 border border-[#00f2ff]/20 rounded-2xl flex items-center gap-3">
                <div className="w-8 h-8 bg-[#00f2ff] rounded-full flex items-center justify-center text-black font-black text-xs">N</div>
                <div><p className="text-[10px] font-black">Nexus HQ</p><p className="text-[8px] text-gray-500 line-clamp-1">Welcome to the Satellite...</p></div>
             </div>
          </aside>
          <main className="flex-1 flex flex-col p-8 bg-black/40">
             <div className="space-y-4 overflow-y-auto flex-1">
                <div className="bg-white/5 border border-white/10 p-6 rounded-4xl max-w-md">
                   <p className="text-xs leading-relaxed italic">Welcome to NexusGigs, Operator. Once you verify your node, client communications will appear here. Start by exploring the Mission Feed.</p>
                   <p className="text-[8px] font-black text-gray-600 mt-4 text-right">SIGNED: NEXUS CORE</p>
                </div>
             </div>
             <div className="mt-4 flex gap-2">
                <input disabled placeholder="Account Verification Required..." className="flex-1 bg-white/5 border border-white/10 p-4 rounded-2xl text-[10px] outline-none opacity-40" />
                <button disabled className="p-4 bg-white/10 rounded-2xl opacity-20">➤</button>
             </div>
          </main>
        </div>
      )}

      {/* --- 💰 WALLET --- */}
      {activeTab === "earnings" && (
        <div className="space-y-6 animate-in fade-in">
           <h3 className="text-xl font-black uppercase italic">Financial <span className="text-[#00f2ff]">Vault</span></h3>
           <div className="p-10 bg-linear-to-r from-[#00f2ff]/10 to-transparent border border-white/10 rounded-[40px]">
              <p className="text-[10px] font-black text-gray-500 uppercase italic mb-2">Total Earnings</p>
              <h4 className="text-5xl font-black italic">$0.00</h4>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setWithdrawMethod('mpesa')} className={`p-8 rounded-4xl border transition-all ${withdrawMethod === 'mpesa' ? 'border-[#00f2ff] bg-[#00f2ff]/5' : 'border-white/5'}`}>
                 <p className="text-[10px] font-black uppercase">M-Pesa</p>
              </button>
              <button onClick={() => setWithdrawMethod('binance')} className={`p-8 rounded-4xl border transition-all ${withdrawMethod === 'binance' ? 'border-[#00f2ff] bg-[#00f2ff]/5' : 'border-white/5'}`}>
                 <p className="text-[10px] font-black uppercase">Binance Pay</p>
              </button>
           </div>
        </div>
      )}

      {/* --- 📊 STATS --- */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in zoom-in-95">
           <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] flex flex-col items-center justify-center">
              <div className="h-32 flex items-end gap-2 mb-8">{[20,40,30,70,50,90].map((h,i) => (<div key={i} className="w-6 bg-white/10 rounded-t-lg" style={{height:`${h}%`}}/>))}</div>
              <p className="text-[10px] font-black text-gray-500 uppercase italic">Impression Trend</p>
           </div>
           <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] space-y-6">
              {['Profile Views', 'Invite Rate', 'Search Placement'].map(s => (
                <div key={s} className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-[10px] font-black uppercase text-gray-400">{s}</span>
                  <span className="text-lg font-black italic text-[#00f2ff]">0</span>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* --- ⚙️ SETTINGS --- */}
      {activeTab === "settings" && (
        <div className="max-w-xl mx-auto space-y-8 animate-in fade-in">
           <div className="space-y-4">
              {['Notifications', 'Security', 'Payment Methods'].map(s => (
                <div key={s} className="p-6 bg-white/5 border border-white/10 rounded-3xl flex justify-between items-center group cursor-pointer hover:border-[#00f2ff]/30">
                   <span className="text-[10px] font-black uppercase text-gray-400 group-hover:text-white">{s}</span>
                   <span>→</span>
                </div>
              ))}
           </div>
           <div className="p-8 bg-white/2 rounded-[40px] text-center space-y-6">
              <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.4em]">Satellite Socials</p>
              <div className="flex justify-center gap-4">
                 {[
                   { u: 'https://whatsapp.com/channel/0029VbCmx1AAu3aMiY7XVf1J', i: '📱' },
                   { u: 'https://t.me/nexusGigs', i: '✈️' },
                   { u: 'https://www.instagram.com/nexusgigs', i: '📷' },
                   { u: 'https://www.tiktok.com/@nexusgigss', i: '🎵' }
                 ].map((s,i) => (
                   <a key={i} href={s.u} target="_blank" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-[#00f2ff]/20 transition-all text-xl">{s.i}</a>
                 ))}
              </div>
              <SignOutButton><button className="w-full py-4 border border-red-500/20 text-red-500 font-black rounded-2xl text-[9px] uppercase hover:bg-red-500/10">Terminate Session</button></SignOutButton>
           </div>
        </div>
      )}

      {/* MODAL & NAV (Unchanged Logic, Styled for Consistency) */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-300 flex items-center justify-center p-6 backdrop-blur-3xl">
          <div className="absolute inset-0 bg-[#020617]/95" onClick={() => setShowVerifyModal(false)} />
          <div className="relative w-full max-w-sm bg-[#0a0f1e] border border-white/10 rounded-[48px] p-10 text-center animate-in zoom-in-95">
            <h3 className="text-2xl font-black uppercase text-[#00f2ff] mb-2 italic">ACTIVATE NODE</h3>
            <p className="text-gray-400 text-[11px] mb-8">Verification fee: <span className="text-white font-bold">$10.00</span></p>
            <div className="space-y-4">
              <input value={mpesaNumber} onChange={e => setMpesaNumber(e.target.value)} placeholder="07XXXXXXXX" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-center font-bold outline-none focus:border-[#00f2ff] text-white" />
              <div id="payHeroContainer">
                <button onClick={handleMpesaVerification} className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest">{isPaying ? "TRANSMITTING..." : "Pay via M-Pesa"}</button>
              </div>
              <button onClick={() => alert("Send $10 USDT to: 0x3cd...bb47")} className="w-full py-4 bg-[#F0B90B] text-black font-black rounded-2xl uppercase text-[10px] tracking-widest">Binance USDT</button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE-RESPONSIVE NAV */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-200 w-[95%] max-w-4xl flex justify-around items-center p-2 bg-[#0a0f1e]/90 backdrop-blur-3xl border border-white/10 rounded-full shadow-2xl overflow-x-auto no-scrollbar">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center py-3 px-5 rounded-full min-w-17.5 transition-all ${activeTab === item.id ? 'bg-[#00f2ff] text-black scale-105' : 'text-gray-500 hover:text-white'}`}>
               <span className="text-xl mb-1">{item.icon}</span>
               <span className="text-[7px] font-black uppercase tracking-tighter">{item.label}</span>
            </button>
          ))}
      </div>
    </div>
  );
};