"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { getAllNexusUsers } from "./_actions/users"; 

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const [passInput, setPassInput] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Real-time Financial & Registry State
  const [operators, setOperators] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fetching, setFetching] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const auth = sessionStorage.getItem("nexus_admin_session");
    if (auth === "true") setIsAuthorized(true);
  }, []);

  // Sync Registry & Calculate Revenue
  useEffect(() => {
    if (isAuthorized) {
      const loadData = async () => {
        setFetching(true);
        const res = await getAllNexusUsers();
        if (res.success && res.users) {
          setOperators(res.users || []);
          // Calculate $10 for every verified user
          const verifiedCount = res.users.filter((u: any) => u.status === "Verified").length;
          setTotalRevenue(verifiedCount * 10);
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

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#020617]">
        <form onSubmit={handleAuth} className="w-full max-w-sm bg-black/60 border border-red-500/20 p-8 md:p-12 rounded-[40px] backdrop-blur-3xl text-center shadow-2xl">
          <h1 className="text-2xl font-black italic text-red-500 uppercase mb-2 tracking-tighter">NEXUS <span className="text-white">HQ</span></h1>
          <input type="password" autoFocus value={passInput} onChange={(e) => setPassInput(e.target.value)} placeholder="ACCESS KEY" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-center font-bold outline-none focus:border-red-500 mb-6" />
          <button className="w-full py-4 bg-red-600 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest hover:bg-red-500 transition-all">Authenticate</button>
        </form>
      </div>
    );
  }

  const modules = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "users", label: "Users", icon: "👤" },
    { id: "payments", label: "Payments", icon: "💰" },
    { id: "disputes", label: "Disputes", icon: "⚖️" },
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#020617] text-white selection:bg-red-500/30">
      
      {/* --- 📱 MOBILE HEADER --- */}
      <div className="md:hidden flex items-center justify-between p-6 border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-110">
        <h2 className="font-black italic text-red-500 text-xl">NEXUS <span className="text-white">HQ</span></h2>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-2xl">
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* --- 🛡️ SIDEBAR (Desktop & Mobile) --- */}
      <aside className={`w-full md:w-72 border-r border-red-500/10 bg-black/40 backdrop-blur-3xl fixed md:h-full z-100 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-y-0 h-full' : '-translate-y-full md:translate-y-0'}`}>
        <div className="p-10 hidden md:block"><h2 className="font-black italic text-red-500 uppercase text-2xl tracking-tighter">NEXUS <span className="text-white">HQ</span></h2></div>
        <nav className="px-6 space-y-1 py-10 md:py-0">
          {modules.map(m => (
            <button key={m.id} onClick={() => { setActiveTab(m.id); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-4 px-6 py-4 rounded-3xl transition-all ${activeTab === m.id ? 'bg-red-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>
              <span className="text-xl">{m.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto p-8 border-t border-white/5 text-center">
           <button onClick={() => {sessionStorage.clear(); window.location.reload();}} className="text-[8px] font-black uppercase text-gray-600">Lock Console</button>
        </div>
      </aside>

      {/* --- 🖥️ MAIN CONTENT --- */}
      <main className="flex-1 md:ml-72 p-6 md:p-16">
        
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-10 animate-in fade-in">
            <h3 className="text-3xl font-black uppercase italic tracking-tighter">System <span className="text-red-500">Pulse</span></h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <div className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-4xl shadow-2xl">
                 <p className="text-[8px] font-black text-gray-500 uppercase mb-4 tracking-widest italic">Live Nodes</p>
                 <h4 className="text-3xl md:text-4xl font-black italic">{operators.length}</h4>
              </div>
              <div className="p-6 md:p-8 bg-red-500/5 border border-red-500/20 rounded-4xl shadow-2xl">
                 <p className="text-[8px] font-black text-red-500/50 uppercase mb-4 tracking-widest italic">Global Balance</p>
                 <h4 className="text-3xl md:text-4xl font-black italic text-red-500">${totalRevenue.toLocaleString()}</h4>
              </div>
              <div className="col-span-2 md:col-span-1 p-6 md:p-8 bg-white/5 border border-white/10 rounded-4xl">
                 <p className="text-[8px] font-black text-gray-500 uppercase mb-4 tracking-widest italic">Verifications</p>
                 <h4 className="text-3xl md:text-4xl font-black italic">{operators.filter(o => o.status === "Verified").length}</h4>
              </div>
            </div>
          </div>
        )}

        {/* USERS */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">Operator <span className="text-red-500">Registry</span></h3>
              <input type="text" placeholder="SEARCH..." className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black outline-none focus:border-red-500/50" onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-4xl overflow-hidden overflow-x-auto">
              <table className="w-full text-left min-w-125">
                <thead className="bg-white/5 text-[8px] font-black uppercase text-gray-500">
                  <tr><th className="p-6">Operator</th><th className="p-6">Status</th><th className="p-6 text-right">Command</th></tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {operators.filter(o => o.name.toLowerCase().includes(searchTerm.toLowerCase())).map((op) => (
                    <tr key={op.id} className="text-[10px]">
                      <td className="p-6 font-black uppercase italic">{op.name}<br/><span className="text-[8px] text-gray-600 not-italic">{op.email}</span></td>
                      <td className="p-6">
                        <span className={`px-2 py-0.5 rounded-full border ${op.status === 'Verified' ? 'text-emerald-500 border-emerald-500/20' : 'text-amber-500 border-amber-500/20'}`}>{op.status}</span>
                      </td>
                      <td className="p-6 text-right text-red-500 font-black cursor-pointer">MANAGE</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === "settings" && (
          <div className="max-w-xl space-y-8 animate-in fade-in">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter">Platform <span className="text-red-500">Settings</span></h3>
            <div className="space-y-4">
               {[ 
                 { t: "M-Pesa Till Config", v: "Currently Active" }, 
                 { t: "Verification Fee", v: "$10.00" }, 
                 { t: "Platform Commission", v: "2%" }, 
                 { t: "System Maintenance", v: "Offline Mode" } 
               ].map(s => (
                 <div key={s.t} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center group cursor-pointer hover:border-red-500/30">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase text-gray-500">{s.t}</span>
                      <span className="text-[11px] font-bold text-white mt-1 uppercase italic tracking-wider">{s.v}</span>
                    </div>
                    <span className="text-[8px] font-black text-gray-700">EDIT →</span>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* PAYMENTS, DISPUTES, ANALYTICS placeholders remain similar but streamlined */}
        {["payments", "disputes", "analytics"].includes(activeTab) && (
          <div className="p-10 border border-dashed border-white/10 rounded-4xl text-center opacity-40">
             <p className="text-[8px] font-black uppercase tracking-[0.4em] text-red-500">Module Connectivity Pending</p>
          </div>
        )}

      </main>
    </div>
  );
}