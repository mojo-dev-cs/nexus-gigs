"use client";

import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { FreelancerView } from "@/components/dashboard/FreelancerView";
import { ClientView } from "@/components/dashboard/ClientView";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [mounted, setMounted] = useState(false);
  
  const [step, setStep] = useState<"landing" | "survey" | "loading" | "path" | "dashboard">("landing");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const surveyQuestions = [
    { q: "Primary freelancing domain?", options: ["Development", "Design", "Marketing", "Writing"] },
    { q: "Years of experience?", options: ["0-2 years", "2-5 years", "5-10 years", "10+ years"] },
    { q: "Income goal per month?", options: ["<$2k", "$2k-$5k", "$5k-$10k", "$10k+"] },
    { q: "Work availability?", options: ["Full-time", "Part-time", "Contract"] },
    { q: "Technical stack?", options: ["React/Next.js", "Python/AI", "Web3", "UI/UX"] },
    { q: "Preferred project length?", options: ["Fixed-term", "Long-term", "Hourly"] },
    { q: "Communication style?", options: ["Async/Chat", "Video Sync", "Email"] },
    { q: "Why NexusGigs?", options: ["Fast Payouts", "Elite Clients", "Networking"] },
    { q: "Payment preference?", options: ["M-Pesa", "Bank", "Crypto"] },
    { q: "Ready for node activation?", options: ["Yes", "Maybe", "Need info"] },
  ];

  useEffect(() => {
    setMounted(true);
    if (isSignedIn) {
      const savedRole = localStorage.getItem("nexus_user_role");
      const isSurveyDone = localStorage.getItem("nexus_survey_done");

      if (user?.publicMetadata?.role) {
        setSelectedRole(user.publicMetadata.role as string);
        setStep("dashboard");
      } else if (isSurveyDone === "true" && savedRole) {
        setSelectedRole(savedRole);
        setStep("dashboard");
      } else {
        setStep("survey");
      }
    }
  }, [isSignedIn, user]);

  const handleSurveyAnswer = () => {
    if (currentQuestion < surveyQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      localStorage.setItem("nexus_survey_done", "true");
      setStep("loading");
      startLoadingBar();
    }
  };

  const startLoadingBar = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setLoadingProgress(Math.min(progress, 100));
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => setStep("path"), 800);
      }
    }, 50); 
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    localStorage.setItem("nexus_user_role", role);
    setStep("dashboard");
  };

  if (!mounted || !isLoaded) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-[#00f2ff] font-black italic animate-pulse">NEXUS INITIALIZING...</div>;

  if (step === "landing" && !isSignedIn) {
    return (
      <div className="min-h-screen bg-[#020617] text-white selection:bg-[#00f2ff]/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <main className="relative z-10">
          <section className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mb-20">
              {[{l:"Global Nodes", v:"+1.2M"}, {l:"Vault Volume", v: "+$2.5M"}, {l:"Mission Success", v:"480K+"}, {l:"Latency", v:"0.02s"}].map((s,i)=>(
                <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-4xl backdrop-blur-xl shadow-2xl hover:-translate-y-2 transition-all">
                  <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest italic">{s.l}</p>
                  <h3 className="text-3xl font-black italic text-[#00f2ff]">{s.v}</h3>
                </div>
              ))}
            </div>
            <h1 className="text-7xl md:text-[10rem] font-black italic uppercase tracking-tighter mb-4 leading-none">NEXUS<span className="text-[#00f2ff]">GIGS</span></h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.6em] mb-12 italic">The Decentralized Operating System for Talent</p>
            <div className="flex flex-col md:flex-row gap-6 w-full max-w-sm">
                <SignUpButton mode="modal"><button className="flex-1 py-6 bg-[#00f2ff] text-black font-black rounded-3xl uppercase text-[12px] italic">Initialize Account</button></SignUpButton>
                <SignInButton mode="modal"><button className="flex-1 py-6 border border-white/10 text-white font-black rounded-3xl uppercase text-[10px] italic">Enter Matrix</button></SignInButton>
            </div>
          </section>
          <section className="w-full py-24 border-y border-white/5 bg-white/1">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-8 gap-8 grayscale opacity-40">
                {["COCA-COLA", "SAFARICOM", "GOOGLE", "BINANCE", "STRIPE", "MICROSOFT", "AMAZON", "TESLA"].map(b => <span key={b} className="text-[12px] font-black italic tracking-tighter text-center">{b}</span>)}
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (step === "survey") {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-[#0a0f1e] border border-white/10 p-12 rounded-[50px] space-y-10 shadow-2xl">
          <header className="flex justify-between items-center border-b border-white/5 pb-6">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Protocol <span className="text-[#00f2ff]">Sync</span></h2>
            <span className="text-[10px] font-black text-gray-500 italic">{currentQuestion + 1} / 10</span>
          </header>
          <p className="text-xl font-black italic text-gray-200">{surveyQuestions[currentQuestion].q}</p>
          <div className="grid gap-4">
            {surveyQuestions[currentQuestion].options.map(opt => (
              <button key={opt} onClick={handleSurveyAnswer} className="w-full py-5 bg-white/2 border border-white/10 rounded-2xl text-left px-8 text-[11px] font-black uppercase hover:bg-[#00f2ff] hover:text-black transition-all italic active:scale-95">{opt}</button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === "loading") {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6">
        <h2 className="text-3xl font-black italic uppercase tracking-[0.4em] mb-12 text-[#00f2ff] animate-pulse">Matching Interests</h2>
        <div className="w-full max-w-sm h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
          <div className="h-full bg-[#00f2ff] shadow-[0_0_20px_rgba(0,242,255,0.8)] transition-all duration-300" style={{ width: `${loadingProgress}%` }} />
        </div>
        <p className="text-[10px] font-black uppercase text-gray-600 mt-6 tracking-[0.8em]">{Math.floor(loadingProgress)}% SYNCED</p>
      </div>
    );
  }

  if (step === "path") {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6">
        <h2 className="text-5xl font-black italic uppercase mb-16 tracking-tighter text-center">Choose Your <span className="text-[#00f2ff]">Protocol</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl">
          <button onClick={() => handleRoleSelect('freelancer')} className="group p-16 bg-[#0a0f1e] border border-white/10 rounded-[60px] hover:border-[#00f2ff]/50 transition-all shadow-2xl active:scale-95 text-left">
            <div className="text-6xl mb-10 group-hover:scale-110 transition-transform">💼</div>
            <h3 className="text-4xl font-black uppercase italic mb-4">Freelancer</h3>
            <p className="text-[13px] text-gray-500 font-medium uppercase tracking-wider italic leading-relaxed">Accept enterprise tactical missions and secure instant settlements.</p>
          </button>
          <button onClick={() => handleRoleSelect('client')} className="group p-16 bg-[#0a0f1e] border border-white/10 rounded-[60px] hover:border-[#00f2ff]/50 transition-all shadow-2xl active:scale-95 text-left">
            <div className="text-6xl mb-10 group-hover:scale-110 transition-transform">🎯</div>
            <h3 className="text-4xl font-black uppercase italic mb-4">Client</h3>
            <p className="text-[13px] text-gray-500 font-medium uppercase tracking-wider italic leading-relaxed">Deploy secure missions and acquire high-fidelity node operators.</p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#020617]">
      {selectedRole === "freelancer" ? <FreelancerView jobs={[]} userMetadata={user?.publicMetadata || {}} /> : <ClientView jobs={[]} />}
    </main>
  );
}