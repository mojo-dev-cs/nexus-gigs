"use client";

import { useState } from "react";
import { createJob } from "@/app/dashboard/_actions";

export const ClientView = ({ jobs }: { jobs: any[] }) => {
  const [isPosting, setIsPosting] = useState(false);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Active Missions", val: jobs.length, color: "text-purple-500" },
          { label: "Total Spent", val: "$0", color: "text-emerald-500" },
          { label: "Proposals", val: "0", color: "text-[#00f2ff]" },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-xl">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">{stat.label}</p>
            <p className={`text-3xl font-black italic tracking-tighter ${stat.color}`}>{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">
            Your <span className="text-purple-500">Missions</span>
          </h2>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-1">Manage your global project portfolio</p>
        </div>
        <button 
          onClick={() => alert("Post Mission feature coming in next step!")}
          className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
        >
          + INITIATE NEW MISSION
        </button>
      </div>

      {/* Missions List */}
      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {/* Mapping logic here later */}
        </div>
      ) : (
        <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[48px] bg-white/[0.02]">
          <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mb-6 border border-purple-500/20">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-white uppercase tracking-tight">The Nexus is Empty</h3>
          <p className="text-gray-500 text-sm mt-2 max-w-xs text-center font-medium">
            You haven't deployed any missions to the talent pool yet.
          </p>
        </div>
      )}
    </div>
  );
};