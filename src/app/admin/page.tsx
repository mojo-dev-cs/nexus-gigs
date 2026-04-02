"use client";

import { useState, useEffect, useCallback } from "react";
import { getAllNexusUsers, verifyUserNode, terminateUserNode, suspendUserNode } from "./_actions/users"; 

// --- 🛰️ TYPE DEFINITION ---
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
  
  // System Settings
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [commissionRate, setCommissionRate] = useState(2);
  const [isLiveGateway, setIsLiveGateway] = useState(true);

  // --- 📈 REAL-TIME CALCULATIONS ---
  const verifiedNodes = operators.filter(o => o.status === "Verified");
  
  // Total Revenue based on Real Verified Users
  const totalRevenue = verifiedNodes.length * 1250;
  
  // Today's Revenue (Calculated from Midnight today)
  const startOfToday = new Date().setHours(0, 0, 0, 0);
  const todaysRevenue = verifiedNodes.filter(o => o.createdAt >= startOfToday).length * 1250;

  // --- 🛰️ DATA SYNC CORE ---
  const loadData = useCallback(async () => {
    if (!isAuthorized) return;
    setFetching(true);
    const res = await getAllNexusUsers();
    if (res.success && res.users) {
      setOperators(res.users as NexusUser[]);
    }
    setFetching(false);
  }, [isAuthorized]);

  useEffect(() => {
    if (sessionStorage.getItem("nexus_admin_session") === "true") setIsAuthorized(true);
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      loadData();
      // 💓 HEARTBEAT: Auto-sync with Webhook every 10 seconds
      const heartbeat = setInterval(() => {
        loadData();
      }, 10000); 
      return () => clearInterval(heartbeat);
    }
  }, [isAuthorized, loadData]);

  const handleAction = async (actionFn: any, id: string, extraArg?: any) => {
    setFetching(true);
    await actionFn(id, extraArg);
    await loadData(); // Immediate Refresh
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
            } else { alert("ACCESS DENIED: PROTOCOL BREACH"); }
          }} 
          className="w-full max-w-sm bg-black border border-red-500/20 p-8 rounded-[40px] text-center shadow-2xl"
        >
          <h1 className="text-2xl font-black italic text-red-500 uppercase mb-6 tracking-tighter">NEXUS HQ</h1>
          <input type="password" value={passInput} onChange={(e) => setPassInput(e.target.value)} placeholder="PROTOCOL KEY" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-center font-bold mb-6 outline-none focus:border-red-500" />
          <button className="w-full py-4 bg-red-600 text-white font-black rounded-2xl uppercase text-[10px] italic">Unlock Command Center</button>
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
    <div className="flex min-h-screen bg-[#020617] text-white font-sans overflow-x-hidden selection:bg-red-500/30">
      
      {/* --- 📱 MOBILE HEADER --- */}
      <div className="md:hidden fixed top-0 w-full h-20 bg-black/90 backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between px-6">
        <h2 className="font-black italic text-red-500 uppercase tracking-tighter">NEXUS HQ</h2>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-3 bg-white/5 rounded-xl border border-white/10 text-xl">
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* --- 📟 COLLAPSIBLE SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-black border-r border-red-500/10 backdrop-blur-3xl transform transition-transform duration-300 md:translate-x-0 md:sticky md:top-0 md:h-screen ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-10 text-center font-black italic text-red-500 border-b border-white/5 hidden md:block">NEXUS HQ</div>
        <nav className="p-6 space-y-2 mt-20 md:mt-4">
          {menuItems.map(m => (
            <button key={m.id} onClick={() => { setActiveTab(m.id); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-4 px-6 py-4 rounded-3xl transition-all ${activeTab === m.id ? 'bg-red-600 shadow-xl shadow-red-600/20 italic' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              <span className="text-xl">{m.icon}</span><span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* --- 🚀 MAIN COMMAND --- */}
      <main className="flex-1 p-6 md:p-16 pt-28 md:pt-16 space-y-12">
        
        {/* --- 📊 OVERVIEW --- */}
        {activeTab === "dashboard" && (
          <div className="space-y-12 animate-in fade-in">
            <h3 className="text-3xl font-black uppercase italic text-red-500 tracking-tighter">System Pulse</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] group hover:border-red-500/30 transition-all">
                <p className="text-[10px] font-black text-gray-500 uppercase mb-4 italic tracking-widest">Global Yield (Real-Time)</p>
                <div className="flex items-baseline gap-2"><span className="text-sm font-black text-gray-700">KES</span><h4 className="text-5xl font-black italic">{totalRevenue.toLocaleString()}</h4></div>
              </div>
              <div className="p-10 bg-red-600/10 border border-red-500/20 rounded-[40px]">
                <p className="text-[10px] font-black text-red-500 uppercase mb-4 italic tracking-widest">Today's Inflow</p>
                <h4 className="text-5xl font-black italic text-white">KES {todaysRevenue.toLocaleString()}</h4>
              </div>
              <div className="p-10 bg-black/40 border border-white/5 rounded-[40px] flex flex-col justify-center text-center">
                <p className="text-[10px] font-black text-gray-500 uppercase mb-4 italic tracking-widest">Active Nodes</p>
                <h4 className="text-6xl font-black italic text-white">{operators.length}</h4>
              </div>
            </div>
          </div>
        )}

        {/* --- 👤 REGISTRY --- */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h3 className="text-2xl font-black italic uppercase text-red-500">Node Registry</h3>
              <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="SEARCH NODES..." className="w-full md:w-auto bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black text-white outline-none" />
            </div>
            <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-4xl no-scrollbar">
              <table className="w-full text-left min-w-175">
                <thead className="bg-white/5 text-[8px] font-black uppercase text-gray-500 italic"><tr><th className="p-6">Operator</th><th className="p-6">Status</th><th className="p-6 text-right">Commands</th></tr></thead>
                <tbody className="divide-y divide-white/5">
                  {operators.filter(o => o.name.toLowerCase().includes(searchTerm.toLowerCase())).map((op) => (
                    <tr key={op.id} className="text-[11px] hover:bg-white/2 transition-all">
                      <td className="p-6 font-black uppercase italic">{op.name}<br/><span className="text-[8px] text-gray-600 font-bold">{op.email}</span></td>
                      <td className="p-6"><span className={`px-3 py-1 rounded-lg border italic font-black ${op.status === 'Verified' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-amber-500 border-amber-500/20 bg-amber-500/5'}`}>{op.banned ? "TERMINATED" : op.status}</span></td>
                      <td className="p-6 text-right space-x-4">
                        <button onClick={() => handleAction(verifyUserNode, op.id)} className="text-[10px] font-black text-emerald-500 hover:underline uppercase">Verify</button>
                        <button onClick={() => handleAction(suspendUserNode as any, op.id, !op.banned)} className="text-[10px] font-black text-amber-500 hover:underline uppercase">{op.banned ? "Restore" : "Ban"}</button>
                        <button onClick={() => { if(confirm("Terminate permanently?")) handleAction(terminateUserNode, op.id); }} className="text-[10px] font-black text-red-500 hover:underline uppercase">Kill</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- 💰 SETTLEMENTS (Escrow Flow) --- */}
        {activeTab === "payments" && (
          <div className="space-y-12 animate-in slide-in-from-bottom-4">
            <h3 className="text-2xl font-black italic uppercase text-red-500">Settlement Stream</h3>
            
            <div className="space-y-4">
               <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic flex items-center gap-2">🛡️ Active Client Escrows</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 bg-white/5 border border-white/10 rounded-3xl flex justify-between items-center group hover:border-[#00f2ff]/20 transition-all">
                    <div><p className="text-[10px] font-black uppercase text-[#00f2ff]">Alpha Tech</p><p className="text-[7px] text-gray-600 uppercase italic">Ref: GIG-8829</p></div>
                    <div className="text-right"><p className="text-lg font-black italic">KES 58,000</p><p className="text-[6px] text-amber-500 uppercase italic">Locked in IntaSend</p></div>
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">🚀 Verified Node Activations (Real-Time)</h4>
               <div className="space-y-3">
                {verifiedNodes.length === 0 ? <p className="text-center py-20 text-gray-700 italic font-black uppercase text-[10px]">Awaiting First Live Inflow...</p> : 
                  verifiedNodes.map(u => (
                    <div key={u.id} className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl flex justify-between items-center">
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 bg-emerald-500 text-black flex items-center justify-center font-black rounded-full italic shadow-xl shadow-emerald-500/20">✔</div>
                        <div><p className="text-[11px] font-black uppercase italic">{u.name}</p><p className="text-[8px] text-gray-600 uppercase">M-Pesa Verified Node</p></div>
                      </div>
                      <div className="text-right font-black italic"><p className="text-xl text-emerald-500">KES 1,250</p><p className="text-[7px] text-gray-500 uppercase">{u.joined}</p></div>
                    </div>
                ))}
               </div>
            </div>
          </div>
        )}

        {/* --- ⚙️ SYSTEM CORE (Settings) --- */}
        {activeTab === "settings" && (
          <div className="max-w-2xl space-y-10 animate-in zoom-in-95">
             <h3 className="text-2xl font-black italic uppercase text-red-500">System Core</h3>
             
             <div className="p-8 md:p-12 bg-white/5 border border-white/10 rounded-[50px] space-y-8">
                <div className="flex justify-between items-center">
                   <div><h4 className="text-sm font-black uppercase italic tracking-widest">Protocol Lock (Update Mode)</h4><p className="text-[8px] text-gray-500 uppercase italic">Prevents all freelancer bidding/access</p></div>
                   <button onClick={() => setIsMaintenanceMode(!isMaintenanceMode)} className={`w-14 h-7 rounded-full transition-all relative ${isMaintenanceMode ? 'bg-red-600' : 'bg-white/10'}`}><div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${isMaintenanceMode ? 'left-8' : 'left-1'}`} /></button>
                </div>
                
                <div className="flex justify-between items-center pt-8 border-t border-white/5">
                   <div><h4 className="text-sm font-black uppercase italic tracking-widest">Payment Relay</h4><p className="text-[8px] text-gray-500 uppercase italic">Toggle IntaSend Gateway Status</p></div>
                   <button onClick={() => setIsLiveGateway(!isLiveGateway)} className={`w-14 h-7 rounded-full transition-all relative ${isLiveGateway ? 'bg-emerald-600' : 'bg-amber-500'}`}><div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${isLiveGateway ? 'left-8' : 'left-1'}`} /></button>
                </div>

                <div className="space-y-4 pt-8 border-t border-white/5">
                   <div className="flex justify-between"><label className="text-[8px] font-black text-gray-500 uppercase italic">Commission Relay Fee (%)</label><span className="text-red-500 font-black text-xs">{commissionRate}%</span></div>
                   <input type="range" min="1" max="10" value={commissionRate} onChange={(e) => setCommissionRate(parseInt(e.target.value))} className="w-full accent-red-600 h-1 bg-white/10 rounded-full" />
                </div>

                <button onClick={() => alert("Satellite Uplink Synchronized.")} className="w-full py-5 bg-white text-black font-black rounded-2xl uppercase text-[10px] tracking-[0.4em] italic shadow-2xl active:scale-95 transition-all">Save System Config</button>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}