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
  ArrowRight, CheckCircle2, UserPlus, Fingerprint, Star, Send, Layers, QrCode
} from "lucide-react";

// --- 🌌 GALAXY MOTION BACKGROUND (Deep Blue & Stars) ---
const GalaxyBackground = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#020617]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,70,200,0.12),transparent_70%)]" />
    {[...Array(60)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: Math.random(), x: Math.random() * 2000, y: Math.random() * 1200 }}
        animate={{ opacity: [0.2, 0.8, 0.2], y: [null, -200] }}
        transition={{ repeat: Infinity, duration: 10 + Math.random() * 15, ease: "linear" }}
        className="absolute w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_4px_rgba(255,255,255,0.9)]"
      />
    ))}
    <div className="absolute top-0 right-0 w-175 h-175 bg-blue-600/10 blur-[150px] rounded-full animate-pulse" />
    <div className="absolute bottom-0 left-0 w-175 h-175 bg-blue-800/10 blur-[150px] rounded-full animate-pulse" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-linear-to-r from-transparent via-blue-500/30 to-transparent" />
  </div>
);

// --- 🎞️ SLIDING REVIEW DECK (Stars + Profile Pics) ---
const ReviewDeck = () => {
  const reviews = [
    { name: "Alex K.", role: "Fullstack Dev", text: "Nexus handshake unlocked $2k missions instantly.", img: "https://i.pravatar.cc/150?u=alex" },
    { name: "Sarah M.", role: "UI Designer", text: "Elite clients and fast payments. Truly premium.", img: "https://i.pravatar.cc/150?u=sarah" },
    { name: "John D.", role: "Tech Lead", text: "The vetting process keeps the quality extremely high.", img: "https://i.pravatar.cc/150?u=john" },
    { name: "Cynthia W.", role: "Brand Manager", text: "Fast settlements and high-impact software missions.", img: "https://i.pravatar.cc/150?u=cynthia" },
  ];

  return (
    <div className="w-full overflow-hidden py-12 relative z-10">
      <motion.div 
        animate={{ x: [0, -1400] }}
        transition={{ repeat: Infinity, duration: 50, ease: "linear" }}
        className="flex gap-8 whitespace-nowrap"
      >
        {[...reviews, ...reviews, ...reviews].map((rev, i) => (
          <div key={i} className="inline-block w-96 p-8 bg-white/3 backdrop-blur-3xl border border-white/10 rounded-[35px] shadow-2xl">
             <div className="flex items-center gap-4 mb-5">
                <img src={rev.img} alt={rev.name} className="w-12 h-12 rounded-full border-2 border-blue-500/30" />
                <div className="flex-1 text-left">
                   <p className="text-sm font-black text-white leading-none mb-1.5">{rev.name}</p>
                   <div className="flex gap-0.5">
                      {[...Array(5)].map((_, s) => <Star key={s} size={10} className="text-blue-400 fill-blue-400" />)}
                   </div>
                </div>
                <CheckCircle2 size={16} className="text-[#00f2ff]" />
             </div>
             <p className="text-[12px] text-gray-300 font-medium italic whitespace-normal leading-relaxed text-left">"{rev.text}"</p>
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
    setTimeout(() => { callback(); setIsWarping(false); }, 750);
  };

  const handleSurveyAnswer = useCallback(() => {
    if (currentQuestion < surveyQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      triggerWarp(() => {
        setStep("loading");
        setTimeout(() => {
          if (user?.id) localStorage.setItem(`nexus_onboard_v4_${user.id}`, selectedRole!);
          setStep("dashboard");
        }, 2800);
      });
    }
  }, [currentQuestion, selectedRole, user?.id, surveyQuestions.length]);

  if (!mounted || !isLoaded || step === "checking") return <div className="min-h-screen bg-[#020617]" />;

  if (step === "landing") {
    return (
      <div className="min-h-screen bg-[#020617] text-white relative font-sans overflow-x-hidden">
        <GalaxyBackground />

        {/* --- HEADER --- */}
        <header className="fixed top-0 w-full h-20 z-100 flex items-center justify-between px-6 md:px-14 bg-[#020617]/50 backdrop-blur-2xl border-b border-white/5 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-linear-to-br from-[#00f2ff] to-blue-600 rounded-xl rotate-45 flex items-center justify-center shadow-lg">
              <Terminal size={18} className="text-black -rotate-45" />
            </div>
            <h1 className="text-xl font-black italic uppercase tracking-tighter">NEXUS<span className="text-blue-500">GIGS</span></h1>
          </div>
          <div className="flex gap-6 items-center">
             <SignInButton mode="modal">
                <button className="text-[10px] font-black uppercase italic tracking-widest text-gray-400 hover:text-white transition-all">Login</button>
             </SignInButton>
             <SignUpButton mode="modal">
                <button className="px-7 py-2.5 bg-blue-600 text-white text-[10px] font-black uppercase italic rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-105 transition-all tracking-widest">Get Started</button>
             </SignUpButton>
          </div>
        </header>

        <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
          <div className="flex flex-col items-center text-center">
            
            {/* HERO TEXT */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 mb-12 mt-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full mx-auto shadow-inner">
                <Sparkles size={12} className="text-blue-400" />
                <p className="text-blue-400 text-[8px] font-black uppercase italic tracking-widest">Elite Tech Protocol v4.0</p>
              </div>
              <h2 className="text-6xl md:text-[9rem] font-black italic uppercase leading-[0.8] tracking-tighter text-white">
                DESIGN <br /> <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-blue-600 to-indigo-600">THAT MATTERS</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-lg leading-relaxed font-medium italic mt-6">
                Elevating brands through high-tier technical talent and innovative software missions. Connect to the global nexus today.
              </p>
            </motion.div>

            {/* ENLARGED HERO IMAGE + FLOATING STATS */}
            <div className="relative w-full max-w-6xl mb-32 group">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }} 
                 animate={{ opacity: 1, scale: 1 }} 
                 transition={{ duration: 1.2 }}
                 className="relative rounded-[50px] overflow-hidden border border-white/10 bg-[#0a0f1e] shadow-2xl"
               >
                 <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072" alt="Nexus" className="w-full h-112.5 md:h-162.5 object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105" />
                 <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-transparent" />
               </motion.div>

               {/* Floating Data Cards over enlarged image */}
               <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[90%] grid grid-cols-2 md:grid-cols-4 gap-4 z-20">
                  {[
                    { l: "Nodes Online", v: "1.2M+", i: <Users size={16}/> },
                    { l: "Paid Assets", v: "KES 3.8B", i: <DollarSign size={16}/> },
                    { l: "Missions", v: "85K+", i: <Briefcase size={14}/> },
                    { l: "Latency", v: "0.02ms", i: <Activity size={14}/> }
                  ].map((item, i) => (
                    <motion.div key={i} animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 4, delay: i * 0.5 }} className="bg-black/90 backdrop-blur-3xl border border-white/10 p-6 rounded-[35px] text-center shadow-2xl">
                       <div className="text-blue-400 mb-2 flex justify-center">{item.i}</div>
                       <p className="text-sm font-black text-white">{item.v}</p>
                       <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mt-1">{item.l}</p>
                    </motion.div>
                  ))}
               </div>
            </div>

            <ReviewDeck />

            {/* DETAILED GUIDE CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-20 w-full text-left">
                 {[
                   { 
                     t: "Initialize Identity", 
                     d: "Secure your encrypted node ID via biometric validation. This establishes your unique signature within the Nexus relay network.", 
                     i: <UserPlus size={22}/>, 
                     features: ["Encrypted Node ID", "Biometric Uplink", "Zero-Knowledge Security"] 
                   },
                   { 
                     t: "Validate Tech Stack", 
                     d: "Pass our automated code audit and technical vetting. Synchronize your repositories and skills to unlock high-tier missions.", 
                     i: <Fingerprint size={22}/>, 
                     features: ["Automated Code Audit", "Verified Credentials", "Node Credibility Score"] 
                   },
                   { 
                     t: "Execute Missions", 
                     d: "Accept high-command enterprise projects. Deploy solutions directly to global infrastructure with real-time settlement tracking.", 
                     i: <Layers size={22}/>, 
                     features: ["MIL-SPEC Project Rails", "Direct Enterprise Access", "Cloud Native Deployment"] 
                   },
                   { 
                     t: "Vault Settlement", 
                     d: "Receive instant payouts into your localized vault. Secure financial relays ensure borderless, fast, and transparent transactions.", 
                     i: <QrCode size={22}/>, 
                     features: ["Instant Financial Relay", "Localized Withdrawals", "Transparent Ledger Sync"] 
                   }
                 ].map((card, idx) => (
                   <motion.div 
                     key={idx} 
                     whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.06)" }}
                     className="p-10 bg-white/3 backdrop-blur-3xl border border-white/5 rounded-[45px] transition-all relative overflow-hidden group shadow-3xl"
                   >
                      <div className="flex items-center gap-5 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner group-hover:text-white transition-colors">
                          {card.i}
                        </div>
                        <h4 className="text-2xl font-black uppercase italic tracking-tight text-white leading-none">{card.t}</h4>
                      </div>
                      
                      <p className="text-sm text-gray-400 font-medium leading-relaxed mb-8 max-w-xl">{card.d}</p>
                      
                      <div className="flex flex-wrap gap-3 border-t border-white/5 pt-8">
                        {card.features.map(f => (
                          <div key={f} className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                            <CheckCircle2 size={12} className="text-emerald-400" />
                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">{f}</span>
                          </div>
                        ))}
                      </div>
                   </motion.div>
                 ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (step === "path") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6 relative">
        <GalaxyBackground />
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full relative z-10">
           <button onClick={() => { setSelectedRole('freelancer'); setStep("survey"); }} className="p-16 bg-white/3 backdrop-blur-3xl border border-white/10 rounded-[60px] text-left group hover:border-blue-500 transition-all shadow-3xl flex flex-col gap-8">
              <div className="p-6 bg-blue-500/10 rounded-2xl text-blue-500 group-hover:scale-110 transition-transform"><Box size={40}/></div>
              <div><h3 className="text-4xl font-black italic uppercase text-white mb-2">Freelancer</h3><p className="text-xs text-gray-500 uppercase font-black tracking-widest leading-none">Accept Missions.</p></div>
           </button>
           <button onClick={() => { setSelectedRole('client'); setStep("survey"); }} className="p-16 bg-white/3 backdrop-blur-3xl border border-white/10 rounded-[60px] text-left group hover:border-purple-500 transition-all shadow-3xl flex flex-col gap-8">
              <div className="p-6 bg-purple-500/10 rounded-2xl text-purple-500 group-hover:scale-110 transition-transform"><Target size={40}/></div>
              <div><h3 className="text-4xl font-black italic uppercase text-white mb-2">Client</h3><p className="text-xs text-gray-500 uppercase font-black tracking-widest leading-none">Deploy Gigs.</p></div>
           </button>
        </div>
      </div>
    );
  }

  if (step === "survey") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6">
        <GalaxyBackground />
        <div className="max-w-md w-full bg-black/90 backdrop-blur-3xl border border-white/10 p-10 md:p-12 rounded-[50px] shadow-3xl relative z-10">
          <p className="text-[10px] font-black text-blue-400 uppercase italic mb-8 tracking-[0.4em] text-center">Step {currentQuestion + 1} / {surveyQuestions.length}</p>
          <h2 className="text-2xl font-black italic uppercase text-white mb-10 border-l-4 border-blue-500 pl-6 leading-tight text-left">{surveyQuestions[currentQuestion].q}</h2>
          <div className="grid gap-3 max-h-80 overflow-y-auto no-scrollbar">
            {surveyQuestions[currentQuestion].options.map(o => (
              <button key={o} onClick={handleSurveyAnswer} className="w-full py-4 px-8 bg-white/5 border border-white/10 rounded-2xl text-left text-[11px] font-black uppercase italic hover:bg-white hover:text-black transition-all active:scale-95 leading-none">
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] text-center p-6">
        <GalaxyBackground />
        <div className="p-16 bg-black/40 border border-white/10 rounded-[50px] backdrop-blur-3xl relative z-10 shadow-3xl">
           <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="w-24 h-24 border-t-2 border-b-2 border-blue-500 rounded-full mb-12 shadow-[0_0_30px_rgba(37,99,235,0.4)] mx-auto" />
           <h2 className="text-2xl font-black italic uppercase text-blue-500 animate-pulse tracking-[0.3em] leading-none mb-3">Syncing...</h2>
           <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Initializing technical data matrix</p>
        </div>
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