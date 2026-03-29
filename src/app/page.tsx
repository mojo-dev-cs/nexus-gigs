"use client";

import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { FreelancerView } from "@/components/dashboard/FreelancerView";
import { ClientView } from "@/components/dashboard/ClientView";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [mounted, setMounted] = useState(false);
  
  // States: landing -> path -> survey -> loading -> dashboard
  const [step, setStep] = useState<"landing" | "path" | "survey" | "loading" | "dashboard">("landing");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const surveyQuestions = [
    { q: "Target monthly income?", options: ["<$1k", "$1k-$5k", "$10k+"] },
    { q: "Work type?", options: ["Part-time", "Full-time", "Freelance"] },
    { q: "Expertise?", options: ["Dev", "Design", "Marketing", "AI"] },
    { q: "Experience?", options: ["0-2 yrs", "3-5 yrs", "5+ yrs"] },
    { q: "Environment?", options: ["Remote", "Hybrid", "Office"] },
    { q: "Start date?", options: ["Immediately", "1 Week", "1 Month"] },
    { q: "Reason for joining?", options: ["Money", "Growth", "Networking"] },
    { q: "Payout preference?", options: ["M-Pesa", "Bank", "Crypto"] },
    { q: "Heard about us?", options: ["Social Media", "Friend", "Ads"] },
    { q: "Verify Node?", options: ["Yes", "Maybe"] }
  ];

  useEffect(() => {
    setMounted(true);
    
    if (isSignedIn && isLoaded) {
      // CLEAR CACHE CHECK: If on mobile, sometimes localStorage is sticky
      const savedRole = localStorage.getItem("nexus_user_role");
      const isSurveyDone = localStorage.getItem("nexus_survey_done");
      const metaRole = user?.publicMetadata?.role as string;

      // STRICT GATEKEEPER LOGIC
      if (metaRole) {
        setSelectedRole(metaRole);
        setStep("dashboard");
      } else if (isSurveyDone === "true" && savedRole) {
        setSelectedRole(savedRole);
        setStep("dashboard");
      } else {
        // Force path selection if neither condition is met
        setSelectedRole(null); 
        setStep("path");
      }
    }
  }, [isSignedIn, isLoaded, user]);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setStep("survey");
  };

  const handleSurveyAnswer = () => {
    if (currentQuestion < surveyQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setStep("loading");
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setLoadingProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          // SAVE TO STORAGE BEFORE CHANGING STEP
          localStorage.setItem("nexus_survey_done", "true");
          localStorage.setItem("nexus_user_role", selectedRole!);
          setStep("dashboard");
        }
      }, 50);
    }
  };

  // Prevent hydration mismatch and premature dashboard rendering
  if (!mounted || !isLoaded) return null;

  // 1. LANDING
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-8">NEXUS<span className="text-[#00f2ff]">GIGS</span></h1>
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-xs md:max-w-none justify-center">
          <SignUpButton mode="modal"><button className="px-12 py-5 bg-[#00f2ff] text-black font-black rounded-3xl uppercase text-xs italic">Get Started</button></SignUpButton>
          <SignInButton mode="modal"><button className="px-12 py-5 border border-white/10 rounded-3xl font-black uppercase text-xs italic">Sign In</button></SignInButton>
        </div>
      </div>
    );
  }

  // 2. PATH SELECTION (Force this if no role)
  if (step === "path") {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 animate-in fade-in">
        <h2 className="text-3xl md:text-5xl font-black italic uppercase mb-12 tracking-tighter">Define <span className="text-[#00f2ff]">Protocol</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          <button onClick={() => handleRoleSelect('freelancer')} className="p-10 bg-white/5 border border-white/10 rounded-[40px] hover:border-[#00f2ff]/40 transition-all text-left group">
            <h3 className="text-2xl font-black uppercase italic mb-2 group-hover:text-[#00f2ff]">Freelancer</h3>
            <p className="text-gray-500 text-sm italic">Accept missions & secure payouts.</p>
          </button>
          <button onClick={() => handleRoleSelect('client')} className="p-10 bg-white/5 border border-white/10 rounded-[40px] hover:border-[#00f2ff]/40 transition-all text-left group">
            <h3 className="text-2xl font-black uppercase italic mb-2 group-hover:text-[#00f2ff]">Client</h3>
            <p className="text-gray-500 text-sm italic">Hire nodes & deploy missions.</p>
          </button>
        </div>
      </div>
    );
  }

  // 3. SURVEY
  if (step === "survey") {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0a0f1e] border border-white/10 p-8 md:p-10 rounded-[40px] space-y-8 shadow-2xl">
          <p className="text-[10px] font-black text-[#00f2ff] uppercase italic tracking-widest">Question {currentQuestion + 1} / 10</p>
          <h2 className="text-lg md:text-xl font-black italic uppercase leading-tight">{surveyQuestions[currentQuestion].q}</h2>
          <div className="grid gap-3">
            {surveyQuestions[currentQuestion].options.map(opt => (
              <button key={opt} onClick={handleSurveyAnswer} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-left px-6 text-[11px] font-black uppercase hover:bg-[#00f2ff] hover:text-black transition-all italic">{opt}</button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 4. LOADING
  if (step === "loading") {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl md:text-3xl font-black italic uppercase mb-8 text-[#00f2ff] animate-pulse">Matching interests</h2>
        <div className="w-full max-w-sm h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-[#00f2ff] shadow-[0_0_20px_#00f2ff] transition-all" style={{ width: `${loadingProgress}%` }} />
        </div>
      </div>
    );
  }

  // 5. DASHBOARD (Only renders if all checks pass)
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