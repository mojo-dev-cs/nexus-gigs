"use client";

import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { FreelancerView } from "@/components/dashboard/FreelancerView";
import { ClientView } from "@/components/dashboard/ClientView";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [mounted, setMounted] = useState(false);
  
  // Flow Controller: landing -> survey -> loading -> path -> dashboard
  const [step, setStep] = useState<"landing" | "survey" | "loading" | "path" | "dashboard">("landing");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // 📋 10-Question Freelancing Sync Survey
  const surveyQuestions = [
    { q: "What is your primary freelancing domain?", options: ["Software Development", "Creative Design", "Digital Marketing", "Technical Writing"] },
    { q: "Current level of professional experience?", options: ["Entry Level", "Intermediate (2-4 yrs)", "Senior (5+ yrs)", "Enterprise Architect"] },
    { q: "Desired monthly income target?", options: ["$500 - $1,500", "$1,500 - $5,000", "$5,000 - $10,000", "Scaling $10k+"] },
    { q: "Availability for new mission deployments?", options: ["Full-time (40h/wk)", "Part-time (20h/wk)", "Weekend Sprints"] },
    { q: "Primary technical stack focus?", options: ["React/Next.js", "Python/AI", "Solidity/Web3", "Figma/UI-UX"] },
    { q: "Preferred project duration?", options: ["Short Sprints", "Monthly Contracts", "Long-term Retainers"] },
    { q: "How do you handle client communications?", options: ["Real-time Chat", "Email Sync", "Video Briefings"] },
    { q: "Primary reason for joining NexusGigs?", options: ["Instant Payouts", "High-Quality Leads", "Global Networking"] },
    { q: "Preferred settlement currency?", options: ["USD (Global)", "KES (Local)", "USDT (Crypto)"] },
    { q: "Are you ready to undergo Node Verification?", options: ["Yes, immediately", "After first gig", "Tell me more"] },
  ];

  useEffect(() => {
    setMounted(true);
    if (isSignedIn) {
      const savedRole = localStorage.getItem("nexus_user_role");
      const isSurveyDone = localStorage.getItem("nexus_survey_done");

      if (user?.publicMetadata?.role) {
        setSelectedRole(user.publicMetadata.role as string);
        setStep("dashboard");
      } else if (isSurveyDone === "true" && savedRole) {
        setSelectedRole(savedRole);
        setStep("dashboard");
      } else {
        setStep("survey");
      }
    }
  }, [isSignedIn, user]);

  const handleSurveyAnswer = () => {
    if (currentQuestion < surveyQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setStep("loading");
      startLoadingBar();
    }
  };

  const startLoadingBar = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1.5;
      setLoadingProgress(Math.min(progress, 100));
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => setStep("path"), 800);
      }
    }, 40); 
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    localStorage.setItem("nexus_user_role", role);
    localStorage.setItem("nexus_survey_done", "true");
    setStep("dashboard");
  };

  if (!mounted || !isLoaded) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center text-[#00f2ff] font-black animate-pulse uppercase tracking-[0.8em] text-[10px]">Nexus Initializing...</div>
  );

  // --- 🛰️ PHASE 1: MODERN LANDING PAGE ---
  if (step === "landing" && !isSignedIn) {
    return (
      <div className="min-h-screen bg-[#020617] text-white selection:bg-[#00f2ff]/30 relative overflow-hidden">
        {/* Ambient Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="relative z-10">
          <section className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
            {/* 3D-Styled Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mb-16 animate-in fade-in slide-in-from-top-10 duration-1000">
              {[
                { l: "Global Nodes", v: "+1.2M", desc: "Active Freelancers" },
                { l: "Settlements", v: "+$2.5M", desc: "Total Payouts" },
                { l: "Missions", v: "480K+", desc: "Gigs Completed" },
                { l: "Latency", v: "0.02s", desc: "Relay Speed" }
              ].map((stat, i) => (
                <div key={i} className="p-6 bg-[#0a0f1e]/80 border border-white/10 rounded-4xl backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] group hover:border-[#00f2ff]/50 transition-all hover:-translate-y-2 cursor-default">
                  <p className="text-[8px] font-black text-gray-500 uppercase mb-2 tracking-widest italic">{stat.l}</p>
                  <h3 className="text-2xl font-black italic text-[#00f2ff] group-hover:scale-110 transition-transform">{stat.v}</h3>
                  <p className="text-[7px] text-gray-600 mt-2 font-bold uppercase">{stat.desc}</p>
                </div>
              ))}
            </div>

            <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter mb-4">NEXUS<span className="text-[#00f2ff]">GIGS</span></h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.5em] mb-12 italic">Decentralized Satellite Infrastructure for Elite Talent</p>
            
            <div className="flex flex-col md:flex-row gap-6 w-full max-w-sm">
                <SignUpButton mode="modal">
                    <button className="flex-1 py-6 bg-[#00f2ff] text-black font-black rounded-3xl uppercase text-[12px] tracking-widest hover:scale-105 transition-all shadow-2xl shadow-[#00f2ff]/20 italic">Initialize Account</button>
                </SignUpButton>
                <SignInButton mode="modal">
                    <button className="flex-1 py-6 border border-white/10 text-white font-black rounded-3xl uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all italic">Enter Hub</button>
                </SignInButton>
            </div>
          </section>

          {/* Explanation Section */}
          <section className="max-w-7xl mx-auto px-6 py-32 border-t border-white/5 bg-white/1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-8 leading-none">THE NEW <span className="text-[#00f2ff]">PROTOCOL</span> OF WORK</h2>
                <p className="text-gray-400 text-lg leading-relaxed font-medium italic">NexusGigs is not just a marketplace. It is a high-fidelity relay system that bypasses traditional banking friction. We connect top-tier node operators (freelancers) directly to enterprise tactical missions (gigs) with instant smart-settlements.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-40 bg-white/5 rounded-[40px] border border-white/10 flex items-center justify-center text-3xl italic font-black text-white/20">FAST</div>
                <div className="h-40 bg-[#00f2ff]/5 rounded-[40px] border border-[#00f2ff]/20 flex items-center justify-center text-3xl italic font-black text-[#00f2ff]/40">SECURE</div>
                <div className="h-40 bg-[#00f2ff]/5 rounded-[40px] border border-[#00f2ff]/20 flex items-center justify-center text-3xl italic font-black text-[#00f2ff]/40">ELITE</div>
                <div className="h-40 bg-white/5 rounded-[40px] border border-white/10 flex items-center justify-center text-3xl italic font-black text-white/20">GLOBAL</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  // --- 🧬 PHASE 2: PROFESSIONAL SYNC SURVEY ---
  if (step === "survey") {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6 relative">
        <div className="max-w-lg w-full bg-[#0a0f1e] border border-white/10 p-12 rounded-[50px] space-y-10 animate-in fade-in zoom-in duration-500 shadow-2xl">
          <div className="flex justify-between items-center border-b border-white/5 pb-6">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Protocol <span className="text-[#00f2ff]">Sync</span></h2>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">{currentQuestion + 1} / 10</span>
          </div>
          <p className="text-lg font-bold text-gray-200 leading-tight italic">{surveyQuestions[currentQuestion].q}</p>
          <div className="grid gap-4">
            {surveyQuestions[currentQuestion].options.map(opt => (
              <button key={opt} onClick={handleSurveyAnswer} className="w-full py-5 bg-white/2 border border-white/10 rounded-2xl text-left px-8 text-[11px] font-black uppercase hover:bg-[#00f2ff] hover:text-black transition-all italic active:scale-95 shadow-xl">
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- 🌀 PHASE 3: MODERN MATCHING BAR ---
  if (step === "loading") {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 border-4 border-[#00f2ff] border-t-transparent rounded-full animate-spin mb-12 shadow-[0_0_50px_rgba(0,242,255,0.2)]" />
        <h2 className="text-2xl font-black italic uppercase tracking-[0.3em] mb-4 text-[#00f2ff]">Matching Interests</h2>
        <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] mb-12 italic">Calibrating Node for Optimized Gig Feed</p>
        
        <div className="w-full max-w-sm h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
          <div className="h-full bg-[#00f2ff] transition-all duration-200 shadow-[0_0_20px_rgba(0,242,255,0.5)]" style={{ width: `${loadingProgress}%` }} />
        </div>
        <p className="text-[10px] font-black uppercase text-[#00f2ff] mt-6 tracking-[0.6em] animate-pulse italic">{loadingProgress}% COMPLETE</p>
      </div>
    );
  }

  // --- ⚔️ PHASE 4: PROTOCOL SELECTION ---
  if (step === "path") {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 animate-in fade-in duration-1000">
        <h2 className="text-5xl font-black italic uppercase mb-16 tracking-tighter">Choose Your <span className="text-[#00f2ff]">Protocol</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl px-6">
          <button onClick={() => handleRoleSelect('freelancer')} className="group p-16 bg-[#0a0f1e] border border-white/10 rounded-[60px] hover:border-[#00f2ff]/50 transition-all relative overflow-hidden shadow-2xl active:scale-95 text-left">
            <div className="absolute top-0 right-0 p-10 opacity-5 text-9xl font-black italic uppercase">NODE</div>
            <div className="text-5xl mb-8 group-hover:scale-110 transition-transform">💼</div>
            <h3 className="text-3xl font-black uppercase italic mb-4 group-hover:text-[#00f2ff]">Freelancer</h3>
            <p className="text-[12px] text-gray-500 font-medium uppercase tracking-wider italic leading-relaxed">Operate as a high-fidelity unit. Accept tactical missions and clear instant settlements.</p>
          </button>

          <button onClick={() => handleRoleSelect('client')} className="group p-16 bg-[#0a0f1e] border border-white/10 rounded-[60px] hover:border-[#00f2ff]/50 transition-all relative overflow-hidden shadow-2xl active:scale-95 text-left">
            <div className="absolute top-0 right-0 p-10 opacity-5 text-9xl font-black italic uppercase">SYNC</div>
            <div className="text-5xl mb-8 group-hover:scale-110 transition-transform">🎯</div>
            <h3 className="text-3xl font-black uppercase italic mb-4 group-hover:text-[#00f2ff]">Client</h3>
            <p className="text-[12px] text-gray-500 font-medium uppercase tracking-wider italic leading-relaxed">Deploy new tactical missions. Access the global talent grid and secure elite node operators.</p>
          </button>
        </div>
      </div>
    );
  }

  // --- 🖥️ PHASE 5: DASHBOARD ---
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