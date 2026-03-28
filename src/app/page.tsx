"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

// Types for TypeScript
declare global {
  interface Window {
    PayHero: any;
  }
}

export default function LandingPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("home");
  const [currency, setCurrency] = useState<"USD" | "KES">("USD");
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'tasks', icon: '💼', label: 'Gigs' },
    { id: 'contracts', icon: '📜', label: 'Work' },
    { id: 'messages', icon: '💬', label: 'Chats' },
    { id: 'earnings', icon: '💰', label: 'Wallet' },
    { id: 'analytics', icon: '📊', label: 'Stats' },
    { id: 'account', icon: '👤', label: 'Profile' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  const marketplaceGigs = [
    { id: "1", title: "Next.js E-commerce Fix", budget: 450, client: "Alpha Tech", rating: 4.9, dur: "2 Days Left", img: "https://i.pravatar.cc/150?u=1", closed: false },
    { id: "2", title: "Python Data Scraper", budget: 120, client: "Maji Homes", rating: 5.0, dur: "Expired", img: "https://i.pravatar.cc/150?u=2", closed: true },
    { id: "3", title: "Landing Page UI/UX", budget: 300, client: "Nexa Studio", rating: 4.8, dur: "5 Hours Left", img: "https://i.pravatar.cc/150?u=3", closed: false },
    { id: "4", title: "Smart Contract Audit", budget: 1500, client: "Defi Pulse", rating: 5.0, dur: "7 Days Left", img: "https://i.pravatar.cc/150?u=4", closed: false },
    { id: "12", title: "App Localization (Swahili)", budget: 150, client: "Global App", rating: 5.0, dur: "4 Days Left", img: "https://i.pravatar.cc/150?u=12", closed: false },
  ];

  useEffect(() => {
    const handlePaymentSuccess = (event: MessageEvent) => {
      if (event.data.paymentSuccess === true) {
        setIsVerified(true);
        setShowVerifyModal(false);
        setIsPaying(false);
        alert("PROTOCOL ACTIVATED: Your account is now verified.");
        router.refresh();
      }
    };
    window.addEventListener("message", handlePaymentSuccess);
    return () => window.removeEventListener("message", handlePaymentSuccess);
  }, [router]);

  const handleMpesaVerification = () => {
    if (mpesaNumber.length < 10) return alert("Enter valid M-Pesa number");
    setIsPaying(true);
    if (window.PayHero) {
      window.PayHero.init({
        paymentUrl: "https://lipwa.link/6861",
        containerId: "payHeroContainer",
        channelId: 6861,
        amount: 1250, 
        phone: mpesaNumber,
        reference: `verify_${user?.id || Date.now()}`,
        callbackUrl: "https://nexus-gigs.vercel.app/api/mpesa-callback"
      });
    } else {
      alert("Payment system initializing... try again in 2 seconds.");
      setIsPaying(false);
    }
  };

  const marketingMetrics = [
    { label: "Active Nodes", value: "1.2M+", icon: "📡", detail: "Global Freelancer Relay" },
    { label: "Total Settlements", value: "KES 2.5B+", icon: "💰", detail: "Hassle-Free Payments" },
    { label: "Missions Completed", value: "480K+", icon: "🏆", detail: "High-Fidelity Gigs" },
    { label: "Relay Latency", value: "0.02s", icon: "⚡", detail: "Real-Time Bidding" },
  ];

  if (!isLoaded) return null;

  return (
    <main className="relative min-h-screen bg-[#020617] text-white selection:bg-[#00f2ff]/30 flex flex-col items-center justify-center p-6 md:p-10 overflow-hidden font-sans">
      
      {/* ✨ ANIMATED STAR FIELD */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="stars-container relative w-full h-full">
          {[...Array(60)].map((_, i) => (
            <div key={i} className="absolute bg-white rounded-full opacity-30 animate-twinkle" 
                 style={{top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, width: `${1+Math.random()*2}px`, height: `${1+Math.random()*2}px`, animationDelay: `${Math.random()*5}s`}}/>
          ))}
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,242,255,0.06)_0%,transparent_70%)]" />
      </div>

      {/* 🚀 HERO SECTION */}
      <div className="relative z-10 space-y-12 max-w-5xl px-6 text-center animate-in fade-in zoom-in-95 duration-1000">
        
        {/* Title Block */}
        <div className="space-y-3">
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white uppercase leading-none">
            NEXUS <span className="text-[#00f2ff] drop-shadow-[0_0_15px_rgba(0,242,255,0.5)]">GIGS</span>
          </h1>
          <p className="text-[10px] md:text-xs font-black text-gray-500 uppercase tracking-[0.6em] ml-2">Decentralized Mission Relay • v4.0</p>
        </div>

        {/* 🛰️ DATA VISUALIZATION */}
        <div className="relative h-48 md:h-64 flex items-center justify-center">
          <div className="absolute w-40 h-40 md:w-56 md:h-56 border-2 border-[#00f2ff]/20 rounded-full animate-orbit-slow" />
          <div className="absolute w-24 h-24 md:w-32 md:h-32 border border-[#00f2ff]/30 rounded-full animate-orbit-fast" />
          <div className="relative w-16 h-16 md:w-20 md:h-20 bg-[#0a0f1e] rounded-full flex items-center justify-center border border-[#00f2ff]/40 shadow-[0_0_40px_rgba(0,242,255,0.3)]">
            <span className="text-2xl md:text-3xl font-black italic text-[#00f2ff]">N</span>
            <div className="absolute inset-0 rounded-full bg-[#00f2ff]/10 animate-ping" />
          </div>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute w-3 h-3 border border-[#00f2ff] rounded-full bg-[#020617] animate-float-data"
                 style={{animationDelay: `${i*0.8}s`, top: `${20+Math.random()*60}%`, left: `${20+Math.random()*60}%`}}/>
          ))}
        </div>

        {/* --- 🛡️ PROTOCOL METRICS (3D CARDS) --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10">
          {marketingMetrics.map((m, i) => (
            <div key={i} 
                 className="p-8 bg-black/40 border border-white/5 rounded-4xl group relative overflow-hidden transition-all duration-500 hover:border-[#00f2ff]/30 hover:-translate-y-2 hover:shadow-[0_0_50px_rgba(0,242,255,0.1)] active:scale-95">
              
              {/* Card Glow (Pseudo-3D effect) */}
              <div className="absolute inset-0 bg-linear-to-b from-[#00f2ff]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>
              
              {/* Content */}
              <div className="relative z-10 space-y-4">
                 <div className="flex items-center justify-between gap-2">
                   <p className="text-[10px] font-black uppercase text-gray-500 italic tracking-widest">{m.label}</p>
                   <span className="text-xl group-hover:animate-bounce">{m.icon}</span>
                 </div>
                 <h4 className="text-4xl font-black italic text-[#00f2ff] drop-shadow-[0_0_10px_rgba(0,242,255,0.3)]">{m.value}</h4>
                 <p className="text-[8px] font-bold text-white uppercase tracking-wider">{m.detail}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* --- 🛠️ ACTION BUTTONS --- */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-10">
          <Link href="/sign-up" className="group relative px-12 py-5 bg-[#00f2ff] text-black font-black rounded-2xl uppercase text-[10px] tracking-[0.2em] hover:bg-white transition-all shadow-[0_0_40px_rgba(0,242,255,0.2)] active:scale-95">
            Initialize Node
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00f2ff]"></span>
            </span>
          </Link>
          <Link href="/sign-in" className="px-12 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl uppercase text-[10px] tracking-[0.2em] hover:bg-white/10 transition-all active:scale-95">
            Access Protocol
          </Link>
        </div>
      </div>

      {/* --- 🛠️ FOOTER LOGS --- */}
      <div className="absolute bottom-10 w-full px-10 flex justify-between items-end opacity-20 pointer-events-none">
        <div className="text-[7px] font-black text-white uppercase tracking-[0.4em] space-y-1">
          <p>System Status: Online</p>
          <p>Global Uplink: Active</p>
        </div>
        <p className="text-[7px] font-black text-white uppercase tracking-[0.5em]">© 2026 NEXUS CORE INFRASTRUCTURE</p>
      </div>

      {/* --- 💫 GLOBAL ANIMATIONS --- */}
      <style jsx global>{`
        @keyframes twinkle { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.2); } }
        @keyframes orbit-slow { 0% { transform: rotate(0deg) scaleX(1); } 50% { transform: rotate(180deg) scaleX(0.9); } 100% { transform: rotate(360deg) scaleX(1); } }
        @keyframes orbit-fast { 0% { transform: rotate(0deg) scaleY(1); } 50% { transform: rotate(-180deg) scaleY(1.1); } 100% { transform: rotate(-360deg) scaleY(1); } }
        @keyframes float-data { 0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; } 25% { transform: translate(15px, -10px) scale(1.1); opacity: 1; } 50% { transform: translate(-10px, 15px) scale(1.05); opacity: 0.8; } 75% { transform: translate(-15px, -15px) scale(1.2); opacity: 1; } }
        .animate-twinkle { animation: twinkle infinite ease-in-out; }
        .animate-orbit-slow { animation: orbit-slow 15s linear infinite; }
        .animate-orbit-fast { animation: orbit-fast 8s linear infinite; }
        .animate-float-data { animation: float-data 6s infinite ease-in-out; }
      `}</style>
    </main>
  );
}