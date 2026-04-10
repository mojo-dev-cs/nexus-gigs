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
  ArrowRight, CheckCircle2, UserPlus, Fingerprint, Star, Send
} from "lucide-react";

// --- 🌌 GALAXY MOTION BACKGROUND ---
const GalaxyBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#020617]">
    {/* Twinkling & Moving Stars */}
    {[...Array(50)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ 
          opacity: Math.random(), 
          x: Math.random() * 2000, 
          y: Math.random() * 1200 
        }}
        animate={{ 
          opacity: [0.2, 0.8, 0.2],
          y: [null, -150] 
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 10 + Math.random() * 20, 
          ease: "linear" 
        }}
        className="absolute w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_5px_white]"
      />
    ))}
    {/* Nebula Glows */}
    <div className="absolute -top-1/4 -right-1/4 w-200 h-200 bg-blue-600/10 blur-[150px] rounded-full" />
    <div className="absolute -bottom-1/4 -left-1/4 w-200 h-200 bg-purple-600/10 blur-[150px] rounded-full" />
  </div>
);

// --- 🎞️ SLIDING REVIEW DECK ---
const ReviewDeck = () => {
  const reviews = [
    { name: "Alex K.", role: "Fullstack Dev", text: "Nexus Handshake changed everything for my career.", verified: true },
    { name: "Sarah M.", role: "UI Designer", text: "Elite clients and instant payments. Truly premium.", verified: true },
    { name: "John D.", role: "Tech Lead", text: "Best platform for high-tier technical settlement.", verified: true },
    { name: "Cynthia W.", role: "Brand Manager", text: "Vetting ensures I only work with the top 1%.", verified: true },
  ];

  return (
    <div className="w-full overflow-hidden py-12 relative z-10">
      <motion.div 
        animate={{ x: [0, -1200] }}
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
        className="flex gap-6 whitespace-nowrap"
      >
        {[...reviews, ...reviews, ...reviews].map((rev, i) => (
          <div key={i} className="inline-block w-80 p-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] shadow-2xl">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#00f2ff] to-blue-600 flex items-center justify-center font-black text-xs text-black">
                  {rev.name[0]}
                </div>
                <div>
                   <p className="text-[11px] font-black text-white leading-none">{rev.name}</p>
                   <p className="text-[8px] text-gray-500 uppercase tracking-widest">{rev.role}</p>
                </div>
                <CheckCircle2 size={14} className="text-[#00f2ff] ml-auto" />
             </div>
             <p className="text-[10px] text-gray-300 font-medium italic whitespace-normal leading-relaxed">"{rev.text}"</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// --- 🚀 ROCKET WARP ANIMATION ---
const RocketWarp = ({ active }: { active: boolean }) => (
  <AnimatePresence>
    {active && (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-300 flex items-center justify-center pointer-events-none bg-[#020617]/80 backdrop-blur-xl"
      >
        <motion.div
          initial={{ y: 800, scale: 0.5, opacity: 1 }}
          animate={{ y: -1500, scale: 4, opacity: [1, 1, 0] }}
          transition={{ duration: 0.9, ease: "circIn" }}
          className="relative"
        >
          <Rocket size={120} className="text-[#00f2ff] fill-[#00f2ff] drop-shadow-[0_0_60px_#00f2ff]" />
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-12 h-96 bg-linear-to-t from-transparent via-blue-500 to-[#00f2ff] blur-3xl" />
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
        const savedRole = user?.publicMetadata?.role || localStorage.getItem(`nexus_role_${user.id}`);
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
    setTimeout(() => { callback(); setIsWarping(false); }, 800);
  };

  const handleSurveyAnswer = useCallback(() => {
    if (currentQuestion < surveyQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      triggerWarp(() => {
        setStep("loading");
        setTimeout(() => {
          if (user?.id) localStorage.setItem(`nexus_role_${user.id}`, selectedRole!);
          setStep("dashboard");
        }, 2500);
      });
    }
  }, [currentQuestion, selectedRole, user?.id, surveyQuestions.length]);

  if (!mounted || !isLoaded || step === "checking") return <div className="min-h-screen bg-[#020617]" />;

  if (step === "landing") {
    return (
      <div className="min-h-screen bg-[#020617] text-white relative font-sans overflow-x-hidden">
        <GalaxyBackground />
        
        {/* --- NAVBAR --- */}
        <header className="fixed top-0 w-full h-24 z-100 flex items-center justify-between px-6 md:px-16 bg-[#020617]/40 backdrop-blur-3xl border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-[#00f2ff] to-blue-600 rounded-xl rotate-45 flex items-center justify-center shadow-glow">
              <Terminal size={20} className="text-black -rotate-45" />
            </div>
            <h1 className="text-xl font-black italic uppercase tracking-tighter">NEXUS<span className="text-[#00f2ff]">GIGS</span></h1>
          </div>
          <div className="flex gap-8 items-center">
             <SignInButton mode="modal">
                <button className="text-[11px] font-black uppercase italic tracking-widest text-gray-400 hover:text-white transition-all">Login</button>
             </SignInButton>
             <SignUpButton mode="modal">
                <button className="px-10 py-3.5 bg-linear-to-r from-blue-600 to-purple-600 text-white text-[11px] font-black uppercase italic rounded-full shadow-lg hover:scale-105 transition-all">Get Started</button>
             </SignUpButton>
          </div>
        </header>

        {/* --- HERO --- */}
        <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-32 flex flex-col items-center text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#00f2ff]/10 border border-[#00f2ff]/20 rounded-full">
              <Sparkles size={14} className="text-[#00f2ff]" />
              <p className="text-[#00f2ff] text-[9px] font-black uppercase italic tracking-widest">Global Talent Relay v4.0</p>
            </div>
            <h2 className="text-6xl md:text-[9rem] font-black italic uppercase leading-[0.8] tracking-tighter">
              BEYOND <br /> <span className="text-transparent bg-clip-text bg-linear-to-r from-[#00f2ff] via-blue-500 to-purple-600">LIMITS</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-lg leading-relaxed font-medium italic mt-10">
              The world's most advanced platform for technical talent. <br/> Secure settlements. Elite missions. Infinite growth.
            </p>
          </motion.div>

          <ReviewDeck />

          {/* --- GUIDE CARDS --- */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-24 w-full">
               {[
                 { t: "Initialize", d: "Secure your encrypted node.", i: <UserPlus size={24}/>, color: "from-blue-600" },
                 { t: "Validation", d: "Pass the $10 handshake.", i: <Fingerprint size={24}/>, color: "from-[#00f2ff]" },
                 { t: "Operations", d: "Execute global missions.", i: <Briefcase size={24}/>, color: "from-purple-600" },
                 { t: "Settlement", d: "Instant vault withdrawal.", i: <DollarSign size={24}/>, color: "from-emerald-600" }
               ].map((card, idx) => (
                 <motion.div key={idx} whileHover={{ y: -10 }} className="p-10 bg-white/3 backdrop-blur-3xl border border-white/10 rounded-[50px] text-left relative overflow-hidden shadow-2xl h-80 flex flex-col justify-between">
                    <div className={`absolute top-0 left-0 w-full h-1 bg-linear-to-r ${card.color} to-transparent opacity-40`} />
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:text-[#00f2ff] shadow-inner">{card.i}</div>
                    <div>
                      <h4 className="text-xl font-black uppercase italic text-white mb-1">{card.t}</h4>
                      <p className="text-[10px] text-gray-500 font-bold uppercase leading-relaxed tracking-widest">{card.d}</p>
                    </div>
                 </motion.div>
               ))}
          </div>
        </main>
      </div>
    );
  }

  if (step === "path") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6">
        <GalaxyBackground />
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full relative z-10">
           <button onClick={() => { setSelectedRole('freelancer'); setStep("survey"); }} className="p-20 bg-white/3 backdrop-blur-3xl border border-white/10 rounded-[60px] text-left group hover:border-[#00f2ff] transition-all shadow-3xl">
              <Box size={50} className="text-[#00f2ff] mb-8" />
              <h3 className="text-4xl font-black italic uppercase text-white mb-2 tracking-tighter">Freelancer</h3>
              <p className="text-xs text-gray-500 uppercase font-black tracking-widest">Start Missions.</p>
           </button>
           <button onClick={() => { setSelectedRole('client'); setStep("survey"); }} className="p-20 bg-white/3 backdrop-blur-3xl border border-white/10 rounded-[60px] text-left group hover:border-purple-500 transition-all shadow-3xl">
              <Target size={50} className="text-purple-500 mb-8" />
              <h3 className="text-4xl font-black italic uppercase text-white mb-2 tracking-tighter">Client</h3>
              <p className="text-xs text-gray-500 uppercase font-black tracking-widest">Deploy Gigs.</p>
           </button>
        </div>
      </div>
    );
  }

  if (step === "survey") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6">
        <GalaxyBackground />
        <div className="max-w-md w-full bg-black/80 backdrop-blur-3xl border border-white/10 p-10 rounded-[50px] shadow-3xl relative z-10">
          <p className="text-[9px] font-black text-[#00f2ff] uppercase italic mb-8 tracking-[0.4em]">Handshake Phase {currentQuestion + 1} / {surveyQuestions.length}</p>
          <h2 className="text-2xl font-black italic uppercase text-white mb-10 border-l-4 border-[#00f2ff] pl-6 leading-tight">{surveyQuestions[currentQuestion].q}</h2>
          <div className="grid gap-4">
            {surveyQuestions[currentQuestion].options.map(o => (
              <button key={o} onClick={handleSurveyAnswer} className="w-full py-5 px-8 bg-white/5 border border-white/10 rounded-2xl text-left text-[11px] font-black uppercase italic hover:bg-white hover:text-black transition-all">
                {o}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] text-center">
        <GalaxyBackground />
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-24 h-24 border-t-2 border-b-2 border-[#00f2ff] rounded-full mb-12 shadow-glow" />
        <h2 className="text-xl font-black italic uppercase text-[#00f2ff] animate-pulse tracking-widest">Synchronizing Hub...</h2>
      </div>
    );
  }

  if (step === "dashboard") {
    return (
      <main className="min-h-screen bg-[#020617]">
        <RocketWarp active={isWarping} />
        {selectedRole === "freelancer" ? <FreelancerView jobs={[]} userMetadata={user?.publicMetadata || {}} /> : <ClientView jobs={[]} />}
      </main>
    );
  }

  return <div className="min-h-screen bg-[#020617]" />;
}