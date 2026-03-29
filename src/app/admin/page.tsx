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
  const [searchTerm, setSearchTerm] = useState(""); // Defined here
  const [fetching, setFetching] = useState(false);

  // Stats Logic
  const verifiedUsers = operators.filter(o => o.status === "Verified");
  const revenueKes = verifiedUsers.length * 1250;

  useEffect(() => {
    const auth = sessionStorage.getItem("nexus_admin_session");
    if (auth === "true") setIsAuthorized(true);
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      loadData();
    }
  }, [isAuthorized, activeTab]);

  const loadData = async () => {
    setFetching(true);
    const res = await getAllNexusUsers();
    if (res.success && res.users) {
      setOperators(res.users);
    }
    setFetching(false);
  };

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

  const handleManualVerify = async (userId: string) => {
    if (!confirm("⚠️ Authorize this node manually?")) return;
    setFetching(true);
    const res = await verifyUserNode(userId);
    if (res.success) {
      alert("🚀 NODE AUTHORIZED");
      await loadData();
    }
    setFetching(false);
  };

  const handleTerminate = async (userId: string) => {
    if (!confirm("🚨 PERMANENT TERMINATION: Delete user?")) return;
    setFetching(true);
    const res = await terminateUserNode(userId);
    if (res.success) {
      alert("💥 NODE REMOVED");
      await loadData();
    }
    setFetching(false);
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#020617]">
        <form onSubmit={handleAuth} className="w-full max-w-sm bg-black border border-red-500/20 p-8 rounded-[40px] text-center backdrop-blur-3xl shadow-2xl">
          <h1 className="text-2xl font-black text-red-500 uppercase mb-6 tracking-tighter italic underline decoration-[#00f2ff] underline-offset-8">NODE: {clerkUser?.firstName}</h1>
          <input type="password" value={passInput} onChange={(e) => setPassInput(e.target.value)} placeholder="PROTOCOL KEY" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-center font-bold mb-6 outline-none focus:border-red-500" />
          <button className="w-full py-4 bg-red-600 text-white font-black rounded-2xl uppercase text-[10px] hover:bg-red-500 transition-all">Unlock System</button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#020617] text-white font-sans relative">
      
      {/* 📱 MOBILE HEADER */}
      <div className="md:hidden flex items-center justify-between p-6 bg-black/40 border-b border-white/5 sticky top-0 z-100 backdrop-blur-xl">
        <h2 className="font-black italic text-red-500 uppercase tracking-tighter">NEXUS <span className="text-white">HQ</span></h2>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl border border-white/10">
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* 🛡️ SIDEBAR */}
      <aside className={`w-full md:w-72 bg-black/40 border-r border-red-500/10 backdrop-blur-3xl fixed md:sticky top-0 h-screen z-50 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-10 hidden md:block text-center font-black italic text-red-500 border-b border-white/5 uppercase underline decoration-[#00f2ff] underline-offset-8">NODE: {clerkUser?.firstName}</div>
        <nav className="p-6 space-y-2 mt-4">
          {[
            { id: "dashboard", label: "Dashboard", icon: "📊" },
            { id: "users", label: "Users", icon: "👤" },
            { id: "payments", label: "Payments", icon: "💰" },
            { id: "analytics", label: "Analytics", icon: "📈" },
          ].map(m => (
            <button key={m.id} onClick={() => { setActiveTab(m.id); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-4 px-6 py-4 rounded-3xl transition-all ${activeTab === m.id ? 'bg-red-600 text-white shadow-xl' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              <span>{m.icon}</span><span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
            </button>
          ))}
          <button onClick={() => {sessionStorage.clear(); window.location.reload();}} className="w-full flex items-center gap-4 px-6 py-4 rounded-3xl text-gray-600 hover:text-red-500 mt-10"><span className="text-[10px] font-black uppercase tracking-widest">Lock Terminal</span></button>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-16 space-y-12 overflow-x-hidden">
        {activeTab === "dashboard" && (
          <div className="space-y-12 animate-in fade-in duration-700">
            <h3 className="text-3xl font-black uppercase italic tracking-tighter text-red-500">System Pulse</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] shadow-2xl">
                <p className="text-[10px] font-black text-gray-500 uppercase mb-4 italic">Live Revenue</p>
                <h4 className="text-4xl font-black italic">KES {revenueKes.toLocaleString()}</h4>
              </div>
              <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] shadow-2xl">
                <p className="text-[10px] font-black text-gray-500 uppercase mb-4 italic">Active Nodes</p>
                <h4 className="text-4xl font-black italic">{operators.length}</h4>
              </div>
              <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] shadow-2xl">
                <p className="text-[10px] font-black text-gray-500 uppercase mb-4 italic">Conv. Rate</p>
                <h4 className="text-4xl font-black italic text-emerald-500">{operators.length > 0 ? ((verifiedUsers.length / operators.length) * 100).toFixed(1) : "0"}%</h4>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
               <h3 className="text-2xl font-black italic uppercase text-red-500">Operator Registry</h3>
               <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="FILTER NODES..." className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black outline-none focus:border-red-500 text-white" />
            </div>
            <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-4xl">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-[8px] font-black uppercase text-gray-500 italic">
                  <tr><th className="p-6">Node</th><th className="p-6">Status</th><th className="p-6 text-right">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {fetching ? (
                    <tr><td colSpan={3} className="p-20 text-center animate-pulse text-red-500 font-black italic">SYNCING CORE...</td></tr>
                  ) : operators.filter(o => o.name.toLowerCase().includes(searchTerm.toLowerCase())).map((op) => (
                    <tr key={op.id} className="text-[10px] hover:bg-white/2 transition-all">
                      <td className="p-6 font-black uppercase italic">{op.name}<br/><span className="text-[8px] text-gray-600 not-italic font-bold">{op.email}</span></td>
                      <td className="p-6"><span className={`px-3 py-1 rounded-lg border italic font-black ${op.status === 'Verified' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-amber-500 border-amber-500/20 bg-amber-500/5'}`}>{op.status}</span></td>
                      <td className="p-6 text-right flex justify-end gap-3">
                        <button onClick={() => handleManualVerify(op.id)} className="text-[9px] font-black text-emerald-500 uppercase hover:underline italic">Verify</button>
                        <button onClick={() => handleTerminate(op.id)} className="text-[9px] font-black text-red-500 uppercase hover:underline italic">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}