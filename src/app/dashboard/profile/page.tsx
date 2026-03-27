"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function ProfileSetup() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  return (
    <main className="min-h-screen bg-[#020617] text-white p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase">
            Complete Your <span className="text-[#00f2ff]">Nexus Profile</span>
          </h1>
          <p className="text-gray-400">This is how clients will see your global talent.</p>
        </div>

        <form className="space-y-6 bg-white/5 p-8 rounded-3xl border border-white/10">
          {/* Bio Section */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-[#00f2ff]">Professional Bio</label>
            <textarea 
              placeholder="e.g. Senior Full-stack Developer specializing in Next.js and 3D Web Experiences..."
              className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-[#00f2ff] outline-none h-32 transition-all"
            />
          </div>

          {/* Skills Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#00f2ff]">Top Skill</label>
              <input 
                type="text" 
                placeholder="React, Design, Python..."
                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-[#00f2ff] outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#00f2ff]">Hourly Rate ($)</label>
              <input 
                type="number" 
                placeholder="50"
                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-[#00f2ff] outline-none"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-[#00f2ff] text-black font-black rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(0,242,255,0.2)]"
          >
            SAVE PROFILE
          </button>
        </form>
      </div>
    </main>
  );
}