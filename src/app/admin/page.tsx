"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { getAllNexusUsers } from "./_actions/users"; 

// Global type for PayHero SDK
declare global {
  interface Window { PayHero: any; }
}

export default function AdminPage() {
  const { user } = useUser();
  const [passInput, setPassInput] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State Management
  const [operators, setOperators] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fetching, setFetching] = useState(false);

  // Persistence
  useEffect(() => {
    const auth = sessionStorage.getItem("nexus_admin_session");
    if (auth === "true") setIsAuthorized(true);
  }, []);

  // Data Synchronization
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
  const conversionRate = operators.length > 0 ? ((verifiedUsers.length / operators.length) * 100).toFixed(1) : "0";
  const revenueKes = verifiedUsers.length * 1250;

  const launchPayHero = (phone: string, amount: number) => {
    if (!window.PayHero) return alert("PayHero SDK still loading. Refresh in 3s.");
    window.PayHero.init({
      paymentUrl: "https://lipwa.link/6861",
      containerId: "payHeroContainer",
      channelID: 6861,
      amount: amount,
      phone: phone,
      reference: user?.id || "admin_manual_trigger",
      buttonName: `Verify Node (KES ${amount})`,
      buttonColor: "#10b981",
      callbackUrl: "https://nexus-gigs.vercel.app/api/mpesa-callback"
    });
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
      
      {/* 📱 MOBILE HEADER */}
      <div className="md:hidden flex items-center justify-between p-6 bg-black/40 border-b border-white/5 backdrop-blur-xl sticky top-0 z-110">
        <h2 className="font-black italic text-red-500 text-xl tracking-tighter uppercase">NEXUS <span className="text-white">HQ</span></h2>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl border border-white/10"
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* 🛡️ SIDEBAR */}
      <aside className={`
        w-full md:w-72 bg-black/40 border-r border-red-500/10 backdrop-blur-3xl fixed md:sticky top-0 h-screen z-100 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-10 hidden md:block">
          <h2 className="font-black italic text-red-500 uppercase text-2xl tracking-tighter">NEXUS <span className="text-white">HQ</span></h2>
        </div>
        
        <nav className="px-6 space-y-1 mt-10 md:mt-0">
          {modules.map(m => (
            <button 
              key={m.id} 
              onClick={() => { setActiveTab(m.id); setIsMobileMenuOpen(false); }} 
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-3xl transition-all ${activeTab === m.id ? 'bg-red-600 text-white shadow-lg shadow-red-600/20 scale-105' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            >
              <span className="text-xl">{m.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="absolute bottom-8 left-0 w-full px-8 text-center">
           <button onClick={() => {sessionStorage.clear(); window.location.reload();}} className="text-[8px] font-black uppercase text-gray-600 hover:text-red-500 transition-colors">Lock Protocol</button>
        </div>
      </aside>

      {/* 🖥️ MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-16">
        
        {/* TAB: DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-10 animate-in fade-in">
            <h3 className="text-3xl font-black uppercase italic tracking-tighter">System <span className="text-red-500">Pulse</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-8 bg-white/5 border border-white/10 rounded-4xl shadow-2xl">
                 <p className="text-[8px] font-black text-gray-500 uppercase mb-4 tracking-widest italic">Live Operators</p>
                 <h4 className="text-4xl font-black italic">{operators.length}</h4>
              </div>
              <div className="p-8 bg-red-500/5 border border-red-500/20 rounded-4xl shadow-2xl">
                 <p className="text-[8px] font-black text-red-500/50 uppercase mb-4 tracking-widest italic">Global Revenue</p>
                 <h4 className="text-4xl font-black italic text-red-500">KES {revenueKes.toLocaleString()}</h4>
              </div>
              <div className="p-8 bg-white/5 border border-white/10 rounded-4xl shadow-2xl">
                 <p className="text-[8px] font-black text-gray-500 uppercase mb-4 tracking-widest italic">Conv. Rate</p>
                 <h4 className="text-4xl font-black italic">{conversionRate}%</h4>
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

        {/* TAB: PAYMENTS */}
        {activeTab === "payments" && (
          <div className="space-y-10 animate-in slide-in-from-bottom-4">
             <h3 className="text-3xl font-black uppercase italic">Financial <span className="text-red-500">Vault</span></h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-10 bg-white/5 border border-emerald-500/20 rounded-[48px] space-y-8 shadow-2xl">
                  <header>
                    <h4 className="text-[10px] font-black uppercase text-emerald-500 italic tracking-widest mb-2">M-Pesa Gateway</h4>
                    <p className="text-[8px] text-gray-600 font-bold uppercase">Manual Dispatch via Channel 6861</p>
                  </header>
                  <div className="space-y-4">
                    <input id="payPhone" placeholder="2547XXXXXXXX" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-black outline-none focus:border-emerald-500 text-lg" />
                    <div id="payHeroContainer" className="flex items-center justify-center min-h-15">
                      <button 
                        onClick={() => {
                          const phone = (document.getElementById('payPhone') as HTMLInputElement).value;
                          if(!phone) return alert("Enter Phone");
                          launchPayHero(phone, 1250);
                        }}
                        className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl uppercase text-[10px] tracking-[0.2em] transition-all shadow-lg shadow-emerald-600/20"
                      >
                        Launch M-Pesa Prompt
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-10 bg-white/5 border border-blue-500/20 rounded-[48px] space-y-8 shadow-2xl">
                  <header>
                    <h4 className="text-[10px] font-black uppercase text-blue-500 italic tracking-widest mb-2">Global Card Settlement</h4>
                    <p className="text-[8px] text-gray-600 font-bold uppercase">Stripe Infrastructure Online</p>
                  </header>
                   <button className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl uppercase text-[10px] tracking-[0.2em] transition-all shadow-lg shadow-blue-600/20">Initialize Checkout ($10)</button>
                </div>
             </div>
          </div>
        )}

        {/* TAB: ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="space-y-10 animate-in fade-in">
             <h3 className="text-3xl font-black uppercase italic">Market <span className="text-red-500">Intelligence</span></h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { l: "Gross Revenue", v: `KES ${revenueKes.toLocaleString()}`, c: "text-emerald-500" },
                  { l: "Fee Per Node", v: "KES 1,250", c: "text-gray-400" },
                  { l: "Verified Nodes", v: verifiedUsers.length, c: "text-white" },
                  { l: "Completion Rate", v: `${conversionRate}%`, c: "text-blue-500" }
                ].map(m => (
                  <div key={m.l} className="p-8 bg-white/5 border border-white/10 rounded-4xl">
                    <p className="text-[8px] font-black text-gray-500 uppercase mb-4 italic">{m.l}</p>
                    <h4 className={`text-2xl font-black italic ${m.c}`}>{m.v}</h4>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* TAB: SETTINGS */}
        {activeTab === "settings" && (
          <div className="max-w-2xl space-y-6 animate-in fade-in">
             <h3 className="text-3xl font-black uppercase italic">Platform <span className="text-red-500">Config</span></h3>
             <div className="space-y-4">
                <div className="p-8 bg-white/5 border border-white/10 rounded-4xl flex justify-between items-center group hover:border-red-500/40 cursor-pointer transition-all">
                  <div><p className="text-[10px] font-black uppercase text-gray-500">M-Pesa Webhook Endpoint</p><p className="text-sm font-black italic uppercase mt-1">/api/mpesa-callback</p></div>
                  <span className="text-[8px] px-3 py-1 bg-emerald-500/20 text-emerald-500 rounded-full font-black italic">ACTIVE</span>
                </div>
                <div className="p-8 bg-white/5 border border-white/10 rounded-4xl flex justify-between items-center group hover:border-red-500/40 cursor-pointer transition-all">
                  <div><p className="text-[10px] font-black uppercase text-gray-500">Active Channel ID</p><p className="text-sm font-black italic uppercase mt-1">PayHero #6861</p></div>
                  <button className="text-[9px] font-black text-red-500 hover:underline italic">SYNC CHANNEL</button>
                </div>
                <div className="p-8 bg-red-500/10 border border-red-500/30 rounded-4xl mt-10">
                  <p className="text-[10px] font-black uppercase text-red-500 italic mb-4">Critical System Override</p>
                  <button className="w-full py-4 bg-red-600/20 border border-red-600/50 rounded-2xl text-[10px] font-black uppercase hover:bg-red-600 transition-all">Flush Environment Cache</button>
                </div>
             </div>
          </div>
        )}

      </main>
    </div>
  );
}