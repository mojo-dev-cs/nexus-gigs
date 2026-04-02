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
    { name: "Alex K.", role: "Fullstack Node", img: "https://i.pravatar.cc/150?u=1", stars: 5 },
    { name: "Sarah M.", role: "UI/UX Architect", img: "https://i.pravatar.cc/150?u=2", stars: 5 },
    { name: "John D.", role: "Python Specialist", img: "https://i.pravatar.cc/150?u=3", stars: 4 },
    { name: "Elena V.", role: "AI Engineer", img: "https://i.pravatar.cc/150?u=4", stars: 5 },
    { name: "Marcus T.", role: "Cyber Security", img: "https://i.pravatar.cc/150?u=5", stars: 5 },
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
  }, [currentQuestion, selectedRole, user?.id, surveyQuestions]);

  if (!mounted || !isLoaded || step === "checking") {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-[#00f2ff] font-black italic animate-pulse tracking-[0.5em] text-[10px] uppercase">Nexus Syncing...</div>
      </div>
    );
  }

  if (step === "landing") {
    return (
      <div className="min-h-screen text-white relative font-sans selection:bg-[#00f2ff]/30 overflow-x-hidden">
        <div className="fixed inset-0 bg-[#020617] z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
          {[...Array(30)].map((_, i) => (
            <div key={i} className="absolute bg-white rounded-full animate-pulse" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, width: '2px', height: '2px', opacity: Math.random() }} />
          ))}
        </div>
        
        <nav className="relative z-50 flex justify-between items-center p-8 max-w-7xl mx-auto">
          <h1 className="text-xl font-black italic uppercase tracking-tighter">NEXUS<span className="text-[#00f2ff]">GIGS</span></h1>
          <div className="flex gap-6 items-center">
            <SignInButton mode="modal"><button className="text-[10px] font-black uppercase italic hover:text-[#00f2ff] transition-colors">Login</button></SignInButton>
            <SignUpButton mode="modal"><button className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase italic rounded-full shadow-xl hover:scale-105 transition-all">Get Started</button></SignUpButton>
          </div>
        </nav>

        <main className="relative z-10 max-w-7xl mx-auto px-6 py-10 md:py-20 space-y-32">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12 animate-in slide-in-from-left-10 duration-1000">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00f2ff]/10 border border-[#00f2ff]/20 rounded-full">
                  <span className="w-2 h-2 bg-[#00f2ff] rounded-full animate-ping" />
                  <p className="text-[#00f2ff] text-[8px] font-black uppercase italic tracking-widest">Protocol Active</p>
                </div>
                <h2 className="text-6xl md:text-[8rem] font-black italic uppercase leading-[0.85] tracking-tighter">Scale Your <br /> <span className="text-transparent bg-clip-text bg-linear-to-r from-[#00f2ff] via-blue-400 to-blue-600 drop-shadow-[0_0_30px_#00f2ff44]">Talent</span></h2>
                <p className="text-gray-400 max-w-md text-sm md:text-base leading-relaxed font-medium italic">Elite work-from-home infrastructure for the high-tier freelance node.</p>
              </div>
              <SignUpButton mode="modal">
                <button className="px-12 py-6 bg-[#00f2ff] text-black font-black rounded-[25px] uppercase text-[12px] italic hover:scale-110 transition-all shadow-[0_20px_50px_rgba(0,242,255,0.4)]">Get Started Now →</button>
              </SignUpButton>
            </div>

            <div className="relative">
              <div className="relative z-10 rounded-[60px] overflow-hidden border border-white/10 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1593062096033-9a26b09da705?q=80&w=2000&auto=format&fit=crop" alt="Work from Home" className="w-full h-137.5 md:h-162.5 object-cover opacity-80" />
                <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-transparent to-transparent" />
              </div>

              {[
                { label: "👤 1.5M+ Nodes", style: "top-5 -left-4 md:-left-12 text-[#00f2ff]", delay: "4s" },
                { label: "💰 $2M Yield", style: "bottom-32 -right-4 md:-right-12 text-emerald-400", delay: "6s" },
                { label: "🎯 100k+ Gigs", style: "-bottom-8 left-12 md:left-24 text-purple-400", delay: "5s" },
                { label: "⚡ 0.02s Relay", style: "top-1/2 -right-4 md:-right-8 text-amber-400", delay: "7s" }
              ].map((s, idx) => (
                <div key={idx} className={`absolute z-20 px-6 py-4 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl animate-bounce shadow-2xl ${s.style}`} style={{ animationDuration: s.delay }}>
                  <p className="text-[10px] md:text-xs font-black uppercase tracking-tighter whitespace-nowrap">{s.label}</p>
                </div>
              ))}

              <div className="absolute top-1/4 -left-8 md:-left-20 z-30 p-5 bg-black/90 backdrop-blur-3xl border border-white/20 rounded-3xl w-44">
                <p className="text-[10px] font-black uppercase text-[#00f2ff]">Execute Gigs →</p>
                <p className="text-[7px] text-gray-500 uppercase italic mt-1">For Freelance Nodes</p>
              </div>
              <div className="absolute bottom-1/4 -right-8 md:-right-16 z-30 p-5 bg-black/90 backdrop-blur-3xl border border-white/20 rounded-3xl w-44">
                <p className="text-[10px] font-black uppercase text-[#00f2ff]">Deploy Gigs →</p>
                <p className="text-[7px] text-gray-500 uppercase italic mt-1">For Global Clients</p>
              </div>
            </div>
          </div>

          <section className="relative overflow-hidden py-14 border-y border-white/5 bg-white/1">
            <div className="flex gap-10 animate-marquee whitespace-nowrap">
              {[...reviews, ...reviews].map((r, i) => (
                <div key={i} className="inline-flex items-center gap-5 bg-black/40 border border-white/10 p-5 rounded-[30px] min-w-[320px] backdrop-blur-3xl">
                  <img src={r.img} alt={r.name} className="w-12 h-12 rounded-full border-2 border-[#00f2ff]" />
                  <div className="text-left">
                    <p className="text-[11px] font-black uppercase italic text-white leading-none">{r.name}</p>
                    <p className="text-[8px] font-black uppercase text-gray-600 italic mt-1">{r.role}</p>
                    <div className="flex gap-0.5 mt-2 text-[#00f2ff] text-[8px]">
                        {[...Array(r.stars)].map((_, si) => <span key={si}>★</span>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 pb-32">
            {["Safaricom", "Google", "Binance", "Stripe", "Microsoft", "Tesla", "Amazon", "Coca-Cola"].map((s) => (
              <div key={s} className="group relative bg-[#0a0f1e]/60 border border-white/10 backdrop-blur-3xl p-6 rounded-[30px] flex items-center justify-center h-24 hover:bg-white transition-all duration-500">
                <p className="text-[10px] font-black uppercase tracking-tighter text-gray-400 group-hover:text-black">{s}</p>
              </div>
            ))}
          </section>
        </main>
        <style jsx global>{`
          @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          .animate-marquee { animation: marquee 30s linear infinite; }
        `}</style>
      </div>
    );
  }

  if (step === "path") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6 relative">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl w-full animate-in fade-in zoom-in-95 duration-700">
           <button onClick={() => handleRoleSelect('freelancer')} className="p-16 bg-white/5 border border-white/10 rounded-[60px] text-left group hover:border-[#00f2ff] transition-all">
              <div className="w-20 h-20 bg-[#00f2ff]/10 rounded-3xl flex items-center justify-center text-4xl mb-10 group-hover:bg-[#00f2ff] group-hover:text-black transition-all">💼</div>
              <h3 className="text-4xl font-black italic uppercase text-white mb-2">Freelancer</h3>
              <p className="text-xs text-gray-500 uppercase font-black italic">Target Tactical Gigs & Instant Yield.</p>
           </button>
           <button onClick={() => handleRoleSelect('client')} className="p-16 bg-white/5 border border-white/10 rounded-[60px] text-left group hover:border-purple-500 transition-all">
              <div className="w-20 h-20 bg-purple-500/10 rounded-3xl flex items-center justify-center text-4xl mb-10 group-hover:bg-purple-500 transition-all">🎯</div>
              <h3 className="text-4xl font-black italic uppercase text-white mb-2">Client</h3>
              <p className="text-xs text-gray-500 uppercase font-black italic">Deploy Missions & Recruit Talent.</p>
           </button>
        </div>
      </div>
    );
  }

  if (step === "survey") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6">
        <div className="max-w-md w-full bg-black/60 backdrop-blur-3xl border border-white/10 p-12 rounded-[50px] relative z-10">
           <p className="text-[10px] font-black text-[#00f2ff] uppercase italic mb-10">Calibration {currentQuestion + 1} / 10</p>
           <h2 className="text-2xl font-black italic uppercase text-white mb-10 border-l-4 border-[#00f2ff] pl-6">{surveyQuestions[currentQuestion].q}</h2>
           <div className="grid gap-4">
              {surveyQuestions[currentQuestion].options.map(o => (
                <button key={o} onClick={handleSurveyAnswer} className="w-full py-5 px-8 bg-white/5 border border-white/10 rounded-2xl text-left text-[11px] font-black uppercase italic hover:bg-white hover:text-black transition-all">{o}</button>
              ))}
           </div>
        </div>
      </div>
    );
  }

  if (step === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] p-6">
        <div className="w-24 h-24 border-t-2 border-[#00f2ff] rounded-full animate-spin mb-12 shadow-[0_0_50px_#00f2ff55]" />
        <h2 className="text-3xl font-black italic uppercase text-[#00f2ff] animate-pulse">Syncing...</h2>
        <div className="w-full max-w-sm h-1 bg-white/5 rounded-full overflow-hidden mt-8">
           <div className="h-full bg-linear-to-r from-[#00f2ff] to-blue-500" style={{ width: `${loadingProgress}%` }} />
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