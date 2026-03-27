"use client";

import { useState } from "react";

export const FreelancerView = ({ jobs }: { jobs: any[] }) => {
  const [activeTab, setActiveTab] = useState("home");
  const [bids, setBids] = useState(5);

  return (
    <div className="pb-24"> {/* Space for bottom nav */}
      
      {/* 🏠 HOME TAB */}
      {activeTab === "home" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="p-8 bg-linear-to-br from-[#00f2ff]/20 to-purple-500/10 border border-white/10 rounded-4xl">
            <p className="text-xs font-bold text-gray-400">Welcome back,</p>
            <h2 className="text-3xl font-black italic tracking-tighter text-white">Emmanuel 👋</h2>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <p className="text-[10px] font-black text-gray-500 uppercase">Bids Left</p>
                <p className="text-2xl font-black text-[#00f2ff]">{bids}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <p className="text-[10px] font-black text-gray-500 uppercase">Wallet</p>
                <p className="text-2xl font-black text-white">$0.00</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white/5 p-6 rounded-4xl border border-white/10 flex justify-between items-center">
               <div>
                  <p className="text-[10px] font-black text-emerald-500 uppercase mb-1">Wallet Status</p>
                  <p className="text-2xl font-black">$0.00</p>
               </div>
               <button className="px-6 py-2 bg-emerald-500 text-black font-black text-[10px] rounded-full uppercase">Withdraw</button>
            </div>
          </div>
        </div>
      )}

      {/* 💼 TASKS TAB */}
      {activeTab === "tasks" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-end">
             <h2 className="text-2xl font-black uppercase italic tracking-tighter">Available <span className="text-[#00f2ff]">Missions</span></h2>
             <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-center">
                <p className="text-[8px] font-black text-gray-500 uppercase">Bids</p>
                <p className="text-xs font-bold">{bids}</p>
             </div>
          </div>

          {jobs.length > 0 ? jobs.map(job => (
            <div key={job._id} className="bg-white/5 border border-white/10 rounded-4xl p-8 space-y-4">
               <h3 className="text-lg font-bold">{job.title}</h3>
               <p className="text-gray-500 text-xs line-clamp-2">{job.description}</p>
               <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                     <p className="text-[8px] font-black text-gray-500 uppercase">Pay</p>
                     <p className="text-sm font-bold text-emerald-500">${job.budget}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                     <p className="text-[8px] font-black text-gray-500 uppercase">Region</p>
                     <p className="text-sm font-bold">Kenya</p>
                  </div>
               </div>
               <button className="w-full py-4 bg-[#00f2ff] text-black font-black rounded-2xl uppercase text-[10px] tracking-widest">
                  Place Bid →
               </button>
            </div>
          )) : <div className="text-center py-20 text-gray-500">No tasks currently available.</div>}
        </div>
      )}

      {/* 👤 ACCOUNT TAB */}
      {activeTab === "account" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
           <div className="bg-white/5 border border-white/10 rounded-4xl p-8">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6">Account Overview</h3>
              <div className="space-y-4">
                 <div className="flex justify-between border-b border-white/5 pb-4">
                    <span className="text-xs text-gray-400">Email Address</span>
                    <span className="text-xs font-bold text-white">emma@nexus.com</span>
                 </div>
                 <div className="flex justify-between border-b border-white/5 pb-4">
                    <span className="text-xs text-gray-400">Country</span>
                    <span className="text-xs font-bold text-white">KE</span>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* BOTTOM NAVIGATION */}
      <TalentNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

// Sub-component for the Nav
const TalentNav = ({ activeTab, setActiveTab }: any) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'tasks', label: 'Tasks', icon: '💼' },
    { id: 'account', label: 'Account', icon: '👤' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0f1e]/90 backdrop-blur-xl border-t border-white/5 px-6 py-4 flex justify-between items-center">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === tab.id ? 'text-[#00f2ff]' : 'text-gray-500'}`}
        >
          <span className="text-xl">{tab.icon}</span>
          <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};