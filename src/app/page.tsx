"use client";

import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { FreelancerView } from "@/components/dashboard/FreelancerView";
import { ClientView } from "@/components/dashboard/ClientView";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [mounted, setMounted] = useState(false);
  
  // Logic states: landing -> path -> survey -> loading -> dashboard
  const [step, setStep] = useState<"landing" | "path" | "survey" | "loading" | "dashboard" | "checking">("checking");
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

  useEffect(() => {
    setMounted(true);
    
    if (isLoaded) {
      if (!isSignedIn) {
        setStep("landing");
      } else {
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

  // Shield to prevent premature rendering
  if (!mounted || !isLoaded || step === "checking") {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-[#00f2ff] font-black italic animate-pulse tracking-[0.5em] text-[10px] uppercase">
          Initializing Protocol...
        </div>
      </div>
    );
  }

  // --- 🌌 STARS BACKGROUND ---
  const Stars = () => (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-[#020617]" />
      {[...Array(40)].map((_, i) => (
        <div key={i} className="absolute bg-white rounded-full animate-pulse"
          style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, width: '2px', height: '2px', opacity: Math.random() }}
        />
      ))}
    </div>
  );

  // --- 1. LANDING ---
  if (step === "landing") {
    return (
      <div className="min-h-screen text-white relative font-sans">
        <Stars />
        <main className="relative z-10 flex flex-col items-center justify-center p-6 pt-20">
          <h1 className="text-6xl md:text-[9rem] font-black italic uppercase tracking-tighter mb-12">
            NEXUS<span className="text-[#00f2ff]">GIGS</span>
          </h1>
          <div className="flex flex-col md:flex-row gap-6 w-full max-w-sm mb-32">
            <SignUpButton mode="modal">
              <button className="flex-1 py-5 bg-[#00f2ff] text-black font-black rounded-full uppercase text-[10px] italic">Get Started</button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="flex-1 py-5 border border-white/20 text-white font-black rounded-full uppercase text-[10px] italic">Sign In</button>
            </SignInButton>
          </div>
          <div className="w-full max-w-6xl border-t border-white/5 pt-20">
             <p className="text-center text-[10px] font-black text-[#00f2ff] uppercase tracking-[0.8em] mb-16 italic">Sponsored By:</p>
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 px-4">
                {sponsors.map((brand) => (
                  <div key={brand.name} className="bg-white p-4 rounded-2xl flex items-center justify-center h-16 shadow-2xl">
                    <img src={brand.logo} alt={brand.name} className="max-h-full object-contain" />
                  </div>
                ))}
             </div>
          </div>
        </main>
      </div>
    );
  }

  // --- 2. PATH SELECTION ---
  if (step === "path") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
        <Stars />
        <div className="relative z-10 text-center">
          <h2 className="text-5xl font-black italic uppercase text-white mb-16">Identify <span className="text-[#00f2ff]">Protocol</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            <button onClick={() => handleRoleSelect('freelancer')} className="p-12 bg-[#0a0f1e] border border-white/10 rounded-[50px] hover:border-[#00f2ff] transition-all text-left">
              <h3 className="text-3xl font-black uppercase italic text-white mb-2">Freelancer</h3>
              <p className="text-gray-500 text-xs italic font-bold">Accept missions. Get paid.</p>
            </button>
            <button onClick={() => handleRoleSelect('client')} className="p-12 bg-[#0a0f1e] border border-white/10 rounded-[50px] hover:border-purple-500 transition-all text-left">
              <h3 className="text-3xl font-black uppercase italic text-white mb-2">Client</h3>
              <p className="text-gray-500 text-xs italic font-bold">Hire nodes. Deploy missions.</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- 3. SURVEY ---
  if (step === "survey") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative">
        <Stars />
        <div className="max-w-md w-full bg-[#0a0f1e] border border-white/10 p-10 rounded-[40px] relative z-10">
          <p className="text-[9px] font-black text-[#00f2ff] uppercase italic mb-6 tracking-widest">Question {currentQuestion + 1} / 10</p>
          <h2 className="text-xl font-black italic uppercase text-white mb-8">{surveyQuestions[currentQuestion].q}</h2>
          <div className="grid gap-3">
            {surveyQuestions[currentQuestion].options.map(opt => (
              <button key={opt} onClick={handleSurveyAnswer} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-left px-6 text-[10px] font-black uppercase text-white hover:bg-white hover:text-black transition-all italic">{opt}</button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- 4. LOADING ---
  if (step === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
        <Stars />
        <h2 className="text-2xl font-black italic uppercase text-[#00f2ff] mb-8 animate-pulse tracking-widest">Syncing Node...</h2>
        <div className="w-full max-h-1 max-w-sm bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-[#00f2ff] transition-all" style={{ width: `${loadingProgress}%` }} />
        </div>
      </div>
    );
  }

  // --- 5. DASHBOARD (CRITICAL: Only renders when step is dashboard) ---
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