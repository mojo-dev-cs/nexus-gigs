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
    { id: "1", title: "E-commerce API Integration", budget: 450, client: "Alpha Tech", rating: 4.9, dur: "5 Days", img: "https://ui-avatars.com/api/?name=AT&background=00f2ff&color=000", expired: false },
    { id: "2", title: "Python Web Scraper", budget: 120, client: "Maji Homes", rating: 5.0, dur: "2 Days", img: "https://ui-avatars.com/api/?name=MH&background=10b981&color=fff", expired: true },
    { id: "3", title: "Modern Landing Page Design", budget: 300, client: "Nexa Studio", rating: 4.8, dur: "3 Days", img: "https://ui-avatars.com/api/?name=NS&background=8b5cf6&color=fff", expired: false },
  ];

  useEffect(() => {
    const handlePaymentSuccess = (event: MessageEvent) => {
      if (event.data.paymentSuccess === true) {
        setIsVerified(true);
        setShowVerifyModal(false);
        setIsPaying(false);
        alert("🚀 Your account has been successfully verified!");
        router.refresh();
      }
    };
    window.addEventListener("message", handlePaymentSuccess);
    return () => window.removeEventListener("message", handlePaymentSuccess);
  }, [router]);

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

  const handleBinancePayment = () => {
    alert(`⚡ Send $10 USDT to: 0x3cd9f36bd42df9721eb5eb74daccdba32d31bb47 (BEP20)`);
    setShowVerifyModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto pb-44 pt-4 px-4 text-white relative">
      {/* HEADER */}
      {activeTab === "home" && (
        <div className="space-y-8 animate-in fade-in">
          <header className="flex justify-between items-center">
            <h2 className="text-2xl font-black italic uppercase underline decoration-[#00f2ff] underline-offset-8">NODE: {user?.firstName}</h2>
            {!isVerified && (
               <span className="bg-amber-500/10 text-amber-500 text-[8px] font-black px-3 py-1 rounded-full border border-amber-500/20 uppercase tracking-widest">Unverified Account</span>
            )}
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 bg-white/5 border border-white/10 rounded-[40px]">
              <p className="text-[10px] font-black uppercase text-[#00f2ff] mb-2">Global Balance</p>
              <h3 className="text-4xl font-black italic">$0.00</h3>
              <button onClick={() => setActiveTab('earnings')} className="mt-6 w-full py-3 bg-[#00f2ff] text-black font-black rounded-xl text-[9px] uppercase">Withdraw</button>
            </div>
            <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] text-center"><p className="text-[10px] font-black uppercase text-gray-500 mb-2">Win Rate</p><h3 className="text-4xl font-black italic text-emerald-500">0%</h3></div>
            <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] text-center"><p className="text-[10px] font-black uppercase text-gray-500 mb-2">Bids Left</p><h3 className="text-4xl font-black italic">4</h3></div>
          </div>

          {!isVerified && (
            <div className="p-10 bg-[#00f2ff]/5 border border-[#00f2ff]/20 rounded-[48px] flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="space-y-2">
                <h4 className="text-[#00f2ff] font-black uppercase italic">Activate Account ($10)</h4>
                <p className="text-xs text-gray-400 max-w-md">Unlock professional gigs and priority placement. Verify your node to start earning.</p>
              </div>
              <button onClick={() => setShowVerifyModal(true)} className="px-8 py-4 bg-[#00f2ff] text-black font-black rounded-2xl uppercase text-[10px] tracking-widest">Verify Now →</button>
            </div>
          )}
        </div>
      )}

      {/* RENDER GIGS */}
      {activeTab === "tasks" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in slide-in-from-bottom-4">
          {marketplaceGigs.map(g => (
            <div key={g.id} className="p-6 bg-white/5 border border-white/10 rounded-[30px]">
              <div className="flex justify-between items-start mb-4">
                <p className="text-xl font-black text-[#00f2ff]">${g.budget}</p>
                <span className="text-[8px] font-black text-emerald-500">⭐ {g.rating}</span>
              </div>
              <h4 className="font-bold text-sm mb-6">{g.title}</h4>
              <button onClick={() => !isVerified ? setShowVerifyModal(true) : alert("Bid Sent")} className="w-full py-2 bg-white/10 rounded-xl text-[8px] font-black uppercase hover:bg-[#00f2ff] hover:text-black transition-all">Submit Bid</button>
            </div>
          ))}
        </div>
      )}

      {/* RENDER OTHER TABS - PLACEHOLDERS */}
      {["contracts", "messages", "earnings", "analytics", "account", "settings"].includes(activeTab) && activeTab !== "home" && (
         <div className="p-20 text-center border border-dashed border-white/10 rounded-[40px] opacity-40">
            <p className="text-[10px] font-black uppercase tracking-widest italic">{activeTab} Interface Synchronizing...</p>
         </div>
      )}

      {/* VERIFY MODAL */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-300 flex items-center justify-center p-4 bg-black/80 backdrop-blur-3xl">
          <div className="relative w-full max-w-sm bg-[#0a0f1e] border border-white/10 rounded-[48px] p-10 text-center animate-in zoom-in-95">
            <h3 className="text-2xl font-black uppercase text-[#00f2ff] mb-2 italic">ACTIVATE NODE</h3>
            <p className="text-gray-400 text-[11px] mb-8 italic">Required Fee: $10.00</p>
            <div className="space-y-4">
              <input value={mpesaNumber} onChange={e => setMpesaNumber(e.target.value)} placeholder="07XXXXXXXX" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-center font-bold outline-none focus:border-[#00f2ff]" />
              <div id="payHeroContainer" className="min-h-15 flex items-center justify-center">
                {!isPaying ? (
                  <button onClick={handleMpesaVerification} className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest">Pay via M-Pesa</button>
                ) : (
                  <p className="animate-pulse text-[#00f2ff] font-black">WAITING FOR HANDSHAKE...</p>
                )}
              </div>
              <button onClick={handleBinancePayment} className="w-full py-4 bg-[#F0B90B] text-black font-black rounded-2xl uppercase text-[10px] tracking-widest">Binance USDT</button>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM NAV */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-200 w-[95%] max-w-4xl flex justify-around items-center p-2 bg-[#0a0f1e]/90 backdrop-blur-3xl border border-white/10 rounded-full shadow-2xl">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center py-3 px-5 rounded-full min-w-17.5 transition-all ${activeTab === item.id ? 'bg-[#00f2ff] text-black scale-105 shadow-[0_0_20px_rgba(0,242,255,0.3)]' : 'text-gray-500 hover:text-white'}`}>
               <span className="text-xl">{item.icon}</span>
               <span className="text-[7px] font-black uppercase tracking-tighter mt-1">{item.label}</span>
            </button>
          ))}
      </div>
    </div>
  );
};