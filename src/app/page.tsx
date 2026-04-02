"use client";

import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useEffect, useState, useCallback } from "react";
import { FreelancerView } from "@/components/dashboard/FreelancerView";
import { ClientView } from "@/components/dashboard/ClientView";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [mounted, setMounted] = useState(false);
  
  // Checking is the initial state to prevent flickering
  const [step, setStep] = useState<"checking" | "landing" | "path" | "survey" | "loading" | "dashboard">("checking");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);

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

  // --- 🧬 BULLETPROOF REDIRECT & SYNC LOGIC ---
  useEffect(() => {
    setMounted(true);
    
    if (isLoaded) {
      if (!isSignedIn) {
        setStep("landing");
      } else if (user?.id) {
        // We only proceed if user.id is physically present to prevent crashes
        const surveyKey = `nexus_survey_done_${user.id}`;
        const roleKey = `nexus_user_role_${user.id}`;
        
        const metaRole = user?.publicMetadata?.role as string;
        const savedRole = localStorage.getItem(roleKey);
        const isSurveyDone = localStorage.getItem(surveyKey);

        if (metaRole || (isSurveyDone === "true" && savedRole)) {
          setSelectedRole(metaRole || savedRole);
          setStep("dashboard");
        } else {
          setStep("path");
        }
      }
    }
  }, [isSignedIn, isLoaded, user?.id, user?.publicMetadata?.role]);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setStep("survey");
  };

  const handleSurveyAnswer = useCallback(() => {
    if (currentQuestion < surveyQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setStep("loading");
      let p = 0;
      const inv = setInterval(() => {
        p += 2; // Slower, smoother progress
        setLoadingProgress(p);
        if (p >= 100) {
          clearInterval(inv);
          
          if (user?.id) {
            const surveyKey = `nexus_survey_done_${user.id}`;
            const roleKey = `nexus_user_role_${user.id}`;
            localStorage.setItem(surveyKey, "true");
            localStorage.setItem(roleKey, selectedRole!);
          }
          
          setStep("dashboard");
        }
      }, 30);
    }
  }, [currentQuestion, selectedRole, user?.id, surveyQuestions.length]);

  // Prevent SSR flickering
  if (!mounted || !isLoaded || step === "checking") {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-2 border-[#00f2ff] border-t-transparent rounded-full animate-spin" />
        <div className="text-[#00f2ff] font-black italic animate-pulse tracking-[0.5em] text-[10px] uppercase">
          Initializing Nexus Protocol...
        </div>
      </div>
    );
  }

  const Stars = () => (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-[#020617]" />
      {[...Array(40)].map((_, i) => (
        <div key={i} className="absolute bg-white rounded-full animate-pulse"
          style={{ 
            top: `${Math.random() * 100}%`, 
            left: `${Math.random() * 100}%`, 
            width: Math.random() * 3 + 'px', 
            height: Math.random() * 3 + 'px', 
            opacity: Math.random(),
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}
    </div>
  );

  if (step === "landing") {
    return (
      <div className="min-h-screen text-white relative font-sans overflow-x-hidden selection:bg-[#00f2ff]/30">
        <Stars />
        <main className="relative z-10 flex flex-col items-center justify-center p-6 pt-10 md:pt-20">
          
          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 max-w-6xl mb-16 px-4 w-full animate-in fade-in zoom-in-95 duration-700">
            {[
              {l:"Active Nodes", v:"+1.2M"}, {l:"Settlements", v: "+$2.5M"}, {l:"Tactical Gigs", v:"480K+"}, {l:"Relay Speed", v:"0.02s"}
            ].map((s,i) => (
              <div key={i} className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-[35px] backdrop-blur-xl shadow-2xl hover:border-[#00f2ff]/40 transition-all group">
                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-2 italic group-hover:text-[#00f2ff] transition-colors">{s.l}</p>
                <h3 className="text-2xl md:text-3xl font-black italic text-white group-hover:text-[#00f2ff] transition-colors">{s.v}</h3>
              </div>
            ))}
          </div>

          <div className="text-center space-y-6 mb-16">
            <h1 className="text-5xl md:text-[9rem] font-black italic uppercase tracking-tighter leading-[0.8] animate-in slide-in-from-top-10 duration-1000">
              NEXUS<span className="text-[#00f2ff] drop-shadow-[0_0_30px_rgba(0,242,255,0.4)]">GIGS</span>
            </h1>
            <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-[0.5em] italic animate-pulse">
              Decentralized Talent Infrastructure for the Elite
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 w-full max-w-md mb-32 px-4 animate-in fade-in slide-in-from-bottom-10 delay-300 duration-1000">
            <SignUpButton mode="modal">
              <button className="flex-1 py-5 bg-[#00f2ff] text-black font-black rounded-full uppercase text-[10px] italic hover:scale-105 transition-all shadow-2xl shadow-[#00f2ff]/30 active:scale-95">
                Initialize Entry →
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="flex-1 py-5 border border-white/10 text-white font-black rounded-full uppercase text-[10px] italic hover:bg-white/10 transition-all active:scale-95">
                Resume Session
              </button>
            </SignInButton>
          </div>

          <div className="w-full max-w-7xl border-t border-white/5 pt-20 px-4">
             <p className="text-center text-[9px] font-black text-gray-500 uppercase tracking-[1em] mb-12 italic">Verified Relay Partners</p>
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 pb-20">
                {sponsors.map((brand) => (
                  <div key={brand.name} className="bg-white/5 border border-white/5 p-4 rounded-[25px] flex items-center justify-center h-16 shadow-inner grayscale hover:grayscale-0 hover:bg-white transition-all duration-500 cursor-crosshair">
                    <img src={brand.logo} alt={brand.name} className="max-h-full object-contain" />
                  </div>
                ))}
             </div>
          </div>
        </main>
      </div>
    );
  }

  if (step === "path") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <Stars />
        <div className="relative z-10 text-center animate-in fade-in slide-in-from-bottom-5 duration-1000 w-full max-w-5xl">
          <h2 className="text-4xl md:text-7xl font-black italic uppercase text-white mb-16 tracking-tighter">
            Select <span className="text-[#00f2ff]">Node Path</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button onClick={() => handleRoleSelect('freelancer')} className="p-10 md:p-14 bg-white/2 border border-white/10 rounded-[50px] hover:border-[#00f2ff] hover:bg-[#00f2ff]/5 transition-all text-left group relative overflow-hidden">
              <div className="absolute -right-10 -top-10 text-9xl opacity-5 grayscale group-hover:grayscale-0 group-hover:opacity-20 transition-all duration-700">💼</div>
              <div className="w-16 h-16 bg-[#00f2ff]/10 rounded-[25px] flex items-center justify-center text-3xl mb-8 group-hover:bg-[#00f2ff] group-hover:text-black transition-all">💼</div>
              <h3 className="text-3xl font-black uppercase italic text-white mb-4 tracking-tighter">Freelancer</h3>
              <p className="text-gray-500 text-xs italic font-bold uppercase tracking-widest leading-relaxed">Execute mission-critical tasks. Access instant liquidity settlements.</p>
            </button>
            <button onClick={() => handleRoleSelect('client')} className="p-10 md:p-14 bg-white/2 border border-white/10 rounded-[50px] hover:border-purple-500 hover:bg-purple-500/5 transition-all text-left group relative overflow-hidden">
              <div className="absolute -right-10 -top-10 text-9xl opacity-5 grayscale group-hover:grayscale-0 group-hover:opacity-20 transition-all duration-700">🎯</div>
              <div className="w-16 h-16 bg-purple-500/10 rounded-[25px] flex items-center justify-center text-3xl mb-8 group-hover:bg-purple-500 transition-all">🎯</div>
              <h3 className="text-3xl font-black uppercase italic text-white mb-4 tracking-tighter">Client</h3>
              <p className="text-gray-500 text-xs italic font-bold uppercase tracking-widest leading-relaxed">Deploy high-priority missions. Recruit elite talent nodes.</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "survey") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative">
        <Stars />
        <div className="max-w-md w-full bg-[#0a0f1e]/90 backdrop-blur-2xl border border-white/10 p-10 rounded-[45px] relative z-10 shadow-2xl animate-in zoom-in-95 duration-500">
          <div className="flex justify-between items-center mb-10">
             <div className="space-y-1">
                <p className="text-[8px] font-black text-[#00f2ff] uppercase italic tracking-widest">Core Calibration</p>
                <p className="text-[10px] font-black text-white uppercase">Step {currentQuestion + 1} of 10</p>
             </div>
             <div className="flex gap-1">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className={`w-1 h-4 rounded-full transition-all duration-500 ${i <= currentQuestion ? 'bg-[#00f2ff] shadow-[0_0_10px_#00f2ff]' : 'bg-white/10'}`} />
                ))}
             </div>
          </div>
          <h2 className="text-xl md:text-2xl font-black italic uppercase text-white mb-10 leading-tight tracking-tight border-l-4 border-[#00f2ff] pl-6">
            {surveyQuestions[currentQuestion].q}
          </h2>
          <div className="grid gap-3">
            {surveyQuestions[currentQuestion].options.map(opt => (
              <button key={opt} onClick={handleSurveyAnswer} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-left px-8 text-[10px] font-black uppercase text-white hover:bg-white hover:text-black transition-all italic active:scale-95 group">
                <span className="opacity-0 group-hover:opacity-100 mr-2 transition-all">→</span> {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
        <Stars />
        <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
          <div className="relative mb-16">
            <div className="w-24 h-24 border-2 border-white/10 rounded-full" />
            <div className="absolute inset-0 w-24 h-24 border-t-2 border-[#00f2ff] rounded-full animate-spin shadow-[0_0_30px_rgba(0,242,255,0.2)]" />
          </div>
          <h2 className="text-2xl font-black italic uppercase tracking-[0.5em] mb-8 text-[#00f2ff] animate-pulse text-center">Synchronizing Node</h2>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden border border-white/10">
            <div className="h-full bg-linear-to-r from-[#00f2ff] to-blue-500 transition-all duration-300" style={{ width: `${loadingProgress}%` }} />
          </div>
          <div className="flex justify-between w-full mt-4">
             <p className="text-[8px] font-black uppercase text-gray-500 tracking-widest italic">Encrypted Uplink</p>
             <p className="text-[10px] font-black uppercase text-white tracking-widest italic">{loadingProgress}%</p>
          </div>
        </div>
      </div>
    );
  }

  if (step === "dashboard") {
    return (
      <main className="min-h-screen animate-in fade-in duration-1000">
        {selectedRole === "freelancer" ? (
          <FreelancerView jobs={[]} userMetadata={user?.publicMetadata || {}} />
        ) : (
          <ClientView jobs={[]} />
        )}
      </main>
    );
  }

  return null;
}