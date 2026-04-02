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
    return <div className="min-h-screen bg-[#020617]" />;
  }

  // --- 1. LANDING PAGE ---
  if (step === "landing") {
    return (
      <div className="min-h-screen text-white relative font-sans selection:bg-[#00f2ff]/30 overflow-x-hidden bg-[#020617]">
        <header className="fixed top-0 w-full h-20 z-50 flex items-center justify-between px-8 bg-[#020617]/90 backdrop-blur-md border-b border-white/5">
          <h1 className="text-xl font-black italic uppercase tracking-tighter">NEXUS<span className="text-[#00f2ff]">GIGS</span></h1>
          <div className="flex gap-4">
             <SignInButton mode="modal"><button className="text-[10px] font-black uppercase italic tracking-widest hover:text-[#00f2ff]">Login</button></SignInButton>
             <SignUpButton mode="modal"><button className="px-6 py-2 bg-white text-black text-[10px] font-black uppercase italic rounded-full shadow-lg">Get Started</button></SignUpButton>
          </div>
        </header>

        <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 space-y-24">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8 animate-in slide-in-from-left-10 duration-1000">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00f2ff]/10 border border-[#00f2ff]/20 rounded-full">
                  <span className="w-1.5 h-1.5 bg-[#00f2ff] rounded-full animate-ping" />
                  <p className="text-[#00f2ff] text-[7px] font-black uppercase italic">V3.0 Uplink Active</p>
                </div>
                <h2 className="text-6xl md:text-[8rem] font-black italic uppercase leading-[0.8] tracking-tighter">Scale Your <br /> <span className="text-transparent bg-clip-text bg-linear-to-r from-[#00f2ff] to-blue-500">Talent</span></h2>
                <p className="text-gray-400 max-w-md text-sm md:text-base leading-relaxed font-medium italic">Deploy mission-critical code and manage tactical financial settlements with zero-latency overhead.</p>
              </div>

              {/* UPDATED BUTTONS UNDER THE TEXT */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <SignUpButton mode="modal">
                  <button className="px-10 py-5 bg-[#00f2ff] text-black font-black rounded-2xl uppercase text-[11px] italic hover:scale-105 transition-all shadow-xl shadow-[#00f2ff]/20">Get Started →</button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <button className="px-10 py-5 border border-white/10 text-white font-black rounded-2xl uppercase text-[11px] italic hover:bg-white/5 transition-all">Login</button>
                </SignInButton>
              </div>
            </div>

            <div className="relative animate-in zoom-in-95 duration-1000 delay-300">
              <div className="relative z-10 rounded-[50px] overflow-hidden border border-white/10 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1593062096033-9a26b09da705?q=80&w=1200" alt="Work Space" className="w-full h-125 object-cover opacity-80" />
                <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-transparent to-transparent" />
              </div>
              <div className="absolute top-10 left-5 z-20 px-5 py-3 bg-black/60 backdrop-blur-2xl border border-[#00f2ff]/30 rounded-xl animate-bounce duration-[4s]">
                <p className="text-[9px] font-black uppercase text-[#00f2ff]">👤 1.5M+ Nodes</p>
              </div>
              <div className="absolute bottom-10 right-5 z-20 px-5 py-3 bg-black/60 backdrop-blur-2xl border border-emerald-500/30 rounded-xl animate-bounce duration-[6s]">
                <p className="text-[9px] font-black uppercase text-emerald-400">💰 $2M+ Flow (USD)</p>
              </div>
            </div>
          </div>

          <section className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "🛡️", title: "Secure Escrow", desc: "USD funds are locked in cryptographic vaults until mission completion." },
              { icon: "⚡", title: "Instant Relay", desc: "Payouts are cleared via M-Pesa or Direct Bank in under 60 seconds." },
              { icon: "🌍", title: "Global Gigs", desc: "Access high-tier tactical missions from premium international clients." }
            ].map((card, i) => (
              <div key={i} className="p-8 bg-white/3 border border-white/10 rounded-[40px] hover:border-[#00f2ff]/40 transition-all group shadow-2xl">
                <div className="w-14 h-14 bg-[#00f2ff]/10 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">{card.icon}</div>
                <h3 className="text-xl font-black italic uppercase text-white mb-3 tracking-tight">{card.title}</h3>
                <p className="text-gray-500 text-[10px] font-bold uppercase leading-relaxed italic">{card.desc}</p>
              </div>
            ))}
          </section>

          <section className="relative overflow-hidden py-10 border-y border-white/5">
            <div className="flex gap-8 animate-marquee whitespace-nowrap">
              {[...reviews, ...reviews].map((r, i) => (
                <div key={i} className="inline-flex items-center gap-4 bg-black/40 border border-white/10 p-4 rounded-3xl min-w-70 backdrop-blur-xl">
                  <img src={r.img} alt={r.name} className="w-10 h-10 rounded-full border border-[#00f2ff]" />
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase italic text-white">{r.name}</p>
                    <div className="flex gap-0.5 mt-1 text-yellow-500 text-[9px] drop-shadow-[0_0_5px_#f59e0b]">
                        {[...Array(r.stars)].map((_, si) => <span key={si}>★</span>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 pb-20">
            {sponsors.map((brand) => (
              <div key={brand.name} className="bg-white/5 border border-white/10 backdrop-blur-3xl p-3 rounded-2xl flex items-center justify-center h-16 hover:bg-white transition-all group">
                <img src={brand.logo} alt={brand.name} className="max-h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
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

  // --- 2. PATH SELECTION ---
  if (step === "path") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6 relative">
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
           <p className="text-[10px] font-black text-[#00f2ff] uppercase italic mb-8 tracking-widest">Step {currentQuestion + 1} / 10</p>
           <h2 className="text-2xl font-black italic uppercase text-white mb-10 border-l-4 border-[#00f2ff] pl-6 leading-tight">{surveyQuestions[currentQuestion].q}</h2>
           <div className="grid gap-4">
              {surveyQuestions[currentQuestion].options.map(o => (
                <button key={o} onClick={handleSurveyAnswer} className="w-full py-5 px-8 bg-white/5 border border-white/10 rounded-2xl text-left text-[10px] font-black uppercase italic hover:bg-white hover:text-black transition-all">{o}</button>
              ))}
           </div>
        </div>
      </div>
    );
  }

  // --- 4. 3D LOADER ---
  if (step === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] p-6 relative">
        <div className="w-24 h-24 border-t-2 border-[#00f2ff] rounded-full animate-spin mb-10 shadow-[0_0_40px_rgba(0,242,255,0.3)]" />
        <h2 className="text-2xl font-black italic uppercase text-[#00f2ff] animate-pulse tracking-widest">Syncing Node...</h2>
        <div className="w-full max-w-xs h-1 bg-white/5 rounded-full overflow-hidden mt-6">
           <div className="h-full bg-linear-to-r from-[#00f2ff] to-blue-500" style={{ width: `${loadingProgress}%` }} />
        </div>
      </div>
    );
  }

  // --- 5. DASHBOARD ---
  if (step === "dashboard") {
    return (
      <main className="min-h-screen bg-[#020617]">
        {selectedRole === "freelancer" ? <FreelancerView jobs={[]} userMetadata={user?.publicMetadata || {}} /> : <ClientView jobs={[]} />}
      </main>
    );
  }

  return null;
}