"use client";

import { useState } from "react";
import { completeOnboarding } from "./_actions";
import { useSession } from "@clerk/nextjs";

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false);
  const { session } = useSession();

const handleSelection = async (role: "freelancer" | "client") => {
    setLoading(true);
    const res = await completeOnboarding(role);
    
    if (res.success) {
      await session?.reload();
      // This sends them to the dashboard immediately after the choice
      window.location.assign("/dashboard");
    } else {
      alert("Error: " + res.error);
      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-white text-center">
      <h1 className="text-4xl font-black uppercase italic mb-2 tracking-tighter">Choose Your <span className="text-[#00f2ff]">Path</span></h1>
      <p className="text-gray-400 mb-12">Define your identity on the NexusGigs ecosystem.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Talent Card */}
        <button 
          onClick={() => handleSelection("freelancer")}
          disabled={loading}
          className="p-10 bg-white/5 border border-white/10 rounded-[40px] hover:border-[#00f2ff] transition-all group text-left"
        >
          <div className="text-3xl mb-4">🚀</div>
          <h2 className="text-2xl font-bold mb-2">I am a Talent</h2>
          <p className="text-gray-500 text-sm">Showcase skills and get paid securely.</p>
        </button>

        {/* Visionary Card */}
        <button 
          onClick={() => handleSelection("client")}
          disabled={loading}
          className="p-10 bg-white/5 border border-white/10 rounded-[40px] hover:border-purple-500 transition-all group text-left"
        >
          <div className="text-3xl mb-4">💎</div>
          <h2 className="text-2xl font-bold mb-2">I am a Visionary</h2>
          <p className="text-gray-500 text-sm">Hire top-tier talent to build your projects.</p>
        </button>
      </div>

      {loading && <div className="mt-8 text-[#00f2ff] font-bold animate-pulse">UPDATING GLOBAL PROFILE...</div>}
    </main>
  );
}