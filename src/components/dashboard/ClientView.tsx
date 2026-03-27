"use client";

import { useState } from "react";

export const ClientView = ({ jobs }: { jobs: any[] }) => {
  const [showModal, setShowModal] = useState(false);
  const [balance, setBalance] = useState(0);

  // Practical function: Simulate a deposit
  const handleDeposit = () => {
    const amount = prompt("Enter deposit amount (USD):", "500");
    if (amount) setBalance(prev => prev + parseFloat(amount));
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* 💰 FINANCIAL COMMAND BAR */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 bg-white/5 border border-white/10 rounded-4xl backdrop-blur-xl group hover:border-emerald-500/50 transition-all">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Escrow Balance</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black italic tracking-tighter text-emerald-500">${balance}</h3>
            <button onClick={handleDeposit} className="text-[10px] font-black bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all">
              + DEPOSIT
            </button>
          </div>
        </div>
        
        <div className="p-6 bg-white/5 border border-white/10 rounded-4xl opacity-60">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Total Paid</p>
          <h3 className="text-3xl font-black italic tracking-tighter text-white">$0</h3>
        </div>

        <div className="p-6 bg-white/5 border border-white/10 rounded-4xl">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Active Missions</p>
          <h3 className="text-3xl font-black italic tracking-tighter text-purple-500">{jobs.length}</h3>
        </div>

        <div className="p-6 bg-white/5 border border-white/10 rounded-4xl">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Radar: Online Talents</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#00f2ff] rounded-full animate-ping" />
            <h3 className="text-3xl font-black italic tracking-tighter text-[#00f2ff]">128</h3>
          </div>
        </div>
      </div>

      {/* ⚡ ACTION HUB */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-6">
        <div className="space-y-1">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter">Mission <span className="text-purple-500">Control</span></h2>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em]">Global Recruitment Protocol</p>
        </div>
        
        <div className="flex gap-4">
           <button className="px-6 py-4 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">
             Payment History
           </button>
           <button 
             onClick={() => setShowModal(true)}
             className="px-10 py-4 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-2xl transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:scale-105"
           >
             + DEPLOY MISSION
           </button>
        </div>
      </div>

      {/* 🛰️ RADAR VIEW (Online Freelancers List) */}
      <div className="bg-white/2 border border-white/5 rounded-[40px] p-8">
        <h3 className="text-xs font-black uppercase tracking-[0.5em] text-gray-600 mb-8">Top Verified Talents Online</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Alex K.", skill: "Fullstack Dev", rate: "$45/hr", status: "Available" },
            { name: "Sarah M.", skill: "UI/UX Designer", rate: "$60/hr", status: "In Mission" },
            { name: "John D.", skill: "Solidity Expert", rate: "$120/hr", status: "Available" },
          ].map((dev, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-[#00f2ff]/30 transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-linear-to-tr from-purple-500 to-[#00f2ff] p-0.5">
                  <div className="w-full h-full bg-[#0a0f1e] rounded-full" />
                </div>
                <div>
                  <p className="text-sm font-bold">{dev.name}</p>
                  <p className="text-[10px] text-gray-500 uppercase font-black">{dev.skill}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-[#00f2ff]">{dev.rate}</p>
                <p className={`text-[8px] font-black uppercase ${dev.status === 'Available' ? 'text-emerald-500' : 'text-orange-500'}`}>{dev.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🚀 DEPLOY MISSION MODAL (Unchanged but functional) */}
      {showModal && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-md" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-2xl bg-[#0a0f1e] border border-white/10 rounded-[48px] p-12 shadow-2xl">
             <div className="flex justify-between items-start mb-10">
                <h2 className="text-3xl font-black uppercase italic tracking-tighter">Deploy <span className="text-purple-500">Mission</span></h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white">✕</button>
             </div>
             <div className="space-y-8">
                <input type="text" placeholder="MISSION CODENAME..." className="w-full bg-white/5 border-b border-white/10 py-4 text-xl font-bold outline-none focus:border-purple-500 transition-all" />
                <div className="grid grid-cols-2 gap-8">
                   <input type="number" placeholder="BUDGET (USD)" className="bg-white/5 border-b border-white/10 py-4 text-lg font-bold outline-none focus:border-purple-500" />
                   <select className="bg-white/5 border-b border-white/10 py-4 text-sm font-bold uppercase outline-none focus:border-purple-500">
                      <option>Web Engineering</option>
                      <option>Design & Branding</option>
                      <option>Cyber Security</option>
                   </select>
                </div>
                <textarea placeholder="MISSION BRIEFING..." className="w-full h-32 bg-white/5 border border-white/10 rounded-3xl p-6 outline-none focus:border-purple-500 resize-none" />
                <button className="w-full py-6 bg-purple-600 text-white font-black rounded-3xl uppercase tracking-widest hover:bg-purple-500 shadow-xl transition-all">
                  AUTHORIZE DEPLOYMENT
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};