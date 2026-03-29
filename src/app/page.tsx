"use client";

import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { FreelancerView } from "@/components/dashboard/FreelancerView";
import { ClientView } from "@/components/dashboard/ClientView";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [mounted, setMounted] = useState(false);
  
  // States: landing -> path -> dashboard
  const [step, setStep] = useState<"landing" | "path" | "dashboard">("landing");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    if (isSignedIn && isLoaded) {
      // Priority 1: Check Clerk Metadata (The Source of Truth)
      const metaRole = user?.publicMetadata?.role as string;
      // Priority 2: Check LocalStorage (Fallback)
      const savedRole = localStorage.getItem("nexus_user_role");

      if (metaRole) {
        setSelectedRole(metaRole);
        setStep("dashboard");
      } else if (savedRole) {
        setSelectedRole(savedRole);
        setStep("dashboard");
      } else {
        setStep("path"); // FORCE PATH SELECTION
      }
    }
  }, [isSignedIn, isLoaded, user]);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    localStorage.setItem("nexus_user_role", role);
    setStep("dashboard");
  };

  if (!mounted || !isLoaded) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-[#00f2ff] font-black animate-pulse">INITIALIZING...</div>;

  // --- 1. LANDING ---
  if (step === "landing" && !isSignedIn) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-8xl font-black italic uppercase tracking-tighter mb-8">NEXUS<span className="text-[#00f2ff]">GIGS</span></h1>
        <div className="flex gap-4">
          <SignUpButton mode="modal"><button className="px-12 py-5 bg-[#00f2ff] text-black font-black rounded-3xl uppercase text-xs italic">Get Started</button></SignUpButton>
          <SignInButton mode="modal"><button className="px-12 py-5 border border-white/10 rounded-3xl font-black uppercase text-xs italic">Sign In</button></SignInButton>
        </div>
      </div>
    );
  }

  // --- 2. PATH SELECTION ---
  if (step === "path") {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6">
        <h2 className="text-5xl font-black italic uppercase mb-16 tracking-tighter">Define <span className="text-[#00f2ff]">Protocol</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl">
          <button onClick={() => handleRoleSelect('freelancer')} className="group p-16 bg-[#0a0f1e] border border-white/10 rounded-[60px] hover:border-[#00f2ff]/50 transition-all shadow-2xl active:scale-95 text-left">
            <div className="text-6xl mb-10 group-hover:scale-110 transition-transform">💼</div>
            <h3 className="text-4xl font-black uppercase italic mb-4">Freelancer</h3>
            <p className="text-gray-500 italic">Accept missions and clear instant settlements.</p>
          </button>
          <button onClick={() => handleRoleSelect('client')} className="group p-16 bg-[#0a0f1e] border border-white/10 rounded-[60px] hover:border-[#00f2ff]/50 transition-all shadow-2xl active:scale-95 text-left">
            <div className="text-6xl mb-10 group-hover:scale-110 transition-transform">🎯</div>
            <h3 className="text-4xl font-black uppercase italic mb-4">Client</h3>
            <p className="text-gray-500 italic">Deploy tactical missions and acquire nodes.</p>
          </button>
        </div>
      </div>
    );
  }

  // --- 3. DASHBOARD ---
  return (
    <main className="min-h-screen">
      {selectedRole === "freelancer" ? <FreelancerView jobs={[]} userMetadata={user?.publicMetadata || {}} /> : <ClientView jobs={[]} />}
    </main>
  );
}