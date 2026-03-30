"use client";

import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { FreelancerView } from "@/components/dashboard/FreelancerView";
import { ClientView } from "@/components/dashboard/ClientView";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<"landing" | "path" | "survey" | "loading" | "dashboard">("landing");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const surveyQuestions = [
    { q: "Target monthly revenue?", options: ["$1k-$5k", "$5k-$10k", "$20k+"] },
    { q: "Operational focus?", options: ["Software", "AI", "Design", "Cyber"] },
    { q: "Experience level?", options: ["Entry", "Mid-tier", "Elite"] },
    { q: "Work setup?", options: ["100% Remote", "Hybrid Relay"] },
    { q: "Primary vertical?", options: ["FinTech", "HealthTech", "Web3"] },
    { q: "Security protocol?", options: ["Encrypted", "Standard"] },
    { q: "Discovery channel?", options: ["Search", "Referral", "Ad"] },
    { q: "Payout protocol?", options: ["M-Pesa", "Bank", "Crypto"] },
    { q: "Sync urgency?", options: ["Immediate", "48 Hours"] },
    { q: "Ready for uplink?", options: ["Yes", "Maybe"] },
  ];

  useEffect(() => {
    setMounted(true);
    if (isSignedIn && isLoaded) {
      const metaRole = user?.publicMetadata?.role as string;
      const savedRole = localStorage.getItem("nexus_user_role");
      const isSurveyDone = localStorage.getItem("nexus_survey_done");

      if (metaRole || (isSurveyDone === "true" && savedRole)) {
        setSelectedRole(metaRole || savedRole);
        setStep("dashboard");
      } else {
        setStep("path");
      }
    }
  }, [isSignedIn, isLoaded, user]);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setStep("survey");
  };

  const handleSurveyAnswer = () => {
    if (currentQuestion < surveyQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setStep("loading");
      let p = 0;
      const inv = setInterval(() => {
        p += 2;
        setLoadingProgress(p);
        if (p >= 100) {
          clearInterval(inv);
          localStorage.setItem("nexus_survey_done", "true");
          localStorage.setItem("nexus_user_role", selectedRole!);
          setStep("dashboard");
        }
      }, 30);
    }
  };

  if (!mounted || !isLoaded) return null;

  // --- 🛰️ 1. 4K 3D LANDING PAGE ---
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-[#020617] text-white selection:bg-[#00f2ff]/30 overflow-x-hidden font-sans">
        {/* Animated Background Overlay */}
        <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#1e293b,transparent)]" />

        <main className="relative z-10">
          <section className="min-h-screen flex flex-col items-center justify-center p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mb-20 perspective-1000">
              {[
                {l:"Active Nodes", v:"+1.2M", c:"text-[#00f2ff]"},
                {l:"Vault Transacted", v:"+$2.5M", c:"text-emerald-400"},
                {l:"Missions Done", v:"480K+", c:"text-purple-400"},
                {l:"Relay Latency", v:"0.02s", c:"text-red-400"}
              ].map((s,i) => (
                <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-[40px] backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform hover:rotate-x-12 hover:rotate-y-12 transition-all duration-500 hover:border-white/20 group">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2 italic">{s.l}</p>
                  <h3 className={`text-3xl font-black italic tracking-tighter ${s.c}`}>{s.v}</h3>
                </div>
              ))}
            </div>

            <div className="text-center space-y-4 mb-12">
                <h1 className="text-8xl md:text-[12rem] font-black italic uppercase tracking-tighter leading-none">NEXUS<span className="text-transparent bg-clip-text bg-linear-to-b from-[#00f2ff] to-blue-600">GIGS</span></h1>
                <p className="text-[12px] font-bold text-gray-500 uppercase tracking-[0.8em] italic">Decentralized High-Fidelity Infrastructure</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 w-full max-w-md">
              <SignUpButton mode="modal">
                <button className="flex-1 py-6 bg-white text-black font-black rounded-[30px] uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] italic">Initialize Node</button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button className="flex-1 py-6 border border-white/10 text-white font-black rounded-[30px] uppercase text-xs tracking-widest hover:bg-white/5 transition-all italic">Enter Matrix</button>
              </SignInButton>
            </div>

            <div className="mt-32 w-full max-w-7xl">
               <p className="text-center text-[9px] font-black text-gray-600 uppercase tracking-[1em] mb-12 italic">Satellite Partnerships</p>
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center grayscale opacity-30 hover:opacity-100 transition-all duration-1000">
                  {["COCA-COLA", "SAFARICOM", "GOOGLE", "BINANCE", "STRIPE", "MICROSOFT", "AMAZON", "TESLA"].map(b => (
                    <span key={b} className="text-[13px] font-black italic tracking-tighter text-center hover:text-[#00f2ff] cursor-crosshair transition-colors">{b}</span>
                  ))}
               </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // --- 🧬 2. 4K CLASSY PATH SELECTION ---
  if (step === "path") {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 animate-in fade-in duration-1000">
        <div className="text-center mb-20 space-y-2">
            <h2 className="text-6xl font-black italic uppercase tracking-tighter">Define <span className="text-[#00f2ff]">Protocol</span></h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.5em]">Identity requirement for network access</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-6xl">
          <button onClick={() => handleRoleSelect('freelancer')} className="group relative p-1 bg-linear-to-br from-white/10 to-transparent rounded-[60px] overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-2xl">
            <div className="bg-[#0a0f1e] p-16 rounded-[59px] h-full flex flex-col items-start text-left relative z-10">
               <div className="absolute top-0 right-0 p-12 opacity-5 text-9xl font-black italic uppercase">NODE</div>
               <div className="w-16 h-16 bg-[#00f2ff]/10 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:bg-[#00f2ff] group-hover:text-black transition-all">💼</div>
               <h3 className="text-4xl font-black uppercase italic mb-4">Freelancer</h3>
               <p className="text-gray-500 text-sm leading-relaxed italic uppercase tracking-wider">Execute enterprise missions. Clear instant smart-settlements. Build node reputation.</p>
            </div>
          </button>

          <button onClick={() => handleRoleSelect('client')} className="group relative p-1 bg-linear-to-br from-[#00f2ff]/20 to-transparent rounded-[60px] overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-2xl">
            <div className="bg-[#0a0f1e] p-16 rounded-[59px] h-full flex flex-col items-start text-left relative z-10">
               <div className="absolute top-0 right-0 p-12 opacity-5 text-9xl font-black italic uppercase">SYNC</div>
               <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:bg-purple-500 transition-all">🎯</div>
               <h3 className="text-4xl font-black uppercase italic mb-4">Client</h3>
               <p className="text-gray-500 text-sm leading-relaxed italic uppercase tracking-wider">Deploy tactical missions. Acquire high-fidelity nodes. Manage operational infrastructure.</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // --- 📋 3. SURVEY ---
  if (step === "survey") {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0a0f1e] border border-white/10 p-12 rounded-[50px] space-y-10 shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#00f2ff]/20" />
          <p className="text-[10px] font-black text-[#00f2ff] uppercase italic tracking-[0.4em]">Protocol Sync: {currentQuestion + 1} of 10</p>
          <h2 className="text-2xl font-black italic uppercase leading-none tracking-tight">{surveyQuestions[currentQuestion].q}</h2>
          <div className="grid gap-4">
            {surveyQuestions[currentQuestion].options.map(opt => (
              <button key={opt} onClick={handleSurveyAnswer} className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-left px-8 text-[11px] font-black uppercase hover:bg-white hover:text-black transition-all italic active:scale-95">
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- 🌀 4. LOADING ---
  if (step === "loading") {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6">
        <div className="relative mb-12">
            <div className="w-32 h-32 border-4 border-[#00f2ff]/10 rounded-full animate-ping absolute inset-0" />
            <div className="w-32 h-32 border-4 border-[#00f2ff] rounded-full flex items-center justify-center text-2xl font-black italic bg-[#00f2ff]/5">🛰️</div>
        </div>
        <h2 className="text-3xl font-black italic uppercase tracking-[0.5em] mb-8 text-[#00f2ff] animate-pulse text-center">Matching Interests</h2>
        <div className="w-full max-w-sm h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
          <div className="h-full bg-linear-to-r from-[#00f2ff] to-blue-600 shadow-[0_0_20px_rgba(0,242,255,0.5)] transition-all duration-300" style={{ width: `${loadingProgress}%` }} />
        </div>
        <p className="text-[10px] font-black uppercase text-gray-600 mt-6 tracking-[0.8em] italic">{loadingProgress}% COMPLETE</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#020617]">
      {selectedRole === "freelancer" ? <FreelancerView jobs={[]} userMetadata={user?.publicMetadata || {}} /> : <ClientView jobs={[]} />}
    </main>
  );
}