"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { getAllNexusUsers, verifyUserNode, terminateUserNode } from "./_actions/users"; 

export default function AdminPage() {
  const { user: clerkUser } = useUser();
  const [passInput, setPassInput] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [operators, setOperators] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fetching, setFetching] = useState(false);

  // Stats for IntaSend Dashboard
  const verified = operators.filter(o => o.status === "Verified");
  const revenueKes = verified.length * 1250;

  useEffect(() => {
    const auth = sessionStorage.getItem("nexus_admin_session");
    if (auth === "true") setIsAuthorized(true);
  }, []);

  useEffect(() => {
    if (isAuthorized) loadData();
  }, [isAuthorized, activeTab]);

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
    } else { alert("DENIED"); setPassInput(""); }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <form onSubmit={handleAuth} className="w-full max-w-sm bg-black border border-red-500/20 p-8 rounded-[40px] text-center shadow-2xl backdrop-blur-3xl">
          <h1 className="text-2xl font-black italic text-red-500 uppercase mb-6 tracking-tighter">NEXUS HQ</h1>
          <input type="password" value={passInput} onChange={(e) => setPassInput(e.target.value)} placeholder="PROTOCOL KEY" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-center font-bold mb-6 outline-none focus:border-red-500" />
          <button className="w-full py-4 bg-red-600 text-white font-black rounded-2xl uppercase text-[10px] hover:bg-red-500 transition-all">Unlock</button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#020617] text-white font-sans overflow-x-hidden">
      
      {/* MOBILE HEADER - Fixed height and Z-index */}
      <div className="md:hidden flex items-center justify-between p-6 bg-black/80 border-b border-white/5 sticky top-0 z-110 backdrop-blur-xl">
        <h2 className="font-black text-red-500 uppercase tracking-tighter italic">NEXUS HQ</h2>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-3 bg-white/5 rounded-xl border border-white/10">{isMobileMenuOpen ? "✕" : "☰"}</button>
      </div>

      {/* SIDEBAR - Pushed down on mobile to not hide under header */}
      <aside className={`w-full md:w-72 bg-black/40 border-r border-red-500/10 backdrop-blur-3xl fixed md:sticky top-0 h-screen z-100 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-10 hidden md:block text-center font-black italic text-red-500 border-b border-white/5">NEXUS HQ</div>
        <nav className="p-6 space-y-2 mt-16 md:mt-4">
          {[
            { id: "dashboard", label: "Overview", icon: "📊" },
            { id: "users", label: "Registry", icon: "👤" },
            { id: "payments", label: "Settlements", icon: "💰" },
            { id: "analytics", label: "Intel", icon: "📈" }
          ].map(m => (
            <button key={m.id} onClick={() => { setActiveTab(m.id); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-4 px-6 py-4 rounded-3xl transition-all ${activeTab === m.id ? 'bg-red-600 shadow-xl italic' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              <span className="text-xl">{m.icon}</span><span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-16 space-y-12">
        {activeTab === "dashboard" && (
          <div className="space-y-12 animate-in fade-in">
            <h3 className="text-3xl font-black uppercase italic text-red-500 tracking-tighter">System Pulse</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* IntaSend Like Cards */}
              <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] shadow-2xl relative group hover:border-red-500/30 transition-all">
                <p className="text-[10px] font-black text-gray-500 uppercase mb-4 italic">Total Revenue</p>
                <div className="flex items-baseline gap-2"><span className="text-sm font-black text-gray-700">KES</span><h4 className="text-5xl font-black italic">{revenueKes.toLocaleString()}</h4></div>
                <div className="mt-6 flex gap-2"><button className="flex-1 py-3 bg-red-600 text-white text-[9px] font-black uppercase rounded-xl italic">Request Payout</button></div>
              </div>
              <div className="p-10 bg-white/5 border border-white/10 rounded-[40px] shadow-2xl relative">
                <p className="text-[10px] font-black text-gray-500 uppercase mb-4 italic">Available Balance</p>
                <div className="flex items-baseline gap-2 text-emerald-500"><span className="text-sm font-black opacity-50">KES</span><h4 className="text-5xl font-black italic">{revenueKes.toLocaleString()}</h4></div>
                <div className="mt-6"><button className="w-full py-3 bg-emerald-600 text-white text-[9px] font-black uppercase rounded-xl italic">Withdraw</button></div>
              </div>
              <div className="p-10 bg-black/40 border border-white/5 rounded-[40px] flex flex-col justify-center">
                <p className="text-[10px] font-black text-gray-500 uppercase mb-4 italic text-center">Active Nodes</p>
                <h4 className="text-6xl font-black italic text-center text-white">{operators.length}</h4>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center"><h3 className="text-2xl font-black italic uppercase text-red-500">Registry</h3><input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="FILTER NODES..." className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black text-white" /></div>
            <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-4xl">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-[8px] font-black uppercase text-gray-500 italic"><tr><th className="p-6">Node</th><th className="p-6">Status</th><th className="p-6 text-right">Action</th></tr></thead>
                <tbody className="divide-y divide-white/5">
                  {fetching ? (<tr><td colSpan={3} className="p-20 text-center animate-pulse text-red-500 font-black italic">SYNCING CORE...</td></tr>) : 
                    operators.filter(o => o.name.toLowerCase().includes(searchTerm.toLowerCase())).map((op) => (
                    <tr key={op.id} className="text-[11px] hover:bg-white/2 transition-all">
                      <td className="p-6 font-black uppercase italic">{op.name}<br/><span className="text-[8px] text-gray-600 not-italic font-bold">{op.email}</span></td>
                      <td className="p-6"><span className={`px-3 py-1 rounded-lg border italic font-black ${op.status === 'Verified' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-amber-500 border-amber-500/20 bg-amber-500/5'}`}>{op.status}</span></td>
                      <td className="p-6 text-right"><button onClick={() => verifyUserNode(op.id).then(() => loadData())} className="text-[10px] font-black text-red-500 uppercase hover:underline">Verify</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "payments" && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4">
            <h3 className="text-2xl font-black italic uppercase text-red-500">Settlements</h3>
            <div className="grid grid-cols-1 gap-4">
              {verified.map(u => (
                <div key={u.id} className="p-6 bg-white/5 border border-white/10 rounded-3xl flex justify-between items-center">
                  <div><p className="text-[11px] font-black uppercase italic">{u.name}</p><p className="text-[8px] text-gray-600 uppercase">Verification Fee Clear</p></div>
                  <div className="text-right"><p className="text-xl font-black italic text-emerald-500">KES 1,250</p><p className="text-[7px] text-gray-500 italic">{u.joined}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-8 animate-in zoom-in-95">
             <h3 className="text-2xl font-black italic uppercase text-red-500">Intel Matrix</h3>
             <div className="p-12 bg-white/5 border border-white/10 rounded-[50px] space-y-8">
                <div className="flex justify-between items-end">
                   <div><p className="text-[10px] font-black text-gray-500 mb-2 italic">Node Latency</p><h4 className="text-5xl font-black italic text-white">0.02s</h4></div>
                   <div className="text-right"><p className="text-[10px] font-black text-gray-500 mb-2 italic">Network Stability</p><h4 className="text-4xl font-black italic text-emerald-500">99.9%</h4></div>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-red-600 w-[94%] shadow-[0_0_20px_#dc2626]" /></div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}