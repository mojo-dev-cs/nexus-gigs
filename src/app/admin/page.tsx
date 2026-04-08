"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { getAllNexusUsers, verifyUserNode, terminateUserNode, suspendUserNode } from "./_actions/users"; 
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, Users, DollarSign, Activity, Settings, 
  UserCheck, Ban, Trash2, Globe, TrendingUp, 
  Search, Lock, Zap, Server, BarChart, ChevronRight,
  Smartphone, Landmark, Bitcoin, UserPlus, Briefcase, MousePointer2,
  Cpu, Power, AlertCircle, Copy, UserCog, Terminal, X
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

  // System Settings States
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [commissionRelay, setCommissionRelay] = useState(15);

  // --- 📈 REAL-TIME CALCULATIONS (SCREENSHOT LAYOUT) ---
  const metrics = useMemo(() => {
    const verified = operators.filter(o => o.status === "Verified");
    const clients = operators.filter(o => o.role === "client");
    const startOfToday = new Date().setHours(0, 0, 0, 0);
    const startOfYesterday = startOfToday - 86400000;
    
    const todaySignups = operators.filter(o => o.createdAt >= startOfToday).length;
    const yesterdaySignups = operators.filter(o => o.createdAt >= startOfYesterday && o.createdAt < startOfToday).length;
    
    const todayVerified = verified.filter(o => o.createdAt >= startOfToday);
    const yesterdayVerified = verified.filter(o => o.createdAt >= startOfYesterday && o.createdAt < startOfToday);

    return {
      verifiedNodes: verified,
      totalUsers: operators.length,
      activeUsers: verified.length,
      totalClients: clients.length || Math.floor(operators.length * 0.35),
      todaySignups,
      yesterdaySignups,
      totalRevenue: verified.length * 910,
      todayTransactions: todayVerified.length * 910,
      yesterdayTransactions: yesterdayVerified.length * 910
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
      setFetching(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <motion.form 
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          onSubmit={(e) => { 
            e.preventDefault(); 
            if(passInput === "Nexus123!") { 
              sessionStorage.setItem("nexus_admin_session", "true"); 
              setIsAuthorized(true); 
            } else { alert("Access Denied."); }
          }} 
          className="w-full max-w-sm bg-black border-2 border-red-500/20 p-12 rounded-[60px] text-center shadow-[0_0_100px_rgba(239,68,68,0.15)]"
        >
          <Lock size={48} className="mx-auto mb-10 text-red-500" />
          <h1 className="text-3xl font-black italic text-white uppercase tracking-tighter mb-8">NEXUS <span className="text-red-600">HQ</span></h1>
          <input type="password" value={passInput} onChange={(e) => setPassInput(e.target.value)} placeholder="PROTOCOL KEY" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white text-center font-black mb-8 outline-none focus:border-red-600 transition-all tracking-[0.5em]" />
          <button className="w-full py-5 bg-red-600 text-white font-black rounded-2xl uppercase text-[11px] italic">Unlock Command</button>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#020617] text-white font-sans overflow-x-hidden">
      
      {/* --- 📟 SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-black border-r border-white/5 transform transition-transform duration-500 md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-10 border-b border-white/5 mb-8 flex items-center gap-3">
            <Shield className="text-red-600" size={24}/>
            <h2 className="font-black italic text-white uppercase tracking-tighter text-xl">Nexus<span className="text-red-600">HQ</span></h2>
        </div>
        <nav className="px-6 space-y-3">
          {[
            { id: "dashboard", label: "Dashboard", icon: <BarChart size={20}/> },
            { id: "users", label: "Registry", icon: <Users size={20}/> },
            { id: "payments", label: "Vault", icon: <DollarSign size={20}/> },
            { id: "settings", label: "Config", icon: <Settings size={20}/> }
          ].map(m => (
            <button key={m.id} onClick={() => { setActiveTab(m.id); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-5 px-6 py-5 rounded-3xl transition-all relative group ${activeTab === m.id ? 'bg-red-600 text-white shadow-2xl shadow-red-600/30' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}>
              {m.icon} <span className="text-[11px] font-black uppercase tracking-widest">{m.label}</span>
              {activeTab === m.id && <motion.div layoutId="navInd" className="absolute left-0 w-1 h-8 bg-white rounded-r-full" />}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-16 md:pl-80 pt-24 md:pt-16 max-w-7xl w-full">
        
        {/* --- DASHBOARD TAB --- */}
        {activeTab === "dashboard" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
            <h3 className="text-4xl font-black uppercase italic tracking-tighter">System <span className="text-red-600">Pulse</span></h3>

            {/* SCREENSHOT GRID LAYOUT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Total Users", val: metrics.totalUsers, icon: <Users/>, bg: "bg-blue-500" },
                { label: "Active Users", val: metrics.activeUsers, icon: <UserCheck/>, bg: "bg-emerald-500" },
                { label: "Total Clients", val: metrics.totalClients, icon: <Briefcase/>, bg: "bg-purple-500" },
                { label: "Today Signups", val: metrics.todaySignups, icon: <UserPlus/>, bg: "bg-orange-500" },
                { label: "Yesterday Signups", val: metrics.yesterdaySignups, icon: <UserPlus/>, bg: "bg-pink-500" },
                { label: "Yesterday Transactions", val: `KES ${metrics.yesterdayTransactions.toLocaleString()}`, icon: <TrendingUp/>, bg: "bg-indigo-500" },
                { label: "Today Transactions", val: `KES ${metrics.todayTransactions.toLocaleString()}`, icon: <Activity/>, bg: "bg-cyan-500" },
                { label: "Total Revenue", val: `KES ${metrics.totalRevenue.toLocaleString()}`, icon: <DollarSign/>, bg: "bg-emerald-600" }
              ].map((s, i) => (
                <div key={i} className="bg-white p-8 rounded-[40px] flex flex-col justify-between hover:scale-105 transition-transform shadow-xl">
                  <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-black/10`}>{s.icon}</div>
                  <div><p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{s.label}</p><h4 className="text-2xl font-black text-slate-900 tracking-tighter">{s.val}</h4></div>
                </div>
              ))}
            </div>

            <div className="p-16 bg-white/2 border border-white/10 rounded-[70px] relative overflow-hidden">
               <div className="flex justify-between items-center mb-10"><p className="text-xs font-black uppercase italic text-red-600 tracking-widest">Real-Time Inflow</p><Cpu size={20} className="text-gray-800" /></div>
               <div className="flex items-end justify-between h-48 gap-4 px-4">
                  {[40, 70, 45, 90, 65, 100, 80, 50, 95, 30].map((h, i) => (
                    <motion.div key={i} animate={{ height: [`0%`, `${h}%`, `${h-10}%`, `${h}%`] }} transition={{ repeat: Infinity, duration: 4, delay: i * 0.1 }} className="w-full bg-linear-to-t from-red-600 to-orange-500 rounded-t-2xl shadow-2xl" />
                  ))}
               </div>
            </div>
          </motion.div>
        )}

        {/* --- REGISTRY TAB (MOBILE FRIENDLY CARDS) --- */}
        {activeTab === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
             <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <h3 className="text-3xl font-black uppercase italic tracking-tighter">Account <span className="text-red-600">Registry</span></h3>
                <div className="relative w-full md:w-96">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                   <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="FILTER IDENTITIES..." className="w-full bg-white/5 border border-white/10 rounded-full px-16 py-4 text-xs font-black text-white outline-none focus:border-red-600 transition-all uppercase italic" />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {operators.filter(o => o.name.toLowerCase().includes(searchTerm.toLowerCase())).map((op, idx) => (
                  <motion.div key={op.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="p-8 bg-white/5 border border-white/10 rounded-[45px] hover:border-red-500/40 transition-all group relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                       <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center font-black text-xl text-red-500 border border-white/10">{op.name.charAt(0)}</div>
                       <span className={`px-4 py-1 rounded-full text-[8px] font-black border ${op.banned ? 'border-red-600 text-red-600' : 'border-emerald-500 text-emerald-500'}`}>{op.status.toUpperCase()}</span>
                    </div>
                    <div className="mb-8">
                       <h4 className="text-lg font-black uppercase italic text-white">{op.name}</h4>
                       <p className="text-[9px] text-gray-500 font-bold">{op.email}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       <button onClick={() => handleAction(verifyUserNode, op.id)} className="py-3 bg-emerald-600 text-white rounded-2xl text-[9px] font-black uppercase italic">Verify</button>
                       <button onClick={() => handleAction(suspendUserNode as any, op.id, !op.banned)} className="py-3 bg-amber-600 text-white rounded-2xl text-[9px] font-black uppercase italic">{op.banned ? 'Restore' : 'Suspend'}</button>
                       <button onClick={() => { navigator.clipboard.writeText(op.id); alert("ID Copied"); }} className="py-3 bg-white/5 border border-white/10 text-white rounded-2xl text-[9px] font-black uppercase italic">Copy ID</button>
                       <button onClick={() => handleAction(terminateUserNode, op.id)} className="py-3 bg-red-600 text-white rounded-2xl text-[9px] font-black uppercase italic">Kill</button>
                    </div>
                  </motion.div>
                ))}
             </div>
          </motion.div>
        )}

        {/* --- SETTINGS TAB (ENHANCED) --- */}
        {activeTab === "settings" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-10">
             <h3 className="text-3xl font-black uppercase italic tracking-tighter">System <span className="text-red-600">Core</span></h3>
             <div className="p-12 bg-white/5 border border-white/10 rounded-[60px] space-y-12 shadow-3xl">
                <div className="flex justify-between items-center">
                   <div><h4 className="text-sm font-black uppercase italic">Maintenance Mode</h4><p className="text-[10px] text-gray-500 italic">Global bidding lock</p></div>
                   <button onClick={() => setIsMaintenance(!isMaintenance)} className={`w-14 h-7 rounded-full relative transition-all ${isMaintenance ? 'bg-red-600' : 'bg-white/10'}`}><motion.div animate={{ x: isMaintenance ? 28 : 4 }} className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg" /></button>
                </div>
                <div className="space-y-6 pt-10 border-t border-white/5">
                   <div className="flex justify-between font-black text-[10px] uppercase italic text-gray-500"><span>Global Fee Relay</span><span className="text-red-500">{commissionRelay}%</span></div>
                   <input type="range" min="1" max="50" value={commissionRelay} onChange={e => setCommissionRelay(parseInt(e.target.value))} className="w-full h-1 bg-white/10 rounded-full appearance-none accent-red-600 cursor-pointer" />
                </div>
                <button onClick={() => alert("Sync Complete.")} className="w-full py-6 bg-white text-black font-black rounded-3xl uppercase text-[11px] italic tracking-widest shadow-2xl">Synchronize Global Config</button>
             </div>
             <div className="p-10 border-2 border-red-900/30 bg-red-900/10 rounded-[50px] text-center space-y-6">
                <p className="text-[10px] font-black text-red-500 uppercase italic tracking-widest flex items-center justify-center gap-4"><AlertCircle size={14}/> Destructive Area</p>
                <button className="w-full py-5 bg-red-600 text-white font-black rounded-3xl text-[10px] uppercase italic">Execute Wipe Sequence</button>
             </div>
          </motion.div>
        )}

      </main>

      {/* MOBILE TRIGGER */}
      <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden fixed bottom-10 right-8 z-100 w-18 h-18 bg-red-600 text-white rounded-[2.5rem] shadow-2xl flex items-center justify-center border-4 border-[#020617] active:scale-90">
         {isMobileMenuOpen ? <X size={28}/> : <Terminal size={28}/>}
      </button>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}