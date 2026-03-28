"use client";

import { useState, useEffect } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const [passInput, setPassInput] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Check for session on load
  useEffect(() => {
    const auth = sessionStorage.getItem("nexus_admin_session");
    if (auth === "true") {
      setIsAuthorized(true);
    }
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🔓 STEP 1: Check ONLY the password first to let you in
    if (passInput === "Nexus123!") {
      sessionStorage.setItem("nexus_admin_session", "true");
      setIsAuthorized(true);
    } else {
      alert("INVALID PROTOCOL KEY");
      setPassInput("");
    }
  };

  // --- 🔒 THE GATEKEEPER VIEW ---
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#020617]">
        <form onSubmit={handleAuth} className="w-full max-w-sm bg-black/60 border border-red-500/20 p-12 rounded-[48px] backdrop-blur-3xl text-center shadow-2xl">
          <h1 className="text-3xl font-black italic text-red-500 uppercase mb-2 tracking-tighter">NEXUS <span className="text-white">HQ</span></h1>
          <p className="text-[8px] font-black text-gray-500 uppercase tracking-[0.4em] mb-10">Restricted Area: Overseer Only</p>
          <input 
            type="password" 
            autoFocus
            value={passInput}
            onChange={(e) => setPassInput(e.target.value)}
            placeholder="ENTER PROTOCOL KEY" 
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-center font-bold outline-none focus:border-red-500 mb-6 transition-all"
          />
          <button className="w-full py-4 bg-red-600 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-red-500 shadow-xl shadow-red-500/10">Authenticate →</button>
        </form>
      </div>
    );
  }

  // 🛡️ STEP 2: Secondary Email Shield (Runs only AFTER password is correct)
  const adminEmail = "mojojojjy@gmail.com";
  if (isLoaded && user?.emailAddresses[0].emailAddress.toLowerCase() !== adminEmail.toLowerCase()) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-10 text-center">
         <div className="max-w-md space-y-6">
            <h1 className="text-4xl font-black italic text-red-500">IDENTITY MISMATCH</h1>
            <p className="text-gray-500 text-xs uppercase font-bold leading-relaxed">
              Password accepted, but your current Clerk account ({user?.emailAddresses[0].emailAddress}) does not have Overseer privileges.
            </p>
            <button onClick={() => {sessionStorage.clear(); window.location.href="/dashboard"}} className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase">Return to Freelancer Node</button>
         </div>
      </div>
    );
  }

  // --- 🛰️ THE 9-MODULE COMMAND CENTER (Rest of your sidebar code) ---
  const modules = [
    { id: "dashboard", label: "Overview", icon: "📊", desc: "Global Stats" },
    { id: "users", label: "Users", icon: "👤", desc: "Registry" },
    { id: "payments", label: "Payments", icon: "💰", desc: "M-Pesa/Fees" },
    { id: "gigs", label: "Gigs", icon: "💼", desc: "Jobs" },
    { id: "contracts", label: "Contracts", icon: "📜", desc: "Work" },
    { id: "disputes", label: "Disputes", icon: "⚖️", desc: "Support" },
    { id: "analytics", label: "Analytics", icon: "📈", desc: "Reports" },
    { id: "marketing", label: "Marketing", icon: "📢", desc: "Growth" },
    { id: "settings", label: "Settings", icon: "⚙️", desc: "Config" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* (Sidebar and Main Content code from the previous step) */}
      <aside className="w-72 border-r border-red-500/10 bg-black/40 backdrop-blur-xl flex flex-col fixed h-full z-50">
        <div className="p-10"><h2 className="font-black italic text-red-500 uppercase text-2xl tracking-tighter">NEXUS <span className="text-white">HQ</span></h2></div>
        <nav className="flex-1 px-6 space-y-2 overflow-y-auto no-scrollbar">
          {modules.map(m => (
            <button key={m.id} onClick={() => setActiveTab(m.id)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-3xl transition-all ${activeTab === m.id ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              <span className="text-xl">{m.icon}</span>
              <div className="text-left leading-none">
                <p className="text-[10px] font-black uppercase tracking-widest">{m.label}</p>
                <p className={`text-[7px] font-bold uppercase mt-1 ${activeTab === m.id ? 'text-white/70' : 'text-gray-600'}`}>{m.desc}</p>
              </div>
            </button>
          ))}
        </nav>
      </aside>
      <main className="flex-1 ml-72 p-16">
         {activeTab === "dashboard" && (
            <div className="space-y-12">
               <h3 className="text-4xl font-black italic uppercase tracking-tighter">System <span className="text-red-500">Intelligence</span></h3>
               <div className="grid grid-cols-4 gap-6">
                  <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] shadow-2xl">
                     <p className="text-[9px] font-black text-gray-500 uppercase mb-4 tracking-widest italic">Live Nodes</p>
                     <h4 className="text-4xl font-black italic">Active</h4>
                  </div>
               </div>
            </div>
         )}
         {/* Other tabs go here */}
      </main>
    </div>
  );
}