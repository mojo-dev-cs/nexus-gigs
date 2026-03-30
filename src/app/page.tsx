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

  // 🌍 Branded Sponsor Data (Using your local SVGs)
  const sponsors = [
    { name: "Safaricom", logo: "/logos/safaricom.svg" },
    { name: "Google", logo: "/logos/google.svg" },
    { name: "Binance", logo: "/logos/binance.svg" },
    { name: "Stripe", logo: "/logos/stripe.svg" },
    { name: "Microsoft", logo: "/logos/microsoft.svg" },
    { name: "Tesla", logo: "/logos/tesla.svg" },
    { name: "Amazon", logo: "/logos/amazon.svg" },
    { name: "Coca-Cola", logo: "/logos/cocacola.svg" }
  ];

  const surveyQuestions = [
    { q: "Target monthly revenue?", options: ["$1k-$5k", "$5k-$10k", "$20k+"] },
    { q: "Technical expertise?", options: ["Software", "AI", "Design", "Cyber"] },
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
      }, 30);
    }
  };

  if (!mounted || !isLoaded) return null;

  // --- 🛰️ PHASE 1: 4K 3D LANDING ---
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-[#020617] text-white selection:bg-[#00f2ff]/30 overflow-x-hidden font-sans">
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-20%,#1e293b,transparent)]" />
        <main className="relative z-10">
          <section className="min-h-screen flex flex-col items-center justify-center p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mb-16">
              {[{l:"Active Nodes", v:"+1.2M"}, {l:"Vault Volume", v:"+$2.5M"}, {l:"Missions", v:"480K+"}, {l:"Latency", v:"0.02s"}].map((s,i) => (
                <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-[35px] backdrop-blur-3xl shadow-2xl hover:-translate-y-2 transition-all">
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2 italic">{s.l}</p>
                  <h3 className="text-3xl font-black italic tracking-tighter text-[#00f2ff]">{s.v}</h3>
                </div>
              ))}
            </div>

            <div className="text-center mb-16">
                <h1 className="text-7xl md:text-[10rem] font-black italic uppercase tracking-tighter leading-none mb-4">NEXUS<span className="text-[#00f2ff]">GIGS</span></h1>
                <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto italic font-medium">The high-fidelity protocol for decentralized tactical missions.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 w-full max-w-sm">
              <SignUpButton mode="modal"><button className="flex-1 py-6 bg-white text-black font-black rounded-3xl uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl italic">Get Started</button></SignUpButton>
              <SignInButton mode="modal"><button className="flex-1 py-6 border border-white/10 text-white font-black rounded-3xl uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all italic">Enter Matrix</button></SignInButton>
            </div>

            <div className="mt-32 w-full max-w-7xl px-4 border-t border-white/5 pt-16">
               <p className="text-center text-[8px] font-black text-gray-600 uppercase tracking-[0.8em] mb-16 italic">Infrastructure Trusted By</p>
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-12 items-center">
                  {sponsors.map((brand) => (
                    <div key={brand.name} className="flex flex-col items-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                        <img src={brand.logo} alt={brand.name} className="h-8 w-auto object-contain mb-3" />
                        <span className="text-[10px] font-black tracking-tighter text-white/30 italic">{brand.name.toUpperCase()}</span>
                    </div>
                  ))}
               </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // --- 🧬 PHASE 2: 3D PATH SELECTION ---
  if (step === "path") {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 animate-in fade-in duration-1000">
        <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-24 underline decoration-[#00f2ff] underline-offset-20">Identify <span className="text-[#00f2ff]">Protocol</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-6xl">
          <button onClick={() => handleRoleSelect('freelancer')} className="group bg-[#0a0f1e] p-16 rounded-[60px] border border-white/10 hover:border-[#00f2ff]/50 transition-all hover:scale-[1.02] shadow-2xl text-left relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-5 text-9xl font-black italic uppercase">NODE</div>
             <div className="w-16 h-16 bg-[#00f2ff]/10 rounded-2xl flex items-center justify-center text-4xl mb-10 group-hover:bg-[#00f2ff] group-hover:text-black transition-all">💼</div>
             <h3 className="text-4xl font-black uppercase italic mb-4">Freelancer</h3>
             <p className="text-gray-500 text-sm leading-relaxed italic uppercase font-bold tracking-wider">Accept tactical missions and clear instant settlements.</p>
          </button>
          <button onClick={() => handleRoleSelect('client')} className="group bg-[#0a0f1e] p-16 rounded-[60px] border border-white/10 hover:border-purple-500/50 transition-all hover:scale-[1.02] shadow-2xl text-left relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-5 text-9xl font-black italic uppercase">UPLINK</div>
             <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-4xl mb-10 group-hover:bg-purple-500 group-hover:text-white transition-all">🎯</div>
             <h3 className="text-4xl font-black uppercase italic mb-4">Client</h3>
             <p className="text-gray-500 text-sm leading-relaxed italic uppercase font-bold tracking-wider">Hire nodes and deploy high-fidelity enterprise missions.</p>
          </button>
        </div>
      </div>
    );
  }

  // --- 📋 PHASE 3: SURVEY & 🌀 PHASE 4: LOADING (Combined Logic) ---
  if (step === "survey") {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0a0f1e] border border-white/10 p-12 rounded-[50px] space-y-10 shadow-2xl relative">
          <p className="text-[10px] font-black text-[#00f2ff] uppercase italic tracking-[0.4em]">Protocol Sync: {currentQuestion + 1} / 10</p>
          <h2 className="text-2xl font-black italic uppercase leading-tight">{surveyQuestions[currentQuestion].q}</h2>
          <div className="grid gap-4">
            {surveyQuestions[currentQuestion].options.map(opt => (
              <button key={opt} onClick={handleSurveyAnswer} className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-left px-8 text-[11px] font-black uppercase hover:bg-white hover:text-black transition-all italic active:scale-95 group">
                <span className="opacity-0 group-hover:opacity-100 mr-2">»</span> {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === "loading") {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6">
        <h2 className="text-3xl font-black italic uppercase tracking-[0.5em] mb-12 text-[#00f2ff] animate-pulse">Matching Interests</h2>
        <div className="w-full max-w-sm h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
          <div className="h-full bg-linear-to-r from-[#00f2ff] to-blue-600 shadow-[0_0_30px_rgba(0,242,255,0.7)] transition-all duration-300" style={{ width: `${loadingProgress}%` }} />
        </div>
        <p className="text-[10px] font-black uppercase text-gray-500 mt-8 tracking-[0.8em] italic">{loadingProgress}% SYNCED</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#020617]">
      {selectedRole === "freelancer" ? <FreelancerView jobs={[]} userMetadata={user?.publicMetadata || {}} /> : <ClientView jobs={[]} />}
    </main>
  );
}