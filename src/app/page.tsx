"use client";

import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { FreelancerView } from "@/components/dashboard/FreelancerView";
import { ClientView } from "@/components/dashboard/ClientView";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [mounted, setMounted] = useState(false);
  
  // Flow Machine: landing -> path -> survey -> loading -> dashboard
  const [step, setStep] = useState<"landing" | "path" | "survey" | "loading" | "dashboard">("landing");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const surveyQuestions = [
    { q: "What is your expected monthly income?", options: ["<$1k", "$1k-$5k", "$5k-$10k", "$10k+"] },
    { q: "Are you looking for part or full time?", options: ["Part-time", "Full-time", "Contract", "Not sure"] },
    { q: "Primary technical expertise?", options: ["Frontend", "Backend", "Mobile", "AI/Data"] },
    { q: "Years of professional experience?", options: ["0-2 yrs", "3-5 yrs", "5-10 yrs", "Expert"] },
    { q: "Preferred work environment?", options: ["Remote", "Hybrid", "On-site"] },
    { q: "Availability to start?", options: ["Immediately", "Next Week", "In a month"] },
    { q: "Primary reason for joining?", options: ["Income", "Networking", "Skill building"] },
    { q: "Preferred payout method?", options: ["M-Pesa", "Bank", "Crypto"] },
    { q: "How did you hear about us?", options: ["Social Media", "Referral", "Ads"] },
    { q: "Ready for node verification?", options: ["Yes", "Need more info"] },
  ];

  useEffect(() => {
    setMounted(true);
    if (isSignedIn && isLoaded) {
      const savedRole = localStorage.getItem("nexus_user_role");
      const isSurveyDone = localStorage.getItem("nexus_survey_done");
      const metaRole = user?.publicMetadata?.role as string;

      if (metaRole || (isSurveyDone === "true" && savedRole)) {
        setSelectedRole(metaRole || savedRole);
        setStep("dashboard");
      } else {
        setStep("path");
      }
    }
  }, [isSignedIn, isLoaded, user]);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setStep("survey"); // Go to survey after path selection
  };

  const handleSurveyAnswer = () => {
    if (currentQuestion < surveyQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
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
        setTimeout(() => {
          localStorage.setItem("nexus_user_role", selectedRole!);
          localStorage.setItem("nexus_survey_done", "true");
          setStep("dashboard");
        }, 800);
      }
    }, 50); 
  };

  if (!mounted || !isLoaded) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-[#00f2ff] font-black italic animate-pulse">SYNCHRONIZING...</div>;

  // --- 🛰️ 1. LANDING ---
  if (step === "landing" && !isSignedIn) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 text-center overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mb-12 relative z-10">
          {[{l:"Nodes", v:"+1M"}, {l:"Transacted", v: "+$2M"}, {l:"Gigs", v:"480K"}, {l:"Latency", v:"0.02s"}].map((s,i)=>(
            <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-4xl shadow-2xl backdrop-blur-xl">
              <p className="text-[8px] font-black text-gray-500 uppercase italic mb-2">{s.l}</p>
              <h3 className="text-3xl font-black italic text-[#00f2ff]">{s.v}</h3>
            </div>
          ))}
        </div>
        <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter mb-8 leading-none relative z-10">NEXUS<span className="text-[#00f2ff]">GIGS</span></h1>
        <div className="flex gap-4 relative z-10">
          <SignUpButton mode="modal"><button className="px-12 py-5 bg-[#00f2ff] text-black font-black rounded-3xl uppercase text-xs italic">Get Started</button></SignUpButton>
          <SignInButton mode="modal"><button className="px-12 py-5 border border-white/10 rounded-3xl font-black uppercase text-xs italic">Sign In</button></SignInButton>
        </div>
        <div className="mt-20 max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-8 gap-8 grayscale opacity-30 relative z-10">
            {["COCA-COLA", "SAFARICOM", "GOOGLE", "BINANCE", "STRIPE", "MICROSOFT", "AMAZON", "TESLA"].map(b => <span key={b} className="text-[14px] font-black italic tracking-tighter text-center">{b}</span>)}
        </div>
      </div>
    );
  }

  // --- ⚔️ 2. PATH SELECTION ---
  if (step === "path") {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
        <h2 className="text-5xl font-black italic uppercase mb-16 tracking-tighter">Define <span className="text-[#00f2ff]">Protocol</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl">
          <button onClick={() => handleRoleSelect('freelancer')} className="group p-16 bg-[#0a0f1e] border border-white/10 rounded-[60px] hover:border-[#00f2ff]/50 transition-all shadow-2xl active:scale-95 text-left relative overflow-hidden">
            <div className="text-6xl mb-10 group-hover:scale-110 transition-transform">💼</div>
            <h3 className="text-4xl font-black uppercase italic mb-4">Freelancer</h3>
            <p className="text-gray-500 italic">Accept missions and secure instant settlements.</p>
          </button>
          <button onClick={() => handleRoleSelect('client')} className="group p-16 bg-[#0a0f1e] border border-white/10 rounded-[60px] hover:border-[#00f2ff]/50 transition-all shadow-2xl active:scale-95 text-left relative overflow-hidden">
            <div className="text-6xl mb-10 group-hover:scale-110 transition-transform">🎯</div>
            <h3 className="text-4xl font-black uppercase italic mb-4">Client</h3>
            <p className="text-gray-500 italic">Deploy missions and acquire top-tier nodes.</p>
          </button>
        </div>
      </div>
    );
  }

  // --- 🧬 3. SURVEY ---
  if (step === "survey") {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#0a0f1e] border border-white/10 p-10 rounded-[40px] space-y-10 shadow-2xl">
          <header className="flex justify-between items-center border-b border-white/5 pb-6">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Protocol <span className="text-[#00f2ff]">Sync</span></h2>
            <span className="text-[10px] font-black text-gray-500 italic">{currentQuestion + 1} / 10</span>
          </header>
          <p className="text-xl font-black italic text-gray-200">{surveyQuestions[currentQuestion].q}</p>
          <div className="grid gap-3">
            {surveyQuestions[currentQuestion].options.map(opt => (
              <button key={opt} onClick={handleSurveyAnswer} className="w-full py-5 bg-white/2 border border-white/10 rounded-2xl text-left px-8 text-[11px] font-black uppercase hover:bg-[#00f2ff] hover:text-black transition-all italic active:scale-95 shadow-xl">{opt}</button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- 🌀 4. LOADING ---
  if (step === "loading") {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6">
        <h2 className="text-3xl font-black italic uppercase tracking-[0.4em] mb-12 text-[#00f2ff] animate-pulse">Matching interests</h2>
        <div className="w-full max-w-sm h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
          <div className="h-full bg-[#00f2ff] shadow-[0_0_20px_#00f2ff] transition-all duration-300" style={{ width: `${loadingProgress}%` }} />
        </div>
        <p className="text-[10px] font-black uppercase text-gray-600 mt-6 tracking-[0.8em] italic">{Math.floor(loadingProgress)}% SYNCED</p>
      </div>
    );
  }

  // --- 🖥️ 5. DASHBOARD ---
  return (
    <main className="min-h-screen">
      {selectedRole === "freelancer" ? (
        <FreelancerView jobs={[]} userMetadata={user?.publicMetadata || {}} />
      ) : (
        <ClientView jobs={[]} />
      )}
    </main>
  );
}