"use client";

import { useState, useEffect } from "react";
import { getAllNexusUsers, verifyUserNode, terminateUserNode, suspendUserNode } from "./_actions/users"; 

interface NexusUser {
  id: string;
  name: string;
  email: string;
  status: string;
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
  
  // Settings States
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [commissionRate, setCommissionRate] = useState(2);

  // --- 📈 REAL-TIME REVENUE LOGIC ---
  const verifiedNodes = operators.filter(o => o.status === "Verified");
  const totalRevenue = verifiedNodes.length * 1250;
  
  const today = new Date().setHours(0, 0, 0, 0);
  const todaysRevenue = verifiedNodes.filter(o => o.createdAt >= today).length * 1250;

  useEffect(() => {
    if (sessionStorage.getItem("nexus_admin_session") === "true") setIsAuthorized(true);
  }, []);

  useEffect(() => {
    if (isAuthorized) loadData();
    // Auto-refresh every 30 seconds for "Real-Time" feel
    const interval = setInterval(() => { if(isAuthorized) loadData(); }, 30000);
    return () => clearInterval(interval);
  }, [isAuthorized]);

  const loadData = async () => {
    setFetching(true);
    const res = await getAllNexusUsers();
    if (res.success && res.users) setOperators(res.users as NexusUser[]);
    setFetching(false);
  };

  const handleAction = async (actionFn: any, id: string, extraArg?: any) => {
    setFetching(true);
    await actionFn(id, extraArg);
    await loadData();
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <form onSubmit={(e) => { e.preventDefault(); if(passInput === "Nexus123!") { sessionStorage.setItem("nexus_admin_session", "true"); setIsAuthorized(true); } }} className="w-full max-w-sm bg-black border border-red-500/20 p-8 rounded-[40px] text-center shadow-2xl">
          <h1 className="text-2xl font-black italic text-red-500 uppercase mb-6">NEXUS HQ</h1>
          <input type="password" value={passInput} onChange={(e) => setPassInput(e.target.value)} placeholder="PROTOCOL KEY" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-center font-bold mb-6 outline-none" />
          <button className="w-full py-4 bg-red-600 text-white font-black rounded-2xl uppercase text-[10px]">Initialize Command</button>
        </form>
      </div>
    );
  }

  const menuItems = [
    { id: "dashboard", label: "Overview", icon: "📊" },
    { id: "users", label: "Registry", icon: "👤" },
    { id: "payments", label: "Settlements", icon: "💰" },
    { id: "settings", label: "System Core", icon: "⚙️" }
  ];

  return (
    <div className="flex min-h-screen bg-[#020617] text-white font-sans">
      
      {/* MOBILE NAV BAR */}
      <div className="md:hidden fixed top-0 w-full h-20 bg-black/90 backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between px-6">
        <h2 className="font-black italic text-red-500 uppercase">NEXUS HQ</h2>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-3 bg-white/5 rounded-xl border border-white/10">{isMobileMenuOpen ? "✕" : "☰"}</button>
      </div>

      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-black border-r border-red-500/10 backdrop-blur-3xl transform transition-transform duration-300 md:translate-x-0 md:sticky md:top-0 md:h-screen ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-10 text-center font-black italic text-red-500 border-b border-white/5 hidden md:block">NEXUS HQ</div>
        <nav className="p-6 space-y-2 mt-20 md:mt-4">
          {menuItems.map(m => (
            <button key={m.id} onClick={() => { setActiveTab(m.id); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-4 px-6 py-4 rounded-3xl transition-all ${activeTab === m.id ? 'bg-red-600 shadow-xl italic' : 'text-gray-500 hover:text-white'}`}>
              <span className="text-xl">{m.icon}</span><span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-16 pt-28 md:pt-16 space-y-12">
        
        {/* --- OVERVIEW TAB --- */}
        {activeTab === "dashboard" && (
          <div className="space-y-12 animate-in fade-in">
            <h3 className="text-3xl font-black uppercase italic text-red-500">System Pulse</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><span className="text-6xl">💰</span></div>
                <p className="text-[10px] font-black text-gray-500 uppercase mb-4 italic tracking-widest">Total Revenue</p>
                <h4 className="text-5xl font-black italic">KES {totalRevenue.toLocaleString()}</h4>
              </div>
              <div className="p-10 bg-red-600/10 border border-red-500/20 rounded-[40px]">
                <p className="text-[10px] font-black text-red-500 uppercase mb-4 italic tracking-widest">Today's Revenue</p>
                <h4 className="text-5xl font-black italic text-white">KES {todaysRevenue.toLocaleString()}</h4>
              </div>
              <div className="p-10 bg-black border border-white/5 rounded-[40px] flex flex-col justify-center text-center">
                <p className="text-[10px] font-black text-gray-500 uppercase mb-4 italic tracking-widest">Active Nodes</p>
                <h4 className="text-6xl font-black italic">{operators.length}</h4>
              </div>
            </div>
          </div>
        )}

        {/* --- REGISTRY TAB --- */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center"><h3 className="text-2xl font-black italic uppercase text-red-500">Node Registry</h3><button onClick={loadData} className="text-[8px] font-black uppercase bg-white/5 px-4 py-2 rounded-lg border border-white/10">Refresh Sync</button></div>
            <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-4xl no-scrollbar">
              <table className="w-full text-left min-w-150">
                <thead className="bg-white/5 text-[8px] font-black uppercase text-gray-500 italic"><tr><th className="p-6">Operator</th><th className="p-6">Status</th><th className="p-6 text-right">Commands</th></tr></thead>
                <tbody className="divide-y divide-white/5">
                  {operators.map((op) => (
                    <tr key={op.id} className="text-[11px] hover:bg-white/2 transition-all">
                      <td className="p-6 font-black uppercase italic">{op.name}<br/><span className="text-[8px] text-gray-600 font-bold">{op.email}</span></td>
                      <td className="p-6"><span className={`px-3 py-1 rounded-lg border italic font-black ${op.status === 'Verified' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-amber-500 border-amber-500/20 bg-amber-500/5'}`}>{op.banned ? "TERMINATED" : op.status}</span></td>
                      <td className="p-6 text-right space-x-4">
                        <button onClick={() => handleAction(verifyUserNode, op.id)} className="text-[10px] font-black text-emerald-500 uppercase hover:underline">Verify</button>
                        <button onClick={() => handleAction(suspendUserNode as any, op.id, !op.banned)} className="text-[10px] font-black text-amber-500 uppercase hover:underline">{op.banned ? "Restore" : "Suspend"}</button>
                        <button onClick={() => { if(confirm("Kill Node?")) handleAction(terminateUserNode, op.id); }} className="text-[10px] font-black text-red-500 uppercase hover:underline">Kill</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- SETTINGS TAB --- */}
        {activeTab === "settings" && (
          <div className="max-w-2xl space-y-10 animate-in zoom-in-95">
             <h3 className="text-2xl font-black italic uppercase text-red-500">System Core</h3>
             
             <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] space-y-8">
                <div className="flex justify-between items-center">
                   <div><h4 className="text-sm font-black uppercase italic">Maintenance Mode</h4><p className="text-[9px] text-gray-500 uppercase">Redirects users to 'Update in Progress' page</p></div>
                   <button onClick={() => setIsMaintenanceMode(!isMaintenanceMode)} className={`w-16 h-8 rounded-full transition-all relative ${isMaintenanceMode ? 'bg-red-600' : 'bg-white/10'}`}><div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${isMaintenanceMode ? 'left-9' : 'left-1'}`} /></button>
                </div>
                
                <div className="space-y-4 pt-6 border-t border-white/5">
                   <label className="text-[9px] font-black text-gray-500 uppercase italic">Commission Rate (%)</label>
                   <div className="flex gap-4 items-center">
                      <input type="range" min="1" max="10" value={commissionRate} onChange={(e) => setCommissionRate(parseInt(e.target.value))} className="flex-1 accent-red-600" />
                      <span className="text-2xl font-black italic text-red-500">{commissionRate}%</span>
                   </div>
                </div>

                <div className="pt-6 border-t border-white/5 space-y-4">
                   <button onClick={() => alert("Global Satellite Config Saved")} className="w-full py-5 bg-white text-black font-black rounded-2xl uppercase text-[10px] tracking-widest shadow-xl shadow-white/5 italic">Save Changes</button>
                </div>
             </div>
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === "payments" && (
          <div className="space-y-6">
            <h3 className="text-2xl font-black italic uppercase text-red-500">Settlements</h3>
            {verifiedNodes.map(u => (
              <div key={u.id} className="p-6 bg-white/5 border border-white/10 rounded-3xl flex justify-between items-center">
                <div><p className="text-[11px] font-black uppercase italic">{u.name}</p><p className="text-[8px] text-gray-500 uppercase">Verification Fee Collected</p></div>
                <div className="text-right"><p className="text-lg font-black italic text-emerald-500">KES 1,250</p><p className="text-[7px] text-gray-400 uppercase">{u.joined}</p></div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}