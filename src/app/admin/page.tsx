"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { getAllNexusUsers, verifyUserNode, terminateUserNode } from "./_actions/users"; 

export default function AdminPage() {
  const { user: clerkUser } = useUser();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [operators, setOperators] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fetching, setFetching] = useState(false);

  // --- 📊 DYNAMIC FINANCIAL LOGIC ---
  const verifiedNodes = operators.filter(o => o.status === "Verified");
  const pendingNodes = operators.filter(o => o.status === "Pending");
  const revenueKes = verifiedNodes.length * 1250;

  useEffect(() => {
    const auth = sessionStorage.getItem("nexus_admin_session");
    if (auth === "true") setIsAuthorized(true);
  }, []);

  useEffect(() => {
    if (isAuthorized) loadData();
  }, [isAuthorized]);

  const loadData = async () => {
    setFetching(true);
    const res = await getAllNexusUsers();
    if (res.success && res.users) setOperators(res.users);
    setFetching(false);
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passInput === "Nexus123!") {
      sessionStorage.setItem("nexus_admin_session", "true");
      setIsAuthorized(true);
    } else {
      alert("SIGNAL DENIED: INVALID KEY");
      setPassInput("");
    }
  };

  const handleVerify = async (id: string) => {
    if (!confirm("Authorize elite uplink for this node?")) return;
    setFetching(true);
    await verifyUserNode(id);
    await loadData();
  };

  const handleTerminate = async (id: string) => {
    if (!confirm("🚨 WARNING: This will permanently delete the operator node. Proceed?")) return;
    setFetching(true);
    await terminateUserNode(id);
    await loadData();
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
        <form onSubmit={handleAuth} className="w-full max-w-sm bg-[#0a0f1e] border border-red-500/20 p-12 rounded-[50px] text-center shadow-2xl backdrop-blur-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-red-500 to-transparent opacity-50" />
          <h1 className="text-3xl font-black italic text-red-500 uppercase tracking-tighter mb-8">NEXUS <span className="text-white">HQ</span></h1>
          <input type="password" autoFocus value={passInput} onChange={(e) => setPassInput(e.target.value)} placeholder="PROTOCOL KEY" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-center font-bold mb-6 outline-none focus:border-red-500 transition-all" />
          <button className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-red-600/10">Authenticate</button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#020617] text-white selection:bg-red-500/30">
      
      {/* --- 📱 MOBILE NAVIGATION --- */}
      <div className="md:hidden flex items-center justify-between p-6 bg-black/60 border-b border-white/5 sticky top-0 z-100 backdrop-blur-xl">
        <h2 className="font-black text-red-500 uppercase italic tracking-tighter text-xl">NEXUS <span className="text-white">HQ</span></h2>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-3 bg-white/5 rounded-xl border border-white/10">{isMobileMenuOpen ? "✕" : "☰"}</button>
      </div>

      {/* --- 🛡️ SIDEBAR (FIXED SCROLL & OVERLAP) --- */}
      <aside className={`w-full md:w-72 bg-black/40 border-r border-red-500/10 fixed md:sticky top-0 h-screen z-50 transition-transform duration-500 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-10 hidden md:block text-center border-b border-white/5">
           <h2 className="font-black text-red-500 uppercase italic text-2xl tracking-tighter">NEXUS HQ</h2>
           <div className="flex items-center justify-center gap-2 mt-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-[8px] text-gray-500 uppercase font-black tracking-[0.3em]">{clerkUser?.firstName} • ADMIN</p>
           </div>
        </div>
        <nav className="p-6 space-y-2 flex flex-col h-[calc(100%-140px)] overflow-y-auto custom-scrollbar">
          {[
            { id: "dashboard", label: "Overview", icon: "📊" },
            { id: "users", label: "Node Registry", icon: "👤" },
            { id: "payments", label: "Payout Matrix", icon: "💰" },
            { id: "analytics", label: "Intel Ops", icon: "📈" }
          ].map(m => (
            <button key={m.id} onClick={() => { setActiveTab(m.id); setIsMobileMenuOpen(false); }} className={`flex items-center gap-4 px-6 py-5 rounded-3xl transition-all ${activeTab === m.id ? 'bg-red-600 text-white shadow-2xl scale-105 italic font-black' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              <span className="text-xl">{m.icon}</span><span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
            </button>
          ))}
          <div className="mt-auto pt-8">
             <button onClick={() => {sessionStorage.clear(); window.location.reload();}} className="w-full py-4 text-gray-600 text-[9px] font-black uppercase hover:text-red-500 border-t border-white/5 transition-colors italic">Terminate Session</button>
          </div>
        </nav>
      </aside>

      {/* --- 🖥️ MAIN WORKSPACE --- */}
      <main className="flex-1 p-6 md:p-16 space-y-12 overflow-x-hidden">
        
        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div className="space-y-12 animate-in fade-in duration-700">
            <header className="flex justify-between items-end border-b border-white/5 pb-8">
               <div>
                  <h3 className="text-4xl font-black uppercase italic text-red-500 tracking-tighter">System Pulse</h3>
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] mt-2 italic">Real-time Financial Transmission Matrix</p>
               </div>
               <button onClick={loadData} className="p-4 bg-white/5 rounded-full border border-white/10 hover:bg-red-500/10 transition-all">🔄</button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-10 bg-white/5 border border-white/10 rounded-[48px] shadow-2xl relative group hover:border-red-500/30 transition-all">
                <p className="text-[10px] font-black text-gray-500 uppercase mb-4 italic tracking-widest">Total Vault Yield</p>
                <div className="flex items-baseline gap-2"><span className="text-sm font-black text-gray-700">KES</span><h4 className="text-5xl font-black italic">{revenueKes.toLocaleString()}</h4></div>
              </div>
              <div className="p-10 bg-white/5 border border-white/10 rounded-[48px] shadow-2xl relative">
                <p className="text-[10px] font-black text-gray-500 uppercase mb-4 italic tracking-widest">Operator Nodes</p>
                <h4 className="text-5xl font-black italic text-white">{operators.length}</h4>
              </div>
              <div className="p-10 bg-white/5 border border-white/10 rounded-[48px] shadow-2xl relative">
                <p className="text-[10px] font-black text-gray-500 uppercase mb-4 italic tracking-widest">Elite Density</p>
                <h4 className="text-5xl font-black italic text-emerald-500">{operators.length > 0 ? ((verifiedNodes.length/operators.length)*100).toFixed(0) : 0}%</h4>
              </div>
            </div>
          </div>
        )}

        {/* REGISTRY TAB */}
        {activeTab === "users" && (
          <div className="space-y-8 animate-in slide-in-from-right-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
               <h3 className="text-3xl font-black uppercase italic text-red-500 tracking-tighter">Node Registry</h3>
               <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="SEARCH NODE ID..." className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-black text-white outline-none focus:border-red-500 w-full md:w-80 shadow-inner" />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-[9px] font-black uppercase text-gray-600 italic">
                  <tr><th className="p-8">Operator Ident</th><th className="p-8">Sync Status</th><th className="p-8 text-right">Command</th></tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {fetching ? (
                    <tr><td colSpan={3} className="p-32 text-center animate-pulse text-red-500 font-black italic text-sm tracking-widest">SYNCHRONIZING RELAY...</td></tr>
                  ) : operators.filter(o => o.name.toLowerCase().includes(searchTerm.toLowerCase())).map((op) => (
                    <tr key={op.id} className="text-[11px] hover:bg-white/2 transition-all group">
                      <td className="p-8 font-black uppercase italic">{op.name}<br/><span className="text-[9px] text-gray-600 not-italic font-bold tracking-tight">{op.email}</span></td>
                      <td className="p-8"><span className={`px-4 py-1.5 rounded-xl border italic font-black text-[9px] ${op.status === 'Verified' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-amber-500 border-amber-500/20 bg-amber-500/5'}`}>{op.status}</span></td>
                      <td className="p-8 text-right flex justify-end gap-4">
                        {op.status === 'Pending' && <button onClick={() => handleVerify(op.id)} className="text-[10px] font-black text-emerald-500 uppercase hover:underline italic">Authorize</button>}
                        <button onClick={() => handleTerminate(op.id)} className="text-[10px] font-black text-red-500 uppercase hover:underline italic">Terminate</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === "payments" && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4">
            <h3 className="text-3xl font-black uppercase italic text-red-500 tracking-tighter">Financials</h3>
            <div className="grid gap-4">
              {verifiedNodes.length > 0 ? verifiedNodes.map(u => (
                <div key={u.id} className="p-8 bg-white/5 border border-white/10 rounded-4xl flex justify-between items-center group hover:border-[#00f2ff]/30 transition-all">
                  <div>
                    <p className="text-[12px] font-black italic uppercase text-white">{u.name}</p>
                    <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mt-1">Verification Settlement • {u.joined}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black italic text-emerald-500">KES 1,250</p>
                    <p className="text-[8px] font-bold text-emerald-500/50 uppercase italic">Cleared</p>
                  </div>
                </div>
              )) : (
                <div className="p-24 text-center border-2 border-dashed border-white/5 rounded-[48px] text-gray-700 font-black italic uppercase">No Settlement Data Detected</div>
              )}
            </div>
          </div>
        )}

        {/* INTEL TAB */}
        {activeTab === "analytics" && (
          <div className="space-y-8 animate-in zoom-in-95">
             <h3 className="text-3xl font-black uppercase italic text-red-500 tracking-tighter">Network Intel</h3>
             <div className="p-12 bg-white/5 border border-white/10 rounded-[50px] space-y-10">
                <div className="flex justify-between items-end">
                   <div><p className="text-[10px] font-black uppercase text-gray-500 mb-2 italic">Node Latency Pulse</p><h4 className="text-6xl font-black italic text-white">0.02<span className="text-red-500 text-2xl">s</span></h4></div>
                   <div className="text-right"><p className="text-[10px] font-black uppercase text-gray-500 mb-2 italic">Network Stability</p><h4 className="text-4xl font-black italic text-emerald-500">99.9%</h4></div>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden shadow-inner"><div className="h-full bg-red-600 w-[94%] shadow-[0_0_20px_#dc2626]" /></div>
             </div>
          </div>
        )}

      </main>
    </div>
  );
}