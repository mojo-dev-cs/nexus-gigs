"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { getAllNexusUsers } from "./_actions/users"; 
import { initiateMpesaPayment } from "./_actions/mpesa";
import { createStripeSession } from "./_actions/stripe";

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const [passInput, setPassInput] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State Management
  const [operators, setOperators] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fetching, setFetching] = useState(false);
  const [payLoading, setPayLoading] = useState(false);

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

  // Metrics Logic
  const verifiedUsers = operators.filter(o => o.status === "Verified");
  const pendingUsers = operators.filter(o => o.status !== "Verified");
  const conversionRate = operators.length > 0 ? ((verifiedUsers.length / operators.length) * 100).toFixed(1) : "0";
  const revenue = verifiedUsers.length * 1250; // Approx 1250 KES per user

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
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#020617] text-white selection:bg-red-500/30 font-sans">
      
      {/* SIDEBAR */}
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
      </aside>

      <main className="flex-1 md:ml-72 p-6 md:p-16">
        
        {/* TAB: DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-10 animate-in fade-in">
            <h3 className="text-3xl font-black uppercase italic tracking-tighter">System <span className="text-red-500">Pulse</span></h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] shadow-2xl">
                 <p className="text-[8px] font-black text-gray-500 uppercase mb-4 tracking-widest">Total Operators</p>
                 <h4 className="text-4xl font-black italic">{operators.length}</h4>
              </div>
              <div className="p-8 bg-red-500/5 border border-red-500/20 rounded-[40px] shadow-2xl">
                 <p className="text-[8px] font-black text-red-500/50 uppercase mb-4 tracking-widest">Global Balance</p>
                 <h4 className="text-4xl font-black italic text-red-500">KES {revenue.toLocaleString()}</h4>
              </div>
            </div>
          </div>
        )}

        {/* TAB: USERS (FIXED LOAD) */}
        {activeTab === "users" && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <div className="flex justify-between items-end">
              <h3 className="text-2xl font-black uppercase italic">Operator <span className="text-red-500">Registry</span></h3>
              <input type="text" placeholder="FILTER NODES..." className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black outline-none focus:border-red-500" onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-[8px] font-black uppercase text-gray-500 tracking-widest">
                  <tr><th className="p-6">Operator</th><th className="p-6">Status</th><th className="p-6 text-right">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {fetching ? (
                    <tr><td colSpan={3} className="p-20 text-center animate-pulse text-red-500 font-black italic">SYNCING CLERK DATABASE...</td></tr>
                  ) : operators.filter(o => o.name.toLowerCase().includes(searchTerm.toLowerCase())).map((op) => (
                    <tr key={op.id} className="text-[10px] hover:bg-white/2 transition-all">
                      <td className="p-6 font-black uppercase italic">{op.name}<br/><span className="text-[8px] text-gray-600 not-italic">{op.email}</span></td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-lg border ${op.status === 'Verified' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-amber-500 border-amber-500/20 bg-amber-500/5'}`}>{op.status}</span>
                      </td>
                      <td className="p-6 text-right font-black text-red-500 cursor-pointer hover:underline">REVOKE</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: PAYMENTS (FIXED FOR PAYHERO) */}
        {activeTab === "payments" && (
          <div className="space-y-10 animate-in slide-in-from-bottom-4">
             <h3 className="text-3xl font-black italic uppercase">Financial <span className="text-red-500">Vault</span></h3>
             <div className="grid md:grid-cols-2 gap-8">
                <div className="p-10 bg-white/5 border border-emerald-500/20 rounded-[48px] space-y-6 shadow-2xl">
                  <h4 className="text-[10px] font-black uppercase text-emerald-500 italic">Manual STK Trigger</h4>
                  <input id="payPhone" placeholder="2547XXXXXXXX" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-black outline-none focus:border-emerald-500" />
                  <button 
                    disabled={payLoading}
                    onClick={async () => {
                      setPayLoading(true);
                      const phone = (document.getElementById('payPhone') as HTMLInputElement).value;
                      const res = await initiateMpesaPayment(phone, 1, user?.id || "");
                      setPayLoading(false);
                      alert(res.success ? "STK Push Dispatched!" : "Gateway Error: " + res.error);
                    }}
                    className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest transition-all"
                  >
                    {payLoading ? "TRANSMITTING..." : "EXECUTE PAYMENT REQUEST"}
                  </button>
                </div>
                <div className="p-10 bg-white/5 border border-blue-500/20 rounded-[48px] space-y-6">
                   <h4 className="text-[10px] font-black uppercase text-blue-500 italic">Global Card Link</h4>
                   <button onClick={async () => { const res = await createStripeSession(user?.emailAddresses[0].emailAddress || ""); if(res.url) window.location.href = res.url; }} className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest">ACTIVATE STRIPE CHECKOUT</button>
                </div>
             </div>
          </div>
        )}

        {/* TAB: ANALYTICS (REAL-TIME METRICS) */}
        {activeTab === "analytics" && (
          <div className="space-y-10 animate-in fade-in">
             <h3 className="text-3xl font-black uppercase italic">Intelligence <span className="text-red-500">Reports</span></h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { l: "Gross Revenue", v: `KES ${revenue.toLocaleString()}`, c: "text-emerald-500" },
                  { l: "Conversion Rate", v: `${conversionRate}%`, c: "text-blue-500" },
                  { l: "Verified Nodes", v: verifiedUsers.length, c: "text-white" },
                  { l: "Pending Nodes", v: pendingUsers.length, c: "text-amber-500" }
                ].map(m => (
                  <div key={m.l} className="p-8 bg-white/5 border border-white/10 rounded-4xl">
                    <p className="text-[8px] font-black text-gray-500 uppercase mb-4 tracking-tighter italic">{m.l}</p>
                    <h4 className={`text-2xl font-black italic ${m.c}`}>{m.v}</h4>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* TAB: SETTINGS (PROPER CONFIG) */}
        {activeTab === "settings" && (
          <div className="max-w-2xl space-y-10 animate-in fade-in">
             <h3 className="text-3xl font-black uppercase italic">Platform <span className="text-red-500">Config</span></h3>
             <div className="space-y-4">
                <div className="p-8 bg-white/5 border border-white/10 rounded-4xl flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-500">M-Pesa Gateway</p>
                    <p className="text-sm font-black italic uppercase mt-1">PayHero Channel 6861</p>
                  </div>
                  <span className="text-[8px] px-3 py-1 bg-emerald-500/20 text-emerald-500 rounded-full font-black italic">CONNECTED</span>
                </div>
                <div className="p-8 bg-white/5 border border-white/10 rounded-4xl flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-500">Security Protocol</p>
                    <p className="text-sm font-black italic uppercase mt-1">Admin Access Code</p>
                  </div>
                  <button className="text-[9px] font-black text-red-500 hover:underline italic">CHANGE KEY</button>
                </div>
                <div className="p-8 bg-red-500/10 border border-red-500/30 rounded-4xl">
                  <p className="text-[10px] font-black uppercase text-red-500 italic mb-2">Danger Zone</p>
                  <button className="w-full py-4 border border-red-500/50 rounded-2xl text-[10px] font-black uppercase hover:bg-red-500 transition-all">Flush System Cache</button>
                </div>
             </div>
          </div>
        )}

      </main>
    </div>
  );
}