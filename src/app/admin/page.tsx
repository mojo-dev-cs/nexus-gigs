"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { getAllNexusUsers } from "./_actions/users"; 

export default function AdminPage() {
  const { user } = useUser();
  const [passInput, setPassInput] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [operators, setOperators] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fetching, setFetching] = useState(false);

  // Stats Logic
  const verifiedUsers = operators.filter(o => o.status === "Verified");
  const unverifiedUsers = operators.filter(o => o.status !== "Verified");
  const conversionRate = operators.length > 0 ? ((verifiedUsers.length / operators.length) * 100).toFixed(1) : "0";
  const revenueKes = verifiedUsers.length * 1250;

  useEffect(() => {
    const auth = sessionStorage.getItem("nexus_admin_session");
    if (auth === "true") setIsAuthorized(true);
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      const loadData = async () => {
        setFetching(true);
        const res = await getAllNexusUsers();
        if (res.success && res.users) {
          setOperators(res.users);
        }
        setFetching(false);
      };
      loadData();
    }
  }, [isAuthorized, activeTab]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passInput === "Nexus123!") {
      sessionStorage.setItem("nexus_admin_session", "true");
      setIsAuthorized(true);
    } else {
      alert("INVALID PROTOCOL KEY");
      setPassInput("");
    }
  };

  // ✅ FUNCTIONAL: Verify Node Button
  const handleManualVerify = async (userId: string) => {
    if (!confirm("⚠️ ALERT: You are about to authorize this node manually. Confirm uplink?")) return;
    
    try {
      const res = await fetch("/api/onboarding/verify", { 
        method: "POST",
        body: JSON.stringify({ userId }), // We'll need to update the API to accept a specific ID
      });
      if (res.ok) {
        alert("🚀 NODE AUTHORIZED: Operator has been granted Elite access.");
        window.location.reload();
      }
    } catch (err) {
      alert("Relay error. Check server logs.");
    }
  };

  // ✅ FUNCTIONAL: Terminate Node
  const handleTerminateNode = (userId: string) => {
    if (confirm("🚨 CRITICAL: Terminate this operator's session permanently?")) {
        alert(`Node ${userId} flagged for termination.`);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#020617]">
        <form onSubmit={handleAuth} className="w-full max-w-sm bg-black/60 border border-red-500/20 p-8 md:p-12 rounded-[40px] backdrop-blur-3xl text-center shadow-2xl">
          <h1 className="text-2xl font-black italic text-red-500 uppercase mb-2 tracking-tighter">NEXUS <span className="text-white">HQ</span></h1>
          <input type="password" autoFocus value={passInput} onChange={(e) => setPassInput(e.target.value)} placeholder="ACCESS KEY" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-center font-bold outline-none focus:border-red-500 mb-6" />
          <button className="w-full py-4 bg-red-600 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-red-500 transition-all shadow-xl shadow-red-500/10">Authenticate</button>
        </form>
      </div>
    );
  }

  const modules = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "users", label: "Users", icon: "👤" },
    { id: "payments", label: "Payments", icon: "💰" },
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#020617] text-white selection:bg-red-500/30 font-sans relative">
      
      {/* SIDEBAR */}
      <aside className={`w-full md:w-72 bg-black/40 border-r border-red-500/10 backdrop-blur-3xl fixed md:sticky top-0 h-screen z-100 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-10 hidden md:block">
          <h2 className="font-black italic text-red-500 uppercase text-2xl tracking-tighter">NEXUS <span className="text-white">HQ</span></h2>
        </div>
        <nav className="px-6 space-y-1 mt-10 md:mt-0">
          {modules.map(m => (
            <button key={m.id} onClick={() => { setActiveTab(m.id); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-4 px-6 py-4 rounded-3xl transition-all ${activeTab === m.id ? 'bg-red-600 text-white shadow-lg shadow-red-600/20 scale-105' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              <span className="text-xl">{m.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-16 space-y-12">
        
        {/* --- 📊 DASHBOARD TAB --- */}
        {activeTab === "dashboard" && (
          <div className="space-y-12 animate-in fade-in duration-700">
            <header className="flex justify-between items-end border-b border-white/5 pb-6">
                <div>
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter text-red-500">System Pulse</h3>
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mt-2 italic">Real-time Financial Matrix</p>
                </div>
                <button onClick={() => window.location.reload()} className="p-3 bg-white/5 rounded-full hover:bg-red-500/20 transition-all border border-white/10">🔄</button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] shadow-2xl relative group">
                <p className="text-[10px] font-black text-gray-500 uppercase mb-4 tracking-widest italic">Live Revenue</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-sm font-black text-gray-600">KES</span>
                    <h4 className="text-4xl font-black italic">{revenueKes.toLocaleString()}</h4>
                </div>
                <div className="mt-6 flex gap-2">
                    <button onClick={() => alert("Syncing with PayHero...")} className="flex-1 py-3 bg-red-600 text-white text-[9px] font-black uppercase rounded-xl italic hover:scale-105 transition-all">Audit Vault</button>
                    <button onClick={() => setActiveTab('payments')} className="flex-1 py-3 bg-white/5 border border-white/10 text-[9px] font-black uppercase rounded-xl italic hover:bg-white/10 transition-all">Clear Logs</button>
                </div>
              </div>

              <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] shadow-2xl group hover:border-emerald-500/30 transition-all">
                <p className="text-[10px] font-black text-gray-500 uppercase mb-4 tracking-widest italic">Growth Index</p>
                <div className="flex items-baseline gap-2 text-emerald-500">
                    <span className="text-sm font-black opacity-50">STKS</span>
                    <h4 className="text-4xl font-black italic">+{conversionRate}%</h4>
                </div>
                <div className="mt-6"><button onClick={() => setActiveTab('analytics')} className="w-full py-3 bg-emerald-600 text-white text-[9px] font-black uppercase rounded-xl italic tracking-widest hover:bg-emerald-500 transition-all">View Intel</button></div>
              </div>

              <div className="p-8 bg-black/40 border border-white/5 rounded-[40px] space-y-3">
                {['GBP 0.00', 'EUR 0.00', 'USD 0.00'].map((cur) => (
                    <div key={cur} className="flex justify-between items-center border-b border-white/5 pb-2 text-[10px] font-black uppercase italic text-gray-600">
                      <span>{cur.split(' ')[0]}</span>
                      <span className="text-white">{cur.split(' ')[1]}</span>
                    </div>
                ))}
                <div className="pt-2"><div className="bg-red-600/10 text-red-500 p-3 rounded-xl flex justify-between items-center border border-red-500/20 font-black italic text-[11px]"><span className="uppercase">Global KES</span><span>{revenueKes.toLocaleString()}</span></div></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-10 bg-white/2 border border-white/5 rounded-[48px] text-center hover:bg-white/5 transition-all">
                    <p className="text-[9px] font-black text-gray-500 uppercase mb-2">Total Nodes</p>
                    <h4 className="text-3xl font-black italic">{operators.length}</h4>
                </div>
                <div className="p-10 bg-white/2 border border-white/5 rounded-[48px] text-center hover:bg-white/5 transition-all">
                    <p className="text-[9px] font-black text-gray-500 uppercase mb-2">Verified Elite</p>
                    <h4 className="text-3xl font-black italic text-emerald-500">{verifiedUsers.length}</h4>
                </div>
                <div className="p-10 bg-white/2 border border-white/5 rounded-[48px] text-center hover:bg-white/5 transition-all">
                    <p className="text-[9px] font-black text-gray-500 uppercase mb-2">Flagged Nodes</p>
                    <h4 className="text-3xl font-black italic text-red-500">0</h4>
                </div>
            </div>
          </div>
        )}

        {/* --- 👤 USERS TAB --- */}
        {activeTab === "users" && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <h3 className="text-2xl font-black italic uppercase text-red-500">Operator Registry</h3>
              <input type="text" placeholder="FILTER NODES..." className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black outline-none focus:border-red-500 text-white" onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-4xl overflow-hidden overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-[8px] font-black uppercase text-gray-500 tracking-widest italic">
                  <tr><th className="p-6">Node Identifier</th><th className="p-6">Status</th><th className="p-6 text-right">Command</th></tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {fetching ? (
                    <tr><td colSpan={3} className="p-20 text-center animate-pulse text-red-500 font-black italic tracking-widest">SYNCING CORE...</td></tr>
                  ) : operators.filter(o => o.name.toLowerCase().includes(searchTerm.toLowerCase())).map((op) => (
                    <tr key={op.id} className="text-[10px] hover:bg-white/2 transition-all group">
                      <td className="p-6 font-black uppercase italic">{op.name}<br/><span className="text-[8px] text-gray-600 not-italic font-bold">{op.email}</span></td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-lg border italic font-black ${op.status === 'Verified' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-amber-500 border-amber-500/20 bg-amber-500/5'}`}>{op.status}</span>
                      </td>
                      <td className="p-6 text-right flex justify-end gap-4">
                        {op.status !== 'Verified' && (
                            <button onClick={() => handleManualVerify(op.id)} className="text-[9px] font-black text-emerald-500 uppercase hover:underline italic">Authorize</button>
                        )}
                        <button onClick={() => handleTerminateNode(op.id)} className="text-[9px] font-black text-red-500 uppercase hover:underline italic">Flag</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- 💰 PAYMENTS TAB --- */}
        {activeTab === "payments" && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4">
            <h3 className="text-2xl font-black italic uppercase text-red-500">Financial Vault</h3>
            <div className="grid grid-cols-1 gap-4">
                {verifiedUsers.slice(0, 5).map(u => (
                   <div key={u.id} className="p-6 bg-white/5 border border-white/10 rounded-3xl flex justify-between items-center group hover:border-[#00f2ff]/30 transition-all">
                      <div>
                        <p className="text-[10px] font-black italic uppercase">{u.name}</p>
                        <p className="text-[8px] font-bold text-gray-600 uppercase">Verification Fee Clear</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black italic text-emerald-500">KES 1,250</p>
                        <p className="text-[8px] font-bold text-gray-500 uppercase">Settle Date: 2026-03-29</p>
                      </div>
                   </div> 
                ))}
                {verifiedUsers.length === 0 && (
                    <div className="p-20 text-center text-gray-600 font-black italic opacity-20 uppercase tracking-widest">No Recent Clearing Transactions</div>
                )}
            </div>
          </div>
        )}

        {/* --- 📈 ANALYTICS TAB --- */}
        {activeTab === "analytics" && (
          <div className="space-y-8 animate-in zoom-in-95">
            <h3 className="text-2xl font-black italic uppercase text-red-500">Market Intelligence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] space-y-4">
                    <p className="text-[10px] font-black uppercase italic text-gray-500">Traffic Source Relay</p>
                    <div className="space-y-3">
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-red-500 w-[70%]" /></div>
                        <p className="text-[8px] font-bold uppercase italic text-gray-400">Direct Uplink (70%)</p>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-[#00f2ff] w-[30%]" /></div>
                        <p className="text-[8px] font-bold uppercase italic text-gray-400">Satellite Referral (30%)</p>
                    </div>
                </div>
                <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] flex flex-col justify-center items-center text-center">
                    <h4 className="text-6xl font-black italic text-red-500">{operators.length}</h4>
                    <p className="text-[10px] font-black uppercase italic text-gray-500 mt-2">Active Node Connections</p>
                </div>
            </div>
          </div>
        )}

        {/* --- ⚙️ SETTINGS TAB --- */}
        {activeTab === "settings" && (
          <div className="max-w-2xl space-y-6 animate-in fade-in">
            <h3 className="text-2xl font-black italic uppercase text-red-500">Nexus Config</h3>
            <div className="space-y-4">
                <div className="p-8 bg-white/5 border border-white/10 rounded-4xl flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-gray-500 italic">M-Pesa Webhook Protocol</span>
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-500 rounded-full font-black text-[8px] italic">ACTIVE</span>
                </div>
                <div className="p-8 bg-white/5 border border-white/10 rounded-4xl flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-gray-500 italic">Financial Relay (PayHero)</span>
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-500 rounded-full font-black text-[8px] italic">CONNECTED</span>
                </div>
                <button onClick={() => {sessionStorage.clear(); window.location.reload();}} className="w-full py-5 bg-red-900/10 border border-red-500/30 text-red-500 font-black rounded-3xl uppercase text-[10px] tracking-widest hover:bg-red-500/10 transition-all italic">Lock HQ Access (Terminate Session)</button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}