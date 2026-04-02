"use client";

import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useEffect, useState, useCallback, useMemo } from "react";
import { FreelancerView } from "@/components/dashboard/FreelancerView";
import { ClientView } from "@/components/dashboard/ClientView";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<"checking" | "landing" | "path" | "survey" | "loading" | "dashboard">("checking");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // --- 👤 REVIEWS DATA ---
  const reviews = useMemo(() => [
    { name: "Alex K.", role: "Fullstack Node", img: "https://i.pravatar.cc/150?u=1" },
    { name: "Sarah M.", role: "UI/UX Architect", img: "https://i.pravatar.cc/150?u=2" },
    { name: "John D.", role: "Python Specialist", img: "https://i.pravatar.cc/150?u=3" },
    { name: "Elena V.", role: "AI Engineer", img: "https://i.pravatar.cc/150?u=4" },
    { name: "Marcus T.", role: "Cyber Security", img: "https://i.pravatar.cc/150?u=5" },
  ], []);

  const surveyQuestions = useMemo(() => [
    { q: "Current experience level with remote contract work?", options: ["Entry Level (<1 yr)", "Mid-Tier (2-5 yrs)", "Elite (5+ yrs)"] },
    { q: "Target monthly revenue bracket on the Nexus platform?", options: ["< KES 50,000", "KES 50k - 200k", "KES 500k+ / Unlimited"] },
    { q: "Primary technical vector or skill cluster?", options: ["Software / AI", "Creative / UI/UX", "Operations / Strategy"] },
    { q: "Average weekly node availability?", options: ["< 10 Hours (Part-time)", "20-30 Hours (Hybrid)", "40+ Hours (Full Sync)"] },
    { q: "Readiness for Node Activation fee?", options: ["Immediate Sync", "Within 48 Hours", "Requires Sponsorship"] },
    { q: "Primary payment relay or payout vertical?", options: ["M-Pesa (sub-second)", "Direct Bank (USD/KES)", "Crypto (Web3)"] },
    { q: "Long-term goal on the platform?", options: ["Tactical Gigs", "Strategic Missions", "Founding an Agency"] },
    { q: "Status of your physical operating hardware?", options: ["H-Tier (Low latency)", "Standard", "Need Uplink"] },
    { q: "Comfort level with global high-command clients?", options: ["High", "Moderate", "Needs Onboarding"] },
    { q: "Ready to initialize immediate node sync?", options: ["Confirmed: Ready", "Standby: 24h"] },
  ], []);

  // --- 🧬 REDIRECT & HYDRATION ---
  useEffect(() => {
    setMounted(true);
    if (isLoaded) {
      if (!isSignedIn) {
        setStep("landing");
      } else if (user?.id) {
        const roleKey = `nexus_user_role_${user.id}`;
        const savedRole = localStorage.getItem(roleKey);
        const metaRole = user.publicMetadata?.role as string;

        if (metaRole || savedRole) {
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
        p += 2;
        setLoadingProgress(p);
        if (p >= 100) {
          clearInterval(inv);
          if (user?.id) {
            localStorage.setItem(`nexus_user_role_${user.id}`, selectedRole!);
            localStorage.setItem(`nexus_survey_done_${user.id}`, "true");
          }
          setStep("dashboard");
        }
      }, 30);
    }
  }, [currentQuestion, selectedRole, user?.id, surveyQuestions.length]);

  if (!mounted || !isLoaded || step === "checking") {
    return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-[#00f2ff] font-black italic animate-pulse">NEXUS_INITIALIZING...</div>;
  }

  const Stars = () => (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#020617]">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
      {[...Array(40)].map((_, i) => (
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
        
        {/* --- 📟 NAV --- */}
        <nav className="relative z-50 flex justify-between items-center p-8 max-w-7xl mx-auto">
          <h1 className="text-xl font-black italic tracking-tighter uppercase">NEXUS<span className="text-[#00f2ff]">GIGS</span></h1>
          <div className="flex gap-6 items-center">
            <SignInButton mode="modal"><button className="text-[10px] font-black uppercase italic tracking-widest hover:text-[#00f2ff] transition-colors">Login</button></SignInButton>
            <SignUpButton mode="modal"><button className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase italic rounded-full shadow-xl hover:scale-105 transition-all">Get Started</button></SignUpButton>
          </div>
        </nav>

        <main className="relative z-10 max-w-7xl mx-auto px-6 py-10 md:py-20 space-y-32">
          
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            {/* --- 🚀 LEFT --- */}
            <div className="space-y-12 animate-in slide-in-from-left-10 duration-1000">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00f2ff]/10 border border-[#00f2ff]/20 rounded-full">
                  <span className="w-2 h-2 bg-[#00f2ff] rounded-full animate-ping" />
                  <p className="text-[#00f2ff] text-[8px] font-black uppercase italic">Elite Protocol Active</p>
                </div>
                <h2 className="text-6xl md:text-[8rem] font-black italic uppercase leading-[0.8] tracking-tighter">Scale Your <br /> <span className="text-transparent bg-clip-text bg-linear-to-r from-[#00f2ff] via-blue-400 to-blue-600 drop-shadow-[0_0_30px_#00f2ff44]">Talent</span></h2>
                <p className="text-gray-400 max-w-md text-sm italic leading-relaxed">Execute mission-critical tasks and clear tactical settlements with zero-latency overhead.</p>
              </div>
              <SignUpButton mode="modal">
                <button className="px-12 py-6 bg-[#00f2ff] text-black font-black rounded-[25px] uppercase text-[12px] italic shadow-[0_20px_50px_rgba(0,242,255,0.4)] hover:scale-110 hover:-rotate-2 transition-all">Get Started Now →</button>
              </SignUpButton>
            </div>

            {/* --- 🖼️ RIGHT (3D HERO & SMALL STAT CARDS) --- */}
            <div className="relative animate-in zoom-in-95 duration-1000 delay-300">
              <div className="relative z-10 rounded-[60px] overflow-hidden border border-white/10 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200" alt="Nexus Hero" className="w-full h-137.5 object-cover opacity-80" />
                <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-transparent" />
              </div>

              {/* FLOATING MINI STATS */}
              {[
                { label: "👤 1.5M+ Nodes", style: "top-10 -left-10 text-[#00f2ff]", delay: "4s" },
                { label: "💰 $2M Flow", style: "bottom-40 -right-10 text-emerald-400", delay: "6s" },
                { label: "🎯 100k+ Gigs", style: "-bottom-10 left-20 text-purple-400", delay: "5s" },
                { label: "⚡ 0.02s Sync", style: "top-1/2 -right-8 text-amber-400", delay: "7s" }
              ].map((s, idx) => (
                <div key={idx} className={`absolute z-20 p-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl animate-bounce shadow-2xl ${s.style}`} style={{ animationDuration: s.delay }}>
                  <p className="text-[8px] font-black uppercase">{s.label}</p>
                </div>
              ))}

              {/* MINIMIZED ACTION CARDS */}
              <div className="absolute top-1/4 -left-16 z-30 p-4 bg-black/90 backdrop-blur-3xl border border-white/10 rounded-3xl w-40 hover:scale-110 transition-all cursor-pointer group">
                <p className="text-[9px] font-black uppercase text-white group-hover:text-[#00f2ff]">Execute Gigs →</p>
                <p className="text-[6px] text-gray-600 uppercase italic">For Elite Freelancers</p>
              </div>
              <div className="absolute bottom-1/4 -right-12 z-30 p-4 bg-black/90 backdrop-blur-3xl border border-white/10 rounded-3xl w-40 hover:scale-110 transition-all cursor-pointer group">
                <p className="text-[9px] font-black uppercase text-white group-hover:text-[#00f2ff]">Deploy Gigs →</p>
                <p className="text-[6px] text-gray-600 uppercase italic">For Global Clients</p>
              </div>
            </div>
          </div>

          {/* --- 🔄 REVIEWS SLIDER --- */}
          <section className="relative overflow-hidden py-10 border-y border-white/5 bg-white/2">
            <div className="flex gap-8 animate-marquee whitespace-nowrap">
              {[...reviews, ...reviews].map((r, i) => (
                <div key={i} className="inline-flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-full min-w-70 backdrop-blur-xl hover:bg-white/10 transition-all">
                  <img src={r.img} alt={r.name} className="w-10 h-10 rounded-full border-2 border-[#00f2ff]" />
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase italic text-white leading-none">{r.name}</p>
                    <p className="text-[8px] font-black uppercase text-gray-500 italic mt-1">{r.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* --- 🤝 GLASS SPONSORS --- */}
          <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 pb-32">
            {["Safaricom", "Google", "Binance", "Stripe", "Microsoft", "Tesla", "Amazon", "Coca-Cola"].map((s) => (
              <div key={s} className="bg-white/5 border border-white/10 backdrop-blur-3xl p-6 rounded-3xl flex items-center justify-center h-20 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 hover:bg-white/10 transition-all duration-500">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">{s}</p>
              </div>
            ))}
          </section>
        </main>

        <style jsx global>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 25s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  // --- 👤 ROLE PATH ---
  if (step === "path") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6 relative">
        <Stars />
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
           <button onClick={() => handleRoleSelect('freelancer')} className="p-16 bg-white/5 border border-white/10 rounded-[60px] text-left group hover:border-[#00f2ff] transition-all">
              <div className="w-16 h-16 bg-[#00f2ff]/10 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:bg-[#00f2ff] group-hover:text-black transition-all">💼</div>
              <h3 className="text-4xl font-black italic uppercase text-white mb-2">Freelancer</h3>
              <p className="text-xs text-gray-500 uppercase font-black italic">Execute Missions & Get Paid.</p>
           </button>
           <button onClick={() => handleRoleSelect('client')} className="p-16 bg-white/5 border border-white/10 rounded-[60px] text-left group hover:border-purple-500 transition-all">
              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:bg-purple-500 transition-all">🎯</div>
              <h3 className="text-4xl font-black italic uppercase text-white mb-2">Client</h3>
              <p className="text-xs text-gray-500 uppercase font-black italic">Hire Talent & Scale Fast.</p>
           </button>
        </div>
      </div>
    );
  }

  // --- 📋 SURVEY ---
  if (step === "survey") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6">
        <Stars />
        <div className="max-w-md w-full bg-black/40 backdrop-blur-3xl border border-white/10 p-12 rounded-[50px] relative z-10 animate-in zoom-in-95">
           <p className="text-[10px] font-black text-[#00f2ff] uppercase italic mb-8">Step {currentQuestion + 1} / 10</p>
           <h2 className="text-2xl font-black italic uppercase text-white mb-10 leading-tight">{surveyQuestions[currentQuestion].q}</h2>
           <div className="grid gap-4">
              {surveyQuestions[currentQuestion].options.map(o => (
                <button key={o} onClick={handleSurveyAnswer} className="w-full py-4 px-8 bg-white/5 border border-white/10 rounded-2xl text-left text-[10px] font-black uppercase italic hover:bg-white hover:text-black transition-all">{o}</button>
              ))}
           </div>
        </div>
      </div>
    );
  }

  // --- 🛰️ LOADER ---
  if (step === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] p-6">
        <Stars />
        <div className="relative z-10 w-full max-w-sm text-center">
           <div className="w-24 h-24 border-t-2 border-[#00f2ff] rounded-full animate-spin mx-auto mb-10 shadow-[0_0_40px_#00f2ff44]" />
           <h2 className="text-2xl font-black italic uppercase text-[#00f2ff] mb-8 animate-pulse">Syncing Node...</h2>
           <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-linear-to-r from-[#00f2ff] to-blue-500 transition-all duration-300" style={{ width: `${loadingProgress}%` }} />
           </div>
        </div>
      </div>
    );
  }

  if (step === "dashboard") {
    return (
      <main className="min-h-screen bg-[#020617]">
        {selectedRole === "freelancer" ? <FreelancerView jobs={[]} userMetadata={user?.publicMetadata || {}} /> : <ClientView jobs={[]} />}
      </main>
    );
  }

  return null;
}