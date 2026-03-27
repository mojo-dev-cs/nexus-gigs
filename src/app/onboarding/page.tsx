// Functional Onboarding Page
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { completeOnboarding } from "./_actions"; 

export default function OnboardingPage() {
  const [role, setRole] = useState<"freelancer" | "client" | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser();

const handleSelection = async (selectedRole: "freelancer" | "client") => {
    setRole(selectedRole);
    setLoading(true);

    try {
      const res = await completeOnboarding(selectedRole);

      if (res?.message === "Onboarding completed") {
        // Force a window-level redirect to bypass any Next.js caching
        window.location.href = "/dashboard";
      } else {
        console.error("Onboarding failed:", res?.error);
        setLoading(false);
        alert("Setup failed. Please try again.");
      }
    } catch (error) {
      console.error("Network error:", error);
      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-4xl w-full space-y-12 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
            CHOOSE YOUR <span className="text-[#00f2ff]">PATH</span>
          </h1>
          <p className="text-gray-400 text-lg">Define your identity on the NexusGigs ecosystem.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Freelancer Card */}
          <button
            onClick={() => handleSelection("freelancer")}
            disabled={loading}
            className={`group relative p-8 rounded-3xl border-2 transition-all duration-500 text-left bg-white/5 
              ${role === "freelancer" ? "border-[#00f2ff] shadow-[0_0_40px_rgba(0,242,255,0.2)]" : "border-white/10 hover:border-white/30 cursor-pointer"}`}
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#00f2ff]/20 flex items-center justify-center text-[#00f2ff] text-2xl group-hover:scale-110 transition-transform">
                🚀
              </div>
              <h3 className="text-2xl font-bold">I am a Talent</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Showcase your skills, find global opportunities, and get paid securely.
              </p>
            </div>
          </button>

          {/* Client Card */}
          <button
            onClick={() => handleSelection("client")}
            disabled={loading}
            className={`group relative p-8 rounded-3xl border-2 transition-all duration-500 text-left bg-white/5 
              ${role === "client" ? "border-[#00f2ff] shadow-[0_0_40px_rgba(0,242,255,0.2)]" : "border-white/10 hover:border-white/30 cursor-pointer"}`}
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#00f2ff]/20 flex items-center justify-center text-[#00f2ff] text-2xl group-hover:scale-110 transition-transform">
                💎
              </div>
              <h3 className="text-2xl font-bold">I am a Visionary</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Hire top-tier global talent to build your projects and scale your business.
              </p>
            </div>
          </button>
        </div>

        {loading && (
          <div className="pt-8 flex flex-col items-center gap-4 animate-pulse">
            <div className="w-8 h-8 border-4 border-[#00f2ff] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#00f2ff] font-bold tracking-widest text-xs uppercase">Updating Global Profile...</p>
          </div>
        )}
      </div>
    </main>
  );
}