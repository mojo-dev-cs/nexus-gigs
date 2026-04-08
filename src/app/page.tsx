"use client";

import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useEffect, useState, useCallback, useMemo } from "react";
import { FreelancerView } from "@/components/dashboard/FreelancerView";
import { ClientView } from "@/components/dashboard/ClientView";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, Zap, Globe, Cpu, Lock, Rocket, 
  MousePointer2, Sparkles, Layers, Box, 
  Terminal, Target, Users, DollarSign, 
  Briefcase, ZapIcon, BarChart3, ChevronRight,
  Activity, Fingerprint, Code, Database, Search, MessageSquare
} from "lucide-react";

// --- 🌌 ROCKET WARP ANIMATION ---
const RocketWarp = ({ active }: { active: boolean }) => (
  <AnimatePresence>
    {active && (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-150 flex items-center justify-center pointer-events-none bg-[#020617]/60 backdrop-blur-md"
      >
        <motion.div
          initial={{ y: 800, scale: 0.5, opacity: 1 }}
          animate={{ y: -1500, scale: 3, opacity: [1, 1, 0] }}
          transition={{ duration: 0.8, ease: "easeIn" }}
          className="relative"
        >
          <Rocket size={100} className="text-[#00f2ff] fill-[#00f2ff] drop-shadow-[0_0_50px_#00f2ff]" />
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-10 h-80 bg-linear-to-t from-transparent via-blue-500 to-[#00f2ff] blur-2xl" />
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

  // --- 📝 OFFICIAL SURVEY DATA ---
  const surveyQuestions = useMemo(() => [
    { 
      q: "What is your main reason for joining NexusGigs?", 
      options: ["I want to find freelance work and earn money", "I want to hire freelancers for my projects", "I want to do both (freelance and hire)", "Just exploring the platform for now"] 
    },
    { 
      q: "What is your primary goal on NexusGigs?", 
      options: ["Find and apply for gigs quickly", "Build long-term client relationships", "Earn more income from freelance work", "Hire reliable freelancers for my projects", "Explore opportunities (just browsing)"] 
    },
    { 
      q: "How experienced are you as a freelancer?", 
      options: ["Beginner (just starting)", "Intermediate (have done a few projects)", "Experienced (regular freelance work)", "Professional (full-time freelancer)"] 
    },
    { 
      q: "Which categories are you most interested in?", 
      options: ["Web & App Development", "Graphic Design & UI/UX", "Writing & Content Creation", "Digital Marketing & SEO", "Video Editing & Animation", "Data Entry & Virtual Assistance", "Other"] 
    },
    { 
      q: "What is your preferred way of working?", 
      options: ["Short-term gigs (1–7 days)", "Medium projects (1–4 weeks)", "Long-term or ongoing work", "One-off tasks"] 
    },
    { 
      q: "Where are you located?", 
      options: ["Kenya", "Other African country", "Europe", "North America", "Asia", "Other"] 
    },
    { 
      q: "How did you hear about NexusGigs?", 
      options: ["Instagram / TikTok", "WhatsApp / Friend referral", "Google Search", "Facebook", "Other"] 
    },
    { 
      q: "What payment method do you prefer?", 
      options: ["M-Pesa (Kenya)", "Binance / Crypto", "Bank Transfer", "PayPal or International", "No preference"] 
    },
    { 
      q: "Would you like personalized gig recommendations?", 
      options: ["Yes, show me relevant gigs right away", "Yes, but only after I complete my profile", "No thanks"] 
    },
    { 
      q: "Anything else we should know?", 
      options: [], 
      isOptional: true 
    },
  ], []);

  // --- 🛡️ PERSISTENCE PROTOCOL ---
  useEffect(() => {
    setMounted(true);
    if (isLoaded) {
      if (!isSignedIn) {
        setStep("landing");
      } else {
        // If user metadata says they have a role, skip to dashboard
        const savedRole = user?.publicMetadata?.role || localStorage.getItem(`nexus_onboard_role_${user.id}`);
        if (savedRole) {
          setSelectedRole(savedRole as string);
          setStep("dashboard");
        } else {
          setStep("path");
        }
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
            // Save role selection to prevent survey re-prompts
            if (user?.id) {
              localStorage.setItem(`nexus_onboard_role_${user.id}`, selectedRole!);
            }
            setStep("dashboard");
          }
        }, 30);
      });
    }
  }, [currentQuestion, selectedRole, user?.id, surveyQuestions.length]);

  if (!mounted || !isLoaded || step === "checking") return <div className="min-h-screen bg-[#020617]" />;

  // --- 🏠 VIEW: HIGH-TIER 3D LANDING ---
  if (step === "landing") {
    return (
      <div className="min-h-screen bg-[#020617] text-white relative font-sans overflow-x-hidden selection:bg-[#00f2ff]/30">
        <RocketWarp active={isWarping} />
        
        {/* Background Ambience */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-150 h-150 bg-blue-600/10 blur-[150px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-150 h-150 bg-[#00f2ff]/5 blur-[150px] rounded-full" />
          <div className="stars-animation opacity-20" />
        </div>

        {/* Header */}
        <header className="fixed top-0 w-full h-24 z-50 flex items-center justify-between px-10 bg-[#020617]/40 backdrop-blur-2xl border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-[#00f2ff] to-blue-600 rounded-xl rotate-45 flex items-center justify-center shadow-[0_0_20px_#00f2ff]">
              <Terminal size={20} className="text-[#020617] -rotate-45" />
            </div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">NEXUS<span className="text-[#00f2ff]">GIGS</span></h1>
          </div>
          <div className="flex gap-8 items-center">
             <SignInButton mode="modal">
                <button className="text-[11px] font-black uppercase italic tracking-widest text-gray-400 hover:text-white transition-all">Console Login</button>
             </SignInButton>
             <SignUpButton mode="modal">
                <button className="px-10 py-3.5 bg-white text-black text-[11px] font-black uppercase italic rounded-full shadow-2xl hover:bg-[#00f2ff] transition-all tracking-widest active:scale-95">Uplink Account</button>
             </SignUpButton>
          </div>
        </header>

        {/* Hero Section */}
        <main className="relative z-10 max-w-7xl mx-auto px-8 pt-48 pb-32">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-[#00f2ff]/10 border border-[#00f2ff]/20 rounded-full">
                <Sparkles size={14} className="text-[#00f2ff]" />
                <p className="text-[#00f2ff] text-[10px] font-black uppercase italic tracking-widest">Protocol v4.0 Active</p>
              </div>
              <h2 className="text-8xl md:text-[10rem] font-black italic uppercase leading-[0.8] tracking-tighter">
                EVOLVE <br /> <span className="text-transparent bg-clip-text bg-linear-to-r from-[#00f2ff] to-blue-500">BEYOND</span>
              </h2>
              <p className="text-gray-400 max-w-md text-xl leading-relaxed font-medium italic border-l-4 border-[#00f2ff]/40 pl-8">
                Command high-tier code. Secure global settlements. The future is your mission.
              </p>
              <div className="flex gap-6">
                <SignUpButton mode="modal">
                   <button className="group flex items-center gap-4 bg-white text-black px-10 py-5 rounded-2xl font-black uppercase italic text-xs hover:bg-[#00f2ff] transition-all shadow-[0_20px_50px_rgba(0,242,255,0.2)]">
                      Initialize Sync <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                   </button>
                </SignUpButton>
              </div>
            </motion.div>

            {/* Live Stats */}
            <div className="relative">
               <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 rounded-[60px] overflow-hidden border-2 border-white/10 shadow-3xl bg-[#020617]">
                 <img src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200" alt="Nexus Terminal" className="w-full h-125 object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000" />
                 <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-transparent to-transparent" />
               </motion.div>
               <div className="absolute -bottom-12 -left-12 -right-12 grid grid-cols-2 md:grid-cols-4 gap-4 z-20">
                  {[
                    { label: "Active Nodes", val: "1.2M+", icon: <Activity className="text-[#00f2ff]"/> },
                    { label: "Total Revenue", val: "$38M+", icon: <DollarSign className="text-emerald-400"/> },
                    { label: "Live Gigs", val: "12K+", icon: <Briefcase className="text-purple-500"/> },
                    { label: "Stability", val: "99.9%", icon: <Zap className="text-orange-400"/> }
                  ].map((stat, i) => (
                    <motion.div key={i} whileHover={{ y: -10 }} className="bg-black/80 backdrop-blur-2xl border border-white/10 p-6 rounded-[30px] shadow-3xl">
                       <div className="mb-3">{stat.icon}</div>
                       <p className="text-xl font-black text-white">{stat.val}</p>
                       <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                    </motion.div>
                  ))}
               </div>
            </div>
          </div>
        </main>
        
        <style jsx global>{`
          .stars-animation {
            position: absolute; inset: 0;
            background-image: radial-gradient(circle at center, white 1px, transparent 1px);
            background-size: 100px 100px;
            animation: move-stars 250s linear infinite;
          }
          @keyframes move-stars { from { transform: translateY(0); } to { transform: translateY(-2000px); } }
        `}</style>
      </div>
    );
  }

  // --- 🛣️ VIEW: PATH SELECTION ---
  if (step === "path") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] p-8">
        <RocketWarp active={isWarping} />
        <div className="grid md:grid-cols-2 gap-10 max-w-6xl w-full">
           <button onClick={() => handleRoleSelect('freelancer')} className="p-20 bg-white/3 border border-white/10 rounded-[70px] text-left group hover:border-[#00f2ff] transition-all backdrop-blur-xl relative overflow-hidden shadow-3xl">
              <div className="w-24 h-24 bg-[#00f2ff]/10 rounded-[35px] flex items-center justify-center text-[#00f2ff] mb-12 group-hover:bg-[#00f2ff] group-hover:text-black transition-all shadow-glow"><Code size={48}/></div>
              <h3 className="text-5xl font-black italic uppercase text-white mb-4 tracking-tighter">Freelancer</h3>
              <p className="text-sm text-gray-500 uppercase font-black italic tracking-widest">Execute High-Tier Missions.</p>
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#00f2ff]/5 rounded-full blur-[80px]" />
           </button>
           <button onClick={() => handleRoleSelect('client')} className="p-20 bg-white/3 border border-white/10 rounded-[70px] text-left group hover:border-purple-500 transition-all backdrop-blur-xl relative overflow-hidden shadow-3xl">
              <div className="w-24 h-24 bg-purple-500/10 rounded-[35px] flex items-center justify-center text-purple-500 mb-12 group-hover:bg-purple-500 group-hover:text-black transition-all shadow-glow"><Target size={48}/></div>
              <h3 className="text-5xl font-black italic uppercase text-white mb-4 tracking-tighter">Client</h3>
              <p className="text-sm text-gray-400 uppercase font-black italic tracking-widest">Deploy Gigs & Build Teams.</p>
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px]" />
           </button>
        </div>
      </div>
    );
  }

  // --- 📝 VIEW: SURVEY MATRIX (UPDATED QUESTIONS) ---
  if (step === "survey") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] p-8">
        <RocketWarp active={isWarping} />
        <div className="max-w-xl w-full bg-black/60 backdrop-blur-[100px] border border-white/10 p-16 rounded-[80px] shadow-3xl relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#00f2ff] to-transparent shadow-glow" />
          <p className="text-[11px] font-black text-[#00f2ff] uppercase italic mb-10 tracking-[0.4em]">Node Sync {currentQuestion + 1} / {surveyQuestions.length}</p>
          <h2 className="text-3xl font-black italic uppercase text-white mb-12 leading-tight border-l-8 border-[#00f2ff] pl-8">{surveyQuestions[currentQuestion].q}</h2>
          
          <div className="grid gap-4 max-h-100 overflow-y-auto no-scrollbar pr-2">
            {surveyQuestions[currentQuestion].options.length > 0 ? (
              surveyQuestions[currentQuestion].options.map(o => (
                <button key={o} onClick={handleSurveyAnswer} className="w-full py-6 px-10 bg-white/5 border border-white/10 rounded-3xl text-left text-[12px] font-black uppercase italic hover:bg-white hover:text-black transition-all tracking-widest shadow-xl">{o}</button>
              ))
            ) : (
              <div className="space-y-6">
                <textarea 
                  placeholder="Transmit additional node data..." 
                  className="w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-white text-sm font-bold outline-none focus:border-[#00f2ff] transition-all" 
                  rows={4} 
                />
                <button onClick={handleSurveyAnswer} className="w-full py-6 bg-[#00f2ff] text-black font-black rounded-3xl uppercase italic text-[11px] hover:scale-105 transition-all shadow-glow">Finalize Uplink</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- 🔄 VIEW: LOADING ---
  if (step === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] p-10">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-32 h-32 border-t-2 border-b-2 border-[#00f2ff] rounded-full mb-12 shadow-[0_0_60px_rgba(0,242,255,0.4)]" />
        <h2 className="text-3xl font-black italic uppercase text-[#00f2ff] animate-pulse tracking-[0.5em]">Synchronizing...</h2>
        <div className="w-full max-w-md h-1.5 bg-white/5 rounded-full overflow-hidden mt-10 shadow-inner">
           <motion.div 
             className="h-full bg-linear-to-r from-[#00f2ff] to-blue-500 shadow-glow" 
             initial={{ width: 0 }} 
             animate={{ width: `${loadingProgress}%` }} 
           />
        </div>
      </div>
    );
  }

  // --- 🖥️ VIEW: DASHBOARD ---
  if (step === "dashboard") {
    return (
      <main className="min-h-screen bg-[#020617]">
        {selectedRole === "freelancer" ? (
          <FreelancerView jobs={[]} userMetadata={user?.publicMetadata || {}} />
        ) : (
          <ClientView jobs={[]} />
        )}
      </main>
    );
  }

  return <div className="min-h-screen bg-[#020617]" />;
}