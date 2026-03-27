"use client";

import { useState } from "react";

export const FreelancerView = ({ jobs }: { jobs: any[] }) => {
  const [activeTab, setActiveTab] = useState("home");
  const [isVerified, setIsVerified] = useState(false); // Default false for new users
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [successRate, setSuccessRate] = useState(0); // Starts at zero

  // Sample Gigs for the Marketplace
  const sampleGigs = [
    { _id: "1", title: "AI Model Training: Image Labeling", budget: 45, category: "Data Science", description: "Label 500 images for a specialized medical AI model. Accuracy is critical." },
    { _id: "2", title: "Smart Contract Audit - DeFi Protocol", budget: 1200, category: "Blockchain", description: "Review a token swap contract for potential vulnerabilities before mainnet launch." },
    { _id: "3", title: "React/Next.js Dashboard Integration", budget: 350, category: "Web Dev", description: "Integrate a provided Figma design into a functional Next.js dashboard using Tailwind." },
  ];

  const handleApply = () => {
    if (!isVerified) {
      setShowVerifyModal(true);
    } else {
      alert("Application Protocol Initiated...");
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-32 pt-4 px-4">
      
      {/* --- 🏠 HOME TAB --- */}
      {activeTab === "home" && (
        <div className="space-y-8 animate-in fade-in duration-700">
          <header>
            <h2 className="text-5xl font-black italic tracking-tighter text-white uppercase">
               VAATI <span className="text-gray-600">EMMANUEL</span>
            </h2>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Wallet */}
            <div className="p-8 bg-linear-to-br from-[#0a0f1e] to-[#020617] border border-white/10 rounded-[40px]">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6 italic">Current Balance</p>
              <h3 className="text-5xl font-black tracking-tighter mb-8 italic">$0.00</h3>
              <button className="w-full py-4 bg-emerald-500 text-black font-black rounded-2xl text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
                Withdrawal Protocol
              </button>
            </div>

            {/* Verification Status Card */}
            <div className={`p-8 border rounded-[40px] flex flex-col justify-between ${isVerified ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-amber-500/20 bg-amber-500/5'}`}>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6 italic">Eligibility Status</p>
                <h3 className={`text-3xl font-black tracking-tighter mb-2 italic ${isVerified ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {isVerified ? "VERIFIED" : "UNVERIFIED"}
                </h3>
                <p className="text-[10px] font-bold text-gray-600 uppercase">
                  {isVerified ? "Access Level: Maximum" : "Access Level: Restricted"}
                </p>
              </div>
              {!isVerified && (
                <button 
                  onClick={() => setShowVerifyModal(true)}
                  className="mt-8 py-3 bg-amber-500 text-black font-black rounded-xl text-[10px] uppercase"
                >
                  Verify Now ($10)
                </button>
              )}
            </div>

            {/* Success Rate */}
            <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] text-center flex flex-col justify-center">
                <p className="text-5xl font-black italic tracking-tighter text-white mb-2">{successRate}%</p>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Client Success Rating</p>
            </div>
          </div>
        </div>
      )}

      {/* --- 💼 MARKETPLACE TAB --- */}
      {activeTab === "tasks" && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
           <h2 className="text-3xl font-black uppercase italic tracking-tighter">Available <span className="text-[#00f2ff]">Tasks</span></h2>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sampleGigs.map(job => (
                <div key={job._id} className="p-8 bg-white/2 border border-white/10 rounded-[48px] hover:border-[#00f2ff]/30 transition-all group">
                   <div className="flex justify-between items-start mb-6">
                      <span className="px-4 py-1.5 bg-white/5 rounded-full border border-white/10 text-[9px] font-black text-gray-400 uppercase tracking-widest">{job.category}</span>
                      <p className="text-2xl font-black italic">${job.budget}</p>
                   </div>
                   <h3 className="text-xl font-bold mb-4 group-hover:text-[#00f2ff] transition-colors">{job.title}</h3>
                   <p className="text-gray-500 text-sm mb-8 line-clamp-2 font-medium">{job.description}</p>
                   <button 
                    onClick={handleApply}
                    className="w-full py-4 bg-[#00f2ff] text-black font-black rounded-2xl text-[10px] uppercase tracking-widest hover:scale-105 transition-all"
                   >
                     Apply for Gig
                   </button>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* --- 👤 ACCOUNT TAB --- */}
      {activeTab === "account" && (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
           <h2 className="text-3xl font-black uppercase italic tracking-tighter">Account <span className="text-[#00f2ff]">Overview</span></h2>
           <div className="p-10 bg-white/2 border border-white/10 rounded-[48px] space-y-8">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                 <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Verification Fee</span>
                 <span className="text-xs font-bold italic text-white">$10.00 USD</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                 <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Payment Methods</span>
                 <span className="text-xs font-bold italic text-[#00f2ff]">Binance / M-Pesa</span>
              </div>
           </div>
        </div>
      )}

      {/* --- 🚨 VERIFICATION POPUP --- */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-md" onClick={() => setShowVerifyModal(false)} />
          <div className="relative w-full max-w-md bg-[#0a0f1e] border border-amber-500/30 rounded-[40px] p-10 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-4">Verification <span className="text-amber-500">Required</span></h3>
            <p className="text-gray-400 text-sm font-medium mb-8 leading-relaxed">
              To apply for global missions and ensure platform security, you must verify your account with a one-time <span className="text-white font-bold">$10.00 fee</span>.
            </p>
            
            <div className="space-y-3">
              <button className="w-full py-4 bg-[#00f2ff] text-black font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-white transition-all">
                Pay via Binance
              </button>
              <button className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-emerald-500 transition-all">
                Pay via M-Pesa
              </button>
              <button 
                onClick={() => setShowVerifyModal(false)}
                className="w-full py-4 text-gray-600 font-bold uppercase text-[9px] tracking-widest"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MOBILE NAVIGATION --- */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-100 w-[90%] max-w-sm flex justify-around items-center p-2 bg-[#0a0f1e]/80 backdrop-blur-2xl border border-white/10 rounded-[30px] shadow-2xl">
         {[
           { id: 'home', icon: '🏠' },
           { id: 'tasks', icon: '💼' },
           { id: 'account', icon: '👤' }
         ].map(tab => (
           <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={`flex-1 flex flex-col items-center py-4 rounded-2xl transition-all ${activeTab === tab.id ? 'bg-[#00f2ff] text-black' : 'text-gray-500 hover:text-white'}`}
           >
              <span className="text-xl mb-1">{tab.icon}</span>
              <span className="text-[8px] font-black uppercase tracking-tighter">{tab.id}</span>
           </button>
         ))}
      </div>
    </div>
  );
};