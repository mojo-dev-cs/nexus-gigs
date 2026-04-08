"use client";

import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useEffect, useState, useCallback, useMemo } from "react";
import { FreelancerView } from "@/components/dashboard/FreelancerView";
import { ClientView } from "@/components/dashboard/ClientView";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, Zap, Globe, Cpu, Lock, Rocket, 
  Sparkles, Box, Terminal, Target, Users, DollarSign, 
  Briefcase, ChevronRight, Activity, Code, Database,
  ArrowRight, CheckCircle2, UserPlus, Fingerprint
} from "lucide-react";

// --- 🌌 ROCKET WARP ANIMATION ---
const RocketWarp = ({ active }: { active: boolean }) => (
  <AnimatePresence>
    {active && (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-200 flex items-center justify-center pointer-events-none bg-[#020617]/60 backdrop-blur-md"
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

  const surveyQuestions = useMemo(() => [
    { q: "Main reason for joining?", options: ["Work & Earn", "Hire freelancers", "Both", "Exploring"] },
    { q: "Primary goal?", options: ["Apply quickly", "Build relationships", "Earn more", "Hire reliably", "Browsing"] },
    { q: "Experience level?", options: ["Beginner", "Intermediate", "Experienced", "Professional"] },
    { q: "Interested Categories?", options: ["Development", "UI/UX Design", "Content", "Marketing", "Video", "VA", "Other"] },
    { q: "Working preference?", options: ["Short-term", "Medium", "Long-term", "One-off"] },
    { q: "Location?", options: ["Kenya", "Africa", "Europe", "North America", "Asia", "Other"] },
    { q: "How did you hear about us?", options: ["Social Media", "WhatsApp", "Google Search", "Facebook", "Other"] },
    { q: "Preferred payment?", options: ["M-Pesa", "Crypto", "Bank", "PayPal", "No preference"] },
    { q: "Personalized recs?", options: ["Yes, immediate", "After profile", "No thanks"] },
    { q: "Final thoughts?", options: [], isOptional: true },
  ], []);

  useEffect(() => {
    setMounted(true);
    if (isLoaded) {
      if (!isSignedIn) setStep("landing");
      else {
        const savedRole = user?.publicMetadata?.role || localStorage.getItem(`nexus_onboard_v4_${user.id}`);
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
          p += 4;
          setLoadingProgress(p);
          if (p >= 100) {
            clearInterval(inv);
            if (user?.id) localStorage.setItem(`nexus_onboard_v4_${user.id}`, selectedRole!);
            setStep("dashboard");
          }
        }, 30);
      });
    }
  }, [currentQuestion, selectedRole, user?.id, surveyQuestions.length]);

  if (!mounted || !isLoaded || step === "checking") return <div className="min-h-screen bg-[#020617]" />;

  if (step === "landing") {
    return (
      <div className="min-h-screen bg-[#020617] text-white relative font-sans overflow-x-hidden selection:bg-[#00f2ff]/30">
        <RocketWarp active={isWarping} />
        
        {/* Ambience */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-150 h-150 bg-blue-600/10 blur-[150px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-150 h-150 bg-[#00f2ff]/5 blur-[150px] rounded-full" />
        </div>

        {/* Header - Buttons are fixed here */}
        <header className="fixed top-0 w-full h-24 z-100 flex items-center justify-between px-6 md:px-16 bg-[#020617]/40 backdrop-blur-3xl border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-[#00f2ff] to-blue-600 rounded-xl rotate-45 flex items-center justify-center shadow-[0_0_20px_#00f2ff]">
              <Terminal size={20} className="text-[#020617] -rotate-45" />
            </div>
            <h1 className="text-xl font-black italic uppercase tracking-tighter">NEXUS<span className="text-[#00f2ff]">GIGS</span></h1>
          </div>
          <div className="flex gap-4 md:gap-10 items-center">
             <SignInButton mode="modal">
                <button className="text-[11px] font-black uppercase italic tracking-widest text-gray-400 hover:text-[#00f2ff] transition-all">Login</button>
             </SignInButton>
             <SignUpButton mode="modal">
                <button className="px-8 md:px-12 py-3.5 bg-white text-black text-[11px] font-black uppercase italic rounded-full shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:bg-[#00f2ff] transition-all tracking-widest active:scale-95">Get Started</button>
             </SignUpButton>
          </div>
        </header>

        {/* Hero Section */}
        <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-32">
          <div className="flex flex-col items-center text-center space-y-12">
            
            {/* Header Text - No top margin to keep it tight */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#00f2ff]/10 border border-[#00f2ff]/20 rounded-full mx-auto">
                <Sparkles size={14} className="text-[#00f2ff]" />
                <p className="text-[#00f2ff] text-[9px] font-black uppercase italic tracking-widest">Protocol v4.0 Active</p>
              </div>
              <h2 className="text-7xl md:text-[11rem] font-black italic uppercase leading-[0.75] tracking-tighter">
                EVOLVE <br /> <span className="text-transparent bg-clip-text bg-linear-to-r from-[#00f2ff] to-blue-500">BEYOND</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-xl leading-relaxed font-medium italic">
                The high-command relay for elite nodes. Secure global settlements. <br className="hidden md:block"/> Your future is our mission.
              </p>
            </motion.div>

            {/* Appealing Hero Image - Placed before steps */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: 0.2 }}
              className="relative w-full max-w-5xl group"
            >
               <div className="relative z-10 rounded-[60px] overflow-hidden border border-white/10 bg-[#020617] shadow-[0_0_100px_rgba(0,242,255,0.1)]">
                 <img 
                   src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070" 
                   alt="Nexus Hub" 
                   className="w-full h-80 md:h-140 object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" 
                 />
                 <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-transparent to-transparent" />
               </div>
               
               {/* Overlay Stats */}
               <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[90%] grid grid-cols-2 md:grid-cols-4 gap-3 z-20">
                  {[
                    { l: "Nodes", v: "1.2M+", c: <Activity size={16}/> },
                    { l: "Revenue", v: "$38M+", c: <DollarSign size={16}/> },
                    { l: "Uptime", v: "99.9%", c: <Zap size={16}/> },
                    { l: "Security", v: "MIL-SPEC", c: <Shield size={16}/> }
                  ].map((stat, i) => (
                    <div key={i} className="bg-black/80 backdrop-blur-2xl border border-white/10 p-5 rounded-3xl text-center shadow-2xl">
                       <div className="text-[#00f2ff] mb-2 flex justify-center">{stat.c}</div>
                       <p className="text-sm font-black">{stat.v}</p>
                       <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{stat.l}</p>
                    </div>
                  ))}
               </div>
            </motion.div>

            {/* Nexus Steps Section - Now comes after the image */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-20 w-full">
                 {[
                   { s: "01", t: "Initialize", d: "Secure your encrypted ID.", i: <UserPlus size={20}/> },
                   { s: "02", t: "Validate", d: "Sync technical credentials.", i: <Fingerprint size={20}/> },
                   { s: "03", t: "Command", d: "Execute global missions.", i: <Database size={20}/> },
                   { s: "04", t: "Settle", d: "Withdraw via secure relay.", i: <DollarSign size={20}/> }
                 ].map((step, idx) => (
                   <motion.div 
                     key={idx} 
                     whileHover={{ y: -5 }}
                     className="p-8 bg-white/3 border border-white/5 rounded-[40px] hover:border-[#00f2ff]/30 transition-all text-left relative overflow-hidden"
                   >
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-[11px] font-black text-[#00f2ff]/40 tracking-tighter">{step.s}</span>
                        <div className="text-[#00f2ff] opacity-50">{step.i}</div>
                      </div>
                      <h4 className="text-lg font-black uppercase italic mb-2 tracking-tight">{step.t}</h4>
                      <p className="text-xs text-gray-500 font-bold leading-relaxed">{step.d}</p>
                   </motion.div>
                 ))}
            </div>

          </div>
        </main>
      </div>
    );
  }

  // --- Survey Matrix (Compact & Mobile Friendly) ---
  if (step === "survey") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] p-4">
        <RocketWarp active={isWarping} />
        <div className="max-w-md w-full bg-black/80 backdrop-blur-3xl border border-white/10 p-8 md:p-10 rounded-[50px] shadow-3xl relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#00f2ff] to-transparent" />
          <p className="text-[9px] font-black text-[#00f2ff] uppercase italic mb-6 tracking-[0.4em]">Step {currentQuestion + 1} / {surveyQuestions.length}</p>
          <h2 className="text-xl md:text-2xl font-black italic uppercase text-white mb-8 border-l-4 border-[#00f2ff] pl-6 leading-tight">{surveyQuestions[currentQuestion].q}</h2>
          
          <div className="grid gap-3 max-h-72 overflow-y-auto no-scrollbar pr-1">
            {surveyQuestions[currentQuestion].options.length > 0 ? (
              surveyQuestions[currentQuestion].options.map(o => (
                <button 
                  key={o} 
                  onClick={handleSurveyAnswer} 
                  className="w-full py-4 px-6 bg-white/5 border border-white/10 rounded-2xl text-left text-[10px] font-black uppercase italic hover:bg-white hover:text-black transition-all active:scale-95"
                >
                  {o}
                </button>
              ))
            ) : (
              <div className="space-y-4">
                <textarea placeholder="Transmission details..." className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white text-[11px] font-bold outline-none focus:border-[#00f2ff]" rows={3} />
                <button onClick={handleSurveyAnswer} className="w-full py-5 bg-[#00f2ff] text-black font-black rounded-2xl uppercase italic text-[11px] tracking-widest shadow-glow">Finalize Handshake</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Path selection & dashboard remain same...
  if (step === "path") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
           <button onClick={() => handleRoleSelect('freelancer')} className="p-16 bg-white/3 border border-white/10 rounded-[60px] text-left group hover:border-[#00f2ff] transition-all">
              <Box size={40} className="text-[#00f2ff] mb-8" />
              <h3 className="text-4xl font-black italic uppercase text-white mb-2 tracking-tighter">Freelancer</h3>
              <p className="text-xs text-gray-500 uppercase font-black italic tracking-widest">Execute Missions.</p>
           </button>
           <button onClick={() => handleRoleSelect('client')} className="p-16 bg-white/3 border border-white/10 rounded-[60px] text-left group hover:border-purple-500 transition-all">
              <Target size={40} className="text-purple-500 mb-8" />
              <h3 className="text-4xl font-black italic uppercase text-white mb-2 tracking-tighter">Client</h3>
              <p className="text-xs text-gray-500 uppercase font-black italic tracking-widest">Deploy Gigs.</p>
           </button>
        </div>
      </div>
    );
  }

  if (step === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] text-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="w-20 h-20 border-t-2 border-b-2 border-[#00f2ff] rounded-full mb-10" />
        <h2 className="text-xl font-black italic uppercase text-[#00f2ff] animate-pulse">Syncing Hub...</h2>
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