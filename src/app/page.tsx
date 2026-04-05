"use client";

import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useEffect, useState, useCallback, useMemo } from "react";
import { FreelancerView } from "@/components/dashboard/FreelancerView";
import { ClientView } from "@/components/dashboard/ClientView";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Zap, Globe, Cpu, Lock, Rocket, MousePointer2, Sparkles, Layers, Box, Terminal, Target, Users, DollarSign, Briefcase, ZapIcon } from "lucide-react";

// --- ROCKET WARP ANIMATION ---
const RocketWarp = ({ active }: { active: boolean }) => (
  <AnimatePresence>
    {active && (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-100 flex items-center justify-center pointer-events-none"
      >
        <motion.div
          initial={{ y: 800, scale: 0.5, opacity: 1 }}
          animate={{ y: -1500, scale: 3, opacity: [1, 1, 0] }}
          transition={{ duration: 0.8, ease: "easeIn" }}
          className="relative"
        >
          <Rocket size={100} className="text-[#00f2ff] fill-[#00f2ff] drop-shadow-[0_0_50px_#00f2ff]" />
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-10 h-60 bg-linear-to-t from-transparent via-blue-500 to-[#00f2ff] blur-xl" />
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [mounted, setMounted] = useState(false);
  const [isWarping, setIsWarping] = useState(false);
  const [step, setStep] = useState<"checking" | "landing" | "path" | "survey" | "loading" | "dashboard">("checking");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const reviews = useMemo(() => [
    { name: "Alex K.", role: "Fullstack Node", img: "https://i.pravatar.cc/150?u=1", stars: 5 },
    { name: "Sarah M.", role: "UI/UX Architect", img: "https://i.pravatar.cc/150?u=2", stars: 5 },
    { name: "John D.", role: "Python Specialist", img: "https://i.pravatar.cc/150?u=3", stars: 4 },
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
        const savedRole = localStorage.getItem(`nexus_user_role_${user.id}`);
        if (savedRole) { setSelectedRole(savedRole); setStep("dashboard"); }
        else setStep("path");
      }
    }
  }, [isLoaded, isSignedIn, user]);

  const triggerWarp = (callback: () => void) => {
    setIsWarping(true);
    setTimeout(() => { callback(); setIsWarping(false); }, 700);
  };

  const handleRoleSelect = (role: string) => {
    triggerWarp(() => { setSelectedRole(role); setStep("survey"); });
  };

  const handleSurveyAnswer = useCallback(() => {
    if (currentQuestion < surveyQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      triggerWarp(() => {
        setStep("loading");
        let p = 0;
        const inv = setInterval(() => {
          p += 2;
          setLoadingProgress(p);
          if (p >= 100) {
            clearInterval(inv);
            if (user?.id) localStorage.setItem(`nexus_user_role_${user.id}`, selectedRole!);
            setStep("dashboard");
          }
        }, 30);
      });
    }
  }, [currentQuestion, selectedRole, user?.id, surveyQuestions.length]);

  if (!mounted || !isLoaded || step === "checking") return <div className="min-h-screen bg-[#020617]" />;

  if (step === "landing") {
    return (
      <motion.div 
        animate={isWarping ? { scale: 1.2, filter: "blur(20px)", opacity: 0 } : { scale: 1, filter: "blur(0px)", opacity: 1 }}
        className="min-h-screen text-white relative font-sans overflow-x-hidden bg-[#020617]"
      >
        <RocketWarp active={isWarping} />
        
        {/* SPACE BACKGROUND */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,242,255,0.05)_0%,transparent_70%)]" />
          <div className="stars-animation" />
        </div>

        <header className="fixed top-0 w-full h-20 z-50 flex items-center justify-between px-8 bg-[#020617]/60 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-linear-to-br from-[#00f2ff] to-blue-600 rounded-lg rotate-45 flex items-center justify-center shadow-[0_0_15px_#00f2ff]">
              <Terminal size={16} className="text-[#020617] -rotate-45" />
            </div>
            <h1 className="text-xl font-black italic uppercase tracking-tighter">NEXUS<span className="text-[#00f2ff]">GIGS</span></h1>
          </div>
          <div className="flex gap-6 items-center">
             <SignInButton mode="modal">
               <button onClick={() => triggerWarp(() => {})} className="text-[10px] font-black uppercase italic tracking-widest text-gray-400 hover:text-[#00f2ff] transition-all">Login</button>
             </SignInButton>
             <SignUpButton mode="modal">
               <button onClick={() => triggerWarp(() => {})} className="px-8 py-2.5 bg-white text-black text-[10px] font-black uppercase italic rounded-full shadow-lg hover:bg-[#00f2ff] hover:text-black transition-all">Get Started</button>
             </SignUpButton>
          </div>
        </header>

        <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 space-y-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00f2ff]/10 border border-[#00f2ff]/20 rounded-full">
                  <Sparkles size={12} className="text-[#00f2ff]" />
                  <p className="text-[#00f2ff] text-[8px] font-black uppercase italic">V4.0 Uplink Active</p>
                </div>
                <h2 className="text-8xl md:text-[9.5rem] font-black italic uppercase leading-[0.75] tracking-tighter">
                  EVOLVE <br /> <span className="text-transparent bg-clip-text bg-linear-to-r from-[#00f2ff] to-blue-400">BEYOND</span>
                </h2>
                <p className="text-gray-400 max-w-md text-lg leading-relaxed font-medium italic border-l-2 border-[#00f2ff]/40 pl-6">Command high-tier code. Secure global settlements. The future is your mission.</p>
              </div>
              {/* HERO BUTTONS REMOVED AS REQUESTED */}
            </div>

            <div className="relative">
              <div className="relative z-10 rounded-[60px] overflow-hidden border border-white/10 shadow-2xl bg-[#020617]">
                <img src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200" alt="Tech Command" className="w-full h-125 object-cover opacity-70" />
                <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-transparent to-transparent" />
              </div>
              
              {/* MODERN STAT CARDS */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[110%] grid grid-cols-2 md:grid-cols-4 gap-4 z-20">
                {[
                  { icon: <Users size={16}/>, label: "Total Nodes", val: "1.5M+", color: "text-[#00f2ff]" },
                  { icon: <DollarSign size={16}/>, label: "Transacted", val: "$42M+", color: "text-emerald-400" },
                  { icon: <Briefcase size={16}/>, label: "Ready Gigs", val: "850+", color: "text-purple-400" },
                  { icon: <ZapIcon size={16}/>, label: "Freelancers", val: "12K+", color: "text-orange-400" }
                ].map((stat, i) => (
                  <motion.div key={i} whileHover={{ y: -5 }} className="bg-black/60 backdrop-blur-2xl border border-white/10 p-5 rounded-3xl shadow-2xl">
                    <div className={`${stat.color} mb-2`}>{stat.icon}</div>
                    <p className="text-[14px] font-black text-white">{stat.val}</p>
                    <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <section className="grid md:grid-cols-3 gap-8 pt-20 pb-32">
            {[
              { icon: <Shield size={32} />, title: "Secure Escrow", desc: "Military-grade protection." },
              { icon: <Zap size={32} />, title: "Instant Relay", desc: "M-Pesa cleared in 60s." },
              { icon: <Globe size={32} />, title: "Global Gigs", desc: "High-command missions." }
            ].map((card, i) => (
              <div key={i} className="p-10 bg-white/2 border border-white/5 rounded-[50px] hover:border-[#00f2ff]/40 transition-all group backdrop-blur-sm">
                <div className="w-14 h-14 bg-[#00f2ff]/10 rounded-2xl flex items-center justify-center text-[#00f2ff] mb-6 group-hover:scale-110 transition-transform">{card.icon}</div>
                <h3 className="text-xl font-black italic uppercase text-white mb-2">{card.title}</h3>
                <p className="text-gray-500 text-[10px] font-bold uppercase italic">{card.desc}</p>
              </div>
            ))}
          </section>
        </main>
        
        <style jsx global>{`
          .stars-animation {
            position: absolute; inset: 0;
            background-image: radial-gradient(circle at center, white 1px, transparent 1px);
            background-size: 80px 80px;
            animation: move-stars 200s linear infinite;
            opacity: 0.2;
          }
          @keyframes move-stars { from { transform: translateY(0); } to { transform: translateY(-1000px); } }
        `}</style>
      </motion.div>
    );
  }

  // --- 2. PATH SELECTION ---
  if (step === "path") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6 relative">
        <RocketWarp active={isWarping} />
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl w-full">
           <button onClick={() => handleRoleSelect('freelancer')} className="p-16 bg-white/5 border border-white/10 rounded-[60px] text-left group hover:border-[#00f2ff] transition-all backdrop-blur-xl">
              <div className="w-20 h-20 bg-[#00f2ff]/10 rounded-3xl flex items-center justify-center text-4xl mb-10 group-hover:bg-[#00f2ff] group-hover:text-black transition-all"><Box size={40}/></div>
              <h3 className="text-4xl font-black italic uppercase text-white mb-2 tracking-tighter">Freelancer</h3>
              <p className="text-xs text-gray-500 uppercase font-black italic tracking-widest">Execute Missions & Earn USD.</p>
           </button>
           <button onClick={() => handleRoleSelect('client')} className="p-16 bg-white/5 border border-white/10 rounded-[60px] text-left group hover:border-purple-500 transition-all backdrop-blur-xl">
              <div className="w-20 h-20 bg-purple-500/10 rounded-3xl flex items-center justify-center text-4xl mb-10 group-hover:bg-purple-500 transition-all"><Target size={40}/></div>
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
        <RocketWarp active={isWarping} />
        <div className="max-w-md w-full bg-black/60 backdrop-blur-3xl border border-white/10 p-12 rounded-[50px] relative z-10">
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

  // --- 4. LOADING ---
  if (step === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] p-6 relative">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-24 h-24 border-t-2 border-[#00f2ff] rounded-full mb-10 shadow-[0_0_40px_rgba(0,242,255,0.3)]" />
        <h2 className="text-2xl font-black italic uppercase text-[#00f2ff] animate-pulse tracking-widest">Syncing Node...</h2>
        <div className="w-full max-w-xs h-1 bg-white/5 rounded-full overflow-hidden mt-6">
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