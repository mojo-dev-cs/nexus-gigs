"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { getAllNexusUsers } from "./_actions/users"; 

// Global type for IntaSend SDK
declare global {
  interface Window { IntaSend: any; }
}

export default function AdminPage() {
  const { user } = useUser();
  const [passInput, setPassInput] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [operators, setOperators] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fetching, setFetching] = useState(false);

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

  const verifiedUsers = operators.filter(o => o.status === "Verified");
  const revenueKes = verifiedUsers.length * 1250;

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
        
        {/* ✅ TAB: DASHBOARD (HIGH-FIDELITY EDIT) */}
        {activeTab === "dashboard" && (
          <div className="space-y-12 animate-in fade-in duration-700">
            <header className="flex justify-between items-end">
                <div>
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter">System <span className="text-red-500">Pulse</span></h3>
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mt-2 italic">March 23, 2026 to March 29, 2026</p>
                </div>
                <div className="text-right hidden md:block">
                    <span className="text-[8px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 tracking-widest">Relay Active</span>
                </div>
            </header>

            {/* --- 💰 BALANCE GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Current Balance */}
              <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 text-4xl font-black italic uppercase">LIVE</div>
                <p className="text-[10px] font-black text-gray-500 uppercase mb-4 tracking-widest italic">Current Balance</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-sm font-black text-gray-600">KES</span>
                    <h4 className="text-4xl font-black italic">{revenueKes.toLocaleString()}</h4>
                </div>
                <div className="mt-6 flex gap-2">
                    <button className="flex-1 py-3 bg-red-600 text-white text-[9px] font-black uppercase rounded-xl italic">Request</button>
                    <button className="flex-1 py-3 bg-white/5 border border-white/10 text-[9px] font-black uppercase rounded-xl italic">Add Funds</button>
                </div>
              </div>

              {/* Available Balance */}
              <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] shadow-2xl group hover:border-emerald-500/30 transition-all">
                <p className="text-[10px] font-black text-gray-500 uppercase mb-4 tracking-widest italic">Available Balance</p>
                <div className="flex items-baseline gap-2 text-emerald-500">
                    <span className="text-sm font-black opacity-50">KES</span>
                    <h4 className="text-4xl font-black italic">{revenueKes.toLocaleString()}</h4>
                </div>
                <div className="mt-6">
                    <button className="w-full py-3 bg-emerald-600 text-white text-[9px] font-black uppercase rounded-xl italic tracking-widest">Withdraw Money</button>
                </div>
              </div>

              {/* Currency Sub-Relay */}
              <div className="p-8 bg-black/40 border border-white/5 rounded-[40px] space-y-3">
                {['GBP 0.00', 'EUR 0.00', 'USD 0.00'].map((cur) => (
                    <div key={cur} className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[9px] font-black text-gray-600 italic uppercase">{cur.split(' ')[0]}</span>
                    <span className="text-sm font-black italic">{cur.split(' ')[1]}</span>
                    </div>
                ))}
                <div className="pt-2">
                    <div className="bg-red-600/10 text-red-500 p-3 rounded-xl flex justify-between items-center border border-red-500/20 font-black italic">
                    <span className="text-[9px] uppercase tracking-tighter">Total KES</span>
                    <span className="text-sm">{revenueKes.toLocaleString()}</span>
                    </div>
                </div>
              </div>
            </div>

            {/* --- 📊 PERFORMANCE ANALYSIS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-10 bg-white/2 border border-white/5 rounded-[48px] text-center group hover:border-red-500/20 transition-all">
                    <p className="text-[9px] font-black text-gray-500 uppercase mb-2 tracking-widest">Sales</p>
                    <h4 className="text-3xl font-black italic">KES {revenueKes.toLocaleString()}</h4>
                    <p className="text-[8px] text-emerald-500 font-bold mt-2 uppercase">↗ 1.00 (100.0%)</p>
                </div>
                <div className="p-10 bg-white/2 border border-white/5 rounded-[48px] text-center group hover:border-red-500/20 transition-all">
                    <p className="text-[9px] font-black text-gray-500 uppercase mb-2 tracking-widest">Payouts</p>
                    <h4 className="text-3xl font-black italic text-gray-600">KES 0.00</h4>
                    <p className="text-[8px] text-gray-700 font-bold mt-2 uppercase tracking-tighter">No Active Outflow</p>
                </div>
                <div className="p-10 bg-white/2 border border-white/5 rounded-[48px] text-center group hover:border-red-500/20 transition-all">
                    <p className="text-[9px] font-black text-gray-500 uppercase mb-2 tracking-widest">Chargebacks</p>
                    <h4 className="text-3xl font-black italic text-red-500">KES 0.00</h4>
                    <p className="text-[8px] text-red-500/50 font-bold mt-2 uppercase italic tracking-tighter">Security Protocol: Zero</p>
                </div>
            </div>

            {/* --- 📜 CLEARING TRANSACTIONS TABLE --- */}
            <div className="bg-white/2 border border-white/10 rounded-[48px] overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase italic tracking-widest">Clearing Transactions <span className="text-red-500">Overview</span></h4>
                    <span className="text-[8px] font-bold text-gray-600 uppercase italic">Real-time Feed</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/5 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] italic">
                        <th className="p-6">ID</th>
                        <th className="p-6">Provider</th>
                        <th className="p-6">Account</th>
                        <th className="p-6">Currency</th>
                        <th className="p-6">Amount</th>
                        <th className="p-6">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td colSpan={6} className="p-24 text-center">
                            <div className="opacity-20 flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-2 border-dashed border-red-500 rounded-full animate-spin" />
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] italic">Syncing satellite clearing data...</p>
                            </div>
                        </td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            </div>
          </div>
        )}

   {/* TAB: USERS */}

        {activeTab === "users" && (

          <div className="space-y-6 animate-in slide-in-from-right-4">

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">

              <h3 className="text-2xl font-black italic uppercase">Operator <span className="text-red-500">Registry</span></h3>

              <input type="text" placeholder="FILTER NODES..." className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black outline-none focus:border-red-500" onChange={(e) => setSearchTerm(e.target.value)} />

            </div>

            <div className="bg-white/5 border border-white/10 rounded-4xl overflow-hidden overflow-x-auto">

              <table className="w-full text-left min-w-150">

                <thead className="bg-white/5 text-[8px] font-black uppercase text-gray-500 tracking-widest italic">

                  <tr><th className="p-6">Node Identifier</th><th className="p-6">Status</th><th className="p-6 text-right">Command</th></tr>

                </thead>

                <tbody className="divide-y divide-white/5">

                  {fetching ? (

                    <tr><td colSpan={3} className="p-20 text-center animate-pulse text-red-500 font-black italic">SYNCING CLERK CORE...</td></tr>

                  ) : operators.filter(o => o.name.toLowerCase().includes(searchTerm.toLowerCase())).map((op) => (

                    <tr key={op.id} className="text-[10px] hover:bg-white/2 transition-all group">

                      <td className="p-6 font-black uppercase italic group-hover:text-red-500 transition-colors">{op.name}<br/><span className="text-[8px] text-gray-600 not-italic">{op.email}</span></td>

                      <td className="p-6">

                        <span className={`px-3 py-1 rounded-lg border italic font-black ${op.status === 'Verified' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-amber-500 border-amber-500/20 bg-amber-500/5'}`}>{op.status}</span>

                      </td>

                      <td className="p-6 text-right font-black text-red-500 cursor-pointer hover:underline uppercase italic">Manage Node</td>

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