"use client";

import { useState, useEffect, useCallback } from "react";
import { getAllNexusUsers, verifyUserNode, terminateUserNode, suspendUserNode } from "./_actions/users"; 

interface NexusUser {
  id: string;
  name: string;
  email: string;
  status: string;
  role: string;
  banned: boolean;
  joined: string;
  createdAt: number;
}

export default function AdminPage() {
  const [passInput, setPassInput] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [operators, setOperators] = useState<NexusUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fetching, setFetching] = useState(false);
  const [expandedClient, setExpandedClient] = useState<string | null>(null);

  // System Settings
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [commissionRate, setCommissionRate] = useState(2);

  // --- 📈 REAL-TIME CALCULATIONS ---
  const verifiedNodes = operators.filter(o => o.status === "Verified");
  const totalRevenue = (verifiedNodes.length * 1250); // Real value from Clerk
  const startOfToday = new Date().setHours(0, 0, 0, 0);
  const todaysRevenue = verifiedNodes.filter(o => o.createdAt >= startOfToday).length * 1250;

  // Mocked Gigs for Settlement Display
  const activeMissions = [
    { id: "CL-01", name: "Alpha Tech", totalBudget: "KES 150,000", gigs: [
      { id: "G-1", title: "E-commerce Optimization", freelancer: "Emmanuel Muema", budget: "KES 45,000" },
    ]},
    { id: "CL-02", name: "Nexa Studio", totalBudget: "KES 85,000", gigs: [
      { id: "G-3", title: "UI/UX Design System", freelancer: "Jane Smith", budget: "KES 85,000" }
    ]}
  ];

  const loadData = useCallback(async () => {
    if (!isAuthorized) return;
    setFetching(true);
    const res = await getAllNexusUsers();
    if (res.success && res.users) setOperators(res.users as NexusUser[]);
    setFetching(false);
  }, [isAuthorized]);

  useEffect(() => {
    if (sessionStorage.getItem("nexus_admin_session") === "true") setIsAuthorized(true);
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      loadData();
      const heartbeat = setInterval(() => { loadData(); }, 10000); // 10s Real-time Sync
      return () => clearInterval(heartbeat);
    }
  }, [isAuthorized, loadData]);

  const handleAction = async (actionFn: any, id: string, extraArg?: any) => {
    setFetching(true);
    await actionFn(id, extraArg);
    await loadData();
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <form onSubmit={(e) => { e.preventDefault(); if(passInput === "Nexus123!") { sessionStorage.setItem("nexus_admin_session", "true"); setIsAuthorized(true); } }} className="w-full max-w-sm bg-black border border-red-500/20 p-10 rounded-[50px] text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-600/10 border border-red-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8 text-2xl">🛡️</div>
          <h1 className="text-2xl font-black italic text-red-500 uppercase mb-2">NEXUS HQ</h1>
          <p className="text-[8px] text-gray-500 uppercase tracking-[0.4em] mb-8 font-black">Authorized Personnel Only</p>
          <input type="password" value={passInput} onChange={(e) => setPassInput(e.target.value)} placeholder="PROTOCOL KEY" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-center font-bold mb-6 outline-none focus:border-red-500 transition-all" />
          <button className="w-full py-4 bg-red-600 text-white font-black rounded-2xl uppercase text-[10px] italic hover:scale-105 active:scale-95 transition-all">Unlock Command Center</button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#020617] text-white font-sans selection:bg-red-500/30 overflow-x-hidden">
      
      {/* --- 📱 MOBILE HEADER --- */}
      <div className="md:hidden fixed top-0 w-full h-20 bg-black/90 backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between px-6">
        <h2 className="font-black italic text-red-500 uppercase tracking-tighter">NEXUS HQ</h2>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-3 bg-white/5 rounded-xl border border-white/10">{isMobileMenuOpen ? "✕" : "☰"}</button>
      </div>

      {/* --- 📟 SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-black border-r border-red-500/10 backdrop-blur-3xl transform transition-transform duration-300 md:translate-x-0 md:sticky md:top-0 md:h-screen ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-10 text-center font-black italic text-red-500 border-b border-white/5 hidden md:block uppercase tracking-widest">Nexus Command</div>
        <nav className="p-6 space-y-2 mt-20 md:mt-4">
          {[
            { id: "dashboard", label: "Overview", icon: "📊" },
            { id: "users", label: "Registry", icon: "👤" },
            { id: "payments", label: "Settlements", icon: "💰" },
            { id: "settings", label: "System Core", icon: "⚙️" }
          ].map(m => (
            <button key={m.id} onClick={() => { setActiveTab(m.id); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-4 px-6 py-5 rounded-[30px] transition-all ${activeTab === m.id ? 'bg-red-600 shadow-xl shadow-red-600/20 italic' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              <span className="text-xl">{m.icon}</span><span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* --- 🚀 MAIN DASHBOARD --- */}
      <main className="flex-1 p-6 md:p-16 pt-28 md:pt-16 space-y-12 animate-in fade-in duration-700">
        
        {/* --- 📊 OVERVIEW TAB --- */}
        {activeTab === "dashboard" && (
          <div className="space-y-12">
            <h3 className="text-3xl font-black uppercase italic text-red-500">System Pulse</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-10 bg-white/5 border border-white/10 rounded-[50px] group hover:border-red-500/30 transition-all">
                <p className="text-[10px] font-black text-gray-500 uppercase mb-4 italic tracking-[0.3em]">Global Yield</p>
                <div className="flex items-baseline gap-2"><span className="text-sm font-black text-gray-700">KES</span><h4 className="text-5xl font-black italic">{totalRevenue.toLocaleString()}</h4></div>
              </div>
              <div className="p-10 bg-red-600/10 border border-red-500/20 rounded-[50px]">
                <p className="text-[10px] font-black text-red-500 uppercase mb-4 italic tracking-[0.3em]">Today's Inflow</p>
                <h4 className="text-5xl font-black italic text-white">KES {todaysRevenue.toLocaleString()}</h4>
              </div>
              <div className="p-10 bg-black/40 border border-white/5 rounded-[50px] flex flex-col justify-center text-center">
                <p className="text-[10px] font-black text-gray-500 uppercase mb-4 italic tracking-[0.3em]">Verified Nodes</p>
                <h4 className="text-6xl font-black italic text-white">{verifiedNodes.length}</h4>
              </div>
            </div>
          </div>
        )}

        {/* --- 👤 REGISTRY TAB --- */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h3 className="text-2xl font-black italic uppercase text-red-500">Node Registry</h3>
              <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="FILTER NODES..." className="w-full md:w-auto bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-[10px] font-black text-white outline-none focus:border-red-500 transition-all" />
            </div>
            <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-[40px] no-scrollbar">
              <table className="w-full text-left min-w-187.5">
                <thead className="bg-white/5 text-[8px] font-black uppercase text-gray-500 italic"><tr><th className="p-8">Operator</th><th className="p-8">Sync Status</th><th className="p-8 text-right">Protocol Commands</th></tr></thead>
                <tbody className="divide-y divide-white/5">
                  {operators.filter(o => o.name.toLowerCase().includes(searchTerm.toLowerCase())).map((op) => (
                    <tr key={op.id} className="text-[11px] hover:bg-white/2 transition-all">
                      <td className="p-8 font-black uppercase italic">{op.name}<br/><span className="text-[8px] text-gray-500 font-bold">{op.email}</span></td>
                      <td className="p-8"><span className={`px-4 py-1 rounded-full border italic font-black text-[9px] ${op.status === 'Verified' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 'text-amber-500 border-amber-500/20 bg-amber-500/5'}`}>{op.banned ? "TERMINATED" : op.status}</span></td>
                      <td className="p-8 text-right space-x-6 font-black uppercase italic text-[9px]">
                        <button onClick={() => handleAction(verifyUserNode, op.id)} className="text-emerald-500 hover:text-white transition-colors">Verify</button>
                        <button onClick={() => handleAction(suspendUserNode as any, op.id, !op.banned)} className="text-amber-500 hover:text-white transition-colors">{op.banned ? "Restore" : "Suspend"}</button>
                        <button onClick={() => { if(confirm("Permanently wipe node?")) handleAction(terminateUserNode, op.id); }} className="text-red-500 hover:text-white transition-colors">Kill</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- 💰 SETTLEMENTS TAB --- */}
        {activeTab === "payments" && (
          <div className="space-y-12 animate-in slide-in-from-bottom-5">
            <h3 className="text-2xl font-black italic uppercase text-red-500">Financial Stream</h3>
            
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic border-l-4 border-amber-500 pl-4">Active Client Missions</h4>
              <div className="grid gap-4">
                {activeMissions.map((client) => (
                  <div key={client.id} className="bg-white/5 border border-white/10 rounded-[45px] overflow-hidden">
                    <button onClick={() => setExpandedClient(expandedClient === client.id ? null : client.id)} className="w-full p-10 flex justify-between items-center hover:bg-white/5 transition-all">
                      <div className="text-left"><p className="text-2xl font-black uppercase italic tracking-tighter">{client.name}</p><p className="text-[9px] text-gray-500 font-black uppercase mt-1">Total Escrow: {client.totalBudget}</p></div>
                      <span className="text-2xl font-black text-red-500">{expandedClient === client.id ? "−" : "+"}</span>
                    </button>
                    {expandedClient === client.id && (
                      <div className="px-10 pb-10 space-y-4 animate-in slide-in-from-top-4">
                        {client.gigs.map((gig) => (
                          <div key={gig.id} className="p-8 bg-black/40 border border-white/5 rounded-[30px] flex justify-between items-center group hover:border-[#00f2ff]/20">
                            <div><p className="text-[11px] font-black text-[#00f2ff] uppercase italic">{gig.title}</p><p className="text-[9px] text-gray-600 uppercase mt-1">Target Node: <span className="text-white">{gig.freelancer}</span></p></div>
                            <div className="text-right"><p className="text-lg font-black italic">{gig.budget}</p><div className="mt-3 flex gap-3 justify-end"><button className="px-4 py-2 bg-emerald-600 text-white text-[8px] font-black uppercase rounded-xl">Release</button><button className="px-4 py-2 bg-red-900/40 text-red-500 border border-red-500/20 text-[8px] font-black uppercase rounded-xl">Dispute</button></div></div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6 pt-10 border-t border-white/5">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic border-l-4 border-emerald-500 pl-4">Transaction Ledger (Real-Time)</h4>
              <div className="bg-white/2 border border-white/10 rounded-[40px] overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-[8px] font-black uppercase text-gray-500 italic"><tr><th className="p-8">Entity</th><th className="p-8">Protocol</th><th className="p-8">Value</th><th className="p-8 text-right">Status</th></tr></thead>
                  <tbody className="divide-y divide-white/5">
                    {verifiedNodes.map(u => (
                      <tr key={u.id} className="text-[10px] hover:bg-white/2 transition-all">
                        <td className="p-8 font-black uppercase italic">{u.name}</td>
                        <td className="p-8 text-gray-600 font-bold uppercase italic">NODE_SYNC_VERIFY</td>
                        <td className="p-8 font-black italic text-emerald-500">KES 1,250</td>
                        <td className="p-8 text-right"><span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[8px] font-black uppercase italic">Settled</span></td>
                      </tr>
                    ))}
                    <tr className="text-[10px] opacity-40"><td className="p-8 font-black uppercase italic">Legacy Pipeline</td><td className="p-8 font-bold italic">GIG_RESERVE</td><td className="p-8 font-black italic">KES 45,000</td><td className="p-8 text-right"><span className="text-[8px] font-black uppercase italic">Archive</span></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- ⚙️ SYSTEM CORE TAB --- */}
        {activeTab === "settings" && (
          <div className="max-w-2xl space-y-10 animate-in zoom-in-95">
             <h3 className="text-2xl font-black italic uppercase text-red-500">System Core</h3>
             <div className="p-10 md:p-14 bg-white/5 border border-white/10 rounded-[60px] space-y-10">
                <div className="flex justify-between items-center">
                   <div><h4 className="text-sm font-black uppercase italic tracking-widest">Protocol Lock</h4><p className="text-[9px] text-gray-500 uppercase italic">Pause all bidding and node activity</p></div>
                   <button onClick={() => setIsMaintenanceMode(!isMaintenanceMode)} className={`w-14 h-7 rounded-full relative transition-all ${isMaintenanceMode ? 'bg-red-600' : 'bg-white/10'}`}><div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${isMaintenanceMode ? 'left-8' : 'left-1'}`} /></button>
                </div>
                <div className="space-y-6 pt-10 border-t border-white/5">
                   <div className="flex justify-between"><label className="text-[10px] font-black text-gray-500 uppercase italic">Commission Relay Rate</label><span className="text-red-500 font-black text-sm">{commissionRate}%</span></div>
                   <input type="range" min="1" max="10" value={commissionRate} onChange={(e) => setCommissionRate(parseInt(e.target.value))} className="w-full accent-red-600 bg-white/10 h-1 rounded-full appearance-none cursor-pointer" />
                </div>
                <button onClick={() => alert("Satellite Uplink Configured Successfully.")} className="w-full py-6 bg-white text-black font-black rounded-[25px] uppercase text-[10px] tracking-[0.4em] italic shadow-2xl transition-all active:scale-95">Synchronize Global Config</button>
             </div>
             <div className="p-10 bg-red-900/10 border border-red-500/20 rounded-[50px] text-center space-y-6">
                <p className="text-[8px] font-black text-red-500 uppercase italic tracking-widest">Wipe Log Command</p>
                <button className="w-full py-5 bg-red-600 text-white font-black rounded-[25px] text-[10px] uppercase italic">Execute Wipe</button>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}