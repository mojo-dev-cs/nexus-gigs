"use client";

import { useState, useEffect } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// Declare PayHero for TypeScript
declare global {
  interface Window {
    PayHero: any;
  }
}

export const FreelancerView = ({ jobs, userMetadata }: { jobs: any[], userMetadata: any }) => {
  const { user } = useUser();
  const router = useRouter();

  // States
  const [activeTab, setActiveTab] = useState("home");
  const [isVerified, setIsVerified] = useState(userMetadata?.isVerified || false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState<"mpesa" | "binance">("mpesa");

  // Profile Data States
  const [skills, setSkills] = useState(["Next.js", "React", "Tailwind", "Python"]);
  const [newSkill, setNewSkill] = useState("");

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

  // Handle Payment Success Listener
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

  // M-Pesa Payment Handler
  const handleMpesaVerification = () => {
    if (mpesaNumber.length < 10) {
      alert("Please enter a valid M-Pesa number (e.g. 0712345678)");
      return;
    }

    setIsPaying(true);

    if (window.PayHero) {
      window.PayHero.init({
        paymentUrl: "https://lipwa.link/6861",
        containerId: "payHeroContainer",
        channelId: 6861,
        amount: 1250, // ≈ $10
        phone: mpesaNumber,
        reference: `verify_${user?.id || Date.now()}`,
        callbackUrl: "https://nexus-gigs.vercel.app/api/mpesa-callback",
      });
    } else {
      alert("Payment system is loading... Please try again in 2 seconds.");
      setIsPaying(false);
    }
  };

  // Binance Payment Handler
  const handleBinancePayment = () => {
    const binanceAddress = "0x3cd9f36bd42df9721eb5eb74daccdba32d31bb47";
    alert(`⚡ Send exactly $10 USDT to the following Binance address (BEP20):\n\n${binanceAddress}\n\nAfter sending, please contact support with your Transaction Hash.`);
    setShowVerifyModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto pb-44 pt-4 px-4 text-white relative selection:bg-[#00f2ff]/30">
      
      {/* ... Your existing Home/Gigs/Tabs content here ... */}

      {/* VERIFY MODAL */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-300 flex items-center justify-center p-4 bg-black/70 backdrop-blur-3xl">
          <div className="absolute inset-0" onClick={() => setShowVerifyModal(false)} />
          <div className="relative w-full max-w-md bg-[#0a0f1e] border border-white/10 rounded-[48px] p-10 text-center animate-in zoom-in-95 shadow-2xl">
            <button 
              onClick={() => setShowVerifyModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white text-xl"
            >✕</button>

            <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-2">
              ACTIVATE <span className="text-[#00f2ff]">GIGS</span>
            </h3>
            
            <p className="text-gray-400 text-[11px] mb-8">
              Verification fee: <span className="text-white font-bold">$10.00</span>.<br />
              Required to unlock professional contracts.
            </p>

            <div className="space-y-4">
              {/* Phone Input for M-Pesa */}
              <input 
                value={mpesaNumber} 
                onChange={e => setMpesaNumber(e.target.value)} 
                placeholder="07XXXXXXXX" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-center font-bold outline-none focus:border-[#00f2ff]" 
              />

              <div id="payHeroContainer" className="space-y-4">
                <button 
                  onClick={handleMpesaVerification}
                  disabled={isPaying}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-500/30"
                >
                  {isPaying ? "Processing M-Pesa..." : "Pay with M-Pesa"}
                </button>
              </div>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
                <div className="relative flex justify-center text-[8px] uppercase font-black text-gray-600">
                  <span className="bg-[#0a0f1e] px-2">OR GLOBAL CRYPTO</span>
                </div>
              </div>

              <button 
                onClick={handleBinancePayment}
                className="w-full py-4 bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                Pay with Binance USDT
              </button>
            </div>

            <p className="text-[10px] text-gray-500 mt-8 italic">
              * M-Pesa is recommended for Kenya. USDT is global.
            </p>
          </div>
        </div>
      )}

      {/* ... Rest of your component (navItems mapping, etc.) ... */}
    </div>
  );
};