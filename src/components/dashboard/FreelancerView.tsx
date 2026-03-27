"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export const FreelancerView = ({ jobs }: { jobs: any[] }) => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("home");
  const [isVerified, setIsVerified] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  // Profile States
  const [phone, setPhone] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Dynamic Gigs with Client Ratings
  const missionGigs = [
    { id: "1", title: "Python Script for Web Scraping", budget: 85, client: "Sarah M.", rating: "4.9/5", category: "Backend" },
    { id: "2", title: "Modern Logo Design for Tech Startup", budget: 200, client: "Alex Pro", rating: "5.0/5", category: "Design" },
    { id: "3", title: "Content Writing: Crypto Blog", budget: 30, client: "John G.", rating: "4.7/5", category: "Writing" },
  ];

  const handleMpesaPay = () => {
    if (!mpesaNumber || mpesaNumber.length < 10) {
      alert("Please provide a valid M-Pesa number (e.g., 0712345678)");
      return;
    }
    setIsPaying(true);
    // Simulate STK Push
    setTimeout(() => {
      alert("STK Push sent to " + mpesaNumber + ". Confirm on your phone.");
      setIsPaying(false);
      setIsVerified(true);
      setShowVerifyModal(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto pb-32 pt-2 px-4">
      
      {/* --- 🏠 HOME TAB --- */}
      {activeTab === "home" && (
        <div className="space-y-6 animate-in fade-in duration-700">
          <header className="mb-8">
            <p className="text-[10px] font-black text-[#00f2ff] uppercase tracking-[0.4em] mb-1">Authenticated</p>
            <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">
               {user?.firstName || "GUEST"} <span className="text-gray-600">{user?.lastName || "USER"}</span>
            </h2>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 bg-white/5 border border-white/10 rounded-[30px]">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-4">Balance</p>
              <h3 className="home-text-sm font-black text-white italic">$0.00</h3>
            </div>

            <div className={`p-6 border rounded-[30px] ${isVerified ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-amber-500/20 bg-amber-500/5'}`}>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-4">Status</p>
              <h3 className="home-text-sm font-black italic text-white">
                {isVerified ? "PROTOCOL VERIFIED" : "PENDING VERIFICATION"}
              </h3>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-[30px]">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-4">Success Rate</p>
                <h3 className="home-text-sm font-black italic text-white">0%</h3>
            </div>
          </div>
        </div>
      )}

      {/* --- 💼 MARKETPLACE TAB --- */}
      {activeTab === "tasks" && (
        <div className="space-y-6 animate-in fade-in">
           <h2 className="text-2xl font-black uppercase italic tracking-tighter">Live <span className="text-[#00f2ff]">Missions</span></h2>

           <div className="grid grid-cols-1 gap-4">
              {missionGigs.map(job => (
                <div key={job.id} className="p-6 bg-white/2 border border-white/10 rounded-[30px] hover:border-[#00f2ff]/30 transition-all">
                   <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-black text-[10px]">{job.client[0]}</div>
                        <div>
                           <p className="text-xs font-bold text-white">{job.client}</p>
                           <p className="text-[8px] font-black text-emerald-500 uppercase">Rating: {job.rating}</p>
                        </div>
                      </div>
                      <p className="text-xl font-black italic text-[#00f2ff]">${job.budget}</p>
                   </div>
                   <h3 className="text-md font-bold text-white mb-2">{job.title}</h3>
                   <button 
                    onClick={() => !isVerified ? setShowVerifyModal(true) : alert("Applying...")}
                    className="w-full py-3 bg-white/5 border border-white/10 hover:bg-[#00f2ff] hover:text-black rounded-xl text-[9px] font-black uppercase transition-all"
                   >
                     Submit Proposal
                   </button>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* --- 👤 ACCOUNT TAB --- */}
      {activeTab === "account" && (
        <div className="max-w-xl mx-auto space-y-6 animate-in fade-in">
           <h2 className="text-2xl font-black uppercase italic tracking-tighter">Identity <span className="text-[#00f2ff]">Vault</span></h2>
           
           <div className="p-8 bg-white/2 border border-white/10 rounded-4xl space-y-6">
              <div className="space-y-4">
                 <div className="flex flex-col">
                    <label className="text-[9px] font-black text-gray-600 uppercase mb-1">Email Node</label>
                    <input disabled value={user?.emailAddresses[0].emailAddress} className="bg-transparent border-b border-white/5 py-2 text-sm text-gray-400" />
                 </div>
                 <div className="flex flex-col">
                    <label className="text-[9px] font-black text-gray-600 uppercase mb-1">M-Pesa Mobile Number</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 0712345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-transparent border-b border-white/10 py-2 text-sm text-white focus:border-[#00f2ff] outline-none" 
                    />
                 </div>
              </div>
              <button className="w-full py-4 bg-[#00f2ff]/10 border border-[#00f2ff]/20 text-[#00f2ff] font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-[#00f2ff] hover:text-black transition-all">
                 Update Profile
              </button>
           </div>
        </div>
      )}

      {/* --- 🚨 M-PESA VERIFICATION POPUP --- */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="absolute inset-0 bg-[#020617]/95" onClick={() => setShowVerifyModal(false)} />
          <div className="relative w-full max-w-sm bg-[#0a0f1e] border border-white/10 rounded-4xl p-8 text-center animate-in zoom-in-95">
            <h3 className="text-xl font-black uppercase italic text-white mb-2">M-Pesa <span className="text-emerald-500">Verification</span></h3>
            <p className="text-gray-400 text-xs mb-8">Verification fee: <span className="text-white">$10 (~1,350 KES)</span></p>
            
            <div className="text-left space-y-4 mb-8">
              <label className="text-[9px] font-black text-gray-500 uppercase ml-1">Phone Number to Charge</label>
              <input 
                type="text" 
                placeholder="07XXXXXXXX" 
                value={mpesaNumber}
                onChange={(e) => setMpesaNumber(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white font-bold outline-none focus:border-emerald-500"
              />
            </div>

            <button 
              onClick={handleMpesaPay}
              disabled={isPaying}
              className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest"
            >
              {isPaying ? "SENDING STK PUSH..." : "INITIALIZE PAYMENT"}
            </button>
          </div>
        </div>
      )}

      {/* --- 📱 SHRUNK NAVIGATION PILL --- */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-100 w-[80%] max-w-[320px] flex justify-around items-center p-1.5 bg-[#0a0f1e]/90 backdrop-blur-2xl border border-white/5 rounded-full shadow-2xl">
         {[
           { id: 'home', icon: '🏠' },
           { id: 'tasks', icon: '💼' },
           { id: 'account', icon: '👤' }
         ].map(tab => (
           <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={`flex-1 flex flex-col items-center py-3 rounded-full transition-all ${activeTab === tab.id ? 'bg-[#00f2ff] text-black' : 'text-gray-500'}`}
           >
              <span className="text-lg">{tab.icon}</span>
           </button>
         ))}
      </div>
    </div>
  );
};