"use client";

import { useState } from "react";

export const FreelancerView = ({ jobs }: { jobs: any[] }) => {
  const [activeTab, setActiveTab] = useState("home");
  const [bids, setBids] = useState(12); // Premium default
  const [balance, setBalance] = useState(450.75);

  return (
    <div className="max-w-6xl mx-auto pb-32 pt-4 px-4">
      
      {/* --- 🏠 HOME / COMMAND CENTER --- */}
      {activeTab === "home" && (
        <div className="space-y-8 animate-in fade-in duration-700">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <p className="text-[10px] font-black text-[#00f2ff] uppercase tracking-[0.4em] mb-2">Operator Identity Verified</p>
              <h2 className="text-5xl font-black italic tracking-tighter text-white">COMMANDER <span className="text-gray-500">VAATI</span></h2>
            </div>
            <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-3xl flex gap-8">
               <div className="text-center">
                  <p className="text-[8px] font-black text-gray-500 uppercase mb-1">Success Rate</p>
                  <p className="text-xl font-black text-emerald-500 italic">99.2%</p>
               </div>
               <div className="text-center border-l border-white/10 pl-8">
                  <p className="text-[8px] font-black text-gray-500 uppercase mb-1">Global Rank</p>
                  <p className="text-xl font-black text-[#00f2ff] italic">#402</p>
               </div>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Wallet Card */}
            <div className="p-8 bg-linear-to-br from-[#0a0f1e] to-[#020617] border border-white/10 rounded-[40px] relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#00f2ff]/5 rounded-full blur-3xl group-hover:bg-[#00f2ff]/20 transition-all" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6 italic">Available Credits</p>
              <h3 className="text-5xl font-black tracking-tighter mb-8 italic">${balance}</h3>
              <button className="w-full py-4 bg-emerald-500 text-black font-black rounded-2xl text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
                Withdraw to M-Pesa
              </button>
            </div>

            {/* Bids Card */}
            <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6 italic">Contract Bids</p>
                <h3 className="text-5xl font-black tracking-tighter mb-2 text-[#00f2ff] italic">{bids}</h3>
                <p className="text-[10px] font-bold text-gray-600 uppercase">Resets in 14 Hours</p>
              </div>
              <button className="mt-8 text-[10px] font-black text-white/40 hover:text-white uppercase tracking-widest transition-colors">Buy More Fuel →</button>
            </div>

            {/* Tasks Status */}
            <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] grid grid-cols-2 gap-4 text-center">
               <div className="flex flex-col justify-center border-r border-white/10">
                  <p className="text-2xl font-black italic">04</p>
                  <p className="text-[8px] font-black text-gray-500 uppercase">In Progress</p>
               </div>
               <div className="flex flex-col justify-center">
                  <p className="text-2xl font-black italic text-emerald-500">128</p>
                  <p className="text-[8px] font-black text-gray-500 uppercase">Completed</p>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* --- 💼 MISSIONS MARKETPLACE --- */}
      {activeTab === "tasks" && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
           <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">Nexus <span className="text-[#00f2ff]">Marketplace</span></h2>
              <div className="flex gap-2 bg-white/5 p-2 rounded-2xl border border-white/5 w-full md:w-auto">
                 <input type="text" placeholder="FILTER BY SKILL..." className="bg-transparent px-4 py-2 text-[10px] font-black outline-none w-full" />
                 <button className="bg-[#00f2ff] text-black px-6 py-2 rounded-xl text-[10px] font-black uppercase">Search</button>
              </div>
           </div>

           {jobs.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.map(job => (
                  <div key={job._id} className="p-8 bg-white/2 border border-white/10 rounded-[48px] hover:border-[#00f2ff]/30 transition-all group">
                     <div className="flex justify-between items-start mb-6">
                        <span className="px-4 py-1.5 bg-white/5 rounded-full border border-white/10 text-[9px] font-black text-gray-400 uppercase tracking-widest">{job.category || 'Mission'}</span>
                        <p className="text-2xl font-black italic">${job.budget}</p>
                     </div>
                     <h3 className="text-xl font-bold mb-4 group-hover:text-[#00f2ff] transition-colors">{job.title}</h3>
                     <p className="text-gray-500 text-sm mb-8 line-clamp-2 leading-relaxed font-medium">{job.description}</p>
                     <div className="flex gap-3">
                        <button className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#00f2ff] hover:text-black transition-all">Submit Bid</button>
                        <button className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase hover:bg-white/10">Details</button>
                     </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className="py-40 flex flex-col items-center border-2 border-dashed border-white/5 rounded-[60px] text-center">
                <div className="w-12 h-12 bg-[#00f2ff]/10 rounded-full animate-ping mb-4" />
                <h3 className="text-lg font-black uppercase tracking-widest italic text-gray-500">Scanning Satellite Frequencies...</h3>
                <p className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.3em] mt-2">No active missions detected in your sector</p>
             </div>
           )}
        </div>
      )}

      {/* --- 👤 ACCOUNT ENCRYPTION --- */}
      {activeTab === "account" && (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
           <h2 className="text-3xl font-black uppercase italic tracking-tighter">Security <span className="text-[#00f2ff]">Protocol</span></h2>
           
           <div className="p-10 bg-white/2 border border-white/10 rounded-[48px] space-y-10">
              <div className="flex items-center gap-6">
                 <div className="w-20 h-20 bg-[#00f2ff] rounded-[30px] flex items-center justify-center font-black text-black text-3xl italic">V</div>
                 <div>
                    <h3 className="text-2xl font-black tracking-tighter uppercase italic">Emmanuel Vaati</h3>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Level 4 Certified Operator</p>
                 </div>
              </div>

              <div className="space-y-6">
                 {[
                   { label: "Neural Link", value: "vaati@nexus-gigs.com" },
                   { label: "M-Pesa Node", value: "+254 712 *** 890" },
                   { label: "Region Code", value: "KE (Kenya)" },
                   { label: "Join Date", value: "MARCH 2026" }
                 ].map((item, i) => (
                   <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4">
                      <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{item.label}</span>
                      <span className="text-xs font-bold italic text-white uppercase">{item.value}</span>
                   </div>
                 ))}
              </div>

              <button className="w-full py-5 border border-red-500/20 text-red-500 font-black rounded-3xl text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                 Terminate Local Session
              </button>
           </div>
        </div>
      )}

      {/* --- 📱 NAVIGATION PROTOCOL (MOBILE) --- */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-100 w-[90%] max-w-sm flex justify-around items-center p-2 bg-[#0a0f1e]/80 backdrop-blur-2xl border border-white/10 rounded-[30px] shadow-2xl">
         {[
           { id: 'home', icon: '🏠' },
           { id: 'tasks', icon: '💼' },
           { id: 'account', icon: '👤' }
         ].map(tab => (
           <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={`flex-1 flex flex-col items-center py-4 rounded-2xl transition-all ${activeTab === tab.id ? 'bg-[#00f2ff] text-black scale-105' : 'text-gray-500 hover:text-white'}`}
           >
              <span className="text-xl mb-1">{tab.icon}</span>
              <span className="text-[8px] font-black uppercase tracking-tighter">{tab.id}</span>
           </button>
         ))}
      </div>
    </div>
  );
};