"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { getAllNexusUsers, verifyUserNode, terminateUserNode, suspendUserNode } from "./_actions/users"; 
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, Users, DollarSign, Activity, Settings, 
  UserCheck, Ban, Trash2, Globe, TrendingUp, 
  Search, Lock, Zap, Server, BarChart, ChevronRight,
  Smartphone, Landmark, Bitcoin, Wallet
} from "lucide-react";

interface NexusUser {
  id: string;
  name: string;
  email: string;
  status: string;
  role: string;
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
  const [visitCount, setVisitCount] = useState(1402);

  // --- 📈 REAL-TIME CALCULATIONS BASED ON CLERK ---
  const metrics = useMemo(() => {
    const verified = operators.filter(o => o.status === "Verified");
    const startOfToday = new Date().setHours(0, 0, 0, 0);
    const todayNodes = verified.filter(o => o.createdAt >= startOfToday);
    
    return {
      verifiedNodes: verified,
      totalRevenue: verified.length * 910, 
      todaysRevenue: todayNodes.length * 910,
      verifiedCount: verified.length,
      pendingCount: operators.length - verified.length
    };
  }, [operators]);

  const loadData = useCallback(async () => {
    if (!isAuthorized) return;
    setFetching(true);
    const res = await getAllNexusUsers();
    if (res.success && res.users) setOperators(res.users as NexusUser[]);
    setFetching(false);
  }, [isAuthorized]);

  useEffect(() => {
    if (sessionStorage.getItem("nexus_admin_session") === "true") setIsAuthorized(true);
    const interval = setInterval(() => setVisitCount(v => v + Math.floor(Math.random() * 3)), 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      loadData();
      const heartbeat = setInterval(() => loadData(), 20000); 
      return () => clearInterval(heartbeat);
    }
  }, [isAuthorized, loadData]);

  const handleAction = async (actionFn: any, id: string, extraArg?: any) => {
    if (confirm("Execute system command?")) {
      setFetching(true);
      const res = await actionFn(id, extraArg);
      if (res.success) await loadData();
      else alert("Protocol Command Failed.");
      setFetching(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <motion.form 
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          onSubmit={(e) => { e.preventDefault(); if(passInput === "Nexus123!") { sessionStorage.setItem("nexus_admin_session", "true"); setIsAuthorized(true); } }} 
          className="w-full max-w-sm bg-black border-2 border-red-500/20 p-12 rounded-[60px] text-center shadow-[0_0_100px_rgba(220,38,38,0.15)]"
        >
          <Lock size={32} className="mx-auto mb-10 text-red-500" />
          <h1 className="text-3xl font-black italic text-white uppercase tracking-tighter mb-2">NEXUS <span className="text-red-600">HQ</span></h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] mb-10 font-bold">Authorized Access Only</p>
          <input type="password" value={passInput} onChange={(e) => setPassInput(e.target.value)} placeholder="PROTOCOL KEY" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white text-center font-black mb-8 outline-none focus:border-red-600 transition-all tracking-[0.5em]" />
          <button className="w-full py-5 bg-red-600 text-white font-black rounded-2xl uppercase text-[11px] italic">Unlock Command</button>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#020617] text-white font-sans selection:bg-red-500/30 overflow-x-hidden">
      
      {/* --- SIDE NAVIGATION --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-black border-r border-white/5 backdrop-blur-3xl transform transition-transform duration-500 md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-10 border-b border-white/5 mb-8 flex items-center gap-3">
            <Shield className="text-red-600" size={24}/>
            <h2 className="font-black italic text-white uppercase tracking-tighter text-xl">Nexus<span className="text-red-600">HQ</span></h2>
        </div>
        <nav className="px-6 space-y-3">
          {[
            { id: "dashboard", label: "Overview", icon: <BarChart size={20}/> },
            { id: "users", label: "Registry", icon: <Users size={20}/> },
            { id: "payments", label: "Vault", icon: <DollarSign size={20}/> },
            { id: "settings", label: "Core Config", icon: <Server size={20}/> }
          ].map(m => (
            <button key={m.id} onClick={() => { setActiveTab(m.id); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-5 px-6 py-5 rounded-3xl transition-all relative group ${activeTab === m.id ? 'bg-red-600 text-white shadow-2xl shadow-red-600/30' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}>
              {m.icon} <span className="text-[11px] font-black uppercase tracking-widest">{m.label}</span>
              {activeTab === m.id && <motion.div layoutId="activeInd" className="absolute left-0 w-1 h-8 bg-white rounded-r-full" />}
            </button>
          ))}
        </nav>
      </aside>

      {/* --- MAIN CONTENT (FIXED PADDING TO STOP OVERLAY) --- */}
      <main className="flex-1 p-6 md:p-16 md:pl-80 pt-24 md:pt-16 max-w-7xl w-full">
        
        {/* --- OVERVIEW TAB --- */}
        {activeTab === "dashboard" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
            <div className="flex justify-between items-end border-b border-white/5 pb-8">
               <h3 className="text-4xl font-black uppercase italic tracking-tighter">System <span className="text-red-600">Pulse</span></h3>
               <div className="flex items-center gap-3 bg-red-600/10 px-6 py-2 rounded-full border border-red-600/20">
                  <Activity size={14} className="text-red-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase italic text-red-500 tracking-widest">Live Satellite Feed</span>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: "Total Revenue", val: `KES ${metrics.totalRevenue.toLocaleString()}`, sub: "Overall Inflow", color: "text-emerald-500" },
                { label: "Today Inflow", val: `KES ${metrics.todaysRevenue.toLocaleString()}`, sub: "24h Sync Data", color: "text-red-500" },
                { label: "Verified Nodes", val: metrics.verifiedCount, sub: "Elite Standing", color: "text-[#00f2ff]" },
                { label: "Site Visits", val: visitCount.toLocaleString(), sub: "Global Traffic", color: "text-amber-500" }
              ].map((stat, i) => (
                <motion.div key={i} whileHover={{ y: -5 }} className="p-8 bg-white/3 border border-white/5 rounded-[45px] shadow-xl backdrop-blur-xl relative overflow-hidden group">
                  <p className="text-[10px] font-black text-gray-500 uppercase italic tracking-widest mb-4">{stat.label}</p>
                  <h4 className={`text-4xl font-black italic tracking-tighter mb-2 ${stat.color}`}>{stat.val}</h4>
                  <p className="text-[9px] font-bold text-gray-600 uppercase italic">{stat.sub}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
               <div className="p-10 bg-white/2 border border-white/10 rounded-[60px] relative overflow-hidden">
                  <p className="text-[10px] font-black uppercase italic text-red-500 tracking-widest mb-10">Revenue Matrix (Sync Units)</p>
                  <div className="flex items-end justify-between h-48 gap-4 px-4">
                     {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                       <motion.div key={i} animate={{ height: [`0%`, `${h}%`] }} className="w-full bg-linear-to-t from-red-600 to-orange-500 rounded-t-2xl shadow-2xl" />
                     ))}
                  </div>
               </div>
               <div className="p-10 bg-white/2 border border-white/10 rounded-[60px] flex flex-col justify-center text-center">
                  <Zap size={32} className="text-red-500 mx-auto mb-6" />
                  <h4 className="text-2xl font-black italic uppercase mb-2">Global Uplink: Optimal</h4>
                  <p className="text-xs text-gray-500 italic max-w-xs mx-auto leading-relaxed">All relay sectors are operational. Average node latency sitting at 0.02ms across all regional clusters.</p>
               </div>
            </div>
          </motion.div>
        )}

        {/* --- NODE REGISTRY --- */}
        {activeTab === "users" && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
             <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 pb-8">
                <h3 className="text-3xl font-black uppercase italic tracking-tighter">Node <span className="text-red-600">Registry</span></h3>
                <div className="relative w-full md:w-96">
                   <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                   <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="FILTER GLOBAL NODES..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-14 py-4 text-xs font-black text-white outline-none focus:border-red-600 transition-all uppercase italic" />
                </div>
             </div>

             <div className="grid gap-4">
                {operators.filter(o => o.name.toLowerCase().includes(searchTerm.toLowerCase())).map((op, idx) => (
                  <motion.div 
                    key={op.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                    className="p-8 bg-white/3 border border-white/5 rounded-[35px] flex flex-col md:flex-row justify-between items-center gap-6 hover:bg-white/5 transition-all group"
                  >
                    <div className="flex items-center gap-6 flex-1">
                       <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center font-black text-xl text-gray-500 group-hover:text-red-500 transition-colors border border-white/5 uppercase">{op.name.charAt(0)}</div>
                       <div>
                          <h4 className="text-lg font-black uppercase italic tracking-tighter flex items-center gap-3">{op.name} {op.status === 'Verified' && <UserCheck size={16} className="text-emerald-500" />}</h4>
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{op.email}</p>
                       </div>
                    </div>

                    <div className="flex items-center gap-10">
                       <div className="text-right">
                          <p className="text-[8px] font-black text-gray-600 uppercase italic mb-1 tracking-widest">Node Status</p>
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase italic border ${op.banned ? 'bg-red-500/10 border-red-500 text-red-500' : op.status === 'Verified' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-amber-500/10 border-amber-500 text-amber-500'}`}>{op.banned ? "TERMINATED" : op.status}</span>
                       </div>
                       <div className="flex gap-2">
                          <button onClick={() => handleAction(verifyUserNode, op.id)} className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all shadow-xl"><UserCheck size={18}/></button>
                          <button onClick={() => handleAction(suspendUserNode as any, op.id, !op.banned)} className="p-4 bg-amber-500/10 text-amber-500 rounded-2xl hover:bg-amber-500 hover:text-white transition-all shadow-xl"><Ban size={18}/></button>
                          <button onClick={() => handleAction(terminateUserNode, op.id)} className="p-4 bg-red-600/10 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-xl"><Trash2 size={18}/></button>
                       </div>
                    </div>
                  </motion.div>
                ))}
             </div>
          </motion.div>
        )}

        {/* --- 💰 RE-ENGINEERED VAULT (FINANCES) --- */}
        {activeTab === "payments" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
             <h3 className="text-3xl font-black uppercase italic tracking-tighter border-b border-white/5 pb-8">Financial <span className="text-red-600">Vault</span></h3>
             
             {/* BALANCE CARDS */}
             <div className="grid md:grid-cols-2 gap-10">
                <motion.div whileHover={{ scale: 1.02 }} className="p-16 bg-linear-to-br from-emerald-500/20 to-transparent border-2 border-emerald-500/30 rounded-[70px] text-center shadow-3xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-6 opacity-10"><Zap size={100} className="text-emerald-400" /></div>
                   <p className="text-[12px] font-black text-emerald-400 uppercase italic tracking-[0.5em] mb-6 relative z-10">Live Pool Yield</p>
                   <h4 className="text-[6rem] font-black italic tracking-tighter leading-none relative z-10">KES {metrics.totalRevenue.toLocaleString()}</h4>
                   <p className="mt-8 text-[10px] font-black text-gray-500 uppercase italic tracking-widest relative z-10 underline underline-offset-4 decoration-emerald-500/30">Total Verified Capital</p>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} className="p-16 bg-white/2 border border-white/10 rounded-[70px] text-center shadow-xl relative overflow-hidden">
                   <p className="text-[12px] font-black text-amber-500 uppercase italic tracking-[0.5em] mb-6">Unverified Syncs</p>
                   <h4 className="text-[4rem] font-black italic text-gray-600 leading-none">KES {(metrics.pendingCount * 910).toLocaleString()}</h4>
                   <p className="mt-8 text-[10px] font-black text-gray-500 uppercase italic tracking-widest">Pending Protocol Activation</p>
                </motion.div>
             </div>

             {/* WITHDRAWAL COMMANDS (SEPARATE SECTION) */}
             <div className="space-y-8">
                <h4 className="text-xs font-black uppercase italic text-gray-500 tracking-[0.3em] border-l-4 border-red-600 pl-6">Master Disbursement Relay</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {[
                     { label: "M-Pesa Relay", icon: <Smartphone />, desc: "Initialize Mobile Push", color: "hover:border-emerald-500" },
                     { label: "Bank Wire", icon: <Landmark />, desc: "Global SWIFT Sync", color: "hover:border-blue-500" },
                     { label: "Crypto Swap", icon: <Bitcoin />, desc: "Web3 Protocol Relay", color: "hover:border-orange-500" }
                   ].map((btn, i) => (
                     <motion.button 
                       key={i} 
                       whileHover={{ y: -8, backgroundColor: "rgba(255,255,255,0.03)" }}
                       className={`p-10 bg-black/60 border border-white/10 rounded-[45px] flex flex-col items-center gap-5 transition-all shadow-2xl group ${btn.color}`}
                       onClick={() => alert(`Accessing ${btn.label} Channel...`)}
                     >
                        <div className="p-4 bg-white/5 rounded-2xl text-red-500 group-hover:scale-110 transition-transform">{btn.icon}</div>
                        <div className="text-center">
                           <p className="text-sm font-black uppercase italic text-white tracking-widest">{btn.label}</p>
                           <p className="text-[9px] font-bold text-gray-600 uppercase mt-1 italic">{btn.desc}</p>
                        </div>
                     </motion.button>
                   ))}
                </div>
             </div>
          </motion.div>
        )}

        {/* --- SYSTEM CORE TAB --- */}
        {activeTab === "settings" && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl space-y-8">
             <h3 className="text-3xl font-black uppercase italic tracking-tighter">System <span className="text-red-600">Core</span></h3>
             <div className="p-14 bg-white/2 border border-white/10 rounded-[60px] space-y-12 shadow-3xl backdrop-blur-3xl">
                <div className="flex justify-between items-center group cursor-pointer">
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-600"><Lock size={24}/></div>
                      <div><h4 className="text-sm font-black italic uppercase">Protocol Lock</h4><p className="text-[10px] text-gray-600 uppercase italic tracking-widest">Global override for node activity</p></div>
                   </div>
                   <div className="w-14 h-7 bg-white/10 rounded-full p-1 flex justify-start transition-all cursor-pointer"><div className="w-5 h-5 bg-gray-500 rounded-full" /></div>
                </div>
                <button className="w-full py-6 bg-red-600 text-white font-black rounded-3xl uppercase text-[11px] italic tracking-[0.4em] shadow-2xl active:scale-95 transition-all">Synchronize Global Config</button>
             </div>
             <div className="p-10 border-2 border-red-600/20 bg-red-600/5 rounded-[50px] text-center">
                <p className="text-[10px] font-black text-red-500 uppercase italic tracking-[0.5em] mb-6">Emergency Data Wipe</p>
                <button className="w-full py-5 bg-red-600 text-white font-black rounded-3xl text-[11px] uppercase italic hover:bg-red-700 transition-colors shadow-2xl shadow-red-600/10">Execute Wipe Command</button>
             </div>
          </motion.div>
        )}
      </main>

      {/* --- MOBILE HUD TOGGLE --- */}
      <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden fixed bottom-10 right-6 z-100 w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-black transition-all active:scale-90">
         {isMobileMenuOpen ? <Trash2 size={24}/> : <Settings size={24}/>}
      </button>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}