"use client";

import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { FreelancerView } from "@/components/dashboard/FreelancerView";
import { ClientView } from "@/components/dashboard/ClientView";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [mounted, setMounted] = useState(false);
  
  // States: landing -> path -> survey -> loading -> dashboard
  const [step, setStep] = useState<"landing" | "path" | "survey" | "loading" | "dashboard">("landing");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // 🌍 Branded Sponsor Data (Optimized for your JPGs)
  const sponsors = [
    { name: "Safaricom", logo: "/logos/safaricom.jpg" },
    { name: "Google", logo: "/logos/google.jpg" },
    { name: "Binance", logo: "/logos/binance.jpg" },
    { name: "Stripe", logo: "/logos/stripe.jpg" },
    { name: "Microsoft", logo: "/logos/microsoft.jpg" },
    { name: "Tesla", logo: "/logos/tesla.jpg" },
    { name: "Amazon", logo: "/logos/amazon.jpg" },
    { name: "Coca-Cola", logo: "/logos/cocacola.jpg" }
  ];

  const surveyQuestions = [
    { q: "Target monthly revenue bracket?", options: ["$1k-$5k", "$5k-$10k", "$20k+"] },
    { q: "Technical focus?", options: ["Software", "AI", "Design", "Cyber"] },
    { q: "Experience level?", options: ["Entry", "Mid-tier", "Elite"] },
    { q: "Work setup?", options: ["100% Remote", "Hybrid Relay"] },
    { q: "Primary vertical?", options: ["FinTech", "HealthTech", "Web3"] },
    { q: "Data security protocol?", options: ["Encrypted", "Standard"] },
    { q: "Discovery channel?", options: ["Search", "Referral", "Ad"] },
    { q: "Payout protocol?", options: ["M-Pesa", "Bank", "Crypto"] },
    { q: "Sync urgency?", options: ["Immediate", "48 Hours"] },
    { q: "Ready for node activation?", options: ["Yes", "Maybe"] },
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
      }, 40);
    }
  };

  if (!mounted || !isLoaded) return null;

  // --- 🌌 STARS BACKGROUND COMPONENT ---
  const StarsBackground = () => (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[#020617]" />
      {[...Array(50)].map((_, i) => (
        <div 
          key={i}
          className="absolute bg-white rounded-full animate-pulse"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 3}px`,
            height: `${Math.random() * 3}px`,
            opacity: Math.random(),
            animationDuration: `${Math.random() * 3 + 2}s`
          }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,242,255,0.05),transparent)]" />
    </div>
  );

  // --- 🛰️ 1. LANDING PAGE ---
  if (!isSignedIn) {
    return (
      <div className="min-h-screen text-white selection:bg-[#00f2ff]/30 overflow-x-hidden font-sans relative">
        <StarsBackground />

        <main className="relative z-10 flex flex-col items-center justify-center p-6 pt-20">
          {/* 3D Floating Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mb-16 perspective-1000">
            {[
              {l:"Active Nodes", v:"+1M"}, {l:"Vault Volume", v: "+$2M"}, {l:"Gigs", v:"480K"}, {l:"Latency", v:"0.02s"}
            ].map((s,i) => (
              <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-[40px] backdrop-blur-md shadow-2xl hover:-translate-y-4 hover:rotate-x-12 transition-all duration-500 hover:border-[#00f2ff]/30 group">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2 italic">{s.l}</p>
                <h3 className="text-3xl font-black italic tracking-tighter text-[#00f2ff]">{s.v}</h3>
              </div>
            ))}
          </div>

          <div className="text-center mb-16 space-y-6">
              <h1 className="text-7xl md:text-[11rem] font-black italic uppercase tracking-tighter leading-none animate-in fade-in slide-in-from-bottom-10 duration-1000">
                NEXUS<span className="text-transparent bg-clip-text bg-linear-to-r from-[#00f2ff] to-blue-500">GIGS</span>
              </h1>
              <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto italic font-medium tracking-wide">
                The elite protocol for decentralized tactical missions. Connecting high-fidelity nodes with enterprise infrastructure.
              </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 w-full max-w-sm mb-32">
            <SignUpButton mode="modal">
              <button className="flex-1 py-6 bg-[#00f2ff] text-black font-black rounded-full uppercase text-xs tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,242,255,0.4)] italic">Get Started</button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="flex-1 py-6 border border-white/10 text-white font-black rounded-full uppercase text-xs tracking-[0.2em] hover:bg-white/5 transition-all italic">Enter Hub</button>
            </SignInButton>
          </div>

          {/* SPONSOR GRID (Fixed JPG handling) */}
          <div className="w-full max-w-7xl border-t border-white/5 pt-20">
             <p className="text-center text-[8px] font-black text-gray-600 uppercase tracking-[1em] mb-16 italic">Global Infrastructure Nodes</p>
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-12 items-center">
                {sponsors.map((brand) => (
                  <div key={brand.name} className="flex flex-col items-center group cursor-help grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                      <div className="h-10 w-full mb-4 flex items-center justify-center overflow-hidden">
                        <img 
                          src={brand.logo} 
                          alt={brand.name} 
                          className="max-h-full w-auto object-contain brightness-150 contrast-125 mix-blend-screen"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                      </div>
                      <span className="text-[10px] font-black tracking-widest text-white/20 uppercase">{brand.name}</span>
                  </div>
                ))}
             </div>
          </div>
        </main>
      </div>
    );
  }

  // --- ⚔️ 2. 3D PATH SELECTION ---
  if (step === "path") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <StarsBackground />
        <div className="relative z-10 w-full max-w-6xl">
          <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white mb-20 text-center">
            Identify <span className="text-[#00f2ff]">Protocol</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <button onClick={() => handleRoleSelect('freelancer')} className="group relative bg-[#0a0f1e]/80 p-1 rounded-[60px] border border-white/10 hover:border-[#00f2ff]/50 transition-all hover:scale-[1.02] shadow-2xl text-left overflow-hidden">
               <div className="p-16 relative z-10">
                  <div className="w-16 h-16 bg-[#00f2ff]/10 rounded-2xl flex items-center justify-center text-4xl mb-10 group-hover:bg-[#00f2ff] group-hover:text-black transition-all">💼</div>
                  <h3 className="text-4xl font-black uppercase italic text-white mb-4 tracking-tighter">Freelancer</h3>
                  <p className="text-gray-500 text-sm italic font-bold uppercase tracking-wider">Execute missions. Clear settlements.</p>
               </div>
            </button>
            <button onClick={() => handleRoleSelect('client')} className="group relative bg-[#0a0f1e]/80 p-1 rounded-[60px] border border-white/10 hover:border-purple-500/50 transition-all hover:scale-[1.02] shadow-2xl text-left overflow-hidden">
               <div className="p-16 relative z-10">
                  <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-4xl mb-10 group-hover:bg-purple-500 transition-all">🎯</div>
                  <h3 className="text-4xl font-black uppercase italic text-white mb-4 tracking-tighter">Client</h3>
                  <p className="text-gray-500 text-sm italic font-bold uppercase tracking-wider">Hire nodes. Deploy tactics.</p>
               </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- 📋 3. SURVEY ---
  if (step === "survey") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <StarsBackground />
        <div className="max-w-md w-full bg-[#0a0f1e]/90 backdrop-blur-xl border border-white/10 p-12 rounded-[50px] space-y-10 shadow-2xl relative z-10">
          <p className="text-[10px] font-black text-[#00f2ff] uppercase tracking-[0.4em] italic">Step {currentQuestion + 1} / 10</p>
          <h2 className="text-2xl font-black italic uppercase text-white leading-tight">{surveyQuestions[currentQuestion].q}</h2>
          <div className="grid gap-4">
            {surveyQuestions[currentQuestion].options.map(opt => (
              <button key={opt} onClick={handleSurveyAnswer} className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-left px-8 text-[11px] font-black uppercase text-white hover:bg-white hover:text-black transition-all italic active:scale-95">
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- 🌀 4. LOADING BAR ---
  if (step === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <StarsBackground />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-32 h-32 border-4 border-[#00f2ff] border-t-transparent rounded-full animate-spin mb-12 shadow-[0_0_50px_rgba(0,242,255,0.2)]" />
          <h2 className="text-3xl font-black italic uppercase tracking-[0.5em] mb-12 text-[#00f2ff] animate-pulse">Matching Interests</h2>
          <div className="w-full max-w-sm h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10 shadow-inner">
            <div className="h-full bg-linear-to-r from-[#00f2ff] to-blue-600 transition-all duration-300" style={{ width: `${loadingProgress}%` }} />
          </div>
          <p className="text-[10px] font-black uppercase text-gray-500 mt-8 tracking-[0.8em] italic">{loadingProgress}% SYNCED</p>
        </div>
      </div>
    );
  }

  // --- 🖥️ 5. DASHBOARD ---
  return (
    <main className="min-h-screen">
      {selectedRole === "freelancer" ? (
        <FreelancerView jobs={[]} userMetadata={user?.publicMetadata || {}} />
      ) : (
        <ClientView jobs={[]} />
      )}
    </main>
  );
}