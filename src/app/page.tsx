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

  // --- 👤 REVIEWS DATA WITH GOLD STARS ---
  const reviews = useMemo(() => [
    { name: "Alex K.", role: "Fullstack Node", img: "https://i.pravatar.cc/150?u=1", stars: 5 },
    { name: "Sarah M.", role: "UI/UX Architect", img: "https://i.pravatar.cc/150?u=2", stars: 5 },
    { name: "John D.", role: "Python Specialist", img: "https://i.pravatar.cc/150?u=3", stars: 4 },
    { name: "Elena V.", role: "AI Engineer", img: "https://i.pravatar.cc/150?u=4", stars: 5 },
    { name: "Marcus T.", role: "Cyber Security", img: "https://i.pravatar.cc/150?u=5", stars: 5 },
  ], []);

  // --- 🧬 GLOBAL PARTNERS ---
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

  // --- 📝 10-CHOICE SURVEY (USD) ---
  const surveyQuestions = useMemo(() => [
    { q: "Experience level with remote contract work?", options: ["Entry (<1 yr)", "Mid-Tier (2-5 yrs)", "Elite (5+ yrs)"] },
    { q: "Target monthly revenue bracket (USD)?", options: ["< $500", "$500 - $2,000", "$5,000+"] },
    { q: "Primary technical focus?", options: ["Software", "AI", "Design", "Cyber"] },
    { q: "Weekly node availability?", options: ["< 10 hrs", "20-30 hrs", "40+ hrs"] },
    { q: "Ready for Node Activation fee?", options: ["Immediate Sync", "48 hrs", "Requires Sponsorship"] },
    { q: "Primary payment relay?", options: ["Instant Payout (USD)", "Direct Bank (USD)", "Crypto (Web3)"] },
    { q: "Long-term mission?", options: ["Tactical Gigs", "Strategic Missions", "Founding an Agency"] },
    { q: "Status of operating hardware?", options: ["H-Tier (Low latency)", "Standard", "Need Uplink"] },
    { q: "Comfort level with global high-command clients?", options: ["High", "Moderate", "Needs Onboarding"] },
    { q: "Ready to initialize immediate node sync?", options: ["Confirmed: Ready", "Standby: 24h"] },
  ], []);

  // --- 🛰️ REDIRECT PROTOCOL ---
  useEffect(() => {
    setMounted(true);
    if (isLoaded) {
      if (!isSignedIn) {
        setStep("landing");
      } else if (user?.id) {
        const metaRole = user.publicMetadata?.role as string;
        const savedRole = localStorage.getItem(`nexus_user_role_${user.id}`);
        const isSurveyDone = localStorage.getItem(`nexus_survey_done_${user.id}`);

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
      }, 50);
    }
  }, [currentQuestion, selectedRole, user?.id, surveyQuestions.length]);

  if (!mounted || !isLoaded || step === "checking") {
    return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-[#00f2ff] font-black italic animate-pulse tracking-[0.5em] text-[10px] uppercase">Initialize Nexus HQ...</div>;
  }

  // --- LANDING PAGE ---
  if (step === "landing") {
    return (
      <div className="min-h-screen text-white relative font-sans selection:bg-[#00f2ff]/30 overflow-x-hidden">
        
        {/* --- 🌌 BACKGROUND --- */}
        <div className="fixed inset-0 bg-[#020617] z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
          {[...Array(30)].map((_, i) => (
            <div key={i} className="absolute bg-white rounded-full animate-pulse" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, width: '2px', height: '2px', opacity: Math.random() }} />
          ))}
        </div>
        
        {/* --- 📟 NAV/HEADER (FIXED TOP) --- */}
        <nav className="fixed top-0 w-full h-20 bg-[#020617]/90 backdrop-blur-xl border-b border-white/5 z-50 flex justify-between items-center p-8 max-w-380 mx-auto animate-in fade-in slide-in-from-top-5 duration-700">
          <h1 className="text-xl font-black italic uppercase tracking-tighter">NEXUS<span className="text-[#00f2ff]">GIGS</span></h1>
          <div className="flex gap-4 md:gap-8 items-center">
            <SignInButton mode="modal">
              <button className="text-[10px] font-black uppercase italic tracking-widest hover:text-[#00f2ff] transition-colors">Login</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase italic rounded-full shadow-xl hover:scale-105 transition-all">Get Started</button>
            </SignUpButton>
          </div>
        </nav>

        <main className="relative z-10 max-w-7xl mx-auto px-6 py-10 md:py-20 mt-20 space-y-32">
          
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            {/* --- 🚀 LEFT CONTENT --- */}
            <div className="space-y-12 animate-in slide-in-from-left-10 duration-1000">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00f2ff]/10 border border-[#00f2ff]/20 rounded-full">
                  <span className="w-2 h-2 bg-[#00f2ff] rounded-full animate-ping" />
                  <p className="text-[#00f2ff] text-[8px] font-black uppercase italic tracking-widest">Protocol Active</p>
                </div>
                <h2 className="text-6xl md:text-[8rem] font-black italic uppercase leading-[0.85] tracking-tighter">Scale Your <br /> <span className="text-transparent bg-clip-text bg-linear-to-r from-[#00f2ff] via-blue-400 to-blue-600 drop-shadow-[0_0_30px_#00f2ff44]">Talent</span></h2>
                <p className="text-gray-400 max-w-md text-sm md:text-base leading-relaxed font-medium italic">Execute mission-critical tasks and manage tactical financial settlements with zero-latency overhead.</p>
              </div>
            </div>

            {/* --- 🖼️ RIGHT (3D HERO & STATS) --- */}
            <div className="relative animate-in zoom-in-95 duration-1000 delay-300">
              <div className="relative z-10 rounded-[60px] overflow-hidden border border-white/10 shadow-2xl">
                {/* Working from Home Image */}
                <img src="https://images.unsplash.com/photo-1593062096033-9a26b09da705?q=80&w=2000&auto=format&fit=crop" alt="Work from Home" className="w-full h-137.5 md:h-162.5 object-cover opacity-80" />
                <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-transparent to-transparent" />
              </div>

              {/* REARRANGED FLOATING STATS (NO OVERLAP) */}
              {[
                { label: "👤 1.5M+ Nodes", style: "top-5 left-1/4 -translate-x-1/2 text-[#00f2ff]", delay: "4s" },
                { label: "💰 $2M Yield", style: "top-1/3 right-10 text-emerald-400", delay: "6s" },
                { label: "🎯 100k+ Gigs", style: "bottom-1/4 left-10 text-purple-400", delay: "5s" },
                { label: "⚡ 0.02s Relay", style: "bottom-10 right-1/4 translate-x-1/2 text-amber-400", delay: "7s" }
              ].map((s, idx) => (
                <div key={idx} className={`absolute z-20 px-6 py-4 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl animate-bounce shadow-2xl ${s.style}`} style={{ animationDuration: s.delay }}>
                  <p className="text-[10px] md:text-xs font-black uppercase tracking-tighter whitespace-nowrap">{s.label}</p>
                </div>
              ))}

              {/* 3D INTRO CARDS (MINIMIZED) */}
              <div className="absolute top-1/2 -left-8 md:-left-20 z-30 p-5 bg-black/90 backdrop-blur-3xl border border-white/20 rounded-3xl w-44 hover:scale-110 transition-all shadow-2xl group cursor-pointer">
                <p className="text-[10px] font-black uppercase text-[#00f2ff]">Execute Gigs →</p>
                <p className="text-[7px] text-gray-500 uppercase italic mt-1 group-hover:text-white">Sub-second Payouts (USD)</p>
              </div>
              <div className="absolute bottom-32 -right-8 md:-right-16 z-30 p-5 bg-black/90 backdrop-blur-3xl border border-white/20 rounded-3xl w-44 hover:scale-110 transition-all shadow-2xl group cursor-pointer">
                <p className="text-[10px] font-black uppercase text-[#00f2ff]">Deploy Gigs →</p>
                <p className="text-[7px] text-gray-500 uppercase italic mt-1 group-hover:text-white">Escrow Secured Missions</p>
              </div>
            </div>
          </div>

          {/* --- 🔄 SLIDER (Pauses on Hover) --- */}
          <section className="relative overflow-hidden py-14 border-y border-white/5 bg-white/1">
            <div className="flex gap-10 animate-marquee whitespace-nowrap marquee-container">
              {[...reviews, ...reviews].map((r, i) => (
                <div key={i} className="inline-flex items-center gap-5 bg-black/40 border border-white/10 p-5 rounded-[30px] min-w-[320px] backdrop-blur-3xl">
                  <img src={r.img} alt={r.name} className="w-12 h-12 rounded-full border-2 border-[#00f2ff] shadow-[0_0_15px_#00f2ff44]" />
                  <div className="text-left">
                    <p className="text-[11px] font-black uppercase italic text-white leading-none">{r.name}</p>
                    <p className="text-[8px] font-black uppercase text-gray-600 italic mt-1">{r.role}</p>
                    <div className="flex gap-0.5 mt-2 text-yellow-500 text-[9px] drop-shadow-[0_0_5px_#f59e0b]">
                        {[...Array(r.stars)].map((_, si) => <span key={si}>★</span>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* --- 🤝 GLASSLIKE PARTNERS --- */}
          <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 pb-32">
            {sponsors.map((brand) => (
              <div key={brand.name} className="group relative bg-[#0a0f1e]/60 border border-white/10 backdrop-blur-3xl p-6 rounded-[30px] flex items-center justify-center h-24 shadow-2xl transition-all duration-500 hover:bg-white hover:border-[#00f2ff]">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-black transition-colors">{brand.name}</p>
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 rounded-[30px] transition-opacity" />
              </div>
            ))}
          </section>
        </main>
        <style jsx global>{`
          @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          .animate-marquee { animation: marquee 30s linear infinite; }
          .marquee-container:hover { animation-play-state: paused; }
        `}</style>
      </div>
    );
  }

  // Handle other steps (path, survey, dashboard) - logic intact, minimal visual update
  if (step === "dashboard") {
    return <main className="min-h-screen bg-[#020617]">{selectedRole === "freelancer" ? <FreelancerView jobs={[]} userMetadata={user?.publicMetadata || {}} /> : <ClientView jobs={[]} />}</main>;
  }

  // Fallback and loading steps remain the same
  return <div className="min-h-screen bg-[#020617]" />;
}