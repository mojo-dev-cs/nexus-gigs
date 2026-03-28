"use client";

import { useState, useEffect } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { getAllNexusUsers } from "./_actions/users"; 

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const [passInput, setPassInput] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Registry State
  const [operators, setOperators] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fetching, setFetching] = useState(false);

  // Persistence Check
  useEffect(() => {
    const auth = sessionStorage.getItem("nexus_admin_session");
    if (auth === "true") setIsAuthorized(true);
  }, []);

  // Sync Registry when Users tab is active
  useEffect(() => {
    if (activeTab === "users" && isAuthorized) {
      const loadNodes = async () => {
        setFetching(true);
        const res = await getAllNexusUsers();
        if (res.success) setOperators(res.users || []);
        setFetching(false);
      };
      loadNodes();
    }
  }, [activeTab, isAuthorized]);

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

  const filteredOperators = operators.filter(op => 
    op.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    op.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- 🔒 GATEKEEPER VIEW ---
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#020617]">
        <form onSubmit={handleAuth} className="w-full max-w-sm bg-black/60 border border-red-500/20 p-12 rounded-[48px] backdrop-blur-3xl text-center shadow-2xl animate-in zoom-in-95 duration-500">
          <h1 className="text-3xl font-black italic text-red-500 uppercase mb-2 tracking-tighter text-shadow-glow">NEXUS <span className="text-white">HQ</span></h1>
          <p className="text-[8px] font-black text-gray-500 uppercase tracking-[0.4em] mb-10">Overseer Protocol Required</p>
          <input 
            type="password" 
            autoFocus 
            value={passInput} 
            onChange={(e) => setPassInput(e.target.value)} 
            placeholder="ENTER ACCESS KEY" 
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-center font-bold outline-none focus:border-red-500 mb-6 transition-all" 
          />
          <button className="w-full py-4 bg-red-600 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-red-500 shadow-xl shadow-red-500/10 active:scale-95 transition-all">Authenticate →</button>
        </form>
      </div>
    );
  }

  const navModules = [
    { id: "dashboard", label: "Dashboard", icon: "📊", desc: "Overview & Feed" },
    { id: "users", label: "Users", icon: "👤", desc: "Registry & KYC" },
    { id: "payments", label: "Payments", icon: "💰", desc: "M-Pesa & Fees" },
    { id: "gigs", label: "Gigs", icon: "💼", desc: "Moderation" },
    { id: "contracts", label: "Contracts", icon: "📜", desc: "Work Flow" },
    { id: "disputes", label: "Disputes", icon: "⚖️", desc: "Resolution" },
    { id: "analytics", label: "Analytics", icon: "📈", desc: "Reports" },
    { id: "marketing", label: "Marketing", icon: "📢", desc: "Growth" },
    { id: "settings", label: "Settings", icon: "⚙️", desc: "Config" },
  ];

  return (
    <div className="flex min-h-screen bg-[#020617] text-white selection:bg-red-500/30">
      
      {/* --- 🛡️ COMMAND SIDEBAR --- */}
      <aside className="w-72 border-r border-red-500/10 bg-black/40 backdrop-blur-3xl fixed h-full flex flex-col z-100 overflow-y-auto no-scrollbar">
        <div className="p-10"><h2 className="font-black italic text-red-500 uppercase text-2xl tracking-tighter">NEXUS <span className="text-white">HQ</span></h2></div>
        <nav className="flex-1 px-6 space-y-1 pb-10">
          {navModules.map(m => (
            <button key={m.id} onClick={() => setActiveTab(m.id)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-3xl transition-all ${activeTab === m.id ? 'bg-red-600 text-white shadow-lg shadow-red-600/20 scale-105' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              <span className="text-xl">{m.icon}</span>
              <div className="text-left leading-none">
                <p className="text-[10px] font-black uppercase tracking-widest">{m.label}</p>
                <p className={`text-[7px] font-bold uppercase mt-1 ${activeTab === m.id ? 'text-white/70' : 'text-gray-600'}`}>{m.desc}</p>
              </div>
            </button>
          ))}
        </nav>
        <div className="p-8 border-t border-white/5 bg-black/10 text-center">
           <button onClick={() => {sessionStorage.clear(); window.location.reload();}} className="text-[8px] font-black uppercase text-gray-600 hover:text-red-500 transition-colors">Terminate Session</button>
        </div>
      </aside>

      {/* --- 🖥️ MAIN VIEWPORT --- */}
      <main className="flex-1 ml-72 p-16 animate-in fade-in slide-in-from-right-4 duration-500">
        
        {/* TAB 1: DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-12">
            <h3 className="text-4xl font-black italic uppercase tracking-tighter">System <span className="text-red-500">Intelligence</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[ {l: "Total Users", v: operators.length || "..."}, {l: "Active Gigs", v: "0"}, {l: "Total Revenue", v: "$0.00"}, {l: "Pending KYC", v: "0"} ].map(i => (
                <div key={i.l} className="p-8 bg-white/5 border border-white/10 rounded-[40px] shadow-2xl hover:border-red-500/30 transition-all">
                  <p className="text-[9px] font-black text-gray-500 uppercase mb-4 tracking-widest italic">{i.l}</p>
                  <h4 className="text-4xl font-black italic tracking-tighter">{i.v}</h4>
                </div>
              ))}
            </div>
            <div className="p-10 bg-red-500/5 border border-red-500/10 rounded-[48px] min-h-75">
              <h5 className="text-[10px] font-black uppercase text-red-500 mb-8 italic tracking-widest">Real-time Activity Feed</h5>
              <p className="text-[10px] font-bold uppercase text-gray-700 italic">Listening for telemetry...</p>
            </div>
          </div>
        )}

        {/* TAB 2: USERS (OPERATOR REGISTRY) */}
        {activeTab === "users" && (
          <div className="space-y-8">
            <header className="flex justify-between items-end">
              <div>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter">Operator <span className="text-red-500">Registry</span></h3>
                <p className="text-gray-500 text-[8px] font-black uppercase tracking-[0.3em] mt-2 italic">Searchable Node database</p>
              </div>
              <input 
                type="text" 
                placeholder="SEARCH NODES..." 
                className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-[10px] font-black outline-none focus:border-red-500/50 w-64"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </header>

            <div className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden backdrop-blur-3xl">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-[9px] font-black uppercase tracking-widest text-gray-500 border-b border-white/5">
                  <tr><th className="p-8">Node Name</th><th className="p-8">Status</th><th className="p-8">Role</th><th className="p-8 text-right">Command</th></tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {fetching ? (
                    <tr><td colSpan={4} className="p-20 text-center animate-pulse text-red-500 font-black italic uppercase text-[10px]">Syncing Registry...</td></tr>
                  ) : filteredOperators.map((op) => (
                    <tr key={op.id} className="hover:bg-white/2 transition-colors group">
                      <td className="p-8">
                        <p className="font-black italic uppercase text-sm group-hover:text-red-500 transition-all">{op.name}</p>
                        <p className="text-[9px] text-gray-600 font-bold">{op.email}</p>
                      </td>
                      <td className="p-8">
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase border ${op.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                          {op.status}
                        </span>
                      </td>
                      <td className="p-8 text-[10px] font-black uppercase opacity-60">{op.role}</td>
                      <td className="p-8 text-right"><button className="text-[9px] font-black uppercase text-gray-600 hover:text-white">Manage →</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PAYMENTS */}
        {activeTab === "payments" && (
          <div className="space-y-10">
            <h3 className="text-3xl font-black italic uppercase tracking-tighter">Financial <span className="text-red-500">Vault</span></h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="p-10 bg-white/5 border border-white/10 rounded-[48px] space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-red-500 italic">M-Pesa Verification Queue</h4>
                <div className="p-6 border border-dashed border-white/10 rounded-2xl text-center"><p className="text-[10px] font-bold text-gray-700 uppercase">Input manual receipt code to override</p></div>
              </div>
              <div className="p-10 bg-white/5 border border-white/10 rounded-[48px] space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-red-500 italic">Revenue Breakdown</h4>
                <p className="text-xs text-gray-700 font-black uppercase tracking-widest italic">Commission: 2% | Active</p>
              </div>
            </div>
          </div>
        )}

        {/* --- PLACEHOLDERS FOR REMAINING 6 MODULES --- */}
        {["gigs", "contracts", "disputes", "analytics", "marketing", "settings"].includes(activeTab) && (
          <div className="h-full flex flex-col items-center justify-center space-y-4 border border-dashed border-white/5 rounded-[48px] opacity-30">
             <span className="text-4xl">📡</span>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] italic text-red-500">Module Connectivity Pending</p>
          </div>
        )}

      </main>
    </div>
  );
}