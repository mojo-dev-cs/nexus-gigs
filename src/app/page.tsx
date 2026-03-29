"use client";

import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { FreelancerView } from "@/components/dashboard/FreelancerView";
import { ClientView } from "@/components/dashboard/ClientView";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [mounted, setMounted] = useState(false);
  
  // Flow State Machine
  const [step, setStep] = useState<"landing" | "survey" | "loading" | "path" | "dashboard">("landing");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // 📋 10-Question Professional Sync Survey
  const surveyQuestions = [
    { q: "What is your primary technical focus?", options: ["Software Architecture", "AI & Machine Learning", "Web3/Blockchain", "UI/UX Strategy"] },
    { q: "Target monthly revenue bracket?", options: ["$1k - $3k", "$3k - $7k", "$7k - $15k", "Scaling $20k+"] },
    { q: "Operational commitment level?", options: ["Deep Integration (Full-time)", "Tactical Support (Part-time)", "Freelance Contracts"] },
    { q: "Preferred work environment?", options: ["100% Remote Relay", "Hybrid Sync", "On-site Deployment"] },
    { q: "Experience in decentralised ops?", options: ["Native Expert", "Intermediate Knowledge", "Entry Level", "None"] },
    { q: "Primary industry vertical?", options: ["FinTech", "HealthTech", "E-commerce", "CyberSecurity"] },
    { q: "How do you handle secure data?", options: ["End-to-End Encryption", "Cloud Vaults", "Hardware Wallets", "Standard Protocols"] },
    { q: "Primary discovery channel?", options: ["Direct Referral", "Social Relay", "Platform Ad", "Search Sync"] },
    { q: "Preferred Payout Protocol?", options: ["Direct Bank Transfer", "M-Pesa Instant", "Crypto (USDT/BTC)"] },
    { q: "Node readiness status?", options: ["Ready for Uplink", "Phase 1 Testing", "Exploring Network"] },
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
      progress += 2;
      setLoadingProgress(Math.min(progress, 100));
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => setStep("path"), 800);
      }
    }, 50); 
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    localStorage.setItem("nexus_user_role", role);
    localStorage.setItem("nexus_survey_done", "true");
    setStep("dashboard");
  };

  if (!mounted || !isLoaded) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-[#00f2ff] font-black animate-pulse uppercase tracking-[1em] text-[10px] italic">Nexus Initializing...</div>
    </div>
  );

  // --- 🛰️ 1. MODERN LANDING PAGE (3D Stats & Sponsors) ---
  if (step === "landing" && !isSignedIn) {
    return (
      <div className="min-h-screen bg-[#020617] text-white selection:bg-[#00f2ff]/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <main className="relative z-10">
          <section className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
            {/* 3D-Styled Floating Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mb-20 animate-in fade-in slide-in-from-top-12 duration-1000">
              {[
                { l: "Global Nodes", v: "+1.2M", d: "Verified Operators" },
                { l: "Vault Volume", v: "+$2.5M", d: "Instant Settlements" },
                { l: "Mission Success", v: "480K+", d: "Gigs Completed" },
                { l: "Sync Latency", v: "0.02s", d: "Real-time Uplink" }
              ].map((s, i) => (
                <div key={i} className="p-8 bg-[#0a0f1e]/60 border border-white/10 rounded-[40px] backdrop-blur-xl shadow-2xl hover:border-[#00f2ff]/40 transition-all hover:-translate-y-2 group cursor-none">
                  <p className="text-[8px] font-black text-gray-500 uppercase mb-2 tracking-widest italic">{s.l}</p>
                  <h3 className="text-3xl font-black italic text-[#00f2ff] group-hover:scale-110 transition-transform">{s.v}</h3>
                  <p className="text-[7px] text-gray-600 mt-2 font-bold uppercase italic tracking-tighter">{s.d}</p>
                </div>
              ))}
            </div>

            <h1 className="text-7xl md:text-[10rem] font-black italic uppercase tracking-tighter mb-4 leading-none">NEXUS<span className="text-[#00f2ff]">GIGS</span></h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.6em] mb-12 italic">The Decentralized Operating System for Talent</p>
            
            <div className="flex flex-col md:flex-row gap-6 w-full max-w-sm">
                <SignUpButton mode="modal">
                    <button className="flex-1 py-6 bg-[#00f2ff] text-black font-black rounded-3xl uppercase text-[12px] tracking-widest hover:scale-105 transition-all shadow-2xl shadow-[#00f2ff]/30 italic">Initialize Account</button>
                </SignUpButton>
                <SignInButton mode="modal">
                    <button className="flex-1 py-6 border border-white/10 text-white font-black rounded-3xl uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all italic">Enter Matrix</button>
                </SignInButton>
            </div>
          </section>

          {/* --- 🌍 SPONSOR BRAND RELAY (High Fidelity) --- */}
          <section className="w-full py-24 border-y border-white/5 bg-white/1 backdrop-blur-3xl overflow-hidden">
            <p className="text-center text-[9px] font-black text-gray-600 uppercase tracking-[0.7em] mb-16 italic animate-pulse">Infrastructure Trusted By</p>
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-12 items-center grayscale opacity-40 hover:opacity-100 transition-all duration-1000">
                    {["COCA-COLA", "SAFARICOM", "GOOGLE", "BINANCE", "STRIPE", "MICROSOFT", "AMAZON", "TESLA"].map((brand) => (
                        <div key={brand} className="flex flex-col items-center group cursor-help">
                            <span className="text-[15px] font-black italic tracking-tighter text-white group-hover:text-[#00f2ff] transition-colors">{brand}</span>
                            <div className="w-5 h-0.5 bg-white/10 group-hover:bg-[#00f2ff] group-hover:w-10 mt-1 transition-all" />
                        </div>
                    ))}
                </div>
            </div>
          </section>

          {/* Explanation Layer */}
          <section className="max-w-7xl mx-auto px-6 py-40">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div className="space-y-8">
                <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-[0.9]">THE FUTURE <br/><span className="text-[#00f2ff]">OF BEYOND</span></h2>
                <p className="text-gray-400 text-xl leading-relaxed font-medium italic max-w-xl">NexusGigs removes the middleman from the equation. We provide the satellite infrastructure to connect high-fidelity talent to global enterprise missions with instant financial clearance.</p>
              </div>
              <div className="relative">
                 <div className="absolute -inset-4 bg-[#00f2ff]/10 blur-3xl rounded-full" />
                 <div className="relative bg-white/5 border border-white/10 p-12 rounded-[60px] backdrop-blur-2xl">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00f2ff] mb-6">System Protocol</p>
                    <ul className="space-y-6">
                        {['Bypass banking delays', 'Direct node-to-client relay', 'Global settlement matrix', 'High-fidelity mission logs'].map(li => (
                            <li key={li} className="flex items-center gap-4 text-white font-black italic uppercase text-sm tracking-tighter">
                                <span className="text-[#00f2ff]">✓</span> {li}
                            </li>
                        ))}
                    </ul>
                 </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // --- 🧬 2. PROTOCOL SYNC (The 10-Question Survey) ---
  if (step === "survey") {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6 relative">
        <div className="max-w-lg w-full bg-[#0a0f1e] border border-white/10 p-12 rounded-[50px] space-y-10 animate-in fade-in zoom-in duration-500 shadow-2xl">
          <header className="flex justify-between items-center border-b border-white/5 pb-6">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter underline decoration-[#00f2ff]/30 underline-offset-8">Protocol <span className="text-[#00f2ff]">Sync</span></h2>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">{currentQuestion + 1} / 10</span>
          </header>
          <div className="space-y-2">
            <p className="text-[9px] font-black text-[#00f2ff] uppercase tracking-widest italic opacity-50">Transmitting Query...</p>
            <p className="text-xl font-black italic text-gray-200 leading-tight tracking-tight">{surveyQuestions[currentQuestion].q}</p>
          </div>
          <div className="grid gap-4">
            {surveyQuestions[currentQuestion].options.map(opt => (
              <button key={opt} onClick={handleSurveyAnswer} className="w-full py-5 bg-white/2 border border-white/10 rounded-2xl text-left px-8 text-[11px] font-black uppercase hover:bg-[#00f2ff] hover:text-black transition-all italic active:scale-95 shadow-xl group">
                <span className="text-[#00f2ff] opacity-0 group-hover:opacity-100 mr-2 transition-opacity">{">"}{">"}</span> {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- 🌀 3. SYSTEM MATCHING (Modern Loading Bar) ---
  if (step === "loading") {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6">
        <div className="relative mb-16">
            <div className="w-32 h-32 border-4 border-[#00f2ff]/10 rounded-full animate-ping absolute inset-0" />
            <div className="w-32 h-32 border-2 border-dashed border-[#00f2ff]/40 rounded-full animate-spin absolute inset-0" />
            <div className="w-32 h-32 border-4 border-[#00f2ff] rounded-full flex items-center justify-center text-2xl animate-pulse bg-[#00f2ff]/5">🛰️</div>
        </div>
        <h2 className="text-3xl font-black italic uppercase tracking-[0.4em] mb-4 text-[#00f2ff]">Matching Interests</h2>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] mb-12 italic">Optimizing Node Synchronization</p>
        
        <div className="w-full max-w-sm h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10 shadow-inner">
          <div className="h-full bg-linear-to-r from-[#00f2ff] to-blue-600 transition-all duration-300 shadow-[0_0_30px_rgba(0,242,255,0.6)]" style={{ width: `${loadingProgress}%` }} />
        </div>
        <p className="text-[10px] font-black uppercase text-[#00f2ff] mt-8 tracking-[0.8em] animate-pulse italic">{loadingProgress}% SYNCED</p>
      </div>
    );
  }

  // --- ⚔️ 4. PATH SELECTION ---
  if (step === "path") {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 animate-in fade-in duration-1000">
        <div className="text-center mb-20 space-y-4">
            <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter">Choose Your <span className="text-[#00f2ff]">Protocol</span></h2>
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.6em] italic">Identity definition required for mission access</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl px-6">
          <button onClick={() => handleRoleSelect('freelancer')} className="group p-16 bg-[#0a0f1e] border border-white/10 rounded-[60px] hover:border-[#00f2ff]/50 transition-all relative overflow-hidden shadow-2xl active:scale-95 text-left">
            <div className="absolute top-0 right-0 p-10 opacity-5 text-9xl font-black italic uppercase">NODE</div>
            <div className="text-6xl mb-10 group-hover:scale-110 transition-transform">💼</div>
            <h3 className="text-4xl font-black uppercase italic mb-4 group-hover:text-[#00f2ff]">Freelancer</h3>
            <p className="text-[13px] text-gray-500 font-medium uppercase tracking-wider italic leading-relaxed">Operate as a high-fidelity unit. Accept enterprise missions, clear tactical transactions, and build your node reputation.</p>
          </button>

          <button onClick={() => handleRoleSelect('client')} className="group p-16 bg-[#0a0f1e] border border-white/10 rounded-[60px] hover:border-[#00f2ff]/50 transition-all relative overflow-hidden shadow-2xl active:scale-95 text-left">
            <div className="absolute top-0 right-0 p-10 opacity-5 text-9xl font-black italic uppercase">UPLINK</div>
            <div className="text-6xl mb-10 group-hover:scale-110 transition-transform">🎯</div>
            <h3 className="text-4xl font-black uppercase italic mb-4 group-hover:text-[#00f2ff]">Client</h3>
            <p className="text-[13px] text-gray-500 font-medium uppercase tracking-wider italic leading-relaxed">Deploy secure missions. Access the global node network and acquire elite operators for strategic infrastructure projects.</p>
          </button>
        </div>
      </div>
    );
  }

  // --- 🖥️ 5. DASHBOARD ROUTING ---
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