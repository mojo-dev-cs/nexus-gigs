"use client";

import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { FreelancerView } from "@/components/dashboard/FreelancerView";
import { ClientView } from "@/components/dashboard/ClientView";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [mounted, setMounted] = useState(false);
  
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

  // --- 🧬 THE UNIQUE REDIRECT FIX ---
  useEffect(() => {
    setMounted(true);
    
    if (isLoaded) {
      if (!isSignedIn) {
        setStep("landing");
      } else {
        // BIND STORAGE TO THE SPECIFIC USER ID
        // This ensures if you delete the account and make a new one, the keys won't match
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
        p += 5;
        setLoadingProgress(p);
        if (p >= 100) {
          clearInterval(inv);
          
          // SAVE TO STORAGE USING THE DYNAMIC USER ID KEY
          const surveyKey = `nexus_survey_done_${user?.id}`;
          const roleKey = `nexus_user_role_${user?.id}`;
          
          localStorage.setItem(surveyKey, "true");
          localStorage.setItem(roleKey, selectedRole!);
          
          setStep("dashboard");
        }
      }, 50);
    }
  };

  if (!mounted || !isLoaded || step === "checking") {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-[#00f2ff] font-black italic animate-pulse tracking-[0.5em] text-[10px] uppercase">
          Initializing Nexus Protocol...
        </div>
      </div>
    );
  }

  const Stars = () => (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-[#020617]" />
      {[...Array(30)].map((_, i) => (
        <div key={i} className="absolute bg-white rounded-full animate-pulse"
          style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, width: '2px', height: '2px', opacity: Math.random() }}
        />
      ))}
    </div>
  );

  if (step === "landing") {
    return (
      <div className="min-h-screen text-white relative font-sans overflow-x-hidden">
        <Stars />
        <main className="relative z-10 flex flex-col items-center justify-center p-6 pt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-6xl mb-16 px-4 w-full">
            {[
              {l:"Active Nodes", v:"+1.2M"}, {l:"Settlements", v: "+$2.5M"}, {l:"Tactical Gigs", v:"480K+"}, {l:"Relay Speed", v:"0.02s"}
            ].map((s,i) => (
              <div key={i} className="p-6 md:p-10 bg-white/5 border border-white/10 rounded-[40px] backdrop-blur-xl shadow-2xl hover:border-[#00f2ff]/40 transition-all">
                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-2 italic">{s.l}</p>
                <h3 className="text-2xl md:text-4xl font-black italic text-[#00f2ff]">{s.v}</h3>
              </div>
            ))}
          </div>

          <h1 className="text-6xl md:text-[10rem] font-black italic uppercase tracking-tighter leading-none mb-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            NEXUS<span className="text-[#00f2ff]">GIGS</span>
          </h1>

          <div className="flex flex-col md:flex-row gap-6 w-full max-w-sm mb-32 px-4">
            <SignUpButton mode="modal">
              <button className="flex-1 py-5 bg-[#00f2ff] text-black font-black rounded-full uppercase text-[10px] italic hover:scale-105 transition-all shadow-2xl shadow-[#00f2ff]/20">Get Started</button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="flex-1 py-5 border border-white/20 text-white font-black rounded-full uppercase text-[10px] italic hover:bg-white/5 transition-all">Sign In</button>
            </SignInButton>
          </div>

          <div className="w-full max-w-7xl border-t border-white/5 pt-20">
             <p className="text-center text-[10px] font-black text-[#00f2ff] uppercase tracking-[0.8em] mb-16 italic">Sponsored By:</p>
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 px-4 pb-20">
                {sponsors.map((brand) => (
                  <div key={brand.name} className="bg-white p-3 rounded-2xl flex items-center justify-center h-16 shadow-2xl hover:scale-110 transition-transform">
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
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
        <Stars />
        <div className="relative z-10 text-center animate-in fade-in duration-700 w-full max-w-5xl px-4">
          <h2 className="text-4xl md:text-7xl font-black italic uppercase text-white mb-20 tracking-tighter">Identify <span className="text-[#00f2ff]">Protocol</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button onClick={() => handleRoleSelect('freelancer')} className="p-12 md:p-16 bg-[#0a0f1e]/90 border border-white/10 rounded-[60px] hover:border-[#00f2ff] transition-all text-left group shadow-2xl">
              <div className="w-20 h-20 bg-[#00f2ff]/10 rounded-[30px] flex items-center justify-center text-5xl mb-10 group-hover:bg-[#00f2ff] group-hover:text-black transition-all">💼</div>
              <h3 className="text-4xl font-black uppercase italic text-white mb-4 tracking-tighter">Freelancer</h3>
              <p className="text-gray-500 text-sm italic font-bold uppercase tracking-widest leading-relaxed">Execute tactical missions. Clear settlements instantly.</p>
            </button>
            <button onClick={() => handleRoleSelect('client')} className="p-12 md:p-16 bg-[#0a0f1e]/90 border border-white/10 rounded-[60px] hover:border-purple-500 transition-all text-left group shadow-2xl">
              <div className="w-20 h-20 bg-purple-500/10 rounded-[30px] flex items-center justify-center text-5xl mb-10 group-hover:bg-purple-500 transition-all">🎯</div>
              <h3 className="text-4xl font-black uppercase italic text-white mb-4 tracking-tighter">Client</h3>
              <p className="text-gray-500 text-sm italic font-bold uppercase tracking-widest leading-relaxed">Hire elite nodes. Deploy tactical missions.</p>
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
        <div className="max-w-md w-full bg-[#0a0f1e]/95 border border-white/10 p-12 rounded-[50px] relative z-10 shadow-2xl animate-in zoom-in-95 duration-500">
          <div className="flex justify-between items-center mb-8">
             <p className="text-[10px] font-black text-[#00f2ff] uppercase italic tracking-widest">Protocol Sync: {currentQuestion + 1} / 10</p>
             <div className="w-2 h-2 bg-[#00f2ff] rounded-full animate-ping" />
          </div>
          <h2 className="text-2xl font-black italic uppercase text-white mb-10 leading-tight tracking-tight">{surveyQuestions[currentQuestion].q}</h2>
          <div className="grid gap-4">
            {surveyQuestions[currentQuestion].options.map(opt => (
              <button key={opt} onClick={handleSurveyAnswer} className="w-full py-5 bg-white/5 border border-white/10 rounded-3xl text-left px-8 text-[11px] font-black uppercase text-white hover:bg-white hover:text-black transition-all italic active:scale-95">
                {opt}
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
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-32 h-32 border-4 border-[#00f2ff] border-t-transparent rounded-full animate-spin mb-12 shadow-[0_0_60px_rgba(0,242,255,0.2)]" />
          <h2 className="text-3xl font-black italic uppercase tracking-[0.5em] mb-12 text-[#00f2ff] animate-pulse">Synchronizing Node</h2>
          <div className="w-full max-w-sm h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
            <div className="h-full bg-linear-to-r from-[#00f2ff] to-blue-600 transition-all duration-300" style={{ width: `${loadingProgress}%` }} />
          </div>
          <p className="text-[10px] font-black uppercase text-gray-500 mt-8 tracking-[0.8em] italic">{loadingProgress}% SYNCED</p>
        </div>
      </div>
    );
  }

  if (step === "dashboard") {
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

  return null;
}