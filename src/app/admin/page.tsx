"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, Users, DollarSign, Activity, Settings, 
  UserCheck, Search, Lock, Zap, Server, BarChart, 
  UserPlus, Briefcase, Cpu, Terminal, X, TrendingUp,
  AlertCircle, ArrowUpRight, Globe, ShieldCheck, 
  Clock, HardDrive, Fingerprint, MousePointer2
} from "lucide-react";

// --- 🛡️ INTERFACE DEFINITION ---
interface NexusNode {
  id: string;
  name: string;
  email: string;
  status: string;
  role: string;
  joined: string;
  lastLogin: string;
  paidBalance: number; // The KES 10 sync value
  gateway: string;
}

export default function AdminPage() {
  const [passInput, setPassInput] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [nodes, setNodes] = useState<NexusNode[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  // --- 📉 LIVE REVENUE & METRIC ENGINE ---
  const metrics = useMemo(() => {
    // Aggregating all paidBalance values from the Clerk Metadata
    const totalRevenue = nodes.reduce((sum, node) => sum + (node.paidBalance || 0), 0);
    const verifiedNodes = nodes.filter(n => n.status === "Verified");
    const clientNodes = nodes.filter(n => n.role === "client");
    
    // Today's specific metrics
    const startOfToday = new Date().setHours(0, 0, 0, 0);
    const todayNodes = nodes.filter(n => new Date(n.joined).getTime() >= startOfToday);
    const todayRevenue = todayNodes.reduce((sum, n) => sum + (n.paidBalance || 0), 0);

    return {
      totalRevenue,
      todayRevenue,
      nodeCount: nodes.length,
      verifiedCount: verifiedNodes.length,
      clientCount: clientNodes.length,
      todayCount: todayNodes.length
    };
  }, [nodes]);

  // --- 🛰️ DATA UPLINK FETCH ---
  const syncRegistry = useCallback(async () => {
    if (!isAuthorized) return;
    setIsFetching(true);
    try {
      // Calling our internal registry API
      const response = await fetch("/api/admin/fetch-nodes");
      const data = await response.json();
      if (data.success) {
        setNodes(data.users);
      }
    } catch (error) {
      console.error("Registry Sync Failed", error);
    } finally {
      setIsFetching(false);
    }
  }, [isAuthorized]);

  useEffect(() => {
    if (sessionStorage.getItem("nexus_admin_session") === "true") {
      setIsAuthorized(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      syncRegistry();
      const heartbeat = setInterval(syncRegistry, 15000); // Auto-refresh every 15s
      return () => clearInterval(heartbeat);
    }
  }, [isAuthorized, syncRegistry]);

  // --- 🔐 GATEWAY ACCESS ---
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passInput === "Nexus123!") {
      sessionStorage.setItem("nexus_admin_session", "true");
      setIsAuthorized(true);
    } else {
      alert("HANDSHAKE DENIED: Invalid Protocol Key");
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotateX: 20 }} 
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          className="w-full max-w-md bg-black border-2 border-red-500/20 p-16 rounded-[70px] text-center shadow-[0_0_150px_rgba(239,68,68,0.1)] relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-red-600 to-transparent" />
          <Lock size={60} className="mx-auto mb-10 text-red-600 drop-shadow-[0_0_20px_rgba(220,38,38,0.5)]" />
          <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter mb-4">NEXUS <span className="text-red-600">HQ</span></h1>
          <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.5em] mb-12">Authorized Personnel Only</p>
          <form onSubmit={handleAuth} className="space-y-8">
            <input 
              type="password" 
              value={passInput} 
              onChange={(e) => setPassInput(e.target.value)} 
              placeholder="ENTER PROTOCOL KEY" 
              className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white text-center font-black outline-none focus:border-red-600 transition-all tracking-[0.6em] shadow-inner" 
            />
            <button className="w-full py-6 bg-red-600 text-white font-black rounded-3xl uppercase text-[12px] italic tracking-widest hover:bg-red-700 transition-all shadow-2xl">Initialize Command</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#020617] text-white font-sans selection:bg-red-600/30">
      
      {/* --- 📟 SIDE NAVIGATION --- */}
      <aside className="fixed inset-y-0 left-0 w-80 bg-black border-r border-white/5 hidden lg:flex flex-col">
        <div className="p-12 border-b border-white/5 mb-10 flex items-center gap-4">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)]"><Shield size={22}/></div>
            <h2 className="font-black italic text-2xl uppercase tracking-tighter leading-none">Nexus<span className="text-red-600">HQ</span></h2>
        </div>
        <nav className="px-8 space-y-4 flex-1">
          {[
            { id: "dashboard", label: "System Pulse", icon: <Activity size={20}/> },
            { id: "nodes", label: "Node Registry", icon: <Users size={20}/> },
            { id: "revenue", label: "Vault Revenue", icon: <DollarSign size={20}/> },
            { id: "config", label: "Core Config", icon: <Settings size={20}/> }
          ].map(m => (
            <button 
              key={m.id} 
              onClick={() => setActiveTab(m.id)} 
              className={`w-full flex items-center gap-6 px-8 py-6 rounded-[30px] transition-all relative group ${activeTab === m.id ? 'bg-red-600 text-white shadow-2xl shadow-red-600/20' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}
            >
              {m.icon} <span className="text-[11px] font-black uppercase tracking-[0.2em]">{m.label}</span>
              {activeTab === m.id && <motion.div layoutId="sidebarNav" className="absolute left-0 w-1.5 h-10 bg-white rounded-r-full" />}
            </button>
          ))}
        </nav>
        <div className="p-12 border-t border-white/5 opacity-30">
            <p className="text-[8px] font-black uppercase tracking-widest italic leading-loose">Secure Terminal v4.0.2<br/>All Uplinks Encrypted</p>
        </div>
      </aside>

      {/* --- 🖥️ MAIN COMMAND AREA --- */}
      <main className="flex-1 lg:pl-80 p-6 md:p-20 pt-28 lg:pt-20">
        
        {/* --- DASHBOARD VIEW --- */}
        {activeTab === "dashboard" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
            <div className="flex justify-between items-end">
              <h3 className="text-5xl font-black uppercase italic tracking-tighter leading-none text-white">System <span className="text-red-600">Pulse</span></h3>
              <div className="flex items-center gap-4 bg-white/3 px-6 py-3 rounded-2xl border border-white/5">
                 <div className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
                 <span className="text-[10px] font-black uppercase tracking-widest italic">Live Stream Active</span>
              </div>
            </div>

            {/* REVENUE MATRIX CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
              <div className="bg-white p-10 rounded-[50px] shadow-3xl hover:scale-[1.03] transition-transform group">
                <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl group-hover:rotate-6 transition-transform"><DollarSign size={28}/></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Total Verified Revenue</p>
                <h4 className="text-4xl font-black text-slate-950 tracking-tighter">KES {metrics.totalRevenue.toLocaleString()}.00</h4>
              </div>
              <div className="bg-white p-10 rounded-[50px] shadow-3xl hover:scale-[1.03] transition-transform group">
                <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl group-hover:rotate-6 transition-transform"><Users size={28}/></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Active Node Registry</p>
                <h4 className="text-4xl font-black text-slate-950 tracking-tighter">{metrics.nodeCount} <span className="text-sm opacity-30">Nodes</span></h4>
              </div>
              <div className="bg-[#0a0f1e] border-2 border-white/10 p-10 rounded-[50px] shadow-3xl hover:scale-[1.03] transition-transform group">
                <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl group-hover:rotate-6 transition-transform"><TrendingUp size={28}/></div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Today's Inflow</p>
                <h4 className="text-4xl font-black text-white tracking-tighter">KES {metrics.todayRevenue.toLocaleString()}</h4>
              </div>
              <div className="bg-[#0a0f1e] border-2 border-white/10 p-10 rounded-[50px] shadow-3xl hover:scale-[1.03] transition-transform group">
                <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl group-hover:rotate-6 transition-transform"><ShieldCheck size={28}/></div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">Authenticated Nodes</p>
                <h4 className="text-4xl font-black text-white tracking-tighter">{metrics.verifiedCount} <span className="text-sm opacity-30">Elite</span></h4>
              </div>
            </div>

            {/* FLOW MONITOR GRAPH */}
            <div className="p-20 bg-white/2 border border-white/10 rounded-[80px] relative overflow-hidden group">
               <div className="absolute inset-0 bg-linear-to-br from-red-600/5 to-transparent pointer-events-none" />
               <div className="flex justify-between items-center mb-16 relative z-10">
                  <div>
                    <h4 className="text-xl font-black uppercase italic tracking-widest text-red-600">Global Data Stream</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-2">Real-time revenue synchronization across all nodes</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10"><Clock size={16}/></div>
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10"><HardDrive size={16}/></div>
                  </div>
               </div>
               <div className="flex items-end justify-between h-64 gap-5 relative z-10">
                  {[30, 70, 45, 95, 60, 100, 80, 55, 90, 40, 85, 65, 95, 50, 75].map((h, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 1.5, delay: i * 0.05, ease: "easeOut" }}
                      className="w-full bg-linear-to-t from-red-600/80 to-orange-500 rounded-t-3xl shadow-[0_0_30px_rgba(220,38,38,0.2)] group-hover:from-red-600 group-hover:to-orange-400 transition-all cursor-pointer relative"
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-black text-white">{h}</div>
                    </motion.div>
                  ))}
               </div>
            </div>
          </motion.div>
        )}

        {/* --- NODE REGISTRY VIEW --- */}
        {activeTab === "nodes" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
             <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                <h3 className="text-5xl font-black uppercase italic tracking-tighter leading-none">Node <span className="text-red-600">Registry</span></h3>
                <div className="relative w-full md:w-112.5 group">
                   <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-600 transition-colors" size={20} />
                   <input 
                      value={searchTerm} 
                      onChange={e => setSearchTerm(e.target.value)} 
                      placeholder="FILTER NODE IDENTITIES..." 
                      className="w-full bg-white/5 border-2 border-white/10 rounded-full px-20 py-6 text-xs font-black text-white outline-none focus:border-red-600 transition-all uppercase italic tracking-widest shadow-2xl" 
                   />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {nodes.filter(n => n.name.toLowerCase().includes(searchTerm.toLowerCase()) || n.email.toLowerCase().includes(searchTerm.toLowerCase())).map((node, idx) => (
                  <motion.div 
                    key={node.id} 
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: idx * 0.05 }}
                    className="p-10 bg-white/3 border-2 border-white/5 rounded-[60px] hover:border-red-600/40 transition-all group relative overflow-hidden shadow-3xl"
                  >
                    <div className="flex justify-between items-start mb-10">
                       <div className="w-16 h-16 rounded-[25px] bg-white/5 flex items-center justify-center font-black text-2xl text-red-600 border border-white/10 shadow-2xl group-hover:scale-110 transition-transform">{node.name.charAt(0)}</div>
                       <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border-2 shadow-xl ${node.status === 'Verified' ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/5' : 'border-red-600/50 text-red-600 bg-red-600/5'}`}>{node.status}</span>
                    </div>
                    <div className="space-y-2 mb-10">
                       <h4 className="text-xl font-black uppercase italic text-white leading-none">{node.name}</h4>
                       <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{node.email}</p>
                    </div>
                    <div className="p-6 bg-black/40 rounded-3xl border border-white/5 mb-10 flex justify-between items-center">
                       <div>
                          <p className="text-[8px] font-black text-gray-600 uppercase mb-1">REV_SYNC</p>
                          <p className="text-lg font-black text-[#00f2ff] italic leading-none">KES {node.paidBalance || 0}.00</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[8px] font-black text-gray-600 uppercase mb-1">UPLINK_DATE</p>
                          <p className="text-[9px] font-black text-white uppercase italic leading-none">{node.joined}</p>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <button className="py-4 bg-emerald-600 text-white rounded-2xl text-[9px] font-black uppercase italic hover:bg-emerald-700 transition-colors shadow-xl">Verify</button>
                       <button className="py-4 bg-red-600 text-white rounded-2xl text-[9px] font-black uppercase italic hover:bg-red-700 transition-colors shadow-xl">Suspend</button>
                    </div>
                  </motion.div>
                ))}
             </div>
          </motion.div>
        )}

        {/* --- SETTINGS VIEW --- */}
        {activeTab === "config" && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl space-y-12">
              <h3 className="text-4xl font-black uppercase italic tracking-tighter leading-none text-white">Core <span className="text-red-600">Config</span></h3>
              <div className="p-16 bg-white/3 border-2 border-white/10 rounded-[80px] space-y-16 shadow-3xl relative overflow-hidden">
                 <div className="flex justify-between items-center">
                    <div className="space-y-2">
                       <h4 className="text-xl font-black uppercase italic text-white leading-none">Maintenance Protocol</h4>
                       <p className="text-[10px] text-gray-500 font-bold uppercase italic tracking-widest">Toggle global mission bidding lock</p>
                    </div>
                    <div className="w-16 h-8 bg-white/5 rounded-full p-1 relative border border-white/10 cursor-pointer">
                       <motion.div className="w-6 h-6 bg-red-600 rounded-full shadow-[0_0_15px_red]" animate={{ x: 0 }} />
                    </div>
                 </div>
                 <div className="space-y-10 pt-16 border-t border-white/5">
                    <div className="flex justify-between font-black text-[12px] uppercase italic text-gray-500 tracking-[0.5em]">
                       <span>Global Fee Matrix</span>
                       <span className="text-red-600">15.0%</span>
                    </div>
                    <input type="range" className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-red-600 cursor-pointer outline-none shadow-inner" />
                 </div>
                 <button className="w-full py-8 bg-white text-black font-black rounded-4xl uppercase text-[12px] italic tracking-[0.3em] shadow-2xl hover:bg-red-600 hover:text-white transition-all active:scale-95">Synchronize Global Config</button>
              </div>
              <div className="p-10 border-2 border-red-900/30 bg-red-900/10 rounded-[50px] text-center space-y-8 shadow-xl">
                 <p className="text-[10px] font-black text-red-500 uppercase italic tracking-[0.5em] flex items-center justify-center gap-4 animate-pulse"><AlertCircle size={16}/> Destructive Zone</p>
                 <button className="w-full py-6 bg-red-600 text-white font-black rounded-3xl text-[11px] uppercase italic tracking-[0.2em] shadow-2xl">Execute Global Wipe Sequence</button>
              </div>
           </motion.div>
        )}

      </main>

      {/* --- 📱 MOBILE TRIGGER --- */}
      <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden fixed bottom-12 right-10 z-200 w-20 h-20 bg-red-600 text-white rounded-[2.5rem] shadow-[0_0_50px_rgba(220,38,38,0.5)] flex items-center justify-center border-4 border-[#020617] active:scale-90 transition-transform">
         {isMobileMenuOpen ? <X size={32}/> : <Terminal size={32}/>}
      </button>

      {/* --- MOBILE NAV OVERLAY --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-190 bg-black/95 backdrop-blur-2xl lg:hidden flex flex-col items-center justify-center gap-8 p-10 text-center">
             {[{ id: "dashboard", label: "Pulse" }, { id: "nodes", label: "Registry" }, { id: "revenue", label: "Vault" }, { id: "config", label: "Core" }].map(m => (
               <button key={m.id} onClick={() => { setActiveTab(m.id); setIsMobileMenuOpen(false); }} className="text-4xl font-black italic uppercase tracking-tighter text-white hover:text-red-600 transition-colors">{m.label}</button>
             ))}
             <button onClick={() => setIsMobileMenuOpen(false)} className="mt-10 p-6 bg-white/5 rounded-full text-gray-500"><X size={32}/></button>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .shadow-glow { box-shadow: 0 0 20px rgba(220, 38, 38, 0.3); }
      `}</style>
    </div>
  );
}