"use client";

import { useState, useEffect } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

export default function AdminPage() {
  const { user } = useUser();
  const [passInput, setPassInput] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Check for session on load
  useEffect(() => {
    const auth = sessionStorage.getItem("nexus_admin_session");
    if (auth === "true" && user?.emailAddresses[0].emailAddress === "mojojojjy@gmail.com") {
      setIsAuthorized(true);
    }
  }, [user]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passInput === "Nexus123!" && user?.emailAddresses[0].emailAddress === "mojojojjy@gmail.com") {
      sessionStorage.setItem("nexus_admin_session", "true");
      setIsAuthorized(true);
    } else {
      alert("UNAUTHORIZED ACCESS DETECTED");
      setPassInput("");
    }
  };

  // --- 🔒 THE GATEKEEPER VIEW ---
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent">
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

  // --- 🛰️ THE 9-MODULE COMMAND CENTER ---
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
    <div className="flex min-h-screen overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-72 border-r border-red-500/10 bg-black/40 backdrop-blur-xl flex flex-col fixed h-full z-50">
        <div className="p-10"><h2 className="font-black italic text-red-500 uppercase text-2xl">NEXUS <span className="text-white">HQ</span></h2></div>
        <nav className="flex-1 px-6 space-y-2 overflow-y-auto no-scrollbar">
          {modules.map(m => (
            <button key={m.id} onClick={() => setActiveTab(m.id)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-3xl transition-all ${activeTab === m.id ? 'bg-red-500 text-white shadow-lg shadow-red-500/20 scale-105' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              <span className="text-xl">{m.icon}</span>
              <div className="text-left leading-none">
                <p className="text-[10px] font-black uppercase tracking-widest">{m.label}</p>
                <p className={`text-[7px] font-bold uppercase mt-1 ${activeTab === m.id ? 'text-white/70' : 'text-gray-600'}`}>{m.desc}</p>
              </div>
            </button>
          ))}
        </nav>
        <div className="p-8 border-t border-white/5">
          <button onClick={() => {sessionStorage.clear(); window.location.reload();}} className="w-full py-3 bg-white/5 rounded-2xl text-[8px] font-black uppercase text-gray-500 hover:text-red-500 transition-all">Lock Console</button>
        </div>
      </aside>

      {/* DYNAMIC CONTENT */}
      <main className="flex-1 ml-72 p-16 animate-in fade-in duration-500">
        {activeTab === "dashboard" && (
          <div className="space-y-12">
            <h3 className="text-4xl font-black italic uppercase tracking-tighter">System <span className="text-red-500">Intelligence</span></h3>
            <div className="grid grid-cols-4 gap-6">
               <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] shadow-2xl">
                  <p className="text-[9px] font-black text-gray-500 uppercase mb-4 tracking-widest italic">Total Nodes</p>
                  <h4 className="text-4xl font-black italic">1,240</h4>
               </div>
               {/* Add more stat cards here */}
            </div>
            <div className="p-10 bg-red-500/5 border border-red-500/10 rounded-[48px]">
               <h5 className="text-[10px] font-black uppercase text-red-500 mb-6 italic tracking-widest">Global Activity Feed</h5>
               <p className="text-xs text-gray-500 italic">Waiting for telemetry data...</p>
            </div>
          </div>
        )}

        {activeTab === "users" && <div className="p-10 text-center uppercase font-black text-red-500">Operator Registry Loaded.</div>}
        {/* We will add the other tabs one by one */}
      </main>
    </div>
  );
}