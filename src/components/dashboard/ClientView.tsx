"use client";

import { useState } from "react";

export const ClientView = ({ jobs }: { jobs: any[] }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-10">
      {/* ... keep your existing stats row here ... */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">
            Your <span className="text-purple-500">Missions</span>
          </h2>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-2xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)]"
        >
          + INITIATE NEW MISSION
        </button>
      </div>

      {/* MISSION MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-xl bg-[#0a0f1e] border border-white/10 rounded-[40px] p-10 animate-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-black uppercase italic mb-8 tracking-tighter">Deploy <span className="text-purple-500">Mission</span></h2>
            
            <form className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-2">Mission Title</label>
                <input type="text" placeholder="e.g. Build Decentralized Swap" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 mt-1 outline-none focus:border-purple-500 transition-colors" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-2">Budget (USD)</label>
                  <input type="number" placeholder="500" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 mt-1 outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-2">Category</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 mt-1 outline-none focus:border-purple-500">
                    <option>Web Development</option>
                    <option>UI/UX Design</option>
                    <option>Smart Contracts</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-2">Objective Brief</label>
                <textarea placeholder="Describe the mission scope..." className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 mt-1 outline-none focus:border-purple-500 resize-none" />
              </div>

              <button className="w-full py-5 bg-purple-600 text-white font-black rounded-2xl uppercase tracking-widest hover:bg-purple-500 transition-all">
                DEPLOY TO NEXUS
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ... keep your existing "Nexus is Empty" code here ... */}
    </div>
  );
};