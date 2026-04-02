"use client";

import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useEffect, useState, useCallback } from "react";
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

  useEffect(() => {
    setMounted(true);
    if (isLoaded) {
      if (!isSignedIn) {
        setStep("landing");
      } else if (user?.id) {
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
        p += 2;
        setLoadingProgress(p);
        if (p >= 100) {
          clearInterval(inv);
          if (user?.id) {
            localStorage.setItem(`nexus_survey_done_${user.id}`, "true");
            localStorage.setItem(`nexus_user_role_${user.id}`, selectedRole!);
          }
          setStep("dashboard");
        }
      }, 30);
    }
  }, [currentQuestion, selectedRole, user?.id]);

  if (!mounted || !isLoaded || step === "checking") {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-2 border-[#00f2ff] border-t-transparent rounded-full animate-spin" />
        <div className="text-[#00f2ff] font-black italic animate-pulse tracking-[0.5em] text-[10px] uppercase">Syncing Nexus...</div>
      </div>
    );
  }

  const Stars = () => (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-[#020617]" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
      {[...Array(50)].map((_, i) => (
        <div key={i} className="absolute bg-white rounded-full animate-pulse"
          style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, width: '2px', height: '2px', opacity: Math.random() }}
        />
      ))}
    </div>
  );

  if (step === "landing") {
    return (
      <div className="min-h-screen text-white relative font-sans selection:bg-[#00f2ff]/30 overflow-x-hidden">
        <Stars />
        
        {/* --- 📟 4K NAV --- */}
        <nav className="relative z-50 flex justify-between items-center p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-top-5 duration-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#00f2ff] rounded-lg flex items-center justify-center font-black text-black italic text-xl shadow-[0_0_20px_#00f2ff]">N</div>
            <h1 className="text-xl font-black italic tracking-tighter uppercase hidden md:block">NEXUS<span className="text-[#00f2ff]">GIGS</span></h1>
          </div>
          <div className="flex gap-4 md:gap-8 items-center">
            <SignInButton mode="modal">
              <button className="text-[10px] font-black uppercase italic tracking-widest hover:text-[#00f2ff] transition-colors">Login</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase italic rounded-full hover:scale-105 transition-all">Get Started</button>
            </SignUpButton>
          </div>
        </nav>

        <main className="relative z-10 max-w-7xl mx-auto px-6 py-10 md:py-20">
          <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
            
            {/* --- 🚀 CONTENT --- */}
            <div className="space-y-12 animate-in slide-in-from-left-10 duration-1000">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00f2ff]/10 border border-[#00f2ff]/20 rounded-full">
                  <span className="w-2 h-2 bg-[#00f2ff] rounded-full animate-ping" />
                  <p className="text-[#00f2ff] text-[8px] font-black uppercase tracking-[0.4em] italic">Protocol Infrastructure Active</p>
                </div>
                <h2 className="text-6xl md:text-[7.5rem] font-black italic uppercase leading-[0.85] tracking-tighter">
                  Scale Your <br /> <span className="text-transparent bg-clip-text bg-linear-to-r from-[#00f2ff] via-blue-400 to-blue-600">Talent</span>
                </h2>
                <p className="text-gray-400 max-w-md text-sm md:text-base leading-relaxed font-medium italic">
                  Deploy mission-critical code and design elite interfaces with 0.02s relay latency.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <SignUpButton mode="modal">
                  <button className="px-12 py-6 bg-[#00f2ff] text-black font-black rounded-[25px] uppercase text-[12px] italic hover:scale-110 transition-all shadow-[0_20px_60px_rgba(0,242,255,0.4)]">
                    Get Started Now →
                  </button>
                </SignUpButton>
              </div>
            </div>

            {/* --- 🖼️ 3D HERO --- */}
            <div className="relative animate-in zoom-in-95 duration-1000 delay-300">
              <div className="relative z-10 rounded-[60px] overflow-hidden border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.6)] transform hover:rotate-1 transition-transform duration-700">
                <img 
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop" 
                  alt="Nexus Tech" 
                  className="w-full h-125 md:h-162.5 object-cover hover:scale-110 transition-transform duration-[3s] opacity-80"
                />
              </div>

              {/* Floating Explanation Card */}
              <div className="absolute -bottom-8 -right-4 md:-right-12 z-20 p-8 bg-[#0a0f1e]/90 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-2xl max-w-70 animate-bounce duration-[5s]">
                <p className="text-[10px] font-black text-[#00f2ff] uppercase italic mb-3 tracking-widest">Protocol Intel</p>
                <h4 className="text-lg font-black italic uppercase mb-2">Instant Payouts</h4>
                <p className="text-[9px] text-gray-500 leading-relaxed font-bold uppercase italic">Real-time M-Pesa relay ensures your tactical yield is settled in under 60 seconds.</p>
              </div>
            </div>
          </div>

          {/* --- 🤝 PARTNERS --- */}
          <section className="mt-40 pt-20 border-t border-white/5">
             <p className="text-center text-[9px] font-black text-gray-500 uppercase tracking-[1em] mb-16 italic">Verified Strategic Partners</p>
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8">
                {sponsors.map((brand) => (
                  <div key={brand.name} className="bg-white/5 p-4 rounded-3xl flex items-center justify-center h-20 grayscale hover:grayscale-0 hover:bg-white transition-all duration-500">
                    <img src={brand.logo} alt={brand.name} className="max-h-full object-contain" />
                  </div>
                ))}
             </div>
          </section>
        </main>
      </div>
    );
  }

  if (step === "path") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <Stars />
        <div className="relative z-10 text-center animate-in fade-in slide-in-from-bottom-5 duration-1000 w-full max-w-5xl">
          <h2 className="text-4xl md:text-7xl font-black italic uppercase text-white mb-16 tracking-tighter">Identify <span className="text-[#00f2ff]">Protocol</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button onClick={() => handleRoleSelect('freelancer')} className="p-10 md:p-14 bg-white/2 border border-white/10 rounded-[50px] hover:border-[#00f2ff] transition-all text-left group">
              <h3 className="text-3xl font-black uppercase italic text-white mb-4">Freelancer</h3>
              <p className="text-gray-500 text-xs italic font-bold uppercase tracking-widest leading-relaxed">Execute missions. Clear settlements instantly.</p>
            </button>
            <button onClick={() => handleRoleSelect('client')} className="p-10 md:p-14 bg-white/2 border border-white/10 rounded-[50px] hover:border-purple-500 transition-all text-left group">
              <h3 className="text-3xl font-black uppercase italic text-white mb-4">Client</h3>
              <p className="text-gray-500 text-xs italic font-bold uppercase tracking-widest leading-relaxed">Hire elite nodes. Deploy missions.</p>
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
          <h2 className="text-xl md:text-2xl font-black italic uppercase text-white mb-10 border-l-4 border-[#00f2ff] pl-6">
            {surveyQuestions[currentQuestion].q}
          </h2>
          <div className="grid gap-3">
            {surveyQuestions[currentQuestion].options.map(opt => (
              <button key={opt} onClick={handleSurveyAnswer} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-left px-8 text-[10px] font-black uppercase text-white hover:bg-white hover:text-black transition-all">
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
        <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
          <div className="w-24 h-24 border-t-2 border-[#00f2ff] rounded-full animate-spin mb-12 shadow-[0_0_30px_rgba(0,242,255,0.2)]" />
          <h2 className="text-2xl font-black italic uppercase tracking-[0.5em] mb-8 text-[#00f2ff] animate-pulse">Syncing...</h2>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-linear-to-r from-[#00f2ff] to-blue-500" style={{ width: `${loadingProgress}%` }} />
          </div>
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