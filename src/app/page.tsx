"use client";

import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { FreelancerView } from "@/components/dashboard/FreelancerView";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-[#00f2ff] font-black animate-pulse uppercase tracking-[0.5em] text-[10px]">Synchronizing Nexus...</div>
      </div>
    );
  }

  if (isSignedIn && user) {
    return (
      <main className="min-h-screen bg-[#020617]">
        <FreelancerView jobs={[]} userMetadata={user.publicMetadata || {}} />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-[#00f2ff]/30 overflow-x-hidden relative">
      
      {/* --- ✨ STAR BACKGROUND LAYER --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#020617_100%)] z-10" />
        {/* Simple CSS Starfield */}
        <div className="stars-container">
           {[...Array(50)].map((_, i) => (
             <div 
              key={i} 
              className="absolute bg-white rounded-full animate-twinkle"
              style={{
                width: Math.random() * 2 + 'px',
                height: Math.random() * 2 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDelay: Math.random() * 5 + 's',
                opacity: Math.random()
              }}
             />
           ))}
        </div>
      </div>

      {/* --- 🛰️ FREELANCING ANIMATION LAYER (Floating Nodes) --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#00f2ff] rounded-full shadow-[0_0_15px_#00f2ff] animate-float" style={{ animationDuration: '8s' }} />
          <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-[#00f2ff] rounded-full shadow-[0_0_10px_#00f2ff] animate-float" style={{ animationDuration: '12s', animationDelay: '2s' }} />
          <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-[#00f2ff] rounded-full shadow-[0_0_12px_#00f2ff] animate-float" style={{ animationDuration: '10s', animationDelay: '5s' }} />
          {/* SVG Connector Lines mimicking a network */}
          <svg className="absolute inset-0 w-full h-full opacity-10">
            <line x1="25%" y1="25%" x2="75%" y2="50%" stroke="#00f2ff" strokeWidth="0.5" strokeDasharray="5,5" className="animate-dash" />
            <line x1="75%" y1="50%" x2="66%" y2="75%" stroke="#00f2ff" strokeWidth="0.5" strokeDasharray="5,5" className="animate-dash" />
          </svg>
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10">
        {/* --- HERO SECTION --- */}
        <section className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative">
          <div className="grid grid-cols-2 gap-4 max-w-lg mb-12 animate-in fade-in zoom-in duration-1000">
            {[
              { l: "Active Gigs", v: "1.2M+", s: "Global Relay" },
              { l: "Total Settlements", v: "$ 2.5M+", s: "Hassle-free" },
              { l: "Missions Completed", v: "480K+", s: "High-Fidelity" },
              { l: "Relay Latency", v: "0.02s", s: "Real-time" }
            ].map((stat, i) => (
              <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-[40px] backdrop-blur-md shadow-2xl hover:border-[#00f2ff]/20 transition-all group">
                <p className="text-[8px] font-black text-gray-500 uppercase mb-2 tracking-widest italic">{stat.l}</p>
                <h3 className="text-3xl font-black italic text-[#00f2ff] group-hover:scale-110 transition-transform">{stat.v}</h3>
                <p className="text-[7px] text-gray-600 font-bold uppercase mt-2">{stat.s}</p>
              </div>
            ))}
          </div>

          <div className="w-full max-w-sm space-y-4 animate-in slide-in-from-bottom-8 duration-700">
            <SignUpButton mode="modal">
              <button className="w-full py-6 bg-[#00f2ff] text-black font-black rounded-3xl uppercase text-[12px] tracking-[0.3em] hover:scale-105 transition-all shadow-2xl shadow-[#00f2ff]/20">
                Get Started
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="w-full py-5 border border-white/10 text-white font-black rounded-3xl uppercase text-[10px] tracking-[0.3em] hover:bg-white/5 transition-all">
                Sign In
              </button>
            </SignInButton>
          </div>
        </section>

        {/* --- 🚀 INTEL & PROTOCOL CARDS --- */}
        <section className="max-w-7xl mx-auto px-6 pb-32 space-y-32">
          
          <div className="p-12 md:p-20 bg-linear-to-br from-white/5 to-[#00f2ff]/5 border border-white/10 rounded-[60px] relative overflow-hidden group hover:border-[#00f2ff]/30 transition-all duration-700 shadow-2xl backdrop-blur-sm">
            <div className="absolute top-0 right-0 p-10 opacity-10 text-9xl font-black italic select-none">NEXUS</div>
            <div className="max-w-2xl relative z-10 space-y-6 text-left">
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">
                WHAT IS <span className="text-[#00f2ff]">NEXUSGIGS?</span>
              </h2>
              <p className="text-gray-400 text-lg md:text-xl leading-relaxed font-medium">
                NexusGigs is a decentralized satellite relay connecting elite African talent to high-fidelity global missions. We bypass traditional banking delays using instant M-Pesa settlements and secure smart-protocol verification.
              </p>
              <div className="flex gap-4 pt-6">
                <span className="px-4 py-2 bg-[#00f2ff]/10 text-[#00f2ff] text-[10px] font-black rounded-full border border-[#00f2ff]/20 uppercase">No Middlemen</span>
                <span className="px-4 py-2 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded-full border border-emerald-500/20 uppercase">Instant Payouts</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create an account and verify", desc: "Create your account and complete the $10 protocol verification to prove your identity and secure the network." },
              { step: "02", title: "Accept Missions", desc: "Browse high-paying gigs in the Mission Feed. From software engineering to technical writing, apply for elite tasks." },
              { step: "03", title: "Instant Settlement", desc: "Once the mission is cleared, funds are released instantly to your Nexus Wallet for withdrawal via M-Pesa or USDT." }
            ].map((item, i) => (
              <div key={i} className="p-10 bg-white/2 border border-white/10 rounded-[50px] hover:bg-white/5 backdrop-blur-md transition-all group relative">
                <span className="text-6xl font-black italic text-white/5 absolute top-8 right-8 group-hover:text-[#00f2ff]/10 transition-colors">{item.step}</span>
                <h4 className="text-2xl font-black uppercase italic mb-4 text-white group-hover:text-[#00f2ff] transition-colors">{item.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="py-12 border-t border-white/5 text-center">
          <p className="text-[8px] font-black text-gray-700 uppercase tracking-[0.8em]">Nexus Core Infrastructure © 2026</p>
        </footer>
      </div>

      {/* --- 🎨 INLINE CSS ANIMATIONS --- */}
      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-40px) translateX(20px); }
        }
        @keyframes dash {
          to { stroke-dashoffset: -100; }
        }
        .animate-twinkle { animation: twinkle 3s infinite ease-in-out; }
        .animate-float { animation: float 10s infinite ease-in-out; }
        .animate-dash { animation: dash 20s linear infinite; }
      `}</style>
    </div>
  );
}