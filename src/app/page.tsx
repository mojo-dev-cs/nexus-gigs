"use client";

import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useEffect, useState, useCallback, useMemo } from "react";
import { FreelancerView } from "@/components/dashboard/FreelancerView";
import { ClientView } from "@/components/dashboard/ClientView";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [mounted, setMounted] = useState(false);
  
  // Checking is the initial state to prevent flickering and mobile bounce
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

  // --- 🧬 10 GENERAL FREELANCING/BUSINESS SURVEY QUESTIONS ---
  const surveyQuestions = useMemo(() => [
    { q: "Current experience level with remote contract work?", options: ["Entry Level (<1 yr)", "Mid-Tier (2-5 yrs)", "Elite (5+ yrs)"] },
    { q: "Target monthly revenue bracket on the Nexus platform?", options: ["< KES 50,000", "KES 50k - 200k", "KES 500k+ / Unlimited"] },
    { q: "Primary technical vector or skill cluster?", options: ["Software / AI", "Creative / UI/UX", "Operations / Strategy"] },
    { q: "Average weekly node availability?", options: ["< 10 Hours (Part-time)", "20-30 Hours (Hybrid)", "40+ Hours (Full Sync)"] },
    { q: "Readiness for Node Activation fee (Verification process)?", options: ["Immediate Sync", "Within 48 Hours", "Requires Sponsorship"] },
    { q: "Primary payment relay or payout vertical?", options: ["M-Pesa (sub-second)", "Direct Bank (USD/KES)", "Crypto (Web3)"] },
    { q: "Long-term goal on the platform?", options: ["Tactical Gigs (Short term)", "Strategic Missions (Long term)", "Founding a Nexus Agency"] },
    { q: "Status of your physical operating hardware?", options: ["H-Tier (Low latency)", "Standard (Consumer)", "Need Hardware Uplink"] },
    { q: "Comfort level working with global high-command clients?", options: ["High Comfort", "Moderate Comfort", "Requires Onboarding"] },
    { q: "Ready to initialize immediate node sync and commence operations?", options: ["Confirmed: Ready", "Standby: Need 24 hours"] },
  ], []);

  // --- 🛰️ BULLETPROOF REDIRECT PROTOCOL ---
  useEffect(() => {
    setMounted(true);
    
    if (isLoaded) {
      if (!isSignedIn) {
        setStep("landing");
      } else if (user?.id) {
        // Safe check for metadata and localStorage
        const metaRole = user.publicMetadata?.role as string;
        const surveyKey = `nexus_survey_done_${user.id}`;
        const roleKey = `nexus_user_role_${user.id}`;
        
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
  }, [isLoaded, isSignedIn, user]);

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
        p += 2; // Slower progress for 3D effect
        setLoadingProgress(p);
        if (p >= 100) {
          clearInterval(inv);
          
          if (user?.id) {
            localStorage.setItem(`nexus_survey_done_${user.id}`, "true");
            localStorage.setItem(`nexus_user_role_${user.id}`, selectedRole!);
          }
          
          setStep("dashboard");
        }
      }, 50); // Heartbeat speed
    }
  }, [currentQuestion, selectedRole, user?.id, surveyQuestions.length]);

  if (!mounted || !isLoaded || step === "checking") {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-2 border-[#00f2ff] border-t-transparent rounded-full animate-spin shadow-[0_0_40px_rgba(0,242,255,0.3)]" />
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
          style={{ 
            top: `${Math.random() * 100}%`, 
            left: `${Math.random() * 100}%`, 
            width: '2px', 
            height: '2px', 
            opacity: Math.random(),
            animationDelay: `${Math.random()*5}s`
          }}
        />
      ))}
    </div>
  );

  if (step === "landing") {
    return (
      <div className="min-h-screen text-white relative font-sans overflow-x-hidden selection:bg-[#00f2ff]/30">
        <Stars />
        
        {/* --- 📟 4K NAV --- */}
        <nav className="relative z-50 flex justify-between items-center p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-top-5 duration-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#00f2ff] rounded-lg flex items-center justify-center font-black text-black italic text-xl shadow-[0_0_20px_#00f2ff]">N</div>
            <h1 className="text-xl font-black italic tracking-tighter uppercase hidden md:block">NEXUS<span className="text-[#00f2ff]">GIGS</span></h1>
          </div>
          <div className="flex gap-4 md:gap-8 items-center">
            <SignInButton mode="modal">
              <button className="text-[10px] font-black uppercase italic tracking-widest hover:text-[#00f2ff] transition-colors active:scale-95">Login</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase italic rounded-full hover:scale-105 transition-all shadow-xl shadow-white/10 active:scale-95">Get Started</button>
            </SignUpButton>
          </div>
        </nav>

        {/* --- 🚀 HERO SECTION (4K ANIMATED) --- */}
        <main className="relative z-10 max-w-7xl mx-auto px-6 py-10 md:py-20 space-y-32">
          
          <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="space-y-12 animate-in slide-in-from-left-10 duration-1000">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00f2ff]/10 border border-[#00f2ff]/20 rounded-full">
                  <span className="w-2 h-2 bg-[#00f2ff] rounded-full animate-ping" />
                  <p className="text-[#00f2ff] text-[8px] font-black uppercase tracking-[0.4em] italic">Elite Protocol active</p>
                </div>
                <h2 className="text-6xl md:text-[8rem] font-black italic uppercase leading-[0.85] tracking-tighter">
                  Scale Your <br /> <span className="text-transparent bg-clip-text bg-linear-to-r from-[#00f2ff] via-blue-400 to-blue-600 drop-shadow-[0_0_30px_rgba(0,242,255,0.4)]">Talent</span>
                </h2>
                <p className="text-gray-400 max-w-md text-sm md:text-base leading-relaxed font-medium italic">
                  Deploy mission-critical code, design elite interfaces, and clear tactical financial settlements with 0.02s relay latency.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <SignUpButton mode="modal">
                  <button className="px-12 py-6 bg-[#00f2ff] text-black font-black rounded-3xl uppercase text-[12px] italic hover:scale-110 hover:-rotate-2 transition-all shadow-[0_20px_50px_rgba(0,242,255,0.4)] active:scale-95">
                    Get Started →
                  </button>
                </SignUpButton>
              </div>
            </div>

            {/* --- 🖼️ RIGHT CONTENT: 3D HERO IMAGE & INTRO CARDS --- */}
            <div className="relative animate-in zoom-in-95 duration-1000 delay-300">
              {/* Main Image with Hover Parallax */}
              <div className="relative z-10 rounded-[60px] overflow-hidden border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.6)] transform hover:rotate-1 transition-transform duration-700">
                <img 
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop" 
                  alt="Nexus Workstation" 
                  className="w-full h-125 md:h-162.5 object-cover hover:scale-110 transition-transform duration-[3s] opacity-80"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-transparent to-transparent" />
              </div>

              {/* Freelancer Intro Card (Floating) */}
              <div className="absolute -bottom-10 -left-10 md:-left-16 z-20 p-8 bg-[#0a0f1e]/90 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-2xl max-w-70 group animate-bounce duration-[4s]">
                <div className="w-12 h-12 bg-[#00f2ff]/10 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-[#00f2ff] group-hover:text-black transition-all">💼</div>
                <h4 className="text-xl font-black italic uppercase text-white mb-3">Execute Missions</h4>
                <p className="text-[10px] text-gray-500 leading-relaxed font-bold uppercase italic tracking-wider">Freelancers: Access high-ticket tactical gigs and manage your financial yield instantly.</p>
              </div>

              {/* Client Intro Card (Floating) */}
              <div className="absolute -top-10 -right-4 md:-right-12 z-20 p-8 bg-[#0a0f1e]/90 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-2xl max-w-70 group animate-bounce duration-[6s]">
                <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-purple-500 transition-all">🎯</div>
                <h4 className="text-xl font-black italic uppercase text-white mb-3">Deploy Gigs</h4>
                <p className="text-[10px] text-gray-500 leading-relaxed font-bold uppercase italic tracking-wider">Clients: Hire elite talent nodes. Manage missions with cryptographic precision.</p>
              </div>
            </div>
          </div>

          {/* --- 💎 THE 4K FEATURE CARDS --- */}
          <section className="grid md:grid-cols-3 gap-8 pb-32">
            {[
              { t: "Active Nodes", d: "Join +1.2M elite tactical units synchronized in real-time on the global grid.", v: "🌐" },
              { t: "Total Yield Cleared", d: "Over $2.5M tactical funds settled via our cryptographic M-Pesa relay.", v: "📈" },
              { t: "Node Latency", d: "0.02s data synchronization ensures immediate command execution and updates.", v: "⚡" }
            ].map((s, i) => (
              <div key={i} className="group p-10 bg-white/2 border border-white/5 rounded-[45px] hover:bg-white/5 hover:border-[#00f2ff]/30 transition-all duration-500 hover:-translate-y-4">
                <div className="text-3xl mb-6 group-hover:scale-110 transition-transform duration-500">{s.v}</div>
                <h3 className="text-xl font-black uppercase italic text-white mb-4">{s.t}</h3>
                <p className="text-gray-500 text-[10px] leading-relaxed italic font-bold uppercase tracking-wider">{s.d}</p>
              </div>
            ))}
          </section>

          {/* --- 🤝 GLASSLIKE SPONSORS --- */}
          <section className="border-t border-white/5 pt-32 pb-20">
             <p className="text-[10px] font-black text-gray-500 uppercase tracking-[1em] mb-20 italic text-center">Verified Strategic partners</p>
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-10">
                {sponsors.map((brand) => (
                  <div key={brand.name} className="relative group bg-[#0a0f1e]/40 border border-white/5 backdrop-blur-3xl p-6 rounded-[30px] flex items-center justify-center h-24 shadow-inner grayscale hover:grayscale-0 hover:border-[#00f2ff]/30 hover:bg-white/5 transition-all duration-700">
                    <img src={brand.logo} alt={brand.name} className="max-h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 rounded-[30px] backdrop-blur-sm transition-opacity" />
                  </div>
                ))}
             </div>
          </section>
        </main>
      </div>
    );
  }

  // Handle other steps (path, survey, dashboard) - keep logic but update visuals to 4K
  if (step === "path") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-[#00f2ff]/30">
        <Stars />
        <div className="relative z-10 text-center animate-in fade-in slide-in-from-bottom-5 duration-1000 w-full max-w-5xl px-4 space-y-20">
          <h2 className="text-4xl md:text-7xl font-black italic uppercase text-white mb-16 tracking-tighter leading-tight border-b-4 border-[#00f2ff] pb-6 inline-block">Identify <span className="text-transparent bg-clip-text bg-linear-to-r from-[#00f2ff] to-blue-500">Protocol</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <button onClick={() => handleRoleSelect('freelancer')} className="p-12 md:p-16 bg-white/2 border border-white/10 rounded-[60px] hover:border-[#00f2ff] hover:bg-[#00f2ff]/5 transition-all text-left group relative overflow-hidden shadow-2xl shadow-black/30 active:scale-95">
              <div className="absolute -right-10 -top-10 text-9xl opacity-5 grayscale group-hover:grayscale-0 group-hover:opacity-20 transition-all duration-700">💼</div>
              <div className="w-20 h-20 bg-[#00f2ff]/10 rounded-[30px] flex items-center justify-center text-5xl mb-10 group-hover:bg-[#00f2ff] group-hover:text-black transition-all">💼</div>
              <h3 className="text-4xl font-black uppercase italic text-white mb-4 tracking-tighter">Freelancer</h3>
              <p className="text-gray-500 text-sm italic font-bold uppercase tracking-widest leading-relaxed">Execute tactical missions. Clear settlements instantly.</p>
            </button>
            <button onClick={() => handleRoleSelect('client')} className="p-12 md:p-16 bg-white/2 border border-white/10 rounded-[60px] hover:border-purple-500 hover:bg-purple-500/5 transition-all text-left group relative overflow-hidden shadow-2xl shadow-black/30 active:scale-95">
              <div className="absolute -right-10 -top-10 text-9xl opacity-5 grayscale group-hover:grayscale-0 group-hover:opacity-20 transition-all duration-700">🎯</div>
              <div className="w-20 h-20 bg-purple-500/10 rounded-[30px] flex items-center justify-center text-5xl mb-10 group-hover:bg-purple-500 transition-all">🎯</div>
              <h3 className="text-4xl font-black uppercase italic text-white mb-4 tracking-tighter">Client</h3>
              <p className="text-gray-500 text-sm italic font-bold uppercase tracking-widest leading-relaxed">Hire elite talent nodes. Deploy tactical missions.</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "survey") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative selection:bg-[#00f2ff]/30">
        <Stars />
        <div className="max-w-md w-full bg-[#0a0f1e]/90 backdrop-blur-3xl border border-white/10 p-12 rounded-[50px] relative z-10 shadow-2xl shadow-black/50 animate-in zoom-in-95 duration-500">
          <div className="flex justify-between items-center mb-10 text-white">
            <div className="space-y-1">
              <p className="text-[8px] font-black text-[#00f2ff] uppercase italic tracking-widest">Protocol Sync</p>
              <p className="text-[10px] font-black uppercase">Question {currentQuestion + 1} of 10</p>
            </div>
            <div className="flex gap-1.5">
              {[...Array(10)].map((_, i) => (
                <div key={i} className={`w-1.5 h-6 rounded-full transition-all duration-500 ${i <= currentQuestion ? 'bg-[#00f2ff] shadow-[0_0_15px_#00f2ff]' : 'bg-white/10'}`} />
              ))}
            </div>
          </div>
          <h2 className="text-xl md:text-2xl font-black italic uppercase text-white mb-10 leading-tight tracking-tight border-l-4 border-[#00f2ff] pl-6">
            {surveyQuestions[currentQuestion].q}
          </h2>
          <div className="grid gap-4">
            {surveyQuestions[currentQuestion].options.map(opt => (
              <button key={opt} onClick={handleSurveyAnswer} className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-left px-8 text-[11px] font-black uppercase text-white hover:bg-white hover:text-black transition-all italic active:scale-95 group relative overflow-hidden">
                <span className="opacity-0 group-hover:opacity-100 mr-2 transition-all">→</span> {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- 🛰️ 3D FREELANCING LOADER BAR ---
  if (step === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-[#00f2ff]/30">
        <Stars />
        <div className="relative z-10 flex flex-col items-center w-full max-w-md animate-in fade-in duration-700">
          <div className="relative mb-20 group">
            <div className="w-28 h-28 border-4 border-white/10 rounded-full" />
            <div className="absolute inset-0 w-28 h-28 border-t-2 border-[#00f2ff] rounded-full animate-spin shadow-[0_0_50px_rgba(0,242,255,0.4)]" />
            <div className="absolute -inset-10 text-9xl opacity-5 grayscale group-hover:grayscale-0 transition-all">💼</div>
          </div>
          <h2 className="text-3xl font-black italic uppercase tracking-[0.5em] mb-12 text-[#00f2ff] animate-pulse text-center">Synchronizing Node</h2>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden border border-white/10 shadow-xl shadow-black/20 relative">
            <div className="h-full bg-linear-to-r from-[#00f2ff] to-blue-500 transition-all duration-300 rounded-full relative overflow-hidden" style={{ width: `${loadingProgress}%` }}>
                 {/* Shimmer Effect */}
                 <div className="absolute inset-0 bg-white/20 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
            </div>
          </div>
          <div className="flex justify-between w-full mt-5 text-white text-[10px] font-black uppercase italic tracking-widest">
            <p>Holographic Uplink Active</p>
            <p className="text-[#00f2ff]">{loadingProgress}% SYNCED</p>
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