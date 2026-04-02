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

  const reviews = useMemo(() => [
    { name: "Alex K.", role: "Fullstack Node", img: "https://i.pravatar.cc/150?u=1", stars: 5 },
    { name: "Sarah M.", role: "UI/UX Architect", img: "https://i.pravatar.cc/150?u=2", stars: 5 },
    { name: "John D.", role: "Python Specialist", img: "https://i.pravatar.cc/150?u=3", stars: 4 },
    { name: "Elena V.", role: "AI Engineer", img: "https://i.pravatar.cc/150?u=4", stars: 5 },
    { name: "Marcus T.", role: "Cyber Security", img: "https://i.pravatar.cc/150?u=5", stars: 5 },
  ], []);

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

  useEffect(() => {
    setMounted(true);
    if (isLoaded) {
      if (!isSignedIn) setStep("landing");
      else if (user?.id) {
        const roleKey = `nexus_user_role_${user.id}`;
        const savedRole = localStorage.getItem(roleKey);
        if (user.publicMetadata?.role || savedRole) {
          setSelectedRole((user.publicMetadata?.role as string) || savedRole);
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

  if (!mounted || !isLoaded || step === "checking") return <div className="min-h-screen bg-[#020617]" />;

  // --- 1. LANDING PAGE ---
  if (step === "landing") {
    return (
      <div className="min-h-screen text-white relative font-sans selection:bg-[#00f2ff]/30 overflow-x-hidden">
        <div className="fixed inset-0 bg-[#020617] z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
          {[...Array(30)].map((_, i) => (
            <div key={i} className="absolute bg-white rounded-full animate-pulse" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, width: '2px', height: '2px', opacity: Math.random() }} />
          ))}
        </div>

        <header className="fixed top-0 w-full h-20 z-50 flex items-center justify-between px-8 bg-[#020617]/80 backdrop-blur-md border-b border-white/5">
          <h1 className="text-xl font-black italic uppercase tracking-tighter">NEXUS<span className="text-[#00f2ff]">GIGS</span></h1>
          <div className="flex gap-4">
             <SignInButton mode="modal"><button className="text-[10px] font-black uppercase italic tracking-widest hover:text-[#00f2ff]">Login</button></SignInButton>
             <SignUpButton mode="modal"><button className="px-6 py-2 bg-white text-black text-[10px] font-black uppercase italic rounded-full shadow-lg">Get Started</button></SignUpButton>
          </div>
        </header>

        <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 space-y-32">
          <div className="grid lg:grid-cols-2 gap-24 items-start">
            <div className="space-y-10 animate-in slide-in-from-left-10 duration-1000">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00f2ff]/10 border border-[#00f2ff]/20 rounded-full">
                  <span className="w-2 h-2 bg-[#00f2ff] rounded-full animate-ping" />
                  <p className="text-[#00f2ff] text-[8px] font-black uppercase italic tracking-widest">Protocol Active</p>
                </div>
                <h2 className="text-6xl md:text-[8rem] font-black italic uppercase leading-[0.8] tracking-tighter">Scale Your <br /> <span className="text-transparent bg-clip-text bg-linear-to-r from-[#00f2ff] via-blue-400 to-blue-600">Talent</span></h2>
                <p className="text-gray-400 max-w-md text-sm md:text-base leading-relaxed font-medium italic">Execute mission-critical tasks and clear tactical settlements with zero-latency overhead.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 pt-4">
                <SignUpButton mode="modal">
                  <button className="px-12 py-6 bg-[#00f2ff] text-black font-black rounded-[25px] uppercase text-[12px] italic hover:scale-110 hover:-rotate-2 transition-all shadow-[0_20px_50px_rgba(0,242,255,0.4)]">Get Started Now →</button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <button className="px-12 py-6 border border-white/10 text-white font-black rounded-[25px] uppercase text-[12px] italic hover:bg-white/5 transition-all">Resume Session</button>
                </SignInButton>
              </div>
            </div>

            <div className="relative animate-in zoom-in-95 duration-1000 delay-300">
              <div className="relative z-10 rounded-[60px] overflow-hidden border border-white/10 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1593062096033-9a26b09da705?q=80&w=2000&auto=format&fit=crop" alt="WFH" className="w-full h-137.5 md:h-162.5 object-cover opacity-80" />
                <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-transparent to-transparent" />
              </div>
              <div className="absolute top-10 left-10 z-20 px-6 py-4 bg-black/60 backdrop-blur-2xl border border-[#00f2ff]/30 rounded-2xl animate-bounce duration-[4s] shadow-2xl">
                <p className="text-[10px] font-black uppercase text-[#00f2ff]">👤 1.5M+ Nodes</p>
              </div>
              <div className="absolute bottom-20 right-10 z-20 px-6 py-4 bg-black/60 backdrop-blur-2xl border border-emerald-500/30 rounded-2xl animate-bounce duration-[6s] shadow-2xl">
                <p className="text-[10px] font-black uppercase text-emerald-400">💰 $2M+ Yield</p>
              </div>
            </div>
          </div>

          <section className="grid md:grid-cols-2 gap-8">
            <div className="p-10 bg-white/5 border border-white/10 rounded-[50px] hover:border-[#00f2ff]/50 transition-all group">
              <div className="w-16 h-16 bg-[#00f2ff]/10 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:bg-[#00f2ff] group-hover:text-black transition-all">💼</div>
              <h3 className="text-3xl font-black italic uppercase mb-4">Freelancer Guide</h3>
              <p className="text-gray-500 text-sm italic font-bold uppercase tracking-widest leading-relaxed">Sync your node, browse tactical missions, and settle your yield in USD instantly post-execution.</p>
            </div>
            <div className="p-10 bg-white/5 border border-white/10 rounded-[50px] hover:border-purple-500/50 transition-all group">
              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:bg-purple-500 transition-all">🎯</div>
              <h3 className="text-3xl font-black italic uppercase mb-4">Client Guide</h3>
              <p className="text-gray-500 text-sm italic font-bold uppercase tracking-widest leading-relaxed">Deploy high-priority missions, recruit elite talent nodes, and manage payments via secure escrow.</p>
            </div>
          </section>

          <section className="relative overflow-hidden py-14 border-y border-white/5">
            <div className="flex gap-10 animate-marquee whitespace-nowrap marquee-container">
              {[...reviews, ...reviews].map((r, i) => (
                <div key={i} className="inline-flex items-center gap-5 bg-black/40 border border-white/10 p-5 rounded-[30px] min-w-[320px] backdrop-blur-3xl">
                  <img src={r.img} alt={r.name} className="w-12 h-12 rounded-full border-2 border-[#00f2ff]" />
                  <div className="text-left">
                    <p className="text-[11px] font-black uppercase italic text-white leading-none">{r.name}</p>
                    <div className="flex gap-0.5 mt-2 text-yellow-500 text-[10px] drop-shadow-[0_0_5px_#f59e0b]">
                        {[...Array(r.stars)].map((_, si) => <span key={si}>★</span>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 pb-20">
            {sponsors.map((brand) => (
              <div key={brand.name} className="bg-white/5 border border-white/10 backdrop-blur-3xl p-4 rounded-[25px] flex items-center justify-center h-20 hover:bg-white transition-all duration-500 group">
                <img src={brand.logo} alt={brand.name} className="max-h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
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

  // --- 2. PATH SELECTION ---
  if (step === "path") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/5 blur-[120px] rounded-full animate-pulse" />
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl w-full animate-in zoom-in-95 duration-700">
           <button onClick={() => handleRoleSelect('freelancer')} className="p-16 bg-white/5 border border-white/10 rounded-[60px] text-left group hover:border-[#00f2ff] transition-all">
              <div className="w-20 h-20 bg-[#00f2ff]/10 rounded-3xl flex items-center justify-center text-4xl mb-10 group-hover:bg-[#00f2ff] group-hover:text-black transition-all">💼</div>
              <h3 className="text-4xl font-black italic uppercase text-white mb-2 tracking-tighter">Freelancer</h3>
              <p className="text-xs text-gray-500 uppercase font-black italic tracking-widest">Execute Missions & Earn USD.</p>
           </button>
           <button onClick={() => handleRoleSelect('client')} className="p-16 bg-white/5 border border-white/10 rounded-[60px] text-left group hover:border-purple-500 transition-all">
              <div className="w-20 h-20 bg-purple-500/10 rounded-3xl flex items-center justify-center text-4xl mb-10 group-hover:bg-purple-500 transition-all">🎯</div>
              <h3 className="text-4xl font-black italic uppercase text-white mb-2 tracking-tighter">Client</h3>
              <p className="text-xs text-gray-500 uppercase font-black italic tracking-widest">Deploy Gigs & Recruit Talent.</p>
           </button>
        </div>
      </div>
    );
  }

  // --- 3. SURVEY ---
  if (step === "survey") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6">
        <div className="max-w-md w-full bg-black/60 backdrop-blur-3xl border border-white/10 p-12 rounded-[50px] relative z-10 animate-in slide-in-from-bottom-10">
           <div className="flex justify-between items-center mb-10 text-white font-black italic uppercase text-[10px] tracking-widest">
              <p className="text-[#00f2ff]">Protocol Calibration</p>
              <p>Step {currentQuestion + 1} / 10</p>
           </div>
           <h2 className="text-2xl font-black italic uppercase text-white mb-10 border-l-4 border-[#00f2ff] pl-6 leading-tight">{surveyQuestions[currentQuestion].q}</h2>
           <div className="grid gap-4">
              {surveyQuestions[currentQuestion].options.map(o => (
                <button key={o} onClick={handleSurveyAnswer} className="w-full py-5 px-8 bg-white/5 border border-white/10 rounded-2xl text-left text-[11px] font-black uppercase italic hover:bg-white hover:text-black transition-all active:scale-95">{o}</button>
              ))}
           </div>
        </div>
      </div>
    );
  }

  // --- 4. 3D MODERN LOADING ---
  if (step === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] p-6 relative">
        <div className="relative z-10 w-full max-w-sm text-center">
           <div className="relative mb-16">
              <div className="w-28 h-28 border-4 border-white/10 rounded-full mx-auto" />
              <div className="absolute inset-0 w-28 h-28 border-t-2 border-[#00f2ff] rounded-full animate-spin mx-auto shadow-[0_0_50px_#00f2ff55]" />
           </div>
           <h2 className="text-3xl font-black italic uppercase text-[#00f2ff] mb-12 animate-pulse tracking-[0.3em]">Synchronizing Node</h2>
           <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
              <div className="h-full bg-linear-to-r from-[#00f2ff] to-blue-500 transition-all duration-300" style={{ width: `${loadingProgress}%` }} />
           </div>
           <div className="flex justify-between w-full mt-6 text-[10px] font-black uppercase italic tracking-widest text-gray-500">
              <p>Holographic Uplink Active</p>
              <p className="text-[#00f2ff]">{loadingProgress}%</p>
           </div>
        </div>
      </div>
    );
  }

  // --- 5. DASHBOARD ---
  if (step === "dashboard") {
    return (
      <main className="min-h-screen bg-[#020617] animate-in fade-in duration-1000">
        {selectedRole === "freelancer" ? <FreelancerView jobs={[]} userMetadata={user?.publicMetadata || {}} /> : <ClientView jobs={[]} />}
      </main>
    );
  }

  return null;
}