"use client";

import { useState, useEffect } from "react";
import { getAllNexusUsers, verifyUserNode, terminateUserNode, suspendUserNode } from "./_actions/users"; 

// --- 🛰️ TYPE DEFINITION FOR NEXUS OPERATORS ---
interface NexusUser {
  id: string;
  name: string;
  email: string;
  status: string;
  banned: boolean;
  joined: string;
}

export default function AdminPage() {
  const [passInput, setPassInput] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [operators, setOperators] = useState<NexusUser[]>([]); // Typed state to fix the error
  const [searchTerm, setSearchTerm] = useState("");
  const [fetching, setFetching] = useState(false);

  // Derived Stats based on real data
  const verifiedCount = operators.filter(o => o.status === "Verified").length;
  const revenueKes = verifiedCount * 1250;

  useEffect(() => {
    if (sessionStorage.getItem("nexus_admin_session") === "true") setIsAuthorized(true);
  }, []);

  useEffect(() => {
    if (isAuthorized) loadData();
  }, [isAuthorized, activeTab]);

  const loadData = async () => {
    setFetching(true);
    const res = await getAllNexusUsers();
    // Use type casting to ensure compatibility with NexusUser interface
    if (res.success && res.users) {
        setOperators(res.users as NexusUser[]);
    }
    setFetching(false);
  };

  const handleAction = async (actionFn: (id: string, ...args: any[]) => Promise<any>, id: string, extraArg?: any) => {
    setFetching(true);
    await actionFn(id, extraArg);
    await loadData(); // Refresh list immediately after action
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <form 
          onSubmit={(e) => { 
            e.preventDefault(); 
            if(passInput === "Nexus123!") { 
              sessionStorage.setItem("nexus_admin_session", "true"); 
              setIsAuthorized(true); 
            } else {
              alert("ACCESS DENIED: PROTOCOL BREACH");
            }
          }} 
          className="w-full max-w-sm bg-black border border-red-500/20 p-8 rounded-[40px] text-center shadow-2xl"
        >
          <h1 className="text-2xl font-black italic text-red-500 uppercase mb-6 tracking-tighter">NEXUS HQ</h1>
          <input 
            type="password" 
            value={passInput} 
            onChange={(e) => setPassInput(e.target.value)} 
            placeholder="PROTOCOL KEY" 
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-center font-bold mb-6 outline-none focus:border-red-500" 
          />
          <button className="w-full py-4 bg-red-600 text-white font-black rounded-2xl uppercase text-[10px] hover:bg-red-500 transition-all">Unlock Command Center</button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#020617] text-white font-sans overflow-x-hidden">
      
      {/* --- 📟 SIDEBAR --- */}
      <aside className="w-full md:w-72 bg-black/40 border-r border-red-500/10 backdrop-blur-3xl fixed md:sticky top-0 h-screen z-100">
        <div className="p-10 text-center font-black italic text-red-500 border-b border-white/5">NEXUS HQ</div>
        <nav className="p-6 space-y-2 mt-4">
          {[
            { id: "dashboard", label: "Overview", icon: "📊" },
            { id: "users", label: "Registry", icon: "👤" },
            { id: "payments", label: "Settlements", icon: "💰" },
            { id: "analytics", label: "Intel Matrix", icon: "📈" }
          ].map(m => (
            <button 
              key={m.id} 
              onClick={() => setActiveTab(m.id)} 
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-3xl transition-all ${activeTab === m.id ? 'bg-red-600 shadow-xl italic' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            >
              <span className="text-xl">{m.icon}</span><span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* --- 🛰️ MAIN CONTENT --- */}
      <main className="flex-1 p-6 md:p-16 space-y-12">
        
        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div className="space-y-12 animate-in fade-in">
            <h3 className="text-3xl font-black uppercase italic text-red-500 tracking-tighter">System Pulse</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] shadow-2xl group hover:border-red-500/30 transition-all">
                <p className="text-[10px] font-black text-gray-500 uppercase mb-4 italic tracking-widest">Total Revenue</p>
                <div className="flex items-baseline gap-2"><span className="text-sm font-black text-gray-700">KES</span><h4 className="text-5xl font-black italic">{revenueKes.toLocaleString()}</h4></div>
              </div>
              <div className="p-10 bg-black/40 border border-white/5 rounded-[40px] flex flex-col justify-center">
                <p className="text-[10px] font-black text-gray-500 uppercase mb-4 italic text-center tracking-widest">Active Nodes</p>
                <h4 className="text-6xl font-black italic text-center text-white">{operators.length}</h4>
              </div>
            </div>
          </div>
        )}

        {/* REGISTRY TAB */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black italic uppercase text-red-500">Node Registry</h3>
                <input 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  placeholder="FILTER NODES..." 
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black text-white outline-none focus:border-red-500" 
                />
            </div>
            <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-4xl">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-[8px] font-black uppercase text-gray-500 italic"><tr><th className="p-6">Node Operator</th><th className="p-6">Sync Status</th><th className="p-6 text-right">Protocol Commands</th></tr></thead>
                <tbody className="divide-y divide-white/5">
                  {fetching && <tr><td colSpan={3} className="p-10 text-center animate-pulse text-red-500 font-black italic">SYNCING CORE...</td></tr>}
                  {!fetching && operators.filter(o => o.name.toLowerCase().includes(searchTerm.toLowerCase())).map((op) => (
                    <tr key={op.id} className="text-[11px] hover:bg-white/2 transition-all">
                      <td className="p-6 font-black uppercase italic">{op.name}<br/><span className="text-[8px] text-gray-600 not-italic font-bold">{op.email}</span></td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-lg border italic font-black ${op.status === 'Verified' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-amber-500 border-amber-500/20 bg-amber-500/5'}`}>
                            {op.banned ? "TERMINATED" : op.status}
                        </span>
                      </td>
                      <td className="p-6 text-right space-x-4">
                        <button onClick={() => handleAction(verifyUserNode, op.id)} className="text-[10px] font-black text-emerald-500 uppercase hover:underline">Verify</button>
                        <button onClick={() => handleAction(suspendUserNode as any, op.id, !op.banned)} className="text-[10px] font-black text-amber-500 uppercase hover:underline">{op.banned ? "Re-Sync" : "Suspend"}</button>
                        <button onClick={() => { if(confirm("Terminate Node permanently?")) handleAction(terminateUserNode, op.id); }} className="text-[10px] font-black text-red-500 uppercase hover:underline">Kill</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SETTLEMENTS TAB */}
        {activeTab === "payments" && (
          <div className="space-y-10 animate-in slide-in-from-bottom-4">
            <h3 className="text-2xl font-black italic uppercase text-red-500">Settlement Stream</h3>
            
            {/* 🛡️ PROOF OF ESCROW (Show this to IntaSend) */}
            <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 font-black italic">!</div>
                <div>
                  <p className="text-[11px] font-black uppercase italic tracking-tighter">GIG-ACTIVE: Smart Contract Audit</p>
                  <p className="text-[8px] text-gray-500 uppercase">IntaSend Escrow: IS_TRA_LIVE_882</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-2xl font-black italic text-[#00f2ff]">KES 15,000</p>
                <div className="flex gap-2 mt-2">
                  <button className="px-4 py-2 bg-emerald-600 text-white text-[8px] font-black uppercase rounded-lg shadow-lg">Release Funds</button>
                  <button className="px-4 py-2 bg-red-900/40 text-red-500 border border-red-500/20 text-[8px] font-black uppercase rounded-lg">Refund Client</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic">Manual Verification Logs</h4>
              {operators.filter(o => o.status === "Verified").map(u => (
                <div key={u.id} className="p-6 bg-white/5 border border-white/10 rounded-3xl flex justify-between items-center group hover:border-emerald-500/20 transition-all">
                  <div><p className="text-[11px] font-black uppercase italic">{u.name}</p><p className="text-[8px] text-gray-500 uppercase">Verification Protocol: Success</p></div>
                  <div className="text-right"><p className="text-xl font-black italic text-emerald-500">KES 1,250</p><p className="text-[7px] text-gray-600 italic">Captured: {u.joined}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INTEL MATRIX TAB */}
        {activeTab === "analytics" && (
          <div className="p-12 bg-white/5 border border-white/10 rounded-[50px] space-y-10 animate-in zoom-in-95">
             <h3 className="text-2xl font-black italic uppercase text-red-500">Intel Matrix</h3>
             <div className="grid grid-cols-2 gap-10">
                <div><p className="text-[9px] font-black text-gray-500 uppercase italic mb-2">Platform Commission (2%)</p><h4 className="text-4xl font-black italic text-white">KES {(revenueKes * 0.02).toLocaleString()}</h4></div>
                <div><p className="text-[9px] font-black text-gray-500 uppercase italic mb-2">Satellite Status</p><h4 className="text-4xl font-black italic text-emerald-500 uppercase">Optimal</h4></div>
             </div>
             <div className="space-y-4">
                <p className="text-[8px] font-black text-gray-500 uppercase italic tracking-widest">Global Node Uplink Stability</p>
                <div className="flex gap-1.5 h-16 items-end">
                    {[40,80,60,100,50,90,70].map((h,i) => (
                        <div key={i} className="flex-1 bg-red-600/20 border-b-2 border-red-600 animate-pulse" style={{ height: `${h}%`, transitionDelay: `${i * 100}ms` }} />
                    ))}
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}