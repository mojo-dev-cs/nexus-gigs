"use client";

import { useState } from "react";

export const FreelancerView = ({ jobs }: { jobs: any[] }) => {
  const [earnings, setEarnings] = useState(1250); // Simulated existing earnings

  const handleWithdraw = () => {
    const amount = prompt("Enter amount to withdraw (USD):", "100");
    if (amount && parseFloat(amount) <= earnings) {
      setEarnings(prev => prev - parseFloat(amount));
      alert(`Withdrawal of $${amount} initiated to your linked account.`);
    } else {
      alert("Insufficient funds or invalid amount.");
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* 💳 FINANCIAL OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 bg-linear-to-br from-[#00f2ff]/10 to-transparent border border-[#00f2ff]/20 rounded-[40px] backdrop-blur-xl">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#00f2ff] mb-2">Available Balance</p>
          <div className="flex items-end justify-between">
            <h3 className="text-4xl font-black italic tracking-tighter text-white">${earnings}</h3>
            <button 
              onClick={handleWithdraw}
              className="px-6 py-2 bg-[#00f2ff] text-black font-black text-[10px] rounded-full uppercase hover:scale-105 transition-all"
            >
              Withdraw
            </button>
          </div>
        </div>

        <div className="p-8 bg-white/5 border border-white/10 rounded-[40px]">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-500 mb-2">Active Gigs</p>
          <h3 className="text-4xl font-black italic tracking-tighter text-white">2</h3>
        </div>

        <div className="p-8 bg-white/5 border border-white/10 rounded-[40px]">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-500 mb-2">Reputation Score</p>
          <div className="flex items-center gap-3">
            <h3 className="text-4xl font-black italic tracking-tighter text-emerald-500">98%</h3>
            <span className="text-[8px] font-black bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded border border-emerald-500/20">TOP RATED</span>
          </div>
        </div>
      </div>

      {/* 📂 MISSION CONTROL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4">
        <div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter">Mission <span className="text-[#00f2ff]">Feed</span></h2>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em] mt-1">Available Global Contracts</p>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
          <button className="px-6 py-3 bg-[#00f2ff] text-black text-[10px] font-black rounded-xl uppercase">Browse</button>
          <button className="px-6 py-3 text-gray-500 text-[10px] font-black rounded-xl uppercase hover:text-white transition-colors">My Proposals</button>
        </div>
      </div>

      {/* 🛰️ JOB GRID */}
      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div key={job._id} className="group p-8 bg-white/3 border border-white/10 rounded-[48px] hover:border-[#00f2ff]/40 transition-all">
              <div className="flex justify-between items-start mb-6">
                <span className="text-[9px] font-black bg-white/5 px-4 py-1.5 rounded-full border border-white/10 text-gray-400 uppercase tracking-widest">
                  {job.category || "TECH"}
                </span>
                <p className="text-2xl font-black text-white italic">${job.budget}</p>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-[#00f2ff] transition-colors">{job.title}</h3>
              <p className="text-gray-500 text-sm font-medium line-clamp-2 mb-8">{job.description}</p>
              
              <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#00f2ff] hover:text-black hover:border-[#00f2ff] transition-all">
                Submit Proposal
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[60px] bg-white/1">
          <div className="relative mb-6">
            <div className="w-16 h-16 bg-[#00f2ff]/10 rounded-full animate-ping absolute" />
            <div className="w-16 h-16 bg-[#00f2ff]/5 rounded-full flex items-center justify-center relative border border-[#00f2ff]/20">
               <span className="text-2xl">📡</span>
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-300 uppercase tracking-widest">Scanning Nexus Frequencies</h3>
          <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.3em] mt-2">No active missions found in your sector</p>
        </div>
      )}
    </div>
  );
};