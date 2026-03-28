"use client";

import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { FreelancerView } from "@/components/dashboard/FreelancerView";
import { ClientView } from "@/components/dashboard/ClientView";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [mounted, setMounted] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // 1. Check Clerk Metadata (Permanent Save)
    if (user?.publicMetadata?.role) {
      setSelectedRole(user.publicMetadata.role as string);
    } 
    // 2. Fallback: Check Local Storage (Browser Cache) so it survives a reload
    else {
      const savedRole = localStorage.getItem("nexus_user_role");
      if (savedRole) setSelectedRole(savedRole);
    }
  }, [user]);

  // Handle Role Selection
  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    localStorage.setItem("nexus_user_role", role);
    // Note: In the next step, we will add a Server Action here to 
    // permanently save this to user.publicMetadata in Clerk.
  };

  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-[#00f2ff] font-black animate-pulse uppercase tracking-[0.5em] text-[10px]">Synchronizing Nexus...</div>
      </div>
    );
  }

  // --- ✨ 1. LANDING PAGE (Not Signed In) ---
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-[#020617] text-white selection:bg-[#00f2ff]/30 overflow-x-hidden relative">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#020617_100%)] z-10" />
          <div className="stars-container">
             {[...Array(60)].map((_, i) => (
               <div key={i} className="absolute bg-white rounded-full animate-twinkle" style={{ width: Math.random() * 2 + 'px', height: Math.random() * 2 + 'px', top: Math.random() * 100 + '%', left: Math.random() * 100 + '%', animationDelay: Math.random() * 5 + 's', opacity: Math.random() }} />
             ))}
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <section className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 max-w-lg mb-12 animate-in fade-in zoom-in duration-1000">
              {[{ l: "Active Gigs", v: "1.2M+" }, { l: "Total Settlements", v: "$ 2.5M+" }, { l: "Gigs Completed", v: "480K+" }, { l: "Relay Latency", v: "0.02s" }].map((stat, i) => (
                <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-[40px] backdrop-blur-md shadow-2xl">
                  <p className="text-[8px] font-black text-gray-500 uppercase mb-2 tracking-widest italic">{stat.l}</p>
                  <h3 className="text-3xl font-black italic text-[#00f2ff]">{stat.v}</h3>
                </div>
              ))}
            </div>

            <div className="w-full max-w-sm space-y-4 animate-in slide-in-from-bottom-8 duration-700">
              <SignUpButton mode="modal">
                <button className="w-full py-6 bg-[#00f2ff] text-black font-black rounded-3xl uppercase text-[12px] tracking-[0.3em] hover:scale-105 transition-all shadow-2xl shadow-[#00f2ff]/20 italic">Get Started</button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button className="w-full py-5 border border-white/10 text-white font-black rounded-3xl uppercase text-[10px] tracking-[0.3em] hover:bg-white/5 transition-all italic">Sign In</button>
              </SignInButton>
            </div>
          </section>

          {/* Intel Cards */}
          <section className="max-w-7xl mx-auto px-6 pb-32 space-y-32 text-left w-full">
            <div className="p-12 md:p-20 bg-linear-to-br from-white/5 to-[#00f2ff]/5 border border-white/10 rounded-[60px] relative overflow-hidden shadow-2xl backdrop-blur-sm">
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-6">WHAT IS <span className="text-[#00f2ff]">NEXUSGIGS?</span></h2>
              <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl font-medium">NexusGigs is a decentralized satellite relay connecting elite talent to global gigs. Bypass banking delays with instant settlements.</p>
            </div>
          </section>
        </div>
        <style jsx global>{` @keyframes twinkle { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.2); } } .animate-twinkle { animation: twinkle 3s infinite ease-in-out; } `}</style>
      </div>
    );
  }

  // --- 🛡️ 2. PATH SELECTION (Only if no role is stored) ---
  if (isSignedIn && !selectedRole) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,242,255,0.05)_0%,transparent_70%)]" />
         <div className="relative z-10 w-full max-w-5xl space-y-12 text-center animate-in fade-in zoom-in duration-700">
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">Choose Your <span className="text-[#00f2ff]">Protocol</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <button onClick={() => handleRoleSelect('freelancer')} className="group p-12 bg-white/5 border border-white/10 rounded-[60px] hover:border-[#00f2ff]/40 transition-all text-left relative overflow-hidden shadow-2xl active:scale-95">
                <div className="text-4xl mb-6">💼</div>
                <h3 className="text-2xl font-black uppercase italic mb-4 group-hover:text-[#00f2ff]">Freelancer</h3>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider italic">Access the Gig Feed and receive instant settlements.</p>
              </button>
              <button onClick={() => handleRoleSelect('client')} className="group p-12 bg-white/5 border border-white/10 rounded-[60px] hover:border-[#00f2ff]/40 transition-all text-left relative overflow-hidden shadow-2xl active:scale-95">
                <div className="text-4xl mb-6">🎯</div>
                <h3 className="text-2xl font-black uppercase italic mb-4 group-hover:text-[#00f2ff]">Client</h3>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider italic">Deploy new gigs and hire elite talent globally.</p>
              </button>
            </div>
         </div>
      </div>
    );
  }

  // --- 🖥️ 3. DASHBOARD ROUTING (Role is remembered) ---
  return (
    <main className="min-h-screen bg-[#020617]">
      {selectedRole === "freelancer" ? (
        <FreelancerView jobs={[]} userMetadata={user?.publicMetadata || {}} />
      ) : (
        <ClientView jobs={[]} />
      )}
    </main>
  );
}