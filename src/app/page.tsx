"use client";

import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useEffect, useState, useCallback, useMemo } from "react";
import { FreelancerView } from "@/components/dashboard/FreelancerView";
import { ClientView } from "@/components/dashboard/ClientView";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Zap, Globe, Cpu, Lock, CheckCircle2 } from "lucide-react";

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
        {/* BACKGROUND AMBIENCE */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#00f2ff]/5 blur-[120px] animate-pulse delay-700" />
        </div>

        <header className="fixed top-0 w-full h-20 z-50 flex items-center justify-between px-8 bg-[#020617]/40 backdrop-blur-xl border-b border-white/5">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#00f2ff] rounded-lg rotate-45 flex items-center justify-center shadow-[0_0_15px_rgba(0,242,255,0.4)]">
              <div className="w-4 h-4 bg-[#020617] rounded-sm -rotate-45" />
            </div>
            <h1 className="text-xl font-black italic uppercase tracking-tighter">
              NEXUS<span className="text-[#00f2ff]">GIGS</span>
            </h1>
          </motion.div>
          <div className="flex items-center gap-6">
             <SignInButton mode="modal">
               <button className="text-[10px] font-black uppercase italic tracking-widest text-gray-400 hover:text-[#00f2ff] transition-colors">Login</button>
             </SignInButton>
             <SignUpButton mode="modal">
               <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-2.5 bg-white text-black text-[10px] font-black uppercase italic rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                 Initialize Uplink
               </motion.button>
             </SignUpButton>
          </div>
        </header>

        <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 space-y-40">
          {/* HERO SECTION */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
                  <span className="w-1.5 h-1.5 bg-[#00f2ff] rounded-full animate-ping" />
                  <p className="text-[#00f2ff] text-[8px] font-black uppercase italic tracking-widest">Global Node Network Live</p>
                </div>
                <h2 className="text-7xl md:text-[9.5rem] font-black italic uppercase leading-[0.75] tracking-tighter">
                  COMMAND <br /> 
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-[#00f2ff] via-blue-400 to-indigo-500 drop-shadow-[0_0_30px_rgba(0,242,255,0.2)]">
                    YOUR FUTURE
                  </span>
                </h2>
                <p className="text-gray-400 max-w-lg text-sm md:text-lg leading-relaxed font-medium italic border-l-2 border-[#00f2ff]/30 pl-6">
                  The ultimate tactical relay for high-command freelancers. 
                  Deploy code, secure settlements, and scale your global influence with zero latency.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 pt-4">
                <SignUpButton mode="modal">
                  <button className="group relative px-12 py-6 bg-[#00f2ff] text-black font-black rounded-2xl uppercase text-[12px] italic transition-all overflow-hidden shadow-[0_0_30px_rgba(0,242,255,0.3)]">
                    <span className="relative z-10">Get Started Now →</span>
                    <div className="absolute inset-0 bg-white translate-y-16 group-hover:translate-y-0 transition-transform duration-300" />
                  </button>
                </SignUpButton>
                <div className="flex items-center gap-4 px-6 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
                  <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-8 h-8 rounded-full border-2 border-[#020617]" />
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 italic">400+ Nodes online</p>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="relative group">
              <div className="absolute inset-0 bg-[#00f2ff]/20 blur-[100px] rounded-full group-hover:bg-[#00f2ff]/30 transition-all duration-700" />
              <div className="relative z-10 rounded-[60px] p-2 bg-linear-to-br from-white/20 to-transparent backdrop-blur-3xl border border-white/10 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200" 
                  alt="Interface" 
                  className="w-full h-125 object-cover rounded-[50px] mix-blend-lighten opacity-80 group-hover:scale-110 transition-transform duration-[5s]"
                />
                <div className="absolute inset-0 rounded-[50px] bg-linear-to-t from-[#020617] via-transparent to-transparent" />
              </div>
              <div className="absolute -top-6 -right-6 z-20 px-6 py-4 bg-[#020617] border border-[#00f2ff]/50 rounded-2xl shadow-[0_0_30px_rgba(0,242,255,0.2)]">
                <p className="text-[10px] font-black uppercase text-[#00f2ff] flex items-center gap-2">
                  <Lock size={12} /> Encryption Active
                </p>
              </div>
            </motion.div>
          </div>

          {/* FEATURE GRID */}
          <section className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Shield className="text-[#00f2ff]" />, title: "Escrow v3", desc: "Military-grade fund protection via cryptographic smart-locking." },
              { icon: <Zap className="text-yellow-400" />, title: "Flash Payout", desc: "Settlements hit your M-Pesa or Bank account in under 60 seconds." },
              { icon: <Globe className="text-blue-400" />, title: "Elite Missions", desc: "Exclusive access to tactical projects from Fortune 500 tech leads." }
            ].map((card, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} className="group p-10 bg-white/2 border border-white/5 rounded-[50px] hover:bg-white/4 hover:border-[#00f2ff]/30 transition-all duration-500">
                <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform shadow-xl">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-black italic uppercase text-white mb-4 tracking-tighter">{card.title}</h3>
                <p className="text-gray-500 text-xs font-bold uppercase leading-relaxed italic tracking-wide">{card.desc}</p>
              </motion.div>
            ))}
          </section>

          {/* MARQUEE REVIEWS */}
          <section className="relative py-20 overflow-hidden">
             <div className="absolute inset-0 bg-linear-to-r from-[#020617] via-transparent to-[#020617] z-20 pointer-events-none" />
             <div className="flex gap-10 animate-marquee whitespace-nowrap overflow-hidden">
               {[...reviews, ...reviews].map((r, i) => (
                 <div key={i} className="inline-flex items-center gap-5 bg-white/3 border border-white/10 p-6 rounded-[30px] min-w-75 backdrop-blur-md hover:bg-white/6 transition-colors">
                   <img src={r.img} alt={r.name} className="w-12 h-12 rounded-full border-2 border-[#00f2ff]/50" />
                   <div>
                     <p className="text-[11px] font-black uppercase italic text-white tracking-widest">{r.name}</p>
                     <p className="text-[8px] text-[#00f2ff] font-bold uppercase italic">{r.role}</p>
                     <div className="flex gap-1 mt-2 text-yellow-500 text-[10px]">
                        {[...Array(r.stars)].map((_, si) => <span key={si} className="drop-shadow-[0_0_5px_#f59e0b]">★</span>)}
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </section>

          {/* SPONSORS */}
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
          .animate-marquee { animation: marquee 50s linear infinite; }
        `}</style>
      </div>
    );
  }

  // --- 2. PATH SELECTION ---
  if (step === "path") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6 relative">
        <div className="fixed inset-0 bg-blue-600/5 blur-[150px] pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl w-full">
           <motion.button 
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             onClick={() => handleRoleSelect('freelancer')} 
             className="p-16 bg-white/2 border border-white/5 rounded-[60px] text-left group hover:border-[#00f2ff]/50 transition-all backdrop-blur-xl"
           >
              <div className="w-20 h-20 bg-[#00f2ff]/10 rounded-3xl flex items-center justify-center text-4xl mb-10 group-hover:bg-[#00f2ff] group-hover:text-black transition-all">💼</div>
              <h3 className="text-4xl font-black italic uppercase text-white mb-2 tracking-tighter">Freelancer</h3>
              <p className="text-xs text-gray-500 uppercase font-black italic tracking-widest">Execute Missions & Earn USD.</p>
           </motion.button>
           <motion.button 
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             onClick={() => handleRoleSelect('client')} 
             className="p-16 bg-white/2 border border-white/5 rounded-[60px] text-left group hover:border-purple-500/50 transition-all backdrop-blur-xl"
           >
              <div className="w-20 h-20 bg-purple-500/10 rounded-3xl flex items-center justify-center text-4xl mb-10 group-hover:bg-purple-500 transition-all">🎯</div>
              <h3 className="text-4xl font-black italic uppercase text-white mb-2 tracking-tighter">Client</h3>
              <p className="text-xs text-gray-500 uppercase font-black italic tracking-widest">Deploy Gigs & Recruit Talent.</p>
           </motion.button>
        </div>
      </div>
    );
  }

  // --- 3. SURVEY ---
  if (step === "survey") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white/2 backdrop-blur-3xl border border-white/10 p-12 rounded-[50px] relative z-10"
        >
           <p className="text-[10px] font-black text-[#00f2ff] uppercase italic mb-8 tracking-widest">Step {currentQuestion + 1} / 10</p>
           <h2 className="text-2xl font-black italic uppercase text-white mb-10 border-l-4 border-[#00f2ff] pl-6 leading-tight">{surveyQuestions[currentQuestion].q}</h2>
           <div className="grid gap-4">
              {surveyQuestions[currentQuestion].options.map(o => (
                <button key={o} onClick={handleSurveyAnswer} className="w-full py-5 px-8 bg-white/5 border border-white/10 rounded-2xl text-left text-[10px] font-black uppercase italic hover:bg-white hover:text-black transition-all">{o}</button>
              ))}
           </div>
        </motion.div>
      </div>
    );
  }

  // --- 4. LOADING ---
  if (step === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] p-6 relative">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 border-t-2 border-[#00f2ff] rounded-full mb-10 shadow-[0_0_40px_rgba(0,242,255,0.3)]" 
        />
        <h2 className="text-2xl font-black italic uppercase text-[#00f2ff] animate-pulse tracking-widest">Syncing Node...</h2>
        <div className="w-full max-w-xs h-1 bg-white/5 rounded-full overflow-hidden mt-6">
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: `${loadingProgress}%` }}
             className="h-full bg-linear-to-r from-[#00f2ff] to-blue-500" 
           />
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