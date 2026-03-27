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
      window.location.assign("/dashboard");
    } else {
      alert("Error: " + res.error);
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-white overflow-hidden">
      {/* Premium Star Background */}
      <div className="absolute inset-0 z-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat pointer-events-none" />
      <div className="stars-small absolute inset-0 z-0" />

      <div className="relative z-10 w-full max-w-4xl text-center">
        <h1 className="text-5xl font-black uppercase italic mb-2 tracking-tighter animate-in fade-in slide-in-from-top-4 duration-700">
          Choose Your <span className="text-[#00f2ff]">Path</span>
        </h1>
        <p className="text-gray-500 mb-12 uppercase tracking-[0.4em] text-[10px] font-black">
          Nexus Protocol Initialization
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <button onClick={() => handleSelection("freelancer")} disabled={loading} className="p-12 bg-white/5 border border-white/10 rounded-[40px] hover:border-[#00f2ff] hover:bg-[#00f2ff]/5 transition-all group text-left">
            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">🚀</div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-2">I am a Talent</h2>
            <p className="text-gray-500 text-xs font-medium leading-relaxed">Showcase your global skillsets and get paid in the Nexus ecosystem.</p>
          </button>

          <button onClick={() => handleSelection("client")} disabled={loading} className="p-12 bg-white/5 border border-white/10 rounded-[40px] hover:border-purple-500 hover:bg-purple-500/5 transition-all group text-left">
            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">💎</div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-2">I am a Visionary</h2>
            <p className="text-gray-500 text-xs font-medium leading-relaxed">Deploy missions and hire top-tier global talent to scale your projects.</p>
          </button>
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center">
          <div className="text-[#00f2ff] font-black uppercase tracking-[1em] animate-pulse text-xs">
            Syncing Global Profile...
          </div>
        </div>
      )}
    </main>
  );
}